/**
 * Renders every pose in POSES_LIBRARY to an individual PNG:
 *   qa_screenshots/pose_pngs/<id>.png
 *
 * Runs inside a Playwright REPL where `pg` is a live page.
 *
 * Usage:
 *   const r = require('/home/user/workspace/PoseArt/scripts/render_all_pose_pngs.js');
 *   await r.renderAll(pg, { outDir, only, limit });
 *     only  — optional array of pose ids to render (else all)
 *     limit — optional numeric limit
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');
const PNG_OUT = path.join(REPO, 'qa_screenshots', 'pose_pngs');
const HTML_HOST = path.join(REPO, 'qa_screenshots', 'pose_pngs', '_host.html');

function loadLib() {
  const src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8').replace(/^const /gm, 'var ');
  const ctx = { window: {}, document: {} };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return ctx.POSES_LIBRARY;
}

function hostHtml() {
  return `<!doctype html><html><head><meta charset=utf-8><title>pose host</title>
<style>
body{margin:0;padding:0;background:#f7f7f5}
#host{width:300px;height:420px;display:flex;align-items:center;justify-content:center}
#host svg{display:block}
</style>
<script src="../../js/poses-data.js"></script>
<script src="../../js/pose-skeleton-3d.js"></script>
<script src="../../js/pose-figure-procedural.js"></script>
</head><body>
<div id=host></div>
<script>
window.renderPoseById = function(id, w, h){
  const p = POSES_LIBRARY[id];
  if(!p) return false;
  document.getElementById('host').innerHTML = window.PoseFigureProcedural.render(p, {width:w, height:h, animate:false});
  return true;
};
</script>
</body></html>`;
}

async function renderAll(pg, opts = {}) {
  const outDir = opts.outDir || PNG_OUT;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(HTML_HOST, hostHtml());

  const lib = loadLib();
  let ids = Object.keys(lib);
  if (opts.only && opts.only.length) ids = ids.filter(id => opts.only.includes(id));
  if (opts.limit) ids = ids.slice(0, opts.limit);

  const url = 'http://localhost:8096/qa_screenshots/pose_pngs/_host.html?bust=' + Date.now();
  await pg.goto(url, { waitUntil: 'networkidle' });
  await pg.setViewportSize({ width: 300, height: 420 });

  const W = 300, H = 420;
  let done = 0;
  const failed = [];
  for (const id of ids) {
    try {
      const ok = await pg.evaluate(([i, w, h]) => window.renderPoseById(i, w, h), [id, W, H]);
      if (!ok) { failed.push(id); continue; }
      await pg.waitForTimeout(20);
      const el = await pg.$('#host');
      await el.screenshot({ path: path.join(outDir, id + '.png') });
      done++;
      if (done % 25 === 0) console.log(`  rendered ${done}/${ids.length}`);
    } catch (e) {
      failed.push(id);
      console.log('  FAIL', id, e.message);
    }
  }
  console.log(`done: ${done}/${ids.length}, failed=${failed.length}`);
  return { done, failed };
}

module.exports = { renderAll, loadLib };
