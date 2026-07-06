#!/usr/bin/env node
/* ============================================================
 * apply_principles.js
 * ------------------------------------------------------------
 * Batch-apply POSING_PRINCIPLES.md rules to js/poses-data.js.
 *
 * This is the systematic per-pose rig-fix pipeline. It reads
 * the pose library, applies principle-derived defaults where
 * a pose violates them, and rewrites poses-data.js in place.
 *
 * Rules applied (each tagged with the §-section in POSING_PRINCIPLES.md):
 *
 *  [§1.1] Feminine poses with a leg extended and visible foot →
 *         ensure ankle plantar-flex (+18 to +25°) so toes point.
 *  [§1.2] Feminine poses with |spine| < 6° and category in
 *         {standing, leaning, boudoir, editorial, fashion, kneeling}
 *         → set spine = -8 (arched lumbar / lift ribcage).
 *  [§1.3] Feminine poses with |leftShoulder| and |rightShoulder|
 *         both < 4° → add asymmetric shoulder drop
 *         (leftShoulder = -3, rightShoulder = +2) so the
 *         collarbone line isn't tense/horizontal.
 *  [§2]  Masculine poses (tags include masculine/male/men) →
 *         zero out foot plantar-flex, widen stance
 *         (hipAbduct L/R += 4 if standing), zero spine arch.
 *  [§3]  Aesthetic-triangle: if both leftElbow and rightElbow < 20°
 *         (both arms straight), bend one to 55°.
 *  [§3.4] Asymmetry: if |leftElbow - rightElbow| < 8° AND
 *         |leftHip - rightHip| < 8° AND |leftKnee - rightKnee| < 8°,
 *         nudge one side by 10° so the pose isn't a mirror.
 *  [§6]  Feminine standing/leaning: apply weight-shift
 *         (hips tilt +5..8°) when hips == 0 and hipAbduct L≈R.
 *  [§7]  Contrapposto: when hips are tilted, ensure spine has an
 *         opposite curl so the head stays centered above feet.
 *
 * Usage:
 *   node scripts/apply_principles.js --dry-run   # report what would change
 *   node scripts/apply_principles.js --apply     # rewrite poses-data.js
 *   node scripts/apply_principles.js --category standing --apply
 *
 * A backup of poses-data.js is written to
 *   poses-data.js.bak-<timestamp>
 * before rewrite.
 * ============================================================ */
'use strict';

const fs   = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(REPO_ROOT, 'js', 'poses-data.js');

const argv = process.argv.slice(2);
const APPLY      = argv.includes('--apply');
const DRY_RUN    = !APPLY;
const CAT_FILTER = (argv.find(a => a.startsWith('--category=')) || '').split('=')[1] || null;

// --- Rule helpers ----------------------------------------------------------

function tagStr(pose) {
  return ((pose.tags || []).join(' ') + ' ' + (pose.instructions || '') + ' ' + (pose.intent || '') + ' ' + (pose.name || '')).toLowerCase();
}
function isMasculine(pose) {
  return /\b(masculine|male|men|man|boyfriend|husband|dad|father|groom|guy)\b/.test(tagStr(pose));
}
function isFeminine(pose) { return !isMasculine(pose); }
function absOr0(v) { return typeof v === 'number' ? Math.abs(v) : 0; }
function has(pose, k) { return pose.joints && typeof pose.joints[k] === 'number'; }

const FEMININE_ARCH_CATS = new Set([
  'standing','leaning','lean-seat','boudoir','editorial','fashion','kneeling',
  'seated','high-to-low','low-to-high','fine-art'
]);

const STANDING_LIKE = new Set(['standing','leaning','fashion','editorial','fine-art']);
const CONTACT_TAGS = /(hand on hip|hand on knee|hand on hair|hand to hair|touching face|hand.*face|on.*armrest|arms crossed|hand.*jaw|hand.*chin|touching neck)/i;

// --- The single-pose transformer --------------------------------------------

function fixPose(pose, changes) {
  if (!pose.joints) pose.joints = {};
  const j = pose.joints;
  const cat = pose.category;
  const masc = isMasculine(pose);
  const fem  = !masc;
  const t = tagStr(pose);

  const before = JSON.stringify(j);

  // [§1.1] Toes pointed for feminine poses when a leg is extended
  //        (knee bend < 20°, i.e. leg is fairly straight and foot visible)
  if (fem && !/barefoot|sock|boot|sneaker/.test(t)) {
    // Only nudge if ankle isn't already set to plantar-flex.
    if (has(pose,'leftKnee') && (j.leftKnee ?? 0) < 25 && !has(pose,'leftAnkle')) {
      j.leftAnkle = 20; changes.push({id:pose.id, rule:'§1.1 point L toe', add:'leftAnkle=20'});
    }
    if (has(pose,'rightKnee') && (j.rightKnee ?? 0) < 25 && !has(pose,'rightAnkle')) {
      j.rightAnkle = 20; changes.push({id:pose.id, rule:'§1.1 point R toe', add:'rightAnkle=20'});
    }
  }

  // [§1.2] Feminine arched back for stand/lean/boudoir/etc.
  if (fem && FEMININE_ARCH_CATS.has(cat)) {
    const sp = j.spine || 0;
    if (Math.abs(sp) < 6) {
      // -8 = ribcage lifted, small anterior tilt effect on spine chain
      j.spine = -8;
      changes.push({id:pose.id, rule:'§1.2 arch back', set:'spine=-8'});
    }
  }

  // [§1.3] Feminine dropped shoulders — subtle asymmetric drop
  if (fem && cat !== 'reclining' && cat !== 'accessible' && cat !== 'dynamic') {
    const ls = Math.abs(j.leftShoulder || 0);
    const rs = Math.abs(j.rightShoulder || 0);
    if (ls < 4 && rs < 4) {
      j.leftShoulder  = (j.leftShoulder  || 0) - 3;
      j.rightShoulder = (j.rightShoulder || 0) + 2;
      changes.push({id:pose.id, rule:'§1.3 drop shoulders', set:'shoulders asymmetric'});
    }
  }

  // [§2] Masculine adjustments: flat feet, wider stance, neutral spine
  if (masc) {
    // Remove pointed toes
    if ((j.leftAnkle || 0) > 5)  { j.leftAnkle = 0;  changes.push({id:pose.id, rule:'§2 flat feet L', set:'leftAnkle=0'}); }
    if ((j.rightAnkle || 0) > 5) { j.rightAnkle = 0; changes.push({id:pose.id, rule:'§2 flat feet R', set:'rightAnkle=0'}); }
    // Wider stance for standing poses
    if (STANDING_LIKE.has(cat)) {
      if ((j.hipAbductL || 0) < 6) { j.hipAbductL = 8;  changes.push({id:pose.id, rule:'§2 wider stance L', set:'hipAbductL=8'}); }
      if ((j.hipAbductR || 0) < 6) { j.hipAbductR = 8;  changes.push({id:pose.id, rule:'§2 wider stance R', set:'hipAbductR=8'}); }
    }
    // Neutral spine (undo any arch we may have set)
    if ((j.spine || 0) < -3) { j.spine = 0; changes.push({id:pose.id, rule:'§2 neutral spine', set:'spine=0'}); }
  }

  // [§3] Aesthetic-triangle: if both arms are near-straight, bend one
  if (['standing','leaning','fashion','editorial','fine-art','kneeling','boudoir'].includes(cat)) {
    const le = j.leftElbow  || 0;
    const re = j.rightElbow || 0;
    if (le < 20 && re < 20) {
      // Prefer left arm bent — hand-on-hip / hand-in-hair implied
      j.leftElbow = 55;
      j.leftShoulder = (j.leftShoulder || 0) + 8; // raises the hand toward the hip
      changes.push({id:pose.id, rule:'§3 aesthetic triangle', set:'leftElbow=55'});
    }
  }

  // [§3.4] Asymmetry — break exact mirrors
  if (cat !== 'reclining' && cat !== 'accessible') {
    const dEl = Math.abs((j.leftElbow||0) - (j.rightElbow||0));
    const dHip = Math.abs((j.leftHip||0) - (j.rightHip||0));
    const dKn = Math.abs((j.leftKnee||0) - (j.rightKnee||0));
    if (dEl < 8 && dHip < 8 && dKn < 8) {
      j.leftKnee = (j.leftKnee || 0) + 12;
      changes.push({id:pose.id, rule:'§3.4 break symmetry', set:'leftKnee+=12'});
    }
  }

  // [§6] Weight-shift for standing/leaning feminine
  if (fem && STANDING_LIKE.has(cat)) {
    if (!has(pose,'hips') || j.hips === 0) {
      j.hips = 6; // small pelvis tilt to one side
      changes.push({id:pose.id, rule:'§6 weight-shift', set:'hips=6'});
    }
  }

  // [§7] Contrapposto counter-curve — when hips tilt, spine counters (unless already set)
  if (fem && (j.hips || 0) > 4 && (j.spine || 0) >= -6) {
    // Already handled by §1.2 typically, but ensure it
    if ((j.spine || 0) > -5) j.spine = -8;
  }

  const after = JSON.stringify(j);
  return before !== after;
}

// --- Runner -----------------------------------------------------------------

const src = fs.readFileSync(DATA_FILE, 'utf8');

// Load the library by evaluating in a sandboxed context
const vm = require('vm');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(src.replace(/^const /gm, 'var '), sandbox);
const lib = sandbox.POSES_LIBRARY;
if (!lib) { console.error('Failed to load POSES_LIBRARY'); process.exit(1); }

const ids = Object.keys(lib);
console.log(`Loaded ${ids.length} poses.`);

const changes = [];
const changedIds = new Set();
const perCategoryCounts = {};

for (const id of ids) {
  const pose = lib[id];
  if (CAT_FILTER && pose.category !== CAT_FILTER) continue;
  const before = JSON.stringify(pose.joints);
  fixPose(pose, changes);
  const after = JSON.stringify(pose.joints);
  if (before !== after) {
    changedIds.add(id);
    perCategoryCounts[pose.category] = (perCategoryCounts[pose.category] || 0) + 1;
  }
}

console.log(`\nChanges: ${changes.length} rule applications across ${changedIds.size} poses.`);
console.log('Per-category changed pose counts:');
for (const [c, n] of Object.entries(perCategoryCounts).sort((a,b)=>b[1]-a[1])) {
  console.log(`  ${c.padEnd(14)} ${n}`);
}

// Rule-frequency table
const ruleFreq = {};
for (const c of changes) ruleFreq[c.rule] = (ruleFreq[c.rule] || 0) + 1;
console.log('\nRule frequencies:');
for (const [r, n] of Object.entries(ruleFreq).sort((a,b)=>b[1]-a[1])) {
  console.log(`  ${r.padEnd(30)} ${n}`);
}

if (DRY_RUN) {
  console.log('\n[DRY RUN] No file written. Re-run with --apply to persist.');
  console.log('Sample changes (first 15):');
  for (const c of changes.slice(0, 15)) console.log('  ', JSON.stringify(c));
  process.exit(0);
}

// --- Rewrite poses-data.js in place, preserving formatting ---
// Strategy: for each changed pose id, regenerate its `joints: {…}` block.
// We locate the pose object by matching `id: 'THE_ID'` and then replace
// its joints property with the new object.

function jointsToLiteral(j) {
  const keys = Object.keys(j);
  if (keys.length === 0) return '{}';
  const parts = keys.map(k => `${k}: ${j[k]}`);
  return `{ ${parts.join(', ')} }`;
}

let out = src;

let missingBlocks = 0;
for (const id of changedIds) {
  const pose = lib[id];
  const newJoints = jointsToLiteral(pose.joints);

  // Find the pose's object literal by scanning for `<id>: {` at start of an
  // object entry. All pose keys are quoted single/no-quotes in the source.
  // The library is a `const POSES_LIBRARY = { 'id1': {...}, id2: {...}, ... }`.
  // Instead of a fragile regex, we locate the `id: '<id>'` line and then
  // find `joints: { ... }` in the same object block.
  const idPattern = new RegExp(`id:\\s*['"\`]${id.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}['"\`]`);
  const idMatch = out.match(idPattern);
  if (!idMatch) { missingBlocks++; continue; }

  const idIdx = idMatch.index;
  // Search forward for the next `joints: { … }` within reasonable range
  const searchWindow = out.slice(idIdx, idIdx + 4000);
  const jointsMatch = searchWindow.match(/joints:\s*\{[^}]*\}/);
  if (!jointsMatch) { missingBlocks++; continue; }

  const jointsAbsIdx = idIdx + jointsMatch.index;
  const jointsAbsEnd = jointsAbsIdx + jointsMatch[0].length;
  out = out.slice(0, jointsAbsIdx) + `joints: ${newJoints}` + out.slice(jointsAbsEnd);
}

if (missingBlocks) console.warn(`⚠  ${missingBlocks} poses could not be located textually.`);

// Backup
const stamp = new Date().toISOString().replace(/[:.]/g,'-');
const bak = DATA_FILE + '.bak-' + stamp;
fs.writeFileSync(bak, src);
fs.writeFileSync(DATA_FILE, out);
console.log(`\n✔  Wrote ${DATA_FILE} (backup at ${bak})`);
console.log(`✔  Modified ${changedIds.size} poses across ${Object.keys(perCategoryCounts).length} categories.`);
