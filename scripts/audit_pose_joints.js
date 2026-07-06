#!/usr/bin/env node
/**
 * Extract current joint values for the 36 problem poses.
 * Output goes to stdout as JSON for review.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'poses-data.js'), 'utf8');
const ctx = { window: {}, module: {}, exports: {} };
vm.createContext(ctx);
vm.runInContext(src + '\nthis.__LIB = (typeof POSES_LIBRARY!=="undefined")?POSES_LIBRARY:[];', ctx);
const lib = ctx.__LIB || {};

const IDS = [
  'tiptoe-reach','side-stretch','kneeling-side-stretch','kneeling-tuck-forward',
  'lounger-back-arm-raised','boudoir-barberini-faun','boudoir-nymph-fontainebleau',
  'boudoir-dying-slave','boudoir-the-source','p14-standing-s3-overhead-arms-stretch',
  'p10-bench-s3-recline-arm-overhead','p10-bench-s5-side-recline-arm-up',
  'p11-armchair-s6-kneeling-back-view-armrest-grip','p16-bed-b2-recline-headboard-arm-up',
  'p16-bed-b9-kneeling-arch-hand-in-hair','p18-lounge-r4-reclined-knees-up-hand-hair',
  'p17-tubes-s9-seated-hand-hair-leg-back','p08-male-st2-hand-behind-neck-waistband',
  'p08-male-se3-chair-diagonal-lean-leg-extended','p08-male-r6-lying-back-eyes-closed-fist-face',
  'p05-bench-b13-standing-arm-raised-lean','p01-master-s4-chair-chin-touch',
  'p01-master-s17-chair-back-seat-hair-touch','p01-master-b3-bench-lean-upper-body-hair',
  'tabletop-sit','feet-tucked-under','p10-bench-s1-kneeling-profile-hands-lap',
  'p10-bench-s10-recline-legs-up-vertical','p11-armchair-s10-floor-recline-head-on-armrest',
  'p17-tubes-s1-reclined-across-tubes','p10-bench-s7-standing-drape-fabric',
  'p10-bench-s8-seated-profile-tiptoe','p15-chair-s3-side-straddle-back',
  'p15-chair-s5-side-saddle-look-back','p15-chair-s10-twist-both-hands-rail',
  'p11-armchair-s5-both-legs-over-armrest-smile'
];

const out = {};
for (const id of IDS) {
  const p = lib[id];
  if (!p) { out[id] = { MISSING: true }; continue; }
  out[id] = {
    name: p.name, category: p.category, subcategory: p.subcategory || null,
    joints: p.joints || null
  };
}
console.log(JSON.stringify(out, null, 2));
