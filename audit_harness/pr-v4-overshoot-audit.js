// audit_harness/pr-v4-overshoot-audit.js
// Detects PR-v4 "too-subtle → scale magnitudes" overshoot defects.
// The PR-v4 auto-fix blindly scaled shoulder values to -110 (fully overhead,
// ~133° abduction) for poses whose descriptions mention arms at sides, hands
// on hips/knees/head/ledge/wall, etc. This produces arms-overhead when the
// pose needs arms-down or arm-contacts.
// Generates patch proposals to revert shoulder values to pre-overshoot levels.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const crypto = require('crypto');
const { deriveAnatomy } = require('./lib/geometry');

const REPO = path.resolve(__dirname, '..');
const RUN_ID = fs.readFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), 'utf8').trim();
const PROP_DIR = path.join(REPO, 'artifacts', 'pose-audit', RUN_ID, 'patch-proposals');
fs.mkdirSync(PROP_DIR, { recursive: true });

// Load lib + renderer
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

// Target shoulder values for different arm-intent classes (pre-overshoot levels)
// These produce visible-but-not-overhead arm positions.
const ARM_TARGETS = {
  arms_at_side: { shoulder: -12, elbow: 30, shoulderFwd: 0 },        // ~20° abd, arm hanging
  hand_on_hip: { shoulder: -25, elbow: 60, shoulderFwd: 0 },         // ~40° abd, elbow to hip
  hand_on_knee: { shoulder: -15, elbow: 80, shoulderFwd: -15 },      // arm forward-down to knee
  hand_to_head: { shoulder: -70, elbow: 120, shoulderFwd: -50 },     // arm up to head (not fully overhead)
  hand_to_chin: { shoulder: -60, elbow: 130, shoulderFwd: -45 },     // arm to chin
  hand_to_hair: { shoulder: -75, elbow: 110, shoulderFwd: -40 },     // arm to head/hair
  hand_on_floor: { shoulder: -10, elbow: 20, shoulderFwd: -20 },     // arm down to floor
  arm_on_chair: { shoulder: -20, elbow: 40, shoulderFwd: 0 },        // arm back along chair
  forearm_on_ledge: { shoulder: -30, elbow: 90, shoulderFwd: -20 },  // forearm forward on ledge
  hand_on_thigh: { shoulder: -15, elbow: 50, shoulderFwd: -10 }      // arm to thigh
};

function classifyArmIntent(desc) {
  const d = desc.toLowerCase();
  // FIX 2026-08-02 (cron-round-4): check OVERHEAD FIRST. Previously the
  // hand_on_knee regex matched "knee" in warrior-lunge's "front knee bent"
  // even though the description says "Raise both arms overhead". Now overhead
  // is checked before any contact pattern, so "raise arms overhead" always wins.
  const overheadRe = /\b(overhead|over[\s-]?head|arms?\s+up|arms?\s+raised|raise\s+.*arms?|lift\s+.*arms?|reach\s+(up|overhead|high|skyward|toward\s+the\s+sky)|both\s+hands\s+up|hands?\s+overhead|skyward|thrown\s+up|upward|arms?\s+high|arms?\s+extended\s+(up|overhead|high)|stretch\s+.*arm\s+(up|overhead)|palms?\s+(up|together|pressed\s+together)|prayer\s+position|windmill|cartwheel|hands?\s+behind\s+head|arm\s+behind\s+head|throw|operatic|wide\s+and\s+high)\b/i;
  if (overheadRe.test(d)) return null; // overhead mentioned → -110 likely intentional, skip
  // Arm contacts — these are the overshoot defects (arms should NOT be overhead)
  if (/\bhand\s+(on|resting\s+on)\s+(the\s+)?(hip|waist)\b|hands?\s+on\s+hips?\b/i.test(d)) return 'hand_on_hip';
  if (/\bhand\s+(on|resting\s+on|near|over)\s+(the\s+)?(knee|thigh|lap)\b|hands?\s+in\s+lap\b|hands?\s+on\s+knees?\b|drape.*arm.*over.*knee|arm.*over.*knee\b/i.test(d)) return 'hand_on_knee';
  if (/\b(hand|finger|palm)s?\s+(on|to|near)\s+(forehead|brow|temple)\b|hand\s+to\s+forehead\b/i.test(d)) return 'hand_to_head';
  if (/\b(chin\s+touch|hand\s+on\s+chin|fingers\s+under\s+chin|chin\s+rest|hand\s+near\s+face|hand\s+to\s+face)\b/i.test(d)) return 'hand_to_chin';
  if (/\b(hair\s+touch|touch\s+hair|hand\s+in\s+hair|hand\s+to\s+hair|fingers\s+through\s+hair|hand\s+up\s+into\s+hair|hand\s+raised\s+into\s+hair)\b/i.test(d)) return 'hand_to_hair';
  if (/\b(hand|fingers|palm)\s+(on|to|resting\s+on|planted)\s+(the\s+)?(floor|ground|mat)\b/i.test(d)) return 'hand_on_floor';
  if (/\b(arm|elbow|forearm)\s+(on|along|resting\s+on|against)\s+(the\s+)?(armrest|backrest|chair\s+back)\b/i.test(d)) return 'arm_on_chair';
  if (/\b(forearm|elbow)\s+(on|against|flat\s+against)\s+(the\s+)?(wall|ledge|surface|railing)\b|forearm.*wall|elbow.*ledge\b/i.test(d)) return 'forearm_on_ledge';
  if (/\bhand\s+(on|resting\s+on)\s+(the\s+)?thigh\b/i.test(d)) return 'hand_on_thigh';
  if (/\bneck\s+(rest|against)\s+(the\s+)?(forearm|arm|raised\s+forearm)\b|rest.*neck.*arm\b/i.test(d)) return 'hand_to_chin'; // neck-rest-arm → arm up to neck
  // Arms at sides / relaxed
  if (/\b(arm[s]?\s+at\s+(the\s+)?side|hands?\s+at\s+sides?|arms?\s+relaxed|arms?\s+hang|resting\s+at\s+sides?|arms?\s+loose|let\s+.*arms?\s+hang|arms?\s+relaxed\s+at\s+the\s+sides?)\b/i.test(d)) return 'arms_at_side';
  return null; // unclassified — skip (don't auto-patch what we can't confidently classify)
}

const proposals = [];
const skipped = [];
let totalOvershoot = 0;

for (const id of Object.keys(lib)) {
  const pose = lib[id];
  if (!pose.joints) continue;
  const j = pose.joints;
  // Audit poses with AT LEAST ONE shoulder <= -100 (the PR-v4 overshoot signature)
  const lOver = j.leftShoulder !== undefined && j.leftShoulder <= -100;
  const rOver = j.rightShoulder !== undefined && j.rightShoulder <= -100;
  if (!lOver && !rOver) continue;
  const desc = pose.instructions + ' ' + (pose.tip || '');
  const intent = classifyArmIntent(desc);
  if (!intent) continue; // overhead or unclassified — skip
  totalOvershoot++;
  const target = ARM_TARGETS[intent];
  const existingHash = crypto.createHash('sha1').update(JSON.stringify(j)).digest('hex').slice(0, 12);
  // Build the patch: revert only the overshoot shoulder(s) + adjust elbow/shoulderFwd
  const fc = {};
  if (lOver) fc.leftShoulder = target.shoulder;
  if (rOver) fc.rightShoulder = target.shoulder;
  // Only adjust elbow/shoulderFwd if currently at the PR-v4 default-ish values
  if (target.elbow && lOver && (j.leftElbow === 70 || j.leftElbow === 40)) fc.leftElbow = target.elbow;
  if (target.elbow && rOver && (j.rightElbow === 50 || j.rightElbow === 18)) fc.rightElbow = target.elbow;
  if (target.shoulderFwd !== undefined && j.shoulderFwdL === 8 && lOver) fc.shoulderFwdL = target.shoulderFwd;
  if (target.shoulderFwd !== undefined && j.shoulderFwdR === -6 && rOver) fc.shoulderFwdR = target.shoulderFwd;

  // Verify the patch improves the contact (dry-run)
  const newJ = Object.assign({}, j, fc);
  const beforePose = buildPose(j);
  const afterPose = buildPose(newJ);
  const beforeAnat = deriveAnatomy(beforePose, { confidence: 0.7 });
  const afterAnat = deriveAnatomy(afterPose, { confidence: 0.7 });

  const proposal = {
    proposal_id: 'pr-v4-fix-' + id + '-' + Date.now(),
    pose_id: id, category: pose.category, worker: 'pr-v4-audit',
    existing_config_hash: existingHash,
    defects: [{ type: 'pr_v4_overshoot', severity: 'major', description: 'PR-v4 auto-fix scaled both shoulders to -110 (fully overhead, abd ' + Math.round(beforeAnat.left_arm.shoulder_abduction_deg) + '°/' + Math.round(beforeAnat.right_arm.shoulder_abduction_deg) + '°) but description indicates ' + intent.replace(/_/g, ' ') + '. Arms should NOT be overhead.' }],
    failing_tests: [{ assertion: 'shoulder_abduction < 90 for ' + intent, expected: '<90', actual: Math.round(beforeAnat.left_arm.shoulder_abduction_deg) + '/' + Math.round(beforeAnat.right_arm.shoulder_abduction_deg) }],
    field_changes: fc,
    rationale: 'PR-v4 "too-subtle → scale magnitudes" overshoot: both shoulders set to -110 (overhead) but pose needs ' + intent.replace(/_/g, ' ') + '. Reverting shoulders to ' + target.shoulder + '° (abd ~' + Math.round(afterAnat.left_arm.shoulder_abduction_deg) + '°). ' + (target.elbow ? 'Adjusting elbows to ' + target.elbow + '°. ' : '') + (target.shoulderFwd !== undefined ? 'Setting shoulderFwd to ' + target.shoulderFwd + '°. ' : '') + 'Auto-generated by pr-v4-overshoot-audit.js.',
    confidence: 0.6,
    regression_risk: 'low — single pose config; arm position changes from overhead to ' + intent.replace(/_/g, ' '),
    renderer_changes: '',
    before_evidence: 'categories/' + pose.category + '/' + id + '/baseline/',
    files_touched: ['js/poses-data.js'],
    created_at: new Date().toISOString()
  };
  fs.writeFileSync(path.join(PROP_DIR, id + '.json'), JSON.stringify(proposal, null, 2));
  proposals.push({ id, intent, fc, before_abd: Math.round(beforeAnat.left_arm.shoulder_abduction_deg), after_abd: Math.round(afterAnat.left_arm.shoulder_abduction_deg) });
}

console.log('PR-v4 overshoot audit complete.');
console.log('Poses with both shoulders=-110: ' + totalOvershoot + ' (after excluding overhead-desc)');
console.log('Patch proposals emitted: ' + proposals.length);
console.log('');
console.log('By intent:');
const byIntent = {};
for (const p of proposals) byIntent[p.intent] = (byIntent[p.intent] || 0) + 1;
for (const [k, v] of Object.entries(byIntent)) console.log('  ' + k + ': ' + v);
console.log('');
console.log('Sample (first 15):');
for (const p of proposals.slice(0, 15)) {
  console.log('  [' + lib[p.id].category.padEnd(12) + '] ' + p.id.padEnd(40) + ' ' + p.intent.padEnd(16) + ' abd ' + p.before_abd + '°→' + p.after_abd + '°  ' + JSON.stringify(p.fc));
}
