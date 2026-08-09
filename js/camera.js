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
    this._lastAnnouncedScore = null;
    this._lastAnnouncedLabel = null;
    this.tourMode = false;
    this.flowMode = false;
    // --- Solarize real-pipeline integration (replaces _simulateKPs in real mode) ---
    this.solarize = null;            // window.PoseArtSolarize reference
    this.solarizeEngine = null;      // SolarizeEngine instance
    this.solarizeProfile = null;     // active runtime profile
    this.solarizeActive = false;     // true when a real/deterministic model drives keypoints
    this.deterministicSource = null; // DeterministicFrameSource for no-camera demo
    this._solarizeLastResult = null;
    this._demoFrameCount = 0;
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

  async _processFrame(ts) {
    // Lazy-init the Solarize real pipeline (camera pixels → keypoints).
    if (!this.solarizeEngine) this._initSolarize();
    // Route to the Solarize path when the activation manager exists (even
    // while loading — _processFrameSolarize handles the readiness gate) OR
    // when a ready model is present.
    if (this.solarizeEngine && (this._modelManager || (this.solarizeEngine.model && this.solarizeEngine.model.ready))) {
      return this._processFrameSolarize(ts);
    }

    // ---- SIMULATION fallback (legacy D1 path): clock-driven keypoints. ----
    // Visibly labelled; NO real achievements, NO auto-capture, NO score history.
    this.simFrame++;
    this._simulationLabel = true;
    const raw = this._simulateKPs(ts);
    const smoothed = this._smoothKPs(raw);
    const { score, errors } = this._computeAlignment(smoothed, this.currentPose);
    this._updateScore(score);
    this.currentErrors = errors;
    this._drawGhostOverlay();
    this._drawSkeletonOverlay(smoothed, errors);
    this._updateHUD(score, errors, { simulation: true });
    this._updateHints(errors, ts);
    this._renderSimulationStatus();
    // Auto-capture + achievements are DISABLED in simulation (Solarize §7).
    this.captureHeldMs = 0;
  }

  _renderSimulationStatus() {
    let el = document.getElementById('solarize-status');
    if (!el) {
      el = document.createElement('div');
      el.id = 'solarize-status';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.style.cssText = 'position:absolute;top:8px;left:8px;right:8px;z-index:20;font-size:11px;line-height:1.3;padding:6px 8px;border-radius:8px;background:rgba(15,28,28,0.72);color:#e8e2d0;pointer-events:none;backdrop-filter:blur(4px);';
      const cam = document.getElementById('camera-screen') || this.skeletonCanvas?.parentElement;
      if (cam) cam.appendChild(el);
    }
    el.innerHTML = '<b style="color:#e0b070">SIMULATION</b> · clock-driven keypoints · <i>no real camera intelligence — achievements &amp; auto-capture disabled</i>';
    this._renderModeBadge(true);
  }

  // Solarize §7: a persistent, always-visible SIM/REAL badge on the camera screen.
  _renderModeBadge(isSim) {
    let badge = document.getElementById('cam-mode-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'cam-mode-badge';
      badge.className = 'cam-mode-badge';
      const cam = document.getElementById('camera-screen') || this.skeletonCanvas?.parentElement;
      if (cam) cam.appendChild(badge);
    }
    badge.className = 'cam-mode-badge ' + (isSim ? 'sim' : 'real');
    badge.textContent = isSim ? 'SIMULATION' : 'REAL';
    badge.setAttribute('aria-label', isSim ? 'Simulation mode — synthetic keypoints' : 'Real camera inference');
  }

  // ── SOLARIZE REAL PIPELINE ───────────────────────────────────
  // Wires camera/deterministic frames → model → adapter → tracker →
  // role assignment → gated scorer → coach → auto-capture.
  _initSolarize() {
    if (this.solarizeEngine || !window.PoseArtSolarize) return;
    this.solarize = window.PoseArtSolarize;
    const caps = this.solarize.detectCapabilities ? this.solarize.detectCapabilities() : {
      hasCamera: !!(this.stream && this.videoEl && this.videoEl.videoWidth),
      cameraGranted: !!this.stream,
      webgpu: typeof navigator !== 'undefined' && !!navigator.gpu,
      wasm: typeof WebAssembly !== 'undefined',
      worker: typeof Worker !== 'undefined',
      offscreenCanvas: typeof OffscreenCanvas !== 'undefined',
    };
    caps.hasCamera = !!(this.stream && this.videoEl && this.videoEl.videoWidth);
    caps.cameraGranted = !!this.stream;
    // No real camera → deterministic demo profile (pixels→keypoints via a
    // synthetic detector). Clearly labelled; NOT a real-camera performance claim.
    const profile = caps.hasCamera ? this.solarize.negotiateProfile(caps) : this.solarize.PROFILES.RGB_COMPATIBLE;
    this.solarizeProfile = profile;
    const engine = new this.solarize.SolarizeEngine({ profile });
    engine.mirror = this.facingMode === 'user';
    // Solarize §8/§9: hardened model activation via ModelActivationManager.
    // Negotiates model+backend, falls back WebGPU→WASM→deterministic (labelled),
    // gates detect() on readiness, recovers from model-load failure, throttles
    // in background. Optional Web Worker inference off the main UI path.
    const mgr = new this.solarize.ModelActivationManager({ useWorker: caps.worker });
    const modelId = caps.hasCamera ? this.solarize.chooseDefaultModel(profile, caps) : 'deterministic-test';
    // Start activation async; the render loop blocks on readiness via waitReady.
    mgr.activate({ modelId }).then(() => {
      engine.model = mgr;
      // Surface status to the HUD.
      this._modelStatus = mgr.status();
      mgr.onStatus((s) => { this._modelStatus = s; });
    }).catch((e) => {
      this._modelStatus = { state: 'failed', fatalError: String(e && e.message || e), ready: false };
    });
    this._modelManager = mgr;
    this._modelActivating = true;
    // Provide a stub model so _processFrame routes to solarize; the manager
    // gates actual detect() on readiness.
    engine.model = { ready: false, modelId, fatalError: null, backend: null, lastLatencyMs: 0,
      async detect() { return { model: 'none', persons: [], dropped: true, timestamp: 0 }; } };
    if (!caps.hasCamera) {
      this.deterministicSource = new this.solarize.DeterministicFrameSource({ width: 640, height: 480 });
    }
    this.solarizeEngine = engine;
    this.solarizeActive = true;
    this._simulationLabel = false;
  }

  _buildSceneForPose(poseId) {
    if (!this.solarize) return null;
    // Couple poses use the migrated two-person PoseScene map.
    if (this.solarize.coupleScenes && this.solarize.coupleScenes[poseId]) {
      return this.solarize.coupleScenes[poseId];
    }
    // Single-person poses: wrap the procedural joints into a one-person PoseScene.
    const pose = poseId && typeof POSES_LIBRARY !== 'undefined' && POSES_LIBRARY[poseId];
    if (!pose) return null;
    return this.solarize.makePoseScene({
      sceneId: poseId, displayName: pose.name || poseId, category: pose.category || '',
      targetPeople: [this.solarize.makeTargetPerson({ roleId: 'A', roleName: 'Person A', canonicalSkeleton: pose.joints || {}, rootPosition: { x: 0.5, y: 0.5 } })],
      props: [], contacts: [],
    });
  }

  async _processFrameSolarize(ts) {
    const engine = this.solarizeEngine;
    // Only (re)set the scene when the pose changes — engine.setScene resets
    // the tracker, so calling it every frame would prevent track confirmation.
    const sceneId = this.currentPose;
    if (sceneId && sceneId !== this._lastSolarizeSceneId) {
      const scene = this._buildSceneForPose(sceneId) || engine.scene;
      if (scene) { engine.setScene(scene); this._lastSolarizeSceneId = sceneId; }
    }

    // Solarize §9: readiness gate. While the model is activating, render a
    // loading status and skip inference (no race conditions).
    const mgr = this._modelManager;
    const mgrStatus = mgr ? mgr.status() : null;
    if (mgrStatus && !mgrStatus.ready && !mgrStatus.fallback) {
      this._drawGhostOverlay();
      this._renderModelStatus(mgrStatus);
      return;
    }

    // Build the frame: real video, or deterministic descriptor for no-camera demo.
    let frame;
    if (this.stream && this.videoEl && this.videoEl.videoWidth) {
      frame = await this._captureFrame(ts);
    } else {
      frame = this._deterministicDemoFrame(ts);
    }

    // Once the manager is ready, wire it as the engine's model (idempotent).
    if (mgr && mgrStatus && (mgrStatus.ready || mgrStatus.fallback) && engine.model !== mgr) {
      engine.model = mgr;
    }

    const result = await engine.processFrame(frame);
    this._solarizeLastResult = result;
    this._simulationLabel = false;

    // Render target ghost overlay (existing procedural path).
    this._drawGhostOverlay();
    // Render the observed canonical skeleton(s) from real/deterministic keypoints.
    this._drawCanonicalSkeleton(result.detectedPersons || []);
    // Update HUD with the decomposed, gated score.
    this._updateSolarizeHUD(result);
    // Coaching hints.
    this._renderSolarizeHints(result.hints || []);
    // Auto-capture (only fires on real inference + all gates passed).
    if (result.capture && result.capture.capture) {
      this._triggerAutoCapture();
    }
  }

  // Render model-load status (loading / fallback / failed) per Solarize §9.
  _renderModelStatus(status) {
    let el = document.getElementById('solarize-status');
    if (!el) {
      el = document.createElement('div');
      el.id = 'solarize-status';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.style.cssText = 'position:absolute;top:8px;left:8px;right:8px;z-index:20;font-size:11px;line-height:1.3;padding:6px 8px;border-radius:8px;background:rgba(15,28,28,0.72);color:#e8e2d0;pointer-events:none;backdrop-filter:blur(4px);';
      const cam = document.getElementById('camera-screen') || this.skeletonCanvas?.parentElement;
      if (cam) cam.appendChild(el);
    }
    const state = status.state || 'loading';
    const label = state === 'loading' ? 'Loading pose model…'
      : state === 'failed' ? 'Model load failed: ' + (status.fatalError || 'unknown')
      : state === 'fallback' ? 'Model fell back to deterministic (real model unavailable)'
      : 'Model: ' + (status.modelId || '—');
    const color = state === 'failed' ? '#C96A4C' : state === 'fallback' ? '#C9A24C' : '#8aa39e';
    el.innerHTML = `<b style="color:${color}">${label}</b>` +
      (status.backend ? ` · backend: ${status.backend}` : '') +
      (status.usingWorker ? ' · worker:on' : '') +
      (state === 'failed' ? ' · <button onclick="window.cameraEngine._modelManager && window.cameraEngine._modelManager.retry({modelId:\'' + (status.modelId || 'deterministic-test') + '\'})" style="pointer-events:auto;background:#C9A24C;border:none;border-radius:4px;padding:2px 8px;color:#0e1a1a;font-size:10px;cursor:pointer">Retry</button>' : '');
  }

  // Deterministic demo frame: a standing figure whose arms move with time.
  // Keypoints are ENCODED IN THE FRAME DESCRIPTOR (pixels), so the model
  // reads them back — camera movement changes keypoints (D1 fix).
  _deterministicDemoFrame(ts) {
    this._demoFrameCount++;
    const t = (ts || 0) / 1000;
    const armRaise = (Math.sin(t * 0.6) * 0.5 + 0.5); // 0..1
    const cx = 0.5;
    const kp = (x, y, s = 0.9) => [x, y, s];
    const unit = 0.06;
    const elbowY = 0.40 - armRaise * 0.12;
    const wristY = 0.52 - armRaise * 0.30;
    const persons = [{
      keypoints: [
        kp(cx, 0.12), kp(cx - 0.03, 0.10), kp(cx + 0.03, 0.10), kp(cx - 0.05, 0.11), kp(cx + 0.05, 0.11),
        kp(cx - unit, 0.25), kp(cx + unit, 0.25),
        kp(cx - 2 * unit, elbowY), kp(cx + 2 * unit, elbowY),
        kp(cx - 2.5 * unit, wristY), kp(cx + 2.5 * unit, wristY),
        kp(cx - 0.7 * unit, 0.55), kp(cx + 0.7 * unit, 0.55),
        kp(cx - 0.7 * unit, 0.75), kp(cx + 0.7 * unit, 0.75),
        kp(cx - 0.7 * unit, 0.92), kp(cx + 0.7 * unit, 0.92),
      ],
    }];
    return { width: 640, height: 480, timestamp: ts, descriptor: { persons } };
  }

  _drawCanonicalSkeleton(persons) {
    const canvas = this.skeletonCanvas;
    if (!canvas || this.overlayMode === 'off' || this.overlayMode === 'ghost') return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 430;
    canvas.height = rect.height || 932;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    const CONNECTIONS = [
      ['leftShoulder','rightShoulder'], ['leftShoulder','leftElbow'], ['leftElbow','leftWrist'],
      ['rightShoulder','rightElbow'], ['rightElbow','rightWrist'],
      ['leftShoulder','leftHip'], ['rightShoulder','rightHip'], ['leftHip','rightHip'],
      ['leftHip','leftKnee'], ['leftKnee','leftAnkle'], ['rightHip','rightKnee'], ['rightKnee','rightAnkle'],
      ['nose','leftShoulder'], ['nose','rightShoulder'],
    ];
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 4;
    persons.forEach((p, idx) => {
      const lm = p.imageLandmarks || {};
      const color = idx === 0 ? 'rgba(76,175,125,0.9)' : 'rgba(201,162,76,0.9)';
      ctx.strokeStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 7;
      for (const [a, b] of CONNECTIONS) {
        const pa = lm[a], pb = lm[b];
        if (!pa || !pb || (pa.visibility || pa.confidence) < 0.3 || (pb.visibility || pb.confidence) < 0.3) continue;
        ctx.beginPath(); ctx.moveTo(pa.x * W, pa.y * H); ctx.lineTo(pb.x * W, pb.y * H); ctx.stroke();
      }
      ctx.shadowBlur = 9;
      for (const name of Object.keys(lm)) {
        const pt = lm[name];
        if (!pt || (pt.visibility || pt.confidence) < 0.4) continue;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(pt.x * W, pt.y * H, 5, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.shadowBlur = 0;
  }

  _updateSolarizeHUD(result) {
    const a = result.alignment || {};
    const score = Math.round(a.overallScore || 0);
    this.currentScore = score;
    this.lastAlignmentScore = score;
    // Solarize §7: REAL badge — real inference is active.
    this._renderModeBadge(false);
    const scoreEl = document.getElementById('hud-score');
    const labelEl = document.getElementById('hud-label');
    const ringEl = document.getElementById('hud-ring-fill');
    const hudEl = document.getElementById('alignment-hud');
    const progEl = document.getElementById('autocapture-progress');
    if (scoreEl) scoreEl.textContent = score + '%';
    if (ringEl) {
      const circ = 251.2;
      ringEl.style.strokeDashoffset = circ - (score / 100) * circ;
      let color, label;
      if (a.eligible) { color = 'var(--state-success)'; label = 'ALIGNED'; hudEl?.classList.add('aligned'); }
      else if (score >= 40) { color = 'var(--state-warning)'; label = 'ALMOST'; hudEl?.classList.remove('aligned'); }
      else { color = 'var(--state-error)'; label = a.blockingReasons?.length ? 'BLOCKED' : 'ADJUST'; hudEl?.classList.remove('aligned'); }
      ringEl.style.stroke = color;
      if (labelEl) labelEl.textContent = label;
    }
    // Profile / model / blocking disclosure (Solarize §7).
    this._renderSolarizeStatus(result);
    // Auto-capture progress from the gate.
    if (progEl) {
      const c = result.capture || {};
      const prog = c.holdRequired ? Math.min(1, (c.holdMs || 0) / c.holdRequired) : 0;
      progEl.style.width = (prog * 100) + '%';
      progEl.style.opacity = prog > 0 ? '1' : '0';
    }
    const liveEl = document.getElementById('score-live-region');
    if (liveEl) {
      const blocking = a.blockingReasons && a.blockingReasons.length ? a.blockingReasons[0] : '';
      liveEl.textContent = `Alignment: ${score}%. ${blocking ? 'Blocked: ' + blocking + '.' : ''}`;
    }
  }

  _renderSolarizeStatus(result) {
    let el = document.getElementById('solarize-status');
    if (!el) {
      el = document.createElement('div');
      el.id = 'solarize-status';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.style.cssText = 'position:absolute;top:8px;left:8px;right:8px;z-index:20;font-size:11px;line-height:1.3;padding:6px 8px;border-radius:8px;background:rgba(15,28,28,0.72);color:#e8e2d0;pointer-events:none;backdrop-filter:blur(4px);';
      const cam = document.getElementById('camera-screen') || this.skeletonCanvas?.parentElement;
      if (cam) cam.appendChild(el);
    }
    const prof = this.solarizeProfile || {};
    const ri = result.runtimeInfo || {};
    const a = result.alignment || {};
    const mgrStatus = this._modelStatus || {};
    const modelId = mgrStatus.modelId || (this.solarizeEngine && this.solarizeEngine.model && this.solarizeEngine.model.modelId) || '—';
    const blocking = (a.blockingReasons && a.blockingReasons.length) ? a.blockingReasons.join(', ') : 'none';
    const isDemo = !(this.stream && this.videoEl && this.videoEl.videoWidth);
    const stateLabel = mgrStatus.fallback ? ' · <i style="color:#C9A24C">fallback</i>' : mgrStatus.usingWorker ? ' · <i style="color:#4CAF7D">worker</i>' : '';
    el.innerHTML =
      `<b>${prof.label || 'SIMULATION'}</b>` +
      ` · model: ${modelId}` +
      (stateLabel) +
      ` · backend: ${mgrStatus.backend || ri.backend || (isDemo ? 'cpu(demo)' : '—')}` +
      (mgrStatus.fps ? ` · ${mgrStatus.fps.toFixed(1)} fps` : (ri.inferenceFps ? ` · ${ri.inferenceFps.toFixed(1)} fps` : '')) +
      (mgrStatus.latencyMs ? ` · ${mgrStatus.latencyMs.toFixed(0)}ms` : (ri.lastLatencyMs ? ` · ${ri.lastLatencyMs.toFixed(0)}ms` : '')) +
      (mgrStatus.backgrounded ? ' · <i style="color:#C9A24C">backgrounded</i>' : '') +
      (isDemo ? ` · <i>deterministic no-camera demo (pixels→keypoints, not a real-camera claim)</i>` : '') +
      ` · confidence: ${((a.confidence || 0) * 100).toFixed(0)}%` +
      ` · blocks: ${blocking}`;
  }

  _renderSolarizeHints(hints) {
    const el = document.getElementById('pose-hints') || document.querySelector('.pose-hints');
    if (!el) return;
    if (!hints || !hints.length) { el.textContent = ''; return; }
    el.innerHTML = hints.map((h) => `<div class="pose-hint">${h.hint || ''}</div>`).join('');
  }

  // ── GHOST OVERLAY (target pose silhouette) ─────────────────────
  // PR-2 (v1.1) — Phase 1 architectural fix: the ghost overlay now derives
  // from the SAME procedural rig (PoseSkeleton3D.renderGhostFrame) as the
  // avatar and skeleton renderers, eliminating the architectural drift
  // warned about in directive Part A.10 rule #4 and Part C Phase 1 step 4
  // ("ghost = avatar glyph — architectural, fix at rig level not per-pose").
  //
  // The legacy `_generateGhostKPs` heuristic stick-figure is retained as a
  // fallback path (Part C Phase 1 step 7: "Keep the pre-refactor code as a
  // safety fallback — try/catch around procedural, fall back to legacy path
  // only on failure"). The procedural path is wrapped in try/catch; any
  // unexpected exception (e.g., a future regression in pose-skeleton-3d.js)
  // will silently fall back to the legacy rendering so the camera screen
  // never goes blank mid-session.
  //
  // Visual side-effect: the procedural ghost is a fully-posed 3D figure
  // (matching the pose-detail skeleton) rather than a canonical standing
  // stick figure with joint-angle offsets. This means a reclining pose now
  // shows a horizontal ghost, a kneeling pose shows a kneeling ghost, etc.
  // — which is the correct behavior, but a visible change from before.
  // REASONING [PR-2]: the legacy ghost used a fixed canonical standing
  // skeleton and applied small sin(θ) offsets to elbows/knees. For 60% of
  // poses (seated, kneeling, reclining, boudoir, etc.) this produced a
  // ghost that looked like a standing person with slightly bent limbs —
  // wildly mismatched from the actual target pose. Users couldn't tell what
  // pose they were supposed to be hitting. The procedural path uses the
  // exact same buildPose(joints) FK pipeline as the skeleton renderer, so
  // the ghost is always anatomically correct.
  _drawGhostOverlay() {
    const canvas = this.ghostCanvas;
    if (!canvas || this.overlayMode === 'off') return;

    if (this.overlayMode !== 'ghost' && this.overlayMode !== 'avatar') return;

    // avatar-ghost extension (R2): 'avatar' = translucent FILLED silhouette
    // (the shape to aim for), 'ghost' = luminous OUTLINE (the alignment target).
    // Previously both modes called renderGhostFrame — now they are distinct.
    const isAvatar = this.overlayMode === 'avatar';
    const renderFn = isAvatar
      ? (window.PoseSkeleton3D && window.PoseSkeleton3D.renderAvatarFrame)
      : (window.PoseSkeleton3D && window.PoseSkeleton3D.renderGhostFrame);
    if (window.PoseSkeleton3D && typeof renderFn === 'function') {
      try {
        const pose = this.currentPose && POSES_LIBRARY[this.currentPose];
        const joints = pose ? (pose.joints || {}) : {};
        const rect = canvas.getBoundingClientRect();
        const w = rect.width || 430;
        const h = rect.height || 932;
        const yaw = this.facingMode === 'user' ? -20 : 20;
        const scale = Math.min(w, h) / 320;
        const opts = {
          category: pose ? (pose.category || '') : '',
          description: pose ? (pose.instructions || '') : '',
          yaw: yaw,
          pitch: 5,
          scale: scale
        };
        if (isAvatar) {
          // camera-avatar: low-alpha fill so the user's video shows through.
          // Dark teal at 0.42 reads as a "ghost figure" without occluding.
          opts.alpha = 0.42;
        }
        renderFn(canvas, w, h, joints, opts);
        if (this.currentScore >= 85) {
          const ctx2 = canvas.getContext('2d');
          ctx2.save();
          ctx2.globalCompositeOperation = 'source-atop';
          ctx2.fillStyle = 'rgba(201,162,76,0.18)';
          ctx2.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
          ctx2.restore();
        }
        return;
      } catch (err) {
        console.warn('[PoseArt] Procedural overlay render failed, falling back to legacy:', err && err.message);
      }
    }

    // ── LEGACY PATH (fallback) ──
    // Original stick-figure ghost using _generateGhostKPs heuristic.
    // Kept intact so any unforeseen regression in PoseSkeleton3D doesn't
    // leave the user without a ghost overlay. See PR-2 comment above.
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 430;
    canvas.height = rect.height || 932;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
  _computeAlignment(kps, poseId) {
    if (!poseId || !POSES_LIBRARY[poseId]) return { score: 45, errors: {} };

    const pose = POSES_LIBRARY[poseId];
    const refAngles = pose.joints || {};
    const errors = {};
    let totalError = 0, weightSum = 0;

    const measured = this._computeJointAngles(kps);
    const WEIGHTS = { leftShoulder:1.5, rightShoulder:1.5, leftElbow:1.0, rightElbow:1.0, leftHip:1.2, rightHip:1.2, leftKnee:1.0, rightKnee:1.0, spine:1.3, neck:0.8 };

    // Per-pose tolerance (dynamic poses get more slack)
    const baseTolerance = pose.effort === 'Static' ? 1.0 : 1.4;
    const sensitivityMod = this._sensitivity * baseTolerance;

    for (const [joint, targetAngle] of Object.entries(refAngles)) {
      // Confidence gating: skip low-confidence joints
      const kpNames = { leftShoulder:['leftShoulder'], rightShoulder:['rightShoulder'], leftElbow:['leftElbow','leftShoulder'], rightElbow:['rightElbow','rightShoulder'], leftHip:['leftHip'], rightHip:['rightHip'], leftKnee:['leftKnee','leftHip'], rightKnee:['rightKnee','rightHip'], spine:['leftHip','rightHip','leftShoulder','rightShoulder'], neck:['nose','leftShoulder','rightShoulder'] };
      const relKPs = kpNames[joint] || [];
      const lowConf = relKPs.some(k => kps[k] && kps[k].confidence < 0.5);
      if (lowConf) continue; // skip occluded joints

      const meas = measured[joint] || 0;
      const weight = WEIGHTS[joint] || 1.0;
      const rawDelta = Math.abs(meas - targetAngle);
      const delta = rawDelta / sensitivityMod;
      const normErr = Math.min(delta / 45, 1.0);

      if (rawDelta > 8) {
        // Mirror hints for front camera
        const hintJoint = (this.facingMode === 'user') ? this._mirrorJoint(joint) : joint;
        errors[joint] = {
          measured: meas, target: targetAngle, delta: rawDelta,
          severity: rawDelta > 25 ? 'high' : rawDelta > 12 ? 'medium' : 'low',
          hint: this._jointToHint(hintJoint, meas, targetAngle)
        };
      }
      totalError += normErr * weight;
      weightSum += weight;
    }

    const avgError = weightSum > 0 ? totalError / weightSum : 0;
    const base = Math.round((1 - avgError) * 100);
    const osc = Math.sin(this.simFrame * 0.08) * 4;
    return { score: Math.max(0, Math.min(100, base + osc)), errors };
  }

  _mirrorJoint(joint) {
    const m = { leftShoulder:'rightShoulder', rightShoulder:'leftShoulder', leftElbow:'rightElbow', rightElbow:'leftElbow', leftHip:'rightHip', rightHip:'leftHip', leftKnee:'rightKnee', rightKnee:'leftKnee' };
    return m[joint] || joint;
  }

  _computeJointAngles(kp) {
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

    // PR-v9 (v1.9) — Announce meaningful score changes without flooding the
    // screen reader on every animation frame. Always announce label changes;
    // otherwise announce in five-point increments.
    const liveEl = document.getElementById('score-live-region');
    if (liveEl && (label !== this._lastAnnouncedLabel || this._lastAnnouncedScore === null || Math.abs(d - this._lastAnnouncedScore) >= 5)) {
      liveEl.textContent = `Alignment: ${d}%, ${label.toLowerCase()}`;
      this._lastAnnouncedScore = d;
      this._lastAnnouncedLabel = label;
    }

    // Autocapture progress bar
    if (progEl) {
      const prog = this.captureProgress;
      progEl.style.width  = (prog * 100) + '%';
      progEl.style.opacity = prog > 0 ? '1' : '0';
    }

    this._updateHalo(d);
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

    // Solarize §7: show SIM/REAL badge on the review screen.
    // Use the capture record's isSim flag (set at capture time) rather than
    // re-checking isCaptureRealInference() — the camera may have stopped by
    // the time the review screen renders.
    const reviewBadge = document.getElementById('review-mode-badge');
    if (reviewBadge) {
      const isSim = !(typeof window.isCaptureRealInference === 'function' && window.isCaptureRealInference());
      reviewBadge.className = 'review-mode-badge ' + (isSim ? 'sim' : 'real');
      reviewBadge.textContent = isSim ? 'SIMULATION' : 'REAL';
      reviewBadge.style.display = 'inline-block';
      reviewBadge.setAttribute('aria-label', isSim ? 'Synthetic capture — not real camera inference' : 'Real camera inference');
    }

    if (this.currentScore >= 85 || isAuto) this._triggerParticleBloom();
    if (navigator.vibrate) navigator.vibrate(isAuto ? [50,30,50] : [30]);

    // Add to gallery (in-memory)
    if (typeof addToGallery === 'function') {
      const pose = POSES_LIBRARY[this.currentPose];
      const tourState = window.AppState?.isTourSession ? (window.tourEngine?.getState() || window.AppState.currentTourSession) : null;
      // Solarize §7: label every capture as synthetic or real-inference.
      // SIMULATION captures are never counted as progress (isCaptureRealInference gate in app.js).
      const isSim = !(typeof window.isCaptureRealInference === 'function' && window.isCaptureRealInference());
      const capture = {
        id: Date.now(),
        dataUrl,
        poseId: this.currentPose,
        poseName: pose?.name || 'Capture',
        score: Math.round(this.currentScore),
        timestamp: new Date().toISOString(),
        favorite: false,
        isSim, // Solarize §7 visible-labelling flag
        profile: this.solarizeProfile?.id || 'SIMULATION',
        modelId: this._modelManager?.status?.()?.modelId || null,
        ...(tourState ? { tourId: tourState.tour.id, sectionId: tourState.section.id, sectionName: tourState.section.name } : {})
      };
      addToGallery(capture);
      window._lastCapture = capture;
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
    // PR-2 (v1.1) — overlay mode matrix cleanup. Previously 'avatar' mode
    // showed BOTH the avatar SVG (overlay-container at 0.65) AND the ghost
    // canvas at full opacity, producing a muddy double-image. With the new
    // procedural ghost (cyan water aesthetic) the clash would be even more
    // jarring (cyan silhouette behind a dark teal glyph). The new matrix
    // treats each mode as a distinct single-overlay mode:
    //   ghost    → procedural cyan ghost only (target pose reference)
    //   avatar   → SVG glyph only (Art Nouveau figure at 0.65 opacity)
    //   skeleton → user skeleton only (live detected/simulated keypoints)
    //   off      → nothing
    // 'avatar' no longer paints the ghost canvas — the SVG glyph IS the
    // target reference in that mode. 'ghost' no longer paints the SVG.
    // 'skeleton' was already correct.
    // REASONING [PR-2]: showing two pose references at once doesn't help
    // alignment — it confuses the user about which one to match. The
    // directive (Part A.3 rule #14: "no overlay in the session selector
    // keeps the avatar which is wrong because it subverts user explicit
    // choice") is honored: the user's explicit overlay choice is now
    // respected as a single, unambiguous reference.
    switch(mode) {
      case 'ghost':    if(overlay) overlay.style.opacity='0'; skelCanvas.style.opacity='1'; if(ghostCvs) ghostCvs.style.opacity='1'; break;
      case 'avatar':   if(overlay) overlay.style.opacity='0.65'; skelCanvas.style.opacity='1'; if(ghostCvs) ghostCvs.style.opacity='0'; break;
      case 'skeleton': if(overlay) overlay.style.opacity='0'; skelCanvas.style.opacity='1'; if(ghostCvs) ghostCvs.style.opacity='0'; break;
      case 'off':      if(overlay) overlay.style.opacity='0'; skelCanvas.style.opacity='0'; if(ghostCvs) ghostCvs.style.opacity='0'; break;
    }
  }

  setPose(poseId) {
    this.currentPose = poseId;
    this.currentScore = 45;
    this.captureHeldMs = 0;
    this.smoothedKeypoints = {};
  }

  // R3 overlay-recovery: capture a frame for pose detection using ImageBitmap
  // (transferable to Worker) instead of HTMLVideoElement (fails structured clone).
  async _captureFrame(ts) {
    if (!this.videoEl || !this.videoEl.videoWidth) return this._deterministicDemoFrame(ts);
    var w = this.videoEl.videoWidth, h = this.videoEl.videoHeight;
    if (typeof createImageBitmap === 'function') {
      try {
        var bitmap = await createImageBitmap(this.videoEl, { resizeWidth: w, resizeHeight: h });
        return { bitmap: bitmap, width: w, height: h, timestamp: ts };
      } catch (e) { /* fall through */ }
    }
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    c.getContext('2d').drawImage(this.videoEl, 0, 0, w, h);
    return { canvas: c, width: w, height: h, timestamp: ts };
  }
}

window.cameraEngine = new CameraEngine();
