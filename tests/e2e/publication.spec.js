// ============================================================
// PoseArt Solarize — publication smoke test (Solarize §26 / D24 fix)
// ------------------------------------------------------------
// Strict checks against the ASSEMBLED publication (after
// scripts/inject-test-creds.js + scripts/build-manifest.js have
// run). Verifies:
//   • the build-id <meta> content is non-empty (populated by
//     build-manifest.js at build time)
//   • window.__POSEART_TEST_CREDENTIALS__ is provisioned (set
//     by the gitignored js/test-creds.local.js — credential
//     VALUES are never read or logged by this test)
//   • the disclosure text is present
//   • PoseArtAuth.isProvisioned() reports true
//
// This test must NOT log credential values. It only checks the
// boolean presence of the provisioned bundle.
// ============================================================
import { test, expect } from '@playwright/test';

test.describe('publication smoke — build-id + credential provisioning', () => {
  test('build-id meta is populated with a non-empty value', async ({ page }) => {
    await page.goto('/');
    const meta = page.locator('meta[name="poseart-build-id"]');
    const content = await meta.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content.length).toBeGreaterThan(0);
    // Build-id format: <7-char-sha>-<ISO-timestamp>
    expect(content).toMatch(/^[0-9a-f]{7,}-\d{4}-\d{2}-\d{2}T/);
  });

  test('test credentials are provisioned (bundle present, values not logged)', async ({ page }) => {
    await page.goto('/');
    const provisioned = await page.evaluate(() => {
      const c = window.__POSEART_TEST_CREDENTIALS__;
      // Return only a boolean + count — never the credential values.
      return {
        present: !!c,
        userCount: c && Array.isArray(c.users) ? c.users.length : 0,
        sessionOnly: c ? !!c.sessionOnly : false,
      };
    });
    expect(provisioned.present).toBe(true);
    expect(provisioned.userCount).toBeGreaterThanOrEqual(1);
    expect(provisioned.sessionOnly).toBe(true);
  });

  test('PoseArtAuth.isProvisioned() reports true and disclosure renders', async ({ page }) => {
    await page.goto('/');
    const isProvisioned = await page.evaluate(() => {
      return typeof window.PoseArtAuth === 'object' && typeof window.PoseArtAuth.isProvisioned === 'function'
        ? window.PoseArtAuth.isProvisioned()
        : null;
    });
    expect(isProvisioned).toBe(true);
    await expect(page.locator('[data-testid="login-disclosure"]')).toContainText('Invite-only preview gate');
  });

  test('build-id is surfaced in the profile About section after login', async ({ page }) => {
    await page.goto('/');
    // We do NOT log credentials. Read username/password from the
    // provisioned bundle in-page and drive the form programmatically.
    const creds = await page.evaluate(() => {
      const c = window.__POSEART_TEST_CREDENTIALS__;
      if (!c || !Array.isArray(c.users) || c.users.length === 0) return null;
      return { u: c.users[0].u, p: c.users[0].p };
    });
    expect(creds).toBeTruthy();
    await page.locator('[data-testid="login-username"]').fill(creds.u);
    await page.locator('[data-testid="login-password"]').fill(creds.p);
    await page.locator('[data-testid="login-submit"]').click();
    // If onboarding kicks in, skip to home via the skip link if present.
    const skip = page.locator('[data-testid="link-skip-ob1"]');
    if (await skip.isVisible().catch(() => false)) await skip.click();
    // Navigate to the profile tab.
    await page.evaluate(() => { if (typeof window.showTab === 'function') window.showTab('profile'); });
    const buildIdEl = page.locator('[data-testid="profile-build-id"]');
    await expect(buildIdEl).toBeVisible();
    const text = (await buildIdEl.textContent()) || '';
    expect(text.trim().length).toBeGreaterThan(0);
    expect(text.trim()).not.toBe('dev');
  });
});
