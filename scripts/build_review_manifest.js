/**
 * Build a review manifest listing every pose with its PNG path, name, instructions,
 * category, and current joint values. Batch-review subagents consume this file
 * and emit joint override diffs.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');
const OUT_DIR = path.join(REPO, 'qa_screenshots', 'pose_pngs');
const MANIFEST = path.join(REPO, 'qa_screenshots', 'review_manifest.jsonl');

const src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8').replace(/^const /gm, 'var ');
const ctx = { window: {}, document: {} };
vm.createContext(ctx);
vm.runInContext(src, ctx);
const lib = ctx.POSES_LIBRARY;

const rows = [];
for (const [id, p] of Object.entries(lib)) {
  const pngPath = path.join(OUT_DIR, id + '.png');
  rows.push({
    id,
    png: path.relative(REPO, pngPath),
    name: p.name,
    category: p.category,
    subcategory: p.subcategory || null,
    view: p.view || null,
    level: p.level || null,
    dynamic: p.dynamic || null,
    instructions: p.instructions || '',
    joints: p.joints || {}
  });
}

fs.writeFileSync(MANIFEST, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
console.log('wrote', rows.length, 'rows to', path.relative(REPO, MANIFEST));

// Also split into batches
const BATCH_SIZE = 18;
const batchDir = path.join(REPO, 'qa_screenshots', 'review_batches');
fs.mkdirSync(batchDir, { recursive: true });
for (const f of fs.readdirSync(batchDir)) fs.unlinkSync(path.join(batchDir, f));

const nBatches = Math.ceil(rows.length / BATCH_SIZE);
for (let i = 0; i < nBatches; i++) {
  const chunk = rows.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
  const name = `batch_${String(i + 1).padStart(3, '0')}.jsonl`;
  fs.writeFileSync(path.join(batchDir, name), chunk.map(r => JSON.stringify(r)).join('\n') + '\n');
}
console.log('wrote', nBatches, 'batches of', BATCH_SIZE, 'to', path.relative(REPO, batchDir));
