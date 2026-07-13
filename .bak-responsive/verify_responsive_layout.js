#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = process.env.POSEART_URL || 'http://127.0.0.1:8095/index.html';
const OUT = path.join(ROOT, 'audit', 'screenshots', 'responsive-layout');
const RESULT = path.join(ROOT, 'audit', 'results', 'responsive-layout.json');
const viewports = [
  { id: 'phone-390x844', width: 390, height: 844, mobile: true },
  { id: 'phone-430x932', width: 430, height: 932, mobile: true },
  { id: 'tablet-768x1024', width: 768, height: 1024 },
  { id: 'laptop-1280x720', width: 1280, height: 720 },
  { id: 'macbook-1366x768', width: 1366, height: 768 },
  { id: 'desktop-1440x900', width: 1440, height: 900 },
  { id: 'macbook-1728x1117', width: 1728, height: 1117 },
];
const screens = [
  { id: 'login', open: async page => { await page.evaluate(() => { sessionStorage.clear(); window.showScreen('login'); }); } },
  { id: 'home', open: async page => page.evaluate(() => window.showTab('home')) },
  { id: 'library', open: async page => page.evaluate(() => window.showTab('library')) },
  { id: 'category', open: async page => page.evaluate(() => window.openCategory('standing')) },
  { id: 'pose-detail', open: async page => page.evaluate(() => window.openPoseDetail('scurve-stand')) },
  { id: 'gallery', open: async page => page.evaluate(() => window.showTab('gallery')) },
  { id: 'profile', open: async page => page.evaluate(() => window.showTab('profile')) },
  { id: 'editor', open: async page => page.evaluate(() => window.openPoseEditor()) },
  { id: 'marketplace', open: async page => page.evaluate(() => window.openMarketplace()) },
  { id: 'camera', open: async page => page.evaluate(() => window.showScreen('camera')) },
  { id: 'tour-creator', open: async page => page.evaluate(() => window.openTourCreator()) },
  { id: 'tour-session', open: async page => page.evaluate(() => window.showScreen('tour-session')) },
];

function assert(condition, message) { if (!condition) throw new Error(message); }

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(path.dirname(RESULT), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { url: URL, generatedAt: new Date().toISOString(), formats: [], failures: [] };
  try {
    for (const format of viewports) {
      const context = await browser.newContext({ viewport: { width: format.width, height: format.height }, isMobile: !!format.mobile, hasTouch: !!format.mobile, deviceScaleFactor: 1 });
      await context.addInitScript(() => localStorage.setItem('poseart_onboardingCompleted', 'true'));
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.goto(URL, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => sessionStorage.setItem('poseart_auth_session', JSON.stringify({ version: 1, user: atob('dGVzdGVyMQ=='), authenticatedAt: Date.now() })));
      await page.reload({ waitUntil: 'domcontentloaded' });
      const formatResult = { ...format, screens: [], errors };

      for (const screen of screens) {
        try {
          await screen.open(page);
          await page.waitForTimeout(120);
          const geometry = await page.evaluate(screenId => {
            const app = document.getElementById('app');
            const active = document.querySelector('.screen.active');
            const appRect = app.getBoundingClientRect();
            const activeRect = active?.getBoundingClientRect();
            const tourButtons = screenId === 'tour-session'
              ? [...document.querySelectorAll('#screen-tour-session button')].filter(button => getComputedStyle(button).display !== 'none').map(button => {
                  const rect = button.getBoundingClientRect(); return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
                }) : [];
            const categoryColumns = getComputedStyle(document.querySelector('.category-grid')).gridTemplateColumns.split(' ').filter(Boolean).length;
            return {
              viewport: { width: innerWidth, height: innerHeight },
              app: { x: appRect.x, y: appRect.y, width: appRect.width, height: appRect.height, right: appRect.right, bottom: appRect.bottom },
              activeId: active?.id,
              active: activeRect ? { width: activeRect.width, height: activeRect.height, scrollWidth: active.scrollWidth, clientWidth: active.clientWidth } : null,
              document: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
              categoryColumns,
              tourButtons,
            };
          }, screen.id);

          assert(geometry.app.x >= -1 && geometry.app.y >= -1, `${format.id}/${screen.id}: app starts outside viewport`);
          assert(geometry.app.right <= format.width + 1 && geometry.app.bottom <= format.height + 1, `${format.id}/${screen.id}: app exceeds viewport (${geometry.app.right}×${geometry.app.bottom})`);
          assert(geometry.document.scrollWidth <= format.width + 1 && geometry.document.scrollHeight <= format.height + 1, `${format.id}/${screen.id}: document overflow`);
          assert(geometry.active && geometry.active.scrollWidth <= geometry.active.clientWidth + 1, `${format.id}/${screen.id}: active screen horizontal overflow`);
          if (format.width >= 768) assert(geometry.app.width >= Math.min(900, format.width - 32), `${format.id}/${screen.id}: desktop shell stayed mobile width (${geometry.app.width})`);
          if (format.width <= 430) assert(Math.abs(geometry.app.width - format.width) <= 1, `${format.id}/${screen.id}: mobile shell no longer edge-to-edge`);
          if (format.width >= 1024 && screen.id === 'home') assert(geometry.categoryColumns >= 4, `${format.id}/home: desktop category grid did not expand`);
          if (screen.id === 'tour-session') {
            geometry.tourButtons.forEach((rect, index) => {
              assert(rect.top >= geometry.app.y - 1 && rect.bottom <= geometry.app.bottom + 1, `${format.id}/tour-session: button ${index} is vertically unreachable`);
              assert(rect.left >= geometry.app.x - 1 && rect.right <= geometry.app.right + 1, `${format.id}/tour-session: button ${index} is horizontally outside app`);
            });
          }
          const file = `${format.id}-${screen.id}.png`;
          await page.screenshot({ path: path.join(OUT, file), animations: 'disabled' });
          formatResult.screens.push({ id: screen.id, file, geometry, pass: true });
        } catch (error) {
          formatResult.screens.push({ id: screen.id, pass: false, error: error.message });
          report.failures.push({ format: format.id, screen: screen.id, error: error.message });
        }
      }
      report.formats.push(formatResult);
      await context.close();
    }
  } finally { await browser.close(); }
  report.summary = { formats: report.formats.length, checks: report.formats.reduce((sum, format) => sum + format.screens.length, 0), screenshots: report.formats.reduce((sum, format) => sum + format.screens.filter(screen => screen.file).length, 0), failures: report.failures.length, browserErrors: report.formats.reduce((sum, format) => sum + format.errors.length, 0) };
  fs.writeFileSync(RESULT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.summary));
  if (report.summary.failures || report.summary.browserErrors) process.exit(1);
})().catch(error => { console.error(error.stack || error.message); process.exit(1); });
