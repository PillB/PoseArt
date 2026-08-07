// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(resolve(__dirname, '../../js/app.js'), 'utf8');

// Extract the isCaptureRealInference function body from app.js and test it
// as a pure function. This avoids re-evaluating the entire 2500-line app.js
// (which depends on PoseArtAnalytics, POSES_LIBRARY, DOM, etc.).
function extractIsCaptureRealInference() {
  const m = appJs.match(/function\s+isCaptureRealInference\s*\(\)\s*\{([\s\S]*?)\n\}/);
  if (!m) throw new Error('isCaptureRealInference not found in app.js');
  return new Function('window', `return (function isCaptureRealInference() { ${m[1]} }).call({});`);
  // The function reads window.cameraEngine via the global `window` param.
}

// Build a reusable tester: pass a fake window, get the boolean result.
function makeTester() {
  const m = appJs.match(/function\s+isCaptureRealInference\s*\(\)\s*\{([\s\S]*?)\n\}/);
  if (!m) throw new Error('isCaptureRealInference not found in app.js');
  // The function body references `window` — inject it as a parameter.
  return new Function('window', `${m[0]} return isCaptureRealInference();`);
}

describe('Solarize §7 — SIMULATION cannot earn achievements or real progress', () => {
  it('app.js defines isCaptureRealInference', () => {
    expect(appJs).toMatch(/function\s+isCaptureRealInference\s*\(/);
  });

  it('app.js exposes isCaptureRealInference on window for testing', () => {
    expect(appJs).toContain('window.isCaptureRealInference = isCaptureRealInference');
  });

  it('app.js contains the simulation-gate label', () => {
    expect(appJs).toContain('SIMULATION capture — not recorded as progress');
    expect(appJs).toContain('Solarize §7: SIMULATION can never earn real captures/progress');
  });

  it('returns false when no camera engine exists (pure simulation)', () => {
    const tester = makeTester();
    expect(tester({})).toBe(false);
  });

  it('returns false when cameraEngine has no real model and no live video (legacy simulation)', () => {
    const tester = makeTester();
    expect(tester({ cameraEngine: { solarizeActive: false, solarizeEngine: null, stream: null, videoEl: null } })).toBe(false);
  });

  it('returns true when Solarize engine is active with a real-model profile + model ready', () => {
    const tester = makeTester();
    expect(tester({ cameraEngine: { solarizeActive: true, solarizeEngine: { profile: { realModel: true }, model: { ready: true } }, stream: null, videoEl: null } })).toBe(true);
  });

  it('returns true when legacy camera stream has live video (no solarize)', () => {
    const tester = makeTester();
    expect(tester({ cameraEngine: { solarizeActive: false, solarizeEngine: null, stream: {}, videoEl: { videoWidth: 640 } } })).toBe(true);
  });

  it('returns false when solarize is active but profile is SIMULATION (realModel false)', () => {
    const tester = makeTester();
    expect(tester({ cameraEngine: { solarizeActive: true, solarizeEngine: { profile: { realModel: false }, model: { ready: true } }, stream: null, videoEl: null } })).toBe(false);
  });

  it('returns false when model is not ready (still loading)', () => {
    const tester = makeTester();
    expect(tester({ cameraEngine: { solarizeActive: true, solarizeEngine: { profile: { realModel: true }, model: { ready: false } }, stream: null, videoEl: null } })).toBe(false);
  });

  it('capturePhoto calls capturedCount++ ONLY on real inference (source inspection)', () => {
    // The capturePhoto body must guard capturedCount behind isCaptureRealInference.
    const captureBlock = appJs.match(/window\.capturePhoto\s*=\s*function\s*\(\)\s*\{([\s\S]*?)\n\}/);
    expect(captureBlock, 'capturePhoto must exist').toBeTruthy();
    const body = captureBlock[1];
    expect(body).toContain('isCaptureRealInference');
    expect(body).toContain('if (realInference)');
    expect(body).toContain('AppState.capturedCount++');
    expect(body).toContain('SIMULATION capture — not recorded as progress');
  });

  it('captureBurst also gates capturedCount behind real inference (source inspection)', () => {
    const burstBlock = appJs.match(/window\.captureBurst\s*=\s*function\s*\(\)\s*\{([\s\S]*?)\n\};/);
    expect(burstBlock, 'captureBurst must exist').toBeTruthy();
    const body = burstBlock[1];
    expect(body).toContain('isCaptureRealInference');
    expect(body).toContain('if (realInference)');
    expect(body).toContain('SIMULATION burst — not recorded as progress');
  });
});
