// ============================================================
// PoseArt Solarize — Model Activation Manager (Solarize §8, §9)
// ------------------------------------------------------------
// Hardened model activation with:
//   • capability negotiation (WebGPU/WASM/WebGL/CPU)
//   • fallback chain: requested model → alternative backend →
//     deterministic (clearly labelled, never silent)
//   • readiness gate: detect() is blocked until ready OR rejects
//     with a structured error (no race conditions)
//   • model-load failure recovery: surfaces fatalError to the UI
//     via onStatus, with a retry() path
//   • optional worker offloading: when useWorker=true, inference
//     runs in a Web Worker (PoseWorkerService)
//   • background throttle: suspends inference when hidden
//
// This wraps the raw MoveNet/MediaPipe/Deterministic runtimes so
// camera.js has ONE resilient entry point.
// ============================================================

import { DeterministicPoseModel, MoveNetRuntime, MODEL_REGISTRY } from './pose-model-runtime.js';
import { PoseWorkerService } from './pose-worker-service.js';

export const ACTIVATION_STATE = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  FAILED: 'failed',
  FALLBACK: 'fallback',     // real model failed; using deterministic
  DISPOSED: 'disposed',
});

const BACKEND_CHAIN = ['webgpu', 'webgl', 'wasm', 'cpu'];

export class ModelActivationManager {
  constructor(opts = {}) {
    this.opts = opts;
    this.state = ACTIVATION_STATE.IDLE;
    this.model = null;
    this.modelId = null;
    this.backend = null;
    this.fatalError = null;
    this.lastLatencyMs = 0;
    this.fps = 0;
    this._latencyWindow = [];
    this._statusCbs = new Set();
    this._worker = null;
    this._useWorker = opts.useWorker !== false && typeof Worker !== 'undefined';
    this._backgrounded = false;
    this._caps = null;
  }

  // Negotiate the best model + backend for the current capabilities.
  // Returns { modelId, backend, profile } without loading.
  negotiate(capabilities, profile) {
    this._caps = capabilities || {};
    const modelId = chooseModel(profile, capabilities);
    const backend = chooseBackend(capabilities);
    return { modelId, backend, profile };
  }

  // Load the model. Falls back through the chain on failure.
  async activate(modelConfig = {}) {
    this.state = ACTIVATION_STATE.LOADING;
    this.fatalError = null;
    this._emit();

    const requestedId = modelConfig.modelId || 'deterministic-test';
    const reg = MODEL_REGISTRY[requestedId];
    if (!reg) {
      this._fail('unknown_model: ' + requestedId);
      return this;
    }

    // Deterministic never fails and never needs a worker.
    if (requestedId === 'deterministic-test') {
      this.model = new DeterministicPoseModel();
      await this.model.init();
      this.modelId = this.model.modelId;
      this.backend = this.model.backend || 'cpu';
      this.state = ACTIVATION_STATE.READY;
      this._emit();
      return this;
    }

    // Real model: try with worker first, then direct, then deterministic fallback.
    if (this._useWorker) {
      try {
        this._worker = new PoseWorkerService();
        await this._worker.init({ modelId: requestedId });
        if (this._worker.ready) {
          this.model = this._worker;
          this.modelId = requestedId;
          this.backend = this._worker.backend;
          this.state = ACTIVATION_STATE.READY;
          this._worker.onStatus((s) => { this._onWorkerStatus(s); });
          this._emit();
          return this;
        }
        // worker init failed but didn't throw — fall through to direct
      } catch (e) {
        this.fatalError = e && e.message || String(e);
      }
    }

    // Direct MoveNet init with backend fallback.
    try {
      const rt = new MoveNetRuntime({
        multiPose: requestedId === 'movenet-multipose-lightning',
        variant: requestedId.includes('thunder') ? 'thunder' : 'lightning',
      });
      await rt.init();
      if (rt.ready) {
        this.model = rt;
        this.modelId = rt.modelId;
        this.backend = rt.backend;
        this.state = ACTIVATION_STATE.READY;
        this.fatalError = null;
        this._emit();
        return this;
      }
      this.fatalError = rt.fatalError || 'movenet_init_failed';
    } catch (e) {
      this.fatalError = e && e.message || String(e);
    }

    // Fallback to deterministic (labelled, not silent).
    this.model = new DeterministicPoseModel();
    await this.model.init();
    this.modelId = this.model.modelId;
    this.backend = this.model.backend || 'cpu';
    this.state = ACTIVATION_STATE.FALLBACK;
    this._emit();
    return this;
  }

  // Readiness gate: only resolves when READY; rejects with structured
  // error otherwise. Prevents race conditions in the render loop.
  async waitReady(timeoutMs = 10000) {
    if (this.state === ACTIVATION_STATE.READY) return true;
    if (this.state === ACTIVATION_STATE.FAILED) throw new Error('model_failed:' + this.fatalError);
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const check = () => {
        if (this.state === ACTIVATION_STATE.READY || this.state === ACTIVATION_STATE.FALLBACK) resolve(true);
        else if (this.state === ACTIVATION_STATE.FAILED) reject(new Error('model_failed:' + this.fatalError));
        else if (Date.now() - start > timeoutMs) reject(new Error('model_timeout'));
        else setTimeout(check, 50);
      };
      check();
    });
  }

  // Detect with readiness gate + background throttle.
  async detect(frame) {
    if (this.state !== ACTIVATION_STATE.READY && this.state !== ACTIVATION_STATE.FALLBACK) {
      throw new Error('model_not_ready');
    }
    if (this._backgrounded) {
      return { model: 'none', persons: [], dropped: true, throttled: true, timestamp: 0 };
    }
    const t0 = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    let detection;
    if (this._worker) {
      detection = await this._worker.detect(frame);
    } else {
      detection = await this.model.detect(frame);
    }
    const latency = (typeof performance !== 'undefined' && performance.now) ? performance.now() - t0 : 0;
    this.lastLatencyMs = detection.latencyMs || latency;
    this._latencyWindow.push(this.lastLatencyMs);
    if (this._latencyWindow.length > 30) this._latencyWindow.shift();
    const avg = this._latencyWindow.reduce((a, b) => a + b, 0) / this._latencyWindow.length;
    this.fps = avg ? 1000 / avg : 0;
    this._emit();
    return detection;
  }

  // Retry after a failure — disposes and re-activates.
  async retry(modelConfig) {
    this.dispose(false);
    return this.activate(modelConfig || { modelId: this.modelId });
  }

  onStatus(cb) {
    this._statusCbs.add(cb);
    cb(this.status());
    return () => this._statusCbs.delete(cb);
  }

  // Engine-compatibility: the engine's processFrame gate checks
  // `this.model.ready`. Expose ready/fatalError/modelId/backend/lastLatencyMs
  // as direct properties so the manager is a drop-in model replacement.
  get ready() { return this.state === ACTIVATION_STATE.READY || this.state === ACTIVATION_STATE.FALLBACK; }

  status() {
    return {
      state: this.state,
      modelId: this.modelId,
      backend: this.backend,
      fatalError: this.fatalError,
      ready: this.state === ACTIVATION_STATE.READY,
      fallback: this.state === ACTIVATION_STATE.FALLBACK,
      latencyMs: this.lastLatencyMs,
      fps: this.fps,
      backgrounded: this._backgrounded,
      usingWorker: !!this._worker,
    };
  }

  setBackgrounded(b) { this._backgrounded = !!b; this._emit(); }

  dispose(terminate = true) {
    if (this._worker) { this._worker.dispose(); this._worker = null; }
    else if (this.model && this.model.dispose) { try { this.model.dispose(); } catch (_) {} }
    this.model = null;
    this.state = terminate ? ACTIVATION_STATE.DISPOSED : ACTIVATION_STATE.IDLE;
    this._emit();
  }

  _onWorkerStatus(s) {
    if (s.fatalError && !this.fatalError) { this.fatalError = s.fatalError; this.state = ACTIVATION_STATE.FALLBACK; }
    if (s.backend) this.backend = s.backend;
    if (s.latencyMs) this.lastLatencyMs = s.latencyMs;
    if (s.fps) this.fps = s.fps;
    this._backgrounded = s.backgrounded;
    this._emit();
  }

  _fail(msg) {
    this.fatalError = msg;
    this.state = ACTIVATION_STATE.FAILED;
    this._emit();
  }

  _emit() {
    const s = this.status();
    for (const cb of this._statusCbs) { try { cb(s); } catch (_) {} }
  }
}

// ---- capability-based model/backend selection ----
export function chooseModel(profile, caps) {
  if (!profile || profile.id === 'SIMULATION') return 'deterministic-test';
  if (profile.id === 'RGB_HIGH_PERFORMANCE' && caps.webgpu) return 'movenet-multipose-lightning';
  if (profile.id === 'RGB_COMPATIBLE') return 'movenet-singlepose-lightning';
  return 'movenet-singlepose-lightning';
}

export function chooseBackend(caps) {
  for (const b of BACKEND_CHAIN) {
    if (b === 'webgpu' && caps.webgpu) return b;
    if (b === 'webgl' && caps.webgl) return b;
    if (b === 'wasm' && caps.wasm) return b;
  }
  return 'cpu';
}

// Detect WebGPU/WebGL/WASM capability at runtime (browser only).
export function detectCapabilities() {
  const caps = { webgpu: false, webgl: false, wasm: false, worker: false, offscreenCanvas: false };
  try { caps.webgpu = !!(typeof navigator !== 'undefined' && navigator.gpu); } catch (_) {}
  try {
    if (typeof document !== 'undefined') {
      const c = document.createElement('canvas');
      caps.webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
    }
  } catch (_) {}
  try { caps.wasm = typeof WebAssembly !== 'undefined'; } catch (_) {}
  try { caps.worker = typeof Worker !== 'undefined'; } catch (_) {}
  try { caps.offscreenCanvas = typeof OffscreenCanvas !== 'undefined'; } catch (_) {}
  return caps;
}
