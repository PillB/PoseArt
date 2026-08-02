// audit_harness/build-contact-sheets.js — compose contact sheets from baseline PNGs.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BASE = path.resolve(__dirname, '..', 'audit', 'avatar-ghost', 'baseline');
const OUT = path.resolve(__dirname, '..', 'audit', 'avatar-ghost', 'baseline', 'contact-sheets');
fs.mkdirSync(OUT, { recursive: true });

const TILE = 170; // tile size (160 + padding)
const PAD = 10;

async function sheet(name, files, cols, labels) {
  const rows = Math.ceil(files.length / cols);
  const W = cols * TILE + PAD * (cols + 1);
  const H = rows * TILE + PAD * (rows + 1) + 18 * rows; // label strip
  const comps = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (!fs.existsSync(f)) { console.log('  missing', f); continue; }
    const buf = await sharp(f).resize(TILE, TILE, { fit: 'contain', background: { r: 244, g: 241, b: 232, alpha: 1 } }).toBuffer();
    const col = i % cols, row = Math.floor(i / cols);
    const x = PAD + col * (TILE + PAD);
    const y = PAD + row * (TILE + PAD) + 18;
    comps.push({ input: buf, left: x, top: y });
    // label
    const lbl = sharp({ create: { width: TILE, height: 18, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite([{ input: Buffer.from(`<svg width="${TILE}" height="18"><text x="4" y="13" font-family="monospace" font-size="10" fill="#0F3B3A">${(labels ? labels[i] : path.basename(f).replace('.png', ''))}</text></svg>`), top: 0, left: 0 }]).png().toBuffer();
    comps.push({ input: await lbl, left: x, top: PAD + row * (TILE + PAD) });
  }
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite(comps).png().toFile(path.join(OUT, name));
  console.log('  wrote', name, W + 'x' + H);
}

(async () => {
  // Sheet 1: mode comparison — 6 overlay poses × 3 modes (front, raw)
  const overlayPoses = ['power-stance', 'soft-sit', 'both-knees', 'starfish', 'leap-forward', 'face-touch'];
  const files1 = [], labels1 = [];
  for (const p of overlayPoses) for (const mode of ['avatar', 'skeleton', 'ghost']) {
    files1.push(path.join(BASE, 'raw', `${p}__${mode}__front__160x180.png`));
    labels1.push(`${p} / ${mode}`);
  }
  await sheet('01-mode-comparison-front.png', files1, 3, labels1);

  // Sheet 2: avatar joint-inflation close look (overlay poses, avatar front, with joints overlay)
  const files2 = [], labels2 = [];
  for (const p of overlayPoses) {
    files2.push(path.join(BASE, 'raw', `${p}__avatar__front__160x180.png`)); labels2.push(`${p} raw`);
    files2.push(path.join(BASE, 'overlays', `${p}__avatar__front__160x180_joints.png`)); labels2.push(`${p} +joints`);
    files2.push(path.join(BASE, 'overlays', `${p}__avatar__front__160x180_bbox.png`)); labels2.push(`${p} +bbox`);
  }
  await sheet('02-avatar-forensic-overlays.png', files2, 3, labels2);

  // Sheet 3: framing defects — clipping (arms-overhead) + floating seated poses
  const files3 = [], labels3 = [];
  for (const v of ['front', 'side', 'quarter']) {
    files3.push(path.join(BASE, 'overlays', `arms-overhead__avatar__${v}__160x180_bbox.png`)); labels3.push(`arms-overhead ${v} (CLIPPED top)`);
  }
  for (const p of ['soft-sit', 'window-seat', 'forearms-crossed-table']) {
    files3.push(path.join(BASE, 'overlays', `${p}__avatar__front__160x180_bbox.png`)); labels3.push(`${p} (floats high)`);
  }
  await sheet('03-framing-defects.png', files3, 3, labels3);

  // Sheet 4: ghost vs avatar distinctiveness (silhouette masks)
  const files4 = [], labels4 = [];
  for (const p of ['power-stance', 'scurve-stand', 'hip-shift', 'arms-overhead', 'face-touch', 'couple-embrace']) {
    files4.push(path.join(BASE, 'overlays', `${p}__avatar__front__160x180_silhouette.png`)); labels4.push(`${p} AVATAR`);
    files4.push(path.join(BASE, 'overlays', `${p}__ghost__front__160x180_silhouette.png`)); labels4.push(`${p} GHOST`);
  }
  await sheet('04-ghost-vs-avatar-silhouette.png', files4, 2, labels4);

  // Sheet 5: canvas-size matrix (avatar, power-stance + soft-sit across sizes)
  const files5 = [], labels5 = [];
  for (const p of ['power-stance', 'soft-sit', 'both-knees', 'starfish']) {
    for (const sz of ['70x70', '92x80', '110x150', '140x180', '160x180', '200x280', '430x932-camera']) {
      files5.push(path.join(BASE, 'raw', `${p}__avatar__front__${sz}.png`)); labels5.push(`${p} ${sz}`);
    }
  }
  await sheet('05-canvas-size-matrix.png', files5, 7, labels5);
  console.log('DONE');
})();
