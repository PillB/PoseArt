/* Deterministic verification of the generated atlas and source coverage. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const m=JSON.parse(fs.readFileSync(path.join(root,'deliverables/poseart-manifest.json'),'utf8'));
const html=fs.readFileSync(path.join(root,'deliverables/poseart-visual-atlas.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)].map(s=>s[1]);
assert.equal(scripts.length,2);
const data=JSON.parse(scripts[0]);
new vm.Script(scripts[1]);
assert.equal(m.counts.poses,745);
assert.equal(m.counts.categories,16);
assert.equal(m.counts.uniqueIds,745);
assert.equal(m.counts.matchingGifs,745);
assert.equal(m.counts.unmatchedGifAssets,35);
assert.equal(m.counts.generatedViewCount,2980);
assert.equal(m.counts.verifiedIndependentPhotos,0);
assert.equal(m.proposed.length,8);
assert.equal(m.docs.countByType.pdf,0);
assert.equal(m.docs.countByType.docx,3);
assert.equal(m.docs.countByType.md,267);
assert.equal(m.poses.length,data.poses.length);
assert(m.poses.every(p=>p.title&&p.description&&p.tip&&p.gif&&p.fourViewsGenerated));
assert(m.poses.every(p=>Object.values(p.skeleton).every(vec=>vec.every(Number.isFinite))));

// Simulated DOM checks the atlas's interaction logic without a browser binary.
const ids=['atlas-data','stats','search','category','flags','reset','result-count','cards','page','prev','next','candidates','sources'];
const el={};
for(const id of ids)el[id]={textContent:'',innerHTML:'',value:['category','flags'].includes(id)?'all':'',disabled:false,
  addEventListener(t,cb){this.events??={};this.events[t]=cb;},insertAdjacentHTML(_position,str){this.innerHTML+=str;}};
el['atlas-data'].textContent=scripts[0];
const sb={document:{getElementById:id=>el[id]},window:{scrollTo(){}},console};
vm.createContext(sb);vm.runInContext(scripts[1],sb,{timeout:10000});
const renderedSvg=()=>((el.cards.innerHTML.match(/<svg/g)||[]).length);
assert.equal(renderedSvg(),64); // 16 cards x 4 views
el.search.value='contrapposto';el.search.events.input();
assert(el['result-count'].textContent.startsWith('5 matching poses'));
assert.equal(renderedSvg(),20);
el.search.value='';el.search.events.input();
el.category.value='couple';el.category.events.change();
assert(el['result-count'].textContent.startsWith('30 matching poses'));
el.next.onclick();assert.equal(renderedSvg(),56);
assert.equal((el.candidates.innerHTML.match(/class="candidate"/g)||[]).length,8);
assert.equal((el.sources.innerHTML.match(/<li>/g)||[]).length,14);
console.log('PASS: 745 records, 16 categories, 2,980 views, 780 GIF reconciliation, 270 docs, interaction smoke');
