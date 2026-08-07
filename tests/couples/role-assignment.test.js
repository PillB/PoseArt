import { describe, it, expect } from 'vitest';
import { RoleAssigner, contactSatisfied } from '../../js/solarize/role-assignment.js';
import { makeTargetPerson, makePoseScene, makeContactConstraint } from '../../js/solarize/canonical-schema.js';

function track(id, x, conf = 0.9, skeleton = {}) {
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
  return { trackId: id, landmarks: lm, confidence: conf, root: { x: 0.5 + x, y: 0.5 }, scale: 0.3, facingEstimate: { yaw: 10, pitch: 0 } };
}

const sceneA = makePoseScene({
  sceneId: 'couple-001',
  targetPeople: [
    makeTargetPerson({ roleId: 'A', rootPosition: { x: 0.35, y: 0.5 }, canonicalSkeleton: { leftShoulder: 20, leftElbow: 40 } }),
    makeTargetPerson({ roleId: 'B', rootPosition: { x: 0.65, y: 0.5 }, canonicalSkeleton: { rightShoulder: 20, rightElbow: 40 } }),
  ],
});

describe('RoleAssigner — direct vs swapped evaluation', () => {
  it('resolves when one assignment is clearly better (not ambiguous)', () => {
    const ra = new RoleAssigner({ ambiguityMargin: 0.05 });
    // A-pose track on the left matches role A's root better
    const r = ra.assign([track(1, -0.15), track(2, 0.15)], sceneA.targetPeople);
    expect(r.resolved).toBe(true);
    expect(r.abstain).toBe(false);
    expect(r.assignment).toHaveLength(2);
  });

  it('abstains when roles are ambiguous', () => {
    const ra = new RoleAssigner({ ambiguityMargin: 0.9 }); // very high margin forces abstention
    const r = ra.assign([track(1, -0.05), track(2, 0.05)], sceneA.targetPeople);
    expect(r.abstain).toBe(true);
    expect(r.reason).toBe('ambiguous_roles');
  });

  it('abstains when a partner is missing', () => {
    const ra = new RoleAssigner();
    const r = ra.assign([track(1, -0.15)], sceneA.targetPeople);
    expect(r.abstain).toBe(true);
    expect(r.reason).toBe('missing_partner');
  });

  it('does NOT use array order as identity (swapped positions handled by cost, not index)', () => {
    const ra = new RoleAssigner({ ambiguityMargin: 0.02 });
    // Two near-identical poses at distinct roots; assignment must come from cost, not order.
    const r = ra.assign([track(1, 0.15), track(2, -0.15)], sceneA.targetPeople);
    expect(r.resolved).toBe(true);
    // The track on the left should map to role A (root 0.35).
    const aAssign = r.assignment.find((a) => a.roleId === 'A');
    expect(aAssign.trackId).toBe(2); // track 2 is the left one (x=-0.15)
  });
});

describe('RoleAssigner — contacts', () => {
  it('detects a satisfied hand-to-hand contact', () => {
    const contact = makeContactConstraint({ id: 'hh', participantA: 'A', anchorA: 'rightWrist', participantB: 'B', anchorB: 'leftWrist', targetDistance: 0.1, tolerance: 0.2 });
    // place A's rightWrist near B's leftWrist
    const tA = track(1, -0.05);
    const tB = track(2, 0.05);
    const assignment = [{ roleId: 'A', trackId: 1 }, { roleId: 'B', trackId: 2 }];
    const r = contactSatisfied(assignment, [tA, tB], contact);
    expect(r.satisfied).toBe(true);
  });

  it('excludes a contact when anchors are low-visibility (no confident claim)', () => {
    const contact = makeContactConstraint({ id: 'hh', participantA: 'A', anchorA: 'rightWrist', participantB: 'B', anchorB: 'leftWrist', targetDistance: 0, tolerance: 0.1, visibilityRequired: true });
    const tA = track(1, -0.05, 0.9); tA.landmarks.rightWrist.visibility = 0.1;
    const tB = track(2, 0.05);
    const assignment = [{ roleId: 'A', trackId: 1 }, { roleId: 'B', trackId: 2 }];
    const r = contactSatisfied(assignment, [tA, tB], contact);
    expect(r.excluded).toBe(true);
    expect(r.satisfied).toBe(false);
  });
});
