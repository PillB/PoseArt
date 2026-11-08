// Research-only validation for Phase 4 photographic source leads and pose-title drift.
// No external image download, model inference, or copyright assumption.
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const records=JSON.parse(fs.readFileSync(path.join(root,'docs/pose-research/phase4-curated-photo-links.json'),'utf8'));
const realm={};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/poses-data.js'),'utf8')+';this.poses=POSES_LIBRARY;this.cats=POSE_CATEGORIES',realm);
const poses=new Map(Object.values(realm.poses).map(p=>[p.id,p]));
assert.equal(poses.size,745,'live catalog drift');
assert.equal(Array.from(realm.cats).length,16);
assert.equal(records.screened_links,37);
assert.equal(records.distinct_photo_id_count,36);
assert.equal(records.approved_photo_count,0);
assert.equal(records.source_files.length,37);
const ids=new Set();
const allAssociations=[];
for(const photo of records.source_files){
 assert(photo.image_url.startsWith('https://www.sketchkit.art/references/poses/'));
 assert(photo.original_photo_link.startsWith('https://unsplash.com/photos/'));
 assert(photo.creator && photo.photo_id && photo.source_page);
 assert.equal(photo.media_type,'real_person_photo_candidate');
 assert.equal(photo.status,'screened_not_approved');
 assert.equal(photo.rights_verified,false);
 assert.equal(photo.shoot_session_verified,false);
 assert.equal(photo.individual_photo_license_verified,false);
 ids.add(photo.photo_id);
 for(const link of photo.decisions){
  assert(poses.has(link.pose_id),'Non-live pose reference '+link.pose_id);
  assert(['promising_partial','uncertain','rejected_mismatch','title_description_conflict'].includes(link.result));
  allAssociations.push(link);
 }
}
assert.equal(ids.size,36,'Duplicate URLs must dedupe by Unsplash photo ID');
assert.equal(records.source_files.filter(x=>x.photo_id==='MBahMmQhkCs').length,2);
assert.equal(allAssociations.length,22);
assert.equal(allAssociations.filter(x=>x.result==='rejected_mismatch').length,5);
assert.equal(allAssociations.filter(x=>x.result==='promising_partial'||x.result==='uncertain').length,16);
assert.equal(allAssociations.filter(x=>x.result==='title_description_conflict').length,1);
const newIds=['power-stance','cross-ankle-sit','knees-apart-forward','floor-asymmetric','bench-sit-side','waltz-hold','slow-dance','lead-dance-hand','fashion-runway-arms-swing-stride','p15-chair-s2-forward-elbows-knees'];
for(const id of newIds)assert(allAssociations.some(x=>x.pose_id===id&&x.result!=='rejected_mismatch'),'New lead missing: '+id);
const semantic=[
 'both-knees','kneeling-reach','prone-chin','starfish','side-fetal','belly-up-arms-wide',
 'editorial-extreme-forward-lean','editorial-floor-diagonal-reach','editorial-vogue-arm-frame',
 'fineart-contrapposto-classic','fineart-odalisque-recline','fineart-pieta-kneel','fineart-standing-torso-twist-sculpt','fineart-seated-forward-fold','fineart-releve-reach','fineart-kneeling-torso-extend','fineart-standing-arm-sweep',
 'fashion-power-stance-classic','fashion-mid-turn-sweep','fashion-runway-stomp-stride','fashion-hand-in-pocket-cool','fashion-jacket-shoulder-pop','fashion-runway-arms-swing-stride',
 'lowhigh-floor-seated-start','lowhigh-floor-reach-up-arms','highlow-standing-peak-start','highlow-torso-begin-fall-forward'
];
assert.equal(semantic.length,27);assert.equal(new Set(semantic).size,27);
for(const id of semantic)assert(poses.has(id),'Semantically misaligned ID no longer present: '+id);
assert(/extend the other fully behind/.test(poses.get('fineart-contrapposto-classic').instructions));
assert(/Shift weight entirely onto one leg/.test(poses.get('fineart-odalisque-recline').instructions));
assert(/extend the other forward and up/.test(poses.get('fashion-power-stance-classic').instructions));
// This gate only accepts technical research updates; evidence photo candidates cannot promote geometry.
if(process.argv.includes('--require-geometry-approval'))throw Error('GEOMETRY NO-GO: no 3-4 independent adjudicated pose photographs or reviewer signoff');
console.log('PASS Phase4: 745 pose IDs, 37 URLs / 36 independent file IDs, 22 annotated associations, 5 rejected, 27 drift review flags; zero photo approvals');
