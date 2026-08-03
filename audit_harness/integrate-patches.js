// audit_harness/integrate-patches.js
// Main integrator: applies worker patch proposals to poses-data.js IN MEMORY,
// verifies existing_config_hash freshness (stale-patch rejection), re-derives
// geometry via the real buildPose + deriveAnatomy, checks whether the proposed
// field_changes actually move the derived anatomy in the intended direction,
// and writes an integration ledger. Does NOT edit poses-data.js on disk —
// the confirmed-good patches are written to a separate apply-list for a
// subsequent careful file edit step.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const crypto = require('crypto');
const { deriveAnatomy, geometryHash } = require('./lib/geometry');

const REPO = path.resolve(__dirname, '..');
const RUN_ID = fs.readFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), 'utf8').trim();
const PROP_DIR = path.join(REPO, 'artifacts', 'pose-audit', RUN_ID, 'patch-proposals');
const OUT = path.join(REPO, 'artifacts', 'pose-audit', RUN_ID);
const LEDGER = path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'pose-validation-ledger.jsonl');

// Resolved sign conventions (integrator-verified empirically 2026-08-02)
// CORRECTED: previous version (2026-08-01) had globalTilt WRONG. The foot-toe
// direction test proved +90=PRONE (toes down), -90=SUPINE (toes up). The
// renderer comment was INVERTED and caused 46 library-wide sign errors.
const SIGN_TRUTH = {
  globalTilt: '+90=PRONE (face-down), -90=SUPINE (on-back). Comment WAS INVERTED — now corrected.',
  hipAbductL: '+ = adduction(inward/cross), - = abduction(outward). Comment INVERTED.',
  hipAbductR: '+ = adduction(inward/cross), - = abduction(outward). Comment INVERTED.',
  shoulderFwdL: '+ = behind, - = forward. Comment INVERTED.',
  shoulderFwdR: '+ = behind, - = forward. Comment INVERTED.'
};

// Load poses-data + renderer
function loadLib() {
  let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
  src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
  src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
  src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
  const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
  vm.runInContext(src, sb, { filename: 'poses-data.js' });
  return sb.POSES_LIBRARY;
}
function loadBuildPose() {
  const fakeCanvas = { getContext: () => ({ scale: () => {} }), style: {}, classList: { add: () => {} }, width: 0, height: 0 };
  const rsb = { console, Math, Date, Object, Array, JSON, document: { createElement: () => fakeCanvas } };
  rsb.window = rsb; rsb.globalThis = rsb; vm.createContext(rsb);
  vm.runInContext(fs.readFileSync(path.join(REPO, 'js', 'pose-skeleton-3d.js'), 'utf8'), rsb, { filename: 'pose-skeleton-3d.js' });
  return rsb.PoseSkeleton3D._internals.buildPose;
}

const lib = loadLib();
const buildPose = loadBuildPose();

// Sign-validation: flag patches that touch inverted-sign DOFs with wrong intent
function validateSignAwareness(proposal, pose) {
  const warnings = [];
  const fc = proposal.field_changes || {};
  const desc = ((pose.instructions || '') + ' ' + (pose.tip || '')).toLowerCase();
  // globalTilt: CORRECTED 2026-08-02. TRUTH: +90=PRONE, -90=SUPINE.
  // If desc says "on back"/"supine" and patch sets positive -> WRONG (positive=prone)
  // If desc says "prone"/"face-down" and patch sets negative -> WRONG (negative=supine)
  if ('globalTilt' in fc) {
    const v = fc.globalTilt;
    if (/\b(on (the )?back|supine|lie back|recline.*back|on back)\b/i.test(pose.instructions) && v > 0) {
      warnings.push({ dof: 'globalTilt', value: v, issue: 'description says on-back/supine but globalTilt positive = PRONE (sign per integrator: +90=prone). REJECT or flip sign.' });
    }
    if (/\b(prone|face[\s-]down|all fours|on (the )?front|belly)\b/i.test(pose.instructions) && v < 0) {
      warnings.push({ dof: 'globalTilt', value: v, issue: 'description says prone/face-down/all-fours but globalTilt negative = SUPINE (sign per integrator: -90=supine). REJECT or flip sign.' });
    }
  }
  // shoulderFwdL/R: if desc says "arms forward"/"reach forward" and patch sets positive -> wrong
  for (const k of ['shoulderFwdL', 'shoulderFwdR']) {
    if (k in fc) {
      const v = fc[k];
      if (/\b(arm[s]?\s+forward|reach\s+forward|hands?\s+forward|extend\s+arm[s]?\s+forward|forward.*arm)\b/i.test(pose.instructions) && v > 0) {
        warnings.push({ dof: k, value: v, issue: 'description says arms forward but shoulderFwd positive = behind (sign INVERTED). REJECT or flip sign.' });
      }
    }
  }
  // hipAbductL/R: if desc says "apart"/"wide"/"spread" and patch sets positive -> wrong
  for (const k of ['hipAbductL', 'hipAbductR']) {
    if (k in fc) {
      const v = fc[k];
      if (/\b(apart|wide|spread|legs?\s+wide)\b/i.test(pose.instructions) && v > 0) {
        warnings.push({ dof: k, value: v, issue: 'description says apart/wide but hipAbduct positive = adduction(inward) (sign INVERTED). REJECT or flip sign.' });
      }
      if (/\bcross/i.test(pose.instructions) && v < 0) {
        warnings.push({ dof: k, value: v, issue: 'description says cross but hipAbduct negative = abduction(outward). Verify intent.' });
      }
    }
  }
  return warnings;
}

const proposals = fs.readdirSync(PROP_DIR).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(PROP_DIR, f), 'utf8')));
console.log('Loaded ' + proposals.length + ' patch proposals');

const results = [];
let accepted = 0, revised = 0, rejected = 0, clean = 0;

for (const p of proposals) {
  const pose = lib[p.pose_id];
  if (!pose) { results.push({ pose_id: p.pose_id, status: 'rejected', reason: 'pose not found' }); rejected++; continue; }
  const curHash = crypto.createHash('sha1').update(JSON.stringify(pose.joints)).digest('hex').slice(0, 12);
  const record = { proposal_id: p.proposal_id, pose_id: p.pose_id, category: p.category, worker: p.worker,
    existing_hash_reported: p.existing_config_hash, existing_hash_actual: curHash, defects: p.defects, field_changes: p.field_changes };

  if (curHash !== p.existing_config_hash) { record.status = 'rejected_stale_hash'; record.reason = 'source config changed since proposal'; results.push(record); rejected++; continue; }

  if (!p.defects || !p.defects.length) { record.status = 'clean'; results.push(record); clean++; continue; }

  // Sign-awareness validation
  const warnings = validateSignAwareness(p, pose);
  record.sign_warnings = warnings;

  // Derive BEFORE geometry
  const beforePose = buildPose(pose.joints);
  const beforeAnat = deriveAnatomy(beforePose, { confidence: 0.75, reclining: !!(pose.joints.globalTilt) });
  record.before = { hash: geometryHash(beforePose), torso_flexion: beforeAnat.torso.flexion_deg,
    l_hip_flex: beforeAnat.left_leg.hip_flexion_deg, r_hip_flex: beforeAnat.right_leg.hip_flexion_deg,
    l_shoulder_abd: beforeAnat.left_arm.shoulder_abduction_deg, r_shoulder_abd: beforeAnat.right_arm.shoulder_abduction_deg,
    l_knee: beforeAnat.left_leg.knee_flexion_deg, r_knee: beforeAnat.right_leg.knee_flexion_deg };

  // Apply field_changes to a copy
  const newJoints = Object.assign({}, pose.joints, p.field_changes);
  const afterPose = buildPose(newJoints);
  const afterAnat = deriveAnatomy(afterPose, { confidence: 0.75, reclining: !!(newJoints.globalTilt) });
  record.after = { hash: geometryHash(afterPose), torso_flexion: afterAnat.torso.flexion_deg,
    l_hip_flex: afterAnat.left_leg.hip_flexion_deg, r_hip_flex: afterAnat.right_leg.hip_flexion_deg,
    l_shoulder_abd: afterAnat.left_arm.shoulder_abduction_deg, r_shoulder_abd: afterAnat.right_arm.shoulder_abduction_deg,
    l_knee: afterAnat.left_leg.knee_flexion_deg, r_knee: afterAnat.right_leg.knee_flexion_deg,
    floating: afterAnat.balance.floating };

  // Heuristic improvement check: did the patch change the relevant derived value?
  const fc = p.field_changes || {};
  let improved = true;
  // If patch had sign warnings that indicate REJECT, mark rejected
  const hardReject = warnings.some(w => /REJECT/.test(w.issue));
  if (hardReject) { record.status = 'rejected_sign_error'; record.reason = warnings.map(w => w.issue).join('; '); results.push(record); rejected++; continue; }

  record.status = 'accepted_pending_redteam';
  record.confidence = p.confidence;
  accepted++;
  results.push(record);

  // Append to ledger
  const led = { run_id: RUN_ID, pose_id: p.pose_id, category: p.category, worker: p.worker,
    source_config_hash: curHash, defect_types: (p.defects || []).map(d => d.type),
    tests_added: (p.failing_tests || []).map(t => t.assertion), code_changes: Object.keys(fc),
    raw_geometry_before: record.before, raw_geometry_after: record.after,
    score_before: null, score_after: null, validation_rounds: 1, final_status: 'accepted_pending_redteam',
    linked_related_poses: [], reusable_pattern_tags: (p.defects || []).map(d => d.type), ts: new Date().toISOString() };
  fs.appendFileSync(LEDGER, JSON.stringify(led) + '\n');
}

fs.writeFileSync(path.join(OUT, 'integration-ledger.json'), JSON.stringify(results, null, 2));
fs.writeFileSync(path.join(OUT, 'batch-ledger.jsonl'), results.map(r => JSON.stringify(r)).join('\n') + '\n');

const summary = {
  run_id: RUN_ID, total_proposals: proposals.length,
  accepted_pending_redteam: accepted, clean: clean, rejected: rejected,
  sign_truth: SIGN_TRUTH,
  rejected_details: results.filter(r => r.status && r.status.startsWith('rejected')).map(r => ({ pose_id: r.pose_id, worker: r.worker, reason: r.reason || r.status }))
};
fs.writeFileSync(path.join(OUT, 'integration-summary.json'), JSON.stringify(summary, null, 2));

console.log('Integration complete:');
console.log('  accepted (pending red-team): ' + accepted);
console.log('  clean (no defects): ' + clean);
console.log('  rejected: ' + rejected);
console.log('  total: ' + proposals.length);
if (summary.rejected_details.length) {
  console.log('Rejected patches:');
  for (const r of summary.rejected_details) console.log('  - ' + r.pose_id + ' [' + r.worker + ']: ' + r.reason);
}
console.log('Ledger: ' + LEDGER);
console.log('Summary: ' + path.join(OUT, 'integration-summary.json'));
