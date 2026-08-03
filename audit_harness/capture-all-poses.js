// audit_harness/capture-all-poses.js
// Capture ALL 745 poses (avatar mode, front view, 200x280) for VLM review.
// Outputs to audit/pose-repair/census/raw/<poseId>.png
const fs = require('fs');
const path = require('path');
const flow = require('./lib/pose-flow');

const REPO = path.resolve(__dirname, '..');
const OUT = path.join(REPO, 'audit', 'pose-repair', 'census', 'raw');
fs.mkdirSync(OUT, { recursive: true });
const W = 200, H = 280;

(async () => {
  const { browser, ctx } = await flow.newContext({ width: 520, height: 640, deviceScaleFactor: 1 });
  const { page } = await flow.login(ctx);
  await page.waitForFunction(() => typeof PoseSkeleton3D !== 'undefined' && typeof POSES_LIBRARY !== 'undefined' && PoseSkeleton3D._internals, null, { timeout: 20000 });

  const ids = await page.evaluate(() => Object.keys(POSES_LIBRARY));
  let count = 0, skip = 0;
  for (const poseId of ids) {
    const file = path.join(OUT, poseId + '.png');
    if (fs.existsSync(file)) { skip++; continue; }
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
    count++;
    if (count % 50 === 0) console.log('  [progress] ' + count + '/' + ids.length);
  }
  await browser.close();
  console.log('[capture] DONE: ' + count + ' new, ' + skip + ' existing, ' + ids.length + ' total');
})();
