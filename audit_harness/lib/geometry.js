// audit_harness/lib/geometry.js
// Forensic anatomy derivation from PoseSkeleton3D body-frame joint coordinates.
// Coordinate frame (per pose-skeleton-3d.js): +Y up, +X = figure's right,
// +Z = toward viewer (anterior/front). Origin = hip center.
// All angles in degrees. We DERIVE from coordinates; we never trust raw
// renderer values or comments as anatomical ground truth.

const v = (p) => (p && typeof p.x === 'number') ? [p.x, p.y, p.z] : (p ? [p[0] || 0, p[1] || 0, p[2] || 0] : [0, 0, 0]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const rad2deg = (r) => r * 180 / Math.PI;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const round = (x, p = 1) => { const m = Math.pow(10, p); return Math.round(x * m) / m; };

function planarAngle(vec, axisA, axisB) {
  return rad2deg(Math.atan2(dot(vec, axisA), dot(vec, axisB)));
}
function foldAngle(a, b) {
  const la = len(a), lb = len(b);
  if (la < 1e-6 || lb < 1e-6) return 0;
  const c = clamp(dot(a, b) / (la * lb), -1, 1);
  return rad2deg(Math.acos(c));
}
function segment(fromJ, toJ, skel) {
  const a = v(skel[fromJ]), b = v(skel[toJ]);
  const vec = sub(b, a);
  return { a, b, vec, length: len(vec) };
}

function deriveArm(side, skel) {
  const sh = side === 'L' ? 'leftShoulder' : 'rightShoulder';
  const el = side === 'L' ? 'leftElbow' : 'rightElbow';
  const wr = side === 'L' ? 'leftWrist' : 'rightWrist';
  const upper = segment(sh, el, skel);
  const fore = segment(el, wr, skel);
  const uv = norm(upper.vec), fv = norm(fore.vec);
  const outward = side === 'L' ? [-1, 0, 0] : [1, 0, 0];
  const down = [0, -1, 0];
  const forward = [0, 0, 1];
  const abduction = planarAngle(uv, outward, down);
  const sagittalFlexion = planarAngle(uv, forward, down);
  const elbowFlexion = foldAngle(upper.vec, fore.vec);
  const forearmForward = planarAngle(fv, forward, down);
  return {
    shoulder_abduction_deg: round(abduction, 1),
    shoulder_sagittal_flexion_deg: round(sagittalFlexion, 1),
    elbow_flexion_deg: round(elbowFlexion, 1),
    forearm_forward_deg: round(forearmForward, 1),
    upper_arm_length: round(upper.length, 3),
    forearm_length: round(fore.length, 3),
    description: describeArm(side, abduction, sagittalFlexion, elbowFlexion)
  };
}
function describeArm(side, abd, flx, elbow) {
  const s = side === 'L' ? 'Left' : 'Right';
  const parts = [];
  if (abd < 15) parts.push('arm at side');
  else if (abd < 60) parts.push(`arm abducted ~${Math.round(abd)}°`);
  else if (abd < 120) parts.push(`arm abducted ~${Math.round(abd)}° (lateral)`);
  else parts.push(`arm overhead (~${Math.round(abd)}° abduction)`);
  if (Math.abs(flx) > 15) parts.push(flx > 0 ? `shoulder flexed ~${Math.round(flx)}° forward` : `shoulder extended ~${Math.round(-flx)}° behind`);
  if (elbow < 15) parts.push('elbow straight');
  else if (elbow < 75) parts.push(`elbow bent ~${Math.round(elbow)}°`);
  else if (elbow < 115) parts.push(`elbow ~right-angle (${Math.round(elbow)}°)`);
  else parts.push(`elbow deeply bent (~${Math.round(elbow)}°)`);
  return `${s} arm: ${parts.join('; ')}.`;
}

function deriveLeg(side, skel) {
  const hip = side === 'L' ? 'leftHip' : 'rightHip';
  const knee = side === 'L' ? 'leftKnee' : 'rightKnee';
  const ank = side === 'L' ? 'leftAnkle' : 'rightAnkle';
  const foot = side === 'L' ? 'leftFoot' : 'rightFoot';
  const thigh = segment(hip, knee, skel);
  const shank = segment(knee, ank, skel);
  const tv = norm(thigh.vec), sv = norm(shank.vec);
  const outward = side === 'L' ? [-1, 0, 0] : [1, 0, 0];
  const down = [0, -1, 0];
  const forward = [0, 0, 1];
  const hipFlexion = planarAngle(tv, forward, down);
  const hipAbduction = planarAngle(tv, outward, down);
  const kneeFlexion = foldAngle(thigh.vec, shank.vec);
  const footVec = sub(v(skel[foot]), v(skel[ank]));
  const footForward = planarAngle(norm(footVec), forward, down);
  return {
    hip_flexion_deg: round(hipFlexion, 1),
    hip_abduction_deg: round(hipAbduction, 1),
    knee_flexion_deg: round(kneeFlexion, 1),
    foot_forward_deg: round(footForward, 1),
    thigh_length: round(thigh.length, 3),
    shank_length: round(shank.length, 3),
    description: describeLeg(side, hipFlexion, hipAbduction, kneeFlexion)
  };
}
function describeLeg(side, flx, abd, knee) {
  const s = side === 'L' ? 'Left' : 'Right';
  const parts = [];
  if (flx > 70) parts.push(`thigh forward ~${Math.round(flx)}° (hip flexion)`);
  else if (flx > 15) parts.push(`thigh forward ~${Math.round(flx)}°`);
  else if (flx < -15) parts.push(`thigh extended ~${Math.round(-flx)}° behind`);
  else parts.push('thigh near neutral');
  if (abd > 15) parts.push(`abducted ~${Math.round(abd)}° outward`);
  if (knee < 15) parts.push('knee straight');
  else if (knee < 75) parts.push(`knee bent ~${Math.round(knee)}°`);
  else if (knee < 115) parts.push(`knee ~right-angle (${Math.round(knee)}°)`);
  else parts.push(`knee deeply bent (~${Math.round(knee)}°)`);
  return `${s} leg: ${parts.join('; ')}.`;
}

function deriveTorso(skel) {
  const hips = v(skel.hips), neck = v(skel.neck), lSh = v(skel.leftShoulder), rSh = v(skel.rightShoulder);
  const torsoVec = sub(neck, hips); // points UP in neutral
  const up = [0, 1, 0], forward = [0, 0, 1], right = [1, 0, 0];
  // Flexion: 0 = upright, + = forward lean (neck toward +z). Reference = up.
  const flexion = planarAngle(norm(torsoVec), forward, up);
  // Lateral flexion: 0 = upright, + = lean to figure's right (+x).
  const lateral = planarAngle(norm(torsoVec), right, up);
  const shoulderBar = sub(rSh, lSh);
  const shoulderZdiff = lSh[2] - rSh[2];
  const axialRotation = rad2deg(Math.atan2(shoulderZdiff, len(shoulderBar)));
  return {
    flexion_deg: round(flexion, 1),
    lateral_flexion_deg: round(lateral, 1),
    axial_rotation_deg: round(axialRotation, 1),
    description: `Torso flexion ${round(flexion, 0)}° (+: forward), lateral ${round(lateral, 0)}° (+: figure's right), axial rotation proxy ${round(axialRotation, 0)}°.`
  };
}

function derivePelvis(skel) {
  const lHip = v(skel.leftHip), rHip = v(skel.rightHip), hips = v(skel.hips);
  const pelvisBar = sub(rHip, lHip);
  const pelvisList = -rad2deg(Math.atan2(lHip[1] - rHip[1], len(pelvisBar)));
  const pelvisYaw = rad2deg(Math.atan2(lHip[2] - rHip[2], len(pelvisBar)));
  const pelvisTilt = rad2deg(Math.atan2((lHip[2] + rHip[2]) / 2 - hips[2], 0.07));
  return {
    tilt_deg: round(pelvisTilt, 1),
    list_deg: round(pelvisList, 1),
    yaw_deg: round(pelvisYaw, 1),
    description: `Pelvic list ${round(pelvisList, 0)}° (+: left hip lower), yaw ${round(pelvisYaw, 0)}°, anterior/posterior tilt proxy ${round(pelvisTilt, 0)}° (low confidence).`
  };
}

function deriveHead(skel) {
  const head = v(skel.head), neck = v(skel.neck);
  const hv = sub(head, neck); // points UP in neutral
  const up = [0, 1, 0], forward = [0, 0, 1], right = [1, 0, 0];
  // Pitch: 0 = upright, + = head forward/down (chin to chest).
  const pitch = planarAngle(norm(hv), forward, up);
  // Roll: 0 = upright, + = head tilt to figure's right (+x).
  const roll = planarAngle(norm(hv), right, up);
  return {
    pitch_deg: round(pitch, 1),
    yaw_deg: 0,
    roll_deg: round(roll, 1),
    description: `Head pitch ${round(pitch, 0)}° (+: forward/down), roll ${round(roll, 0)}° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).`
  };
}

function deriveContactsBalance(skel, opts) {
  opts = opts || {};
  const lFoot = v(skel.leftFoot), rFoot = v(skel.rightFoot);
  const hips = v(skel.hips);
  const feetMinY = Math.min(lFoot[1], rFoot[1]);
  const floating = feetMinY > -0.6 && !opts.reclining;
  const penetration = feetMinY < -0.95;
  const com = scale(add(hips, v(skel.neck)), 0.5);
  const footXmin = Math.min(lFoot[0], rFoot[0]) - 0.06;
  const footXmax = Math.max(lFoot[0], rFoot[0]) + 0.06;
  const overSupport = com[0] >= footXmin && com[0] <= footXmax;
  return {
    contacts: [
      { body: 'leftFoot', target: 'ground', y: round(lFoot[1], 3), relation: lFoot[1] < -0.7 ? 'planted' : 'elevated' },
      { body: 'rightFoot', target: 'ground', y: round(rFoot[1], 3), relation: rFoot[1] < -0.7 ? 'planted' : 'elevated' }
    ],
    balance: {
      com_x: round(com[0], 3), com_z: round(com[2], 3),
      foot_x_range: [round(footXmin, 3), round(footXmax, 3)],
      over_support: overSupport, feet_min_y: round(feetMinY, 3),
      floating: !!floating, ground_penetration: !!penetration,
      description: overSupport ? 'COM over foot support base.' : 'COM outside foot support base (balance risk).'
    }
  };
}

function deriveAnomalies(skel) {
  const anomalies = [];
  const armL = len(sub(v(skel.leftElbow), v(skel.leftShoulder)));
  const armR = len(sub(v(skel.rightElbow), v(skel.rightShoulder)));
  if (Math.abs(armL - armR) > 0.05) anomalies.push({ type: 'asymmetric_upper_arm', left: round(armL, 3), right: round(armR, 3) });
  const thighL = len(sub(v(skel.leftKnee), v(skel.leftHip)));
  const thighR = len(sub(v(skel.rightKnee), v(skel.rightHip)));
  if (Math.abs(thighL - thighR) > 0.05) anomalies.push({ type: 'asymmetric_thigh', left: round(thighL, 3), right: round(thighR, 3) });
  if (v(skel.leftKnee)[1] > v(skel.leftHip)[1] + 0.05) anomalies.push({ type: 'knee_above_hip', side: 'L' });
  if (v(skel.rightKnee)[1] > v(skel.rightHip)[1] + 0.05) anomalies.push({ type: 'knee_above_hip', side: 'R' });
  if (v(skel.leftElbow)[1] > v(skel.leftShoulder)[1] + 0.05) anomalies.push({ type: 'elbow_above_shoulder', side: 'L', note: 'may be intended if arms overhead' });
  if (v(skel.rightElbow)[1] > v(skel.rightShoulder)[1] + 0.05) anomalies.push({ type: 'elbow_above_shoulder', side: 'R', note: 'may be intended if arms overhead' });
  const checkPen = (wr, label) => {
    const w = v(skel[wr]);
    const distSpine = Math.hypot(w[0] - v(skel.spine)[0], w[1] - v(skel.spine)[1]);
    const distHead = Math.hypot(w[0] - v(skel.head)[0], w[1] - v(skel.head)[1]);
    if (distSpine < 0.08 && Math.abs(w[2]) < 0.06) anomalies.push({ type: 'hand_near_spine', side: label, dist: round(distSpine, 3) });
    if (distHead < 0.10) anomalies.push({ type: 'hand_near_head', side: label, dist: round(distHead, 3), note: 'may be intended (face/hair touch)' });
  };
  checkPen('leftWrist', 'L');
  checkPen('rightWrist', 'R');
  return anomalies;
}

const BANDS = {
  knee_flexion: [-5, 155], elbow_flexion: [0, 155], hip_flexion: [-30, 130],
  shoulder_sagittal_flexion: [-60, 180], shoulder_abduction: [0, 180]
};
function checkPlausibility(anatomy) {
  const out = [];
  const chk = (val, band, name, ctx) => {
    if (val < band[0] - 1 || val > band[1] + 1) out.push({ joint: name, value: val, band, ctx, verdict: 'outside_band_review' });
  };
  for (const side of ['left', 'right']) {
    const arm = anatomy[side + '_arm']; const leg = anatomy[side + '_leg'];
    if (arm) {
      chk(arm.elbow_flexion_deg, BANDS.elbow_flexion, side + '_elbow', arm.description);
      chk(arm.shoulder_sagittal_flexion_deg, BANDS.shoulder_sagittal_flexion, side + '_shoulder_flexion', arm.description);
      chk(arm.shoulder_abduction_deg, BANDS.shoulder_abduction, side + '_shoulder_abduction', arm.description);
    }
    if (leg) {
      chk(leg.knee_flexion_deg, BANDS.knee_flexion, side + '_knee', leg.description);
      chk(leg.hip_flexion_deg, BANDS.hip_flexion, side + '_hip_flexion', leg.description);
    }
  }
  return out;
}

function deriveAnatomy(skel, opts) {
  opts = opts || {};
  const anatomy = {
    head: deriveHead(skel), torso: deriveTorso(skel), pelvis: derivePelvis(skel),
    left_arm: deriveArm('L', skel), right_arm: deriveArm('R', skel),
    left_leg: deriveLeg('L', skel), right_leg: deriveLeg('R', skel),
    contacts: [], balance: {}, anomalies: []
  };
  const cb = deriveContactsBalance(skel, opts);
  anatomy.contacts = cb.contacts; anatomy.balance = cb.balance;
  anatomy.anomalies = deriveAnomalies(skel);
  anatomy.plausibility_flags = checkPlausibility(anatomy);
  anatomy.overall_confidence = opts.confidence || 0.7;
  return anatomy;
}

function geometryHash(skel) {
  const keys = ['head', 'neck', 'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
    'leftWrist', 'rightWrist', 'spine', 'hips', 'leftHip', 'rightHip', 'leftKnee', 'rightKnee',
    'leftAnkle', 'rightAnkle', 'leftFoot', 'rightFoot'];
  const s = keys.map(k => { const p = v(skel[k]); return k + ':' + p[0].toFixed(3) + ',' + p[1].toFixed(3) + ',' + p[2].toFixed(3); }).join('|');
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
  return (h >>> 0).toString(16);
}

module.exports = { deriveAnatomy, geometryHash, v, sub, len, norm, foldAngle, planarAngle, rad2deg, BANDS };
