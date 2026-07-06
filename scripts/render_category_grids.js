/**
 * Playwright script — render every one of the 16 categories to an HTML page
 * showing every pose with its rendered SVG, joints, id, name, instructions.
 * Meant to be executed inside a Playwright REPL context (uses global `pg`).
 *
 * Usage from js_repl:
 *   const script = require('/home/user/workspace/PoseArt/scripts/render_category_grids.js');
 *   await script.renderAll(pg, '/home/user/workspace/PoseArt/qa_screenshots/review_v3');
 */
const fs = require('fs');
const path = require('path');

function buildHtml(category, poses) {
  const cardHtml = poses.map((p, idx) => `
    <div class="card">
      <div class="num">${idx + 1}</div>
      <div class="figHost" data-id="${p.id}"></div>
      <div class="name">${p.name}</div>
      <div class="id">${p.id}</div>
      <div class="meta">${p.level || ''} · ${p.view || ''} · ${p.dynamic || 'Static'}</div>
      <div class="instr">${(p.instructions || '').slice(0, 100)}</div>
      <div class="joints">${JSON.stringify(p.joints)}</div>
    </div>`).join('');

  return `<!doctype html><html><head><meta charset="utf-8">
<title>${category} — grid</title>
<style>
body{font-family:sans-serif;background:#f7f7f5;margin:0;padding:16px;color:#111}
h1{color:#0F3B3A;margin:0 0 4px}
h1 .n{color:#C9A24C;font-size:14px}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.card{background:white;border-radius:8px;padding:8px;box-shadow:0 2px 6px rgba(0,0,0,.08);position:relative}
.figHost svg{display:block;margin:0 auto}
.card .num{position:absolute;top:6px;left:8px;background:#0F3B3A;color:white;font-size:10px;padding:1px 6px;border-radius:8px}
.card .name{font-size:11px;font-weight:600;margin:4px 0 2px;text-align:center}
.card .id{font-size:9px;color:#888;font-family:monospace;text-align:center;margin-bottom:3px}
.card .meta{font-size:9px;color:#555;text-align:center;margin-bottom:3px}
.card .instr{font-size:9px;color:#333;line-height:1.3;padding:3px 4px;background:#f5f4f0;border-radius:4px;min-height:35px}
.card .joints{font-size:7px;color:#a04;font-family:monospace;margin-top:3px;word-break:break-all}
</style>
<script src="../../js/poses-data.js"></script>
<script src="../../js/pose-skeleton-3d.js"></script>
<script src="../../js/pose-figure-procedural.js"></script>
</head><body>
<h1>${category} <span class="n">— ${poses.length} poses</span></h1>
<div class="grid">${cardHtml}</div>
<script>
document.querySelectorAll('.figHost').forEach(h => {
  const id = h.dataset.id;
  const p = POSES_LIBRARY[id];
  if (!p) { h.textContent = 'missing: '+id; return; }
  h.innerHTML = window.PoseFigureProcedural.render(p, { width: 150, height: 210, animate: false });
});
</script>
</body></html>`;
}

module.exports = {
  async renderAll(pg, outDir) {
    fs.mkdirSync(outDir, { recursive: true });
    // Load lib in node (mirror runtime)
    const vm = require('vm');
    const src = fs.readFileSync('/home/user/workspace/PoseArt/js/poses-data.js', 'utf8').replace(/^const /gm, 'var ');
    const ctx = { window: {}, document: {} };
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    const lib = ctx.POSES_LIBRARY;
    const byCat = {};
    for (const p of Object.values(lib)) {
      if (!byCat[p.category]) byCat[p.category] = [];
      byCat[p.category].push(p);
    }
    const cats = Object.keys(byCat).sort();
    for (const cat of cats) {
      const html = buildHtml(cat, byCat[cat]);
      const htmlPath = path.join(outDir, cat + '.html');
      fs.writeFileSync(htmlPath, html);
      // now navigate playwright and screenshot
      const url = 'http://localhost:8096/qa_screenshots/' + path.basename(outDir) + '/' + cat + '.html?bust=' + Date.now();
      await pg.goto(url, { waitUntil: 'networkidle' });
      await pg.waitForTimeout(500);
      const pngPath = path.join(outDir, cat + '.png');
      await pg.screenshot({ path: pngPath, fullPage: true });
      console.log('rendered', cat, byCat[cat].length, 'poses');
    }
    return cats;
  }
};
