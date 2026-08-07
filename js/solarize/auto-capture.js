// ============================================================
// PoseArt Solarize — Auto-Capture Gate (Solarize §16)
// ------------------------------------------------------------
// Auto-capture requires: real inference, eligible scene, correct
// person count, stable tracks, stable roles, sufficient confidence,
// satisfied contacts, sustained alignment. Shows which gate blocks.
// Simulation can NEVER increment real capture progress.
// ============================================================

const DEFAULTS = {
  holdMs: 1200,                 // sustained alignment required
  scoreThreshold: 0.82,
  confidenceThreshold: 0.6,
  recentTrackSwitchBlockMs: 800,
  staleInferenceMs: 500,        // a frame older than this is stale
  contactInstabilityBlockFrames: 3,
};

export class AutoCaptureGate {
  constructor(opts = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this.holdMs = 0;
    this.lastCaptureAt = 0;
    this.lastTrackSwitchAt = -Infinity;   // no false block before a real switch occurs
    this.contactUnstableFrames = 0;
    this.lastBlockReason = 'not_started';
  }

  reset() {
    this.holdMs = 0; this.lastCaptureAt = 0; this.lastTrackSwitchAt = -Infinity;
    this.contactUnstableFrames = 0; this.lastBlockReason = 'not_started';
  }

  // notify a role/track switch happened this frame
  notifyTrackSwitch(ts) { this.lastTrackSwitchAt = ts; this.holdMs = 0; }

  notifyContactInstability() { this.contactUnstableFrames++; }
  notifyContactStable() { this.contactUnstableFrames = 0; }

  // dtMs: ms since previous frame. frameTs: timestamp of current frame.
  evaluate({ alignment, profile, frameTs, dtMs, personCount, requiredCount, contactsSatisfied }) {
    // Gate: real inference
    if (!profile || !profile.realModel) { this.holdMs = 0; this.lastBlockReason = 'simulation_mode'; return { capture: false, reason: this.lastBlockReason, holdMs: 0 }; }
    if (!alignment || !alignment.inferredFromRealModel) { this.holdMs = 0; this.lastBlockReason = 'not_real_inference'; return { capture: false, reason: this.lastBlockReason, holdMs: 0 }; }

    // Gate: stale inference
    if (dtMs != null && dtMs > this.opts.staleInferenceMs) { this.holdMs = 0; this.lastBlockReason = 'stale_inference'; return { capture: false, reason: this.lastBlockReason, holdMs: 0 }; }

    // Gate: person count
    if (personCount != null && requiredCount != null && personCount !== requiredCount) {
      this.holdMs = 0; this.lastBlockReason = personCount < requiredCount ? 'missing_person' : 'wrong_person_count'; return { capture: false, reason: this.lastBlockReason, holdMs: 0 };
    }

    // Gate: blocking reasons
    if (alignment.blockingReasons && alignment.blockingReasons.length) {
      this.holdMs = 0; this.lastBlockReason = alignment.blockingReasons[0]; return { capture: false, reason: this.lastBlockReason, holdMs: 0 };
    }

    // Gate: score & confidence thresholds
    if (alignment.overallScore / 100 < this.opts.scoreThreshold) { this.holdMs = 0; this.lastBlockReason = 'score_below_threshold'; return { capture: false, reason: this.lastBlockReason, holdMs: 0 }; }
    if (alignment.confidence < this.opts.confidenceThreshold) { this.holdMs = 0; this.lastBlockReason = 'confidence_below_threshold'; return { capture: false, reason: this.lastBlockReason, holdMs: 0 }; }

    // Gate: recent track switch
    if (frameTs - this.lastTrackSwitchAt < this.opts.recentTrackSwitchBlockMs) { this.holdMs = 0; this.lastBlockReason = 'recent_track_switch'; return { capture: false, reason: this.lastBlockReason, holdMs: 0 }; }

    // Gate: contact instability
    if (this.contactUnstableFrames >= this.opts.contactInstabilityBlockFrames) { this.holdMs = 0; this.lastBlockReason = 'contact_instability'; return { capture: false, reason: this.lastBlockReason, holdMs: 0 }; }
    if (contactsSatisfied === false) { this.holdMs = 0; this.lastBlockReason = 'unsatisfied_contact'; return { capture: false, reason: this.lastBlockReason, holdMs: 0 }; }

    // Hold accumulation
    this.holdMs += dtMs || 33;
    this.lastBlockReason = null;
    if (this.holdMs >= this.opts.holdMs) {
      this.holdMs = 0;
      this.lastCaptureAt = frameTs;
      return { capture: true, reason: null, holdMs: this.opts.holdMs };
    }
    return { capture: false, reason: 'sustaining', holdMs: this.holdMs, holdRequired: this.opts.holdMs };
  }
}
