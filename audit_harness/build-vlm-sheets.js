// audit_harness/build-vlm-sheets.js — compose contact sheets for VLM review.
// Groups: 3 modes (avatar/skeleton/ghost) per pose, 6 poses per sheet.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const RAW = path.resolve(__dirname, '..', 'audit', 'avatar-ghost', 'vlm-validation', 'raw');
const OUT = path.resolve(__dirname, '..', 'audit', 'avatar-ghost', 'vlm-validation', 'sheets');
fs.mkdirSync(OUT, { recursive: true });

const POSES = [
  'power-stance','scurve-stand','crossed-arms-stand',
  'soft-sit','window-seat','forearms-crossed-table',
  'wall-lean','doorframe-lean','table-elbow-single',
  'both-knees','knights-kneel','starfish',
  'lounger-recline','side-recline','leap-forward',
  'crouching-prowl','face-touch','cross-body-arm',
  'hair-flip','couple-embrace','waltz-hold',
  'wheelchair-arms','seated-power','boudoir-s-curve-stand',
  'boudoir-elegant-recline','editorial-sharp-angles-stand','editorial-extreme-forward-lean',
  'fineart-contrapposto-classic','fineart-odalisque-recline','fashion-power-stance-classic',
  'fashion-runway-stomp-stride','lowhigh-deep-crouch-start','highlow-floor-landing-final'
];
const MODES = ['avatar','skeleton','ghost'];
const TILE = 200, PAD = 10, COLS = 3, PER_SHEET = 6; // 6 poses × 3 modes = 18 tiles per sheet

async function labelSvg(w, text, size, fill, bold) {
  const svg = '<svg width="' + w + '" height="20"><text x="3" y="14" font-family="monospace" font-size="' + size + '" ' + (bold ? 'font-weight="bold" ' : '') + 'fill="' + fill + '">' + text + '</text></svg>';
  return sharp({ create: { width: w, height: 20, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toBuffer();
}

(async () => {
  const sheets = [];
  for (let s = 0; s < Math.ceil(POSES.length / PER_SHEET); s++) {
    const sheetPoses = POSES.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
    const rows = sheetPoses.length;
    const W = COLS * TILE + PAD * (COLS + 1) + 90; // 90px label column
    const H = rows * (TILE + 24) + PAD * (rows + 1) + 30;
    const comps = [];
    // header
    const hdr = await labelSvg(W, 'Sheet ' + (s+1) + ' — poses ' + (s*PER_SHEET+1) + '-' + (s*PER_SHEET+sheetPoses.length) + ' (cols: avatar | skeleton | ghost)', 11, '#0F3B3A', true);
    comps.push({ input: hdr, left: PAD, top: 4 });
    for (let r = 0; r < rows; r++) {
      const poseId = sheetPoses[r];
      const yBase = PAD + 30 + r * (TILE + 24 + PAD);
      // pose label
      const rl = await labelSvg(85, poseId.slice(0, 16), 9, '#0F3B3A', false);
      comps.push({ input: rl, left: 0, top: yBase + 10 });
      for (let c = 0; c < COLS; c++) {
        const mode = MODES[c];
        const f = path.join(RAW, poseId + '__' + mode + '.png');
        if (!fs.existsSync(f)) continue;
        const buf = await sharp(f).resize(TILE, TILE, { fit: 'contain', background: { r: 244, g: 241, b: 232, alpha: 1 } }).toBuffer();
        const x = 90 + PAD + c * (TILE + PAD);
        comps.push({ input: buf, left: x, top: yBase + 24 });
        const ml = await labelSvg(TILE, mode, 9, c === 0 ? '#0F3B3A' : c === 1 ? '#1A6B6A' : '#3EA9B8', true);
        comps.push({ input: ml, left: x, top: yBase + 4 });
      }
    }
    const name = 'sheet-' + String(s+1).padStart(2,'0') + '.png';
    await sharp({ create: { width: W, height: H, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite(comps).png().toFile(path.join(OUT, name));
    sheets.push(name);
    console.log('  wrote', name, W + 'x' + H);
  }
  console.log('[sheets] DONE: ' + sheets.length + ' sheets');
})();
