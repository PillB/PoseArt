/* ============================================================
 * PoseArt — Anatomy Limits Module  v1.0
 * ------------------------------------------------------------
 * Enforces anatomically feasible joint ranges and sign
 * conventions so no pose bends elbows/knees the wrong way,
 * hyperextends beyond human ROM, or leaves calves pointing
 * up in seated poses.
 *
 * Public API:
 *   AnatomyLimits.clamp(joints, opts)   -> new joints object
 *   AnatomyLimits.validate(joints, opts) -> { ok, violations[] }
 *   AnatomyLimits.LIMITS                 -> read-only ROM table
 *
 * Sign convention (must match pose-skeleton-3d.js):
 *   spine      : + forward flex
 *   neck       : + tilt to figure's left
 *   leftHip    : + leg swings forward (flex)
 *   rightHip   : + leg swings forward (flex)
 *   leftKnee   : + shin folds under thigh (flex)   ← anatomically-correct convention
 *   rightKnee  : + shin folds under thigh (flex)
 *   leftElbow  : + forearm bends toward biceps (flex)
 *   rightElbow : + forearm bends toward biceps (flex)
 *   leftShoulder / rightShoulder : - raise arm up, + arm down/back
 *   hipAbductL/R : + leg spreads outward (abduction)
 *   shoulderFwdL/R : + arm swings forward
 *   leftAnkle / rightAnkle : + dorsiflex (toe up)
 * ============================================================ */

(function (global) {
  'use strict';

  // Per-joint range-of-motion (degrees). Values are conservative
  // human averages — not gymnast extremes. Anything outside this
  // will be flagged and clamped.
  var LIMITS = {
    spine:          { min: -35,  max:  45,  desc: 'spine flex/ext' },
    neck:           { min: -55,  max:  55,  desc: 'neck side-tilt' },
    hips:           { min: -25,  max:  25,  desc: 'pelvis lateral tilt' },

    leftShoulder:   { min: -180, max:  50,  desc: 'L shoulder abduction' },
    rightShoulder:  { min: -180, max:  50,  desc: 'R shoulder abduction' },
    shoulderFwdL:   { min: -60,  max: 170,  desc: 'L shoulder forward flex' },
    shoulderFwdR:   { min: -60,  max: 170,  desc: 'R shoulder forward flex' },

    leftElbow:      { min:   0,  max: 150,  desc: 'L elbow flex' },
    rightElbow:     { min:   0,  max: 150,  desc: 'R elbow flex' },

    leftHip:        { min: -30,  max: 130,  desc: 'L hip flex/ext' },
    rightHip:       { min: -30,  max: 130,  desc: 'R hip flex/ext' },
    hipAbductL:     { min: -10,  max:  55,  desc: 'L hip abduction' },
    hipAbductR:     { min: -10,  max:  55,  desc: 'R hip abduction' },

    leftKnee:       { min:   0,  max: 145,  desc: 'L knee flex (never hyperextend)' },
    rightKnee:      { min:   0,  max: 145,  desc: 'R knee flex (never hyperextend)' },

    leftAnkle:      { min: -40,  max:  25,  desc: 'L ankle plantarflex/dorsiflex' },
    rightAnkle:     { min: -40,  max:  25,  desc: 'R ankle plantarflex/dorsiflex' },

    globalTilt:     { min: -120, max: 120,  desc: 'global body tilt' },
    globalTwist:    { min: -180, max: 180,  desc: 'global body twist' },
    globalRoll:     { min: -60,  max:  60,  desc: 'global body roll' }
  };

  // Categories that imply "sitting / bent-leg" contact — used to
  // trigger coupling rules that fold the calf under the thigh.
  var SEATED_CATEGORIES = {
    'seated': true,
    'lean-seat': true,
    'kneeling': true,
    'reclining': true,
    'floor': true,
    'boudoir': true
  };

  function clampNum(v, lo, hi) {
    if (typeof v !== 'number' || isNaN(v)) return 0;
    return Math.max(lo, Math.min(hi, v));
  }

  /**
   * Apply per-joint ROM clamps and coupling rules.
   * Coupling rules encode joint interdependence — e.g. a hip
   * flexed 90° forward implies the knee is also bent (otherwise
   * the shin would stick straight forward like a Barbie doll).
   *
   * @param {object} joints - pose joint angles
   * @param {object} opts   - { category, isSeated, log }
   * @returns {object} new joints (input is not mutated)
   */
  function clamp(joints, opts) {
    opts = opts || {};
    joints = joints || {};
    var out = {};
    for (var k in joints) if (Object.prototype.hasOwnProperty.call(joints, k)) out[k] = joints[k];

    // 1) Per-joint ROM clamps
    for (var key in LIMITS) {
      if (typeof out[key] === 'number' && !isNaN(out[key])) {
        var L = LIMITS[key];
        out[key] = clampNum(out[key], L.min, L.max);
      }
    }

    // 2) Sanity: knees must never be negative (no back-bending)
    if (typeof out.leftKnee  === 'number' && out.leftKnee  < 0) out.leftKnee  = 0;
    if (typeof out.rightKnee === 'number' && out.rightKnee < 0) out.rightKnee = 0;
    if (typeof out.leftElbow === 'number' && out.leftElbow < 0) out.leftElbow = 0;
    if (typeof out.rightElbow=== 'number' && out.rightElbow< 0) out.rightElbow= 0;

    // 3) Coupling: seated / kneeling / reclining → if hip is strongly
    //    flexed, the knee must also flex enough so the calf folds
    //    under the thigh (else it points UP — the bug the user reported).
    var seated = !!opts.isSeated || SEATED_CATEGORIES[opts.category || ''];
    var lHip = out.leftHip  || 0;
    var rHip = out.rightHip || 0;

    // Universal coupling — applies regardless of category label
    // because ANY forward-flexed hip needs a bent knee at some
    // threshold; a straight leg with hip-flex 90 is Barbie-doll pose.
    if (lHip >= 60) {
      var lMin = Math.max(60, lHip - 20);
      if ((out.leftKnee || 0) < lMin) out.leftKnee = lMin;
    }
    if (rHip >= 60) {
      var rMin = Math.max(60, rHip - 20);
      if ((out.rightKnee || 0) < rMin) out.rightKnee = rMin;
    }

    // 4) Seated-specific: if the category screams seated but the
    //    hip flex value looks too small, bump the knee anyway.
    //    Cross-legged / floor / kneeling all need ≥75° knee flex.
    if (seated) {
      if ((out.leftKnee  || 0) < 75) out.leftKnee  = 75;
      if ((out.rightKnee || 0) < 75) out.rightKnee = 75;
    }

    // 5) Cross-legged tell: BOTH hips abducted AND flexed → force
    //    deep knee flex so calves cross under
    if ((out.hipAbductL || 0) >= 25 && (out.hipAbductR || 0) >= 25 &&
        (lHip >= 45 || rHip >= 45)) {
      if ((out.leftKnee  || 0) < 110) out.leftKnee  = 110;
      if ((out.rightKnee || 0) < 110) out.rightKnee = 110;
    }

    // 6) Sub-limits on elbow lock: elbows never look painfully straight
    //    (matches existing 8° soft minimum in FK). This is applied at
    //    render time by the FK function; we just guard the data.
    if (typeof out.leftElbow  === 'number' && out.leftElbow  > 0 && out.leftElbow  < 5) out.leftElbow  = 8;
    if (typeof out.rightElbow === 'number' && out.rightElbow > 0 && out.rightElbow < 5) out.rightElbow = 8;

    return out;
  }

  /**
   * Validate a pose without mutating it. Returns a list of
   * violation objects so callers can report / log.
   */
  function validate(joints, opts) {
    opts = opts || {};
    joints = joints || {};
    var violations = [];

    for (var key in LIMITS) {
      var v = joints[key];
      if (typeof v !== 'number' || isNaN(v)) continue;
      var L = LIMITS[key];
      if (v < L.min) violations.push({ joint: key, value: v, limit: L.min, kind: 'below', desc: L.desc });
      if (v > L.max) violations.push({ joint: key, value: v, limit: L.max, kind: 'above', desc: L.desc });
    }

    // Coupling checks
    var lHip = joints.leftHip  || 0, rHip = joints.rightHip || 0;
    var lKnee = joints.leftKnee || 0, rKnee = joints.rightKnee || 0;

    if (lHip >= 60 && lKnee < Math.max(60, lHip - 20)) {
      violations.push({ joint: 'leftKnee', value: lKnee, kind: 'coupling',
        desc: 'hip flexed ' + lHip + '° needs knee ≥' + Math.max(60, lHip-20) + '° (calf-under-thigh)' });
    }
    if (rHip >= 60 && rKnee < Math.max(60, rHip - 20)) {
      violations.push({ joint: 'rightKnee', value: rKnee, kind: 'coupling',
        desc: 'hip flexed ' + rHip + '° needs knee ≥' + Math.max(60, rHip-20) + '° (calf-under-thigh)' });
    }

    var seated = !!opts.isSeated || SEATED_CATEGORIES[opts.category || ''];
    if (seated) {
      if (lKnee < 75) violations.push({ joint: 'leftKnee', value: lKnee, kind: 'seated-min',
        desc: 'seated category needs L knee ≥75°' });
      if (rKnee < 75) violations.push({ joint: 'rightKnee', value: rKnee, kind: 'seated-min',
        desc: 'seated category needs R knee ≥75°' });
    }

    return { ok: violations.length === 0, violations: violations };
  }

  var AnatomyLimits = {
    LIMITS: LIMITS,
    SEATED_CATEGORIES: SEATED_CATEGORIES,
    clamp: clamp,
    validate: validate,
    version: '1.0'
  };

  global.AnatomyLimits = AnatomyLimits;

})(typeof window !== 'undefined' ? window : this);
