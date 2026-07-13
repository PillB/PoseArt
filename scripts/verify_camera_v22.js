const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await context.addInitScript(() => { localStorage.clear(); localStorage.setItem('poseart_onboardingCompleted', 'true'); });
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  const errors = []; page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8095/index.html', { waitUntil: 'networkidle' });
  const timer = await page.evaluate(() => AppState.sessionOptions.timer[AppState.sessionOptions.timerIndex]);
  if (timer !== 'Off') throw new Error(`Fresh timer default is ${timer}`);
  await page.evaluate(() => {
    showScreen('camera'); AppState.selectedPoseId = 'scurve-stand';
    cameraEngine.captureImage = () => { window._captureCalls = (window._captureCalls || 0) + 1; };
    goToNextPose();
  });
  await page.waitForTimeout(300);
  if (!await page.getByTestId('next-pose-preview').isVisible()) throw new Error('Next-pose preview missing');
  if (!await page.locator('#next-pose-figure canvas').isVisible()) throw new Error('Next-pose canvas missing');
  const flowStart = await page.evaluate(() => AppState.selectedPoseId);
  await page.getByTestId('flow-mode-toggle').click();
  await page.evaluate(() => capturePhoto());
  await page.waitForTimeout(850);
  const flowEnd = await page.evaluate(() => ({ poseId: AppState.selectedPoseId, screen: AppState.currentScreen, calls: window._captureCalls, flow: AppState.flowMode }));
  if (flowEnd.poseId === flowStart || flowEnd.screen !== 'camera' || flowEnd.calls !== 1 || !flowEnd.flow) throw new Error(`Flow failed: ${JSON.stringify({ flowStart, flowEnd })}`);
  await page.getByTestId('flow-mode-toggle').click();
  const beforeBurst = await page.evaluate(() => AppState.capturedCount);
  await page.evaluate(() => captureBurst());
  if (!await page.getByTestId('burst-indicator').isVisible()) throw new Error('Burst indicator missing');
  const afterBurst = await page.evaluate(() => ({ count: AppState.capturedCount, calls: window._captureCalls }));
  if (afterBurst.count !== beforeBurst + 3 || afterBurst.calls !== 2) throw new Error(`Burst failed: ${JSON.stringify({ beforeBurst, afterBurst })}`);
  await page.screenshot({ path: path.join(process.cwd(), 'audit/screenshots/v2.2-camera-flow.png') });
  if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
  console.log(JSON.stringify({ timer, nextPreview: true, flowStart, flowEnd, burstDelta: afterBurst.count - beforeBurst, errors: 0, result: 'PASS' }));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exit(1); });
