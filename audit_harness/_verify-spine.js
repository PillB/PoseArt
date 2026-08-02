// Dry-run verify spine fix
const vm = require('vm'), fs = require('fs');
const fakeCanvas = { getContext: () => ({ scale: () => {} }), style: {}, classList: { add: () => {} }, width: 0, height: 0 };
const rsb = { console, Math, Date, Object, Array, JSON, document: { createElement: () => fakeCanvas } };
rsb.window = rsb; rsb.globalThis = rsb; vm.createContext(rsb);
vm.runInContext(fs.readFileSync('js/pose-skeleton-3d.js', 'utf8'), rsb);
const buildPose = rsb.PoseSkeleton3D._internals.buildPose;

let src = fs.readFileSync('js/poses-data.js', 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;

for (const id of ['seated-v-stretch', 'elbow-prop', 'kneeling-lean-forward', 'run-freeze']) {
  const p = lib[id];
  const posed = buildPose(p.joints);
  const neck = posed.neck, hips = posed.hips;
  const torsoVec = { x: neck.x - hips.x, y: neck.y - hips.y, z: neck.z - hips.z };
  const flexion = Math.atan2(torsoVec.z, torsoVec.y) * 180 / Math.PI;
  console.log(id + ': spine=' + p.joints.spine + ' -> derived torso flexion=' + Math.round(flexion) + ' deg (+:forward)');
}
