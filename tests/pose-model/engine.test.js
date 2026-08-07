import { describe, it, expect } from 'vitest';
import { SolarizeEngine } from '../../js/solarize/engine.js';
import { DeterministicPoseModel, MODEL_REGISTRY } from '../../js/solarize/pose-model-runtime.js';
import { makePoseScene, makeTargetPerson } from '../../js/solarize/canonical-schema.js';
import { PROFILES } from '../../js/solarize/runtime-profiles.js';

// Build a deterministic frame descriptor for a standing pose at given x offset.
function standingFrame(xOffset = 0, opts = {}) {
  const kp = (x, y, s = 0.9) => [x, y, s];
  const cx = 0.5 + xOffset;
  const unit = 0.06;
  const persons = [{
    keypoints: [
      kp(cx, 0.12),                         // nose
      kp(cx - 0.03, 0.10), kp(cx + 0.03, 0.10),  // eyes
      kp(cx - 0.05, 0.11), kp(cx + 0.05, 0.11),  // ears
      kp(cx - unit, 0.25), kp(cx + unit, 0.25),  // shoulders
      kp(cx - 2 * unit, 0.40), kp(cx + 2 * unit, 0.40), // elbows
      kp(cx - 2.5 * unit, 0.52), kp(cx + 2.5 * unit, 0.52), // wrists
      kp(cx - 0.7 * unit, 0.55), kp(cx + 0.7 * unit, 0.55), // hips
      kp(cx - 0.7 * unit, 0.75), kp(cx + 0.7 * unit, 0.75), // knees
      kp(cx - 0.7 * unit, 0.92), kp(cx + 0.7 * unit, 0.92), // ankles
    ],
  }];
  if (opts.empty) return { width: 640, height: 480, timestamp: 0, descriptor: { persons: [] } };
  return { width: 640, height: 480, timestamp: 0, descriptor: { persons } };
}

const singleScene = makePoseScene({
  sceneId: 'stand',
  targetPeople: [makeTargetPerson({ roleId: 'A', rootPosition: { x: 0.5, y: 0.5 }, canonicalSkeleton: {} })],
});

describe('SolarizeEngine — real pipeline (deterministic model)', () => {
  it('camera movement changes the model keypoints (D1 fix: pixels drive keypoints)', async () => {
    const engine = new SolarizeEngine({ profile: PROFILES.RGB_COMPATIBLE });
    engine.model = new DeterministicPoseModel();
    await engine.model.init();
    engine.setScene(singleScene);
    const a = await engine.processFrame(standingFrame(0));
    const b = await engine.processFrame(standingFrame(0.15));
    // root x must differ because the frame content differs — keypoints derive
    // from the frame pixels, NOT from a clock (the core D1 fix).
    expect(a.detectedPersons[0].root.x).toBeLessThan(b.detectedPersons[0].root.x);
  });

  it('an empty frame returns no eligible pose and no tracks', async () => {
    const engine = new SolarizeEngine({ profile: PROFILES.RGB_COMPATIBLE });
    engine.model = new DeterministicPoseModel();
    engine.setScene(singleScene);
    const r = await engine.processFrame(standingFrame(0, { empty: true }));
    expect(r.tracks).toHaveLength(0);
    expect(r.alignment.eligible).toBe(false);
    expect(r.alignment.blockingReasons).toContain('missing_person');
  });

  it('SIMULATION cannot produce a real score or capture (D4 fix)', async () => {
    const engine = new SolarizeEngine({ profile: PROFILES.SIMULATION });
    engine.model = new DeterministicPoseModel();
    engine.setScene(singleScene);
    const r = await engine.processFrame(standingFrame(0));
    expect(r.alignment.inferredFromRealModel).toBe(false);
    expect(r.alignment.overallScore).toBe(0);
    expect(r.capture.capture).toBe(false);
    expect(r.capture.reason).toBe('simulation_mode');
  });

  it('two people flow through the engine as two separate tracks', async () => {
    const coupleScene = makePoseScene({
      sceneId: 'couple',
      targetPeople: [
        makeTargetPerson({ roleId: 'A', rootPosition: { x: 0.35, y: 0.5 }, canonicalSkeleton: {} }),
        makeTargetPerson({ roleId: 'B', rootPosition: { x: 0.65, y: 0.5 }, canonicalSkeleton: {} }),
      ],
    });
    const engine = new SolarizeEngine({ profile: PROFILES.RGB_HIGH_PERFORMANCE });
    engine.model = new DeterministicPoseModel();
    engine.setScene(coupleScene);
    const twoPersonFrame = { width: 640, height: 480, timestamp: 0, descriptor: { persons: [standingFrame(-0.15).descriptor.persons[0], standingFrame(0.15).descriptor.persons[0]] } };
    // run a few frames to confirm tracks
    let r;
    for (let i = 0; i < 3; i++) r = await engine.processFrame({ ...twoPersonFrame, timestamp: i * 33 });
    expect(r.tracks.length).toBeGreaterThanOrEqual(2);
    expect(r.assignment.resolved || r.assignment.abstain).toBeTruthy();
  });
});

describe('MODEL_REGISTRY — provenance', () => {
  it('records publisher, license, landmark count and multi-person support per model', () => {
    const m = MODEL_REGISTRY['movenet-multipose-lightning'];
    expect(m.publisher).toBe('Google');
    expect(m.multiPerson).toBe(true);
    expect(m.landmarks).toBe(17);
    expect(m.license).toBeTruthy();
  });
  it('marks RTMPose/RTMO as research candidates (not bundled)', () => {
    expect(MODEL_REGISTRY['rtmpose-onnx (research)'].note).toMatch(/research/i);
    expect(MODEL_REGISTRY['rtmo-onnx (research)'].note).toMatch(/research/i);
  });
});
