// audit_harness/recovery-gate.js
// Recovery gate: audit every pose changed by the automatic consistency checker.
// Extracts before/after values, classifies each change, preserves both states.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const REPO = path.resolve(__dirname, '..');
const OUT = path.join(REPO, 'audit', 'pose-repair');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, 'recovery'), { recursive: true });

const BASE_SHA = 'd844a59'; // commit before automatic changes
const CURRENT_SHA = execSync('git -C ' + REPO + ' rev-parse --short HEAD').toString().trim();

// Load current poses
function loadPoses(file) {
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
  src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
  src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
  const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
  vm.runInContext(src, sb, { filename: 'poses-data.js' });
  return sb.POSES_LIBRARY;
}

// Get the pre-change poses from git
const preFile = path.join(OUT, 'recovery', 'poses-data.pre-d844a59.js');
const postFile = path.join(REPO, 'js', 'poses-data.js');
execSync('git -C ' + REPO + ' show ' + BASE_SHA + ':js/poses-data.js > ' + preFile);

const preLib = loadPoses(preFile);
const postLib = loadPoses(postFile);

// Find all changed poses
const changed = [];
for (const id in postLib) {
  const pre = preLib[id];
  const post = postLib[id];
  if (!pre) { changed.push({ id, type: 'NEW_POSE' }); continue; }
  const preJ = JSON.stringify(pre.joints || {});
  const postJ = JSON.stringify(post.joints || {});
  if (preJ !== postJ) {
    changed.push({ id, type: 'JOINTS_CHANGED', pre: pre.joints, post: post.joints, name: post.name, category: post.category, desc: (post.instructions||'').slice(0,100) });
  }
}

console.log('=== RECOVERY GATE ===');
console.log('Base SHA (pre-automatic):', BASE_SHA);
console.log('Current SHA:', CURRENT_SHA);
console.log('Poses changed:', changed.length);

// For each changed pose, classify the change
const consistencyIssues = JSON.parse(fs.readFileSync(path.join(REPO, 'audit', 'pose-forensic', 'reports', 'consistency-issues.json'), 'utf8'));
const fixesByPose = {};
for (const f of consistencyIssues.fixes) {
  if (!fixesByPose[f.poseId]) fixesByPose[f.poseId] = [];
  fixesByPose[f.poseId].push(f.rule);
}

const classifications = [];
for (const c of changed) {
  if (c.type !== 'JOINTS_CHANGED') continue;
  const rules = fixesByPose[c.id] || ['manual_fix (iteration 4+)'];
  // Classify based on rule + whether the change is semantically correct
  // We'll mark all as UNVERIFIED_AUTOMATIC_CHANGE initially
  const changedJoints = {};
  const pre = c.pre, post = c.post;
  for (const k in post) {
    if (JSON.stringify(pre[k]) !== JSON.stringify(post[k])) {
      changedJoints[k] = { before: pre[k], after: post[k] };
    }
  }
  classifications.push({
    poseId: c.id,
    name: c.name,
    category: c.category,
    desc: c.desc,
    rules: rules,
    changedJoints,
    classification: 'UNVERIFIED_AUTOMATIC_CHANGE'
  });
}

// Write the recovery report
fs.writeFileSync(path.join(OUT, 'recovery', 'automatic-change-audit.json'), JSON.stringify({
  base_sha: BASE_SHA,
  current_sha: CURRENT_SHA,
  total_changed: changed.length,
  classifications
}, null, 2));

// Summary by rule
const byRule = {};
for (const c of classifications) {
  for (const r of c.rules) { byRule[r] = (byRule[r] || 0) + 1; }
}
console.log('\n=== CHANGES BY RULE ===');
Object.entries(byRule).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

console.log('\n=== SAMPLE CHANGED POSES ===');
classifications.slice(0, 5).forEach(c => {
  console.log('  ' + c.poseId + ' [' + c.rules.join(',') + ']:');
  for (const k in c.changedJoints) {
    console.log('    ' + k + ': ' + c.changedJoints[k].before + ' → ' + c.changedJoints[k].after);
  }
});

console.log('\nWritten: audit/pose-repair/recovery/automatic-change-audit.json');
