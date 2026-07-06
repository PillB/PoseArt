const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    isMobile: true,
    hasTouch: true,
    permissions: [], // deny camera to force demo mode path
  });
  const page = await context.newPage();

  const errors = [];
  const warnings = [];
  page.on('console', msg => {
    const t = msg.type();
    if (t === 'error') errors.push(msg.text());
    else if (t === 'warning') warnings.push(msg.text());
  });
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));

  const URL = 'http://127.0.0.1:3200';
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  console.log('=== TITLE ===', await page.title());

  // Check key globals exist
  const globals = await page.evaluate(() => ({
    AppState: typeof window.AppState,
    showTab: typeof window.showTab,
    POSES_LIBRARY: typeof window.POSES_LIBRARY !== 'undefined' ? window.POSES_LIBRARY.length : 'undef',
    cameraEngine: typeof window.cameraEngine,
    completeOnboardingSkip: typeof window.completeOnboardingSkip,
    getGallery: typeof window.getGallery,
  }));
  console.log('=== GLOBALS ===', JSON.stringify(globals));

  // Screenshot initial (onboarding OB-1)
  await page.screenshot({ path: '/home/user/workspace/qa_01_splash.png' });

  console.log('=== CONSOLE ERRORS (' + errors.length + ') ===');
  errors.forEach(e => console.log('  ERR:', e));
  console.log('=== CONSOLE WARNINGS (' + warnings.length + ') ===');
  warnings.slice(0, 10).forEach(w => console.log('  WARN:', w));

  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
