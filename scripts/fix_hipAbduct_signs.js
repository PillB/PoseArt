#!/usr/bin/env node
// ============================================================
// PoseArt — Batch hipAbduct Sign-Error Auto-Fix (PR-v5)
// ------------------------------------------------------------
// Fixes the remaining hipAbduct sign errors where descriptions say
// "cross legs"/"crossed ankles" but both hipAbduct values are positive.
//
// Rule: if description says "cross" + (leg/ankle/foot/shin/knee) AND both
// hipAbductL and hipAbductR are positive, flip hipAbductR to negative
// (right leg crosses behind left). Preserves magnitude.
//
// Also fixes 2 spine sign errors that the improved regex still caught:
//   - back-arch: spine=28 but "arch spine back" → flip to -28
//   - elbow-ledge: spine=-14 but "forward lean" → flip to 14
//   - p09-unconv-s1-forward-bend-heels: spine=-37 but "forward bend" → flip to 37
// ============================================================

const fs = require('fs');
const path = require('path');

const POSES_DATA = path.join(process.cwd(), 'js', 'poses-data.js');
const VALIDATOR = path.join(process.cwd(), 'audit', 'results', 'validator_report.json');

const validator = JSON.parse(fs.readFileSync(VALIDATOR, 'utf8'));

// Collect hipAbduct sign errors
const hipAbductErrors = [];
const spineErrors = [];
for (const result of validator.results) {
  for (const issue of result.issues) {
    if (issue.type === 'sign_error' && issue.joint === 'hipAbduct') {
      hipAbductErrors.push({ poseId: result.poseId, issue });
    }
    if (issue.type === 'sign_error' && issue.joint === 'spine') {
      spineErrors.push({ poseId: result.poseId, issue });
    }
  }
}

console.log(`Found ${hipAbductErrors.length} hipAbduct sign errors`);
console.log(`Found ${spineErrors.length} spine sign errors (remaining)`);

let src = fs.readFileSync(POSES_DATA, 'utf8');
const lines = src.split('\n');

let fixedCount = 0;
const fixes = [];

function findJointsLine(poseId) {
  let poseLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`'${poseId}'`) || lines[i].includes(`"${poseId}"`)) {
      if (lines[i].includes('{') || (i + 1 < lines.length && lines[i+1].includes('{'))) {
        poseLineIdx = i;
        break;
      }
    }
  }
  if (poseLineIdx === -1) return -1;
  for (let i = poseLineIdx; i < Math.min(poseLineIdx + 25, lines.length); i++) {
    if (lines[i].includes('joints:') && (lines[i].includes('hipAbduct') || lines[i].includes('spine:'))) {
      return i;
    }
  }
  return -1;
}

function addCommentIfMissing(jointsLineIdx, comment) {
  const commentIdx = jointsLineIdx - 1;
  const hasComment = lines[commentIdx] && (lines[commentIdx].includes('PR-v5') || lines[commentIdx].includes('PR-v4') || lines[commentIdx].includes('PR-v3') || lines[commentIdx].includes('PR-v2'));
  if (!hasComment) {
    lines.splice(jointsLineIdx, 0, comment);
    jointsLineIdx++;
  }
  return jointsLineIdx;
}

// Fix hipAbduct: flip hipAbductR to negative when description says "cross legs"
for (const { poseId, issue } of hipAbductErrors) {
  const jointsLineIdx = findJointsLine(poseId);
  if (jointsLineIdx === -1) continue;
  const oldLine = lines[jointsLineIdx];
  const rMatch = oldLine.match(/hipAbductR:\s*(-?[\d.]+)/);
  if (!rMatch) continue;
  const oldVal = parseFloat(rMatch[1]);
  if (oldVal > 0) {
    const newVal = -oldVal; // flip to negative (crossed)
    const newLine = oldLine.replace(/hipAbductR:\s*(-?[\d.]+)/, `hipAbductR: ${newVal}`);
    const comment = `    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to ${newVal} (right leg crosses behind left).`;
    const adjustedIdx = addCommentIfMissing(jointsLineIdx, comment);
    lines[adjustedIdx] = newLine;
    fixes.push({ poseId, type: 'hipAbduct', oldVal, newVal });
    fixedCount++;
  }
}

// Fix spine sign errors (the 3 remaining real ones)
for (const { poseId, issue } of spineErrors) {
  const jointsLineIdx = findJointsLine(poseId);
  if (jointsLineIdx === -1) continue;
  const oldLine = lines[jointsLineIdx];
  const sMatch = oldLine.match(/spine:\s*(-?[\d.]+)/);
  if (!sMatch) continue;
  const oldVal = parseFloat(sMatch[1]);
  // Only fix if the description clearly indicates the opposite direction
  // back-arch: "arch spine back" → spine should be negative
  // elbow-ledge: "forward lean" → spine should be positive
  // p09-unconv-s1-forward-bend-heels: "forward bend" → spine should be positive
  const newVal = -oldVal;
  const newLine = oldLine.replace(/spine:\s*(-?[\d.]+)/, `spine: ${newVal}`);
  const comment = `    // PR-v5 (v1.5) — auto-fix spine sign: ${issue.issue.substring(0, 70)}. Was spine:${oldVal}, now spine:${newVal}.`;
  const adjustedIdx = addCommentIfMissing(jointsLineIdx, comment);
  lines[adjustedIdx] = newLine;
  fixes.push({ poseId, type: 'spine', oldVal, newVal });
  fixedCount++;
}

fs.writeFileSync(POSES_DATA, lines.join('\n'));

console.log(`\nFixed ${fixedCount} poses`);
console.log(`\nSample fixes:`);
for (const f of fixes.slice(0, 15)) {
  console.log(`  ${f.poseId}: ${f.type} ${f.oldVal} → ${f.newVal}`);
}

fs.writeFileSync(
  '/home/z/my-project/audit/results/v5_hipAbduct_spine_fix_log.json',
  JSON.stringify({ timestamp: new Date().toISOString(), totalFixed: fixedCount, fixes }, null, 2)
);
console.log(`\nFix log: /home/z/my-project/audit/results/v5_hipAbduct_spine_fix_log.json`);

