// Deep interactive edge-case testing — walk each flow testing error recovery,
// stale state, and boundary conditions that vibe-coded apps commonly miss.

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(process.cwd(), 'audit', 'vibe-audit');
const issues = [];

function log(flow, severity, category, desc, fix) {
  issues.push({ flow, severity, category, desc, fix });
  const icon = severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : '🟡';
  console.log(`  ${icon} [${severity}] ${category}: ${desc}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);

  await page.goto('http://localhost:8095/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.completeOnboardingSkip());
  await page.waitForTimeout(500);

  // ═════ EDGE CASE 1: Search with special characters ═════
  console.log('\n══════ EDGE 1: Search edge cases ══════');
  for (const q of ['', '   ', '<script>', '12345', 'zzzzzzzzz', 'boudoir standing']) {
    await page.evaluate((query) => window.searchPoses(query), q);
    await page.waitForTimeout(200);
    const result = await page.evaluate(() => {
      const el = document.getElementById('search-results');
      return { visible: el?.style.display !== 'none', count: el?.querySelectorAll('.pose-list-item').length || 0 };
    });
    console.log(`  Search "${q}": visible=${result.visible}, count=${result.count}`);
    if (q === 'zzzzzzzzz' && result.visible && result.count === 0) {
      // Check for empty state
      const hasEmpty = await page.evaluate(() => !!document.querySelector('.search-empty'));
      if (!hasEmpty) log('search', 'HIGH', 'empty_state', `Search "${q}" returns 0 results but no empty state`, 'add search-empty div');
    }
  }
  await page.evaluate(() => window.searchPoses(''));
  await page.waitForTimeout(200);

  // ═════ EDGE CASE 2: Rapid navigation (stress test) ═════
  console.log('\n══════ EDGE 2: Rapid navigation ══════');
  const errors1 = [];
  page.on('pageerror', err => errors1.push(err.message));
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.showTab('home'));
    await page.evaluate(() => window.showTab('library'));
    await page.evaluate(() => window.showTab('gallery'));
    await page.evaluate(() => window.showTab('progress'));
    await page.evaluate(() => window.showTab('profile'));
  }
  await page.waitForTimeout(500);
  console.log(`  50 rapid tab switches: ${errors1.length} errors`);
  if (errors1.length > 0) log('navigation', 'HIGH', 'state_management', `Rapid navigation causes ${errors1.length} errors`, 'add navigation guard');

  // ═════ EDGE CASE 3: Open/close pose detail rapidly ═════
  console.log('\n══════ EDGE 3: Rapid pose detail open/close ══════');
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.openPoseDetail('scurve-stand'));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.closePoseSheet());
    await page.waitForTimeout(100);
  }
  const skeletonLeak = await page.evaluate(() => {
    // Check if skeleton3D instances leaked
    return window._activeSkeleton3D !== null;
  });
  console.log(`  After 5 open/close: skeleton leaked = ${skeletonLeak}`);
  if (skeletonLeak) log('pose_detail', 'MEDIUM', 'memory_leak', 'Skeleton3D instance not cleaned up after close', 'check closePoseSheet destroy');

  // ═════ EDGE CASE 4: Gallery after capture ═════
  console.log('\n══════ EDGE 4: Gallery stale state ══════');
  // Go to gallery first (should be empty)
  await page.evaluate(() => window.showTab('gallery'));
  await page.waitForTimeout(300);
  const galleryBefore = await page.evaluate(() => document.getElementById('gallery-count')?.textContent);
  console.log(`  Gallery count before capture: ${galleryBefore}`);

  // Do a capture
  await page.evaluate(() => window.goToSession('scurve-stand'));
  await page.waitForTimeout(300);
  await page.evaluate(() => { window.AppState.sessionOptions.timerIndex = 0; });
  await page.evaluate(() => window.startCameraSession());
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.capturePhoto());
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.saveToGallery());
  await page.waitForTimeout(1000);

  // Go to gallery — should show 1 item
  await page.evaluate(() => window.showTab('gallery'));
  await page.waitForTimeout(500);
  const galleryAfter = await page.evaluate(() => {
    return {
      count: document.getElementById('gallery-count')?.textContent,
      items: document.querySelectorAll('.gallery-item').length,
    };
  });
  console.log(`  Gallery after capture: count=${galleryAfter.count}, items=${galleryAfter.items}`);
  if (galleryAfter.items === 0) log('gallery', 'HIGH', 'stale_state', 'Gallery not updated after capture', 'check galleryDirty flag');

  // ═════ EDGE CASE 5: Session setup overlay cycling ═════
  console.log('\n══════ EDGE 5: Overlay mode cycling ══════');
  await page.evaluate(() => window.showTab('home'));
  await page.evaluate(() => window.goToSession('scurve-stand'));
  await page.waitForTimeout(300);
  for (const mode of ['avatar', 'skeleton', 'ghost', 'off', 'avatar']) {
    await page.evaluate((m) => {
      const chips = document.querySelectorAll('.overlay-mode-chip');
      let chip = null;
      chips.forEach(c => { if (c.getAttribute('onclick')?.includes(`'${m}'`)) chip = c; });
      if (chip) window.selectOverlayMode(chip, m);
    }, mode);
    await page.waitForTimeout(200);
    const preview = await page.evaluate(() => {
      const fig = document.getElementById('setup-pose-figure');
      return {
        hasCanvas: !!fig?.querySelector('canvas'),
        hasSvg: !!fig?.querySelector('svg'),
        hasPlaceholder: !!fig?.textContent?.includes('No overlay'),
      };
    });
    console.log(`  Overlay "${mode}": ${JSON.stringify(preview)}`);
  }

  // ═════ EDGE CASE 6: Pose editor undo/redo stress ═════
  console.log('\n══════ EDGE 6: Pose editor undo/redo ══════');
  await page.evaluate(() => window.openPoseEditor());
  await page.waitForTimeout(300);
  // Make changes
  for (let i = 0; i < 5; i++) {
    await page.evaluate((v) => window.onEditorSliderChange('spine', String(v)), i * 10);
    await page.waitForTimeout(450); // each debounced history entry is 400ms
  }
  // Undo all
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.undoPoseEdit());
    await page.waitForTimeout(50);
  }
  const afterUndo = await page.evaluate(() => document.getElementById('editor-val-spine')?.textContent);
  console.log(`  After 5 changes + 5 undos: spine = ${afterUndo}`);
  // Redo all
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.redoPoseEdit());
    await page.waitForTimeout(50);
  }
  const afterRedo = await page.evaluate(() => document.getElementById('editor-val-spine')?.textContent);
  console.log(`  After 5 redos: spine = ${afterRedo}`);

  // ═════ EDGE CASE 7: Marketplace purchase flow ═════
  console.log('\n══════ EDGE 7: Marketplace purchase ══════');
  await page.evaluate(() => window.openMarketplace());
  await page.waitForTimeout(300);
  // Purchase a free pack
  const freeButton = page.locator('#mp-pack-grid button', { hasText: 'FREE' }).first();
  const freePurchased = await freeButton.isVisible();
  if (freePurchased) await freeButton.click();
  await page.waitForTimeout(300);
  console.log(`  Free pack purchased: ${freePurchased}`);
  // Try to purchase same pack again (should show "Open" not "Free")
  const doublePurchase = await page.locator('#mp-pack-grid button', { hasText: 'Open Pack' }).first().isVisible() ? 'already owned' : 'purchase state missing';
  console.log(`  Double purchase attempt: ${doublePurchase}`);

  // ═════ EDGE CASE 8: Keyboard navigation (accessibility) ═════
  console.log('\n══════ EDGE 8: Keyboard navigation ══════');
  await page.evaluate(() => window.showTab('home'));
  await page.waitForTimeout(300);
  // Test Escape key
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  console.log(`  Escape pressed (should close sheets)`);
  // Test Tab key focus
  const focusableCount = await page.evaluate(() => {
    return document.querySelectorAll('button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])').length;
  });
  console.log(`  Focusable elements on home: ${focusableCount}`);

  // ═════ EDGE CASE 9: Data persistence warning ═════
  console.log('\n══════ EDGE 9: Data loss warning ══════');
  // Check if there's any warning about data loss
  const hasDataLossWarning = await page.evaluate(() => {
    // Check for any toast or banner about data not being saved
    const toasts = document.querySelectorAll('#toast, .toast, [class*="warning"]');
    return Array.from(toasts).some(t => t.textContent?.includes('saved') || t.textContent?.includes('close') || t.textContent?.includes('lost'));
  });
  console.log(`  Data loss warning exists: ${hasDataLossWarning}`);
  // The saveToGallery function does show a toast — check if it's been shown
  const dataLossWarned = await page.evaluate(() => typeof _dataLossWarned !== 'undefined' && _dataLossWarned);
  console.log(`  _dataLossWarned flag: ${dataLossWarned}`);

  // ═════ EDGE CASE 10: Mobile viewport adaptation ═════
  console.log('\n══════ EDGE 10: Mobile viewport ══════');
  const viewport = await page.evaluate(() => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      appWidth: document.getElementById('app')?.offsetWidth,
      appHeight: document.getElementById('app')?.offsetHeight,
      hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
    };
  });
  console.log(`  Viewport: ${JSON.stringify(viewport)}`);
  if (viewport.hasHorizontalScroll) log('mobile', 'HIGH', 'responsive', 'Horizontal scroll on mobile viewport', 'fix overflow');

  await browser.close();

  console.log('\n══════ EDGE CASE SUMMARY ══════');
  const critical = issues.filter(i => i.severity === 'CRITICAL').length;
  const high = issues.filter(i => i.severity === 'HIGH').length;
  const medium = issues.filter(i => i.severity === 'MEDIUM').length;
  console.log(`Total: ${issues.length} (CRITICAL: ${critical}, HIGH: ${high}, MEDIUM: ${medium})`);
  if (issues.length === 0) console.log('✅ ALL EDGE CASES PASSED — no issues found');
  if (critical || high) process.exitCode = 1;
})();
