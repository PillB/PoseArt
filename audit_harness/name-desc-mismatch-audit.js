// audit_harness/name-desc-mismatch-audit.js
// Detects poses where the NAME doesn't match the INSTRUCTIONS/TIP content.
// "Description is king" — when name and description disagree, the description
// is the ground truth (protocol §4, §14). But a mismatch signals possible
// data corruption (shuffled descriptions) that needs documentation.
// Heuristic: extract key action/object words from the name, check if they
// appear (or a synonym) in the instructions. Flag mismatches for review.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');
const RUN_ID = fs.readFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), 'utf8').trim();

function loadLib() {
  let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
  src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
  src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
  src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
  const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
  vm.runInContext(src, sb, { filename: 'poses-data.js' });
  return sb.POSES_LIBRARY;
}
const lib = loadLib();

// Extract significant words from a pose name (strip p01-master-s1- prefix, split on - and camelCase)
function nameKeywords(name) {
  // Strip pXX-master- / pXX- prefixes
  let n = name.replace(/^p\d+-(master|male|chair|wall|floor|bench|bed|tubes|lounge|armchair|unconv)-?/i, '');
  n = n.replace(/-/g, ' ');
  // Split camelCase
  n = n.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  // Filter stop words + short words
  const stop = new Set(['the','a','an','and','or','to','of','in','on','at','for','with','sit','stand','pose','s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','b1','b2','b3','b4','b5','b6','b7','b8','b9','b10','w1','w2','w3','w4','w5','w6','w7','w8','w9','r1','r2','r3','r4','r5','r6','r7','r8','r9','r10']);
  return n.split(/\s+/).filter(w => w.length > 2 && !stop.has(w));
}

// Check if a name keyword appears in the description (or a synonym)
function keywordInDesc(kw, desc) {
  const d = desc.toLowerCase();
  if (d.includes(kw)) return true;
  // Synonyms
  const syn = {
    'kneel': ['kneel', 'kneeling', 'knees', 'knee'],
    'pray': ['pray', 'prayer', 'palms together', 'hands together'],
    'bow': ['bow', 'bend forward', 'fold'],
    'arch': ['arch', 'backbend', 'back bend', 'chest up'],
    'hug': ['hug', 'wrap', 'embrace', 'clasp'],
    'reach': ['reach', 'extend', 'stretch'],
    'floor': ['floor', 'ground', 'mat'],
    'wall': ['wall', 'surface'],
    'chair': ['chair', 'seat', 'armrest'],
    'bench': ['bench', 'seat'],
    'cross': ['cross', 'crossed', 'interlock'],
    'twist': ['twist', 'rotate', 'rotation', 'turn'],
    'side': ['side', 'lateral'],
    'back': ['back', 'backward', 'behind'],
    'forward': ['forward', 'front'],
    'up': ['up', 'overhead', 'raise', 'lift'],
    'down': ['down', 'lower', 'drop'],
    'arm': ['arm', 'arms', 'hand', 'hands'],
    'leg': ['leg', 'legs'],
    'head': ['head', 'neck'],
    'hand': ['hand', 'hands', 'fingers'],
    'hip': ['hip', 'hips', 'pelvis'],
    'chest': ['chest', 'ribcage', 'torso'],
    'profile': ['profile', 'side view', 'side'],
    'look': ['look', 'gaze', 'turn'],
    'tuck': ['tuck', 'fold', 'curl'],
    'crouch': ['crouch', ' squat', 'low'],
    'dragon': ['dragon'], // proper noun
    'stretch': ['stretch', 'extend', 'lengthen']
  };
  if (syn[kw]) {
    for (const s of syn[kw]) if (d.includes(s)) return true;
  }
  return false;
}

const mismatches = [];
const byCategory = {};
for (const id of Object.keys(lib)) {
  const p = lib[id];
  if (!p.name || !p.instructions) continue;
  const kws = nameKeywords(p.name);
  if (kws.length === 0) continue;
  const desc = (p.instructions + ' ' + (p.tip || '')).toLowerCase();
  // At least 50% of name keywords should appear in description
  const found = kws.filter(kw => keywordInDesc(kw, desc));
  const ratio = found.length / kws.length;
  if (ratio < 0.4 && kws.length >= 2) {
    mismatches.push({ id, cat: p.category, name: p.name, kws, found, missing: kws.filter(kw => !found.includes(kw)), ratio, instr: p.instructions.slice(0, 80) });
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  }
}

console.log('Name-vs-description mismatches: ' + mismatches.length + ' / ' + Object.keys(lib).length + ' poses');
console.log('\nBy category:');
for (const [c, n] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
  console.log('  ' + c.padEnd(14) + n);
}
console.log('\nSample (first 30):');
for (const m of mismatches.slice(0, 30)) {
  console.log('  [' + m.cat.padEnd(12) + '] ' + m.id.padEnd(40) + ' name="' + m.name + '"');
  console.log('      missing keywords: ' + m.missing.join(', '));
  console.log('      instr: ' + m.instr);
}
fs.writeFileSync(path.join(REPO, 'artifacts', 'pose-audit', RUN_ID, 'name-desc-mismatches.json'), JSON.stringify(mismatches, null, 2));
console.log('\nWritten: artifacts/pose-audit/' + RUN_ID + '/name-desc-mismatches.json');
