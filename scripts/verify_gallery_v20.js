const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true });
  await context.addInitScript(() => {
    const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    const poses = ['scurve-stand', 'power-stance', 'hip-shift', 'chair-sit', 'fence-lean'];
    const items = Array.from({ length: 24 }, (_, index) => ({
      id: 2000 + index,
      poseId: poses[index % poses.length],
      poseName: `Gallery Test ${index + 1}`,
      dataUrl: pixel,
      score: 70 + (index % 29),
      favorite: index % 5 === 0,
      timestamp: new Date(Date.now() - index * 60000).toISOString(),
      filter: 'original'
    }));
    localStorage.setItem('poseart_gallery', JSON.stringify(items));
    localStorage.setItem('poseart_onboardingCompleted', 'true');
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:8095/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => showTab('gallery'));
  await page.waitForTimeout(400);

  const initial = await page.locator('.gallery-item').count();
  if (initial > 18 || initial < 1) throw new Error(`Expected 1-18 virtual cards, got ${initial}`);
  await page.locator('.gallery-item').first().click();
  for (const testId of ['btn-save-photos', 'btn-copy-detail', 'btn-download-detail']) {
    if (!await page.getByTestId(testId).isVisible()) throw new Error(`${testId} is not visible`);
  }
  await page.screenshot({ path: path.join(process.cwd(), 'audit/screenshots/v2.0-gallery-detail.png'), fullPage: true });
  const beforeCopy = await page.evaluate(() => getGallery().length);
  await page.getByTestId('btn-copy-detail').click();
  const afterCopy = await page.evaluate(() => getGallery().length);
  if (afterCopy !== beforeCopy + 1) throw new Error(`Copy did not increment gallery: ${beforeCopy} -> ${afterCopy}`);
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('btn-download-detail').click();
  const download = await downloadPromise;
  if (!download.suggestedFilename().startsWith('poseart-')) throw new Error('Unexpected download filename');
  await page.evaluate(() => showTab('gallery'));
  await page.locator('#gallery-select-toggle').click();
  await page.locator('.gallery-item').first().click();
  if (!await page.locator('#gallery-bulk-actions.visible').isVisible()) throw new Error('Bulk action bar is not visible');
  if (!await page.locator('#gallery-selection-count').textContent().then(text => text.includes('1 selected'))) throw new Error('Selection count did not update');
  await page.selectOption('#gallery-sort', 'score-desc');
  await page.locator('#gallery-group-toggle').click();
  await page.screenshot({ path: path.join(process.cwd(), 'audit/screenshots/v2.0-gallery.png'), fullPage: true });
  if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
  console.log(JSON.stringify({ initialVirtualCards: initial, beforeCopy, afterCopy, download: download.suggestedFilename(), errors: errors.length, result: 'PASS' }));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exit(1); });
