import { describe, it, expect } from 'vitest';
import { exportFileName, exportMetadata, exportSidecarName, shareTitle } from '../../js/solarize/export-metadata.js';

describe('Solarize §7 — Capture export metadata provenance', () => {
  const realCapture = {
    id: 1700000000,
    poseId: 'scurve-stand',
    poseName: 'S-Curve Stand',
    score: 73,
    timestamp: '2026-08-07T04:00:00.000Z',
    isSim: false,
    profile: 'RGB_COMPATIBLE',
    modelId: 'deterministic-test',
    favorite: false,
  };
  const simCapture = {
    id: 1700000001,
    poseId: 'scurve-stand',
    poseName: 'S-Curve Stand',
    score: 0,
    timestamp: '2026-08-07T04:01:00.000Z',
    isSim: true,
    profile: 'SIMULATION',
    modelId: null,
    favorite: false,
  };

  describe('exportFileName', () => {
    it('encodes SIM/REAL provenance in the filename', () => {
      expect(exportFileName(realCapture)).toMatch(/^poseart-real-/);
      expect(exportFileName(simCapture)).toMatch(/^poseart-sim-/);
    });

    it('includes the sanitized pose name + id', () => {
      expect(exportFileName(realCapture)).toContain('s-curve-stand');
      expect(exportFileName(realCapture)).toContain(String(realCapture.id));
    });

    it('ends with .jpg', () => {
      expect(exportFileName(realCapture)).toMatch(/\.jpg$/);
    });

    it('handles missing poseName', () => {
      const name = exportFileName({ id: 1, isSim: false });
      expect(name).toContain('real');
      expect(name).toContain('capture');
    });
  });

  describe('exportMetadata', () => {
    it('returns a JSON-serializable object with full provenance', () => {
      const m = exportMetadata(realCapture);
      expect(m.schema).toBe('poseart-capture/v1');
      expect(m.id).toBe(realCapture.id);
      expect(m.poseId).toBe('scurve-stand');
      expect(m.poseName).toBe('S-Curve Stand');
      expect(m.score).toBe(73);
      expect(m.timestamp).toBe(realCapture.timestamp);
      expect(m.isSim).toBe(false);
      expect(m.profile).toBe('RGB_COMPATIBLE');
      expect(m.modelId).toBe('deterministic-test');
      expect(m.favorite).toBe(false);
      expect(m.exportedAt).toBeTruthy();
    });

    it('preserves isSim=true for synthetic captures', () => {
      const m = exportMetadata(simCapture);
      expect(m.isSim).toBe(true);
      expect(m.profile).toBe('SIMULATION');
      expect(m.modelId).toBeNull();
    });

    it('is JSON-serializable (no circular refs)', () => {
      const m = exportMetadata(realCapture);
      expect(() => JSON.stringify(m)).not.toThrow();
      const parsed = JSON.parse(JSON.stringify(m));
      expect(parsed.isSim).toBe(false);
    });

    it('returns null for no item', () => {
      expect(exportMetadata(null)).toBeNull();
    });

    it('defaults profile when missing', () => {
      const m = exportMetadata({ id: 1, isSim: true });
      expect(m.profile).toBe('SIMULATION');
      const m2 = exportMetadata({ id: 2, isSim: false });
      expect(m2.profile).toBe('UNKNOWN');
    });
  });

  describe('exportSidecarName', () => {
    it('matches the image filename with .poseart.json extension', () => {
      const img = exportFileName(realCapture);
      const side = exportSidecarName(realCapture);
      expect(side).toBe(img.replace(/\.jpg$/, '.poseart.json'));
    });

    it('encodes SIM/REAL in the sidecar name', () => {
      expect(exportSidecarName(simCapture)).toMatch(/^poseart-sim-/);
      expect(exportSidecarName(realCapture)).toMatch(/^poseart-real-/);
    });
  });

  describe('shareTitle', () => {
    it('discloses SIM/REAL in the share title', () => {
      expect(shareTitle(realCapture)).toBe('S-Curve Stand (REAL)');
      expect(shareTitle(simCapture)).toBe('S-Curve Stand (SIMULATION)');
    });

    it('handles missing poseName', () => {
      expect(shareTitle({ isSim: false })).toBe('PoseArt capture (REAL)');
      expect(shareTitle({ isSim: true })).toBe('PoseArt capture (SIMULATION)');
    });
  });

  describe('end-to-end provenance chain', () => {
    it('filename + sidecar + metadata all agree on isSim', () => {
      for (const item of [realCapture, simCapture]) {
        const fname = exportFileName(item);
        const sidecar = exportSidecarName(item);
        const meta = exportMetadata(item);
        const mode = item.isSim ? 'sim' : 'real';
        expect(fname).toContain('-' + mode + '-');
        expect(sidecar).toContain('-' + mode + '-');
        expect(meta.isSim).toBe(item.isSim);
      }
    });
  });
});
