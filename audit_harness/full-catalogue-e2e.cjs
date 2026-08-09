// audit_harness/full-catalogue-e2e.cjs
// Full catalogue E2E: click every pose card, verify instructions + overlay + no errors.
// Runs in resumable batches of 30 poses.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.POSEART_BASE || 'http://127.0.0.1:8095';
const OUT = path.resolve(__dirname, '..', 'audit', 'overlay-recovery', 'catalogue-e2e');
fs.mkdirSync(OUT, { recursive: true });

const COVERAGE_FILE = path.join(OUT, 'coverage.json');
const BATCH_SIZE = 30;

// Load coverage state
let coverage = {};
if (fs.existsSync(COVERAGE_FILE)) {
  coverage = JSON.parse(fs.readFileSync(COVERAGE_FILE, 'utf8'));
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  // Login
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.getByTestId('login-username').fill('tester1');
  await page.getByTestId('login-password').fill(process.env.POSEART_TEST_PASSWORD || 'PoseArt2026!');
  await page.getByTestId('login-submit').click();
  await page.waitForFunction(() => {
    const ob1 = document.getElementById('screen-ob1');
    const home = document.getElementById('screen-home');
    return (ob1 && ob1.classList.contains('active')) || (home && home.classList.contains('active'));
  }, null, { timeout: 15000 });
  // Skip onboarding
  await page.evaluate(() => { window.showScreen && window.showScreen('home'); });
  await page.waitForTimeout(500);

  // Get all pose IDs
  const allIds = await page.evaluate(() => Object.keys(POSES_LIBRARY).sort());
  console.log(`[catalogue-e2e] ${allIds.length} poses total, ${Object.keys(coverage).length} already covered`);

  let batchStart = parseInt(process.argv[2] || '0');
  let processed = 0;
  let failed = 0;

  for (let i = batchStart; i < allIds.length && processed < BATCH_SIZE; i++) {
    const poseId = allIds[i];
    if (coverage[poseId] && coverage[poseId].status === 'PASS') { processed++; continue; }

    errors.length = 0; // reset per-pose errors

    try {
      // 1. Open pose detail
      await page.evaluate((id) => window.openPoseDetail && window.openPoseDetail(id), poseId);
      await page.waitForFunction(() => {
        const o = document.getElementById('pose-sheet-overlay');
        return o && o.classList.contains('visible');
      }, null, { timeout: 8000 });
      await page.waitForTimeout(300);

      // 2. Verify correct pose ID
      const poseInfo = await page.evaluate((id) => {
        const p = POSES_LIBRARY[id];
        return p ? { name: p.name, hasInstructions: !!p.instructions, hasTip: !!p.tip, category: p.category } : null;
      }, poseId);

      if (!poseInfo) { coverage[poseId] = { status: 'FAIL', reason: 'pose not found' }; failed++; continue; }

      // 3. Go to Session Setup
      await page.evaluate(() => window.goToSession && window.goToSession());
      await page.waitForFunction(() => {
        const s = document.getElementById('screen-session-setup');
        return s && s.classList.contains('active');
      }, null, { timeout: 5000 });
      await page.waitForTimeout(300);

      // 4. Verify instructions shown
      const setupInfo = await page.evaluate(() => {
        const instrEl = document.getElementById('setup-pose-instructions');
        const nameEl = document.getElementById('setup-pose-name');
        return {
          nameVisible: nameEl ? nameEl.textContent : 'MISSING',
          instructionsVisible: instrEl ? (instrEl.offsetParent !== null && instrEl.textContent.length > 10) : false,
          instructionsText: instrEl ? instrEl.textContent.slice(0, 50) : 'MISSING'
        };
      });

      // 5. Test each overlay mode renders
      let overlayResults = {};
      for (const mode of ['avatar', 'skeleton', 'ghost']) {
        await page.evaluate((m) => {
          const chip = document.querySelector(`[data-testid="overlay-${m}"]`);
          if (chip) window.selectOverlayMode(chip, m);
        }, mode);
        await page.waitForTimeout(300);
        const canvasCheck = await page.evaluate(() => {
          const fig = document.getElementById('setup-pose-figure');
          const canvas = fig ? fig.querySelector('canvas') : null;
          if (!canvas) return { hasCanvas: false };
          const ctx = canvas.getContext('2d');
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let solidPx = 0;
          for (let j = 3; j < img.data.length; j += 4) { if (img.data[j] > 20) solidPx++; }
          return { hasCanvas: true, width: canvas.width, height: canvas.height, solidPx };
        });
        overlayResults[mode] = canvasCheck;
      }

      // 6. Check for errors
      const hasErrors = errors.length > 0;

      // Record result
      const pass = poseInfo.hasInstructions && setupInfo.instructionsVisible && !hasErrors &&
                   overlayResults.avatar.hasCanvas && overlayResults.skeleton.hasCanvas && overlayResults.ghost.hasCanvas;
      
      coverage[poseId] = {
        status: pass ? 'PASS' : 'FAIL',
        name: poseInfo.name,
        category: poseInfo.category,
        hasInstructions: poseInfo.hasInstructions,
        instructionsVisible: setupInfo.instructionsVisible,
        overlayAvatar: overlayResults.avatar.hasCanvas,
        overlaySkeleton: overlayResults.skeleton.hasCanvas,
        overlayGhost: overlayResults.ghost.hasCanvas,
        errors: hasErrors ? errors.slice(0, 3) : [],
        testedAt: new Date().toISOString()
      };

      if (pass) { processed++; }
      else { failed++; console.log(`  [FAIL] ${poseId}: instr=${setupInfo.instructionsVisible} av=${overlayResults.avatar.hasCanvas} sk=${overlayResults.skeleton.hasCanvas} gh=${overlayResults.ghost.hasCanvas} errs=${errors.length}`); }

      // Go back
      await page.evaluate(() => window.goBack && window.goBack());
      await page.waitForTimeout(200);

      // Save coverage every 5 poses
      if (processed % 5 === 0) {
        fs.writeFileSync(COVERAGE_FILE, JSON.stringify(coverage, null, 2));
      }

    } catch (e) {
      coverage[poseId] = { status: 'FAIL', reason: e.message.slice(0, 100), testedAt: new Date().toISOString() };
      failed++;
      console.log(`  [ERROR] ${poseId}: ${e.message.slice(0, 80)}`);
    }
  }

  // Save final coverage
  fs.writeFileSync(COVERAGE_FILE, JSON.stringify(coverage, null, 2));

  // Summary
  const total = Object.keys(coverage).length;
  const passed = Object.values(coverage).filter(c => c.status === 'PASS').length;
  const failedCount = Object.values(coverage).filter(c => c.status === 'FAIL').length;
  console.log(`\n[catalogue-e2e] Batch done: ${processed} processed, ${failed} failed`);
  console.log(`[catalogue-e2e] Total coverage: ${total}/${allIds.length} (${passed} PASS, ${failedCount} FAIL)`);

  await browser.close();
})();
