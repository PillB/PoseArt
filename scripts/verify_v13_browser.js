const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(process.cwd(), 'audit', 'screenshots', 'v1.3');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8095/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.completeOnboardingSkip());
  const rendered = {};
  for (const poseId of ['boudoir-chair-straddle', 'throne-sit', 'chair-lean-forward', 'boudoir-bedsheet-drape-sit']) {
    await page.evaluate(id => window.openPoseDetail(id), poseId);
    await page.waitForTimeout(300);
    const canvas = page.locator('[data-testid="canvas-skeleton-3d"]');
    rendered[poseId] = await canvas.evaluate(c => c.getContext('2d').getImageData(0, 0, c.width, c.height).data.some(v => v !== 0));
    await page.screenshot({ path: path.join(outDir, poseId + '.png'), fullPage: false });
    if (poseId === 'boudoir-chair-straddle') {
      await page.evaluate(() => window.setSkelView('side-left'));
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(outDir, poseId + '-side.png'), fullPage: false });
    }
  }
  console.log(JSON.stringify({ rendered, errors }, null, 2));
  if (Object.values(rendered).some(v => !v) || errors.length) process.exitCode = 1;
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
