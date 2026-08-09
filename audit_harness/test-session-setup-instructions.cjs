// test-session-setup-instructions.js
// Red test: Session Setup must show the selected pose's instructions/description.
// This test FAILS until the UI is implemented.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  // Login
  await page.goto('http://127.0.0.1:8095/', { waitUntil: 'load' });
  await page.getByTestId('login-username').fill('tester1');
  await page.getByTestId('login-password').fill('PoseArt2026!');
  await page.getByTestId('login-submit').click();
  await page.waitForFunction(() => {
    const ob1 = document.getElementById('screen-ob1');
    const home = document.getElementById('screen-home');
    return (ob1 && ob1.classList.contains('active')) || (home && home.classList.contains('active'));
  }, null, { timeout: 15000 });
  // Skip onboarding
  await page.evaluate(() => { window.showScreen && window.showScreen('home'); });
  await page.waitForTimeout(500);

  // Open a pose detail
  await page.evaluate(() => { window.openPoseDetail && window.openPoseDetail('power-stance'); });
  await page.waitForFunction(() => {
    const o = document.getElementById('pose-sheet-overlay');
    return o && o.classList.contains('visible');
  }, null, { timeout: 10000 });
  await page.waitForTimeout(500);

  // Go to Session Setup
  await page.evaluate(() => { window.goToSession && window.goToSession(); });
  await page.waitForFunction(() => {
    const s = document.getElementById('screen-session-setup');
    return s && s.classList.contains('active');
  }, null, { timeout: 10000 });
  await page.waitForTimeout(500);

  // RED CHECK: Verify that pose instructions are displayed
  const hasInstructions = await page.evaluate(() => {
    // Look for any element showing the pose instructions
    const setupScreen = document.getElementById('screen-session-setup');
    if (!setupScreen) return { found: false, reason: 'session-setup screen not found' };
    
    // Check if there's an element showing instructions
    const instructionsEl = setupScreen.querySelector('[data-testid="setup-pose-instructions"], #setup-pose-instructions, .setup-pose-instructions, .pose-instructions');
    const descText = setupScreen.textContent || '';
    const pose = window.POSES_LIBRARY && window.POSES_LIBRARY['power-stance'];
    const expectedInstructions = pose ? pose.instructions : '';
    
    return {
      found: !!instructionsEl,
      hasInstructionsElement: !!instructionsEl,
      instructionsVisible: instructionsEl ? instructionsEl.offsetParent !== null : false,
      expectedInstructions: expectedInstructions ? expectedInstructions.slice(0, 50) : 'no pose',
      descContainsInstructions: descText.includes(expectedInstructions.slice(0, 20)),
      reason: instructionsEl ? 'instructions element found' : 'NO instructions element in Session Setup'
    };
  });

  console.log('=== SESSION SETUP INSTRUCTIONS TEST ===');
  console.log('Result:', JSON.stringify(hasInstructions, null, 2));
  
  if (hasInstructions.found && hasInstructions.instructionsVisible) {
    console.log('PASS: Session Setup shows pose instructions');
    await browser.close();
    process.exit(0);
  } else {
    console.log('FAIL: Session Setup does NOT show pose instructions —', hasInstructions.reason);
    await browser.close();
    process.exit(1);
  }
})();
