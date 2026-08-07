import { describe, it, expect } from 'vitest';
import { PoseScorer, buildTargetLandmarks } from '../../js/solarize/pose-scorer.js';
import { AutoCaptureGate } from '../../js/solarize/auto-capture.js';
import { Coach } from '../../js/solarize/coaching.js';
import { makePoseScene, makeTargetPerson, makePropRecord, makeContactConstraint } from '../../js/solarize/canonical-schema.js';
import { PROFILES } from '../../js/solarize/runtime-profiles.js';

function person(x, conf = 0.9, visOverride) {
  const lm = {
    nose: { x: 0.5 + x, y: 0.1, visibility: conf },
    leftShoulder: { x: 0.42 + x, y: 0.25, visibility: conf },
    rightShoulder: { x: 0.58 + x, y: 0.25, visibility: conf },
    leftElbow: { x: 0.38 + x, y: 0.4, visibility: conf },
    rightElbow: { x: 0.62 + x, y: 0.4, visibility: conf },
    leftWrist: { x: 0.36 + x, y: 0.52, visibility: conf },
    rightWrist: { x: 0.64 + x, y: 0.52, visibility: conf },
    leftHip: { x: 0.44 + x, y: 0.55, visibility: conf },
    rightHip: { x: 0.56 + x, y: 0.55, visibility: conf },
    leftKnee: { x: 0.43 + x, y: 0.75, visibility: conf },
    rightKnee: { x: 0.57 + x, y: 0.75, visibility: conf },
    leftAnkle: { x: 0.42 + x, y: 0.92, visibility: conf },
    rightAnkle: { x: 0.58 + x, y: 0.92, visibility: conf },
    leftEye: { x: 0.47 + x, y: 0.08, visibility: conf },
    rightEye: { x: 0.53 + x, y: 0.08, visibility: conf },
    leftEar: { x: 0.44 + x, y: 0.1, visibility: conf },
    rightEar: { x: 0.56 + x, y: 0.1, visibility: conf },
  };
  if (visOverride) for (const [k, v] of Object.entries(visOverride)) lm[k].visibility = v;
  return { trackId: 1, landmarks: lm, confidence: conf, root: { x: 0.5 + x, y: 0.5 }, scale: 0.3, facingEstimate: { yaw: 10, pitch: 0 } };
}

const singleScene = makePoseScene({
  sceneId: 'stand-001',
  targetPeople: [makeTargetPerson({ roleId: 'A', rootPosition: { x: 0.5, y: 0.5 }, canonicalSkeleton: { leftShoulder: 10, rightShoulder: 10, leftElbow: 20, rightElbow: 20, leftHip: 5, rightHip: 5, leftKnee: 10, rightKnee: 10 } })],
});

const realRuntime = { modelReady: true, fatalError: false };
const simRuntime = { modelReady: false, fatalError: false };

describe('PoseScorer — SIMULATION never produces a real score', () => {
  it('returns overallScore 0 and inferredFromRealModel false in SIMULATION', () => {
    const s = new PoseScorer();
    const r = s.score({ observed: [person(0)], scene: singleScene, assignment: { resolved: true, abstain: false, assignment: [{ roleId: 'A', trackId: 1 }] }, profile: PROFILES.SIMULATION, runtime: simRuntime, frameTimestamp: 0 });
    expect(r.inferredFromRealModel).toBe(false);
    expect(r.overallScore).toBe(0);
    expect(r.blockingReasons).toContain('simulation_mode');
    expect(r.eligible).toBe(false);
  });
});

describe('PoseScorer — real single-person scoring', () => {
  it('score improves as landmark error decreases (monotonic, no oscillation)', () => {
    const s = new PoseScorer();
    // Build a target whose landmarks match `person(0)` exactly, then drift.
    const target = makeTargetPerson({ roleId: 'A', rootPosition: { x: 0.5, y: 0.5 }, canonicalSkeleton: {} });
    target._cachedTargetLandmarks = buildTargetLandmarks(target);
    // override target landmarks to match the observed neutral pose
    target._cachedTargetLandmarks = person(0).landmarks;
    const scene = makePoseScene({ sceneId: 'mono', targetPeople: [target] });
    const r0 = s.score({ observed: [person(0)], scene, assignment: { resolved: true, abstain: false, assignment: [{ roleId: 'A', trackId: 1 }] }, profile: PROFILES.RGB_COMPATIBLE, runtime: realRuntime, frameTimestamp: 0 });
    // now displace the wrist badly
    const bad = person(0, 0.9, { leftWrist: 0.1, rightWrist: 0.1 });
    bad.landmarks.leftWrist = { x: 0.9, y: 0.2, visibility: 0.9 };
    bad.landmarks.rightWrist = { x: 0.1, y: 0.2, visibility: 0.9 };
    s.reset();
    const r1 = s.score({ observed: [bad], scene, assignment: { resolved: true, abstain: false, assignment: [{ roleId: 'A', trackId: 1 }] }, profile: PROFILES.RGB_COMPATIBLE, runtime: realRuntime, frameTimestamp: 33 });
    expect(r0.overallScore).toBeGreaterThan(r1.overallScore);
  });

  it('does not produce confident corrections for invisible joints', () => {
    const s = new PoseScorer();
    const observed = person(0, 0.9, { leftElbow: 0.05, leftWrist: 0.05, leftKnee: 0.05, leftAnkle: 0.05 });
    const r = s.score({ observed: [observed], scene: singleScene, assignment: { resolved: true, abstain: false, assignment: [{ roleId: 'A', trackId: 1 }] }, profile: PROFILES.RGB_COMPATIBLE, runtime: realRuntime, frameTimestamp: 0 });
    // No correction references a joint whose keypoints are invisible
    for (const c of r.topCorrections) {
      const def = { leftShoulder: ['leftShoulder'], leftElbow: ['leftWrist', 'leftElbow', 'leftShoulder'], leftKnee: ['leftAnkle', 'leftKnee', 'leftHip'] }[c.joint];
      if (def) for (const k of def) {
        if (['leftElbow', 'leftWrist', 'leftKnee', 'leftAnkle'].includes(k)) {
          expect(r.excludedComponents.some((e) => e.includes(`${c.joint}_angle(invisible)`))).toBe(true);
        }
      }
    }
    // invisible left elbow must be excluded, not confidently corrected
    expect(r.excludedComponents.some((e) => e.includes('leftElbow_angle(invisible)'))).toBe(true);
  });

  it('abstains (not eligible) when no person is detected', () => {
    const s = new PoseScorer();
    const r = s.score({ observed: [], scene: singleScene, assignment: { resolved: false, abstain: true, reason: 'no_people' }, profile: PROFILES.RGB_COMPATIBLE, runtime: realRuntime, frameTimestamp: 0 });
    expect(r.eligible).toBe(false);
    expect(r.blockingReasons).toContain('missing_person');
  });
});

describe('PoseScorer — two-person relational & contacts', () => {
  const coupleScene = makePoseScene({
    sceneId: 'couple',
    targetPeople: [
      makeTargetPerson({ roleId: 'A', rootPosition: { x: 0.35, y: 0.5 }, canonicalSkeleton: {} }),
      makeTargetPerson({ roleId: 'B', rootPosition: { x: 0.65, y: 0.5 }, canonicalSkeleton: {} }),
    ],
    contacts: [makeContactConstraint({ id: 'hh', participantA: 'A', anchorA: 'rightWrist', participantB: 'B', anchorB: 'leftWrist', targetDistance: 0.0, tolerance: 0.15 })],
  });
  it('one missing partner blocks eligibility', () => {
    const s = new PoseScorer();
    const r = s.score({ observed: [person(-0.15)], scene: coupleScene, assignment: { resolved: false, abstain: true, reason: 'missing_partner' }, profile: PROFILES.RGB_COMPATIBLE, runtime: realRuntime, frameTimestamp: 0 });
    expect(r.eligible).toBe(false);
    expect(r.blockingReasons).toContain('missing_person');
  });
});

describe('AutoCaptureGate', () => {
  it('simulation cannot capture', () => {
    const g = new AutoCaptureGate();
    const r = g.evaluate({ alignment: { inferredFromRealModel: false, overallScore: 99, confidence: 0.9, blockingReasons: [] }, profile: PROFILES.SIMULATION, frameTs: 0, dtMs: 33, personCount: 1, requiredCount: 1, contactsSatisfied: true });
    expect(r.capture).toBe(false);
    expect(r.reason).toBe('simulation_mode');
  });
  it('no person cannot capture', () => {
    const g = new AutoCaptureGate();
    const r = g.evaluate({ alignment: { inferredFromRealModel: true, overallScore: 99, confidence: 0.9, blockingReasons: ['missing_person'] }, profile: PROFILES.RGB_COMPATIBLE, frameTs: 0, dtMs: 33, personCount: 0, requiredCount: 1 });
    expect(r.capture).toBe(false);
  });
  it('requires sustained alignment (hold gate)', () => {
    const g = new AutoCaptureGate({ holdMs: 200 });
    const alignment = { inferredFromRealModel: true, overallScore: 90, confidence: 0.9, blockingReasons: [] };
    const a = g.evaluate({ alignment, profile: PROFILES.RGB_COMPATIBLE, frameTs: 0, dtMs: 33, personCount: 1, requiredCount: 1, contactsSatisfied: true });
    expect(a.capture).toBe(false);
    expect(a.reason).toBe('sustaining');
    const b = g.evaluate({ alignment, profile: PROFILES.RGB_COMPATIBLE, frameTs: 200, dtMs: 200, personCount: 1, requiredCount: 1, contactsSatisfied: true });
    expect(b.capture).toBe(true);
  });
  it('a recent role/track switch resets the hold', () => {
    const g = new AutoCaptureGate({ holdMs: 100 });
    g.notifyTrackSwitch(100);
    const alignment = { inferredFromRealModel: true, overallScore: 90, confidence: 0.9, blockingReasons: [] };
    const r = g.evaluate({ alignment, profile: PROFILES.RGB_COMPATIBLE, frameTs: 150, dtMs: 50, personCount: 1, requiredCount: 1, contactsSatisfied: true });
    expect(r.capture).toBe(false);
    expect(r.reason).toBe('recent_track_switch');
  });
});

describe('Coach — invisible joints get no hint', () => {
  it('emits no confident hint when the relevant joint is invisible', () => {
    const coach = new Coach({ minStableFrames: 1 });
    const observed = person(0, 0, 0.9, { leftElbow: 0.05, leftWrist: 0.05 });
    const alignment = {
      inferredFromRealModel: true, confidence: 0.8, blockingReasons: [],
      topCorrections: [{ joint: 'leftElbow', measured: 10, target: 80, delta: 70, hint: 'Bend your left elbow more', excluded: false }],
    };
    const hints = coach.decide({ alignment, assignment: { resolved: true }, mirror: false, observedByRole: { A: observed.landmarks } });
    // leftElbow correction should be filtered because it's invisible (delta large but evidence inadequate)
    expect(hints.some((h) => h.joint === 'leftElbow')).toBe(false);
  });
  it('mirrors left/right hints for front camera', () => {
    const coach = new Coach({ minStableFrames: 1, minDeltaForHint: 10 });
    const alignment = {
      inferredFromRealModel: true, confidence: 0.8, blockingReasons: [],
      topCorrections: [{ joint: 'leftShoulder', measured: 0, target: 45, delta: 45, hint: 'Raise your left arm', excluded: false }],
    };
    const hints = coach.decide({ alignment, assignment: { resolved: true }, mirror: true });
    expect(hints.some((h) => h.displayJoint === 'rightShoulder')).toBe(true);
  });
});

describe('PoseScorer — props gate', () => {
  it('a chair pose without the required chair/contact fails the prop gate', () => {
    const chairScene = makePoseScene({
      sceneId: 'seated-chair',
      targetPeople: [makeTargetPerson({ roleId: 'A', canonicalSkeleton: {} })],
      props: [makePropRecord({ propId: 'chair1', type: 'chair', requiredOrOptional: 'required' })],
      contacts: [makeContactConstraint({ id: 'seat', participantA: 'A', anchorA: 'leftHip', participantB: 'prop:chair1', anchorB: 'seat', targetDistance: 0, tolerance: 0.05 })],
    });
    const s = new PoseScorer();
    const r = s.score({ observed: [person(0)], scene: chairScene, assignment: { resolved: true, abstain: false, assignment: [{ roleId: 'A', trackId: 1 }] }, profile: PROFILES.RGB_COMPATIBLE, runtime: realRuntime, frameTimestamp: 0 });
    expect(r.eligible).toBe(false);
    expect(r.blockingReasons.some((b) => b.startsWith('prop_contact_unsatisfied') || b.startsWith('prop_no_contact'))).toBe(true);
  });
});
