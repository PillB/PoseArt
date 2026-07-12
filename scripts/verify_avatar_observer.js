// Verify the MutationObserver-based avatar rendering works in the live app.
// Navigates to the home screen, waits for avatar canvases to render, and
// confirms they have been rendered (data-pose-rendered="1").

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
fs.mkdirSync(path.join(process.cwd(), 'audit', 'screenshots', 'v1.5'), { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => errors.push(`[pageerror] ${err.message}`));

  console.log('Loading app...');
  await page.goto('http://localhost:8095/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => { window.completeOnboardingSkip && window.completeOnboardingSkip(); });
  await page.waitForTimeout(800);

  // Check the home screen for avatar canvases
  console.log('\n=== Home screen avatar canvas check ===');
  const homeAvatars = await page.evaluate(() => {
    const canvases = document.querySelectorAll('canvas[data-pose-avatar="1"]');
    return Array.from(canvases).map(c => ({
      rendered: c.getAttribute('data-pose-rendered') === '1',
      width: c.width, height: c.height,
      hasJoints: c.getAttribute('data-pose-joints') ? true : false,
    }));
  });
  console.log(`Found ${homeAvatars.length} avatar canvases on home screen`);
  console.log(`Rendered: ${homeAvatars.filter(a => a.rendered).length} / ${homeAvatars.length}`);
  if (homeAvatars.length > 0) {
    console.log(`Sample:`, homeAvatars[0]);
  }

  // Navigate to library and check category grid
  console.log('\n=== Library screen avatar canvas check ===');
  await page.evaluate(() => { window.showTab && window.showTab('library'); });
  await page.waitForTimeout(500);
  const libAvatars = await page.evaluate(() => {
    const canvases = document.querySelectorAll('canvas[data-pose-avatar="1"]');
    return { total: canvases.length, rendered: Array.from(canvases).filter(c => c.getAttribute('data-pose-rendered') === '1').length };
  });
  console.log(`Library: ${libAvatars.rendered} / ${libAvatars.total} avatar canvases rendered`);

  // Open a category and check pose-list thumbnails
  console.log('\n=== Category list avatar canvas check ===');
  await page.evaluate(() => { window.openCategory && window.openCategory('standing'); });
  await page.waitForTimeout(800);
  const catAvatars = await page.evaluate(() => {
    const canvases = document.querySelectorAll('canvas[data-pose-avatar="1"]');
    return { total: canvases.length, rendered: Array.from(canvases).filter(c => c.getAttribute('data-pose-rendered') === '1').length };
  });
  console.log(`Category list: ${catAvatars.rendered} / ${catAvatars.total} avatar canvases rendered`);

  // Screenshot the category list to visually verify
  await page.screenshot({ path: path.join(process.cwd(), 'audit', 'screenshots', 'v1.5', 'category-list-standing.png'), fullPage: false });
  console.log('Screenshot: /home/z/my-project/audit/sprites-v8/category-list-standing.png');

  // Open a pose detail and check
  console.log('\n=== Pose detail avatar canvas check ===');
  await page.evaluate(() => { window.openPoseDetail && window.openPoseDetail('scurve-stand'); });
  await page.waitForTimeout(800);
  const detailAvatars = await page.evaluate(() => {
    const canvases = document.querySelectorAll('canvas[data-pose-avatar="1"]');
    return { total: canvases.length, rendered: Array.from(canvases).filter(c => c.getAttribute('data-pose-rendered') === '1').length };
  });
  console.log(`Pose detail: ${detailAvatars.rendered} / ${detailAvatars.total} avatar canvases rendered`);

  await page.screenshot({ path: path.join(process.cwd(), 'audit', 'screenshots', 'v1.5', 'pose-detail-scurve.png'), fullPage: false });
  console.log('Screenshot: /home/z/my-project/audit/sprites-v8/pose-detail-scurve.png');

  console.log('\n=== Console errors/warnings ===');
  errors.slice(0, 10).forEach(e => console.log(e));

  await browser.close();

  const totalAvatars = homeAvatars.length + libAvatars.total + catAvatars.total + detailAvatars.total;
  const totalRendered = homeAvatars.filter(a => a.rendered).length + libAvatars.rendered + catAvatars.rendered + detailAvatars.rendered;
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total avatar canvases found: ${totalAvatars}`);
  console.log(`Total rendered: ${totalRendered}`);
  console.log(`Render rate: ${totalAvatars > 0 ? (totalRendered/totalAvatars*100).toFixed(1) : 0}%`);
  if (totalRendered === totalAvatars && totalAvatars > 0) {
    console.log('✅ ALL AVATAR CANVASES RENDERED — MutationObserver fix working');
  } else {
    console.log('❌ Some avatar canvases not rendered');
  }
})();

