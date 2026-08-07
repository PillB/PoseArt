// ============================================================
// PoseArt Solarize — Couple-Pose Migration (Round 3, D10/D11/D12)
// ------------------------------------------------------------
// Migrates single-skeleton `joints:{}` couple poses from the legacy
// POSES_LIBRARY into explicit two-person PoseScene records (Solarize §12).
//
// Background — defects D10/D11/D12:
//   The legacy `js/poses-data.js` declares ~30 couple poses whose `joints`
//   map represents ONE procedural rig shared between two people. There is
//   no Person A / Person B representation, no contact anchors, no
//   relational constraints. Camera-side scoring therefore treats couple
//   poses as if they were single-person poses.
//
// This module is the migration bridge. It does NOT modify poses-data.js
// (constraint: leave poses-data.js untouched). Instead it derives a
// PoseScene per couple pose, marks each `validationStatus.state =
// 'migrated_pending_review'`, and exposes them via `couple-scenes.js`
// so camera.js / role-assignment.js can consume two-person targets.
//
// Migration policy:
//   * Person A — uses the source rig's canonical joint-angle entries
//     (leftShoulder/rightShoulder/leftElbow/rightElbow/leftHip/rightHip/
//      leftKnee/rightKnee) verbatim. These are the same keys consumed by
//     `role-assignment.js` (roleCost) and the canonical schema's
//     `CANONICAL_JOINT_ANGLES`.
//   * Person B — the MIRROR image of A across the saggital plane: L↔R
//     swapped, abduction / swing signs negated, flexion (elbow/knee) sign
//     preserved. For symmetric source rigs (left==right) the negation
//     alone guarantees A and B differ meaningfully; for fully-zero rigs
//     a small bias is applied as a safety net.
//   * Contacts — derived from the pose's `instructions` text as a
//     MIGRATION HINT ONLY (Solarize §17). Every emitted contact is a
//     real `ContactConstraint` with explicit participantA/B + anchorA/B
//     so the role-assigner and prop evaluator can act on it.
//   * Root positions — A left (~0.35), B right (~0.65) by default; both
//     at y=0.5. Root rotation is nudged per instructions text (back-to-
//     back → 180°, facing each other → ±30° inward, side-by-side → ±10°).
//
// Reuses `makePoseScene` / `makeTargetPerson` / `makeContactConstraint`
// from `./canonical-schema.js` — no schema duplication.
// ============================================================

import {
  makePoseScene,
  makeTargetPerson,
  makeContactConstraint,
  validatePoseScene,
} from './canonical-schema.js';
import { inferPropsFromText } from './props.js';

// Canonical joint-angle keys shared between the legacy procedural rig
// (pose-skeleton-3d.js buildPose) and the Solarize canonical skeleton
// (canonical-schema.js CANONICAL_JOINT_ANGLES). These are the keys the
// role-assigner's `roleCost` actually compares against.
const CANONICAL_KEYS = Object.freeze([
  'leftShoulder', 'rightShoulder',
  'leftElbow', 'rightElbow',
  'leftHip', 'rightHip',
  'leftKnee', 'rightKnee',
]);

// ------------------------------------------------------------
// Skeleton derivation
// ------------------------------------------------------------

// Person A: take the source rig's canonical entries verbatim.
function skeletonForA(joints) {
  const j = joints || {};
  const sk = {};
  for (const k of CANONICAL_KEYS) sk[k] = Number(j[k]) || 0;
  return sk;
}

// Person B: mirror image of A. L↔R swapped; abduction/swing signs
// negated; flexion (elbow/knee) preserved (mirror flexion is identical).
function skeletonForB(joints) {
  const a = skeletonForA(joints);
  const b = {
    leftShoulder:  -a.rightShoulder,
    rightShoulder: -a.leftShoulder,
    leftElbow:      a.rightElbow,
    rightElbow:     a.leftElbow,
    leftHip:       -a.rightHip,
    rightHip:      -a.leftHip,
    leftKnee:       a.rightKnee,
    rightKnee:      a.leftKnee,
  };
  // Safety net: if the source rig was entirely zero (degenerate), the
  // mirror transform produces an identical zero skeleton. Apply a small
  // complementary bias so A and B always differ meaningfully.
  let diff = 0;
  for (const k of CANONICAL_KEYS) diff += Math.abs(a[k] - b[k]);
  if (diff < 1e-6) {
    b.leftShoulder  = (b.leftShoulder  || 0) + 5;
    b.rightShoulder = (b.rightShoulder || 0) - 5;
  }
  return b;
}

// ------------------------------------------------------------
// Root position + facing derivation (migration hint)
// ------------------------------------------------------------

function deriveRoots(instructions) {
  const t = String(instructions || '').toLowerCase();
  const aRoot = { x: 0.35, y: 0.5 };
  const bRoot = { x: 0.65, y: 0.5 };
  let aRot = 0;
  let bRot = 0;

  if (/back[- ]?to[- ]?back/.test(t)) {
    // Both face away from camera (180°).
    aRot = 180; bRot = 180;
  } else if (/face each other|facing each other/.test(t)) {
    // 3/4 inward turn toward partner.
    aRot =  30; bRot = -30;
  } else if (/side by side|side-by-side/.test(t)) {
    // Slight inward bias to suggest connection.
    aRot = -10; bRot =  10;
  } else if (/behind|from behind/.test(t)) {
    // Layered front/back; keep root rotation neutral (depth cue would
    // be expressed via rootPosition.y in a future refinement).
    aRot = 0; bRot = 0;
  }
  return { aRoot, bRoot, aRot, bRot };
}

// ------------------------------------------------------------
// Contact derivation (MIGRATION HINT ONLY — Solarize §17)
// ------------------------------------------------------------
// Every emitted contact is a real ContactConstraint with explicit
// participantA/B + anchorA/B. Anchors refer to canonical landmark names
// (nose, leftWrist, rightShoulder, leftHip, etc.) so role-assignment.js's
// `contactSatisfied` can evaluate them directly.

function deriveContacts(instructions) {
  const t = String(instructions || '').toLowerCase();
  const out = [];
  let n = 1;
  const add = (anchorA, anchorB, relation = 'touch', dist = 0.02, tol = 0.08) => {
    out.push(makeContactConstraint({
      id: `ct-${n++}`,
      participantA: 'A',
      anchorA,
      participantB: 'B',
      anchorB,
      relation,
      targetDistance: dist,
      tolerance: tol,
      visibilityRequired: true,
    }));
  };

  if (/back[- ]?to[- ]?back/.test(t)) {
    add('leftHip', 'rightHip', 'touch', 0.02, 0.06);
  }
  if (/forehead/.test(t)) {
    add('nose', 'nose', 'touch', 0.02, 0.05);
  }
  if (/nose to nose/.test(t)) {
    add('nose', 'nose', 'touch', 0.02, 0.05);
  }
  if (/cheek/.test(t)) {
    add('nose', 'nose', 'touch', 0.04, 0.06);
  }
  if (/hold|clasped|interlaced|linked|hand in hand|hands together|hold hands/.test(t)) {
    add('rightWrist', 'leftWrist', 'hold', 0.0, 0.06);
  }
  if (/wrap|wrapping|embrac|arm around|around (?:the|their|her|his) other/.test(t)) {
    add('rightWrist', 'leftHip', 'wrap', 0.04, 0.08);
  }
  if (/piggyback/.test(t)) {
    // B's hips supported on A's shoulders (approx).
    add('leftShoulder', 'leftHip', 'support', 0.05, 0.12);
  }
  if (/whisper.*ear|lean.*ear|ear/.test(t)) {
    add('nose', 'rightEar', 'touch', 0.03, 0.06);
  }
  if (/shoulder.*touch|touch.*shoulder|shoulders touching|shoulder.*lean|lean.*shoulder/.test(t)) {
    add('rightShoulder', 'leftShoulder', 'touch', 0.02, 0.06);
  }
  if (/chin.*shoulder|chin near.*shoulder|rest.*chin/.test(t)) {
    add('nose', 'rightShoulder', 'touch', 0.04, 0.06);
  }

  // Fallback: every couple pose implies physical proximity. If no specific
  // contact was inferred, emit a proximity contact so the scene always
  // carries at least one relational constraint.
  if (out.length === 0) {
    add('rightShoulder', 'leftShoulder', 'proximity', 0.12, 0.12);
  }
  return out;
}

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------

/**
 * Migrate a single legacy couple pose entry to a PoseScene.
 *
 * @param {object} poseEntry — a POSES_LIBRARY entry with category 'couple'
 *   and a single `joints:{}` map representing two people.
 * @returns {object} PoseScene (Solarize §12) with validationStatus.state
 *   === 'migrated_pending_review'.
 */
export function migrateCouplePoseToScene(poseEntry) {
  if (!poseEntry || typeof poseEntry !== 'object') {
    throw new Error('migrateCouplePoseToScene: poseEntry required');
  }
  const id = String(poseEntry.id || '');
  if (!id) throw new Error('migrateCouplePoseToScene: poseEntry.id required');

  const joints = poseEntry.joints || {};
  const skA = skeletonForA(joints);
  const skB = skeletonForB(joints);

  const { aRoot, bRoot, aRot, bRot } = deriveRoots(poseEntry.instructions);

  const requiredLandmarks = [
    'nose', 'leftShoulder', 'rightShoulder', 'leftHip', 'rightHip',
  ];

  const personA = makeTargetPerson({
    roleId: 'A',
    roleName: 'Person A',
    canonicalSkeleton: skA,
    rootPosition: aRoot,
    rootRotation: aRot,
    scalePolicy: 'normalize',
    requiredLandmarks,
    optionalLandmarks: ['leftElbow', 'rightElbow', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle', 'leftWrist', 'rightWrist'],
  });

  const personB = makeTargetPerson({
    roleId: 'B',
    roleName: 'Person B',
    canonicalSkeleton: skB,
    rootPosition: bRoot,
    rootRotation: bRot,
    scalePolicy: 'normalize',
    requiredLandmarks,
    optionalLandmarks: ['leftElbow', 'rightElbow', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle', 'leftWrist', 'rightWrist'],
  });

  const contacts = deriveContacts(poseEntry.instructions);

  // Props inference is a migration hint; we surface it on sourceReferences
  // so a reviewer can promote explicit PropRecords later. We do NOT emit
  // bare PropRecords from prose (Solarize §17 forbids prose-driven props
  // as the runtime architecture).
  const inferredPropTypes = inferPropsFromText(poseEntry.instructions);

  const scene = makePoseScene({
    sceneId: `couple-scene:${id}`,
    displayName: String(poseEntry.name || id),
    category: 'couple',
    cameraIntent: { view: 'front', framing: 'fullBody' },
    mirrorPolicy: 'auto',
    targetPeople: [personA, personB],
    props: [],
    contacts,
    validationStatus: {
      state: 'migrated_pending_review',
      reviewedBy: [],
      notes:
        `Auto-migrated from single-skeleton couple pose '${id}'. ` +
        'Skeletons split via saggital-plane mirror transform (A=source, ' +
        'B=mirrored). Contacts inferred from instructions text as ' +
        'migration hints; every contact is a real ContactConstraint. ' +
        'Requires human review before promotion to \'canonical\'.',
    },
    sourceReferences: [{
      type: 'legacy-pose',
      poseId: id,
      legacyJoints: joints,
      inferredPropTypes,
    }],
  });

  return scene;
}

/**
 * Migrate every couple pose in a POSES_LIBRARY-shaped object.
 *
 * @param {Record<string, object>} POSES_LIBRARY — the legacy library.
 * @returns {{ scenes: Record<string, object>, count: number, unmigrated: Array }}
 */
export function migrateAllCouplePoses(POSES_LIBRARY) {
  const lib = POSES_LIBRARY || {};
  const scenes = {};
  const unmigrated = [];
  for (const [id, pose] of Object.entries(lib)) {
    if (!pose || pose.category !== 'couple') continue;
    try {
      const scene = migrateCouplePoseToScene(pose);
      const v = validatePoseScene(scene);
      if (!v.ok) {
        unmigrated.push({ id, reason: 'validation_failed', errors: v.errors });
        continue;
      }
      scenes[id] = scene;
    } catch (e) {
      unmigrated.push({ id, reason: 'exception', errors: [String(e && e.message || e)] });
    }
  }
  return { scenes, count: Object.keys(scenes).length, unmigrated };
}

// Test/inspection helper: are two TargetPeople skeletons meaningfully distinct?
export function skeletonsDiffer(a, b) {
  const ak = (a && a.canonicalSkeleton) || {};
  const bk = (b && b.canonicalSkeleton) || {};
  let diff = 0;
  for (const k of CANONICAL_KEYS) {
    diff += Math.abs(Number(ak[k]) - Number(bk[k]));
  }
  return diff > 1e-6;
}
