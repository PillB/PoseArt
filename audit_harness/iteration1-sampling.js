// audit_harness/iteration1-sampling.js
// Iteration 1: Initial stratified sampling.
// Priority: (1) 11 displaced-record poses, (2) sample 5 per high-risk stratum,
// (3) exploratory samples from low-risk strata.
const fs = require('fs');
const path = require('path');
const flow = require('./lib/pose-flow');

const REPO = path.resolve(__dirname, '..');
const OUT = path.join(REPO, 'audit', 'pose-repair', 'dossiers');
const RAW = path.join(REPO, 'audit', 'pose-repair', 'baseline');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(RAW, { recursive: true });

// Priority 1: The 11 displaced-record poses (HIGH severity from integrity audit)
const DISPLACED = [
  'scurve-stand', 'boudoir-reclined-back-support', 'boudoir-standing-profile-curve',
  'fineart-standing-back-bend-soft', 'fineart-standing-still-life-drape',
  'fineart-standing-cambre-side', 'fashion-catalog-three-quarter',
  'lowhigh-standing-tall-arms-out', 'highlow-standing-hip-drop-begin',
  'highlow-standing-bow-forward-begin', 'p09-unconv-s6-shoulder-stand-fold'
];

// Priority 2: Sample from largest/riskiest strata
const STRATUM_SAMPLE = [
  // leaning × wall (29 poses) - sample 5
  'wall-lean', 'doorframe-lean', 'shoulder-wall', 'hip-pop-wall', 'back-wall-prop',
  // seated × chair (26 poses) - sample 5
  'soft-sit', 'chair-lean-forward', 'chair-arms-overhead', 'cross-ankle-sit', 'chair-twist-both',
  // couple × partner (22 poses) - sample 5
  'couple-embrace', 'waltz-hold', 'back-to-back', 'forehead-touch', 'hand-in-hand-walk',
  // kneeling × none (17 poses) - sample 5
  'both-knees', 'knights-kneel', 'kneeling-arms-crossed', 'kneeling-reach', 'kneeling-back-arch',
  // reclining × floor (sample 5)
  'starfish', 'lounger-recline', 'side-recline', 'prone-chin', 'pool-float'
];

const ALL_POSES = [...DISPLACED, ...STRATUM_SAMPLE];
const W = 200, H = 280;

(async () => {
  const { browser, ctx } = await flow.newContext({ width: 520, height: 640, deviceScaleFactor: 1 });
  const { page } = await flow.login(ctx);
  await page.waitForFunction(() => typeof PoseSkeleton3D !== 'undefined' && typeof POSES_LIBRARY !== 'undefined' && PoseSkeleton3D._internals, null, { timeout: 20000 });

  const sample = { displaced: DISPLACED, stratum: STRATUM_SAMPLE };
  fs.writeFileSync(path.join(REPO, 'audit', 'pose-repair', 'sampling', 'iteration-01-sample.json'), JSON.stringify(sample, null, 2));

  let count = 0;
  for (const poseId of ALL_POSES) {
    const exists = await page.evaluate((id) => !!POSES_LIBRARY[id], poseId);
    if (!exists) { console.log('  [skip] unknown', poseId); continue; }
    // Create dossier directory
    const dossierDir = path.join(OUT, poseId);
    fs.mkdirSync(path.join(dossierDir, 'baseline'), { recursive: true });

    // Capture avatar + skeleton + ghost at front view
    for (const mode of ['avatar', 'skeleton', 'ghost']) {
      const file = path.join(dossierDir, 'baseline', mode + '__front.png');
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
    console.log('  [ok] ' + poseId);
  }
  await browser.close();
  fs.writeFileSync(path.join(REPO, 'audit', 'pose-repair', 'sampling', 'iteration-01-manifest.json'), JSON.stringify({ poses: ALL_POSES.length, images: count, date: new Date().toISOString() }, null, 2));
  console.log('[iter1] DONE: ' + count + ' images for ' + ALL_POSES.length + ' poses');
})();
