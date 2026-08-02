// audit_harness/fix-hipabduct-signs.js
// Detects + fixes hipAbduct sign errors across the library. Many poses have
// hipAbduct values with the WRONG sign because pose authors relied on the
// INVERTED renderer comment (which claimed "+ = spreads outward" but actually
// "+ = adduction/inward" and "- = abduction/outward").
// TRUTH: hipAbduct + = adduction (inward/cross/together), - = abduction (outward/apart).
// This script checks description keywords (knees together/apart, legs crossed)
// against the hipAbduct sign and flips wrong-sign values.
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

// Classify hip intent from description
function classifyHipIntent(desc) {
  const d = desc.toLowerCase();
  // "knees together" / "legs together" → adduction → hipAbduct should be POSITIVE (or near 0)
  if (/\b(knees?\s+together|legs?\s+together|thighs?\s+together)\b/i.test(d)) return 'together';
  // "knees apart" / "legs wide" / "wide stance" → abduction → hipAbduct should be NEGATIVE
  if (/\b(knees?\s+apart|legs?\s+(wide|apart)|wide\s+stance|wide\s+apart|legs?\s+open|knees?\s+wide)\b/i.test(d)) return 'apart';
  // "legs crossed" / "cross legs" / "crossed at knee" → asymmetric (one +, one -)
  if (/\b(cross\b.*(leg|ankle|foot|shin|knee)|crossed.*(leg|ankle|foot|shin|knee)|leg.*cross|ankle.*cross)\b/i.test(d)) return 'crossed';
  return null; // unclassified — skip
}

const toFlip = [];
for (const id of Object.keys(lib)) {
  const p = lib[id];
  if (!p.joints) continue;
  const j = p.joints;
  const lAbd = j.hipAbductL, rAbd = j.hipAbductR;
  if (lAbd === undefined && rAbd === undefined) continue;
  const desc = p.instructions + ' ' + (p.tip || '');
  const intent = classifyHipIntent(desc);
  if (!intent) continue;
  // Check sign correctness per intent
  // TRUTH: + = adduction(together), - = abduction(apart)
  if (intent === 'together') {
    // Both should be positive (adduction) or near 0. Wrong if both negative (abducted).
    if ((lAbd !== undefined && lAbd < -8) && (rAbd !== undefined && rAbd < -8)) {
      toFlip.push({ id, cat: p.category, intent, lAbd, rAbd, reason: 'both hipAbduct negative (abducted) but desc says knees/legs together' });
    }
  } else if (intent === 'apart') {
    // Both should be negative (abduction) or near 0. Wrong if both positive (adducted).
    if ((lAbd !== undefined && lAbd > 8) && (rAbd !== undefined && rAbd > 8)) {
      toFlip.push({ id, cat: p.category, intent, lAbd, rAbd, reason: 'both hipAbduct positive (adducted) but desc says knees/legs apart/wide' });
    }
  } else if (intent === 'crossed') {
    // FIX 2026-08-02 (cron-round-9): "crossed" needs OPPOSITE signs (one adduction +, one abduction -).
    // Previously the fix negated BOTH signs (wrong — left them still same-sign).
    // Now: detect same-sign defect, and specify WHICH field to flip (not both).
    // Default: right leg crosses over left → keep L sign, flip R sign.
    // If desc says "left over right", flip L instead.
    const l = lAbd || 0, r = rAbd || 0;
    if (l * r > 0 && Math.abs(l) > 8 && Math.abs(r) > 8) {
      const desc = p.instructions.toLowerCase();
      const leftOverRight = /\bleft\s+(over|cross)\s+right\b|left\s+leg\s+(over|cross)\b/i.test(desc);
      const flipField = leftOverRight ? 'hipAbductL' : 'hipAbductR'; // default: flip right
      toFlip.push({ id, cat: p.category, intent, lAbd: l, rAbd: r, flipField, reason: 'both hipAbduct same sign (' + l + '/' + r + ') but desc says legs crossed (need opposite signs). Flipping ' + flipField + ' to make opposite.' });
    }
  }
}

console.log('hipAbduct sign defects to flip: ' + toFlip.length);

// Backup
const bak = DATA + '.bak-pre-hipabduct-fix';
if (!fs.existsSync(bak)) fs.copyFileSync(DATA, bak);

// Pose-scoped hipAbduct value replacer — uses the robust indexOf-based finder
// (same pattern as fix-spine-signs.js / fix-globaltilt-signs.js).
function flipHipAbductInText(text, poseId, field, oldVal, newVal) {
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

for (const { id, cat, intent, lAbd, rAbd, reason, flipField } of toFlip) {
  // FIX 2026-08-02 (cron-round-9): "crossed" intent flips only ONE field (specified
  // by flipField) to make signs opposite. "together"/"apart" still flip both.
  const fc = {};
  let textChanged = false;
  if (intent === 'crossed') {
    // Flip only the specified field
    const field = flipField;
    const oldVal = field === 'hipAbductL' ? lAbd : rAbd;
    if (oldVal !== undefined && oldVal !== 0) {
      const r = flipHipAbductInText(text, id, field, oldVal, -oldVal);
      if (r.found) { text = r.newText; fc[field] = -oldVal; textChanged = true; }
      else if (r.stale) { skipped.push({ id, reason: field + ' stale (expected ' + oldVal + ' got ' + r.currentVal + ')' }); }
    }
  } else {
    // together/apart: flip both L and R (negate)
    if (lAbd !== undefined && lAbd !== 0) {
      const r = flipHipAbductInText(text, id, 'hipAbductL', lAbd, -lAbd);
      if (r.found) { text = r.newText; fc.hipAbductL = -lAbd; textChanged = true; }
      else if (r.stale) { skipped.push({ id, reason: 'hipAbductL stale (expected ' + lAbd + ' got ' + r.currentVal + ')' }); }
    }
    if (rAbd !== undefined && rAbd !== 0) {
      const r = flipHipAbductInText(text, id, 'hipAbductR', rAbd, -rAbd);
      if (r.found) { text = r.newText; fc.hipAbductR = -rAbd; textChanged = true; }
      else if (r.stale) { skipped.push({ id, reason: 'hipAbductR stale (expected ' + rAbd + ' got ' + r.currentVal + ')' }); }
    }
  }
  if (!textChanged) { skipped.push({ id, reason: 'no change applied' }); continue; }
  if (fc.hipAbductL !== undefined) lib[id].joints.hipAbductL = fc.hipAbductL;
  if (fc.hipAbductR !== undefined) lib[id].joints.hipAbductR = fc.hipAbductR;
  applied.push({ id, cat, intent, lAbd, rAbd, fc });
  ledgerLines += JSON.stringify({
    run_id: RUN_ID, pose_id: id, category: cat, worker: 'hipabduct-sign-fix',
    source_config_hash: crypto.createHash('sha1').update(JSON.stringify(lib[id].joints)).digest('hex').slice(0, 12),
    applied: true, code_changes: Object.keys(fc),
    field_changes: fc, rationale: 'hipAbduct sign correction: ' + reason + '. TRUTH: + = adduction(inward/together), - = abduction(outward/apart).',
    final_status: 'applied_hipabduct_sign_fix', ts: new Date().toISOString()
  }) + '\n';
}

fs.writeFileSync(DATA, text);
fs.appendFileSync(LEDGER, ledgerLines);

console.log('Applied: ' + applied.length + ' hipAbduct sign flips');
console.log('Skipped: ' + skipped.length);
if (skipped.length) for (const s of skipped) console.log('  SKIP: ' + s.id + ' — ' + s.reason);
console.log('\nFlipped poses:');
for (const a of applied) console.log('  [' + a.cat.padEnd(12) + '] ' + a.id.padEnd(44) + ' ' + a.intent.padEnd(8) + ' L=' + String(a.lAbd).padStart(4) + '→' + String(a.fc.hipAbductL !== undefined ? a.fc.hipAbductL : a.lAbd).padStart(4) + ' R=' + String(a.rAbd).padStart(4) + '→' + String(a.fc.hipAbductR !== undefined ? a.fc.hipAbductR : a.rAbd).padStart(4));
console.log('\nBackup: ' + bak);
