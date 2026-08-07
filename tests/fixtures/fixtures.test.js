import { describe, it, expect } from 'vitest';
import {
  SINGLE_PERSON_FIXTURES, TWO_PERSON_FIXTURES, PROP_FIXTURES,
  ALL_FIXTURES, getFixture, listFixtures, fixtureCount,
} from '../fixtures/ground-truth-fixtures.js';
import { DeterministicPoseModel } from '../../js/solarize/pose-model-runtime.js';
import { adaptDetectionFrame } from '../../js/solarize/detector-adapters.js';
import { PersonTracker } from '../../js/solarize/person-tracker.js';
import { makePropRecord, makeContactConstraint } from '../../js/solarize/canonical-schema.js';
import { evaluatePropContact } from '../../js/solarize/props.js';

const model = new DeterministicPoseModel();
await model.init();

async function detect(frame) {
  const det = await model.detect(frame);
  return adaptDetectionFrame(det, {});
}

describe('Solarize §22 — ground-truth fixture coverage', () => {
  it('covers all mandated single-person conditions', () => {
    const ids = Object.keys(SINGLE_PERSON_FIXTURES);
    // Solarize §22 single-person list
    const required = ['neutral', 'raisedArms', 'seated', 'kneeling', 'reclining', 'profile', 'partialBody', 'feetOutOfFrame', 'lowLight', 'motionBlur', 'mirrored', 'noPerson'];
    for (const r of required) expect(ids, `missing fixture ${r}`).toContain(r);
  });

  it('covers all mandated two-person conditions', () => {
    const ids = Object.keys(TWO_PERSON_FIXTURES);
    const required = ['sideBySide', 'embrace', 'backToBack', 'foreheadTouch', 'handHold', 'oneEntering', 'oneLeaving', 'crossing', 'overlap', 'roleSwap', 'tempOcclusion', 'similarClothing', 'differentHeights', 'wrongDistance', 'missingContact', 'extraThirdPerson'];
    for (const r of required) expect(ids, `missing fixture ${r}`).toContain(r);
  });

  it('covers all mandated prop conditions', () => {
    const ids = Object.keys(PROP_FIXTURES);
    const required = ['chair', 'wall', 'floor', 'bed', 'railing', 'unsupportedFakeContact'];
    for (const r of required) expect(ids, `missing fixture ${r}`).toContain(r);
  });

  it('fixtureCount reports at least 34 fixtures (12 + 16 + 6)', () => {
    expect(fixtureCount()).toBeGreaterThanOrEqual(34);
  });

  it('listFixtures returns all fixtures with metadata', () => {
    const list = listFixtures();
    expect(list.length).toBeGreaterThanOrEqual(34);
    expect(list[0]).toHaveProperty('category');
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('label');
  });
});

describe('Solarize §22 — single-person fixtures produce expected detections', () => {
  for (const [id, f] of Object.entries(SINGLE_PERSON_FIXTURES)) {
    it(`${id}: detected person count matches expected`, async () => {
      const people = await detect(f.frame());
      expect(people.length).toBe(f.expected.personCount);
    });
  }

  it('no-person fixture yields zero detections', async () => {
    const people = await detect(SINGLE_PERSON_FIXTURES.noPerson.frame());
    expect(people).toHaveLength(0);
  });

  it('low-light fixture yields low aggregate confidence', async () => {
    const people = await detect(SINGLE_PERSON_FIXTURES.lowLight.frame());
    expect(people[0].confidence).toBeLessThan(0.5);
  });

  it('mirrored fixture produces mirrored landmarks (left/right swapped)', async () => {
    const neutralPeople = await detect(SINGLE_PERSON_FIXTURES.neutral.frame());
    const mirroredPeople = await detect(SINGLE_PERSON_FIXTURES.mirrored.frame());
    // In the neutral fixture, leftShoulder.x < 0.5 (left side of frame).
    // In the mirrored fixture, the label "leftShoulder" now holds the flipped
    // right-side coords, so leftShoulder.x should differ from neutral and
    // equal 1 - neutral.rightShoulder.x.
    const n = neutralPeople[0].imageLandmarks;
    const m = mirroredPeople[0].imageLandmarks;
    expect(m.leftShoulder.x).toBeCloseTo(1 - n.rightShoulder.x, 2);
    expect(m.rightShoulder.x).toBeCloseTo(1 - n.leftShoulder.x, 2);
  });

  it('partial-body fixture has low nose/shoulder visibility', async () => {
    const people = await detect(SINGLE_PERSON_FIXTURES.partialBody.frame());
    expect(people[0].imageLandmarks.nose.visibility).toBeLessThan(0.2);
  });
});

describe('Solarize §22 — two-person fixtures produce two tracks', () => {
  for (const [id, f] of Object.entries(TWO_PERSON_FIXTURES)) {
    if (f.frames) continue; // sequence fixtures tested below
    it(`${id}: detects ${f.expected.personCount} people`, async () => {
      const people = await detect(f.frame());
      expect(people.length).toBe(f.expected.personCount);
    });
  }

  it('crossing sequence maintains 2 tracks without ID explosion', async () => {
    const tracker = new PersonTracker();
    const seq = TWO_PERSON_FIXTURES.crossing.frames();
    for (const fr of seq) {
      const people = await detect(fr);
      tracker.update(people, fr.timestamp);
    }
    const totalTracks = tracker.allTracks().length;
    expect(totalTracks).toBeLessThanOrEqual(3); // allow brief fragmentation but not explosion
  });

  it('temp-occlusion sequence recovers the track', async () => {
    const tracker = new PersonTracker({ lostTerminateFrames: 50 });
    const seq = TWO_PERSON_FIXTURES.tempOcclusion.frames();
    let firstId = null;
    for (const fr of seq) {
      const people = await detect(fr);
      const confirmed = tracker.update(people, fr.timestamp);
      if (confirmed.length && firstId === null) firstId = confirmed[0].trackId;
    }
    // The first track should still exist after occlusion + recovery.
    const all = tracker.allTracks();
    expect(all.some((t) => t.trackId === firstId)).toBe(true);
  });

  it('extra-third-person fixture detects 3 people (flag, not crash)', async () => {
    const people = await detect(TWO_PERSON_FIXTURES.extraThirdPerson.frame());
    expect(people.length).toBe(3);
  });
});

describe('Solarize §22 — prop fixtures evaluate contacts correctly', () => {
  for (const [id, f] of Object.entries(PROP_FIXTURES)) {
    it(`${id}: ${f.label}`, async () => {
      const people = await detect(f.frame());
      const observedByRole = people.length ? { A: people[0] } : {};
      if (f.prop === null) {
        // unsupported fake contact — must fail with missing_prop
        const prop = null;
        const props = [];
        const contact = makeContactConstraint(f.contact);
        const r = evaluatePropContact(contact, observedByRole, props);
        expect(r.satisfied).toBe(false);
        expect(r.reason).toBe('missing_prop');
      } else {
        const prop = makePropRecord(f.prop);
        const contact = makeContactConstraint(f.contact);
        const r = evaluatePropContact(contact, observedByRole, [prop]);
        expect(r.satisfied).toBe(f.expected.propContactSatisfied);
      }
    });
  }
});
