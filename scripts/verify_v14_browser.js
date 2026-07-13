const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const outDir = path.join(process.cwd(), 'audit', 'screenshots', 'v1.4');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8095/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => { window.completeOnboardingSkip(); window.goToSession('scurve-stand'); });
  const hashes = [];
  for (const [name, yaw] of [['front', 0], ['side', 90], ['back', 180]]) {
    const hash = await page.evaluate(({ yaw }) => {
      const host = document.getElementById('setup-pose-figure');
      host.innerHTML = '<canvas id="v14-avatar" width="160" height="180"></canvas>';
      const c = document.getElementById('v14-avatar');
      const p = POSES_LIBRARY['scurve-stand'];
      PoseSkeleton3D.renderAvatarFrame(c, 160, 180, p.joints, { yaw, pitch: 5, scale: 0.85, category: p.category, description: p.instructions });
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let h = 0; for (let i = 0; i < d.length; i += 31) h = (h * 33 + d[i]) >>> 0;
      return h;
    }, { yaw });
    hashes.push(hash);
    await page.screenshot({ path: path.join(outDir, 'scurve-avatar-' + name + '.png') });
  }
  console.log(JSON.stringify({ hashes, distinct: new Set(hashes).size, errors }));
  if (new Set(hashes).size !== 3 || errors.length) process.exitCode = 1;
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

