import { describe, it, expect } from 'vitest';
import {
  adaptMoveNet, adaptMoveNetMultiPose, adaptMediaPipePose, adaptOnnxCoco,
  adaptDetectionFrame, mirrorLandmarks, rotateLandmarks, computeBbox, MOVENET_INDEX,
} from '../../js/solarize/detector-adapters.js';
import { validateObservedPerson } from '../../js/solarize/canonical-schema.js';

// Helper: a synthetic MoveNet-style 17-keypoint payload (normalized [0,1]).
function movenetPayload(opts = {}) {
  const kp = MOVENET_INDEX.map((name, i) => {
    const base = {
      nose: [0.5, 0.1], leftEye: [0.47, 0.08], rightEye: [0.53, 0.08],
      leftEar: [0.44, 0.1], rightEar: [0.56, 0.1],
      leftShoulder: [0.42, 0.25], rightShoulder: [0.58, 0.25],
      leftElbow: [0.38, 0.4], rightElbow: [0.62, 0.4],
      leftWrist: [0.36, 0.52], rightWrist: [0.64, 0.52],
      leftHip: [0.44, 0.55], rightHip: [0.56, 0.55],
      leftKnee: [0.43, 0.75], rightKnee: [0.57, 0.75],
      leftAnkle: [0.42, 0.92], rightAnkle: [0.58, 0.92],
    }[name];
    return [...base, opts.score ?? 0.9];
  });
  return { model: 'movenet-singlepose', keypoints: kp, width: 1, height: 1, normalized: true };
}

describe('MoveNet adapter → canonical', () => {
  it('maps all 17 keypoints into the canonical schema and validates', () => {
    const p = adaptMoveNet(movenetPayload());
    expect(validateObservedPerson(p).ok).toBe(true);
    expect(p.imageLandmarks.leftShoulder.x).toBeCloseTo(0.42);
  });

  it('preserves confidence as visibility', () => {
    const p = adaptMoveNet(movenetPayload({ score: 0.7 }));
    expect(p.imageLandmarks.nose.visibility).toBeCloseTo(0.7);
  });

  it('handles missing landmarks (low score) without throwing', () => {
    const payload = movenetPayload();
    payload.keypoints[9] = [0.36, 0.52, 0.05]; // index 9 = leftWrist, low confidence
    const p = adaptMoveNet(payload);
    expect(p.imageLandmarks.leftWrist.visibility).toBeLessThan(0.1);
  });
});

describe('mirror handling — front camera left/right correctness', () => {
  it('mirrors x and swaps left/right labels for front camera', () => {
    const p = adaptMoveNet(movenetPayload(), { mirror: true });
    // After mirror, original leftShoulder (x=0.42) becomes rightShoulder at x=1-0.42=0.58
    expect(p.imageLandmarks.rightShoulder.x).toBeCloseTo(0.58);
    expect(p.imageLandmarks.leftShoulder.x).toBeCloseTo(0.42);
    expect(p.qualityFlags).toContain('mirrored');
  });

  it('mirrorLandmarks is an involution (mirror twice = identity)', () => {
    const p = adaptMoveNet(movenetPayload());
    const once = mirrorLandmarks(p.imageLandmarks);
    const twice = mirrorLandmarks(once);
    expect(twice.leftShoulder.x).toBeCloseTo(p.imageLandmarks.leftShoulder.x, 5);
  });
});

describe('landscape rotation', () => {
  it('rotates landmarks around center without changing validity', () => {
    const p = adaptMoveNet(movenetPayload(), { rotation: 90 });
    expect(validateObservedPerson(p).ok).toBe(true);
  });
  it('rotateLandmarks by 360 is identity', () => {
    const p = adaptMoveNet(movenetPayload());
    const r = rotateLandmarks(rotateLandmarks(rotateLandmarks(rotateLandmarks(p.imageLandmarks, 90), 90), 90), 90);
    expect(r.nose.x).toBeCloseTo(p.imageLandmarks.nose.x, 4);
  });
});

describe('MediaPipe Pose adapter (33 → 17)', () => {
  it('maps the 33-landmark set down to canonical 17', () => {
    const lms = new Array(33).fill(0).map((_, i) => ({ x: 0.5, y: 0.5, z: 0, visibility: 0.1 }));
    lms[0] = { x: 0.5, y: 0.1, z: 0, visibility: 0.9 };   // nose
    lms[11] = { x: 0.42, y: 0.25, z: 0, visibility: 0.9 }; // leftShoulder
    lms[14] = { x: 0.62, y: 0.4, z: 0, visibility: 0.9 };  // rightElbow
    const p = adaptMediaPipePose({ model: 'mediapipe-pose', landmarks: lms });
    expect(p.imageLandmarks.nose.visibility).toBeCloseTo(0.9);
    expect(p.imageLandmarks.leftShoulder.x).toBeCloseTo(0.42);
    expect(p.imageLandmarks.rightElbow.x).toBeCloseTo(0.62);
  });
});

describe('Multi-person adapter', () => {
  it('returns one ObservedPerson per detected person (NOT array-order identity)', () => {
    const payload = {
      model: 'movenet-multipose',
      persons: [
        { keypoints: movenetPayload().keypoints, bbox: { x: 0.1, y: 0.1, w: 0.3, h: 0.8 } },
        { keypoints: movenetPayload().keypoints, bbox: { x: 0.6, y: 0.1, w: 0.3, h: 0.8 } },
      ],
      width: 1, height: 1, normalized: true,
    };
    const people = adaptDetectionFrame(payload);
    expect(people).toHaveLength(2);
    expect(people[0].bbox.x).not.toBe(people[1].bbox.x);
  });
});

describe('ONNX COCO adapter (RTMPose/RTMO/RTMW research track)', () => {
  it('adapts a COCO-17 ONNX payload by name when keypointNames supplied', () => {
    const payload = {
      model: 'onnx-coco',
      keypoints: MOVENET_INDEX.map((n) => [0.5, 0.5, 0.8]),
      keypointNames: MOVENET_INDEX,
      width: 640, height: 480, normalized: false,
    };
    const p = adaptOnnxCoco(payload);
    expect(validateObservedPerson(p).ok).toBe(true);
    // pixel coords normalized to [0,1]
    expect(p.imageLandmarks.nose.x).toBeCloseTo(0.5 / 640, 2);
  });
});

describe('bbox computation', () => {
  it('computes a normalized bbox from visible landmarks', () => {
    const p = adaptMoveNet(movenetPayload());
    expect(computeBbox(p.imageLandmarks)).toBeTruthy();
    expect(p.bbox).toBeTruthy();
  });
});
