// audit_harness/fix-left-leg-standing.js
// Detects + fixes the LEFT_LEG_STANDING pattern (worker-C finding from batch-4):
// kneeling/seated poses where the pose author set the RIGHT leg for kneeling
// (rightHip>50, rightKnee>60) but forgot the LEFT leg (leftHip<30, leftKnee<10).
// This produces an asymmetric base where one leg kneels and the other stands
// straight — wrong for poses that describe both knees down or a kneeling base.
// TRUTH: leftHip + = leg swings forward; leftKnee + = shin bends backward.
// For kneeling: both hips should be flexed (~70-90) + both knees bent (~90-130).
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const REPO = path.resolve(__dirname, '..');
const DATA = path.join(REPO, 'js', 'poses-data.js');
const LEDGER = path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'pose-validation-ledger.jsonl');
const RUN_ID = fs.readFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), 'utf8').trim();

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

const toFix = [];
for (const id of Object.keys(lib)) {
  const p = lib[id];
  if (!p.joints) continue;
  const j = p.joints;
  const lHip = j.leftHip || 0, rHip = j.rightHip || 0;
  const lKnee = j.leftKnee || 0, rKnee = j.rightKnee || 0;
  // Pattern: right leg is kneeling (hip flexed >50, knee bent >60) but left leg is standing (hip <30, knee <10)
  if (rHip > 50 && rKnee > 60 && lHip < 30 && lKnee < 15) {
    // Check if description says "both knees" or "kneel" (both knees down) — if so, this is a defect
    const d = (p.instructions + ' ' + (p.tip || '')).toLowerCase();
    const bothKnees = /\b(both\s+knees?|kneel\s+(down|upright)|kneeling\s+base|on\s+(both\s+)?knees?|knees\s+(down|together|apart|hip-width))\b/i.test(d);
    const oneKnee = /\b(one\s+knee|kneel\s+on\s+one|single\s+knee|half[\s-]kneel)\b/i.test(d);
    // Skip if desc says one knee (asymmetric is intentional) or if globalTilt (reclining)
    if (oneKnee) continue;
    if (j.globalTilt && Math.abs(j.globalTilt) > 30) continue; // reclining poses have different leg semantics
    toFix.push({ id, cat: p.category, lHip, rHip, lKnee, rKnee, bothKnees, desc: p.instructions.slice(0, 70) });
  }
}

console.log('LEFT_LEG_STANDING defects: ' + toFix.length);

// Backup
const bak = DATA + '.bak-pre-leftleg-fix';
if (!fs.existsSync(bak)) fs.copyFileSync(DATA, bak);

// For each defect: set leftHip = rightHip (mirror the kneeling hip) and leftKnee = rightKnee (mirror the kneeling knee)
// This makes both legs symmetric — the smallest valid fix for a "both knees" kneeling pose.
function flipValueInText(text, poseId, field, oldVal, newVal) {
  const idPattern = new RegExp("['\"]" + poseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]\\s*:\\s*\\{");
  const m = idPattern.exec(text);
  if (!m) return { found: false };
  const poseStart = m.index;
  const jointsRe = /joints\s*:\s*\{/g;
  jointsRe.lastIndex = poseStart;
  const jm = jointsRe.exec(text);
  if (!jm) return { found: false };
  const blockStart = jm.index + (jm[0].length - 1);
  let depth = 1; let j = blockStart + 1;
  while (j < text.length && depth > 0) {
    if (text[j] === '{') depth++;
    else if (text[j] === '}') depth--;
    if (depth === 0) break;
    j++;
  }
  if (depth !== 0) return { found: false };
  const blockEnd = j;
  const blockText = text.slice(blockStart, blockEnd + 1);
  const keyIdx = blockText.indexOf(field);
  if (keyIdx === -1) return { found: false };
  let p = keyIdx + field.length;
  while (p < blockText.length && /\s/.test(blockText[p])) p++;
  if (blockText[p] !== ':') return { found: false };
  p++;
  while (p < blockText.length && /\s/.test(blockText[p])) p++;
  const numStart = p;
  let q = numStart;
  if (blockText[q] === '-' || blockText[q] === '+') q++;
  while (q < blockText.length && /[\d.]/.test(blockText[q])) q++;
  const numText = blockText.slice(numStart, q);
  if (!numText || !/^-?\d+\.?\d*$/.test(numText)) return { found: false };
  const currentVal = parseFloat(numText);
  if (currentVal !== oldVal) return { found: false, stale: true, currentVal };
  const numBegin = blockStart + numStart;
  const numEnd = blockStart + q;
  const newText = text.slice(0, numBegin) + String(newVal) + text.slice(numEnd);
  return { found: true, newText, numBegin, numEnd };
}

let text = fs.readFileSync(DATA, 'utf8');
const applied = [];
const skipped = [];
let ledgerLines = '';

for (const { id, cat, lHip, rHip, lKnee, rKnee, bothKnees, desc } of toFix) {
  const fc = {};
  let textChanged = false;
  // Set leftHip = rightHip (mirror)
  if (lHip !== rHip) {
    const r = flipValueInText(text, id, 'leftHip', lHip, rHip);
    if (r.found) { text = r.newText; fc.leftHip = rHip; textChanged = true; }
    else if (r.stale) { skipped.push({ id, reason: 'leftHip stale' }); }
  }
  // Set leftKnee = rightKnee (mirror)
  if (lKnee !== rKnee) {
    const r = flipValueInText(text, id, 'leftKnee', lKnee, rKnee);
    if (r.found) { text = r.newText; fc.leftKnee = rKnee; textChanged = true; }
    else if (r.stale) { skipped.push({ id, reason: 'leftKnee stale' }); }
  }
  if (!textChanged) { skipped.push({ id, reason: 'no change applied' }); continue; }
  if (fc.leftHip !== undefined) lib[id].joints.leftHip = fc.leftHip;
  if (fc.leftKnee !== undefined) lib[id].joints.leftKnee = fc.leftKnee;
  applied.push({ id, cat, lHip, rHip, lKnee, rKnee, fc, bothKnees });
  ledgerLines += JSON.stringify({
    run_id: RUN_ID, pose_id: id, category: cat, worker: 'left-leg-standing-fix',
    source_config_hash: crypto.createHash('sha1').update(JSON.stringify(lib[id].joints)).digest('hex').slice(0, 12),
    applied: true, code_changes: Object.keys(fc),
    field_changes: fc, rationale: 'LEFT_LEG_STANDING fix: right leg was kneeling (hip=' + rHip + ', knee=' + rKnee + ') but left leg standing (hip=' + lHip + ', knee=' + lKnee + '). Mirrored left to match right for symmetric kneeling base.',
    final_status: 'applied_left_leg_fix', ts: new Date().toISOString()
  }) + '\n';
}

fs.writeFileSync(DATA, text);
fs.appendFileSync(LEDGER, ledgerLines);

console.log('Applied: ' + applied.length + ' left-leg-standing fixes');
console.log('Skipped: ' + skipped.length);
if (skipped.length) for (const s of skipped) console.log('  SKIP: ' + s.id + ' — ' + s.reason);
console.log('\nFixed poses:');
for (const a of applied) console.log('  [' + a.cat.padEnd(12) + '] ' + a.id.padEnd(44) + ' leftHip ' + a.lHip + '→' + a.fc.leftHip + ' leftKnee ' + a.lKnee + '→' + a.fc.leftKnee + (a.bothKnees ? ' [both-knees desc]' : ''));
console.log('\nBackup: ' + bak);
