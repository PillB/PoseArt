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

  // Bone width profiles: [nearWidth, farWidth] in px — tapered capsule effect
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
    'leftShoulder-rightShoulder': [10, 8]
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
  //    neck:         + = head tilts to figure's left
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
  //    hipAbductL/R: + = leg spreads outward (Z-axis) for seated
  //    shoulderFwdL/R: + = arm swings forward (Y-axis)
  //    globalTilt:   + = whole body tilts FORWARD (toward camera) — use ~90 for recline
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
    // globalTilt: tilt entire body forward (X-axis rotation around world origin)
    // +90 = lying on back (supine), -90 = lying face-down (prone)
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

  function getBoneColor(side) {
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
    var alpha = depthToAlpha(avgZ) * (state.ghostMode ? 0.60 : 0.95);
    var baseColor = getBoneColor(side);

    // Tapered capsule: look up width profile for this bone pair
    var boneKey = aKey + '-' + bKey;
    var widths = BONE_WIDTHS[boneKey] || [5.5, 3.5];
    var wA = depthToWidth(pa.z, widths[0]);
    var wB = depthToWidth(pb.z, widths[1]);

    ctx.save();
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
    // Lithe redesign: head is ~1/8 body height (realistic), joints are slim
    var baseRadius = isHead ? 8.5 : (isNeck ? 3.5 : (isKey ? 4.5 : 3));
    var radius = baseRadius * (0.75 + 0.5 * Math.max(0, Math.min(1, (proj.z + 0.8) / 1.6)));
    var alpha = depthToAlpha(proj.z);
    var color = isKey ? COLOR_GOLD : COLOR_CENTER;
    var fillAlpha = state.ghostMode ? Math.min(1, alpha * (isKey ? 0.9 : 0.65)) : alpha;
    ctx.save();
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, Math.max(radius, 2), 0, Math.PI*2);
    ctx.fillStyle = hexToRgba(color, fillAlpha);
    ctx.fill();
    if (isKey) {
      ctx.lineWidth = 1.5;
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
      // Gold halo ring
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, radius + 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(COLOR_GOLD, 0.22);
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  // ----------------------------------------------------------
  // 6b. Accessory drawing (wall, floor, chair, etc.)
  // ----------------------------------------------------------
  // Categories: leaning -> wall on figure's right; seated/lean-seat -> seat plane;
  //             reclining/prone/supine -> floor/mat; kneeling -> floor mat;
  //             boudoir -> soft surface (bed/divan); dynamic/standing -> none
  var ACCESSORY_CATS = {
    'leaning'     : 'wall',
    'lean-seat'   : 'chair',
    'seated'      : 'chair',
    'reclining'   : 'floor',
    'prone'       : 'floor',
    'supine'      : 'floor',
    'kneeling'    : 'floor',
    'boudoir'     : 'bed'
  };

  function drawAccessory(state) {
    var cat = state.poseCategory || '';
    var type = ACCESSORY_CATS[cat];
    if (!type) return;
    var ctx = state.ctx;
    var w = state.width, h = state.height;
    var fitScale = Math.min(w, h) * 0.40 * state.scale;
    ctx.save();

    if (type === 'wall') {
      // Vertical wall line on the right side of the figure
      // Project a vertical stripe at x=+1.0 in model space
      var top    = project(state, { x: 1.0, y:  1.6, z: 0 });
      var bottom = project(state, { x: 1.0, y: -0.15, z: 0 });
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(bottom.x, bottom.y);
      ctx.strokeStyle = 'rgba(180,160,130,0.45)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
      // Hatching to suggest wall texture
      var steps = 6;
      for (var i = 0; i <= steps; i++) {
        var frac = i / steps;
        var py = top.y + (bottom.y - top.y) * frac;
        ctx.beginPath();
        ctx.moveTo(top.x - 12, py);
        ctx.lineTo(top.x + 2, py);
        ctx.strokeStyle = 'rgba(180,160,130,0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    if (type === 'floor') {
      // Horizontal mat/floor ellipse at bottom of figure
      var shadow = getShadowCenter(state);
      var floorY = shadow.y - 0.04;
      var fLeft  = project(state, { x: -0.55, y: floorY, z:  0.3 });
      var fRight = project(state, { x:  0.55, y: floorY, z:  0.3 });
      var fBack  = project(state, { x:  0,    y: floorY, z: -0.3 });
      // Draw a flat rectangle / mat shape
      ctx.beginPath();
      ctx.moveTo(fLeft.x,  fLeft.y  + 8);
      ctx.lineTo(fRight.x, fRight.y + 8);
      ctx.lineTo(fBack.x + 28, fBack.y + 2);
      ctx.lineTo(fBack.x - 28, fBack.y + 2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(80,160,140,0.10)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(80,160,140,0.35)';
      ctx.lineWidth = 1.5;
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

    ctx.restore();
  }

  function drawLineOfAction(state) {
    // Draw a subtle gold Bezier 'line of action' from head through spine/pelvis to weighted foot
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
    // Draw semi-transparent torso/ribcage ellipse for visual volume
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
    // Draw a subtle pelvis ellipse
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
    ctx.clearRect(0, 0, state.width, state.height);
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
      '.pose-skeleton-3d-canvas{animation:poseSkeleton3DBreathe 3.5s ease-in-out infinite;touch-action:none;}';
    document.head.appendChild(s);
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

    _internals: { T_POSE: T_POSE, BONES: BONES, VIEW_ANGLES: VIEW_ANGLES, buildPose: buildPose }
  };

  global.PoseSkeleton3D = PoseSkeleton3D;

})(typeof window !== 'undefined' ? window : this);
