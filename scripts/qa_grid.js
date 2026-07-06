const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3200', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.completeOnboardingSkip());
  await page.waitForTimeout(300);
  await page.evaluate(() => window.showTab('library'));
  await page.waitForTimeout(400);

  const info = await page.evaluate(() => {
    const grid = document.getElementById('library-category-grid');
    const gs = getComputedStyle(grid);
    const first = grid.children[0];
    const fr = first ? first.getBoundingClientRect() : null;
    const fs = first ? getComputedStyle(first) : null;
    const bg = first ? first.querySelector('.category-card-bg') : null;
    return {
      gridDisplay: gs.display,
      gridRect: grid.getBoundingClientRect(),
      gridChildren: grid.children.length,
      gridHTMLlen: grid.innerHTML.length,
      firstCardRect: fr,
      firstCardDisplay: fs ? fs.display : null,
      firstCardHeight: fs ? fs.height : null,
      firstCardMinHeight: fs ? fs.minHeight : null,
      bgRect: bg ? bg.getBoundingClientRect() : null,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
