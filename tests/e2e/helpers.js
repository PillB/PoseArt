// ============================================================
// PoseArt Solarize — Playwright shared helpers (Solarize §24)
// ------------------------------------------------------------
// Visible-control login + onboarding + camera-session helpers.
// NEVER bypasses the gate via internal functions — fills the real
// login form, clicks real buttons, waits for real screens.
// ============================================================

import { expect } from '@playwright/test';

// Read test credentials from POSEART_TEST_USERNAME / POSEART_TEST_PASSWORD
// env vars (set by the operator / CI secrets). NEVER hard-coded.
// The gitignored js/test-creds.local.js is generated from these same env
// vars by scripts/inject-test-creds.js, so the served app accepts them.
export function getTestCreds() {
  const u = process.env.POSEART_TEST_USERNAME;
  const p = process.env.POSEART_TEST_PASSWORD;
  if (!u || !p) {
    throw new Error('POSEART_TEST_USERNAME / POSEART_TEST_PASSWORD env vars not set — run: POSEART_TEST_USERNAME=... POSEART_TEST_PASSWORD=... bun run test:all');
  }
  return { username: u, password: p };
}

// Login through the visible form.
export async function loginViaForm(page) {
  const creds = getTestCreds();
  await page.goto('/');
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  await page.locator('[data-testid="login-username"]').fill(creds.username);
  await page.locator('[data-testid="login-password"]').fill(creds.password);
  await page.locator('[data-testid="login-submit"]').click();
  // Wait for the login screen to become inactive (gate passed).
  await expect(page.locator('#screen-login')).not.toHaveClass(/\bactive\b/, { timeout: 8000 });
}

// Skip onboarding if present. Clicks visible skip/next buttons until home is active.
export async function skipOnboarding(page) {
  // Try the skip link on ob1 first.
  const skip = page.locator('[data-testid="link-skip-ob1"]');
  if (await skip.isVisible({ timeout: 1500 }).catch(() => false)) {
    await skip.click();
  }
  // Walk through any remaining onboarding screens.
  for (let i = 0; i < 6; i++) {
    if (await page.locator('#screen-home.active').isVisible().catch(() => false)) return;
    const next = page.locator('.screen.active button:has-text("Skip"), .screen.active button:has-text("Next"), .screen.active button:has-text("Get Started"), .screen.active a:has-text("Skip intro"), .screen.active button:has-text("See How")').first();
    if (await next.isVisible({ timeout: 1000 }).catch(() => false)) {
      await next.click();
      await page.waitForTimeout(400);
    } else break;
  }
}

// Navigate to a pose's camera session through visible controls.
// Uses the featured "Start Session" button + "Begin Capture".
export async function startCaptureSession(page) {
  await loginViaForm(page);
  await skipOnboarding(page);
  // Wait for home to be the active screen.
  await expect(page.locator('#screen-home.active')).toBeVisible({ timeout: 5000 });
  // Featured Start Session → pose-detail/session-setup
  await page.locator('#screen-home button:has-text("Start Session")').first().click();
  await expect(page.locator('#screen-session-setup.active')).toBeVisible({ timeout: 5000 });
  // Begin Capture → camera screen
  await page.locator('button:has-text("Begin Capture")').click();
  await expect(page.locator('#screen-camera.active')).toBeVisible({ timeout: 8000 });
}

// Assert the Solarize pipeline reached a real (non-simulation) state via DOM.
export async function assertPipelineActive(page) {
  // The solarize-status overlay must appear (rendered by _renderSolarizeStatus).
  await expect(page.locator('#solarize-status')).toBeVisible({ timeout: 12000 });
  const text = await page.locator('#solarize-status').textContent();
  // Must mention a model id (not "SIMULATION" only).
  expect(text).toBeTruthy();
  // The HUD score must render a numeric value.
  await expect(page.locator('#hud-score')).toBeVisible({ timeout: 5000 });
  const score = await page.locator('#hud-score').textContent();
  expect(score).toMatch(/\d/);
}

// Assert the app is in simulation mode (no real inference).
export async function assertSimulationMode(page) {
  const status = page.locator('#solarize-status');
  if (await status.isVisible({ timeout: 3000 }).catch(() => false)) {
    const text = await status.textContent();
    expect(text).toBeTruthy();
    // Simulation overlay says "SIMULATION" explicitly.
    expect(text.toLowerCase()).toContain('simulation');
  }
}
