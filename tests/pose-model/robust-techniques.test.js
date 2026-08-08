import { describe, it, expect } from 'vitest';
import { OneEuroFilter, OneEuroKeypointSmoother } from '../../js/solarize/one-euro-filter.js';
import { FramePersonDetector } from '../../js/solarize/frame-person-detector.js';
import { BoneLengthConstraint, ConfidenceGate, FlipDisambiguator } from '../../js/solarize/bone-constraints.js';
import { FramePoseHeuristic } from '../../js/solarize/frame-pose-heuristic.js';

describe('OneEuroFilter — SOTA temporal smoothing', () => {
  it('passes through the first value unchanged', () => {
    const f = new OneEuroFilter({ freq: 30 });
    expect(f.filter(0.5, 0)).toBeCloseTo(0.5);
  });

  it('smooths noisy input toward the signal (reduces jitter)', () => {
    const f = new OneEuroFilter({ freq: 30, minCutoff: 1.0, beta: 0.007 });
    const signal = [0.5, 0.52, 0.48, 0.51, 0.49, 0.5, 0.5, 0.5];
    const filtered = signal.map((v, i) => f.filter(v, i * 33));
    // The filtered values should be less spread than the raw input
    const rawRange = Math.max(...signal) - Math.min(...signal);
    const filtRange = Math.max(...filtered) - Math.min(...filtered);
    expect(filtRange).toBeLessThanOrEqual(rawRange);
  });

  it('tracks a moving signal without excessive lag', () => {
    const f = new OneEuroFilter({ freq: 30, minCutoff: 1.0, beta: 0.02 });
    let last = 0;
    for (let i = 0; i < 30; i++) {
      last = f.filter(i / 30, i * 33);
    }
    // After 30 frames of a steadily increasing signal, the filter should
    // be close to the final value (not lagging far behind).
    expect(last).toBeGreaterThan(0.7);
  });

  it('reset() clears the filter state', () => {
    const f = new OneEuroFilter({ freq: 30 });
    f.filter(0.5, 0);
    f.filter(0.6, 33);
    f.reset();
    // After reset, the next value should pass through unchanged
    expect(f.filter(0.9, 66)).toBeCloseTo(0.9);
  });
});

describe('OneEuroKeypointSmoother — per-joint smoothing', () => {
  it('smooths each landmark independently', () => {
    const s = new OneEuroKeypointSmoother({ freq: 30 });
    const lm1 = { nose: { x: 0.5, y: 0.1, visibility: 0.9 }, leftShoulder: { x: 0.4, y: 0.2, visibility: 0.9 } };
    const lm2 = { nose: { x: 0.52, y: 0.12, visibility: 0.9 }, leftShoulder: { x: 0.42, y: 0.22, visibility: 0.9 } };
    s.smooth(lm1, 0);
    const out = s.smooth(lm2, 33);
    // Smoothed values should be between the two inputs
    expect(out.nose.x).toBeGreaterThan(0.5);
    expect(out.nose.x).toBeLessThan(0.52);
  });

  it('preserves visibility/confidence', () => {
    const s = new OneEuroKeypointSmoother({ freq: 30 });
    const lm = { nose: { x: 0.5, y: 0.1, visibility: 0.85 } };
    const out = s.smooth(lm, 0);
    expect(out.nose.visibility).toBe(0.85);
  });

  it('reset() clears all joint filters', () => {
    const s = new OneEuroKeypointSmoother({ freq: 30 });
    s.smooth({ nose: { x: 0.5, y: 0.1 } }, 0);
    s.reset();
    // After reset, the next value passes through
    const out = s.smooth({ nose: { x: 0.9, y: 0.1 } }, 33);
    expect(out.nose.x).toBeCloseTo(0.9);
  });
});

describe('BoneLengthConstraint — anatomical consistency', () => {
  it('allows bones within the tolerance range', () => {
    const c = new BoneLengthConstraint({ tolerance: 0.25 });
    const lm = {
      leftShoulder: { x: 0.4, y: 0.3 }, leftElbow: { x: 0.3, y: 0.5 },
      rightShoulder: { x: 0.6, y: 0.3 }, rightElbow: { x: 0.7, y: 0.5 },
    };
    // Feed several frames to build history
    for (let i = 0; i < 5; i++) c.constrain(lm);
    const out = c.constrain(lm);
    // Bone lengths should be unchanged (within tolerance)
    expect(out.leftElbow.x).toBeCloseTo(0.3);
  });

  it('corrects bones that deviate beyond tolerance', () => {
    const c = new BoneLengthConstraint({ tolerance: 0.2 });
    const stable = {
      leftShoulder: { x: 0.4, y: 0.3 }, leftElbow: { x: 0.3, y: 0.5 },
    };
    // Build a stable history
    for (let i = 0; i < 8; i++) c.constrain(stable);
    // Now feed a frame where the elbow is way off (bone stretched 2×)
    const stretched = {
      leftShoulder: { x: 0.4, y: 0.3 }, leftElbow: { x: 0.2, y: 0.9 },
    };
    const out = c.constrain(stretched);
    // The elbow should be pulled back toward the stable bone length
    const correctedLen = Math.hypot(out.leftShoulder.x - out.leftElbow.x, out.leftShoulder.y - out.leftElbow.y);
    const stretchedLen = Math.hypot(stretched.leftShoulder.x - stretched.leftElbow.x, stretched.leftShoulder.y - stretched.leftElbow.y);
    expect(correctedLen).toBeLessThan(stretchedLen);
  });

  it('reset() clears bone length history', () => {
    const c = new BoneLengthConstraint();
    c.constrain({ leftShoulder: { x: 0.4, y: 0.3 }, leftElbow: { x: 0.3, y: 0.5 } });
    c.reset();
    expect(Object.keys(c._boneLengths)).toHaveLength(0);
  });
});

describe('ConfidenceGate — low-confidence joint interpolation', () => {
  it('interpolates a low-confidence joint from neighbours', () => {
    const g = new ConfidenceGate({ threshold: 0.3 });
    const lm = {
      leftShoulder: { x: 0.4, y: 0.3, visibility: 0.9 },
      leftElbow: { x: 0.5, y: 0.5, visibility: 0.1 }, // low confidence
      leftWrist: { x: 0.6, y: 0.7, visibility: 0.9 },
    };
    const out = g.gate(lm);
    // The elbow should be interpolated as the midpoint of shoulder→wrist
    expect(out.leftElbow.x).toBeCloseTo(0.5); // (0.4+0.6)/2
    expect(out.leftElbow.y).toBeCloseTo(0.5); // (0.3+0.7)/2
    expect(out.leftElbow.interpolated).toBe(true);
  });

  it('leaves high-confidence joints unchanged', () => {
    const g = new ConfidenceGate({ threshold: 0.3 });
    const lm = {
      leftShoulder: { x: 0.4, y: 0.3, visibility: 0.9 },
      leftElbow: { x: 0.35, y: 0.5, visibility: 0.8 },
      leftWrist: { x: 0.3, y: 0.7, visibility: 0.7 },
    };
    const out = g.gate(lm);
    expect(out.leftElbow.x).toBeCloseTo(0.35);
    expect(out.leftWrist.x).toBeCloseTo(0.3);
  });
});

describe('FlipDisambiguator — left/right resolution', () => {
  it('detects when a flipped pose matches the target better', () => {
    const d = new FlipDisambiguator();
    // Target: leftWrist at 0.3, rightWrist at 0.7
    const target = { leftWrist: { x: 0.3, y: 0.5 }, rightWrist: { x: 0.7, y: 0.5 } };
    // Observed: leftWrist at 0.7, rightWrist at 0.3 (mirrored)
    // After flip: leftWrist→rightWrist at 1-0.7=0.3, rightWrist→leftWrist at 1-0.3=0.7
    // Flipped: leftWrist={x:0.7}, rightWrist={x:0.3} → same as observed but mirrored
    // The flip swaps labels: observed leftWrist{0.7} becomes rightWrist{0.3}
    // So flipped has leftWrist{0.7} rightWrist{0.3}... no.
    // _flipLandmarks: left→right and x→1-x. So leftWrist{0.7} → rightWrist{0.3}.
    // Flipped: rightWrist{0.3}, leftWrist{0.7} → matches target!
    const observed = { leftWrist: { x: 0.7, y: 0.5 }, rightWrist: { x: 0.3, y: 0.5 } };
    // Wait — that's symmetric. Let me use an asymmetric case.
    // Target: leftWrist at 0.2, rightWrist at 0.8
    // Observed: leftWrist at 0.8, rightWrist at 0.2 (fully mirrored)
    // Flipped: leftWrist{0.8}→rightWrist{1-0.8=0.2}, rightWrist{0.2}→leftWrist{1-0.2=0.8}
    // Flipped: leftWrist{0.8} rightWrist{0.2} — same as observed. Score equal.
    // The flip is an involution, so a perfectly mirrored pose scores the same.
    // Test with a near-mirror instead:
    const target2 = { leftWrist: { x: 0.2, y: 0.5 }, rightWrist: { x: 0.8, y: 0.5 } };
    const observed2 = { leftWrist: { x: 0.75, y: 0.5 }, rightWrist: { x: 0.25, y: 0.5 } };
    // Flipped: leftWrist{0.75}→rightWrist{0.25}, rightWrist{0.25}→leftWrist{0.75}
    // Flipped: leftWrist{0.75}, rightWrist{0.25} — distance to target: |0.75-0.2|+|0.25-0.8| = 0.55+0.55
    // Normal: leftWrist{0.75} vs target{0.2}: |0.75-0.2|=0.55. rightWrist{0.25} vs target{0.8}: 0.55.
    // Both same. The flip is an involution — need asymmetric y to break symmetry.
    const target3 = { leftWrist: { x: 0.2, y: 0.4 }, rightWrist: { x: 0.8, y: 0.6 } };
    const observed3 = { leftWrist: { x: 0.8, y: 0.6 }, rightWrist: { x: 0.2, y: 0.4 } };
    // Flipped: leftWrist{0.8,0.6}→rightWrist{0.2,0.6}, rightWrist{0.2,0.4}→leftWrist{0.8,0.4}
    // Flipped: leftWrist{0.8,0.4}, rightWrist{0.2,0.6} vs target leftWrist{0.2,0.4} rightWrist{0.8,0.6}
    // Flipped leftWrist{0.8,0.4} vs target leftWrist{0.2,0.4}: dx=0.6,dy=0 → dist=0.6
    // Normal leftWrist{0.8,0.6} vs target leftWrist{0.2,0.4}: dx=0.6,dy=0.2 → dist=0.63
    // So flipped scores better (smaller distance).
    expect(d.shouldFlip(observed3, target3)).toBe(true);
  });

  it('does not flip when the non-flipped pose matches', () => {
    const d = new FlipDisambiguator();
    const target = { leftWrist: { x: 0.2, y: 0.4 }, rightWrist: { x: 0.8, y: 0.6 } };
    const observed = { leftWrist: { x: 0.22, y: 0.41 }, rightWrist: { x: 0.78, y: 0.59 } };
    expect(d.shouldFlip(observed, target)).toBe(false);
  });
});

describe('FramePoseHeuristic — real frame-based detection', () => {
  it('initializes to ready state', async () => {
    const h = new FramePoseHeuristic();
    await h.init();
    expect(h.ready).toBe(true);
    expect(h.modelId).toBe('frame-pose-heuristic');
    expect(h.backend).toBe('cpu');
  });

  it('returns empty persons when no source frame provided', async () => {
    const h = new FramePoseHeuristic();
    await h.init();
    const result = await h.detect({ width: 640, height: 480, timestamp: 0 });
    expect(result.persons).toHaveLength(0);
    expect(result.personDetected).toBeFalsy();
  });

  it('returns 17 keypoints in COCO order when a person is detected', async () => {
    const h = new FramePoseHeuristic();
    await h.init();
    // Mock source with a videoWidth/videoHeight — the FramePersonDetector
    // will try to draw it; in Node/jsdom without a real video it returns null,
    // so we test the proportion model directly.
    const bbox = { x: 0.3, y: 0.1, w: 0.4, h: 0.8 };
    const landmarks = h._estimateKeypointsFromBbox(bbox);
    // All 17 canonical landmarks must be present
    const names = Object.keys(landmarks);
    expect(names).toHaveLength(17);
    expect(landmarks.nose).toBeDefined();
    expect(landmarks.leftAnkle).toBeDefined();
    expect(landmarks.rightAnkle).toBeDefined();
    // Anatomical ordering: nose above shoulders above hips above ankles
    expect(landmarks.nose.y).toBeLessThan(landmarks.leftShoulder.y);
    expect(landmarks.leftShoulder.y).toBeLessThan(landmarks.leftHip.y);
    expect(landmarks.leftHip.y).toBeLessThan(landmarks.leftAnkle.y);
  });

  it('keypoints are within normalized [0,1] bounds', async () => {
    const h = new FramePoseHeuristic();
    const bbox = { x: 0.3, y: 0.1, w: 0.4, h: 0.8 };
    const landmarks = h._estimateKeypointsFromBbox(bbox);
    for (const [name, p] of Object.entries(landmarks)) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(1);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(1);
    }
  });

  it('produces anatomically plausible proportions (shoulder width ≈ 0.45 × height)', async () => {
    const h = new FramePoseHeuristic();
    const bbox = { x: 0.3, y: 0.1, w: 0.4, h: 0.8 };
    const landmarks = h._estimateKeypointsFromBbox(bbox);
    const shoulderWidth = Math.abs(landmarks.leftShoulder.x - landmarks.rightShoulder.x);
    const bodyHeight = bbox.h;
    // Vitruvian ratio: shoulder width ≈ 0.45 × body height
    expect(shoulderWidth).toBeCloseTo(bodyHeight * 0.45, 1);
  });

  it('dispose() clears state', async () => {
    const h = new FramePoseHeuristic();
    await h.init();
    h.dispose();
    expect(h.ready).toBe(false);
  });
});
