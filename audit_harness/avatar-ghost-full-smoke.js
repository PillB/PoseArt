const flow = require('./lib/pose-flow');
const fs = require('fs');
(async () => {
  const { browser, ctx } = await flow.newContext({ width: 300, height: 400, deviceScaleFactor: 1 });
  const { page, err } = await flow.login(ctx);
  await page.waitForFunction(() => typeof PoseSkeleton3D !== 'undefined' && typeof POSES_LIBRARY !== 'undefined', null, { timeout: 20000 });
  const ids = await page.evaluate(() => Object.keys(POSES_LIBRARY));
  let ok = 0, fail = 0; const fails = [];
  for (const id of ids) {
    const r = await page.evaluate((id) => {
      const pose = POSES_LIBRARY[id]; const joints = pose.joints||{};
      let c = document.getElementById('_ag_fs');
      if (!c) { c = document.createElement('canvas'); c.id='_ag_fs'; c.style.position='fixed'; c.style.left='-9999px'; document.body.appendChild(c); }
      const out = {};
      for (const mode of ['avatar','skeleton','ghost']) {
        try {
          c.width=110; c.height=150; c.style.width='110px'; c.style.height='150px';
          const ctx2 = c.getContext('2d'); ctx2.setTransform(1,0,0,1,0,0); ctx2.clearRect(0,0,110,150);
          if (mode==='avatar') PoseSkeleton3D.renderAvatarFrame(c,110,150,joints,{yaw:0,pitch:0,scale:1,category:pose.category,description:pose.instructions});
          else if (mode==='ghost') PoseSkeleton3D.renderGhostFrame(c,110,150,joints,{yaw:0,pitch:0,scale:1,category:pose.category,description:pose.instructions});
          else { const s=Object.create(PoseSkeleton3D); s.init(c,110,150); s.setPose(joints,{category:pose.category,description:pose.instructions}); s.setViewAngle(0,0); try{s.stopAutoRotate();}catch(e){} s.render(); s.destroy(); }
          const img=ctx2.getImageData(0,0,110,150).data; let n=0; for(let i=3;i<img.length;i+=4) if(img[i]>12)n++;
          out[mode] = n>5;
          if(!out[mode]) out[mode+'_err']='px='+n;
        } catch(e){ out[mode]=false; out[mode+'_err']=String(e.message||e).slice(0,80); }
      }
      return out;
    }, id);
    for (const mode of ['avatar','skeleton','ghost']) { if (r[mode]) ok++; else { fail++; if(fails.length<12) fails.push(id+'/'+mode+':'+(r[mode+'_err']||'?')); } }
  }
  fs.writeFileSync('audit/avatar-ghost/tests/full-smoke-results.json', JSON.stringify({ total: ids.length*3, ok, fail, fails, pageerrors: err.pageerrors.length, consoleErrors: err.console.length }, null, 2));
  console.log('FULL SMOKE: '+ok+'/'+ids.length*3+' ok, '+fail+' failed, '+err.pageerrors.length+' pageerrors');
  await browser.close();
})();
