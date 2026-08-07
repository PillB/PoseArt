// @vitest-environment jsdom
// ============================================================
// PoseArt Solarize — Couple-Pose Migration tests (Round 3, D10/D11/D12)
// ------------------------------------------------------------
// Verifies that legacy single-skeleton `joints:{}` couple poses are
// migrated to explicit two-person PoseScene records:
//   * exactly 2 TargetPeople with distinct roleIds A and B
//   * A and B canonicalSkeletons are not identical
//   * validatePoseScene passes
//   * validationStatus.state === 'migrated_pending_review'
//   * no couple pose is left with a single-skeleton representation
//
// Strategy:
//   1. Build 3 SYNTHETIC couple poses covering the major sub-archetypes
//      (symmetric embrace, back-to-back, asymmetric walking-hand-in-hand)
//      and assert migration correctness on each.
//   2. Load the REAL POSES_LIBRARY from `../../js/poses-data.js` (a classic
//      browser script that declares `const POSES_LIBRARY` at top level and
//      references `window`/`localStorage` for persistence) by evaluating
//      it inside a sandboxed Function with a minimal window stub. Then
//      assert every couple pose in the real library migrates cleanly.
// ============================================================

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  migrateCouplePoseToScene,
  migrateAllCouplePoses,
  skeletonsDiffer,
} from '../../js/solarize/couple-pose-migration.js';
import { validatePoseScene } from '../../js/solarize/canonical-schema.js';

// ------------------------------------------------------------
// Real-library loader
// ------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSES_DATA_PATH = path.resolve(__dirname, '../../js/poses-data.js');

/**
 * Load the real POSES_LIBRARY from poses-data.js without modifying the file.
 *
 * poses-data.js is a classic browser script that:
 *   - declares `const POSES_LIBRARY = { ... };` at the top level (NOT
 *     attached to `window` because it is `const`, not `var`);
 *   - declares `function persist/restore` that touch `localStorage` inside
 *     try/catch (safe to stub);
 *   - calls `restore(...)` at the top level to seed `_gallery`/`_tours`/
 *     `_favorites`/`_sessionHistory` (returns null safely when localStorage
 *     is undefined);
 *   - attaches `window.persist` / `window.restore` if `typeof window !== 'undefined'`.
 *
 * We evaluate the script inside a `new Function` with a minimal window/document
 * stub and return the lexical `POSES_LIBRARY` binding. This works in both
 * jsdom and plain Node (the Function's local scope is independent of the
 * test module's scope).
 */
function loadRealPosesLibrary() {
  const src = readFileSync(POSES_DATA_PATH, 'utf8');
  const sandboxWindow = {
    AppState: {},
    addEventListener() {},
    // localStorage intentionally undefined → restore() throws → returns null.
    get localStorage() { return undefined; },
  };
  const sandboxDocument = { addEventListener() {} };
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    'window', 'document', 'console',
    `${src}\n; return typeof POSES_LIBRARY !== 'undefined' ? POSES_LIBRARY : null;`,
  );
  return fn(sandboxWindow, sandboxDocument, console);
}

// ------------------------------------------------------------
// Synthetic couple poses — 3 sub-archetypes
// ------------------------------------------------------------

const SYNTHETIC_COUPLE_POSES = {
  // (a) Symmetric embrace — source rig has mirrored L/R values; migration
  //     must still produce two DISTINCT skeletons.
  'synth-embrace': {
    id: 'synth-embrace',
    category: 'couple',
    name: 'Synthetic Close Embrace',
    instructions:
      'Stand facing each other, very close, and wrap arms fully around one another in a close embrace.',
    joints: {
      spine: 18, hips: 10, neck: -8.8,
      leftShoulder: -40, rightShoulder: -40,
      leftElbow: 60, rightElbow: 60,
      hipAbductL: 10, hipAbductR: 10,
      leftKnee: 10, rightKnee: 10,
      globalRoll: -8, shoulderFwdL: -50, shoulderFwdR: -50,
    },
  },
  // (b) Back-to-back — text contains 'back-to-back'; migration should
  //     emit a back-to-back contact and rotate both targets 180°.
  'synth-back-to-back': {
    id: 'synth-back-to-back',
    category: 'couple',
    name: 'Synthetic Back to Back',
    instructions:
      'Stand back-to-back with weight evenly shared, arms crossed or relaxed at the sides.',
    joints: {
      spine: 5, hips: 10, neck: -8.8,
      leftShoulder: -10, rightShoulder: 8,
      leftElbow: 30, rightElbow: 30,
      hipAbductL: 10, hipAbductR: 10,
      leftKnee: 10, rightKnee: 10,
      globalRoll: -8, shoulderFwdL: 14,
    },
  },
  // (c) Asymmetric walking hand-in-hand — source rig has distinct L/R hip
  //     swing values; migration must preserve the asymmetry distinctly.
  'synth-hand-hold-walk': {
    id: 'synth-hand-hold-walk',
    category: 'couple',
    name: 'Synthetic Hand in Hand Walk',
    instructions:
      'Walk side by side with hands linked and held, both mid-stride looking ahead.',
    joints: {
      spine: 5, hips: 10, neck: -8.8,
      leftShoulder: -10, rightShoulder: 8,
      leftElbow: 30, rightElbow: 30,
      hipAbductL: 10, hipAbductR: 10,
      leftHip: 20, rightHip: -15,
      leftKnee: 10, rightKnee: 10,
      globalRoll: -8, shoulderFwdL: 14,
    },
  },
};

// ------------------------------------------------------------
// Per-pose assertions (run on every synthetic pose)
// ------------------------------------------------------------

describe('migrateCouplePoseToScene — synthetic couple poses', () => {
  for (const [key, pose] of Object.entries(SYNTHETIC_COUPLE_POSES)) {
    describe(`pose: ${key}`, () => {
      const scene = migrateCouplePoseToScene(pose);

      it('produces exactly 2 TargetPeople', () => {
        expect(scene.targetPeople).toHaveLength(2);
      });

      it('roleIds are A and B (distinct)', () => {
        const ids = scene.targetPeople.map((t) => t.roleId).sort();
        expect(ids).toEqual(['A', 'B']);
      });

      it('A and B canonicalSkeletons are not identical', () => {
        const [a, b] = scene.targetPeople;
        expect(a.canonicalSkeleton).not.toEqual(b.canonicalSkeleton);
        expect(skeletonsDiffer(a, b)).toBe(true);
      });

      it('A and B have distinct rootPositions (A left, B right)', () => {
        const [a, b] = scene.targetPeople;
        expect(a.rootPosition.x).toBeLessThan(b.rootPosition.x);
        expect(a.rootPosition.x).toBeCloseTo(0.35);
        expect(b.rootPosition.x).toBeCloseTo(0.65);
      });

      it('validatePoseScene passes', () => {
        const v = validatePoseScene(scene);
        expect(v.ok, v.errors.join('; ')).toBe(true);
      });

      it("validationStatus.state is 'migrated_pending_review'", () => {
        expect(scene.validationStatus.state).toBe('migrated_pending_review');
      });

      it('has at least one ContactConstraint with A/B anchors', () => {
        expect(scene.contacts.length).toBeGreaterThan(0);
        for (const c of scene.contacts) {
          expect(c.participantA).toBe('A');
          expect(c.participantB).toBe('B');
          expect(c.anchorA).toBeTruthy();
          expect(c.anchorB).toBeTruthy();
        }
      });

      it('is no longer a single-skeleton representation', () => {
        // The defining defect D10/D11/D12: one joints:{} map for two people.
        // After migration, the scene must carry TWO independent
        // canonicalSkeleton objects, each owned by a distinct TargetPerson.
        expect(scene.targetPeople[0].canonicalSkeleton).not.toBe(
          scene.targetPeople[1].canonicalSkeleton,
        );
      });
    });
  }

  it('back-to-back pose rotates both targets 180°', () => {
    const scene = migrateCouplePoseToScene(SYNTHETIC_COUPLE_POSES['synth-back-to-back']);
    expect(scene.targetPeople[0].rootRotation).toBe(180);
    expect(scene.targetPeople[1].rootRotation).toBe(180);
  });

  it('embrace pose derives a wrap/hold contact from text', () => {
    const scene = migrateCouplePoseToScene(SYNTHETIC_COUPLE_POSES['synth-embrace']);
    const rels = scene.contacts.map((c) => c.relation);
    expect(rels).toContain('wrap');
  });
});

// ------------------------------------------------------------
// Batch migration over synthetic library
// ------------------------------------------------------------

describe('migrateAllCouplePoses — synthetic library', () => {
  it('migrates all 3 synthetic couple poses with zero unmigrated', () => {
    const r = migrateAllCouplePoses(SYNTHETIC_COUPLE_POSES);
    expect(r.count).toBe(3);
    expect(r.unmigrated).toEqual([]);
    for (const scene of Object.values(r.scenes)) {
      const v = validatePoseScene(scene);
      expect(v.ok, v.errors.join('; ')).toBe(true);
    }
  });

  it('ignores non-couple poses', () => {
    const mixed = {
      ...SYNTHETIC_COUPLE_POSES,
      'standing-pose': { id: 'standing-pose', category: 'standing', joints: {} },
    };
    const r = migrateAllCouplePoses(mixed);
    expect(r.count).toBe(3);
    expect(r.scenes['standing-pose']).toBeUndefined();
  });
});

// ------------------------------------------------------------
// Real-library migration (the actual 30 couple poses in poses-data.js)
// ------------------------------------------------------------

describe('migrateAllCouplePoses — real POSES_LIBRARY', () => {
  let lib = null;
  try {
    lib = loadRealPosesLibrary();
  } catch (e) {
    console.warn('[migration.test.js] real POSES_LIBRARY load failed:', e);
  }

  it('loads the real POSES_LIBRARY from poses-data.js', () => {
    expect(lib).toBeTruthy();
    expect(Object.keys(lib).length).toBeGreaterThan(700);
  });

  it('migrates every couple pose; none remain single-skeleton', () => {
    if (!lib) {
      console.warn('Real POSES_LIBRARY unavailable; skipping end-to-end test.');
      return;
    }
    const coupleIds = Object.entries(lib)
      .filter(([, p]) => p && p.category === 'couple')
      .map(([id]) => id);
    // The library advertises ~30 couple poses (D10 reproduction ledger).
    expect(coupleIds.length).toBeGreaterThanOrEqual(30);

    const r = migrateAllCouplePoses(lib);
    expect(r.count).toBe(coupleIds.length);
    expect(r.unmigrated).toEqual([]);

    for (const [id, scene] of Object.entries(r.scenes)) {
      // Two-person representation.
      expect(scene.targetPeople).toHaveLength(2);
      const roleIds = scene.targetPeople.map((t) => t.roleId).sort();
      expect(roleIds).toEqual(['A', 'B']);

      // Distinct skeletons (not identical objects, not equal values).
      const [a, b] = scene.targetPeople;
      expect(a.canonicalSkeleton).not.toBe(b.canonicalSkeleton);
      expect(a.canonicalSkeleton).not.toEqual(b.canonicalSkeleton);
      expect(skeletonsDiffer(a, b)).toBe(true);

      // Schema-valid.
      const v = validatePoseScene(scene);
      expect(v.ok, `${id}: ${v.errors.join('; ')}`).toBe(true);

      // Pending-review tag.
      expect(scene.validationStatus.state).toBe('migrated_pending_review');

      // At least one real ContactConstraint.
      expect(scene.contacts.length).toBeGreaterThan(0);
      for (const c of scene.contacts) {
        expect(c.participantA).toBe('A');
        expect(c.participantB).toBe('B');
        expect(c.anchorA).toBeTruthy();
        expect(c.anchorB).toBeTruthy();
      }
    }
  });
});
