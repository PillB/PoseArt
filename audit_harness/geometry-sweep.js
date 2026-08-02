// audit_harness/geometry-sweep.js
// Fast scalable defect detector: runs the REAL renderer FK (buildPose) in Node
// for every pose, derives anatomy from the resulting coordinates, and flags
// semantic/geometry defects. This is the complement the existing
// joint_validator.js failed to be — it derives coordinates instead of trusting
// raw config values or comments.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const crypto = require('crypto');
const { deriveAnatomy, geometryHash } = require('./lib/geometry');

const REPO = path.resolve(__dirname, '..');
const RUN_ID = fs.readFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), 'utf8').trim();
const OUT_DIR = path.join(REPO, 'artifacts', 'pose-audit', RUN_ID);
fs.mkdirSync(OUT_DIR, { recursive: true });

// --- Load poses-data.js ---
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON };
sb.globalThis = sb;
vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;

// --- Load pose-skeleton-3d.js to get the real buildPose ---
let rsrc = fs.readFileSync(path.join(REPO, 'js', 'pose-skeleton-3d.js'), 'utf8');
const fakeCanvas = { getContext: () => ({ scale: () => {} }), style: {}, classList: { add: () => {} }, width: 0, height: 0 };
const rsb = { console, Math, Date, Object, Array, JSON, document: { createElement: () => fakeCanvas } };
rsb.window = rsb; // the renderer IIFE is invoked as (function(global){...})(window)
rsb.globalThis = rsb;
vm.createContext(rsb);
vm.runInContext(rsrc, rsb, { filename: 'pose-skeleton-3d.js' });
const buildPose = rsb.PoseSkeleton3D._internals.buildPose;

// --- Semantic claim extractors (translate prose -> expected geometry) ---
function expectedClaims(pose) {
  const d = (pose.instructions || '') + ' ' + (pose.tip || '');
  const claims = [];
  // Knees to one side / asymmetric — FIX 2026-08-02 (cron-round-6): replaced
  // greedy `knees.*together.*side` (matched across sentences: "knees together.
  // ...seat edge beside") with tight patterns requiring "side" adjacent to
  // knees/angle within a few words.
  // FIX iter4: Exclude "lie on one side" / "shift to one side" (body orientation, not knee direction)
  if (/\b(both knees (to the )?(left|right|side)|knees (angled|tilted|pointing) (to )?(one side|the (left|right))|angle (both )?knees (to )?(one side|the (left|right)))\b/i.test(d) && !/\b(lie|lying|shift|seat)\b.*\bone side\b/i.test(d)) claims.push({ id: 'knees_to_one_side', expect: 'asymmetric hip flexion or global yaw' });
  // Knees together
  if (/\bknees together\b/i.test(d)) claims.push({ id: 'knees_together', expect: 'hip abduction near 0 or negative (adduction)' });
  // Knees apart / wide
  if (/\b(knees apart|knees wide|legs wide|wide stance|wide apart)\b/i.test(d)) claims.push({ id: 'knees_apart', expect: 'hip abduction positive (spread)' });
  // Crossed legs
  if (/\bcross\b.*(leg|ankle|foot|shin|knee)/i.test(d)) claims.push({ id: 'legs_crossed', expect: 'one hip abducted, other adducted (asymmetric)' });
  // Arms overhead
  if (/\b(arms?\s+overhead|raise\s+(both\s+)?arms\s+(up|overhead)|arms\s+up|lift\s+(the\s+)?arms|skyward)\b/i.test(d)) claims.push({ id: 'arms_overhead', expect: 'shoulder abduction > 135°' });
  // Hands on hips
  if (/\bhand[s]?\s+on\s+(the\s+)?hips|hands?\s+resting\s+on\s+hips\b/i.test(d)) claims.push({ id: 'hands_on_hips', expect: 'elbow ~70-100°, shoulder abducted ~30-60°' });
  // Crossed arms
  if (/\bcross(ed)?\s+arms\b/i.test(d)) claims.push({ id: 'arms_crossed', expect: 'elbow > 80°, shoulder abducted + forward flexion' });
  // Forward lean / fold
  // FIX iter3+iter5: Replaced greedy 'lean.*forward' with tight patterns.
  // FIX iter5: Don't generate torso_forward if 'arch' appears (arch = backward, not forward)
  if (/\b(forward\s+(lean|fold|hinge|round|tilt|hunch|curve|bend)|lean\s+forward|hinge\s+from\s+the\s+hips?|round\s+(forward|the\s+back)|hunch\s+forward|curve\s+forward|bend\s+forward|torso\s+forward|chest\s+forward|lean\s+the\s+torso\s+forward|leaning\s+forward|rest\s+the\s+forehead)\b/i.test(d) && !/\barch\b/i.test(d)) claims.push({ id: 'torso_forward', expect: 'torso flexion > 5°' });
  // Back arch / backward
  if (/\b(arch\s+(backward|backwards|the\s+back|spine\s+back)|backward\s+arch|back\s+arch|recline.*back|lean\s+back)\b/i.test(d)) claims.push({ id: 'torso_back', expect: 'torso flexion < 0 or globalTilt supine' });
  // Lying / reclining / supine / prone — now checks SIGN too (not just presence)
  // TRUTH: +90=PRONE, -90=SUPINE (verified 2026-08-02)
  // FIX iter4: Tightened "on the back" to exclude "back of the chair" and "back leg"
  if (/\b(lying|reclining|lie\s+back|on\s+(the\s+)?back(?!.*chair|.*leg|.*foot|.*heel)|on\s+(the\s+)?floor|on\s+(the\s+)?bed)\b/i.test(d) && !/\bkneel|sit|perch|stand\b/i.test(d)) {
    claims.push({ id: 'reclining', expect: 'globalTilt != 0' });
  }
  if (/\b(lie|lying|recline|reclining)\s+(on\s+)?(the\s+)?back\b|\bsupine\b|\bback\s+lying\b|\blying\s+back\b/i.test(d) && !/\bprone|face[\s-]down|belly\b/i.test(d)) {
    claims.push({ id: 'supine_pose', expect: 'globalTilt negative (-90=supine)' });
  }
  if (/\b(lie|lying)\s+(face[\s-]down|on\s+(the\s+)?front|prone)|\bprone\b|\bface[\s-]down\b|\ball\s+fours\b|\bhands\s+and\s+knees\b|\bbelly\s+down\b/i.test(d) && !/\bon\s+back\b/i.test(d)) {
    claims.push({ id: 'prone_pose', expect: 'globalTilt positive (+90=prone)' });
  }
  // Kneeling
  if (pose.category === 'kneeling' || /\bkneel\b/i.test(d)) claims.push({ id: 'kneeling', expect: 'knees near ground (low y) or deep knee flexion' });
  // Hands on knees / elbows on knees
  if (/\b(elbow|hand|forearm)s?\s+on\s+(the\s+)?knees?\b/i.test(d)) claims.push({ id: 'elbow_on_knee', expect: 'wrist near knee (proximity)' });
  // NEW contact checks (2026-08-02) — the sweep missed 17 of these in batch 1
  if (/\b(hand|finger|palm)s?\s+(on|to|near|on\s+the)\s+(forehead|brow|temple|head|face)\b|hand\s+to\s+(forehead|face|head)\b/i.test(d)) claims.push({ id: 'hand_to_head', expect: 'wrist within 0.25 of head' });
  // FIX iter5: 'chin with' matches 'tilt the chin down' (not hand-to-chin). Require hand/finger near chin.
  if (/\b(chin\s+(touch|rest|on\s+top\s+of)|hand\s+on\s+chin|fingers\s+under\s+chin|hand\s+near\s+chin|hand\s+to\s+chin)\b/i.test(d)) claims.push({ id: 'hand_to_chin', expect: 'wrist within 0.30 of neck/head junction' });
  if (/\b(hair\s+touch|touch\s+hair|hand\s+in\s+hair|hand\s+to\s+hair|fingers\s+through\s+hair)\b/i.test(d)) claims.push({ id: 'hand_to_hair', expect: 'wrist within 0.30 of head' });
  if (/\b(hand|fingers|palm)\s+(on|to|resting\s+on)\s+(the\s+)?(floor|ground|mat)\b|hand\s+on\s+floor\b/i.test(d)) claims.push({ id: 'hand_to_floor', expect: 'wrist y near -0.80 (ground)' });
  if (/\bhand\s+(on|resting\s+on)\s+(the\s+)?(hip|waist)\b|hands?\s+on\s+hips?\b/i.test(d)) claims.push({ id: 'hands_on_hips', expect: 'wrist within 0.25 of hip' });
  if (/\bhands?\s+(clasped|clasped\s+together|together|folded)\b|clasp\s+(both\s+)?hands?\b/i.test(d)) claims.push({ id: 'hands_clasped', expect: 'L/R wrist distance < 0.25' });
  // FIX iter4: Split arm_on_chair into armrest (lateral, x-axis) vs backrest (posterior, z-axis)
  if (/\b(arm|elbow|forearm)\s+(on|along|resting\s+on)\s+(the\s+)?(backrest|chair\s+back|back\s+of\s+chair)\b/i.test(d)) claims.push({ id: 'arm_on_chair_back', expect: 'elbow/wrist behind torso (z negative)' });
  if (/\b(arm|elbow|forearm)\s+(on|along|resting\s+on)\s+(the\s+)?armrest\b/i.test(d)) claims.push({ id: 'arm_on_armrest', expect: 'elbow at armrest height (lateral, near shoulder y)' });
  if (/\bhand\s+(on|resting\s+on|near)\s+(the\s+)?(belt|waistband|lap)\b|hands?\s+in\s+lap\b/i.test(d)) claims.push({ id: 'hand_on_lap', expect: 'wrist near hips (y 0.0-0.2, x near 0)' });
  // NEW 2026-08-02 (cron-round-6): torso rotation + drape-over-backrest claims
  // (worker-D found sweep blind spots: side-straddle returned clean but has real defects)
  if (/\b(twist|rotation|rotate|turn)\s+(the\s+)?(torso|ribcage|upper\s+body|shoulders)|torso\s+(twist|rotation|rotate)|ribcage\s+(twist|rotation)|quarter\s+turn\s+(toward|away)|upper\s+body\s+(twist|rotat)\b/i.test(d)) claims.push({ id: 'torso_twist', expect: 'globalTwist != 0 or shoulder axial rotation' });
  if (/\b(drape|draped|draping)\s+\w*\s*(forearm|arm|elbow|hand|wrist)?s?\s*(over|across|on)\s+(the\s+)?(top\s+of\s+the\s+)?(backrest|back\s+of\s+chair|armrest|back)|(forearm|arm|elbow|hand|wrist)s?\s+(draped|drape|resting)\s+(over|across|on)\s+(the\s+)?(backrest|back\s+of\s+chair|armrest|back)\b/i.test(d)) claims.push({ id: 'drape_over_backrest', expect: 'shoulders abducted + elbows/wrists behind torso (z negative)' });
  return claims;
}

// --- Check a claim against derived anatomy ---
function checkClaim(claim, anatomy, skel, pose) {
  const j = pose.joints || {};
  const fail = (reason, sev = 'major') => ({ claim: claim.id, expected: claim.expect, actual: reason, severity: sev });
  switch (claim.id) {
    case 'knees_to_one_side': {
      const asym = Math.abs(anatomy.left_leg.hip_flexion_deg - anatomy.right_leg.hip_flexion_deg);
      const abdAsym = Math.abs(anatomy.left_leg.hip_abduction_deg - anatomy.right_leg.hip_abduction_deg);
      const yaw = j.globalTwist || 0;
      if (asym < 12 && abdAsym < 12 && Math.abs(yaw) < 15) return fail(`symmetric legs (hip flexion L/R diff ${asym.toFixed(0)}°, abduction diff ${abdAsym.toFixed(0)}°) — knees NOT to one side`, 'major');
      break;
    }
    case 'knees_together': {
      // CORRECTED 2026-08-02: hipAbduct + = adduction(inward), - = abduction(outward)
      // "knees together" = both legs adducted (positive) or near 0
      if ((j.hipAbductL || 0) < -5 && (j.hipAbductR || 0) < -5) return fail(`hipAbduct both negative (abducted/spread) but description says knees together`, 'major');
      break;
    }
    case 'knees_apart': {
      // CORRECTED: "apart" = abducted = NEGATIVE hipAbduct
      if ((j.hipAbductL || 0) > 5 && (j.hipAbductR || 0) > 5) return fail(`hipAbduct both positive (adducted/inward) but description says knees apart/wide`, 'major');
      break;
    }
    case 'legs_crossed': {
      // FIX iter3: Under corrected convention, hipAbduct + = adduction(inward).
      // Crossed legs can be represented two ways:
      //   (a) Asymmetric: one adducted (+), one abducted (-) — ankle-over-knee cross
      //   (b) Symmetric: both adducted (+) — lotus/easy cross-legged sit
      // Both are valid for "legs crossed". Only flag if BOTH are abducted (-) (spread apart).
      const l = j.hipAbductL || 0, r = j.hipAbductR || 0;
      if (l < -5 && r < -5) return fail(`both hipAbduct negative (abducted/spread) but description says legs crossed`, 'major');
      break;
    }
    case 'arms_overhead': {
      const l = anatomy.left_arm.shoulder_abduction_deg, r = anatomy.right_arm.shoulder_abduction_deg;
      if (Math.max(l, r) < 120) return fail(`shoulder abduction L ${l.toFixed(0)}° R ${r.toFixed(0)}° — not overhead`, 'major');
      break;
    }
    case 'hands_on_hips': {
      // Wrist near hip
      const lw = skel.leftWrist, lh = skel.leftHip, rw = skel.rightWrist, rh = skel.rightHip;
      const dl = Math.hypot(lw.x - lh.x, lw.y - lh.y), dr = Math.hypot(rw.x - rh.x, rw.y - rh.y);
      if (Math.min(dl, dr) > 0.35) return fail(`wrists not near hips (L dist ${dl.toFixed(2)}, R ${dr.toFixed(2)})`, 'major');
      break;
    }
    case 'arms_crossed': {
      // One wrist crosses body midline
      const lw = skel.leftWrist.x, rw = skel.rightWrist.x;
      if (!(lw > 0 || rw < 0)) return fail(`neither wrist crosses body midline (L wrist x=${lw.toFixed(2)}, R x=${rw.toFixed(2)})`, 'major');
      break;
    }
    case 'torso_forward': {
      if (anatomy.torso.flexion_deg < 5) return fail(`torso flexion ${anatomy.torso.flexion_deg.toFixed(0)}° but description says forward lean`, 'major');
      break;
    }
    case 'torso_back': {
      if (anatomy.torso.flexion_deg > 5 && !(j.globalTilt)) return fail(`torso flexion ${anatomy.torso.flexion_deg.toFixed(0)}° (forward) but description says arch back/lean back`, 'major');
      break;
    }
    case 'reclining': {
      if (!j.globalTilt) return fail(`description says lying/reclining but globalTilt missing`, 'major');
      break;
    }
    case 'supine_pose': {
      // VERIFIED 2026-08-02: -90=SUPINE, +90=PRONE
      if (!j.globalTilt) return fail(`description says supine/on-back but globalTilt missing`, 'major');
      if (j.globalTilt > 0) return fail(`globalTilt=${j.globalTilt} (POSITIVE=PRONE) but description says supine/on-back (should be negative)`, 'major');
      break;
    }
    case 'prone_pose': {
      // VERIFIED 2026-08-02: +90=PRONE, -90=SUPINE
      if (!j.globalTilt) return fail(`description says prone/face-down but globalTilt missing`, 'major');
      if (j.globalTilt < 0) return fail(`globalTilt=${j.globalTilt} (NEGATIVE=SUPINE) but description says prone/face-down (should be positive)`, 'major');
      break;
    }
    case 'kneeling': {
      // Kneeling: at least one knee near ground (low y) — but origin is hip center,
      // so "kneeling" in this rig means deep knee flexion + possibly globalTilt.
      const kneeFlex = Math.max(anatomy.left_leg.knee_flexion_deg, anatomy.right_leg.knee_flexion_deg);
      if (kneeFlex < 60 && !j.globalTilt) return fail(`max knee flexion ${kneeFlex.toFixed(0)}° — not a kneeling posture`, 'minor');
      break;
    }
    case 'elbow_on_knee': {
      // FIX iter4: Check BOTH elbow-to-knee AND wrist-to-knee (description may say "hand on knee")
      const le = skel.leftElbow, lk = skel.leftKnee, re = skel.rightElbow, rk = skel.rightKnee;
      const lw = skel.leftWrist, rw = skel.rightWrist;
      const dlElbow = Math.hypot(le.x - lk.x, le.y - lk.y, le.z - lk.z);
      const drElbow = Math.hypot(re.x - rk.x, re.y - rk.y, re.z - rk.z);
      const dlWrist = Math.hypot(lw.x - lk.x, lw.y - lk.y, lw.z - lk.z);
      const drWrist = Math.hypot(rw.x - rk.x, rw.y - rk.y, rw.z - rk.z);
      const minDist = Math.min(dlElbow, drElbow, dlWrist, drWrist);
      if (minDist > 0.35) return fail(`neither elbow nor wrist near knee (min dist ${minDist.toFixed(2)}, threshold 0.35)`, 'major');
      break;
    }
    // NEW contact checks (2026-08-02)
    case 'hand_to_head': {
      const lw = skel.leftWrist, rw = skel.rightWrist, head = skel.head;
      const dl = Math.hypot(lw.x - head.x, lw.y - head.y, lw.z - head.z);
      const dr = Math.hypot(rw.x - head.x, rw.y - head.y, rw.z - head.z);
      if (Math.min(dl, dr) > 0.30) return fail(`neither wrist near head (L ${dl.toFixed(2)}, R ${dr.toFixed(2)}, threshold 0.30)`, 'major');
      break;
    }
    case 'hand_to_chin': {
      const lw = skel.leftWrist, rw = skel.rightWrist, neck = skel.neck;
      const dl = Math.hypot(lw.x - neck.x, lw.y - neck.y, lw.z - neck.z);
      const dr = Math.hypot(rw.x - neck.x, rw.y - neck.y, rw.z - neck.z);
      if (Math.min(dl, dr) > 0.30) return fail(`neither wrist near chin/neck (L ${dl.toFixed(2)}, R ${dr.toFixed(2)})`, 'major');
      break;
    }
    case 'hand_to_hair': {
      const lw = skel.leftWrist, rw = skel.rightWrist, head = skel.head;
      const dl = Math.hypot(lw.x - head.x, lw.y - head.y, lw.z - head.z);
      const dr = Math.hypot(rw.x - head.x, rw.y - head.y, rw.z - head.z);
      if (Math.min(dl, dr) > 0.35) return fail(`neither wrist near head/hair (L ${dl.toFixed(2)}, R ${dr.toFixed(2)})`, 'major');
      break;
    }
    case 'hand_to_floor': {
      // FIX iter3: Make threshold pose-aware. Standing poses have floor at y~-0.90,
      // but kneeling/seated-on-floor poses have the body lower, so wrist-at-floor
      // is higher (y~-0.10 to y~-0.30). Reclining poses have floor at y~-0.50.
      const lw = skel.leftWrist, rw = skel.rightWrist;
      const minY = Math.min(lw.y, rw.y);
      const gt = j.globalTilt || 0;
      const hipY = skel.hips.y;
      // Determine effective floor threshold based on body position
      let threshold;
      if (Math.abs(gt) > 60) threshold = -0.40; // reclining
      else if (hipY < 0.3) threshold = -0.10; // kneeling/seated (hips low)
      else threshold = -0.55; // standing (hips high)
      if (minY > threshold) return fail(`neither wrist near floor (min wrist y ${minY.toFixed(2)}, threshold ${threshold})`, 'major');
      break;
    }
    case 'hands_clasped': {
      const lw = skel.leftWrist, rw = skel.rightWrist;
      const dist = Math.hypot(lw.x - rw.x, lw.y - rw.y, lw.z - rw.z);
      if (dist > 0.30) return fail(`wrists too far apart to be clasped (dist ${dist.toFixed(2)}, threshold 0.30)`, 'major');
      break;
    }
    case 'arm_on_chair_back': {
      // Arm along BACK of chair (posterior): elbow/wrist behind torso (z negative)
      const le = skel.leftElbow, re = skel.rightElbow;
      const lw = skel.leftWrist, rw = skel.rightWrist;
      const minZ = Math.min(le.z, re.z, lw.z, rw.z);
      if (minZ > -0.10) return fail(`no elbow/wrist behind torso (min z ${minZ.toFixed(2)}, need < -0.10 for arm-on-chair-back)`, 'major');
      break;
    }
    case 'arm_on_armrest': {
      // Arm on ARMREST (lateral): elbow near shoulder y level
      const le = skel.leftElbow, re = skel.rightElbow;
      const lSh = skel.leftShoulder, rSh = skel.rightShoulder;
      const shoulderMidY = (lSh.y + rSh.y) / 2;
      const elbowNearArmrest = Math.min(Math.abs(le.y - shoulderMidY), Math.abs(re.y - shoulderMidY));
      if (elbowNearArmrest > 0.25) return fail(`elbow not at armrest height (nearest ${elbowNearArmrest.toFixed(2)} from shoulder y, threshold 0.25)`, 'major');
      break;
    }
    case 'hand_on_lap': {
      const lw = skel.leftWrist, rw = skel.rightWrist;
      const lh = skel.leftHip, rh = skel.rightHip;
      const dl = Math.hypot(lw.x - lh.x, lw.y - lh.y, lw.z - lh.z);
      const dr = Math.hypot(rw.x - rh.x, rw.y - rh.y, rw.z - rh.z);
      if (Math.min(dl, dr) > 0.35) return fail(`neither wrist near lap/hips (L ${dl.toFixed(2)}, R ${dr.toFixed(2)})`, 'major');
      break;
    }
    // NEW 2026-08-02 (cron-round-6): torso twist + drape-over-backrest checks
    case 'torso_twist': {
      const twist = j.globalTwist || 0;
      const axialRot = Math.abs(anatomy.torso.axial_rotation_deg);
      if (Math.abs(twist) < 10 && axialRot < 8) return fail(`description says twist/rotate torso but globalTwist=${twist} and axial rotation proxy=${axialRot.toFixed(0)}° — no torso twist`, 'major');
      break;
    }
    case 'drape_over_backrest': {
      // Arms draped over backrest: shoulders abducted (moderate) + elbows/wrists behind torso
      const le = skel.leftElbow, re = skel.rightElbow;
      const lw = skel.leftWrist, rw = skel.rightWrist;
      const minZ = Math.min(le.z, re.z, lw.z, rw.z);
      const lAbd = anatomy.left_arm.shoulder_abduction_deg, rAbd = anatomy.right_arm.shoulder_abduction_deg;
      if (minZ > -0.05 && Math.max(lAbd, rAbd) < 50) return fail(`arms not draped over backrest (min z ${minZ.toFixed(2)}, max shoulder abduction ${Math.max(lAbd, rAbd).toFixed(0)}°)`, 'major');
      break;
    }
  }
  return null;
}

// --- Run sweep ---
const results = [];
const defectTally = {};
let totalDefects = 0;
const t0 = Date.now();

for (const id of Object.keys(lib)) {
  const pose = lib[id];
  if (!pose.joints) { results.push({ id, skipped: 'no joints' }); continue; }
  let posed;
  try { posed = buildPose(pose.joints); } catch (e) { results.push({ id, error: 'buildPose: ' + e.message }); continue; }
  const reclining = !!(pose.joints.globalTilt);
  const anatomy = deriveAnatomy(posed, { confidence: 0.75, reclining });
  const ghash = geometryHash(posed);
  const claims = expectedClaims(pose);
  const defects = [];
  for (const c of claims) {
    const f = checkClaim(c, anatomy, posed, pose);
    if (f) { defects.push(f); defectTally[f.severity] = (defectTally[f.severity] || 0) + 1; defectTally[f.claim] = (defectTally[f.claim] || 0) + 1; totalDefects++; }
  }
  // Plausibility flags
  for (const pf of anatomy.plausibility_flags) { defects.push({ claim: 'plausibility', ...pf, severity: 'minor' }); defectTally.plausibility = (defectTally.plausibility || 0) + 1; totalDefects++; }
  // Anomalies
  for (const an of anatomy.anomalies) { defects.push({ claim: 'anomaly', ...an, severity: 'minor' }); defectTally.anomaly = (defectTally.anomaly || 0) + 1; totalDefects++; }
  results.push({
    id, category: pose.category, name: pose.name, joints_hash: crypto.createHash('sha1').update(JSON.stringify(pose.joints)).digest('hex').slice(0, 12),
    geometry_hash: ghash,
    torso_flexion: anatomy.torso.flexion_deg,
    l_shoulder_abd: anatomy.left_arm.shoulder_abduction_deg, r_shoulder_abd: anatomy.right_arm.shoulder_abduction_deg,
    l_shoulder_flex: anatomy.left_arm.shoulder_sagittal_flexion_deg, r_shoulder_flex: anatomy.right_arm.shoulder_sagittal_flexion_deg,
    l_elbow: anatomy.left_arm.elbow_flexion_deg, r_elbow: anatomy.right_arm.elbow_flexion_deg,
    l_hip_flex: anatomy.left_leg.hip_flexion_deg, r_hip_flex: anatomy.right_leg.hip_flexion_deg,
    l_knee: anatomy.left_leg.knee_flexion_deg, r_knee: anatomy.right_leg.knee_flexion_deg,
    global_tilt: pose.joints.globalTilt || 0,
    floating: anatomy.balance.floating, over_support: anatomy.balance.over_support,
    defects: defects.map(d => ({ claim: d.claim, severity: d.severity, actual: d.actual }))
  });
}

const dt = Date.now() - t0;
const summary = {
  run_id: RUN_ID, generated_at: new Date().toISOString(),
  method: 'Node VM buildPose + deriveAnatomy (real renderer FK, derived coordinates)',
  total_poses: results.length, total_defects: totalDefects, duration_ms: dt,
  defect_tally: defectTally,
  poses_with_defects: results.filter(r => r.defects && r.defects.length).length,
  poses_clean: results.filter(r => !r.defects || !r.defects.length).length
};
fs.writeFileSync(path.join(OUT_DIR, 'geometry-sweep-summary.json'), JSON.stringify(summary, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'geometry-sweep.json'), JSON.stringify(results, null, 2));

console.log(`Sweep complete in ${dt}ms (${(dt / results.length).toFixed(1)}ms/pose)`);
console.log(`Total poses: ${results.length}`);
console.log(`Poses with defects: ${summary.poses_with_defects}`);
console.log(`Poses clean: ${summary.poses_clean}`);
console.log(`Total defects: ${totalDefects}`);
console.log(`Defect tally:`, JSON.stringify(defectTally, null, 2));
console.log(`Written: ${path.join(OUT_DIR, 'geometry-sweep.json')}`);
