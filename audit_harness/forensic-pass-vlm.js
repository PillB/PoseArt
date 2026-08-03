// audit_harness/forensic-pass-vlm.js
// Run a single forensic pass via VLM on a pose's avatar image.
// Uses execFileSync with proper error handling and rate-limit delays.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..');
const DOSSIERS = path.join(REPO, 'audit', 'pose-repair', 'dossiers');
const REPORTS = path.join(REPO, 'audit', 'pose-repair', 'reports');
fs.mkdirSync(REPORTS, { recursive: true });

// Load pose metadata for context
const vm = require('vm');
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;

function vlmAnalyze(poseId, passNum, passName, prompt) {
  const pose = lib[poseId];
  if (!pose) return { error: 'unknown pose' };
  const imgFile = path.join(DOSSIERS, poseId, 'baseline', 'avatar__front.png');
  if (!fs.existsSync(imgFile)) return { error: 'no baseline image' };
  const outFile = path.join(REPORTS, `${poseId}-pass${passNum}-${passName}.json`);

  const context = `Pose: "${pose.name}" (category: ${pose.category}, difficulty: ${pose.difficulty})
Description: ${pose.instructions || 'N/A'}
Tip: ${pose.tip || 'N/A'}

${prompt}`;

  try {
    execFileSync('z-ai', ['vision', '-p', context, '-i', path.resolve(imgFile), '-o', path.resolve(outFile)], { timeout: 60000, stdio: 'pipe' });
    const r = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    return { ok: true, content: r.choices[0].message.content };
  } catch (e) {
    return { error: e.stderr ? e.stderr.toString().slice(0, 100) : String(e.message).slice(0, 100) };
  }
}

// CLI: node forensic-pass-vlm.js <poseId> <passNum> <passName> <prompt>
const args = process.argv.slice(2);
if (args.length >= 4) {
  const [poseId, passNum, passName, ...promptParts] = args;
  const prompt = promptParts.join(' ');
  const result = vlmAnalyze(poseId, passNum, passName, prompt);
  console.log(JSON.stringify(result));
} else {
  // Default: run pass 1 (record identity) on all displaced poses
  const DISPLACED = [
    'scurve-stand', 'boudoir-reclined-back-support', 'boudoir-standing-profile-curve',
    'fineart-standing-back-bend-soft', 'fineart-standing-still-life-drape',
    'fineart-standing-cambre-side', 'fashion-catalog-three-quarter',
    'lowhigh-standing-tall-arms-out', 'highlow-standing-hip-drop-begin',
    'highlow-standing-bow-forward-begin', 'p09-unconv-s6-shoulder-stand-fold'
  ];
  const PASS1_PROMPT = `Pass 1 — Record Identity: Does the pose NAME match the DESCRIPTION? Does the CATEGORY match the described posture? Is the figure type consistent? Are there any semantic mismatches between name, description, and what the figure shows? List specific mismatches or say OK.`;

  let ok = 0, fail = 0;
  for (const poseId of DISPLACED) {
    const result = vlmAnalyze(poseId, 1, 'identity', PASS1_PROMPT);
    if (result.ok) { ok++; console.log('  [ok] ' + poseId); }
    else { fail++; console.log('  [FAIL] ' + poseId + ': ' + result.error); }
    // Rate limit delay
    const start = Date.now(); while (Date.now() - start < 3000);
  }
  console.log(`\nPass 1 complete: ${ok} ok, ${fail} failed`);
}
