// ============================================================
// PoseArt Solarize — Detector Result Adapters (Solarize §9, §10)
// ------------------------------------------------------------
// Pure functions that map NATIVE detector output (MoveNet,
// MediaPipe Pose Landmarker, RTMPose/RTMO/RTMW via ONNX) INTO
// the canonical ObservedPerson schema. Targets and observations
// are never compared in native coordinates.
//
// Each adapter is independently unit-tested with synthetic native
// payloads covering: left/right, camera mirroring, landscape
// rotation, front/rear cameras, normalized vs pixel coords,
// missing landmarks, and different landmark sets.
// ============================================================

import {
  CANONICAL_LANDMARKS, makeObservedPerson, torsoScale, clamp01,
  computeRoot, computeBbox, meanLandmarkVisibility,
} from './canonical-schema.js';

// Re-export for adapter-API consumers (and tests).
export { computeRoot, computeBbox };

// MoveNet 17-keypoint index → canonical name (MoveNet SinglePose & MultiPose share this order).
export const MOVENET_INDEX = [
  'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar',
  'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
  'leftWrist', 'rightWrist', 'leftHip', 'rightHip',
  'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle',
];

// MediaPipe Pose 33 → canonical 17 index map.
export const MEDIAPIPE_TO_CANONICAL = {
  0: 'nose', 2: 'leftEye', 5: 'rightEye', 7: 'leftEar', 8: 'rightEar',
  11: 'leftShoulder', 12: 'rightShoulder', 13: 'leftElbow', 14: 'rightElbow',
  15: 'leftWrist', 16: 'rightWrist', 23: 'leftHip', 24: 'rightHip',
  25: 'leftKnee', 26: 'rightKnee', 27: 'leftAnkle', 28: 'rightAnkle',
};

function toNorm(v, dim, normalized) {
  return normalized ? v : (dim ? v / dim : v);
}

// ---- MoveNet adapter -------------------------------------------------------
// payload shape: { keypoints: [[x,y,score]...17], width, height, normalized, bbox }
// MoveNet outputs normalized [0,1] coords by default when run on a tensor.
export function adaptMoveNet(payload, opts = {}) {
  const { keypoints = [], width = 1, height = 1, normalized = true, bbox = null } = payload || {};
  const lm = {};
  for (let i = 0; i < MOVENET_INDEX.length; i++) {
    const name = MOVENET_INDEX[i];
    const kp = keypoints[i];
    if (!kp) { lm[name] = { x: 0, y: 0, z: null, visibility: 0, confidence: 0 }; continue; }
    const x = toNorm(kp[0], width, normalized);
    const y = toNorm(kp[1], height, normalized);
    const score = clamp01(kp[2] ?? 0);
    lm[name] = { x, y, z: null, visibility: score, confidence: score };
  }
  return finalizePerson(lm, opts, bbox, payload);
}

// ---- MoveNet MultiPose adapter -------------------------------------------
// payload: { persons: [ { keypoints, bbox } ], width, height, normalized }
export function adaptMoveNetMultiPose(payload, opts = {}) {
  const persons = (payload && Array.isArray(payload.persons)) ? payload.persons : [];
  return persons.map((p, i) => adaptMoveNet(
    { keypoints: p.keypoints, width: payload.width, height: payload.height, normalized: payload.normalized, bbox: p.bbox },
    { ...opts, trackHint: i },
  ));
}

// ---- MediaPipe Pose Landmarker adapter -----------------------------------
// payload: { landmarks: [{x,y,z,visibility}...33], worldLandmarks?, bbox? }
// MediaPipe coords are already normalized [0,1] with origin top-left.
export function adaptMediaPipePose(payload, opts = {}) {
  const lms = (payload && payload.landmarks) || [];
  const lm = {};
  for (const name of CANONICAL_LANDMARKS) lm[name] = { x: 0, y: 0, z: null, visibility: 0, confidence: 0 };
  for (const [idx, name] of Object.entries(MEDIAPIPE_TO_CANONICAL)) {
    const p = lms[idx];
    if (!p) continue;
    lm[name] = {
      x: clamp01(p.x), y: clamp01(p.y), z: p.z != null ? p.z : null,
      visibility: clamp01(p.visibility ?? 0), confidence: clamp01(p.visibility ?? 0),
    };
  }
  return finalizePerson(lm, opts, payload && payload.bbox, payload);
}

// ---- Generic ONNX adapter (RTMPose/RTMO/RTMW research track) -------------
// payload: { keypoints: [[x,y,score]...], keypointNames?: string[], width, height, normalized, bbox }
// If keypointNames provided, map by name; else assume COCO-17 order.
export function adaptOnnxCoco(payload, opts = {}) {
  const { keypoints = [], keypointNames, width = 1, height = 1, normalized = true, bbox = null } = payload || {};
  const lm = {};
  for (const name of CANONICAL_LANDMARKS) lm[name] = { x: 0, y: 0, z: null, visibility: 0, confidence: 0 };
  for (let i = 0; i < keypoints.length; i++) {
    const name = keypointNames ? keypointNames[i] : MOVENET_INDEX[i];
    if (!name || !CANONICAL_LANDMARKS.includes(name)) continue;
    const kp = keypoints[i];
    lm[name] = {
      x: toNorm(kp[0], width, normalized), y: toNorm(kp[1], height, normalized),
      z: kp[2] != null && typeof kp[2] === 'number' && keypointNames ? null : null,
      visibility: clamp01(kp[2] ?? 0), confidence: clamp01(kp[2] ?? 0),
    };
  }
  return finalizePerson(lm, opts, bbox, payload);
}

// ---- Finalize: apply mirror/rotation, compute root/scale/quality --------
function finalizePerson(lm, opts, bbox, payload) {
  let out = lm;
  if (opts.mirror) out = mirrorLandmarks(out);
  if (opts.rotation) out = rotateLandmarks(out, opts.rotation);

  const root = computeRoot(out);
  const bodyScale = torsoScale(out);
  const visibility = meanVisibility(out);
  const confidence = meanConfidence(out);
  const qualityFlags = detectQualityFlags(out, opts);

  return makeObservedPerson({
    trackId: opts.trackHint ?? null,
    timestamp: opts.timestamp || (payload && payload.timestamp) || 0,
    bbox: bbox || computeBbox(out),
    imageLandmarks: out,
    visibility, confidence, root, bodyScale,
    facingEstimate: estimateFacing(out),
    qualityFlags,
  });
}

export function mirrorLandmarks(lm) {
  const out = {};
  for (const [name, p] of Object.entries(lm)) {
    const mirrored = name.replace(/^left/, '__L__').replace(/^right/, 'left').replace(/^__L__/, 'right');
    out[mirrored] = { ...p, x: 1 - p.x };
  }
  return out;
}

export function rotateLandmarks(lm, deg) {
  if (!deg) return lm;
  const r = (deg * Math.PI) / 180;
  const cos = Math.cos(r), sin = Math.sin(r);
  const out = {};
  for (const [name, p] of Object.entries(lm)) {
    // rotate around center (0.5,0.5); used for landscape rotation correction
    const dx = p.x - 0.5, dy = p.y - 0.5;
    out[name] = { ...p, x: 0.5 + dx * cos - dy * sin, y: 0.5 + dx * sin + dy * cos };
  }
  return out;
}



function meanVisibility(lm) {
  const vals = CANONICAL_LANDMARKS.map((n) => lm[n]?.visibility || 0);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
function meanConfidence(lm) {
  const vals = CANONICAL_LANDMARKS.map((n) => lm[n]?.confidence || 0);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function detectQualityFlags(lm, opts) {
  const flags = [];
  const ankleV = Math.min(lm.leftAnkle?.visibility || 0, lm.rightAnkle?.visibility || 0);
  const noseV = lm.nose?.visibility || 0;
  if (ankleV < 0.2 && noseV > 0.4) flags.push('feetOutOfFrame');
  if (noseV < 0.2 && ankleV > 0.4) flags.push('headOutOfFrame');
  const meanV = meanVisibility(lm);
  if (meanV < 0.35) flags.push('partialBody');
  if (opts && opts.mirror) flags.push('mirrored');
  return flags;
}

// Crude facing estimate from shoulder-vs-hip lateral offset & ear visibility.
export function estimateFacing(lm) {
  const ls = lm.leftShoulder, rs = lm.rightShoulder;
  if (!ls || !rs) return null;
  const shoulderWidth = Math.abs(ls.x - rs.x) || 1;
  const le = lm.leftEar?.visibility || 0, re = lm.rightEar?.visibility || 0;
  // If both ears visible and shoulders wide → facing camera (~0°).
  // If one ear much more visible → side profile.
  const yawGuess = Math.round((1 - Math.min(le, re) / Math.max(le, re || 0.001)) * 80);
  return { yaw: Math.min(90, Math.max(0, yawGuess)), pitch: 0 };
}

// ---- Aggregate scene adapter (one frame → array of ObservedPerson) -------
export function adaptDetectionFrame(detection, opts = {}) {
  if (!detection) return [];
  if (detection.model === 'movenet-multipose') return adaptMoveNetMultiPose(detection, opts);
  if (detection.model === 'mediapipe-pose') return [adaptMediaPipePose(detection, opts)];
  if (detection.model === 'movenet-singlepose') return [adaptMoveNet(detection, opts)];
  if (detection.model === 'onnx-coco') return [adaptOnnxCoco(detection, opts)];
  if (Array.isArray(detection.persons)) return detection.persons.map((p) => adaptMoveNet(p, opts));
  return [];
}
