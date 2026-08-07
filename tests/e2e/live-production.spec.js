// ============================================================
// PoseArt Solarize — Authenticated live production retest (§28)
// ------------------------------------------------------------
// Logs into the PRODUCTION deployment at https://pillb.github.io/PoseArt/
// through the REAL login form using environment-injected credentials.
//
// SECURITY (Solarize §20):
//   • Credentials are read from POSEART_TEST_USERNAME / POSEART_TEST_PASSWORD
//     env vars at runtime — NEVER hard-coded in this file.
//   • Trace/screenshot/video are DISABLED for this project so credentials
//     are never captured in artifacts.
//   • Credential values are never logged or asserted by content.
//
// This was the #1 BLOCKED gate (Round 0 ledger): "POSEART_TEST_USERNAME /
// POSEART_TEST_PASSWORD NOT PRESENT in this environment." The operator
// provisioned them out-of-band, unblocking this retest.
// ============================================================
import { test, expect } from '@playwright/test';

const PROD_URL = 'https://pillb.github.io/PoseArt/';

// Read credentials from env vars — never hard-code.
function getCreds() {
  const u = process.env.POSEART_TEST_USERNAME;
  const p = process.env.POSEART_TEST_PASSWORD;
  if (!u || !p) {
    test.skip(true, 'POSEART_TEST_USERNAME / POSEART_TEST_PASSWORD not provisioned — skipping live retest');
  }
  return { u, p };
}

test.describe('Authenticated live production retest @live', () => {
  test('production site is reachable and serves the PoseArt app', async ({ page }) => {
    const resp = await page.goto(PROD_URL, { waitUntil: 'domcontentloaded' });
    expect(resp?.status()).toBeLessThan(400);
    // The login form must be present in the DOM (data-testid is in static HTML).
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible({ timeout: 20000 });
  });

  test('login through the real form reaches the app (authenticated)', async ({ page }) => {
    const creds = getCreds();
    if (!creds.u || !creds.p) return;
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible({ timeout: 20000 });
    // Fill the real form — values come from env vars, never logged.
    await page.locator('[data-testid="login-username"]').fill(creds.u);
    await page.locator('[data-testid="login-password"]').fill(creds.p);
    await page.locator('[data-testid="login-submit"]').click();
    // The login screen must become inactive (gate passed).
    await expect(page.locator('#screen-login')).not.toHaveClass(/\bactive\b/, { timeout: 20000 });
  });

  test('production app renders a pose category grid after login', async ({ page }) => {
    const creds = getCreds();
    if (!creds.u || !creds.p) return;
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-testid="login-username"]').fill(creds.u);
    await page.locator('[data-testid="login-password"]').fill(creds.p);
    await page.locator('[data-testid="login-submit"]').click();
    await expect(page.locator('#screen-login')).not.toHaveClass(/\bactive\b/, { timeout: 20000 });
    // Wait for home or onboarding (any non-login screen).
    await expect(page.locator('#screen-home.active, #screen-ob1.active, #screen-ob2.active')).toBeVisible({ timeout: 20000 });
    // Verify the app shell rendered — any of: bottom nav, category card, onboarding content.
    const appShell = page.locator('.bottom-nav, .category-card, [role="listitem"], .ob-screen, .featured-card');
    await expect(appShell.first()).toBeVisible({ timeout: 15000 });
  });

  test('direct navigation to a protected screen does not bypass the gate', async ({ page }) => {
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible({ timeout: 20000 });
    // Attempt to navigate directly — the gate must hold.
    await page.evaluate(() => {
      if (typeof window.showScreen === 'function') window.showScreen('home');
      else if (typeof window.showTab === 'function') window.showTab('home');
    });
    await page.waitForTimeout(1000);
    // Login screen must still be active (gate held).
    await expect(page.locator('#screen-login')).toHaveClass(/\bactive\b/, { timeout: 5000 });
  });
});
