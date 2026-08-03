// audit_harness/pose-consistency-fixer.js
// Iteration 1: Check description-joint consistency for all 745 poses.
// Uses keyword matching on descriptions to infer expected joint ranges,
// compares with actual joint values, flags mismatches, and applies fixes.
//
// Sign conventions (verified 2026-08-02 per worklog):
// spine: + = forward lean, - = backward
// leftShoulder/rightShoulder: - = raise up/overhead, + = swing back
// leftElbow/rightElbow: + = bend inward/forward
// leftHip/rightHip: + = leg swings forward, - = leg back (extension)
// leftKnee/rightKnee: + = shin bends backward
// hipAbductL/R: + = ADDUCTION (inward/cross), - = ABDUCTION (outward/spread)
// shoulderFwdL/R: + = BEHIND, - = FORWARD
// globalTilt: +90 = PRONE (face-down), -90 = SUPINE (on-back)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;

// Rules: keyword pattern → expected joint constraint → fix if violated
// Each rule: { match: /regex/, check: (joints, desc) => {issue}, fix: (joints) => {modified} }
const RULES = [
  // ARMS OVERHEAD: shoulders should be strongly negative (-120 to -180)
  {
    name: 'arms_overhead_shoulders',
    match: /arms?\s+(?:overhead|above head|raised above|up over head|straight up|extended overhead)/i,
    check: (j, d) => {
      const ls = j.leftShoulder, rs = j.rightShoulder;
      if (ls === undefined || rs === undefined) return null;
      // If desc says overhead but shoulders are positive (back) or near 0, flag
      if (ls > -60 || rs > -60) return `arms overhead but shoulders L=${ls} R=${rs} (should be < -60)`;
      return null;
    },
    fix: (j) => { j.leftShoulder = Math.min(j.leftShoulder || -120, -130); j.rightShoulder = Math.min(j.rightShoulder || -120, -130); return j; }
  },
  // ARMS CROSSED: shoulders slightly negative, shoulderFwd negative (forward), elbows bent
  {
    name: 'arms_crossed',
    match: /arms?\s+(?:crossed|cross(ed)? (?:both )?arms|forearms crossed)/i,
    check: (j, d) => {
      if (j.leftShoulder > 20 || j.rightShoulder > 20) return `arms crossed but shoulders L=${j.leftShoulder} R=${j.rightShoulder} (should be < 20, preferably negative)`;
      if ((j.shoulderFwdL || 0) > 0 && (j.shoulderFwdR || 0) > 0) return `arms crossed but shoulderFwd L=${j.shoulderFwdL} R=${j.shoulderFwdR} (should be negative=forward)`;
      if ((j.leftElbow || 0) < 60) return `arms crossed but elbows L=${j.leftElbow} (should be > 60 for crossing)`;
      return null;
    },
    fix: (j) => {
      if (j.leftShoulder > 20) j.leftShoulder = -10;
      if (j.rightShoulder > 20) j.rightShoulder = -10;
      if ((j.shoulderFwdL || 0) > 0) j.shoulderFwdL = -40;
      if ((j.shoulderFwdR || 0) > 0) j.shoulderFwdR = -40;
      if ((j.leftElbow || 0) < 60) j.leftElbow = 90;
      if ((j.rightElbow || 0) < 60) j.rightElbow = 90;
      return j;
    }
  },
  // HAND ON HIP: shoulder should be moderately negative (-25 to -50)
  {
    name: 'hand_on_hip',
    match: /hand\s+(?:on |at )?(?:the\s+)?hip|akimbo|hand\s+resting\s+on\s+hip/i,
    check: (j, d) => {
      // Check if one hand is on hip (asymmetric)
      const ls = j.leftShoulder, rs = j.rightShoulder;
      if (ls > 10 && rs > 10) return `hand on hip but shoulders L=${ls} R=${rs} (should be < 10, preferably -25 to -50)`;
      return null;
    },
    fix: (j) => {
      if (j.leftShoulder > 10) j.leftShoulder = -35;
      if (j.rightShoulder > 10) j.rightShoulder = -35;
      if ((j.leftElbow || 0) < 60) j.leftElbow = 90;
      if ((j.rightElbow || 0) < 60) j.rightElbow = 90;
      return j;
    }
  },
  // ARMS RELAXED/FORWARD: shoulders should not be strongly positive (back)
  {
    name: 'arms_forward_not_back',
    match: /arms?\s+(?:relaxed forward|extended forward|reaching forward|forward)/i,
    check: (j, d) => {
      if (j.leftShoulder > 40 && j.rightShoulder > 40) return `arms forward but shoulders L=${j.leftShoulder} R=${j.rightShoulder} (should be < 40, negative=forward)`;
      return null;
    },
    fix: (j) => {
      if (j.leftShoulder > 40) j.leftShoulder = -20;
      if (j.rightShoulder > 40) j.rightShoulder = -20;
      return j;
    }
  },
  // ARMS OUT TO SIDES: shoulders near 0 with some abduction
  {
    name: 'arms_out_to_sides',
    match: /arms?\s+(?:relaxed out to the sides|out to (?:the )?sides|spread wide|arms wide)/i,
    check: (j, d) => {
      // Arms out to sides means shoulders near 0 (horizontal), not overhead
      if (j.leftShoulder < -80 && j.rightShoulder < -80) return `arms out to sides but shoulders L=${j.leftShoulder} R=${j.rightShoulder} (too negative=overhead, should be near 0)`;
      return null;
    },
    fix: (j) => {
      if (j.leftShoulder < -80) j.leftShoulder = -30;
      if (j.rightShoulder < -80) j.rightShoulder = -30;
      return j;
    }
  },
  // WALL LEAN: spine should be backward (negative)
  {
    name: 'wall_lean_spine',
    match: /(?:wall|doorframe|pillar)\s+(?:lean|prop|back against)/i,
    check: (j, d) => {
      if ((j.spine || 0) > 15) return `wall lean but spine=${j.spine} (should be negative=backward for leaning against wall)`;
      return null;
    },
    fix: (j) => { if ((j.spine || 0) > 15) j.spine = -12; return j; }
  },
  // LEAN FORWARD: spine should be positive (but NOT if "arch" is also in desc)
  {
    name: 'lean_forward_spine',
    match: /(?:lean|fold|bend)\s+(?:forward|ahead|down forward)/i,
    check: (j, d) => {
      if (/arch/i.test(d)) return null; // "arch back" takes precedence over "lean forward"
      if ((j.spine || 0) < -5) return `lean forward but spine=${j.spine} (should be positive=forward)`;
      return null;
    },
    fix: (j) => { if ((j.spine || 0) < -5) j.spine = 20; return j; }
  },
  // CROSS-LEGGED: hipAbduct should be negative (outward)
  {
    name: 'cross_legged_abduct',
    match: /cross[- ]legged|legs?\s+crossed|sit.*cross/i,
    check: (j, d) => {
      const la = j.hipAbductL || 0, ra = j.hipAbductR || 0;
      if (la > 10 && ra > 10) return `cross-legged but hipAbduct L=${la} R=${ra} (should be negative=outward for crossing)`;
      return null;
    },
    fix: (j) => {
      if ((j.hipAbductL || 0) > 10) j.hipAbductL = -25;
      if ((j.hipAbductR || 0) > 10) j.hipAbductR = -25;
      return j;
    }
  },
  // LEGS UP THE WALL: globalTilt should be -90 (supine) AND hips high
  {
    name: 'legs_up_wall',
    match: /legs?\s+(?:up|raised)\s+(?:the\s+)?wall|legs.*up.*wall/i,
    check: (j, d) => {
      if ((j.globalTilt || 0) > -30 && (j.leftHip || 0) > 60) return `legs up wall but globalTilt=${j.globalTilt} (should be near -90=supine)`;
      return null;
    },
    fix: (j) => { if ((j.globalTilt || 0) > -30) j.globalTilt = -85; return j; }
  },
  // PRONE (face down): globalTilt should be positive (+85 to +90)
  {
    name: 'prone_tilt',
    match: /(?:prone|face[- ]down|lying on (?:the )?(?:stomach|front|belly))/i,
    check: (j, d) => {
      if ((j.globalTilt || 0) < 30) return `prone/face-down but globalTilt=${j.globalTilt} (should be positive=prone)`;
      return null;
    },
    fix: (j) => { if ((j.globalTilt || 0) < 30) j.globalTilt = 85; return j; }
  },
  // SUPINE (on back): globalTilt should be negative (-85 to -90)
  {
    name: 'supine_tilt',
    match: /(?:supine|lying on (?:the )?back|on back|lie on back|flat on back)/i,
    check: (j, d) => {
      if ((j.globalTilt || 0) > -30 && (j.globalTilt || 0) < 30) {
        // Only flag if not already clearly supine
        if ((j.leftHip || 0) > 60) return `supine/on-back but globalTilt=${j.globalTilt} (should be near -90=supine)`;
      }
      return null;
    },
    fix: (j) => { if ((j.globalTilt || 0) > -30 && (j.globalTilt || 0) < 30) j.globalTilt = -85; return j; }
  },
  // ── Iteration 2 rules ──
  // HAND TO FACE/CHIN: active shoulder should be negative (raised) + shoulderFwd negative (forward)
  {
    name: 'hand_to_face',
    match: /hand\s+(?:to|near|on|at|touching)\s+(?:the\s+)?(?:face|chin|cheek|forehead|jaw)/i,
    check: (j, d) => {
      // At least one shoulder should be raised (negative)
      const ls = j.leftShoulder, rs = j.rightShoulder;
      if (ls > 0 && rs > 0) return `hand to face but both shoulders positive L=${ls} R=${rs} (one should be negative=raised)`;
      // The raised arm's shoulderFwd should be forward (negative)
      if (ls < 0 && (j.shoulderFwdL || 0) > 0) return `hand to face but shoulderFwdL=${j.shoulderFwdL} (should be negative=forward for hand to face)`;
      if (rs < 0 && (j.shoulderFwdR || 0) > 0) return `hand to face but shoulderFwdR=${j.shoulderFwdR} (should be negative=forward)`;
      return null;
    },
    fix: (j) => {
      // Make left arm the active one if neither is raised
      if (j.leftShoulder > 0 && j.rightShoulder > 0) { j.leftShoulder = -50; j.shoulderFwdL = -50; j.leftElbow = 110; }
      else if (j.leftShoulder < 0 && (j.shoulderFwdL || 0) > 0) j.shoulderFwdL = -50;
      else if (j.rightShoulder < 0 && (j.shoulderFwdR || 0) > 0) j.shoulderFwdR = -50;
      return j;
    }
  },
  // SITTING: hip angle should be > 70 (legs forward, not standing)
  // Only match descriptions that clearly indicate seated pose (not "sit the torso upright")
  {
    name: 'sitting_hip_angle',
    match: /(?:sit\s+(?:on|down|back|upright)|seated\s+(?:on|in|at|with)|sitting\s+(?:on|in|at|with)|perch(?:ed)?\s+(?:on|at))/i,
    check: (j, d, cat) => {
      if (cat === 'standing' || cat === 'fashion') return null; // standing poses excluded
      if (Math.abs(j.globalTilt || 0) > 60) return null; // reclining poses excluded
      const lh = j.leftHip || 0, rh = j.rightHip || 0;
      if (lh < 30 && rh < 30) return `sitting but hips L=${lh} R=${rh} (should be > 70 for seated)`;
      return null;
    },
    fix: (j) => {
      if ((j.leftHip || 0) < 30) j.leftHip = 85;
      if ((j.rightHip || 0) < 30) j.rightHip = 85;
      if ((j.leftKnee || 0) < 30) j.leftKnee = 90;
      if ((j.rightKnee || 0) < 30) j.rightKnee = 90;
      return j;
    }
  },
  // KNEELING: knees should be deeply bent (> 80)
  {
    name: 'kneeling_knee_depth',
    match: /(?:kneel|kneeling)/i,
    check: (j, d) => {
      if (Math.abs(j.globalTilt || 0) > 60) return null; // reclining excluded
      const lk = j.leftKnee || 0, rk = j.rightKnee || 0;
      if (lk < 60 && rk < 60) return `kneeling but knees L=${lk} R=${rk} (should be > 80 for kneeling)`;
      return null;
    },
    fix: (j) => {
      if ((j.leftKnee || 0) < 60) j.leftKnee = 90;
      if ((j.rightKnee || 0) < 60) j.rightKnee = 90;
      return j;
    }
  },
  // ELBOW ON KNEE: elbow should be bent (> 90) and arm forward
  {
    name: 'elbow_on_knee',
    match: /elbow\s+(?:on|resting on|at)\s+(?:the\s+)?knee/i,
    check: (j, d) => {
      const le = j.leftElbow || 0, re = j.rightElbow || 0;
      if (le < 70 && re < 70) return `elbow on knee but elbows L=${le} R=${re} (should be > 90 for resting on knee)`;
      return null;
    },
    fix: (j) => {
      if ((j.leftElbow || 0) < 70) j.leftElbow = 100;
      if ((j.rightElbow || 0) < 70) j.rightElbow = 100;
      if ((j.leftShoulder || 0) > 20) j.leftShoulder = -10;
      if ((j.rightShoulder || 0) > 20) j.rightShoulder = -10;
      return j;
    }
  },
  // HAND TO FLOOR: shoulders should be negative (arms down/forward)
  {
    name: 'hand_to_floor',
    match: /hand[s]?\s+(?:on|to|touching|reaching toward)\s+(?:the\s+)?(?:floor|ground)/i,
    check: (j, d) => {
      const ls = j.leftShoulder, rs = j.rightShoulder;
      // For hands on floor, shoulders should be very negative (arms down)
      if (ls > -20 && rs > -20) return `hands to floor but shoulders L=${ls} R=${rs} (should be < -20 for reaching down)`;
      return null;
    },
    fix: (j) => {
      // Arms at side (shoulder near 0) to reach floor, NOT raised (negative = up)
      if (j.leftShoulder > -20) j.leftShoulder = 5;
      if (j.rightShoulder > -20) j.rightShoulder = 5;
      if ((j.leftElbow || 0) > 40) j.leftElbow = 10;
      if ((j.rightElbow || 0) > 40) j.rightElbow = 10;
      return j;
    }
  },
  // LEAN BACK: spine should be negative (backward)
  {
    name: 'lean_back_spine',
    match: /(?:lean\s+back|arch\s+(?:the\s+)?back|leaning back|back arch)/i,
    check: (j, d) => {
      if ((j.spine || 0) > 10) return `lean back/arch back but spine=${j.spine} (should be negative=backward)`;
      return null;
    },
    fix: (j) => { if ((j.spine || 0) > 10) j.spine = -10; return j; }
  },
  // ARMS BEHIND BACK: shoulders positive (back) + shoulderFwd positive (behind)
  {
    name: 'arms_behind_back',
    match: /arms?\s+(?:behind|behind the|clasped behind|hands behind)/i,
    check: (j, d) => {
      if (j.leftShoulder < -30 && j.rightShoulder < -30) return `arms behind back but shoulders L=${j.leftShoulder} R=${j.rightShoulder} (should be positive=back)`;
      if ((j.shoulderFwdL || 0) < -20 && (j.shoulderFwdR || 0) < -20) return `arms behind back but shoulderFwd L=${j.shoulderFwdL} R=${j.shoulderFwdR} (should be positive=behind)`;
      return null;
    },
    fix: (j) => {
      if (j.leftShoulder < -30) j.leftShoulder = 20;
      if (j.rightShoulder < -30) j.rightShoulder = 20;
      if ((j.shoulderFwdL || 0) < -20) j.shoulderFwdL = 40;
      if ((j.shoulderFwdR || 0) < -20) j.shoulderFwdR = 40;
      return j;
    }
  },
];

// Run all rules on all poses
const issues = [];
const fixes = [];
for (const id in lib) {
  const pose = lib[id];
  const desc = (pose.instructions || '') + ' ' + (pose.name || '');
  const joints = pose.joints || {};
  for (const rule of RULES) {
    if (rule.match.test(desc)) {
      const issue = rule.check(joints, desc, pose.category);
      if (issue) {
        issues.push({ poseId: id, rule: rule.name, issue, joints: JSON.stringify(joints) });
        fixes.push({ poseId: id, rule: rule.name, fix: rule.fix(JSON.parse(JSON.stringify(joints))) });
      }
    }
  }
}

// Report
console.log('=== CONSISTENCY CHECK ===');
console.log('Total poses checked:', Object.keys(lib).length);
console.log('Issues found:', issues.length);
console.log('Rules triggered:', [...new Set(issues.map(i => i.rule))].join(', '));
console.log('');

// Group by rule
const byRule = {};
for (const i of issues) { byRule[i.rule] = (byRule[i.rule] || 0) + 1; }
console.log('=== ISSUES BY RULE ===');
Object.entries(byRule).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  ' + k + ': ' + v));
console.log('');

// Show first 15 issues
console.log('=== SAMPLE ISSUES ===');
issues.slice(0, 15).forEach(i => console.log('  ' + i.poseId + ' [' + i.rule + ']: ' + i.issue));

// Write issues + fixes to file
fs.writeFileSync(path.join(REPO, 'audit', 'pose-forensic', 'reports', 'consistency-issues.json'), JSON.stringify({ total: issues.length, byRule, issues, fixes }, null, 2));
console.log('\nWritten: audit/pose-forensic/reports/consistency-issues.json');
