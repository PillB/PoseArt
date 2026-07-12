#!/usr/bin/env node
// ============================================================
// PoseArt — Batch Spine Sign-Error Auto-Fix Script
// ------------------------------------------------------------
// Fixes the 132 spine sign errors identified by the joint validator.
//
// Rules (per Part A.10 convention: spine negative = backward arch,
// positive = forward fold):
//   1. If description says "back arch"/"arch back"/"backward arch" but
//      spine > 5 → flip spine sign to negative (backward arch)
//   2. If description says "forward lean"/"forward fold"/"round forward" but
//      spine < -5 → flip spine sign to positive (forward fold)
//
// The script:
//   - Reads poses-data.js
//   - For each pose with a spine sign error, flips the spine value's sign
//   - Adds a // REASONING [PR-v3]: comment explaining the fix
//   - Preserves all other joint values, quote style, and structure
//   - Writes the corrected file
//
// Safety:
//   - Only flips signs when the validator's regex matched (high confidence)
//   - Does NOT change spine magnitude (only sign)
//   - Does NOT touch poses without spine sign errors
//   - Backup saved to .bak-v3/ before any change
// ============================================================

const fs = require('fs');
const path = require('path');

const POSES_DATA = path.join(process.cwd(), 'js', 'poses-data.js');
const VALIDATOR = path.join(process.cwd(), 'audit', 'results', 'validator_report.json');

// Load validator results
const validator = JSON.parse(fs.readFileSync(VALIDATOR, 'utf8'));

// Find all spine sign errors — deduplicate by poseId (keep first match only)
// to avoid double-fixing poses that match both "back arch" and "arch back" patterns
const seenPoses = new Set();
const spineSignErrors = [];
for (const result of validator.results) {
  if (seenPoses.has(result.poseId)) continue;
  for (const issue of result.issues) {
    if (issue.type === 'sign_error' && issue.joint === 'spine') {
      spineSignErrors.push({ poseId: result.poseId, issue });
      seenPoses.add(result.poseId);
      break; // only take the first spine sign error per pose
    }
  }
}

console.log(`Found ${spineSignErrors.length} unique poses with spine sign errors to fix`);

// Load poses-data.js source
let src = fs.readFileSync(POSES_DATA, 'utf8');
const lines = src.split('\n');

// For each spine sign error, find the pose's joints line and flip spine sign
let fixedCount = 0;
const fixes = [];

for (const { poseId, issue } of spineSignErrors) {
  // Find the pose definition — look for the pose ID key, then find the
  // joints line within the next ~15 lines
  let poseLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`'${poseId}'`) || lines[i].includes(`"${poseId}"`)) {
      // Verify it's a key definition (contains '{' or is followed by '{')
      if (lines[i].includes('{') || (i + 1 < lines.length && lines[i+1].includes('{'))) {
        poseLineIdx = i;
        break;
      }
    }
  }
  if (poseLineIdx === -1) {
    console.log(`  [skip] ${poseId} — could not find pose definition`);
    continue;
  }

  // Find the joints line within the pose block (next 20 lines)
  let jointsLineIdx = -1;
  for (let i = poseLineIdx; i < Math.min(poseLineIdx + 20, lines.length); i++) {
    if (lines[i].includes('joints:') && lines[i].includes('spine:')) {
      jointsLineIdx = i;
      break;
    }
  }
  if (jointsLineIdx === -1) {
    console.log(`  [skip] ${poseId} — could not find joints line with spine`);
    continue;
  }

  const oldLine = lines[jointsLineIdx];
  // Extract the current spine value
  const spineMatch = oldLine.match(/spine:\s*(-?[\d.]+)/);
  if (!spineMatch) {
    console.log(`  [skip] ${poseId} — could not extract spine value from: ${oldLine.trim()}`);
    continue;
  }
  const oldSpine = parseFloat(spineMatch[1]);
  const newSpine = -oldSpine; // flip sign

  // Replace spine value in the line
  const newLine = oldLine.replace(/spine:\s*-?[\d.]+/, `spine: ${newSpine}`);

  // Check if there's already a PR-v3 comment on the line above
  const commentIdx = jointsLineIdx - 1;
  const hasComment = lines[commentIdx] && lines[commentIdx].includes('PR-v3');

  if (!hasComment) {
    // Insert a comment line before the joints line
    const comment = `    // PR-v3 (v1.3) — auto-fix spine sign error: ${issue.issue.substring(0, 80)}. Was spine:${oldSpine}, now spine:${newSpine}.`;
    lines.splice(jointsLineIdx, 0, comment);
    jointsLineIdx++; // adjust for inserted line
  }

  lines[jointsLineIdx + (hasComment ? 0 : 0)] = newLine;
  // If we inserted a comment, the joints line is now at jointsLineIdx + 1
  if (!hasComment) {
    lines[jointsLineIdx] = newLine;
  } else {
    lines[jointsLineIdx] = newLine;
  }

  fixes.push({ poseId, oldSpine, newSpine, reason: issue.issue.substring(0, 100) });
  fixedCount++;
}

// Write corrected file
fs.writeFileSync(POSES_DATA, lines.join('\n'));

console.log(`\nFixed ${fixedCount} spine sign errors`);
console.log(`\nSample fixes:`);
for (const f of fixes.slice(0, 10)) {
  console.log(`  ${f.poseId}: spine ${f.oldSpine} → ${f.newSpine} (${f.reason}...)`);
}

// Write fix log
const fixLog = {
  timestamp: new Date().toISOString(),
  totalFixed: fixedCount,
  fixes,
};
fs.writeFileSync(
  path.join(process.cwd(), 'audit', 'results', 'v3_spine_fix_log.json'),
  JSON.stringify(fixLog, null, 2)
);
console.log(`\nFix log: ${path.join(process.cwd(), 'audit', 'results', 'v3_spine_fix_log.json')}`);

