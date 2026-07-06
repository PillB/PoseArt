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
    },

    // ─── STANDING (4 additional) ─────────────────────────────────────────

    // Standing S-curve — weight shifts first onto right leg, then upper
    // body counter-curves. Similar to contrapposto but stronger hip swing.
    'scurve-stand': {
      duration: 1800, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.45, ease: 'inout', joints: {                                        // hips swing to model's right
            hips: 12, hipAbductR: 12,
            rightHip: 12, rightKnee: 8,
            leftKnee: 8
          }},
        { t: 0.80, ease: 'inout', joints: {                                        // arms begin to answer the curve
            hips: 18, hipAbductR: 16,
            spine: -6, leftShoulder: -14, rightShoulder: 8,
            leftElbow: 45, rightElbow: 35
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // Hip shift — pronounced weight transfer + one arm bent tight to waist.
    'hip-shift': {
      duration: 1700, hold: 1400, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.50, ease: 'inout', joints: {                                        // hip pushes out, opposite leg softens
            hips: 14, hipAbductR: 14,
            leftHip: 12, rightHip: -8,
            leftKnee: 8, rightKnee: 8
          }},
        { t: 0.85, ease: 'out', joints: {                                          // upper body shapes up
            hips: 18, hipAbductR: 18, hipAbductL: 8,
            spine: -10, leftShoulder: -10, leftElbow: 60,
            rightShoulder: 4, rightElbow: 18
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // Model walk — one leg steps forward, hips and shoulders counter-rotate.
    'model-walk': {
      duration: 1900, hold: 1400, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.30, ease: 'inout', joints: {                                        // weight loads onto back leg
            hips: 6, rightHip: -6, rightKnee: 4,
            leftHip: 4
          }},
        { t: 0.70, ease: 'inout', joints: {                                        // front leg swings through
            hips: 10, leftHip: 12, leftKnee: 10,
            rightHip: -12, rightKnee: 4,
            leftShoulder: 8, rightShoulder: -8,
            leftElbow: 55, rightElbow: 40
          }},
        { t: 1.00, ease: 'out', joints: target }
      ])
    },

    // Crossed arms — arms fold in toward chest through a bent-elbow arc.
    'crossed-arms-stand': {
      duration: 1700, hold: 1400, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // arms drop then elbows bend out
            leftShoulder: -25, rightShoulder: -25,
            leftElbow: 50, rightElbow: 50,
            hips: 6
          }},
        { t: 0.75, ease: 'inout', joints: {                                        // forearms sweep across body
            leftShoulder: -40, rightShoulder: -32,
            leftElbow: 95, rightElbow: 95,
            shoulderFwdL: 18, shoulderFwdR: 15,
            hips: 10
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // ─── BOUDOIR (×2) ────────────────────────────────────────────────────

    // Boudoir standing S-curve: exaggerated feminine hip cock + shoulder
    // drop + soft arms. Weight shifts first, then upper-body arcs in.
    'boudoir-s-curve-stand': {
      duration: 1900, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.40, ease: 'inout', joints: {                                        // hip cocks out to the right
            hips: 10, hipAbductR: 14,
            rightHip: 12, rightKnee: 12,
            leftHip: 18, leftKnee: 18
          }},
        { t: 0.75, ease: 'inout', joints: {                                        // spine arches, shoulders soften
            hips: 14, hipAbductR: 18, hipAbductL: 5,
            leftHip: 26, leftKnee: 26, rightHip: 18, rightKnee: 22,
            spine: 10, neck: 6,
            leftShoulder: -14, rightShoulder: 4,
            leftElbow: 55, rightElbow: 40
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // Boudoir elegant recline: figure tips onto its side, one knee draws
    // up, then arms settle. globalTilt introduced early so silhouette
    // reads horizontal before the joint articulation lands.
    'boudoir-elegant-recline': {
      duration: 2000, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.30, ease: 'inout', joints: {                                        // body tips down
            globalTilt: 40, globalRoll: -4,
            leftHip: 8, rightHip: 8,
            leftKnee: 5, rightKnee: 20
          }},
        { t: 0.65, ease: 'inout', joints: {                                        // fully on side, top knee draws up
            globalTilt: 70, globalRoll: -8,
            spine: 6, neck: 8,
            leftHip: 14, leftKnee: 8,
            rightHip: 10, rightKnee: 45,
            leftElbow: 22, rightShoulder: -22, rightElbow: 14
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // ─── COUPLE ──────────────────────────────────────────────────────────

    // Close embrace — shoulders round forward, arms wrap in, hips soften.
    'couple-embrace': {
      duration: 2000, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // arms lift out to receive
            leftShoulder: -35, rightShoulder: -35,
            leftElbow: 22, rightElbow: 22,
            hips: 6
          }},
        { t: 0.75, ease: 'inout', joints: {                                        // shoulders roll in, arms wrap
            leftShoulder: -22, rightShoulder: 8,
            leftElbow: 28, rightElbow: 28,
            shoulderFwdL: 22, shoulderFwdR: 22,
            spine: -6, hips: 10, globalRoll: -4,
            leftKnee: 15, rightKnee: 8
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // ─── DYNAMIC (×2) ────────────────────────────────────────────────────

    // Mid-jump — compress, then explode upward through a stretched arc.
    'mid-jump': {
      duration: 1800, hold: 1200, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.30, ease: 'inout', joints: {                                        // deep crouch load
            leftHip: 40, rightHip: 40,
            leftKnee: 65, rightKnee: 65,
            hipAbductL: 8, hipAbductR: 8,
            leftShoulder: -30, rightShoulder: -30,
            leftElbow: 40, rightElbow: 40,
            spine: 5
          }},
        { t: 0.65, ease: 'out', joints: {                                          // extension — arms swing overhead, legs punch down
            leftHip: -5, rightHip: -5,
            leftKnee: 15, rightKnee: 15,
            leftShoulder: -110, rightShoulder: -105,
            leftElbow: 30, rightElbow: 25,
            spine: -8, hips: 12
          }},
        { t: 1.00, ease: 'back', joints: target }                                  // airborne apex — arrive with punch
      ])
    },

    // Dynamic reach — one arm launches out laterally while opposite arm
    // counter-balances; slight lunge underneath.
    'dynamic-reach': {
      duration: 1900, hold: 1400, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // wind up — arms open into T
            leftShoulder: -85, rightShoulder: -85,
            leftElbow: 40, rightElbow: 30,
            hips: 8, leftKnee: 12, rightKnee: 8
          }},
        { t: 0.70, ease: 'out', joints: {                                          // reach fires, opposite arm swings back
            leftShoulder: -105, leftElbow: 55,
            rightShoulder: 20, rightElbow: 32,
            spine: -6, hips: 12,
            leftHip: -6, leftKnee: 18, rightKnee: 10
          }},
        { t: 1.00, ease: 'back', joints: target }
      ])
    },

    // ─── ECCENTRIC ───────────────────────────────────────────────────────

    // Hair flip — head tilts back, one arm sweeps up through the hair,
    // hips punch out for attitude.
    'hair-flip': {
      duration: 1800, hold: 1400, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // hip pushes out, chin lifts
            hips: 10, neck: 6, spine: -4,
            leftKnee: 8, rightKnee: 8
          }},
        { t: 0.70, ease: 'inout', joints: {                                        // left arm sweeps up through T toward head
            leftShoulder: -80, leftElbow: 55,
            rightElbow: 25,
            hips: 14, spine: -6, neck: 10,
            shoulderFwdL: 10
          }},
        { t: 1.00, ease: 'out', joints: target }
      ])
    },

    // ─── EDITORIAL ───────────────────────────────────────────────────────

    // Sharp angles — everything hits geometry at once with hard beats;
    // hips lock first, then arms snap into their angles.
    'editorial-sharp-angles-stand': {
      duration: 1700, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'in', joints: {                                           // hips lock into angle first
            hips: 14, leftHip: 10, leftKnee: 8, rightKnee: 15,
            spine: -8
          }},
        { t: 0.70, ease: 'in', joints: {                                           // arms bend into their sharp positions
            hips: 18, leftHip: 15, leftKnee: 10, rightKnee: 20,
            spine: -12, neck: 10,
            leftShoulder: 15, leftElbow: 60,
            rightShoulder: -10, rightElbow: 50
          }},
        { t: 1.00, ease: 'back', joints: target }
      ])
    },

    // ─── FASHION ─────────────────────────────────────────────────────────

    // Classic power stance — feet plant wide, elbows come up into akimbo
    // with a decisive final beat.
    'fashion-power-stance-classic': {
      duration: 1700, hold: 1600, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'in', joints: {} },
        { t: 0.30, ease: 'out', joints: {                                          // stance plants wide
            hipAbductL: 12, hipAbductR: 12,
            leftHip: -18, leftKnee: 18,
            rightHip: -3, rightKnee: 0
          }},
        { t: 0.65, ease: 'inout', joints: {                                        // arms bend up toward hips
            hipAbductL: 10, hipAbductR: 10,
            leftHip: -25, leftKnee: 25, rightHip: -5,
            leftShoulder: -40, rightShoulder: -40,
            leftElbow: 60, rightElbow: 60,
            spine: -6
          }},
        { t: 1.00, ease: 'back', joints: target }
      ])
    },

    // ─── FINE-ART (×2) ───────────────────────────────────────────────────

    // Classic arabesque — back leg lifts and extends behind, one arm
    // reaches forward, spine arches. Balance leg plants first.
    'fineart-classic-arabesque': {
      duration: 2100, hold: 1600, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.30, ease: 'inout', joints: {                                        // weight on standing (left) leg
            leftHip: -3, leftAnkle: -12,
            spine: -4
          }},
        { t: 0.65, ease: 'inout', joints: {                                        // right leg lifts behind, torso tips forward
            leftHip: -5, leftAnkle: -18,
            rightHip: -40, rightKnee: 0, rightAnkle: -18,
            spine: -6, globalTwist: 12,
            leftShoulder: -35, leftElbow: 60,
            rightShoulder: 10, rightElbow: 45
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // Classical contrapposto — canonical fine-art weight shift; slower,
    // more sculptural pacing than the standing 'contrapposto'.
    'fineart-contrapposto-classic': {
      duration: 1900, hold: 1600, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.45, ease: 'inout', joints: {                                        // hip weight shift, opposite knee softens
            hips: 5, leftHip: 12, rightHip: -20, rightKnee: 5
          }},
        { t: 0.80, ease: 'inout', joints: {                                        // torso counter-curve, gaze softens
            hips: 6, leftHip: 18, rightHip: -28, rightKnee: 5,
            spine: 7, neck: 10,
            leftShoulder: -45, rightShoulder: 25,
            leftElbow: 5, rightElbow: 5
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // ─── HIGH-TO-LOW ─────────────────────────────────────────────────────

    // Standing peak start — figure stands tall with arms reaching up,
    // slight backward lean as the peak of the descent sequence.
    'highlow-standing-peak-start': {
      duration: 1900, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // arms sweep out to T
            leftShoulder: -95, rightShoulder: -95,
            leftElbow: 10, rightElbow: 10,
            hipAbductL: 8, hipAbductR: 8
          }},
        { t: 0.70, ease: 'inout', joints: {                                        // arms come overhead, chest lifts, slight back lean
            leftShoulder: -125, rightShoulder: -122,
            leftElbow: 12, rightElbow: 12,
            spine: -10, neck: 8,
            globalTilt: -15,                                                        // mid-transition tilt (clamped)
            hips: 6, hipAbductL: 10, hipAbductR: 10
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // ─── KNEELING (×2) ───────────────────────────────────────────────────

    // Knight's kneel — one knee drops first (right), then torso settles,
    // then arms find their rest positions.
    'knights-kneel': {
      duration: 2000, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // right leg begins to fold
            rightHip: 0, rightKnee: 55,
            leftHip: 20, leftKnee: 30
          }},
        { t: 0.70, ease: 'inout', joints: {                                        // both knees loaded, torso begins to settle
            leftHip: 60, leftKnee: 75, leftAnkle: -8,
            rightHip: 0, rightKnee: 90, rightAnkle: -15,
            spine: -3, neck: -4,
            leftShoulder: -12, leftElbow: 50,
            rightShoulder: -8, rightElbow: 40
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // Kneeling reach — both knees fold first, then arms sweep overhead
    // through a wide arc.
    'kneeling-reach': {
      duration: 2000, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // sink to both knees
            leftHip: 55, leftKnee: 70, leftAnkle: -25,
            rightHip: 55, rightKnee: 70, rightAnkle: -25
          }},
        { t: 0.70, ease: 'inout', joints: {                                        // arms sweep out to T, torso lengthens
            leftHip: 75, leftKnee: 85, leftAnkle: -32,
            rightHip: 75, rightKnee: 85, rightAnkle: -32,
            leftShoulder: -55, rightShoulder: -55,
            leftElbow: 60, rightElbow: 60,
            spine: -6
          }},
        { t: 1.00, ease: 'out', joints: target }
      ])
    },

    // ─── LEAN-SEAT ───────────────────────────────────────────────────────

    // Elbow prop — seated posture with weight leaning onto forward elbow.
    // Hips fold first, then torso tips forward onto the propping arm.
    'elbow-prop': {
      duration: 1900, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // sit down
            leftHip: 55, rightHip: 55,
            leftKnee: 70, rightKnee: 70,
            hips: 5
          }},
        { t: 0.70, ease: 'inout', joints: {                                        // torso tips forward, elbows come up
            leftHip: 65, rightHip: 65,
            leftKnee: 85, rightKnee: 85,
            spine: 6, neck: -8, hips: 8,
            leftShoulder: -22, rightShoulder: -22,
            leftElbow: 55, rightElbow: 55,
            shoulderFwdL: 10, shoulderFwdR: 10
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // ─── LEANING ─────────────────────────────────────────────────────────

    // Wall lean — full-body tips sideways (globalRoll) then hips shift out
    // as if a wall is catching the shoulder.
    'wall-lean': {
      duration: 1900, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.40, ease: 'inout', joints: {                                        // tip toward the wall
            globalRoll: 10, hips: 6,
            hipAbductL: 6, hipAbductR: 6
          }},
        { t: 0.75, ease: 'inout', joints: {                                        // shoulder finds the wall, hip pushes out
            globalRoll: 16, hips: 10,
            hipAbductL: 10, hipAbductR: 10,
            spine: -8, neck: -6,
            leftShoulder: -8, leftElbow: 30, rightElbow: 18
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // ─── LOW-TO-HIGH ─────────────────────────────────────────────────────

    // Floor seated start — figure lowers to a seated floor pose (globalTilt
    // rises toward a partial recline), knees fold, arms find the ground.
    'lowhigh-floor-seated-start': {
      duration: 2100, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // squat down
            leftHip: 40, rightHip: 40,
            leftKnee: 55, rightKnee: 55,
            spine: -5
          }},
        { t: 0.70, ease: 'inout', joints: {                                        // seat lands, torso reclines slightly
            globalTilt: 18,                                                        // partial recline (clamped ≤ 40)
            leftHip: 15, rightHip: 15,
            leftKnee: 45, rightKnee: 40,
            spine: -6, neck: 20, hips: 8,
            leftShoulder: 15, rightShoulder: 15,
            leftElbow: 60, rightElbow: 60,
            hipAbductL: 8, hipAbductR: 8
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // ─── RECLINING ───────────────────────────────────────────────────────

    // Side recline — figure rotates down onto its side; globalTilt swings
    // hard through the arc. Legs align, then arms settle.
    'side-recline': {
      duration: 2200, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.30, ease: 'inout', joints: {                                        // torso begins to tip
            globalTilt: -35,
            leftHip: -5, rightHip: -3,
            leftKnee: 5, rightKnee: 5
          }},
        { t: 0.65, ease: 'inout', joints: {                                        // fully horizontal
            globalTilt: -65,
            neck: -10, spine: -4,
            leftHip: -8, rightHip: -5,
            leftShoulder: -8, leftElbow: 55,
            rightShoulder: 6, rightElbow: 55
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // ─── SEATED (×2) ─────────────────────────────────────────────────────

    // Soft sit — figure lowers, hips fold ≈90°, knees track forward.
    'soft-sit': {
      duration: 1900, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.40, ease: 'inout', joints: {                                        // squat halfway
            leftHip: 50, rightHip: 50,
            leftKnee: 60, rightKnee: 60,
            spine: 4, hipAbductL: 12, hipAbductR: 12
          }},
        { t: 0.75, ease: 'inout', joints: {                                        // seated posture almost final
            leftHip: 75, rightHip: 75,
            leftKnee: 82, rightKnee: 85,
            spine: 7, neck: -3, hipAbductL: 18, hipAbductR: 18,
            leftElbow: 45, rightElbow: 35, rightShoulder: -12
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // Cross-legged — hips fold first, then knees splay wide, then
    // forearms rest on knees.
    'floor-cross-leg': {
      duration: 2100, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // sink down
            leftHip: 55, rightHip: 55,
            leftKnee: 80, rightKnee: 80,
            hipAbductL: 15, hipAbductR: 15
          }},
        { t: 0.75, ease: 'inout', joints: {                                        // knees splay open cross-legged
            leftHip: 75, rightHip: 75,
            leftKnee: 120, rightKnee: 120,
            hipAbductL: 22, hipAbductR: 22,
            spine: -5, leftShoulder: -18, rightShoulder: -25,
            leftElbow: 70, rightElbow: 70
          }},
        { t: 1.00, ease: 'inout', joints: target }
      ])
    },

    // ─── ACCESSIBLE (×2) ─────────────────────────────────────────────────

    // Wheelchair — expressive arms: seated base first, then arms open into
    // an asymmetric gesture (one out, one high).
    'wheelchair-arms': {
      duration: 2000, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // sit into chair
            leftHip: 70, rightHip: 70,
            leftKnee: 80, rightKnee: 80,
            leftAnkle: -10, rightAnkle: -10
          }},
        { t: 0.70, ease: 'inout', joints: {                                        // arms open — left mid, right up
            leftHip: 80, rightHip: 80,
            leftKnee: 85, rightKnee: 85,
            leftShoulder: -30, leftElbow: 20,
            rightShoulder: -90, rightElbow: 55,
            spine: 3
          }},
        { t: 1.00, ease: 'out', joints: target }
      ])
    },

    // Sky reach — seated (accessible) reaching both arms overhead.
    'upper-reach': {
      duration: 2000, hold: 1500, rest: 500,
      arc: (target) => ([
        { t: 0.00, ease: 'out', joints: {} },
        { t: 0.35, ease: 'inout', joints: {                                        // seated base
            leftHip: 70, rightHip: 70,
            leftKnee: 85, rightKnee: 85
          }},
        { t: 0.70, ease: 'inout', joints: {                                        // arms out to T then up
            leftHip: 80, rightHip: 80,
            leftKnee: 90, rightKnee: 90,
            leftShoulder: -100, rightShoulder: -95,
            leftElbow: 40, rightElbow: 40,
            spine: 4, neck: 8
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
