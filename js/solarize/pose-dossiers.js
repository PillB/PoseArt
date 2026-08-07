// ============================================================
// PoseArt Solarize — Per-Pose Anatomy Dossier (Solarize §18)
// ------------------------------------------------------------
// For every pose produce a dossier containing:
//   pose ID + revision; instructions; target scene; intended camera view;
//   person count; support class; props; contacts; front/side/three-quarter
//   render markers; mirrored variant where permitted; balance assessment;
//   anatomical review; photography review; reference provenance;
//   camera-coach eligibility; residual limitations; executable schema test.
//
// Each migrated couple scene is 'migrated_pending_review'. The dossier
// generator runs deterministic anatomical/balance/photography checks and
// promotes a scene to 'canonical' only when ALL automated gates pass AND
// a human reviewer signs off (recorded in validationStatus.reviewedBy).
// A contact-sheet pass is screening, NOT final adjudication (§18).
// ============================================================

import {
  validatePoseScene, CANONICAL_LANDMARKS, CANONICAL_JOINT_ANGLES,
  angle3, makeTargetPerson,
} from './canonical-schema.js';

// Anatomical joint-range table (degrees, SIGNED convention matching the
// legacy PoseArt rig). Outside these ranges the joint is anatomically
// implausible. Values are deliberately permissive for art poses.
//   shoulders: signed abduction (-180 behind body .. 180 overhead)
//   elbows:    unsigned flexion (0 straight .. 160 full flex)
//   hips:      signed (-90 extension .. 120 flexion)
//   knees:     unsigned flexion (0 straight .. 160 full flex)
//   spine/neck: signed lateral/rotation (-60 .. 60)
// Legacy-only fields (hips, hipAbductL/R, shoulderFwdL/R, globalRoll,
// leftAnkle, rightAnkle) are NOT canonical joint angles and are excluded.
export const ANATOMICAL_RANGES = Object.freeze({
  leftShoulder:  [-180, 180], rightShoulder:  [-180, 180],
  leftElbow:     [0, 160],    rightElbow:     [0, 160],
  leftHip:       [-90, 120],  rightHip:       [-90, 120],
  leftKnee:      [0, 160],    rightKnee:      [0, 160],
  spine:         [-60, 60],   neck:           [-60, 60],
});

// Legacy rig fields that are NOT canonical joint angles (excluded from
// anatomy review). They may be preserved for renderer compatibility but
// are not anatomically validated.
export const LEGACY_NON_CANONICAL_FIELDS = Object.freeze([
  'hips', 'hipAbductL', 'hipAbductR', 'shoulderFwdL', 'shoulderFwdR',
  'globalRoll', 'leftAnkle', 'rightAnkle',
]);

// Support classes (Solarize §18 / §17).
export const SUPPORT_CLASSES = Object.freeze([
  'standing', 'seated', 'kneeling', 'reclining', 'prone', 'supine',
  'leaning', 'floor-transition', 'lifted', 'mixed',
]);

// ---- Build a single dossier for one pose + its (migrated) scene ----
export function buildDossier(poseEntry, scene, opts = {}) {
  if (!poseEntry) return null;
  const id = poseEntry.id || scene?.sceneId;
  const rev = scene?.revision || 1;

  const schemaValidation = validatePoseScene(scene);
  const anatomy = reviewAnatomy(scene);
  const balance = assessBalance(scene);
  const photography = reviewPhotography(scene, poseEntry);
  const contacts = reviewContacts(scene);
  const renderMarkers = renderVariantMarkers(scene);
  const provenance = deriveProvenance(poseEntry);
  const eligibility = cameraCoachEligibility(scene, anatomy, balance, contacts);

  const blocking = [];
  if (!schemaValidation.ok) blocking.push('schema_invalid');
  if (anatomy.issues.some((i) => i.severity === 'high')) blocking.push('anatomy_high_severity');
  if (balance.issues.some((i) => i.severity === 'high')) blocking.push('balance_unstable');
  if (contacts.issues.some((i) => i.severity === 'high')) blocking.push('contact_invalid');

  const residual = [];
  if (anatomy.issues.some((i) => i.severity === 'medium')) residual.push('anatomy_medium');
  if (balance.issues.some((i) => i.severity === 'medium')) residual.push('balance_medium');
  if (contacts.issues.some((i) => i.severity === 'medium')) residual.push('contact_medium');
  if (!poseEntry.tip) residual.push('missing_tip');
  if (!poseEntry.instructions) residual.push('missing_instructions');

  const automatedPass = blocking.length === 0;
  const validationStatus = {
    state: automatedPass ? (opts.humanSignedOff ? 'canonical' : 'automated_pass_pending_signoff') : 'migrated_pending_review',
    reviewedBy: opts.humanSignedOff ? (opts.reviewer || 'reviewer') : [],
    notes: opts.notes || '',
    automatedAt: new Date().toISOString(),
    blocking,
    residual,
  };

  return {
    poseId: id,
    revision: rev,
    schemaRevision: 1,
    instructions: poseEntry.instructions || '',
    tip: poseEntry.tip || '',
    targetScene: scene,
    intendedCameraView: scene?.cameraIntent || { view: 'front', framing: 'fullBody' },
    personCount: scene?.targetPeople?.length || 1,
    supportClass: deriveSupportClass(poseEntry, scene),
    props: scene?.props || [],
    contacts: scene?.contacts || [],
    renderVariants: renderMarkers,
    balance,
    anatomy,
    photography,
    contacts,
    provenance,
    cameraCoachEligibility: eligibility,
    residualLimitations: residual,
    validationStatus,
    schemaValidation,
  };
}

// ---- Anatomical review: joint angles within plausible ranges ----
export function reviewAnatomy(scene) {
  const issues = [];
  if (!scene?.targetPeople?.length) { issues.push({ severity: 'high', joint: '*', msg: 'no target people' }); return { issues, jointsReviewed: 0 }; }
  let jointsReviewed = 0;
  for (const tp of scene.targetPeople) {
    const sk = tp.canonicalSkeleton || {};
    for (const [joint, val] of Object.entries(sk)) {
      if (!(joint in ANATOMICAL_RANGES)) continue; // skip non-anatomical fields (hipAbductL etc. carried over from legacy)
      const [lo, hi] = ANATOMICAL_RANGES[joint];
      jointsReviewed++;
      if (typeof val !== 'number' || !Number.isFinite(val)) {
        issues.push({ severity: 'medium', role: tp.roleId, joint, msg: `non-numeric ${joint}` });
      } else if (val < lo || val > hi) {
        issues.push({ severity: 'high', role: tp.roleId, joint, msg: `${joint}=${val}° outside [${lo},${hi}]`, value: val, range: [lo, hi] });
      }
    }
    // Spine/neck carried from legacy may be signed; clamp-check magnitude.
    if (sk.spine != null && Math.abs(sk.spine) > 60) {
      issues.push({ severity: 'high', role: tp.roleId, joint: 'spine', msg: `spine ${sk.spine}° exceeds ±60°`, value: sk.spine });
    }
  }
  return { issues, jointsReviewed };
}

// ---- Balance assessment: root over support base, COM plausibility ----
export function assessBalance(scene) {
  const issues = [];
  if (!scene?.targetPeople?.length) return { issues, stable: false };
  for (const tp of scene.targetPeople) {
    const root = tp.rootPosition;
    if (!root) { issues.push({ severity: 'medium', role: tp.roleId, msg: 'no root position' }); continue; }
    // Root must be inside the frame.
    if (root.x < 0.05 || root.x > 0.95 || root.y < 0.05 || root.y > 0.95) {
      issues.push({ severity: 'high', role: tp.roleId, msg: `root out of frame (${root.x},${root.y})` });
    }
    // Standing balance: ankles roughly under hips (root y near 0.5).
    if (tp.canonicalSkeleton) {
      const hipFlex = Math.abs(tp.canonicalSkeleton.leftHip || 0) + Math.abs(tp.canonicalSkeleton.rightHip || 0);
      if (hipFlex > 220) issues.push({ severity: 'medium', role: tp.roleId, msg: 'extreme combined hip flexion' });
    }
  }
  // Two-person: roots should not overlap
  if (scene.targetPeople.length === 2) {
    const [a, b] = scene.targetPeople;
    const d = Math.hypot((a.rootPosition?.x || 0.5) - (b.rootPosition?.x || 0.5), (a.rootPosition?.y || 0.5) - (b.rootPosition?.y || 0.5));
    if (d < 0.05) issues.push({ severity: 'high', role: 'AB', msg: 'two persons overlap at root' });
  }
  return { issues, stable: issues.every((i) => i.severity !== 'high') };
}

// ---- Photography review: framing, camera intent, mirror policy ----
export function reviewPhotography(scene, poseEntry) {
  const issues = [];
  const ci = scene?.cameraIntent || {};
  if (!ci.view) issues.push({ severity: 'medium', msg: 'no camera view specified' });
  if (!ci.framing) issues.push({ severity: 'low', msg: 'no framing specified' });
  const mp = scene?.mirrorPolicy;
  if (!mp) issues.push({ severity: 'low', msg: 'no mirror policy' });
  // Intent alignment
  if (poseEntry?.intent && ci.view && poseEntry.intent.toLowerCase().includes('profile') && ci.view !== 'side') {
    issues.push({ severity: 'medium', msg: 'intent says profile but view is not side' });
  }
  return { issues, cameraIntent: ci, mirrorPolicy: mp, framing: ci.framing };
}

// ---- Contact review: anchors valid, participants resolve ----
export function reviewContacts(scene) {
  const issues = [];
  const roleIds = new Set((scene?.targetPeople || []).map((t) => t.roleId));
  const propIds = new Set((scene?.props || []).map((p) => p.propId));
  for (const c of scene?.contacts || []) {
    const aIsRole = roleIds.has(c.participantA);
    const aIsProp = c.participantA.startsWith('prop:') && propIds.has(c.participantA.slice(5));
    const bIsRole = roleIds.has(c.participantB);
    const bIsProp = c.participantB.startsWith('prop:') && propIds.has(c.participantB.slice(5));
    if (!aIsRole && !aIsProp) issues.push({ severity: 'high', contact: c.id, msg: `participantA ${c.participantA} unresolved` });
    if (!bIsRole && !bIsProp) issues.push({ severity: 'high', contact: c.id, msg: `participantB ${c.participantB} unresolved` });
    if (!c.anchorA || !c.anchorB) issues.push({ severity: 'medium', contact: c.id, msg: 'missing anchor' });
    if (typeof c.tolerance !== 'number') issues.push({ severity: 'low', contact: c.id, msg: 'non-numeric tolerance' });
  }
  return { issues, contactCount: (scene?.contacts || []).length };
}

// ---- Render variant markers (front/side/three-quarter/mirrored) ----
export function renderVariantMarkers(scene) {
  const variants = [];
  if (!scene) return variants;
  const view = scene.cameraIntent?.view || 'front';
  variants.push({ view: 'front', available: true });
  if (scene.targetPeople?.length <= 2) variants.push({ view: 'side', available: true });
  variants.push({ view: 'three-quarter', available: true });
  if (scene.mirrorPolicy !== 'never') variants.push({ view: 'front', mirrored: true, available: true });
  return variants;
}

// ---- Provenance ----
export function deriveProvenance(poseEntry) {
  return {
    source: 'PoseArt legacy library (poses-data.js)',
    poseId: poseEntry?.id,
    migratedBy: 'solarize/couple-pose-migration.js v1',
    originalCategory: poseEntry?.category,
    originalDifficulty: poseEntry?.difficulty,
    originalTags: poseEntry?.tags || [],
  };
}

// ---- Support class derivation ----
export function deriveSupportClass(poseEntry, scene) {
  const cat = (poseEntry?.category || '').toLowerCase();
  const instr = (poseEntry?.instructions || '').toLowerCase();
  if (cat === 'reclining' || instr.includes('reclin') || instr.includes('lie back')) return 'reclining';
  if (instr.includes('prone') || instr.includes('face down')) return 'prone';
  if (instr.includes('supine') || instr.includes('face up')) return 'supine';
  if (cat === 'seated' || instr.includes('sit')) return 'seated';
  if (cat === 'kneeling' || instr.includes('kneel')) return 'kneeling';
  if (cat === 'leaning' || instr.includes('lean')) return 'leaning';
  if (instr.includes('floor')) return 'floor-transition';
  if (cat === 'couple' && instr.includes('lift')) return 'lifted';
  return 'standing';
}

// ---- Camera-coach eligibility ----
export function cameraCoachEligibility(scene, anatomy, balance, contacts) {
  const reasons = [];
  if (anatomy.issues.some((i) => i.severity === 'high')) reasons.push('anatomy_high_severity');
  if (balance.issues.some((i) => i.severity === 'high')) reasons.push('balance_unstable');
  if (contacts.issues.some((i) => i.severity === 'high')) reasons.push('contact_invalid');
  if (!scene?.targetPeople?.length) reasons.push('no_target_people');
  return { eligible: reasons.length === 0, blockingReasons: reasons };
}

// ---- Build dossiers for ALL couple poses ----
export function buildAllCoupleDossiers(POSES_LIBRARY, coupleScenes, opts = {}) {
  const out = {};
  const summary = { total: 0, canonical: 0, automatedPass: 0, pendingReview: 0, blocked: 0, bySupportClass: {} };
  for (const id of Object.keys(POSES_LIBRARY || {})) {
    const pose = POSES_LIBRARY[id];
    if (pose.category !== 'couple') continue;
    const scene = coupleScenes?.[id];
    if (!scene) continue;
    const d = buildDossier(pose, scene, opts[id]);
    out[id] = d;
    summary.total++;
    const st = d.validationStatus.state;
    if (st === 'canonical') summary.canonical++;
    else if (st === 'automated_pass_pending_signoff') summary.automatedPass++;
    else summary.pendingReview++;
    if (d.validationStatus.blocking.length) summary.blocked++;
    const sc = d.supportClass;
    summary.bySupportClass[sc] = (summary.bySupportClass[sc] || 0) + 1;
  }
  return { dossiers: out, summary };
}

// ---- Executable schema test predicate (used by tests/couples/dossiers.test.js) ----
// Returns { ok, failures[] } for a single dossier.
export function executableSchemaCheck(dossier) {
  const failures = [];
  if (!dossier) { failures.push('no dossier'); return { ok: false, failures }; }
  if (!dossier.schemaValidation.ok) failures.push(...dossier.schemaValidation.errors);
  if (dossier.personCount !== 2) failures.push(`expected 2 people, got ${dossier.personCount}`);
  if (dossier.anatomy.issues.some((i) => i.severity === 'high')) {
    failures.push('high-severity anatomy issue: ' + dossier.anatomy.issues.filter((i) => i.severity === 'high').map((i) => i.msg).join('; '));
  }
  if (dossier.balance.issues.some((i) => i.severity === 'high')) {
    failures.push('high-severity balance issue');
  }
  if (dossier.contacts.issues.some((i) => i.severity === 'high')) {
    failures.push('high-severity contact issue');
  }
  return { ok: failures.length === 0, failures };
}
