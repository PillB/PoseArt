// ============================================================
// PoseArt Solarize — Pipeline Engine (Solarize §9)
// ------------------------------------------------------------
// Wires the full real-camera pipeline:
//   camera → FrameScheduler → PoseModel → DetectorAdapter →
//   PersonTracker → RoleAssigner → PoseScorer → Coach →
//   AutoCaptureGate → (caller renders overlay + HUD)
//
// SIMULATION is structurally isolated: it never produces real
// score history, achievements, or auto-capture. The engine exposes
// the active profile, model, backend, FPS, latency and limitations
// for the UI (Solarize §7).
// ============================================================

import { adaptDetectionFrame } from './detector-adapters.js';
import { PersonTracker } from './person-tracker.js';
import { RoleAssigner } from './role-assignment.js';
import { PoseScorer } from './pose-scorer.js';
import { Coach } from './coaching.js';
import { AutoCaptureGate } from './auto-capture.js';
import { PROFILES, isRealProfile, negotiateProfile } from './runtime-profiles.js';
import { evaluatePropContact } from './props.js';

export class SolarizeEngine {
  constructor(opts = {}) {
    this.profile = opts.profile || PROFILES.SIMULATION;
    this.model = opts.model || null;             // PoseModelRuntime instance
    this.tracker = new PersonTracker(opts.trackerOpts);
    this.roleAssigner = new RoleAssigner(opts.roleOpts);
    this.scorer = new PoseScorer(opts.scorerOpts);
    this.coach = new Coach(opts.coachOpts);
    this.captureGate = new AutoCaptureGate(opts.captureOpts);
    this.scheduler = opts.scheduler || null;
    this.mirror = opts.mirror ?? false;          // front camera mirror
    this.rotation = opts.rotation || 0;          // landscape rotation deg
    this.scene = null;
    this.runtimeInfo = { modelReady: false, fatalError: null, backend: null, inferenceFps: 0, lastLatencyMs: 0, inferenceCount: 0 };
    this._lastFrameTs = 0;
    this._lastDtMs = 33;
    this._fpsWindow = [];
  }

  static negotiateProfile(capabilities) { return negotiateProfile(capabilities); }
  static PROFILES = PROFILES;
  static isRealProfile = isRealProfile;

  setScene(scene) {
    this.scene = scene;
    this.tracker.reset();
    this.roleAssigner.reset();
    this.scorer.reset();
    this.captureGate.reset();
    this.coach.reset();
  }

  setProfile(profile) {
    this.profile = profile;
    // Real achievements/auto-capture only in real profiles.
  }

  // Process one detection (already-adapted path) — used by tests + worker.
  processDetection(detection, frameTs) {
    if (!this.profile.realModel || !this.model || !this.model.ready) {
      return this._simulationResult(frameTs);
    }
    const observed = adaptDetectionFrame(detection, { mirror: this.mirror, rotation: this.rotation, timestamp: frameTs });
    const confirmed = this.tracker.update(observed, frameTs);
    const tracks = confirmed.map((t) => ({ trackId: t.trackId, landmarks: t.landmarks, confidence: t.confidence, root: t.root, scale: t.scale, facingEstimate: null }));
    const assignment = this.roleAssigner.assign(tracks, this.scene?.targetPeople || [], 0);
    const observedByRole = {};
    for (const a of (assignment.assignment || [])) {
      const t = tracks.find((x) => x.trackId === a.trackId);
      if (t) observedByRole[a.roleId] = t;
    }
    const observedArr = Object.values(observedByRole);
    const alignment = this.scorer.score({
      observed: observedArr, scene: this.scene, assignment, profile: this.profile,
      runtime: { modelReady: this.model.ready, fatalError: this.model.fatalError }, frameTimestamp: frameTs,
    });
    // Contact + prop satisfaction for the capture gate
    let contactsSatisfied = true;
    if (this.scene?.contacts) {
      for (const c of this.scene.contacts) {
        if (c.participantA.startsWith('prop:') || c.participantB.startsWith('prop:')) {
          const r = evaluatePropContact(c, observedByRole, this.scene.props || []);
          if (!r.excluded && !r.satisfied) contactsSatisfied = false;
          if (r.excluded) {} // excluded contacts don't block
        } else {
          // person-to-person
          const aT = observedByRole[c.participantA], bT = observedByRole[c.participantB];
          if (aT && bT) {
            const aL = aT.landmarks[c.anchorA], bL = bT.landmarks[c.anchorB];
            if (aL && bL && (aL.visibility||aL.confidence) >= 0.3 && (bL.visibility||bL.confidence) >= 0.3) {
              const d = Math.hypot(aL.x - bL.x, aL.y - bL.y);
              if (d > c.targetDistance + c.tolerance) contactsSatisfied = false;
            }
          } else contactsSatisfied = false;
        }
      }
    }
    const personCount = tracks.length;
    const requiredCount = this.scene?.targetPeople?.length || 1;
    const capture = this.captureGate.evaluate({ alignment, profile: this.profile, frameTs, dtMs: this._lastDtMs, personCount, requiredCount, contactsSatisfied });
    const hints = this.coach.decide({ alignment, assignment, mirror: this.mirror, observedByRole });

    // FPS bookkeeping
    if (frameTs && this._lastFrameTs) this._lastDtMs = Math.max(1, frameTs - this._lastFrameTs);
    this._lastFrameTs = frameTs;
    this.runtimeInfo.inferenceCount++;
    if (this.model.lastLatencyMs) { this.runtimeInfo.lastLatencyMs = this.model.lastLatencyMs; this._fpsWindow.push(this.model.lastLatencyMs); if (this._fpsWindow.length > 30) this._fpsWindow.shift(); const avg = this._fpsWindow.reduce((a,b)=>a+b,0)/this._fpsWindow.length; this.runtimeInfo.inferenceFps = avg ? 1000/avg : 0; }
    this.runtimeInfo.modelReady = this.model.ready; this.runtimeInfo.fatalError = this.model.fatalError; this.runtimeInfo.backend = this.model.backend;

    return { alignment, assignment, tracks, hints, capture, observed: observedArr, detectedPersons: observed, runtimeInfo: this.runtimeInfo };
  }

  _simulationResult(frameTs) {
    // SIMULATION: explicitly labelled, no real score, no capture.
    const alignment = {
      eligible: false, overallScore: 0, confidence: 0, perPersonScores: [],
      relationalScore: 0, propScore: 0, stabilityScore: 0, excludedComponents: [],
      blockingReasons: ['simulation_mode'], topCorrections: [],
      profile: 'SIMULATION', inferredFromRealModel: false,
    };
    return { alignment, assignment: { resolved: false, abstain: true, reason: 'simulation_mode' }, tracks: [], hints: [], capture: { capture: false, reason: 'simulation_mode', holdMs: 0 }, observed: [], detectedPersons: [], runtimeInfo: this.runtimeInfo };
  }

  // Run inference on a raw frame (video/canvas/deterministic descriptor) using the model.
  async processFrame(frame) {
    if (!this.profile.realModel || !this.model || !this.model.ready) return this._simulationResult(frame?.timestamp || 0);
    const ts = frame?.timestamp || performance.now();
    const detection = await this.model.detect(frame);
    return this.processDetection(detection, ts);
  }
}
