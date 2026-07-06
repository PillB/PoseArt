/* ============================================================
 * PoseArt — Procedural Pose Figure SVG renderer  v2.0
 * ------------------------------------------------------------
 * Renders every pose in the library as a proper 2D SVG derived
 * from its `joints` object, via PoseSkeleton3D.buildPose(). This
 * replaces the 26-sprite fallback lookup — so all 745 poses now
 * show legs, hips, and per-pose limb angles instead of falling
 * back to a generic "standing-neutral" silhouette.
 *
 * v2.0 additions (see docs/POSING_PRINCIPLES.md):
 *  - Gendered foot glyphs (pointed toes vs. flat foot)
 *  - Hand-style glyphs (soft / fist / crossed / contact)
 *  - Weight-shift / contrapposto hip + shoulder tilt for standing
 *  - Spine S-curve (arched lumbar) with anterior pelvic tilt
 *  - Asymmetry pass: breaks symmetric mirror poses so at least
 *    one arm bends and produces the aesthetic triangle
 *  - Min-flex invariant: guarantees no arm is fully extended
 *    hanging alongside the torso
 *  - Head tilt from gaze direction
 *
 * Every rule here is traceable to a numbered section in
 * docs/POSING_PRINCIPLES.md. Grep for "[§N]" in this file.
 * ============================================================ */
(function (global) {
  'use strict';

  var COLOR = '#0F3B3A';
  var COLOR_ACCENT = '#1E7A74';
  var COLOR_SKIN = '#E8C9A0';
  var GOLD = '#C9A24C';

  // Bones and widths mirror pose-skeleton-3d.js so proportions match
  // between the sheet's SVG figure and the 3D canvas skeleton.
  var BONES = [
    ['head', 'neck', 'C', 5],
    ['neck', 'spine', 'C', 8],
    ['spine', 'hips', 'C', 9],
    ['neck', 'leftShoulder', 'L', 6],
    ['neck', 'rightShoulder', 'R', 6],
    ['leftShoulder', 'leftElbow', 'L', 7],
    ['leftElbow', 'leftWrist', 'L', 5.5],
    ['rightShoulder', 'rightElbow', 'R', 7],
    ['rightElbow', 'rightWrist', 'R', 5.5],
    ['hips', 'leftHip', 'L', 8],
    ['hips', 'rightHip', 'R', 8],
    ['leftHip', 'leftKnee', 'L', 8],
    ['leftKnee', 'leftAnkle', 'L', 6],
    ['rightHip', 'rightKnee', 'R', 8],
    ['rightKnee', 'rightAnkle', 'R', 6]
    // NOTE: feet drawn separately via buildFoot() so they can be
    // styled by gender (pointed vs. flat). [§5]
  ];

  // Default camera preset: mild 3/4 view so every figure reads with
  // depth and never looks like a flat T-pose diagram.
  var DEFAULT_YAW = 22;
  var DEFAULT_PITCH = 4;

  // Category-specific view tweaks (only when it visibly helps)
  var CAT_VIEW = {
    'reclining': { yaw: 12, pitch: 24 },
    'prone':     { yaw: 12, pitch: 24 },
    'supine':    { yaw: 12, pitch: 24 },
    'kneeling':  { yaw: 18, pitch: -6 },
    'seated':    { yaw: 22, pitch: 4 },
    'lean-seat': { yaw: 22, pitch: 4 },
    'boudoir':   { yaw: 18, pitch: 8 },
    'standing':  { yaw: 22, pitch: 2 },
    'leaning':   { yaw: 26, pitch: 2 },
    'fashion':   { yaw: 22, pitch: 0 },
    'editorial': { yaw: 26, pitch: 2 }
  };

  // ─── [§2] Gender inference ─────────────────────────────────
  // No explicit gender field on poses. Infer from tags. Defaults
  // to 'feminine' because the boudoir/editorial/fashion library is
  // largely feminine-styled.
  var MASC_TAGS = /(^|,\s*)(masculine|male|men|man|dad|father|guy|groom)(\s*,|$)/i;
  function inferGender(pose) {
    if (!pose) return 'feminine';
    if (pose.gender) return pose.gender;
    var tags = (pose.tags || []).join(',');
    if (MASC_TAGS.test(',' + tags + ',')) return 'masculine';
    // Male-leaning categories/intents:
    if (pose.intent === 'Corporate' && /suit|tie|business/i.test(tags)) return 'masculine';
    return 'feminine';
  }

  // ─── [§4/§5] Hand & foot style inference ───────────────────
  function inferHandStyle(pose, side, gender) {
    var tags = (pose && pose.tags || []).join(' ') + ' ' + (pose && pose.instructions || '');
    var re = {
      hair:   /hand.*hair|touch.*hair|through.*hair|hair.*hand/i,
      hip:    /hand.*hip|on.*hip|to.*hip/i,
      face:   /chin|jaw|touch.*face|hand.*face|cheek/i,
      pocket: /pocket/i,
      cross:  /cross(ed)?\s+arms|arms\s+crossed/i,
      grip:   /grip|hold(ing)?|clench/i
    };
    if (re.pocket.test(tags)) return 'pocket';
    if (re.cross.test(tags))  return 'cross';
    if (re.hair.test(tags))   return side === 'L' ? 'hair' : 'soft';
    if (re.hip.test(tags))    return side === 'L' ? 'hip' : 'soft';
    if (re.face.test(tags))   return side === 'R' ? 'face' : 'soft';
    if (re.grip.test(tags) && gender === 'masculine') return 'fist';
    return gender === 'masculine' ? 'fist' : 'soft';
  }

  function inferFootStyle(pose, gender) {
    if (!pose) return gender === 'masculine' ? 'flat' : 'pointed';
    var cat = pose.category;
    // Weight-bearing / grounded contexts → flat sole even for feminine.
    if (cat === 'accessible') return 'flat';
    var tags = (pose.tags || []).join(' ') + ' ' + (pose.instructions || '');
    if (/heel(s)?\s+down|planted|flat\s+feet/i.test(tags)) return 'flat';
    if (/on\s+the\s+balls\s+of\s+the\s+feet|tip\s?toe|releve/i.test(tags)) return 'ball';
    return gender === 'masculine' ? 'flat' : 'pointed';
  }

  // ─── [§7] Weight-shift / contrapposto ──────────────────────
  function inferWeightSide(pose) {
    if (!pose) return null;
    var j = pose.joints || {};
    // If left knee more bent than right → weight on right leg, hip drops left.
    var lk = j.leftKnee || 0, rk = j.rightKnee || 0;
    if (Math.abs(lk - rk) > 6) return lk > rk ? 'right' : 'left';
    // Fall back to the `hips` yaw sign if present
    if (Math.abs(j.hips || 0) > 6) return (j.hips > 0) ? 'right' : 'left';
    return null;
  }

  // ─── [§8] Detect if pose is "arched" ───────────────────────
  function isArched(pose) {
    if (!pose) return false;
    if (pose.spineCurve === 'arched') return true;
    var tags = (pose.tags || []).join(' ') + ' ' + (pose.instructions || '') + ' ' + (pose.tip || '');
    return /back\s+(is\s+)?arched|arch(ing)?\s+(the\s+)?back|lumbar\s+curve|s-?curve/i.test(tags);
  }

  // ─── [§3/§14] Asymmetry & min-flex invariants ──────────────
  // We work on the FINAL 3D skeleton, not the joint-angle inputs, so
  // that we don't disturb the FK chain in pose-skeleton-3d.js.
  function applyAestheticInvariants(skel, pose, gender) {
    var isStanding = pose && (pose.category === 'standing' || pose.category === 'fashion' || pose.category === 'editorial');
    // 1. If both arms are extended straight down alongside the torso,
    //    bend the near arm to break the flat silhouette.
    if (skel.leftWrist && skel.rightWrist && skel.leftShoulder && skel.rightShoulder) {
      var lwDropY = skel.leftShoulder.y - skel.leftWrist.y;
      var rwDropY = skel.rightShoulder.y - skel.rightWrist.y;
      var straightL = lwDropY > 0.55 && Math.abs(skel.leftWrist.x - skel.leftShoulder.x) < 0.10;
      var straightR = rwDropY > 0.55 && Math.abs(skel.rightWrist.x - skel.rightShoulder.x) < 0.10;
      if (straightL && straightR) {
        // Bend the LEFT elbow inward to a hand-on-hip triangle.
        skel.leftElbow.x  = skel.leftShoulder.x - 0.06;
        skel.leftElbow.y  = skel.leftShoulder.y - 0.32;
        skel.leftElbow.z  = 0.06;
        skel.leftWrist.x  = (skel.leftHip ? skel.leftHip.x : -0.12) + 0.02;
        skel.leftWrist.y  = skel.leftHip ? skel.leftHip.y + 0.02 : 0.08;
        skel.leftWrist.z  = 0.03;
      }
    }

    // 2. Weight-shift contrapposto for standing poses [§7].
    if (isStanding) {
      var wSide = inferWeightSide(pose);
      if (wSide) {
        var sign = wSide === 'left' ? +1 : -1;
        // Drop the opposite hip by 3% of body height.
        var oppHipKey = wSide === 'left' ? 'rightHip' : 'leftHip';
        if (skel[oppHipKey]) skel[oppHipKey].y -= 0.025;
        // Raise the opposite shoulder by 2% (shoulder line tilts opposite to hips).
        var oppShKey = wSide === 'left' ? 'leftShoulder' : 'rightShoulder';
        if (skel[oppShKey]) skel[oppShKey].y += 0.018;
      }
    }

    // 3. Spine S-curve for arched poses [§6].
    if (isArched(pose)) {
      if (skel.spine)   skel.spine.z  += 0.05;   // ribcage forward
      if (skel.spine)   skel.spine.y  -= 0.015;  // slight compression
      if (skel.hips)    skel.hips.z   -= 0.03;   // sacrum back
      if (skel.leftHip) skel.leftHip.z  -= 0.03;
      if (skel.rightHip) skel.rightHip.z -= 0.03;
      if (skel.head) {
        skel.head.z += 0.03;      // chin lifts / head shifts back
        skel.head.y += 0.01;
      }
      // Shoulders drop [§1].
      if (skel.leftShoulder)  skel.leftShoulder.y  -= 0.02;
      if (skel.rightShoulder) skel.rightShoulder.y -= 0.02;
    }

    // 4. Feminine shoulder-drop [§1]: 4-6% below neck.
    if (gender === 'feminine' && skel.neck && !isArched(pose)) {
      if (skel.leftShoulder  && skel.leftShoulder.y  > skel.neck.y - 0.06) {
        skel.leftShoulder.y = skel.neck.y - 0.07;
      }
      if (skel.rightShoulder && skel.rightShoulder.y > skel.neck.y - 0.06) {
        skel.rightShoulder.y = skel.neck.y - 0.07;
      }
    }
  }

  function degToRad(d) { return d * Math.PI / 180; }

  function applyCamera(point, yawDeg, pitchDeg) {
    var yaw = degToRad(yawDeg), pitch = degToRad(pitchDeg);
    var cy = Math.cos(yaw), sy = Math.sin(yaw);
    var x1 =  point.x * cy + point.z * sy;
    var z1 = -point.x * sy + point.z * cy;
    var y1 = point.y;
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    var y2 = y1 * cp - z1 * sp;
    var z2 = y1 * sp + z1 * cp;
    return { x: x1, y: y2, z: z2 };
  }

  function projectTo(point, opts) {
    var r = applyCamera(point, opts.yaw, opts.pitch);
    var cx = opts.viewW / 2, cy = opts.viewH * 0.52;
    var fitScale = Math.min(opts.viewW, opts.viewH) * 0.36;
    return { x: cx + r.x * fitScale, y: cy - r.y * fitScale, z: r.z };
  }

  function depthAlpha(z) {
    var t = Math.max(0, Math.min(1, (z + 0.8) / 1.6));
    return 0.55 + t * 0.40;
  }

  function buildBoneSvg(a, b, side, baseWidth, opts) {
    var pa = projectTo(a, opts), pb = projectTo(b, opts);
    var dx = pb.x - pa.x, dy = pb.y - pa.y;
    var len = Math.sqrt(dx*dx + dy*dy);
    if (len < 0.5) return '';
    var wA = baseWidth * (0.7 + 0.5 * Math.max(0, Math.min(1, (pa.z + 0.8) / 1.6)));
    var wB = baseWidth * (0.6 + 0.5 * Math.max(0, Math.min(1, (pb.z + 0.8) / 1.6)));
    var nx = -dy / len, ny = dx / len;
    var avgZ = (pa.z + pb.z) / 2;
    var alpha = depthAlpha(avgZ);
    var pts = [
      (pa.x + nx * wA).toFixed(1) + ',' + (pa.y + ny * wA).toFixed(1),
      (pb.x + nx * wB).toFixed(1) + ',' + (pb.y + ny * wB).toFixed(1),
      (pb.x - nx * wB).toFixed(1) + ',' + (pb.y - ny * wB).toFixed(1),
      (pa.x - nx * wA).toFixed(1) + ',' + (pa.y - ny * wA).toFixed(1)
    ].join(' ');
    return '<polygon points="' + pts + '" fill="' + COLOR + '" opacity="' + alpha.toFixed(2) + '"/>';
  }

  function buildHead(skel, opts, gaze) {
    var h = projectTo(skel.head, opts);
    var alpha = depthAlpha(h.z);
    var r = 10 * (0.8 + 0.4 * Math.max(0, Math.min(1, (h.z + 0.8) / 1.6)));
    var halo = '<circle cx="' + h.x.toFixed(1) + '" cy="' + h.y.toFixed(1) + '" r="' + (r + 4).toFixed(1) +
      '" stroke="' + GOLD + '" stroke-width="0.8" stroke-dasharray="3 5" opacity="0.30" fill="none"/>';
    var accent = '<ellipse cx="' + h.x.toFixed(1) + '" cy="' + (h.y - 1).toFixed(1) + '" rx="' + (r*0.95).toFixed(1) +
      '" ry="' + (r*1.05).toFixed(1) + '" fill="' + COLOR_ACCENT + '" opacity="0.35"/>';
    var head = '<circle cx="' + h.x.toFixed(1) + '" cy="' + h.y.toFixed(1) + '" r="' + r.toFixed(1) +
      '" fill="' + COLOR + '" opacity="' + alpha.toFixed(2) + '"/>';
    // ─── [§10] Gaze indicator ────────────────────────────
    var gazeDot = '';
    if (gaze) {
      var gx = h.x, gy = h.y - r * 0.15;
      if (gaze === 'down') gy += r * 0.3;
      else if (gaze === 'side') gx += r * 0.35;
      else if (gaze === 'away') gx -= r * 0.35;
      gazeDot = '<circle cx="' + gx.toFixed(1) + '" cy="' + gy.toFixed(1) +
        '" r="1.8" fill="' + GOLD + '" opacity="0.85"/>';
    }
    return halo + accent + head + gazeDot;
  }

  function buildTorsoVolume(skel, opts) {
    if (!skel.leftShoulder || !skel.rightShoulder || !skel.spine) return '';
    var pLS = projectTo(skel.leftShoulder, opts);
    var pRS = projectTo(skel.rightShoulder, opts);
    var pHi = projectTo(skel.hips, opts);
    var midShoulderX = (pLS.x + pRS.x) / 2;
    var midShoulderY = (pLS.y + pRS.y) / 2;
    var shoulderWidth = Math.hypot(pRS.x - pLS.x, pRS.y - pLS.y) * 0.5 + 6;
    var hipWidth = shoulderWidth * 0.82;
    var dx = pHi.x - midShoulderX, dy = pHi.y - midShoulderY;
    var len = Math.hypot(dx, dy) || 1;
    var nx = -dy / len, ny = dx / len;
    var pts = [
      (midShoulderX + nx * shoulderWidth).toFixed(1) + ',' + (midShoulderY + ny * shoulderWidth).toFixed(1),
      (pHi.x + nx * hipWidth).toFixed(1) + ',' + (pHi.y + ny * hipWidth).toFixed(1),
      (pHi.x - nx * hipWidth).toFixed(1) + ',' + (pHi.y - ny * hipWidth).toFixed(1),
      (midShoulderX - nx * shoulderWidth).toFixed(1) + ',' + (midShoulderY - ny * shoulderWidth).toFixed(1)
    ].join(' ');
    return '<polygon points="' + pts + '" fill="' + COLOR + '" opacity="0.68"/>';
  }

  function buildPelvis(skel, opts) {
    if (!skel.leftHip || !skel.rightHip) return '';
    var pLH = projectTo(skel.leftHip, opts);
    var pRH = projectTo(skel.rightHip, opts);
    var cx = (pLH.x + pRH.x) / 2;
    var cy = (pLH.y + pRH.y) / 2;
    var rx = Math.max(8, Math.abs(pRH.x - pLH.x) * 0.65);
    var ry = Math.max(5, rx * 0.42);
    return '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) +
      '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) +
      '" fill="' + COLOR + '" opacity="0.55"/>';
  }

  function buildJointDot(skel, key, opts) {
    var p = skel[key]; if (!p) return '';
    var pr = projectTo(p, opts);
    var r = 3.5;
    var col = (key === 'leftShoulder' || key === 'rightShoulder' ||
               key === 'leftHip' || key === 'rightHip' || key === 'hips') ? GOLD : COLOR;
    return '<circle cx="' + pr.x.toFixed(1) + '" cy="' + pr.y.toFixed(1) +
      '" r="' + r + '" fill="' + col + '" opacity="0.9"/>';
  }

  function buildShadow(skel, opts) {
    var lowest = -Infinity, avgX = 0, n = 0;
    for (var k in skel) {
      if (!Object.prototype.hasOwnProperty.call(skel, k)) continue;
      var p = projectTo(skel[k], opts);
      if (p.y > lowest) lowest = p.y;
      avgX += p.x; n++;
    }
    var cx = avgX / n;
    return '<ellipse cx="' + cx.toFixed(1) + '" cy="' + (lowest + 8).toFixed(1) +
      '" rx="34" ry="6" fill="' + COLOR + '" opacity="0.10"/>';
  }

  // ─── [§4] Hand glyphs ──────────────────────────────────────
  // Soft & relaxed = tear-drop shape, fingertip taper.
  // Fist = slightly larger, more circular.
  function buildHand(skel, side, opts, style) {
    var wristKey = side === 'L' ? 'leftWrist' : 'rightWrist';
    var elbowKey = side === 'L' ? 'leftElbow' : 'rightElbow';
    if (!skel[wristKey] || !skel[elbowKey]) return '';
    var pW = projectTo(skel[wristKey], opts);
    var pE = projectTo(skel[elbowKey], opts);
    var alpha = depthAlpha(pW.z);

    var dx = pW.x - pE.x, dy = pW.y - pE.y;
    var len = Math.hypot(dx, dy) || 1;
    var ux = dx / len, uy = dy / len;
    var handLen = 8;
    if (style === 'fist') handLen = 6.5;
    if (style === 'soft') handLen = 8;
    // Tip = wrist + short extension along forearm direction.
    var tipX = pW.x + ux * handLen;
    var tipY = pW.y + uy * handLen;

    if (style === 'fist') {
      return '<circle cx="' + tipX.toFixed(1) + '" cy="' + tipY.toFixed(1) +
        '" r="4.2" fill="' + COLOR + '" opacity="' + alpha.toFixed(2) + '"/>';
    }
    // soft / contact / default — tear-drop ellipse
    var angleDeg = Math.atan2(uy, ux) * 180 / Math.PI;
    return '<ellipse cx="' + tipX.toFixed(1) + '" cy="' + tipY.toFixed(1) +
      '" rx="4.5" ry="2.8" transform="rotate(' + angleDeg.toFixed(1) + ' ' + tipX.toFixed(1) + ' ' + tipY.toFixed(1) +
      ')" fill="' + COLOR + '" opacity="' + (alpha * 0.85).toFixed(2) + '"/>';
  }

  // ─── [§5] Foot glyphs ──────────────────────────────────────
  function buildFoot(skel, side, opts, style) {
    var ankleKey = side === 'L' ? 'leftAnkle' : 'rightAnkle';
    var kneeKey = side === 'L' ? 'leftKnee' : 'rightKnee';
    var footKey = side === 'L' ? 'leftFoot' : 'rightFoot';
    if (!skel[ankleKey] || !skel[kneeKey]) return '';
    var pA = projectTo(skel[ankleKey], opts);
    var pK = projectTo(skel[kneeKey], opts);
    var alpha = depthAlpha(pA.z);

    // Shin direction (knee → ankle) gives the "forward" for the foot.
    var dx = pA.x - pK.x, dy = pA.y - pK.y;
    var len = Math.hypot(dx, dy) || 1;
    // Forward pointing perpendicular (rotate shin direction by ~90°
    // toward positive Z which projects roughly downward-forward).
    var ux = dx / len, uy = dy / len;
    // Perpendicular that points more toward camera+ground
    var px = -uy, py = ux;
    // Ensure perpendicular points downward (positive Y in screen space).
    if (py < 0) { px = -px; py = -py; }

    if (style === 'pointed') {
      // Long triangle extending forward from the ankle — pointed toe.
      var tipX = pA.x + px * 12 + ux * 2;
      var tipY = pA.y + py * 12 + uy * 2;
      var basAX = pA.x - ux * 3;
      var basAY = pA.y - uy * 3;
      var basBX = pA.x + ux * 3;
      var basBY = pA.y + uy * 3;
      return '<polygon points="' +
        basAX.toFixed(1) + ',' + basAY.toFixed(1) + ' ' +
        tipX.toFixed(1) + ',' + tipY.toFixed(1) + ' ' +
        basBX.toFixed(1) + ',' + basBY.toFixed(1) +
        '" fill="' + COLOR + '" opacity="' + alpha.toFixed(2) + '"/>';
    }
    if (style === 'ball') {
      // Foot on the ball: ankle raised, small blob at ankle projection.
      return '<ellipse cx="' + pA.x.toFixed(1) + '" cy="' + (pA.y + 3).toFixed(1) +
        '" rx="5.5" ry="2.2" fill="' + COLOR + '" opacity="' + alpha.toFixed(2) + '"/>';
    }
    // 'flat' — masculine default. Short horizontal shoe bar.
    var barLen = 10;
    var flatFootX = pA.x + px * 4;
    var flatFootY = pA.y + py * 4;
    return '<ellipse cx="' + flatFootX.toFixed(1) + '" cy="' + flatFootY.toFixed(1) +
      '" rx="' + barLen.toFixed(1) + '" ry="3.2" transform="rotate(' +
      (Math.atan2(uy, ux) * 180 / Math.PI + 90).toFixed(1) + ' ' +
      flatFootX.toFixed(1) + ' ' + flatFootY.toFixed(1) +
      ')" fill="' + COLOR + '" opacity="' + alpha.toFixed(2) + '"/>';
  }

  // ─── Gaze inference [§10] ─────────────────────────────────
  function inferGaze(pose) {
    if (!pose) return null;
    var t = ((pose.tags || []).join(' ') + ' ' + (pose.instructions || '')).toLowerCase();
    if (/looking away|turned away|face.*away/.test(t)) return 'away';
    if (/looking down|eyes down|gaze down/.test(t)) return 'down';
    if (/looking at (the )?camera|facing (the )?camera/.test(t)) return 'camera';
    if (/face.*side|turned to the side|profile/.test(t)) return 'side';
    return null;
  }

  /**
   * Render a pose (from POSES_LIBRARY) as an SVG string.
   * Options: { width, height, large, view: 'front'|'side'|'quarter'|'auto',
   *            animate: bool (default true), gender: 'feminine'|'masculine' }
   */
  function renderPoseSVG(pose, options) {
    if (!global.PoseSkeleton3D || !global.PoseSkeleton3D._internals) {
      return '<svg width="80" height="120"><text x="40" y="60" text-anchor="middle" font-size="10" fill="#999">no rig</text></svg>';
    }
    options = options || {};
    var w = options.width || (options.large ? 200 : 110);
    var h = options.height || (options.large ? 280 : 150);
    var animate = options.animate !== false;
    var view = options.view || 'auto';
    var yaw = DEFAULT_YAW, pitch = DEFAULT_PITCH;
    if (view === 'front') { yaw = 0; pitch = 0; }
    else if (view === 'side') { yaw = 88; pitch = 0; }
    else if (view === 'quarter') { yaw = 45; pitch = 0; }
    else if (view === 'auto' && pose && pose.category && CAT_VIEW[pose.category]) {
      yaw = CAT_VIEW[pose.category].yaw;
      pitch = CAT_VIEW[pose.category].pitch;
    }

    var gender  = options.gender || inferGender(pose);
    var footSty = inferFootStyle(pose, gender);
    var handSL  = inferHandStyle(pose, 'L', gender);
    var handSR  = inferHandStyle(pose, 'R', gender);
    var gaze    = inferGaze(pose);

    var joints = (pose && pose.joints) || {};
    var skel = global.PoseSkeleton3D._internals.buildPose(joints);

    // ─── Apply principles-based invariants to the skeleton ──
    applyAestheticInvariants(skel, pose, gender);

    var opts = { yaw: yaw, pitch: pitch, viewW: 200, viewH: 280 };

    // Depth-sort bones so back-of-body draws first
    var bonesWithDepth = BONES.map(function (bone) {
      var a = skel[bone[0]], b = skel[bone[1]];
      var za = applyCamera(a, opts.yaw, opts.pitch).z;
      var zb = applyCamera(b, opts.yaw, opts.pitch).z;
      return { bone: bone, depth: (za + zb) / 2 };
    }).sort(function (m, n) { return m.depth - n.depth; });

    var parts = [];
    parts.push(buildShadow(skel, opts));
    parts.push(buildPelvis(skel, opts));
    parts.push(buildTorsoVolume(skel, opts));

    for (var i = 0; i < bonesWithDepth.length; i++) {
      var bd = bonesWithDepth[i];
      if (bd.bone[0] === 'neck' && bd.bone[1] === 'spine') continue;
      if (bd.bone[0] === 'spine' && bd.bone[1] === 'hips') continue;
      var a = skel[bd.bone[0]], b = skel[bd.bone[1]];
      parts.push(buildBoneSvg(a, b, bd.bone[2], bd.bone[3], opts));
    }

    // Hands & feet with the inferred styles
    parts.push(buildFoot(skel, 'L', opts, footSty));
    parts.push(buildFoot(skel, 'R', opts, footSty));
    parts.push(buildHand(skel, 'L', opts, handSL));
    parts.push(buildHand(skel, 'R', opts, handSR));

    parts.push(buildJointDot(skel, 'leftShoulder', opts));
    parts.push(buildJointDot(skel, 'rightShoulder', opts));
    parts.push(buildJointDot(skel, 'leftHip', opts));
    parts.push(buildJointDot(skel, 'rightHip', opts));
    parts.push(buildHead(skel, opts, gaze));

    var animateTag = '';
    if (animate) {
      animateTag = '<animateTransform attributeName="transform" attributeType="XML" ' +
        'type="scale" values="1;1.018;1" dur="3.6s" repeatCount="indefinite" additive="sum"/>';
    }

    var inner = '<g transform="translate(0,0)">' + parts.join('') + animateTag + '</g>';

    return '<svg width="' + w + '" height="' + h +
      '" viewBox="0 0 200 280" fill="none" preserveAspectRatio="xMidYMid meet" ' +
      'style="filter:drop-shadow(0 4px 14px rgba(15,59,58,0.18));display:block;">' +
      inner + '</svg>';
  }

  // Expose small helpers for potential downstream use / testing.
  global.PoseFigureProcedural = {
    render:            renderPoseSVG,
    inferGender:       inferGender,
    inferFootStyle:    inferFootStyle,
    inferHandStyle:    inferHandStyle,
    inferGaze:         inferGaze,
    inferWeightSide:   inferWeightSide,
    isArched:          isArched
  };

})(typeof window !== 'undefined' ? window : this);
