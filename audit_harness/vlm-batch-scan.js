// audit_harness/vlm-batch-scan.js
// Run VLM forensic scan on batches of poses. Uses contact sheets (6 poses per sheet)
// for efficient triage, then individual VLM on flagged poses.
// Outputs per-pose findings to audit/pose-repair/census/vlm-findings.jsonl
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const REPO = path.resolve(__dirname, '..');
const RAW = path.join(REPO, 'audit', 'pose-repair', 'census', 'raw');
const SHEETS = path.join(REPO, 'audit', 'pose-repair', 'census', 'sheets');
const REPORTS = path.join(REPO, 'audit', 'pose-repair', 'census', 'reports');
fs.mkdirSync(SHEETS, { recursive: true });
fs.mkdirSync(REPORTS, { recursive: true });

// Load pose metadata
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
  // header
  const hdrSvg = '<svg width="' + W + '" height="22"><text x="5" y="16" font-family="monospace" font-size="11" font-weight="bold" fill="#0F3B3A">Sheet ' + sheetNum + ': ' + poseIds.join(' | ').slice(0,100) + '</text></svg>';
  const hdr = await sharp({ create: { width: W, height: 22, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite([{ input: Buffer.from(hdrSvg), top: 0, left: 0 }]).png().toBuffer();
  comps.push({ input: hdr, left: 0, top: 0 });
  for (let i = 0; i < poseIds.length; i++) {
    const poseId = poseIds[i];
    const r = Math.floor(i / cols), c = i % cols;
    const f = path.join(RAW, poseId + '.png');
    if (!fs.existsSync(f)) continue;
    const buf = await sharp(f).resize(TILE, TILE, { fit: 'contain', background: { r: 244, g: 241, b: 232, alpha: 1 } }).toBuffer();
    const x = 5 + c * (TILE + 5), y = 25 + r * (TILE + 20);
    comps.push({ input: buf, left: x, top: y });
    const lblSvg = '<svg width="' + TILE + '" height="16"><text x="3" y="12" font-family="monospace" font-size="8" fill="#0F3B3A">' + poseId.slice(0,22) + '</text></svg>';
    const lbl = await sharp({ create: { width: TILE, height: 16, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite([{ input: Buffer.from(lblSvg), top: 0, left: 0 }]).png().toBuffer();
    comps.push({ input: lbl, left: x, top: y + TILE + 2 });
  }
  const sheetFile = path.join(SHEETS, 'sheet-' + String(sheetNum).padStart(3, '0') + '.png');
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite(comps).png().toFile(sheetFile);
  return sheetFile;
}

function vlmScan(sheetFile, sheetNum, poseIds) {
  const outFile = path.join(REPORTS, 'sheet-' + String(sheetNum).padStart(3, '0') + '.json');
  if (fs.existsSync(outFile)) return JSON.parse(fs.readFileSync(outFile, 'utf8'));
  const prompt = 'Contact sheet with 6 figure poses (labeled). For EACH pose, answer in one line: "POSE_ID: OK" or "POSE_ID: ISSUE - brief description". Check: limbs position, balance, feet on ground, hands reaching targets, spine direction. Be terse.';
  try {
    execFileSync('z-ai', ['vision', '-p', prompt, '-i', path.resolve(sheetFile), '-o', path.resolve(outFile)], { timeout: 60000, stdio: 'pipe' });
    return JSON.parse(fs.readFileSync(outFile, 'utf8'));
  } catch (e) {
    return { error: e.stderr ? e.stderr.toString().slice(0, 80) : String(e.message).slice(0, 80) };
  }
}

(async () => {
  const totalSheets = Math.ceil(allIds.length / PER_SHEET);
  console.log('[vlm-scan] ' + allIds.length + ' poses, ' + totalSheets + ' sheets');
  const findings = [];
  let processed = 0, ok = 0, issues = 0, fails = 0;

  for (let s = 0; s < totalSheets; s++) {
    const poseIds = allIds.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
    const sheetFile = await buildSheet(s + 1, poseIds);
    const result = vlmScan(sheetFile, s + 1, poseIds);
    if (result.error) { fails++; console.log('  [FAIL] sheet ' + (s+1) + ': ' + result.error); continue; }
    const content = result.choices[0].message.content;
    // Parse per-pose findings
    for (const poseId of poseIds) {
      const line = content.split('\n').find(l => l.includes(poseId) || l.includes(poseId.slice(0,15)));
      if (line) {
        const isOk = /:\s*OK/i.test(line) || /:\s*\*\*OK/i.test(line);
        if (isOk) { ok++; findings.push({ poseId, status: 'OK' }); }
        else { issues++; findings.push({ poseId, status: 'ISSUE', detail: line.slice(0, 200) }); }
      } else {
        findings.push({ poseId, status: 'UNKNOWN' });
      }
    }
    processed++;
    if (processed % 10 === 0) console.log('  [progress] ' + processed + '/' + totalSheets + ' sheets, ' + ok + ' OK, ' + issues + ' issues');
    // Rate limit delay
    const start = Date.now(); while (Date.now() - start < 1500);
  }

  fs.writeFileSync(path.join(REPO, 'audit', 'pose-repair', 'census', 'vlm-findings.json'), JSON.stringify({ total: allIds.length, ok, issues, fails, findings }, null, 2));
  console.log('\n[vlm-scan] DONE: ' + ok + ' OK, ' + issues + ' issues, ' + fails + ' failed sheets');
  console.log('Written: audit/pose-repair/census/vlm-findings.json');
})();
