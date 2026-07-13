const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'audit', 'screenshots', 'userflows-live');
const RESULT = '/tmp/poseart-userflows-live.json';
const devices = [
  { key: 'MOB', label: 'Mobile 430×932', viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true },
  { key: 'DESK', label: 'Desktop 1440×1000', viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const result = { generatedAt: new Date().toISOString(), appUrl: 'http://localhost:8095/index.html', devices: [], totals: {} };

  for (const device of devices) {
    const dir = path.join(OUT, device.key.toLowerCase());
    fs.mkdirSync(dir, { recursive: true });
    const context = await browser.newContext({ viewport: device.viewport, isMobile: device.isMobile, hasTouch: device.hasTouch, deviceScaleFactor: 1, acceptDownloads: true });
    await context.addInitScript(() => { localStorage.clear(); });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://localhost:8095/index.html', { waitUntil: 'networkidle' });

    const run = { key: device.key, label: device.label, viewport: device.viewport, screenshots: [], errors, issues: [] };
    let sequence = 0;
    async function capture(flow, microstep, action, expected, assertion = null) {
      sequence += 1;
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(180);
      const prefix = `${device.key}-F${String(flow).padStart(2, '0')}-S${String(sequence).padStart(3, '0')}`;
      const slug = microstep.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 55);
      const filename = `${prefix}-${slug}.png`;
      const filePath = path.join(dir, filename);
      const state = await page.evaluate(() => {
        const active = document.querySelector('.screen.active');
        const app = document.getElementById('app');
        return {
          activeScreen: active?.id || null,
          activeScreens: document.querySelectorAll('.screen.active').length,
          bodyWidth: document.body.scrollWidth,
          viewportWidth: window.innerWidth,
          appWidth: app?.scrollWidth || 0,
          horizontalOverflow: document.body.scrollWidth > window.innerWidth + 1,
        };
      });
      await page.screenshot({ path: filePath });
      run.screenshots.push({ id: prefix, flow, microstep, action, expected, assertion, actual: state, filename, relativePath: `audit/screenshots/userflows-live/${device.key.toLowerCase()}/${filename}` });
    }

    // Flow 1 — onboarding.
    await capture(1, 'Welcome screen', 'Open the application with clean storage.', 'OB1 presents Begin and Skip intro.');
    await page.getByTestId('btn-begin').click();
    await capture(1, 'How it works', 'Select Begin.', 'OB2 explains ghost overlay, pose library, and auto-capture.');
    await page.getByTestId('btn-try-it').click();
    await capture(1, 'Interactive onboarding demo', 'Select Try it.', 'Demo stage animates and provides coaching feedback.');
    await page.waitForTimeout(950);
    await capture(1, 'Camera permission choice', 'Wait for demo completion.', 'OB3 offers camera permission and Demo Mode.');
    await page.getByTestId('link-demo-mode').click();
    await capture(1, 'Goal selection', 'Continue in Demo Mode.', 'OB4 presents four persona goals and disabled completion.');
    await page.getByTestId('persona-photographer').click();
    await capture(1, 'Goal selected', 'Choose Photographer.', 'Photographer is highlighted and Start Exploring becomes enabled.');
    await page.getByTestId('btn-start-exploring').click();
    await capture(1, 'Onboarding completed', 'Select Start Exploring.', 'Home appears with personalized greeting.');

    // Flow 2 — discovery and pose detail.
    await capture(2, 'Home discovery', 'Review featured pose and category cards.', 'Home shows featured CTA, categories, and tab navigation.');
    await page.getByTestId('tab-library').click();
    await capture(2, 'Library categories', 'Open the Poses tab.', 'Search, filters, and 16 category cards are available.');
    await page.getByTestId('input-pose-search').fill('boudoir');
    await capture(2, 'Boudoir search results', 'Search for boudoir.', 'Matching pose cards replace category browsing.');
    await page.getByTestId('input-pose-search').fill('<script>');
    await capture(2, 'Safe empty search', 'Search using script-like text.', 'The query is treated as text and an empty state is shown.');
    await page.getByTestId('input-pose-search').fill('');
    await page.evaluate(() => openCategory('standing'));
    await capture(2, 'Standing category list', 'Open the Standing category.', 'Standing list shows pose thumbnails and count.');
    await page.evaluate(() => openPoseDetail('scurve-stand'));
    await capture(2, 'Pose detail opened', 'Open S-Curve Stand.', 'Detail sheet shows title, instructions, actions, avatar, and skeleton.');
    await page.evaluate(() => setSkelView('side-left'));
    await capture(2, 'Pose side view', 'Switch the skeleton to Side.', 'The procedural skeleton changes viewpoint.');
    try {
      await page.getByTestId('btn-sheet-fav').click({ timeout: 2500 });
    } catch (error) {
      run.issues.push({ severity: 'HIGH', id: 'pose-detail-favorite-hit-target', microstep: 'Pose favorited', description: 'Favorite is visible but the Close button intercepts pointer events at this viewport.', diagnostic: error.message.split('\n')[0] });
      await page.evaluate(() => toggleFavFromSheet({ stopPropagation() {} }));
    }
    await capture(2, 'Pose favorited', 'Toggle Favorite.', 'Favorite control remains visibly selected.');

    // Flow 3 — session setup, overlays, camera, review.
    await page.getByTestId('btn-start-session-detail').click();
    await capture(3, 'Session setup default', 'Start a session from pose detail.', 'Timer defaults Off and four overlay choices are present.');
    for (const mode of ['skeleton', 'ghost', 'off', 'avatar']) {
      await page.getByTestId(`overlay-${mode}`).click();
      await capture(3, `Overlay preview ${mode}`, `Select ${mode} overlay.`, `Setup preview accurately represents ${mode}.`);
    }
    await page.evaluate(async () => {
      cameraEngine.init = async () => {};
      cameraEngine.startCamera = async () => { cameraEngine.simulationMode = true; };
      await startCameraSession();
    });
    await capture(3, 'Camera initial state', 'Begin Capture in demo camera mode.', 'Score, simulated-scoring disclosure, shutter, and next preview are visible.');
    await page.getByTestId('flow-mode-toggle').click();
    await capture(3, 'Flow mode enabled', 'Toggle Flow Mode.', 'Flow control visibly changes to ON.');
    await page.getByTestId('btn-cycle-overlay').click();
    await capture(3, 'Camera overlay cycled', 'Cycle the live overlay.', 'Camera overlay state changes without leaving the session.');
    await page.getByTestId('flow-mode-toggle').click();
    await page.evaluate(() => capturePhoto());
    await page.waitForTimeout(450);
    await capture(3, 'Capture review', 'Press the shutter.', 'Review shows captured image, score, filters, retake/share/save actions.');
    await page.evaluate(() => { const button = document.querySelector('.preset-chip[data-preset="warm"]'); applyPreset(button, 'warm'); });
    await capture(3, 'Warm review preset', 'Select the Warm filter.', 'Captured review visibly applies the selected preset.');
    await page.getByTestId('btn-save-gallery').click();
    await page.waitForTimeout(950);
    await capture(3, 'Capture saved', 'Save the review to Gallery.', 'Gallery opens with the newly captured item.');

    // Flow 4 — gallery management.
    await capture(4, 'Gallery populated', 'Review captured gallery.', 'Capture count and card are visible with management controls.');
    await page.locator('.gallery-item').first().click();
    await capture(4, 'Gallery detail actions', 'Open the first capture.', 'Save, Copy, Download, Share, Favorite, and Delete are visible.');
    await page.getByTestId('btn-copy-detail').click();
    await capture(4, 'Gallery item copied', 'Select Copy.', 'A duplicated capture becomes the selected detail item.');
    await page.evaluate(() => returnFromGalleryDetail());
    await page.locator('#gallery-sort').selectOption('score-desc');
    await capture(4, 'Gallery sorted by score', 'Sort by Top score.', 'Gallery ordering reflects score sort.');
    await page.locator('#gallery-group-toggle').click();
    await capture(4, 'Gallery grouped by pose', 'Enable Group by pose.', 'Cards show per-pose group counts.');
    await page.locator('#gallery-select-toggle').click();
    await capture(4, 'Bulk selection mode', 'Select the gallery Select control.', 'Checkboxes and bulk action bar appear.');
    await page.locator('.gallery-item').first().click();
    await capture(4, 'Gallery item selected', 'Select one capture.', 'Selection count becomes one and selected card is outlined.');

    // Flow 5 — progress, profile, editor.
    await page.getByTestId('tab-progress').click();
    await capture(5, 'Progress dashboard', 'Open Progress.', 'Session, pose, score, and history areas are visible.');
    await page.getByTestId('tab-profile').click();
    await capture(5, 'Profile and tools', 'Open Profile.', 'Preferences, editor, marketplace, and tour entry points are visible.');
    await page.evaluate(() => openPoseEditor('scurve-stand'));
    await page.waitForTimeout(200);
    await capture(5, 'Custom pose editor', 'Open editor with S-Curve Stand.', 'Twenty sliders and avatar/skeleton/ghost previews render.');
    await page.locator('#editor-slider-spine').fill('35');
    await capture(5, 'Editor joint changed', 'Set Spine to 35 degrees.', 'Live previews and numeric value update.');
    await page.evaluate(() => undoPoseEdit());
    await capture(5, 'Editor undo', 'Undo the joint change.', 'Prior joint state is restored.');
    await page.locator('#pose-editor-name').fill('Userflow Custom Pose');
    await page.evaluate(() => saveCustomPose());
    await capture(5, 'Custom pose saved', 'Save the custom pose.', 'Saved pose appears in the editor list.');
    await page.locator('#pose-editor-bug-comment').fill('Userflow verification report');
    await page.evaluate(() => submitBugReportFromEditor());
    await capture(5, 'Editor bug report submitted', 'Submit report with pose data.', 'Success feedback confirms report storage.');

    // Flow 6 — marketplace.
    await page.evaluate(() => { openMarketplace(); initMarketplace(); });
    await page.waitForTimeout(200);
    await capture(6, 'Marketplace browse', 'Open Marketplace.', 'Product grid, search, prices, ratings, and filters appear.');
    await page.locator('#mp-search').fill('standing');
    await capture(6, 'Marketplace search', 'Search standing.', 'Matching product cards remain visible.');
    await page.locator('#mp-search').fill('');
    await page.locator('.mp-preview-btn').first().click();
    await capture(6, 'Product preview drawer', 'Preview the first product.', 'Preview drawer names the first two poses when available.');
    await page.locator('#mp-preview-panel > button').click();
    await page.locator('.mp-creator-link').first().click();
    await capture(6, 'Creator profile drawer', 'Open the product creator.', 'Creator identity and catalog are shown.');
    await page.locator('#mp-creator-profile > button').first().click();
    await page.evaluate(() => purchasePack('mp-free-essentials'));
    await capture(6, 'Free pack purchased', 'Acquire Essential Standing Poses.', 'Product becomes owned and its action changes to Open.');
    await page.evaluate(() => switchMarketplaceTab('mine'));
    await capture(6, 'Owned products', 'Open My Packs.', 'Purchased pack appears with Open and Rate controls.');
    await page.evaluate(() => switchMarketplaceTab('creator'));
    await capture(6, 'Creator dashboard', 'Open Creator.', 'Earnings summary and publish form are visible.');

    // Flow 7 — tours and cross-feature microsteps.
    await page.evaluate(() => {
      const tour = tourEngine.createTour('Live Userflow Tour', 'Desktop and mobile audit');
      const glamour = tourEngine.addSection(tour.id, 'Glamour', 'glamour');
      const dynamic = tourEngine.addSection(tour.id, 'Dynamic', 'dynamic');
      ['scurve-stand','power-stance','hip-shift'].forEach(id => tourEngine.addPoseToSection(tour.id, glamour.id, id));
      ['model-walk','wind-pose','arms-overhead'].forEach(id => tourEngine.addPoseToSection(tour.id, dynamic.id, id));
      window.__auditTourId = tour.id;
      openTourCreator(tour.id);
    });
    await capture(7, 'Tour creator populated', 'Create two sections with six poses.', 'Builder shows sections, pose cards, sources, and actions.');
    await page.getByTestId('tour-add-section').click();
    await capture(7, 'Tour section added', 'Select Add Section.', 'A third section appears.');
    await page.getByTestId('tour-start').click();
    await capture(7, 'Tour session started', 'Start Tour Session.', 'Current pose, section/pose progress, navigation, camera, and photo strip appear.');
    await page.evaluate(() => nextTourPose());
    await capture(7, 'Tour next pose', 'Select Next pose.', 'Pose progress and procedural preview advance.');
    await page.evaluate(() => nextTourSection());
    await capture(7, 'Tour next section', 'Select Next Section.', 'Section progress moves to Dynamic and pose resets.');
    await page.getByTestId('tour-capture').click();
    await capture(7, 'Tour capture added', 'Capture the current tour pose.', 'Current-section photo strip gains a tagged thumbnail.');
    await page.evaluate(() => toggleTourSearch());
    await page.locator('#tour-search-input').fill('wind');
    await capture(7, 'Tour pose search', 'Search for wind within the tour.', 'Matching tour pose is offered as a jump target.');
    await page.evaluate(() => { toggleTourSearch(); toggleTourOverview(); });
    await capture(7, 'Tour section overview', 'Open Section overview.', 'Drawer lists every section and pose count.');
    await page.evaluate(() => { toggleTourOverview(); endTourSession(); });
    await capture(7, 'Tour summary', 'End the tour.', 'Summary groups captured photos by section and shows total.');

    const finalMetrics = await page.evaluate(() => ({
      galleryItems: getGallery().length,
      tours: getTours().length,
      customPoses: document.querySelectorAll('#pose-editor-saved-list [data-pose-id]').length,
      viewport: { width: innerWidth, height: innerHeight },
      bodyHorizontalOverflow: document.body.scrollWidth > innerWidth + 1,
      appHorizontalOverflow: document.getElementById('app').scrollWidth > document.getElementById('app').clientWidth + 1,
    }));
    run.finalMetrics = finalMetrics;
    run.assertions = {
      screenshotCount: run.screenshots.length,
      everyScreenSingleActive: run.screenshots.every(item => item.actual.activeScreens === 1),
      browserErrors: errors.length,
    };
    result.devices.push(run);
    await context.close();
  }

  await browser.close();
  result.totals = {
    devices: result.devices.length,
    screenshots: result.devices.reduce((sum, device) => sum + device.screenshots.length, 0),
    errors: result.devices.reduce((sum, device) => sum + device.errors.length, 0),
    flowsPerDevice: 7,
  };
  fs.writeFileSync(RESULT, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result.totals));
})().catch(error => { console.error(error.stack || error); process.exit(1); });
