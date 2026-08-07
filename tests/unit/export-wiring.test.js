// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(resolve(__dirname, '../../js/app.js'), 'utf8');
const bootstrapJs = readFileSync(resolve(__dirname, '../../js/solarize-bootstrap.js'), 'utf8');

describe('Solarize §7 — Export metadata wiring (app.js + bootstrap)', () => {
  describe('galleryFileName uses PoseArtExport', () => {
    it('galleryFileName delegates to PoseArtExport.exportFileName when available', () => {
      expect(appJs).toContain('window.PoseArtExport');
      expect(appJs).toContain('PoseArtExport.exportFileName');
    });
  });

  describe('downloadGalleryItem downloads sidecar metadata', () => {
    it('calls PoseArtExport.downloadSidecarMetadata after the image download', () => {
      expect(appJs).toContain('PoseArtExport.downloadSidecarMetadata');
      expect(appJs).toMatch(/downloadSidecarMetadata\(item\)/);
    });

    it('wraps the sidecar download in try/catch (never blocks the image download)', () => {
      expect(appJs).toMatch(/try\s*\{\s*window\.PoseArtExport\.downloadSidecarMetadata\(item\);\s*\}\s*catch/);
    });
  });

  describe('saveToPhotos uses metadata-aware share title', () => {
    it('uses PoseArtExport.shareTitle when available', () => {
      expect(appJs).toContain('PoseArtExport.shareTitle');
      expect(appJs).toMatch(/shareTitle\(item\)/);
    });
  });

  describe('bootstrap exposes PoseArtExport on window', () => {
    it('solarize-bootstrap.js imports + exposes PoseArtExport', () => {
      expect(bootstrapJs).toContain('exportFileName');
      expect(bootstrapJs).toContain('exportMetadata');
      expect(bootstrapJs).toContain('downloadSidecarMetadata');
      expect(bootstrapJs).toContain('shareTitle');
      expect(bootstrapJs).toContain('PoseArtExport:');
    });
  });
});
