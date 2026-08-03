// audit_harness/fix-torso-twist.js
// Adds globalTwist to poses whose descriptions say "twist/rotate torso" but
// have globalTwist=0. The sweep's torso_twist claim flags these. globalTwist
// rotates the whole body around the Y-axis (vertical) — positive = rotate
// toward figure's left, negative = toward figure's right. We pick the sign
// based on description cues ("over left/right shoulder", "toward camera away
// from X") and default to +25 (moderate twist) when no directional cue.
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

const twistRe = /\b(twist|rotation|rotate|turn)\s+(the\s+)?(torso|ribcage|upper\s+body|shoulders)|torso\s+(twist|rotation|rotate)|ribcage\s+(twist|rotation)|quarter\s+turn\s+(toward|away)|upper\s+body\s+(twist|rotat)\b/i;

const toFix = [];
for (const id of Object.keys(lib)) {
  const p = lib[id];
  if (!p.joints) continue;
  const twist = p.joints.globalTwist || 0;
  if (Math.abs(twist) > 5) continue; // already has twist
  const desc = p.instructions + ' ' + (p.tip || '');
  if (!twistRe.test(desc)) continue;
  // Determine twist magnitude from intensity cues
  let mag = 25; // default moderate twist
  if (/\b(half\s+turn|halfway|fully\s+twist|deep\s+twist|maximum\s+twist)\b/i.test(desc)) mag = 45;
  else if (/\b(slight|subtle|gentle|small)\s+(twist|turn|rotation)\b/i.test(desc)) mag = 15;
  else if (/\b(twist|rotate|rotation)\b/i.test(desc) && /\b(strong|powerful|dramatic|sharp)\b/i.test(desc)) mag = 35;
  // Determine sign from directional cues
  let sign = 1; // default positive (rotate toward figure's left)
  if (/\b(over\s+(the\s+)?(left|right)\s+shoulder|toward\s+(the\s+)?(left|right)|away\s+from\s+(the\s+)?(left|right))\b/i.test(desc)) {
    const m = desc.match(/\b(left|right)\b/i);
    if (m) sign = m[1].toLowerCase() === 'left' ? 1 : -1;
  }
  toFix.push({ id, cat: p.category, mag: mag * sign, desc: p.instructions.slice(0, 70) });
}

console.log('Poses needing globalTwist: ' + toFix.length);

// Backup
const bak = DATA + '.bak-pre-twist-fix';
if (!fs.existsSync(bak)) fs.copyFileSync(DATA, bak);

// Add globalTwist to the joints object. Since the field may not exist, we
// insert it before the closing } of the joints block.
function addGlobalTwistToJoints(text, poseId, value) {
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
  const blockEnd = j; // index of closing }
  // Check if globalTwist already exists in the block
  const blockText = text.slice(blockStart, blockEnd + 1);
  if (/globalTwist\s*:/.test(blockText)) return { found: false, stale: true };
  // Insert before the closing }. Handle trailing comma/whitespace.
  let insertPos = blockEnd;
  // Walk backwards to find last non-whitespace before }
  let k = blockEnd - 1;
  while (k > blockStart && /\s/.test(text[k])) k--;
  const lastChar = text[k];
  const needComma = lastChar !== '{' && lastChar !== ',';
  const insertion = (needComma ? ', ' : '') + 'globalTwist: ' + value;
  const newText = text.slice(0, blockEnd) + insertion + text.slice(blockEnd);
  return { found: true, newText, insertPos: blockEnd };
}

let text = fs.readFileSync(DATA, 'utf8');
const applied = [];
const skipped = [];
let ledgerLines = '';

for (const { id, cat, mag, desc } of toFix) {
  const r = addGlobalTwistToJoints(text, id, mag);
  if (!r.found) {
    skipped.push({ id, reason: r.stale ? 'globalTwist already exists' : 'joints block not found' });
    continue;
  }
  text = r.newText;
  lib[id].joints.globalTwist = mag;
  applied.push({ id, cat, mag, desc });
  ledgerLines += JSON.stringify({
    run_id: RUN_ID, pose_id: id, category: cat, worker: 'torso-twist-fix',
    source_config_hash: crypto.createHash('sha1').update(JSON.stringify(lib[id].joints)).digest('hex').slice(0, 12),
    applied: true, code_changes: ['globalTwist'],
    field_changes: { globalTwist: { from: 0, to: mag } },
    rationale: 'Added globalTwist=' + mag + ' — description says twist/rotate torso but globalTwist was 0. Magnitude based on intensity cues (' + (Math.abs(mag) >= 45 ? 'half/full turn' : Math.abs(mag) >= 35 ? 'strong' : Math.abs(mag) <= 15 ? 'slight' : 'moderate') + ').',
    final_status: 'applied_twist_fix', ts: new Date().toISOString()
  }) + '\n';
}

fs.writeFileSync(DATA, text);
fs.appendFileSync(LEDGER, ledgerLines);

console.log('Applied: ' + applied.length + ' globalTwist additions');
console.log('Skipped: ' + skipped.length);
if (skipped.length) for (const s of skipped) console.log('  SKIP: ' + s.id + ' — ' + s.reason);
console.log('\nFixed poses:');
for (const a of applied) console.log('  [' + a.cat.padEnd(12) + '] ' + a.id.padEnd(44) + ' globalTwist=' + String(a.mag).padStart(4) + ' | ' + a.desc);
console.log('\nBackup: ' + bak);
