/**
 * PoseFlagshipAnimation — hand-authored multi-keyframe motion arcs for a
 * curated set of flagship poses. Proves the pattern before we invest the
 * effort in authoring arcs for all 745.
 *
 * Unlike PoseAnimation (which does a straight A-pose → target ease), this
 * module drives the procedural skeleton through 3-5 keyframes with a
 * per-segment ease so the motion has an *arc* (e.g. arms sweep up through
 * a T-pose to overhead, weight shifts before shoulder drops, etc.).
 *
 * Public API:
 *   PoseFlagshipAnimation.has(poseId)                → bool
 *   PoseFlagshipAnimation.mount(container, pose, opts) → handle {stop, restart, el}
 *
 * A flagship entry is:
 *   {
 *     keyframes: [{ t: 0..1, joints: {..}, ease?: 'in'|'out'|'inout'|'linear' }, ...],
 *     duration:  ms  (default 1800)
 *     hold:      ms  (default 1400)   // hold at final keyframe
 *     rest:      ms  (default 500)    // hold at first keyframe before looping
 *     loop:      bool (default true)
 *   }
 */
(function (global) {
  'use strict';

  // ─── Easing library ──────────────────────────────────────────────────────
  const EASE = {
    linear: t => t,
    in:     t => t * t,
    out:    t => 1 - (1 - t) * (1 - t),
    inout:  t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    // A slight overshoot for "arrive with intent" — used in hero pose finales.
    back:   t => {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
  };

  // A canonical relaxed A-pose used as the resting frame.
  const A_POSE = {
    spine: 0, neck: 0, hips: 0,
    globalTilt: 0, globalTwist: 0, globalRoll: 0,
    leftShoulder: -15, rightShoulder: -15,
    leftElbow: 8, rightElbow: 8,
    shoulderFwdL: 0, shoulderFwdR: 0,
    leftShoulderFwd: 0, rightShoulderFwd: 0,
    leftHip: 0, rightHip: 0,
    leftKnee: 5, rightKnee: 5,
    hipAbductL: 3, hipAbductR: 3,
    ankleL: 0, ankleR: 0, leftAnkle: 0, rightAnkle: 0,
    wristL: 0, wristR: 0
  };

  // ─── Flagship keyframe library ───────────────────────────────────────────
  // Each entry describes a HAND-AUTHORED motion arc. `t` is normalized time
  // 0..1 across `duration`. The joints at each keyframe are DELTAS from
  // A_POSE (missing keys inherit from A_POSE), except the final keyframe
  // which is usually left empty (=== pose.joints, filled at mount).
  //
  // Ease refers to the ease OUT of that keyframe into the next.
  const FLAGSHIPS = {
    // Standing hero: arms sweep up through a side-open arc; weight rises to
    // the balls of the feet; spine lengthens then arches at the peak.
    'tiptoe-reach': {
      duration: 1900,
      hold: 1500,
      rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },                                      // A-pose rest
        { t: 0.35, ease: 'inout', joints: {                                        // arms out to sides (T)
            leftShoulder: -95, rightShoulder: -95,
            leftElbow: 8, rightElbow: 8,
            spine: -3, ankleL: -5, ankleR: -5
          }},
        { t: 0.70, ease: 'out', joints: {                                          // arms sweeping upward
            leftShoulder: -140, rightShoulder: -140,
            leftElbow: 15, rightElbow: 15,
            spine: -8, ankleL: -12, ankleR: -12,
            neck: -6
          }},
        { t: 1.00, ease: 'inout', joints: target }                                 // final target
      ])
    },

    // Standing S-curve: weight shifts to the right hip, LEFT knee softens,
    // right hand travels to hip, head tilts. Motion arc = weight shift first,
    // then upper-body settles.
    'contrapposto': {
      duration: 1700,
      hold: 1400,
      rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.45, ease: 'inout', joints: {                                        // hip weight-shift only
            hips: -8, leftKnee: 15, rightKnee: 3,
            hipAbductL: 5, hipAbductR: -2, spine: 5
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // Power stance: feet plant wide first, then arms bring up + shoulders back
    // for a "hero-lands" beat.
    'power-stance': {
      duration: 1600,
      hold: 1600,
      rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'in', joints: {} },
        { t: 0.30, ease: 'out', joints: {                                          // legs plant wide, knees soft
            hipAbductL: 22, hipAbductR: 22,
            leftKnee: 25, rightKnee: 25,
            leftHip: 8, rightHip: 8
          }},
        { t: 0.65, ease: 'inout', joints: {                                        // shoulders roll back, arms lift halfway
            hipAbductL: 22, hipAbductR: 22,
            leftKnee: 20, rightKnee: 20,
            leftShoulder: -50, rightShoulder: -50,
            leftElbow: 60, rightElbow: 60,
            spine: -5
          }},
        { t: 1.00, ease: 'back', joints: target }                                  // arrive with confidence
      ])
    },

    // Warrior lunge: back leg extends first, hips lower, front knee bends,
    // arms extend last. A four-beat arc.
    'warrior-lunge': {
      duration: 2100,
      hold: 1600,
      rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.25, ease: 'inout', joints: {                                        // step out with right leg
            rightHip: 25, rightKnee: 25,
            hipAbductR: 12
          }},
        { t: 0.55, ease: 'inout', joints: {                                        // sink into lunge
            rightHip: 55, rightKnee: 75,
            leftHip: -15, leftKnee: 5,
            hipAbductR: 15,
            spine: -3
          }},
        { t: 0.85, ease: 'out', joints: {                                          // begin arm extension
            rightHip: 65, rightKnee: 85,
            leftHip: -18, leftKnee: 5,
            hipAbductR: 15,
            leftShoulder: -75, rightShoulder: -75,
            leftElbow: 30, rightElbow: 30,
            spine: -5
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // Side-stretch: reach one arm overhead + laterally curve the spine.
    // Left arm rises first, then torso curves toward opposite side.
    'side-stretch': {
      duration: 1800,
      hold: 1500,
      rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.40, ease: 'inout', joints: {                                        // left arm up first
            leftShoulder: -120, leftElbow: 20,
            rightShoulder: -20, rightElbow: 25
          }},
        { t: 0.75, ease: 'out', joints: {                                          // torso begins to curve
            leftShoulder: -140, leftElbow: 20,
            rightShoulder: -25, rightElbow: 30,
            globalRoll: 12, spine: 8
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────
  function fillFromA(over) {
    const out = {};
    for (const k in A_POSE) out[k] = A_POSE[k];
    if (over) for (const k in over) if (typeof over[k] === 'number') out[k] = over[k];
    return out;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function interp(from, to, t) {
    const out = {};
    for (const k in to) {
      const a = typeof from[k] === 'number' ? from[k] : 0;
      const b = typeof to[k]   === 'number' ? to[k]   : a;
      out[k] = lerp(a, b, t);
    }
    // preserve keys that are only in `from`
    for (const k in from) if (!(k in out)) out[k] = from[k];
    return out;
  }

  function renderFrame(container, pose, joints, opts) {
    if (!global.PoseFigureProcedural || typeof global.PoseFigureProcedural.render !== 'function') return;
    const frame = {};
    for (const k in pose) frame[k] = pose[k];
    frame.joints = joints;
    container.innerHTML = global.PoseFigureProcedural.render(frame, {
      width: opts.width,
      height: opts.height,
      animate: false,
      view: opts.view || 'auto'
    });
  }

  function has(poseId) { return !!FLAGSHIPS[poseId]; }

  function mount(container, pose, opts) {
    if (!container || !pose) return null;
    const spec = FLAGSHIPS[pose.id];
    if (!spec) return null;
    opts = opts || {};
    const W = opts.width || 220;
    const H = opts.height || 300;
    const DUR  = spec.duration;
    const HOLD = spec.hold;
    const REST = spec.rest;
    const loop = spec.loop !== false;

    // Build the actual keyframes: convert relative t to absolute ms and
    // materialize joint sets from A_POSE + delta + target.
    const target = fillFromA(pose.joints || {});
    const kfs = spec.arc(target).map(k => ({
      t: k.t * DUR,
      ease: EASE[k.ease || 'inout'],
      joints: fillFromA(k.joints)
    }));
    // Guarantee final keyframe is the exact target
    kfs[kfs.length - 1].joints = target;

    // Kill prior handle
    if (container.__poseAnimHandle && typeof container.__poseAnimHandle.stop === 'function') {
      container.__poseAnimHandle.stop();
    }

    const state = { phase: 'forward', t0: performance.now(), raf: 0, stopped: false };

    function tick(now) {
      if (state.stopped) return;
      const el = now - state.t0;
      let joints;

      if (state.phase === 'forward') {
        if (el >= DUR) {
          joints = kfs[kfs.length - 1].joints;
          state.phase = 'hold'; state.t0 = now;
        } else {
          // Find surrounding keyframes
          let a = kfs[0], b = kfs[kfs.length - 1];
          for (let i = 0; i < kfs.length - 1; i++) {
            if (el >= kfs[i].t && el <= kfs[i + 1].t) { a = kfs[i]; b = kfs[i + 1]; break; }
          }
          const span = b.t - a.t;
          const local = span > 0 ? (el - a.t) / span : 1;
          joints = interp(a.joints, b.joints, a.ease(local));
        }
      } else if (state.phase === 'hold') {
        joints = kfs[kfs.length - 1].joints;
        if (el >= HOLD) { state.phase = 'reverse'; state.t0 = now; }
      } else if (state.phase === 'reverse') {
        // Reverse is a simple ease back to the first keyframe
        const RDUR = DUR * 0.55;
        if (el >= RDUR) {
          joints = kfs[0].joints;
          state.phase = 'rest'; state.t0 = now;
        } else {
          const local = el / RDUR;
          joints = interp(kfs[kfs.length - 1].joints, kfs[0].joints, EASE.inout(local));
        }
      } else if (state.phase === 'rest') {
        joints = kfs[0].joints;
        if (el >= REST) {
          if (!loop) { renderFrame(container, pose, target, { width: W, height: H, view: opts.view }); return; }
          state.phase = 'forward'; state.t0 = now;
        }
      }

      renderFrame(container, pose, joints, { width: W, height: H, view: opts.view });
      state.raf = requestAnimationFrame(tick);
    }

    renderFrame(container, pose, kfs[0].joints, { width: W, height: H, view: opts.view });
    state.raf = requestAnimationFrame(tick);

    const handle = {
      stop() { state.stopped = true; if (state.raf) cancelAnimationFrame(state.raf); },
      restart() { state.phase = 'forward'; state.t0 = performance.now(); },
      el: container,
      flagship: true
    };
    container.__poseAnimHandle = handle;
    return handle;
  }

  global.PoseFlagshipAnimation = {
    has,
    mount,
    IDS: Object.keys(FLAGSHIPS)
  };
})(typeof window !== 'undefined' ? window : this);
