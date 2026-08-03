// audit_harness/vlm-retry-failed.js — retry failed sheets with longer delays
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const REPO = path.resolve(__dirname, '..');
const RAW = path.join(REPO, 'audit', 'pose-repair', 'census', 'raw');
const SHEETS = path.join(REPO, 'audit', 'pose-repair', 'census', 'sheets');
const REPORTS = path.join(REPO, 'audit', 'pose-repair', 'census', 'reports');

const vm = require('vm');
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;
const allIds = Object.keys(lib).sort();
const PER_SHEET = 6;
const TILE = 180;

async function buildSheet(sheetNum, poseIds) {
  const cols = 3, rows = 2;
  const W = cols * TILE + 20, H = rows * (TILE + 20) + 30;
  const comps = [];
  for (let i = 0; i < poseIds.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const f = path.join(RAW, poseIds[i] + '.png');
    if (!fs.existsSync(f)) continue;
    const buf = await sharp(f).resize(TILE, TILE, { fit: 'contain', background: { r: 244, g: 241, b: 232, alpha: 1 } }).toBuffer();
    comps.push({ input: buf, left: 5 + c * (TILE + 5), top: 25 + r * (TILE + 20) });
  }
  const sheetFile = path.join(SHEETS, 'sheet-' + String(sheetNum).padStart(3, '0') + '.png');
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite(comps).png().toFile(sheetFile);
  return sheetFile;
}

(async () => {
  // Find missing sheets
  const existing = fs.readdirSync(REPORTS).filter(f => f.endsWith('.json')).map(f => parseInt(f.match(/\d+/)[0]));
  const missing = [];
  for (let i = 1; i <= 125; i++) { if (!existing.includes(i)) missing.push(i); }
  console.log('[retry] ' + missing.length + ' sheets to process');

  let ok = 0, fail = 0;
  for (const sheetNum of missing) {
    const poseIds = allIds.slice((sheetNum - 1) * PER_SHEET, sheetNum * PER_SHEET);
    const sheetFile = await buildSheet(sheetNum, poseIds);
    const outFile = path.join(REPORTS, 'sheet-' + String(sheetNum).padStart(3, '0') + '.json');
    try {
      execFileSync('z-ai', ['vision', '-p', 'For each of the 6 poses, answer: POSE_ID: OK or POSE_ID: ISSUE - brief. Check limbs, balance, feet, hands, spine. Terse.', '-i', path.resolve(sheetFile), '-o', path.resolve(outFile)], { timeout: 60000, stdio: 'pipe' });
      ok++;
      if (ok % 5 === 0) console.log('  [progress] ' + ok + ' done, ' + fail + ' failed');
    } catch (e) {
      fail++;
      // If rate-limited, wait longer
      if (e.stderr && e.stderr.toString().includes('429')) {
        console.log('  [429] rate limited, waiting 30s...');
        const start = Date.now(); while (Date.now() - start < 30000);
      }
    }
    // 5s delay between calls
    const start = Date.now(); while (Date.now() - start < 5000);
  }
  console.log('[retry] DONE: ' + ok + ' ok, ' + fail + ' failed');
})();
