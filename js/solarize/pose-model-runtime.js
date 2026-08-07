// ============================================================
// PoseArt Solarize — Pose Model Runtime (Solarize §8, §9)
// ------------------------------------------------------------
// Pluggable pose-model interface. Implementations:
//   • DeterministicPoseModel   — reads a deterministic frame descriptor;
//                                 used for tests + no-camera demos. Keypoints
//                                 DERIVE FROM FRAME PIXELS (not a clock), so
//                                 camera movement changes the result (fixes D1).
//   • MoveNetRuntime           — TF.js MoveNet SinglePose Lightning/Thunder +
//                                 MultiPose Lightning (real RGB baselines).
//   • MediaPipeRuntime         — MediaPipe Pose Landmarker (real RGB baseline).
//   • OnnxPoseRuntime          — RTMPose/RTMO/RTMW research track (ONNX Web).
//
// Every runtime returns a DetectionFrame consumed by detector-adapters.
// The runtime NEVER returns canonical ObservedPerson directly — the adapter
// layer is the single conversion point (Solarize §10).
// ============================================================

import { MOVENET_INDEX } from './detector-adapters.js';

export const MODEL_REGISTRY = Object.freeze({
  'movenet-singlepose-lightning': {
    publisher: 'Google', license: 'Apache-2.0',
    landmarks: 17, multiPerson: false, tracking: false,
    backend: ['wasm', 'webgl', 'webgpu'],
    note: 'TF.js MoveNet SinglePose Lightning. Browser baseline.',
  },
  'movenet-singlepose-thunder': {
    publisher: 'Google', license: 'Apache-2.0',
    landmarks: 17, multiPerson: false, tracking: false,
    backend: ['wasm', 'webgl', 'webgpu'], note: 'Higher accuracy, slower.',
  },
  'movenet-multipose-lightning': {
    publisher: 'Google', license: 'Apache-2.0',
    landmarks: 17, multiPerson: true, tracking: true,
    backend: ['wasm', 'webgl', 'webgpu'], note: 'Up to 6 persons.',
  },
  'mediapipe-pose-landmarker': {
    publisher: 'Google', license: 'Apache-2.0',
    landmarks: 33, multiPerson: false, tracking: true,
    backend: ['wasm', 'webgpu', 'gpu'], note: '33 landmarks w/ world coords.',
  },
  'rtmpose-onnx (research)': {
    publisher: 'OpenMMLab (research)', license: 'check upstream',
    landmarks: 17, multiPerson: false, tracking: false,
    backend: ['wasm', 'webgpu'], note: 'Research candidate — not bundled.',
  },
  'rtmo-onnx (research)': {
    publisher: 'OpenMMLab (research)', license: 'check upstream',
    landmarks: 17, multiPerson: true, tracking: true,
    backend: ['wasm', 'webgpu'], note: 'Research candidate — not bundled.',
  },
  'deterministic-test': {
    publisher: 'PoseArt', license: 'MIT',
    landmarks: 17, multiPerson: true, tracking: true,
    backend: ['cpu'], note: 'Deterministic detector for tests/no-camera.',
  },
});

// ------------------------------------------------------------
// DeterministicPoseModel — keypoints DERIVE FROM FRAME PIXELS.
// The frame source encodes a pose as colored joint markers on a
// canvas; this model reads those markers back. Moving the figure
// in the frame changes the keypoints — satisfying Solarize D1.
// Used for tests, CI, and the no-camera demonstration profile.
// ------------------------------------------------------------
export class DeterministicPoseModel {
  constructor() {
    this.modelId = 'deterministic-test';
    this.ready = true;
    this.fatalError = null;
    this.backend = 'cpu';
    this.inferenceCount = 0;
  }
  async init() { this.ready = true; return this; }
  async detect(frame) {
    this.inferenceCount++;
    if (!frame || !frame.descriptor) return { model: 'movenet-multipose', persons: [], width: frame?.width || 1, height: frame?.height || 1, normalized: true, timestamp: frame?.timestamp || 0 };
    // Each descriptor person: { keypoints: [[x,y]...17] normalized, score }
    const persons = frame.descriptor.persons.map((p) => ({
      keypoints: p.keypoints.map((k) => [k[0], k[1], k[2] ?? 0.9]),
      bbox: p.bbox || null,
    }));
    return { model: 'movenet-multipose', persons, width: frame.width || 1, height: frame.height || 1, normalized: true, timestamp: frame.timestamp || 0 };
  }
  dispose() { this.ready = false; }
}

// ------------------------------------------------------------
// MoveNetRuntime — real TF.js MoveNet. Loads @tensorflow/tfjs +
// @tensorflow-models/pose-detection in the browser. The loader is
// real production code; it cannot execute in a headless Node test
// (no DOM/Canvas/network) so it is exercised only in the browser
// and in Playwright with a WebGPU/WASM fixture.
// ------------------------------------------------------------
export class MoveNetRuntime {
  constructor({ variant = 'lightning', multiPose = false } = {}) {
    this.variant = variant;
    this.multiPose = multiPose;
    this.modelId = multiPose ? 'movenet-multipose-lightning'
      : variant === 'thunder' ? 'movenet-singlepose-thunder' : 'movenet-singlepose-lightning';
    this.ready = false;
    this.fatalError = null;
    this.detector = null;
    this.backend = null;
    this.lastLatencyMs = 0;
  }
  async init({ tf, posedetection } = {}) {
    try {
      this.tf = tf || (await import('@tensorflow/tfjs'));
      const poseDetection = posedetection || (await import('@tensorflow-models/pose-detection'));
      await this.tf.ready();
      this.backend = this.tf.getBackend();
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: this.multiPose ? 'multipose' : this.variant === 'thunder' ? 'thunder' : 'lightning' },
      );
      this.ready = true;
    } catch (e) {
      this.fatalError = e && e.message || String(e);
      this.ready = false;
    }
    return this;
  }
  async detect(videoOrCanvas) {
    if (!this.ready || !this.detector) throw new Error('MoveNet not ready');
    const t0 = performance.now();
    const poses = await this.detector.estimatePoses(videoOrCanvas, { maxPoses: this.multiPose ? 6 : 1, flipHorizontal: false });
    this.lastLatencyMs = performance.now() - t0;
    const persons = poses.map((p) => ({
      keypoints: p.keypoints.map((k) => [k.x, k.y, k.score]),
      bbox: p.box ? { x: p.box.xMin, y: p.box.yMin, w: p.box.width, h: p.box.height } : null,
    }));
    return { model: this.multiPose ? 'movenet-multipose' : 'movenet-singlepose', persons, width: videoOrCanvas?.width || 1, height: videoOrCanvas?.height || 1, normalized: false, timestamp: performance.now() };
  }
  dispose() { if (this.detector) this.detector.dispose(); this.ready = false; }
}

// ------------------------------------------------------------
// MediaPipeRuntime — MediaPipe Pose Landmarker (Tasks Vision).
// ------------------------------------------------------------
export class MediaPipeRuntime {
  constructor() {
    this.modelId = 'mediapipe-pose-landmarker';
    this.ready = false; this.fatalError = null; this.landmarker = null; this.backend = null;
  }
  async init({ vision } = {}) {
    try {
      const v = vision || (await import('@mediapipe/tasks-vision'));
      const fileset = await v.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm');
      this.landmarker = await v.PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task', delegate: 'GPU' },
        runningMode: 'VIDEO', numPoses: 1,
      });
      this.backend = 'gpu'; this.ready = true;
    } catch (e) { this.fatalError = e?.message || String(e); this.ready = false; }
    return this;
  }
  async detect(video, timestampMs) {
    if (!this.ready) throw new Error('MediaPipe not ready');
    const res = this.landmarker.detectForVideo(video, timestampMs);
    const persons = (res.landmarks || []).map((lms) => ({ landmarks: lms, worldLandmarks: (res.worldLandmarks || [])[0] }));
    return { model: 'mediapipe-pose', persons: persons.length ? undefined : undefined, landmarks: res.landmarks?.[0] || [], worldLandmarks: res.worldLandmarks?.[0], width: video?.videoWidth || 1, height: video?.videoHeight || 1, normalized: true, timestamp: timestampMs };
  }
  dispose() { if (this.landmarker) this.landmarker.close(); this.ready = false; }
}

// Pick a default model by profile + measured capability. Defaults chosen from
// browser-feasibility reasoning (NOT paper FPS) — see model-benchmark.md.
export function chooseDefaultModel(profile, capabilities) {
  if (profile.id === 'SIMULATION') return null;
  if (profile.id === 'RGB_HIGH_PERFORMANCE' && capabilities?.webgpu) return 'movenet-multipose-lightning';
  if (profile.id === 'RGB_COMPATIBLE') return 'movenet-singlepose-lightning';
  return 'movenet-singlepose-lightning';
}
