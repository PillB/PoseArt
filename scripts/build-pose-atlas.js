/* Reproducible PoseArt atlas; no mutation of the live POSES_LIBRARY. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const cp = require('child_process');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'deliverables');
fs.mkdirSync(out, { recursive: true });
const posePath = path.join(root, 'js/poses-data.js');
const poseSource = fs.readFileSync(posePath, 'utf8');
const realm = { console };
vm.runInNewContext(poseSource + ';this.poseData=POSES_LIBRARY;this.categories=POSE_CATEGORIES;', realm, { filename: posePath });
const rendererRealm = { console, window: {}, document: {} };
rendererRealm.window = rendererRealm;
vm.runInNewContext(fs.readFileSync(path.join(root,'js/pose-skeleton-3d.js'),'utf8'), rendererRealm);
const buildPose = rendererRealm.PoseSkeleton3D._internals.buildPose;
const tree = cp.execFileSync('git',['-c','core.quotepath=false','ls-tree','-r','--name-only','HEAD'],{cwd:root,encoding:'utf8',maxBuffer:12*1024*1024}).trim().split('\n');
const gifPaths = new Set(tree.filter(f => f.startsWith('gifs/') && f.endsWith('.gif')));
const categories = Array.from(realm.categories).map(c=>({id:c.id,name:c.name,description:c.description,count:c.count}));
const knownCategories = new Set(categories.map(c=>c.id));
const sweepRunId = process.env.POSEART_AUDIT_RUN_ID || 'run-2026-11-05-pose-atlas';
if (!/^run-[a-zA-Z0-9-]+$/.test(sweepRunId)) throw new Error('Unsafe audit run id');
const sweep = JSON.parse(fs.readFileSync(path.join(root,'artifacts/pose-audit',sweepRunId,'geometry-sweep.json'),'utf8'));
const sweepIndex = new Map(sweep.map(s=>[s.id,s]));
const head = cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();

const research = [
  {id:'R1',title:'Adobe: sitting and hand poses',url:'https://www.adobe.com/creativecloud/photography/discover/sitting-poses-and-hand-poses.html',for:['seated','lean-seat','boudoir','fashion']},
  {id:'R2',title:'Adobe: five couples poses',url:'https://www.adobe.com/creativecloud/photography/discover/engagement-photo-poses.html',for:['couple']},
  {id:'R3',title:'Nikon: portrait posing and camera angle',url:'https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/take-better-portraits',for:['standing','leaning','editorial']},
  {id:'R4',title:'Canon: posing tips for portraits',url:'https://www.usa.canon.com/learning/training-articles/training-articles-list/posing-tips-for-successful-portraits',for:['standing','reclining','kneeling']},
  {id:'R5',title:'PPA: boudoir posing guide',url:'https://www.ppa.com/photovision/series/boudoir-photography-with-yuliya-panchenko/watch/boudoir-photography-posing-guide-yuliya-panchenko',for:['boudoir']},
  {id:'R6',title:'PPA: thoughtful disability portrait sessions',url:'https://www.ppa.com/ppmag/articles/thoughtful-portrait-sessions',for:['accessible']},
  {id:'R7',title:'Permobil: lifestyle photography guidelines',url:'https://hub.permobil.com/hubfs/Permobil%20Guidelines_2021.pdf',for:['accessible']},
  {id:'R8',title:'The Met: Harriet Frishmuth, The Vine',url:'https://www.metmuseum.org/art/collection/search/487583',for:['dynamic','fine-art','eccentric']},
  {id:'R9',title:'The Met: Degas, Arabesque Devant',url:'https://www.metmuseum.org/art/collection/search/196454',for:['fine-art','dynamic']},
  {id:'R10',title:'Adobe: editorial photography',url:'https://www.adobe.com/es/creativecloud/photography/discover/editorial-photography.html',for:['editorial','eccentric','fashion']},
  {id:'R11',title:'Adobe: photoshoot props',url:'https://www.adobe.com/creativecloud/photography/discover/photoshoot-props.html',for:['fashion','leaning','lean-seat']},
  {id:'R12',title:'Google: Pose Landmarker documentation',url:'https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker',for:categories.map(c=>c.id)},
  {id:'R13',title:'Wikimedia Commons: Contrapposto',url:'https://commons.wikimedia.org/wiki/Category:Contrapposto',for:['standing','fine-art']},
  {id:'R14',title:'PPA: boudoir client trust',url:'https://www.ppa.com/ppmag/articles/boudoir-photography-making-clients-feel-beautiful',for:['boudoir']},
];
const proposed = [
  {id:'research-couple-seated-counterturn',category:'couple',name:'Seated Counterturn Pair',description:'Two adults sit side-by-side on a bench, hips facing forward while upper torsos rotate in opposite directions, leaving a deliberate gap of negative space between their shoulders. Both retain independent supports and eye lines.',why:'Adds a non-contact, symmetrical pair option; legacy couple single-rig preview cannot encode two bodies.',requirements:['two target people','bench support','separate root transforms','non-contact variant'],sources:['R1','R2']},
  {id:'research-accessible-wheel-rim-portrait',category:'accessible',name:'Wheel-Rim Three-Quarter Portrait',description:'The wheelchair user selects a comfortable three-quarter chair orientation and rests one hand lightly on the wheel rim while the other remains in a personally comfortable position. Photograph at their eye level, preserving the chair and hand as intentional visual elements.',why:'Extends the seated portrait sequence to active hand-on-wheel framing.',requirements:['wheelchair prop/contact','subject-led mobility choices','functional hand placement','chair orientation'],sources:['R6','R7']},
  {id:'research-dynamic-coat-catch-turn',category:'dynamic',name:'Coat-Catch Mid-Turn',description:'During a slow quarter turn, the subject catches the open edge of a lightweight coat with the trailing hand; the opposite foot establishes a grounded pivot and the fabric creates a secondary curved motion line.',why:'Separates actual body motion from fabric-prop motion rather than asking for an extreme joint angle.',requirements:['coat prop','two keyframes','turn direction','stable pivot'],sources:['R8','R11']},
  {id:'research-lean-seat-table-arc',category:'lean-seat',name:'Tabletop Elbow Arc',description:'Sitting sideways to a table, the subject rests the near elbow on a stable tabletop and lifts the forearm in a curved gesture beside the face, keeping the shoulder soft and the opposite arm relaxed in the lap.',why:'Clear prop-to-elbow contact and curved negative space, distinct from chin-on-hands portraits.',requirements:['table contact','seated support','elbow support check'],sources:['R1','R11']},
  {id:'research-editorial-open-jacket-axis',category:'editorial',name:'Open-Jacket Diagonal Axis',description:'A standing model turns the ribcage one quarter away from the camera while one hand opens a jacket lapel and the other arm creates a long counter-diagonal below the waist. Keep the garment interaction legible in profile.',why:'Specifies garment contact and negative-space design for editorial storytelling.',requirements:['jacket prop','lapel-hand contact','front and profile views'],sources:['R10','R11']},
  {id:'research-fineart-orans-soft',category:'fine-art',name:'Open Palms Sculpture Study',description:'A calm upright pose with forearms raised to either side of the torso, elbows softened, palms open toward the light, and subtle contrapposto through the pelvis. The pose is designed for classical sculptural side-lighting.',why:'Adds a bilateral open-palm gesture rather than another arabesque or backbend.',requirements:['hand orientation','wrist/forearm rig support','balance review'],sources:['R8','R13']},
  {id:'research-lowhigh-assisted-chair-rise',category:'low-to-high',name:'Supported Chair Rise Sequence',description:'Begin with feet comfortably planted under the knees, shift the torso forward as appropriate, then rise using armrests or another agreed support when needed. Finish upright with a relaxed gaze and no forced speed.',why:'Adds a deliberately supported, accessible low-to-high transition.',requirements:['temporal frames','support contacts','individual mobility adaptation'],sources:['R1','R6','R7']},
  {id:'research-highlow-controlled-side-sit',category:'high-to-low',name:'Controlled Side-Sit Descent',description:'From standing beside a stable bench, turn toward the seat, reach an optional hand to the backrest, bend both knees comfortably, and lower into a side-facing seated finish without an unsupported fall.',why:'Introduces a controlled descent with explicit support instead of a dramatic collapse.',requirements:['temporal frames','bench support','safe range of motion'],sources:['R1','R4']},
];

const fingerprints = new Map();
const nameIndex = new Map();
const poses = Object.entries(realm.poseData).map(([key,p],index)=>{
  const joints = Object.fromEntries(Object.entries(p.joints||{}).sort(([a],[b])=>a.localeCompare(b)));
  const signature = JSON.stringify(joints);
  fingerprints.set(signature,[...(fingerprints.get(signature)||[]),p.id]);
  const nKey = (p.name||'').toLowerCase().replace(/[^a-z]/g,'');
  nameIndex.set(nKey,[...(nameIndex.get(nKey)||[]),p.id]);
  const skeleton = buildPose(joints);
  const finite = Object.values(skeleton).every(pt=>['x','y','z'].every(axis=>Number.isFinite(pt[axis])));
  const matchGif = `gifs/${p.id}.gif`;
  const s = sweepIndex.get(p.id);
  return {
    order:index+1,id:p.id,key,category:p.category,title:p.name,description:p.instructions||'',tip:p.tip||'',
    difficulty:p.difficulty||'',angle:p.angle||'',intent:p.intent||'',effort:p.effort||'',tags:p.tags||[],joints,
    skeleton:Object.fromEntries(Object.entries(skeleton).map(([joint,v])=>[joint,[v.x,v.y,v.z].map(n=>Math.round(n*10000)/10000)])),
    source:`js/poses-data.js#${p.id}`,gif:gifPaths.has(matchGif)?matchGif:null,
    fourViewsGenerated:finite,validSkeleton:finite,geometryFlagCount:s?.defects?.length||0,
    geometryFlags:(s?.defects||[]).map(d=>({kind:d.claim,severity:d.severity,note:d.actual})),
    independentReferencePhotosVerified:0,
    externalReferenceStatus:'category-level sources; per-pose image candidates not independently reviewed',
    sourceIds:research.filter(r=>r.for.includes(p.category)&&r.id!=='R12').map(r=>r.id),
  };
});

const dupConfig = [...fingerprints.values()].filter(x=>x.length>1);
const dupTitle = [...nameIndex.values()].filter(x=>x.length>1);
const matchedGif = poses.filter(p=>p.gif).length;
const docFiles = tree.filter(p=>/\.(md|pdf|docx)$/i.test(p)).map(p=>({path:p,type:path.extname(p).slice(1).toLowerCase(),section:p.split('/')[0]}));
const counts = Object.fromEntries(categories.map(c=>[c.id,poses.filter(p=>p.category===c.id).length]));
const issues = [];
if (poses.length!==745) issues.push({severity:'error',description:'Pose count changed since baseline'});
if (new Set(poses.map(p=>p.id)).size!==poses.length) issues.push({severity:'error',description:'Duplicate pose IDs'});
if (poses.some(p=>p.key!==p.id||!knownCategories.has(p.category)||!p.title||!p.description||!p.validSkeleton)) issues.push({severity:'error',description:'Missing essential pose data, category, or valid skeleton'});
issues.push({severity:'medium',description:`${matchedGif} of ${poses.length} poses have exact GIF matches; ${gifPaths.size-matchedGif} additional historical GIF assets need archive classification`});
issues.push({severity:'high',description:`${dupConfig.length} duplicate joint-signature groups involving ${dupConfig.flat().length} poses; some involve two-person scenes`});
issues.push({severity:'high',description:'Independent, appropriately licensed per-pose photographic reference images are not yet collected or verified'});

const manifest={
  name:'PoseArt Pose Research and Four-View Atlas',date:'2026-11-05',sourceRepo:'https://github.com/PillB/PoseArt',sourceCommit:head,
  methodology:'Deterministic runtime catalog extraction + original PoseSkeleton3D buildPose forward kinematics + four yaw projections. NOT human anatomical approval or independent photo verification.',
  counts:{poses:poses.length,categories:categories.length,matchingGifs:matchedGif,unmatchedGifAssets:gifPaths.size-matchedGif,uniqueIds:new Set(poses.map(p=>p.id)).size,generatedViewCount:poses.filter(p=>p.fourViewsGenerated).length*4,verifiedIndependentPhotos:0,geometryFlagged:sweep.filter(s=>s.defects&&s.defects.length).length,proposedAdditions:proposed.length},
  categories:categories.map(c=>({...c,count:counts[c.id]})),
  docs:{files:docFiles,countByType:Object.fromEntries(['md','pdf','docx'].map(ext=>[ext,docFiles.filter(f=>f.type===ext).length]))},
  research,proposed,duplicateJointGroups:dupConfig,duplicateNormalizedTitleGroups:dupTitle,issues,poses,
};

const esc = s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const csv = rows=>rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n')+'\n';
fs.writeFileSync(path.join(out,'poseart-inventory.csv'),csv([
  ['order','category','id','title','description','tip','difficulty','angle','gif','generated_views','independent_photos_verified','heuristic_flag_count','source_commit'],
  ...poses.map(p=>[p.order,p.category,p.id,p.title,p.description,p.tip,p.difficulty,p.angle,p.gif||'',p.fourViewsGenerated?4:0,p.independentReferencePhotosVerified,p.geometryFlagCount,head])
]));
fs.writeFileSync(path.join(out,'poseart-manifest.json'),JSON.stringify(manifest,null,2));

// HTML is self-contained: all 745 records and 3D skeleton coordinates are embedded.
// The canonical GIFs and four external reference-discovery links need internet;
// the four generated schematic views do not. None is misrepresented as a photo.
const reduced={...manifest,docs:{countByType:manifest.docs.countByType},poses:poses.map(p=>({...p,geometryFlags:undefined}))};
const dataLiteral=JSON.stringify(reduced).replace(/</g,'\\u003c');
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PoseArt · The Pose Atlas · 745 Poses</title>
<style>
:root{--ink:#123a39;--teal:#176c67;--gold:#a57a32;--paper:#f8f5ed;--line:#d9d4c8;--muted:#607576}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.48 system-ui,-apple-system,sans-serif}
header{background:#123a39;color:#f9f4e9;padding:30px max(18px,calc((100% - 1200px)/2));border-bottom:5px solid #c6a15c}
header h1{font:600 clamp(27px,4vw,44px)/1.1 Georgia,serif;margin:4px 0 8px}header p{max-width:900px;margin:0;color:#d9e7e0}
main{max-width:1240px;margin:auto;padding:22px 16px 70px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0 0 20px}.stats div{padding:13px;background:white;border:1px solid var(--line);border-radius:8px}.stats b{display:block;font:700 28px Georgia;color:var(--teal)}.stats span{font-size:12px;color:var(--muted)}
.note{padding:14px 16px;background:#fff8e9;border-left:4px solid var(--gold);margin:14px 0 20px}.toolbar{display:flex;flex-wrap:wrap;gap:9px;align-items:center;margin:0 0 18px}
input,select,button{font:inherit;border:1px solid #b9c3ba;border-radius:6px;padding:9px 11px;background:#fff;color:var(--ink)}input{flex:1 1 270px}button{cursor:pointer}button:focus,input:focus,select:focus,a:focus{outline:3px solid #c49b46;outline-offset:2px}
.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px}.card{background:white;border:1px solid var(--line);border-radius:11px;padding:17px;min-width:0;box-shadow:0 2px 7px #263d3610}
.eyebrow{font-size:11px;color:#55736d;text-transform:uppercase;letter-spacing:.08em;font-weight:700}.card h2{font:600 25px/1.18 Georgia;margin:6px 0}
.card p{margin:9px 0}.card .meta{font-size:12px;color:var(--muted);margin-bottom:12px}.views{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin:14px 0}
.view{background:#f1f5ef;border:1px solid #dce7dc;border-radius:7px;min-width:0}.view svg{width:100%;height:auto;display:block;aspect-ratio:4/5}.view small{display:block;text-align:center;padding:3px;font-size:10px;color:#436d65}
.refs{display:flex;flex-wrap:wrap;gap:7px;margin-top:9px}.refs a{font-size:12px;border:1px solid #bed4cf;padding:5px 7px;border-radius:5px;color:#116761;text-decoration:none}.refs a:hover{text-decoration:underline}
.tip{font-size:13px;color:#4a625c}.warning{font-size:12px;color:#80652c;padding:7px 9px;background:#fff8e9;border-radius:5px;margin-top:8px}
.pager{display:flex;align-items:center;justify-content:center;gap:18px;margin:22px auto}.pager button{min-width:80px}
section.extra{border-top:1px solid var(--line);margin-top:40px;padding-top:24px}section.extra h2{font:600 27px Georgia}.candidate{background:#fff;border:1px solid var(--line);padding:15px;margin:10px 0;border-radius:7px}.candidate h3{margin:0 0 6px;font:600 19px Georgia}
.source-list{columns:2;padding-left:22px}.source-list li{break-inside:avoid;margin-bottom:7px}a{color:#0e6962;overflow-wrap:anywhere}
@media(max-width:800px){.cards{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.source-list{columns:1}}@media(max-width:400px){.views{grid-template-columns:repeat(2,1fr)}}
@media print{header{padding:15px}.toolbar,.pager{display:none}.cards{grid-template-columns:1fr}.card{break-inside:avoid}.card:nth-child(n+9){display:none}}
</style></head><body>
<header><div class="eyebrow" style="color:#c9ad75">RESEARCH EDITION · 5 NOV 2026</div><h1>PoseArt: The Pose Atlas</h1><p>Complete title, instruction and joint-configuration inventory. Four original, reproducible 3D-derived schematic views per pose. Photo-source discovery is clearly separated from vetted photographic evidence.</p></header>
<main><div class="stats" id="stats"></div><div class="note"><strong>Evidence boundary.</strong> Each card has four generated anatomical diagrams, and most have an existing PoseArt GIF. These are <em>not</em> four independent photographic references. External image links are discovery searches, not vetted examples or permission to reuse photographs. Couple cards show the legacy single-body rig and do not verify partner placement.</div>
<div class="toolbar"><input id="search" aria-label="Search poses by name, instructions or ID" placeholder="Search 745 poses, descriptions, tags…"><select id="category" aria-label="Filter category"><option value="all">All 16 categories</option></select><select id="flags" aria-label="Filter geometry flags"><option value="all">All geometry statuses</option><option value="flagged">Flagged by heuristics</option><option value="clean">No heuristic flags</option></select><button id="reset">Reset</button></div>
<p id="result-count" aria-live="polite"></p><div id="cards" class="cards"></div><div class="pager"><button id="prev">Previous</button><span id="page"></span><button id="next">Next</button></div>
<section class="extra"><h2>Research additions · proposed, not deployed</h2><p>These eight candidates have new titles and descriptions, but need independent visual examples, rig/prop support, anatomy review and human sign-off before entering the live app. They are excluded from the verified 745 count.</p><div id="candidates"></div></section>
<section class="extra"><h2>Research source ledger</h2><p>The following references support category-level photographic techniques and geometric methods. They do not establish a verified photo for each of the 745 entries.</p><ol class="source-list" id="sources"></ol></section>
<section class="extra"><h2>Methods and limitations</h2><p>Source <code>js/poses-data.js</code> at commit <code>${esc(head.slice(0,12))}</code>. Four views are yaw 0°, 45°, 90° and 180° projected from the real PoseSkeleton3D forward-kinematics output. Skeleton markers are 3D projections, not measured human motion capture. The historical baseline had 513 flagged poses; the re-run has 440 with heuristic flags. A clean heuristic scan cannot certify an accurate pose, especially for couples, accessories and supports.</p></section></main>
<script id="atlas-data" type="application/json">${dataLiteral}</script>
<script>
(()=>{'use strict';const D=JSON.parse(document.getElementById('atlas-data').textContent);let page=0;const perPage=16;
const $=id=>document.getElementById(id);const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const bonePairs=[['head','neck'],['neck','leftShoulder'],['neck','rightShoulder'],['neck','spine'],['spine','hips'],['leftShoulder','leftElbow'],['leftElbow','leftWrist'],['rightShoulder','rightElbow'],['rightElbow','rightWrist'],['hips','leftHip'],['hips','rightHip'],['leftHip','leftKnee'],['leftKnee','leftAnkle'],['leftAnkle','leftFoot'],['rightHip','rightKnee'],['rightKnee','rightAnkle'],['rightAnkle','rightFoot']];
function diagram(p,yaw,label){const r=yaw*Math.PI/180;const rot=Object.fromEntries(Object.entries(p.skeleton).map(([k,v])=>[k,[v[0]*Math.cos(r)+v[2]*Math.sin(r),v[1],-v[0]*Math.sin(r)+v[2]*Math.cos(r)]]));const a=Object.values(rot);const xx=a.map(v=>v[0]),yy=a.map(v=>v[1]);const loX=Math.min(...xx),hiX=Math.max(...xx),loY=Math.min(...yy),hiY=Math.max(...yy);const sc=Math.min(140/Math.max(.18,hiX-loX),190/Math.max(.18,hiY-loY));const cx=(loX+hiX)/2,cy=(loY+hiY)/2;const xy=k=>[(80+(rot[k][0]-cx)*sc).toFixed(2),(104-(rot[k][1]-cy)*sc).toFixed(2)];const lines=bonePairs.map(([a,b])=>{const x=xy(a),y=xy(b);const col=a.startsWith('left')?'#39968b':a.startsWith('right')?'#b78c46':'#155d5a';return '<line x1="'+x[0]+'" y1="'+x[1]+'" x2="'+y[0]+'" y2="'+y[1]+'" stroke="'+col+'" stroke-width="5" stroke-linecap="round"/>';}).join('');const dots=Object.keys(rot).filter(k=>!k.endsWith('Foot')).map(k=>{const a=xy(k);return '<circle cx="'+a[0]+'" cy="'+a[1]+'" r="2.6" fill="#f5ebcf" stroke="#0f4d49" stroke-width=".9"/>';}).join('');const h=xy('head');return '<div class="view"><svg viewBox="0 0 160 220" role="img" aria-label="'+escape(label)+' schematic of '+escape(p.title)+'"><rect width="160" height="220" fill="#f1f5ef"/><path d="M8 202H152" stroke="#cad6ce" stroke-dasharray="4 5"/><g>'+lines+dots+'</g><circle cx="'+h[0]+'" cy="'+h[1]+'" r="7" fill="#e2c28a" fill-opacity=".4" stroke="#0e5451" stroke-width="2"/><text x="150" y="14" text-anchor="end" font-size="9" fill="#72918a">'+yaw+'°</text></svg><small>'+escape(label)+'</small></div>';}
function searches(p){const q=encodeURIComponent(p.title+' '+p.category+' photography pose');const terms=encodeURIComponent(p.title+' '+p.category+' portrait');return [
['Commons search','https://commons.wikimedia.org/w/index.php?search='+terms+'&title=Special:MediaSearch&type=image'],
['Pexels search','https://www.pexels.com/search/'+q+'/'],['Unsplash search','https://unsplash.com/s/photos/'+q],
['Images search','https://www.google.com/search?tbm=isch&q='+q]];}
function card(p){const cat=D.categories.find(c=>c.id===p.category);const refs=searches(p).map(([l,u])=>'<a target="_blank" rel="noopener noreferrer" href="'+u+'">'+l+'</a>').join('');const source=p.gif?'<a href="https://github.com/PillB/PoseArt/blob/master/'+encodeURI(p.gif)+'" target="_blank" rel="noopener">PoseArt GIF</a>':'<span>Original GIF: no exact match</span>';return '<article class="card"><div class="eyebrow">'+escape(cat?.name)+' · '+p.order+' / 745 · '+escape(p.id)+'</div><h2>'+escape(p.title)+'</h2><div class="meta">'+escape(p.difficulty)+' · '+escape(p.angle)+' · '+escape(p.effort)+'</div><p>'+escape(p.description)+'</p><p class="tip"><strong>Coaching cue:</strong> '+escape(p.tip)+'</p><div class="views">'+diagram(p,0,'Front')+diagram(p,45,'Three-quarter')+diagram(p,90,'Side')+diagram(p,180,'Rear')+'</div><div class="refs">'+source+' · '+refs+'</div><div class="warning">4 generated schematics · 0 independently verified photos · '+p.geometryFlagCount+' heuristic flags'+(p.category==='couple'?' · partner geometry unverified':'')+'</div></article>';}
function current(){const q=$('search').value.trim().toLowerCase(),c=$('category').value,f=$('flags').value;return D.poses.filter(p=>(c==='all'||p.category===c)&&(f==='all'||(f==='flagged'&&p.geometryFlagCount>0)||(f==='clean'&&p.geometryFlagCount===0))&&(!q||[p.title,p.id,p.description,p.tip,...p.tags].join(' ').toLowerCase().includes(q)));}
function render(){const rows=current(),end=Math.max(1,Math.ceil(rows.length/perPage));page=Math.min(page,end-1);$('result-count').textContent=rows.length+' matching poses · '+D.counts.generatedViewCount+' reproducible views in the full atlas';$('cards').innerHTML=rows.slice(page*perPage,(page+1)*perPage).map(card).join('')||'<p>No matching poses. Try another filter.</p>';$('page').textContent='Page '+(page+1)+' / '+end;$('prev').disabled=page===0;$('next').disabled=page>=end-1;}
$('stats').innerHTML=[['Verified poses',D.counts.poses],['Categories',D.counts.categories],['Generated views',D.counts.generatedViewCount],['Matched pose GIFs',D.counts.matchingGifs]].map(x=>'<div><b>'+x[1]+'</b><span>'+x[0]+'</span></div>').join('');
$('category').insertAdjacentHTML('beforeend',D.categories.map(c=>'<option value="'+escape(c.id)+'">'+escape(c.name)+' ('+c.count+')</option>').join(''));
['search','category','flags'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',()=>{page=0;render()}));$('reset').onclick=()=>{$('search').value='';$('category').value='all';$('flags').value='all';page=0;render()};$('prev').onclick=()=>{page--;render();window.scrollTo(0,0)};$('next').onclick=()=>{page++;render();window.scrollTo(0,0)};
$('candidates').innerHTML=D.proposed.map(p=>'<div class="candidate"><div class="eyebrow">'+escape(p.category)+' · PROPOSAL · NOT IN LIVE LIBRARY</div><h3>'+escape(p.name)+'</h3><p>'+escape(p.description)+'</p><p class="tip"><strong>Why:</strong> '+escape(p.why)+'<br><strong>Validation gates:</strong> '+escape(p.requirements.join(' · '))+'</p></div>').join('');
$('sources').innerHTML=D.research.map(s=>'<li><a href="'+escape(s.url)+'" target="_blank" rel="noopener">'+escape(s.title)+'</a> <span class="meta">['+s.id+']</span></li>').join('');render();
})();
</script></body></html>`;
fs.writeFileSync(path.join(out,'poseart-visual-atlas.html'),html);
console.log(JSON.stringify({sourceCommit:head,counts:manifest.counts,docCounts:manifest.docs.countByType,duplicateJointGroups:dupConfig.length,duplicateTitleGroups:dupTitle.length,output:out},null,2));
