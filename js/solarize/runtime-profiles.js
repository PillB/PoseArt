// ============================================================
// PoseArt Solarize — Runtime Profiles (Solarize §7)
// ------------------------------------------------------------
// Capability negotiation. The active profile is shown in the UI
// alongside model, backend, FPS, latency and limitations.
// SIMULATION is structurally isolated: it can never produce real
// achievements, real auto-capture or real score history.
// ============================================================

export const PROFILES = Object.freeze({
  SIMULATION: {
    id: 'SIMULATION',
    label: 'Simulation (no camera intelligence)',
    realModel: false,
    cameraRequired: false,
    canAutoCapture: false,          // synthetic demonstration only
    canEarnAchievements: false,
    canRecordScoreHistory: false,
    backends: ['procedural'],
    description: 'Procedurally generated keypoints. Visibly labelled. No camera-performance claim.',
  },
  RGB_COMPATIBLE: {
    id: 'RGB_COMPATIBLE',
    label: 'RGB Compatible (browser camera, lightweight model)',
    realModel: true,
    cameraRequired: true,
    canAutoCapture: true,
    canEarnAchievements: true,
    canRecordScoreHistory: true,
    backends: ['wasm', 'cpu'],
    description: 'Browser camera with a lightweight pose model on WASM/CPU fallback. Bounded resolution and frame rate.',
  },
  RGB_HIGH_PERFORMANCE: {
    id: 'RGB_HIGH_PERFORMANCE',
    label: 'RGB High Performance (WebGPU, worker inference)',
    realModel: true,
    cameraRequired: true,
    canAutoCapture: true,
    canEarnAchievements: true,
    canRecordScoreHistory: true,
    backends: ['webgpu', 'wasm'],
    description: 'WebGPU where supported; stronger/higher-resolution model; worker inference; adaptive scheduling; two-person tracking.',
  },
  OPTIONAL_DEPTH_BRIDGE: {
    id: 'OPTIONAL_DEPTH_BRIDGE',
    label: 'Optional Depth Bridge (future local/native)',
    realModel: true,
    cameraRequired: true,
    canAutoCapture: true,
    canEarnAchievements: true,
    canRecordScoreHistory: true,
    backends: ['native-depth'],
    description: 'Future local/native integration with a depth sensor. Never presented as native GitHub Pages functionality.',
  },
});

export function getProfile(id) {
  return PROFILES[id] || PROFILES.SIMULATION;
}

// Decide the best profile the current browser can sustain.
export function negotiateProfile(capabilities) {
  const c = capabilities || {};
  if (c.hasCamera === false) return PROFILES.SIMULATION;
  if (c.webgpu && c.worker && c.offscreenCanvas) return PROFILES.RGB_HIGH_PERFORMANCE;
  if (c.wasm || c.cameraGranted) return PROFILES.RGB_COMPATIBLE;
  return PROFILES.SIMULATION;
}

export function isRealProfile(p) {
  return p && p.id !== 'SIMULATION';
}
