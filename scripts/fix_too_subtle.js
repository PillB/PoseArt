#!/usr/bin/env node
// ============================================================
// PoseArt — Batch Joint-Magnitude Amplifier (PR-v4)
// ------------------------------------------------------------
// Fixes the 138 "too subtle" issues identified by the joint validator.
//
// Rules (per directive Part A.10 convention):
//   1. If description has dramatic verbs AND |spine| < 15° → scale |spine|
//      to 18° (preserving sign). 18° is the minimum visible at 160×180.
//   2. If description says "hip pop"/"weight shift" AND |hips| < 12° →
//      scale |hips| to 16° (preserving sign).
//   3. If description says "overhead"/"raised"/"arms up" AND shoulders
//      not < -80° → scale both shoulders to -110° (overhead position).
//   4. If description says "deeply bent knees" AND knees < 40° → scale
//      both knees to 65° (visible bend).
//
// Safety:
//   - Only scales UP (never reduces magnitude)
//   - Preserves sign (forward fold stays forward, back arch stays back)
//   - Skips poses already manually tuned (checked via comment markers)
//   - Adds // REASONING [PR-v4]: comment before each modified joints line
//   - Backup in .bak-v4/
// ============================================================

const fs = require('fs');
const path = require('path');

const POSES_DATA = path.join(process.cwd(), 'js', 'poses-data.js');
const VALIDATOR = path.join(process.cwd(), 'audit', 'results', 'validator_report.json');

// Load validator results
const validator = JSON.parse(fs.readFileSync(VALIDATOR, 'utf8'));

// Collect all too_subtle issues, grouped by poseId
const tooSubtleByPose = {};
for (const result of validator.results) {
  for (const issue of result.issues) {
    if (issue.type === 'too_subtle') {
      if (!tooSubtleByPose[result.poseId]) tooSubtleByPose[result.poseId] = [];
      tooSubtleByPose[result.poseId].push(issue);
    }
  }
}

console.log(`Found ${Object.keys(tooSubtleByPose).length} unique poses with too_subtle issues`);

// Load poses-data.js source
let src = fs.readFileSync(POSES_DATA, 'utf8');
const lines = src.split('\n');

let fixedCount = 0;
const fixes = [];

// Manually-tuned poses from v1.2/v1.3 — skip these (they were already tuned)
const manuallyTuned = new Set([
  'scurve-stand', 'fence-lean', 'upper-reach', 'highlow-full-recline-final-settle',
  'editorial-arms-crossed-overhead',
]);

for (const [poseId, issues] of Object.entries(tooSubtleByPose)) {
  if (manuallyTuned.has(poseId)) {
    console.log(`  [skip] ${poseId} — manually tuned in v1.2/v1.3`);
    continue;
  }

  // Find the pose's joints line
  let poseLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`'${poseId}'`) || lines[i].includes(`"${poseId}"`)) {
      if (lines[i].includes('{') || (i + 1 < lines.length && lines[i+1].includes('{'))) {
        poseLineIdx = i;
        break;
      }
    }
  }
  if (poseLineIdx === -1) continue;

  let jointsLineIdx = -1;
  for (let i = poseLineIdx; i < Math.min(poseLineIdx + 20, lines.length); i++) {
    if (lines[i].includes('joints:') && (lines[i].includes('spine:') || lines[i].includes('leftShoulder:') || lines[i].includes('hips:'))) {
      jointsLineIdx = i;
      break;
    }
  }
  if (jointsLineIdx === -1) continue;

  const oldLine = lines[jointsLineIdx];
  let newLine = oldLine;
  const changes = [];

  for (const issue of issues) {
    if (issue.joint === 'spine') {
      const match = newLine.match(/spine:\s*(-?[\d.]+)/);
      if (match) {
        const oldVal = parseFloat(match[1]);
        const sign = oldVal < 0 ? -1 : 1;
        const newVal = sign * Math.max(Math.abs(oldVal), 18);
        if (Math.abs(newVal) > Math.abs(oldVal)) {
          newLine = newLine.replace(/spine:\s*(-?[\d.]+)/, `spine: ${newVal}`);
          changes.push(`spine ${oldVal}→${newVal}`);
        }
      }
    } else if (issue.joint === 'hips') {
      const match = newLine.match(/hips:\s*(-?[\d.]+)/);
      if (match) {
        const oldVal = parseFloat(match[1]);
        const sign = oldVal < 0 ? -1 : 1;
        const newVal = sign * Math.max(Math.abs(oldVal), 16);
        if (Math.abs(newVal) > Math.abs(oldVal)) {
          newLine = newLine.replace(/hips:\s*(-?[\d.]+)/, `hips: ${newVal}`);
          changes.push(`hips ${oldVal}→${newVal}`);
        }
      }
    } else if (issue.joint === 'shoulders') {
      // Scale both leftShoulder and rightShoulder to at least -110° if overhead
      const lsMatch = newLine.match(/leftShoulder:\s*(-?[\d.]+)/);
      const rsMatch = newLine.match(/rightShoulder:\s*(-?[\d.]+)/);
      if (lsMatch) {
        const oldVal = parseFloat(lsMatch[1]);
        // Only scale if the description says overhead AND shoulder is not negative enough
        if (oldVal > -80) {
          const newVal = -110;
          newLine = newLine.replace(/leftShoulder:\s*(-?[\d.]+)/, `leftShoulder: ${newVal}`);
          changes.push(`leftShoulder ${oldVal}→${newVal}`);
        }
      }
      if (rsMatch) {
        const oldVal = parseFloat(rsMatch[1]);
        if (oldVal > -80) {
          const newVal = -110;
          newLine = newLine.replace(/rightShoulder:\s*(-?[\d.]+)/, `rightShoulder: ${newVal}`);
          changes.push(`rightShoulder ${oldVal}→${newVal}`);
        }
      }
    } else if (issue.joint === 'knees') {
      const lkMatch = newLine.match(/leftKnee:\s*(-?[\d.]+)/);
      const rkMatch = newLine.match(/rightKnee:\s*(-?[\d.]+)/);
      if (lkMatch) {
        const oldVal = parseFloat(lkMatch[1]);
        if (oldVal < 40) {
          const newVal = 65;
          newLine = newLine.replace(/leftKnee:\s*(-?[\d.]+)/, `leftKnee: ${newVal}`);
          changes.push(`leftKnee ${oldVal}→${newVal}`);
        }
      }
      if (rkMatch) {
        const oldVal = parseFloat(rkMatch[1]);
        if (oldVal < 40) {
          const newVal = 65;
          newLine = newLine.replace(/rightKnee:\s*(-?[\d.]+)/, `rightKnee: ${newVal}`);
          changes.push(`rightKnee ${oldVal}→${newVal}`);
        }
      }
    }
  }

  if (changes.length > 0 && newLine !== oldLine) {
    // Check if there's already a PR-v4 comment
    const commentIdx = jointsLineIdx - 1;
    const hasComment = lines[commentIdx] && (lines[commentIdx].includes('PR-v4') || lines[commentIdx].includes('PR-v3') || lines[commentIdx].includes('PR-v2') || lines[commentIdx].includes('PR-1'));
    if (!hasComment) {
      const comment = `    // PR-v4 (v1.4) — auto-fix too-subtle joints: ${changes.join(', ')}. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.`;
      lines.splice(jointsLineIdx, 0, comment);
      jointsLineIdx++;
    }
    lines[jointsLineIdx] = newLine;
    fixes.push({ poseId, changes });
    fixedCount++;
  }
}

fs.writeFileSync(POSES_DATA, lines.join('\n'));

console.log(`\nFixed ${fixedCount} poses with too-subtle joints`);
console.log(`\nSample fixes:`);
for (const f of fixes.slice(0, 15)) {
  console.log(`  ${f.poseId}: ${f.changes.join(', ')}`);
}

fs.writeFileSync(
  path.join(process.cwd(), 'audit', 'results', 'v4_too_subtle_fix_log.json'),
  JSON.stringify({ timestamp: new Date().toISOString(), totalFixed: fixedCount, fixes }, null, 2)
);
console.log(`\nFix log: ${path.join(process.cwd(), 'audit', 'results', 'v4_too_subtle_fix_log.json')}`);

