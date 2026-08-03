// audit_harness/apply-patches.js
// Applies accepted patch proposals to js/poses-data.js via pose-scoped joints-
// block replacement. Preserves all comments, PR-v* annotations, and unrelated
// poses. Only touches the joints object of each accepted pose. Creates a
// .bak backup before writing. Skips rejected/stale patches.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const REPO = path.resolve(__dirname, '..');
const RUN_ID = fs.readFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), 'utf8').trim();
const PROP_DIR = path.join(REPO, 'artifacts', 'pose-audit', RUN_ID, 'patch-proposals');
const DATA = path.join(REPO, 'js', 'poses-data.js');
const LEDGER = path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'pose-validation-ledger.jsonl');

// Load current lib to compute hashes + get old joints for verification
function loadLib() {
  let src = fs.readFileSync(DATA, 'utf8');
  src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
  src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
  src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
  const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
  vm.runInContext(src, sb, { filename: 'poses-data.js' });
  return sb.POSES_LIBRARY;
}
const lib = loadLib();

const proposals = fs.readdirSync(PROP_DIR).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(PROP_DIR, f), 'utf8')));

// Pose-scoped joints-block finder: returns {start, end} char offsets of the
// joints object (including `joints: {` ... `}`) for a given pose id.
// FIX 2026-08-02: uses regex `joints\s*:\s*\{` instead of indexOf('joints')
// to skip PR-v* comments that contain the word "joints" (e.g. "auto-fix too-
// subtle joints: leftShoulder..."). The regex requires `{` after the colon,
// which only the actual property has.
function findJointsBlock(text, poseId) {
  const idPattern = new RegExp("['\"]" + poseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]\\s*:\\s*\\{");
  const m = idPattern.exec(text);
  if (!m) return null;
  const poseStart = m.index;
  // Find the `joints:` PROPERTY (followed by {), skipping any `//` comments
  const jointsRe = /joints\s*:\s*\{/g;
  jointsRe.lastIndex = poseStart;
  const jm = jointsRe.exec(text);
  if (!jm) return null;
  const blockStart = jm.index + (jm[0].length - 1); // index of the `{`
  // Find matching } — joints has no nested objects, so first } at depth 0
  let depth = 1; let j = blockStart + 1;
  while (j < text.length && depth > 0) {
    if (text[j] === '{') depth++;
    else if (text[j] === '}') depth--;
    if (depth === 0) break;
    j++;
  }
  if (depth !== 0) return null;
  return { start: blockStart, end: j };
}

// Format a joints object as the inline style used in poses-data.js
function formatJoints(joints) {
  const keys = ['spine','hips','neck','leftShoulder','rightShoulder','leftElbow','rightElbow',
    'hipAbductL','hipAbductR','leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle',
    'shoulderFwdL','shoulderFwdR','globalTilt','globalTwist','globalRoll'];
  const known = keys.filter(k => joints[k] !== undefined);
  const others = Object.keys(joints).filter(k => !keys.includes(k));
  const order = known.concat(others);
  return '{' + order.map(k => k + ': ' + joints[k]).join(', ') + '}';
}

// Backup
const bak = DATA + '.bak-pre-integrate';
if (!fs.existsSync(bak)) fs.copyFileSync(DATA, bak);

let text = fs.readFileSync(DATA, 'utf8');
const applied = [];
const skipped = [];
let ledgerLines = '';

for (const p of proposals) {
  const pose = lib[p.pose_id];
  if (!pose) { skipped.push({ id: p.pose_id, reason: 'not found' }); continue; }
  const curHash = crypto.createHash('sha1').update(JSON.stringify(pose.joints)).digest('hex').slice(0, 12);
  if (curHash !== p.existing_config_hash) { skipped.push({ id: p.pose_id, reason: 'stale hash' }); continue; }
  if (!p.field_changes || !Object.keys(p.field_changes).length) { skipped.push({ id: p.pose_id, reason: 'no field changes (clean)' }); continue; }

  // Re-validate signs (mirror integrate-patches.js)
  const desc = ((pose.instructions || '') + ' ' + (pose.tip || '')).toLowerCase();
  let reject = false;
  // CORRECTED 2026-08-02: +90=PRONE, -90=SUPINE (was inverted before)
  if ('globalTilt' in p.field_changes) {
    const v = p.field_changes.globalTilt;
    if (/\b(on (the )?back|supine|lie back|recline.*back|on back)\b/i.test(pose.instructions) && v > 0) reject = true;
    if (/\b(prone|face[\s-]down|all fours|on (the )?front|belly)\b/i.test(pose.instructions) && v < 0) reject = true;
  }
  for (const k of ['shoulderFwdL', 'shoulderFwdR']) {
    if (k in p.field_changes && /\b(arm[s]?\s+forward|reach\s+forward|hands?\s+forward|extend\s+arm[s]?\s+forward)\b/i.test(pose.instructions) && p.field_changes[k] > 0) reject = true;
  }
  for (const k of ['hipAbductL', 'hipAbductR']) {
    if (k in p.field_changes && /\b(apart|wide|spread|legs?\s+wide)\b/i.test(pose.instructions) && p.field_changes[k] > 0) reject = true;
  }
  if (reject) { skipped.push({ id: p.pose_id, reason: 'sign-error in patch (rejected by integrator)' }); continue; }

  const block = findJointsBlock(text, p.pose_id);
  if (!block) { skipped.push({ id: p.pose_id, reason: 'joints block not found' }); continue; }

  const newJoints = Object.assign({}, pose.joints, p.field_changes);
  const newBlock = formatJoints(newJoints);
  text = text.slice(0, block.start) + newBlock + text.slice(block.end + 1);
  // Update lib so subsequent hashes reflect the change (in case of duplicate ids — shouldn't happen)
  lib[p.pose_id].joints = newJoints;
  applied.push({ id: p.pose_id, worker: p.worker, changes: p.field_changes, new_hash: crypto.createHash('sha1').update(JSON.stringify(newJoints)).digest('hex').slice(0, 12) });

  // Ledger entry
  ledgerLines += JSON.stringify({ run_id: RUN_ID, pose_id: p.pose_id, category: p.category, worker: p.worker,
    source_config_hash: curHash, applied: true, code_changes: Object.keys(p.field_changes),
    field_changes: p.field_changes, final_status: 'applied_pending_redteam', ts: new Date().toISOString() }) + '\n';
}

fs.writeFileSync(DATA, text);
fs.appendFileSync(LEDGER, ledgerLines);

console.log('Applied: ' + applied.length + ' patches to js/poses-data.js');
console.log('Skipped: ' + skipped.length);
if (skipped.length) {
  console.log('Skipped details:');
  for (const s of skipped) console.log('  - ' + s.id + ': ' + s.reason);
}
console.log('Backup: ' + bak);
console.log('Applied poses:');
for (const a of applied) console.log('  - ' + a.id + ' [' + a.worker + '] ' + JSON.stringify(a.changes).slice(0, 80) + ' hash=' + a.new_hash);
