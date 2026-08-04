// audit_harness/vlm-process-batch.js
// Process VLM sheets in small batches with rate-limit-safe delays.
// Usage: node vlm-process-batch.js <startSheet> <endSheet>
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const REPO = path.resolve(__dirname, '..');
const RAW = path.join(REPO, 'audit', 'pose-repair', 'census', 'raw');
const SHEETS = path.join(REPO, 'audit', 'pose-repair', 'census', 'sheets');
const REPORTS = path.join(REPO, 'audit', 'pose-repair', 'census', 'reports');

// Load pose IDs in order
const vm = require('vm');
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const allIds = Object.keys(sb.POSES_LIBRARY).sort();
const PER_SHEET = 6, TILE = 180;

async function buildSheet(sn, pids) {
  const cols = 3, rows = 2;
  const W = cols * TILE + 20, H = rows * (TILE + 20) + 30;
  const comps = [];
  for (let i = 0; i < pids.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const f = path.join(RAW, pids[i] + '.png');
    if (!fs.existsSync(f)) continue;
    const buf = await sharp(f).resize(TILE, TILE, { fit: 'contain', background: { r: 244, g: 241, b: 232, alpha: 1 } }).toBuffer();
    comps.push({ input: buf, left: 5 + c * (TILE + 5), top: 25 + r * (TILE + 20) });
  }
  const sf = path.join(SHEETS, 'sheet-' + String(sn).padStart(3, '0') + '.png');
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite(comps).png().toFile(sf);
  return sf;
}

const startSheet = parseInt(process.argv[2] || '41');
const endSheet = parseInt(process.argv[3] || '55');
const delayMs = parseInt(process.argv[4] || '6000');

(async () => {
  let ok = 0, fail = 0;
  for (let sn = startSheet; sn <= endSheet; sn++) {
    const of = path.join(REPORTS, 'sheet-' + String(sn).padStart(3, '0') + '.json');
    if (fs.existsSync(of)) { ok++; continue; }
    const pids = allIds.slice((sn - 1) * PER_SHEET, sn * PER_SHEET);
    const sf = await buildSheet(sn, pids);
    try {
      execFileSync('z-ai', ['vision', '-p', 'For each of 6 poses (labeled below image): POSE_ID: OK or POSE_ID: ISSUE - brief. Check limbs, balance, feet, hands, spine. Terse.', '-i', path.resolve(sf), '-o', path.resolve(of)], { timeout: 50000, stdio: 'pipe' });
      ok++;
      console.log('  [ok] sheet ' + sn);
    } catch (e) {
      fail++;
      const err = e.stderr ? e.stderr.toString().slice(0, 50) : '';
      console.log('  [FAIL] sheet ' + sn + ': ' + err);
      if (err.includes('429')) {
        console.log('  [429] waiting 20s...');
        const w = Date.now(); while (Date.now() - w < 20000);
      }
    }
    const w = Date.now(); while (Date.now() - w < delayMs);
  }
  console.log('Batch ' + startSheet + '-' + endSheet + ': ' + ok + ' ok, ' + fail + ' failed');
})();
