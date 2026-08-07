// ============================================================
// PoseArt Solarize — Coaching (Solarize §15)
// ------------------------------------------------------------
// Role-specific, body-part-specific, directionally correct after
// mirroring, confidence-aware, limited to the highest-value
// corrections, stable long enough to read, non-contradictory,
// suppressed when evidence is inadequate. NEVER a confident
// correction for an invisible joint.
// ============================================================

const DEFAULTS = {
  maxHints: 3,
  minStableFrames: 4,        // a hint must persist this many frames
  minDeltaForHint: 15,       // degrees
  minVisibility: 0.3,        // joints below this visibility never get a confident hint
  mirrorFrontCamera: true,
};

export class Coach {
  constructor(opts = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this.stableHints = new Map(); // key -> count
    this.lastEmitted = [];
  }

  reset() { this.stableHints.clear(); this.lastEmitted = []; }

  // alignment: AlignmentResult. assignment: role assignment. mirror: boolean (front camera).
  // observedByRole: optional { roleId: { landmarks } } for defense-in-depth visibility filtering.
  // Returns the limited, stable, mirrored set of hints.
  decide({ alignment, assignment, mirror, observedByRole }) {
    if (!alignment) return [];
    // Suppress when evidence inadequate.
    if (!alignment.inferredFromRealModel) return [];
    if (alignment.confidence < 0.35) return [];
    if (alignment.blockingReasons && alignment.blockingReasons.some((r) => r.startsWith('role_'))) return [];
    if (alignment.blockingReasons && alignment.blockingReasons.includes('low_visibility')) return [];

    const candidates = (alignment.topCorrections || []).slice();
    // Defense-in-depth: NEVER emit a confident correction for an invisible joint,
    // even if one reaches the coach. Check the observed landmarks directly.
    const visible = candidates.filter((c) => {
      if (c.excluded) return false;
      if (c.delta < this.opts.minDeltaForHint) return false;
      if (!observedByRole) return true; // no landmarks to check — trust the scorer
      const lm = observedByRole[c.roleId || 'A'];
      if (!lm) return true;
      const kpDef = jointKeypoints(c.joint);
      return kpDef.every((k) => (lm[k]?.visibility || lm[k]?.confidence || 0) >= this.opts.minVisibility);
    });

    // Mirror joint labels for front camera so directions are anatomically correct.
    const mapped = visible.map((c) => ({
      ...c,
      displayJoint: (mirror && this.opts.mirrorFrontCamera) ? mirrorJoint(c.joint) : c.joint,
      hint: (mirror && this.opts.mirrorFrontCamera) ? mirrorHint(c.hint) : c.hint,
    }));

    // Limit & stability: keep top maxHints; only emit ones stable for minStableFrames.
    const limited = mapped.slice(0, this.opts.maxHints);
    const counts = {};
    for (const h of limited) counts[h.joint + ':' + (h.roleId || '')] = (counts[h.joint + ':' + (h.roleId || '')] || 0) + 1;
    const emitted = [];
    for (const h of limited) {
      const key = (h.roleId || 'A') + ':' + h.joint;
      const c = (this.stableHints.get(key) || 0) + 1;
      this.stableHints.set(key, c);
      if (c >= this.opts.minStableFrames) emitted.push(h);
    }
    // Decay hints not seen this frame.
    for (const key of [...this.stableHints.keys()]) {
      const stillPresent = limited.some((h) => (h.roleId || 'A') + ':' + h.joint === key);
      if (!stillPresent) {
        const c = this.stableHints.get(key) - 1;
        if (c <= 0) this.stableHints.delete(key); else this.stableHints.set(key, c);
      }
    }

    // Add relational hints when present.
    if (alignment.blockingReasons) {
      for (const r of alignment.blockingReasons) {
        if (r === 'missing_partner') emitted.push({ kind: 'relational', hint: 'Your partner is not fully in frame; step together.' });
        else if (r === 'too_many_people') emitted.push({ kind: 'relational', hint: 'An extra person was detected; scoring is paused.' });
        else if (r === 'contact_unsatisfied' || r.startsWith('contact_unsatisfied')) emitted.push({ kind: 'relational', hint: 'Move closer until the required contact meets.' });
      }
    }

    this.lastEmitted = emitted;
    return emitted;
  }
}

function mirrorJoint(j) {
  return j.replace(/^left/, '__L__').replace(/^right/, 'left').replace(/^__L__/, 'right');
}
function mirrorHint(hint) {
  if (!hint) return hint;
  return hint.replace(/\bleft\b/gi, '__L__').replace(/\bright\b/gi, 'left').replace(/\b__L__\b/gi, 'right');
}

// Joint → the canonical landmarks that must be visible to correct that joint.
function jointKeypoints(joint) {
  return {
    leftShoulder: ['leftShoulder', 'leftElbow', 'leftHip'],
    rightShoulder: ['rightShoulder', 'rightElbow', 'rightHip'],
    leftElbow: ['leftWrist', 'leftElbow', 'leftShoulder'],
    rightElbow: ['rightWrist', 'rightElbow', 'rightShoulder'],
    leftHip: ['leftKnee', 'leftHip', 'leftShoulder'],
    rightHip: ['rightKnee', 'rightHip', 'rightShoulder'],
    leftKnee: ['leftAnkle', 'leftKnee', 'leftHip'],
    rightKnee: ['rightAnkle', 'rightKnee', 'rightHip'],
    spine: ['leftHip', 'rightHip', 'leftShoulder', 'rightShoulder'],
    neck: ['nose', 'leftShoulder', 'rightShoulder'],
  }[joint] || [];
}
