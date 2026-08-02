#!/usr/bin/env node
// Phase 0 — Authoritative runtime inventory derived from POSES_LIBRARY.
// Loads poses-data.js in a VM (mirrors scripts/joint_validator.js), enumerates
// categories + poses, detects duplicate IDs, missing categories, malformed
// objects, and unreachable poses. Writes inventory.json + commands.jsonl.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const crypto = require('crypto');

const REPO = path.resolve(__dirname, '..');
const POSES_DATA = path.join(REPO, 'js', 'poses-data.js');
const MEMORY_DIR = path.join(REPO, 'artifacts', 'pose-audit', 'memory');
const RUN_ID_FILE = path.join(MEMORY_DIR, 'latest-run-id.txt');
// FIX 2026-08-02: prefer existing run ID from memory file to avoid drift.
// Only generate a new one if the file doesn't exist AND RUN_ID env isn't set.
function resolveRunId() {
  if (process.env.RUN_ID) return process.env.RUN_ID;
  try {
    if (fs.existsSync(RUN_ID_FILE)) {
      const existing = fs.readFileSync(RUN_ID_FILE, 'utf8').trim();
      if (existing) return existing;
    }
  } catch (e) {}
  return 'run-' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}
const RUN_ID = resolveRunId();
const OUT_DIR = path.join(REPO, 'artifacts', 'pose-audit', RUN_ID);
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(MEMORY_DIR, { recursive: true });

const log = (obj) => fs.appendFileSync(path.join(OUT_DIR, 'commands.jsonl'), JSON.stringify(obj) + '\n');
log({ ts: new Date().toISOString(), cmd: 'inventory', run_id: RUN_ID });

let src = fs.readFileSync(POSES_DATA, 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON };
sb.globalThis = sb;
vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });

const lib = sb.POSES_LIBRARY;
const cats = sb.POSE_CATEGORIES; // array of {id,name,...}

const catIds = cats.map(c => c.id);
const catById = Object.fromEntries(cats.map(c => [c.id, c]));

const poses = [];
const issues = [];
const seenIds = new Set();

for (const id of Object.keys(lib)) {
  const p = lib[id];
  if (seenIds.has(id)) { issues.push({ type: 'duplicate_id', id }); continue; }
  seenIds.add(id);
  if (!p || typeof p !== 'object') { issues.push({ type: 'malformed', id }); continue; }
  if (p.id !== id) { issues.push({ type: 'id_mismatch', id, stored: p.id }); }
  if (!p.category) { issues.push({ type: 'missing_category', id }); }
  else if (!catById[p.category]) { issues.push({ type: 'invalid_category', id, category: p.category }); }
  if (!p.joints || typeof p.joints !== 'object') { issues.push({ type: 'missing_joints', id }); }
  if (!p.name) { issues.push({ type: 'missing_name', id }); }
  if (!p.instructions) { issues.push({ type: 'missing_instructions', id }); }
  const hash = crypto.createHash('sha1').update(JSON.stringify(p.joints || {})).digest('hex').slice(0, 12);
  poses.push({
    id, name: p.name, category: p.category, difficulty: p.difficulty, angle: p.angle,
    intent: p.intent, effort: p.effort, figure: p.figure, tags: p.tags || [],
    joints_hash: hash,
    has_prop_keywords: /\b(chair|wall|fence|floor|bed|bench|table|tube|couch|sofa|lounge|railing|stool|armchair|mat|ottoman)\b/i.test((p.instructions || '') + ' ' + (p.tip || '')),
    has_global_tilt: !!(p.joints && p.joints.globalTilt),
    global_tilt: p.joints ? p.joints.globalTilt || 0 : 0
  });
}

// Group by category
const byCategory = {};
for (const c of catIds) byCategory[c] = [];
for (const p of poses) {
  if (byCategory[p.category]) byCategory[p.category].push(p.id);
  else issues.push({ type: 'unreachable_pose_no_category_bucket', id: p.id, category: p.category });
}

// Sort poses within each category alphabetically by id (deterministic)
for (const c of catIds) byCategory[c].sort();

const inventory = {
  run_id: RUN_ID,
  generated_at: new Date().toISOString(),
  source: 'js/poses-data.js (POSES_LIBRARY)',
  total_poses: poses.length,
  total_categories: cats.length,
  category_counts: Object.fromEntries(catIds.map(c => [c, byCategory[c].length])),
  categories: cats.map(c => ({ id: c.id, name: c.name, emoji: c.emoji, description: c.description, pose_count: byCategory[c.id].length })),
  poses,
  by_category: byCategory,
  issues,
  readme_documented_total: 745, // docs/POSEART_README.md says 761 then 745; poses-data header says 745
  inventory_deterministic: issues.filter(i => ['duplicate_id', 'malformed', 'id_mismatch'].includes(i.type)).length === 0
};

fs.writeFileSync(path.join(OUT_DIR, 'inventory.json'), JSON.stringify(inventory, null, 2));
fs.writeFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), RUN_ID);

console.log(`Run ID: ${RUN_ID}`);
console.log(`Total poses: ${poses.length}`);
console.log(`Total categories: ${cats.length}`);
console.log(`Category counts:`);
for (const c of cats) console.log(`  ${c.id.padEnd(14)} ${String(byCategory[c.id].length).padStart(3)}  ${c.name}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) console.log(issues.slice(0, 10).map(i => '  - ' + JSON.stringify(i)).join('\n'));
console.log(`Inventory deterministic: ${inventory.inventory_deterministic}`);
console.log(`Written: ${path.join(OUT_DIR, 'inventory.json')}`);
