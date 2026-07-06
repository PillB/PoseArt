/* ============================================================
 * PoseArt — Procedural Pose Figure SVG renderer  v1.0
 * ------------------------------------------------------------
 * Renders every pose in the library as a proper 2D SVG derived
 * from its `joints` object, via PoseSkeleton3D.buildPose(). This
 * replaces the 26-sprite fallback lookup — so all 761 poses now
 * show legs, hips, and per-pose limb angles instead of falling
 * back to a generic "standing-neutral" silhouette.
 *
 * Also embeds a subtle idle-breathing SMIL animation so figures
 * look alive on cards and in the pose-detail sheet.
 * ============================================================ */
(function (global) {
  'use strict';

  var COLOR = '#0F3B3A';
  var COLOR_ACCENT = '#1E7A74';
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
    ['leftAnkle', 'leftFoot', 'L', 4],
    ['rightHip', 'rightKnee', 'R', 8],
    ['rightKnee', 'rightAnkle', 'R', 6],
    ['rightAnkle', 'rightFoot', 'R', 4]
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
    'boudoir':   { yaw: 18, pitch: 8 }
  };

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

  function boneSide(side) {
    if (side === 'L') return COLOR;
    if (side === 'R') return COLOR;
    return COLOR;
  }

  function buildBoneSvg(a, b, side, baseWidth, opts) {
    var pa = projectTo(a, opts), pb = projectTo(b, opts);
    var dx = pb.x - pa.x, dy = pb.y - pa.y;
    var len = Math.sqrt(dx*dx + dy*dy);
    if (len < 0.5) return '';
    // Depth-tapered widths
    var wA = baseWidth * (0.7 + 0.5 * Math.max(0, Math.min(1, (pa.z + 0.8) / 1.6)));
    var wB = baseWidth * (0.6 + 0.5 * Math.max(0, Math.min(1, (pb.z + 0.8) / 1.6)));
    // Perpendicular normal
    var nx = -dy / len, ny = dx / len;
    var avgZ = (pa.z + pb.z) / 2;
    var alpha = depthAlpha(avgZ);
    var pts = [
      (pa.x + nx * wA).toFixed(1) + ',' + (pa.y + ny * wA).toFixed(1),
      (pb.x + nx * wB).toFixed(1) + ',' + (pb.y + ny * wB).toFixed(1),
      (pb.x - nx * wB).toFixed(1) + ',' + (pb.y - ny * wB).toFixed(1),
      (pa.x - nx * wA).toFixed(1) + ',' + (pa.y - ny * wA).toFixed(1)
    ].join(' ');
    return '<polygon points="' + pts + '" fill="' + boneSide(side) + '" opacity="' + alpha.toFixed(2) + '"/>';
  }

  function buildHead(skel, opts) {
    var h = projectTo(skel.head, opts);
    var alpha = depthAlpha(h.z);
    var r = 10 * (0.8 + 0.4 * Math.max(0, Math.min(1, (h.z + 0.8) / 1.6)));
    var halo = '<circle cx="' + h.x.toFixed(1) + '" cy="' + h.y.toFixed(1) + '" r="' + (r + 4).toFixed(1) +
      '" stroke="' + GOLD + '" stroke-width="0.8" stroke-dasharray="3 5" opacity="0.30" fill="none"/>';
    // Softer inner accent ellipse for volume
    var accent = '<ellipse cx="' + h.x.toFixed(1) + '" cy="' + (h.y - 1).toFixed(1) + '" rx="' + (r*0.95).toFixed(1) +
      '" ry="' + (r*1.05).toFixed(1) + '" fill="' + COLOR_ACCENT + '" opacity="0.35"/>';
    var head = '<circle cx="' + h.x.toFixed(1) + '" cy="' + h.y.toFixed(1) + '" r="' + r.toFixed(1) +
      '" fill="' + COLOR + '" opacity="' + alpha.toFixed(2) + '"/>';
    return halo + accent + head;
  }

  function buildTorsoVolume(skel, opts) {
    if (!skel.leftShoulder || !skel.rightShoulder || !skel.spine) return '';
    var pLS = projectTo(skel.leftShoulder, opts);
    var pRS = projectTo(skel.rightShoulder, opts);
    var pSp = projectTo(skel.spine, opts);
    var pHi = projectTo(skel.hips, opts);
    var midShoulderX = (pLS.x + pRS.x) / 2;
    var midShoulderY = (pLS.y + pRS.y) / 2;
    // Trapezoid from shoulders to hips
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

  function buildJointDot(skel, key, opts, small) {
    var p = skel[key]; if (!p) return '';
    var pr = projectTo(p, opts);
    var r = small ? 2.5 : 3.5;
    var col = (key === 'leftShoulder' || key === 'rightShoulder' ||
               key === 'leftHip' || key === 'rightHip' || key === 'hips') ? GOLD : COLOR;
    return '<circle cx="' + pr.x.toFixed(1) + '" cy="' + pr.y.toFixed(1) +
      '" r="' + r + '" fill="' + col + '" opacity="0.9"/>';
  }

  function buildShadow(skel, opts) {
    // Find lowest projected point for shadow
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

  /**
   * Render a pose (from POSES_LIBRARY) as an SVG string.
   * Options: { width, height, large, view: 'front'|'side'|'quarter'|'auto',
   *            animate: bool (default true) }
   */
  function renderPoseSVG(pose, options) {
    if (!global.PoseSkeleton3D || !global.PoseSkeleton3D._internals) {
      return '<svg width="80" height="120"><text x="40" y="60" text-anchor="middle" font-size="10" fill="#999">no rig</text></svg>';
    }
    options = options || {};
    var w = options.width || (options.large ? 200 : 110);
    var h = options.height || (options.large ? 280 : 150);
    var animate = options.animate !== false;
    // Determine view angle
    var view = options.view || 'auto';
    var yaw = DEFAULT_YAW, pitch = DEFAULT_PITCH;
    if (view === 'front') { yaw = 0; pitch = 0; }
    else if (view === 'side') { yaw = 88; pitch = 0; }
    else if (view === 'quarter') { yaw = 45; pitch = 0; }
    else if (view === 'auto' && pose && pose.category && CAT_VIEW[pose.category]) {
      yaw = CAT_VIEW[pose.category].yaw;
      pitch = CAT_VIEW[pose.category].pitch;
    }

    var joints = (pose && pose.joints) || {};
    var skel = global.PoseSkeleton3D._internals.buildPose(joints);

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
      // Skip torso center bones (already drawn as trapezoid volume)
      if (bd.bone[0] === 'neck' && bd.bone[1] === 'spine') continue;
      if (bd.bone[0] === 'spine' && bd.bone[1] === 'hips') continue;
      var a = skel[bd.bone[0]], b = skel[bd.bone[1]];
      parts.push(buildBoneSvg(a, b, bd.bone[2], bd.bone[3], opts));
    }

    parts.push(buildJointDot(skel, 'leftShoulder', opts));
    parts.push(buildJointDot(skel, 'rightShoulder', opts));
    parts.push(buildJointDot(skel, 'leftHip', opts));
    parts.push(buildJointDot(skel, 'rightHip', opts));
    parts.push(buildHead(skel, opts));

    // Optional subtle breathing scale animation via SMIL — keeps figures alive
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

  global.PoseFigureProcedural = { render: renderPoseSVG };

})(typeof window !== 'undefined' ? window : this);
