// ============================================================
// PoseArt Solarize — Frame-based Person Detector (no ML deps)
// ------------------------------------------------------------
// Detects a person's bounding box from a canvas/video frame using
// classic CV techniques: motion (frame differencing) + skin-tone
// segmentation + foreground aggregation. Works in any browser
// without TF.js/MediaPipe — a robust fallback used by Rokoko and
// DeepMotion when ML models fail to load.
//
// Output: { bbox: {x,y,w,h}, confidence, motionScore, skinScore }
// ============================================================

export class FramePersonDetector {
  constructor(opts = {}) {
    this.downscale = opts.downscale || 64; // process at 64×64 for speed
    this.motionThreshold = opts.motionThreshold || 0.05;
    this.skinMinY = opts.skinMinY || 0.25; // YCbCr skin range
    this.skinMaxY = opts.skinMaxY || 0.75;
    this._prevFrame = null;
  }

  reset() { this._prevFrame = null; }

  // Extract a downsampled grayscale + YCbCr buffer from a video/canvas.
  _extractFrame(source) {
    const size = this.downscale;
    const canvas = FramePersonDetector._scratchCanvas(size, size);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let sw = 0, sh = 0;
    try {
      if (source.videoWidth) { sw = source.videoWidth; sh = source.videoHeight; }
      else if (source.width) { sw = source.width; sh = source.height; }
      else { return null; }
    } catch (_) { return null; }
    if (!sw || !sh) return null;
    try { ctx.drawImage(source, 0, 0, sw, sh, 0, 0, size, size); } catch (_) { return null; }
    let imgData;
    try { imgData = ctx.getImageData(0, 0, size, size); } catch (_) { return null; }
    const gray = new Float32Array(size * size);
    const cb = new Float32Array(size * size);
    const cr = new Float32Array(size * size);
    const d = imgData.data;
    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
      gray[j] = 0.299 * r + 0.587 * g + 0.114 * b;
      // YCbCr
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      cb[j] = 128 + (-0.168736 * r - 0.331264 * g + 0.5 * b) * 255;
      cr[j] = 128 + (0.5 * r - 0.418688 * g - 0.081312 * b) * 255;
    }
    return { gray, cb, cr, size };
  }

  static _scratchCanvas(w, h) {
    if (typeof document === 'undefined') return null;
    if (!FramePersonDetector._canvas) {
      FramePersonDetector._canvas = document.createElement('canvas');
    }
    FramePersonDetector._canvas.width = w;
    FramePersonDetector._canvas.height = h;
    return FramePersonDetector._canvas;
  }

  // Detect person bounding box from a video/canvas source.
  detect(source) {
    const frame = this._extractFrame(source);
    if (!frame) return { bbox: null, confidence: 0, motionScore: 0, skinScore: 0 };
    const { gray, cb, cr, size } = frame;

    // 1. Motion detection (frame differencing)
    let motionPixels = 0;
    const motion = new Uint8Array(size * size);
    if (this._prevFrame) {
      for (let i = 0; i < gray.length; i++) {
        const diff = Math.abs(gray[i] - this._prevFrame[i]);
        if (diff > this.motionThreshold) { motion[i] = 1; motionPixels++; }
      }
    }
    this._prevFrame = gray.slice();

    // 2. Skin-tone segmentation (YCbCr)
    let skinPixels = 0;
    const skin = new Uint8Array(size * size);
    for (let i = 0; i < cb.length; i++) {
      // Standard YCbCr skin range: Cb ∈ [77,127], Cr ∈ [133,173]
      if (cb[i] >= 77 && cb[i] <= 127 && cr[i] >= 133 && cr[i] <= 173) {
        skin[i] = 1; skinPixels++;
      }
    }

    // 3. Combine: foreground = motion OR skin
    const fg = new Uint8Array(size * size);
    let fgPixels = 0;
    for (let i = 0; i < fg.length; i++) {
      if (motion[i] || skin[i]) { fg[i] = 1; fgPixels++; }
    }

    if (fgPixels < 10) {
      return { bbox: null, confidence: 0, motionScore: motionPixels / (size * size), skinScore: skinPixels / (size * size) };
    }

    // 4. Bounding box of foreground pixels
    let minX = size, minY = size, maxX = 0, maxY = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (fg[y * size + x]) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Normalize to [0,1]
    const bbox = {
      x: minX / size,
      y: minY / size,
      w: (maxX - minX + 1) / size,
      h: (maxY - minY + 1) / size,
    };

    // Confidence: density of foreground within bbox
    const bboxArea = (maxX - minX + 1) * (maxY - minY + 1);
    const density = fgPixels / bboxArea;
    const confidence = Math.min(1, density * 1.5);

    return {
      bbox,
      confidence,
      motionScore: motionPixels / (size * size),
      skinScore: skinPixels / (size * size),
    };
  }
}
