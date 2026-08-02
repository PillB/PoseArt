// audit_harness/debug-dom.js
const fs = require('fs');
const path = require('path');
const flow = require('./lib/pose-flow');

(async () => {
  const { browser, ctx } = await flow.newContext(flow.MOBILE);
  const page = await ctx.newPage();
  await page.goto(flow.BASE + '/', { waitUntil: 'load' });
  await page.getByTestId('login-username').waitFor({ state: 'visible', timeout: 15000 });
  await page.getByTestId('login-username').fill('tester1');
  await page.getByTestId('login-password').fill('PoseArt2026!');
  await page.getByTestId('login-submit').click();
  await page.waitForTimeout(2500);
  // Dump all screens + their active state + nav
  const info = await page.evaluate(() => {
    const screens = Array.from(document.querySelectorAll('[id]')).filter(e => e.classList && (e.classList.contains('screen') || e.classList.contains('app-screen') || e.tagName === 'SECTION')).map(e => ({ id: e.id, classes: e.className, tag: e.tagName, visible: e.offsetParent !== null }));
    const navs = Array.from(document.querySelectorAll('nav, .bottom-nav, [data-tab], [onclick*="showScreen"]')).map(e => ({ tag: e.tagName, text: (e.textContent||'').trim().slice(0,30), onclick: e.getAttribute('onclick'), dataTab: e.getAttribute('data-tab'), classes: e.className }));
    const visibleIds = Array.from(document.querySelectorAll('[id]')).filter(e => e.offsetParent !== null).map(e => e.id).slice(0, 40);
    return { screens: screens.slice(0, 40), navs: navs.slice(0, 30), visibleIds };
  });
  console.log(JSON.stringify(info, null, 2));
  await page.screenshot({ path: '/tmp/poseart-after-login.png' });
  await browser.close();
})();
