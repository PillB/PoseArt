#!/usr/bin/env node
/**
 * v5 pose-level fixer — applies per-pose joint overrides from the vision-review
 * subagent results at qa_screenshots/review_results/batch_*.jsonl.
 *
 * Each JSONL row: {id, seen, intent, rating, issues, overrides:{joint:val,...}}
 * We only apply rows where rating < 5 AND overrides is a non-empty object.
 *
 * A backup is written to .backups/ before any modification.
 * Sanity envelopes from docs/JOINT_SEMANTICS_v5.md are enforced by clamping.
 */

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const FILE = path.join(REPO, 'js', 'poses-data.js');
const RESULTS_DIR = path.join(REPO, 'qa_screenshots', 'review_results');

// ---------------------------------------------------------------------------
// Joint clamping (mirrors docs/JOINT_SEMANTICS_v5.md envelopes).
// Unknown joints are ignored with a warning.
// ---------------------------------------------------------------------------
const RANGES = {
  spine: [-35, 35], neck: [-25, 25], hips: [-25, 25],
  globalTilt: [-90, 90], globalTwist: [-60, 60], globalRoll: [-45, 45],
  leftShoulder: [-160, 45], rightShoulder: [-160, 45],
  leftElbow: [0, 130], rightElbow: [0, 130],
  shoulderFwdL: [-15, 45], shoulderFwdR: [-15, 45],
  leftHip: [-30, 130], rightHip: [-30, 130],
  leftKnee: [0, 140], rightKnee: [0, 140],
  hipAbductL: [-15, 35], hipAbductR: [-15, 35],
  ankleL: [-25, 25], ankleR: [-25, 25],
  wristL: [-30, 30], wristR: [-30, 30]
};

function clamp(joint, v) {
  const r = RANGES[joint];
  if (!r) return v; // unknown — pass through, warn later
  return Math.max(r[0], Math.min(r[1], v));
}

// ---------------------------------------------------------------------------
// Load all overrides.
// ---------------------------------------------------------------------------
function loadFixes() {
  const files = fs.readdirSync(RESULTS_DIR).filter(f => /^batch_\d{3}\.jsonl$/.test(f)).sort();
  const fixes = {};
  const stats = { rows: 0, applied: 0, skippedRating5: 0, skippedEmpty: 0, unknownJoints: new Set() };
  for (const f of files) {
    const lines = fs.readFileSync(path.join(RESULTS_DIR, f), 'utf8').split(/\n+/);
    for (const l of lines) {
      const s = l.trim();
      if (!s) continue;
      let row;
      try { row = JSON.parse(s); } catch { continue; }
      stats.rows++;
      if ((row.rating || 5) >= 5) { stats.skippedRating5++; continue; }
      const ov = row.overrides || {};
      const keys = Object.keys(ov);
      if (!keys.length) { stats.skippedEmpty++; continue; }
      const clean = {};
      for (const k of keys) {
        if (typeof ov[k] !== 'number') continue;
        if (!(k in RANGES)) stats.unknownJoints.add(k);
        clean[k] = clamp(k, ov[k]);
      }
      if (Object.keys(clean).length) {
        fixes[row.id] = clean;
        stats.applied++;
      }
    }
  }
  return { fixes, stats };
}

// ---------------------------------------------------------------------------
// Source edit helpers (adapted from apply_principles_v4_poses.js)
// ---------------------------------------------------------------------------
function findPoseBlock(src, id) {
  const re = new RegExp(`(['\"])${id.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\1\\s*:\\s*\\{`);
  const m = re.exec(src);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    if (depth === 0) return { poseStart: m.index, poseEnd: i + 1, bodyStart: m.index + m[0].length, bodyEnd: i };
    i++;
  }
  return null;
}

function findJointsBlock(src, bodyStart, bodyEnd) {
  const region = src.slice(bodyStart, bodyEnd);
  const re = /joints\s*:\s*\{/;
  const m = re.exec(region);
  if (!m) return null;
  const absStart = bodyStart + m.index + m[0].length;
  let i = absStart;
  let depth = 1;
  while (i < bodyEnd && depth > 0) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    if (depth === 0) return { openStart: absStart, closeIdx: i };
    i++;
  }
  return null;
}

function applyOverrides(src, id, overrides) {
  const pose = findPoseBlock(src, id);
  if (!pose) return { ok: false, reason: 'pose block not found' };
  const joints = findJointsBlock(src, pose.bodyStart, pose.bodyEnd);
  if (!joints) return { ok: false, reason: 'joints block not found' };

  let body = src.slice(joints.openStart, joints.closeIdx);
  let changed = 0;
  for (const [k, v] of Object.entries(overrides)) {
    const keyRe = new RegExp(`(^|,|\\{|\\s)(${k})\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`, 'm');
    if (keyRe.test(body)) {
      body = body.replace(keyRe, (_full, pre, name) => `${pre}${name}: ${v}`);
      changed++;
    } else {
      const trimmed = body.replace(/\s+$/, '');
      const sep = trimmed.endsWith(',') || trimmed.endsWith('{') ? '' : (trimmed.length ? ',' : '');
      body = `${trimmed}${sep}\n        ${k}: ${v}\n      `;
      changed++;
    }
  }
  const newSrc = src.slice(0, joints.openStart) + body + src.slice(joints.closeIdx);
  return { ok: true, changed, newSrc };
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
function main() {
  const { fixes, stats } = loadFixes();
  const ids = Object.keys(fixes);
  console.log(`v5 overrides loaded: ${ids.length} poses (rows=${stats.rows}, rating=5 skipped=${stats.skippedRating5}, empty skipped=${stats.skippedEmpty})`);
  if (stats.unknownJoints.size) {
    console.log(`Unknown joints (passed through unclamped): ${[...stats.unknownJoints].join(', ')}`);
  }

  let src = fs.readFileSync(FILE, 'utf8');
  const bakDir = path.join(REPO, '.backups');
  fs.mkdirSync(bakDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const bak = path.join(bakDir, `poses-data.js.bak-v5-${stamp}.js`);
  fs.copyFileSync(FILE, bak);
  console.log('Backup:', path.relative(REPO, bak));

  const results = [];
  for (const id of ids) {
    const res = applyOverrides(src, id, fixes[id]);
    if (!res.ok) { results.push({ id, ok: false, reason: res.reason }); continue; }
    src = res.newSrc;
    results.push({ id, ok: true, changed: res.changed });
  }
  fs.writeFileSync(FILE, src);

  const okCount = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok);
  const totalChanges = results.reduce((n, r) => n + (r.changed || 0), 0);
  console.log(`\nApplied fixes to ${okCount}/${ids.length} poses (${totalChanges} joint edits).`);
  if (fail.length) {
    console.log(`Failures: ${fail.length}`);
    fail.slice(0, 20).forEach(f => console.log('  -', f.id, ':', f.reason));
    if (fail.length > 20) console.log(`  ...and ${fail.length - 20} more`);
  }
}

main();
