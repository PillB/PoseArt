// Phase 6 source/ontology evidence gate — metadata only, no geometry release.
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const ledger=JSON.parse(fs.readFileSync(path.join(root,'docs/pose-research/phase6-commons-adjudication.json'),'utf8'));
const s=ledger.summary,a=ledger.sources,ctx={};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/poses-data.js'),'utf8')+';this.poses=POSES_LIBRARY;this.categories=POSE_CATEGORIES;',ctx,{timeout:20000});
const ids=new Set(Object.values(ctx.poses).map(p=>p.id));
assert.equal(ids.size,745);assert.equal(Array.from(ctx.categories).length,16);
assert.equal(s.all_live_pose_ids,745);assert.equal(s.categories,16);
assert.equal(s.prior_raw_covered,196);assert.equal(s.cumulative_raw_covered,202);assert.equal(s.no_raw_lead,543);
assert.equal(s.source_associations,26);assert.equal(a.length,26);
assert.equal(s.partial_visual,14);assert.equal(s.rejected,10);assert.equal(s.metadata_only,2);
assert.equal(s.approved_photographs,0);assert.equal(s.three_per_pose_deficit,2235);
assert.equal(s.proposed_research_only,20);
const expected=['cobra-lite','floor-stretch-legs','kneeling-lean-hands-floor','seated-v-stretch','sphinx-pose','warrior-lunge'];
assert.deepEqual(s.new_raw_leads,expected);
const statuses=new Set(['partial_visual','metadata_only','rejected_geometry','rejected_support_contact','rejected_leg_geometry','rejected_occlusion','rejected_multi_subject','rejected_arm_direction','rejected_palm_orientation','rejected_hand_prop_contact','rejected_not_photo']);
for(const p of a){
 assert(ids.has(p.pose_id),p.pose_id+' not live');
 assert(statuses.has(p.status),'Unrecognized judgement: '+p.status);
 assert(p.source_url.startsWith('https://commons.wikimedia.org/wiki/File:'));
 assert(p.creator && p.file && p.license_claim && p.adjudication_note);
 assert(p.expert_pose_match_approved===false && p.person_release_verified===false &&
   p.redistribution_rights_verified===false && p.shoot_session_independence_verified===false);
 if(p.file.endsWith('.svg'))assert.equal(p.status,'rejected_not_photo');
}
assert.equal(a.filter(x=>x.status==='partial_visual').length,14);
assert.equal(a.filter(x=>x.status.startsWith('rejected')).length,10);
assert.equal(a.filter(x=>x.status==='metadata_only').length,2);
const newlyCovered=[...new Set(a.filter(x=>x.status==='partial_visual').map(x=>x.pose_id))].sort();
assert.deepEqual(newlyCovered,expected);
const cobra=a.filter(x=>x.pose_id==='cobra-lite'&&x.status==='partial_visual');
assert.equal(cobra.length,4);
assert.equal(new Set(cobra.map(x=>x.source_family)).size,4);
const sphinx=a.find(x=>x.file==='Ardha Bhujangasana.jpg');
assert.equal(sphinx.status,'rejected_support_contact'); 
assert(a.some(x=>x.pose_id==='chair-wave'&&x.status==='rejected_not_photo'));
assert(a.some(x=>x.pose_id==='meditation-palms'&&x.status==='rejected_palm_orientation'));
const desc=Object.values(ctx.poses).every(p=>p.id&&p.name&&p.instructions&&p.category);
assert(desc,'Every live pose must have title/description/category');
if(process.argv.includes('--authorize-geometry'))throw new Error('RELEASE BLOCKED: no approved independent photos or subject release for 745 poses');
console.log('PASS Phase6: 745 titled/described poses, 26 adjudications, 14 partial, 10 rejected, 2 metadata-only, +6 raw leads, 543 uncovered, ZERO photographic approvals.');