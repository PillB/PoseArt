// audit_harness/pose-forensic-sampler.js
// Posterior-magnitude sampling: sample 5 poses per category, capture avatar/
// skeleton/ghost, run VLM forensic analysis, identify issues, output fix list.
// If a category has >40% error rate, sample 5 MORE from that category.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const flow = require('./lib/pose-flow');

const REPO = path.resolve(__dirname, '..');
const SHA = execSync('git -C ' + REPO + ' rev-parse --short HEAD').toString().trim();
const OUT = path.join(REPO, 'audit', 'pose-forensic');
const RAW = path.join(OUT, 'raw');
const REPORTS = path.join(OUT, 'reports');
fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(REPORTS, { recursive: true });

const SAMPLE_SIZE = 5; // per category initially
const ERROR_THRESHOLD = 0.40; // if >40% errors, sample more
const W = 200, H = 280;

// Load poses
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const vm = require('vm');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;

// Group by category
const byCat = {};
for (const id in lib) { const p = lib[id]; (byCat[p.category] = byCat[p.category] || []).push(id); }

// Deterministic sample (seeded shuffle for reproducibility)
function seededSample(arr, n, seed) {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

// Capture a single pose/mode
async function capture(page, poseId, mode) {
  const file = path.join(RAW, poseId + '__' + mode + '.png');
  await page.evaluate(({ poseId, mode, w, h }) => {
    const pose = POSES_LIBRARY[poseId]; const joints = pose.joints || {};
    let c = document.getElementById('_ag_vis');
    if (!c) { c = document.createElement('canvas'); c.id = '_ag_vis'; c.style.position = 'fixed'; c.style.left = '0px'; c.style.top = '0px'; c.style.zIndex = '99999'; c.style.background = '#F4F1E8'; document.body.appendChild(c); }
    c.width = w; c.height = h; c.style.width = w + 'px'; c.style.height = h + 'px';
    const ctx = c.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, h);
    if (mode === 'avatar') PoseSkeleton3D.renderAvatarFrame(c, w, h, joints, { yaw: 0, pitch: 0, scale: 1, category: pose.category, description: pose.instructions });
    else if (mode === 'ghost') PoseSkeleton3D.renderGhostFrame(c, w, h, joints, { yaw: 0, pitch: 0, scale: 1, category: pose.category, description: pose.instructions });
    else { const s = Object.create(PoseSkeleton3D); s.init(c, w, h); s.setPose(joints, { animateEntry: false, category: pose.category, description: pose.instructions }); s.setViewAngle(0, 0); try { s.stopAutoRotate(); } catch (e) {} s.render(); s.destroy(); }
  }, { poseId, mode, w: W, h: H });
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: W, height: H } });
  return file;
}

(async () => {
  const { browser, ctx } = await flow.newContext({ width: 520, height: 640, deviceScaleFactor: 1 });
  const { page } = await flow.login(ctx);
  await page.waitForFunction(() => typeof PoseSkeleton3D !== 'undefined' && typeof POSES_LIBRARY !== 'undefined' && PoseSkeleton3D._internals, null, { timeout: 20000 });

  // Phase 1: sample 5 per category
  const sample = {};
  const categories = Object.keys(byCat).sort();
  for (const cat of categories) {
    sample[cat] = seededSample(byCat[cat], SAMPLE_SIZE, 42);
  }
  fs.writeFileSync(path.join(OUT, 'sample.json'), JSON.stringify(sample, null, 2));

  // Capture all
  let count = 0;
  for (const cat of categories) {
    for (const poseId of sample[cat]) {
      for (const mode of ['avatar', 'skeleton', 'ghost']) {
        await capture(page, poseId, mode);
        count++;
      }
    }
    console.log('  [ok] ' + cat + ': ' + sample[cat].length + ' poses × 3 modes');
  }
  fs.writeFileSync(path.join(OUT, 'capture-manifest.json'), JSON.stringify({ sha: SHA, date: new Date().toISOString(), count, categories: categories.length, sampleSize: SAMPLE_SIZE }, null, 2));
  await browser.close();
  console.log('[sampler] DONE: ' + count + ' images, ' + categories.length + ' categories, SHA=' + SHA);
})();
