#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.POSEART_URL || 'http://127.0.0.1:8095/index.html';
const ROOT = path.resolve(__dirname, '..');
const SHOT_DIR = path.join(ROOT, 'audit', 'screenshots', 'auth-v25');
const RESULT_FILE = path.join(ROOT, 'audit', 'results', 'auth-v25.json');
const username = Buffer.from('dGVzdGVyMQ==', 'base64').toString('utf8');
const password = Buffer.from('UG9zZUFydDIwMjYh', 'base64').toString('utf8');

const devices = [
  { id: 'mobile', viewport: { width: 430, height: 932 }, mobile: true },
  { id: 'desktop', viewport: { width: 1440, height: 1000 }, mobile: false },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(RESULT_FILE), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const device of devices) {
      const context = await browser.newContext({
        viewport: device.viewport,
        deviceScaleFactor: device.mobile ? 2 : 1,
        isMobile: device.mobile,
        hasTouch: device.mobile,
      });
      const page = await context.newPage();
      const browserErrors = [];
      page.on('pageerror', error => browserErrors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') browserErrors.push(message.text());
      });

      const steps = [];
      async function capture(id, label) {
        const file = `${device.id}-${id}.png`;
        await page.screenshot({ path: path.join(SHOT_DIR, file), fullPage: true });
        steps.push({ id: `${device.id.toUpperCase()}-${id}`, label, file });
      }

      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      assert(await page.locator('#screen-login.active').count() === 1, 'Login screen is not the initial active screen');
      assert(await page.locator('#screen-ob1.active').count() === 0, 'Onboarding bypassed the login gate');
      await capture('AUTH-001', 'Login gate on first visit');

      await page.evaluate(() => window.showScreen('home'));
      assert(await page.locator('#screen-login.active').count() === 1, 'Direct navigation function bypassed authentication');
      await capture('AUTH-002', 'Direct navigation rejected');

      await page.getByTestId('login-submit').click();
      assert((await page.getByTestId('login-error').textContent()).includes('both username and password'), 'Empty credentials were not rejected');
      await capture('AUTH-003', 'Empty credentials rejected');

      await page.getByTestId('login-username').fill(username);
      await page.getByTestId('login-password').fill('incorrect-value');
      await page.getByTestId('login-submit').click();
      assert((await page.getByTestId('login-error').textContent()).includes('incorrect'), 'Incorrect password was not rejected');
      await capture('AUTH-004', 'Incorrect password rejected');

      await page.evaluate(() => localStorage.setItem('poseart_onboardingCompleted', 'true'));
      await page.getByTestId('login-password').fill(password);
      await page.getByTestId('login-submit').click();
      assert(await page.locator('#screen-home.active').count() === 1, 'Correct credentials did not enter the app');
      assert(await page.evaluate(() => window.PoseArtAuth.isLoggedIn()), 'Authenticated session was not created');
      await capture('AUTH-005', 'Correct credentials accepted');

      await page.reload({ waitUntil: 'networkidle' });
      assert(await page.locator('#screen-home.active').count() === 1, 'Session did not persist across refresh');
      assert(await page.evaluate(() => window.PoseArtAuth.getCurrentUser()) === username, 'Current user was not restored');
      await capture('AUTH-006', 'Session restored after refresh');

      await page.evaluate(() => window.showTab('profile'));
      await page.getByTestId('logout-button').click();
      assert(await page.locator('#screen-login.active').count() === 1, 'Logout did not return to login');
      assert(!(await page.evaluate(() => window.PoseArtAuth.isLoggedIn())), 'Logout did not clear sessionStorage');
      await capture('AUTH-007', 'Logout cleared the session');

      results.push({ device: device.id, viewport: device.viewport, steps, browserErrors });
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const summary = {
    baseUrl: BASE_URL,
    passed: results.every(result => result.browserErrors.length === 0),
    scenarios: 7,
    screenshots: results.reduce((sum, result) => sum + result.steps.length, 0),
    browserErrors: results.flatMap(result => result.browserErrors),
    results,
  };
  fs.writeFileSync(RESULT_FILE, JSON.stringify(summary, null, 2));
  console.log(`AUTH V2.5 PASS: ${summary.screenshots} screenshots, ${summary.browserErrors.length} browser errors`);
})().catch(error => {
  console.error(`AUTH V2.5 FAIL: ${error.stack || error.message}`);
  process.exit(1);
});
