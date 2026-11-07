// PoseArt Phase 5 source and evidence gates. Research-only metadata, not visual sign-off.
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const refs=JSON.parse(fs.readFileSync(path.join(root,'docs/pose-research/phase5-public-photo-ledger.json'),'utf8'));
const photos=refs.sources;const ctx={};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/poses-data.js'),'utf8')+';this.lib=POSES_LIBRARY;this.cats=POSE_CATEGORIES;',ctx,{timeout:20000});
const all=new Map(Object.values(ctx.lib).map(x=>[x.id,x]));
assert.equal(all.size,745);assert.equal(Array.from(ctx.cats).length,16);
assert.equal(refs.live_poses,745);assert.equal(refs.categories,16);
assert.equal(refs.phase4_raw_covered,189);assert.equal(refs.cumulative_raw_covered,196);assert.equal(refs.raw_uncovered,549);
assert.equal(refs.new_raw_covered_pose_ids.length,7);
assert.equal(refs.expert_approved_photo_count,0);
assert.equal(refs.minimum_approved_photo_deficit,2235);assert.equal(refs.unpromoted_proposals,20);
assert.equal(photos.length,21);
const ids=new Set(),urlKeys=new Set();let links=0;const valid=new Set(['partial_anatomy','partial_occluded','partial_with_semantic_title_drift','reject_not_live_photo','reject_multiple_subjects_unsafe_placement','reject_contact_mismatch','reject_pose_variant','reject_support_mismatch','reject_carrier_contact','reject_crop','needs_visual_inspection']);
const paths=new Set();
for (const photo of photos) {
 assert(!ids.has(photo.id),'source ID dup: '+photo.id);ids.add(photo.id);
 assert(!urlKeys.has(photo.source_url),'source page duplicated: '+photo.source_url);urlKeys.add(photo.source_url);
 assert(photo.source_url.startsWith('https://commons.wikimedia.org/wiki/File:'));
 assert(photo.creator && photo.source_family && photo.license);
 assert(!photo.rights_suitable_for_production && !photo.person_release_verified && !photo.independent_photo_session_verified && !photo.expert_approved);
 assert(photo.poses.length);
 for(const match of photo.poses){
  links++;paths.add(match.pose_id);assert(all.has(match.pose_id),'Unknown pose '+match.pose_id);assert(valid.has(match.review),'Invalid review state '+match.review);assert(match.reason);
  if (photo.media_class!=='live_person_photo')assert(match.review==='reject_not_live_photo','Non-live image cannot have a non-rejected classification');
 }
}
assert.equal(links,24);
assert.equal(photos.filter(p=>p.poses.some(a=>a.review.startsWith('reject'))).length,10);
assert.equal(photos.filter(p=>p.poses.some(a=>a.review.startsWith('partial'))).length,9);
assert.equal(photos.filter(p=>p.poses.some(a=>a.review==='needs_visual_inspection')).length,2);
const byName=(n)=>photos.find(p=>p.filename===n);
assert.equal(byName('Tree pos.jpg').media_class,'line_art');
assert.equal(byName('Back-to-Back Statue at the Rogers Centre, July 20 2026.jpg').media_class,'photograph_of_sculpture');
assert(byName('VVO 6763 (15495291387).jpg').poses.some(a=>a.review==='reject_support_mismatch'));
assert(byName('Piggyback fursuit.jpg').poses.some(a=>a.review==='reject_carrier_contact'));
assert(byName('Piggyback photographer.jpg').poses.some(a=>a.review==='reject_carrier_contact'));
const chair='p15-chair-s3-side-straddle-back';
const chairSources=photos.filter(p=>p.poses.some(a=>a.pose_id===chair && a.review==='partial_anatomy'));
assert.equal(chairSources.length,3);
assert.equal(new Set(chairSources.map(p=>p.source_family)).size,3);
assert(chairSources.every(p=>!p.expert_approved),'3 partial candidates must not become 3 approved references');
const newMatched=new Set(photos.flatMap(p=>p.poses.filter(a=>a.review.startsWith('partial')).map(a=>a.pose_id)));
assert(refs.new_raw_covered_pose_ids.every(id=>newMatched.has(id)));
assert.equal(new Set(refs.new_raw_covered_pose_ids).size,7);
// Document existing health/safety wording defect without publishing an unreviewed geometry correction.
assert(all.get('one-leg-balance').instructions.includes('inner calf or knee'),'Safety issue #32 needs re-evaluation if corrected');
assert(all.get('fineart-contrapposto-classic').instructions.includes('extend the other fully behind'),'Prior title/description shift needs reviewer, see #28');
if (process.argv.includes('--require-photo-geometry-promotion')) throw new Error('NO-GO: 0 expert-approved independent photo references and unknown publicity rights');
console.log('PASS Phase 5: 745 live IDs, 21 source files, 24 decisions, 7 newly raw-covered, 3 independent but unapproved chair-photo sources, 549 zero leads, no runtime geometry approvals');
