// ============================================================
// PoseArt Solarize — Canonical Schema (Round 1+ foundation)
// ------------------------------------------------------------
// Single source of truth for the observed-person, pose-scene,
// target-person, contact, prop and alignment-result shapes.
// Every detector (MoveNet, MediaPipe, RTMPose, …) is adapted
// INTO this schema. Targets and observations are never compared
// in their native detector coordinate systems.
//
// Solarize §10 (Canonical observed skeleton), §12 (PoseScene),
// §14 (Alignment scoring). Loaded as an ES module in the browser
// and imported directly by Node/Vitest tests.
// ============================================================

export const SCHEMA_REVISION = 1;

// Canonical 17-keypoint skeleton (COCO subset). camelCase names
// match existing PoseArt renderer conventions; detectors map in.
export const CANONICAL_LANDMARKS = Object.freeze([
  'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar',
  'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
  'leftWrist', 'rightWrist', 'leftHip', 'rightHip',
  'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle',
]);

export const CANONICAL_LANDMARK_SET = new Set(CANONICAL_LANDMARKS);

// Bone pairs (parent→child) used for normalized bone-vector similarity.
export const CANONICAL_BONES = Object.freeze([
  ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
  ['leftShoulder', 'leftHip'], ['rightShoulder', 'rightHip'],
  ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
  ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle'],
  ['leftShoulder', 'rightShoulder'], ['leftHip', 'rightHip'],
  ['nose', 'leftShoulder'], ['nose', 'rightShoulder'],
]);

// Three-point joint-angle definitions: [a, vertex, c] → angle at vertex.
export const CANONICAL_JOINT_ANGLES = Object.freeze({
  leftShoulder:  ['leftElbow', 'leftShoulder', 'leftHip'],
  rightShoulder: ['rightElbow', 'rightShoulder', 'rightHip'],
  leftElbow:     ['leftWrist', 'leftElbow', 'leftShoulder'],
  rightElbow:    ['rightWrist', 'rightElbow', 'rightShoulder'],
  leftHip:       ['leftKnee', 'leftHip', 'leftShoulder'],
  rightHip:      ['rightKnee', 'rightHip', 'rightShoulder'],
  leftKnee:      ['leftAnkle', 'leftKnee', 'leftHip'],
  rightKnee:     ['rightAnkle', 'rightKnee', 'rightHip'],
});

// ------------------------------------------------------------
// Landmark point
// ------------------------------------------------------------
export function makeLandmark({ x = 0, y = 0, z = null, visibility = 0, confidence = 0 } = {}) {
  return {
    x: Number(x),
    y: Number(y),
    z: z === null ? null : Number(z),
    visibility: clamp01(Number(visibility)),
    confidence: clamp01(Number(confidence)),
  };
}

// ------------------------------------------------------------
// ObservedPerson — Solarize §10
// ------------------------------------------------------------
export function makeObservedPerson(p = {}) {
  const lp = p.imageLandmarks || {};
  const imageLandmarks = {};
  for (const name of CANONICAL_LANDMARKS) {
    imageLandmarks[name] = lp[name] ? makeLandmark(lp[name]) : makeLandmark({ visibility: 0, confidence: 0 });
  }
  return {
    trackId: p.trackId ?? null,
    timestamp: Number(p.timestamp) || 0,
    bbox: p.bbox || null,
    imageLandmarks,
    worldLandmarks: p.worldLandmarks || null,
    landmarkSchema: 'poseart-canonical-17',
    visibility: clamp01(Number(p.visibility) ?? 0),
    confidence: clamp01(Number(p.confidence) ?? 0),
    segmentation: p.segmentation || null,
    root: p.root || null,
    bodyScale: Number(p.bodyScale) || 0,
    facingEstimate: p.facingEstimate || null,
    qualityFlags: normalizeQualityFlags(p.qualityFlags),
  };
}

export const QUALITY_FLAGS = Object.freeze([
  'lowLight', 'motionBlur', 'partialBody', 'feetOutOfFrame',
  'headOutOfFrame', 'mirrored', 'occluded', 'crowded', 'ambiguousRole',
]);

function normalizeQualityFlags(f) {
  if (!Array.isArray(f)) return [];
  return f.filter((x) => QUALITY_FLAGS.includes(x));
}

// ------------------------------------------------------------
// PoseScene — Solarize §12
// ------------------------------------------------------------
export function makePoseScene(s = {}) {
  return {
    sceneId: String(s.sceneId || ''),
    revision: Number(s.revision) || 1,
    displayName: String(s.displayName || ''),
    category: String(s.category || ''),
    cameraIntent: s.cameraIntent || { view: 'front', framing: 'fullBody' },
    mirrorPolicy: s.mirrorPolicy || 'auto',
    targetPeople: Array.isArray(s.targetPeople) ? s.targetPeople.map(makeTargetPerson) : [],
    props: Array.isArray(s.props) ? s.props.map(makePropRecord) : [],
    contacts: Array.isArray(s.contacts) ? s.contacts.map(makeContactConstraint) : [],
    relationalConstraints: Array.isArray(s.relationalConstraints) ? s.relationalConstraints : [],
    framingConstraints: Array.isArray(s.framingConstraints) ? s.framingConstraints : [],
    temporalConstraints: Array.isArray(s.temporalConstraints) ? s.temporalConstraints : [],
    coachingRules: Array.isArray(s.coachingRules) ? s.coachingRules : [],
    sourceReferences: Array.isArray(s.sourceReferences) ? s.sourceReferences : [],
    validationStatus: s.validationStatus || { state: 'pending', reviewedBy: [], notes: '' },
  };
}

// ------------------------------------------------------------
// TargetPerson — Solarize §12
// ------------------------------------------------------------
export function makeTargetPerson(t = {}) {
  return {
    roleId: String(t.roleId || 'A'),
    roleName: String(t.roleName || 'Person A'),
    canonicalSkeleton: t.canonicalSkeleton || {},
    rootPosition: t.rootPosition || { x: 0.5, y: 0.5 },
    rootRotation: Number(t.rootRotation) || 0,
    scalePolicy: t.scalePolicy || 'normalize',
    requiredLandmarks: Array.isArray(t.requiredLandmarks) ? t.requiredLandmarks : [],
    optionalLandmarks: Array.isArray(t.optionalLandmarks) ? t.optionalLandmarks : [],
    perJointTolerance: t.perJointTolerance || {},
    poseConstraints: Array.isArray(t.poseConstraints) ? t.poseConstraints : [],
  };
}

// ------------------------------------------------------------
// ContactConstraint — Solarize §12
// ------------------------------------------------------------
export function makeContactConstraint(c = {}) {
  return {
    id: String(c.id || ''),
    participantA: String(c.participantA || ''),
    anchorA: String(c.anchorA || ''),
    participantB: String(c.participantB || ''),
    anchorB: String(c.anchorB || ''),
    relation: c.relation || 'touch',
    targetDistance: Number(c.targetDistance) || 0,
    tolerance: Number(c.tolerance) || 0.05,
    visibilityRequired: c.visibilityRequired !== false,
  };
}

// ------------------------------------------------------------
// PropRecord — Solarize §17
// ------------------------------------------------------------
export const PROP_TYPES = Object.freeze([
  'wall', 'floor', 'chair', 'stool', 'bench', 'table',
  'bed', 'couch', 'railing', 'doorframe', 'platform', 'userDefined',
]);

export function makePropRecord(p = {}) {
  return {
    propId: String(p.propId || ''),
    // Preserve the declared type so validatePropRecord can reject unknown
    // types. Coercion to 'userDefined' happens only at the persistence
    // boundary (migration), never silently inside the factory.
    type: p.type || 'userDefined',
    transform: p.transform || { x: 0.5, y: 0.8, rotation: 0 },
    dimensions: p.dimensions || { w: 0.3, h: 0.2 },
    contactSurfaces: Array.isArray(p.contactSurfaces) ? p.contactSurfaces : [],
    occlusionPolicy: p.occlusionPolicy || 'opaque',
    rendering: p.rendering || { color: '#8a8a8a', alpha: 0.6 },
    requiredOrOptional: p.requiredOrOptional === 'optional' ? 'optional' : 'required',
  };
}

// ------------------------------------------------------------
// AlignmentResult — Solarize §14
// ------------------------------------------------------------
export function makeAlignmentResult(r = {}) {
  return {
    eligible: !!r.eligible,
    overallScore: clamp01(Number(r.overallScore) || 0) * 100,
    confidence: clamp01(Number(r.confidence) || 0),
    perPersonScores: Array.isArray(r.perPersonScores) ? r.perPersonScores : [],
    relationalScore: clamp01(Number(r.relationalScore) ?? 0) * 100,
    propScore: clamp01(Number(r.propScore) ?? 0) * 100,
    stabilityScore: clamp01(Number(r.stabilityScore) ?? 0) * 100,
    excludedComponents: Array.isArray(r.excludedComponents) ? r.excludedComponents : [],
    blockingReasons: Array.isArray(r.blockingReasons) ? r.blockingReasons : [],
    topCorrections: Array.isArray(r.topCorrections) ? r.topCorrections : [],
    profile: r.profile || 'SIMULATION',
    inferredFromRealModel: !!r.inferredFromRealModel,
  };
}

// ------------------------------------------------------------
// Validators
// ------------------------------------------------------------
export function validateObservedPerson(p) {
  const errors = [];
  if (!p || typeof p !== 'object') return { ok: false, errors: ['not an object'] };
  if (p.landmarkSchema !== 'poseart-canonical-17') errors.push('landmarkSchema must be poseart-canonical-17');
  if (typeof p.timestamp !== 'number') errors.push('timestamp must be a number');
  if (!p.imageLandmarks) errors.push('imageLandmarks missing');
  else {
    for (const name of CANONICAL_LANDMARKS) {
      if (!p.imageLandmarks[name]) errors.push(`missing landmark ${name}`);
    }
  }
  if (p.trackId !== null && typeof p.trackId !== 'number' && typeof p.trackId !== 'string') {
    errors.push('trackId must be number|string|null');
  }
  return { ok: errors.length === 0, errors };
}

export function validatePoseScene(s) {
  const errors = [];
  if (!s || typeof s !== 'object') return { ok: false, errors: ['not an object'] };
  if (!s.sceneId) errors.push('sceneId required');
  if (!Array.isArray(s.targetPeople) || s.targetPeople.length === 0) errors.push('at least one TargetPerson required');
  if (s.targetPeople.length > 1) {
    const roleIds = s.targetPeople.map((t) => t.roleId);
    if (new Set(roleIds).size !== roleIds.length) errors.push('duplicate roleIds in targetPeople');
  }
  for (const c of s.contacts || []) {
    if (!c.participantA || !c.participantB) errors.push(`contact ${c.id || '(no id)'} missing participant`);
    if (!c.anchorA || !c.anchorB) errors.push(`contact ${c.id || '(no id)'} missing anchor`);
  }
  return { ok: errors.length === 0, errors };
}

export function validatePropRecord(p) {
  const errors = [];
  if (!p.propId) errors.push('propId required');
  if (!PROP_TYPES.includes(p.type)) errors.push(`invalid prop type ${p.type}`);
  return { ok: errors.length === 0, errors };
}

// ------------------------------------------------------------
// Math helpers (shared by scorer & tracker)
// ------------------------------------------------------------
export function clamp01(v) { return Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0)); }

export function angle3(a, b, c) {
  if (!a || !b || !c) return null;
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const cross = ab.x * cb.y - ab.y * cb.x;
  return Math.atan2(Math.abs(cross), dot) * (180 / Math.PI); // 0..180
}

export function computeCanonicalJointAngles(landmarks) {
  const out = {};
  for (const [joint, [a, v, c]] of Object.entries(CANONICAL_JOINT_ANGLES)) {
    const ang = angle3(landmarks[a], landmarks[v], landmarks[c]);
    if (ang !== null) out[joint] = ang;
  }
  return out;
}

// Normalized bone vectors (unit length, direction only) for scale-invariant compare.
export function computeCanonicalBones(landmarks) {
  const out = {};
  for (const [a, b] of CANONICAL_BONES) {
    const pa = landmarks[a], pb = landmarks[b];
    if (!pa || !pb) continue;
    const dx = pb.x - pa.x, dy = pb.y - pa.y;
    const len = Math.hypot(dx, dy) || 1;
    out[`${a}__${b}`] = { x: dx / len, y: dy / len, length: len };
  }
  return out;
}

// OKS-style distance. scale = torso length; kappa per-joint (COCO-derived).
export const OKS_KAPPA = Object.freeze({
  nose: 0.026, leftEye: 0.025, rightEye: 0.025, leftEar: 0.035, rightEar: 0.035,
  leftShoulder: 0.079, rightShoulder: 0.079, leftElbow: 0.072, rightElbow: 0.072,
  leftWrist: 0.062, rightWrist: 0.062, leftHip: 0.107, rightHip: 0.107,
  leftKnee: 0.087, rightKnee: 0.087, leftAnkle: 0.089, rightAnkle: 0.089,
});

export function torsoScale(landmarks) {
  const ls = landmarks.leftShoulder, rs = landmarks.rightShoulder;
  const lh = landmarks.leftHip, rh = landmarks.rightHip;
  if (!ls || !rs || !lh || !rh) return 1;
  const shoulderMid = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 };
  const hipMid = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2 };
  return Math.hypot(shoulderMid.x - hipMid.x, shoulderMid.y - hipMid.y) || 1;
}

export function computeRoot(lm) {
  const ls = lm.leftShoulder, rs = lm.rightShoulder, lh = lm.leftHip, rh = lm.rightHip;
  if (!ls || !rs || !lh || !rh) return null;
  return { x: (ls.x + rs.x + lh.x + rh.x) / 4, y: (ls.y + rs.y + lh.y + rh.y) / 4 };
}

export function computeBbox(lm) {
  const pts = Object.values(lm).filter((p) => (p.visibility || p.confidence) > 0.2);
  if (!pts.length) return null;
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  return { x: xMin, y: yMin, w: xMax - xMin, h: yMax - yMin };
}

export function meanLandmarkVisibility(lm) {
  let s = 0, n = 0;
  for (const name of CANONICAL_LANDMARKS) { s += (lm[name]?.visibility || lm[name]?.confidence || 0); n++; }
  return n ? s / n : 0;
}

export function oksDistance(observed, target, scale) {
  let sum = 0, count = 0;
  for (const name of CANONICAL_LANDMARKS) {
    const o = observed[name], t = target[name];
    if (!o || !t || (o.visibility || o.confidence) < 0.3) continue;
    const d2 = (o.x - t.x) ** 2 + (o.y - t.y) ** 2;
    const k = OKS_KAPPA[name] || 0.05;
    const denom = 2 * (scale || 1) * k;
    const e = Math.exp(-(d2) / (2 * denom * denom));
    sum += e; count++;
  }
  return count ? sum / count : 0;
}
