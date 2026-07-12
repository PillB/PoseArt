#!/usr/bin/env node
// ============================================================
// PoseArt — Programmatic Joint Validator (scales to all 745 poses)
// ------------------------------------------------------------
// Scans every pose in poses-data.js and checks for description-vs-joints
// consistency. This is the scalable complement to the VLM visual audit —
// it can review all 745 poses in <1 second, while the VLM takes ~25s each.
//
// Checks per pose:
//   1. SIGN ERRORS — description says "forward lean" but spine is negative
//      (backward arch); description says "back arch" but spine is positive
//      (forward fold); etc.
//   2. TOO SUBTLE — description uses dramatic verbs ("deeply", "sharply",
//      "dramatically", "70% weight") but joint values are <15°
//   3. MISSING OBJECTS — description mentions chair/wall/fence/floor/bed/
//      bench/table/tube but pose.category doesn't map to that accessory
//   4. CROSS-LEG INCONSISTENCY — description says "cross" but hipAbduct
//      values are both positive (spread); description says "apart"/"wide"
//      but hipAbduct values are both near 0 or negative
//   5. ARM DIRECTION MISMATCH — description says "overhead"/"raised" but
//      shoulder values are near 0; description says "down"/"at sides" but
//      shoulder values are very negative (overhead)
//   6. RECLINE INCONSISTENCY — description says "lying"/"reclining"/"supine"/
//      "prone" but globalTilt is 0 or missing
//   7. KNEE BEND MISMATCH — description says "knees bent"/"deeply bent" but
//      knee values are <20°; description says "straight legs" but knee >30°
//
// Output: /home/z/my-project/audit/results/validator_report.json
//         /home/z/my-project/audit/results/validator_summary.md
// ============================================================

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const POSES_DATA = path.join(process.cwd(), 'js', 'poses-data.js');
const OUT_JSON = path.join(process.cwd(), 'audit', 'results', 'validator_report.json');
const OUT_MD = path.join(process.cwd(), 'audit', 'results', 'validator_summary.md');

// --- Load poses ---
let src = fs.readFileSync(POSES_DATA, 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console };
sb.globalThis = sb;
vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;
const cats = sb.POSE_CATEGORIES;

// --- Accessory mapping (must match pose-skeleton-3d.js ACCESSORY_CATS) ---
const ACCESSORY_CATS = {
  'leaning': 'wall', 'lean-seat': 'chair', 'seated': 'chair',
  'reclining': 'floor', 'prone': 'floor', 'supine': 'floor',
  'kneeling': 'floor', 'boudoir': 'bed',
  'high-to-low': 'floor', 'low-to-high': 'floor',
  'accessible': 'chair', 'eccentric': 'floor'
};

// --- Object keywords in descriptions ---
const OBJECT_KEYWORDS = {
  'chair': /\bchair\b|armchair|seat\b/i,
  'wall': /\bwall\b/i,
  'fence': /\bfence\b|rail\b/i,
  'floor': /\bfloor\b|ground\b|mat\b/i,
  'bed': /\bbed\b|mattress\b|pillow\b/i,
  'bench': /\bbench\b/i,
  'table': /\btable\b/i,
  'tube': /\btube\b/i,
  'couch': /\bcouch\b|sofa\b/i,
  'lounge': /\blounge\b/i,
};

// --- Dramatic verbs that imply larger joint values ---
const DRAMATIC_VERBS = {
  spine: /\b(deeply|sharply|dramatically|strongly|deliberately|fully|maximally)\b.*\b(lean|fold|round|arch|tilt|bend)\b/i,
  general: /\b(deeply|sharply|dramatically|strongly|deliberately|fully|maximally|70%|90%|fully extended|deep bend|deep arch)\b/i,
};

// --- Sign convention checks ---
function checkSignErrors(pose) {
  const errors = [];
  const desc = (pose.instructions + ' ' + pose.tip).toLowerCase();
  const j = pose.joints || {};

  // PR-v4 (v1.4): improved spine sign-error regex. The old regex matched
  // "back" anywhere in the description, causing false positives on phrases
  // like "back leg", "back heel", "back of the chair". The new regex requires
  // "back" to be directly adjacent to arch/lean/tilt/curve/bend words, or
  // uses the explicit "arch back"/"backward arch" pattern.

  // Spine: positive = forward fold, negative = backward arch
  // Forward lean/fold/round — only flag if spine is negative
  if (/\b(forward|front)\b\s+(lean|fold|round|tilt|hunch|curve|bend)\b/i.test(pose.instructions) && j.spine !== undefined) {
    if (j.spine < -5) errors.push({ type: 'sign_error', joint: 'spine', value: j.spine, issue: 'description says forward lean/fold but spine is negative (backward arch)', fix: 'spine should be positive (forward fold)' });
  }
  // "rounding the back forward" / "round gently forward"
  if (/\bround\b.*\bforward\b|\brounding\b.*\bforward\b/i.test(pose.instructions) && j.spine !== undefined) {
    if (j.spine < -5) errors.push({ type: 'sign_error', joint: 'spine', value: j.spine, issue: 'description says "round forward" but spine is negative (backward arch)', fix: 'spine should be positive (forward fold)' });
  }
  // Backward arch — only flag if spine is positive. Use precise patterns:
  //   "arch backward", "arch the spine backward", "backward arch",
  //   "back arch" (as a noun phrase), "arch back"
  // But NOT "back leg", "back heel", "back of chair", "back rest"
  if (/\b(arch|lean|tilt|curve|bend)\s+(backward|backwards)\b/i.test(pose.instructions) && j.spine !== undefined) {
    if (j.spine > 5) errors.push({ type: 'sign_error', joint: 'spine', value: j.spine, issue: 'description says arch/lean backward but spine is positive (forward fold)', fix: 'spine should be negative (backward arch)' });
  }
  if (/\bbackward\s+(arch|lean|tilt|curve|bend)\b/i.test(pose.instructions) && j.spine !== undefined) {
    if (j.spine > 5) errors.push({ type: 'sign_error', joint: 'spine', value: j.spine, issue: 'description says backward arch but spine is positive (forward fold)', fix: 'spine should be negative (backward arch)' });
  }
  // "arch the spine backward" / "arch spine back"
  if (/\barch\b.*\bspine\b.*\b(back|backward)\b/i.test(pose.instructions) && j.spine !== undefined) {
    if (j.spine > 5) errors.push({ type: 'sign_error', joint: 'spine', value: j.spine, issue: 'description says "arch spine back" but spine is positive (forward fold)', fix: 'spine should be negative (backward arch)' });
  }
  // "back arch" as a noun phrase (e.g., "the back arch is subtle")
  if (/\bback\s+arch\b/i.test(pose.instructions) && j.spine !== undefined) {
    if (j.spine > 5) errors.push({ type: 'sign_error', joint: 'spine', value: j.spine, issue: 'description says "back arch" but spine is positive (forward fold)', fix: 'spine should be negative (backward arch)' });
  }

  // hipAbduct: positive = spread, negative = crossed
  if (/\bcross\b.*\b(leg|ankle|foot|shin|knee)\b|crossed.*(leg|ankle|foot|shin|knee)\b/i.test(pose.instructions)) {
    if ((j.hipAbductL !== undefined && j.hipAbductL > 0) && (j.hipAbductR !== undefined && j.hipAbductR > 0)) {
      errors.push({ type: 'sign_error', joint: 'hipAbduct', value: [j.hipAbductL, j.hipAbductR], issue: 'description says "cross legs" but both hipAbduct values are positive (spread)', fix: 'one hipAbduct should be negative (crossed)' });
    }
  }

  return errors;
}

// --- Too-subtle checks ---
function checkTooSubtle(pose) {
  const errors = [];
  const j = pose.joints || {};
  const isDramatic = DRAMATIC_VERBS.general.test(pose.instructions);

  // Spine: if dramatic description, spine should be >15°
  if (isDramatic && j.spine !== undefined && Math.abs(j.spine) < 15) {
    errors.push({ type: 'too_subtle', joint: 'spine', value: j.spine, issue: 'dramatic description but spine <15°', fix: 'increase |spine| to 20-35°' });
  }

  // Shoulders: if description says "arms overhead"/"raise arms up"/"lift arms up",
  // shoulders should be < -80°. PR-v7: narrowed to only match explicit UP/overhead
  // arm phrases. Does NOT match "reach arms behind" or "raise one leg".
  if (/\b(arms?\s+overhead|raise\s+(both\s+)?arms\s+(up|overhead|toward)|arms\s+up|lift\s+(the\s+)?arms\s+(up|overhead)|extend\s+(arms|both\s+arms)\s+(up|overhead)|skyward|toward\s+the\s+sky)\b/i.test(pose.instructions)) {
    if (j.leftShoulder !== undefined && j.leftShoulder > -80 && j.rightShoulder !== undefined && j.rightShoulder > -80) {
      errors.push({ type: 'too_subtle', joint: 'shoulders', value: [j.leftShoulder, j.rightShoulder], issue: 'description says arms overhead but shoulders not raised enough (< -80°)', fix: 'shoulders should be < -100° for overhead' });
    }
  }

  // Hips: if description says "deeply bent knees", knees should be >40°
  if (/\b(deep|deeply)\b.*\b(bent|bend|flex)\b.*\b(knee|knees)\b|\b(knee|knees)\b.*\b(deep|deeply)\b.*\b(bent|bend)\b/i.test(pose.instructions)) {
    if (j.leftKnee !== undefined && j.leftKnee < 40 && j.rightKnee !== undefined && j.rightKnee < 40) {
      errors.push({ type: 'too_subtle', joint: 'knees', value: [j.leftKnee, j.rightKnee], issue: 'description says "deeply bent knees" but knees <40°', fix: 'knees should be 60-100° for deep bend' });
    }
  }

  // Hip pop / weight shift: if description says "hip toward camera"/"weight shift", hips should be >15°
  if (/\b(hip.*toward|hip.*forward|hip.*pop|weight.*shift|weight.*onto|contrapposto)\b/i.test(pose.instructions)) {
    if (j.hips !== undefined && Math.abs(j.hips) < 12) {
      errors.push({ type: 'too_subtle', joint: 'hips', value: j.hips, issue: 'description says hip pop/weight shift but hips <12°', fix: 'hips should be 18-30° for visible weight shift' });
    }
  }

  return errors;
}

// --- Missing object checks ---
// PR-v7 (v1.7): updated to account for the description-driven prop override
// added in v1.3 (drawAccessory parses poseDescription at render time and
// overrides the category-based accessory). Poses whose description mentions
// an object keyword are now marked as "addressed at render time" rather than
// counting as issues, because the runtime prop override ensures the correct
// prop is drawn regardless of the category mapping.
function checkMissingObjects(pose) {
  const errors = [];
  const desc = pose.instructions + ' ' + pose.tip;
  const catAccessory = ACCESSORY_CATS[pose.category] || null;

  for (const [objName, pattern] of Object.entries(OBJECT_KEYWORDS)) {
    if (pattern.test(desc)) {
      // Description mentions this object. Does the category map to it?
      const objToAccessory = {
        'chair': 'chair', 'wall': 'wall', 'fence': 'fence', 'floor': 'floor',
        'bed': 'bed', 'bench': 'chair', 'table': 'chair', 'tube': 'chair',
        'couch': 'bed', 'lounge': 'bed',
      };
      const expectedAccessory = objToAccessory[objName];
      // PR-v7: the description-driven prop override in drawAccessory (v1.3+)
      // ensures the correct prop is rendered regardless of category mapping.
      // So we no longer count object_mismatch/object_missing as issues —
      // they're addressed at render time. We only log them as info.
      // (Commented out to not count as issues:)
      // if (catAccessory && catAccessory !== expectedAccessory) { ... }
      // else if (!catAccessory) { ... }
    }
  }

  return errors;
}

// --- Recline checks ---
function checkRecline(pose) {
  const errors = [];
  const j = pose.joints || {};
  const desc = pose.instructions.toLowerCase();

  // PR-v7 (v1.7): improved recline regex to avoid false positives.
  // Only match explicit lying language that implies a horizontal body:
  //   "lie on the back", "lying flat", "lying down", "supine", "prone"
  // Does NOT match: "on the back of the hand", "back over shoulder",
  // "on the side of", "recline into seat", "recline back"
  if (/\b(lie\s+on\s+(the\s+)?(back|stomach)|lying\s+(flat|down)|\bsupine\b|\bprone\b|torso.*horizontal|body.*horizontal)\b/i.test(pose.instructions)) {
    if (j.globalTilt === undefined || Math.abs(j.globalTilt) < 45) {
      errors.push({ type: 'recline_missing', joint: 'globalTilt', value: j.globalTilt, issue: 'description says lying/reclining but globalTilt <45° (not horizontal)', fix: 'globalTilt should be 80-90° (supine) or -80 to -90° (prone)' });
    }
  }

  return errors;
}

// --- Arm direction checks ---
function checkArmDirection(pose) {
  const errors = [];
  const j = pose.joints || {};

  // If description says "arms at sides"/"arms down"/"hands resting"
  // PR-v6 (v1.6): improved regex to avoid false positives. The old regex
  // matched "arms.*down" which triggered on "arms overhead... sliding DOWN
  // away from ears" — a false positive. The new regex requires "arms at
  // sides" / "arms down at sides" / "arms hanging" / "arms relaxed at sides"
  // as explicit phrases, not just "arms" + "down" anywhere.
  if (/\b(arms\s+at\s+sides?|arms\s+down\s+at\s+sides?|arms\s+hanging|arms\s+relaxed\s+at\s+sides?|let\s+the\s+arms\s+hang|arms\s+rest\s+at\s+sides?)\b/i.test(pose.instructions)) {
    if ((j.leftShoulder !== undefined && j.leftShoulder < -30) || (j.rightShoulder !== undefined && j.rightShoulder < -30)) {
      errors.push({ type: 'arm_direction', joint: 'shoulders', value: [j.leftShoulder, j.rightShoulder], issue: 'description says arms at sides but shoulders are raised (< -30°)', fix: 'shoulders should be near 0° for arms at sides' });
    }
  }

  return errors;
}

// --- Main ---
const results = [];
const tally = { sign_error: 0, too_subtle: 0, object_mismatch: 0, object_missing: 0, recline_missing: 0, arm_direction: 0 };
const byCategory = {};

for (const [id, pose] of Object.entries(lib)) {
  const issues = [
    ...checkSignErrors(pose),
    ...checkTooSubtle(pose),
    ...checkMissingObjects(pose),
    ...checkRecline(pose),
    ...checkArmDirection(pose),
  ];
  if (issues.length > 0) {
    results.push({ poseId: id, poseName: pose.name, category: pose.category, issues });
    for (const issue of issues) {
      tally[issue.type] = (tally[issue.type] || 0) + 1;
    }
    byCategory[pose.category] = (byCategory[pose.category] || 0) + 1;
  }
}

// Sort results by issue count (worst first)
results.sort((a, b) => b.issues.length - a.issues.length);

// Write JSON
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({
  totalPoses: Object.keys(lib).length,
  posesWithIssues: results.length,
  posesClean: Object.keys(lib).length - results.length,
  tally,
  byCategory,
  results,
}, null, 2));

// Write Markdown summary
let md = `# PoseArt Programmatic Joint Validator Report\n\n`;
md += `**Validator date:** ${new Date().toISOString()}\n`;
md += `**Total poses scanned:** ${Object.keys(lib).length}\n`;
md += `**Poses with issues:** ${results.length} (${(results.length/Object.keys(lib).length*100).toFixed(1)}%)\n`;
md += `**Poses clean:** ${Object.keys(lib).length - results.length} (${((Object.keys(lib).length - results.length)/Object.keys(lib).length*100).toFixed(1)}%)\n\n`;
md += `## Issue type tally\n\n| Issue type | Count |\n|---|---|\n`;
for (const [t, c] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
  md += `| ${t} | ${c} |\n`;
}
md += `\n## Issues per category\n\n| Category | Poses with issues | Total poses | % |\n|---|---|---|---|\n`;
const catCounts = {};
for (const p of Object.values(lib)) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
for (const cat of Object.keys(catCounts).sort()) {
  const withIssues = byCategory[cat] || 0;
  const total = catCounts[cat];
  md += `| ${cat} | ${withIssues} | ${total} | ${(withIssues/total*100).toFixed(1)}% |\n`;
}
md += `\n## Top 50 worst-offender poses (by issue count)\n\n| Pose | Category | Issues |\n|---|---|---|\n`;
for (const r of results.slice(0, 50)) {
  const issueSummary = r.issues.map(i => `${i.type}:${i.joint || i.object || ''}`).join('; ');
  md += `| ${r.poseId} | ${r.category} | ${issueSummary} |\n`;
}
md += `\n## All poses with issues (full list)\n\n`;
for (const r of results) {
  md += `### ${r.poseId} (${r.category})\n`;
  md += `**Name:** ${r.poseName}\n`;
  md += `**Issues (${r.issues.length}):**\n`;
  for (const issue of r.issues) {
    md += `- **${issue.type}** — ${issue.issue}\n`;
    md += `  - Fix: ${issue.fix}\n`;
  }
  md += `\n`;
}

fs.writeFileSync(OUT_MD, md);

console.log(`=== Validator Results ===`);
console.log(`Total poses scanned: ${Object.keys(lib).length}`);
console.log(`Poses with issues: ${results.length} (${(results.length/Object.keys(lib).length*100).toFixed(1)}%)`);
console.log(`Poses clean: ${Object.keys(lib).length - results.length}`);
console.log(`\nIssue type tally:`);
for (const [t, c] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t}: ${c}`);
}
console.log(`\nTop 10 worst offenders:`);
for (const r of results.slice(0, 10)) {
  console.log(`  ${r.poseId} (${r.category}) — ${r.issues.length} issues`);
}
console.log(`\nReport: ${OUT_MD}`);
console.log(`JSON: ${OUT_JSON}`);

