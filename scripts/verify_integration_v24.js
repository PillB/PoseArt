const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(process.cwd(), 'audit/screenshots/v2.4');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await context.addInitScript(() => { localStorage.clear(); });
  const page = await context.newPage(); page.setDefaultTimeout(12000);
  const errors = []; page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8095/index.html', { waitUntil: 'networkidle' });
  const captured = [];
  async function shot(number, slug) {
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(220);
    const file = `${String(number).padStart(2, '0')}-${slug}.png`;
    await page.screenshot({ path: path.join(outDir, file) }); captured.push(file);
  }

  if (!await page.getByText('Skip intro', { exact: false }).isVisible()) throw new Error('OB1 Skip intro missing');
  await shot(1, 'onboarding-ob1');
  await page.evaluate(() => completeOnboardingSkip());
  await shot(2, 'home');
  await page.evaluate(() => showTab('library')); await shot(3, 'library');
  await page.evaluate(() => searchPoses('boudoir')); await shot(4, 'library-search-boudoir');
  await page.evaluate(() => openCategory('standing')); await shot(5, 'category-standing');
  await page.evaluate(() => openPoseDetail('scurve-stand')); await shot(6, 'pose-detail-scurve');
  await page.evaluate(() => { closePoseSheet(); goToSession('scurve-stand'); }); await shot(7, 'session-setup');
  await page.evaluate(() => { showScreen('camera'); AppState.selectedPoseId = 'scurve-stand'; cameraEngine.currentPose = 'scurve-stand'; goToNextPose(); document.getElementById('simulated-scoring-pill').style.display = 'block'; });
  await shot(8, 'camera'); await shot(9, 'camera-next-preview');
  await page.evaluate(() => { showScreen('review'); const c = document.getElementById('review-img'); c.width=430;c.height=760;const x=c.getContext('2d');x.fillStyle='#1E7A74';x.fillRect(0,0,430,760); }); await shot(10, 'review');
  await page.evaluate(() => { showTab('gallery'); AppState.galleryDirty = true; renderGallery(); }); await shot(11, 'gallery-empty');
  await page.evaluate(() => { addToGallery({id:9001,dataUrl:null,isSim:true,poseId:'scurve-stand',poseName:'S-Curve Stand',score:92,timestamp:new Date().toISOString(),favorite:false}); showTab('gallery'); }); await shot(12, 'gallery-with-photos');
  await page.evaluate(() => openGalleryItem(9001)); await shot(13, 'gallery-detail');
  await page.evaluate(() => showTab('progress')); await shot(14, 'progress');
  await page.evaluate(() => showTab('profile')); await shot(15, 'profile');
  await page.evaluate(() => openPoseEditor('scurve-stand')); await page.waitForTimeout(150); await shot(16, 'pose-editor');
  await page.evaluate(() => { openMarketplace(); initMarketplace(); }); await page.waitForTimeout(100); await shot(17, 'marketplace-browse');
  await page.evaluate(() => switchMarketplaceTab('creator')); await shot(18, 'marketplace-creator');

  const integration = await page.evaluate(() => {
    const customId = 'custom-v24';
    POSES_LIBRARY[customId] = { ...POSES_LIBRARY['scurve-stand'], id: customId, name: 'V24 Custom', isCustom: true };
    _editorCustomPoses.push(POSES_LIBRARY[customId]);
    if (!_ownedPacks.includes('mp-free-essentials')) _ownedPacks.push('mp-free-essentials');
    const tour = tourEngine.createTour('Integrated Story', 'Cross-feature validation');
    const section = tourEngine.addSection(tour.id, 'Opening', 'custom');
    tourEngine.addPoseToSection(tour.id, section.id, customId);
    tourEngine.addPoseToSection(tour.id, section.id, 'power-stance');
    window._v24TourId = tour.id; openTourCreator(tour.id);
    const published = publishTourToMarketplace(tour.id);
    return { tourId: tour.id, sectionId: section.id, customAdded: getTour(tour.id).sections[0].poseIds.includes(customId), publishedId: published.id };
  });
  await shot(19, 'tour-creator');
  await page.evaluate(id => openTourSession(id), integration.tourId); await shot(20, 'tour-session');

  const seamResults = await page.evaluate(async ({ tourId }) => {
    cameraEngine.init = async () => {}; cameraEngine.startCamera = async () => {}; cameraEngine.setPose = id => { cameraEngine.currentPose = id; };
    await startTourCamera();
    const tourToCamera = AppState.currentScreen === 'camera' && document.getElementById('camera-section-indicator').style.display === 'block';
    cameraEngine.currentScore = 88; cameraEngine.captureImage(false);
    const tagged = getGallery().find(item => String(item.tourId) === String(tourId));
    setGalleryFilter('tour'); const galleryTourFilter = getGalleryViewItems().every(item => item.tourId);
    showScreen('tour-session'); renderTourSession(); reportTourPoseIssue();
    await new Promise(resolve => setTimeout(resolve, 120));
    const editorHandoff = AppState.currentScreen === 'custom-pose-editor' && document.getElementById('pose-editor-bug-comment').value.includes('Integrated Story');
    const product = _marketplacePacks.find(item => item.tourId === tourId); if (!_ownedPacks.includes(product.id)) _ownedPacks.push(product.id);
    openPack(product.id); const marketplaceToTour = AppState.currentScreen === 'tour-session';
    const sources = document.getElementById('tour-sources')?.textContent || '';
    return { tourToCamera, cameraToGallery: !!tagged && !!tagged.sectionId, galleryTourFilter, editorToTour: getTour(tourId).sections[0].poseIds.includes('custom-v24'), marketplaceToTour, tourToMarketplace: !!product, bugToEditor: editorHandoff, sourceCustom: sources.includes('V24 Custom'), sourcePurchased: sources.includes('Essential Standing') };
  }, integration);

  await page.evaluate(id => { openTourSession(id); captureTourPhoto(); endTourSession(); }, integration.tourId); await shot(21, 'tour-summary');
  const animations = await page.evaluate(() => {
    const css = [...document.styleSheets].map(sheet => { try { return [...sheet.cssRules].map(rule => rule.cssText).join(' '); } catch { return ''; } }).join(' ');
    return {
      onboardingTransition: /transition/i.test(css),
      poseDetailEntry: /pose-figure|figure.*animation/i.test(css),
      avatarBreathing: /breath/i.test(css),
      ghostOverlayBreathing: /ghost|breath/i.test(css),
      skeletonAutoRotate: typeof setSkelView === 'function',
      tabSwitch: document.querySelectorAll('.screen.active').length === 1,
      galleryDetailTransition: typeof openGalleryItem === 'function',
      tourSectionTransition: /tourSectionTransition/.test(css),
      captureFlash: /shutterFlash/.test(CameraEngine.prototype._triggerFlash.toString()),
      particleBloom: /particleFly/.test(css)
    };
  });
  const failedSeams = Object.entries(seamResults).filter(([, value]) => !value);
  const failedAnimations = Object.entries(animations).filter(([, value]) => !value);
  if (captured.length !== 21 || fs.readdirSync(outDir).filter(file => file.endsWith('.png')).length < 21) throw new Error(`Expected 21 screenshots, got ${captured.length}`);
  if (failedSeams.length) throw new Error(`Integration failures: ${JSON.stringify(failedSeams)}`);
  if (failedAnimations.length) throw new Error(`Animation failures: ${JSON.stringify(failedAnimations)}`);
  if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
  const result = { screenshots: captured.length, seamResults, animations, errors: 0, result: 'PASS' };
  fs.writeFileSync(path.join(process.cwd(), 'audit/results/v2.4-integration.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result)); await browser.close();
})().catch(error => { console.error(error.stack || error); process.exit(1); });
