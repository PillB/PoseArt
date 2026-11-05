/* Smoke test the 745-pose photo ledger without mutating production. */
const path=require('path');
const fs=require('fs');
const vm=require('vm');
const { chromium }=require('playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const candidate=JSON.parse(fs.readFileSync(path.join(root,'deliverables/phase2-photo-evidence/poseart-photo-candidates.json'),'utf8'));
 const evidence=JSON.parse(fs.readFileSync(path.join(root,'deliverables/phase2-photo-evidence/source-reuse-and-gates.json'),'utf8'));
 const file=path.join(root,'deliverables/phase2-photo-evidence/poseart-phase2-evidence-atlas.html');
 const html=fs.readFileSync(file,'utf8');
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.includes('photoPanel'));
 if(scripts.length!==1)throw Error('Cannot identify atlas runtime');
 new Function(scripts[0]);
 if(candidate.rows.length!==745||evidence.unique_commons_files!==231)throw Error('Inventory mismatch');
 if(!candidate.rows.every(r=>r.title&&r.description&&r.query_status==='succeeded'))throw Error('Missing per-pose data');
 if(!fs.existsSync(chromium.executablePath())){
  const jsonTag=id=>{
   const m=html.match(new RegExp('<script id="'+id+'" type="application/json">([\\s\\S]*?)<\\/script>'));
   if(!m)throw Error('Missing data tag '+id);return m[1];
  };
  const tags={
   'atlas-data':{textContent:jsonTag('atlas-data')},
   'photo-evidence':{textContent:jsonTag('photo-evidence')}
  };
  const element=id=>tags[id]||(tags[id]={value:id==='search'?'':'all',innerHTML:'',textContent:'',disabled:false,
    listeners:{},insertAdjacentHTML(_where,markup){this.innerHTML+=markup},addEventListener(type,fn){this.listeners[type]=fn}});
  vm.runInNewContext(scripts[0],{document:{getElementById:element},window:{scrollTo(){}}});
  const count=s=>(s.match(/<article class="card">/g)||[]).length;
  if(count(element('cards').innerHTML)!==16)throw Error('Initial DOM render expected 16');
  if((element('cards').innerHTML.match(/<svg /g)||[]).length!==64)throw Error('Expected four diagrams for each initial pose');
  element('search').value='hand in pocket';element('search').listeners.input();
  if(count(element('cards').innerHTML)<1)throw Error('Search interaction failed');
  element('search').value='Classic Arabesque Line';element('category').value='fine-art';
  element('category').listeners.change();
  if(!element('cards').innerHTML.includes('Degas bronzes show arabesque'))throw Error('Visual-screen issue did not render');
  if((element('cards').innerHTML.match(/class="photo-item"/g)||[]).length!==3)throw Error('Expected 3 artwork cards');
  console.log(JSON.stringify({status:'DOM-simulation-pass-browser-unavailable',records:745,images:274,uniqueImages:231,
   verifiedPhotos:0,screenedPoses:10,generatedViewRecords:745,
   passed:['JS syntax','embedded JSON','initial cards','64 visible diagrams','search','category filter','three source cards','screen note'],
   limitation:'No local Chromium binary; actual browser rendering, layout overflow and network image loading NOT verified'},null,2));
  return;
 }
 const failures=[];
 const browser=await chromium.launch({headless:true});
 try{
  for(const viewport of [{width:1366,height:900},{width:390,height:844}]){
   const page=await browser.newPage({viewport});
   page.on('pageerror',e=>failures.push(e.message));
   await page.goto('file://'+file);
   await page.waitForSelector('.card');
   const first=await page.locator('.card').count();
   if(first!==16)failures.push('Expected initial 16 cards; got '+first);
   const diagrams=await page.locator('.card .view svg').count();
   if(diagrams!==64)failures.push('Expected 4 views per initial card; got '+diagrams);
   await page.locator('#search').fill('hand in pocket');
   await page.waitForTimeout(60);
   const hit=await page.locator('.card').count();
   if(hit<1)failures.push('Search did not find hand-in-pocket');
   await page.locator('#search').fill('');
   await page.locator('#category').selectOption('fine-art');
   const count=await page.locator('.card').count();
   if(count!==16)failures.push('Category page expected 16 cards; got '+count);
   await page.locator('#search').fill('Classic Arabesque Line');
   const labels=await page.locator('.photo-caption').count();
   if(labels!==3)failures.push('Expected three artwork source cards; got '+labels);
   const notes=await page.locator('.photo-issue').innerText();
   if(!notes.includes('turning'))failures.push('Visual-review note missing');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   if(overflow)failures.push('Horizontal overflow at '+viewport.width);
   await page.screenshot({path:path.join(root,'tmp/pose-photo-review/atlas-'+viewport.width+'.png'),fullPage:false});
   await page.close();
  }
 }finally{await browser.close();}
 if(failures.length){console.error(JSON.stringify({status:'fail',failures},null,2));process.exit(1);}
 console.log(JSON.stringify({status:'pass',records:745,images:274,uniqueImages:231,examplesScreened:10,layouts:[1366,390]},null,2));
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
