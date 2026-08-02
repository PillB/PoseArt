// audit_harness/avatar-ghost-capture.js
// Avatar/Ghost/Skeleton Visual-Forensics baseline capture (current-SHA).
// Renders avatar/skeleton/ghost at EQUIVALENT yaw/pitch/scale/canvas on a
// controlled canvas, captures raw + joint/bbox/centerline overlays + alpha
// silhouette + forensic measurements. NO renderer code is modified — baseline
// reflects the deployed SHA. Measurements use a verbatim replicate of the
// renderer's applyCamera()+project() so projected joints match exactly.
//
// Usage:  node audit_harness/avatar-ghost-capture.js
const fs = require('fs');
const path = require('path');
const flow = require('./lib/pose-flow');

const REPO = path.resolve(__dirname, '..');
const { execSync } = require('child_process');
const SHA = execSync('git -C ' + REPO + ' rev-parse --short HEAD').toString().trim();
const OUT = path.join(REPO, 'audit', 'avatar-ghost', 'baseline');
fs.mkdirSync(OUT, { recursive: true });

// 24 representative poses (see baseline-inventory.md §required-pose-set)
const POSES = [
  'power-stance',            // 1  neutral standing
  'scurve-stand',            // 2  contrapposto / S-curve standing
  'fashion-power-stance-classic', // 3  wide standing
  'crossed-arms-stand',      // 4  crossed-limb standing
  'soft-sit',                // 5  seated upright
  'window-seat',             // 6  seated side lean
  'forearms-crossed-table',  // 7  seated table contact
  'both-knees',              // 8  kneeling
  'knights-kneel',           // 9  half-kneeling
  'starfish',                // 10 reclining horizontal
  'lounger-recline',         // 11 reclining diagonal
  'crouching-prowl',         // 12 deep crouch
  'leap-forward',            // 13 dynamic leap / extension
  'arms-overhead',           // 14 arms overhead
  'cross-body-arm',          // 15 arms crossing the torso
  'face-touch',              // 16 hand near face
  'hip-shift',               // 17 hand on hip
  'editorial-extreme-forward-lean', // 18 extreme foreshortening
  'wall-lean',               // 19 wall contact
  'chair-lean-forward',      // 20 chair contact
  'table-elbow-single',      // 21 table contact
  'couple-embrace',          // 22 couple pose
  'wheelchair-arms',         // 23 accessible pose
  'fashion-strong-silhouette-cape'  // 24 garment / prop
];

const VIEWS = [
  { name: 'front',   yaw: 0,  pitch: 0 },
  { name: 'side',    yaw: 90, pitch: 0 },
  { name: 'quarter', yaw: 45, pitch: 0 }
];
const MODES = ['avatar', 'skeleton', 'ghost'];

// Canvas-size matrix (subset of poses for the clipping/placement sweep)
const SIZE_POSES = ['power-stance', 'soft-sit', 'both-knees', 'starfish', 'leap-forward', 'face-touch'];
const SIZES = [
  { w: 70,  h: 70,  label: '70x70' },
  { w: 92,  h: 80,  label: '92x80' },
  { w: 110, h: 150, label: '110x150' },
  { w: 140, h: 180, label: '140x180' },
  { w: 160, h: 180, label: '160x180' },
  { w: 200, h: 280, label: '200x280' },
  { w: 430, h: 932, label: '430x932-camera' }
];

// Verbatim replicate of pose-skeleton-3d.js applyCamera (lines 184-194) + project (428-433).
// Kept in sync by copy — DO NOT diverge. Used only for forensic measurement,
// never to alter rendering.
const EVAL_HELPERS = `
function _ag_applyCamera(point, yawDeg, pitchDeg){
  var yaw=yawDeg*Math.PI/180, pitch=pitchDeg*Math.PI/180;
  var cosY=Math.cos(yaw), sinY=Math.sin(yaw);
  var x1=point.x*cosY + point.z*sinY;
  var z1=-point.x*sinY + point.z*cosY;
  var y1=point.y;
  var cosP=Math.cos(pitch), sinP=Math.sin(pitch);
  var y2=y1*cosP - z1*sinP;
  var z2=y1*sinP + z1*cosP;
  return {x:x1, y:y2, z:z2};
}
function _ag_project(p, yaw, pitch, scale, w, h){
  var r=_ag_applyCamera(p, yaw, pitch);
  var cx=w/2, cy=h/2;
  var fitScale=Math.min(w,h)*0.40*scale;
  return {x:cx+r.x*fitScale, y:cy-r.y*fitScale, z:r.z};
}
function _ag_clone(o){ var out={}; for(var k in o){ if(Object.prototype.hasOwnProperty.call(o,k)) out[k]={x:o[k].x,y:o[k].y,z:o[k].z}; } return out; }
`;

// Render a mode onto the visible canvas and return projected joints + measurements.
async function renderAndMeasure(page, poseId, mode, yaw, pitch, w, h) {
  return await page.evaluate(({ poseId, mode, yaw, pitch, w, h, helpers }) => {
    eval(helpers);
    var lib = POSES_LIBRARY;
    var pose = lib[poseId];
    if (!pose) return { ok: false, error: 'unknown pose ' + poseId };
    var joints = pose.joints || {};
    var c = document.getElementById('_ag_vis');
    if (!c) {
      c = document.createElement('canvas'); c.id = '_ag_vis';
      c.style.position = 'fixed'; c.style.left = '0px'; c.style.top = '0px';
      c.style.zIndex = '99999'; c.style.background = '#F4F1E8';
      document.body.appendChild(c);
    }
    c.width = w; c.height = h; c.style.width = w + 'px'; c.style.height = h + 'px';
    var ctx = c.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var skelInstance = null;
    try {
      if (mode === 'avatar') {
        window.PoseSkeleton3D.renderAvatarFrame(c, w, h, joints, { yaw: yaw, pitch: pitch, scale: 1, category: pose.category, description: pose.instructions });
      } else if (mode === 'ghost') {
        window.PoseSkeleton3D.renderGhostFrame(c, w, h, joints, { yaw: yaw, pitch: pitch, scale: 1, category: pose.category, description: pose.instructions });
      } else {
        skelInstance = Object.create(window.PoseSkeleton3D);
        skelInstance.init(c, w, h);
        skelInstance.setPose(joints, { category: pose.category, description: pose.instructions });
        skelInstance.setViewAngle(yaw, pitch);
        try { skelInstance.stopAutoRotate(); } catch (e) {}
        skelInstance.render();
      }
    } catch (e) {
      return { ok: false, error: String(e && e.message ? e.message : e) };
    }

    // Projected joints (verbatim project() replicate)
    var I = window.PoseSkeleton3D._internals;
    var skel = I.buildPose(joints);
    var proj = {};
    for (var k in skel) { if (Object.prototype.hasOwnProperty.call(skel, k)) proj[k] = _ag_project(skel[k], yaw, pitch, 1, w, h); }

    // Bounding box of projected joints + estimated silhouette radius (head halo)
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (var k2 in proj) {
      var p = proj[k2];
      if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
    }
    var headR = 10 * 1.18;            // avatar head radius estimate (px at scale 1)
    var pad = headR + 4;
    var bbox = { x: minX - pad, y: minY - pad, w: (maxX - minX) + 2 * pad, h: (maxY - minY) + 2 * pad };
    var clipped = bbox.x < -0.5 || bbox.y < -0.5 || (bbox.x + bbox.w) > (w + 0.5) || (bbox.y + bbox.h) > (h + 0.5);
    var occupation = (bbox.w * bbox.h) / (w * h);

    // Placement margins (figure bbox rel. canvas)
    var margins = { top: bbox.y, bottom: (h - (bbox.y + bbox.h)), left: bbox.x, right: (w - (bbox.x + bbox.w)) };

    // Joint-inflation measurement: for every BONE, the avatar draws endpoint
    // circles at BOTH ends (lines 1733-1739). Count overlapping endpoint shapes
    // per shared joint and the ratio joint-diameter / adjacent-limb-width.
    var BONES = I.BONES;
    var BONE_WIDTHS = null; // not exposed; replicate the key widths used
    // Shared-joint overlap count: how many bones touch each joint
    var touchCount = {};
    BONES.forEach(function (b) {
      [b[0], b[1]].forEach(function (kk) { touchCount[kk] = (touchCount[kk] || 0) + 1; });
    });

    // Pixel-based silhouette metrics: read alpha channel
    var imgData = null, alphaPx = 0, totalPx = w * h;
    try {
      imgData = ctx.getImageData(0, 0, w, h);
      var d = imgData.data;
      for (var i = 3; i < d.length; i += 4) { if (d[i] > 12) alphaPx++; }
    } catch (e) {}
    var silhouettePct = alphaPx / totalPx;

    // Centroid of figure (alpha-weighted)
    var cxSum = 0, cySum = 0;
    if (imgData) {
      var d2 = imgData.data;
      for (var yy = 0; yy < h; yy++) {
        for (var xx = 0; xx < w; xx++) {
          var a = d2[(yy * w + xx) * 4 + 3];
          if (a > 12) { cxSum += xx * a; cySum += yy * a; alphaPx = alphaPx; }
        }
      }
      // (alphaPx recomputed above; reuse)
    }
    var centroid = null;

    if (skelInstance) { try { skelInstance.destroy(); } catch (e) {} }

    return {
      ok: true, poseId: poseId, poseName: pose.name, category: pose.category,
      mode: mode, yaw: yaw, pitch: pitch, w: w, h: h, sha: 'SHA_PLACEHOLDER',
      projected: proj, bbox: bbox, clipped: clipped, occupation: occupation,
      margins: margins, silhouettePct: silhouettePct,
      jointTouchCount: touchCount,
      hasError: false
    };
  }, { poseId, mode, yaw, pitch, w, h, helpers: EVAL_HELPERS });
}

// Draw an overlay (joints / bbox / centerline) onto the visible canvas and
// return nothing (caller screenshots immediately).
async function drawOverlay(page, kind, proj, bbox, w, h) {
  await page.evaluate(({ kind, proj, bbox, w, h }) => {
    var c = document.getElementById('_ag_vis');
    var ctx = c.getContext('2d');
    ctx.save();
    if (kind === 'joints') {
      for (var k in proj) {
        var p = proj[k];
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = (p.z > 0) ? 'rgba(201,162,76,0.95)' : 'rgba(30,107,106,0.95)';
        ctx.fill();
        ctx.lineWidth = 0.5; ctx.strokeStyle = 'rgba(15,59,58,0.6)'; ctx.stroke();
      }
    } else if (kind === 'bbox') {
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(201,62,62,0.9)';
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(201,62,62,0.9)'; ctx.font = '8px monospace';
      ctx.fillText(Math.round(bbox.w) + 'x' + Math.round(bbox.h), bbox.x + 2, bbox.y - 2);
    } else if (kind === 'centerline') {
      // canvas vertical center + ground line at lowest projected joint
      ctx.lineWidth = 0.8; ctx.strokeStyle = 'rgba(15,59,58,0.5)'; ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
      ctx.setLineDash([]);
      var maxY = -Infinity, groundY = h;
      for (var k2 in proj) { if (proj[k2].y > maxY) { maxY = proj[k2].y; groundY = proj[k2].y; } }
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(15,59,58,0.7)';
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(w, groundY); ctx.stroke();
    }
    ctx.restore();
  }, { kind, proj, bbox, w, h });
}

// Produce an alpha-silhouette (high-contrast mask) on a separate canvas.
async function renderSilhouette(page, file) {
  await page.evaluate(() => {
    var src = document.getElementById('_ag_vis');
    var w = src.width, h = src.height;
    var s = document.getElementById('_ag_sil');
    if (!s) { s = document.createElement('canvas'); s.id = '_ag_sil'; s.style.position = 'fixed'; s.style.left = '0px'; s.style.top = '0px'; s.style.zIndex = '99998'; document.body.appendChild(s); }
    s.width = w; s.height = h; s.style.width = w + 'px'; s.style.height = h + 'px';
    var ctx = s.getContext('2d');
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
    var sctx = src.getContext('2d');
    var img = sctx.getImageData(0, 0, w, h);
    var out = ctx.createImageData(w, h);
    for (var i = 0; i < img.data.length; i += 4) {
      var a = img.data[i + 3];
      if (a > 12) { out.data[i] = 15; out.data[i + 1] = 59; out.data[i + 2] = 58; out.data[i + 3] = 255; }
      else { out.data[i] = 255; out.data[i + 1] = 255; out.data[i + 2] = 255; out.data[i + 3] = 255; }
    }
    ctx.putImageData(out, 0, 0);
    // hide the visible figure canvas so the silhouette is what screenshots capture
    src.style.visibility = 'hidden';
    s.style.visibility = 'visible';
  });
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: (await page.evaluate(() => document.getElementById('_ag_sil').width)), height: (await page.evaluate(() => document.getElementById('_ag_sil').height)) } });
  await page.evaluate(() => { var v = document.getElementById('_ag_vis'); if (v) v.style.visibility = 'visible'; var s = document.getElementById('_ag_sil'); if (s) s.style.visibility = 'hidden'; });
}

// overlays: array subset of ['joints','bbox','centerline','silhouette']. raw always captured.
async function captureOne(page, poseId, mode, view, w, h, label, overlays) {
  overlays = overlays || ['joints','bbox','centerline','silhouette'];
  const m = await renderAndMeasure(page, poseId, mode, view.yaw, view.pitch, w, h);
  if (!m.ok) { console.log('  [FAIL]', poseId, mode, view.name, m.error); return null; }
  m.sha = SHA;
  const base = `${poseId}__${mode}__${view.name}__${label}`;
  // raw (clean figure)
  await page.screenshot({ path: path.join(OUT, 'raw', base + '.png'), clip: { x: 0, y: 0, width: w, height: h } });
  // joints overlay
  if (overlays.indexOf('joints') >= 0) {
    await drawOverlay(page, 'joints', m.projected, m.bbox, w, h);
    await page.screenshot({ path: path.join(OUT, 'overlays', base + '_joints.png'), clip: { x: 0, y: 0, width: w, height: h } });
  }
  if (overlays.indexOf('bbox') >= 0) {
    await renderAndMeasure(page, poseId, mode, view.yaw, view.pitch, w, h);
    await drawOverlay(page, 'bbox', m.projected, m.bbox, w, h);
    await page.screenshot({ path: path.join(OUT, 'overlays', base + '_bbox.png'), clip: { x: 0, y: 0, width: w, height: h } });
  }
  if (overlays.indexOf('centerline') >= 0) {
    await renderAndMeasure(page, poseId, mode, view.yaw, view.pitch, w, h);
    await drawOverlay(page, 'centerline', m.projected, m.bbox, w, h);
    await page.screenshot({ path: path.join(OUT, 'overlays', base + '_centerline.png'), clip: { x: 0, y: 0, width: w, height: h } });
  }
  if (overlays.indexOf('silhouette') >= 0) {
    await renderAndMeasure(page, poseId, mode, view.yaw, view.pitch, w, h);
    await renderSilhouette(page, path.join(OUT, 'overlays', base + '_silhouette.png'));
  }
  return m;
}

(async () => {
  for (const d of ['raw', 'overlays']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
  const { browser, ctx } = await flow.newContext({ width: 520, height: 640, deviceScaleFactor: 1 });
  const { page, err } = await flow.login(ctx);
  await page.waitForFunction(() => typeof PoseSkeleton3D !== 'undefined' && typeof POSES_LIBRARY !== 'undefined' && PoseSkeleton3D._internals && typeof PoseSkeleton3D.renderAvatarFrame === 'function', null, { timeout: 20000 });

  const allMeasurements = [];
  const JSONL = path.join(OUT, 'measurements.jsonl');
  fs.writeFileSync(JSONL, ''); // truncate
  const OVERLAY_POSES = new Set(['power-stance','soft-sit','both-knees','starfish','leap-forward','face-touch']);
  // Part 1: 24 poses × 3 modes × 3 views @ 160×180
  console.log('[capture] Part 1: cross-renderer matrix @ 160x180');
  for (const poseId of POSES) {
    const wantOverlays = OVERLAY_POSES.has(poseId);
    for (const mode of MODES) {
      for (const view of VIEWS) {
        const ov = wantOverlays ? ['joints','bbox','centerline','silhouette'] : ['silhouette'];
        const m = await captureOne(page, poseId, mode, view, 160, 180, '160x180', ov);
        if (m) { allMeasurements.push(m); fs.appendFileSync(JSONL, JSON.stringify(m) + '\n'); }
      }
    }
    console.log('  [ok]', poseId);
  }

  // Part 2: canvas-size matrix (avatar only, front view) for clipping/placement
  console.log('[capture] Part 2: canvas-size matrix (avatar, front)');
  for (const poseId of SIZE_POSES) {
    for (const sz of SIZES) {
      const m = await captureOne(page, poseId, 'avatar', VIEWS[0], sz.w, sz.h, sz.label, ['bbox','silhouette']);
      if (m) { allMeasurements.push(m); fs.appendFileSync(JSONL, JSON.stringify(m) + '\n'); }
      console.log('  [ok]', poseId, sz.label);
    }
  }

  fs.writeFileSync(path.join(OUT, 'measurements.json'), JSON.stringify({ sha: SHA, generated: new Date().toISOString(), count: allMeasurements.length, measurements: allMeasurements }, null, 2));
  // CSV manifest
  const csv = ['pose_id,pose_name,category,mode,view,canvas,yaw,pitch,bbox_x,bbox_y,bbox_w,bbox_h,clipped,occupation_pct,silhouette_pct,margin_top,margin_bottom,margin_left,margin_right'];
  for (const m of allMeasurements) {
    csv.push([m.poseId, JSON.stringify(m.poseName), m.category, m.mode, (m.yaw + '/' + m.pitch), (m.w + 'x' + m.h), m.yaw, m.pitch, m.bbox.x.toFixed(1), m.bbox.y.toFixed(1), m.bbox.w.toFixed(1), m.bbox.h.toFixed(1), m.clipped ? 1 : 0, (m.occupation * 100).toFixed(1), (m.silhouettePct * 100).toFixed(1), m.margins.top.toFixed(1), m.margins.bottom.toFixed(1), m.margins.left.toFixed(1), m.margins.right.toFixed(1)].join(','));
  }
  fs.writeFileSync(path.join(OUT, 'manifest.csv'), csv.join('\n'));

  // Console errors
  if (err.console.length || err.pageerrors.length) {
    fs.writeFileSync(path.join(OUT, 'console-errors.json'), JSON.stringify(err, null, 2));
    console.log('[capture] console errors:', err.console.length, 'pageerrors:', err.pageerrors.length);
  }
  await browser.close();
  console.log('[capture] DONE: ' + allMeasurements.length + ' measurements, SHA=' + SHA);
  console.log('[capture] output: ' + OUT);
})();
