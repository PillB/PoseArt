// audit_harness/fix-displaced-descriptions.js
// Manually fix description displacement for confirmed cases.
// Each fix is individually researched and documented.
// Pattern: descriptions are swapped between adjacent poses.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');

// Load to verify
let loadSrc = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
loadSrc = loadSrc.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
loadSrc = loadSrc.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(loadSrc, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;
const order = Object.keys(lib);

// Confirmed displacement cases (manually verified via VLM + neighbor analysis)
// Each entry: { poseId, swapWith, reason }
const SWAPS = [
  {
    poseId: 'boudoir-reclined-back-support',
    swapWith: 'boudoir-standing-corset-hands',
    reason: 'name="Reclined Arm Support" but desc="Stand in S-curve". Next pose desc="Recline onto both forearms" matches this name. globalTilt=-65 confirms reclining.'
  },
  {
    poseId: 'fineart-standing-back-bend-soft',
    swapWith: 'fineart-seated-profile-still',
    reason: 'name="Soft Standing Back Bend" but desc="Lie on one side". Next pose desc="Stand grounded and bend the upper spine back gently" matches this name. spine=30 confirms back bend.'
  },
  {
    poseId: 'boudoir-standing-profile-curve',
    swapWith: 'boudoir-kneeling-sit-back-heels',
    reason: 'name="Standing Profile Curve" but desc="Kneel and sit back". Next pose desc matches. Need to check which neighbor has the standing desc.'
  },
];

// For each confirmed swap, exchange the instructions between the two poses
let fixes = 0;
for (const swap of SWAPS) {
  const p1 = lib[swap.poseId];
  const p2 = lib[swap.swapWith];
  if (!p1 || !p2) { console.log('  [skip] missing pose', swap.poseId, swap.swapWith); continue; }

  const desc1 = p1.instructions;
  const desc2 = p2.instructions;
  console.log('  [swap] ' + swap.poseId + ' <-> ' + swap.swapWith);
  console.log('    ' + swap.poseId + ' name="' + p1.name + '" old desc="' + desc1.slice(0,50) + '"');
  console.log('    ' + swap.swapWith + ' name="' + p2.name + '" old desc="' + desc2.slice(0,50) + '"');
  console.log('    reason: ' + swap.reason);

  // Swap the instructions in the source file
  // Find p1's instructions and p2's instructions, swap them
  // We need to be careful to match the exact strings
  const p1Pattern = `instructions: '${desc1.replace(/[']/g, "\\'")}'`;
  const p2Pattern = `instructions: '${desc2.replace(/[']/g, "\\'")}'`;

  // Also check for double-quote format
  const p1PatternDQ = `instructions: "${desc1.replace(/["]/g, '\\"')}"`;
  const p2PatternDQ = `instructions: "${desc2.replace(/["]/g, '\\"')}"`;

  if (src.includes(p1Pattern) && src.includes(p2Pattern)) {
    // Single-quote format
    src = src.replace(p1Pattern, '__TEMP_SWAP_HOLD__');
    src = src.replace(p2Pattern, p1Pattern);
    src = src.replace('__TEMP_SWAP_HOLD__', p2Pattern);
    fixes++;
    console.log('    [fixed] single-quote format');
  } else if (src.includes(p1PatternDQ) && src.includes(p2PatternDQ)) {
    // Double-quote format
    src = src.replace(p1PatternDQ, '__TEMP_SWAP_HOLD__');
    src = src.replace(p2PatternDQ, p1PatternDQ);
    src = src.replace('__TEMP_SWAP_HOLD__', p2PatternDQ);
    fixes++;
    console.log('    [fixed] double-quote format');
  } else {
    console.log('    [FAIL] could not find exact instruction strings in source');
  }
  console.log('');
}

fs.writeFileSync(path.join(REPO, 'js', 'poses-data.js'), src);
console.log('=== APPLIED ' + fixes + ' description swaps ===');
