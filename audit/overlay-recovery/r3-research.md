# R3 — Overlay Recovery Research: Pose Detection, Frame Transport, Scoring, CSP & Deployment

**Task ID:** R3-research
**Agent:** research-lead
**Date:** 2026-08-09
**Scope:** Best-in-class comparison for the five overlay-recovery gap areas (A–E) identified by the orchestrator. Each area documents (1) current PoseArt state, (2) best-in-class target with library/API names and versions, (3) the gap, (4) recommended implementation strategy, and (5) a priority ranking (P0–P3).

This report is research-only — no production code is changed. Findings feed the subsequent implementation tasks (R4+).

---

## 0. Executive Summary

PoseArt's "Solarize" layer is *architecturally complete* but *operationally inert*: every real-pose path (`MoveNetRuntime`, `MediaPipeRuntime`, `PoseWorkerService`) is wired, gated, fallback-chained, and unit-tested — but **none of it can run on the production GitHub Pages deployment** because:

1. The runtime uses bare-module dynamic imports (`await import('@tensorflow/tfjs')`, `await import('@mediapipe/tasks-vision')`) with **no import map** and **no bundled fallback** — the imports will reject on the production site.
2. The current Content-Security-Policy (`connect-src 'self'`) blocks every CDN that hosts the WASM + model files.
3. The worker posts `{ video: HTMLVideoElement }` via `postMessage`, which **fails structured clone** at runtime — the comment in `pose-worker-service.js:91-92` admits this but the production code path (`camera.js:281`) still passes the live video element.
4. The entire repository (audit reports, agent prompts, test fixtures, .bak-v1…v25, scripts/, docs/) is published to the public GitHub Pages site because `deploy.yml` uploads `path: .`.

These are not edge cases — they are blocking defects that explain why simulation mode is the *only* mode that actually works in production today. Scoring policy is sound but its thresholds are inconsistent across modules and uncalibrated per-user.

The recommended path is a single, focused **P0 effort**: vendor MediaPipe Tasks Vision's WASM + a small Pose Landmarker `.task` model file, fix the CSP, fix the worker frame transport, and add an allowlist build step. This unlocks the existing Solarize pipeline without rewriting any of the 22 modules.

---

## A. Pose Detection Model

### A.1 Current PoseArt State

**Files inspected:**
- `js/solarize/pose-model-runtime.js` (175 lines)
- `js/solarize/detector-adapters.js` (198 lines)
- `js/solarize/model-activation.js` (272 lines)
- `js/solarize/pose-worker-service.js` (293 lines, worker source inlined as a string)
- `js/solarize/runtime-profiles.js` (62 lines)
- `package.json`

**Current runtime model registry** (`MODEL_REGISTRY`, frozen):

| `modelId` | Publisher | Landmarks | MultiPerson | Backends |
|---|---|---|---|---|
| `movenet-singlepose-lightning` | Google | 17 | no | wasm, webgl, webgpu |
| `movenet-singlepose-thunder` | Google | 17 | no | wasm, webgl, webgpu |
| `movenet-multipose-lightning` | Google | 17 | yes (≤6) | wasm, webgl, webgpu |
| `mediapipe-pose-landmarker` | Google | 33 | no | wasm, webgpu, gpu |
| `rtmpose-onnx (research)` | OpenMMLab | 17 | no | wasm, webgpu (not bundled) |
| `rtmo-onnx (research)` | OpenMMLab | 17 | yes | wasm, webgpu (not bundled) |
| `deterministic-test` | PoseArt | 17 | yes | cpu |

**What actually runs in production today:** only `deterministic-test`. The `simulationMode = true` flag in `camera.js:31` is the *de facto* state for every real user; the SIMULATION badge is rendered every frame (`camera.js:172`). The other six entries in `MODEL_REGISTRY` are **loader code that cannot resolve its imports**.

**Why the real models cannot load:**

1. `MoveNetRuntime.init()` does `await import('@tensorflow/tfjs')` and `await import('@tensorflow-models/pose-detection')` (line 110–111). These are **bare module specifiers**. The browser resolves them against the document base URL — there is no `node_modules` on a static site, no import map in `index.html`, and no bundler step in `deploy.yml`. The dynamic import rejects with `TypeError: Failed to resolve module specifier '@tensorflow/tfjs'`.
2. `MediaPipeRuntime.init()` (line 147–155) hardcodes two remote URLs:
   - WASM: `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm`
   - Model: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`
   - Both are blocked by the current CSP `connect-src 'self'` (see Section D).
3. `pose-worker-service.js` inlines the worker source as a Blob URL. Inside the worker, `await import('@tensorflow/tfjs')` resolves against the blob URL — which has no module graph — so it fails even harder than the main-thread path.
4. `package.json` declares **no runtime dependencies** — only `devDependencies` (playwright, eslint, jsdom, vitest). Even a local dev server cannot import TF.js without first `bun add`-ing the packages, which is not in any documented setup step.

**Camera-driven detection (Solarize path):** `camera.js:_processFrameSolarize()` does correctly route through `ModelActivationManager → PoseWorkerService → model.detect(frame)`, but `ModelActivationManager.activate('movenet-singlepose-lightning')` falls through the entire chain (worker → direct → deterministic) and lands on `FALLBACK` state every time.

### A.2 Best-in-Class Target

| Library / API | Version (late-2025) | Bundle size (gzipped) | Landmarks | MultiPerson | License | Notes |
|---|---|---|---|---|---|---|
| **MediaPipe Tasks Vision** `PoseLandmarker` | `@mediapipe/tasks-vision` **0.10.18** | WASM ~3.5 MB + .task model 3–10 MB | 33 + worldLandmarks (metric) | yes (`numPoses`, ≤10 in practice) | Apache-2.0 | Google's current SOTA for browser pose; replaces the legacy `@mediapipe/pose` solution API. |
| **TensorFlow.js MoveNet** (via `@tensorflow-models/pose-detection`) | tfjs **4.22.0**, pose-detection **2.1.3** | tfjs core ~150 KB + WASM backend ~1.2 MB + model 9–13 MB | 17 | Single or Multi (≤6) | Apache-2.0 | Mature, well-documented; MultiPose is the only practical multi-person RGB option that runs in WASM. |
| **TensorFlow.js BlazePose** | pose-detection 2.1.3 | ~18 MB total | 33 | no | Apache-2.0 | Heavier than MoveNet; MediaPipe Tasks Vision supersedes it. |
| **ONNX Runtime Web + RTMPose** | onnxruntime-web **1.20.1** + RTMPose-m AP10k | ~2 MB WASM + 50–100 MB model | 17 (COCO) or 133 (DWPose) | with RTMO | Apache-2.0 (runtime) / check upstream model | Research track; better accuracy on hard poses but heavier; reserved for a future "Pro" profile. |

**Best-in-class pick for PoseArt on GitHub Pages:**

- **Primary: `@mediapipe/tasks-vision` 0.10.18 `PoseLandmarker` with the `pose_landmarker_full.task` model (~6.5 MB, float16).**
  - 33 landmarks give the canonical-schema adapter (`adaptMediaPipePose`) richer signal than MoveNet's 17, especially for the spine/neck joints PoseArt already uses (see `MEDIAPIPE_TO_CANONICAL` in `detector-adapters.js:32`).
  - World landmarks provide a metric 3D skeleton that can drive future depth-bridge profiles without a model swap.
  - The `forVisionTasks()` fileset can be pointed at a local path (`/vendor/mediapipe/wasm/`) — eliminating the `cdn.jsdelivr.net` CSP dependency.
  - The `.task` model file is small enough to commit (~6.5 MB) and version-pin via Git LFS or a single binary commit; this removes the `storage.googleapis.com` CSP dependency.

- **Secondary (multi-person): `movenet-multipose-lightning`** via `@tensorflow-models/pose-detection` 2.1.3 + `@tensorflow/tfjs` 4.22.0 with the **WASM SIMD backend** (the only backend that ships reliably across iOS Safari 16.4+, Firefox, and Chromium). Loaded via an import map that points the bare specifiers at `/vendor/tfjs/` local copies. Used only for the `couple-*` scenes in `js/solarize/couple-scenes.js` where MediaPipe's `numPoses:2` is also acceptable but MoveNet is faster.

  *Decision:* Use **MediaPipe `numPoses:2`** for couples too — keeps one runtime, one WASM file, one model family. Reserve MoveNet for the rare case MediaPipe fails to load (it's already wired as a fallback in `MODEL_REGISTRY`).

### A.3 Gap: Current vs. Best-in-Class

| Dimension | Current | Best-in-Class | Gap |
|---|---|---|---|
| Active model in production | `deterministic-test` (clock-driven) | MediaPipe Pose Landmarker Full | Real pose inference never runs |
| Landmarks per person | 17 (synthetic) | 33 (real) + 17 (world) | Missing spine/neck/hand richness |
| Multi-person | Not supported in production | ≤10 via `numPoses` | Couples path is broken in prod |
| Module loading | Bare-specifier dynamic imports, no resolution | Local vendored ESM via import map | Imports reject |
| WASM delivery | None (CDN URLs blocked by CSP) | `/vendor/mediapipe/wasm/` committed | CSP blocks CDN; no local copies |
| Model asset delivery | None (CDN blocked) | `/vendor/models/pose_landmarker_full.task` committed | CSP blocks CDN; no local copy |
| iOS Safari support | Untested | MediaPipe WASM delegate works on iOS 16.4+ | No CI matrix for iOS |
| License compatibility | Documented Apache-2.0 | Apache-2.0 (Tasks Vision + MoveNet) | ✅ aligned |

### A.4 Recommended Implementation Strategy (Area A)

**Strategy: vendor + import map, no bundler.** PoseArt's "vanilla HTML/CSS/JS, no build step" identity is preserved; we add a single `scripts/sync-vendor.js` step that downloads the pinned versions into `vendor/` and an `<script type="importmap">` block in `index.html`.

1. **Pin versions** (commit a `vendor/manifest.json`):
   - `@mediapipe/tasks-vision@0.10.18` (JS + `/wasm` directory, ~3.5 MB)
   - `pose_landmarker_full.task` (float16, ~6.5 MB) from `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/`
   - `@tensorflow/tfjs@4.22.0`, `@tensorflow-models/pose-detection@2.1.3`, `@tensorflow/tfjs-backend-wasm@4.22.0` (WASM SIMD threads binary, ~1.2 MB) — vendored as fallback only.

2. **Add import map** to `index.html` `<head>` (before the module scripts):
   ```html
   <script type="importmap">
   {
     "imports": {
       "@mediapipe/tasks-vision": "/vendor/mediapipe/tasks-vision@0.10.18.js",
       "@tensorflow/tfjs": "/vendor/tfjs/tfjs@4.22.0.js",
       "@tensorflow-models/pose-detection": "/vendor/tfjs/pose-detection@2.1.3.js"
     }
   }
   </script>
   ```

3. **Update `MediaPipeRuntime.init()`** (`pose-model-runtime.js:147`) to use the local WASM fileset and the local model asset:
   ```js
   const fileset = await v.FilesetResolver.forVisionTasks('/vendor/mediapipe/wasm');
   this.landmarker = await v.PoseLandmarker.createFromOptions(fileset, {
     baseOptions: {
       modelAssetPath: '/vendor/models/pose_landmarker_full.task',
       delegate: 'GPU',
     },
     runningMode: 'VIDEO',
     numPoses: 2,            // couples support
     minPoseDetectionConfidence: 0.5,
     minPosePresenceConfidence: 0.5,
     minTrackingConfidence: 0.5,
   });
   ```

4. **Update `chooseDefaultModel()`** (`pose-model-runtime.js:170`) to return `'mediapipe-pose-landmarker'` for both `RGB_HIGH_PERFORMANCE` and `RGB_COMPATIBLE`. MoveNet multipose stays as a fallback for the rare case where MediaPipe WASM fails to initialise.

5. **Add a deterministic capability test** (`scripts/check-vendor.js`): runs at build time in CI, fails the deploy if any vendored file is missing or hash-mismatched.

6. **Lazy-load** the model on the *camera screen* open, not at app boot. `camera.js:_initSolarize()` already does this — keep it. Use a single `requestIdleCallback` to pre-fetch the WASM after first paint.

7. **Document the vendoring step** in `docs/SETUP.md`: `bun run scripts/sync-vendor.js` (idempotent — skips files already present and hash-verified).

### A.5 Priority: **P0**

Real pose detection is the foundational gap — overlay recovery, scoring, coaching, and auto-capture are all architecturally complete but *operationally dead* until this is fixed.

---

## B. Worker / Frame Transport

### B.1 Current PoseArt State

**Files inspected:**
- `js/solarize/pose-worker-service.js` (293 lines)
- `js/solarize/camera-source.js` (100 lines)
- `js/camera.js` lines 258–307 (`_processFrameSolarize`)
- `js/solarize/model-activation.js` lines 154–176 (`detect`)

**Architecture (as designed):**

```
camera.js (_processFrameSolarize)
  ↓  frame = { video: HTMLVideoElement, width, height, timestamp }
ModelActivationManager.detect(frame)
  ↓  this._worker.detect(frame)   [if worker is active]
PoseWorkerService.detect(frame)
  ↓  this.worker.postMessage({ type:'detect', frame, monotonic })    [NO transfer list]
Worker (blob-URL)
  ↓  model.detect(msg.frame)
MoveNetRuntime.detect(videoOrCanvas)   [expects a <video> or <canvas>]
  ↓  detector.estimatePoses(videoOrCanvas, …)
```

**Defects in the current implementation:**

1. **HTMLVideoElement is not structured-cloneable.** `postMessage(frame)` where `frame.video` is a live `HTMLVideoElement` throws `DataCloneError` in every modern browser. The code in `pose-worker-service.js:91-92` admits this:
   ```js
   // Transfer the frame descriptor (structured clone). For video frames,
   // the caller should pass a lightweight descriptor, not a VideoFrame.
   ```
   But the actual caller (`camera.js:281`) still builds `frame = { video: this.videoEl, … }` — so the Solarize path is unreachable from the camera today. It only works for the deterministic demo path where `frame.descriptor` is a plain object.

2. **No transferables are used anywhere.** `postMessage(msg)` has no second argument; nothing is transferred (zero-copy). Every frame would be copied.

3. **The worker cannot access the GPU or the `<video>` element** even if the message did transfer — `OffscreenCanvas` is never created, no `transferControlToOffscreen()` call exists.

4. **`FrameScheduler`** (`camera-source.js:72`) implements keep-latest correctly on the *main* thread but the worker does its own keep-latest in `PoseWorkerService.detect()` — they duplicate each other and the worker-side one is sufficient.

5. **No `VideoFrame` (WebCodecs) usage.** `VideoFrame` is the right transferable for this use case (Chrome 94+, Safari 16.4+, Firefox 130+), but the code never constructs one.

6. **No backpressure.** If inference is slower than the preview FPS, the worker keeps receiving `detect` requests that resolve as `dropped: true` — the keep-latest logic drops them, but the main thread still pays the cost of constructing the frame and posting the message.

### B.2 Best-in-Class Target

The canonical architecture for real-time pose inference in a Web Worker (as of late 2025, used by MediaPipe's own samples and Rokoko Vision) is one of:

| Approach | Transfer mechanism | Zero-copy? | Browser support | When to use |
|---|---|---|---|---|
| **(1) `VideoFrame` (WebCodecs)** | `new VideoFrame(videoEl)` → `postMessage(msg, [videoFrame])` → worker calls `detector.detectForVideo(videoFrame, ts)` → `videoFrame.close()` | yes (GPU buffer passthrough) | Chrome 94+, Safari 16.4+, Firefox 130+ | Best — the only zero-copy path. Use when available. |
| **(2) `ImageBitmap`** | `createImageBitmap(videoEl, {resizeWidth, resizeHeight, imageOrientation:'flipY'})` → transfer → worker draws to OffscreenCanvas → `detector.detectForVideo(canvas, ts)` | yes (bitmap handle) | Chrome 50+, Safari 7.1+, Firefox 42+ (universal) | Universal fallback. Adds a copy at `createImageBitmap` but no copy in postMessage. |
| **(3) OffscreenCanvas in worker** | `canvas.transferControlToOffscreen()` to worker; worker calls `canvas.getContext('2d').drawImage(videoEl)` — **fails** because `videoEl` lives on main thread. | n/a | n/a | Does not work for `<video>` source — listed here to document why we don't use it. |
| **(4) Main-thread detect, no worker** | Skip the worker; call `detector.detectForVideo(videoEl, ts)` on the main thread. | n/a | all | Acceptable fallback for low-end devices where worker round-trip cost exceeds inference cost. |

**Best-in-class pick for PoseArt:**

- **Primary: `VideoFrame` transfer** (Approach 1) when `window.VideoFrame` is defined.
- **Fallback: `ImageBitmap` transfer** (Approach 2) — universally supported, only ~1 ms of overhead per frame at 480p.
- **Last resort: main-thread inference** (Approach 4) when neither worker nor transferables are available — keep the existing `MoveNetRuntime` direct path as the final fallback.

The MediaPipe `PoseLandmarker` `detectForVideo()` accepts both `HTMLVideoElement`, `ImageBitmap`, and `VideoFrame` as its first argument — so the adapter does not need to change.

### B.3 Gap: Current vs. Best-in-Class

| Dimension | Current | Best-in-Class | Gap |
|---|---|---|---|
| Frame handle passed to worker | `HTMLVideoElement` (fails structured clone) | `VideoFrame` (transferable) | Hard crash; never reaches worker |
| `postMessage` transfer list | none | `[videoFrame]` or `[imageBitmap]` | Full copy on every frame |
| Worker OffscreenCanvas | not used | optional, for pre-resize | unnecessary; `createImageBitmap` resize is enough |
| Backpressure | none — main thread builds frames that get dropped | skip frame acquisition when worker is busy | wasted main-thread CPU |
| Worker module resolution | blob URL with no module graph | module worker (`new Worker(url, { type: 'module' })`) with import map inheritance | dynamic `import()` inside worker fails |
| Frame size optimization | full video resolution passed | downscale to 256×256 (MediaPipe input size) via `createImageBitmap({resizeWidth:256, resizeHeight:256})` | 6× more pixels than needed |
| Worker lifecycle | created per CameraEngine | reused across camera start/stop | works on a per-session basis — minor |

### B.4 Recommended Implementation Strategy (Area B)

1. **Introduce `FrameTransport` helper** (`js/solarize/frame-transport.js`, new file):
   ```js
   export async function captureTransferableFrame(videoEl, targetW=256, targetH=256) {
     if (typeof VideoFrame !== 'undefined') {
       try { return new VideoFrame(videoEl, { timestamp: performance.now() }); }
       catch (_) { /* fall through to ImageBitmap */ }
     }
     return await createImageBitmap(videoEl, {
       resizeWidth: targetW, resizeHeight: targetH, imageOrientation: 'flipY',
     });
   }
   ```

2. **Update `camera.js:_processFrameSolarize`** to build the frame with `captureTransferableFrame(this.videoEl)` and post it via `worker.detect({ frame, transfer: [frame] })`.

3. **Update `PoseWorkerService.detect()`** to accept `{ frame, transfer }` and pass the transfer list to `postMessage`. After the worker resolves, the main thread calls `frame.close()` if it's a `VideoFrame` (to release the GPU buffer); `ImageBitmap.close()` for bitmaps.

4. **Convert the worker to a module worker**: `new Worker(url, { type: 'module' })` so dynamic `import('@mediapipe/tasks-vision')` resolves via the import map inherited from the document. (Module workers are supported in Chrome 80+, Safari 15+, Firefox 114+ — universal on the devices that can run pose inference at all.)

5. **Add backpressure**: in `PoseWorkerService.detect()`, if `this._pending` already exists, do not call `createImageBitmap` for the new frame — just resolve the previous pending with `dropped:true` and let the next rAF call capture a fresh frame. This avoids the wasted work of capturing frames the worker will never see.

6. **Downscale at capture**: `createImageBitmap({ resizeWidth: 256, resizeHeight: 256 })` — MediaPipe Pose Landmarker internally resizes to 256×256 anyway; doing it at capture saves the cross-thread copy of the full-resolution frame.

7. **Keep the deterministic path** untouched — its `frame.descriptor` is a plain object that structured-clones cleanly.

### B.5 Priority: **P0**

Without fixing the frame transport, the worker path is unreachable and Area A's vendored models cannot be exercised from the camera.

---

## C. Scoring Policy

### C.1 Current PoseArt State

**Files inspected:**
- `js/solarize/pose-scorer.js` (354 lines)
- `js/solarize/auto-capture.js` (81 lines)
- `js/camera.js` (threshold sites at lines 22, 537, 562, 856, 886, 959)

**Architecture (well-designed):**

`PoseScorer.score()` implements a **6-gate decomposition**:
1. Runtime validity (model ready, no fatal error)
2. Scene eligibility (correct person count, visibility, framing, role resolution)
3. Per-person pose similarity (OKS + bone cosine + joint angle + orientation + ground support)
4. Relational (relative root distance, ordering)
5. Props (required-prop contact satisfaction)
6. Temporal stability (variance over the last 8 frames)

Per-person similarity (Gate 3) is a weighted blend:
```
score = 0.40·OKS + 0.25·boneSim + 0.20·angleSim + 0.10·orientSim + 0.05·supportSim
```
Overall:
```
overall = 0.60·personScoreAvg + 0.20·relational + 0.10·prop + 0.10·stability
```

**Hardcoded thresholds (DEFAULTS in `pose-scorer.js:18-27`):**
| Threshold | Value | Used for |
|---|---|---|
| `minPersonConfidence` | 0.35 | mean landmark visibility floor |
| `minLandmarkVisibility` | 0.30 | per-joint visibility floor |
| `scoreThresholdAutoCapture` | 0.82 (82%) | overall score gate for auto-capture |
| `confidenceThresholdAutoCapture` | 0.60 | confidence gate for auto-capture |
| `framingMargin` | 0.06 | in-frame margin (6%) |
| `temporalHoldFrames` | 6 | ~0.2s @30fps stability window |
| `landmarkStabilityWindow` | 8 | frames in the variance buffer |

**Inconsistencies across modules:**

| Module | Threshold | Value | Purpose |
|---|---|---|---|
| `camera.js:22` | `autocaptureThreshold` | **85** | local threshold (used?) |
| `camera.js:537, 562, 856, 886, 959` | `if (score >= 85)` | **85** | visual "ALIGNED" halo, ring color, particle bloom |
| `pose-scorer.js:22` | `scoreThresholdAutoCapture` | **82** | structural auto-capture gate |
| `auto-capture.js:12` | `scoreThreshold` | **82** | redundant copy of the scorer's threshold |
| `auto-capture.js:13` | `confidenceThreshold` | **0.6** | confidence gate |

The task description mentions thresholds (85, 82, 90, 78) — 85 and 82 are confirmed above; 90 and 78 are not present in the current source tree (likely legacy values from a prior version). **The 85/82 split is the live inconsistency**: the structural scorer says 82, but every visual reward fires at 85. Users see a green "ALIGNED" ring at 85 and an auto-capture at 82 — the gap (3 percentage points) means the camera may capture before the UI says "aligned."

**Calibration methodology:** none. Thresholds are constant across:
- All 745 poses (no per-pose difficulty weighting).
- All users (no warm-up baseline).
- All body types (no scale normalization beyond `torsoScale`).
- All lighting conditions (no confidence-based threshold adjustment).

**OKS implementation:** `oksDistance()` in `canonical-schema.js` uses the standard COCO OKS formula with per-keypoint scaling factors. This is the academic best-practice metric — ✅ aligned.

**Angle error normalization:** `pose-scorer.js:197`:
```js
const angleSim = angN ? 1 - (angErr / angN) / 90 : 0;
```
Divides mean angle error by 90°. This is harsh — most anatomical joints have a useful ROM of 30–180°, so a 45° error maps to 50% similarity. The COCO OKS per-keypoint scale factors are not applied to the angle metric.

### C.2 Best-in-Class Target

**Academic baselines:**
- **OKS (Object Keypoint Similarity)** — the COCO standard; PoseArt already implements it. ✅
- **PCK (Percentage of Correct Keypoints)** at α=0.1·head — older, less nuanced than OKS.
- **PDJ (Probability of Detection Joints)** — used by DeepPose; superseded by OKS.
- **bone-vector cosine similarity** — used by DeepMotion + Radical for occlusion-robust comparison. PoseArt already implements. ✅
- **Temporal OKS** — average OKS over a sliding window (supresses single-frame jitter). PoseArt's Gate 6 approximates this via variance, but does not average OKS over time.

**Best-in-class scoring architecture for an interactive pose-coaching app:**

| Component | Best practice | Source |
|---|---|---|
| Spatial similarity | OKS with per-keypoint scale factors | COCO eval kit |
| Skeleton similarity | Bone-vector cosine sim | DeepMotion, Radical |
| Joint-angle similarity | Normalized by per-joint ROM (not by 90°) | OpenPose ROM tables |
| Temporal stability | EMA-smoothed OKS over 0.5s window | Rokoko Vision |
| Confidence weighting | OKS-weighted-by-visibility (per-joint mask) | MoveNet + MediaPipe docs |
| Per-pose difficulty | Difficulty-weighted joint subset | Yoga coaching apps (e.g., Asana Rebel) |
| User calibration | 5-second baseline capture, threshold adapted to ±0.5σ | Kinect-based physiotherapy research |

### C.3 Gap: Current vs. Best-in-Class

| Dimension | Current | Best-in-Class | Gap |
|---|---|---|---|
| Spatial metric | OKS | OKS | ✅ aligned |
| Bone metric | Cosine similarity | Cosine similarity | ✅ aligned |
| Angle normalization | `/ 90°` (harsh) | Per-joint ROM normalization | Penalties too steep |
| Temporal smoothing | Variance penalty only | EMA-smoothed OKS | Single bad frame still tanks score |
| Confidence weighting | Excluded components list | Per-joint OKS mask | Hard exclusion instead of soft down-weighting |
| Per-pose difficulty | None | Difficulty-weighted joint subset | Sitting pose penalizes ankle position equally with shoulder |
| User calibration | None | 5-second baseline + adaptive threshold | A flexible user is held to the same threshold as a stiff one |
| Threshold consistency | 85 in camera.js, 82 in scorer | Single source of truth | Visible inconsistency |
| Profile sensitivity | `_sensitivity` 0.7/1.0/1.4 multiplier exists in camera.js but is not propagated to the scorer | Multiplier applied at scorer level | Sensitivity setting is dead code |

### C.4 Recommended Implementation Strategy (Area C)

1. **Single source of truth for thresholds.** Move all thresholds into a new `js/solarize/scoring-config.js` module that exports a frozen `SCORING_DEFAULTS` object. Remove the duplicates from `camera.js`, `auto-capture.js`. Replace the magic `85` literals in `camera.js` with `SCORING_DEFAULTS.visualAlignedThreshold`.

2. **Fix the angle normalization.** Replace `/ 90` with a per-joint ROM lookup table (`jointRom[joint]`):
   ```js
   const JOINT_ROM = { leftShoulder: 180, rightShoulder: 180, leftElbow: 150, rightElbow: 150,
     leftHip: 120, rightHip: 120, leftKnee: 135, rightKnee: 135, spine: 90, neck: 90 };
   const angleSim = angN ? 1 - (angErr / angN) / (JOINT_ROM[joint] / 2) : 0;
   ```

3. **Add EMA-smoothed OKS.** Add a `_oksEma` field to `PoseScorer`, updated each frame with `α=0.3`. Use `max(rawOks, oksEma)` so a single bad frame cannot drop the score below the smoothed baseline — this prevents "flicker" in the auto-capture progress ring.

4. **Soft confidence down-weighting.** Replace the hard `excluded` list with a per-joint visibility weight in the OKS computation:
   ```js
   const w = Math.max(0, (lm[kp].visibility || 0) - 0.2) / 0.8;  // 0 below 0.2, ramps to 1 at 1.0
   oksSum += w * perKeypointOks;
   oksWeight += w;
   ```
   Invisible joints no longer penalize; partially-visible joints contribute proportionally.

5. **Per-pose difficulty weighting.** Add an optional `difficultyWeights` field to each pose in `poses-data.js` (default: equal weights). For sitting poses, downweight ankles/knees; for standing poses, downweight hands. The scorer multiplies each joint's contribution by this weight. Ship a default difficulty profile per category (`standing`, `sitting`, `floor`, `couple`) to avoid touching all 745 poses.

6. **User calibration.** Add a 5-second "calibration capture" the first time a user enters the camera screen with a new pose: capture OKS samples for the user holding the target pose, compute mean μ and std σ, set the user's personal threshold to `max(0.75, μ - 0.5σ)`. Store in `localStorage.poseart_calibration_<poseId>`. Clearly labelled as "personal best" not "global standard."

7. **Propagate `_sensitivity` to the scorer.** `camera.js:34` already has the multiplier (0.7/1.0/1.4 for Strict/Balanced/Relaxed); pass it through `engine.processFrame(frame, { sensitivity })` into the scorer's `opts.scoreThresholdAutoCapture`. Strict → 0.88, Balanced → 0.82, Relaxed → 0.74.

8. **Add an OKS-by-joint diagnostic panel** (visible only in a `?debug=1` mode): shows per-joint OKS contribution, so users can see *why* their score is what it is. This is critical for trust — opaque scores are the #1 complaint in pose-coaching app reviews.

### C.5 Priority: **P1**

Scoring is the user-visible heart of the product, but it depends on Area A (real keypoints) to be exercised. The threshold inconsistency (85 vs 82) is a **P1 quick win** that can be fixed in isolation; the calibration + per-pose weighting is **P1 strategic**.

---

## D. CSP and Model Loading

### D.1 Current PoseArt State

**File inspected:** `index.html` line 7.

**Current CSP** (verbatim, single line):
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob:;
media-src 'self' blob:;
connect-src 'self';
base-uri 'self';
form-action 'self';
```

**Defects:**

1. **`script-src 'self' 'unsafe-inline'`** — the `'unsafe-inline'` defeats the entire point of CSP for script injection. Any XSS payload injected via innerHTML can execute. Source: OWASP CSP Cheat Sheet (2024): "avoid `'unsafe-inline'` in `script-src`."
2. **No `wasm-unsafe-evals`** — required by CSP3 for any WebAssembly module to compile. MediaPipe Tasks Vision and TF.js WASM backend **both** require this directive; without it, `WebAssembly.compile()` rejects with `EvalError: Refused to compile WASM…`.
3. **`connect-src 'self'`** — blocks:
   - `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm` (hardcoded in `pose-model-runtime.js:150`)
   - `https://storage.googleapis.com/mediapipe-models/pose_landmarker/...` (line 152)
   - The TF.js model URL (whatever it resolves to).
4. **No `worker-src`** — falls back to `default-src 'self'`, which technically allows `Worker('blob:…')` because of `'self'`, but the blob URL works only because `script-src 'self'` happens to permit blob workers in Chrome. This is browser-implementation-dependent and fragile.
5. **No `frame-src` / `frame-ancestors`** — the app could be iframe-embedded by an attacker (clickjacking). Not strictly a CSP-for-models issue, but worth fixing.
6. **No SRI (Subresource Integrity)** on the inline module scripts — but they are `'self'`, so SRI is unnecessary if we keep them local.

### D.2 Best-in-Class Target

The recommended CSP for a static GitHub Pages site running MediaPipe Tasks Vision + TF.js WASM with all assets vendored locally:

```
default-src 'self';
script-src 'self' 'wasm-unsafe-evals';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob:;
media-src 'self' blob:;
connect-src 'self';
worker-src 'self' blob:;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

**Key changes vs. current:**

| Directive | Current | Recommended | Why |
|---|---|---|---|
| `script-src` | `'self' 'unsafe-inline'` | `'self' 'wasm-unsafe-evals'` | Drops `'unsafe-inline'`; adds `wasm-unsafe-evals` for WASM compile. |
| `connect-src` | `'self'` | `'self'` | Stays `'self'` — all model + WASM assets are vendored locally (see Area A). |
| `worker-src` | (none) | `'self' blob:` | Explicitly permits the blob-URL worker used by `PoseWorkerService`. |
| `frame-ancestors` | (none) | `'none'` | Clickjacking protection. |
| `upgrade-insecure-requests` | (none) | present | Auto-upgrades any stray HTTP subresource to HTTPS. |

**If you instead decide to keep CDN loading (NOT recommended):**

```
script-src 'self' 'wasm-unsafe-evals' https://cdn.jsdelivr.net;
connect-src 'self' https://cdn.jsdelivr.net https://storage.googleapis.com;
```

This is the smaller-diff option but introduces a runtime dependency on two external CDNs, both of which have had outages in 2024–2025. Vendoring is strictly better.

### D.3 Gap: Current vs. Best-in-Class

| Dimension | Current | Best-in-Class | Gap |
|---|---|---|---|
| `script-src 'unsafe-inline'` | present | absent | XSS risk |
| `wasm-unsafe-evals` | absent | present | WASM compile blocked |
| `connect-src` | `'self'` only | `'self'` + (vendored assets) | Model files blocked |
| `worker-src` | absent (falls back) | explicit `'self' blob:` | Fragile |
| `frame-ancestors` | absent | `'none'` | Clickjacking risk |
| SRI on external scripts | n/a (no external scripts) | n/a | ✅ aligned (we vendor everything) |
| CSP reporting | absent | `report-uri` or `report-to` endpoint | Silent failures |

### D.4 Recommended Implementation Strategy (Area D)

1. **Adopt the recommended CSP** above. Replace line 7 of `index.html` with the new policy.

2. **Audit `'unsafe-inline'` removal.** The current `script-src 'unsafe-inline'` exists because `index.html` likely has inline event handlers or inline scripts. Search for `on*=` attributes and `<script>` blocks without `src`. Either:
   - Move all inline scripts to external files (preferred), or
   - Replace `'unsafe-inline'` with a per-page nonce: `'self' 'nonce-<random>' 'wasm-unsafe-evals'`. The nonce must be regenerated per page load — GitHub Pages serves static HTML so this requires a tiny build step that injects the nonce. (Simpler: just move the inline scripts to external files.)

3. **Add `wasm-unsafe-evals`** unconditionally — it is required for both MediaPipe Tasks Vision and TF.js WASM backend, and is safe (it does not allow arbitrary script execution).

4. **Vendor all model assets** per Area A.4. This keeps `connect-src 'self'` valid.

5. **Add a CSP report endpoint** (optional, P2): a Cloudflare Worker or GitHub Pages-compatible endpoint that receives `report-to` payloads. Useful for catching CSP violations in production without breaking the user experience.

6. **Add a CI test** that loads `index.html` in a headless browser, attempts to load the model, and asserts zero CSP violations in the console. Add to `playwright.config.ts` as a new `@csp` test tag.

7. **Document the CSP** in `docs/SECURITY.md` (new file): explain each directive, why `'unsafe-inline'` was removed, and the trade-off of vendoring vs. CDN loading.

### D.5 Priority: **P0**

Without `wasm-unsafe-evals` and without either local vendoring or expanded `connect-src`, the model files cannot load — Area A is downstream of this.

---

## E. Deployment Artifact Privacy

### E.1 Current PoseArt State

**Files inspected:**
- `.github/workflows/deploy.yml` (35 lines)
- `.gitignore`
- Top-level directory listing of `/home/z/my-project/PoseArt/`

**Current deploy step** (`deploy.yml:29-31`):
```yaml
- name: Upload static site
  uses: actions/upload-pages-artifact@v3
  with:
    path: .
```

**The `path: .` directive uploads the entire repository** to GitHub Pages, including:

| Path | What it is | Should it be public? |
|---|---|---|
| `index.html` | App entry | ✅ yes |
| `css/` | App styles | ✅ yes |
| `js/` | App source (including solarize modules) | ✅ yes |
| `gifs/` | Pose reference GIFs (~745 files, ~100 MB) | ✅ yes (product asset) |
| `favicon.ico` | Brand icon | ✅ yes |
| `robots.txt` (if present at root) | SEO | ✅ yes |
| `audit/` | VLM census, defect reports, screenshots, census JSON, raw pose images | ❌ **NO** — internal QA artifacts |
| `audit_harness/`, `audit_reports/`, `qa_screenshots/` | QA artifacts | ❌ **NO** |
| `docs/` | Internal design docs, agent state, fix plans, marketing reviews, backend migration plan, SQL schema | ❌ **NO** — exposes architecture, RLS policies, attack surface |
| `Fixer Agent Instrucitons/` | Agent prompt files (note the typo in the directory name) | ❌ **NO** — leaks internal tooling |
| `.bak-v1` through `.bak-v25` (15 directories) | Historical source backups | ❌ **NO** — bloats deploy, may contain stale credentials |
| `scripts/` | Build/audit scripts, `inject-test-creds.js`, Python merge scripts | ❌ **NO** — leaks dev workflow |
| `tests/` | Vitest unit tests, Playwright e2e tests | ❌ **NO** — internal QA |
| `playwright.config.ts`, `vitest.config.js`, `eslint.config.js`, `package.json`, `bun.lock` | Build config | ❌ **NO** — internal |
| `logs/` | Server logs | ❌ **NO** — may contain user data |
| `artifacts/`, `tool-results/` (if present) | Agent execution traces | ❌ **NO** |
| `publication-manifest.json` | Build artifact (in `.gitignore` but may be present) | ❌ **NO** |

**Total deployable size today:** the entire repo, including ~745 GIFs (~100 MB) + audit census (~125 sheets × 6 poses, ~50 MB) + VLM reports (~20 MB) + .bak directories (could be 100+ MB).

**Privacy concerns:**
- `audit/pose-repair/census/raw/` contains ~745 pose-reference images that may be subject-specific.
- `docs/backend/sql/001-schema.sql` exposes the full database schema (33 tables).
- `docs/backend/sql/002-rls.sql` exposes all 95 RLS policies — an attacker can craft SQL injection targets.
- `Fixer Agent Instrucitons/` exposes internal agent prompts (and the typo is visible to the public).
- `.bak-*` directories may contain stale versions of `auth.js` with old credentials.

**Performance concerns:**
- GitHub Pages has a soft 1 GB limit; the audit + .bak directories may approach this.
- Users download only what they request, but search-engine crawlers may index internal docs.
- `robots.txt` is not present at root, so the entire site is crawlable.

### E.2 Best-in-Class Target

**Best practice: allowlist build.** Use a single `paths:` filter in `deploy.yml` that uploads only the production files:

```yaml
- name: Upload static site
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

Where `dist/` is built by a preceding step that copies only the allowlisted files:

```yaml
- name: Build production artifact
  run: |
    mkdir -p dist
    cp index.html dist/
    cp -r css dist/
    cp -r js dist/
    cp -r gifs dist/
    cp -r vendor dist/         # from Area A vendoring step
    cp favicon.ico dist/
    cp robots.txt dist/        # add a robots.txt that disallows /vendor/, /audit/ (none deployed anyway)
    # Generate a publication manifest
    find dist -type f -exec sha256sum {} \; > dist/integrity.manifest
```

**Alternative (smaller diff):** use the `paths` filter on `upload-pages-artifact`:

Actually `actions/upload-pages-artifact@v3` does not natively support an allowlist; it takes a single `path`. So the right answer is to build a `dist/` directory in a preceding step.

**Allowlist (production-only):**
| Path | Include | Reason |
|---|---|---|
| `index.html` | ✅ | App entry |
| `css/` | ✅ | Styles |
| `js/` | ✅ | App source |
| `gifs/` | ✅ | Product asset |
| `vendor/` | ✅ | Vendored ML models + WASM (Area A) |
| `favicon.ico` | ✅ | Brand |
| `robots.txt` | ✅ (create one) | SEO |
| `audit/` | ❌ | Internal QA |
| `audit_harness/`, `audit_reports/`, `qa_screenshots/` | ❌ | Internal QA |
| `docs/` | ❌ | Internal design docs |
| `Fixer Agent Instrucitons/` | ❌ | Internal agent prompts |
| `.bak-*` | ❌ | Historical backups |
| `scripts/` | ❌ | Build scripts |
| `tests/` | ❌ | Test files |
| `playwright.config.ts`, `vitest.config.js`, `eslint.config.js`, `package.json`, `bun.lock` | ❌ | Build config |
| `logs/` | ❌ | Server logs |
| `artifacts/`, `tool-results/` | ❌ | Agent traces |

**Add a `robots.txt`** at the deploy root:
```
User-agent: *
Allow: /
Disallow: /vendor/
Sitemap: https://pillb.github.io/PoseArt/sitemap.xml
```

### E.3 Gap: Current vs. Best-in-Class

| Dimension | Current | Best-in-Class | Gap |
|---|---|---|---|
| Deploy scope | entire repo (`path: .`) | allowlisted `dist/` | Internal artifacts exposed publicly |
| Deploy size | ~300+ MB (estimated) | ~110 MB (gifs + js + vendor) | 3× larger than needed |
| `robots.txt` | absent | present, disallows `/vendor/` | Search engines crawl everything |
| Sensitive docs | `docs/backend/sql/002-rls.sql` public | not deployed | RLS policies exposed |
| Agent prompts | `Fixer Agent Instrucitons/` public (with typo) | not deployed | Internal tooling leaked |
| Build verification | none | `integrity.manifest` SHA-256 sums | No way to verify deploy integrity |
| `publication-manifest.json` | in `.gitignore` but concept exists | generated at build time | Concept exists, not implemented |

### E.4 Recommended Implementation Strategy (Area E)

1. **Add a build step** to `deploy.yml` that constructs `dist/` from the allowlist:

   ```yaml
   - name: Build production artifact
     run: |
       mkdir -p dist
       cp index.html dist/
       cp -r css dist/
       cp -r js dist/
       cp -r gifs dist/
       cp -r vendor dist/
       cp favicon.ico dist/
       printf 'User-agent: *\nAllow: /\nDisallow: /vendor/\n' > dist/robots.txt
       find dist -type f -exec sha256sum {} \; | sort > dist/integrity.manifest
   - name: Upload static site
     uses: actions/upload-pages-artifact@v3
     with:
       path: ./dist
   ```

2. **Add a pre-deploy check** that fails the workflow if any forbidden path appears in `dist/`:
   ```yaml
   - name: Verify allowlist
     run: |
       for forbidden in audit audit_harness docs scripts tests .bak-v1 "Fixer Agent Instrucitons"; do
         if [ -d "dist/$forbidden" ]; then
           echo "ERROR: forbidden path deployed: dist/$forbidden"
           exit 1
         fi
       done
   ```

3. **Run `inject-test-creds.js`** as a build step (it is already in `.gitignore`'s comment as the intended pattern for `js/test-creds.local.js`): the workflow pulls `POSEART_TEST_USERNAME` and `POSEART_TEST_PASSWORD` from GitHub Secrets and writes the file into `dist/js/test-creds.local.js` before upload. This keeps test credentials out of the public repo.

4. **Add a `publication-manifest.json`** at `dist/`-build time: lists every deployed file with its SHA-256, the git SHA, the build timestamp, and the CSP hash. Useful for forensics and for verifying that a future change didn't accidentally leak a file.

5. **Add a `docs/DEPLOYMENT.md`** that documents the allowlist, the build step, and the verification process. Cross-link from the main README.

6. **Remove the `.bak-*` directories from git history** (P3, optional): `git filter-repo` to purge them. This is a destructive operation — defer until the rest of the program is stable.

### E.5 Priority: **P0**

The current deployment exposes the database schema, RLS policies, agent prompts, and ~745 audit images to the public internet. This is a P0 security and privacy defect, independent of the pose-detection work.

---

## Comparison Table (All Areas)

| Area | Current State | Best-in-Class | Gap Severity | Priority | Est. Effort |
|---|---|---|---|---|---|
| **A. Pose Detection Model** | Loader code exists for MoveNet + MediaPipe; bare-module imports cannot resolve; no vendored assets; deterministic-test is the only working model | MediaPipe Tasks Vision 0.10.18 + `pose_landmarker_full.task`, vendored locally, loaded via import map | Critical — overlays never run on real camera | **P0** | 2–3 days |
| **B. Worker / Frame Transport** | `postMessage({ video: HTMLVideoElement })` fails structured clone; no transferables; no backpressure; module-worker not used | `VideoFrame` (primary) or `ImageBitmap` (fallback) transfer; module worker with import-map inheritance; backpressure gate | Critical — worker path unreachable | **P0** | 1–2 days |
| **C. Scoring Policy** | 6-gate scorer is well-designed; OKS + bone cosine + joint angles; thresholds hardcoded and inconsistent (85 in camera.js vs 82 in scorer); no calibration; angle normalization harsh (`/90°`) | Per-joint ROM normalization; EMA-smoothed OKS; soft confidence down-weighting; per-pose difficulty weights; user calibration baseline; single source of truth for thresholds | High — visible UX inconsistency; missed calibration opportunities | **P1** | 3–5 days |
| **D. CSP and Model Loading** | `script-src 'self' 'unsafe-inline'`; no `wasm-unsafe-evals`; `connect-src 'self'` blocks all CDNs; no `worker-src`; no `frame-ancestors` | `script-src 'self' 'wasm-unsafe-evals'`; explicit `worker-src 'self' blob:`; `frame-ancestors 'none'`; vendored assets keep `connect-src 'self'` | Critical — blocks all model loading | **P0** | 0.5 days |
| **E. Deployment Artifact Privacy** | `deploy.yml` uploads `path: .` (entire repo); audit/, docs/, scripts/, tests/, .bak-v1…v25, agent prompts all public | Allowlist `dist/` build step; `robots.txt`; `integrity.manifest`; test-creds injected from GitHub Secrets | Critical — privacy + security defect | **P0** | 0.5 days |

---

## Ranked Recommendations (P0 → P3)

### P0 — Critical (blocks all overlay recovery)

1. **Vendor MediaPipe Tasks Vision + model file, fix CSP, fix worker frame transport** (Areas A + B + D, combined into one PR — they are interdependent):
   - `scripts/sync-vendor.js` downloads and pins `@mediapipe/tasks-vision@0.10.18` + `pose_landmarker_full.task` into `vendor/`.
   - Add `<script type="importmap">` to `index.html`.
   - Update `MediaPipeRuntime.init()` to use local paths.
   - Update `chooseDefaultModel()` to return `'mediapipe-pose-landmarker'` for both real profiles.
   - Add `wasm-unsafe-evals`, `worker-src 'self' blob:`, `frame-ancestors 'none'` to CSP; drop `'unsafe-inline'`.
   - Add `FrameTransport` helper using `VideoFrame` primary, `ImageBitmap` fallback.
   - Convert worker to `{ type: 'module' }`.
   - Add backpressure gate.

2. **Allowlist deployment** (Area E, independent PR):
   - Add `dist/` build step to `deploy.yml`.
   - Add allowlist verification step.
   - Add `robots.txt` and `integrity.manifest`.
   - Inject test creds from GitHub Secrets.

### P1 — High (visible UX + scoring quality)

3. **Unify scoring thresholds and fix the 85/82 inconsistency** (Area C, quick win):
   - Create `js/solarize/scoring-config.js` with frozen `SCORING_DEFAULTS`.
   - Replace magic `85` literals in `camera.js` with config references.

4. **Per-joint ROM normalization + EMA-smoothed OKS** (Area C, strategic):
   - Replace `/90°` with `JOINT_ROM` table.
   - Add `_oksEma` field with `α=0.3`.
   - Add soft confidence down-weighting.

### P2 — Medium (calibration + diagnostics)

5. **User calibration + per-pose difficulty weighting** (Area C, requires data):
   - 5-second baseline capture on first camera entry per pose.
   - `localStorage.poseart_calibration_<poseId>` storage.
   - Per-category difficulty profiles (standing/sitting/floor/couple).
   - Propagate `_sensitivity` from camera.js to scorer.

6. **Debug scoring panel** (`?debug=1` mode):
   - Per-joint OKS contribution display.
   - Visibility heatmap.
   - Confidence-per-joint readout.

### P3 — Low (polish + future-proofing)

7. **CSP reporting endpoint** (Area D):
   - `report-to` directive pointing to a Cloudflare Worker.
   - Dashboard for CSP violations.

8. **MoveNet MultiPose fallback for couples** (Area A):
   - Wire as the explicit fallback when MediaPipe `numPoses:2` fails.
   - Already coded in `MODEL_REGISTRY`; just needs the activation path tested.

9. **ONNX Runtime Web + RTMPose research track** (Area A):
   - Prototype behind a `?model=rtmpose` flag.
   - Not for production; benchmark only.

10. **Purge `.bak-*` directories from git history** (Area E):
    - `git filter-repo` operation.
    - Destructive — defer until program is stable.

---

## Top 5 Recommendations (Concise Summary)

1. **[P0] Vendor MediaPipe Tasks Vision + fix CSP + fix worker frame transport** (one combined PR). Pin `@mediapipe/tasks-vision@0.10.18` + `pose_landmarker_full.task` into `vendor/`, add an import map, drop `'unsafe-inline'` from CSP, add `wasm-unsafe-evals` + `worker-src 'self' blob:`, replace `postMessage({video})` with `VideoFrame`/`ImageBitmap` transfer + module worker. **This single PR unblocks all 22 Solarize modules.**

2. **[P0] Allowlist deployment build step.** Replace `path: .` in `deploy.yml` with a `dist/` build step that copies only `index.html`, `css/`, `js/`, `gifs/`, `vendor/`, `favicon.ico`, plus a generated `robots.txt` and `integrity.manifest`. Inject test creds from GitHub Secrets. Stops leaking `docs/backend/sql/002-rls.sql`, audit census images, and agent prompts to the public internet.

3. **[P1] Unify scoring thresholds into a single config.** Create `js/solarize/scoring-config.js`, replace the 85 (camera.js) vs 82 (scorer) split with one source of truth, propagate the existing `_sensitivity` multiplier (Strict/Balanced/Relaxed) into the scorer. Quick win, ~2 hours.

4. **[P1] Per-joint ROM normalization + EMA-smoothed OKS.** Replace the harsh `/90°` angle normalization with a per-joint ROM lookup table; add an EMA-smoothed OKS to suppress single-frame jitter. Improves score stability and user trust.

5. **[P2] User calibration + per-pose difficulty weighting.** 5-second baseline capture per pose stored in `localStorage.poseart_calibration_<poseId>`; per-category difficulty profiles (standing/sitting/floor/couple) that downweight joints irrelevant to the pose (e.g., ankles for sitting poses). Makes scoring feel personalised and fair.

---

## Appendix: Version Pin Reference

| Asset | Pinned version | Source URL | Vendored path |
|---|---|---|---|
| `@mediapipe/tasks-vision` JS | 0.10.18 | `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18` | `vendor/mediapipe/tasks-vision@0.10.18.js` |
| `@mediapipe/tasks-vision` WASM | 0.10.18 | `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm/` | `vendor/mediapipe/wasm/` |
| Pose Landmarker model (full, float16) | 1 | `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task` | `vendor/models/pose_landmarker_full.task` |
| `@tensorflow/tfjs` (fallback) | 4.22.0 | `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0` | `vendor/tfjs/tfjs@4.22.0.js` |
| `@tensorflow-models/pose-detection` (fallback) | 2.1.3 | `https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3` | `vendor/tfjs/pose-detection@2.1.3.js` |
| `@tensorflow/tfjs-backend-wasm` SIMD threads (fallback) | 4.22.0 | `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.22.0/dist/tf-backend-wasm.wasm` | `vendor/tfjs/tf-backend-wasm.wasm` |

All vendored files are committed to git (or Git LFS for the model `.task` file, which exceeds GitHub's 50 MB warning threshold only at the `heavy` variant — `full` is ~6.5 MB and safe to commit directly).

---

*End of R3-research report.*
