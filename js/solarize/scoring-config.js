// js/solarize/scoring-config.js
// Unified scoring configuration — single source of truth for all thresholds.
// Import this instead of hardcoding magic numbers.
//
// R3 overlay-recovery: fixes the mismatch where camera.js used 85
// while pose-scorer.js + auto-capture.js used 82, causing auto-capture
// to fire before the UI displayed "ALIGNED".

export const SCORING_DEFAULTS = Object.freeze({
  // The single alignment threshold. Above this = "ALIGNED" in UI and
  // eligible for auto-capture. Was split between 85 (camera.js) and
  // 82 (scorer/auto-capture) — now unified at 82.
  alignmentThreshold: 0.82,

  // Auto-capture requires sustained alignment above threshold.
  // Frames needed at or above threshold before capture fires.
  autoCaptureFrames: 3,

  // Sensitivity multipliers (Strict/Balanced/Relaxed).
  // The UI sensitivity selector multiplies the base threshold.
  // Strict = harder to align, Relaxed = easier.
  sensitivity: {
    strict:   0.88,  // 0.82 * 0.88 = 0.72 effective (harder)
    balanced: 0.82,  // 0.82 * 1.00 = 0.82 effective (default)
    relaxed:  0.74,  // 0.82 * 0.90 = 0.74 effective (easier)
  },

  // Score display thresholds (for UI coloring)
  display: {
    excellent: 0.90,
    good: 0.75,
    fair: 0.60,
    poor: 0.40,
  }
});

// Helper: get the effective threshold for a given sensitivity level
export function getEffectiveThreshold(sensitivityLevel) {
  const map = { strict: SCORING_DEFAULTS.sensitivity.strict, balanced: SCORING_DEFAULTS.sensitivity.balanced, relaxed: SCORING_DEFAULTS.sensitivity.relaxed };
  return map[sensitivityLevel] || SCORING_DEFAULTS.alignmentThreshold;
}

// Helper: convert 0-1 score to 0-100 for display
export function scoreToPercent(score) {
  return Math.round(Math.max(0, Math.min(1, score)) * 100);
}

// Helper: check if score meets alignment threshold
export function isAligned(score, sensitivityLevel) {
  const threshold = getEffectiveThreshold(sensitivityLevel);
  return score >= threshold;
}
