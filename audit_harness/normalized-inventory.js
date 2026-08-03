// audit_harness/normalized-inventory.js
// Build normalized pose inventory: category × posture_family × support_class
// for posterior-risk adaptive stratified sampling.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;

// Derive posture_family from joints + category
function postureFamily(pose) {
  const j = pose.joints || {};
  const cat = pose.category;
  const gt = Math.abs(j.globalTilt || 0);
  const desc = (pose.instructions || '').toLowerCase();

  // Reclining poses
  if (gt > 60) {
    if (j.globalTilt > 0) return 'prone';
    if (/side/.test(desc) || Math.abs(j.globalRoll || 0) > 20) return 'side-reclining';
    return 'supine';
  }
  // Kneeling
  if (cat === 'kneeling' || /kneel/.test(desc)) {
    const lk = j.leftKnee || 0, rk = j.rightKnee || 0;
    if (lk > 60 && rk < 30) return 'half-kneeling';
    return 'kneeling';
  }
  // Crouching
  if (/crouch|squat/.test(desc)) return 'crouching';
  // Seated
  if (cat === 'seated' || cat === 'lean-seat' || /sit|seated/.test(desc)) {
    if (/floor|ground/.test(desc)) return 'seated-floor';
    return 'seated-chair';
  }
  // Leaning
  if (cat === 'leaning' || /lean.*wall|wall.*lean|doorframe/.test(desc)) return 'leaning-standing';
  // Dynamic
  if (cat === 'dynamic' || /leap|jump|throw|spin|run/.test(desc)) return 'dynamic-airborne';
  if (cat === 'low-to-high' || cat === 'high-to-low') return 'transitional';
  // Standing
  if (cat === 'standing' || cat === 'fashion' || cat === 'editorial' || cat === 'eccentric' || cat === 'boudoir' || cat === 'fine-art') return 'standing';
  // Couple
  if (cat === 'couple') return 'couple';
  // Accessible
  if (cat === 'accessible') return 'accessible';
  return 'other';
}

// Derive support_class from description + category
function supportClass(pose) {
  const desc = (pose.instructions || '').toLowerCase();
  const cat = pose.category;
  if (/wheelchair/.test(desc)) return 'wheelchair';
  if (/bed|pillow|mattress/.test(desc)) return 'bed';
  if (/bench/.test(desc)) return 'bench';
  if (/table/.test(desc)) return 'table';
  if (/chair|armchair/.test(desc)) return 'chair';
  if (/wall|doorframe|pillar/.test(desc)) return 'wall';
  if (/couch|sofa|chaise|lounge/.test(desc)) return 'couch';
  if (/floor|ground/.test(desc)) return 'floor';
  if (/partner|couple|embrace/.test(desc) || cat === 'couple') return 'partner';
  if (/pool|water|float/.test(desc)) return 'water';
  if (/fabric|garment|sheet|drape/.test(desc)) return 'fabric';
  if (/railing|ledge/.test(desc)) return 'railing';
  return 'none';
}

// Build inventory
const inventory = [];
for (const id in lib) {
  const p = lib[id];
  inventory.push({
    poseId: id,
    name: p.name,
    category: p.category,
    postureFamily: postureFamily(p),
    supportClass: supportClass(p),
    difficulty: p.difficulty || 'Unknown',
    angle: p.angle || 'Unknown',
    intent: p.intent || 'Unknown',
    effort: p.effort || 'Unknown',
    figure: p.figure || 'default',
    tags: (p.tags || []).join(','),
    globalTilt: p.joints ? p.joints.globalTilt || 0 : 0,
    spine: p.joints ? p.joints.spine || 0 : 0,
    // Visual-risk flags
    extremeJoints: hasExtremeJoints(p.joints || {}),
    handToFace: /hand.*face|chin|cheek|forehead|jaw/.test((p.instructions||'') + p.name),
    crossedLimbs: /cross/.test((p.instructions||'') + p.name),
    recliningProj: Math.abs((p.joints||{}).globalTilt || 0) > 60,
    backArch: /arch.*back|back.*arch/.test((p.instructions||'') + p.name),
    dynamic: p.category === 'dynamic' || /leap|jump|throw/.test(p.instructions||''),
    couple: p.category === 'couple',
    accessible: p.category === 'accessible',
    nearDuplicate: false // computed below
  });
}

function hasExtremeJoints(j) {
  const extremes = [
    Math.abs(j.leftShoulder || 0) > 140,
    Math.abs(j.rightShoulder || 0) > 140,
    Math.abs(j.spine || 0) > 40,
    Math.abs(j.leftHip || 0) > 110,
    Math.abs(j.rightHip || 0) > 110,
    Math.abs(j.leftKnee || 0) > 130,
    Math.abs(j.rightKnee || 0) > 130,
  ];
  return extremes.some(Boolean);
}

// Detect near-duplicates (same posture + same support + similar joints)
const byKey = {};
for (const p of inventory) {
  const key = p.postureFamily + '|' + p.supportClass + '|' + p.category;
  if (!byKey[key]) byKey[key] = [];
  byKey[key].push(p);
}
// Mark near-duplicates within each stratum (same spine + shoulder values)
for (const key in byKey) {
  const group = byKey[key];
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = lib[group[i].poseId].joints || {};
      const b = lib[group[j].poseId].joints || {};
      if (Math.abs((a.spine||0) - (b.spine||0)) < 3 &&
          Math.abs((a.leftShoulder||0) - (b.leftShoulder||0)) < 10 &&
          Math.abs((a.rightShoulder||0) - (b.rightShoulder||0)) < 10) {
        group[i].nearDuplicate = true;
        group[j].nearDuplicate = true;
      }
    }
  }
}

// Build strata
const strata = {};
for (const p of inventory) {
  const key = p.category + ' × ' + p.postureFamily + ' × ' + p.supportClass;
  if (!strata[key]) strata[key] = [];
  strata[key].push(p.poseId);
}

// Write outputs
const OUT = path.join(REPO, 'audit', 'pose-repair');
fs.writeFileSync(path.join(OUT, 'normalized-pose-inventory.json'), JSON.stringify(inventory, null, 2));
fs.writeFileSync(path.join(OUT, 'sampling', 'strata.json'), JSON.stringify(strata, null, 2));

// Summary
console.log('=== NORMALIZED POSE INVENTORY ===');
console.log('Total poses:', inventory.length);
console.log('Total strata:', Object.keys(strata).length);

// Posture family distribution
const byPF = {};
for (const p of inventory) { byPF[p.postureFamily] = (byPF[p.postureFamily] || 0) + 1; }
console.log('\n=== POSTURE FAMILY ===');
Object.entries(byPF).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

// Support class distribution
const bySC = {};
for (const p of inventory) { bySC[p.supportClass] = (bySC[p.supportClass] || 0) + 1; }
console.log('\n=== SUPPORT CLASS ===');
Object.entries(bySC).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

// Visual-risk flags
const flags = ['extremeJoints','handToFace','crossedLimbs','recliningProj','backArch','dynamic','couple','accessible','nearDuplicate'];
console.log('\n=== VISUAL-RISK FLAGS ===');
for (const f of flags) {
  const count = inventory.filter(p => p[f]).length;
  console.log('  ' + f + ': ' + count);
}

// Top 10 largest strata
console.log('\n=== TOP 10 STRATA ===');
Object.entries(strata).sort((a,b) => b[1].length - a[1].length).slice(0,10).forEach(([k,v]) => console.log('  ' + k + ': ' + v.length));
