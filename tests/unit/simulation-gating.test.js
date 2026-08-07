// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(resolve(__dirname, '../../js/app.js'), 'utf8');

describe('Capture behavior — all captures record progress (original feature restored)', () => {
  it('app.js defines isCaptureRealInference (retained for isSim labelling)', () => {
    expect(appJs).toContain('function isCaptureRealInference');
    expect(appJs).toContain('window.isCaptureRealInference = isCaptureRealInference');
  });

  it('capturePhoto always increments capturedCount (NOT gated by isCaptureRealInference)', () => {
    // The original behavior: every capture increments progress. The
    // isCaptureRealInference gate was removed — it blocked a feature
    // the owner did not authorize removing.
    expect(appJs).toContain('AppState.capturedCount++');
    expect(appJs).not.toContain("if (realInference) { AppState.capturedCount++");
    expect(appJs).not.toContain("SIMULATION capture — not recorded as progress");
  });

  it('captureBurst always increments capturedCount by 3 (NOT gated)', () => {
    expect(appJs).toContain('AppState.capturedCount += 3');
    expect(appJs).not.toContain("if (realInference) { AppState.capturedCount += 3");
    expect(appJs).not.toContain("SIMULATION burst — not recorded as progress");
  });

  it('isCaptureRealInference is retained for the isSim flag on capture records', () => {
    // camera.js uses isCaptureRealInference() to set the isSim flag on
    // capture records for labelling (SIM/REAL badges). It does NOT gate
    // capturedCount.
    expect(appJs).toContain('isCaptureRealInference');
  });
});
