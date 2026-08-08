// ============================================================
// PoseArt Solarize — Bone-Length Constraint + Confidence Gate
// ------------------------------------------------------------
// Robust post-processing on detected keypoints:
//   1. BoneLengthConstraint: enforce stable bone lengths across frames
//      (prevents limb stretching on misdetected joints). Used by
//      DeepMotion + Radical for occlusion recovery.
//   2. ConfidenceGate: interpolate low-confidence joints from neighbours.
//      Standard practice in all SOTA pipelines (MoveNet, MediaPipe, RTMPose).
//   3. FlipDisambiguator: evaluate flipped + non-flipped, pick higher score.
//      Standard in COCO training + used by PoseMy.Art.
// ============================================================

import { CANONICAL_BONES } from './canonical-schema.js';

// ---- BoneLengthConstraint ------------------------------------------------
export class BoneLengthConstraint {
  constructor(opts = {}) {
    this.tolerance = opts.tolerance || 0.25; // 25% deviation allowed
    this.windowSize = opts.windowSize || 10;
    this._boneLengths = {}; // boneKey → [lengths]
  }

  reset() { this._boneLengths = {}; }

  // Enforce that bone lengths stay stable across frames.
  constrain(landmarks) {
    if (!landmarks) return landmarks;
    const out = { ...landmarks };
    for (const [a, b] of CANONICAL_BONES) {
      const pa = out[a], pb = out[b];
      if (!pa || !pb) continue;
      const key = `${a}__${b}`;
      const currentLen = Math.hypot(pa.x - pb.x, pa.y - pb.y);
      if (currentLen < 1e-6) continue;

      // Build a running median of bone lengths
      if (!this._boneLengths[key]) this._boneLengths[key] = [];
      const history = this._boneLengths[key];
      history.push(currentLen);
      if (history.length > this.windowSize) history.shift();

      if (history.length >= 3) {
        const median = this._median(history);
        const lo = median * (1 - this.tolerance);
        const hi = median * (1 + this.tolerance);
        // If current bone is way off, scale it back to the median length
        if (currentLen < lo || currentLen > hi) {
          const scale = median / currentLen;
          const dx = (pb.x - pa.x) * scale;
          const dy = (pb.y - pa.y) * scale;
          out[b] = { ...pb, x: pa.x + dx, y: pa.y + dy };
          // Update the length history with the corrected value
          history[history.length - 1] = median;
        }
      }
    }
    return out;
  }

  _median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
}

// ---- ConfidenceGate ------------------------------------------------------
// Interpolate low-confidence joints from their neighbours.
export class ConfidenceGate {
  constructor(opts = {}) {
    this.threshold = opts.threshold || 0.3;
  }

  // For each low-confidence joint, interpolate from the two adjacent
  // high-confidence joints on the same bone chain.
  gate(landmarks) {
    if (!landmarks) return landmarks;
    const out = { ...landmarks };

    // Bone chains for interpolation: [parent, child, grandchild]
    const chains = [
      ['leftShoulder', 'leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow', 'rightWrist'],
      ['leftHip', 'leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee', 'rightAnkle'],
      ['leftShoulder', 'leftHip', 'leftKnee'],
      ['rightShoulder', 'rightHip', 'rightKnee'],
    ];

    for (const [a, b, c] of chains) {
      const pa = out[a], pb = out[b], pc = out[c];
      if (!pa || !pb || !pc) continue;
      const confB = pb.visibility ?? pb.confidence ?? 0;
      if (confB < this.threshold) {
        // Interpolate b as the midpoint of a→c
        out[b] = { ...pb, x: (pa.x + pc.x) / 2, y: (pa.y + pc.y) / 2, interpolated: true };
      }
      const confC = pc.visibility ?? pc.confidence ?? 0;
      if (confC < this.threshold && pb) {
        // Extrapolate c from a→b direction
        const dx = pb.x - pa.x, dy = pb.y - pa.y;
        out[c] = { ...pc, x: pb.x + dx, y: pb.y + dy, interpolated: true };
      }
    }
    return out;
  }
}

// ---- FlipDisambiguator ---------------------------------------------------
// Evaluate flipped + non-flipped pose, pick the one with better target match.
export class FlipDisambiguator {
  // Returns true if the flipped pose scores better against the target.
  shouldFlip(observed, targetLandmarks) {
    if (!observed || !targetLandmarks) return false;
    const scoreNormal = this._symmetryScore(observed, targetLandmarks);
    const flipped = this._flipLandmarks(observed);
    const scoreFlipped = this._symmetryScore(flipped, targetLandmarks);
    return scoreFlipped > scoreNormal;
  }

  _flipLandmarks(lm) {
    const out = {};
    for (const [name, p] of Object.entries(lm)) {
      const flipped = name.replace(/^left/, '__L__').replace(/^right/, 'left').replace(/^__L__/, 'right');
      out[flipped] = { ...p, x: 1 - p.x };
    }
    return out;
  }

  _symmetryScore(observed, target) {
    let sum = 0, count = 0;
    for (const name of Object.keys(target)) {
      const o = observed[name], t = target[name];
      if (!o || !t) continue;
      const d = Math.hypot(o.x - t.x, o.y - t.y);
      sum += Math.exp(-d * 5);
      count++;
    }
    return count ? sum / count : 0;
  }
}
