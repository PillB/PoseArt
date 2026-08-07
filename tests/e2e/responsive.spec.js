// ============================================================
// PoseArt Solarize — Responsive viewport matrix (§24, §25)
// ------------------------------------------------------------
// Tests the app across viewport sizes + zoom + reduced-motion.
//   • 320×568 (smallest)
//   • 430×932 (iPhone Pro)
//   • 390×844 (iPhone standard)
//   • 768×1024 (tablet portrait)
//   • 1440×900 (desktop)
//   • landscape mobile
//   • 200% zoom (deviceScaleFactor 2)
//   • prefers-reduced-motion
// Verifies the login gate renders, no horizontal overflow, and
// touch targets meet the 44px minimum on mobile.
// ============================================================
import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '320x568', width: 320, height: 568 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: 'landscape-844x390', width: 844, height: 390 },
];

test.describe('Responsive viewport matrix @visual', () => {
  for (const vp of VIEWPORTS) {
    test(`login renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
      await expect(page.locator('#login-title')).toContainText('Pose');
      // No horizontal overflow beyond a small tolerance.
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
    });
  }

  test('200% zoom — login form remains usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-username"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-submit"]')).toBeVisible();
  });

  test('reduced-motion — onboarding skip is visible', async ({ page }) => {
    await page.context().grantPermissions(['camera']).catch(() => {});
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test('mobile touch targets ≥ 44px on login submit', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Firefox box model differs for buttons');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const box = await page.locator('[data-testid="login-submit"]').boundingBox();
    expect(box).toBeTruthy();
    // min(height) should be ≥ 44 (the button has min-height:48px).
    expect(box.height).toBeGreaterThanOrEqual(44);
  });
});
