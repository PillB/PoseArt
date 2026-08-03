// audit_harness/vlm-validation-capture.js — capture poses for VLM review.
// Captures: (a) the home featured pose, (b) a representative set across all 16
// categories, each in avatar/skeleton/ghost modes at 200x280 (VLM-friendly size).
// Output: audit/avatar-ghost/vlm-validation/{raw, sheets}/
const fs = require('fs');
const path = require('path');
const flow = require('./lib/pose-flow');

const REPO = path.resolve(__dirname, '..');
const OUT = path.join(REPO, 'audit', 'avatar-ghost', 'vlm-validation');
const RAW = path.join(OUT, 'raw');
fs.mkdirSync(RAW, { recursive: true });

// Representative set: 1-2 poses per category = ~32 poses, covering all archetypes
const POSES = [
  'power-stance', 'scurve-stand', 'crossed-arms-stand',          // standing
  'soft-sit', 'window-seat', 'forearms-crossed-table',            // seated
  'wall-lean', 'doorframe-lean',                                   // leaning
  'table-elbow-single',                                            // lean-seat
  'both-knees', 'knights-kneel',                                   // kneeling
  'starfish', 'lounger-recline', 'side-recline',                   // reclining
  'leap-forward', 'crouching-prowl',                               // dynamic
  'face-touch', 'cross-body-arm', 'hair-flip',                     // eccentric
  'couple-embrace', 'waltz-hold',                                  // couple
  'wheelchair-arms', 'seated-power',                               // accessible
  'boudoir-s-curve-stand', 'boudoir-elegant-recline',              // boudoir
  'editorial-sharp-angles-stand', 'editorial-extreme-forward-lean',// editorial
  'fineart-contrapposto-classic', 'fineart-odalisque-recline',     // fine-art
  'fashion-power-stance-classic', 'fashion-runway-stomp-stride',   // fashion
  'lowhigh-deep-crouch-start', 'highlow-floor-landing-final'       // low/high
];
const MODES = ['avatar', 'skeleton', 'ghost'];
const W = 200, H = 280;

(async () => {
  const { browser, ctx } = await flow.newContext({ width: 520, height: 640, deviceScaleFactor: 1 });
  const { page, err } = await flow.login(ctx);
  await page.waitForFunction(() => typeof PoseSkeleton3D !== 'undefined' && typeof POSES_LIBRARY !== 'undefined' && PoseSkeleton3D._internals, null, { timeout: 20000 });

  // (a) Home featured pose — capture the actual home screen (real UI surface)
  await page.evaluate(() => window.showScreen && window.showScreen('home'));
  await page.waitForTimeout(800);
  const featuredPoseId = await page.evaluate(() => {
    const el = document.querySelector('#screen-home [data-pose-id], #screen-home .featured-pose, #screen-home .pose-card');
    return el ? (el.getAttribute('data-pose-id') || el.getAttribute('data-id') || '') : '';
  });
  // The home featured pose is rendered via renderPoseFigureSVG (avatar). Capture the home screen region.
  await page.screenshot({ path: path.join(RAW, '00-home-featured.png') });

  // (b) Representative set on controlled canvases (fair mode comparison)
  let count = 0;
  for (const poseId of POSES) {
    const poseExists = await page.evaluate((id) => !!POSES_LIBRARY[id], poseId);
    if (!poseExists) { console.log('  [skip] unknown', poseId); continue; }
    for (const mode of MODES) {
      const file = path.join(RAW, `${poseId}__${mode}.png`);
      await page.evaluate(({ poseId, mode, w, h }) => {
        const pose = POSES_LIBRARY[poseId]; const joints = pose.joints || {};
        let c = document.getElementById('_ag_vis');
        if (!c) { c = document.createElement('canvas'); c.id = '_ag_vis'; c.style.position = 'fixed'; c.style.left = '0px'; c.style.top = '0px'; c.style.zIndex = '99999'; c.style.background = '#F4F1E8'; document.body.appendChild(c); }
        c.width = w; c.height = h; c.style.width = w + 'px'; c.style.height = h + 'px';
        const ctx = c.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, h);
        if (mode === 'avatar') PoseSkeleton3D.renderAvatarFrame(c, w, h, joints, { yaw: 0, pitch: 0, scale: 1, category: pose.category, description: pose.instructions });
        else if (mode === 'ghost') PoseSkeleton3D.renderGhostFrame(c, w, h, joints, { yaw: 0, pitch: 0, scale: 1, category: pose.category, description: pose.instructions });
        else { const s = Object.create(PoseSkeleton3D); s.init(c, w, h); s.setPose(joints, { animateEntry: false, category: pose.category, description: pose.instructions }); s.setViewAngle(0, 0); try { s.stopAutoRotate(); } catch (e) {} s.render(); s.destroy(); }
      }, { poseId, mode, w: W, h: H });
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: W, height: H } });
      count++;
    }
    console.log('  [ok]', poseId);
  }
  // console errors
  if (err.console.length || err.pageerrors.length) {
    fs.writeFileSync(path.join(OUT, 'console-errors.json'), JSON.stringify(err, null, 2));
  }
  await browser.close();
  console.log('[vlm-capture] DONE: ' + count + ' images, featured pose id=' + featuredPoseId);
})();
