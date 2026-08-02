// audit_harness/fix-globaltilt-signs.js
// Corrects the library-wide globalTilt sign inversion. 46 poses had wrong-sign
// globalTilt values because their authors relied on the inverted renderer
// comment (which claimed +90=supine but +90 is actually PRONE). This script
// negates globalTilt for exactly those 46 poses, preserving all other fields,
// comments, and unrelated poses. Backup at .bak-pre-globaltilt-fix.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const REPO = path.resolve(__dirname, '..');
const DATA = path.join(REPO, 'js', 'poses-data.js');
const LEDGER = path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'pose-validation-ledger.jsonl');
const RUN_ID = fs.readFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), 'utf8').trim();

// Load current lib to identify the 46 poses
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

// Identify poses with wrong globalTilt sign (same logic as cross-check)
const toFlip = [];
for (const id of Object.keys(lib)) {
  const p = lib[id];
  if (!p.joints || p.joints.globalTilt === undefined) continue;
  const t = p.joints.globalTilt;
  if (Math.abs(t) < 10) continue;
  const d = (p.instructions + ' ' + (p.tip || '')).toLowerCase();
  const supineDesc = /\b(on (the )?back|supine|lie back|lying on back|recline.*back|back.*reclin|back lying|lying back)\b/.test(d) && !/\bprone|face[\s-]down|belly\b/.test(d);
  const proneDesc = /\b(prone|face[\s-]down|on (the )?front|belly down|all fours|hands and knees)\b/.test(d) && !/\bon back\b/.test(d);
  if (!supineDesc && !proneDesc) continue;
  const wrongSign = (supineDesc && t > 0) || (proneDesc && t < 0);
  if (wrongSign) toFlip.push({ id, oldVal: t, newVal: -t, desc: supineDesc ? 'supine' : 'prone' });
}

console.log('Poses to flip: ' + toFlip.length);

// Backup
const bak = DATA + '.bak-pre-globaltilt-fix';
if (!fs.existsSync(bak)) fs.copyFileSync(DATA, bak);

// Pose-scoped globalTilt value replacer: finds the joints block first (skipping
// PR-v* comments), then finds `globalTilt: <number>` WITHIN that block and
// replaces the number. This avoids matching "globalTilt" in comments like
// `// PR-v7 — fix recline_missing: "Lie on the back" → globalTilt:-85`.
function flipGlobalTiltInText(text, poseId, oldVal, newVal) {
  const idPattern = new RegExp("['\"]" + poseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]\\s*:\\s*\\{");
  const m = idPattern.exec(text);
  if (!m) return { found: false };
  const poseStart = m.index;
  // Step 1: find the `joints: {` PROPERTY (regex requires { after colon,
  // which skips comments that have "joints:" followed by text)
  const jointsRe = /joints\s*:\s*\{/g;
  jointsRe.lastIndex = poseStart;
  const jm = jointsRe.exec(text);
  if (!jm) return { found: false };
  const blockStart = jm.index + (jm[0].length - 1); // index of `{`
  // Step 2: find matching } for the joints block
  let depth = 1; let j = blockStart + 1;
  while (j < text.length && depth > 0) {
    if (text[j] === '{') depth++;
    else if (text[j] === '}') depth--;
    if (depth === 0) break;
    j++;
  }
  if (depth !== 0) return { found: false };
  const blockEnd = j;
  // Step 3: find globalTilt: <number> WITHIN the joints block only.
  // FIX 2026-08-02: use indexOf-based parsing (regex .lastIndex after non-global
  // exec is unreliable for match-start computation — caused joints-N{ corruption).
  const blockText = text.slice(blockStart, blockEnd + 1);
  const key = 'globalTilt';
  const keyIdx = blockText.indexOf(key);
  if (keyIdx === -1) return { found: false };
  let p = keyIdx + key.length;
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

for (const { id, oldVal, newVal, desc } of toFlip) {
  const result = flipGlobalTiltInText(text, id, oldVal, newVal);
  if (!result.found) {
    skipped.push({ id, reason: result.stale ? 'stale value (expected ' + oldVal + ' got ' + result.currentVal + ')' : 'globalTilt not found' });
    continue;
  }
  text = result.newText;
  lib[id].joints.globalTilt = newVal;
  applied.push({ id, oldVal, newVal, desc });
  ledgerLines += JSON.stringify({
    run_id: RUN_ID, pose_id: id, category: lib[id].category, worker: 'integrator-2',
    source_config_hash: crypto.createHash('sha1').update(JSON.stringify(lib[id].joints)).digest('hex').slice(0, 12),
    applied: true, code_changes: ['globalTilt'],
    field_changes: { globalTilt: { from: oldVal, to: newVal } },
    rationale: 'globalTilt sign correction: old comment was INVERTED (+90=supine claimed, but +90=PRONE verified). Description says ' + desc + ' so sign flipped ' + oldVal + ' → ' + newVal + '.',
    final_status: 'applied_globaltilt_sign_fix', ts: new Date().toISOString()
  }) + '\n';
}

fs.writeFileSync(DATA, text);
fs.appendFileSync(LEDGER, ledgerLines);

console.log('Applied: ' + applied.length + ' globalTilt sign flips');
console.log('Skipped: ' + skipped.length);
if (skipped.length) for (const s of skipped) console.log('  SKIP: ' + s.id + ' — ' + s.reason);
console.log('\nFlipped poses:');
for (const a of applied) console.log('  ' + a.id.padEnd(48) + ' globalTilt: ' + String(a.oldVal).padStart(4) + ' → ' + String(a.newVal).padStart(4) + '  [' + a.desc + ']');
console.log('\nBackup: ' + bak);
