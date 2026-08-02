// audit_harness/verify-patch.js
// Helper for workers to dry-run a proposed field-change patch through the REAL
// renderer buildPose + deriveAnatomy, so we can confirm the geometry delta
// BEFORE emitting a patch proposal. Does NOT modify poses-data.js.
//
// Usage: node audit_harness/verify-patch.js <poseId> '<json overrides>'
//   e.g. node audit_harness/verify-patch.js meditation-palms '{"hipAbductL":-20,"hipAbductR":25}'
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const { deriveAnatomy, geometryHash } = require('./lib/geometry');

const REPO = path.resolve(__dirname, '..');

// Load poses-data
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON };
sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;

// Load renderer
let rsrc = fs.readFileSync(path.join(REPO, 'js', 'pose-skeleton-3d.js'), 'utf8');
const fakeCanvas = { getContext: () => ({ scale: () => {} }), style: {}, classList: { add: () => {} }, width: 0, height: 0 };
const rsb = { console, Math, Date, Object, Array, JSON, document: { createElement: () => fakeCanvas } };
rsb.window = rsb; rsb.globalThis = rsb; vm.createContext(rsb);
vm.runInContext(rsrc, rsb, { filename: 'pose-skeleton-3d.js' });
const buildPose = rsb.PoseSkeleton3D._internals.buildPose;

const poseId = process.argv[2];
const overrides = JSON.parse(process.argv[3] || '{}');
const pose = lib[poseId];
if (!pose) { console.error('unknown pose ' + poseId); process.exit(2); }

const beforeJoints = JSON.parse(JSON.stringify(pose.joints));
const afterJoints = Object.assign({}, beforeJoints, overrides);

const beforeSkel = buildPose(beforeJoints);
const afterSkel = buildPose(afterJoints);
const reclining = !!afterJoints.globalTilt;
const beforeAnat = deriveAnatomy(beforeSkel, { confidence: 0.75, reclining: !!beforeJoints.globalTilt });
const afterAnat = deriveAnatomy(afterSkel, { confidence: 0.75, reclining });

function summarize(a) {
  return {
    torso_flex: a.torso.flexion_deg, torso_lat: a.torso.lateral_flexion_deg, torso_axial: a.torso.axial_rotation_deg,
    head_pitch: a.head.pitch_deg, head_roll: a.head.roll_deg,
    L_arm_abd: a.left_arm.shoulder_abduction_deg, L_arm_sagflx: a.left_arm.shoulder_sagittal_flexion_deg, L_elbow: a.left_arm.elbow_flexion_deg,
    R_arm_abd: a.right_arm.shoulder_abduction_deg, R_arm_sagflx: a.right_arm.shoulder_sagittal_flexion_deg, R_elbow: a.right_arm.elbow_flexion_deg,
    L_hip_flx: a.left_leg.hip_flexion_deg, L_hip_abd: a.left_leg.hip_abduction_deg, L_knee: a.left_leg.knee_flexion_deg,
    R_hip_flx: a.right_leg.hip_flexion_deg, R_hip_abd: a.right_leg.hip_abduction_deg, R_knee: a.right_leg.knee_flexion_deg,
    floating: a.balance.floating, over_support: a.balance.over_support,
    foot_x_range: a.balance.foot_x_range, feet_min_y: a.balance.feet_min_y,
    anomalies: a.anomalies.length, plausibility: a.plausibility_flags.length
  };
}
const beforeSum = summarize(beforeAnat);
const afterSum = summarize(afterAnat);

console.log('=== ' + poseId + ' ===');
console.log('instructions:', pose.instructions);
console.log('overrides:', JSON.stringify(overrides));
console.log('');
console.log('Field                       BEFORE     AFTER');
const keys = Object.keys(beforeSum);
for (const k of keys) {
  const b = beforeSum[k], a = afterSum[k];
  const bs = (typeof b === 'number') ? b.toFixed(1).padStart(7) : String(b).padStart(7);
  const as = (typeof a === 'number') ? a.toFixed(1).padStart(7) : String(a).padStart(7);
  const diff = (typeof b === 'number' && typeof a === 'number') ? (a - b).toFixed(1).padStart(7) : '';
  console.log('  ' + k.padEnd(25) + bs + '   ' + as + '   Δ=' + diff);
}
console.log('');
console.log('geometry_hash before:', geometryHash(beforeSkel), ' after:', geometryHash(afterSkel));
console.log('L leg desc:', afterAnat.left_leg.description);
console.log('R leg desc:', afterAnat.right_leg.description);
console.log('L arm desc:', afterAnat.left_arm.description);
console.log('R arm desc:', afterAnat.right_arm.description);
console.log('Torso desc:', afterAnat.torso.description);
console.log('Head  desc:', afterAnat.head.description);
if (afterAnat.anomalies.length) console.log('Anomalies:', JSON.stringify(afterAnat.anomalies));
if (afterAnat.plausibility_flags.length) console.log('Plausibility:', JSON.stringify(afterAnat.plausibility_flags));

// Also dump key joint coordinates after for forensic check
const aj = afterSkel;
function p(label, pt) { if (pt) console.log('  ' + label.padEnd(14) + ' x=' + pt.x.toFixed(3) + ' y=' + pt.y.toFixed(3) + ' z=' + pt.z.toFixed(3)); }
console.log('\nAFTER pose joint coordinates (body-frame):');
['hips','spine','neck','head','leftShoulder','rightShoulder','leftElbow','rightElbow','leftWrist','rightWrist','leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle','leftFoot','rightFoot'].forEach(k => p(k, aj[k]));
