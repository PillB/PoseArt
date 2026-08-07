// ============================================================
// PoseArt Solarize — Ground-Truth Fixture Set (Solarize §22)
// ------------------------------------------------------------
// Deterministic, annotated frame fixtures for testing. Each fixture
// supplies a deterministic frame descriptor (consumable by the
// DeterministicPoseModel) PLUS expected annotations:
//   people, track IDs, keypoints, visibility, target role, contacts,
//   timestamps, eligibility, expected coaching result.
//
// Fixtures are NOT labelled through the model being tested (§22).
// They are hand-authored ground truth. Licensed: PoseArt MIT.
//
// Coverage (Solarize §22):
//   Single: neutral, raised-arms, seated, kneeling, reclining, profile,
//           partial-body, feet-out-of-frame, low-light, motion-blur,
//           mirrored, no-person
//   Two:    side-by-side, embrace, back-to-back, forehead-touch,
//           hand-hold, one-entering, one-leaving, crossing, overlap,
//           role-swap, temp-occlusion, similar-clothing, different-heights,
//           wrong-distance, missing-contact, extra-third-person
//   Props:  chair, wall, floor, bed/couch, railing, unsupported-fake-contact
// ============================================================

import { CANONICAL_LANDMARKS } from '../../js/solarize/canonical-schema.js';

// ---- Landmark helpers ----------------------------------------------------
function kp(x, y, score = 0.9) { return [x, y, score]; }

// A canonical neutral standing pose at root (cx, cy) with unit scale.
function standingLandmarks(cx, cy, opts = {}) {
  const u = opts.unit || 0.06;
  const arm = opts.armRaise || 0; // 0..1
  const elbowY = 0.40 - arm * 0.12;
  const wristY = 0.52 - arm * 0.30;
  const conf = opts.confidence ?? 0.9;
  const v = (x, y) => kp(x, y, conf);
  return {
    nose: v(cx, 0.12 + cy), leftEye: v(cx - 0.03, 0.10 + cy), rightEye: v(cx + 0.03, 0.10 + cy),
    leftEar: v(cx - 0.05, 0.11 + cy), rightEar: v(cx + 0.05, 0.11 + cy),
    leftShoulder: v(cx - u, 0.25 + cy), rightShoulder: v(cx + u, 0.25 + cy),
    leftElbow: v(cx - 2 * u, elbowY + cy), rightElbow: v(cx + 2 * u, elbowY + cy),
    leftWrist: v(cx - 2.5 * u, wristY + cy), rightWrist: v(cx + 2.5 * u, wristY + cy),
    leftHip: v(cx - 0.7 * u, 0.55 + cy), rightHip: v(cx + 0.7 * u, 0.55 + cy),
    leftKnee: v(cx - 0.7 * u, 0.75 + cy), rightKnee: v(cx + 0.7 * u, 0.75 + cy),
    leftAnkle: v(cx - 0.7 * u, 0.92 + cy), rightAnkle: v(cx + 0.7 * u, 0.92 + cy),
  };
}

// Convert a landmarks object to the MoveNet-style [x,y,score] array (COCO-17 order).
// Handles both {x,y,score} objects and [x,y,score] arrays.
function toKeypointArray(lm) {
  return CANONICAL_LANDMARKS.map((n) => {
    const p = lm[n];
    if (!p) return [0, 0, 0];
    if (Array.isArray(p)) return [p[0], p[1], p[2] ?? 0.9];
    return [p.x, p.y, p.score || 0.9];
  });
}

function frame(persons, opts = {}) {
  return {
    width: opts.width || 640,
    height: opts.height || 480,
    timestamp: opts.timestamp || 0,
    descriptor: {
      persons: persons.map((p) => ({ keypoints: toKeypointArray(p.landmarks), bbox: p.bbox || null })),
    },
    lighting: opts.lighting || 'normal',
    motion: opts.motion || 'static',
    mirrored: opts.mirrored || false,
    label: opts.label || 'fixture',
  };
}

// ============================================================
// SINGLE-PERSON FIXTURES (Solarize §22)
// ============================================================

export const SINGLE_PERSON_FIXTURES = {
  neutral: {
    id: 'sp-neutral',
    label: 'Single person · neutral standing',
    frame: () => frame([{ landmarks: standingLandmarks(0.5, 0) }], { label: 'neutral' }),
    expected: { personCount: 1, eligible: true, minScore: 0.3, coaching: 'none' },
  },
  raisedArms: {
    id: 'sp-raised-arms',
    label: 'Single person · raised arms',
    frame: () => frame([{ landmarks: standingLandmarks(0.5, 0, { armRaise: 1 }) }], { label: 'raised-arms' }),
    expected: { personCount: 1, eligible: true, minScore: 0.3 },
  },
  seated: {
    id: 'sp-seated',
    label: 'Single person · seated (hips low, knees up)',
    frame: () => {
      const lm = standingLandmarks(0.5, 0.1);
      lm.leftHip[1] = 0.7; lm.rightHip[1] = 0.7;
      lm.leftKnee[1] = 0.72; lm.rightKnee[1] = 0.72;
      lm.leftAnkle[1] = 0.6; lm.rightAnkle[1] = 0.6;
      return frame([{ landmarks: lm }], { label: 'seated' });
    },
    expected: { personCount: 1, eligible: true },
  },
  kneeling: {
    id: 'sp-kneeling',
    label: 'Single person · kneeling (hips low, ankles near knees)',
    frame: () => {
      const lm = standingLandmarks(0.5, 0.15);
      lm.leftHip[1] = 0.65; lm.rightHip[1] = 0.65;
      lm.leftKnee[1] = 0.8; lm.rightKnee[1] = 0.8;
      lm.leftAnkle[1] = 0.85; lm.rightAnkle[1] = 0.85;
      return frame([{ landmarks: lm }], { label: 'kneeling' });
    },
    expected: { personCount: 1, eligible: true },
  },
  reclining: {
    id: 'sp-reclining',
    label: 'Single person · reclining (horizontal)',
    frame: () => {
      const lm = standingLandmarks(0.5, 0);
      // Rotate the figure to horizontal: swap x/y contributions
      const u = 0.06;
      lm.nose = kp(0.2, 0.5); lm.leftShoulder = kp(0.28, 0.46); lm.rightShoulder = kp(0.28, 0.54);
      lm.leftHip = kp(0.55, 0.46); lm.rightHip = kp(0.55, 0.54);
      lm.leftKnee = kp(0.75, 0.46); lm.rightKnee = kp(0.75, 0.54);
      lm.leftAnkle = kp(0.9, 0.46); lm.rightAnkle = kp(0.9, 0.54);
      return frame([{ landmarks: lm }], { label: 'reclining' });
    },
    expected: { personCount: 1, eligible: true },
  },
  profile: {
    id: 'sp-profile',
    label: 'Single person · side profile (narrow shoulders)',
    frame: () => {
      const lm = standingLandmarks(0.5, 0);
      lm.leftShoulder[0] = 0.49; lm.rightShoulder[0] = 0.51; // narrow
      lm.leftHip[0] = 0.495; lm.rightHip[0] = 0.505;
      return frame([{ landmarks: lm }], { label: 'profile' });
    },
    expected: { personCount: 1, eligible: true },
  },
  partialBody: {
    id: 'sp-partial',
    label: 'Single person · partial body (lower half only, low visibility)',
    frame: () => {
      const lm = standingLandmarks(0.5, 0);
      lm.nose[2] = 0.1; lm.leftEye[2] = 0.1; lm.rightEye[2] = 0.1; lm.leftEar[2] = 0.1; lm.rightEar[2] = 0.1;
      lm.leftShoulder[2] = 0.15; lm.rightShoulder[2] = 0.15;
      return frame([{ landmarks: lm }], { label: 'partial-body' });
    },
    expected: { personCount: 1, eligible: false, blocking: 'low_visibility' },
  },
  feetOutOfFrame: {
    id: 'sp-feet-out',
    label: 'Single person · feet outside frame (ankles below 1.0)',
    frame: () => {
      const lm = standingLandmarks(0.5, 0);
      lm.leftAnkle[1] = 1.05; lm.rightAnkle[1] = 1.08;
      lm.leftAnkle[2] = 0.2; lm.rightAnkle[2] = 0.2;
      return frame([{ landmarks: lm }], { label: 'feet-out' });
    },
    expected: { personCount: 1, eligible: false, blocking: 'framing' },
  },
  lowLight: {
    id: 'sp-low-light',
    label: 'Single person · low light (uniformly low confidence)',
    frame: () => frame([{ landmarks: standingLandmarks(0.5, 0, { confidence: 0.35 }) }], { label: 'low-light', lighting: 'low' }),
    expected: { personCount: 1, eligible: false, blocking: 'low_visibility' },
  },
  motionBlur: {
    id: 'sp-motion-blur',
    label: 'Single person · motion blur (jittered keypoints)',
    frame: () => {
      const lm = standingLandmarks(0.5, 0, { confidence: 0.5 });
      // blur = keypoints displaced randomly but deterministically
      lm.leftWrist[0] += 0.08; lm.rightWrist[0] -= 0.08;
      lm.leftElbow[1] += 0.04; lm.rightElbow[1] += 0.04;
      return frame([{ landmarks: lm }], { label: 'motion-blur', motion: 'blur' });
    },
    expected: { personCount: 1, eligible: false },
  },
  mirrored: {
    id: 'sp-mirrored',
    label: 'Single person · mirrored (front camera)',
    frame: () => {
      const lm = standingLandmarks(0.5, 0);
      // mirror: swap left/right and flip x
      const m = {};
      for (const [k, v] of Object.entries(lm)) {
        const mk = k.replace(/^left/, '__L__').replace(/^right/, 'left').replace(/^__L__/, 'right');
        m[mk] = [1 - v[0], v[1], v[2]];
      }
      return frame([{ landmarks: m }], { label: 'mirrored', mirrored: true });
    },
    expected: { personCount: 1, eligible: true, mirrorRequired: true },
  },
  noPerson: {
    id: 'sp-no-person',
    label: 'No person (empty frame)',
    frame: () => frame([], { label: 'no-person' }),
    expected: { personCount: 0, eligible: false, blocking: 'missing_person' },
  },
};

// ============================================================
// TWO-PERSON FIXTURES (Solarize §22)
// ============================================================

export const TWO_PERSON_FIXTURES = {
  sideBySide: {
    id: 'tp-side-by-side',
    label: 'Two people · side by side',
    frame: () => frame([
      { landmarks: standingLandmarks(0.3, 0) },
      { landmarks: standingLandmarks(0.7, 0) },
    ], { label: 'side-by-side' }),
    expected: { personCount: 2, eligible: true, rolesResolved: true },
  },
  embrace: {
    id: 'tp-embrace',
    label: 'Two people · embrace (close, arms forward)',
    frame: () => frame([
      { landmarks: standingLandmarks(0.42, 0, { armRaise: 0.3 }) },
      { landmarks: standingLandmarks(0.58, 0, { armRaise: 0.3 }) },
    ], { label: 'embrace' }),
    expected: { personCount: 2, eligible: true, rolesResolved: true, contact: 'hand-to-hand' },
  },
  backToBack: {
    id: 'tp-back-to-back',
    label: 'Two people · back to back',
    frame: () => frame([
      { landmarks: standingLandmarks(0.4, 0) },
      { landmarks: standingLandmarks(0.6, 0) },
    ], { label: 'back-to-back' }),
    expected: { personCount: 2, eligible: true },
  },
  foreheadTouch: {
    id: 'tp-forehead-touch',
    label: 'Two people · forehead touch (heads close)',
    frame: () => frame([
      { landmarks: standingLandmarks(0.46, 0) },
      { landmarks: standingLandmarks(0.54, 0) },
    ], { label: 'forehead-touch' }),
    expected: { personCount: 2, contact: 'forehead-to-forehead' },
  },
  handHold: {
    id: 'tp-hand-hold',
    label: 'Two people · hand hold (wrists close)',
    frame: () => {
      const a = standingLandmarks(0.4, 0);
      const b = standingLandmarks(0.6, 0);
      a.rightWrist = kp(0.49, 0.52, 0.9);
      b.leftWrist = kp(0.51, 0.52, 0.9);
      return frame([{ landmarks: a }, { landmarks: b }], { label: 'hand-hold' });
    },
    expected: { personCount: 2, contact: 'hand-to-hand' },
  },
  oneEntering: {
    id: 'tp-one-entering',
    label: 'Two people · one entering (second partial at edge)',
    frame: () => frame([
      { landmarks: standingLandmarks(0.4, 0) },
      { landmarks: standingLandmarks(0.85, 0, { confidence: 0.4 }) },
    ], { label: 'one-entering' }),
    expected: { personCount: 2 },
  },
  oneLeaving: {
    id: 'tp-one-leaving',
    label: 'Two people · one leaving (second exiting frame)',
    frame: () => frame([
      { landmarks: standingLandmarks(0.4, 0) },
      { landmarks: standingLandmarks(0.92, 0, { confidence: 0.3 }) },
    ], { label: 'one-leaving' }),
    expected: { personCount: 2 },
  },
  crossing: {
    id: 'tp-crossing',
    label: 'Two people · crossing paths',
    frames: () => [
      frame([{ landmarks: standingLandmarks(0.3, 0) }, { landmarks: standingLandmarks(0.7, 0) }], { timestamp: 0, label: 'crossing-0' }),
      frame([{ landmarks: standingLandmarks(0.4, 0) }, { landmarks: standingLandmarks(0.6, 0) }], { timestamp: 33, label: 'crossing-1' }),
      frame([{ landmarks: standingLandmarks(0.5, 0) }, { landmarks: standingLandmarks(0.5, 0) }], { timestamp: 66, label: 'crossing-2' }),
      frame([{ landmarks: standingLandmarks(0.6, 0) }, { landmarks: standingLandmarks(0.4, 0) }], { timestamp: 99, label: 'crossing-3' }),
      frame([{ landmarks: standingLandmarks(0.7, 0) }, { landmarks: standingLandmarks(0.3, 0) }], { timestamp: 132, label: 'crossing-4' }),
    ],
    expected: { personCount: 2, idSwitches: 0 },
  },
  overlap: {
    id: 'tp-overlap',
    label: 'Two people · overlap (roots close)',
    frame: () => frame([
      { landmarks: standingLandmarks(0.47, 0) },
      { landmarks: standingLandmarks(0.53, 0) },
    ], { label: 'overlap' }),
    expected: { personCount: 2 },
  },
  roleSwap: {
    id: 'tp-role-swap',
    label: 'Two people · role swap across frames',
    frames: () => [
      frame([{ landmarks: standingLandmarks(0.3, 0) }, { landmarks: standingLandmarks(0.7, 0) }], { timestamp: 0, label: 'swap-0' }),
      frame([{ landmarks: standingLandmarks(0.7, 0) }, { landmarks: standingLandmarks(0.3, 0) }], { timestamp: 33, label: 'swap-1' }),
    ],
    expected: { personCount: 2, roleSwapDetected: true },
  },
  tempOcclusion: {
    id: 'tp-temp-occlusion',
    label: 'Two people · temporary occlusion (one vanishes then returns)',
    frames: () => [
      frame([{ landmarks: standingLandmarks(0.3, 0) }, { landmarks: standingLandmarks(0.7, 0) }], { timestamp: 0, label: 'occ-0' }),
      frame([{ landmarks: standingLandmarks(0.3, 0) }], { timestamp: 33, label: 'occ-1' }),
      frame([{ landmarks: standingLandmarks(0.3, 0) }], { timestamp: 66, label: 'occ-2' }),
      frame([{ landmarks: standingLandmarks(0.3, 0) }, { landmarks: standingLandmarks(0.7, 0) }], { timestamp: 99, label: 'occ-3' }),
    ],
    expected: { personCount: 2, trackRecovered: true },
  },
  similarClothing: {
    id: 'tp-similar-clothing',
    label: 'Two people · similar appearance (identical pose, distinct roots)',
    frame: () => frame([
      { landmarks: standingLandmarks(0.35, 0) },
      { landmarks: standingLandmarks(0.65, 0) },
    ], { label: 'similar-clothing' }),
    expected: { personCount: 2 },
  },
  differentHeights: {
    id: 'tp-different-heights',
    label: 'Two people · different body scales',
    frame: () => frame([
      { landmarks: standingLandmarks(0.35, 0, { unit: 0.05 }) },
      { landmarks: standingLandmarks(0.65, 0, { unit: 0.075 }) },
    ], { label: 'different-heights' }),
    expected: { personCount: 2 },
  },
  wrongDistance: {
    id: 'tp-wrong-distance',
    label: 'Two people · wrong partner distance (too far for contact)',
    frame: () => frame([
      { landmarks: standingLandmarks(0.2, 0) },
      { landmarks: standingLandmarks(0.8, 0) },
    ], { label: 'wrong-distance' }),
    expected: { personCount: 2, contactSatisfied: false },
  },
  missingContact: {
    id: 'tp-missing-contact',
    label: 'Two people · missing hand contact (wrists apart)',
    frame: () => {
      const a = standingLandmarks(0.4, 0);
      const b = standingLandmarks(0.6, 0);
      a.rightWrist = kp(0.35, 0.6, 0.9);
      b.leftWrist = kp(0.65, 0.6, 0.9);
      return frame([{ landmarks: a }, { landmarks: b }], { label: 'missing-contact' });
    },
    expected: { personCount: 2, contactSatisfied: false },
  },
  extraThirdPerson: {
    id: 'tp-extra-third',
    label: 'Three people · extra third person',
    frame: () => frame([
      { landmarks: standingLandmarks(0.25, 0) },
      { landmarks: standingLandmarks(0.5, 0) },
      { landmarks: standingLandmarks(0.75, 0) },
    ], { label: 'extra-third' }),
    expected: { personCount: 3, eligible: false, blocking: 'too_many_people' },
  },
};

// ============================================================
// PROP FIXTURES (Solarize §22)
// ============================================================

export const PROP_FIXTURES = {
  chair: {
    id: 'prop-chair',
    label: 'Prop · chair (person seated, hip on seat)',
    frame: () => frame([{ landmarks: standingLandmarks(0.5, 0.1, { confidence: 0.9 }) }], { label: 'chair' }),
    prop: { propId: 'chair1', type: 'chair', transform: { x: 0.5, y: 0.75, rotation: 0 }, dimensions: { w: 0.25, h: 0.2 } },
    contact: { id: 'seat', participantA: 'A', anchorA: 'leftHip', participantB: 'prop:chair1', anchorB: 'seat', relation: 'support', targetDistance: 0, tolerance: 0.08 },
    expected: { propContactSatisfied: true },
  },
  wall: {
    id: 'prop-wall',
    label: 'Prop · wall (person leaning, back to wall)',
    frame: () => frame([{ landmarks: standingLandmarks(0.8, 0) }], { label: 'wall' }),
    prop: { propId: 'wall1', type: 'wall', transform: { x: 0.9, y: 0.5, rotation: 0 }, dimensions: { w: 0.05, h: 1.0 } },
    contact: { id: 'back-wall', participantA: 'A', anchorA: 'rightShoulder', participantB: 'prop:wall1', anchorB: 'front-face', relation: 'touch', targetDistance: 0, tolerance: 0.1 },
    expected: { propContactSatisfied: true },
  },
  floor: {
    id: 'prop-floor',
    label: 'Prop · floor (person standing, feet on ground)',
    frame: () => frame([{ landmarks: standingLandmarks(0.5, 0) }], { label: 'floor' }),
    prop: { propId: 'floor1', type: 'floor', transform: { x: 0.5, y: 0.95, rotation: 0 }, dimensions: { w: 1.0, h: 0.05 } },
    contact: { id: 'feet-floor', participantA: 'A', anchorA: 'leftAnkle', participantB: 'prop:floor1', anchorB: 'ground-plane', relation: 'support', targetDistance: 0, tolerance: 0.1 },
    expected: { propContactSatisfied: true },
  },
  bed: {
    id: 'prop-bed',
    label: 'Prop · bed (person reclining on mattress)',
    frame: () => {
      const lm = standingLandmarks(0.5, 0);
      lm.nose = kp(0.2, 0.6); lm.leftShoulder = kp(0.28, 0.56); lm.rightShoulder = kp(0.28, 0.64);
      lm.leftHip = kp(0.55, 0.56); lm.rightHip = kp(0.55, 0.64);
      return frame([{ landmarks: lm }], { label: 'bed' });
    },
    prop: { propId: 'bed1', type: 'bed', transform: { x: 0.5, y: 0.65, rotation: 0 }, dimensions: { w: 0.7, h: 0.15 } },
    contact: { id: 'back-bed', participantA: 'A', anchorA: 'leftHip', participantB: 'prop:bed1', anchorB: 'mattress', relation: 'support', targetDistance: 0, tolerance: 0.12 },
    expected: { propContactSatisfied: true },
  },
  railing: {
    id: 'prop-railing',
    label: 'Prop · railing (hand on rail)',
    frame: () => {
      const a = standingLandmarks(0.5, 0);
      a.leftWrist = kp(0.5, 0.55, 0.9);
      return frame([{ landmarks: a }], { label: 'railing' });
    },
    prop: { propId: 'rail1', type: 'railing', transform: { x: 0.5, y: 0.55, rotation: 0 }, dimensions: { w: 0.4, h: 0.03 } },
    contact: { id: 'hand-rail', participantA: 'A', anchorA: 'leftWrist', participantB: 'prop:rail1', anchorB: 'top-rail', relation: 'touch', targetDistance: 0, tolerance: 0.06 },
    expected: { propContactSatisfied: true },
  },
  unsupportedFakeContact: {
    id: 'prop-unsupported',
    label: 'Prop · unsupported fake contact (no prop in scene)',
    frame: () => frame([{ landmarks: standingLandmarks(0.5, 0) }], { label: 'unsupported' }),
    prop: null,
    contact: { id: 'fake', participantA: 'A', anchorA: 'leftWrist', participantB: 'prop:missing', anchorB: 'surface', relation: 'touch', targetDistance: 0, tolerance: 0.05 },
    expected: { propContactSatisfied: false, reason: 'missing_prop' },
  },
};

// ============================================================
// Fixture registry + helpers
// ============================================================

export const ALL_FIXTURES = Object.freeze({
  single: SINGLE_PERSON_FIXTURES,
  two: TWO_PERSON_FIXTURES,
  props: PROP_FIXTURES,
});

export function getFixture(category, id) {
  return ALL_FIXTURES[category]?.[id] || null;
}

export function listFixtures() {
  const out = [];
  for (const [cat, fixtures] of Object.entries(ALL_FIXTURES)) {
    for (const [id, f] of Object.entries(fixtures)) {
      out.push({ category: cat, id, label: f.label, hasSequence: !!f.frames });
    }
  }
  return out;
}

// Total fixture count (for the §22 coverage test).
export function fixtureCount() {
  let n = 0;
  for (const cat of Object.values(ALL_FIXTURES)) n += Object.keys(cat).length;
  return n;
}
