// audit_harness/forensic-pose.js
// Generalized per-pose forensic baseline runner. Usage:
//   node audit_harness/forensic-pose.js <poseId> [<poseId> ...]
// Runs the full UI procedure for each pose, writes baseline artifacts under
// artifacts/pose-audit/<run>/categories/<cat>/<poseId>/baseline/.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const flow = require('./lib/pose-flow');
const { deriveAnatomy, geometryHash } = require('./lib/geometry');

const REPO = path.resolve(__dirname, '..');
const RUN_ID = process.env.RUN_ID || fs.readFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), 'utf8').trim();
const ART = path.join(REPO, 'artifacts', 'pose-audit', RUN_ID);

// Load poses-data to get pose meta
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;

const poseIds = process.argv.slice(2);
if (!poseIds.length) { console.error('usage: node forensic-pose.js <poseId> [...]'); process.exit(2); }

async function runOne(page, poseId) {
  const pose = lib[poseId];
  if (!pose) throw new Error('unknown pose ' + poseId);
  const dir = path.join(ART, 'categories', pose.category, poseId, 'baseline');
  fs.mkdirSync(dir, { recursive: true });
  // Navigate: ensure on library, open category, open pose
  await flow.openPosesLibrary(page);
  await flow.openCategory(page, pose.category);
  await flow.openPose(page, poseId);
  const stable = await flow.waitForRenderReady(page, { keepAuto: true });
  const auto = await flow.captureView(page, 'auto', 'btn-skel-auto', path.join(dir, 'auto.png'));
  await page.evaluate(() => { try { window._activeSkeleton3D.stopAutoRotate(); } catch (e) {} });
  await page.waitForTimeout(200);
  const front = await flow.captureView(page, 'front', 'btn-skel-front', path.join(dir, 'front.png'));
  const side = await flow.captureView(page, 'side-left', 'btn-skel-side', path.join(dir, 'side.png'));
  const quarter = await flow.captureView(page, 'quarter-front-left', 'btn-skel-quarter', path.join(dir, 'quarter.png'));
  const views = { auto, front, side, quarter };
  fs.writeFileSync(path.join(dir, 'views.json'), JSON.stringify(views, null, 2));
  const skel = front.geometry && front.geometry.skeleton;
  const anatomy = skel ? deriveAnatomy(skel, { confidence: 0.75, reclining: !!(pose.joints.globalTilt) }) : null;
  const ghash = skel ? geometryHash(skel) : null;
  fs.writeFileSync(path.join(dir, 'geometry.json'), JSON.stringify({ pose_id: poseId, geometry_hash: ghash, raw_skeleton: skel, derived_anatomy: anatomy }, null, 2));
  // Forensic md
  const md = [];
  md.push('# Forensic Baseline — ' + poseId);
  md.push('- name: ' + pose.name);
  md.push('- category: ' + pose.category + ' | difficulty: ' + pose.difficulty + ' | angle: ' + pose.angle);
  md.push('- instructions: ' + pose.instructions);
  md.push('- tip: ' + (pose.tip || ''));
  md.push('');
  md.push('## Raw joint config');
  md.push('```json\n' + JSON.stringify(pose.joints, null, 2) + '\n```');
  md.push('');
  md.push('## Derived anatomy (front-view body-frame geometry, camera-independent)');
  md.push('```json\n' + JSON.stringify(anatomy, null, 2) + '\n```');
  md.push('');
  md.push('## View results');
  md.push('| view | state_changed | yaw | pitch |');
  md.push('|------|---------------|-----|-------|');
  for (const [k, v] of Object.entries(views)) md.push(`| ${k} | ${v.state_changed} | ${v.yaw_after} | ${v.pitch_after} |`);
  if (anatomy) {
    md.push('', '## Forensic summary');
    md.push('- Torso: ' + anatomy.torso.description);
    md.push('- Head: ' + anatomy.head.description);
    md.push('- Pelvis: ' + anatomy.pelvis.description);
    md.push('- L arm: ' + anatomy.left_arm.description);
    md.push('- R arm: ' + anatomy.right_arm.description);
    md.push('- L leg: ' + anatomy.left_leg.description);
    md.push('- R leg: ' + anatomy.right_leg.description);
    md.push('- Balance: ' + anatomy.balance.description + ' (floating=' + anatomy.balance.floating + ')');
    if (anatomy.anomalies.length) md.push('- Anomalies: ' + JSON.stringify(anatomy.anomalies));
    if (anatomy.plausibility_flags.length) md.push('- Plausibility flags: ' + JSON.stringify(anatomy.plausibility_flags));
  }
  fs.writeFileSync(path.join(dir, 'forensic.md'), md.join('\n'));
  return { poseId, ghash, anatomy, views, dir };
}

(async () => {
  const { browser, ctx } = await flow.newContext(flow.MOBILE);
  const r = await flow.login(ctx);
  const page = r.page;
  const err = r.err;
  const results = [];
  for (const id of poseIds) {
    try {
      const res = await runOne(page, id);
      // close pose sheet between poses
      await flow.closePoseSheet(page);
      results.push({ ok: true, id: id, ghash: res.ghash });
      console.log('[forensic] ' + id + ' OK hash=' + res.ghash);
    } catch (e) {
      console.error('[forensic] ' + id + ' FAIL: ' + e.message);
      results.push({ ok: false, id, error: e.message });
    }
  }
  fs.writeFileSync(path.join(ART, 'forensic-baseline-results.json'), JSON.stringify(results, null, 2), { flag: 'a' });
  fs.writeFileSync(path.join(ART, 'console-capture.json'), JSON.stringify(err, null, 2));
  await browser.close();
  const ok = results.filter(r => r.ok).length;
  console.log(`[forensic] done: ${ok}/${results.length} ok`);
})();
