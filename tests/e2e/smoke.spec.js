// ============================================================
// PoseArt Solarize — source smoke test (Solarize §26 / D24 fix)
// ------------------------------------------------------------
// Lenient checks against the source tree (before credential
// injection + build-id population). Verifies:
//   • the login gate is the initial active screen
//   • the preview-gate disclosure is rendered
//   • the build-id <meta> tag EXISTS (content may be empty
//     in dev — the publication project checks non-empty)
//   • the auth gate blocks direct navigation to a protected
//     screen (showTab/showScreen redirect to login)
// ============================================================
import { test, expect } from '@playwright/test';

test.describe('source smoke — gate + disclosure + build-id meta', () => {
  test('login screen is the initial active screen', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('#login-title')).toContainText('Pose');
  });

  test('preview-gate disclosure is rendered in the login panel', async ({ page }) => {
    await page.goto('/');
    const disclosure = page.locator('[data-testid="login-disclosure"]');
    await expect(disclosure).toContainText('Invite-only preview gate');
    await expect(disclosure).toContainText('Not production authentication');
  });

  test('build-id meta tag is present in the document head', async ({ page }) => {
    await page.goto('/');
    const meta = page.locator('meta[name="poseart-build-id"]');
    await expect(meta).toHaveCount(1);
    const content = await meta.getAttribute('content');
    expect(typeof content).toBe('string');
  });

  test('direct navigation to a protected screen does not bypass the gate', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      if (typeof window.showTab === 'function') window.showTab('home');
    });
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test('login fails closed when no credentials are provisioned', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="login-username"]').fill('anyone');
    await page.locator('[data-testid="login-password"]').fill('anything');
    await page.locator('[data-testid="login-submit"]').click();
    const error = page.locator('[data-testid="login-error"]');
    await expect(error).toBeVisible();
    const text = (await error.textContent()) || '';
    expect(
      text.includes('not provisioned') || text.includes('incorrect') || text.includes('Enter both'),
    ).toBe(true);
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });
});
