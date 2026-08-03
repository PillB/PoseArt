// audit_harness/build-forensic-sheets.js — build per-category contact sheets
// from the forensic sample. 5 poses × 3 modes per sheet, one sheet per category.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const REPO = path.resolve(__dirname, '..');
const RAW = path.join(REPO, 'audit', 'pose-forensic', 'raw');
const OUT = path.join(REPO, 'audit', 'pose-forensic', 'sheets');
fs.mkdirSync(OUT, { recursive: true });

const sample = JSON.parse(fs.readFileSync(path.join(REPO, 'audit', 'pose-forensic', 'sample.json'), 'utf8'));
const MODES = ['avatar', 'skeleton', 'ghost'];
const TILE = 180, PAD = 8;

async function label(w, text, size, fill, bold) {
  const svg = '<svg width="' + w + '" height="18"><text x="3" y="13" font-family="monospace" font-size="' + size + '" ' + (bold ? 'font-weight="bold" ' : '') + 'fill="' + fill + '">' + text + '</text></svg>';
  return sharp({ create: { width: w, height: 18, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toBuffer();
}

(async () => {
  for (const cat of Object.keys(sample).sort()) {
    const poses = sample[cat];
    const rows = poses.length;
    const W = 3 * TILE + PAD * 4 + 100;
    const H = rows * (TILE + 22) + PAD * (rows + 1) + 24;
    const comps = [];
    const hdr = await label(W, cat + ' (' + poses.length + ' poses)', 12, '#0F3B3A', true);
    comps.push({ input: hdr, left: PAD, top: 4 });
    for (let r = 0; r < rows; r++) {
      const poseId = poses[r];
      const yBase = PAD + 24 + r * (TILE + 22 + PAD);
      const rl = await label(95, poseId.slice(0, 18), 8, '#0F3B3A', false);
      comps.push({ input: rl, left: 0, top: yBase + 8 });
      for (let c = 0; c < 3; c++) {
        const mode = MODES[c];
        const f = path.join(RAW, poseId + '__' + mode + '.png');
        if (!fs.existsSync(f)) continue;
        const buf = await sharp(f).resize(TILE, TILE, { fit: 'contain', background: { r: 244, g: 241, b: 232, alpha: 1 } }).toBuffer();
        const x = 100 + PAD + c * (TILE + PAD);
        comps.push({ input: buf, left: x, top: yBase + 22 });
        const ml = await label(TILE, mode, 8, c === 0 ? '#0F3B3A' : c === 1 ? '#1A6B6A' : '#3EA9B8', true);
        comps.push({ input: ml, left: x, top: yBase + 2 });
      }
    }
    const name = cat + '.png';
    await sharp({ create: { width: W, height: H, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite(comps).png().toFile(path.join(OUT, name));
    console.log('  wrote', name, W + 'x' + H);
  }
  console.log('[sheets] DONE');
})();
