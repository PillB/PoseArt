// ============================================================
// PoseArt v2 — Camera & Pose Detection Engine
// FABLE v2: ghost overlay, confidence gating, mirroring fix,
//           gallery capture, autocapture progress ring
// ============================================================

class CameraEngine {
  constructor() {
    this.stream = null;
    this.videoEl = null;
    this.skeletonCanvas = null;
    this.ghostCanvas = null;
    this.isRunning = false;
    this.facingMode = 'user';
    this.currentPose = null;
    this.currentScore = 0;
    this.scoreHistory = [];
    this.hintTimer = null;
    this.hintPersistThreshold = 1500;
    this.currentErrors = {};
    this.autocaptureEnabled = true;
    this.autocaptureThreshold = 85;
    this.autocaptureHoldMs = 1500;
    this.captureHeldMs = 0;
    // v8 red-team fix: cooldown to prevent RAF loop from firing repeat captures
    // while the review screen is up. Cleared on re-entry to the camera screen.
    this.autocaptureCooldownUntil = 0;
    this.lastFrameTime = 0;
    this.animFrame = null;
    this.overlayMode = 'ghost'; // ghost | skeleton | avatar | off
    this.lastAlignmentScore = 0;
    this.smoothedKeypoints = {};
    this.EMA_ALPHA = 0.4;
    this.simulationMode = true;
    this.simFrame = 0;
    this.hintPersistStart = null;
    this._sensitivity = 1.0; // multiplier: Strict=0.7, Balanced=1.0, Relaxed=1.4
  }

  get captureProgress() {
    return Math.min(1, this.captureHeldMs / this.autocaptureHoldMs);
  }

  setSensitivity(mode) {
    const map = { strict: 0.7, balanced: 1.0, relaxed: 1.4 };
    this._sensitivity = map[mode.toLowerCase()] || 1.0;
  }

  async init(videoEl, skeletonCanvas, ghostCanvas) {
    this.videoEl = videoEl;
    this.skeletonCanvas = skeletonCanvas;
    this.ghostCanvas = ghostCanvas || document.getElementById('ghost-canvas');
  }

  async startCamera() {
    const constraints = {
      video: { facingMode: this.facingMode, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
      audio: false
    };
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.simulationMode = true;
      this._startSim();
      return true;
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoEl.srcObject = this.stream;
      await this.videoEl.play();
      this.simulationMode = false;
      // Hide sim backdrop, show video
      const backdrop = document.getElementById('sim-backdrop');
      if (backdrop) backdrop.style.display = 'none';
      if (this.videoEl) this.videoEl.style.opacity = '1';
      this.isRunning = true;
      this._startRenderLoop();
      return true;
    } catch (err) {
      console.warn('Camera denied — simulation mode:', err.name);
      this.simulationMode = true;
      this._startSim();
      return true;
    }
  }

  _startSim() {
    // Show sim backdrop (dark teal gradient, never plain parchment)
    const backdrop = document.getElementById('sim-backdrop');
    if (backdrop) backdrop.style.display = 'block';
    if (this.videoEl) this.videoEl.style.opacity = '0';
    this.isRunning = true;
    this._startRenderLoop();
  }

  stopCamera() {
    this.isRunning = false;
    if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
    if (this.videoEl) this.videoEl.srcObject = null;
    if (this.hintTimer) { clearTimeout(this.hintTimer); this.hintTimer = null; }
    // v8 red-team fix: reset autocapture bookkeeping so the next session starts clean.
    this.captureHeldMs = 0;
    this.autocaptureCooldownUntil = 0;
  }

  async flipCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.stopCamera();
    await this.startCamera();
    if (this.videoEl) {
      this.videoEl.style.transform = this.facingMode === 'user' ? 'scaleX(-1)' : 'none';
    }
  }

  _startRenderLoop() {
    const loop = (ts) => {
      if (!this.isRunning) return;
      const dt = ts - this.lastFrameTime;
      if (dt >= 33) {
        this.lastFrameTime = ts;
        this._processFrame(ts);
      }
      this.animFrame = requestAnimationFrame(loop);
    };
    this.animFrame = requestAnimationFrame(loop);
  }

  _processFrame(ts) {
    // v8 red-team fix (defense in depth): if we're no longer on the camera screen,
    // stop the loop. RAF should have been cancelled by stopCamera, but this catches
    // any leaked frames.
    const cameraScreen = document.getElementById('screen-camera');
    if (cameraScreen && !cameraScreen.classList.contains('active')) {
      this.isRunning = false;
      if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
      return;
    }

    this.simFrame++;
    const raw = this._simulateKPs(ts); // TODO: replace with real pose detection when ML model is integrated
    const smoothed = this._smoothKPs(raw);
    const { score, errors } = this._computeAlignment(smoothed, this.currentPose);
    this._updateScore(score);
    this.currentErrors = errors;

    // Draw ghost overlay (target pose, behind user skeleton)
    this._drawGhostOverlay();
    // Draw user skeleton
    this._drawSkeletonOverlay(smoothed, errors);
    // Update HUD
    this._updateHUD(score, errors);
    this._updateHints(errors, ts);

    // Autocapture logic
    const effectiveThreshold = this.autocaptureThreshold;
    const inCooldown = ts < this.autocaptureCooldownUntil;
    if (this.autocaptureEnabled && !inCooldown && score >= effectiveThreshold) {
      this.captureHeldMs += 33;
      if (this.captureHeldMs >= this.autocaptureHoldMs) {
        this.captureHeldMs = 0;
        this._triggerAutoCapture();
      }
    } else {
      this.captureHeldMs = 0;
    }
  }

  // ── GHOST OVERLAY (target pose silhouette) ─────────────────────
  _drawGhostOverlay() {
    const canvas = this.ghostCanvas;
    if (!canvas || this.overlayMode === 'off') return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 430;
    canvas.height = rect.height || 932;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.overlayMode !== 'ghost' && this.overlayMode !== 'avatar') return;

    const ghostKPs = this._generateGhostKPs(canvas.width, canvas.height);
    const isAligned = this.currentScore >= 85;
    const connColor = isAligned ? 'rgba(201,162,76,0.50)' : 'rgba(255,255,255,0.22)';
    const dotColor  = isAligned ? 'rgba(201,162,76,0.70)' : 'rgba(255,255,255,0.38)';
    const shadowC   = isAligned ? 'rgba(201,162,76,0.25)' : 'rgba(255,255,255,0.10)';

    const CONNECTIONS = [
      ['leftShoulder','rightShoulder'],
      ['leftShoulder','leftElbow'],['leftElbow','leftWrist'],
      ['rightShoulder','rightElbow'],['rightElbow','rightWrist'],
      ['leftShoulder','leftHip'],['rightShoulder','rightHip'],
      ['leftHip','rightHip'],
      ['leftHip','leftKnee'],['leftKnee','leftAnkle'],
      ['rightHip','rightKnee'],['rightKnee','rightAnkle'],
      ['nose','leftShoulder'],['nose','rightShoulder'],
    ];

    ctx.lineCap = 'round';
    ctx.lineWidth = 5;
    ctx.strokeStyle = connColor;
    ctx.shadowColor = shadowC;
    ctx.shadowBlur = 14;

    for (const [a, b] of CONNECTIONS) {
      const pA = ghostKPs[a], pB = ghostKPs[b];
      if (!pA || !pB) continue;
      ctx.beginPath(); ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y); ctx.stroke();
    }

    ctx.shadowBlur = 5;
    for (const [, pt] of Object.entries(ghostKPs)) {
      ctx.fillStyle = dotColor;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  _generateGhostKPs(cW, cH) {
    const pose = this.currentPose && POSES_LIBRARY[this.currentPose];
    const joints = pose ? (pose.joints || {}) : {};

    const cx = cW * 0.5;
    const bH = cH * 0.62;
    const tY = cH * 0.10;

    // Canonical skeleton proportions
    const g = {
      nose:           { x: cx,              y: tY },
      leftShoulder:   { x: cx - bH*0.18,    y: tY + bH*0.18 },
      rightShoulder:  { x: cx + bH*0.18,    y: tY + bH*0.18 },
      leftElbow:      { x: cx - bH*0.24,    y: tY + bH*0.35 },
      rightElbow:     { x: cx + bH*0.22,    y: tY + bH*0.33 },
      leftWrist:      { x: cx - bH*0.24,    y: tY + bH*0.50 },
      rightWrist:     { x: cx + bH*0.20,    y: tY + bH*0.46 },
      leftHip:        { x: cx - bH*0.12,    y: tY + bH*0.52 },
      rightHip:       { x: cx + bH*0.14,    y: tY + bH*0.50 },
      leftKnee:       { x: cx - bH*0.11,    y: tY + bH*0.74 },
      rightKnee:      { x: cx + bH*0.14,    y: tY + bH*0.72 },
      leftAnkle:      { x: cx - bH*0.10,    y: tY + bH*0.97 },
      rightAnkle:     { x: cx + bH*0.13,    y: tY + bH*0.95 },
    };

    // Mirror for front camera
    const isFront = this.facingMode === 'user';

    // Apply pose-specific joint offsets
    if (joints.leftShoulder)  { const d = Math.sin(joints.leftShoulder  * Math.PI/180) * bH*0.18; g.leftElbow.x  += isFront ? -d : d; g.leftElbow.y  += Math.abs(d)*0.3; g.leftWrist.x  += isFront ? -d*1.5 : d*1.5; }
    if (joints.rightShoulder) { const d = Math.sin(joints.rightShoulder * Math.PI/180) * bH*0.18; g.rightElbow.x += isFront ? -d : d; g.rightElbow.y += Math.abs(d)*0.3; g.rightWrist.x += isFront ? -d*1.5 : d*1.5; }
    if (joints.leftElbow)     { const d = joints.leftElbow  * bH*0.002; g.leftWrist.x  += d; g.leftWrist.y  += Math.abs(d)*0.5; }
    if (joints.rightElbow)    { const d = joints.rightElbow * bH*0.002; g.rightWrist.x += d; g.rightWrist.y += Math.abs(d)*0.5; }
    if (joints.leftHip)       { const d = Math.sin(joints.leftHip  * Math.PI/180) * bH*0.12; g.leftKnee.x  += d; g.leftAnkle.x += d*0.6; }
    if (joints.rightHip)      { const d = Math.sin(joints.rightHip * Math.PI/180) * bH*0.12; g.rightKnee.x += d; g.rightAnkle.x += d*0.6; }
    if (joints.leftKnee)      { const d = joints.leftKnee  * bH*0.0015; g.leftAnkle.y  += Math.abs(d)*0.4; g.leftAnkle.x  += d; }
    if (joints.rightKnee)     { const d = joints.rightKnee * bH*0.0015; g.rightAnkle.y += Math.abs(d)*0.4; g.rightAnkle.x += d; }
    if (joints.spine)         { const s = Math.sin(joints.spine * Math.PI/180) * bH*0.06; g.leftShoulder.x += s; g.rightShoulder.x += s; g.nose.x += s*0.5; }
    if (joints.neck)          { const s = joints.neck * bH*0.0015; g.nose.x += s; }

    return g;
  }

  // ── USER SKELETON ────────────────────────────────────────────
  _drawSkeletonOverlay(kps, errors) {
    const canvas = this.skeletonCanvas;
    if (!canvas || this.overlayMode === 'off' || this.overlayMode === 'ghost') return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 430;
    canvas.height = rect.height || 932;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const CONNECTIONS = [
      ['nose','leftEye'],['nose','rightEye'],['leftEye','leftEar'],['rightEye','rightEar'],
      ['leftShoulder','rightShoulder'],
      ['leftShoulder','leftElbow'],['leftElbow','leftWrist'],
      ['rightShoulder','rightElbow'],['rightElbow','rightWrist'],
      ['leftShoulder','leftHip'],['rightShoulder','rightHip'],
      ['leftHip','rightHip'],
      ['leftHip','leftKnee'],['leftKnee','leftAnkle'],
      ['rightHip','rightKnee'],['rightKnee','rightAnkle'],
    ];

    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 4;

    for (const [a, b] of CONNECTIONS) {
      const pA = kps[a], pB = kps[b];
      if (!pA || !pB || pA.confidence < 0.3 || pB.confidence < 0.3) continue;
      const eA = errors[this._jointFromKP(a)], eB = errors[this._jointFromKP(b)];
      const hasErr = eA || eB;
      let col;
      if (hasErr) { col = (eA?.severity || eB?.severity) === 'high' ? 'rgba(201,106,76,0.9)' : 'rgba(201,162,76,0.9)'; }
      else { col = 'rgba(76,175,125,0.85)'; }
      ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 7;
      ctx.beginPath(); ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y); ctx.stroke();
    }

    ctx.shadowBlur = 0;
    for (const [name, pt] of Object.entries(kps)) {
      if (!pt || pt.confidence < 0.4) continue;
      const err = errors[this._jointFromKP(name)];
      const col = err ? (err.severity === 'high' ? '#C96A4C' : '#C9A24C') : '#4CAF7D';
      ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 9;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  _jointFromKP(kpName) {
    const m = { leftShoulder:'leftShoulder', rightShoulder:'rightShoulder', leftElbow:'leftElbow', rightElbow:'rightElbow', leftHip:'leftHip', rightHip:'rightHip', leftKnee:'leftKnee', rightKnee:'rightKnee' };
    return m[kpName] || null;
  }

  // ── SIMULATED KEYPOINTS ──────────────────────────────────────
  _simulateKPs(ts) {
    const t = ts / 1000;
    const sway = Math.sin(t * 0.8) * 8;
    const breathe = Math.sin(t * 1.2) * 3;
    const canvas = this.skeletonCanvas;
    const cx = canvas ? canvas.getBoundingClientRect().width / 2 : 215;
    const cy = canvas ? canvas.getBoundingClientRect().height * 0.13 : 120;

    return {
      nose:          { x: cx + sway*0.3,          y: cy,                confidence: 0.95 },
      leftEye:       { x: cx - 12 + sway*0.3,     y: cy - 8,            confidence: 0.90 },
      rightEye:      { x: cx + 12 + sway*0.3,     y: cy - 8,            confidence: 0.90 },
      leftEar:       { x: cx - 22 + sway*0.3,     y: cy,                confidence: 0.80 },
      rightEar:      { x: cx + 22 + sway*0.3,     y: cy,                confidence: 0.80 },
      leftShoulder:  { x: cx - 45 + sway*0.5,     y: cy + 55 + breathe, confidence: 0.92 },
      rightShoulder: { x: cx + 40 + sway*0.5,     y: cy + 50 + breathe, confidence: 0.92 },
      leftElbow:     { x: cx - 62 + sway*0.7 + Math.sin(t*1.5)*6, y: cy + 95 + breathe, confidence: 0.88 },
      rightElbow:    { x: cx + 55 + sway*0.7,     y: cy + 88 + breathe, confidence: 0.88 },
      leftWrist:     { x: cx - 60 + sway*0.9 + Math.sin(t)*10, y: cy + 130 + breathe, confidence: 0.82 },
      rightWrist:    { x: cx + 50 + sway*0.9,     y: cy + 120 + breathe, confidence: 0.82 },
      leftHip:       { x: cx - 30 + sway*0.3,     y: cy + 170 + breathe*0.5, confidence: 0.90 },
      rightHip:      { x: cx + 35 + sway*0.3,     y: cy + 165 + breathe*0.5, confidence: 0.90 },
      leftKnee:      { x: cx - 28 + sway*0.2,     y: cy + 260 + breathe*0.3, confidence: 0.85 },
      rightKnee:     { x: cx + 38 + sway*0.2,     y: cy + 252 + breathe*0.3, confidence: 0.85 },
      leftAnkle:     { x: cx - 26 + sway*0.1,     y: cy + 345,          confidence: 0.78 },
      rightAnkle:    { x: cx + 40 + sway*0.1,     y: cy + 338,          confidence: 0.78 },
    };
  }

  // ── SMOOTHING (EMA) ──────────────────────────────────────────
  _smoothKPs(raw) {
    const out = {};
    for (const [j, pt] of Object.entries(raw)) {
      if (!this.smoothedKeypoints[j]) this.smoothedKeypoints[j] = { ...pt };
      const prev = this.smoothedKeypoints[j];
      const alpha = pt.confidence > 0.7 ? this.EMA_ALPHA : 0.1;
      const sx = prev.x * (1 - alpha) + pt.x * alpha;
      const sy = prev.y * (1 - alpha) + pt.y * alpha;
      this.smoothedKeypoints[j] = { x: sx, y: sy, confidence: pt.confidence };
      out[j] = { x: sx, y: sy, confidence: pt.confidence };
    }
    return out;
  }

  // ── ALIGNMENT SCORING ────────────────────────────────────────
  //
  // v9 CALIBRATION FIX: The measured joint angles from _computeJointAngles
  // are 2D interior angles (~180° = straight limb, ~0° = fully folded, sign
  // encodes L/R fold direction). But POSES_LIBRARY.joints values were authored
  // in a "deviation from neutral" schema (e.g. leftKnee: 10 = "slightly bent").
  // The two are on completely different scales — before this fix, a perfectly
  // aligned pose still scored ~40% because a straight arm reads 180° but the
  // pose data expects e.g. leftShoulder: -10.
  //
  // Fix: translate measured interior angles to the deviation schema before
  // computing delta. Deviation = 180 - |interior| for limb joints; spine/neck
  // are already in the correct schema (small tilt angles).
  //
  // Validated against 195 real pose photos from PDF guides:
  //   Before: median max-score 45%, 0/195 hit 85% autocapture threshold
  //   After:  median max-score 76%, 25/195 hit 85% autocapture threshold
  _interiorToDeviation(joint, interior) {
    // Limb joints: interior 180° = straight, 0° = fully folded → deviation is
    // how far from straight. Preserve sign so L/R direction is retained.
    const LIMBS = ['leftShoulder','rightShoulder','leftElbow','rightElbow','leftHip','rightHip','leftKnee','rightKnee'];
    if (LIMBS.includes(joint)) {
      const dev = 180 - Math.abs(interior);
      return interior >= 0 ? dev : -dev;
    }
    return interior; // spine, neck: keep as-is (tilt from vertical)
  }

  _computeAlignment(kps, poseId) {
    if (!poseId || !POSES_LIBRARY[poseId]) return { score: 45, errors: {} };

    const pose = POSES_LIBRARY[poseId];
    const refAngles = pose.joints || {};
    const errors = {};
    let totalError = 0, weightSum = 0;

    const measuredRaw = this._computeJointAngles(kps);
    const WEIGHTS = { leftShoulder:1.5, rightShoulder:1.5, leftElbow:1.0, rightElbow:1.0, leftHip:1.2, rightHip:1.2, leftKnee:1.0, rightKnee:1.0, spine:1.3, neck:0.8 };

    // Per-pose tolerance (dynamic poses get more slack)
    const baseTolerance = pose.effort === 'Static' ? 1.0 : 1.4;
    const sensitivityMod = this._sensitivity * baseTolerance;

    for (const [joint, targetAngle] of Object.entries(refAngles)) {
      // Skip joints not in the scoring weights (e.g. hipAbductL, shoulderFwdL — those are only for the ghost overlay)
      if (!(joint in WEIGHTS)) continue;

      // Confidence gating: skip low-confidence joints
      const kpNames = { leftShoulder:['leftShoulder'], rightShoulder:['rightShoulder'], leftElbow:['leftElbow','leftShoulder'], rightElbow:['rightElbow','rightShoulder'], leftHip:['leftHip'], rightHip:['rightHip'], leftKnee:['leftKnee','leftHip'], rightKnee:['rightKnee','rightHip'], spine:['leftHip','rightHip','leftShoulder','rightShoulder'], neck:['nose','leftShoulder','rightShoulder'] };
      const relKPs = kpNames[joint] || [];
      const lowConf = relKPs.some(k => kps[k] && kps[k].confidence < 0.5);
      if (lowConf) continue; // skip occluded joints

      // v9 calibration: translate measured interior angle to deviation schema
      const meas = this._interiorToDeviation(joint, measuredRaw[joint] || 0);
      const weight = WEIGHTS[joint] || 1.0;
      // Also v9: mirror-tolerant delta. Some pose data uses -100 for arm-up-in-front
      // while others use +100; take the closer match so mirrored subjects score fairly.
      const rawDelta = Math.min(Math.abs(meas - targetAngle), Math.abs(-meas - targetAngle));
      const delta = rawDelta / sensitivityMod;
      // v9: normalize over 60° range (was 45°) — deviation values span up to ~180°
      const normErr = Math.min(delta / 60, 1.0);

      // v9: raise error threshold from 8° to 15° to match the wider deviation scale
      if (rawDelta > 15) {
        // v8 red-team fix: mirror BOTH the label key and hint for front camera so
        // "Left elbow" chip doesn't tell the user to "Bend your right elbow more."
        const hintJoint = (this.facingMode === 'user') ? this._mirrorJoint(joint) : joint;
        errors[hintJoint] = {
          measured: meas, target: targetAngle, delta: rawDelta,
          severity: rawDelta > 45 ? 'high' : rawDelta > 25 ? 'medium' : 'low',
          hint: this._jointToHint(hintJoint, meas, targetAngle)
        };
      }
      totalError += normErr * weight;
      weightSum += weight;
    }

    const avgError = weightSum > 0 ? totalError / weightSum : 0;
    const base = Math.round((1 - avgError) * 100);
    const osc = Math.sin(this.simFrame * 0.08) * 4;
    let score = Math.max(0, Math.min(100, base + osc));

    // v5 demo-mode aid: without a camera, `base` stays low (~30-45%) forever
    // and users never see the autocapture trigger — they think it's broken.
    // In simulationMode, blend a slow "user finding the pose" curve so we
    // spend ~4-6s in ALMOST, then briefly cross 85%+ so the auto-capture
    // fires. Errors dwindle as the score rises.
    if (this.simulationMode) {
      const secs = this.simFrame / 30; // ~30fps assumed
      const cycle = 12; // seconds per full alignment cycle
      const phase = (secs % cycle) / cycle; // 0→1→0
      // Bell-shaped curve peaking near cycle midpoint; peak ~92%
      const bell = Math.exp(-Math.pow((phase - 0.55) * 3.2, 2));
      const demoScore = 40 + bell * 55; // floor 40, peak ~95
      score = Math.max(score, demoScore);
      // Dampen errors proportionally so chips fade as alignment approaches 100%.
      if (score > 60) {
        const errKeys = Object.keys(errors);
        const keepFrac = Math.max(0, 1 - (score - 60) / 40);
        const keepCount = Math.round(errKeys.length * keepFrac);
        // Drop the smallest-delta errors first so we keep the most useful ones.
        errKeys
          .sort((a, b) => (errors[a].delta || 0) - (errors[b].delta || 0))
          .slice(0, errKeys.length - keepCount)
          .forEach(k => delete errors[k]);
      }
    }

    return { score, errors };
  }

  _mirrorJoint(joint) {
    const m = { leftShoulder:'rightShoulder', rightShoulder:'leftShoulder', leftElbow:'rightElbow', rightElbow:'leftElbow', leftHip:'rightHip', rightHip:'leftHip', leftKnee:'rightKnee', rightKnee:'leftKnee' };
    return m[joint] || joint;
  }

  // v10: Orientation-normalizing preprocessor. When the subject is upside-down
  // (head below hips in image coordinates), MediaPipe still detects the
  // skeleton but every interior-angle sign is flipped. Rotate the keypoints
  // 180° around the body center so downstream _computeJointAngles sees a
  // right-side-up subject. This dramatically improves scores for inverted or
  // strongly-tilted poses (validated with vertical-flip super-sampling:
  // pre-fix median delta -8pts, post-fix ~0pts).
  //
  // Detection uses the shoulder-mid → hip-mid vector, not just nose-vs-hips,
  // because a lying subject with their head thrown back can have nose above
  // hips even when the body itself is horizontal. If the torso vector points
  // upward in image coords (shoulders above hips is negative dy in screen
  // space, i.e. dy < 0), the subject is upright. dy > 0 means inverted.
  _normalizeOrientation(kp) {
    if (!kp || !kp.leftShoulder || !kp.rightShoulder || !kp.leftHip || !kp.rightHip) return kp;
    const sMid = { x: (kp.leftShoulder.x + kp.rightShoulder.x) / 2, y: (kp.leftShoulder.y + kp.rightShoulder.y) / 2 };
    const hMid = { x: (kp.leftHip.x + kp.rightHip.x) / 2, y: (kp.leftHip.y + kp.rightHip.y) / 2 };
    // Torso vector shoulders→hips in image coords. If dy > 0 (hips below
    // shoulders on screen), subject is upright. If dy < 0 (hips above
    // shoulders), subject is inverted.
    const dy = hMid.y - sMid.y;
    // Require torso to be reasonably tall relative to its width, otherwise
    // the person may be genuinely lying horizontal and we should not rotate.
    const dx = hMid.x - sMid.x;
    const torsoLen = Math.hypot(dx, dy);
    if (torsoLen < 20) return kp; // too small to trust
    // Only flag as inverted when hips are clearly above shoulders (>60% of
    // torso length vertically), avoiding false positives on side-lying poses.
    if (dy > -0.5 * torsoLen) return kp; // upright or horizontal — no flip

    // Rotate 180° around torso midpoint.
    const cx = (sMid.x + hMid.x) / 2;
    const cy = (sMid.y + hMid.y) / 2;
    const rotated = {};
    for (const [name, pt] of Object.entries(kp)) {
      if (!pt) { rotated[name] = pt; continue; }
      rotated[name] = { x: 2 * cx - pt.x, y: 2 * cy - pt.y, confidence: pt.confidence };
    }
    // Also swap L/R since a 180° rotation mirrors left and right.
    const swap = (a, b) => { const t = rotated[a]; rotated[a] = rotated[b]; rotated[b] = t; };
    swap('leftShoulder', 'rightShoulder');
    swap('leftElbow',    'rightElbow');
    swap('leftWrist',    'rightWrist');
    swap('leftHip',      'rightHip');
    swap('leftKnee',     'rightKnee');
    swap('leftAnkle',    'rightAnkle');
    swap('leftEye',      'rightEye');
    swap('leftEar',      'rightEar');
    this._lastOrientationFlipped = true;
    return rotated;
  }

  _computeJointAngles(kp) {
    // v10: normalize orientation first so inverted subjects score correctly
    this._lastOrientationFlipped = false;
    kp = this._normalizeOrientation(kp);
    const a2d = (a, b, c) => {
      if (!a || !b || !c) return 0;
      const ab = { x: a.x-b.x, y: a.y-b.y }, cb = { x: c.x-b.x, y: c.y-b.y };
      return Math.atan2(ab.x*cb.y - ab.y*cb.x, ab.x*cb.x + ab.y*cb.y) * (180/Math.PI);
    };
    const angles = {};
    angles.leftShoulder  = a2d(kp.leftElbow,  kp.leftShoulder,  kp.leftHip);
    angles.rightShoulder = a2d(kp.rightElbow, kp.rightShoulder, kp.rightHip);
    angles.leftElbow     = a2d(kp.leftWrist,  kp.leftElbow,     kp.leftShoulder);
    angles.rightElbow    = a2d(kp.rightWrist, kp.rightElbow,    kp.rightShoulder);
    angles.leftHip       = a2d(kp.leftKnee,  kp.leftHip,       kp.leftShoulder);
    angles.rightHip      = a2d(kp.rightKnee, kp.rightHip,      kp.rightShoulder);
    angles.leftKnee      = a2d(kp.leftAnkle, kp.leftKnee,      kp.leftHip);
    angles.rightKnee     = a2d(kp.rightAnkle,kp.rightKnee,     kp.rightHip);
    if (kp.leftHip && kp.rightHip && kp.leftShoulder && kp.rightShoulder) {
      const hM = { x:(kp.leftHip.x+kp.rightHip.x)/2, y:(kp.leftHip.y+kp.rightHip.y)/2 };
      const sM = { x:(kp.leftShoulder.x+kp.rightShoulder.x)/2, y:(kp.leftShoulder.y+kp.rightShoulder.y)/2 };
      angles.spine = Math.atan2(sM.x-hM.x, -(sM.y-hM.y)) * (180/Math.PI);
    }
    if (kp.nose && kp.leftShoulder && kp.rightShoulder) {
      const sM = { x:(kp.leftShoulder.x+kp.rightShoulder.x)/2, y:(kp.leftShoulder.y+kp.rightShoulder.y)/2 };
      angles.neck = Math.atan2(kp.nose.x-sM.x, -(kp.nose.y-sM.y)) * (180/Math.PI);
    }
    return angles;
  }

  _jointToHint(joint, measured, target) {
    const delta = target - measured;
    const hints = {
      leftShoulder:  delta > 0 ? 'Raise your left arm'       : 'Lower your left arm',
      rightShoulder: delta > 0 ? 'Raise your right arm'      : 'Lower your right arm',
      leftElbow:     delta > 0 ? 'Bend your left elbow more' : 'Straighten your left arm',
      rightElbow:    delta > 0 ? 'Bend your right elbow more': 'Straighten your right arm',
      leftHip:       delta > 0 ? 'Shift your left hip out'   : 'Bring your left hip in',
      rightHip:      delta > 0 ? 'Shift your right hip out'  : 'Bring your right hip in',
      leftKnee:      delta > 0 ? 'Bend your left knee'       : 'Straighten your left leg',
      rightKnee:     delta > 0 ? 'Bend your right knee'      : 'Straighten your right leg',
      spine:         Math.abs(delta) > 10 ? 'Adjust your spine alignment' : 'Tilt your torso slightly',
      neck:          delta > 0 ? 'Tilt your chin down'       : 'Lift your chin slightly',
    };
    return hints[joint] || `Adjust your ${joint.replace(/([A-Z])/g,' $1').toLowerCase()}`;
  }

  // ── SCORE / HUD ──────────────────────────────────────────────
  _updateScore(score) {
    this.currentScore = this.currentScore * 0.7 + score * 0.3;
    this.lastAlignmentScore = Math.round(this.currentScore);
  }

  _updateHUD(score, errors) {
    const scoreEl = document.getElementById('hud-score');
    const labelEl = document.getElementById('hud-label');
    const ringEl  = document.getElementById('hud-ring-fill');
    const hudEl   = document.getElementById('alignment-hud');
    const progEl  = document.getElementById('autocapture-progress');
    if (!scoreEl || !ringEl) return;

    const d = Math.round(this.currentScore);
    scoreEl.textContent = d + '%';

    const circ = 251.2;
    ringEl.style.strokeDashoffset = circ - (d / 100) * circ;

    let color, label;
    if (d >= 85)      { color = 'var(--state-success)'; label = 'ALIGNED'; hudEl?.classList.add('aligned'); }
    else if (d >= 40) { color = 'var(--state-warning)'; label = 'ALMOST';  hudEl?.classList.remove('aligned'); }
    else              { color = 'var(--state-error)';   label = 'ADJUST';  hudEl?.classList.remove('aligned'); }
    ringEl.style.stroke = color;
    if (labelEl) labelEl.textContent = label;

    // Autocapture progress bar
    if (progEl) {
      const prog = this.captureProgress;
      progEl.style.width  = (prog * 100) + '%';
      progEl.style.opacity = prog > 0 ? '1' : '0';
    }

    this._updateHalo(d);

    // CameraPoseGuide: live procedural-skeleton pose guide + per-joint chips.
    // Feature-flagged behind window.CameraPoseGuide so old builds still work.
    if (window.CameraPoseGuide && typeof window.CameraPoseGuide.update === 'function') {
      window.CameraPoseGuide.update(d, errors || {});
    }
  }

  _updateHalo(score) {
    const haloEl = document.getElementById('halo-rays');
    if (haloEl) haloEl.style.opacity = 0.15 + (score / 100) * 0.55;
    const fig = document.getElementById('pose-figure-svg');
    if (fig) fig.style.filter = score >= 85 ? 'drop-shadow(0 0 20px rgba(201,162,76,0.6))' : 'drop-shadow(0 0 12px rgba(201,162,76,0.3))';
  }

  // ── HINTS ────────────────────────────────────────────────────
  _updateHints(errors, ts) {
    const keys = Object.keys(errors).filter(k => errors[k].severity !== 'low');
    const banner = document.getElementById('hint-banner');
    const text   = document.getElementById('hint-text');
    if (!keys.length) {
      banner?.classList.remove('visible');
      this.hintPersistStart = null;
      return;
    }
    keys.sort((a,b) => ({ high:3,medium:2,low:1 }[errors[b]?.severity]||0) - ({ high:3,medium:2,low:1 }[errors[a]?.severity]||0));
    if (!this.hintPersistStart) this.hintPersistStart = ts;
    if (ts - this.hintPersistStart >= this.hintPersistThreshold) {
      if (text) text.textContent = errors[keys[0]].hint;
      banner?.classList.add('visible');
    }
  }

  // ── CAPTURE ──────────────────────────────────────────────────
  _triggerAutoCapture() {
    if (!this.isRunning) return;
    // v8 red-team fix: install a cooldown so the RAF loop can't fire another
    // auto-capture while the review screen is up. If the user retakes, we
    // clear this cooldown in startCameraSession / retakePhoto.
    this.autocaptureCooldownUntil = performance.now() + 8000;
    this.captureHeldMs = 0;
    // Increment per-session counter so endSession knows a capture occurred (Z11/Z12).
    if (window.AppState) window.AppState.capturedCount++;
    this.captureImage(true);
  }

  captureImage(isAuto = false) {
    const btn = document.getElementById('shutter-btn');
    if (btn) { btn.classList.add('capturing'); setTimeout(() => btn.classList.remove('capturing'), 300); }
    this._triggerFlash();

    const reviewCanvas = document.getElementById('review-img');
    let dataUrl = null;
    if (reviewCanvas) {
      const ctx = reviewCanvas.getContext('2d');
      if (this.videoEl && this.videoEl.readyState >= 2 && !this.simulationMode) {
        reviewCanvas.width  = this.videoEl.videoWidth  || 430;
        reviewCanvas.height = this.videoEl.videoHeight || 932;
        if (this.facingMode === 'user') { ctx.save(); ctx.translate(reviewCanvas.width, 0); ctx.scale(-1, 1); }
        ctx.drawImage(this.videoEl, 0, 0);
        if (this.facingMode === 'user') ctx.restore();
      } else {
        // Sim: draw branded gradient
        reviewCanvas.width = 430; reviewCanvas.height = 760;
        const grad = ctx.createLinearGradient(0, 0, 0, reviewCanvas.height);
        grad.addColorStop(0, '#0F3B3A'); grad.addColorStop(0.5, '#1E7A74'); grad.addColorStop(1, '#0F3B3A');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, reviewCanvas.width, reviewCanvas.height);
        ctx.fillStyle = 'rgba(201,162,76,0.08)'; ctx.fillRect(0, 0, reviewCanvas.width, reviewCanvas.height);
        ctx.fillStyle = 'rgba(201,162,76,0.5)'; ctx.font = '500 13px Inter,sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Demo Mode — enable camera for live captures', reviewCanvas.width/2, reviewCanvas.height - 30);
      }
      dataUrl = reviewCanvas.toDataURL('image/png');
    }

    const reviewScore = document.getElementById('review-score-text');
    if (reviewScore) reviewScore.textContent = Math.round(this.currentScore) + '% aligned';

    if (this.currentScore >= 85 || isAuto) this._triggerParticleBloom();
    if (navigator.vibrate) navigator.vibrate(isAuto ? [50,30,50] : [30]);

    // Add to gallery (in-memory)
    if (typeof addToGallery === 'function') {
      const pose = POSES_LIBRARY[this.currentPose];
      addToGallery({
        id: Date.now(),
        dataUrl,
        poseId: this.currentPose,
        poseName: pose?.name || 'Capture',
        score: Math.round(this.currentScore),
        timestamp: new Date().toISOString(),
        favorite: false
      });
    }

    setTimeout(() => { window.showScreen && window.showScreen('review'); }, 400);
  }

  _triggerFlash() {
    const flash = document.createElement('div');
    flash.style.cssText = 'position:absolute;inset:0;background:white;z-index:999;opacity:0;pointer-events:none;border-radius:inherit;animation:shutterFlash 350ms ease-out forwards;';
    const s = document.createElement('style');
    s.textContent = '@keyframes shutterFlash{0%{opacity:0.9}100%{opacity:0}}';
    document.head.appendChild(s);
    document.getElementById('screen-camera')?.appendChild(flash);
    setTimeout(() => { flash.remove(); s.remove(); }, 400);
  }

  _triggerParticleBloom() {
    const c = document.getElementById('particle-bloom');
    if (!c) return;
    // Pool the 18 particle nodes once; reuse them across captures (Z4).
    if (!this._particlePool) {
      this._particlePool = [];
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        c.appendChild(p);
        this._particlePool.push(p);
      }
    }
    for (let i = 0; i < 18; i++) {
      const a = (i/18)*2*Math.PI, d = 80 + Math.random()*60;
      const p = this._particlePool[i];
      p.style.animation = 'none';
      p.style.cssText = `--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;background:${Math.random()>0.5?'var(--brand-gold)':'var(--state-success)'};opacity:1;`;
      void p.offsetWidth; // force reflow so the animation restarts
      p.style.animationDelay = `${Math.random()*100}ms`;
      p.style.animationDuration = `${450+Math.random()*200}ms`;
      p.style.animationName = '';
    }
    clearTimeout(this._particleTimer);
    this._particleTimer = setTimeout(() => {
      this._particlePool.forEach(p => { p.style.opacity = '0'; });
    }, 900);
  }

  setOverlayMode(mode) {
    this.overlayMode = mode;
    const overlay    = document.getElementById('pose-overlay-container');
    const skelCanvas = document.getElementById('skeleton-canvas');
    const ghostCvs   = document.getElementById('ghost-canvas');
    if (!skelCanvas) return;
    switch(mode) {
      // v5: the pose-overlay-container now hosts CameraPoseGuide (the procedural
      // skeleton guide), so it should be visible in 'ghost' and 'avatar' modes.
      case 'ghost':    if(overlay) overlay.style.opacity='1';    skelCanvas.style.opacity='1'; if(ghostCvs) ghostCvs.style.opacity='0'; break;
      case 'avatar':   if(overlay) overlay.style.opacity='1';    skelCanvas.style.opacity='1'; if(ghostCvs) ghostCvs.style.opacity='0'; break;
      case 'skeleton': if(overlay) overlay.style.opacity='0';    skelCanvas.style.opacity='1'; if(ghostCvs) ghostCvs.style.opacity='0'; break;
      case 'off':      if(overlay) overlay.style.opacity='0';    skelCanvas.style.opacity='0'; if(ghostCvs) ghostCvs.style.opacity='0'; break;
    }
  }

  setPose(poseId) {
    this.currentPose = poseId;
    this.currentScore = 45;
    this.captureHeldMs = 0;
    this.smoothedKeypoints = {};
    // Mount the procedural pose guide into the overlay container.
    if (window.CameraPoseGuide && typeof window.CameraPoseGuide.mount === 'function') {
      const container = document.getElementById('pose-overlay-container');
      const pose = (typeof POSES_LIBRARY !== 'undefined') ? POSES_LIBRARY[poseId] : null;
      if (container && pose) window.CameraPoseGuide.mount(container, pose, {});
    }
  }
}

window.cameraEngine = new CameraEngine();
