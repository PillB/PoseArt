// audit_harness/apply-consistency-fixes.js
// Apply the fixes from pose-consistency-fixer.js to js/poses-data.js.
// Reads the consistency-issues.json, applies joint angle corrections,
// writes the modified poses-data.js.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');
const fixesFile = path.join(REPO, 'audit', 'pose-forensic', 'reports', 'consistency-issues.json');
const fixes = JSON.parse(fs.readFileSync(fixesFile, 'utf8')).fixes;

// Read poses-data.js
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');

// Load the library to get the current joint values
let loadSrc = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
loadSrc = loadSrc.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
loadSrc = loadSrc.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(loadSrc, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;

// Group fixes by poseId (a pose may have multiple rule fixes)
const fixesByPose = {};
for (const f of fixes) {
  if (!fixesByPose[f.poseId]) fixesByPose[f.poseId] = [];
  fixesByPose[f.poseId].push(f);
}

let applied = 0;
for (const poseId of Object.keys(fixesByPose)) {
  const poseFixes = fixesByPose[poseId];
  const pose = lib[poseId];
  if (!pose) { console.log('  [skip] unknown pose', poseId); continue; }
  const oldJoints = JSON.stringify(pose.joints);

  // Apply all fixes for this pose (merge — later fixes override earlier)
  let mergedJoints = JSON.parse(JSON.stringify(pose.joints));
  for (const f of poseFixes) {
    mergedJoints = f.fix; // f.fix is already the full modified joints object
  }

  // Verify the fix actually changed something
  const newJoints = JSON.stringify(mergedJoints);
  if (oldJoints === newJoints) { console.log('  [noop] ' + poseId); continue; }

  // Apply to the source file: find the pose's joints block and replace it
  // poses-data.js format: id: { name: "...", ..., joints: {...}, ... }
  // We need to find the joints object for this specific pose and replace its values

  // Strategy: find `poseId:` then find `joints:` within that block, then replace the JSON
  const posePattern = new RegExp("(['\"])" + poseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\1\\s*:");
  const poseMatch = src.match(posePattern);
  if (!poseMatch) { console.log('  [skip] poseId not found in source', poseId); continue; }

  const poseStart = poseMatch.index;
  // Find the joints: property after this poseId
  const jointsPattern = /joints\s*:\s*\{/g;
  jointsPattern.lastIndex = poseStart;
  const jointsMatch = jointsPattern.exec(src);
  if (!jointsMatch) { console.log('  [skip] joints not found for', poseId); continue; }

  // Find the matching closing brace for the joints object
  let braceCount = 0;
  let jointsStart = jointsMatch.index + jointsMatch[0].length - 1; // position of opening {
  let jointsEnd = -1;
  for (let i = jointsStart; i < src.length; i++) {
    if (src[i] === '{') braceCount++;
    else if (src[i] === '}') { braceCount--; if (braceCount === 0) { jointsEnd = i; break; } }
  }
  if (jointsEnd < 0) { console.log('  [skip] joints close brace not found for', poseId); continue; }

  // Build the new joints JSON string (compact, matching existing format)
  const newJointsStr = JSON.stringify(mergedJoints);
  // Replace the joints object content
  src = src.slice(0, jointsStart + 1) + '\n' + newJointsStr.slice(1, -1) + '\n  ' + src.slice(jointsEnd);
  applied++;
  console.log('  [fixed] ' + poseId + ' (' + poseFixes.map(f => f.rule).join(', ') + ')');
}

// Write the modified source
fs.writeFileSync(path.join(REPO, 'js', 'poses-data.js'), src);
console.log('\n=== APPLIED ' + applied + ' fixes to poses-data.js ===');
