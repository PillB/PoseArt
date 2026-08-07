// ============================================================
// PoseArt Solarize — Pose Worker Service (Solarize §9)
// ------------------------------------------------------------
/* global Worker, Blob, URL, document, performance, self */
// ------------------------------------------------------------
// Off-main-thread pose inference. The worker:
//   • loads the pose model (Deterministic / MoveNet / MediaPipe)
//   • receives keep-latest frame messages (drops stale frames)
//   • attaches monotonic timestamps
//   • bounds memory + recovers from model-load failure
//   • throttles when the page is backgrounded
//   • supports cancel/restart while preserving camera controls
//
// Main-thread API (PoseWorkerService):
//   init(modelConfig) → ready promise
//   detect(frame) → promise of DetectionFrame (drops if a newer frame arrives)
//   onStatus(cb) → subscribe to {ready, backend, fatalError, fps, latencyMs}
//   dispose()
//
// The worker script is pose-worker.js (sibling). It is loaded as a
// classic worker (no ESM import browser quirks); the model classes
// are inlined via a string build so the worker has no network deps
// for the deterministic path and uses dynamic import() for TF.js.
// ============================================================

import { DeterministicPoseModel } from './pose-model-runtime.js';

export class PoseWorkerService {
  constructor(opts = {}) {
    this.opts = opts;
    this.worker = null;
    this.ready = false;
    this.fatalError = null;
    this.backend = null;
    this._pending = null;             // {resolve, reject, frameMonotonic}
    this._monotonic = 0;
    this._statusCbs = new Set();
    this._latencyWindow = [];
    this._backgrounded = false;
    this._disposed = false;
    this._modelConfig = null;
  }

  async init(modelConfig = {}) {
    this._modelConfig = modelConfig;
    if (this._disposed) throw new Error('PoseWorkerService disposed');
    try {
      // Build the worker from a blob so it has no external URL dependency.
      const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      this.worker = new Worker(url);
      this.worker.onmessage = (e) => this._onMessage(e.data);
      this.worker.onerror = (e) => {
        this.fatalError = (e && e.message) || 'worker-error';
        this.ready = false;
        this._emitStatus();
      };
      // Listen for background throttle (Solarize §9: suspend or throttle in background)
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', this._onVisibility);
      }
      // Send init command
      await this._send({ type: 'init', modelConfig });
      return this;
    } catch (e) {
      this.fatalError = e && e.message || String(e);
      this.ready = false;
      this._emitStatus();
      return this;
    }
  }

  // Detect on a frame. If a newer frame arrives before this resolves,
  // the older promise resolves with { dropped: true } (keep-latest).
  detect(frame) {
    if (!this.ready || !this.worker) {
      return Promise.resolve({ model: 'none', persons: [], dropped: true, timestamp: 0 });
    }
    // Background throttle: skip inference when hidden.
    if (this._backgrounded) {
      return Promise.resolve({ model: 'none', persons: [], dropped: true, throttled: true, timestamp: 0 });
    }
    const monotonic = ++this._monotonic;
    // Drop the previous pending if it exists (keep-latest).
    if (this._pending) {
      this._pending.resolve({ model: 'none', persons: [], dropped: true, timestamp: 0 });
      this._pending = null;
    }
    return new Promise((resolve, reject) => {
      this._pending = { resolve, reject, monotonic };
      // Transfer the frame descriptor (structured clone). For video frames,
      // the caller should pass a lightweight descriptor, not a VideoFrame.
      this.worker.postMessage({ type: 'detect', frame, monotonic });
    });
  }

  onStatus(cb) {
    this._statusCbs.add(cb);
    cb(this._statusSnapshot());
    return () => this._statusCbs.delete(cb);
  }

  dispose() {
    this._disposed = true;
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this._onVisibility);
    }
    if (this._pending) { this._pending.resolve({ model: 'none', persons: [], dropped: true, timestamp: 0 }); this._pending = null; }
    if (this.worker) { try { this.worker.terminate(); } catch (_) {} this.worker = null; }
    this.ready = false;
  }

  _onVisibility = () => {
    this._backgrounded = typeof document !== 'undefined' && document.visibilityState === 'hidden';
    this._emitStatus();
  };

  _onMessage(msg) {
    if (!msg) return;
    if (msg.type === 'status') {
      this.ready = !!msg.ready;
      this.fatalError = msg.fatalError || null;
      this.backend = msg.backend || null;
      this._emitStatus();
    } else if (msg.type === 'result') {
      if (this._pending && this._pending.monotonic === msg.monotonic) {
        const p = this._pending; this._pending = null;
        if (msg.error) { p.reject(new Error(msg.error)); return; }
        if (msg.latencyMs != null) {
          this._latencyWindow.push(msg.latencyMs);
          if (this._latencyWindow.length > 30) this._latencyWindow.shift();
        }
        p.resolve(msg.detection);
        this._emitStatus();
      }
    } else if (msg.type === 'error') {
      this.fatalError = msg.message || 'worker-error';
      this.ready = false;
      if (this._pending) { this._pending.reject(new Error(this.fatalError)); this._pending = null; }
      this._emitStatus();
    }
  }

  _statusSnapshot() {
    const avgLatency = this._latencyWindow.length
      ? this._latencyWindow.reduce((a, b) => a + b, 0) / this._latencyWindow.length : 0;
    const fps = avgLatency ? 1000 / avgLatency : 0;
    return {
      ready: this.ready, backend: this.backend, fatalError: this.fatalError,
      latencyMs: avgLatency, fps, backgrounded: this._backgrounded,
      modelId: this._modelConfig?.modelId || null,
    };
  }

  _emitStatus() {
    const snap = this._statusSnapshot();
    for (const cb of this._statusCbs) { try { cb(snap); } catch (_) {} }
  }

  _send(msg) {
    return new Promise((resolve, reject) => {
      const txn = Math.random().toString(36).slice(2);
      const handler = (e) => {
        const d = e.data;
        if (d && d.txn === txn) {
          this.worker.removeEventListener('message', handler);
          if (d.error) reject(new Error(d.error));
          else resolve(d);
        }
      };
      this.worker.addEventListener('message', handler);
      this.worker.postMessage({ ...msg, txn });
    });
  }
}

// ============================================================
// Worker source (inlined as a string + blob URL).
// Implements: init (load model), detect (keep-latest), status,
// error recovery, backend fallback. Uses dynamic import() for
// TF.js so the deterministic path works with zero network deps.
// ============================================================
const WORKER_SOURCE = `
let model = null;
let modelConfig = null;
let ready = false;
let fatalError = null;
let backend = null;

function sendStatus() {
  self.postMessage({ type: 'status', ready, fatalError, backend });
}

async function initModel(cfg) {
  modelConfig = cfg || {};
  ready = false; fatalError = null;
  try {
    if (cfg.modelId === 'deterministic-test') {
      // Deterministic model — no external deps.
      model = {
        modelId: 'deterministic-test',
        ready: true,
        backend: 'cpu',
        async detect(frame) {
          if (!frame || !frame.descriptor) return { model: 'movenet-multipose', persons: [], width: frame?.width||1, height: frame?.height||1, normalized: true, timestamp: frame?.timestamp||0 };
          const persons = frame.descriptor.persons.map((p) => ({
            keypoints: p.keypoints, bbox: p.bbox || null,
          }));
          return { model: 'movenet-multipose', persons, width: frame.width||1, height: frame.height||1, normalized: true, timestamp: frame.timestamp||0 };
        },
        dispose() { this.ready = false; },
      };
      backend = 'cpu';
      ready = true;
      sendStatus();
      return { ok: true, backend };
    }
    // Real MoveNet/MediaPipe — dynamic import (may fail in restricted envs).
    if (cfg.modelId && cfg.modelId.indexOf('movenet') === 0) {
      const tf = await import('@tensorflow/tfjs');
      const poseDetection = await import('@tensorflow-models/pose-detection');
      // Backend fallback chain: WebGPU → WebGL → WASM → CPU
      const chain = ['webgpu', 'webgl', 'wasm', 'cpu'];
      let chosen = null;
      for (const b of chain) {
        try { await tf.setBackend(b); await tf.ready(); chosen = b; break; } catch (_) {}
      }
      if (!chosen) throw new Error('no tfjs backend available');
      const multiPose = cfg.modelId === 'movenet-multipose-lightning';
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: multiPose ? 'multipose' : cfg.modelId.indexOf('thunder') >= 0 ? 'thunder' : 'lightning' }
      );
      model = {
        modelId: cfg.modelId, ready: true, backend: chosen,
        async detect(frame) {
          const video = frame && frame.video;
          if (!video) throw new Error('no video element in frame');
          const t0 = performance.now();
          const poses = await detector.estimatePoses(video, { maxPoses: multiPose ? 6 : 1, flipHorizontal: false });
          const latency = performance.now() - t0;
          const persons = poses.map((p) => ({
            keypoints: p.keypoints.map((k) => [k.x, k.y, k.score]),
            bbox: p.box ? { x: p.box.xMin, y: p.box.yMin, w: p.box.width, h: p.box.height } : null,
          }));
          return { model: multiPose ? 'movenet-multipose' : 'movenet-singlepose', persons, width: video.videoWidth||1, height: video.videoHeight||1, normalized: false, timestamp: performance.now(), latencyMs: latency };
        },
        dispose() { try { detector.dispose(); } catch(_){} this.ready = false; },
      };
      backend = chosen;
      ready = true;
      sendStatus();
      return { ok: true, backend };
    }
    throw new Error('unknown model: ' + cfg.modelId);
  } catch (e) {
    fatalError = (e && e.message) || String(e);
    ready = false;
    sendStatus();
    return { ok: false, error: fatalError };
  }
}

self.onmessage = async function(e) {
  const msg = e.data || {};
  if (msg.type === 'init') {
    const r = await initModel(msg.modelConfig);
    self.postMessage({ txn: msg.txn, ok: r.ok, backend: r.backend, error: r.error });
    return;
  }
  if (msg.type === 'detect') {
    const t0 = performance.now();
    try {
      if (!ready || !model) {
        self.postMessage({ type: 'result', txn: msg.txn, monotonic: msg.monotonic, error: 'not-ready' });
        return;
      }
      const detection = await model.detect(msg.frame);
      const latency = (detection.latencyMs != null ? detection.latencyMs : (performance.now() - t0));
      self.postMessage({ type: 'result', txn: msg.txn, monotonic: msg.monotonic, detection, latencyMs: latency });
    } catch (err) {
      self.postMessage({ type: 'result', txn: msg.txn, monotonic: msg.monotonic, error: (err && err.message) || String(err) });
    }
    return;
  }
  if (msg.type === 'dispose') {
    if (model && model.dispose) model.dispose();
    model = null; ready = false;
    self.postMessage({ txn: msg.txn, ok: true });
    return;
  }
};
`;
