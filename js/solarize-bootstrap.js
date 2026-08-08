// ============================================================
// PoseArt Solarize — Browser bootstrap
// ------------------------------------------------------------
// Loads the Solarize engine + model runtimes + schema factories
// as an ES module and exposes them on window.PoseArtSolarize so
// the classic-script app (camera.js) can drive the real pipeline.
// Also builds the couple-pose PoseScene map at load.
// ============================================================

import { SolarizeEngine } from './solarize/engine.js';
import { DeterministicPoseModel, MoveNetRuntime, MediaPipeRuntime, MODEL_REGISTRY, chooseDefaultModel } from './solarize/pose-model-runtime.js';
import { DeterministicFrameSource, CameraSource, FrameScheduler } from './solarize/camera-source.js';
import { PROFILES, negotiateProfile, isRealProfile } from './solarize/runtime-profiles.js';
import {
  makePoseScene, makeTargetPerson, makePropRecord, makeContactConstraint,
  CANONICAL_LANDMARKS, CANONICAL_BONES, validatePoseScene,
} from './solarize/canonical-schema.js';
import { buildCoupleScenes } from './solarize/couple-scenes.js';
import { ModelActivationManager, ACTIVATION_STATE, chooseModel, chooseBackend, detectCapabilities } from './solarize/model-activation.js';
import { PoseWorkerService } from './solarize/pose-worker-service.js';
import { exportFileName, exportMetadata, exportSidecarName, downloadSidecarMetadata, shareTitle } from './solarize/export-metadata.js';
import { FramePoseHeuristic } from './solarize/frame-pose-heuristic.js';
import { OneEuroFilter, OneEuroKeypointSmoother } from './solarize/one-euro-filter.js';
import { FramePersonDetector } from './solarize/frame-person-detector.js';
import { BoneLengthConstraint, ConfidenceGate, FlipDisambiguator } from './solarize/bone-constraints.js';

function boot() {
  // couple-scenes.js runs buildCoupleScenes() on import and sets
  // window.PoseArtCoupleScenes. Ensure it's populated here too.
  if (typeof window !== 'undefined' && !window.PoseArtCoupleScenes) {
    try { buildCoupleScenes(); } catch (_) { /* handled below */ }
  }
  const coupleScenes = (typeof window !== 'undefined' && window.PoseArtCoupleScenes)
    ? window.PoseArtCoupleScenes : {};

  window.PoseArtSolarize = Object.freeze({
    SolarizeEngine,
    DeterministicPoseModel,
    MoveNetRuntime,
    MediaPipeRuntime,
    DeterministicFrameSource,
    CameraSource,
    FrameScheduler,
    PROFILES,
    negotiateProfile,
    isRealProfile,
    MODEL_REGISTRY,
    chooseDefaultModel,
    ModelActivationManager,
    ACTIVATION_STATE,
    chooseModel,
    chooseBackend,
    detectCapabilities,
    PoseWorkerService,
    PoseArtExport: Object.freeze({ exportFileName, exportMetadata, exportSidecarName, downloadSidecarMetadata, shareTitle }),
    FramePoseHeuristic,
    OneEuroFilter,
    OneEuroKeypointSmoother,
    FramePersonDetector,
    BoneLengthConstraint,
    ConfidenceGate,
    FlipDisambiguator,
    makePoseScene,
    makeTargetPerson,
    makePropRecord,
    makeContactConstraint,
    CANONICAL_LANDMARKS,
    CANONICAL_BONES,
    validatePoseScene,
    coupleScenes,
    schemaRevision: 1,
  });

  // Emit a ready event so camera.js can initialize on demand.
  window.dispatchEvent(new CustomEvent('poseart:solarize-ready', { detail: { coupleSceneCount: Object.keys(coupleScenes).length } }));
}

if (typeof window !== 'undefined') {
  boot();
}
