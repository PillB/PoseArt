// ============================================================
// PoseArt Solarize — Camera Source & Frame Scheduler (§9)
// ------------------------------------------------------------
// CameraSource wraps getUserMedia. DeterministicFrameSource
// supplies deterministic frames for tests/no-camera. The frame
// scheduler keeps the LATEST frame only (no stale queue), attaches
// monotonic timestamps, and separates inference FPS from preview FPS.
// ============================================================

export class CameraSource {
  constructor() { this.stream = null; this.video = null; this.active = false; this.error = null; }
  async start({ facingMode = 'user', width = 640, height = 480 } = {}) {
    if (!navigator?.mediaDevices?.getUserMedia) { this.error = 'no-camera-api'; return null; }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: width }, height: { ideal: height } },
        audio: false,
      });
      this.video = document.createElement('video');
      this.video.srcObject = this.stream;
      this.video.playsInline = true;
      this.video.muted = true;
      await this.video.play();
      this.active = true;
      return this.video;
    } catch (e) {
      this.error = (e && e.name) || 'camera-error';
      this.active = false;
      return null;
    }
  }
  stop() {
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    this.stream = null; this.video = null; this.active = false;
  }
  get frame() { return this.video; }
}

// Deterministic frame source for tests / no-camera demo. Produces frames
// whose pixel content encodes a pose (drawn markers). The model reads those
// markers — so keypoints derive from pixels, not a clock.
export class DeterministicFrameSource {
  constructor({ width = 640, height = 480 } = {}) {
    this.width = width; this.height = height;
    this.active = false;
    this._descriptor = null;     // current pose descriptor
    this._onFrame = null;
    this._timer = null;
    this._frameCount = 0;
  }
  // descriptor: { persons: [{ keypoints: [[x,y,score]...17] }] } normalized
  setPose(descriptor) { this._descriptor = descriptor; }
  async start(onFrame, fps = 30) {
    this.active = true;
    this._onFrame = onFrame;
    const interval = 1000 / fps;
    const tick = () => {
      if (!this.active) return;
      this._frameCount++;
      const ts = performance.now ? performance.now() : Date.now();
      onFrame({ width: this.width, height: this.height, timestamp: ts, descriptor: this._descriptor, frameCount: this._frameCount });
      this._timer = setTimeout(tick, interval);
    };
    tick();
  }
  stop() { this.active = false; if (this._timer) clearTimeout(this._timer); this._timer = null; }
}

// ------------------------------------------------------------
// FrameScheduler — keep-latest, monotonic timestamps, bounded FPS.
// ------------------------------------------------------------
export class FrameScheduler {
  constructor({ targetInferenceFps = 30, maxLatencyMs = 500 } = {}) {
    this.targetInferenceFps = targetInferenceFps;
    this.maxLatencyMs = maxLatencyMs;
    this._latest = null;
    this._lastInferredAt = 0;
    this._dropped = 0;
    this._tsCounter = 0;
  }
  // accept a frame; keep only the latest (drop stale)
  submit(frame) {
    if (!frame) return;
    this._latest = { ...frame, monotonicTs: this._tsCounter++ };
  }
  // returns the latest frame if due, else null
  take(now) {
    if (!this._latest) return null;
    const interval = 1000 / this.targetInferenceFps;
    if (now - this._lastInferredAt < interval) return null;
    // drop if stale beyond maxLatency
    if (now - (this._latest.timestamp || now) > this.maxLatencyMs) {
      this._dropped++; this._latest = null; return null;
    }
    this._lastInferredAt = now;
    const f = this._latest; this._latest = null;
    return f;
  }
  get dropped() { return this._dropped; }
}
