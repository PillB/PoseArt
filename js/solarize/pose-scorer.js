// ============================================================
// PoseArt Solarize — Gated Alignment Scorer (Solarize §14)
// ------------------------------------------------------------
// Replaces the one-dimensional angle average with a 6-gate,
// decomposed score. NO artificial oscillation. Invisible joints
// are never scored confidently and never produce corrections.
//
// Gates: 1 runtime validity · 2 scene eligibility · 3 per-person
// pose similarity · 4 relational · 5 props · 6 temporal stability.
// ============================================================

import {
  makeAlignmentResult, oksDistance, torsoScale, computeCanonicalJointAngles,
  computeCanonicalBones, CANONICAL_LANDMARKS, clamp01,
} from './canonical-schema.js';
import { contactSatisfied } from './role-assignment.js';

const DEFAULTS = {
  minPersonConfidence: 0.35,
  minLandmarkVisibility: 0.3,
  personCountRequired: null,        // derived from scene
  scoreThresholdAutoCapture: 0.82,  // 82%
  confidenceThresholdAutoCapture: 0.6,
  framingMargin: 0.06,              // landmarks within [margin, 1-margin] count as in-frame
  temporalHoldFrames: 6,            // ~0.2s @30fps
  landmarkStabilityWindow: 8,
};

export class PoseScorer {
  constructor(opts = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this.history = []; // recent AlignmentResult snapshots for temporal gate
  }

  reset() { this.history = []; }

  // observed: [{trackId, landmarks, confidence, root, scale, ...}] (already role-assigned via assignment)
  // scene: PoseScene. assignment: role assignment result. profile: runtime profile.
  score({ observed, scene, assignment, profile, runtime, frameTimestamp }) {
    const excluded = [];
    const blocking = [];
    const corrections = [];
    let confidence = 0;

    // ---- Gate 1: runtime validity ----
    const runtimeOk = !!(runtime && runtime.modelReady && !runtime.fatalError);
    if (!runtimeOk) blocking.push('runtime_not_valid');
    const inferredFromRealModel = !!(profile && profile.realModel && runtimeOk);

    // ---- Gate 2: scene eligibility ----
    const required = (scene && scene.targetPeople && scene.targetPeople.length) || 1;
    const detected = (observed && observed.length) || 0;
    let personCountOk = detected >= required;
    if (detected > required + 1) { blocking.push('too_many_people'); personCountOk = false; }
    if (detected < required) blocking.push('missing_person');

    // Visibility / framing per person
    let visibilityOk = true;
    let framingOk = true;
    for (const p of observed || []) {
      const v = meanVisibility(p.landmarks);
      if (v < this.opts.minPersonConfidence) { visibilityOk = false; }
      if (!inFrame(p.landmarks, this.opts.framingMargin)) framingOk = false;
    }
    if (!visibilityOk) blocking.push('low_visibility');
    if (!framingOk) blocking.push('framing');

    const roleResolved = !!(assignment && assignment.resolved && !assignment.abstain);
    if (required > 1 && !roleResolved) blocking.push('role_unresolved');

    const sceneEligible = personCountOk && visibilityOk && framingOk && (required === 1 || roleResolved);

    // ---- Gate 3: per-person pose similarity ----
    const perPersonScores = [];
    const perPersonDetails = [];
    if (sceneEligible && inferredFromRealModel) {
      for (const target of scene.targetPeople) {
        const person = assignedPerson(observed, assignment, target.roleId);
        if (!person) { perPersonScores.push({ roleId: target.roleId, score: 0, reason: 'not_assigned' }); continue; }
        const cmp = this._personSimilarity(person, target);
        perPersonScores.push({ roleId: target.roleId, score: cmp.score, components: cmp.components });
        perPersonDetails.push({ roleId: target.roleId, ...cmp });
        for (const ex of cmp.excluded) excluded.push(`${target.roleId}:${ex}`);
        for (const cor of cmp.corrections) corrections.push({ roleId: target.roleId, ...cor });
        confidence = Math.max(confidence, cmp.confidence);
      }
    } else if (inferredFromRealModel) {
      // scene not eligible — still compute partial where possible but mark components excluded
      for (const target of scene.targetPeople) {
        perPersonScores.push({ roleId: target.roleId, score: 0, reason: 'scene_ineligible' });
      }
    }
    // SIMULATION: never produce a real score.
    const personScoreAvg = perPersonScores.length
      ? perPersonScores.reduce((s, p) => s + (p.score || 0), 0) / perPersonScores.length
      : 0;

    // ---- Gate 4: relational ----
    let relationalScore = 0;
    if (required > 1 && sceneEligible && inferredFromRealModel) {
      relationalScore = this._relationalScore(observed, scene, assignment);
      // Contacts
      for (const c of scene.contacts || []) {
        if (c.participantA.startsWith('prop:') || c.participantB.startsWith('prop:')) continue; // prop contacts in Gate 5
        const r = contactSatisfied(assignment.assignment || assignmentToAssignment(assignment), observed, c);
        if (r.excluded) excluded.push(`contact:${c.id}:low_visibility`);
        else if (!r.satisfied) blocking.push(`contact_unsatisfied:${c.id}`);
      }
    } else if (required > 1) {
      relationalScore = 0;
    } else {
      relationalScore = 1; // single-person: relational N/A, neutral
    }

    // ---- Gate 5: props ----
    let propScore = 1;
    if (scene && scene.props && scene.props.length) {
      const requiredProps = scene.props.filter((p) => p.requiredOrOptional === 'required');
      for (const prop of requiredProps) {
        const contacts = (scene.contacts || []).filter((c) => c.participantA === `prop:${prop.propId}` || c.participantB === `prop:${prop.propId}`);
        if (!contacts.length) { blocking.push(`prop_no_contact:${prop.propId}`); propScore = Math.min(propScore, 0); continue; }
        for (const c of contacts) {
          const r = contactSatisfied(assignment.assignment || assignmentToAssignment(assignment), observed, c);
          if (r.excluded) excluded.push(`prop:${prop.propId}:low_visibility`);
          else if (!r.satisfied) { blocking.push(`prop_contact_unsatisfied:${c.id}`); propScore = Math.min(propScore, 0.2); }
        }
      }
    }

    // ---- Gate 6: temporal stability ----
    let stabilityScore = 1;
    if (inferredFromRealModel && sceneEligible) {
      stabilityScore = this._stability(perPersonScores, assignment);
    } else {
      stabilityScore = 0;
    }

    // ---- Compose overall (NO oscillation) ----
    let overall;
    if (!inferredFromRealModel) {
      overall = 0;            // simulation yields no real score
      blocking.push('simulation_mode');
    } else if (blocking.length) {
      // Partial credit but not eligible; overall reflects similarity achieved so far.
      overall = personScoreAvg * 0.6 + relationalScore * 0.2 + propScore * 0.1 + stabilityScore * 0.1;
    } else {
      overall = personScoreAvg * 0.6 + relationalScore * 0.2 + propScore * 0.1 + stabilityScore * 0.1;
    }
    overall = clamp01(overall);

    const eligible = inferredFromRealModel && blocking.length === 0 &&
      overall >= this.opts.scoreThresholdAutoCapture &&
      confidence >= this.opts.confidenceThresholdAutoCapture;

    const result = makeAlignmentResult({
      eligible,
      overallScore: overall,
      confidence: clamp01(confidence),
      perPersonScores,
      relationalScore,
      propScore,
      stabilityScore,
      excludedComponents: excluded,
      blockingReasons: blocking,
      topCorrections: corrections.slice(0, 3),
      profile: profile ? profile.id : 'SIMULATION',
      inferredFromRealModel,
    });

    // temporal history
    this.history.push({ ts: frameTimestamp || 0, overall, confidence, result });
    if (this.history.length > this.opts.landmarkStabilityWindow * 2) this.history.shift();

    return result;
  }

  // ---- per-person similarity (Gate 3 components) ----
  _personSimilarity(person, target) {
    const lm = person.landmarks;
    const scale = person.scale || torsoScale(lm) || 1;
    const tlm = target._cachedTargetLandmarks || buildTargetLandmarks(target);

    // OKS
    const oks = oksDistance(lm, tlm, scale);
    // Bone-vector cosine similarity
    const obsBones = computeCanonicalBones(lm);
    const tgtBones = computeCanonicalBones(tlm);
    const boneSim = cosineBoneSim(obsBones, tgtBones);
    // Joint angles
    const obsAng = computeCanonicalJointAngles(lm);
    const tgtAng = target.canonicalSkeleton || {};
    let angErr = 0, angN = 0;
    for (const [j, t] of Object.entries(tgtAng)) {
      if (obsAng[j] == null) continue;
      angErr += Math.min(Math.abs(obsAng[j] - t), 180 - Math.abs(obsAng[j] - t)); angN++;
    }
    const angleSim = angN ? 1 - (angErr / angN) / 90 : 0;
    // Root/torso orientation
    const orientSim = rootOrientationSim(lm, target);
    // Ground support (feet near bottom of frame & visible)
    const supportSim = groundSupport(lm);
    // Confidence of this person's measurement
    const conf = meanVisibility(lm);

    const excluded = [];
    const corrections = [];
    // Generate corrections ONLY for visible joints with large angle error.
    for (const [j, t] of Object.entries(tgtAng)) {
      if (obsAng[j] == null) continue;
      const kpDef = jointKeypoints(j);
      const visible = kpDef.every((k) => (lm[k]?.visibility || lm[k]?.confidence || 0) >= this.opts.minLandmarkVisibility);
      if (!visible) { excluded.push(`${j}_angle(invisible)`); continue; }
      const err = Math.min(Math.abs(obsAng[j] - t), 180 - Math.abs(obsAng[j] - t));
      if (err > 18) corrections.push({ joint: j, measured: Math.round(obsAng[j]), target: Math.round(t), delta: Math.round(err), hint: hintFor(j, obsAng[j], t) });
    }
    corrections.sort((a, b) => b.delta - a.delta);

    const score = clamp01(0.4 * oks + 0.25 * boneSim + 0.2 * angleSim + 0.1 * orientSim + 0.05 * supportSim);
    return { score, confidence: conf, components: { oks, boneSim, angleSim, orientSim, supportSim }, excluded, corrections };
  }

  _relationalScore(observed, scene, assignment) {
    // relative root translation, distance, ordering
    if (!assignment || !assignment.assignment) return 0.5;
    const get = (roleId) => observed.find((o) => o.trackId === assignment.assignment.find((a) => a.roleId === roleId)?.trackId);
    const a = get(scene.targetPeople[0].roleId);
    const b = get(scene.targetPeople[1].roleId);
    if (!a || !b) return 0;
    const dist = Math.hypot((a.root?.x || 0.5) - (b.root?.x || 0.5), (a.root?.y || 0.5) - (b.root?.y || 0.5));
    // expected distance from contact constraints (closest touch targetDistance)
    const contacts = (scene.contacts || []).filter((c) => !c.participantA.startsWith('prop:') && !c.participantB.startsWith('prop:'));
    let expected = 0.2;
    if (contacts.length) expected = Math.min(...contacts.map((c) => c.targetDistance));
    const distSim = 1 - Math.min(1, Math.abs(dist - expected) / 0.4);
    // ordering (left/right) agreement with role root positions
    const aTgt = scene.targetPeople[0].rootPosition, bTgt = scene.targetPeople[1].rootPosition;
    const orderOk = ((a.root?.x || 0) - (b.root?.x || 0)) * ((aTgt?.x || 0) - (bTgt?.x || 0)) >= 0;
    return clamp01(0.6 * distSim + 0.4 * (orderOk ? 1 : 0));
  }

  _stability(perPersonScores, assignment) {
    if (this.history.length < 2) return 0.5;
    const recent = this.history.slice(-this.opts.landmarkStabilityWindow);
    const scores = recent.map((h) => h.overall);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length;
    const stab = 1 - Math.min(1, variance * 40); // penalize jitter
    // role stability
    const roleStab = assignment && !assignment.swapped ? 1 : 0.7;
    return clamp01(0.6 * stab + 0.4 * roleStab);
  }
}

// ---- helpers ----
function meanVisibility(lm) {
  let s = 0, n = 0;
  for (const name of CANONICAL_LANDMARKS) { s += (lm[name]?.visibility || lm[name]?.confidence || 0); n++; }
  return n ? s / n : 0;
}
function inFrame(lm, margin) {
  for (const name of ['leftAnkle', 'rightAnkle', 'nose']) {
    const p = lm[name];
    if (!p) continue;
    const v = p.visibility || p.confidence || 0;
    if (v > 0.3 && (p.x < margin || p.x > 1 - margin || p.y < margin || p.y > 1 - margin)) return false;
  }
  return true;
}
function assignedPerson(observed, assignment, roleId) {
  if (!assignment || !assignment.assignment) return observed[0];
  const a = assignment.assignment.find((x) => x.roleId === roleId);
  return a ? observed.find((o) => o.trackId === a.trackId) : null;
}
function assignmentToAssignment(assignment) {
  return assignment && assignment.assignment ? assignment.assignment : [];
}
function cosineBoneSim(a, b) {
  let sum = 0, n = 0;
  for (const k of Object.keys(a)) {
    if (!b[k]) continue;
    const dot = a[k].x * b[k].x + a[k].y * b[k].y;
    sum += (dot + 1) / 2; n++;
  }
  return n ? sum / n : 0;
}
function rootOrientationSim(lm, target) {
  const ls = lm.leftShoulder, rs = lm.rightShoulder;
  if (!ls || !rs) return 0.5;
  const dx = rs.x - ls.x;
  const facing = Math.abs(dx) > 0.04 ? 1 : 0.4; // shoulders apart = facing camera
  return target.rootRotation === 0 ? facing : 1 - facing;
}
function groundSupport(lm) {
  const la = lm.leftAnkle, ra = lm.rightAnkle;
  const v = (la?.visibility || 0) + (ra?.visibility || 0);
  if (v < 0.5) return 0.5; // can't tell
  const nearGround = ((la?.y || 0) + (ra?.y || 0)) / 2 > 0.8;
  return nearGround ? 1 : 0.4;
}
function jointKeypoints(joint) {
  return {
    leftShoulder: ['leftShoulder', 'leftElbow', 'leftHip'],
    rightShoulder: ['rightShoulder', 'rightElbow', 'rightHip'],
    leftElbow: ['leftWrist', 'leftElbow', 'leftShoulder'],
    rightElbow: ['rightWrist', 'rightElbow', 'rightShoulder'],
    leftHip: ['leftKnee', 'leftHip', 'leftShoulder'],
    rightHip: ['rightKnee', 'rightHip', 'rightShoulder'],
    leftKnee: ['leftAnkle', 'leftKnee', 'leftHip'],
    rightKnee: ['rightAnkle', 'rightKnee', 'rightHip'],
    spine: ['leftHip', 'rightHip', 'leftShoulder', 'rightShoulder'],
    neck: ['nose', 'leftShoulder', 'rightShoulder'],
  }[joint] || [];
}
function hintFor(joint, measured, target) {
  const delta = target - measured;
  const map = {
    leftShoulder: delta > 0 ? 'Raise your left arm' : 'Lower your left arm',
    rightShoulder: delta > 0 ? 'Raise your right arm' : 'Lower your right arm',
    leftElbow: delta > 0 ? 'Bend your left elbow more' : 'Straighten your left arm',
    rightElbow: delta > 0 ? 'Bend your right elbow more' : 'Straighten your right arm',
    leftHip: delta > 0 ? 'Shift your left hip out' : 'Bring your left hip in',
    rightHip: delta > 0 ? 'Shift your right hip out' : 'Bring your right hip in',
    leftKnee: delta > 0 ? 'Bend your left knee' : 'Straighten your left leg',
    rightKnee: delta > 0 ? 'Bend your right knee' : 'Straighten your right leg',
  };
  return map[joint] || `Adjust your ${joint}`;
}

// Expose target landmark builder for the role-assigner cache.
export function buildTargetLandmarks(target) {
  // delegate to role-assignment's _targetLandmarks by caching
  // (imported lazily to avoid cycle at module load)
  // Re-implemented here to keep scorer self-contained.
  const sk = target.canonicalSkeleton || {};
  const cx = (target.rootPosition && target.rootPosition.x) || 0.5;
  const cy = (target.rootPosition && target.rootPosition.y) || 0.5;
  const unit = 0.06;
  const deg = (d) => (d * Math.PI) / 180;
  const base = {
    nose: { x: cx, y: cy - 3.2 * unit },
    leftShoulder: { x: cx - unit, y: cy - 2 * unit }, rightShoulder: { x: cx + unit, y: cy - 2 * unit },
    leftHip: { x: cx - 0.7 * unit, y: cy }, rightHip: { x: cx + 0.7 * unit, y: cy },
    leftKnee: { x: cx - 0.7 * unit, y: cy + 2 * unit }, rightKnee: { x: cx + 0.7 * unit, y: cy + 2 * unit },
    leftAnkle: { x: cx - 0.7 * unit, y: cy + 4 * unit }, rightAnkle: { x: cx + 0.7 * unit, y: cy + 4 * unit },
    leftElbow: { x: cx - 2 * unit, y: cy - unit }, rightElbow: { x: cx + 2 * unit, y: cy - unit },
    leftWrist: { x: cx - 2.5 * unit, y: cy }, rightWrist: { x: cx + 2.5 * unit, y: cy },
  };
  const rot = (o, p, ang, len) => ({ x: o.x + Math.cos(ang) * len, y: o.y + Math.sin(ang) * len });
  if (sk.leftShoulder != null) { const a = deg(sk.leftShoulder); base.leftElbow = rot(base.leftShoulder, base.leftElbow, a, 1.6 * unit); base.leftWrist = rot(base.leftElbow, base.leftWrist, a + deg(sk.leftElbow || 0), 1.4 * unit); }
  if (sk.rightShoulder != null) { const a = deg(sk.rightShoulder); base.rightElbow = rot(base.rightShoulder, base.rightElbow, a, 1.6 * unit); base.rightWrist = rot(base.rightElbow, base.rightWrist, a + deg(sk.rightElbow || 0), 1.4 * unit); }
  if (sk.leftHip != null) { const a = deg(sk.leftHip); base.leftKnee = rot(base.leftHip, base.leftKnee, a, 2 * unit); base.leftAnkle = rot(base.leftKnee, base.leftAnkle, a + deg(sk.leftKnee || 0), 2 * unit); }
  if (sk.rightHip != null) { const a = deg(sk.rightHip); base.rightKnee = rot(base.rightHip, base.rightKnee, a, 2 * unit); base.rightAnkle = rot(base.rightKnee, base.rightAnkle, a + deg(sk.rightKnee || 0), 2 * unit); }
  return base;
}
