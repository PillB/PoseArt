// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(resolve(__dirname, '../../js/app.js'), 'utf8');
const cameraJs = readFileSync(resolve(__dirname, '../../js/camera.js'), 'utf8');
const indexHtml = readFileSync(resolve(__dirname, '../../index.html'), 'utf8');

describe('Solarize §7 — Gallery SIM/REAL filter + review badge', () => {
  describe('gallery filter (app.js)', () => {
    it('getGalleryViewItems filters by synthetic (isSim true)', () => {
      expect(appJs).toContain("_galleryFilter === 'synthetic'");
      expect(appJs).toContain("items.filter(item => item.isSim)");
    });

    it('getGalleryViewItems filters by real (isSim false)', () => {
      expect(appJs).toContain("_galleryFilter === 'real'");
      expect(appJs).toContain("items.filter(item => !item.isSim)");
    });

    it('the synthetic/real filters are checked before the category fallback', () => {
      // The synthetic/real branches must come before the generic `else if (_galleryFilter !== 'all')` category branch.
      const synIdx = appJs.indexOf("_galleryFilter === 'synthetic'");
      const realIdx = appJs.indexOf("_galleryFilter === 'real'");
      const catIdx = appJs.indexOf("else if (_galleryFilter !== 'all')");
      expect(synIdx).toBeGreaterThan(-1);
      expect(realIdx).toBeGreaterThan(synIdx);
      expect(catIdx).toBeGreaterThan(realIdx);
    });
  });

  describe('gallery filter dropdown (index.html)', () => {
    it('offers SIM (synthetic) and REAL (camera) filter options', () => {
      expect(indexHtml).toContain('<option value="synthetic">SIM (synthetic)</option>');
      expect(indexHtml).toContain('<option value="real">REAL (camera)</option>');
    });
  });

  describe('review-screen badge (camera.js)', () => {
    it('captureImage populates #review-mode-badge with SIM/REAL', () => {
      expect(cameraJs).toContain("getElementById('review-mode-badge')");
      expect(cameraJs).toContain("'review-mode-badge ' + (isSim ? 'sim' : 'real')");
      expect(cameraJs).toContain("isSim ? 'SIMULATION' : 'REAL'");
    });

    it('review badge uses isCaptureRealInference to determine mode', () => {
      expect(cameraJs).toContain('isCaptureRealInference');
      const m = cameraJs.match(/const isSim = !\([^)]*isCaptureRealInference[^)]*\)/);
      // The review-badge isSim expression
      expect(cameraJs).toMatch(/review-mode-badge/);
    });

    it('review badge sets aria-label disclosing synthetic vs real', () => {
      expect(cameraJs).toContain("'Synthetic capture — not real camera inference'");
      expect(cameraJs).toContain("'Real camera inference'");
    });
  });

  describe('review-screen HTML (index.html)', () => {
    it('has a #review-mode-badge element in the review-score-badge', () => {
      expect(indexHtml).toContain('id="review-mode-badge"');
      expect(indexHtml).toContain('class="review-mode-badge"');
    });
  });

  describe('review badge CSS (index.html)', () => {
    it('defines review-mode-badge sim + real styles', () => {
      expect(indexHtml).toContain('.review-mode-badge');
      expect(indexHtml).toContain('.review-mode-badge.sim');
      expect(indexHtml).toContain('.review-mode-badge.real');
    });
  });

  describe('end-to-end filter logic', () => {
    it('synthetic filter shows only isSim captures', () => {
      // Trace: _galleryFilter='synthetic' → items.filter(item => item.isSim)
      // isSim is set in captureImage from !isCaptureRealInference()
      expect(appJs).toMatch(/_galleryFilter === 'synthetic'[\s\S]*?items\.filter\(item => item\.isSim\)/);
    });

    it('real filter shows only non-isSim captures', () => {
      expect(appJs).toMatch(/_galleryFilter === 'real'[\s\S]*?items\.filter\(item => !item\.isSim\)/);
    });
  });
});
