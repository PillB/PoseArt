const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(process.cwd(), 'audit', 'screenshots', 'v1.1');
  fs.mkdirSync(outDir, { recursive: true });
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
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('http://localhost:8095/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.completeOnboardingSkip());
  await page.waitForTimeout(400);
  await page.evaluate(() => window.openPoseDetail('scurve-stand'));
  await page.waitForTimeout(800);
  const skeleton = page.locator('[data-testid="canvas-skeleton-3d"]');
  const box = await skeleton.boundingBox();
  const pixels = await skeleton.evaluate(canvas => {
    const ctx = canvas.getContext('2d');
    return ctx.getImageData(0, 0, canvas.width, canvas.height).data.some(v => v !== 0);
  });
  await page.screenshot({ path: path.join(outDir, 'scurve-stand-pose-detail.png'), fullPage: false });
  await page.evaluate(() => window.goToSession('scurve-stand'));
  await page.waitForTimeout(350);
  const modes = {};
  for (const mode of ['avatar', 'skeleton', 'ghost', 'off']) {
    await page.evaluate(m => window.updateSessionSetupOverlayPreview(m), mode);
    await page.waitForTimeout(150);
    modes[mode] = await page.locator('#setup-pose-figure').evaluate(el => ({
      canvas: !!el.querySelector('canvas'),
      svg: !!el.querySelector('svg'),
      text: el.textContent.trim(),
    }));
  }
  await page.screenshot({ path: path.join(outDir, 'session-overlay-off.png'), fullPage: false });
  const adjacent = {};
  for (const poseId of ['power-stance', 'hip-shift']) {
    await page.evaluate(id => window.openPoseDetail(id), poseId);
    await page.waitForTimeout(350);
    adjacent[poseId] = await skeleton.evaluate(canvas =>
      canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some(v => v !== 0));
    await page.screenshot({ path: path.join(outDir, poseId + '-adjacent.png'), fullPage: false });
  }
  const result = { skeletonVisible: !!box, skeletonPixels: pixels, modes, adjacent, errors };
  console.log(JSON.stringify(result, null, 2));
  if (!box || !pixels || errors.length ||
      !modes.avatar.svg || !modes.skeleton.canvas || !modes.ghost.canvas ||
      modes.off.canvas || modes.off.svg || !adjacent['power-stance'] || !adjacent['hip-shift']) process.exitCode = 1;
  await browser.close();
})().catch(err => { console.error(err); process.exit(1); });
