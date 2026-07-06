const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    isMobile: true, hasTouch: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERR: ' + e.message));

  const URL = 'http://127.0.0.1:3200';
  const shot = async n => { await page.screenshot({ path: `/home/user/workspace/qa_${n}.png` }); console.log('shot', n); };

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot('flow_01_ob1');

  // Onboarding: try to advance. Check what's visible.
  const visible = await page.evaluate(() => {
    const screens = [...document.querySelectorAll('[id^="screen-"]')];
    const shown = screens.filter(s => {
      const st = getComputedStyle(s);
      return st.display !== 'none' && st.visibility !== 'hidden' && s.offsetParent !== null;
    }).map(s => s.id);
    return { shown, onboardingActive: window.AppState && window.AppState.onboardingStep };
  });
  console.log('VISIBLE INITIAL:', JSON.stringify(visible));

  // Skip onboarding directly to home
  await page.evaluate(() => window.completeOnboardingSkip && window.completeOnboardingSkip());
  await page.waitForTimeout(600);
  await shot('flow_02_home');
  console.log('after skip visible:', JSON.stringify(await page.evaluate(() => {
    return [...document.querySelectorAll('[id^="screen-"]')].filter(s => s.offsetParent !== null).map(s=>s.id);
  })));

  // Go to Poses (library)
  await page.evaluate(() => window.showTab('library'));
  await page.waitForTimeout(500);
  await shot('flow_03_library');
  const catCount = await page.evaluate(() => document.querySelectorAll('#category-grid > *').length);
  console.log('category cards:', catCount);

  // Search
  await page.evaluate(() => window.searchPoses('stand'));
  await page.waitForTimeout(400);
  await shot('flow_04_search');
  const searchResults = await page.evaluate(() => document.querySelectorAll('#search-results > *').length);
  console.log('search results for "stand":', searchResults);

  // Open a category
  await page.evaluate(() => window.openCategory('standing'));
  await page.waitForTimeout(400);
  await shot('flow_05_category');
  const catList = await page.evaluate(() => document.querySelectorAll('#cat-pose-list > *').length);
  console.log('poses in standing category:', catList);

  // Gallery (empty state)
  await page.evaluate(() => window.showTab('gallery'));
  await page.waitForTimeout(400);
  await shot('flow_06_gallery_empty');
  const galleryEmpty = await page.evaluate(() => {
    const e = document.getElementById('gallery-empty');
    return e ? getComputedStyle(e).display !== 'none' : 'no-el';
  });
  console.log('gallery empty visible:', galleryEmpty);

  // Add a fake gallery item then re-render
  await page.evaluate(() => {
    window.addToGallery({ id: 'test1', dataUrl: '', isSim: true, poseId: 'scurve-stand', poseName: 'S-Curve Stand', score: 92, timestamp: Date.now(), filter: 'none', favorite: false });
    window.renderGallery && window.renderGallery();
  });
  await page.waitForTimeout(400);
  await shot('flow_07_gallery_item');
  const galCount = await page.evaluate(() => document.querySelectorAll('#gallery-grid > *').length);
  console.log('gallery items after add:', galCount);

  // Progress tab
  await page.evaluate(() => window.showTab('progress'));
  await page.waitForTimeout(300);
  await shot('flow_08_progress');

  // Profile tab
  await page.evaluate(() => window.showTab('profile'));
  await page.waitForTimeout(300);
  await shot('flow_09_profile');

  console.log('=== TOTAL ERRORS: ' + errors.length + ' ===');
  errors.forEach(e => console.log('  ', e));

  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
