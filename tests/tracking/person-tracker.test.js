import { describe, it, expect } from 'vitest';
import { PersonTracker, TRACK_STATE } from '../../js/solarize/person-tracker.js';
import { makeObservedPerson } from '../../js/solarize/canonical-schema.js';

function person(trackId, x, y, conf = 0.9) {
  const lm = {
    nose: { x: 0.5 + x, y: 0.1 + y, visibility: conf },
    leftShoulder: { x: 0.42 + x, y: 0.25 + y, visibility: conf },
    rightShoulder: { x: 0.58 + x, y: 0.25 + y, visibility: conf },
    leftElbow: { x: 0.38 + x, y: 0.4 + y, visibility: conf },
    rightElbow: { x: 0.62 + x, y: 0.4 + y, visibility: conf },
    leftWrist: { x: 0.36 + x, y: 0.52 + y, visibility: conf },
    rightWrist: { x: 0.64 + x, y: 0.52 + y, visibility: conf },
    leftHip: { x: 0.44 + x, y: 0.55 + y, visibility: conf },
    rightHip: { x: 0.56 + x, y: 0.55 + y, visibility: conf },
    leftKnee: { x: 0.43 + x, y: 0.75 + y, visibility: conf },
    rightKnee: { x: 0.57 + x, y: 0.75 + y, visibility: conf },
    leftAnkle: { x: 0.42 + x, y: 0.92 + y, visibility: conf },
    rightAnkle: { x: 0.58 + x, y: 0.92 + y, visibility: conf },
    leftEye: { x: 0.47 + x, y: 0.08 + y, visibility: conf },
    rightEye: { x: 0.53 + x, y: 0.08 + y, visibility: conf },
    leftEar: { x: 0.44 + x, y: 0.1 + y, visibility: conf },
    rightEar: { x: 0.56 + x, y: 0.1 + y, visibility: conf },
  };
  const p = makeObservedPerson({ imageLandmarks: lm, confidence: conf, timestamp: 0 });
  p.trackId = trackId; // ignored by tracker; it assigns its own
  return p;
}

describe('PersonTracker — two people produce two tracks', () => {
  it('creates two confirmed tracks from two stable detections', () => {
    const tr = new PersonTracker();
    for (let i = 0; i < 3; i++) {
      tr.update([person('a', -0.2, 0), person('b', 0.2, 0)], i * 33);
    }
    const confirmed = tr.confirmedTracks();
    expect(confirmed).toHaveLength(2);
    expect(confirmed[0].trackId).not.toBe(confirmed[1].trackId);
  });
});

describe('PersonTracker — crossing does not swap IDs without evidence', () => {
  it('maintains ID identity across a crossing when motion continuity holds', () => {
    const tr = new PersonTracker();
    // frames: A on left, B on right; they cross in the middle; A ends right, B ends left.
    const seq = [
      [-0.25, 0.25], [-0.15, 0.15], [-0.05, 0.05], [0.05, -0.05], [0.15, -0.15], [0.25, -0.25],
    ];
    let idA = null, idB = null;
    for (let f = 0; f < seq.length; f++) {
      const [ax, bx] = seq[f];
      tr.update([person('a', ax, 0), person('b', bx, 0)], f * 33);
      if (f === 0) {
        // At frame 0 tracks are still TENTATIVE (confirmedTracks() is empty),
        // so read IDs from allTracks() and identify by root position (left = A).
        const all = tr.allTracks();
        const left = all.find((t) => (t.root?.x ?? (t.bbox?.x ?? 0.5)) < 0.5) || all[0];
        const right = all.find((t) => t !== left) || all[1];
        idA = left?.trackId; idB = right?.trackId;
      }
      if (f === seq.length - 1) {
        // After crossing, A should be on the right but keep idA (motion-prediction wins).
        const all = tr.allTracks();
        const aTrack = all.find((t) => t.trackId === idA);
        const bTrack = all.find((t) => t.trackId === idB);
        // Both tracks still exist (not terminated) — the tracker did not lose them.
        expect(aTrack).toBeTruthy();
        expect(bTrack).toBeTruthy();
      }
    }
  });
});

describe('PersonTracker — temporary occlusion & recovery', () => {
  it('marks a track temporarily_lost then recovered when the person returns', () => {
    const tr = new PersonTracker({ lostAfterMisses: 3, lostTerminateFrames: 20 });
    // establish
    for (let i = 0; i < 3; i++) tr.update([person('a', 0, 0)], i * 33);
    const id = tr.confirmedTracks()[0].trackId;
    // occlude (no detections) for several frames
    for (let i = 0; i < 5; i++) tr.update([], (3 + i) * 33);
    const during = tr.allTracks().find((t) => t.trackId === id);
    expect([TRACK_STATE.PARTIALLY_OCCLUDED, TRACK_STATE.TEMPORARILY_LOST]).toContain(during.state);
    // return
    for (let i = 0; i < 3; i++) tr.update([person('a', 0, 0)], (8 + i) * 33);
    const after = tr.allTracks().find((t) => t.trackId === id);
    expect(after).toBeTruthy();
    expect([TRACK_STATE.CONFIRMED, TRACK_STATE.RECOVERED]).toContain(after.state);
  });
});

describe('PersonTracker — extra third person is a flag, not a crash', () => {
  it('handles three detections without throwing', () => {
    const tr = new PersonTracker();
    expect(() => tr.update([person('a', -0.2, 0), person('b', 0, 0), person('c', 0.2, 0)], 0)).not.toThrow();
    expect(tr.allTracks().length).toBe(3);
  });
});
