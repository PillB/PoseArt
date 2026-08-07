import { describe, it, expect } from 'vitest';
import {
  makeObservedPerson, makePoseScene, makeTargetPerson, makeContactConstraint,
  makePropRecord, makeAlignmentResult, validateObservedPerson, validatePoseScene,
  validatePropRecord, CANONICAL_LANDMARKS, computeCanonicalJointAngles,
  computeCanonicalBones, oksDistance, torsoScale, PROP_TYPES,
} from '../../js/solarize/canonical-schema.js';

describe('canonical schema — ObservedPerson', () => {
  it('always emits the canonical 17 landmarks even with partial input', () => {
    const p = makeObservedPerson({ imageLandmarks: { nose: { x: 0.5, y: 0.2, visibility: 0.9 } } });
    for (const name of CANONICAL_LANDMARKS) {
      expect(p.imageLandmarks[name]).toBeDefined();
    }
    expect(p.imageLandmarks.nose.visibility).toBeCloseTo(0.9);
    expect(p.imageLandmarks.leftAnkle.visibility).toBe(0);
  });

  it('validates the canonical landmark schema', () => {
    const p = makeObservedPerson({ timestamp: 100 });
    const v = validateObservedPerson(p);
    expect(v.ok).toBe(true);
  });

  it('rejects non-canonical landmark schema', () => {
    const bad = { ...makeObservedPerson({}), landmarkSchema: 'movenet-raw' };
    expect(validateObservedPerson(bad).ok).toBe(false);
  });
});

describe('canonical schema — PoseScene / TargetPerson / Contact / Prop', () => {
  it('builds a two-person PoseScene with explicit roles and contacts', () => {
    const scene = makePoseScene({
      sceneId: 'couple-embrace-001',
      displayName: 'Embrace',
      targetPeople: [
        makeTargetPerson({ roleId: 'A', roleName: 'Person A', canonicalSkeleton: { leftElbow: 30 } }),
        makeTargetPerson({ roleId: 'B', roleName: 'Person B', canonicalSkeleton: { rightElbow: 30 } }),
      ],
      props: [makePropRecord({ propId: 'prop:floor', type: 'floor' })],
      contacts: [makeContactConstraint({ id: 'c1', participantA: 'A', anchorA: 'leftWrist', participantB: 'B', anchorB: 'rightWrist', relation: 'touch' })],
    });
    const v = validatePoseScene(scene);
    expect(v.ok).toBe(true);
    expect(scene.targetPeople).toHaveLength(2);
    expect(scene.contacts[0].participantA).toBe('A');
  });

  it('rejects duplicate roleIds', () => {
    const scene = makePoseScene({
      sceneId: 'bad',
      targetPeople: [makeTargetPerson({ roleId: 'A' }), makeTargetPerson({ roleId: 'A' })],
    });
    expect(validatePoseScene(scene).ok).toBe(false);
  });

  it('rejects unknown prop types', () => {
    const p = makePropRecord({ propId: 'x', type: 'banana' });
    expect(validatePropRecord(p).ok).toBe(false);
  });

  it('PROP_TYPES includes bench and table (not just chair/bed)', () => {
    expect(PROP_TYPES).toContain('bench');
    expect(PROP_TYPES).toContain('table');
    expect(PROP_TYPES).toContain('railing');
  });
});

describe('canonical math — OKS, bones, joint angles', () => {
  const lm = {
    nose: { x: 0.5, y: 0.1 }, leftShoulder: { x: 0.42, y: 0.25 }, rightShoulder: { x: 0.58, y: 0.25 },
    leftElbow: { x: 0.38, y: 0.4 }, rightElbow: { x: 0.62, y: 0.4 },
    leftWrist: { x: 0.36, y: 0.52 }, rightWrist: { x: 0.64, y: 0.52 },
    leftHip: { x: 0.44, y: 0.55 }, rightHip: { x: 0.56, y: 0.55 },
    leftKnee: { x: 0.43, y: 0.75 }, rightKnee: { x: 0.57, y: 0.75 },
    leftAnkle: { x: 0.42, y: 0.92 }, rightAnkle: { x: 0.58, y: 0.92 },
  };
  it('computes joint angles in [0,180]', () => {
    const a = computeCanonicalJointAngles(lm);
    expect(a.leftElbow).toBeGreaterThanOrEqual(0);
    expect(a.leftElbow).toBeLessThanOrEqual(180);
  });
  it('computes normalized bones with unit length', () => {
    const b = computeCanonicalBones(lm);
    const bone = b['leftShoulder__leftElbow'];
    expect(Math.hypot(bone.x, bone.y)).toBeCloseTo(1, 5);
  });
  it('OKS of identical landmarks is ~1', () => {
    const scale = torsoScale(lm);
    expect(oksDistance(lm, lm, scale)).toBeCloseTo(1, 4);
  });
  it('OKS of displaced landmarks is < 1', () => {
    const scale = torsoScale(lm);
    const moved = { ...lm, leftWrist: { x: 0.9, y: 0.9 } };
    expect(oksDistance(moved, lm, scale)).toBeLessThan(1);
  });
});

describe('AlignmentResult shape', () => {
  it('exposes decomposed fields including blocking reasons and excluded components', () => {
    const r = makeAlignmentResult({
      eligible: false, overallScore: 0.42, confidence: 0.3,
      blockingReasons: ['role_assignment_ambiguous'], excludedComponents: ['rightAnkle_angle'],
    });
    expect(r.overallScore).toBeCloseTo(42, 0);
    expect(r.blockingReasons).toContain('role_assignment_ambiguous');
    expect(r).toHaveProperty('perPersonScores');
    expect(r).toHaveProperty('relationalScore');
    expect(r).toHaveProperty('propScore');
    expect(r).toHaveProperty('stabilityScore');
  });
});
