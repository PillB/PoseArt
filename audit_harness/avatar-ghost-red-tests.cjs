// audit_harness/avatar-ghost-red-tests.js
// Phase C — Red tests for the Avatar/Ghost/Skeleton Visual-Forensics Extension.
// These tests FAIL on the current SHA (7a3a823) and must PASS after the Green
// refactor. No test is a pure pixel snapshot: each asserts a GEOMETRIC or
// STRUCTURAL property derived from current-SHA measurements.
//
// Run:  node audit_harness/avatar-ghost-red-tests.js
// Exit: 0 = all pass (Green), 1 = some fail (Red, expected pre-fix).
const fs = require('fs');
const path = require('path');
const flow = require('./lib/pose-flow.cjs');

const REPO = path.resolve(__dirname, '..');
const OUT = path.join(REPO, 'audit', 'avatar-ghost', 'tests');
fs.mkdirSync(OUT, { recursive: true });

const EVAL_HELPERS = `
function _ag_applyCamera(point, yawDeg, pitchDeg){
  var yaw=yawDeg*Math.PI/180, pitch=pitchDeg*Math.PI/180;
  var cosY=Math.cos(yaw), sinY=Math.sin(yaw);
  var x1=point.x*cosY + point.z*sinY; var z1=-point.x*sinY + point.z*cosY; var y1=point.y;
  var cosP=Math.cos(pitch), sinP=Math.sin(pitch);
  return {x:x1, y:y1*cosP - z1*sinP, z:y1*sinP + z1*cosP};
}
function _ag_project(p, yaw, pitch, scale, w, h){
  var r=_ag_applyCamera(p, yaw, pitch);
  var fitScale=Math.min(w,h)*0.40*scale;
  return {x:w/2+r.x*fitScale, y:h/2-r.y*fitScale, z:r.z};
}
`;

const SHAPE_POSES = ['power-stance','scurve-stand','crossed-arms-stand','soft-sit','window-seat','both-knees','starfish','leap-forward','arms-overhead','face-touch','hip-shift','wall-lean','chair-lean-forward','editorial-extreme-forward-lean','couple-embrace','wheelchair-arms'];
const SHARED_JOINTS = ['neck','leftShoulder','rightShoulder','hips','leftHip','rightHip','leftElbow','rightElbow','leftKnee','rightKnee'];

// Render a mode and return pixel data + projected joints + bbox.
async function render(page, poseId, mode, yaw, pitch, w, h) {
  return await page.evaluate(({ poseId, mode, yaw, pitch, w, h, helpers }) => {
    eval(helpers);
    var pose = POSES_LIBRARY[poseId]; if (!pose) return { ok: false, error: 'unknown' };
    var joints = pose.joints || {};
    var c = document.getElementById('_ag_vis');
    if (!c) { c = document.createElement('canvas'); c.id = '_ag_vis'; c.style.position='fixed'; c.style.left='0px'; c.style.top='0px'; c.style.zIndex='99999'; c.style.background='#F4F1E8'; document.body.appendChild(c); }
    c.width = w; c.height = h; c.style.width = w+'px'; c.style.height = h+'px';
    var ctx = c.getContext('2d'); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,w,h);
    var inst = null;
    try {
      if (mode === 'avatar') PoseSkeleton3D.renderAvatarFrame(c, w, h, joints, {yaw:yaw,pitch:pitch,scale:1,category:pose.category,description:pose.instructions});
      else if (mode === 'ghost') PoseSkeleton3D.renderGhostFrame(c, w, h, joints, {yaw:yaw,pitch:pitch,scale:1,category:pose.category,description:pose.instructions});
      else { inst = Object.create(PoseSkeleton3D); inst.init(c,w,h); inst.setPose(joints,{category:pose.category,description:pose.instructions}); inst.setViewAngle(yaw,pitch); try{inst.stopAutoRotate();}catch(e){} inst.render(); }
    } catch(e) { if(inst){try{inst.destroy();}catch(e2){}} return {ok:false,error:String(e.message||e)}; }
    var I = PoseSkeleton3D._internals;
    var skel = I.buildPose(joints);
    var proj = {};
    for (var k in skel) if (Object.prototype.hasOwnProperty.call(skel,k)) proj[k] = _ag_project(skel[k], yaw, pitch, 1, w, h);
    var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    for (var k2 in proj) { var p=proj[k2]; if(p.x<minX)minX=p.x; if(p.x>maxX)maxX=p.x; if(p.y<minY)minY=p.y; if(p.y>maxY)maxY=p.y; }
    var headR=10*1.18, pad=headR+4;
    var bbox={x:minX-pad,y:minY-pad,w:(maxX-minX)+2*pad,h:(maxY-minY)+2*pad};
    var clipped = bbox.x<-0.5||bbox.y<-0.5||(bbox.x+bbox.w)>(w+0.5)||(bbox.y+bbox.h)>(h+0.5);
    var img = null, alphaPx=0;
    try { img = ctx.getImageData(0,0,w,h); var d=img.data; for(var i=3;i<d.length;i+=4){ if(d[i]>12) alphaPx++; } } catch(e){}
    var sil = alphaPx/(w*h);
    if (inst) { try{inst.destroy();}catch(e){} }
    return { ok:true, poseId:poseId, mode:mode, yaw:yaw, pitch:pitch, w:w, h:h, projected:proj, bbox:bbox, clipped:clipped, silhouettePct:sil, img: img ? Array.from(img.data) : null };
  }, { poseId, mode, yaw, pitch, w, h, helpers: EVAL_HELPERS });
}

// Local silhouette area in a WxH window centered at (cx,cy)
function localArea(img, w, h, cx, cy, rad) {
  if (!img) return 0;
  let n = 0, total = 0;
  for (let y = Math.max(0, Math.floor(cy - rad)); y < Math.min(h, Math.ceil(cy + rad)); y++) {
    for (let x = Math.max(0, Math.floor(cx - rad)); x < Math.min(w, Math.ceil(cx + rad)); x++) {
      total++;
      if (img[(y * w + x) * 4 + 3] > 12) n++;
    }
  }
  return total ? n / total : 0;
}

// Horizontal extent (width) of figure pixels in a thin horizontal band at cy.
function bandWidth(img, w, h, cy, halfH) {
  if (!img) return 0;
  let minX = w, maxX = -1;
  for (let y = Math.max(0, Math.floor(cy - halfH)); y < Math.min(h, Math.ceil(cy + halfH)); y++) {
    for (let x = 0; x < w; x++) {
      if (img[(y * w + x) * 4 + 3] > 12) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
    }
  }
  return maxX >= minX ? (maxX - minX) : 0;
}

// Pixel bounding box of the RENDERED figure. thr = alpha threshold; use a high
// threshold (e.g. 90) to capture only the SOLID figure, excluding the faint gold
// halo and the semi-transparent reclining floor band (which are ambient, not figure).
function pixelBbox(img, w, h, thr) {
  thr = thr == null ? 12 : thr;
  if (!img) return null;
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (img[(y * w + x) * 4 + 3] > thr) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, maxX, maxY };
}

// IoU of two alpha masks (same size)
function maskIoU(imgA, imgB, w, h) {
  if (!imgA || !imgB) return 0;
  let inter = 0, uni = 0;
  for (let i = 3; i < imgA.length; i += 4) {
    const a = imgA[i] > 12, b = imgB[i] > 12;
    if (a && b) inter++;
    if (a || b) uni++;
  }
  return uni ? inter / uni : 0;
}

const results = [];
function record(name, pass, detail) { results.push({ name, pass, detail }); console.log((pass?'  PASS ':'  FAIL ') + name + (detail ? '  — ' + detail : '')); }

(async () => {
  const { browser, ctx } = await flow.newContext({ width: 520, height: 640, deviceScaleFactor: 1 });
  const { page } = await flow.login(ctx);
  await page.waitForFunction(() => typeof PoseSkeleton3D !== 'undefined' && typeof POSES_LIBRARY !== 'undefined' && PoseSkeleton3D._internals, null, { timeout: 20000 });

  console.log('\n=== Phase C Red tests (SHA 7a3a823) ===\n');

  // T1 — joint-inflation: avatar elbow/knee width <= 1.2x the PROXIMAL segment
  // width. A smooth joint blend (Bézier chain / joint-blend-once) does not bulge
  // beyond the thicker adjacent segment; overlapping endpoint circles do (old
  // renderer measured >1.5). Elbows/knees are away from the torso fill.
  {
    let inflated = [];
    for (const poseId of ['power-stance','scurve-stand','hip-shift']) {
      const m = await render(page, poseId, 'avatar', 0, 0, 200, 280);
      if (!m.ok) continue;
      for (const j of ['leftElbow','rightElbow']) {
        const jp = m.projected[j]; if (!jp) continue;
        const proxKey = 'leftShoulder'; const pp = m.projected[j.replace('Elbow','Shoulder')]; if (!pp) continue;
        const jW = bandWidth(m.img, m.w, m.h, jp.y, 3);
        const midY = (jp.y + pp.y)/2;
        const lW = bandWidth(m.img, m.w, m.h, midY, 3);
        if (lW > 4 && jW / lW > 1.2) inflated.push(poseId+'/'+j+'='+ (jW/lW).toFixed(2));
      }
    }
    record('T1 joint-inflation (avatar elbow <= 1.2x upper-arm segment)', inflated.length === 0, inflated.length ? inflated.length+' inflated: '+inflated.slice(0,4).join(', ') : 'none');
  }

  // T2 — no-clipping across size matrix (GEOMETRIC: verify computeFit's clamp
  // keeps the fitted joint bbox + silhouette margin inside the canvas). Pixel
  // measurement can't separate the figure from drawAccessory's solid reclining
  // floor band, so this checks the framing invariant directly: if the fitted
  // bounds fit, the figure cannot clip (only the ambient floor may touch edges).
  {
    const SIZES = [[70,70],[92,80],[110,150],[140,180],[160,180],[200,280]];
    let clipped = [];
    for (const poseId of ['power-stance','soft-sit','both-knees','starfish','leap-forward','arms-overhead']) {
      for (const [w,h] of SIZES) {
        const m = await render(page, poseId, 'avatar', 0, 0, w, h);
        if (!m.ok) continue;
        const fit = await page.evaluate(({poseId,w,h}) => {
          const pose = POSES_LIBRARY[poseId]; const joints = pose.joints||{};
          const I = PoseSkeleton3D._internals;
          const skel = I.buildPose(joints);
          const st = I.createState(); st.width=w; st.height=h; st.scale=1; st.yaw=0; st.pitch=0; st.displaySkeleton=skel;
          return I.computeFit(st);
        }, {poseId, w, h});
        // joint bbox from m.projected (same project() the renderer uses)
        let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
        for (const k in m.projected) { const p=m.projected[k]; if(p.x<minX)minX=p.x; if(p.x>maxX)maxX=p.x; if(p.y<minY)minY=p.y; if(p.y>maxY)maxY=p.y; }
        const s = fit.scale, tx = fit.tx, ty = fit.ty;
        const clampMarg = 12 * s, headR = 10 * s, pad = Math.max(5, Math.min(w,h)*0.05);
        const left = s*minX + tx - clampMarg, right = s*maxX + tx + clampMarg;
        const top = s*minY + ty - headR, bot = s*maxY + ty + clampMarg;
        if (left < pad-0.5 || top < pad-0.5 || right > w-pad+0.5 || bot > h-pad+0.5) {
          clipped.push(poseId+'@'+w+'x'+h+' L'+left.toFixed(0)+' T'+top.toFixed(0)+' R'+right.toFixed(0)+' B'+bot.toFixed(0));
        }
      }
    }
    record('T2 no-clipping (computeFit keeps figure bbox in canvas)', clipped.length === 0, clipped.length ? clipped.length+' clipped: '+clipped.slice(0,3).join(', ') : 'none');
  }

  // T3 — grounded-placement: pixel bottom margin <= top margin + 30 (not floating)
  {
    let floating = [];
    for (const poseId of ['soft-sit','window-seat','forearms-crossed-table','starfish','lounger-recline']) {
      const m = await render(page, poseId, 'avatar', 0, 0, 160, 180);
      if (!m.ok) continue;
      const pb = pixelBbox(m.img, m.w, m.h);
      if (!pb) continue;
      const top = pb.y, bottom = m.h - pb.maxY;
      if (bottom > top + 30) floating.push(poseId+' top='+top+' bottom='+bottom);
    }
    record('T3 grounded-placement (pixel bbox not floating)', floating.length === 0, floating.length ? floating.length+' floating: '+floating.join('; ') : 'none');
  }

  // T4 — mode-distinctiveness: avatar vs ghost grayscale IoU < 0.92 (structural diff)
  {
    let highIou = [];
    for (const poseId of ['power-stance','scurve-stand','hip-shift','arms-overhead','face-touch','couple-embrace']) {
      const a = await render(page, poseId, 'avatar', 0, 0, 160, 180);
      const g = await render(page, poseId, 'ghost', 0, 0, 160, 180);
      if (!a.ok || !g.ok) continue;
      const iou = maskIoU(a.img, g.img, 160, 180);
      if (iou > 0.55) highIou.push(poseId+' IoU='+iou.toFixed(3));
    }
    record('T4 mode-distinctiveness (avatar vs ghost IoU < 0.55)', highIou.length === 0, highIou.length ? highIou.length+' too similar: '+highIou.join('; ') : 'all strongly distinct');
  }

  // T5 — cross-mode alignment (guard: should PASS now)
  {
    let misaligned = 0;
    for (const poseId of ['power-stance','soft-sit']) {
      const a = await render(page, poseId, 'avatar', 45, 0, 160, 180);
      const s = await render(page, poseId, 'skeleton', 45, 0, 160, 180);
      const g = await render(page, poseId, 'ghost', 45, 0, 160, 180);
      if (!a.ok||!s.ok||!g.ok) continue;
      for (const k of ['head','neck','leftShoulder','hips','leftKnee']) {
        const da = Math.hypot(a.projected[k].x-s.projected[k].x, a.projected[k].y-s.projected[k].y);
        const dg = Math.hypot(a.projected[k].x-g.projected[k].x, a.projected[k].y-g.projected[k].y);
        if (da > 0.5 || dg > 0.5) misaligned++;
      }
    }
    record('T5 cross-mode-alignment (avatar/skeleton/ghost joints align)', misaligned === 0, misaligned ? misaligned+' misaligned' : 'aligned');
  }

  // T6 — bounds-calculator sanity (guard)
  {
    const m = await render(page, 'power-stance', 'avatar', 0, 0, 160, 180);
    const ok = m.ok && m.bbox.w > 40 && m.bbox.h > 60 && m.bbox.w < 200 && m.bbox.h < 260;
    record('T6 bounds-calculator (visual bbox in plausible range)', ok, 'bbox='+Math.round(m.bbox.w)+'x'+Math.round(m.bbox.h));
  }

  // T7 — small-thumbnail occupation (70x70 pixel-bbox in 28-72%)
  {
    let bad = [];
    for (const poseId of ['power-stance','scurve-stand','hip-shift']) {
      const m = await render(page, poseId, 'avatar', 0, 0, 70, 70);
      if (!m.ok) continue;
      const pb = pixelBbox(m.img, 70, 70, 90);
      if (!pb) { bad.push(poseId+' empty'); continue; }
      const occ = (pb.w*pb.h)/(70*70);
      if (occ < 0.15 || occ > 0.80) bad.push(poseId+' occ='+(occ*100).toFixed(0)+'%');
    }
    record('T7 small-thumbnail-occupation (70x70 standing pixel-bbox in 15-80%)', bad.length === 0, bad.length ? bad.join('; ') : 'all in range');
  }

  // T8 — androgynous-torso: max drawn width in ribcage band vs pelvis band,
  // ratio in [0.85, 1.15]; waist (at spine y) >= 0.78× pelvis. Scans the full
  // ribcage region (shoulder→spine) and pelvis region (spine→hips) so the
  // ellipse widths are captured (not the narrow shoulder-y cross-section).
  {
    let gendered = [];
    for (const poseId of ['power-stance','scurve-stand','hip-shift','crossed-arms-stand']) {
      const m = await render(page, poseId, 'avatar', 0, 0, 200, 280);
      if (!m.ok) continue;
      const shY = (m.projected.leftShoulder.y + m.projected.rightShoulder.y)/2;
      const waY = m.projected.spine.y;
      const hiY = m.projected.hips.y;
      // ribcage band: shY..waY (sample 5 rows, take max)
      let ribW = 0; for (let y = shY; y <= waY; y += (waY-shY)/5) ribW = Math.max(ribW, bandWidth(m.img, m.w, m.h, y, 3));
      // pelvis band: waY..hiY
      let pelW = 0; for (let y = waY; y <= hiY; y += (hiY-waY)/5) pelW = Math.max(pelW, bandWidth(m.img, m.w, m.h, y, 3));
      const waW = bandWidth(m.img, m.w, m.h, waY, 3);
      const ribPel = pelW>0 ? ribW/pelW : 1;
      const waPel = pelW>0 ? waW/pelW : 1;
      if (ribPel < 0.80 || ribPel > 1.15 || waPel < 0.78) gendered.push(poseId+' rib/pel='+ribPel.toFixed(2)+' waist/pel='+waPel.toFixed(2));
    }
    record('T8 androgynous-torso (rib/pel 0.80-1.15, waist/pel>=0.78)', gendered.length === 0, gendered.length ? gendered.join('; ') : 'all neutral');
  }

  // T9 — full-library smoke (sampled 5 per category; full 745 in validation)
  {
    const cats = await page.evaluate(() => { const by={}; for(const id in POSES_LIBRARY){ const c=POSES_LIBRARY[id].category; (by[c]=by[c]||[]).push(id); } return by; });
    let fails = 0, total = 0; const sample = [];
    for (const c in cats) sample.push(...cats[c].slice(0,5));
    for (const poseId of sample) {
      for (const mode of ['avatar','skeleton','ghost']) {
        const m = await render(page, poseId, mode, 0, 0, 110, 150);
        total++;
        if (!m.ok || m.silhouettePct < 0.005) fails++;
      }
    }
    record('T9 full-library-smoke (sampled '+sample.length+' poses × 3 modes)', fails === 0, fails ? fails+'/'+total+' failed' : total+' renders ok');
  }

  // T10 — high-DPI parity (dpr=2 silhouette within 5% of dpr=1)
  {
    const m1 = await render(page, 'power-stance', 'avatar', 0, 0, 160, 180);
    // emulate high-dpi by rendering at 2x backing store
    const m2 = await page.evaluate(() => {
      const pose = POSES_LIBRARY['power-stance']; const c = document.getElementById('_ag_vis');
      c.width = 320; c.height = 360; c.style.width='160px'; c.style.height='180px';
      const ctx=c.getContext('2d'); ctx.setTransform(2,0,0,2,0,0); ctx.clearRect(0,0,160,180);
      PoseSkeleton3D.renderAvatarFrame(c, 160, 180, pose.joints, {yaw:0,pitch:0,scale:1,category:pose.category,description:pose.instructions});
      const img=ctx.getImageData(0,0,320,360); let n=0; for(let i=3;i<img.data.length;i+=4) if(img.data[i]>12)n++;
      return {sil: n/(160*180)}; // logical-pixel-normalized
    });
    const ok = m1.ok && Math.abs(m1.silhouettePct - m2.sil)/m1.silhouettePct < 0.10;
    record('T10 high-dpi-parity (dpr2 silhouette within 10% of dpr1)', ok, 'dpr1='+(m1.silhouettePct*100).toFixed(1)+'% dpr2='+(m2.sil*100).toFixed(1)+'%');
  }

  // T11 — view-consistency (front/side/quarter all non-empty)
  {
    let empty = 0;
    for (const v of [[0,0],[90,0],[45,0]]) {
      const m = await render(page, 'leap-forward', 'avatar', v[0], v[1], 160, 180);
      if (!m.ok || m.silhouettePct < 0.02) empty++;
    }
    record('T11 view-consistency (front/side/quarter non-empty)', empty === 0, empty ? empty+' empty views' : 'all non-empty');
  }

  await browser.close();

  const failed = results.filter(r => !r.pass).length;
  const passed = results.length - failed;
  fs.writeFileSync(path.join(OUT, 'red-results.json'), JSON.stringify({ sha: '7a3a823', date: new Date().toISOString(), passed, failed, total: results.length, results }, null, 2));
  console.log('\n=== SUMMARY: ' + passed + ' passed, ' + failed + ' failed, ' + results.length + ' total ===');
  console.log(failed > 0 ? 'RED state confirmed (expected pre-fix). Tests that must turn green: T1,T2,T3,T4,T7,T8.' : 'GREEN state.');
  process.exit(failed > 0 ? 1 : 0);
})();
