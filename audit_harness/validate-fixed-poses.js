// audit_harness/validate-fixed-poses.js
// Re-capture the 22 consistency-fixed poses and run VLM forensic analysis.
// Uses delays between VLM calls to avoid rate limiting.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const flow = require('./lib/pose-flow');

const REPO = path.resolve(__dirname, '..');
const RAW = path.join(REPO, 'audit', 'pose-forensic', 'raw-fixed');
const REPORTS = path.join(REPO, 'audit', 'pose-forensic', 'reports');
fs.mkdirSync(RAW, { recursive: true });

// The 22 fixed pose IDs (from the consistency fixer)
const FIXED_POSES = [
  'floor-cross-leg', 'doorframe-lean', 'kneeling-arms-crossed', 'kneeling-look-back',
  'kneeling-chest-open', 'prone-chin', 'prone-tuck-arms', 'back-to-back', 'partners-lean',
  'boudoir-prone-arch', 'fineart-prone-back-lift-elegant', 'highlow-full-prone-final-floor',
  'p13-floor-s6-knees-bent-arms-crossed', 'p10-bench-s3-recline-arm-overhead',
  'p10-bench-s5-side-recline-arm-up', 'p18-lounge-r5-back-lying-arms-overhead',
  'p03-bed-b1-prone-belly-legs-crossed-shin', 'p03-bed-b2-prone-belly-arch-hips-up-eyes-closed',
  'p03-bed-b3-prone-belly-arch-legs-extended-crossed', 'p03-bed-b4-prone-belly-turned-leg-pushed-side',
  'p03-bed-b5-prone-belly-elevated-hands-crossed-facing', 'p01-master-s8-chair-stand-lean-facing-camera'
];
const W = 200, H = 280;

(async () => {
  const { browser, ctx } = await flow.newContext({ width: 520, height: 640, deviceScaleFactor: 1 });
  const { page } = await flow.login(ctx);
  await page.waitForFunction(() => typeof PoseSkeleton3D !== 'undefined' && typeof POSES_LIBRARY !== 'undefined' && PoseSkeleton3D._internals, null, { timeout: 20000 });

  // Capture all fixed poses (avatar mode)
  for (const poseId of FIXED_POSES) {
    const file = path.join(RAW, poseId + '__avatar.png');
    await page.evaluate(({ poseId, w, h }) => {
      const pose = POSES_LIBRARY[poseId]; if (!pose) return;
      const joints = pose.joints || {};
      let c = document.getElementById('_ag_vis');
      if (!c) { c = document.createElement('canvas'); c.id = '_ag_vis'; c.style.position = 'fixed'; c.style.left = '0px'; c.style.top = '0px'; c.style.zIndex = '99999'; c.style.background = '#F4F1E8'; document.body.appendChild(c); }
      c.width = w; c.height = h; c.style.width = w + 'px'; c.style.height = h + 'px';
      const ctx = c.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, h);
      PoseSkeleton3D.renderAvatarFrame(c, w, h, joints, { yaw: 0, pitch: 0, scale: 1, category: pose.category, description: pose.instructions });
    }, { poseId, w: W, h: H });
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: W, height: H } });
    console.log('  [captured] ' + poseId);
  }
  await browser.close();
  console.log('[capture] DONE: ' + FIXED_POSES.length + ' poses');
})();
