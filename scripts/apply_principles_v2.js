#!/usr/bin/env node
/* ============================================================
 * apply_principles_v2.js
 * ------------------------------------------------------------
 * Second pass — category-aware fixes flagged during full-library
 * per-category visual review. Complements apply_principles.js.
 *
 * Fixes:
 *  [F1] BOUDOIR: strip erroneous globalTilt from poses whose
 *       instructions clearly say stand/sit/kneel/upright and are
 *       not lying/reclining/prone/supine. (93+ affected.)
 *  [F2] BOUDOIR: clamp remaining globalTilt to safe max ±80° so
 *       reclining poses read horizontal without exploding.
 *  [F3] SEATED: guarantee knees ≥ 85° so the pose reads sitting,
 *       and set hipAbduct min 4° for open lap when hips ≥ 20°.
 *  [F4] KNEELING: guarantee both knees ≥ 90° and hip flex ≥ 90°
 *       so shins lie flat and thighs are vertical.
 *  [F5] RECLINING: ensure globalTilt is set (default +75° for
 *       supine, −75° for prone based on tag/instruction match).
 *  [F6] LEAN-SEAT: guarantee knees ≥ 85° (still seated) and add
 *       a forward spine tilt of ~10° if none set.
 *  [F7] ACCESSIBLE (wheelchair): guarantee knees ≥ 90° so the
 *       occupant reads seated even without a rendered chair.
 *  [F8] HIGH-TO-LOW / LOW-TO-HIGH: clamp globalTilt to ±40° so
 *       transitional poses don't invert.
 *  [F9] All categories: clamp any joint angle to a sane range
 *       so outlier values ±180° don't explode the FK chain.
 *
 * Usage:
 *   node scripts/apply_principles_v2.js --dry-run
 *   node scripts/apply_principles_v2.js --apply
 *   node scripts/apply_principles_v2.js --category=boudoir --apply
 * ============================================================ */
'use strict';

const fs   = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(REPO_ROOT, 'js', 'poses-data.js');

const argv = process.argv.slice(2);
const APPLY   = argv.includes('--apply');
const CAT     = (argv.find(a => a.startsWith('--category=')) || '').split('=')[1] || null;

// --- helpers ---------------------------------------------------------------

function textOf(pose) {
  return ((pose.tags||[]).join(' ') + ' ' + (pose.name||'') + ' ' +
          (pose.instructions||'') + ' ' + (pose.intent||'')).toLowerCase();
}
function isLyingPose(pose) {
  const t = textOf(pose);
  return /\b(lie|lying|recline|reclined|reclining|prone|supine|belly|back)\b/.test(t) &&
         !/\b(sit\b|sitting|stand\b|standing|kneel\b|kneeling|upright)\b/.test(t);
}
function isUprightPose(pose) {
  const t = textOf(pose);
  // Explicitly upright cues
  if (/\b(sit\b|sitting|stand\b|standing|kneel\b|kneeling|upright)\b/.test(t)) return true;
  // Instruction talks about "lean" without "lie" = still upright
  if (/\blean(ing)?\b/.test(t) && !/\blying?\b/.test(t)) return true;
  return false;
}
function isProne(pose) {
  return /\b(prone|belly[- ]down|on the belly|face[- ]down|stomach)\b/.test(textOf(pose));
}
function isSupine(pose) {
  const t = textOf(pose);
  return /\b(supine|on (the )?back|back(ed)? up|face[- ]?up|belly[- ]up)\b/.test(t);
}

// clamp helper
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// --- Fixers ----------------------------------------------------------------

function fixPose(pose, log) {
  const j = pose.joints = pose.joints || {};
  const cat = pose.category;
  const before = JSON.stringify(j);

  // [F1] BOUDOIR: strip erroneous globalTilt from upright poses
  if (cat === 'boudoir') {
    if (isUprightPose(pose) && j.globalTilt) {
      log.push({id:pose.id, rule:'F1', old:'globalTilt='+j.globalTilt, new:'globalTilt removed'});
      delete j.globalTilt;
      if (j.globalRoll) { delete j.globalRoll; }
      if (j.globalTwist && Math.abs(j.globalTwist) > 20) j.globalTwist = 0;
    }
    // [F2] clamp remaining boudoir tilt
    if (j.globalTilt) {
      const clamped = clamp(j.globalTilt, -85, 85);
      if (clamped !== j.globalTilt) {
        log.push({id:pose.id, rule:'F2', old:j.globalTilt, new:clamped});
        j.globalTilt = clamped;
      }
    }
  }

  // [F3] SEATED: guarantee sitting posture
  if (cat === 'seated' || cat === 'lean-seat') {
    if ((j.leftKnee || 0) < 85)  { log.push({id:pose.id, rule:'F3', set:'leftKnee=90'});  j.leftKnee = 90; }
    if ((j.rightKnee || 0) < 85) { log.push({id:pose.id, rule:'F3', set:'rightKnee=90'}); j.rightKnee = 90; }
    if ((j.leftHip || 0) < 60)  j.leftHip = 80;   // thigh horizontal
    if ((j.rightHip || 0) < 60) j.rightHip = 80;
    // Strip any erroneous globalTilt from a seated pose
    if (j.globalTilt && Math.abs(j.globalTilt) > 25 && !isLyingPose(pose)) {
      log.push({id:pose.id, rule:'F3-tilt', old:j.globalTilt, new:0});
      delete j.globalTilt;
    }
  }

  // [F4] KNEELING: knees at 90° and hips flexed
  if (cat === 'kneeling') {
    if ((j.leftKnee || 0) < 90)  { log.push({id:pose.id, rule:'F4', set:'leftKnee=100'});  j.leftKnee = 100; }
    if ((j.rightKnee || 0) < 90) { log.push({id:pose.id, rule:'F4', set:'rightKnee=100'}); j.rightKnee = 100; }
    // Shins along floor: ankles plantar-flexed backward
    if (typeof j.leftAnkle !== 'number' || j.leftAnkle > 0)  j.leftAnkle  = -20;
    if (typeof j.rightAnkle !== 'number' || j.rightAnkle > 0) j.rightAnkle = -20;
    if (j.globalTilt && Math.abs(j.globalTilt) > 20) {
      log.push({id:pose.id, rule:'F4-tilt', old:j.globalTilt, new:0});
      delete j.globalTilt;
    }
  }

  // [F5] RECLINING: ensure globalTilt is set correctly
  if (cat === 'reclining') {
    if (!j.globalTilt) {
      const g = isProne(pose) ? -75 : 75; // default supine
      log.push({id:pose.id, rule:'F5', set:'globalTilt='+g});
      j.globalTilt = g;
    } else {
      // clamp
      const c = clamp(j.globalTilt, -90, 90);
      if (c !== j.globalTilt) { j.globalTilt = c; log.push({id:pose.id, rule:'F5-clamp', new:c}); }
    }
  }

  // [F6] LEAN-SEAT: already handled in F3, add forward spine
  if (cat === 'lean-seat') {
    if (typeof j.spine !== 'number' || j.spine < -3) {
      // We want a small forward tilt for the "leaning while seated" read
      if (!j.spine || j.spine < 5) { j.spine = 10; log.push({id:pose.id, rule:'F6', set:'spine=10'}); }
    }
  }

  // [F7] ACCESSIBLE: guarantee seated
  if (cat === 'accessible') {
    if ((j.leftKnee || 0) < 85)  { log.push({id:pose.id, rule:'F7', set:'leftKnee=90'});  j.leftKnee = 90; }
    if ((j.rightKnee || 0) < 85) { log.push({id:pose.id, rule:'F7', set:'rightKnee=90'}); j.rightKnee = 90; }
    if ((j.leftHip || 0) < 60)  j.leftHip = 80;
    if ((j.rightHip || 0) < 60) j.rightHip = 80;
    if (j.globalTilt) { delete j.globalTilt; log.push({id:pose.id, rule:'F7-tilt', new:0}); }
  }

  // [F8] transitional poses: clamp tilt
  if (cat === 'high-to-low' || cat === 'low-to-high') {
    if (j.globalTilt) {
      const c = clamp(j.globalTilt, -40, 40);
      if (c !== j.globalTilt) { j.globalTilt = c; log.push({id:pose.id, rule:'F8', new:c}); }
    }
  }

  // [F9] sanity clamp all joint angles
  for (const k of Object.keys(j)) {
    if (typeof j[k] !== 'number') continue;
    if (k === 'globalTilt' || k === 'globalRoll' || k === 'globalTwist') {
      j[k] = clamp(j[k], -95, 95);
      continue;
    }
    // limb joints: no more than 170°
    j[k] = clamp(j[k], -170, 170);
  }

  const after = JSON.stringify(j);
  return before !== after;
}

// --- runner ---------------------------------------------------------------

const src = fs.readFileSync(DATA_FILE, 'utf8');
const vm = require('vm');
const sb = {};
vm.createContext(sb);
vm.runInContext(src.replace(/^const /gm, 'var '), sb);
const lib = sb.POSES_LIBRARY;
if (!lib) { console.error('Failed to load'); process.exit(1); }

const ids = Object.keys(lib);
console.log(`Loaded ${ids.length} poses.`);

const log = [];
const changed = new Set();
const perCat = {};

for (const id of ids) {
  const p = lib[id];
  if (CAT && p.category !== CAT) continue;
  const before = JSON.stringify(p.joints);
  fixPose(p, log);
  if (before !== JSON.stringify(p.joints)) {
    changed.add(id);
    perCat[p.category] = (perCat[p.category]||0)+1;
  }
}

console.log(`\nChanged ${changed.size} poses; ${log.length} rule fires.`);
console.log('Per-category:');
for (const [c,n] of Object.entries(perCat).sort((a,b)=>b[1]-a[1])) {
  console.log(`  ${c.padEnd(14)} ${n}`);
}
const ruleFreq = {};
for (const e of log) ruleFreq[e.rule] = (ruleFreq[e.rule]||0)+1;
console.log('\nRule frequencies:');
for (const [r,n] of Object.entries(ruleFreq).sort((a,b)=>b[1]-a[1])) {
  console.log(`  ${r.padEnd(12)} ${n}`);
}

if (!APPLY) {
  console.log('\n[DRY RUN] Sample changes:');
  for (const e of log.slice(0,15)) console.log(' ', JSON.stringify(e));
  console.log('\nRe-run with --apply to persist.');
  process.exit(0);
}

// Rewrite each modified pose's joints block
function jointsToLiteral(j) {
  const keys = Object.keys(j);
  if (keys.length === 0) return '{}';
  return `{ ${keys.map(k => `${k}: ${j[k]}`).join(', ')} }`;
}

let out = src;
let missing = 0;
for (const id of changed) {
  const p = lib[id];
  const literal = jointsToLiteral(p.joints);
  const idPattern = new RegExp(`id:\\s*['"\`]${id.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}['"\`]`);
  const idMatch = out.match(idPattern);
  if (!idMatch) { missing++; continue; }
  const window = out.slice(idMatch.index, idMatch.index + 4000);
  const jm = window.match(/joints:\s*\{[^}]*\}/);
  if (!jm) { missing++; continue; }
  const abs = idMatch.index + jm.index;
  out = out.slice(0, abs) + `joints: ${literal}` + out.slice(abs + jm[0].length);
}
if (missing) console.warn(`⚠  ${missing} poses not located textually.`);

const stamp = new Date().toISOString().replace(/[:.]/g,'-');
fs.writeFileSync(DATA_FILE + '.bak-v2-' + stamp, src);
fs.writeFileSync(DATA_FILE, out);
console.log(`\n✔  Wrote ${DATA_FILE}`);
console.log(`   Backup: ${DATA_FILE}.bak-v2-${stamp}`);
console.log(`   Modified ${changed.size} poses across ${Object.keys(perCat).length} categories.`);
