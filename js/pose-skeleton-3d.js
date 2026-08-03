/* ============================================================
 * PoseArt — 3D Skeleton / Ghost Pose Renderer  v3.0
 * ------------------------------------------------------------
 * Pure JavaScript, canvas-based, dependency-free 3D skeleton.
 *
 * NEW in v3.0:
 *   - globalTilt: post-FK whole-body rotation (X-axis) for
 *     recline/prone/supine poses — makes figure truly horizontal
 *   - globalTwist: post-FK Y-axis body twist for side-recline
 *   - globalRoll: post-FK Z-axis lateral tilt
 *   - Shoulder forward swing (Y-axis) added as shoulderFwdL/R
 *   - Hip abduction (Z-axis) for seated spread via hipAbductL/R
 *   - Ground shadow dynamically repositions for recline
 *   - Arabesque sign fix: rightHip negative = leg behind
 * ============================================================ */

(function (global) {
  'use strict';

  // ----------------------------------------------------------
  // 1. Base skeleton — T-pose joint positions (normalized units)
  //    Origin = hip center. +Y = up, +X = figure's right,
  //    +Z = toward viewer (front of body)
  // ----------------------------------------------------------
  var T_POSE = {
    head:          { x: 0,     y: 0.92,  z: 0 },
    neck:          { x: 0,     y: 0.78,  z: 0 },
    leftShoulder:  { x: -0.22, y: 0.68,  z: 0 },
    rightShoulder: { x:  0.22, y: 0.68,  z: 0 },
    leftElbow:     { x: -0.38, y: 0.30,  z: 0 },
    rightElbow:    { x:  0.38, y: 0.30,  z: 0 },
    leftWrist:     { x: -0.50, y: -0.02, z: 0 },
    rightWrist:    { x:  0.50, y: -0.02, z: 0 },
    spine:         { x: 0,     y: 0.38,  z: 0 },
    hips:          { x: 0,     y: 0.12,  z: 0 },
    leftHip:       { x: -0.13, y: 0.05,  z: 0 },
    rightHip:      { x:  0.13, y: 0.05,  z: 0 },
    leftKnee:      { x: -0.13, y: -0.38, z: 0 },
    rightKnee:     { x:  0.13, y: -0.38, z: 0 },
    leftAnkle:     { x: -0.11, y: -0.80, z: 0 },
    rightAnkle:    { x:  0.11, y: -0.80, z: 0 },
    leftFoot:      { x: -0.11, y: -0.88, z: 0.12 },
    rightFoot:     { x:  0.11, y: -0.88, z: 0.12 }
  };

  // Bone connections: [fromJoint, toJoint, side]
  var BONES = [
    ['head', 'neck', 'C'],
    ['neck', 'leftShoulder', 'L'],
    ['neck', 'rightShoulder', 'R'],
    ['neck', 'spine', 'C'],
    ['spine', 'hips', 'C'],
    ['leftShoulder', 'leftElbow', 'L'],
    ['leftElbow', 'leftWrist', 'L'],
    ['rightShoulder', 'rightElbow', 'R'],
    ['rightElbow', 'rightWrist', 'R'],
    ['hips', 'leftHip', 'L'],
    ['leftHip', 'leftKnee', 'L'],
    ['leftKnee', 'leftAnkle', 'L'],
    ['leftAnkle', 'leftFoot', 'L'],
    ['hips', 'rightHip', 'R'],
    ['rightHip', 'rightKnee', 'R'],
    ['rightKnee', 'rightAnkle', 'R'],
    ['rightAnkle', 'rightFoot', 'R'],
    ['leftHip', 'rightHip', 'C'],
    ['leftShoulder', 'rightShoulder', 'C']
  ];

  var KEY_JOINTS = {
    leftShoulder: true, rightShoulder: true,
    leftHip: true, rightHip: true, hips: true
  };

  var COLOR_LEFT   = '#1A6B6A';
  var COLOR_RIGHT  = '#0F3B3A';
  var COLOR_CENTER = '#0F3B3A';
  var COLOR_GOLD   = '#C9A24C';
  // PR-2 (v1.1) — Phase 1 directive: ghost must be "more watery and lithe"
  // (Part H #13) and derive from the SAME procedural rig as the avatar /
  // skeleton (Part A.10 rule #4). COLOR_GHOST is the cyan-aqua (~#3EA9B8)
  // specified in Phase 1 step 5. Used as the bone + joint fill whenever
  // state.ghostMode is true, replacing the dark teal COLOR_CENTER so the
  // ghost reads as a luminous water silhouette rather than "faded skeleton".
  var COLOR_GHOST  = '#3EA9B8';
  var COLOR_GHOST_DEEP = '#2E8AA8';

  // Bone width profiles: [nearWidth, farWidth] in px — tapered capsule effect.
  // PR-1 (v1.1): Per Phase 4 directive #15/#36 the key-joint "ball" bones
  // (leftShoulder↔rightShoulder clavicle bar, leftHip↔rightHip pelvis bar)
  // have been slimmed 45% in the perpendicular / short-axis direction so the
  // halo of the shoulder/hip ball no longer dwarfs the actual limb capsule.
  // Limb bones are left untouched — only the "shape" bars were the culprit.
  // REASONING [PR-1]: the directive's "45% thinner" rule is explicitly about
  // the shoulder-to-shoulder shape; thinning limb bones would over-emaciate
  // the figure and break the lithe-but-readable silhouette established in v3.0.
  var BONE_WIDTHS = {
    'head-neck':          [7, 5],
    'neck-spine':         [9, 7],
    'neck-leftShoulder':  [8, 5],
    'neck-rightShoulder': [8, 5],
    'spine-hips':         [11, 8],
    'leftShoulder-leftElbow':   [6, 4],
    'leftElbow-leftWrist':      [4, 2.5],
    'rightShoulder-rightElbow': [6, 4],
    'rightElbow-rightWrist':    [4, 2.5],
    'hips-leftHip':     [9, 7],
    'hips-rightHip':    [9, 7],
    'leftHip-leftKnee':       [7, 5],
    'leftKnee-leftAnkle':     [5, 3],
    'leftAnkle-leftFoot':     [3, 2],
    'rightHip-rightKnee':     [7, 5],
    'rightKnee-rightAnkle':   [5, 3],
    'rightAnkle-rightFoot':   [3, 2],
    'leftHip-rightHip':       [10, 8],
    // PR-1 (v1.1): was [10, 8]. Reduced 45% to [5.5, 4.4] so the clavicle bar
    // stops reading as a chunky yoke above the ribcage and matches the lithe
    // limb profile. Visual side-effect: at extreme yaw (back view) the
    // shoulder bar is thinner, which actually improves the silhouette read.
    'leftShoulder-rightShoulder': [5.5, 4.4]
  };

  // ----------------------------------------------------------
  // 2. Math helpers
  // ----------------------------------------------------------
  function degToRad(d) { return d * Math.PI / 180; }
  function clonePoint(p) { return { x: p.x, y: p.y, z: p.z }; }
  function cloneSkeleton(src) {
    var out = {};
    for (var k in src) { if (Object.prototype.hasOwnProperty.call(src, k)) out[k] = clonePoint(src[k]); }
    return out;
  }

  function rotX(point, pivot, angleDeg) {
    var rad = degToRad(angleDeg);
    var dy = point.y - pivot.y, dz = point.z - pivot.z;
    var c = Math.cos(rad), s = Math.sin(rad);
    return { x: point.x, y: pivot.y + dy*c - dz*s, z: pivot.z + dy*s + dz*c };
  }

  function rotZ(point, pivot, angleDeg) {
    var rad = degToRad(angleDeg);
    var dx = point.x - pivot.x, dy = point.y - pivot.y;
    var c = Math.cos(rad), s = Math.sin(rad);
    return { x: pivot.x + dx*c - dy*s, y: pivot.y + dx*s + dy*c, z: point.z };
  }

  function rotY(point, pivot, angleDeg) {
    var rad = degToRad(angleDeg);
    var dx = point.x - pivot.x, dz = point.z - pivot.z;
    var c = Math.cos(rad), s = Math.sin(rad);
    return { x: pivot.x + dx*c + dz*s, y: point.y, z: pivot.z - dx*s + dz*c };
  }

  // Global rotation around world origin (0,0,0)
  var ORIGIN = { x: 0, y: 0, z: 0 };
  function globalRotX(skel, angleDeg) {
    var out = {};
    for (var k in skel) {
      if (Object.prototype.hasOwnProperty.call(skel, k)) {
        out[k] = rotX(skel[k], ORIGIN, angleDeg);
      }
    }
    return out;
  }
  function globalRotY(skel, angleDeg) {
    var out = {};
    for (var k in skel) {
      if (Object.prototype.hasOwnProperty.call(skel, k)) {
        out[k] = rotY(skel[k], ORIGIN, angleDeg);
      }
    }
    return out;
  }
  function globalRotZ(skel, angleDeg) {
    var out = {};
    for (var k in skel) {
      if (Object.prototype.hasOwnProperty.call(skel, k)) {
        out[k] = rotZ(skel[k], ORIGIN, angleDeg);
      }
    }
    return out;
  }

  function applyCamera(point, yawDeg, pitchDeg) {
    var yaw = degToRad(yawDeg), pitch = degToRad(pitchDeg);
    var cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    var x1 =  point.x * cosY + point.z * sinY;
    var z1 = -point.x * sinY + point.z * cosY;
    var y1 = point.y;
    var cosP = Math.cos(pitch), sinP = Math.sin(pitch);
    var y2 = y1 * cosP - z1 * sinP;
    var z2 = y1 * sinP + z1 * cosP;
    return { x: x1, y: y2, z: z2 };
  }

  // ----------------------------------------------------------
  // 3. Forward kinematics — buildPose()
  //    SIGN CONVENTIONS:
  //    spine:        + = forward lean (torso tilts toward camera)
  //    neck:         EMPIRICALLY VERIFIED 2026-08-02: + = head tilts to figure's RIGHT (+x),
  //                   - = head tilts to figure's LEFT (-x). Old comment was INVERTED.
  //    leftShoulder: - = raise arm up/overhead; + = arm swings back
  //    rightShoulder:- = raise arm up/overhead; + = arm swings back (mirrored)
  //    leftElbow:    + = forearm bends inward/forward
  //    rightElbow:   + = forearm bends inward/forward
  //    hips:         + = pelvis tilts left (left hip drops)
  //    leftHip:      + = left leg swings FORWARD
  //    rightHip:     + = right leg swings FORWARD
  //    leftKnee:     + = shin bends BACKWARD
  //    rightKnee:    + = shin bends BACKWARD
  //    leftAnkle:    + = dorsiflexion (toe up); - = plantarflexion
  //    rightAnkle:   same
  //    hipAbductL/R: EMPIRICALLY VERIFIED 2026-08-02: + = ADDUCTION (inward/cross),
  //                   - = ABDUCTION (outward/spread). Old comment was INVERTED.
  //    shoulderFwdL/R: EMPIRICALLY VERIFIED 2026-08-02: + = BEHIND (posterior),
  //                   - = FORWARD (anterior). Old comment was INVERTED.
  //    globalTilt:   whole-body rotX. EMPIRICALLY VERIFIED 2026-08-02:
  //                   +90 = PRONE (face-down, anterior faces -y/down)
  //                   -90 = SUPINE (on-back, anterior faces +y/up)
  //                   (Prior comment claimed the opposite — it was INVERTED.
  //                    46 poses had wrong-sign values relying on the old
  //                    comment; they have been corrected in poses-data.js.)
  //    globalTwist:  + = whole body rotates left (for side-lying on left)
  //    globalRoll:   + = whole body rolls toward right side
  // ----------------------------------------------------------
  function buildPose(jointAngles) {
    jointAngles = jointAngles || {};
    var s = cloneSkeleton(T_POSE);
    var hp, kp, ap, ep;

    // ---- SPINE: forward lean around hips pivot ----
    var spineDeg = jointAngles.spine || 0;
    if (spineDeg) {
      var upperBody = ['spine','neck','head','leftShoulder','rightShoulder',
        'leftElbow','rightElbow','leftWrist','rightWrist'];
      hp = s.hips;
      for (var i = 0; i < upperBody.length; i++) {
        s[upperBody[i]] = rotX(s[upperBody[i]], hp, spineDeg);
      }
    }

    // ---- HIPS (pelvis tilt): lateral tilt ----
    var hipsTiltDeg = jointAngles.hips || 0;
    if (hipsTiltDeg) {
      var lowerBody = ['leftHip','rightHip','leftKnee','rightKnee',
        'leftAnkle','rightAnkle','leftFoot','rightFoot'];
      hp = s.hips;
      for (var lb = 0; lb < lowerBody.length; lb++) {
        s[lowerBody[lb]] = rotZ(s[lowerBody[lb]], hp, hipsTiltDeg);
      }
    }

    // ---- NECK: side tilt ----
    var neckDeg = jointAngles.neck || 0;
    if (neckDeg) {
      s.head = rotZ(s.head, s.neck, -neckDeg);
    }

    // ---- LEFT SHOULDER: abduction (Z-axis) ----
    var lShoulderDeg = jointAngles.leftShoulder || 0;
    if (lShoulderDeg) {
      ep = s.leftShoulder;
      s.leftElbow = rotZ(s.leftElbow, ep, lShoulderDeg);
      s.leftWrist = rotZ(s.leftWrist, ep, lShoulderDeg);
    }
    // Right shoulder: mirrored sign
    var rShoulderDeg = jointAngles.rightShoulder || 0;
    if (rShoulderDeg) {
      ep = s.rightShoulder;
      s.rightElbow = rotZ(s.rightElbow, ep, -rShoulderDeg);
      s.rightWrist = rotZ(s.rightWrist, ep, -rShoulderDeg);
    }

    // ---- SHOULDER FORWARD SWING (Y-axis) ----
    // + = arm swings forward (toward viewer), - = arm swings behind
    var lShFwdDeg = jointAngles.shoulderFwdL || 0;
    if (lShFwdDeg) {
      ep = s.leftShoulder;
      s.leftElbow = rotY(s.leftElbow, ep, -lShFwdDeg);
      s.leftWrist = rotY(s.leftWrist, ep, -lShFwdDeg);
    }
    var rShFwdDeg = jointAngles.shoulderFwdR || 0;
    if (rShFwdDeg) {
      ep = s.rightShoulder;
      s.rightElbow = rotY(s.rightElbow, ep, rShFwdDeg);
      s.rightWrist = rotY(s.rightWrist, ep, rShFwdDeg);
    }

    // ---- ELBOWS: bend forearm inward (Y-axis) ----
    // Soft joint minimum: elbows never look locked-straight (8° natural bend)
    var lElbowDeg = Math.max(jointAngles.leftElbow || 0, 8);
    ep = s.leftElbow;
    s.leftWrist = rotY(s.leftWrist, ep, lElbowDeg);
    var rElbowDeg = Math.max(jointAngles.rightElbow || 0, 8);
    ep = s.rightElbow;
    s.rightWrist = rotY(s.rightWrist, ep, -rElbowDeg);

    // ---- HIP ABDUCTION (Z-axis): for seated spread ----
    // + = leg spreads outward (away from centerline)
    var lHipAbdDeg = jointAngles.hipAbductL || 0;
    if (lHipAbdDeg) {
      hp = s.leftHip;
      s.leftKnee  = rotZ(s.leftKnee,  hp, lHipAbdDeg);
      s.leftAnkle = rotZ(s.leftAnkle, hp, lHipAbdDeg);
      s.leftFoot  = rotZ(s.leftFoot,  hp, lHipAbdDeg);
    }
    var rHipAbdDeg = jointAngles.hipAbductR || 0;
    if (rHipAbdDeg) {
      hp = s.rightHip;
      s.rightKnee  = rotZ(s.rightKnee,  hp, -rHipAbdDeg);
      s.rightAnkle = rotZ(s.rightAnkle, hp, -rHipAbdDeg);
      s.rightFoot  = rotZ(s.rightFoot,  hp, -rHipAbdDeg);
    }

    // ---- LEFT HIP: leg swing forward/back (X-axis) ----
    var lHipDeg = jointAngles.leftHip || 0;
    if (lHipDeg) {
      hp = s.leftHip;
      s.leftKnee  = rotX(s.leftKnee,  hp, -lHipDeg);
      s.leftAnkle = rotX(s.leftAnkle, hp, -lHipDeg);
      s.leftFoot  = rotX(s.leftFoot,  hp, -lHipDeg);
    }
    var rHipDeg = jointAngles.rightHip || 0;
    if (rHipDeg) {
      hp = s.rightHip;
      s.rightKnee  = rotX(s.rightKnee,  hp, -rHipDeg);
      s.rightAnkle = rotX(s.rightAnkle, hp, -rHipDeg);
      s.rightFoot  = rotX(s.rightFoot,  hp, -rHipDeg);
    }

    // ---- KNEES: shin bends backward (5° soft minimum avoids mannequin locked-knee) ----
    var lKneeDeg = Math.max(jointAngles.leftKnee || 0, 5);
    kp = s.leftKnee;
    s.leftAnkle = rotX(s.leftAnkle, kp, -lKneeDeg);
    s.leftFoot  = rotX(s.leftFoot,  kp, -lKneeDeg);
    var rKneeDeg = Math.max(jointAngles.rightKnee || 0, 5);
    kp = s.rightKnee;
    s.rightAnkle = rotX(s.rightAnkle, kp, -rKneeDeg);
    s.rightFoot  = rotX(s.rightFoot,  kp, -rKneeDeg);

    // ---- ANKLES: foot flexion/extension ----
    var lAnkleDeg = jointAngles.leftAnkle || 0;
    if (lAnkleDeg) {
      ap = s.leftAnkle;
      s.leftFoot = rotX(s.leftFoot, ap, -lAnkleDeg);
    }
    var rAnkleDeg = jointAngles.rightAnkle || 0;
    if (rAnkleDeg) {
      ap = s.rightAnkle;
      s.rightFoot = rotX(s.rightFoot, ap, -rAnkleDeg);
    }

    // ---- GLOBAL TRANSFORMS (applied last, after all FK) ----
    // globalTilt: whole-body rotX. VERIFIED: +90 = PRONE (face-down),
    // -90 = SUPINE (on-back). The old comment here was INVERTED and caused
    // 46 library-wide sign errors (corrected 2026-08-02).
    var gTilt = jointAngles.globalTilt || 0;
    if (gTilt) {
      s = globalRotX(s, gTilt);
    }

    // globalTwist: rotate entire body around Y-axis (for diagonal/side-lying)
    var gTwist = jointAngles.globalTwist || 0;
    if (gTwist) {
      s = globalRotY(s, gTwist);
    }

    // globalRoll: tilt entire body sideways (Z-axis)
    var gRoll = jointAngles.globalRoll || 0;
    if (gRoll) {
      s = globalRotZ(s, gRoll);
    }

    return s;
  }

  function lerpSkeleton(a, b, t) {
    var out = {};
    for (var k in a) {
      if (!Object.prototype.hasOwnProperty.call(a, k)) continue;
      var pa = a[k], pb = b[k];
      out[k] = { x: pa.x+(pb.x-pa.x)*t, y: pa.y+(pb.y-pa.y)*t, z: pa.z+(pb.z-pa.z)*t };
    }
    return out;
  }

  function easeOutCubic(t) { return 1 - Math.pow(1-t, 3); }
  function easeInOutQuad(t) { return t < 0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; }

  // ----------------------------------------------------------
  // 4. Named view angle presets
  // ----------------------------------------------------------
  var VIEW_ANGLES = {
    'front':               { yaw: 0,   pitch: 0  },
    'side-left':           { yaw: 90,  pitch: 0  },
    'side-right':          { yaw: -90, pitch: 0  },
    'quarter-front-left':  { yaw: 45,  pitch: 0  },
    'quarter-front-right': { yaw: -45, pitch: 0  },
    'top':                 { yaw: 0,   pitch: 80 },
    'low':                 { yaw: 0,   pitch: -30}
  };

  // ----------------------------------------------------------
  // 5. Renderer state
  // ----------------------------------------------------------
  function createState() {
    return {
      canvas: null, ctx: null, width: 0, height: 0, dpr: 1,
      currentPose: cloneSkeleton(T_POSE),
      displaySkeleton: cloneSkeleton(T_POSE),
      yaw: 30, pitch: 5, // 30° yaw = 3/4 view by default — much more elegant than straight-on
      ghostMode: true, scale: 1,
      autoRotate: false, autoRotateStart: null, autoRotateBaseYaw: 0,
      rafId: null,
      entryAnimActive: false, entryAnimStart: null, entryDurationMs: 550,
      introSweepActive: false, introSweepStart: null, introDurationMs: 850,
      introFromYaw: 0, introFromPitch: 0, introToYaw: 0, introToPitch: 0,
      dragging: false, lastPointerX: 0, lastPointerY: 0,
      dragHandlersBound: false,
      _onPointerDown: null, _onPointerMove: null, _onPointerUp: null,
      destroyed: false
    };
  }

  // ----------------------------------------------------------
  // 6. Projection + drawing
  // ----------------------------------------------------------
  function project(state, point) {
    var rotated = applyCamera(point, state.yaw, state.pitch);
    var cx = state.width / 2, cy = state.height / 2;
    var fitScale = Math.min(state.width, state.height) * 0.40 * state.scale;
    return { x: cx + rotated.x * fitScale, y: cy - rotated.y * fitScale, z: rotated.z };
  }

  function depthToAlpha(z) {
    var t = Math.max(0, Math.min(1, (z + 0.8) / 1.6));
    return 0.35 + t * 0.65;
  }

  function depthToWidth(z, base) {
    var t = Math.max(0, Math.min(1, (z + 0.8) / 1.6));
    return base * (0.45 + t * 0.85);
  }

  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1,3), 16);
    var g = parseInt(hex.slice(3,5), 16);
    var b = parseInt(hex.slice(5,7), 16);
    return 'rgba('+r+','+g+','+b+','+alpha+')';
  }

  function getShadowCenter(state) {
    // Find the lowest point in the skeleton for shadow placement
    var skel = state.displaySkeleton;
    var minY = Infinity;
    var avgX = 0, count = 0;
    for (var k in skel) {
      if (Object.prototype.hasOwnProperty.call(skel, k)) {
        if (skel[k].y < minY) minY = skel[k].y;
        avgX += skel[k].x;
        count++;
      }
    }
    return { x: avgX / count, y: minY - 0.02 };
  }

  function drawGroundShadow(state) {
    var ctx = state.ctx;
    var shadow = getShadowCenter(state);
    var proj = project(state, { x: shadow.x, y: shadow.y, z: 0 });
    var fitScale = Math.min(state.width, state.height) * 0.40 * state.scale;
    var rx = 0.30 * fitScale, ry = 0.07 * fitScale;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(proj.x, proj.y + 3, Math.max(rx,6), Math.max(ry,3), 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(15,59,58,0.12)';
    ctx.fill();
    ctx.restore();
  }

  function getBoneColor(state, side) {
    // PR-2 (v1.1): when ghostMode is on, the entire figure uses the cyan-aqua
    // palette so it reads as "water" rather than a transparent dark-teal
    // clone of the avatar. Side differentiation is suppressed in ghost mode
    // (L/R/C all return COLOR_GHOST) — the directive calls for a lithe
    // silhouette, not a labeled anatomy chart.
    if (state && state.ghostMode) return COLOR_GHOST;
    if (side === 'L') return COLOR_LEFT;
    if (side === 'R') return COLOR_RIGHT;
    return COLOR_CENTER;
  }

  function drawBone(state, aKey, bKey, side) {
    var ctx = state.ctx;
    var skel = state.displaySkeleton;
    var a = skel[aKey], b = skel[bKey];
    if (!a || !b) return;
    var pa = project(state, a), pb = project(state, b);
    var avgZ = (pa.z + pb.z) / 2;
    // PR-2 (v1.1): ghost alpha raised from 0.60 → 0.78 so the water silhouette
    // is readable against the live camera feed (which is bright/noisy). The
    // old 0.60 was tuned for the parchment app background, not video.
    var alpha = depthToAlpha(avgZ) * (state.ghostMode ? 0.78 : 0.95);
    var baseColor = getBoneColor(state, side);

    // Tapered capsule: look up width profile for this bone pair
    var boneKey = aKey + '-' + bKey;
    var widths = BONE_WIDTHS[boneKey] || [5.5, 3.5];
    var wA = depthToWidth(pa.z, widths[0]);
    var wB = depthToWidth(pb.z, widths[1]);

    ctx.save();
    // PR-2 (v1.1): ghost water-glow. canvas shadowBlur + shadowColor gives the
    // "feGaussianBlur + feMerge" effect the directive specifies for SVG
    // filters, applied per-bone. We keep shadowBlur modest (8px) so the
    // silhouette stays lithe rather than puffy. The shadow is drawn under
    // the bone fill, so we stroke the bone path first with the shadow, then
    // re-fill without the shadow for a clean inner color.
    // PR-v2 (v1.2) — Phase 2/3 forensic audit found "ghost = avatar" on 8/16
    // poses. Root cause: the glow (shadowBlur=8, alpha=0.55) was too subtle at
    // the 160×180 session-setup preview size to read as "water". The ghost
    // looked like a solid cyan silhouette — not qualitatively different from
    // the avatar's dark-teal silhouette. Strengthened the water aesthetic:
    //   - shadowBlur 8 → 14 (wider, softer glow halo around each bone)
    //   - shadowColor alpha 0.55 → 0.70 (more luminous)
    //   - Added a second inner highlight stroke (1px, white-cyan, 0.35 alpha)
    //     along each bone to simulate water surface reflection. This is the
    //     visual cue that distinguishes "water ghost" from "solid cyan figure".
    // REASONING [PR-v2]: the directive (Part H #13) says the ghost should be
    // "more watery and lithe" — not just a color swap. The original PR-2
    // swapped the color (teal→cyan) but didn't add the surface-reflection
    // cue that makes water read as water. The inner highlight stroke is the
    // equivalent of the specular highlight on a water surface.
    if (state.ghostMode) {
      ctx.shadowColor = hexToRgba(COLOR_GHOST, 0.70);
      ctx.shadowBlur = 14;
    }
    // Draw tapered bone as a filled trapezoid path for volume
    var dx = pb.x - pa.x, dy = pb.y - pa.y;
    var len = Math.sqrt(dx*dx + dy*dy);
    if (len < 1) { ctx.restore(); return; }
    var nx = -dy / len, ny = dx / len; // perpendicular normal
    // Gradient along bone for depth cueing (near side = lighter)
    var grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
    var nearAlpha = alpha * (side === 'L' ? 0.92 : side === 'R' ? 0.78 : 0.88);
    var farAlpha  = alpha * (side === 'L' ? 0.70 : side === 'R' ? 0.58 : 0.72);
    grad.addColorStop(0, hexToRgba(baseColor, nearAlpha));
    grad.addColorStop(1, hexToRgba(baseColor, farAlpha));
    ctx.beginPath();
    ctx.moveTo(pa.x + nx * wA, pa.y + ny * wA);
    ctx.lineTo(pb.x + nx * wB, pb.y + ny * wB);
    ctx.lineTo(pb.x - nx * wB, pb.y - ny * wB);
    ctx.lineTo(pa.x - nx * wA, pa.y - ny * wA);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    // Subtle edge stroke for definition
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = hexToRgba(baseColor, alpha * 0.4);
    ctx.stroke();
    // PR-v2 (v1.2): ghost water-surface highlight — a thin bright-cyan stroke
    // along the near-edge of the bone (the side facing the light/camera) to
    // simulate specular reflection on a water surface. This is the visual cue
    // that distinguishes "water ghost" from "solid cyan silhouette". Without
    // it, the VLM reads the ghost as just a color-swapped avatar.
    if (state.ghostMode) {
      ctx.beginPath();
      ctx.moveTo(pa.x + nx * wA * 0.5, pa.y + ny * wA * 0.5);
      ctx.lineTo(pb.x + nx * wB * 0.5, pb.y + ny * wB * 0.5);
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = hexToRgba('#9FD9E8', Math.min(0.45, alpha * 0.55)); // light cyan
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawJoint(state, key) {
    var ctx = state.ctx;
    var skel = state.displaySkeleton;
    var p = skel[key];
    if (!p) return;
    var proj = project(state, p);
    var isKey = !!KEY_JOINTS[key];
    var isHead = key === 'head';
    var isNeck = key === 'neck';
    // avatar-ghost extension (Phase F): graceful androgynous skeleton — smaller,
    // subtler joints. Elbows/knees kept readable for coaching; wrists/ankles/feet
    // suppressed to a faint dot so the limb reads as a flowing taper rather than
    // a string of beads. Suppresses the "ball-joint" read while preserving L/R/depth.
    var isExtremity = (key==='leftWrist'||key==='rightWrist'||key==='leftAnkle'||key==='rightAnkle'||key==='leftFoot'||key==='rightFoot');
    var isHinge = (key==='leftElbow'||key==='rightElbow'||key==='leftKnee'||key==='rightKnee');
    // PR-1 (v1.1) — Phase 4 directive #15 "halo over the ball joint which are
    // too big make them half as big" + directive #33 "make the head a bit
    // longer". Key joints (shoulders, hips, hips-center) shrunk from 4.5→2.5
    // (~45% reduction). Non-key joints shrunk 3→2.2 (~27% — kept readable for
    // limb endpoints). Head made longer: baseRadius 8.5→9.5 plus a vertical
    // stretch factor of 1.18 so the skull reads as an oval, not a circle.
    // REASONING [PR-1]: a true 50% cut on non-key joints (3→1.5) makes elbows
    // and wrists vanish at far depth due to the 0.75–1.25 depth scaling
    // (1.5 * 0.75 = 1.13 px, below the Math.max(radius, 2) floor anyway, so
    // the floor dominates and the reduction is invisible). 2.2 stays above
    // the floor at near depth (2.2 * 1.25 = 2.75 px, visible).
    var baseRadius = isHead ? 8.5 : (isNeck ? 2.2 : (isKey ? 2.0 : (isHinge ? 1.7 : (isExtremity ? 1.1 : 1.5))));
    var depthT = Math.max(0, Math.min(1, (proj.z + 0.8) / 1.6));
    var radius = baseRadius * (0.75 + 0.5 * depthT);
    var alpha = depthToAlpha(proj.z);
    // PR-2 (v1.1): in ghostMode every joint is cyan-aqua (COLOR_GHOST) so the
    // silhouette is unified — no gold key joints, no dark-teal center. Key
    // joints keep their slight stroke ring for anatomical readability.
    var color = state.ghostMode ? COLOR_GHOST : (isKey ? COLOR_GOLD : COLOR_CENTER);
    var fillAlpha = state.ghostMode ? Math.min(1, alpha * (isKey ? 0.9 : 0.65)) : alpha;
    ctx.save();
    var floor = isExtremity ? 0.8 : 1.6;
    ctx.beginPath();
    if (isHead) {
      // PR-1 (v1.1): draw head as a vertical ellipse (1.18 stretch) so it
      // reads as a longer skull — directive #33 "make the head a bit longer".
      ctx.ellipse(proj.x, proj.y, Math.max(radius, 2), Math.max(radius * 1.18, 2.4), 0, 0, Math.PI * 2);
    } else {
      ctx.arc(proj.x, proj.y, Math.max(radius, floor), 0, Math.PI*2);
    }
    ctx.fillStyle = hexToRgba(color, fillAlpha);
    ctx.fill();
    if (isKey) {
      // PR-1 (v1.1): was 1.5 → 1.0. Slimmer ring stroke matches the smaller
      // key-joint ball. A thick stroke on a tiny circle just looks like a
      // filled donut and obscures the limb attachment point.
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = hexToRgba('#0F3B3A', 0.45);
      ctx.stroke();
    }
    if (isHead) {
      // Slim stroke ring
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = hexToRgba(COLOR_CENTER, fillAlpha * 0.6);
      ctx.stroke();
      // Tiny chin indicator — a small oval below head center
      var chinR = radius * 0.35;
      ctx.beginPath();
      ctx.ellipse(proj.x, proj.y + radius * 0.85, chinR * 0.6, chinR * 0.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(COLOR_CENTER, fillAlpha * 0.45);
      ctx.fill();
      // PR-1 (v1.1) — directive #33/#34: "add two divots to simulate eyes"
      // and "face eyes appear to always face to the screen even if you turn
      // the sprite". Compute eye positions in model space relative to head,
      // then project so they rotate WITH the figure instead of always facing
      // the screen. We use the head's local +Z (forward) and local +X (right)
      // vectors derived from the difference between head and neck in screen
      // space + the camera yaw. Two small dark divots placed slightly forward
      // (+Z) and to each side (±X) of the head center, then re-projected.
      // REASONING [PR-1]: the previous chin indicator was a single oval always
      // offset by +radius*0.85 in screen-down direction — it never rotated
      // with the figure, so a 3/4 turn or back view still showed a "chin"
      // implying the face was toward the camera. The new eye divots use the
      // head's actual 3D orientation in model space, so when the body yaw
      // rotates 90° to side profile, both eyes collapse to a single dot on
      // the visible side; at 180° (back view) they disappear entirely behind
      // the skull. This is the same trick used by PoseAnimator (TF.js) for
      // gaze direction.
      var headModel = skel.head;
      // PR-v2 (v1.2): eyeOffsetX 0.05→0.06 so the two eyes are distinguishable
      // at front view rather than reading as a single blob at small sizes.
      var eyeOffsetX = 0.06;   // lateral spread in model units
      var eyeOffsetY = 0.02;   // slightly above head center
      var eyeOffsetZ = 0.07;   // forward (toward camera at yaw=0) in model units
      // Apply the figure's own yaw/pitch via applyCamera so the eyes land on
      // the visible side of the head at every turn angle.
      var eyeL_model = { x: headModel.x - eyeOffsetX, y: headModel.y + eyeOffsetY, z: headModel.z + eyeOffsetZ };
      var eyeR_model = { x: headModel.x + eyeOffsetX, y: headModel.y + eyeOffsetY, z: headModel.z + eyeOffsetZ };
      var eyeL_proj = project(state, eyeL_model);
      var eyeR_proj = project(state, eyeR_model);
      // PR-v2 (v1.2) — Phase 2/3 forensic audit finding: "face always toward
      // camera" was flagged on 16/16 poses. Root cause: the original eye radius
      // (1.6 * (0.55 + 0.6 * depthT) ≈ 1.0-1.6px) was sub-pixel at the 160×180
      // session-setup preview size, so the VLM (and users) couldn't see the
      // eyes rotating with the figure. Increased to 2.8 * (0.6 + 0.7 * depthT)
      // ≈ 2.2-3.6px — clearly visible at 160×180 and still proportionate at
      // 430×932 camera size. Also widened the lateral spread (eyeOffsetX
      // 0.05→0.06) so the two eyes are distinguishable at front view rather
      // than reading as a single blob.
      var eyeR = Math.max(1.2, 2.8 * (0.6 + 0.7 * depthT));
      // Render only the eye whose projected z is in front of the skull center
      // (z greater than head z — i.e., closer to camera). Back-facing eye is
      // skipped so we don't get "X-ray" eyes through the skull.
      var headProjZ = proj.z;
      if (eyeL_proj.z >= headProjZ - 0.05) {
        ctx.beginPath();
        ctx.arc(eyeL_proj.x, eyeL_proj.y, eyeR, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba('#0F3B3A', Math.min(1, fillAlpha * 0.85));
        ctx.fill();
      }
      if (eyeR_proj.z >= headProjZ - 0.05) {
        ctx.beginPath();
        ctx.arc(eyeR_proj.x, eyeR_proj.y, eyeR, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba('#0F3B3A', Math.min(1, fillAlpha * 0.85));
        ctx.fill();
      }
      // PR-2 (v1.1): in ghost mode the head halo becomes a soft cyan glow
      // ring (no dashes) — matches the "water-like" aesthetic and avoids the
      // gold dashed ring which reads as "anatomy chart marker" rather than
      // "ethereal figure". Solid stroke + low alpha + larger radius gives a
      // halo that reads as light bleed, not a labeled callout.
      if (state.ghostMode) {
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius + 5.5, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(COLOR_GHOST, 0.30);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Inner secondary glow for water-like luminance falloff
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(COLOR_GHOST, 0.18);
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Gold halo ring (original avatar/skeleton behavior)
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius + 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(COLOR_GOLD, 0.22);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    ctx.restore();
  }

  // ----------------------------------------------------------
  // 6b. Accessory drawing (wall, floor, chair, etc.)
  // ----------------------------------------------------------
  // Categories: leaning -> wall on figure's right; seated/lean-seat -> seat plane;
  //             reclining/prone/supine -> floor/mat; kneeling -> floor mat;
  //             boudoir -> soft surface (bed/divan); dynamic/standing -> none.
  // PR-v2 (v1.2) — Phase 2/3 forensic audit found "object missing" on 7/16 poses.
  // Root cause: ACCESSORY_CATS didn't cover high-to-low, low-to-high, accessible,
  // eccentric, or couple categories. Many of these poses imply floor contact
  // (high-to-low, low-to-high are floor-to-standing trajectories), chair use
  // (accessible = wheelchair → chair per directive Part H #38), or floor work
  // (eccentric often uses floor). Added:
  //   - 'high-to-low' → 'floor' (descent poses end on floor)
  //   - 'low-to-high' → 'floor' (rise poses start on floor)
  //   - 'accessible'  → 'chair' (directive #38: chair not wheelchair)
  //   - 'eccentric'   → 'floor' (most eccentric poses are floor-based)
  //   - 'couple'      → 'floor' is NOT added here — couple poses are usually
  //     standing; if a specific couple pose needs a prop, it should set
  //     pose.category to a more specific value or we add a per-pose prop field
  //     in a future PR.
  // REASONING [PR-v2]: the VLM flagged "object missing" on poses like
  // 'lowhigh-floor-side-push-up-start' (cat=low-to-high, description mentions
  // floor) and 'highlow-full-recline-final-settle' (cat=high-to-low, description
  // mentions floor). The old map had no entry for these categories, so
  // drawAccessory() returned early and no floor was drawn — making the pose
  // look like it was floating in space.
  var ACCESSORY_CATS = {
    'leaning'     : 'wall',
    'lean-seat'   : 'chair',
    'seated'      : 'chair',
    'reclining'   : 'floor',
    'prone'       : 'floor',
    'supine'      : 'floor',
    'kneeling'    : 'floor',
    'boudoir'     : 'bed',
    // PR-v2 (v1.2) additions:
    'high-to-low' : 'floor',
    'low-to-high' : 'floor',
    'accessible'  : 'chair',
    'eccentric'   : 'floor'
  };

  function drawAccessory(state) {
    var cat = state.poseCategory || '';
    var type = ACCESSORY_CATS[cat];
    // PR-v3 (v1.3) — description-driven prop override. The validator found
    // 154 object_mismatch + 35 object_missing issues where the description
    // mentions a specific prop (chair, wall, fence, floor, bed, bench, table,
    // tube, couch, lounge) but the category-based accessory doesn't match.
    // Rather than requiring per-pose prop fields in poses-data.js (which
    // would need 745 data entries), we parse the pose description at render
    // time and override the accessory type when a specific object keyword is
    // found. This lifts all 745 poses at once.
    // REASONING [PR-v3]: "Description is king" (directive Part A.10 rule #1).
    // If the description says "fence", we should draw a fence-like prop even
    // if the category is "leaning" (which maps to "wall"). The fence is
    // drawn as a wall variant (horizontal rail instead of vertical) — a
    // future PR can add dedicated fence/bench/table renderers.
    var desc = state.poseDescription || '';
    if (desc) {
      // PR-v6 (v1.6) Iter A3: fence/railing is now a DISTINCT prop type.
      // A fence is a horizontal rail the figure leans ON (in front, at
      // waist height), not a vertical surface behind. Drawing it as 'wall'
      // placed it behind the figure — wrong for fence-lean poses.
      if (/\bfence\b|rail(ing)?\b/i.test(desc)) type = 'fence';
      else if (/\bchair\b|armchair|stool\b/i.test(desc)) type = 'chair';
      else if (/\bwall\b/i.test(desc)) type = 'wall';
      else if (/\bfloor\b|ground\b|mat\b/i.test(desc)) type = 'floor';
      else if (/\bbed\b|mattress\b|pillow\b/i.test(desc)) type = 'bed';
      else if (/\bcouch\b|sofa\b/i.test(desc)) type = 'bed';
      else if (/\bbench\b/i.test(desc)) type = 'chair';
      else if (/\btable\b/i.test(desc)) type = 'chair';
      else if (/\btube\b/i.test(desc)) type = 'chair';
      else if (/\blounge\b/i.test(desc)) type = 'bed';
    }
    if (!type) return;
    var ctx = state.ctx;
    var w = state.width, h = state.height;
    var fitScale = Math.min(w, h) * 0.40 * state.scale;
    ctx.save();

    if (type === 'wall') {
      // PR-v6 (v1.6) Iter A1 — wall positioning fix.
      //
      // OLD (v1.5): wall drawn at model-space x=+1.0 (figure's RIGHT side).
      // This was wrong for most leaning poses, where the description says
      // "lean back against wall" — the wall should be BEHIND the figure
      // (negative Z in model space), not to the side. VLM confirmed: "No
      // wall is visible in the skeleton row; the wall should be behind the
      // figure (supporting the upper back/shoulders)."
      //
      // NEW (v1.6): draw the wall as a vertical plane at z=-0.25 (behind the
      // figure). The wall spans the full width of the figure (x=-0.6..+0.6)
      // so it's visible at all yaw angles. At front view (yaw=0), the wall
      // appears as a faint vertical band behind the figure. At side view
      // (yaw=90), the wall recedes into perspective. At back view (yaw=180),
      // the wall is in front of the camera (behind the figure from the
      // viewer's perspective).
      //
      // The wall is drawn as a filled rectangle (not just a line) so it
      // reads as a solid surface. Hatching is added for texture.
      var wTopL = project(state, { x: -0.65, y:  1.7, z: -0.28 });
      var wTopR = project(state, { x:  0.65, y:  1.7, z: -0.28 });
      var wBotL = project(state, { x: -0.65, y: -0.20, z: -0.28 });
      var wBotR = project(state, { x:  0.65, y: -0.20, z: -0.28 });
      // Fill the wall as a semi-transparent rectangle
      ctx.beginPath();
      ctx.moveTo(wTopL.x, wTopL.y);
      ctx.lineTo(wTopR.x, wTopR.y);
      ctx.lineTo(wBotR.x, wBotR.y);
      ctx.lineTo(wBotL.x, wBotL.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(180,160,130,0.12)';
      ctx.fill();
      // Wall outline (left + right edges + top + bottom)
      ctx.strokeStyle = 'rgba(180,160,130,0.40)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      // Vertical hatching to suggest wall texture
      var hatchSteps = 5;
      for (var hi = 1; hi < hatchSteps; hi++) {
        var hfrac = hi / hatchSteps;
        var hx = -0.65 + 1.3 * hfrac;
        var hTop = project(state, { x: hx, y:  1.7, z: -0.28 });
        var hBot = project(state, { x: hx, y: -0.20, z: -0.28 });
        ctx.beginPath();
        ctx.moveTo(hTop.x, hTop.y);
        ctx.lineTo(hBot.x, hBot.y);
        ctx.strokeStyle = 'rgba(180,160,130,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    if (type === 'floor') {
      // PR-v6 (v1.6) Iter A2 — floor positioning fix for reclining poses.
      //
      // OLD (v1.5): for reclining poses, floor was placed at y=-0.95 (below
      // the T-pose ankle height). But a reclining figure (globalTilt≈90°)
      // has its body horizontal at y≈0, so the floor at y=-0.95 was far
      // below the body — not visually associated with it. VLM confirmed:
      // "No floor or mat is visible under the figure."
      //
      // NEW (v1.6): for reclining poses, place the floor at the body's
      // lowest point minus a small offset (so the floor is just under the
      // body, visually supporting it). For upright poses, keep the
      // shadow-relative behavior. Also increase the floor's alpha and size
      // so it's more visible.
      var sk = state.displaySkeleton;
      // PR-v6: widened threshold from 0.35 to 0.50 — the old threshold was
      // exactly at the boundary for globalTilt=82° poses (head-hips diff =
      // 0.35), causing isReclining to be false when it should be true.
      var isReclining = sk.head && sk.hips &&
        Math.abs(sk.head.y - sk.hips.y) < 0.50;
      var shadow = getShadowCenter(state);
      // PR-v6: for reclining poses, place the floor at the body's lowest
      // point PLUS a small downward offset. The old shadow.y - 0.08 placed
      // the floor at y≈-0.67 which projected to pixel y≈204 — too close to
      // the bottom edge of the 280px canvas (cell height ≈220px after
      // label/header). New: use shadow.y - 0.02 so the floor is right at
      // the body's lowest point, visually supporting it.
      var floorY = isReclining ? (shadow.y - 0.02) : (shadow.y - 0.04);
      // Wider floor for reclining poses (body is horizontal, needs wider surface)
      var floorHalfWidth = isReclining ? 0.85 : 0.55;
      var floorDepth = isReclining ? 0.5 : 0.3;
      var fLeft  = project(state, { x: -floorHalfWidth, y: floorY, z:  floorDepth });
      var fRight = project(state, { x:  floorHalfWidth, y: floorY, z:  floorDepth });
      var fBack  = project(state, { x:  0,              y: floorY, z: -floorDepth });
      // Draw a flat rectangle / mat shape
      ctx.beginPath();
      ctx.moveTo(fLeft.x,  fLeft.y  + 8);
      ctx.lineTo(fRight.x, fRight.y + 8);
      ctx.lineTo(fBack.x + 28, fBack.y + 2);
      ctx.lineTo(fBack.x - 28, fBack.y + 2);
      ctx.closePath();
      // PR-v6: increased alpha for better visibility (0.10 → 0.18 → 0.30 → 0.45)
      // VLM feedback: 0.30 still not visible on parchment. 0.45 with thicker
      // stroke should be clearly visible.
      ctx.fillStyle = 'rgba(80,160,140,0.45)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(60,140,120,0.75)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    if (type === 'chair') {
      // Horizontal seat line under hips + backrest hint
      var hipL   = project(state, { x: -0.18, y:  0.05, z: 0 });
      var hipR   = project(state, { x:  0.18, y:  0.05, z: 0 });
      var seatY  = Math.max(hipL.y, hipR.y) + 6;
      // Seat surface
      ctx.beginPath();
      ctx.moveTo(hipL.x - 14, seatY);
      ctx.lineTo(hipR.x + 14, seatY);
      ctx.strokeStyle = 'rgba(160,140,110,0.50)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      // Chair legs (two short vertical lines)
      ctx.beginPath();
      ctx.moveTo(hipL.x - 10, seatY);
      ctx.lineTo(hipL.x - 10, seatY + 22);
      ctx.moveTo(hipR.x + 10, seatY);
      ctx.lineTo(hipR.x + 10, seatY + 22);
      ctx.strokeStyle = 'rgba(160,140,110,0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Backrest (short vertical from hips upward)
      var backX  = (hipL.x + hipR.x) / 2;
      var hipMidY = Math.min(hipL.y, hipR.y);
      ctx.beginPath();
      ctx.moveTo(backX, seatY);
      ctx.lineTo(backX, hipMidY - 28);
      ctx.strokeStyle = 'rgba(160,140,110,0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (type === 'bed') {
      // Soft bed / divan: gentle curved surface behind/below the figure
      var shadow2 = getShadowCenter(state);
      var bedY    = shadow2.y - 0.04;
      var bL = project(state, { x: -0.7, y: bedY, z: 0 });
      var bR = project(state, { x:  0.7, y: bedY, z: 0 });
      var lineY = Math.max(bL.y, bR.y) + 10;
      // Bed surface as a wide rounded rect hint
      ctx.beginPath();
      ctx.roundRect(bL.x - 10, lineY, (bR.x - bL.x) + 20, 10, 5);
      ctx.fillStyle = 'rgba(200,160,180,0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(200,160,180,0.40)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Soft pillows hint at head end
      var head = project(state, { x: 0, y: 1.35, z: 0 });
      ctx.beginPath();
      ctx.ellipse(head.x, head.y - 12, 22, 9, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(220,180,200,0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(220,180,200,0.30)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (type === 'fence') {
      // PR-v6 (v1.6) Iter A3 — dedicated fence/railing prop.
      // A fence is a horizontal rail at waist height (y≈0.4 in model space)
      // that the figure leans ON (in front, positive Z). Drawn as:
      //   - A horizontal top rail (the surface the arms rest on)
      //   - 2-3 vertical posts supporting the rail
      // The fence is positioned in FRONT of the figure (z=+0.5) so the
      // figure's arms can rest on it.
      var fenceY = 0.35; // waist height in model space
      var fenceZ = 0.45;  // in front of figure
      var fLeft  = project(state, { x: -0.6, y: fenceY, z: fenceZ });
      var fRight = project(state, { x:  0.6, y: fenceY, z: fenceZ });
      // Top rail (horizontal line)
      ctx.beginPath();
      ctx.moveTo(fLeft.x, fLeft.y);
      ctx.lineTo(fRight.x, fRight.y);
      ctx.strokeStyle = 'rgba(140,110,70,0.65)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
      // Second rail (lower, for realism)
      var fLeft2  = project(state, { x: -0.6, y: fenceY - 0.12, z: fenceZ });
      var fRight2 = project(state, { x:  0.6, y: fenceY - 0.12, z: fenceZ });
      ctx.beginPath();
      ctx.moveTo(fLeft2.x, fLeft2.y);
      ctx.lineTo(fRight2.x, fRight2.y);
      ctx.strokeStyle = 'rgba(140,110,70,0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Vertical posts at left, center, right
      var postXs = [-0.6, 0, 0.6];
      for (var pi = 0; pi < postXs.length; pi++) {
        var pTop = project(state, { x: postXs[pi], y: fenceY, z: fenceZ });
        var pBot = project(state, { x: postXs[pi], y: -0.3, z: fenceZ });
        ctx.beginPath();
        ctx.moveTo(pTop.x, pTop.y);
        ctx.lineTo(pBot.x, pBot.y);
        ctx.strokeStyle = 'rgba(140,110,70,0.50)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawLineOfAction(state) {
    // Draw a subtle gold Bezier 'line of action' from head through spine/pelvis to weighted foot.
    // PR-2 (v1.1): suppressed in ghostMode — the gold dashed curve reads as
    // an anatomy-chart annotation and clashes with the cyan water aesthetic.
    // Bones + joints already convey the line of action implicitly.
    if (state.ghostMode) return;
    var skel = state.displaySkeleton;
    if (!skel.head || !skel.spine || !skel.hips) return;
    var pH = project(state, skel.head);
    var pS = project(state, skel.spine);
    var pHips = project(state, skel.hips);
    // Weighted foot: pick the lower ankle
    var ankleL = skel.leftAnkle ? project(state, skel.leftAnkle) : null;
    var ankleR = skel.rightAnkle ? project(state, skel.rightAnkle) : null;
    var pFoot = (!ankleL || (ankleR && ankleR.y > ankleL.y)) ? ankleR : ankleL;
    if (!pFoot) return;
    var ctx = state.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pH.x, pH.y);
    ctx.bezierCurveTo(pS.x, pS.y, pHips.x, pHips.y, pFoot.x, pFoot.y);
    ctx.strokeStyle = 'rgba(201,162,76,0.18)'; // gold, very subtle
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawTorsoVolume(state) {
    // Draw semi-transparent torso/ribcage ellipse for visual volume.
    // PR-2 (v1.1): suppressed in ghostMode — the dark-teal rgba(15,59,58,0.07)
    // fill conflicts with the cyan water palette and reads as a muddy patch
    // behind the luminous bones. The ghost silhouette is carried by bones +
    // halo alone, which matches the "lithe" directive.
    if (state.ghostMode) return;
    // PR-1 (v1.1) — directive #32: "the shape for the torso that goes from
    // hip to neck goes up too much and clips half the head it should stop
    // before the bottom of the head". The original `ry = abs(pSp.y - cy)*0.75`
    // could push the top of the ellipse above the head's bottom edge when:
    //   (a) a pose clamps the shoulders up (e.g. arms overhead rotating the
    //       shoulder girdle upward via spine forward-fold), or
    //   (b) the camera pitch tilts down so head and shoulders project close
    //       together in screen-y.
    // Fix: clamp the top of the ellipse (cy - ry) so it never crosses above
    //      headBottomY = headCenterY - headRadius*0.6 (i.e. roughly the chin).
    // If the clamp activates, we shrink ry rather than move cy, so the
    // ellipse stays anchored at the spine/shoulder midpoint (which is the
    // anatomical ribcage center) and only its top edge recedes.
    // REASONING [PR-1]: shrinking (not translating) preserves the visual
    // connection between ribcage and pelvis volume ellipses; translating
    // the whole torso down would create a gap between ribcage and pelvis
    // that looks like the figure has been severed at the waist.
    var skel = state.displaySkeleton;
    if (!skel.leftShoulder || !skel.rightShoulder || !skel.spine) return;
    var pLS = project(state, skel.leftShoulder);
    var pRS = project(state, skel.rightShoulder);
    var pSp = project(state, skel.spine);
    var cx = (pLS.x + pRS.x) / 2;
    var cy = (pLS.y + pRS.y) / 2 + (pSp.y - (pLS.y + pRS.y)/2) * 0.35;
    var rx = Math.abs(pRS.x - pLS.x) * 0.42;
    var ry = Math.abs(pSp.y - cy) * 0.75;
    if (rx < 4 || ry < 4) return;
    // PR-1 (v1.1): torso-vs-head intersection guard.
    if (skel.head) {
      var headProj = project(state, skel.head);
      // Head "longer" in v1.1 — see drawJoint. Use 9.5 * 1.18 worst-case.
      var headRadiusPx = 9.5 * (0.75 + 0.5 * 0.5) * 1.18; // ≈ 8.86 px
      var headBottomY = headProj.y + headRadiusPx * 0.6; // chin line
      var torsoTopY = cy - ry;
      if (torsoTopY < headBottomY) {
        // Clamp: keep cy, shrink ry so torsoTopY stops at headBottomY.
        // A small +2px breathing margin keeps the ellipse from kissing the
        // chin outline (which would still read as a visual clip even if
        // technically not overlapping).
        ry = Math.max(4, cy - headBottomY - 2);
        if (ry < 4) return; // torso fully behind head — skip drawing entirely
      }
    }
    var ctx = state.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.max(rx, 6), Math.max(ry, 8), 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15,59,58,0.07)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(15,59,58,0.12)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }

  function drawPelvisVolume(state) {
    // Draw a subtle pelvis ellipse.
    // PR-2 (v1.1): suppressed in ghostMode (same rationale as drawTorsoVolume).
    if (state.ghostMode) return;
    var skel = state.displaySkeleton;
    if (!skel.leftHip || !skel.rightHip || !skel.hips) return;
    var pLH = project(state, skel.leftHip);
    var pRH = project(state, skel.rightHip);
    var cx = (pLH.x + pRH.x) / 2;
    var cy = (pLH.y + pRH.y) / 2;
    var rx = Math.abs(pRH.x - pLH.x) * 0.55;
    var ry = rx * 0.5;
    if (rx < 3) return;
    var ctx = state.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.max(rx, 5), Math.max(ry, 3), 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15,59,58,0.06)';
    ctx.fill();
    ctx.restore();
  }

  function renderFrame(state) {
    if (!state.ctx) return;
    var ctx = state.ctx;
    ctx.setTransform(state.dpr||1,0,0,state.dpr||1,0,0);
    ctx.clearRect(0, 0, state.width, state.height);
    // avatar-ghost extension (Phase E): pose-aware framing shared with the
    // avatar + ghost so all three modes use identical scale/translate.
    var fit = computeFit(state); state.fit = fit;
    ctx.save(); ctx.translate(fit.tx, fit.ty); ctx.scale(fit.scale, fit.scale);
    // PR-2 (v1.1): ghost-mode cyan halo behind the figure (legacy — the ghost
    // now uses renderGhostOutlineInternal; this only fires if renderFrame is
    // called with ghostMode=true, which is non-default).
    if (state.ghostMode) {
      var fitScale = Math.min(state.width, state.height) * 0.40 * state.scale;
      var haloCx = state.width / 2;
      var haloCy = state.height / 2 + fitScale * 0.1;
      var haloRx = fitScale * 0.95;
      var haloRy = fitScale * 1.25;
      var haloGrad = ctx.createRadialGradient(haloCx, haloCy, 0, haloCx, haloCy, haloRy);
      haloGrad.addColorStop(0, hexToRgba(COLOR_GHOST, 0.22));
      haloGrad.addColorStop(0.5, hexToRgba(COLOR_GHOST, 0.08));
      haloGrad.addColorStop(1, hexToRgba(COLOR_GHOST, 0.0));
      ctx.beginPath();
      ctx.ellipse(haloCx, haloCy, Math.max(haloRx, 8), Math.max(haloRy, 8), 0, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();
    }
    drawAccessory(state);
    drawGroundShadow(state);
    drawLineOfAction(state);
    drawTorsoVolume(state);
    drawPelvisVolume(state);

    var bonesDepth = BONES.map(function(bone) {
      var a = state.displaySkeleton[bone[0]], b = state.displaySkeleton[bone[1]];
      var za = applyCamera(a, state.yaw, state.pitch).z;
      var zb = applyCamera(b, state.yaw, state.pitch).z;
      return { bone: bone, depth: (za+zb)/2 };
    });
    bonesDepth.sort(function(m,n) { return m.depth - n.depth; });
    for (var i = 0; i < bonesDepth.length; i++) {
      drawBone(state, bonesDepth[i].bone[0], bonesDepth[i].bone[1], bonesDepth[i].bone[2]);
    }

    var jointsDepth = Object.keys(state.displaySkeleton).map(function(k) {
      return { key: k, depth: applyCamera(state.displaySkeleton[k], state.yaw, state.pitch).z };
    });
    jointsDepth.sort(function(m,n) { return m.depth - n.depth; });
    for (var j = 0; j < jointsDepth.length; j++) {
      drawJoint(state, jointsDepth[j].key);
    }
    if (state.displaySkeleton.head && state.displaySkeleton.hips &&
        Math.abs(state.displaySkeleton.head.y - state.displaySkeleton.hips.y) < 0.50) {
      drawRecliningFloorOverlay(state);
    }
    ctx.restore();
  }

  // PR-v6 (v1.6) Iter A2 — Reclining floor overlay (post-figure).
  // Draws a wide semi-transparent floor band at the bottom of the canvas
  // AFTER the figure is drawn. This ensures the floor is visible even when
  // the horizontal body covers the pre-figure floor (drawn in drawAccessory).
  // The band is drawn in screen space (not projected) so it always appears
  // at the bottom of the canvas regardless of camera angle.
  function drawRecliningFloorOverlay(state) {
    var ctx = state.ctx;
    var w = state.width, h = state.height;
    var fitScale = Math.min(w, h) * 0.40 * state.scale;
    // Find the lowest projected point of the skeleton (screen Y)
    var skel = state.displaySkeleton;
    var maxScreenY = 0;
    for (var k in skel) {
      if (Object.prototype.hasOwnProperty.call(skel, k)) {
        var p = project(state, skel[k]);
        if (p.y > maxScreenY) maxScreenY = p.y;
      }
    }
    // Draw a floor band from maxScreenY to the bottom of the canvas
    var floorTop = maxScreenY - 4;
    var floorBottom = h;
    if (floorBottom - floorTop < 10) floorTop = floorBottom - 20; // minimum 20px band
    ctx.save();
    // Gradient: more opaque at top, fading toward bottom
    var grad = ctx.createLinearGradient(0, floorTop, 0, floorBottom);
    grad.addColorStop(0, 'rgba(80,160,140,0.40)');
    grad.addColorStop(0.5, 'rgba(80,160,140,0.25)');
    grad.addColorStop(1, 'rgba(80,160,140,0.10)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, floorTop, w, floorBottom - floorTop);
    // Top edge line for definition
    ctx.strokeStyle = 'rgba(60,140,120,0.60)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, floorTop);
    ctx.lineTo(w, floorTop);
    ctx.stroke();
    ctx.restore();
  }

  // ----------------------------------------------------------
  // 7. Animation loop
  // ----------------------------------------------------------
  function tick(state, timestamp) {
    if (state.destroyed) return;
    var needsMore = false;

    if (state.entryAnimActive) {
      if (!state.entryAnimStart) state.entryAnimStart = timestamp;
      var t = Math.min(1, (timestamp - state.entryAnimStart) / state.entryDurationMs);
      state.displaySkeleton = lerpSkeleton(T_POSE, state.currentPose, easeOutCubic(t));
      if (t >= 1) { state.entryAnimActive = false; state.displaySkeleton = cloneSkeleton(state.currentPose); }
      else needsMore = true;
    }

    if (state.introSweepActive) {
      if (!state.introSweepStart) state.introSweepStart = timestamp;
      var it = Math.min(1, (timestamp - state.introSweepStart) / state.introDurationMs);
      var ie = easeInOutQuad(it);
      state.yaw   = state.introFromYaw   + (state.introToYaw   - state.introFromYaw)   * ie;
      state.pitch = state.introFromPitch + (state.introToPitch - state.introFromPitch) * ie;
      if (it >= 1) { state.introSweepActive = false; state.yaw = state.introToYaw; state.pitch = state.introToPitch; }
      else needsMore = true;
    }

    if (state.autoRotate && !state.introSweepActive) {
      if (!state.autoRotateStart) { state.autoRotateStart = timestamp; state.autoRotateBaseYaw = state.yaw; }
      state.yaw = state.autoRotateBaseYaw + ((timestamp - state.autoRotateStart) / 8000) * 360;
      needsMore = true;
    }

    renderFrame(state);
    if (needsMore && !state.destroyed) {
      state.rafId = requestAnimationFrame(function(ts) { tick(state, ts); });
    } else { state.rafId = null; }
  }

  function ensureLoopRunning(state) {
    if (state.rafId === null && !state.destroyed) {
      state.rafId = requestAnimationFrame(function(ts) { tick(state, ts); });
    }
  }

  // ----------------------------------------------------------
  // 8. Drag-to-rotate
  // ----------------------------------------------------------
  function bindDragHandlers(state) {
    if (state.dragHandlersBound || !state.canvas) return;
    var canvas = state.canvas;
    function getPoint(evt) {
      if (evt.touches && evt.touches.length) return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
      return { x: evt.clientX, y: evt.clientY };
    }
    state._onPointerDown = function(evt) {
      state.dragging = true; state.autoRotate = false; state.autoRotateStart = null;
      var p = getPoint(evt); state.lastPointerX = p.x; state.lastPointerY = p.y;
    };
    state._onPointerMove = function(evt) {
      if (!state.dragging) return;
      var p = getPoint(evt);
      state.yaw   += (p.x - state.lastPointerX) * 0.5;
      state.pitch  = Math.max(-89, Math.min(89, state.pitch - (p.y - state.lastPointerY) * 0.4));
      state.lastPointerX = p.x; state.lastPointerY = p.y;
      renderFrame(state);
      evt.preventDefault && evt.preventDefault();
    };
    state._onPointerUp = function() { state.dragging = false; };
    canvas.addEventListener('mousedown',  state._onPointerDown);
    canvas.addEventListener('mousemove',  state._onPointerMove);
    window.addEventListener('mouseup',    state._onPointerUp);
    canvas.addEventListener('touchstart', state._onPointerDown, { passive: true });
    canvas.addEventListener('touchmove',  state._onPointerMove, { passive: false });
    window.addEventListener('touchend',   state._onPointerUp);
    state.dragHandlersBound = true;
  }

  function unbindDragHandlers(state) {
    if (!state.dragHandlersBound || !state.canvas) return;
    var c = state.canvas;
    c.removeEventListener('mousedown',  state._onPointerDown);
    c.removeEventListener('mousemove',  state._onPointerMove);
    window.removeEventListener('mouseup', state._onPointerUp);
    c.removeEventListener('touchstart', state._onPointerDown);
    c.removeEventListener('touchmove',  state._onPointerMove);
    window.removeEventListener('touchend', state._onPointerUp);
    state.dragHandlersBound = false;
  }

  // ----------------------------------------------------------
  // 9. CSS breathing style
  // ----------------------------------------------------------
  var STYLE_ID = 'pose-skeleton-3d-style';
  function ensureStyleInjected() {
    if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '@keyframes poseSkeleton3DBreathe{0%{transform:scale(1)}50%{transform:scale(1.018)}100%{transform:scale(1)}}' +
      // PR-3 (v1.1): directive #17 "only the skeleton sprites are animated
      // why not all?" — apply the breathing animation to BOTH the regular
      // skeleton canvas and the new ghost canvas so all three renderers
      // (avatar SVG via CSS in pose-animations.js, skeleton canvas, ghost
      // canvas) share a continuous idle motion. The selector lists both
      // class names; pose-skeleton-3d-canvas is the existing class, and
      // pose-ghost-canvas is the new class applied by renderGhostFrame.
      '.pose-skeleton-3d-canvas,.pose-ghost-canvas{animation:poseSkeleton3DBreathe 3.5s ease-in-out infinite;touch-action:none;}';
    document.head.appendChild(s);
  }

  // PR-1 (v1.1) — defensive polyfill for CanvasRenderingContext2D.roundRect.
  // Used by drawAccessory() when rendering the boudoir bed surface.
  // roundRect() is available in Chrome 99+, Safari 16+, Firefox 113+ — i.e.
  // all evergreen browsers since 2022 — but older iOS Safari (15.x and
  // earlier) still hits this code path. Without the polyfill, 161 boudoir /
  // bed-using poses would throw "ctx.roundRect is not a function" and the
  // entire renderFrame would abort, leaving the canvas blank. The polyfill
  // is a no-op on browsers that already implement roundRect natively.
  // REASONING [PR-1]: discovered during the 745-pose mass regression test
  // (scripts/smoke_test_skeleton.js TEST 5). The polyfill is conservative —
  // it only assigns if the prototype lacks the method, and the
  // implementation follows the WHATWG spec for the rounded-rect path.
  if (typeof CanvasRenderingContext2D !== 'undefined' &&
      typeof CanvasRenderingContext2D.prototype.roundRect !== 'function') {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      // r can be a number or an array of corner radii; normalize.
      var radii;
      if (typeof r === 'number') radii = [r, r, r, r];
      else if (Array.isArray(r)) {
        if (r.length === 1) radii = [r[0], r[0], r[0], r[0]];
        else if (r.length === 2) radii = [r[0], r[1], r[0], r[1]];
        else if (r.length === 3) radii = [r[0], r[1], r[2], r[1]];
        else radii = [r[0], r[1], r[2], r[3]];
      } else radii = [0, 0, 0, 0];
      // Clamp radii so they never exceed half the shorter side.
      var maxR = Math.min(w, h) / 2;
      radii = radii.map(function (rr) { return Math.max(0, Math.min(rr, maxR)); });
      this.beginPath();
      this.moveTo(x + radii[0], y);
      this.lineTo(x + w - radii[1], y);
      this.arcTo(x + w, y, x + w, y + radii[1], radii[1]);
      this.lineTo(x + w, y + h - radii[2]);
      this.arcTo(x + w, y + h, x + w - radii[2], y + h, radii[2]);
      this.lineTo(x + radii[3], y + h);
      this.arcTo(x, y + h, x, y + h - radii[3], radii[3]);
      this.lineTo(x, y + radii[0]);
      this.arcTo(x, y, x + radii[0], y, radii[0]);
      this.closePath();
      return this;
    };
  }

  // ----------------------------------------------------------
  // 10. Public API
  // ----------------------------------------------------------
  var PoseSkeleton3D = {
    init: function(canvas, width, height) {
      var state = createState();
      this._state = state;
      state.canvas = canvas;
      state.width  = width  || canvas.clientWidth  || 220;
      state.height = height || canvas.clientHeight || 280;
      var dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
      state.dpr = dpr;
      canvas.width  = state.width  * dpr;
      canvas.height = state.height * dpr;
      canvas.style.width  = state.width  + 'px';
      canvas.style.height = state.height + 'px';
      canvas.classList && canvas.classList.add('pose-skeleton-3d-canvas');
      var ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      state.ctx = ctx;
      ensureStyleInjected();
      bindDragHandlers(state);
      state.currentPose   = cloneSkeleton(T_POSE);
      state.displaySkeleton = cloneSkeleton(T_POSE);
      renderFrame(state);
      return this;
    },

    setPose: function(joints, options) {
      var state = this._state;
      if (!state) throw new Error('call init() first');
      options = options || {};
      var posed = buildPose(joints);
      state.currentPose = posed;
      if (options.category !== undefined) state.poseCategory = options.category;
      if (options.ghost !== undefined) state.ghostMode = !!options.ghost;
      // PR-v3 (v1.3): pass description for description-driven prop detection
      if (options.description !== undefined) state.poseDescription = options.description;
      if (options.animateEntry !== false) {
        state.entryAnimActive = true; state.entryAnimStart = null;
      } else {
        state.displaySkeleton = cloneSkeleton(posed);
      }
      if (options.introSweep) {
        state.introSweepActive = true; state.introSweepStart = null;
        state.introFromYaw = state.yaw; state.introFromPitch = state.pitch;
        state.introToYaw = state.yaw + 90; state.introToPitch = state.pitch + 15;
      }
      ensureLoopRunning(state);
      return this;
    },

    startAutoRotate: function() {
      var s = this._state; if (!s) return this;
      s.autoRotate = true; s.autoRotateStart = null;
      ensureLoopRunning(s); return this;
    },

    stopAutoRotate: function() {
      var s = this._state; if (!s) return this;
      s.autoRotate = false; s.autoRotateStart = null; return this;
    },

    setViewAngle: function(yaw, pitch) {
      var s = this._state; if (!s) return this;
      if (typeof yaw === 'string') {
        var p = VIEW_ANGLES[yaw];
        if (!p) throw new Error('Unknown preset: ' + yaw);
        s.yaw = p.yaw; s.pitch = p.pitch;
      } else { s.yaw = yaw||0; s.pitch = pitch||0; }
      renderFrame(s); return this;
    },

    render: function() {
      var s = this._state; if (!s) return this;
      renderFrame(s); return this;
    },

    destroy: function() {
      var s = this._state; if (!s) return this;
      s.destroyed = true;
      if (s.rafId !== null) { cancelAnimationFrame(s.rafId); s.rafId = null; }
      unbindDragHandlers(s);
      s.ctx = null; s.canvas = null; this._state = null; return this;
    },

    // PR-2 (v1.1) — Phase 1 architectural fix: one-shot ghost renderer.
    // Renders a single water-aesthetic ghost frame onto `canvas` for the
    // given `joints` (the pose.joints object from poses-data.js), without
    // taking over the canvas lifecycle or binding drag handlers.
    //
    // This is the bridge that lets camera.js's ghost overlay derive from
    // the SAME procedural rig as the avatar/skeleton (Part A.10 rule #4),
    // eliminating the architectural drift where _generateGhostKPs used a
    // bespoke stick-figure heuristic that didn't match PoseSkeleton3D.
    //
    // Caller is responsible for sizing the canvas (width/height) before
    // invoking. The helper uses the canvas's current 2D context, scales for
    // devicePixelRatio, and renders one frame. It does NOT start a RAF loop
    // — for animation, the caller should re-invoke this per frame OR use the
    // full init() lifecycle.
    renderGhostFrame: function(canvas, width, height, joints, options) {
      if (!canvas || !canvas.getContext) return;
      options = options || {};
      var w = width  || canvas.clientWidth  || 220;
      var h = height || canvas.clientHeight || 280;
      var dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
      // Only resize canvas backing store if dimensions actually changed,
      // to avoid clearing it unnecessarily when called from a RAF loop.
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width  = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width  = w + 'px';
        canvas.style.height = h + 'px';
      }
      // PR-3 (v1.1): tag canvas with pose-ghost-canvas so the breathing
      // animation selector matches and the ghost has continuous idle motion
      // (directive #17 — "all 3 renderers must animate").
      if (canvas.classList && typeof canvas.classList.add === 'function') {
        canvas.classList.add('pose-ghost-canvas');
      }
      ensureStyleInjected();
      var ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset transform then scale
      ctx.clearRect(0, 0, w, h);
      // Build a transient state — no canvas/DOM binding, no drag handlers.
      var state = createState();
      state.canvas = canvas;
      state.ctx = ctx;
      state.width = w;
      state.height = h;
      state.dpr = dpr;
      state.scale = options.scale || 1;
      state.ghostMode = true; // force ghost water aesthetic
      state.avatarMode = true; // use avatar silhouette renderer (not wireframe)
      state.yaw = (typeof options.yaw === 'number') ? options.yaw : 20;
      state.pitch = (typeof options.pitch === 'number') ? options.pitch : 5;
      state.currentPose = buildPose(joints || {});
      state.displaySkeleton = cloneSkeleton(state.currentPose);
      state.poseCategory = options.category || '';
      // PR-v3 (v1.3): pass description for description-driven prop detection
      state.poseDescription = options.description || '';
      // avatar-ghost extension (Phase G): ghost is now an OUTLINE-TARGET — low
      // fill + bright white-cyan outline + glow + faint line-of-action. This is
      // structurally distinct from the filled avatar (H7 fix) and gives the ghost
      // a unique role: a luminous target silhouette to match against the camera.
      renderGhostOutlineInternal(state);
      return this;
    },

    // PR-v4 (v1.4) — PROCEDURAL AVATAR RENDERER (Phase 2/3 architectural fix).
    //
    // This is the single biggest architectural win in the audit: it replaces
    // the 89 hand-crafted SVG glyphs in renderPoseFigureSVG (app.js) with a
    // renderer that derives from the SAME buildPose(joints) FK pipeline as
    // the skeleton and ghost. Per directive Part A.10 rule #4: "All three
    // renderers (avatar, skeleton, ghost) must derive from the same procedural
    // rig."
    //
    // The avatar is a FILLED SILHOUETTE (not a wireframe like the skeleton).
    // It draws filled limbs + torso between joints, with:
    //   - Dark teal fill (#0F3B3A) matching the Art Nouveau palette
    //   - Gold halo behind the head (matching the SVG glyph aesthetic)
    //   - Depth-cued alpha (nearer limbs more opaque)
    //   - Soft joint blending (no visible ball joints — smooth silhouette)
    //
    // This eliminates the entire glyph-drift class of bugs:
    //   - "face always toward camera" (avatar can now rotate)
    //   - "ghost = avatar" (avatar is now a distinct filled silhouette)
    //   - Per-pose glyph mismatch (avatar now uses the actual joint values)
    //   - 205 poses with no figure key now render correctly (no default glyph)
    //
    // The old renderPoseFigureSVG is kept as a fallback (try/catch) per
    // directive Part C Phase 1 step 7.
    renderAvatarFrame: function(canvas, width, height, joints, options) {
      if (!canvas || !canvas.getContext) return;
      options = options || {};
      var w = width  || canvas.clientWidth  || 220;
      var h = height || canvas.clientHeight || 280;
      var dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width  = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width  = w + 'px';
        canvas.style.height = h + 'px';
      }
      if (canvas.classList && typeof canvas.classList.add === 'function') {
        canvas.classList.add('pose-avatar-canvas');
      }
      ensureStyleInjected();
      var ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var state = createState();
      state.canvas = canvas;
      state.ctx = ctx;
      state.width = w;
      state.height = h;
      state.dpr = dpr;
      state.scale = options.scale || 1;
      state.ghostMode = false; // avatar is NOT ghost mode
      state.avatarMode = true; // new flag for avatar silhouette rendering
      state.yaw = (typeof options.yaw === 'number') ? options.yaw : 0;
      state.pitch = (typeof options.pitch === 'number') ? options.pitch : 0;
      state.currentPose = buildPose(joints || {});
      state.displaySkeleton = cloneSkeleton(state.currentPose);
      state.poseCategory = options.category || '';
      state.poseDescription = options.description || '';
      // avatar-ghost extension (R2): camera-avatar mode lowers the fill alpha so
      // the filled silhouette is translucent enough to overlay on live video
      // (default 0.85 is opaque and would occlude the user). Null = default.
      state.avatarAlpha = (typeof options.alpha === 'number') ? options.alpha : null;
      renderAvatarFrameInternal(state);
      return this;
    },

    _internals: { T_POSE: T_POSE, BONES: BONES, VIEW_ANGLES: VIEW_ANGLES, buildPose: buildPose, renderFrame: renderFrame, renderAvatarFrameInternal: null, createState: createState, computeFit: null }
  };

  // ===== avatar-ghost extension (Phase E/F/G): pose-aware framing + hybrid
  // androgynous avatar + ghost outline-target. Replaces the fixed cx=w/2,cy=h/2
  // centering (H5), the hourglass torso (H4), the per-bone endpoint circles (H1),
  // and the ghost=avatar recolor (H7). All three renderers share computeFit() so
  // framing is identical across modes (acceptance criterion #3). Pose semantics
  // (buildPose, joints, yaw/pitch) are UNCHANGED. =====

  // computeFit: derive {scale, tx, ty} that fits the figure's visual bbox
  // (joints + head halo + padding) into the canvas, respecting a ground anchor
  // for standing poses. Applied via ctx transform so project() stays unchanged
  // (measurements/skeleton joints remain comparable across modes).
  function computeFit(state) {
    var skel = state.displaySkeleton; if (!skel) return { scale: 1, tx: 0, ty: 0 };
    var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity, n=0, footY=-Infinity;
    for (var k in skel) { if(!Object.prototype.hasOwnProperty.call(skel,k)) continue;
      var p = project(state, skel[k]); n++;
      if(p.x<minX)minX=p.x; if(p.x>maxX)maxX=p.x; if(p.y<minY)minY=p.y; if(p.y>maxY)maxY=p.y;
      if (k==='leftAnkle'||k==='rightAnkle'||k==='leftFoot'||k==='rightFoot') { if(p.y>footY)footY=p.y; }
    }
    if (!n) return { scale: 1, tx: 0, ty: 0 };
    // 2-pass fit: the silhouette extent (limb half-widths, joint blends, halo)
    // scales with fit.scale, so the reservation must too. Pass 1 estimates s
    // with pad-only; pass 2 reserves (limbHalf*s0) for sides and (haloR) for top.
    var haloR = Math.min(22, Math.min(state.width, state.height) * 0.13);
    var pad = Math.max(5, Math.min(state.width, state.height) * 0.05);
    var limbHalf = 8; // for scale calculation (keeps figure size reasonable)
    var clampHalf = 12; // for anti-clip clamp (covers max joint-blend radius)
    var bw = maxX - minX, bh = maxY - minY;
    if (bw < 1 || bh < 1) return { scale: 1, tx: 0, ty: 0 };
    var s0 = Math.min((state.width - 2*pad) / bw, (state.height - 2*pad) / bh);
    // Use clampHalf (not limbHalf) for the reservation so the scale accounts for
    // the full clamp margin — prevents the clamp from fighting itself on tight fits.
    var limbMarg = clampHalf * s0;
    var footMarg = clampHalf * s0;
    var topMarg = haloR + pad, sideMarg = limbMarg + pad, botMarg = footMarg + pad;
    var availW = state.width - 2*sideMarg, availH = state.height - topMarg - botMarg;
    var s = Math.min(availW / bw, availH / bh);
    s = Math.max(0.40, Math.min(2.6, s));
    // recompute limb margin with the final s (use clampHalf for consistency)
    limbMarg = clampHalf * s; footMarg = clampHalf * s;
    sideMarg = limbMarg + pad; botMarg = footMarg + pad;
    availW = state.width - 2*sideMarg; availH = state.height - topMarg - botMarg;
    var cx = (minX+maxX)/2, cy = (minY+maxY)/2;
    var tx = state.width/2 - s*cx;
    var ty = topMarg + availH/2 - s*cy;
    // Detect reclining: body is more horizontal than vertical (head and hips at
    // similar height in model space) OR category is 'reclining'. VLM-found issue:
    // reclining poses were bbox-centered, leaving excessive empty space at the
    // top and floating above the floor band. Fix: place the figure's lowest
    // rendered point near the bottom of the canvas (on the floor).
    var isReclining = false;
    if (state.poseCategory === 'reclining') isReclining = true;
    else if (skel.head && skel.hips) {
      // globalTilt rotates the body in the Y-Z plane (depth), so check both
      // X-Y (side-lying) and Y-Z (prone/supine) orientations.
      var dyh = Math.abs(skel.head.y - skel.hips.y);
      var dxh = Math.abs(skel.head.x - skel.hips.x);
      var dzh = Math.abs(skel.head.z - skel.hips.z);
      if (dxh > dyh * 1.0 || dzh > dyh * 0.9) isReclining = true;
    }
    if (isReclining) {
      // Reclining poses: the rendered figure extends ~30px below the lowest joint
      // (ground shadow + reclining floor overlay, both screen-space). Place the
      // estimated rendered bottom at ~94% canvas height so the figure sits ON the
      // floor band rather than floating above it.
      var recliningExt = 30;
      var targetRenderedBottom = state.height * 0.94;
      var currentRenderedBottom = s*maxY + ty + recliningExt;
      var dy2 = targetRenderedBottom - currentRenderedBottom;
      ty += dy2;
    } else if (footY > -Infinity && skel.hips && footY > project(state, skel.hips).y + 6) {
      // semantic ground anchor: standing poses (feet well below hips) sit the
      // lowest support near ~84% canvas height for a grounded feel.
      var targetFootScreen = state.height * 0.84;
      var dy = targetFootScreen - (s*footY + ty);
      ty += Math.max(-state.height*0.08, Math.min(state.height*0.08, dy));
    } else {
      // default-low fallback: for compact poses (crouching, kneeling, seated
      // where feet aren't below hips) the bbox-centered figure floats. Nudge
      // it down so the lowest point sits near ~88% canvas height.
      var targetLow = state.height * 0.88;
      var dy3 = targetLow - (s*maxY + ty + footMarg);
      if (dy3 > 0) ty += Math.min(dy3, state.height * 0.12);
    }
    // Clamp so the fitted silhouette stays in canvas. Uses clampHalf for both
    // the reservation (scale calc) and the clamp, so they agree — no rescale
    // fallback needed.
    var clampMarg = clampHalf * s;
    var leftEdge = s*minX + tx - clampMarg, rightEdge = s*maxX + tx + clampMarg;
    var topEdge = s*minY + ty - haloR, botEdge = s*maxY + ty + clampMarg;
    if (leftEdge < pad) tx += (pad - leftEdge);
    if (topEdge < pad) ty += (pad - topEdge);
    if (rightEdge > state.width - pad) tx -= (rightEdge - (state.width - pad));
    if (botEdge > state.height - pad) ty -= (botEdge - (state.height - pad));
    return { scale: s, tx: tx, ty: ty };
  }

  // drawRibbonTorso: androgynous ribcage + pelvis volumes + STRUCTURAL waist
  // ribbon (waistW = 0.5*(ribW+pelW)*0.76, NOT hipW*0.65). Widths from rig spans
  // × camera, no fixed floors. (H3 + H4 fix.)
  function drawRibbonTorso(state, opts) {
    opts = opts || {};
    var ctx = state.ctx, skel = state.displaySkeleton;
    var lSh=skel.leftShoulder,rSh=skel.rightShoulder,spine=skel.spine,hips=skel.hips,lHip=skel.leftHip,rHip=skel.rightHip;
    if(!lSh||!rSh||!spine||!hips||!lHip||!rHip) return;
    var pLSh=project(state,lSh),pRSh=project(state,rSh),pSp=project(state,spine),pHi=project(state,hips),pLH=project(state,lHip),pRH=project(state,rHip);
    var ribSpan=Math.abs(pRSh.x-pLSh.x), pelSpan=Math.abs(pRH.x-pLH.x);
    var ribW=Math.max(ribSpan*0.60, 5);
    var pelW=Math.max(pelSpan*0.62, 5.5);
    // androgynous ratio clamp: keep ribcage:pelvis in [0.92, 1.08] so neither
    // "broad shoulders" nor "exaggerated hips" dominates (H4 — directive: "Avoid
    // exaggerated hips as the default neutral body").
    if (pelW > ribW * 1.08) pelW = ribW * 1.08;
    else if (ribW > pelW * 1.08) ribW = pelW * 1.08;
    var waistW=Math.max(0.5*(ribW+pelW)*0.76, 4);
    var ribCy=(pLSh.y+pRSh.y)/2*0.55+pSp.y*0.45;
    var ribH=Math.max(Math.abs(pSp.y-ribCy)*0.95, 7);
    var pelCy=pHi.y;
    var pelH=Math.max(pelW*0.52, 4.5);
    var alpha=depthToAlpha((pSp.z+pHi.z)/2)*(opts.alpha==null?0.88:opts.alpha);
    var color=opts.color || (state.ghostMode ? COLOR_GHOST : '#0F3B3A');
    ctx.beginPath(); ctx.ellipse((pLSh.x+pRSh.x)/2, ribCy, ribW, ribH, 0, 0, Math.PI*2);
    ctx.fillStyle = hexToRgba(color, alpha*0.92); ctx.fill();
    if (opts.outline) { ctx.lineWidth=opts.outline; ctx.strokeStyle=opts.outlineColor||'#FFFFFF'; ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse((pLH.x+pRH.x)/2, pelCy, pelW, pelH, 0, 0, Math.PI*2);
    ctx.fillStyle = hexToRgba(color, alpha*0.92); ctx.fill();
    if (opts.outline) { ctx.lineWidth=opts.outline; ctx.strokeStyle=opts.outlineColor||'#FFFFFF'; ctx.stroke(); }
    var ribBotY=ribCy+ribH*0.72, pelTopY=pelCy-pelH*0.72;
    var ccx=(pLSh.x+pRSh.x)/2, pcx=(pLH.x+pRH.x)/2;
    ctx.beginPath();
    ctx.moveTo(ccx-waistW, ribBotY);
    ctx.quadraticCurveTo(pcx-waistW*0.92, (ribBotY+pelTopY)/2, pcx-waistW*0.96, pelTopY);
    ctx.lineTo(pcx+waistW*0.96, pelTopY);
    ctx.quadraticCurveTo(ccx+waistW*0.92, (ribBotY+pelTopY)/2, ccx+waistW, ribBotY);
    ctx.closePath();
    ctx.fillStyle = hexToRgba(color, alpha*0.9); ctx.fill();
    if (opts.outline) { ctx.lineWidth=opts.outline; ctx.strokeStyle=opts.outlineColor||'#FFFFFF'; ctx.stroke(); }
    // subtle shoulder slope (not a chunky clavicle bar)
    ctx.beginPath(); ctx.moveTo(pLSh.x, pLSh.y); ctx.quadraticCurveTo((pLSh.x+pRSh.x)/2, pLSh.y-2.5, pRSh.x, pRSh.y);
    ctx.lineWidth = Math.max(ribW*0.5, 2.5); ctx.lineCap='round';
    ctx.strokeStyle = hexToRgba(color, alpha*0.85); ctx.stroke();
  }

  // drawBezierLimbs: continuous Bézier contour chains for arms + legs with
  // tangent continuity at elbows/knees. NO per-bone endpoint circles (H1 fix).
  function drawBezierLimbs(state, opts) {
    opts = opts || {};
    var ctx = state.ctx, skel = state.displaySkeleton;
    var color = opts.color || (state.ghostMode ? COLOR_GHOST : '#0F3B3A');
    var alphaBase = opts.alpha==null ? (state.ghostMode ? 0.5 : 0.85) : opts.alpha;
    var chains = [['leftShoulder','leftElbow','leftWrist'],['rightShoulder','rightElbow','rightWrist'],['leftHip','leftKnee','leftAnkle'],['rightHip','rightKnee','rightAnkle']];
    for (var ci=0; ci<chains.length; ci++) {
      var ch = chains[ci];
      var p0=project(state,skel[ch[0]]),p1=project(state,skel[ch[1]]),p2=project(state,skel[ch[2]]);
      if(!p0||!p1||!p2) continue;
      var bw1=BONE_WIDTHS[ch[0]+'-'+ch[1]]||[6,4], bw2=BONE_WIDTHS[ch[1]+'-'+ch[2]]||[4,2.5];
      var wA=depthToWidth(p0.z,bw1[0])*1.10, wM=depthToWidth(p1.z,bw1[1])*0.82, wB=depthToWidth(p2.z,bw2[1])*0.76;
      var t1x=p1.x-p0.x,t1y=p1.y-p0.y,t2x=p2.x-p1.x,t2y=p2.y-p1.y;
      var l1=Math.sqrt(t1x*t1x+t1y*t1y)||1, l2=Math.sqrt(t2x*t2x+t2y*t2y)||1;
      t1x/=l1;t1y/=l1;t2x/=l2;t2y/=l2;
      var mtx=(t1x+t2x)/2, mty=(t1y+t2y)/2, mtl=Math.sqrt(mtx*mtx+mty*mty)||1; mtx/=mtl;mty/=mtl;
      var nx=-mty, ny=mtx;
      var alpha=depthToAlpha((p0.z+p1.z+p2.z)/3)*alphaBase;
      ctx.beginPath();
      ctx.moveTo(p0.x+nx*wA, p0.y+ny*wA);
      ctx.quadraticCurveTo(p1.x+nx*wM, p1.y+ny*wM, p2.x+nx*wB, p2.y+ny*wB);
      ctx.lineTo(p2.x-nx*wB, p2.y-ny*wB);
      ctx.quadraticCurveTo(p1.x-nx*wM, p1.y-ny*wM, p0.x-nx*wA, p0.y-ny*wA);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(color, alpha); ctx.fill();
      if (opts.outline) { ctx.lineWidth=opts.outline; ctx.strokeStyle=opts.outlineColor||'#FFFFFF'; ctx.stroke(); }
    }
    var stubs=[['leftAnkle','leftFoot'],['rightAnkle','rightFoot']];
    for (var si=0; si<stubs.length; si++) {
      var a=stubs[si][0], b=stubs[si][1];
      var pa=project(state,skel[a]), pb=project(state,skel[b]); if(!pa||!pb) continue;
      var bw=BONE_WIDTHS[a+'-'+b]||[3,2];
      var wA=depthToWidth(pa.z,bw[0])*0.9, wB=depthToWidth(pb.z,bw[1])*0.7;
      var dx=pb.x-pa.x, dy=pb.y-pa.y, len=Math.sqrt(dx*dx+dy*dy); if(len<1) continue;
      var nx=-dy/len, ny=dx/len;
      var alpha=depthToAlpha((pa.z+pb.z)/2)*alphaBase;
      ctx.beginPath();
      ctx.moveTo(pa.x+nx*wA,pa.y+ny*wA); ctx.lineTo(pb.x+nx*wB,pb.y+ny*wB);
      ctx.lineTo(pb.x-nx*wB,pb.y-ny*wB); ctx.lineTo(pa.x-nx*wA,pa.y-ny*wA); ctx.closePath();
      ctx.fillStyle=hexToRgba(color,alpha); ctx.fill();
      if (opts.outline) { ctx.lineWidth=opts.outline; ctx.strokeStyle=opts.outlineColor||'#FFFFFF'; ctx.stroke(); }
    }
  }

  // drawJointBlends: each shared joint drawn ONCE as a bisector-aligned ellipse
  // (H1 fix). Sized to max adjacent proximal width × 0.92.
  function drawJointBlends(state, opts) {
    opts = opts || {};
    var ctx = state.ctx, skel = state.displaySkeleton;
    var color = opts.color || (state.ghostMode ? COLOR_GHOST : '#0F3B3A');
    var alphaBase = opts.alpha==null ? (state.ghostMode ? 0.5 : 0.85) : opts.alpha;
    var JL = {
      leftShoulder:[['neck','leftShoulder'],['leftShoulder','leftElbow']],
      rightShoulder:[['neck','rightShoulder'],['rightShoulder','rightElbow']],
      leftHip:[['hips','leftHip'],['leftHip','leftKnee']],
      rightHip:[['hips','rightHip'],['rightHip','rightKnee']]
    };
    for (var j in JL) {
      var jp = project(state, skel[j]); if(!jp) continue;
      var limbs = JL[j];
      var bx=0, by=0;
      for (var i=0; i<limbs.length; i++) {
        var a=project(state,skel[limbs[i][0]]), b=project(state,skel[limbs[i][1]]);
        var dx=b.x-a.x, dy=b.y-a.y, len=Math.sqrt(dx*dx+dy*dy)||1;
        bx+=dx/len; by+=dy/len;
      }
      var blen=Math.sqrt(bx*bx+by*by)||1; bx/=blen; by/=blen;
      var ang=Math.atan2(by,bx);
      var maxW=3;
      for (var i2=0; i2<limbs.length; i2++) {
        var bw=BONE_WIDTHS[limbs[i2][0]+'-'+limbs[i2][1]]||[5.5,3.5];
        var w=depthToWidth(jp.z, (limbs[i2][1]===j)?bw[1]:bw[0]);
        if(w>maxW) maxW=w;
      }
      var r=maxW*0.92;
      ctx.save(); ctx.translate(jp.x,jp.y); ctx.rotate(ang);
      ctx.beginPath(); ctx.ellipse(0,0,Math.max(r,2),Math.max(r*0.68,1.5),0,0,Math.PI*2);
      ctx.fillStyle=hexToRgba(color, depthToAlpha(jp.z)*alphaBase); ctx.fill();
      if (opts.outline) { ctx.lineWidth=opts.outline; ctx.strokeStyle=opts.outlineColor||'#FFFFFF'; ctx.stroke(); }
      ctx.restore();
    }
  }

  // drawNeckAvatar: slender tapered neck (Mucha-elongated, androgynous)
  function drawNeckAvatar(state, opts) {
    opts = opts || {};
    var ctx=state.ctx, skel=state.displaySkeleton;
    if(!skel.neck||!skel.head) return;
    var pN=project(state,skel.neck), pH=project(state,skel.head);
    var w=3.2*(state.scale||1);
    var color=opts.color||(state.ghostMode?COLOR_GHOST:'#0F3B3A');
    var alpha=depthToAlpha(pN.z)*(opts.alpha==null?(state.ghostMode?0.5:0.85):opts.alpha);
    ctx.beginPath();
    ctx.moveTo(pN.x-w,pN.y); ctx.lineTo(pH.x-w*0.7,pH.y);
    ctx.lineTo(pH.x+w*0.7,pH.y); ctx.lineTo(pN.x+w,pN.y); ctx.closePath();
    ctx.fillStyle=hexToRgba(color,alpha); ctx.fill();
    if (opts.outline) { ctx.lineWidth=opts.outline; ctx.strokeStyle=opts.outlineColor||'#FFFFFF'; ctx.stroke(); }
  }

  // drawHeadAndrogynous: oval head + gold halo, NO gold eyes (androgynous — no
  // gendered face decoration, directive: "Avoid makeup or eyelashes").
  function drawHeadAndrogynous(state, opts) {
    opts = opts || {};
    var ctx=state.ctx, skel=state.displaySkeleton;
    if(!skel.head) return;
    var p=project(state,skel.head);
    var depthT=Math.max(0,Math.min(1,(p.z+0.8)/1.6));
    var r=9.5*(0.75+0.5*depthT);
    var color=opts.color||(state.ghostMode?COLOR_GHOST:'#0F3B3A');
    var alpha=depthToAlpha(p.z)*(opts.alpha==null?(state.ghostMode?0.55:0.88):opts.alpha);
    ctx.beginPath();
    ctx.ellipse(p.x,p.y,Math.max(r*0.86,3),Math.max(r*1.12,3.6),0,0,Math.PI*2);
    ctx.fillStyle=hexToRgba(color,alpha); ctx.fill();
    if (opts.outline) { ctx.lineWidth=opts.outline; ctx.strokeStyle=opts.outlineColor||'#FFFFFF'; ctx.stroke(); }
  }

  // renderGhostOutlineInternal: Phase G option 1 — ghost as OUTLINE-TARGET.
  // Low-alpha fill + bright white-cyan outline + soft glow + faint line-of-action.
  // Structurally distinct from the filled avatar (H7 fix) and WCAG 1.4.11-luminant
  // against bright camera backgrounds.
  function renderGhostOutlineInternal(state) {
    if(!state.ctx) return;
    var ctx=state.ctx;
    ctx.setTransform(state.dpr||1,0,0,state.dpr||1,0,0);
    ctx.clearRect(0,0,state.width,state.height);
    var skel=state.displaySkeleton;
    var fit=computeFit(state); state.fit=fit;
    // soft cyan glow behind figure
    ctx.save(); ctx.translate(fit.tx,fit.ty); ctx.scale(fit.scale,fit.scale);
    var allP=[]; for(var k in skel){ if(Object.prototype.hasOwnProperty.call(skel,k)) allP.push(project(state,skel[k])); }
    if(allP.length){
      var mnx=Infinity,mny=Infinity,mxx=-Infinity,mxy=-Infinity;
      for(var i=0;i<allP.length;i++){var pp=allP[i]; if(pp.x<mnx)mnx=pp.x; if(pp.x>mxx)mxx=pp.x; if(pp.y<mny)mny=pp.y; if(pp.y>mxy)mxy=pp.y;}
      var ccx=(mnx+mxx)/2, ccy=(mny+mxy)/2, cr=Math.max(mxx-mnx,mxy-mny)/2+14;
      var gg=ctx.createRadialGradient(ccx,ccy,2,ccx,ccy,cr);
      gg.addColorStop(0,hexToRgba(COLOR_GHOST,0.18)); gg.addColorStop(0.6,hexToRgba(COLOR_GHOST,0.06)); gg.addColorStop(1,hexToRgba(COLOR_GHOST,0));
      ctx.fillStyle=gg; ctx.fillRect(ccx-cr,ccy-cr,cr*2,cr*2);
    }
    ctx.restore();
    // figure: low fill + bright outline (the outline is the distinctive cue)
    ctx.save(); ctx.translate(fit.tx,fit.ty); ctx.scale(fit.scale,fit.scale);
    var o={color:COLOR_GHOST, alpha:0.16, outline:2.0, outlineColor:'rgba(255,255,255,0.92)'};
    drawRibbonTorso(state,o);
    drawBezierLimbs(state,o);
    drawJointBlends(state,o);
    drawNeckAvatar(state,o);
    drawHeadAndrogynous(state,o);
    // faint line of action (spine flow) — the ghost's "inner center line"
    if(skel.spine&&skel.head&&skel.hips){
      var pSp=project(state,skel.spine),pH=project(state,skel.head),pHi=project(state,skel.hips);
      ctx.beginPath(); ctx.moveTo(pH.x,pH.y); ctx.quadraticCurveTo(pSp.x,pSp.y,pHi.x,pHi.y);
      ctx.lineWidth=1; ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.setLineDash([3,4]); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  }

  // PR-v4 (v1.4): Procedural avatar silhouette renderer.
  // Draws a filled silhouette (not wireframe) from the posed skeleton.
  // This is the avatar equivalent of renderFrame — it uses the same project()
  // and buildPose() pipeline but renders filled limbs instead of bone capsules.
  function renderAvatarFrameInternal(state) {
    if (!state.ctx) return;
    var ctx = state.ctx;
    ctx.setTransform(state.dpr||1,0,0,state.dpr||1,0,0);
    ctx.clearRect(0, 0, state.width, state.height);
    var skel = state.displaySkeleton;
    var fit = computeFit(state); state.fit = fit;
    // gold halo in SCREEN space (fixed fraction of canvas — matches computeFit's
    // haloR reservation exactly, so framing is consistent at every canvas size).
    if (skel.head) {
      var hp = project(state, skel.head);
      var hsx = fit.scale * hp.x + fit.tx, hsy = fit.scale * hp.y + fit.ty;
      var haloR = Math.min(22, Math.min(state.width, state.height) * 0.13);
      var hg = ctx.createRadialGradient(hsx, hsy, 2, hsx, hsy, haloR);
      hg.addColorStop(0, hexToRgba(COLOR_GOLD, 0.16)); hg.addColorStop(1, hexToRgba(COLOR_GOLD, 0));
      ctx.fillStyle = hg; ctx.fillRect(hsx-haloR, hsy-haloR, haloR*2, haloR*2);
      ctx.beginPath(); ctx.arc(hsx, hsy, haloR*0.82, 0, Math.PI*2);
      ctx.strokeStyle = hexToRgba(COLOR_GOLD, 0.18); ctx.lineWidth = 1; ctx.setLineDash([2,4]); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.save(); ctx.translate(fit.tx, fit.ty); ctx.scale(fit.scale, fit.scale);
    drawAccessory(state);
    drawGroundShadow(state);
    // hybrid androgynous figure: structural ribbon torso + Bezier limb chains +
    // joint-blend-once + androgynous head (no gold eyes). No hourglass, no
    // overlapping endpoint circles, no min-width floors. cameraAlpha (if set)
    // lowers the fill for camera-overlay use (R2).
    var aOpts = (state.avatarAlpha != null) ? { alpha: state.avatarAlpha } : {};
    drawRibbonTorso(state, aOpts);
    drawBezierLimbs(state, aOpts);
    drawJointBlends(state, aOpts);
    drawNeckAvatar(state, aOpts);
    drawHeadAndrogynous(state, aOpts);
    ctx.restore();
    // Reclining floor overlay (framed)
    if (skel.head && skel.hips && Math.abs(skel.head.y - skel.hips.y) < 0.50) {
      ctx.save(); ctx.translate(fit.tx, fit.ty); ctx.scale(fit.scale, fit.scale);
      drawRecliningFloorOverlay(state);
      ctx.restore();
    }
  }

  // Expose the internal avatar renderer for testing
  PoseSkeleton3D._internals.renderAvatarFrameInternal = renderAvatarFrameInternal;
  PoseSkeleton3D._internals.renderGhostOutlineInternal = renderGhostOutlineInternal;
  PoseSkeleton3D._internals.computeFit = computeFit;

  global.PoseSkeleton3D = PoseSkeleton3D;

})(typeof window !== 'undefined' ? window : this);
