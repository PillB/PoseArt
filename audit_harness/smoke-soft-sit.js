// audit_harness/smoke-soft-sit.js
// Phase 0/1 smoke: verify login -> poses -> seated -> soft-sit -> 4 views ->
// geometry extraction works end-to-end. Writes a single pose artifact dir.
const fs = require('fs');
const path = require('path');
const flow = require('./lib/pose-flow');
const { deriveAnatomy, geometryHash } = require('./lib/geometry');

const REPO = path.resolve(__dirname, '..');
const RUN_ID = process.env.RUN_ID || fs.readFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), 'utf8').trim();
const POSE_ID = 'soft-sit';
const POSE_DIR = path.join(REPO, 'artifacts', 'pose-audit', RUN_ID, 'categories', 'seated', POSE_ID, 'baseline');
fs.mkdirSync(POSE_DIR, { recursive: true });

(async () => {
  console.log('[smoke] starting soft-sit forensic baseline');
  const { browser, ctx } = await flow.newContext(flow.MOBILE);
  let page, err;
  try {
    const r = await flow.login(ctx); page = r.page; err = r.err;
    console.log('[smoke] logged in');
    await flow.openPosesLibrary(page);
    console.log('[smoke] poses library open');
    await flow.openCategory(page, 'seated');
    console.log('[smoke] seated category open');
    await flow.openPose(page, POSE_ID);
    console.log('[smoke] soft-sit modal open');
    const stable = await flow.waitForRenderReady(page, { keepAuto: true });
    console.log('[smoke] render-ready, stable:', stable);

    // auto view (auto-rotate active)
    const auto = await flow.captureView(page, 'auto', 'btn-skel-auto', path.join(POSE_DIR, 'auto.png'));
    fs.writeFileSync(path.join(POSE_DIR, 'geometry-auto.json'), JSON.stringify(auto.geometry, null, 2));
    // stop auto for deterministic front/side/quarter
    await page.evaluate(() => { try { window._activeSkeleton3D.stopAutoRotate(); } catch (e) {} });
    await page.waitForTimeout(200);

    const front = await flow.captureView(page, 'front', 'btn-skel-front', path.join(POSE_DIR, 'front.png'));
    const side = await flow.captureView(page, 'side-left', 'btn-skel-side', path.join(POSE_DIR, 'side.png'));
    const quarter = await flow.captureView(page, 'quarter-front-left', 'btn-skel-quarter', path.join(POSE_DIR, 'quarter.png'));

    const views = { auto, front, side, quarter };
    fs.writeFileSync(path.join(POSE_DIR, 'views.json'), JSON.stringify(views, null, 2));

    // Forensic anatomy from the front-view body-frame skeleton (camera-independent)
    const skel = front.geometry && front.geometry.skeleton;
    const anatomy = skel ? deriveAnatomy(skel, { confidence: 0.7 }) : null;
    const ghash = skel ? geometryHash(skel) : null;
    fs.writeFileSync(path.join(POSE_DIR, 'geometry.json'), JSON.stringify({ pose_id: POSE_ID, geometry_hash: ghash, raw_skeleton: skel, derived_anatomy: anatomy }, null, 2));

    fs.writeFileSync(path.join(POSE_DIR, 'console.json'), JSON.stringify(err, null, 2));

    // Forensic prose
    const md = [];
    md.push(`# Forensic Baseline — ${POSE_ID}`);
    md.push('');
    md.push('## Pose identity');
    md.push('- id: soft-sit');
    md.push('- category: seated');
    md.push('- Expected semantic claims (from instructions/tip):');
    md.push('  - pelvis supported near front third of seat (chair prop)');
    md.push('  - spine tall');
    md.push('  - torso leans a few degrees forward from hips');
    md.push('  - both knees angled to ONE SIDE (asymmetric), not square to camera');
    md.push('  - feet/lower legs follow naturally from knee direction');
    md.push('  - NOT a squat, floating figure, deep forward fold, or symmetrical knees-forward seat');
    md.push('');
    md.push('## Raw joint config (soft-sit)');
    md.push('```json');
    md.push(JSON.stringify({spine:18,neck:-5,leftElbow:65,rightElbow:45,hipAbductL:20,hipAbductR:20,leftHip:85,rightHip:85,leftKnee:90,rightKnee:95,leftAnkle:-15,rightAnkle:-15,rightShoulder:-12,shoulderFwdL:7,shoulderFwdR:-5}, null, 2));
    md.push('```');
    md.push('');
    md.push('## Derived anatomy (front-view body-frame geometry)');
    md.push('```json');
    md.push(JSON.stringify(anatomy, null, 2));
    md.push('```');
    md.push('');
    md.push('## View results');
    md.push('| view | state_changed | yaw_after | pitch_after |');
    md.push('|------|---------------|-----------|-------------|');
    for (const [k, v] of Object.entries(views)) md.push(`| ${k} | ${v.state_changed} | ${v.yaw_after} | ${v.pitch_after} |`);
    md.push('');
    md.push('## Console / page errors');
    md.push('- console errors: ' + err.console.length);
    md.push('- page errors: ' + err.pageerrors.length);
    md.push('- failed requests: ' + err.failed.length);
    if (err.console.length) md.push('\n```\n' + err.console.slice(0, 10).join('\n') + '\n```');
    md.push('');
    md.push('## Forensic assessment');
    md.push('- Geometry hash: ' + ghash);
    if (anatomy) {
      md.push('- Torso: ' + anatomy.torso.description);
      md.push('- Left leg: ' + anatomy.left_leg.description);
      md.push('- Right leg: ' + anatomy.right_leg.description);
      md.push('- Left arm: ' + anatomy.left_arm.description);
      md.push('- Right arm: ' + anatomy.right_arm.description);
      md.push('- Balance: ' + anatomy.balance.description);
      // Soft-sit specific check
      const kneeAsym = Math.abs(anatomy.left_leg.hip_flexion_deg - anatomy.right_leg.hip_flexion_deg);
      md.push('');
      md.push('### Soft-Sit semantic check');
      md.push(`- Hip flexion L=${anatomy.left_leg.hip_flexion_deg}° R=${anatomy.right_leg.hip_flexion_deg}° (asymmetry ${kneeAsym.toFixed(1)}°)`);
      md.push(`- Torso flexion ${anatomy.torso.flexion_deg}° (expected slight forward, ~5-20°)`);
      if (kneeAsym < 10) md.push('- **POTENTIAL MAJOR DEFECT**: instructions say "angle both knees to one side" but left/right hip flexion is symmetric (both ~85° forward). Knees point forward, NOT to one side.');
      else md.push('- Knee direction asymmetry present.');
    }
    fs.writeFileSync(path.join(POSE_DIR, 'forensic.md'), md.join('\n'));
    console.log('[smoke] DONE. artifacts in', POSE_DIR);
    console.log('[smoke] geometry hash:', ghash);
    if (anatomy) {
      console.log('[smoke] torso:', anatomy.torso.description);
      console.log('[smoke] left leg:', anatomy.left_leg.description);
      console.log('[smoke] right leg:', anatomy.right_leg.description);
    }
  } catch (e) {
    console.error('[smoke] FAILED:', e.message);
    if (page) await page.screenshot({ path: path.join(POSE_DIR, 'failure.png') }).catch(() => {});
    fs.writeFileSync(path.join(POSE_DIR, 'error.txt'), String(e && e.stack ? e.stack : e));
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
