#!/usr/bin/env node
/**
 * v4 pose-level fixer — targets the 36 poses identified by the v3.1 audit.
 *
 * Rules addressed:
 *   R1 — asymmetric arm splay (one shoulder < -110 and the other > -35 or reverse).
 *        Fix: bring both shoulders into a natural hand-to-face / hand-to-hair envelope
 *             (working arm around -125..-140 with high elbow flex to bring hand to head;
 *              off arm around -50..-80). This preserves the intent (hand near head,
 *              stretched, etc.) while eliminating the T-pose splay.
 *   R5 — knee hyper-flex in seated (> 135). Fix: clamp to ≤ 130.
 *   R6 — seated but |globalTilt| > 50. Fix: clamp to ±45 so the pose reads seated.
 *   R7 — extreme twist |globalTwist| > 45 in seated/boudoir. Fix: clamp to ±40.
 *
 * Some poses have multiple rule hits; we combine fixes.
 * A backup is written to .backups/ before any modification.
 */

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const FILE = path.join(REPO, 'js', 'poses-data.js');

// ============================================================================
// Per-pose joint overrides. Only listed fields are overwritten; other joints
// are preserved. Values were derived from the current joint dump + intended
// silhouette (see docs/AGENT_STATE.md v3.1 audit).
// ============================================================================
const FIXES = {
  // ---- R1: asymmetric arm splay ------------------------------------------
  // Working arm goes up/to-head with high elbow flex; off arm hangs / lightly bent.

  'tiptoe-reach': {
    // Both arms up, reaching. Rebalance so it looks like a real overhead reach.
    leftShoulder: -140, rightShoulder: -125,
    leftElbow: 20, rightElbow: 25,
    shoulderFwdL: 5, shoulderFwdR: 5
  },
  'side-stretch': {
    // Classic side stretch: one arm overhead curving, other on hip / lower.
    leftShoulder: -135, rightShoulder: -55,
    leftElbow: 55, rightElbow: 45,
    shoulderFwdL: 5, shoulderFwdR: 10
  },
  'kneeling-side-stretch': {
    leftShoulder: -135, rightShoulder: -55,
    leftElbow: 55, rightElbow: 50,
    shoulderFwdL: 5, shoulderFwdR: 10
  },
  'kneeling-tuck-forward': {
    // Forward tuck: both arms wrap the knees. Bring the off arm down toward the leg.
    leftShoulder: -110, rightShoulder: -95,
    leftElbow: 90, rightElbow: 90,
    shoulderFwdL: 25, shoulderFwdR: 25
  },
  'lounger-back-arm-raised': {
    // One arm up behind head, other along body.
    leftShoulder: -130, rightShoulder: -60,
    leftElbow: 90, rightElbow: 55,
    shoulderFwdL: 5, shoulderFwdR: 10
  },
  'boudoir-barberini-faun': {
    // Reclining faun — one hand near head, other resting on hip.
    leftShoulder: -130, rightShoulder: -70,
    leftElbow: 90, rightElbow: 60,
    shoulderFwdL: 10, shoulderFwdR: 15
  },
  'boudoir-nymph-fontainebleau': {
    // Elongated recline — top arm above head, other draping across body.
    leftShoulder: -125, rightShoulder: -55,
    leftElbow: 70, rightElbow: 55,
    shoulderFwdL: 8, shoulderFwdR: 20
  },
  'boudoir-dying-slave': {
    // One arm overhead, other bent across chest.
    leftShoulder: -128, rightShoulder: -60,
    leftElbow: 95, rightElbow: 90,
    shoulderFwdL: 10, shoulderFwdR: 15
  },
  'boudoir-the-source': {
    // Amphora on shoulder — one hand up, one at hip.
    leftShoulder: -130, rightShoulder: -55,
    leftElbow: 70, rightElbow: 60,
    shoulderFwdL: 8, shoulderFwdR: 10
  },
  'p14-standing-s3-overhead-arms-stretch': {
    // Full overhead stretch — bring both arms up symmetrically.
    leftShoulder: -140, rightShoulder: -132,
    leftElbow: 25, rightElbow: 30,
    shoulderFwdL: 5, shoulderFwdR: 5
  },
  'p10-bench-s3-recline-arm-overhead': {
    // Also has R6 (globalTilt -85). Fix arm + soften tilt.
    leftShoulder: -135, rightShoulder: -70,
    leftElbow: 45, rightElbow: 55,
    shoulderFwdL: 5, shoulderFwdR: 10,
    globalTilt: -35
  },
  'p10-bench-s5-side-recline-arm-up': {
    // R1 + R6. Note rightShoulder was +60 (bad).
    leftShoulder: -128, rightShoulder: -55,
    leftElbow: 90, rightElbow: 70,
    shoulderFwdL: 10, shoulderFwdR: 15,
    globalTilt: -40, globalRoll: 20
  },
  'p11-armchair-s6-kneeling-back-view-armrest-grip': {
    // R1 + R7. Both hands should be gripping armrest — bring near symmetric.
    leftShoulder: -95, rightShoulder: -90,
    leftElbow: 70, rightElbow: 70,
    shoulderFwdL: 20, shoulderFwdR: 20,
    globalTwist: 35
  },
  'p16-bed-b2-recline-headboard-arm-up': {
    // Recline against headboard, one arm up.
    leftShoulder: -130, rightShoulder: -65,
    leftElbow: 55, rightElbow: 70,
    shoulderFwdL: 10, shoulderFwdR: 12
  },
  'p16-bed-b9-kneeling-arch-hand-in-hair': {
    // R1 + R5 (knees at 138). One hand to hair, arch.
    leftShoulder: -130, rightShoulder: -65,
    leftElbow: 60, rightElbow: 70,
    shoulderFwdL: 8, shoulderFwdR: 12,
    leftKnee: 125, rightKnee: 125
  },
  'p18-lounge-r4-reclined-knees-up-hand-hair': {
    // R1 only (reclining, tilt OK at 55 for its category).
    leftShoulder: -130, rightShoulder: -60,
    leftElbow: 90, rightElbow: 60,
    shoulderFwdL: 15, shoulderFwdR: 15
  },
  'p17-tubes-s9-seated-hand-hair-leg-back': {
    leftShoulder: -128, rightShoulder: -50,
    leftElbow: 80, rightElbow: 45,
    shoulderFwdL: 12, shoulderFwdR: 10
  },
  'p08-male-st2-hand-behind-neck-waistband': {
    // Male: one hand behind neck, other at waistband — bring off shoulder in.
    leftShoulder: -128, rightShoulder: -60,
    leftElbow: 100, rightElbow: 90,
    shoulderFwdL: 20, shoulderFwdR: 20
  },
  'p08-male-se3-chair-diagonal-lean-leg-extended': {
    // Male seated, diagonal lean — both hands should be near thigh/knee.
    leftShoulder: -125, rightShoulder: -65,
    leftElbow: 100, rightElbow: 85,
    shoulderFwdL: 15, shoulderFwdR: 20
  },
  'p08-male-r6-lying-back-eyes-closed-fist-face': {
    // Male lying back, fist near face.
    leftShoulder: -130, rightShoulder: -55,
    leftElbow: 105, rightElbow: 55,
    shoulderFwdL: 12, shoulderFwdR: 10
  },
  'p05-bench-b13-standing-arm-raised-lean': {
    // Standing lean, one arm raised.
    leftShoulder: -130, rightShoulder: -55,
    leftElbow: 40, rightElbow: 55,
    shoulderFwdL: 5, shoulderFwdR: 10
  },
  'p01-master-s4-chair-chin-touch': {
    // Mirror direction (rightShoulder was -130, leftShoulder -30). Hand to chin.
    leftShoulder: -65, rightShoulder: -128,
    leftElbow: 90, rightElbow: 45,
    shoulderFwdL: 15, shoulderFwdR: 20
  },
  'p01-master-s17-chair-back-seat-hair-touch': {
    leftShoulder: -65, rightShoulder: -128,
    leftElbow: 80, rightElbow: 55,
    shoulderFwdL: 15, shoulderFwdR: 20
  },
  'p01-master-b3-bench-lean-upper-body-hair': {
    // Reclining category but keep as-is on tilt (65 is fine for recline).
    leftShoulder: -60, rightShoulder: -125,
    leftElbow: 75, rightElbow: 50,
    shoulderFwdL: 12, shoulderFwdR: 20
  },

  // ---- R5: knee hyper-flex ------------------------------------------------
  'tabletop-sit': {
    leftKnee: 128, rightKnee: 128
  },
  'feet-tucked-under': {
    leftKnee: 128, rightKnee: 128
  },
  'p10-bench-s1-kneeling-profile-hands-lap': {
    // Also R7 (twist -60). Clamp both.
    leftKnee: 128, rightKnee: 128,
    globalTwist: -35
  },

  // ---- R6: seated but tilt > 50 ------------------------------------------
  'p10-bench-s10-recline-legs-up-vertical': {
    globalTilt: -40
  },
  'p11-armchair-s10-floor-recline-head-on-armrest': {
    globalTilt: -45
  },
  'p17-tubes-s1-reclined-across-tubes': {
    globalTilt: 40
  },

  // ---- R7: extreme twist in seated/boudoir -------------------------------
  'p10-bench-s7-standing-drape-fabric': {
    globalTwist: -35
  },
  'p10-bench-s8-seated-profile-tiptoe': {
    globalTwist: -35
  },
  'p15-chair-s3-side-straddle-back': {
    globalTwist: 38
  },
  'p15-chair-s5-side-saddle-look-back': {
    globalTwist: 38
  },
  'p15-chair-s10-twist-both-hands-rail': {
    globalTwist: 40
  },
  'p11-armchair-s5-both-legs-over-armrest-smile': {
    globalTwist: 40
  }
};

// ============================================================================
// Locate `id: 'POSE_ID'`, find its `joints: { ... }` block, apply overrides.
// ============================================================================
function findPoseBlock(src, id) {
  const re = new RegExp(`(['"])${id.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\1\\s*:\\s*\\{`);
  const m = re.exec(src);
  if (!m) return null;
  // Find matching closing brace of the pose object
  let i = m.index + m[0].length;
  let depth = 1;
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    if (depth === 0) return { poseStart: m.index, poseEnd: i + 1, bodyStart: m.index + m[0].length, bodyEnd: i };
    i++;
  }
  return null;
}

function findJointsBlock(src, bodyStart, bodyEnd) {
  const region = src.slice(bodyStart, bodyEnd);
  const re = /joints\s*:\s*\{/;
  const m = re.exec(region);
  if (!m) return null;
  const absStart = bodyStart + m.index + m[0].length; // just after '{'
  let i = absStart;
  let depth = 1;
  while (i < bodyEnd && depth > 0) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    if (depth === 0) return { openStart: absStart, closeIdx: i };
    i++;
  }
  return null;
}

function applyOverrides(src, id, overrides) {
  const pose = findPoseBlock(src, id);
  if (!pose) return { ok: false, reason: 'pose block not found' };
  const joints = findJointsBlock(src, pose.bodyStart, pose.bodyEnd);
  if (!joints) return { ok: false, reason: 'joints block not found' };

  let body = src.slice(joints.openStart, joints.closeIdx);
  let changed = 0;
  for (const [k, v] of Object.entries(overrides)) {
    const keyRe = new RegExp(`(^|,|\\{|\\s)(${k})\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`, 'm');
    if (keyRe.test(body)) {
      body = body.replace(keyRe, (_full, pre, name) => `${pre}${name}: ${v}`);
      changed++;
    } else {
      // Insert new key at end (before trailing whitespace/newline)
      const trimmed = body.replace(/\s+$/, '');
      const sep = trimmed.endsWith(',') ? '' : (trimmed.length ? ',' : '');
      body = `${trimmed}${sep}\n        ${k}: ${v}\n      `;
      changed++;
    }
  }
  const newSrc = src.slice(0, joints.openStart) + body + src.slice(joints.closeIdx);
  return { ok: true, changed, newSrc };
}

// ============================================================================
// Run
// ============================================================================
function main() {
  let src = fs.readFileSync(FILE, 'utf8');
  const bakDir = path.join(REPO, '.backups');
  fs.mkdirSync(bakDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const bak = path.join(bakDir, `poses-data.js.bak-v4-${stamp}.js`);
  fs.copyFileSync(FILE, bak);
  console.log('Backup:', path.relative(REPO, bak));

  const ids = Object.keys(FIXES);
  const results = [];
  for (const id of ids) {
    const res = applyOverrides(src, id, FIXES[id]);
    if (!res.ok) { results.push({ id, ok: false, reason: res.reason }); continue; }
    src = res.newSrc;
    results.push({ id, ok: true, changed: res.changed });
  }
  fs.writeFileSync(FILE, src);

  const okCount = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok);
  console.log(`\nApplied fixes to ${okCount}/${ids.length} poses.`);
  if (fail.length) {
    console.log('Failures:');
    fail.forEach(f => console.log('  -', f.id, ':', f.reason));
  }
  for (const r of results.filter(r => r.ok)) {
    console.log(`  ✓ ${r.id} (${r.changed} joints)`);
  }
}

main();
