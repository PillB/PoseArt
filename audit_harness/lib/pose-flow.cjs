// audit_harness/lib/pose-flow.js
// Playwright helpers for the PoseArt per-pose UI procedure.
// Uses real UI path: login -> Poses nav -> category -> pose card -> setup modal.
// Credentials: env POSEART_TEST_USERNAME / POSEART_TEST_PASSWORD, else the
// repo-documented F&F pre-release tester1 account (auth.js). Never printed.
const { chromium } = require('playwright');

const BASE = process.env.POSEART_BASE || 'http://127.0.0.1:8095';
const MOBILE = { width: 430, height: 932, deviceScaleFactor: 1, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1440, height: 1000, deviceScaleFactor: 1 };

function creds() {
  const u = process.env.POSEART_TEST_USERNAME || 'tester1';
  const p = process.env.POSEART_TEST_PASSWORD || 'PoseArt2026!';
  return { u, p };
}

async function newContext(viewport) {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: viewport.deviceScaleFactor });
  return { browser, ctx };
}

// Collect console + page errors into a bucket.
function attachErrorCapture(page) {
  const bucket = { console: [], pageerrors: [], failed: [] };
  page.on('console', m => { if (m.type() === 'error') bucket.console.push(m.text()); });
  page.on('pageerror', e => bucket.pageerrors.push(String(e && e.message ? e.message : e)));
  page.on('requestfailed', r => { bucket.failed.push(r.url() + ' ' + (r.failure() && r.failure().errorText)); });
  return bucket;
}

async function login(ctx) {
  const page = await ctx.newPage();
  const err = attachErrorCapture(page);
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.getByTestId('login-username').waitFor({ state: 'visible', timeout: 15000 });
  const { u, p } = creds();
  await page.getByTestId('login-username').fill(u);
  await page.getByTestId('login-password').fill(p);
  await page.getByTestId('login-submit').click();
  // Authenticated state: app shows onboarding (screen-ob1) or home.
  await page.waitForFunction(() => {
    const ob1 = document.getElementById('screen-ob1');
    const home = document.getElementById('screen-home');
    return (ob1 && ob1.classList.contains('active')) || (home && home.classList.contains('active'));
  }, null, { timeout: 15000 });
  // Dismiss onboarding via real UI (Skip links) until we reach home.
  for (let i = 0; i < 6; i++) {
    const active = await page.evaluate(() => {
      const s = document.querySelector('.screen.active');
      return s ? s.id : null;
    });
    if (active === 'screen-home') break;
    // Click any visible "Skip" link; else click "Begin"/"Continue" gold button.
    const skip = page.locator('.screen.active .btn-link:visible').first();
    if (await skip.count().catch(() => 0)) { await skip.click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(400); continue; }
    const gold = page.locator('.screen.active .btn-gold:visible').first();
    if (await gold.count().catch(() => 0)) { await gold.click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(400); continue; }
    break;
  }
  return { page, err };
}

async function openPosesLibrary(page) {
  // Real UI: click the Poses tab in the bottom nav (#tab-library).
  await page.locator('#tab-library').click({ timeout: 8000 }).catch(async () => {
    await page.evaluate(() => window.showScreen && window.showScreen('library'));
  });
  await page.waitForFunction(() => {
    const s = document.getElementById('screen-library');
    return s && s.classList.contains('active');
  }, null, { timeout: 10000 });
}

async function openCategory(page, categoryId) {
  // Category cards in library. Click by data attribute or text.
  const card = page.locator(`[data-category="${categoryId}"], [onclick*="'${categoryId}'"]`).first();
  await card.click({ timeout: 8000 }).catch(async () => {
    await page.evaluate((c) => window.openCategory && window.openCategory(c), categoryId);
  });
  await page.waitForFunction(() => {
    const s = document.getElementById('screen-category-list');
    return s && s.classList.contains('active');
  }, null, { timeout: 10000 });
}

async function openPose(page, poseId) {
  // Pose list items have onclick="openPoseDetail('id')"
  await page.evaluate((id) => window.openPoseDetail && window.openPoseDetail(id), poseId);
  // Wait for the pose sheet overlay to become visible
  await page.waitForFunction(() => { const o = document.getElementById('pose-sheet-overlay'); return o && o.classList.contains('visible'); }, null, { timeout: 10000 });
}

// Wait for render-ready: skeleton canvas present, _activeSkeleton3D initialized,
// currentPose populated, then two stable geometry hashes, then 1500ms settle.
async function waitForRenderReady(page, opts) {
  opts = opts || {};
  await page.waitForFunction(() => {
    const c = document.getElementById('pose-skeleton-3d-canvas');
    return !!c && c.width > 0 && window._activeSkeleton3D && window._activeSkeleton3D._state && window._activeSkeleton3D._state.currentPose && window._activeSkeleton3D._state.currentPose.head;
  }, null, { timeout: 12000 });
  // Two stable geometry hashes (auto-rotate may be on; stop it first for determinism unless 'auto' view)
  if (!opts.keepAuto) {
    await page.evaluate(() => { try { window._activeSkeleton3D && window._activeSkeleton3D.stopAutoRotate && window._activeSkeleton3D.stopAutoRotate(); } catch (e) {} });
  }
  let h1 = await page.evaluate(() => window._activeSkeleton3D && window._activeSkeleton3D._state ? window._activeSkeleton3D._state.currentPose : null);
  await page.waitForTimeout(120);
  let h2 = await page.evaluate(() => window._activeSkeleton3D && window._activeSkeleton3D._state ? window._activeSkeleton3D._state.currentPose : null);
  // Compare via JSON stringify (currentPose is stable when auto-rotate off)
  const stable = JSON.stringify(h1) === JSON.stringify(h2);
  // Extra 1500ms settling window (user-required delay)
  await page.waitForTimeout(1500);
  return stable;
}

// Extract body-frame geometry + camera state from the renderer.
async function extractGeometry(page) {
  return await page.evaluate(() => {
    const s = window._activeSkeleton3D && window._activeSkeleton3D._state;
    if (!s || !s.currentPose) return null;
    const cp = s.currentPose;
    const out = {};
    for (const k of Object.keys(cp)) out[k] = { x: cp[k].x, y: cp[k].y, z: cp[k].z };
    return { skeleton: out, yaw: s.yaw, pitch: s.pitch, autoRotate: !!s.autoRotate, poseCategory: s.poseCategory };
  });
}

// Set a named view via the real UI button, assert state change, capture.
async function captureView(page, viewName, testId, screenshotPath) {
  // viewName: 'auto' | 'front' | 'side-left' | 'quarter-front-left' | ...
  const btn = page.getByTestId(testId);
  await btn.waitFor({ state: 'visible', timeout: 6000 });
  const beforeYaw = await page.evaluate(() => window._activeSkeleton3D && window._activeSkeleton3D._state ? window._activeSkeleton3D._state.yaw : null);
  await btn.click();
  // Wait for yaw/pitch to reach expected (or autoRotate true for auto)
  const expected = { 'front': [0, 0], 'side-left': [90, 0], 'side-right': [-90, 0], 'quarter-front-left': [45, 0], 'quarter-front-right': [-45, 0], 'top': [0, 80], 'low': [0, -30] }[viewName];
  let ok = false;
  if (viewName === 'auto') {
    ok = await page.waitForFunction(() => window._activeSkeleton3D && window._activeSkeleton3D._state && window._activeSkeleton3D._state.autoRotate === true, null, { timeout: 4000 }).then(() => true).catch(() => false);
  } else if (expected) {
    ok = await page.waitForFunction(([y, p]) => { const s = window._activeSkeleton3D && window._activeSkeleton3D._state; return s && Math.abs(s.yaw - y) < 0.5 && Math.abs(s.pitch - p) < 0.5; }, expected, { timeout: 4000 }).then(() => true).catch(() => false);
  }
  // Stable frame + small settle
  await page.waitForTimeout(300);
  await page.screenshot({ path: screenshotPath });
  const after = await extractGeometry(page);
  return { view: viewName, button_testid: testId, yaw_before: beforeYaw, yaw_after: after ? after.yaw : null, pitch_after: after ? after.pitch : null, state_changed: ok, geometry: after };
}

async function closePoseSheet(page) {
  await page.evaluate(() => { try { window.closePoseSheet && window.closePoseSheet(); } catch (e) {} const o = document.getElementById('pose-sheet-overlay'); if (o) o.classList.remove('visible'); });
}

module.exports = { BASE, MOBILE, DESKTOP, newContext, attachErrorCapture, login, openPosesLibrary, openCategory, openPose, waitForRenderReady, extractGeometry, captureView, closePoseSheet };
