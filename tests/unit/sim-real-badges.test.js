// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(resolve(__dirname, '../../js/app.js'), 'utf8');
const cameraJs = readFileSync(resolve(__dirname, '../../js/camera.js'), 'utf8');
const indexHtml = readFileSync(resolve(__dirname, '../../index.html'), 'utf8');

describe('Solarize §7 — SIM/REAL visible-labelling badges', () => {
  describe('capture record carries isSim flag (camera.js)', () => {
    it('captureImage sets isSim based on isCaptureRealInference()', () => {
      expect(cameraJs).toContain('isSim');
      expect(cameraJs).toContain('isCaptureRealInference');
      // The capture object includes the flag + profile + modelId
      expect(cameraJs).toContain('isSim, // Solarize §7 visible-labelling flag');
      expect(cameraJs).toContain('profile: this.solarizeProfile');
      expect(cameraJs).toContain('modelId: this._modelManager');
    });

    it('isSim is true when isCaptureRealInference returns false (simulation)', () => {
      // The expression: isSim = !(...isCaptureRealInference())
      // When isCaptureRealInference() is false → isSim = !(false) = true
      const m = cameraJs.match(/const isSim = !\([^)]*isCaptureRealInference[^)]*\)/);
      expect(m, 'isSim must be the negation of isCaptureRealInference').toBeTruthy();
    });
  });

  describe('gallery badge markup (app.js)', () => {
    it('galleryItemMarkup renders a SIM badge for synthetic captures', () => {
      expect(appJs).toContain('gallery-sim-badge');
      expect(appJs).toContain('SIM</div>');
      expect(appJs).toContain('title="Synthetic capture');
    });

    it('galleryItemMarkup renders a REAL badge for real-inference captures', () => {
      expect(appJs).toContain('gallery-real-badge');
      expect(appJs).toContain('REAL</div>');
      expect(appJs).toContain('title="Real camera inference');
    });

    it('gallery aria-label includes synthetic/real distinction', () => {
      expect(appJs).toContain("item.isSim ? ', synthetic' : ', real'");
    });
  });

  describe('session history badge (app.js)', () => {
    it('loadSessionStats renders SIM/REAL pills', () => {
      expect(appJs).toContain('session-sim-pill');
      expect(appJs).toContain('session-real-pill');
      expect(appJs).toContain('title="Synthetic session');
      expect(appJs).toContain('title="Real camera inference');
    });

    it('saveSession call includes isSim flag', () => {
      expect(appJs).toContain('isSim\n    });');
      // The isSim is computed from isCaptureRealInference
      expect(appJs).toContain('const isSim = !(typeof window.isCaptureRealInference');
    });
  });

  describe('camera HUD mode badge (camera.js)', () => {
    it('_renderModeBadge renders SIM or REAL badge', () => {
      expect(cameraJs).toContain('_renderModeBadge');
      expect(cameraJs).toContain("cam-mode-badge ' + (isSim ? 'sim' : 'real')");
      expect(cameraJs).toContain("textContent = isSim ? 'SIMULATION' : 'REAL'");
    });

    it('simulation path calls _renderModeBadge(true)', () => {
      expect(cameraJs).toContain('this._renderModeBadge(true)');
    });

    it('real pipeline path calls _renderModeBadge(false) in _updateSolarizeHUD', () => {
      expect(cameraJs).toContain('this._renderModeBadge(false)');
    });
  });

  describe('badge CSS (index.html)', () => {
    it('defines gallery-sim-badge + gallery-real-badge styles', () => {
      expect(indexHtml).toContain('.gallery-sim-badge');
      expect(indexHtml).toContain('.gallery-real-badge');
    });

    it('defines session-sim-pill + session-real-pill styles', () => {
      expect(indexHtml).toContain('.session-sim-pill');
      expect(indexHtml).toContain('.session-real-pill');
    });

    it('defines cam-mode-badge styles for sim + real', () => {
      expect(indexHtml).toContain('.cam-mode-badge');
      expect(indexHtml).toContain('.cam-mode-badge.sim');
      expect(indexHtml).toContain('.cam-mode-badge.real');
    });
  });

  describe('end-to-end badge logic', () => {
    it('simulation capture → isSim true → SIM badge in gallery', () => {
      // Trace: isCaptureRealInference() false → isSim = true → gallery-sim-badge
      // The gallery markup uses: item.isSim ? sim-badge : real-badge
      expect(appJs).toMatch(/item\.isSim\s*\?\s*['"]<div class="gallery-sim-badge/);
    });

    it('real capture → isSim false → REAL badge in gallery', () => {
      expect(appJs).toContain(': \'<div class="gallery-real-badge');
    });
  });
});
