// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAllCoupleDossiers, executableSchemaCheck, buildDossier, ANATOMICAL_RANGES, SUPPORT_CLASSES } from '../../js/solarize/pose-dossiers.js';
import { migrateAllCouplePoses } from '../../js/solarize/couple-pose-migration.js';
import { makePoseScene, makeTargetPerson, makeContactConstraint } from '../../js/solarize/canonical-schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Load the real POSES_LIBRARY by evaluating poses-data.js in a sandbox.
function loadPosesLibrary() {
  const src = readFileSync(resolve(__dirname, '../../js/poses-data.js'), 'utf8');
  const sandbox = { window: {}, document: { addEventListener() {}, getElementById() { return null; } }, console, navigator: {} };
  const fn = new Function('window', 'document', 'console', 'navigator', src + '; return typeof POSES_LIBRARY !== "undefined" ? POSES_LIBRARY : null;');
  return fn(sandbox.window, sandbox.document, sandbox.console, sandbox.navigator);
}
const POSES_LIBRARY = loadPosesLibrary();
const migrated = migrateAllCouplePoses(POSES_LIBRARY);
const coupleScenes = migrated.scenes;
const coupleIds = Object.keys(POSES_LIBRARY).filter((id) => POSES_LIBRARY[id].category === 'couple');

describe('per-pose dossier suite — every couple pose has an executable schema+anatomy test (Solarize §18)', () => {
  const { dossiers, summary } = buildAllCoupleDossiers(POSES_LIBRARY, coupleScenes);

  it('built a dossier for every couple pose', () => {
    expect(summary.total).toBe(coupleIds.length);
    expect(summary.total).toBeGreaterThanOrEqual(30);
  });

  // One executable test PER pose — the Solarize §18 requirement.
  for (const id of coupleIds) {
    it(`dossier ${id}: schema valid, 2 people, anatomy in range, contacts resolve`, () => {
      const d = dossiers[id];
      expect(d, `dossier for ${id} must exist`).toBeTruthy();
      const check = executableSchemaCheck(d);
      if (!check.ok) {
        // Print the failures for diagnosis
        console.error(`[dossier ${id}] FAIL:`, check.failures);
      }
      expect(check.ok, `${id}: ` + check.failures.join('; ')).toBe(true);
    });
  }

  it('every dossier records validation status + provenance + residual limitations', () => {
    for (const id of coupleIds) {
      const d = dossiers[id];
      expect(d.validationStatus).toBeTruthy();
      expect(d.validationStatus.state).toBeTruthy();
      expect(d.provenance).toBeTruthy();
      expect(d.provenance.source).toMatch(/poses-data/);
      expect(Array.isArray(d.residualLimitations)).toBe(true);
      expect(Array.isArray(d.renderVariants)).toBe(true);
      expect(d.renderVariants.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every dossier has a support class from the canonical set', () => {
    for (const id of coupleIds) {
      const d = dossiers[id];
      expect(SUPPORT_CLASSES, `support class ${d.supportClass} must be canonical`).toContain(d.supportClass);
    }
  });

  it('no dossier is auto-promoted to canonical without human sign-off', () => {
    for (const id of coupleIds) {
      const d = dossiers[id];
      // Without opts.humanSignedOff, even an automated-pass dossier stays pending sign-off.
      expect(d.validationStatus.state).not.toBe('canonical');
    }
  });

  it('a high-severity anatomy issue blocks automated pass', () => {
    // Construct a bad scene: spine = 200° (out of range)
    const badScene = makePoseScene({
      sceneId: 'bad-spine',
      targetPeople: [
        makeTargetPerson({ roleId: 'A', canonicalSkeleton: { spine: 200 } }),
        makeTargetPerson({ roleId: 'B', canonicalSkeleton: { spine: 10 } }),
      ],
    });
    const d = buildDossier({ id: 'bad-spine', category: 'couple', instructions: 'x' }, badScene);
    expect(d.anatomy.issues.some((i) => i.severity === 'high')).toBe(true);
    expect(d.validationStatus.blocking).toContain('anatomy_high_severity');
    expect(d.validationStatus.state).toBe('migrated_pending_review');
  });

  it('a couple scene with unresolved contact participant is flagged', () => {
    const badScene = makePoseScene({
      sceneId: 'bad-contact',
      targetPeople: [makeTargetPerson({ roleId: 'A' }), makeTargetPerson({ roleId: 'B' })],
      contacts: [makeContactConstraint({ id: 'c1', participantA: 'A', anchorA: 'leftWrist', participantB: 'Z', anchorB: 'rightWrist' })],
    });
    const d = buildDossier({ id: 'bad-contact', category: 'couple', instructions: 'x' }, badScene);
    expect(d.contacts.issues.some((i) => i.severity === 'high')).toBe(true);
  });

  it('human sign-off promotes an automated-pass dossier to canonical', () => {
    // Use the first couple scene; assume automated pass (most embrace poses pass).
    const id = coupleIds[0];
    const d = buildDossier(POSES_LIBRARY[id], coupleScenes[id], { humanSignedOff: true, reviewer: 'anatomy-lead' });
    // If it passes automated checks, sign-off promotes it.
    if (!d.validationStatus.blocking.length) {
      expect(d.validationStatus.state).toBe('canonical');
      expect(d.validationStatus.reviewedBy).toContain('anatomy-lead');
    }
  });

  it('summary reports counts by validation state + support class', () => {
    expect(summary).toHaveProperty('total');
    expect(summary).toHaveProperty('canonical');
    expect(summary).toHaveProperty('automatedPass');
    expect(summary).toHaveProperty('pendingReview');
    expect(summary).toHaveProperty('blocked');
    expect(summary.bySupportClass).toBeTruthy();
    expect(Object.keys(summary.bySupportClass).length).toBeGreaterThan(0);
  });
});
