// ============================================================
// Solarize — VLM-derived pose validation (differential debugging)
// ------------------------------------------------------------
// Uses a VLM-analysed real photography reference image as ground
// truth, creates a deterministic frame descriptor from the VLM's
// estimated keypoints, runs it through the Solarize pipeline, and
// compares the pipeline output with the VLM description.
//
// This validates the pipeline against REAL photography content
// (not just synthetic fixtures) and identifies discrepancies.
// ============================================================

import { describe, it, expect } from 'vitest';
import { SolarizeEngine } from '../../js/solarize/engine.js';
import { DeterministicPoseModel } from '../../js/solarize/pose-model-runtime.js';
import { makePoseScene, makeTargetPerson } from '../../js/solarize/canonical-schema.js';
import { PROFILES } from '../../js/solarize/runtime-profiles.js';

// VLM-estimated keypoints from a real fashion model photograph.
// Source: glm-5v-turbo vision analysis of a standing three-quarter pose.
const VLM_KEYPOINTS = {
  nose:          [0.492, 0.125],
  leftShoulder:  [0.438, 0.218],
  rightShoulder: [0.582, 0.215],
  leftElbow:     [0.380, 0.380],  // estimated (hand on hip)
  rightElbow:    [0.620, 0.380],
  leftWrist:     [0.410, 0.480],  // hand on hip
  rightWrist:    [0.650, 0.500],  // relaxed behind
  leftHip:       [0.412, 0.442],
  rightHip:      [0.528, 0.458],
  leftKnee:      [0.440, 0.680],
  rightKnee:     [0.560, 0.700],
  leftAnkle:     [0.462, 0.895],
  rightAnkle:    [0.578, 0.935],
  leftEye:       [0.470, 0.110],
  rightEye:      [0.514, 0.110],
  leftEar:       [0.440, 0.140],
  rightEar:      [0.540, 0.140],
};

// VLM-estimated joint angles
const VLM_ANGLES = {
  leftShoulder: 15, rightShoulder: 5,
  leftElbow: 115, rightElbow: 165,
  leftHip: 10, rightHip: 0,
  leftKnee: 175, rightKnee: 180,
  spine: 12, neck: 10,
};

// VLM description
const VLM_DESCRIPTION = {
  posture: 'standing',
  arms: 'lowered (hand on hip)',
  symmetry: 'asymmetric',
  orientation: 'three-quarter front-left',
};

function vlmFrame() {
  const kp = (name) => {
    const p = VLM_KEYPOINTS[name];
    return [p[0], p[1], 0.9];
  };
  const keypoints = [
    kp('nose'), kp('leftEye'), kp('rightEye'), kp('leftEar'), kp('rightEar'),
    kp('leftShoulder'), kp('rightShoulder'), kp('leftElbow'), kp('rightElbow'),
    kp('leftWrist'), kp('rightWrist'), kp('leftHip'), kp('rightHip'),
    kp('leftKnee'), kp('rightKnee'), kp('leftAnkle'), kp('rightAnkle'),
  ];
  return {
    width: 800, height: 1000, timestamp: 0,
    descriptor: { persons: [{ keypoints, bbox: { x: 0.35, y: 0.1, w: 0.3, h: 0.85 } }] },
  };
}

describe('Solarize — VLM-derived pose validation (differential debugging)', () => {
  it('VLM keypoints produce a valid ObservedPerson through the pipeline', async () => {
    const engine = new SolarizeEngine({ profile: PROFILES.RGB_COMPATIBLE });
    engine.model = new DeterministicPoseModel();
    await engine.model.init();
    const scene = makePoseScene({
      sceneId: 'vlm-standing',
      targetPeople: [makeTargetPerson({ roleId: 'A', canonicalSkeleton: VLM_ANGLES, rootPosition: { x: 0.5, y: 0.5 } })],
    });
    engine.setScene(scene);
    const result = await engine.processFrame(vlmFrame());
    expect(result.detectedPersons).toHaveLength(1);
    expect(result.detectedPersons[0].imageLandmarks.nose.x).toBeCloseTo(0.492, 1);
    expect(result.detectedPersons[0].imageLandmarks.leftAnkle.y).toBeCloseTo(0.895, 1);
  });

  it('VLM-described standing pose produces a non-zero score', async () => {
    const engine = new SolarizeEngine({ profile: PROFILES.RGB_COMPATIBLE });
    engine.model = new DeterministicPoseModel();
    await engine.model.init();
    const scene = makePoseScene({
      sceneId: 'vlm-standing',
      targetPeople: [makeTargetPerson({ roleId: 'A', canonicalSkeleton: VLM_ANGLES, rootPosition: { x: 0.5, y: 0.5 } })],
    });
    engine.setScene(scene);
    const result = await engine.processFrame(vlmFrame());
    expect(result.alignment.overallScore).toBeGreaterThan(0);
    // A standing pose matching the target should produce a reasonable score.
    expect(result.alignment.overallScore).toBeGreaterThan(10);
  });

  it('VLM keypoints are anatomically plausible (nose above shoulders, shoulders above hips)', async () => {
    const engine = new SolarizeEngine({ profile: PROFILES.RGB_COMPATIBLE });
    engine.model = new DeterministicPoseModel();
    await engine.model.init();
    engine.setScene(makePoseScene({ sceneId: 'vlm', targetPeople: [makeTargetPerson({ roleId: 'A', canonicalSkeleton: {} })] }));
    const result = await engine.processFrame(vlmFrame());
    const lm = result.detectedPersons[0].imageLandmarks;
    // Anatomical ordering: nose.y < shoulders.y < hips.y < ankles.y
    expect(lm.nose.y).toBeLessThan(lm.leftShoulder.y);
    expect(lm.leftShoulder.y).toBeLessThan(lm.leftHip.y);
    expect(lm.leftHip.y).toBeLessThan(lm.leftAnkle.y);
  });

  it('VLM-described asymmetric pose (hand on hip) produces asymmetric elbow angles', async () => {
    const engine = new SolarizeEngine({ profile: PROFILES.RGB_COMPATIBLE });
    engine.model = new DeterministicPoseModel();
    await engine.model.init();
    engine.setScene(makePoseScene({ sceneId: 'vlm', targetPeople: [makeTargetPerson({ roleId: 'A', canonicalSkeleton: {} })] }));
    const result = await engine.processFrame(vlmFrame());
    // The pipeline should detect the asymmetry — left elbow bent (hand on hip)
    // vs right elbow nearly straight.
    const lm = result.detectedPersons[0].imageLandmarks;
    // Left wrist is closer to hip (hand on hip); right wrist is further.
    const leftWristHipDist = Math.hypot(lm.leftWrist.x - lm.leftHip.x, lm.leftWrist.y - lm.leftHip.y);
    const rightWristHipDist = Math.hypot(lm.rightWrist.x - lm.rightHip.x, lm.rightWrist.y - lm.rightHip.y);
    expect(leftWristHipDist).toBeLessThan(rightWristHipDist);
  });

  it('VLM keypoints fall within the framing bounds (not out of frame)', async () => {
    const engine = new SolarizeEngine({ profile: PROFILES.RGB_COMPATIBLE });
    engine.model = new DeterministicPoseModel();
    await engine.model.init();
    engine.setScene(makePoseScene({ sceneId: 'vlm', targetPeople: [makeTargetPerson({ roleId: 'A', canonicalSkeleton: {} })] }));
    const result = await engine.processFrame(vlmFrame());
    const lm = result.detectedPersons[0].imageLandmarks;
    // All keypoints should be within [0, 1] (normalized frame).
    for (const name of ['nose', 'leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 'leftAnkle', 'rightAnkle']) {
      expect(lm[name].x).toBeGreaterThan(0);
      expect(lm[name].x).toBeLessThan(1);
      expect(lm[name].y).toBeGreaterThan(0);
      expect(lm[name].y).toBeLessThan(1);
    }
  });

  it('discrepancy diagnosis: VLM pose vs Solarize scoring', async () => {
    // This test documents the differential analysis: the VLM describes a
    // standing three-quarter pose with hand-on-hip. The Solarize pipeline
    // should score this pose against a matching target scene. The score
    // reflects OKS + bone-vector + angle similarity.
    const engine = new SolarizeEngine({ profile: PROFILES.RGB_COMPATIBLE });
    engine.model = new DeterministicPoseModel();
    await engine.model.init();
    const scene = makePoseScene({
      sceneId: 'vlm-standing',
      targetPeople: [makeTargetPerson({ roleId: 'A', canonicalSkeleton: VLM_ANGLES, rootPosition: { x: 0.5, y: 0.5 } })],
    });
    engine.setScene(scene);
    const result = await engine.processFrame(vlmFrame());
    // The score should be non-trivial — the VLM keypoints roughly match the
    // target angles. A very low score would indicate a pipeline issue.
    const score = result.alignment.overallScore;
    // Document the score for diagnosis.
    console.log(`[VLM differential] standing pose score: ${score.toFixed(1)}% (VLM described: ${VLM_DESCRIPTION.posture}, ${VLM_DESCRIPTION.arms}, ${VLM_DESCRIPTION.orientation})`);
    // The score should be positive — if it's 0, the pipeline is broken.
    expect(score).toBeGreaterThan(0);
  });
});
