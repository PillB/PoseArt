// audit_harness/record-integrity-audit.js
// Check every pose record for semantic displacement:
// - name vs description mismatch
// - category vs instructions mismatch (standing name + kneeling desc)
// - figure type vs posture mismatch
// - tags inconsistent with pose identity
// - duplicate or shifted descriptions
// - near-duplicate records
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
const cats = sb.POSE_CATEGORIES;

const findings = [];

// Check 1: Category vs instructions mismatch
for (const id in lib) {
  const p = lib[id];
  const desc = (p.instructions || '').toLowerCase();
  const cat = p.category;
  // Standing category pose with kneeling/seated/reclining instructions
  if (cat === 'standing' && /kneel|sit on|seated|reclin|lying|lie on/.test(desc) && !/stand/.test(desc.slice(0,50))) {
    findings.push({ poseId: id, type: 'CATEGORY_DESC_MISMATCH', severity: 'high', detail: `standing category but desc says: ${desc.slice(0,60)}` });
  }
  // Kneeling category with standing instructions
  if (cat === 'kneeling' && /^stand/.test(desc) && !/kneel/.test(desc)) {
    findings.push({ poseId: id, type: 'CATEGORY_DESC_MISMATCH', severity: 'medium', detail: `kneeling category but desc starts with 'stand'` });
  }
  // Seated category with standing-only instructions
  if (cat === 'seated' && /^stand/.test(desc) && !/sit|seated|chair|bench/.test(desc)) {
    findings.push({ poseId: id, type: 'CATEGORY_DESC_MISMATCH', severity: 'medium', detail: `seated category but desc is standing` });
  }
}

// Check 2: Name vs description mismatch
for (const id in lib) {
  const p = lib[id];
  const name = (p.name || '').toLowerCase();
  const desc = (p.instructions || '').toLowerCase();
  // Name says "kneeling" but desc doesn't mention kneeling
  if (/kneel/.test(name) && !/kneel/.test(desc) && !/kneel/.test(p.tip||'')) {
    findings.push({ poseId: id, type: 'NAME_DESC_MISMATCH', severity: 'medium', detail: `name says kneeling but desc doesn't mention it` });
  }
  // Name says "standing" but desc says sitting/reclining
  if (/stand/.test(name) && /sit|reclin|lying|lie on/.test(desc) && !/stand/.test(desc)) {
    findings.push({ poseId: id, type: 'NAME_DESC_MISMATCH', severity: 'high', detail: `name says standing but desc says sit/recline` });
  }
  // Name says "reclining" but desc says standing
  if (/reclin/.test(name) && /^stand/.test(desc) && !/reclin|lying|lie on/.test(desc)) {
    findings.push({ poseId: id, type: 'NAME_DESC_MISMATCH', severity: 'high', detail: `name says reclining but desc says stand` });
  }
}

// Check 3: Near-duplicate descriptions (same desc text, different poses)
const descMap = {};
for (const id in lib) {
  const desc = (lib[id].instructions || '').trim();
  if (desc.length > 30) {
    if (!descMap[desc]) descMap[desc] = [];
    descMap[desc].push(id);
  }
}
for (const desc in descMap) {
  if (descMap[desc].length > 1) {
    findings.push({ poseId: descMap[desc][0], type: 'DUPLICATE_DESC', severity: 'high', detail: `identical desc in ${descMap[desc].length} poses: ${descMap[desc].join(', ')}` });
  }
}

// Check 4: Figure type vs category mismatch
for (const id in lib) {
  const p = lib[id];
  const fig = p.figure || '';
  const cat = p.category;
  // Kneeling figure type but standing category
  if (/kneel/.test(fig) && cat === 'standing') {
    findings.push({ poseId: id, type: 'FIGURE_CATEGORY_MISMATCH', severity: 'medium', detail: `figure=${fig} but category=standing` });
  }
  // Standing figure but reclining category
  if (/stand/.test(fig) && cat === 'reclining') {
    findings.push({ poseId: id, type: 'FIGURE_CATEGORY_MISMATCH', severity: 'medium', detail: `figure=${fig} but category=reclining` });
  }
}

// Check 5: Joints incompatible with category
for (const id in lib) {
  const p = lib[id];
  const j = p.joints || {};
  const cat = p.category;
  // Standing category but globalTilt > 60 (should be upright)
  if (cat === 'standing' && Math.abs(j.globalTilt || 0) > 60) {
    findings.push({ poseId: id, type: 'JOINTS_CATEGORY_MISMATCH', severity: 'high', detail: `standing category but globalTilt=${j.globalTilt} (reclining)` });
  }
  // Kneeling category but knees < 30 (should be bent)
  if (cat === 'kneeling' && Math.abs(j.globalTilt || 0) < 60) {
    const lk = j.leftKnee || 0, rk = j.rightKnee || 0;
    if (lk < 30 && rk < 30) {
      findings.push({ poseId: id, type: 'JOINTS_CATEGORY_MISMATCH', severity: 'high', detail: `kneeling category but knees L=${lk} R=${rk} (straight)` });
    }
  }
}

// Check 6: Missing required fields
for (const id in lib) {
  const p = lib[id];
  if (!p.instructions) findings.push({ poseId: id, type: 'MISSING_FIELD', severity: 'medium', detail: 'missing instructions' });
  if (!p.tip) findings.push({ poseId: id, type: 'MISSING_FIELD', severity: 'low', detail: 'missing tip' });
  if (!p.tags || !p.tags.length) findings.push({ poseId: id, type: 'MISSING_FIELD', severity: 'low', detail: 'missing tags' });
}

// Summary
console.log('=== RECORD INTEGRITY AUDIT ===');
console.log('Total poses:', Object.keys(lib).length);
console.log('Total findings:', findings.length);

const byType = {};
for (const f of findings) { byType[f.type] = (byType[f.type] || 0) + 1; }
console.log('\n=== BY TYPE ===');
Object.entries(byType).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

const bySev = {};
for (const f of findings) { bySev[f.severity] = (bySev[f.severity] || 0) + 1; }
console.log('\n=== BY SEVERITY ===');
Object.entries(bySev).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

console.log('\n=== HIGH SEVERITY FINDINGS ===');
findings.filter(f => f.severity === 'high').slice(0, 15).forEach(f => console.log('  ' + f.poseId + ' [' + f.type + ']: ' + f.detail.slice(0,80)));

fs.writeFileSync(path.join(REPO, 'audit', 'pose-repair', 'record-integrity-findings.jsonl'), findings.map(f => JSON.stringify(f)).join('\n'));
console.log('\nWritten: audit/pose-repair/record-integrity-findings.jsonl');
