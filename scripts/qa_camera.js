const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERR: ' + e.message));
  const shot = async n => { await page.screenshot({ path: `/home/user/workspace/qa_${n}.png` }); };

  await page.goto('http://127.0.0.1:3200', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.completeOnboardingSkip());
  await page.waitForTimeout(300);

  // Open pose detail sheet
  await page.evaluate(() => window.openPoseDetail('scurve-stand'));
  await page.waitForTimeout(500);
  await shot('cam_01_pose_sheet');
  const sheetVisible = await page.evaluate(() => {
    const s = document.getElementById('pose-detail-sheet');
    return s ? getComputedStyle(s).transform : 'no-el';
  });
  console.log('pose sheet transform:', sheetVisible);

  // Go to session setup
  await page.evaluate(() => window.goToSession('scurve-stand'));
  await page.waitForTimeout(500);
  await shot('cam_02_session_setup');
  const setupVisible = await page.evaluate(() =>
    [...document.querySelectorAll('.screen')].filter(s => s.classList.contains('active')).map(s=>s.id));
  console.log('active screen after goToSession:', JSON.stringify(setupVisible));

  // Start camera session (will go to demo mode since no camera in headless)
  await page.evaluate(() => window.startCameraSession && window.startCameraSession());
  await page.waitForTimeout(2500);
  await shot('cam_03_camera');
  const camState = await page.evaluate(() => {
    const cam = document.getElementById('screen-camera');
    const sim = document.getElementById('sim-backdrop');
    const ghost = document.getElementById('ghost-canvas');
    const skel = document.getElementById('skeleton-canvas');
    return {
      cameraActive: cam ? cam.classList.contains('active') : 'no-el',
      simDisplay: sim ? getComputedStyle(sim).display : 'no-el',
      ghostZ: ghost ? getComputedStyle(ghost).zIndex : 'no-el',
      skelZ: skel ? getComputedStyle(skel).zIndex : 'no-el',
      engineRunning: window.cameraEngine ? (window.cameraEngine.running || window.cameraEngine.isRunning || 'n/a') : 'no-engine',
    };
  });
  console.log('camera state:', JSON.stringify(camState));

  await page.waitForTimeout(2000);
  await shot('cam_04_camera_later');

  console.log('=== ERRORS: ' + errors.length + ' ===');
  errors.forEach(e => console.log('  ', e));
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
