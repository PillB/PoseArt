// ============================================================
// PoseArt Solarize — OneEuroFilter (SOTA temporal smoothing)
// ------------------------------------------------------------
// Adaptive low-pass filter with speed-dependent cutoff.
// Reference: Casiez, Roussel, Vogel (CHI 2012).
// Used by Rokoko Vision, MediaPipe Holistic, and most real-time mocap.
//
// Eliminates jitter without lag. Far superior to EMA for pose keypoints.
// ============================================================

export class OneEuroFilter {
  constructor({ freq = 30, minCutoff = 1.0, beta = 0.007, dCutoff = 1.0 } = {}) {
    this.freq = freq;
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this._xPrev = null;
    this._dxPrev = 0;
    this._tPrev = null;
  }

  reset() { this._xPrev = null; this._dxPrev = 0; this._tPrev = null; }

  filter(x, t) {
    if (this._xPrev === null) {
      this._xPrev = x;
      this._tPrev = t;
      return x;
    }
    const dt = t && this._tPrev ? (t - this._tPrev) / 1000 : 1 / this.freq;
    if (dt <= 0) return this._xPrev;
    const dx = (x - this._xPrev) / dt;
    // Smooth the derivative
    const alphaD = this._alpha(dt, this.dCutoff);
    const dxHat = alphaD * dx + (1 - alphaD) * this._dxPrev;
    // Speed-dependent cutoff
    const cutoff = this.minCutoff + this.beta * Math.abs(dxHat);
    const alpha = this._alpha(dt, cutoff);
    const xHat = alpha * x + (1 - alpha) * this._xPrev;
    this._xPrev = xHat;
    this._dxPrev = dxHat;
    this._tPrev = t;
    return xHat;
  }

  _alpha(dt, cutoff) {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }
}

// A per-joint OneEuro filter bank for a 17-keypoint skeleton.
export class OneEuroKeypointSmoother {
  constructor(opts = {}) {
    this.opts = opts;
    this._filters = {}; // name → {x: OneEuroFilter, y: OneEuroFilter}
  }

  reset() { this._filters = {}; }

  smooth(landmarks, timestamp) {
    const out = {};
    for (const [name, pt] of Object.entries(landmarks)) {
      if (!this._filters[name]) {
        this._filters[name] = {
          x: new OneEuroFilter(this.opts),
          y: new OneEuroFilter(this.opts),
        };
      }
      out[name] = {
        ...pt,
        x: this._filters[name].x.filter(pt.x, timestamp),
        y: this._filters[name].y.filter(pt.y, timestamp),
      };
    }
    return out;
  }
}
