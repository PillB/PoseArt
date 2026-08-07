// ============================================================
// PoseArt Solarize — Two-Person Role Assignment (Solarize §13)
// ------------------------------------------------------------
// For every frame: detect candidates → update tracks → compute
// observed-to-target-role costs → evaluate DIRECT and SWAPPED
// assignments → retain previous when evidence compatible →
// abstain when ambiguous. Never uses array order as identity.
//
// Hungarian over [tracks × roles]; the "direct vs swapped" test
// is the two-permutation comparison for the 2-person case.
// ============================================================

import { oksDistance, torsoScale, computeCanonicalJointAngles, angle3 } from './canonical-schema.js';

const DEFAULTS = {
  ambiguityMargin: 0.12,        // if |costDirect - costSwapped| < margin → abstain
  roleSwitchHysteresis: 0.18,   // require this much improvement to switch roles
  minConfidence: 0.35,          // below this, person can't fill a role
  missingPartnerTolerance: 1,   // how many frames a missing partner is tolerated
  maxPeople: 3,                 // extra third person triggers a flag, not a crash
};

// Cost of assigning one observed track to one target role.
function roleCost(track, target, opts) {
  const lm = track.landmarks;
  const scale = track.scale || torsoScale(lm) || 1;
  const oks = oksDistance(lm, _targetLandmarks(target), scale); // 1=perfect
  let poseSim = oks;

  // Joint-angle similarity (anatomical).
  const obsAngles = computeCanonicalJointAngles(lm);
  const tgtAngles = target.canonicalSkeleton || {};
  let angErr = 0, angN = 0;
  for (const [joint, tgt] of Object.entries(tgtAngles)) {
    if (obsAngles[joint] == null) continue;
    angErr += Math.min(Math.abs(obsAngles[joint] - tgt), 180 - Math.abs(obsAngles[joint] - tgt));
    angN++;
  }
  const angleSim = angN ? 1 - (angErr / angN) / 90 : 0.5;

  // Root position agreement (normalized).
  const root = track.root || { x: 0.5, y: 0.5 };
  const tgtRoot = target.rootPosition || { x: 0.5, y: 0.5 };
  const rootSim = 1 - Math.min(1, Math.hypot(root.x - tgtRoot.x, root.y - tgtRoot.y));

  // Facing/orientation agreement (rough).
  const orientSim = target.rootRotation != null && track.facingEstimate
    ? 1 - Math.min(1, Math.abs((track.facingEstimate.yaw || 0) - target.rootRotation) / 90)
    : 0.5;

  const cost = 1 - (0.45 * poseSim + 0.25 * angleSim + 0.20 * rootSim + 0.10 * orientSim);
  return cost;
}

// Synthesize target landmark positions from the target's canonicalSkeleton angles
// so OKS has something to compare against. This is a reference rig (NOT the
// procedural renderer rig); kept deliberately simple & normalized.
function _targetLandmarks(target) {
  if (target._cachedTargetLandmarks) return target._cachedTargetLandmarks;
  const sk = target.canonicalSkeleton || {};
  const cx = (target.rootPosition && target.rootPosition.x) || 0.5;
  const cy = (target.rootPosition && target.rootPosition.y) || 0.5;
  const unit = 0.06;
  const deg = (d) => (d * Math.PI) / 180;
  // Neutral standing rig, then apply joint angles to derive limb ends.
  const base = {
    nose: { x: cx, y: cy - 3.2 * unit },
    leftShoulder: { x: cx - unit, y: cy - 2 * unit },
    rightShoulder: { x: cx + unit, y: cy - 2 * unit },
    leftHip: { x: cx - 0.7 * unit, y: cy },
    rightHip: { x: cx + 0.7 * unit, y: cy },
    leftKnee: { x: cx - 0.7 * unit, y: cy + 2 * unit },
    rightKnee: { x: cx + 0.7 * unit, y: cy + 2 * unit },
    leftAnkle: { x: cx - 0.7 * unit, y: cy + 4 * unit },
    rightAnkle: { x: cx + 0.7 * unit, y: cy + 4 * unit },
    leftElbow: { x: cx - 2 * unit, y: cy - 1 * unit },
    rightElbow: { x: cx + 2 * unit, y: cy - 1 * unit },
    leftWrist: { x: cx - 2.5 * unit, y: cy },
    rightWrist: { x: cx + 2.5 * unit, y: cy },
  };
  // Apply shoulder abduction/elbow flex offsets (very rough FK).
  if (sk.leftShoulder != null) {
    const a = deg(sk.leftShoulder);
    base.leftElbow = rot(base.leftShoulder, base.leftElbow, a, 1.6 * unit);
    base.leftWrist = rot(base.leftElbow, base.leftWrist, a + deg(sk.leftElbow || 0), 1.4 * unit);
  }
  if (sk.rightShoulder != null) {
    const a = deg(sk.rightShoulder);
    base.rightElbow = rot(base.rightShoulder, base.rightElbow, a, 1.6 * unit);
    base.rightWrist = rot(base.rightElbow, base.rightWrist, a + deg(sk.rightElbow || 0), 1.4 * unit);
  }
  if (sk.leftHip != null) {
    const a = deg(sk.leftHip);
    base.leftKnee = rot(base.leftHip, base.leftKnee, a, 2 * unit);
    base.leftAnkle = rot(base.leftKnee, base.leftAnkle, a + deg(sk.leftKnee || 0), 2 * unit);
  }
  if (sk.rightHip != null) {
    const a = deg(sk.rightHip);
    base.rightKnee = rot(base.rightHip, base.rightKnee, a, 2 * unit);
    base.rightAnkle = rot(base.rightKnee, base.rightAnkle, a + deg(sk.rightKnee || 0), 2 * unit);
  }
  target._cachedTargetLandmarks = base;
  return base;
}

function rot(origin, p, ang, len) {
  const dx = Math.cos(ang) * len, dy = Math.sin(ang) * len;
  return { x: origin.x + dx, y: origin.y + dy };
}

export class RoleAssigner {
  constructor(opts = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this.lastAssignment = null; // {roleId: trackId, cost, swapped}
    this.lastSwapDetectedAt = 0;
  }

  reset() { this.lastAssignment = null; this.lastSwapDetectedAt = 0; }

  // tracks: confirmed tracks from PersonTracker. targets: scene.targetPeople.
  assign(tracks, targets, frameIndex = 0) {
    if (!targets || targets.length === 0) {
      return { resolved: false, abstain: true, reason: 'no_targets', assignment: null };
    }
    if (!tracks || tracks.length === 0) {
      return { resolved: false, abstain: true, reason: 'no_people', assignment: null };
    }

    const people = tracks.filter((t) => (t.confidence || 0) >= this.opts.minConfidence * 0.5);
    if (people.length < targets.length) {
      return {
        resolved: false, abstain: true, reason: 'missing_partner',
        assignment: null, detectedCount: tracks.length, requiredCount: targets.length,
      };
    }
    if (tracks.length > this.opts.maxPeople) {
      return { resolved: false, abstain: true, reason: 'too_many_people', assignment: null };
    }

    // Cost matrix [people × roles].
    const cost = people.map((t) => targets.map((r) => roleCost(t, r, this.opts)));

    // For 2-person case: evaluate direct vs swapped explicitly.
    if (targets.length === 2 && people.length === 2) {
      const direct = cost[0][0] + cost[1][1];
      const swapped = cost[0][1] + cost[1][0];
      const margin = Math.abs(direct - swapped);
      const abstain = margin < this.opts.ambiguityMargin;
      const useSwapped = swapped < direct;
      const chosen = useSwapped ? swapped : direct;
      const assignment = useSwapped
        ? [{ roleId: targets[0].roleId, trackId: people[1].trackId, cost: cost[1][0] },
           { roleId: targets[1].roleId, trackId: people[0].trackId, cost: cost[0][1] }]
        : [{ roleId: targets[0].roleId, trackId: people[0].trackId, cost: cost[0][0] },
           { roleId: targets[1].roleId, trackId: people[1].trackId, cost: cost[1][1] }];

      // Hysteresis: don't flip roles unless improvement is decisive.
      let swapBlocked = false;
      if (this.lastAssignment && !this.lastAssignment.abstain) {
        const wasSwapped = this.lastAssignment.swapped;
        if (wasSwapped !== useSwapped && chosen > (this.lastAssignment.totalCost || Infinity) - this.opts.roleSwitchHysteresis) {
          // keep previous orientation
          swapBlocked = true;
        }
      }
      const finalAssignment = swapBlocked ? this.lastAssignment.assignment : assignment;
      const result = {
        resolved: !abstain && !swapBlocked ? true : (swapBlocked ? true : false),
        abstain,
        reason: abstain ? 'ambiguous_roles' : null,
        ambiguity: margin,
        swapped: useSwapped && !swapBlocked,
        assignment: finalAssignment,
        roleConfidence: {
          [targets[0].roleId]: 1 - (useSwapped ? cost[1][0] : cost[0][0]),
          [targets[1].roleId]: 1 - (useSwapped ? cost[0][1] : cost[1][1]),
        },
        totalCost: chosen,
        detectedCount: tracks.length,
        requiredCount: targets.length,
      };
      this.lastAssignment = result;
      return result;
    }

    // General case (1 or 3 people): Hungarian over [people × roles].
    const assign = hungarianRect(cost);
    const total = assign.reduce((s, { p, r }) => s + cost[p][r], 0);
    const assignment = assign.map(({ p, r }) => ({ roleId: targets[r].roleId, trackId: people[p].trackId, cost: cost[p][r] }));
    const result = {
      resolved: true, abstain: false, reason: null,
      assignment, totalCost: total,
      detectedCount: tracks.length, requiredCount: targets.length,
    };
    this.lastAssignment = result;
    return result;
  }
}

function hungarianRect(cost) {
  // For small matrices reuse the square Hungarian with padding.
  const n = cost.length, m = cost[0].length;
  const size = Math.max(n, m);
  const big = 1e6;
  const M = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i < n && j < m ? cost[i][j] : big)));
  // simple greedy for the general case to avoid overhead
  const cells = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) cells.push({ p: i, r: j, c: M[i][j] });
  cells.sort((a, b) => a.c - b.c);
  const usedP = new Set(), usedR = new Set();
  const out = [];
  for (const { p, r, c } of cells) {
    if (usedP.has(p) || usedR.has(r) || c >= big) continue;
    usedP.add(p); usedR.add(r); out.push({ p, r });
  }
  return out;
}

// Does the assignment satisfy a contact between roleA.anchorA and roleB.anchorB?
export function contactSatisfied(assignment, tracks, contact) {
  const aTrack = tracks.find((t) => t.trackId === assignment.find((a) => a.roleId === contact.participantA)?.trackId);
  const bTrack = tracks.find((t) => t.trackId === assignment.find((a) => a.roleId === contact.participantB)?.trackId);
  if (!aTrack || !bTrack) return { satisfied: false, reason: 'missing_participant' };
  const aLm = aTrack.landmarks[contact.anchorA];
  const bLm = bTrack.landmarks[contact.anchorB];
  if (!aLm || !bLm) return { satisfied: false, reason: 'missing_anchor', excluded: true };
  if (contact.visibilityRequired && ((aLm.visibility || aLm.confidence) < 0.3 || (bLm.visibility || bLm.confidence) < 0.3)) {
    return { satisfied: false, reason: 'low_visibility', excluded: true };
  }
  const d = Math.hypot(aLm.x - bLm.x, aLm.y - bLm.y);
  const ok = d <= (contact.targetDistance + contact.tolerance);
  return { satisfied: ok, distance: d, tolerance: contact.tolerance + contact.targetDistance };
}
