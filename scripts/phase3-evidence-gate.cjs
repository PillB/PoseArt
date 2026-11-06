// Generate a review-only search plan for every live pose; enforce a hard release gate.
// This file intentionally does not crawl copyrighted sites or modify production geometry.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..');
const file = process.env.POSEART_DATA_JS || path.join(root, 'js/poses-data.js');
const context = {};
vm.runInNewContext(fs.readFileSync(file, 'utf8') + ';this.p=POSES_LIBRARY;this.c=POSE_CATEGORIES;', context, {timeout:20000});
const poses = Object.values(context.p), cats = Array.from(context.c);
if (poses.length !== 745 || cats.length !== 16) throw new Error('Unexpected live catalog: '+poses.length+' poses / '+cats.length+' categories');
const stop = new Set('the and with from your their that this then while into both one other gently softly slightly toward facing camera pose posing model subject head hand hands arm arms leg legs body'.split(' '));
const position = {standing:'standing',seated:'sitting on chair',leaning:'leaning against wall','lean-seat':'sitting with elbow support',kneeling:'kneeling',reclining:'reclining',dynamic:'moving action',eccentric:'creative portrait',couple:'two people together',accessible:'wheelchair accessible portrait',boudoir:'boudoir portrait',editorial:'editorial fashion','fine-art':'classical figure',fashion:'fashion photography','low-to-high':'rising from floor','high-to-low':'lowering toward seat'};
const exclude = {'scurve-stand':'-blackberry -phone -product -graph',contrapposto:'-architecture -facade -building','hand-in-hand-walk':'-riverwalk -landscape -bridge','profile-stand':'-monitor -equipment -furniture','fineart-classic-arabesque':'-sculpture -painting -bronze'};
const flow = {chair:['p06-chair-b',17],bench:['p05-bench-b',17],couch:['p02-couch-c',9],bed:['p03-bed-b',14],wall:['p04-wall-w',9]};
function keyTerms(v,n){return [...new Set((String(v||'').toLowerCase().match(/[a-z]{4,}/g)||[]).filter(x=>!stop.has(x)))].slice(0,n)}
function guide(id) {
  for (const [name,arr] of Object.entries(flow)) {
    const m = id.match(new RegExp('^'+arr[0]+'(\\d+)(?:-|$)'));
    if (m) {
      const number = Number(m[1]);
      if (!number || number>arr[1]) throw new Error('Guide page outside source: '+id);
      return {guide:name,number,pdf_page:number+2,source_family:'believeinboudoir.com/Yuliya-Panchenko',number_match_only:true,visually_approved:false};
    }
  }
  return null;
}
function facets(desc) {
  const rules={wall:/\bwall\b|doorframe|window frame/,chair:/\bchair\b|armrest|stool/,bench:/\bbench\b/,table:/\btable\b/,bed:/\bbed\b|mattress/,floor:/\bfloor\b/,wheelchair:/wheelchair/,elbow:/elbow/,crossed:/crossed|crossing/,knee:/\bknee\b|knees/,profile:/profile|sideways/,overhead:/overhead|above the head/,support:/support|resting|bracing/};
  return Object.keys(rules).filter(k=>rules[k].test(desc.toLowerCase()));
}
const ids = new Set();
const queue = poses.map((p,i)=>{
  if (!p.id || !p.name || !p.instructions || !p.category) throw new Error('Missing title/description/category at row '+i);
  if (ids.has(p.id)) throw new Error('Duplicate ID '+p.id);
  ids.add(p.id);
  const base=position[p.category]||p.category, negative=exclude[p.id]||'', f=facets(p.instructions);
  const title=p.name.replace(/\b[PBS]\d+\b/gi,'').trim();
  const anatomy=keyTerms(p.instructions,13).join(' ');
  const titleQuery=('"'+title+'" pose photograph '+base+' '+negative).trim();
  const anatomyQuery=('portrait photograph '+base+' '+anatomy+' '+negative).trim();
  const contactQuery=('photoshoot posing guide '+base+' '+(f.length?f.join(' '):keyTerms(p.instructions,5).join(' '))+' '+negative).trim();
  const archiveQuery=('site:commons.wikimedia.org '+base+' '+keyTerms(p.instructions,6).join(' ')+' '+negative).trim();
  const searches=[titleQuery,anatomyQuery,contactQuery,archiveQuery];
  return {order:i+1,id:p.id,category:p.category,title:p.name,description:p.instructions,facets:f,queries:searches,
    google_image_queries:searches.map(s=>'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(s)),
    bing_image_queries:searches.map(s=>'https://www.bing.com/images/search?q='+encodeURIComponent(s)),
    guide_page_lead:guide(p.id),independently_approved_photos:0,geometry_release:'blocked'};
});
const links=queue.filter(x=>x.guide_page_lead);
if (links.length!==66) throw new Error('Expected 66 numbered-guide matches; got '+links.length);
const families=new Set(links.map(x=>x.guide_page_lead.guide+':'+x.guide_page_lead.number));
if (families.size!==66) throw new Error('Duplicate guide ordinal');
if (!queue.find(x=>x.id==='scurve-stand').queries[0].includes('-blackberry')) throw new Error('S-curve collision heuristic missing');
const out={status:'RESEARCH_ONLY',pose_count:queue.length,category_count:cats.length,numbered_guide_leads:links.length,
  live_photographic_references_approved:0,required_minimum_independent_live_photos:2235,
  IMPORTANT:'Numbered photo guides are single-creator candidate leads, not approved independent reference families. Artwork, screenshots and 3D views never count as live photographs.',
  poses:queue};
const outPath=process.env.POSEART_RESEARCH_OUTPUT || path.join(root,'artifacts/research/phase3-search-plan.json');
fs.mkdirSync(path.dirname(outPath),{recursive:true});
fs.writeFileSync(outPath,JSON.stringify(out,null,2));
if (process.argv.includes('--require-production-evidence')) {
  // Deliberately fail closed until a separately reviewed evidence adjudication system exists.
  throw new Error('RELEASE BLOCKED: zero independently reviewed/approved photo evidence; 3-4 per pose and qualified reviewer required');
}
console.log('PASS research only: 745 poses, 66 numbered guide leads, 4 search families each, zero photo approvals, geometry blocked');