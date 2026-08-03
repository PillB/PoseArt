// audit_harness/pose-forensic-vlm.js
// Run VLM forensic analysis on each sampled pose (avatar mode, which shows the
// full silhouette). Output: per-pose issue report in JSON.
// Uses z-ai vision CLI with structured prompts.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = path.resolve(__dirname, '..');
const RAW = path.join(REPO, 'audit', 'pose-forensic', 'raw');
const REPORTS = path.join(REPO, 'audit', 'pose-forensic', 'reports');
fs.mkdirSync(REPORTS, { recursive: true });

const sample = JSON.parse(fs.readFileSync(path.join(REPO, 'audit', 'pose-forensic', 'sample.json'), 'utf8'));

const FORENSIC_PROMPT = `You are a figure-drawing expert and anatomy reviewer. This image shows a pose-reference figure (avatar = filled silhouette) rendered from a 3D rig. The pose is described in the pose name.

Analyze the figure for ANATOMICAL and VISUAL issues. For each category, state OK or describe the issue precisely:

1. HEAD/NECK: Is the head positioned correctly for the pose? Neck too long/short? Head tilted wrong direction?
2. SHOULDERS: Are shoulders at the right height/angle for the pose? One too high/low? Arms raised when they shouldn't be?
3. ARMS/ELBOWS: Are arms in the right position? Elbows bent correctly? Arms should be raised/lowered/crossed?
4. WRISTS/HANDS: Do hands reach their intended target (face, hip, knee, floor, prop)? Hands floating?
5. TORSO/SPINE: Is the torso lean correct? Too upright/slouched? Twisted wrong?
6. HIPS/PELVIS: Is the hip tilt correct? One hip too high/low?
7. LEGS/KNEES: Are legs in the right position? Knees bent correctly? Legs should be crossed/wide/together?
8. ANKLES/FEET: Do feet reach the floor/prop? Feet floating? Pointed/flexed correctly?
9. BALANCE/WEIGHT: Does the figure look balanced? Weight distribution correct?
10. PROPS: If the pose involves a chair/wall/floor/table, does the figure make contact with it?

Format your response as JSON:
{"issues": ["issue1", "issue2", ...], "severity": "none|minor|moderate|major", "summary": "one sentence"}

Be specific. 'left arm should be higher' not 'arm position wrong'. If the pose looks correct, return empty issues with severity 'none'.`;

// Load pose names + descriptions for context
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const vm = require('vm');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;

const allResults = {};
let processed = 0;

for (const cat of Object.keys(sample)) {
  allResults[cat] = [];
  for (const poseId of sample[cat]) {
    const pose = lib[poseId];
    const imgFile = path.join(RAW, poseId + '__avatar.png');
    if (!fs.existsSync(imgFile)) { console.log('  [skip] no image', poseId); continue; }

    const outFile = path.join(REPORTS, poseId + '-forensic.json');
    if (fs.existsSync(outFile)) {
      // reuse existing
      try {
        const r = JSON.parse(fs.readFileSync(outFile, 'utf8'));
        const content = r.choices[0].message.content;
        allResults[cat].push({ poseId, name: pose.name, desc: (pose.instructions||'').slice(0,120), vlm: content });
        processed++;
        continue;
      } catch(e) {}
    }

    // Build prompt with pose context
    const contextPrompt = `Pose: "${pose.name}" (category: ${pose.category})
Description: ${pose.instructions || 'N/A'}
Tip: ${pose.tip || 'N/A'}

${FORENSIC_PROMPT}`;

    try {
      const absImg = path.resolve(imgFile);
      const absOut = path.resolve(outFile);
      const shortPrompt = `Pose "${pose.name}" (${pose.category}): ${(pose.instructions||'').slice(0,150)}. Analyze this figure for anatomical issues. Check: head/neck, shoulders, arms/elbows, wrists/hands (do they reach target?), torso/spine, hips, legs/knees, ankles/feet, balance, props contact. List specific issues or say OK.`;
      const { execFileSync } = require('child_process');
      execFileSync('z-ai', ['vision', '-p', shortPrompt, '-i', absImg, '-o', absOut], { timeout: 90000, stdio: 'pipe' });
      const r = JSON.parse(fs.readFileSync(outFile, 'utf8'));
      const content = r.choices[0].message.content;
      allResults[cat].push({ poseId, name: pose.name, desc: (pose.instructions||'').slice(0,120), vlm: content });
      processed++;
      console.log('  [ok] ' + poseId + ' (' + processed + ')');
    } catch(e) {
      const stderr = e.stderr ? e.stderr.toString().slice(0,80) : '';
      console.log('  [FAIL] ' + poseId + ': ' + stderr);
      allResults[cat].push({ poseId, name: pose.name, error: stderr || String(e.message||e).slice(0,100) });
    }
  }
}

// Summary: count issues per category
const summary = {};
for (const cat of Object.keys(allResults)) {
  const results = allResults[cat];
  const withIssues = results.filter(r => r.vlm && !r.vlm.includes('"severity": "none"') && !r.vlm.includes('"severity":"none"'));
  const errorRate = results.length ? withIssues.length / results.length : 0;
  summary[cat] = { sampled: results.length, withIssues: withIssues.length, errorRate: Math.round(errorRate*100)+'%' };
}

fs.writeFileSync(path.join(REPORTS, 'forensic-summary.json'), JSON.stringify({ summary, allResults }, null, 2));
console.log('\n=== FORENSIC SUMMARY ===');
for (const cat of Object.keys(summary)) {
  console.log(cat + ': ' + summary[cat].withIssues + '/' + summary[cat].sampled + ' with issues (' + summary[cat].errorRate + ')');
}
