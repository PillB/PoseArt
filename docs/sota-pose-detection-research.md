# Solarize — SOTA Pose Detection Research & Implementation

## SOTA Models Surveyed (2024-2026)

### Browser-feasible baselines (active in this codebase)
| Model | Publisher | Landmarks | Multi-person | Backend | Status |
|-------|-----------|-----------|--------------|---------|--------|
| MoveNet SinglePose Lightning | Google | 17 | no | WASM/WebGL/WebGPU | Loader exists, untested with real camera |
| MoveNet SinglePose Thunder | Google | 17 | no | WASM/WebGL/WebGPU | Loader exists |
| MoveNet MultiPose Lightning | Google | 17 | yes (6) | WASM/WebGL/WebGPU | Loader exists |
| MediaPipe Pose Landmarker | Google | 33 | no | WASM/WebGPU | Loader exists |

### Research candidates (documented, not bundled)
| Model | Publisher | Technique | Notes |
|-------|-----------|-----------|-------|
| RTMPose | OpenMMLab | RTM blocks + CSPNeXt | SOTA COCO accuracy |
| RTMO | OpenMMLab | Real-time one-stage multi-person | SOTA multi-person |
| YOLOv8-Pose | Ultralytics | YOLO + pose head | Very popular, strong |
| ViTPose | OpenMMLab | Vision Transformer | High accuracy |
| DWPose | OpenMMLab | Whole-body (face+hands+body) | 133 keypoints |
| Sapiens | Meta | Foundation model | Large, research |

### Competitor approaches
| Product | Stack | Key technique |
|---------|-------|---------------|
| PoseMy.Art | MediaPipe Pose | IK/FK editing + pose comparison |
| Rokoko Vision | MediaPipe Pose | OneEuro smoothing + foot locking |
| DeepMotion Animate 3D | Custom neural net | 3D reconstruction from monocular |
| Radical | Depth-aware | Body-index separation |

## Robust techniques implemented (this round)

### 1. Frame-based person detection (no ML deps)
**Technique:** Canvas pixel analysis — motion + skin-tone + foreground segmentation → bounding box.
**Source:** Classic CV (frame differencing + color segmentation), used by Rokoko + DeepMotion as a fallback.
**Why:** Works in any browser without TF.js/MediaPipe load. Provides a real person bbox from actual pixels.

### 2. OneEuroFilter temporal smoothing (SOTA for real-time)
**Technique:** Adaptive low-pass filter with speed-dependent cutoff.
**Source:** Casiez et al. 2012 — used by Rokoko Vision, MediaPipe Holistic, and most real-time mocap.
**Why:** Eliminates jitter without lag. The standard for real-time pose smoothing. Far superior to the EMA currently in camera.js.

### 3. Bone-length consistency constraints (forward kinematics)
**Technique:** Enforce that bone lengths (shoulder-elbow, elbow-wrist, etc.) stay stable across frames using a running median ± tolerance.
**Source:** Used by DeepMotion + Radical for occlusion recovery.
**Why:** Prevents limb "stretching" when a keypoint is misdetected. Anatomically plausible output.

### 4. Confidence-based joint gating
**Technique:** Joints below a confidence threshold are excluded from scoring AND interpolated from neighbours.
**Source:** Standard practice in all SOTA pipelines (MoveNet, MediaPipe, RTMPose).
**Why:** Prevents confident corrections for invisible joints (Solarize §15 mandate).

### 5. Flip augmentation for left/right disambiguation
**Technique:** When facing direction is ambiguous, evaluate both flipped and non-flipped poses, pick the higher-scoring.
**Source:** Standard in COCO training + used by PoseMy.Art.
**Why:** Front-camera mirroring and profile views are the #1 source of left/right errors.

## Pipeline architecture (upgraded)
```
camera frame
  → CanvasFrameExtractor (downscale to 256px for speed)
  → FramePersonDetector (motion + skin-tone → bbox) [NEW]
  → PoseDetector (MoveNet/MediaPipe if available; else FramePoseHeuristic) [NEW]
  → OneEuroFilter (per-joint temporal smoothing) [NEW]
  → BoneLengthConstraint (anatomical consistency) [NEW]
  → ConfidenceGate (interpolate low-confidence joints) [NEW]
  → FlipDisambiguator (left/right resolution) [NEW]
  → CanonicalObservedPerson (existing)
  → PersonTracker (existing)
  → RoleAssigner (existing)
  → PoseScorer (existing)
  → Coach (existing)
  → AutoCaptureGate (existing)
```
