'use strict';
// Test research inventory and explicit prohibition on unvetted geometry release.
const fs=require('fs'),path=require('path'),assert=require('assert').strict;
const filename=process.env.POSEART_RESEARCH_OUTPUT||path.resolve(__dirname,'..','artifacts/research/phase3-search-plan.json');
const doc=JSON.parse(fs.readFileSync(filename,'utf8'));
assert.equal(doc.pose_count,745);assert.equal(doc.category_count,16);
assert.equal(doc.numbered_guide_leads,66);assert.equal(doc.live_photographic_references_approved,0);
assert.equal(doc.required_minimum_independent_live_photos,2235);
const rows=doc.poses;assert.equal(rows.length,745);
assert.equal(new Set(rows.map(p=>p.id)).size,745);
assert.equal(new Set(rows.map(p=>p.category)).size,16);
assert(rows.every(p=>p.title&&p.description&&p.queries.length===4&&p.google_image_queries.length===4&&p.bing_image_queries.length===4));
assert(rows.every(p=>p.independently_approved_photos===0&&p.geometry_release==='blocked'));
const photos=rows.filter(p=>p.guide_page_lead);
assert.equal(photos.length,66);
assert(photos.every(p=>p.guide_page_lead.number_match_only===true&&p.guide_page_lead.visually_approved===false));
for(const [flow,count] of Object.entries({chair:17,bench:17,couch:9,bed:14,wall:9})){
 assert.equal(photos.filter(p=>p.guide_page_lead.guide===flow).length,count);
}
assert(rows.find(p=>p.id==='scurve-stand').queries[0].includes('-blackberry'));
assert(rows.find(p=>p.id==='hand-in-hand-walk').queries[0].includes('-riverwalk'));
assert(rows.find(p=>p.id==='fineart-contrapposto-classic').description.includes('extend the other fully behind'));
assert(rows.find(p=>p.id==='fineart-odalisque-recline').description.includes('Shift weight entirely onto one leg'));
console.log('PASS: 745 unique poses, 16 categories, 66 numbered photo guide leads, 4 query families each, known semantic defects recorded, zero approved photos');