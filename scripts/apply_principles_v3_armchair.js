#!/usr/bin/env node
/**
 * v3 targeted armchair/chair sub-pose fixer.
 *
 * Fixes the 10 broken poses identified in the seated 41–60 visual review:
 *
 *   #43 p15-chair-s3-side-straddle-back            — was flipped; needs upright, twist forward-facing chair
 *   #44 p15-chair-s4-side-perch-legs-extended      — was horizontal; needs seated with one leg extended out
 *   #47 p15-chair-s7-recline-arms-overhead         — needs mild backward lean (not full recline)
 *   #53 p11-armchair-s3-recline-legs-extended-diag — needs seated-with-back-tilt, not lying
 *   #54 p11-armchair-s4-one-leg-kicked-up-armrest  — needs seated with one leg lifted, not lying
 *   #55 p11-armchair-s5-both-legs-over-armrest     — needs seated w/ side twist, legs draped over side
 *   #56 p11-armchair-s6-kneeling-back-view         — needs kneeling upright on chair seat (knees on seat)
 *   #58 p11-armchair-s8-standing-lean-over-back    — needs STANDING behind chair (knees straight, torso fwd)
 *   #59 p11-armchair-s9-standing-front-hands       — needs STANDING in front (knees straight, torso fwd)
 *   #60 p11-armchair-s10-floor-recline             — OK-ish, ensure globalTilt for floor recline
 */

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const FILE = path.join(REPO, 'js', 'poses-data.js');

// Per-pose target joint overrides.
// Only listed joints are overwritten; unlisted joints are preserved.
const TARGETS = {
  'p15-chair-s3-side-straddle-back': {
    // Straddled seat, torso twisted, arms on chair back — SEATED upright
    spine: 8, neck: -6, hips: 0,
    globalTilt: 0, globalRoll: 0, globalTwist: 55,
    leftShoulder: -60, rightShoulder: -72,
    leftElbow: 100, rightElbow: 95,
    shoulderFwdL: 35, shoulderFwdR: 25,
    leftHip: 90, rightHip: 90,
    leftKnee: 95, rightKnee: 95,
    leftAnkle: -3, rightAnkle: -3,
    hipAbductL: 30, hipAbductR: 30
  },
  'p15-chair-s4-side-perch-legs-extended': {
    // Perched on side of chair, torso vertical, one leg extended out sideways
    spine: 5, neck: -6, hips: 5,
    globalTilt: 0, globalRoll: 0, globalTwist: 20,
    leftShoulder: -50, rightShoulder: -30,
    leftElbow: 60, rightElbow: 40,
    shoulderFwdL: 10, shoulderFwdR: 5,
    leftHip: 60, rightHip: 30,   // right leg extended nearly straight
    leftKnee: 95, rightKnee: 25, // right knee mostly straight
    leftAnkle: 0, rightAnkle: 0,
    hipAbductL: -15, hipAbductR: 25
  },
  'p15-chair-s7-recline-arms-overhead': {
    // Seated leaning back with arms overhead — modest tilt only
    spine: -18, neck: -12, hips: -6,
    globalTilt: -20, globalRoll: 0, globalTwist: 5,
    leftShoulder: -131, rightShoulder: -140,
    leftElbow: 30, rightElbow: 35,
    shoulderFwdL: 10, shoulderFwdR: 10,
    leftHip: 85, rightHip: 90,
    leftKnee: 90, rightKnee: 90,
    leftAnkle: 5, rightAnkle: 3,
    hipAbductL: 8, hipAbductR: 8
  },
  'p11-armchair-s3-recline-legs-extended-diagonal': {
    // Seated deep-reclined in armchair with legs extended forward — moderate tilt
    spine: -14, neck: -6, hips: 5,
    globalTilt: -18, globalRoll: -10, globalTwist: 15,
    leftShoulder: -70, rightShoulder: -30,
    leftElbow: 81, rightElbow: 60,
    shoulderFwdL: 20, shoulderFwdR: 15,
    leftHip: 60, rightHip: 55,     // hip more open (legs forward)
    leftKnee: 30, rightKnee: 35,   // legs nearly straight
    leftAnkle: 0, rightAnkle: 0,
    hipAbductL: -12, hipAbductR: -10
  },
  'p11-armchair-s4-one-leg-kicked-up-armrest': {
    // Seated in armchair, one foot lifted onto opposite armrest
    spine: -6, neck: -6, hips: 8,
    globalTilt: -5, globalRoll: 8, globalTwist: 10,
    leftShoulder: -55, rightShoulder: -25,
    leftElbow: 70, rightElbow: 60,
    shoulderFwdL: 10, shoulderFwdR: 10,
    leftHip: 110, rightHip: 90,    // left leg raised high & across
    leftKnee: 105, rightKnee: 95,
    leftAnkle: 8, rightAnkle: -5,
    hipAbductL: 30, hipAbductR: -5
  },
  'p11-armchair-s5-both-legs-over-armrest-smile': {
    // Seated sideways, both legs draped over one armrest — needs SIDE view geometry
    // Torso vertical, hips twisted 90° so legs point sideways
    spine: -5, neck: -4, hips: 5,
    globalTilt: 0, globalRoll: 5, globalTwist: 60,
    leftShoulder: -50, rightShoulder: -40,
    leftElbow: 81, rightElbow: 75,
    shoulderFwdL: 20, shoulderFwdR: 10,
    leftHip: 95, rightHip: 90,      // hips flexed
    leftKnee: 60, rightKnee: 65,    // knees moderately bent (legs draped)
    leftAnkle: 8, rightAnkle: 8,
    hipAbductL: 15, hipAbductR: 15  // legs together to the side
  },
  'p11-armchair-s6-kneeling-back-view-armrest-grip': {
    // Kneeling ON the chair seat, torso upright, gripping back of chair
    spine: 5, neck: -8, hips: -5,
    globalTilt: 0, globalRoll: 5, globalTwist: 50,
    leftShoulder: -140, rightShoulder: -20,
    leftElbow: 45, rightElbow: 75,
    shoulderFwdL: 15, shoulderFwdR: 10,
    leftHip: 95, rightHip: 95,      // hip at 90° = kneeling
    leftKnee: 115, rightKnee: 115,  // knees fully bent (kneeling)
    leftAnkle: -20, rightAnkle: -18,
    hipAbductL: 5, hipAbductR: 5
  },
  'p11-armchair-s8-standing-lean-over-back-profile': {
    // STANDING behind chair, torso bent forward over back
    spine: 25, neck: 5, hips: 12,   // hips flex forward, spine bows forward
    globalTilt: 15, globalRoll: 0, globalTwist: 35,
    leftShoulder: -70, rightShoulder: -82,
    leftElbow: 35, rightElbow: 15,
    shoulderFwdL: 35, shoulderFwdR: 25,
    leftHip: 45, rightHip: 45,      // moderate hip hinge (standing bent)
    leftKnee: 15, rightKnee: 15,    // knees ~straight = STANDING
    leftAnkle: 0, rightAnkle: 0,
    hipAbductL: 5, hipAbductR: 5
  },
  'p11-armchair-s9-standing-front-hands-armrests': {
    // STANDING in front, bent at hips, hands on armrests
    spine: 22, neck: -4, hips: 8,
    globalTilt: 12, globalRoll: 0, globalTwist: 0,
    leftShoulder: -55, rightShoulder: -67,
    leftElbow: 95, rightElbow: 95,
    shoulderFwdL: 20, shoulderFwdR: 20,
    leftHip: 40, rightHip: 40,      // moderate hip flex
    leftKnee: 12, rightKnee: 12,    // knees nearly straight = STANDING
    leftAnkle: 0, rightAnkle: -3,
    hipAbductL: 5, hipAbductR: 5
  },
  'p11-armchair-s10-floor-recline-head-on-armrest': {
    // Lying on floor, head elevated on armrest — proper reclining tilt
    spine: -12, neck: -18, hips: -8,
    globalTilt: -70, globalRoll: -5, globalTwist: 10,
    leftShoulder: -110, rightShoulder: -40,
    leftElbow: 35, rightElbow: 80,
    shoulderFwdL: 10, shoulderFwdR: 10,
    leftHip: 45, rightHip: 50,     // legs mostly straight (on floor)
    leftKnee: 20, rightKnee: 30,
    leftAnkle: 8, rightAnkle: -10,
    hipAbductL: 5, hipAbductR: 10
  }
};

// Locate each id's joints block in source and rewrite in place.
function replaceJointBlock(source, id, newJoints) {
  // Find the pose id occurrence
  const idRegex = new RegExp("id:\\s*['\"]" + id.replace(/[-/]/g, '\\$&') + "['\"]");
  const idMatch = idRegex.exec(source);
  if (!idMatch) return { source, ok: false, reason: 'id-not-found' };

  // Find the following joints: { ... } block within 6000 chars (nested braces not expected)
  const searchFrom = idMatch.index;
  const window = source.slice(searchFrom, searchFrom + 6000);
  const jointsRegex = /joints:\s*\{([^}]*)\}/;
  const jRel = jointsRegex.exec(window);
  if (!jRel) return { source, ok: false, reason: 'joints-not-found' };

  // Build the replacement joints text
  const parts = [];
  for (const k of Object.keys(newJoints)) {
    parts.push(k + ': ' + newJoints[k]);
  }
  const newBlock = 'joints: { ' + parts.join(', ') + ' }';

  const absStart = searchFrom + jRel.index;
  const absEnd = absStart + jRel[0].length;
  const before = source.slice(0, absStart);
  const after = source.slice(absEnd);
  return { source: before + newBlock + after, ok: true };
}

function main() {
  let src = fs.readFileSync(FILE, 'utf8');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(REPO, '.backups', 'poses-data.js.bak-v3-' + stamp);
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.writeFileSync(backup, src);

  const report = [];
  for (const [id, joints] of Object.entries(TARGETS)) {
    const res = replaceJointBlock(src, id, joints);
    if (res.ok) {
      src = res.source;
      report.push({ id, ok: true });
    } else {
      report.push({ id, ok: false, reason: res.reason });
    }
  }

  fs.writeFileSync(FILE, src);
  console.log(JSON.stringify({ backup, count: report.length, results: report }, null, 2));
}

main();
