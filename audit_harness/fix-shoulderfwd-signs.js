// audit_harness/fix-shoulderfwd-signs.js
// Detects + fixes shoulderFwd sign errors across the library. The renderer
// comment was INVERTED: "+ = arm swings forward" but actually "+ = BEHIND".
// Many poses have shoulderFwd values with the WRONG sign because authors
// relied on the inverted comment.
// TRUTH: shoulderFwd + = BEHIND (posterior), - = FORWARD (anterior).
// This script checks description cues ("arms forward/reach forward" → should
// be negative; "arms behind/clasp behind back" → should be positive) and
// flips wrong-sign values. Only flips when the description cue is UNAMBIGUOUS.
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

// Classify shoulderFwd intent from description. Returns 'forward', 'behind', or null.
function classifyShoulderFwdIntent(desc) {
  const d = desc.toLowerCase();
  // Forward arm cues (shoulderFwd should be NEGATIVE)
  const fwdArm = /\b(arm[s]?\s+forward|reach\s+forward|hands?\s+forward|extend\s+arm[s]?\s+forward|arms?\s+(in\s+front|forward)|forward.*arm|arm.*forward|reach\s+out\s+forward|hands?\s+in\s+front|extend\s+(both\s+)?hands?\s+forward|extend\s+.*forward|reach\s+.*forward|forward\s+reach|hands?\s+forward|arms?\s+extended\s+forward|chopping\s+motion|casting\s+a\s+spell|hands?\s+clasp(ed)?\s+in\s+front|hands?\s+(together\s+)?in\s+front)\b/i.test(d);
  // Behind arm cues (shoulderFwd should be POSITIVE)
  const behindArm = /\b(arm[s]?\s+behind|hands?\s+behind|arm[s]?\s+(back|backward)|clasp\s+.*behind|behind\s+(the\s+)?(back|head|torso)|hands?\s+behind\s+(the\s+)?back|hands?\s+clasped\s+behind|arm\s+behind\s+(the\s+)?(back|head)|rest\s+.*behind)\b/i.test(d);
  if (fwdArm && !behindArm) return 'forward';
  if (behindArm && !fwdArm) return 'behind';
  return null; // ambiguous or neither — skip
}

const toFlip = [];
for (const id of Object.keys(lib)) {
  const p = lib[id];
  if (!p.joints) continue;
  const j = p.joints;
  const sL = j.shoulderFwdL, sR = j.shoulderFwdR;
  if (sL === undefined && sR === undefined) continue;
  const desc = p.instructions + ' ' + (p.tip || '');
  const intent = classifyShoulderFwdIntent(desc);
  if (!intent) continue;
  // Check sign correctness per intent
  // TRUTH: - = forward, + = behind
  if (intent === 'forward') {
    // Should be negative. Wrong if positive (>5).
    const lWrong = sL !== undefined && sL > 5;
    const rWrong = sR !== undefined && sR > 5;
    if (lWrong || rWrong) toFlip.push({ id, cat: p.category, intent, sL, sR, lWrong, rWrong, reason: 'desc says arms forward but shoulderFwd positive (=behind)' });
  } else if (intent === 'behind') {
    // Should be positive. Wrong if negative (<-5).
    const lWrong = sL !== undefined && sL < -5;
    const rWrong = sR !== undefined && sR < -5;
    if (lWrong || rWrong) toFlip.push({ id, cat: p.category, intent, sL, sR, lWrong, rWrong, reason: 'desc says arms behind but shoulderFwd negative (=forward)' });
  }
}

console.log('shoulderFwd sign defects to flip: ' + toFlip.length);

// Backup
const bak = DATA + '.bak-pre-shoulderfwd-fix';
if (!fs.existsSync(bak)) fs.copyFileSync(DATA, bak);

// Pose-scoped shoulderFwd value replacer — uses the robust indexOf-based finder.
function flipShoulderFwdInText(text, poseId, field, oldVal, newVal) {
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

for (const { id, cat, intent, sL, sR, lWrong, rWrong, reason } of toFlip) {
  const fc = {};
  let textChanged = false;
  if (lWrong && sL !== undefined) {
    const r = flipShoulderFwdInText(text, id, 'shoulderFwdL', sL, -sL);
    if (r.found) { text = r.newText; fc.shoulderFwdL = -sL; textChanged = true; }
    else if (r.stale) { skipped.push({ id, reason: 'shoulderFwdL stale' }); }
  }
  if (rWrong && sR !== undefined) {
    const r = flipShoulderFwdInText(text, id, 'shoulderFwdR', sR, -sR);
    if (r.found) { text = r.newText; fc.shoulderFwdR = -sR; textChanged = true; }
    else if (r.stale) { skipped.push({ id, reason: 'shoulderFwdR stale' }); }
  }
  if (!textChanged) { skipped.push({ id, reason: 'no change applied' }); continue; }
  if (fc.shoulderFwdL !== undefined) lib[id].joints.shoulderFwdL = fc.shoulderFwdL;
  if (fc.shoulderFwdR !== undefined) lib[id].joints.shoulderFwdR = fc.shoulderFwdR;
  applied.push({ id, cat, intent, sL, sR, fc });
  ledgerLines += JSON.stringify({
    run_id: RUN_ID, pose_id: id, category: cat, worker: 'shoulderfwd-sign-fix',
    source_config_hash: crypto.createHash('sha1').update(JSON.stringify(lib[id].joints)).digest('hex').slice(0, 12),
    applied: true, code_changes: Object.keys(fc),
    field_changes: fc, rationale: 'shoulderFwd sign correction: ' + reason + '. TRUTH: + = behind, - = forward.',
    final_status: 'applied_shoulderfwd_sign_fix', ts: new Date().toISOString()
  }) + '\n';
}

fs.writeFileSync(DATA, text);
fs.appendFileSync(LEDGER, ledgerLines);

console.log('Applied: ' + applied.length + ' shoulderFwd sign flips');
console.log('Skipped: ' + skipped.length);
if (skipped.length) for (const s of skipped) console.log('  SKIP: ' + s.id + ' — ' + s.reason);
console.log('\nFlipped poses:');
for (const a of applied) console.log('  [' + a.cat.padEnd(12) + '] ' + a.id.padEnd(44) + ' ' + a.intent.padEnd(8) + ' sL=' + String(a.sL).padStart(4) + (a.fc.shoulderFwdL !== undefined ? '→' + String(a.fc.shoulderFwdL).padStart(4) : '    ') + ' sR=' + String(a.sR).padStart(4) + (a.fc.shoulderFwdR !== undefined ? '→' + String(a.fc.shoulderFwdR).padStart(4) : '    '));
console.log('\nBackup: ' + bak);
