// ============================================================
// PoseArt — Vibe-Coded Failure-Mode Interactive Audit
// ============================================================
// Walks through every user flow interactively via Playwright,
// checks for the 27 failure classes from the research checklist,
// logs issues, and takes screenshots for VLM verification.
// ============================================================

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const APP_URL = 'http://localhost:8095/index.html';
const OUT_DIR = path.join(process.cwd(), 'audit', 'vibe-audit');

fs.mkdirSync(OUT_DIR, { recursive: true });

const issues = [];
const screenshots = [];

function log(flow, severity, category, description, fix) {
  issues.push({ flow, severity, category, description, fix, timestamp: new Date().toISOString() });
  const icon = severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : '🟡';
  console.log(`  ${icon} [${severity}] ${category}: ${description}`);
  if (fix) console.log(`     FIX: ${fix}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  // ============================================================
  // FLOW 1: ONBOARDING (OB1 → OB2 → OB3 → OB4)
  // ============================================================
  console.log('\n══════ FLOW 1: ONBOARDING ══════');
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(`[error] ${msg.text()}`);
    if (msg.type() === 'warning') consoleErrors.push(`[warn] ${msg.text()}`);
  });
  page.on('pageerror', err => consoleErrors.push(`[pageerror] ${err.message}`));

  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Check OB1 is visible
  const ob1Visible = await page.evaluate(() => {
    const s = document.getElementById('screen-ob1');
    return s && s.classList.contains('active');
  });
  console.log(`  OB1 visible: ${ob1Visible}`);
  if (!ob1Visible) log('onboarding', 'CRITICAL', 'navigation', 'OB1 screen not visible on load', 'check screen-ob1 active class');

  // Check for skip button
  const skipBtn = await page.$('[onclick*="completeOnboardingSkip"]');
  if (!skipBtn) log('onboarding', 'HIGH', 'orphaned_button', 'No skip button found on onboarding', 'add skip button');

  // Check onboarding replay (issue: replays every load)
  const onboardingReplays = await page.evaluate(() => {
    return typeof _onboardingCompleted !== 'undefined' && _onboardingCompleted === false;
  });
  if (onboardingReplays) {
    log('onboarding', 'MEDIUM', 'stale_state', 'Onboarding replays every load (no persistence)', 'this is by-design for iframe sandbox, but non-iframe builds should persist');
  }

  // Click skip
  await page.evaluate(() => window.completeOnboardingSkip && window.completeOnboardingSkip());
  await page.waitForTimeout(500);

  // Verify we're on home
  const onHome = await page.evaluate(() => {
    const s = document.getElementById('screen-home');
    return s && s.classList.contains('active');
  });
  console.log(`  After skip → home: ${onHome}`);
  if (!onHome) log('onboarding', 'CRITICAL', 'navigation', 'Skip button does not navigate to home', 'fix completeOnboardingSkip');

  // Check for selectedGoal (dead personalization check)
  const goalSet = await page.evaluate(() => window.AppState?.selectedGoal);
  console.log(`  selectedGoal after skip: ${goalSet}`);
  if (!goalSet) log('onboarding', 'MEDIUM', 'dead_personalization', 'selectedGoal not set after skip (default should be "exploring")', 'set default goal in completeOnboardingSkip');

  // Screenshot
  await page.screenshot({ path: path.join(OUT_DIR, '01-onboarding-skip.png') });
  screenshots.push('01-onboarding-skip.png');

  // ============================================================
  // FLOW 2: HOME SCREEN
  // ============================================================
  console.log('\n══════ FLOW 2: HOME ══════');

  // Check home screen elements
  const homeElements = await page.evaluate(() => {
    return {
      greeting: !!document.getElementById('home-greeting'),
      featuredName: !!document.getElementById('featured-name'),
      featuredStartBtn: !!document.getElementById('featured-start-btn'),
      categoryGrid: !!document.getElementById('category-grid'),
      recentCapturesRow: !!document.getElementById('recent-captures-row'),
      thumbScurve: !!document.getElementById('thumb-scurve'),
    };
  });
  console.log(`  Home elements: ${JSON.stringify(homeElements)}`);
  for (const [el, exists] of Object.entries(homeElements)) {
    if (!exists) log('home', 'HIGH', 'missing_element', `Home screen missing: ${el}`, `check #${el} exists in index.html`);
  }

  // Check empty state for recent captures
  const recentEmpty = await page.evaluate(() => {
    const row = document.getElementById('recent-captures-row');
    const hint = document.getElementById('captures-empty-hint');
    return {
      rowEmpty: row && row.children.length === 0,
      hintVisible: hint && hint.style.display !== 'none',
    };
  });
  console.log(`  Recent captures empty state: ${JSON.stringify(recentEmpty)}`);
  if (recentEmpty.rowEmpty && !recentEmpty.hintVisible) {
    log('home', 'HIGH', 'empty_state', 'No empty state shown when recent captures is empty', 'show captures-empty-hint');
  }

  // Check category grid has items
  const catCount = await page.evaluate(() => {
    return document.querySelectorAll('#category-grid .category-card').length;
  });
  console.log(`  Category cards: ${catCount}`);
  if (catCount === 0) log('home', 'CRITICAL', 'empty_state', 'Category grid is empty on home', 'call renderCategoryGrid()');

  // Check featured pose card has a figure
  const featuredFigRendered = await page.evaluate(() => {
    const thumb = document.getElementById('thumb-scurve');
    if (!thumb) return false;
    const canvas = thumb.querySelector('canvas[data-pose-rendered="1"]');
    const svg = thumb.querySelector('svg');
    return !!(canvas || svg);
  });
  console.log(`  Featured pose figure rendered: ${featuredFigRendered}`);
  if (!featuredFigRendered) log('home', 'MEDIUM', 'missing_element', 'Featured pose figure not rendered', 'check renderPendingAvatars or renderCategoryThumbs');

  await page.screenshot({ path: path.join(OUT_DIR, '02-home.png') });
  screenshots.push('02-home.png');

  // ============================================================
  // FLOW 3: LIBRARY → SEARCH → CATEGORY → POSE DETAIL
  // ============================================================
  console.log('\n══════ FLOW 3: LIBRARY ══════');
  await page.evaluate(() => window.showTab && window.showTab('library'));
  await page.waitForTimeout(500);

  // Check library elements
  const libElements = await page.evaluate(() => {
    return {
      searchInput: !!document.querySelector('#library-search-input, input[oninput*="searchPoses"]'),
      categoryGrid: !!document.getElementById('library-category-grid'),
      resultsEl: !!document.getElementById('search-results'),
      browseLabel: !!document.getElementById('library-browse-label'),
    };
  });
  console.log(`  Library elements: ${JSON.stringify(libElements)}`);
  for (const [el, exists] of Object.entries(libElements)) {
    if (!exists) log('library', 'HIGH', 'missing_element', `Library missing: ${el}`, `check #${el}`);
  }

  // Test search
  await page.evaluate(() => window.searchPoses && window.searchPoses('boudoir'));
  await page.waitForTimeout(300);
  const searchResults = await page.evaluate(() => {
    const el = document.getElementById('search-results');
    return {
      visible: el && el.style.display !== 'none',
      hasHeader: !!el?.querySelector('.search-results-header'),
      resultCount: el?.querySelectorAll('.pose-list-item').length || 0,
    };
  });
  console.log(`  Search "boudoir": visible=${searchResults.visible}, results=${searchResults.resultCount}`);
  if (searchResults.visible && searchResults.resultCount === 0) {
    log('library', 'HIGH', 'empty_state', 'Search returns 0 results but shows no empty state', 'check search empty state');
  }

  // Clear search
  await page.evaluate(() => window.searchPoses && window.searchPoses(''));
  await page.waitForTimeout(300);

  // Open a category
  await page.evaluate(() => window.openCategory && window.openCategory('standing'));
  await page.waitForTimeout(500);
  const catList = await page.evaluate(() => {
    const list = document.getElementById('cat-pose-list');
    return {
      visible: !!document.getElementById('screen-category-list')?.classList.contains('active'),
      poseCount: list?.querySelectorAll('.pose-list-item').length || 0,
    };
  });
  console.log(`  Category 'standing': visible=${catList.visible}, poses=${catList.poseCount}`);
  if (catList.visible && catList.poseCount === 0) log('library', 'CRITICAL', 'empty_state', 'Category list is empty', 'check openCategory');

  // Open pose detail
  await page.evaluate(() => window.openPoseDetail && window.openPoseDetail('scurve-stand'));
  await page.waitForTimeout(800);
  const poseDetail = await page.evaluate(() => {
    const sheet = document.getElementById('pose-detail-sheet');
    return {
      visible: sheet && sheet.classList.contains('visible'),
      hasTitle: !!document.getElementById('detail-title')?.textContent,
      hasInstructions: !!document.getElementById('detail-instructions')?.textContent,
      hasTip: !!document.getElementById('detail-tip')?.textContent,
      hasFavBtn: !!document.getElementById('sheet-fav-btn'),
      hasShareBtn: !!document.querySelector('[onclick*="sharePoseFromSheet"]'),
      hasSkeleton: !!document.getElementById('pose-skeleton-3d-canvas'),
      hasAnimation: !!document.getElementById('pose-detail-animation'),
    };
  });
  console.log(`  Pose detail: ${JSON.stringify(poseDetail)}`);
  if (!poseDetail.hasFavBtn) log('pose_detail', 'HIGH', 'orphaned_button', 'Favorite button missing from pose detail', 'check sheet-fav-btn');
  if (!poseDetail.hasShareBtn) log('pose_detail', 'HIGH', 'orphaned_button', 'Share button missing from pose detail', 'check sharePoseFromSheet');

  // Check GIF player
  const gifLoaded = await page.evaluate(() => {
    const animEl = document.getElementById('pose-detail-animation');
    return animEl && (animEl.querySelector('canvas[data-pose-rendered]') || animEl.querySelector('svg') || animEl.querySelector('img'));
  });
  console.log(`  Pose animation element has content: ${!!gifLoaded}`);

  // Close pose detail
  await page.evaluate(() => window.closePoseSheet && window.closePoseSheet());
  await page.waitForTimeout(300);

  // Test back button from category list
  await page.evaluate(() => window.goBack && window.goBack());
  await page.waitForTimeout(300);
  const afterBack = await page.evaluate(() => {
    return document.getElementById('screen-library')?.classList.contains('active') ||
           document.getElementById('screen-home')?.classList.contains('active');
  });
  console.log(`  Back from category → library/home: ${afterBack}`);
  if (!afterBack) log('library', 'HIGH', 'navigation', 'Back button from category list goes to wrong screen', 'check goBack');

  await page.screenshot({ path: path.join(OUT_DIR, '03-library.png') });
  screenshots.push('03-library.png');

  // ============================================================
  // FLOW 4: SESSION SETUP → CAMERA → CAPTURE → REVIEW
  // ============================================================
  console.log('\n══════ FLOW 4: SESSION → CAMERA ══════');
  await page.evaluate(() => window.goToSession && window.goToSession('scurve-stand'));
  await page.waitForTimeout(500);

  const sessionSetup = await page.evaluate(() => {
    return {
      visible: document.getElementById('screen-session-setup')?.classList.contains('active'),
      hasPoseName: !!document.getElementById('setup-pose-name')?.textContent,
      hasFigure: !!document.getElementById('setup-pose-figure'),
      hasTimerOpt: !!document.getElementById('opt-timer'),
      hasSensitivityOpt: !!document.getElementById('opt-sensitivity'),
      hasOverlayChips: document.querySelectorAll('.overlay-mode-chip').length,
      hasBeginBtn: !!document.getElementById('begin-session-btn'),
    };
  });
  console.log(`  Session setup: ${JSON.stringify(sessionSetup)}`);
  if (sessionSetup.hasOverlayChips < 3) log('session', 'MEDIUM', 'missing_element', 'Fewer than 3 overlay chips', 'check overlay-mode-chip elements');

  // Check overlay preview respects user choice (issue from AGENT_STATE)
  // Test: select 'off' mode and verify preview is NOT avatar
  await page.evaluate(() => {
    const chips = document.querySelectorAll('.overlay-mode-chip');
    let offChip = null;
    chips.forEach(c => { if (c.getAttribute('onclick')?.includes("'off'")) offChip = c; });
    if (offChip) window.selectOverlayMode(offChip, 'off');
  });
  await page.waitForTimeout(300);
  const offPreview = await page.evaluate(() => {
    const fig = document.getElementById('setup-pose-figure');
    const canvas = fig?.querySelector('canvas');
    const svg = fig?.querySelector('svg');
    const placeholder = fig?.querySelector('div[style*="Camera only"]') || fig?.textContent?.includes('No overlay');
    return { hasCanvas: !!canvas, hasSvg: !!svg, hasPlaceholder: !!placeholder };
  });
  console.log(`  'off' overlay preview: ${JSON.stringify(offPreview)}`);
  if (offPreview.hasSvg && !offPreview.hasPlaceholder) {
    log('session', 'HIGH', 'dead_personalization', 'Overlay "off" shows avatar SVG instead of empty placeholder', 'fix updateSessionSetupOverlayPreview for off mode');
  }

  // Start camera session
  await page.evaluate(() => window.startCameraSession && window.startCameraSession());
  await page.waitForTimeout(2000);

  const cameraScreen = await page.evaluate(() => {
    return {
      visible: document.getElementById('screen-camera')?.classList.contains('active'),
      hasPoseName: !!document.getElementById('camera-pose-name')?.textContent,
      hasScore: !!document.getElementById('hud-score'),
      hasShutter: !!document.getElementById('shutter-btn'),
      hasDemoPill: document.getElementById('demo-mode-pill')?.style.display === 'block',
      hasSimPill: document.getElementById('simulated-scoring-pill')?.style.display === 'block',
      hasGhostCanvas: !!document.getElementById('ghost-canvas'),
      hasSkelCanvas: !!document.getElementById('skeleton-canvas'),
      hasHintBanner: !!document.getElementById('hint-banner'),
    };
  });
  console.log(`  Camera: ${JSON.stringify(cameraScreen)}`);
  if (!cameraScreen.hasSimPill) log('camera', 'MEDIUM', 'missing_element', 'SIMULATED SCORING pill not visible on camera', 'check simulated-scoring-pill display');
  if (!cameraScreen.hasShutter) log('camera', 'CRITICAL', 'orphaned_button', 'Shutter button missing from camera', 'check shutter-btn');

  // Test capture
  await page.evaluate(() => window.capturePhoto && window.capturePhoto());
  await page.waitForTimeout(2000);

  const reviewScreen = await page.evaluate(() => {
    return {
      visible: document.getElementById('screen-review')?.classList.contains('active'),
      hasCanvas: !!document.getElementById('review-img'),
      hasScore: !!document.getElementById('review-score-text')?.textContent,
      hasSaveBtn: !!document.querySelector('[onclick*="saveToGallery"]'),
      hasShareBtn: !!document.querySelector('[onclick*="sharePhoto"]'),
      hasRetakeBtn: !!document.querySelector('[onclick*="retakePhoto"]'),
    };
  });
  console.log(`  Review: ${JSON.stringify(reviewScreen)}`);
  if (!reviewScreen.hasSaveBtn) log('review', 'HIGH', 'orphaned_button', 'Save button missing from review', 'check saveToGallery');
  if (!reviewScreen.hasShareBtn) log('review', 'HIGH', 'orphaned_button', 'Share button missing from review', 'check sharePhoto');

  // Save to gallery
  await page.evaluate(() => window.saveToGallery && window.saveToGallery());
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(OUT_DIR, '04-camera-review.png') });
  screenshots.push('04-camera-review.png');

  // ============================================================
  // FLOW 5: GALLERY
  // ============================================================
  console.log('\n══════ FLOW 5: GALLERY ══════');
  await page.evaluate(() => window.showTab && window.showTab('gallery'));
  await page.waitForTimeout(500);

  const gallery = await page.evaluate(() => {
    const grid = document.getElementById('gallery-grid');
    const empty = document.getElementById('gallery-empty');
    return {
      visible: document.getElementById('screen-gallery')?.classList.contains('active'),
      hasGrid: !!grid,
      hasEmpty: !!empty,
      itemCount: grid?.querySelectorAll('.gallery-item').length || 0,
      countText: document.getElementById('gallery-count')?.textContent,
    };
  });
  console.log(`  Gallery: ${JSON.stringify(gallery)}`);
  if (gallery.itemCount === 0 && !gallery.hasEmpty) log('gallery', 'HIGH', 'empty_state', 'Gallery empty but no empty state shown', 'check gallery-empty');

  // Open gallery item
  if (gallery.itemCount > 0) {
    await page.evaluate(() => {
      const firstItem = document.querySelector('.gallery-item');
      if (firstItem) firstItem.click();
    });
    await page.waitForTimeout(500);
    const galleryDetail = await page.evaluate(() => {
      return {
        visible: document.getElementById('screen-gallery-detail')?.classList.contains('active'),
        hasTitle: !!document.getElementById('gallery-detail-title')?.textContent,
        hasFavBtn: !!document.getElementById('gallery-detail-fav'),
        hasDeleteBtn: !!document.querySelector('[onclick*="deleteGalleryItem"]'),
      };
    });
    console.log(`  Gallery detail: ${JSON.stringify(galleryDetail)}`);
    if (!galleryDetail.hasDeleteBtn) log('gallery', 'HIGH', 'orphaned_button', 'Delete button missing from gallery detail', 'check deleteGalleryItem');

    // Go back
    await page.evaluate(() => window.goBack && window.goBack());
    await page.waitForTimeout(300);
  }

  await page.screenshot({ path: path.join(OUT_DIR, '05-gallery.png') });
  screenshots.push('05-gallery.png');

  // ============================================================
  // FLOW 6: PROGRESS
  // ============================================================
  console.log('\n══════ FLOW 6: PROGRESS ══════');
  await page.evaluate(() => window.showTab && window.showTab('progress'));
  await page.waitForTimeout(500);

  const progress = await page.evaluate(() => {
    return {
      visible: document.getElementById('screen-progress')?.classList.contains('active'),
      hasSessions: !!document.getElementById('stat-sessions'),
      hasPoses: !!document.getElementById('stat-poses'),
      hasScore: !!document.getElementById('stat-score'),
      hasHistoryList: !!document.getElementById('session-history-list'),
      hasHistoryEmpty: !!document.getElementById('session-history-empty'),
    };
  });
  console.log(`  Progress: ${JSON.stringify(progress)}`);

  await page.screenshot({ path: path.join(OUT_DIR, '06-progress.png') });
  screenshots.push('06-progress.png');

  // ============================================================
  // FLOW 7: PROFILE → POSE EDITOR → MARKETPLACE
  // ============================================================
  console.log('\n══════ FLOW 7: PROFILE → EDITOR → MARKETPLACE ══════');
  await page.evaluate(() => window.showTab && window.showTab('profile'));
  await page.waitForTimeout(500);

  const profile = await page.evaluate(() => {
    return {
      visible: document.getElementById('screen-profile')?.classList.contains('active'),
      hasEditorBtn: !!document.querySelector('[onclick*="openPoseEditor"]'),
      hasMarketplaceBtn: !!document.querySelector('[onclick*="openMarketplace"]'),
    };
  });
  console.log(`  Profile: ${JSON.stringify(profile)}`);
  if (!profile.hasEditorBtn) log('profile', 'HIGH', 'orphaned_button', 'Pose editor button missing from profile', 'check openPoseEditor button');
  if (!profile.hasMarketplaceBtn) log('profile', 'HIGH', 'orphaned_button', 'Marketplace button missing from profile', 'check openMarketplace button');

  // Open pose editor
  await page.evaluate(() => window.openPoseEditor && window.openPoseEditor());
  await page.waitForTimeout(500);
  const editor = await page.evaluate(() => {
    return {
      visible: document.getElementById('screen-custom-pose-editor')?.classList.contains('active'),
      hasSliders: document.querySelectorAll('input[type="range"][id^="editor-slider-"]').length,
      hasAvatarPreview: !!document.getElementById('pose-editor-avatar-preview')?.querySelector('canvas'),
      hasSkelPreview: !!document.getElementById('pose-editor-skeleton-preview')?.querySelector('canvas'),
      hasGhostPreview: !!document.getElementById('pose-editor-ghost-preview')?.querySelector('canvas'),
      hasSaveBtn: !!document.querySelector('[onclick*="saveCustomPose"]'),
      hasUndoBtn: !!document.querySelector('[onclick*="undoPoseEdit"]'),
      hasRedoBtn: !!document.querySelector('[onclick*="redoPoseEdit"]'),
      hasResetBtn: !!document.querySelector('[onclick*="resetPoseEditor"]'),
      hasUseInSessionBtn: !!document.querySelector('[onclick*="useCustomPoseInSession"]'),
      hasBugReportSection: !!document.getElementById('pose-editor-bug-comment'),
    };
  });
  console.log(`  Pose editor: ${JSON.stringify(editor)}`);
  if (editor.hasSliders < 15) log('pose_editor', 'HIGH', 'missing_element', 'Fewer than 15 joint sliders', 'check EDITOR_JOINTS');
  if (!editor.hasAvatarPreview) log('pose_editor', 'MEDIUM', 'missing_element', 'Avatar preview canvas not rendered', 'check updatePoseEditorPreview');
  if (!editor.hasBugReportSection) log('pose_editor', 'MEDIUM', 'missing_element', 'Bug report section missing from editor', 'check bug report HTML');

  await page.screenshot({ path: path.join(OUT_DIR, '07-pose-editor.png') });
  screenshots.push('07-pose-editor.png');

  // Open marketplace
  await page.evaluate(() => window.openMarketplace && window.openMarketplace());
  await page.waitForTimeout(500);
  const marketplace = await page.evaluate(() => {
    return {
      visible: document.getElementById('screen-marketplace')?.classList.contains('active'),
      hasBrowseTab: !!document.getElementById('mp-tab-browse'),
      hasMineTab: !!document.getElementById('mp-tab-mine'),
      hasCreatorTab: !!document.getElementById('mp-tab-creator'),
      packCount: document.querySelectorAll('#mp-pack-grid > div').length,
      hasSearch: !!document.getElementById('mp-search'),
      hasFilterChips: document.querySelectorAll('.mp-filter-chip').length,
    };
  });
  console.log(`  Marketplace: ${JSON.stringify(marketplace)}`);
  if (marketplace.packCount === 0) log('marketplace', 'HIGH', 'empty_state', 'Marketplace has no packs', 'check initMarketplace / seed data');
  if (marketplace.hasFilterChips < 3) log('marketplace', 'MEDIUM', 'missing_element', 'Fewer than 3 filter chips', 'check filter chip HTML');

  // Test creator tab
  await page.evaluate(() => window.switchMarketplaceTab && window.switchMarketplaceTab('creator'));
  await page.waitForTimeout(300);
  const creatorTab = await page.evaluate(() => {
    return {
      visible: document.getElementById('mp-creator-view')?.style.display !== 'none',
      hasEarnings: !!document.getElementById('mp-creator-earnings'),
      hasPublishForm: !!document.getElementById('mp-new-pack-name'),
      hasPublishBtn: !!document.querySelector('[onclick*="publishPack"]'),
    };
  });
  console.log(`  Creator tab: ${JSON.stringify(creatorTab)}`);

  await page.screenshot({ path: path.join(OUT_DIR, '08-marketplace.png') });
  screenshots.push('08-marketplace.png');

  // ============================================================
  // FLOW 8: BUG REPORT
  // ============================================================
  console.log('\n══════ FLOW 8: BUG REPORT ══════');
  // Navigate back to pose editor
  await page.evaluate(() => window.openPoseEditor && window.openPoseEditor());
  await page.waitForTimeout(500);

  // Test bug report
  await page.evaluate(() => {
    const comment = document.getElementById('pose-editor-bug-comment');
    if (comment) comment.value = 'Test bug: pose looks wrong';
    const type = document.getElementById('pose-editor-bug-type');
    if (type) type.value = 'pose-layout';
    window.submitBugReportFromEditor && window.submitBugReportFromEditor();
  });
  await page.waitForTimeout(300);
  const bugReport = await page.evaluate(() => {
    return {
      hasReports: window._bugReports && window._bugReports.length > 0,
      reportCount: window._bugReports ? window._bugReports.length : 0,
      lastReportHasPoseData: window._bugReports && window._bugReports.length > 0 ?
        !!window._bugReports[window._bugReports.length - 1].poseData : false,
    };
  });
  console.log(`  Bug report: ${JSON.stringify(bugReport)}`);
  if (!bugReport.hasReports) log('bug_report', 'CRITICAL', 'orphaned_button', 'Bug report submission does not create a report', 'check submitBugReportFromEditor');
  if (!bugReport.lastReportHasPoseData) log('bug_report', 'HIGH', 'missing_element', 'Bug report does not include pose data', 'check poseData in report');

  // ============================================================
  // CROSS-CUTTING CHECKS
  // ============================================================
  console.log('\n══════ CROSS-CUTTING CHECKS ══════');

  // Check console errors
  console.log(`  Console errors/warnings: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    const realErrors = consoleErrors.filter(e => !e.includes('GIF') && !e.includes('favicon') && !e.includes('Deprecation') && !e.includes('Camera denied') && !e.includes('simulation mode'));
    console.log(`  Real errors (excluding GIF/favicon): ${realErrors.length}`);
    realErrors.slice(0, 10).forEach(e => {
      log('cross_cutting', 'HIGH', 'console_error', e.substring(0, 120), 'fix the console error');
    });
  }

  // Check for error boundary (global error handler)
  const hasErrorBoundary = await page.evaluate(() => {
    return !!window._errorBoundarySetup;
  });
  console.log(`  Error boundary exists: ${hasErrorBoundary}`);
  if (!hasErrorBoundary) log('cross_cutting', 'HIGH', 'error_boundary', 'No error boundary — uncaught errors will show white screen', 'add global error handler');

  // Check accessibility
  const a11y = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    const buttonsWithoutAria = Array.from(buttons).filter(b => !b.getAttribute('aria-label') && !b.textContent.trim());
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])').length;
    const inputsWithoutLabel = Array.from(document.querySelectorAll('input, textarea, select')).filter(i => !i.getAttribute('aria-label') && !i.getAttribute('placeholder') && !i.id).length;
    return {
      buttonsWithoutAria: buttonsWithoutAria.length,
      imagesWithoutAlt,
      inputsWithoutLabel,
    };
  });
  console.log(`  Accessibility: ${JSON.stringify(a11y)}`);
  if (a11y.buttonsWithoutAria > 5) log('cross_cutting', 'MEDIUM', 'accessibility', `${a11y.buttonsWithoutAria} buttons without aria-label`, 'add aria-labels');
  if (a11y.imagesWithoutAlt > 0) log('cross_cutting', 'MEDIUM', 'accessibility', `${a11y.imagesWithoutAlt} images without alt text`, 'add alt attributes');

  // Check for hardcoded emoji as UI
  const emojiAsUI = await page.evaluate(() => {
    const emojis = document.querySelectorAll('[aria-hidden="true"]');
    return emojis.length;
  });
  console.log(`  Emoji-as-UI elements: ${emojiAsUI}`);

  await browser.close();

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n══════ AUDIT SUMMARY ══════');
  const critical = issues.filter(i => i.severity === 'CRITICAL');
  const high = issues.filter(i => i.severity === 'HIGH');
  const medium = issues.filter(i => i.severity === 'MEDIUM');
  console.log(`Total issues: ${issues.length}`);
  console.log(`  CRITICAL: ${critical.length}`);
  console.log(`  HIGH: ${high.length}`);
  console.log(`  MEDIUM: ${medium.length}`);

  fs.writeFileSync(
    path.join(OUT_DIR, 'audit-results.json'),
    JSON.stringify({ issues, consoleErrors, screenshots, summary: { total: issues.length, critical: critical.length, high: high.length, medium: medium.length } }, null, 2)
  );
  console.log(`\nResults: ${path.join(OUT_DIR, 'audit-results.json')}`);
})();

