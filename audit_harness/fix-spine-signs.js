// audit_harness/fix-spine-signs.js
// Corrects spine sign errors across the library. Many poses have spine values
// with the WRONG sign: description says "lean forward" but spine is negative
// (back arch), or description says "back arch/lean back" but spine is positive
// (forward). This was caused by the PR-v3 "auto-fix spine sign error" script
// which mis-fired on context-ambiguous phrases.
// TRUTH: spine + = forward lean, - = backward arch (verified Phase 0).
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

// Classify spine intent from description
// FIX 2026-08-02 (cron-round-9): broadened regex to catch "lean the torso back",
// "leaning the torso back", "back against" (wall/floor) — patterns missed by
// cron-round-4 that workers found in batch-3 (glass-lean, low-wall-sit, stool-lean-back).
function classifySpineIntent(desc) {
  const d = desc.toLowerCase();
  // Forward lean (spine should be POSITIVE)
  const fwdLean = /\b(forward\s+(lean|fold|hinge|round|tilt|hunch|curve|bend)|lean\s+forward|fold\s+forward|hinge\s+from\s+the\s+hips?|round\s+(forward|the\s+back)|hunch\s+forward|curve\s+forward|bend\s+forward|torso\s+forward|chest\s+forward|drive\s+the\s+chest\s+forward|lead\s+with\s+the\s+chest|lean\s+the\s+torso\s+forward|leaning\s+forward|rest\s+the\s+forehead)\b/i.test(d);
  // Back arch / backward lean (spine should be NEGATIVE, unless globalTilt reclines)
  const backArch = /\b(arch\s+(backward|backwards|the\s+back|spine\s+back|back)|backward\s+arch|back\s+arch|lean\s+back|recline\s+back|chest\s+up|spine\s+arch|backbend|back\s+bend|arch\s+the\s+back|lean\s+(the\s+)?torso\s+back|leaning\s+(the\s+)?torso\s+back|leaning\s+back|back\s+against\s+(the\s+)?(wall|floor|ground|surface)|back\s+flat\s+against)\b/i.test(d);
  if (fwdLean && !backArch) return 'forward'; // unambiguous forward
  if (backArch && !fwdLean) return 'back';    // unambiguous back arch
  return null; // ambiguous or neither — skip
}

const toFlip = [];
for (const id of Object.keys(lib)) {
  const p = lib[id];
  if (!p.joints || p.joints.spine === undefined) continue;
  const spine = p.joints.spine;
  if (Math.abs(spine) < 3) continue; // too small to matter
  const desc = p.instructions + ' ' + (p.tip || '');
  const intent = classifySpineIntent(desc);
  if (!intent) continue;
  // globalTilt reclining poses: spine direction is relative to the tilted body,
  // so the sign check doesn't apply cleanly. Skip if globalTilt present.
  if (p.joints.globalTilt && Math.abs(p.joints.globalTilt) > 30) continue;
  const wrongSign = (intent === 'forward' && spine < -3) || (intent === 'back' && spine > 3);
  if (wrongSign) toFlip.push({ id, cat: p.category, spine, intent, desc: p.instructions.slice(0, 70) });
}

console.log('Spine sign defects to flip: ' + toFlip.length);

// Backup
const bak = DATA + '.bak-pre-spine-fix';
if (!fs.existsSync(bak)) fs.copyFileSync(DATA, bak);

// Pose-scoped spine value replacer (uses the fixed joints-block finder pattern)
function flipSpineInText(text, poseId, oldVal, newVal) {
  const idPattern = new RegExp("['\"]" + poseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]\\s*:\\s*\\{");
  const m = idPattern.exec(text);
  if (!m) return { found: false };
  const poseStart = m.index;
  // Find the joints block (regex skips comments)
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
  // Find spine: <number> within the block. Use indexOf on the blockText to
  // get a reliable offset (regex .lastIndex after non-global exec is unreliable
  // for computing the match start — it caused the joints-N{ corruption bug).
  const blockText = text.slice(blockStart, blockEnd + 1);
  const spineKey = 'spine';
  const keyIdx = blockText.indexOf(spineKey);
  if (keyIdx === -1) return { found: false };
  // After 'spine', skip whitespace, expect ':', skip whitespace, then number
  let p = keyIdx + spineKey.length;
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

for (const { id, cat, spine, intent, desc } of toFlip) {
  const newVal = -spine;
  const result = flipSpineInText(text, id, spine, newVal);
  if (!result.found) {
    skipped.push({ id, reason: result.stale ? 'stale value' : 'spine not found' });
    continue;
  }
  text = result.newText;
  lib[id].joints.spine = newVal;
  applied.push({ id, cat, oldVal: spine, newVal, intent });
  ledgerLines += JSON.stringify({
    run_id: RUN_ID, pose_id: id, category: cat, worker: 'spine-sign-fix',
    source_config_hash: crypto.createHash('sha1').update(JSON.stringify(lib[id].joints)).digest('hex').slice(0, 12),
    applied: true, code_changes: ['spine'],
    field_changes: { spine: { from: spine, to: newVal } },
    rationale: 'spine sign correction: description says ' + intent + ' but spine was ' + spine + ' (wrong sign). TRUTH: + = forward, - = back arch. Flipped to ' + newVal + '.',
    final_status: 'applied_spine_sign_fix', ts: new Date().toISOString()
  }) + '\n';
}

fs.writeFileSync(DATA, text);
fs.appendFileSync(LEDGER, ledgerLines);

console.log('Applied: ' + applied.length + ' spine sign flips');
console.log('Skipped: ' + skipped.length);
if (skipped.length) for (const s of skipped) console.log('  SKIP: ' + s.id + ' — ' + s.reason);
console.log('\nFlipped poses:');
for (const a of applied) console.log('  [' + a.cat.padEnd(12) + '] ' + a.id.padEnd(44) + ' spine: ' + String(a.oldVal).padStart(4) + ' → ' + String(a.newVal).padStart(4) + '  [' + a.intent + ']');
console.log('\nBackup: ' + bak);
