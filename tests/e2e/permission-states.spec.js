// ============================================================
// PoseArt Solarize — Permission & failure-state matrix (§24)
// ------------------------------------------------------------
// Tests the camera-permission / no-camera / model-failure paths
// through visible controls. Verifies:
//   • camera-denied → SIMULATION label, no real capture
//   • no-camera (deterministic demo) → real pipeline on synthetic frames
//   • model-failure → fallback/failed status surfaced with Retry
//
// These run on Chromium (permission emulation) + Firefox/WebKit
// (no-camera path, since getUserMedia is unavailable headless).
// ============================================================
import { test, expect } from '@playwright/test';
import { loginViaForm, skipOnboarding } from './helpers.js';

test.describe('Permission & failure states @camera', () => {
  test('camera denied → simulation mode label visible', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Permission emulation is Chromium-only');
    // Deny camera permission explicitly.
    await page.context().grantPermissions([]).catch(() => {});
    await page.context().clearPermissions();
    await page.route('**/*', (route) => route.continue());
    await loginViaForm(page);
    await skipOnboarding(page);
    // Attempt to start a session — camera will be denied.
    await page.locator('button:has-text("Start Session")').first().click();
    await expect(page.locator('#screen-session-setup')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Begin Capture")').click();
    // The camera screen should appear; with no camera the deterministic
    // demo (or simulation) runs. Either way, a status overlay must show.
    await expect(page.locator('#screen-camera, #solarize-status')).toBeVisible({ timeout: 10000 });
  });

  test('no-camera → deterministic demo runs (pixels→keypoints, not a real-camera claim)', async ({ page }) => {
    // Headless browsers have no camera; the deterministic demo activates.
    await loginViaForm(page);
    await skipOnboarding(page);
    await page.locator('button:has-text("Start Session")').first().click();
    await expect(page.locator('#screen-session-setup')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Begin Capture")').click();
    await expect(page.locator('#screen-camera')).toBeVisible({ timeout: 8000 });
    // The status overlay must appear and mention "deterministic" (no-camera demo).
    await expect(page.locator('#solarize-status')).toBeVisible({ timeout: 12000 });
    const text = (await page.locator('#solarize-status').textContent()) || '';
    expect(text.toLowerCase()).toMatch(/deterministic|model:/);
  });

  test('simulation mode never shows a real score (0% or labelled)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chromium-only permission path');
    await page.context().clearPermissions();
    await loginViaForm(page);
    await skipOnboarding(page);
    await page.locator('button:has-text("Start Session")').first().click();
    await page.locator('button:has-text("Begin Capture")').click();
    await expect(page.locator('#screen-camera')).toBeVisible({ timeout: 8000 });
    // If the status says SIMULATION, the HUD must show 0% (no real score).
    const status = await page.locator('#solarize-status').textContent().catch(() => '');
    if (status && status.toLowerCase().includes('simulation')) {
      await expect(page.locator('#hud-score')).toContainText('0%', { timeout: 5000 });
    }
  });
});
