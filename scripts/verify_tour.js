const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await context.addInitScript(() => {
    if (!sessionStorage.getItem('poseart_tour_test_initialized')) {
      localStorage.clear();
      sessionStorage.setItem('poseart_tour_test_initialized', '1');
    }
    localStorage.setItem('poseart_onboardingCompleted', 'true');
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:8095/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    openTourCreator();
    document.getElementById('tour-name').value = 'Editorial Flow';
    document.getElementById('tour-description').value = 'Two-section verification sequence';
    updateTourDraft();
    addTourSection('Glamour', 'glamour');
    addTourSection('Dynamic', 'dynamic');
    const tour = getTour(AppState.currentTourId || getTours()[0].id) || getTours()[0];
    const ids = ['scurve-stand', 'power-stance', 'hip-shift', 'model-walk', 'wind-pose', 'arms-overhead'];
    tour.sections.forEach((section, sectionIndex) => ids.slice(sectionIndex * 3, sectionIndex * 3 + 3).forEach(id => tourEngine.addPoseToSection(tour.id, section.id, id)));
    window._tourTestId = tour.id;
    window._tourEditingId = tour.id;
    renderTourCreator();
  });
  if (await page.locator('.tour-section-card').count() !== 2) throw new Error('Expected 2 creator sections');
  if (await page.locator('.tour-pose-chip').count() !== 6) throw new Error('Expected 6 creator poses');
  await page.screenshot({ path: path.join(process.cwd(), 'audit/screenshots/v2.1-tour-creator.png'), fullPage: true });
  const tourId = await page.evaluate(() => window._tourTestId);
  await page.reload({ waitUntil: 'networkidle' });
  const persisted = await page.evaluate(id => {
    const tour = getTour(id); return { name: tour?.name, sections: tour?.sections.length, poses: tour?.sections.reduce((sum, section) => sum + section.poseIds.length, 0) };
  }, tourId);
  if (persisted.name !== 'Editorial Flow' || persisted.sections !== 2 || persisted.poses !== 6) throw new Error(`Persistence failed: ${JSON.stringify(persisted)}`);
  await page.evaluate(id => openTourSession(id), tourId);
  if (!await page.locator('#tour-current-pose canvas').isVisible()) throw new Error('Current pose canvas is missing');
  if (!await page.locator('#tour-section-progress').textContent().then(text => text.includes('Glamour'))) throw new Error('Initial section progress is wrong');
  await page.evaluate(() => { nextTourPose(); nextTourPose(); nextTourPose(); });
  const stateAfterBoundary = await page.evaluate(() => { const s = tourEngine.getState(); return { section: s.section.name, poseIndex: s.poseIndex, poseId: s.poseId }; });
  if (stateAfterBoundary.section !== 'Dynamic' || stateAfterBoundary.poseIndex !== 0) throw new Error(`Pose boundary navigation failed: ${JSON.stringify(stateAfterBoundary)}`);
  await page.getByTestId('tour-capture').click();
  const capture = await page.evaluate(id => getGallery().find(item => String(item.tourId) === String(id)), tourId);
  if (!capture || !capture.sectionId || capture.poseId !== stateAfterBoundary.poseId) throw new Error(`Tagged capture invalid: ${JSON.stringify(capture)}`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(process.cwd(), 'audit/screenshots/v2.1-tour-session.png') });
  await page.evaluate(() => endTourSession());
  if (!await page.locator('#tour-summary-sections .tour-summary-section').count().then(count => count === 2)) throw new Error('Summary does not contain 2 sections');
  if (!await page.locator('#tour-summary-total').textContent().then(text => text.includes('1 total'))) throw new Error('Summary total is wrong');
  await page.screenshot({ path: path.join(process.cwd(), 'audit/screenshots/v2.1-tour-summary.png'), fullPage: true });
  if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
  console.log(JSON.stringify({ persisted, stateAfterBoundary, captureTags: { tourId: capture.tourId, sectionId: capture.sectionId, poseId: capture.poseId }, summarySections: 2, errors: 0, result: 'PASS' }));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exit(1); });
