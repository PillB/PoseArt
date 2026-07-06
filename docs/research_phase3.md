# Phase 3 Pre-Research: Sprite & Animation System

**Prepared:** July 5, 2026
**Scope:** SVG character rigging, Lottie best practices, real-time skeleton rendering, pose-to-sprite mapping architecture, and mobile animation performance optimization.

---

## Table of Contents
1. [SVG Character Rigging for Mobile (2024–2026)](#1-svg-character-rigging-for-mobile-20242026)
2. [Lottie Animation Best Practices for Mobile](#2-lottie-animation-best-practices-for-mobile)
3. [Real-Time Skeleton Rendering Techniques](#3-real-time-skeleton-rendering-techniques)
4. [Pose-to-Sprite Mapping Architecture (Pose Animator Deep Dive)](#4-pose-to-sprite-mapping-architecture-pose-animator-deep-dive)
5. [Performance Optimization for Animation on Mobile](#5-performance-optimization-for-animation-on-mobile)
6. [Recommendations Summary](#6-recommendations-summary)

---

## 1. SVG Character Rigging for Mobile (2024–2026)

### 1.1 The three animation approaches for SVG

There are three fundamentally different ways to animate SVG content, each with different mobile performance characteristics ([Practical SVG](https://practical-svg.chriscoyier.net/chapter/practical-svg-ebook-11/), [CSS-Tricks benchmarks](https://css-tricks.com/weighing-svg-animation-techniques-benchmarks/)):

| Method | How it works | Mobile performance | Best for |
|---|---|---|---|
| **CSS animations/transitions** | Keyframes target `transform`/`opacity`, browser compositor handles interpolation | Best — GPU/compositor-accelerated, runs off main thread | Simple bone rotations, opacity fades, hover/tap states |
| **SMIL** (`<animate>`, `<animateTransform>`, `<animateMotion>`) | Declarative animation embedded directly in SVG markup | Inconsistent — processed by the SVG renderer, not the GPU compositor; 20+ simultaneous SMIL elements can drop frames even on desktop | Self-contained SVGs that must animate when used as `<img>` or CSS background (no JS/CSS available in that context) |
| **JavaScript** (GSAP, Snap.svg, Web Animations API) | Full programmatic control, can manipulate path data live | Most flexible but runs on main thread unless batched with `requestAnimationFrame` | Path morphing, complex timelines, interactive/data-driven rigs (pose-driven animation) |

**Key mobile performance rule** ([Zigpoll](https://www.zigpoll.com/content/how-can-i-optimize-svg-animations-to-run-smoothly-on-both-desktop-and-mobile-browsers-without-significant-performance-loss), [OpenReplay](https://blog.openreplay.com/modern-svg-animation-techniques/)): only animate `transform` and `opacity`. Animating `fill`, `stroke-width`, `d` (path data), `x`/`y`/`width`/`height` forces the browser to recompute geometry and repaint every frame — this is the single biggest cause of jank on low-end Android devices. For skeletal rigs, this means bone rotations should be expressed as CSS `transform: rotate()` on grouped `<g>` elements rather than by mutating path coordinates directly wherever possible.

**SMIL status in 2026**: Chrome announced SMIL deprecation in 2015, reversed it in 2016; it remains supported in all major engines today, but new production work should default to CSS/JS ([SVG Genie](https://www.svggenie.com/blog/how-to-check-svg-animation), [CSSVG](https://cssvg.com/blog/animated-svg-guide)).

Practical optimization checklist before animating a character SVG ([dominatetools.com](https://dominatetools.com/blog/animating-optimized-svgs/), [Zigpoll](https://www.zigpoll.com/content/how-can-i-optimize-svg-animations-to-run-smoothly-on-both-desktop-and-mobile-browsers-without-significant-performance-loss)):
- Merge static background paths into single `<path>` elements; use `<use>`/`<symbol>` for repeated motifs (useful for repeating Art Nouveau border/flourish elements).
- Reduce path point count (simplify curves) — fewer DOM nodes = cheaper paint.
- Preserve semantic IDs on the specific elements you intend to animate (SVGO strips IDs by default — pass `--preserve-idrefs`/config to keep bone joint IDs).
- Add `will-change: transform` sparingly to promote animated groups to their own GPU layer.
- Set `transform-box: fill-box` so rotation/scale pivots use the shape's own bounding box instead of the SVG viewport — critical for correct joint-pivot rotation.

### 1.2 Skeletal rigging tools comparison: Spine 2D vs. DragonBones vs. Live2D

| Tool | Model | Mobile runtime support | License | Notes |
|---|---|---|---|---|
| **Spine 2D** (Esoteric Software) | Bone hierarchy + mesh deformation (skinned meshes), IK constraints, weight painting | Official runtimes: `spine-flutter`, `spine-ios` (Swift), `spine-ts` (JS/TS, usable in React Native via WebView or Skia bridges), plus C++, C#, Java | One-time purchase ($69 Essential–$379 Professional); runtimes themselves are free/open-source but exporting requires a license | Industry standard; "bone-level keyframe control + skin attachment" gives the most repeatable exports ([EsotericSoftware/spine-runtimes](https://github.com/EsotericSoftware/spine-runtimes), [Armanimation 2026 comparison](https://www.armanimation.com/post/best-2d-skeletal-animation-software-in-2026-free-paid-options-compared)) |
| **DragonBones** (now rebranding to "LoongBones") | Bone hierarchy, mesh support, Spine-compatible JSON export path | Runtimes for C++, JS, Unity, Egret, Starling/AS3; no official Flutter/native Swift runtime | Free (historically); rebrand introduces paid AI-assisted tiers, community reports mixed compatibility going forward | Good free entry point but roadmap uncertainty as of 2026 ([Armanimation](https://www.armanimation.com/post/best-2d-skeletal-animation-software-in-2026-free-paid-options-compared), [Castle Game Engine notes](https://castle-engine.io/wp/2017/07/17/dragon-bones/)) |
| **Live2D** | Deforms the *original* illustration directly (mesh warping on top of flat art) rather than a "paper doll" of cut layers — preserves brush texture/line art | SDKs for Unity, Unreal, web (WebGL) | Free tier + ~$20/mo Pro | Aimed at VTubing/anime-style; less suited to Mucha-style flat vector illustration with hard bone joints, more suited to painterly illustrations |

**Mobile integration specifics:**
- **Flutter**: Official `spine-flutter` package wraps `spine-cpp` via Dart FFI; supports desktop + mobile targets natively, web via Canvaskit (~2MB extra). Setup: add `spine_flutter: ^4.2.11` to `pubspec.yaml`, call `initSpineFlutter()` in `main()`, then load `.json`/`.skel` skeleton + `.atlas` files as assets ([esotericsoftware/spine-runtimes](https://github.com/esotericsoftware/spine-runtimes)).
- **React Native**: No official Spine RN runtime; community solution `react-native-spine-player` renders Spine2D through **Skia** (React Native Skia), consuming the same `.atlas`/`.json`/texture triplet ([Hau-Hau/react-native-spine-player](https://github.com/Hau-Hau/react-native-spine-player)). Example usage:
  ```jsx
  <SpinePlayerView
    style={{ width: 200, height: 200 }}
    image={require("/assets/spine/raptor.png")}
    atlasData={atlas}
    skeletonData={JSON.stringify(require("/assets/spine/raptor.json"))}
    animationNames={["jump"]}
    defaultMix={0.3}
    loopAnimation
    autoPlay
  />
  ```
- **iOS/Swift**: Official `spine-ios` runtime (Swift) in the same monorepo, built on `spine-cpp`.
- File formats that travel well: **Spine `.json`/`.skel` (binary) + `.atlas` + texture PNG** is the most cross-platform bone-rig format with native runtimes on Flutter, iOS, Android, and web. DragonBones JSON is Spine-JSON-compatible in some export modes, widening reach further ([Solar2D forum](https://forums.solar2d.com/t/dragon-bones-now-support-spine-format/342328)).

### 1.3 Art Nouveau / Mucha-style skeletal rigging workflow

There's no dedicated "Art Nouveau rigging" tool — the workflow is the general **2D skeletal character pipeline** applied carefully to flowing, curvilinear artwork:

1. **Layer the illustration** into independently movable parts on separate layers (e.g., upper arm distinct from forearm), with slight overlap at joints to hide gaps during rotation ([Charios Defold pipeline guide](https://charios.com/blog/defold-2d-character-animation-pipeline)).
2. **Export each layer as a transparent PNG or vector path group** with clear naming (`torso.svg`, `arm_upper_L.svg`).
3. **Build the bone hierarchy** starting from a root bone (pelvis/spine), branching to shoulders → arms, hips → legs — matching real anatomy for natural rotation ranges.
4. **Bind ("skin") each visual piece to a bone**, defining a pivot/origin point aligned to the bone's joint.
5. **For flowing drapery/hair (a Mucha hallmark)**: use **mesh deformation** (Spine's Mesh + Weights, or FFD/bezier-bone tools) rather than rigid bone-per-segment, since Art Nouveau's signature whiplash curves and flowing hair need soft, continuous bending rather than jointed segments. Spine's physics engine (v4.2+) can automate secondary motion (hair, flowing fabric, ribbons) reactively, which is well-suited to Mucha-esque compositions ([Armanimation comparison](https://www.armanimation.com/post/best-2d-skeletal-animation-software-in-2026-free-paid-options-compared)).
6. **IK (inverse kinematics) constraints** on limbs let a single "hand target" drag the whole arm chain into elegant curved poses reminiscent of poster-art gesture — useful for expressive, non-naturalistic poses.

For a **pose-driven** figure (not manually animated but driven by live pose-estimation, as in this project), the relevant precedent is Google's **Pose Animator**, covered in depth in Section 4 — it explicitly uses a "predefined rig based on keypoints" approach applied to arbitrary flat vector illustrations, which is the closest existing analogue to rigging a Mucha-style figure for real-time pose-driven animation.

**SVG file structure convention (Pose Animator style, reusable for any custom rig):**
```
[Layer 1]
|---- skeleton        (named circle/joint markers, e.g. "leftShoulder", "leftElbow")
|---- illustration    (flattened path elements only, no subgroups, no composite paths)
      |---- path 1
      |---- path 2
```
This separation of a "joint marker" layer from a "visual" layer is the general-purpose pattern for building any custom pose-driven SVG rig ([Pose Animator GitHub](https://github.com/yemount/pose-animator)).

---

## 2. Lottie Animation Best Practices for Mobile

### 2.1 File size targets

| Guidance | Source |
|---|---|
| Aim for **under 300 KB** per animation | [DEV Community guide](https://dev.to/brilworks/a-beginners-guide-to-react-native-animations-with-lottie-4hm0) |
| Keep frame count to **150–400 frames**; higher risks degraded performance | [Bomberbot](https://www.bomberbot.com/react-native/crafting-delightful-loading-experiences-with-lottie-animations-in-react-native/) |
| Real-world case: reducing render resolution from 3840×2160 to 160×160 took a file from ~1.2–1.6 MB down to ~100 KB with no visible quality loss on mobile screens | [GitHub lottie-react-native issue #867](https://github.com/lottie-react-native/lottie-react-native/issues/867) |
| LottieFiles' **Optimized Lottie** JSON export saves ~20% by removing unused tags/scripts; **dotLottie** (zip+Deflate compression bundling JSON+assets) saves up to **80%**; **Optimized dotLottie** combines both | [LottieFiles: How to Optimize Lottie Files](https://lottiefiles.com/blog/working-with-lottie-animations/optimize-lottie-files-for-faster-page-load-speeds) |
| LottieFiles' 2026 **Keyframe Optimizer** (in Lottie Creator) removes redundant per-frame keyframes before export using an adjustable tolerance slider | [LottieFiles: How to Optimize Lottie for Production](https://lottiefiles.com/blog/working-with-lottie-animations/how-to-optimize-lottie-for-production/) |

### 2.2 Authoring best practices
- **Use vector shape layers in After Effects**, not embedded raster images — rasters bloat bundle size and don't scale cleanly ([Bomberbot](https://www.bomberbot.com/react-native/crafting-delightful-loading-experiences-with-lottie-animations-in-react-native/)).
- **Avoid unsupported AE features**: gradients, masks, and expressions frequently don't translate cleanly and add unnecessary size/complexity ([DEV Community](https://dev.to/brilworks/a-beginners-guide-to-react-native-animations-with-lottie-4hm0)).
- **Merge/pre-compose layers** where visually equivalent; delete any sublayer that makes no visible difference when toggled off (a practical technique: toggle each group off one at a time — if nothing changes, delete it) ([YouTube optimization walkthrough](https://www.youtube.com/watch?v=wDtYiJHZhSE)).
- **Provide a static-image fallback** for `prefers-reduced-motion`/accessibility settings and for failure states.
- **dotLottie format** is now natively supported by `lottie-android`/`lottie-ios`/`lottie-react-native` and loads directly on the native side rather than being parsed through JS, which is both smaller and faster ([GitHub discussion #1006](https://github.com/lottie-react-native/lottie-react-native/issues/1006)).

### 2.3 Runtime performance in mobile apps
- **iOS** (`lottie-ios`) renders through **Core Animation**, generally smooth by default.
- **Android** (`lottie-android`) uses native custom Views; test explicitly on low/mid-end devices, since complex vector paths can still tax the CPU rasterizer.
- **`renderMode="GPU"`** is available in `lottie-react-native` and generally outperforms CPU mode, but isn't guaranteed on all devices — profile both ([DEV Community performance article](https://dev.to/im_ashish30/enhancing-your-react-native-app-with-stunning-lottie-animations-4945)).
- **`react-native-rlottie`** pre-rasterizes each animation frame to bitmaps up front instead of using platform animation APIs continuously — trades a heavier first load for steadier sustained frame rate; recommended to preload on iOS specifically ([hannojg/react-native-rlottie](https://github.com/hannojg/react-native-rlottie)).
- **Limit concurrently playing Lotties** (e.g., inside a scrollable list of pose-reference cards) — each active instance adds CPU overhead; centralize to a **shared animation instance/context** rather than mounting one per list item ([Reddit r/react performance thread](https://www.reddit.com/r/react/comments/1n7uw3o/need_help_performance_issues_with_multiple_lottie/)).
- **Memoize** Lottie components with `React.memo` to avoid re-renders when animation data is static; trigger animation changes imperatively via `ref.play()` rather than remounting via prop changes ([Medium — Lottie in React Native](https://medium.com/@shiva999421/animating-with-lottie-simple-like-never-before-with-react-native-f32f165db0a5)).
- **Preload** splash/onboarding/critical animations locally so there's no blank-frame flash while JSON parses.

### 2.4 Parameterizing Lottie animations (dynamic color, etc.)

**Approach 1 — Named layers + web colorify (JS/React web):**
Rename the shape's Fill/Stroke in After Effects to a hash-prefixed name (`#brandColor`) before export, then either target it with CSS (if inline SVG-rendered) or use a library like `lottie-colorify`:
```js
const animation = Lottie.loadAnimation({
  container: container.current,
  animationData: colorify(['#ef32d0', [50, 100, 200], '#fe0088'], SomeAnimation),
});
```
([Stack Overflow](https://stackoverflow.com/questions/57303700/change-color-dynamically-in-lottie-json))

**Approach 2 — Native Dynamic/Value Providers (Android & iOS, most robust for a production app):**
- **Android**: resolve the layer's `KeyPath` (array of strings from the layer hierarchy) and attach a value callback:
  ```java
  animation.addValueCallback(
    new KeyPath("**", "shape_2", "group 1", "fill 1"),
    LottieProperty.COLOR_FILTER,
    lottieFrameInfo -> new PorterDuffColorFilter(color, PorterDuff.Mode.SRC_ATOP)
  );
  ```
  ([Medium — Dynamic Lottie Animations on Android](https://medium.com/healint-engineering-data/dynamic-lottie-animations-on-android-e59b19334561), [Lottie Android Dynamic Properties docs](https://airbnb.gitbook.io/lottie/android/dynamic-properties))
- **iOS**: Lottie's **Value Providers** API (`ColorValueProvider`, `PointValueProvider`, etc.) lets you bind a `AnimationKeypath` to a dynamically-updatable value without touching the JSON ([Swift Senpai — Lottie Value Providers](https://swiftsenpai.com/development/lottie-value-providers/)).
- This callback approach is called on every render frame (`lottieFrameInfo` gives per-frame context), so it composes well with pose-driven or state-driven recoloring (e.g., "highlight the muscle group currently being targeted").

### 2.5 Application to pose/exercise reference animations
For a library of exercise-pose reference Lotties:
- Keep each animation short and loopable (150–400 frames as above) and under 300 KB (ideally in the tens-of-KB range using dotLottie).
- Standardize the canvas/composition size across the whole library (e.g., 300×300) to avoid inconsistent scaling costs.
- Use a shared color/keypath naming convention across all exercise Lotties (e.g., always name the "highlight limb" layer `#activeLimb`) so a single dynamic-color binding function can be reused across the entire library rather than one-off per asset.

---

## 3. Real-Time Skeleton Rendering Techniques

### 3.1 Rendering surface options compared

| Approach | Where used | Pros | Cons |
|---|---|---|---|
| **Canvas 2D** (HTML5 Canvas / Android `Canvas`/`SurfaceView` / Skia) | MediaPipe's web `drawingUtils`, most cross-platform camera-overlay demos | Simple immediate-mode API (`drawLandmarks`, `drawConnectors`); easy to redraw every frame; good enough for keypoint dots + connecting lines | Immediate-mode redraw of the whole canvas each frame; can be CPU-bound at high point counts/high resolution |
| **SVG** | Pose Animator, vector-based overlays | Retained-mode DOM, crisp at any resolution, easy to skin with actual vector art (not just lines) | DOM manipulation cost scales with element count; not ideal for many independent per-frame updates without batching |
| **Metal (iOS) / OpenGL/Vulkan (Android)** | High-performance native camera pipelines, ARKit/ARCore body tracking overlays, MediaPipe's native mobile graph renderers | GPU-native, minimal per-frame overhead, can render directly into the camera preview's texture pipeline (avoids CPU readback) | Much higher implementation complexity; needed only when Canvas/SVG cannot sustain frame rate at your target resolution/point count |

**Practical guidance**: For a keypoint/skeleton overlay on a live camera feed with a few dozen points and connecting lines, **Canvas 2D (or platform-native Canvas/SurfaceView) is sufficient** and is what both MediaPipe's own demos and most production body-tracking apps use. Metal/OpenGL becomes necessary only when doing full mesh deformation or heavy shader-based effects on top of the pose, or extremely high frame throughput requirements.

### 3.2 MediaPipe: canvas overlay pattern

MediaPipe Tasks Vision ships a **built-in `DrawingUtils` helper** specifically for this ([MediaPipe web tutorial](https://www.youtube.com/watch?v=oaK74yozU9g)):
```js
const drawingUtils = new DrawingUtils(canvasCtx);
for (const landmarks of result.landmarks) {
  drawingUtils.drawLandmarks(landmarks, { radius: 4 });
  drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS);
}
```
Python equivalent (also widely used as reference architecture even for mobile ports):
```python
solutions.drawing_utils.draw_landmarks(
    annotated_image,
    pose_landmarks_proto,
    solutions.pose.POSE_CONNECTIONS,
    solutions.drawing_styles.get_default_pose_landmarks_style())
```
([dev.to walkthrough](https://dev.to/iceice333/kaartrwcchcchabcchudsamkhaybnraangkaaykhngmnusy-pose-landmark-detection-14kj))

Architecture pattern for a live camera + skeleton overlay (React/web, directly portable to React Native + `react-native-vision-camera`) ([Scribd MediaPipe React demo](https://www.scribd.com/document/921139419/Building-a-React-Pose-Estimation-Demo-With-MediaPipe)):
```
┌─────────────────────────────┐
│      <video> element        │  ← live camera stream (react-webcam or platform camera API)
├─────────────────────────────┤
│  <canvas> (absolute, z-index│  ← transparent overlay canvas, same dimensions as video
│  above video)                │     drawingUtils.drawLandmarks/drawConnectors runs here
└─────────────────────────────┘
        requestAnimationFrame loop:
        1. poseLandmarker.detectForVideo(video, timestamp)
        2. clear canvas
        3. draw video frame to canvas (optional) or leave transparent
        4. drawLandmarks(canvasCtx, result.landmarks)
        5. drawConnectors(canvasCtx, result.landmarks, POSE_CONNECTIONS)
```
- MediaPipe Pose Landmarker returns **33 keypoints**; connections are defined in a fixed `POSE_CONNECTIONS` list (index pairs) — drawing "smooth lines" is simply stroking a line segment between each connected pair's `(x, y)` per frame. For smoother-looking limbs, some implementations apply a light temporal low-pass filter (exponential smoothing) on landmark coordinates before drawing to reduce jitter frame-to-frame, since raw ML landmark output can be noisy.
- Detection (`detectForVideo`) is **synchronous** and should be scheduled against `performance.now()`/frame timestamps to stay in sync with video frame delivery.

### 3.3 Apple Vision framework (iOS native)

Apple's Vision framework offers `VNDetectHumanBodyPoseRequest` (2D, iOS 14+) and `DetectHumanBodyPose3DRequest` (3D, iOS 17+/WWDC23) ([Apple Developer — Detecting Human Body Poses](https://developer.apple.com/documentation/vision/detecting-human-body-poses-in-images), [WWDC23 — 3D Body Pose](https://developer.apple.com/videos/play/wwdc2023/111241/)):

```swift
func processObservation(_ observation: VNHumanBodyPoseObservation) {
    guard let recognizedPoints = try? observation.recognizedPoints(.torso) else { return }
    let torsoJointNames: [VNHumanBodyPoseObservation.JointName] = [
        .neck, .rightShoulder, .rightHip, .root, .leftHip, .leftShoulder
    ]
    let imagePoints: [CGPoint] = torsoJointNames.compactMap {
        guard let point = recognizedPoints[$0], point.confidence > 0 else { return nil }
        return VNImagePointForNormalizedPoint(point.location,
            Int(imageSize.width), Int(imageSize.height))
    }
    draw(points: imagePoints)   // app-supplied drawing routine (CAShapeLayer / Core Graphics)
}
```
Key facts:
- Returns **up to 19 body points** (2D) with normalized `(x, y)` coordinates + a per-point confidence score; **ignore points with confidence == 0** (invalid).
- Points are grouped by body region (`.torso`, `.face`, etc.) via `recognizedPoints(_:)`, or fetched individually via `recognizedPoint(_:)`.
- Coordinates use a **bottom-left origin, normalized 0–1 space** — must be converted with `VNImagePointForNormalizedPoint` to pixel/image coordinates before drawing.
- The 3D API (`VNHumanBodyPose3DObservation`) adds a `pointInImage` projection method to map 3D joints back onto the 2D image plane for overlay purposes, plus camera-relative joint positions for computing movement between frames.
- Drawing the actual skeleton lines is left entirely to the developer — Apple's guidance is simply to draw circles/lines between recognized points using standard `CAShapeLayer`/Core Graphics, no built-in "connectors" helper (unlike MediaPipe's `DrawingUtils`).
- Accuracy guidance: subject height should be ≥⅓ of image height; flowing/robe-like clothing (notably relevant to an Art-Nouveau-costumed avatar reference!) reduces detection accuracy; dense crowd scenes are unreliable.

### 3.4 Drawing smooth connecting lines in real time — general technique
Regardless of platform, the core primitive is the same: for each bone `(kpA, kpB)` in a fixed connection list, draw a stroked line segment between the two keypoint coordinates, every frame, after the raw coordinates have been:
1. Confidence-filtered (skip if either point's confidence is 0 / below threshold).
2. Optionally temporally smoothed (exponential moving average or a one-euro filter) to reduce ML jitter.
3. Coordinate-mapped from the model's normalized/model space into the view's pixel space (see Section 4.2 for the coordinate reconciliation problem).

---

## 4. Pose-to-Sprite Mapping Architecture (Pose Animator Deep Dive)

Google's [**Pose Animator**](https://github.com/yemount/pose-animator) (open source, Apache 2.0, TensorFlow.js-based) is the most directly relevant prior art for mapping live pose-estimation keypoints onto an SVG sprite's bone structure. This section is based on direct inspection of its source code.

### 4.1 High-level architecture

```
┌──────────────┐     ┌──────────────┐     ┌───────────────────────┐
│   Webcam     │────▶│   PoseNet    │────▶│  pose.keypoints[]     │
│   video feed │     │   FaceMesh   │────▶│  face.scaledMesh[]    │
└──────────────┘     └──────────────┘     └───────────┬───────────┘
                                                        │ (per frame)
                                                        ▼
                                          ┌─────────────────────────────┐
                                          │   Skeleton.update(pose,face)│
                                          │  - updatePoseParts()        │
                                          │  - updateFaceParts()        │
                                          │  - recompute each Bone's    │
                                          │    currentPosition/scale    │
                                          └───────────────┬─────────────┘
                                                           │
                                                           ▼
                                          ┌─────────────────────────────┐
                                          │ For each SVG path segment:  │
                                          │ getCurrentPosition(segment) │
                                          │  = Σ (bone.transform(wt)    │
                                          │       * weight)             │
                                          │  [Linear Blend Skinning]    │
                                          └───────────────┬─────────────┘
                                                           │
                                                           ▼
                                          ┌─────────────────────────────┐
                                          │  Paper.js repaints the SVG  │
                                          │  illustration path points   │
                                          └─────────────────────────────┘
```

### 4.2 Two-part representation: surface + bones

Pose Animator (and skeletal animation generally) splits a character into ([Pose Animator README](https://github.com/yemount/pose-animator), confirmed in source):
1. **Surface**: the 2D vector paths of the artist's illustration (drawn in the `illustration` SVG group).
2. **Skeleton**: a predefined hierarchical rig whose joints are named to match ML model output (`leftShoulder`, `rightElbow`, etc. from PoseNet's 17 body keypoints, plus ~68 FaceMesh-driven face keypoints) — drawn as small circles in a `skeleton` SVG group, positioned by the artist to align with the illustration's joints in a neutral/T-pose.

### 4.3 Coordinate systems that need reconciling

Three distinct coordinate spaces exist and must be reconciled every frame:

1. **ML model output space** — PoseNet/FaceMesh return keypoints in **video/image pixel space** (`pose.keypoints[i].position.x/y` in video resolution), each with a confidence `score`.
2. **SVG illustration/rig space** — the artist-authored SVG's own coordinate system, in which the `skeleton` group's joint circles were placed by hand to match the illustration in its bind/rest pose.
3. **Bone-local ("anchor") space** — Pose Animator's `Bone.getPointTransform(p)` converts a surface point into a bone-relative offset: a signed distance along the bone's direction vector (`dirProjD`) and perpendicular to it (`dirProjN`), plus a normalized "anchor percentage" along the bone's length (`anchorPerc`). This is what makes the rig robust to bones changing length/angle at runtime (unlike rigid game-animation bones, a live human's video-derived bone length constantly fluctuates with pose and distance from camera).

At runtime, the mapping recomputes surface point positions each frame from ML-space bone endpoints, but always expresses influence using the bone-local anchor representation computed once at bind time — this is the critical design choice that lets a 2D vector illustration deform believably even though the underlying "bones" (video-derived) have variable length, unlike traditional fixed-length game skeletons ([`skeleton.js` source, Google Developers Korea blog explanation](https://developers-kr.googleblog.com/2020/06/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html)).

### 4.4 Binding / rigging step (one-time, at load)

From `illustration.js`:
```js
bindSkeleton(skeleton, skeletonScope) { ... }   // entry point
```
For every point (including Bezier handle-in/handle-out control points) on every path in the `illustration` group:
1. **`getWeights(point, bones)`** — computes an inverse-square-distance weight from the point to every nearby bone: `weight = 1 / (distance²)`, keeps only the top-N closest bones (to bound computation), then **normalizes so weights sum to 1**. This is a heuristic approximation of skinning weights (in professional tools these are hand-painted; Pose Animator auto-generates them from geometric proximity).
2. **`getSkinning(point, weights)`** — for each contributing bone, stores `{ bone, weight, transform }` where `transform = bone.getPointTransform(point)` — the bone-local anchor offset described above, computed once at bind time.
3. This produces a `skinning` dictionary per path segment/point, functionally equivalent to per-vertex bone weights in 3D skeletal mesh skinning — applied here to 2D vector path anchor points and Bezier handles instead of a 3D mesh's vertices.

### 4.5 Per-frame update / deformation

Each animation frame:
```js
static getCurrentPosition(segment) {
    let position = new paper.Point();
    Object.keys(segment.skinning).forEach(boneName => {
        let bt = segment.skinning[boneName];
        position = position.add(bt.bone.transform(bt.transform).multiply(bt.weight));
    });
    return position;
}
```
This is **linear blend skinning (LBS)**, the same technique used in 3D character animation: the final position of every path point is the **weighted sum** of where each influencing bone "thinks" that point should be (via its stored bone-local transform), blended by the precomputed weights. `Bone.transform(trans)` reconstructs a world-space point from the anchor-percentage + perpendicular/parallel offsets, using the bone's **current** (this frame's) endpoint positions and a body/face scale correction factor (`currentBodyScale`/`currentFaceScale`, the ratio of current total bone length to the bind-pose total bone length) — this scale correction keeps proportions consistent as the ML-detected skeleton grows/shrinks with camera distance.

**Confidence-weighted temporal smoothing** is also applied at the keypoint level before bone update (`updatePoseParts`):
```js
let weight0 = part0.score / (part1.score + part0.score);
let weight1 = part1.score / (part1.score + part0.score);
let pos = part0.position.multiply(weight0).add(part1.position.multiply(weight1));
```
This blends the previous frame's position with the new detection, weighted by each frame's confidence score — a simple but effective jitter-reduction and occlusion-robustness mechanism (if the new detection has low confidence, the old position dominates).

**Face-pose fallback**: if FaceMesh confidence drops (`face.faceInViewConfidence <= MIN_FACE_SCORE`), Pose Animator infers face keypoint positions from the body pose's ear keypoints using a previously-recorded transform function (`leftEarP2FFunc`/`rightEarP2FFunc`), so the face doesn't disappear/freeze when the face detector briefly loses tracking.

### 4.6 Applicability to this project's sprite/pose system

This architecture generalizes directly to mapping **any** live pose-estimation output (MediaPipe Pose, Apple Vision `VNHumanBodyPoseObservation`, or a custom model) onto **any** custom vector avatar:
1. Author the avatar as flat vector paths + a named joint-marker layer aligned to your chosen keypoint schema (map your specific ML model's joint names, e.g. MediaPipe's 33-point schema, to the marker names).
2. At load time, auto-generate skinning weights via inverse-distance-to-bone heuristics (or hand-paint them for higher-quality results, especially for Art Nouveau flowing garments where geometric proximity alone may not respect fabric/anatomy boundaries).
3. Every frame: update bone endpoint positions from the live ML keypoints (with confidence-weighted smoothing), then recompute every surface point via linear blend skinning.
4. Apply a body/face scale-correction factor so proportions remain stable as the tracked subject moves closer/farther from the camera.

---

## 5. Performance Optimization for Animation on Mobile

### 5.1 Frame budget fundamentals

- Standard target: **60 fps → ~16.6ms per frame budget** (60Hz refresh); many modern Android devices run 90Hz+ giving as little as **~11ms** or less ([Android Developers Compose codelab](https://developer.android.com/codelabs/jetpack-compose-performance)).
- iOS guidance: "generally speaking, if you're running at anything greater than 50 FPS your app will look smooth"; 20–40 FPS is noticeably stuttery; below 20 FPS is unusable ([Toptal — iOS Animation Tuning](https://www.toptal.com/ios/ios-animation-and-tuning-for-efficiency)).
- The critical architectural consequence for this project: **pose-estimation inference must never run on the same thread/frame budget as the UI/animation render loop.** If ML inference (even at 15-30fps) blocks the render thread, animation drops frames in lockstep.

### 5.2 GPU vs. CPU rendering decisions

- **iOS/Core Animation**: rendering is GPU-bound in steady state, but **image decoding and Core Graphics drawing happen on the CPU** before an animation starts (except during scrolling, which is continuous). Rule of thumb: "CPU work scales linearly with number of layers; actual rendering is GPU-bound." Use the **OpenGL ES Driver instrument** to check GPU utilization — if ~100%, you're GPU-bound; use the **Time Profiler** to check CPU-bound issues ([WWDC 2012 notes via saurabhs.org](https://saurabhs.org/wwdc-notes/wwdc-12-ios-performance-graphics-animations)).
- **Overdraw / blending**: iPhone GPUs (since 3GS) can handle ~2.5x overdraw at 60fps on the *slowest* supported device. Two mitigations: mark every layer **opaque** when possible, and **flatten the view hierarchy** to reduce layer count (fewer, larger draws vs. many small transparent layers) ([saurabhs.org WWDC notes](https://saurabhs.org/wwdc-notes/wwdc-12-ios-performance-graphics-animations)).
- **`shouldRasterize`**: caches a CALayer's rendered output as a bitmap the GPU can reuse across frames instead of re-blending every frame — but only helps for **static content**; the rasterized cache is evicted after 100ms of disuse and capped at 2.5x screen size ([WWDCNotes — Advanced Graphics & Animations](https://wwdcnotes.com/documentation/wwdc14-419-advanced-graphics-and-animations-for-ios-apps/)).
- **Offscreen passes** (blur, masks, shadows, rounded corners with `clipsToBounds` in certain configurations) each add ~0.1–0.2ms of GPU idle/context-switch time — trivial alone but compounds when several apply to an on-screen skeleton overlay + avatar simultaneously ([WWDCNotes](https://wwdcnotes.com/documentation/wwdc14-419-advanced-graphics-and-animations-for-ios-apps/)).
- **Android/Jetpack Compose**: prefer `graphicsLayer` modifier updates over state-triggered recomposition for continuously-changing values (like a bone rotation angle) — `graphicsLayer` changes are applied directly in the **draw phase**, skipping composition and layout entirely:
  ```kotlin
  // Avoid (triggers recomposition every change):
  Box(Modifier.offset(x = offsetX.dp))
  // Prefer (skips recomposition, only re-layout+redraw):
  Box(Modifier.offset { IntOffset(offsetX.toInt(), 0) })
  ```
  ([LinkedIn Compose performance post](https://www.linkedin.com/posts/vsurendharm_hi-devs-recently-i-came-across-a-post-activity-7419966711195672577-F4sk), [Android Developers — Compose best practices](https://developer.android.com/develop/ui/compose/performance/bestpractices))

### 5.3 Reducing overdraw and unnecessary work
- **Flutter**: use `RepaintBoundary` to isolate frequently-animating subtrees (e.g., the skeleton overlay) so repaints don't cascade to the rest of the screen; avoid the `Opacity` widget for animated fades (it forces an offscreen buffer) — use `AnimatedOpacity`/`FadeTransition` or bake alpha into color values instead; set `clipBehavior: Clip.none` when clipping isn't required, since the default `Clip.hardEdge` adds overhead ([MetaDesign Solutions — Flutter performance](https://metadesignsolutions.com/blog/performance-optimization-techniques-in-flutter)).
- **Flutter's official guidance**: profile only in **profile mode**, never debug mode, since debug-mode performance is not representative; use Flutter's **Impeller** renderer (default on iOS, rolling out on Android) to avoid first-run shader-compilation jank ("shader jank") that classically caused stutter on an animation's first play ([Flutter docs — Improving rendering performance](https://docs.flutter.dev/perf/rendering-performance)).
- **Compose**: minimize recomposition scope via `remember`, `derivedStateOf`, and `@Stable`/`@Immutable` annotations; extract frequently-changing UI into small, isolated composables rather than large trees; use `drawBehind` for values that only affect the draw phase (skips composition + layout phases entirely) ([Android Developers Compose codelab](https://developer.android.com/codelabs/jetpack-compose-performance), [10x-programming.com deep dive](https://10x-programming.com/jetpack-compose-animation-performance)).

### 5.4 Running 60fps animation alongside pose-estimation inference

This is the central systems-architecture challenge for this project. Key principles synthesized from the platform docs above:

```
┌───────────────────────────────────────────────────────────┐
│                     Main / UI thread                       │
│  - Render skeleton overlay + sprite (Canvas/SVG/Compose)   │
│  - Target: 16ms (60fps) or ~11ms (90Hz+) budget            │
│  - ONLY reads latest available pose result (non-blocking)  │
└───────────────────────▲───────────────────────────────────┘
                         │  (shared/atomic latest-result buffer,
                         │   updated asynchronously)
┌───────────────────────┴───────────────────────────────────┐
│              Background / inference thread                 │
│  - Camera frame capture                                    │
│  - Pose model inference (MediaPipe / Vision / PoseNet)     │
│  - Can run slower than 60fps (e.g., 15-30fps) without      │
│    blocking the render loop                                │
└───────────────────────────────────────────────────────────┘
```
- Inference should run on a **dedicated background thread/isolate** (e.g., a Flutter `Isolate`, an Android background thread/coroutine, or a GCD/DispatchQueue on iOS), publishing results into a thread-safe "latest result" slot that the render loop reads without blocking.
- The render loop should **always draw the most recently available pose result**, even if a newer inference hasn't finished yet — decoupling render cadence from inference cadence is what allows a smooth 60fps skeleton/sprite animation even when the underlying pose model only produces new keypoints 15–30 times per second. Apply interpolation/smoothing (as in Pose Animator's confidence-weighted blend, Section 4.5) between successive inference results to avoid visible "steps" in the render.
- On iOS, Vision framework requests are already asynchronous by design (`VNImageRequestHandler.perform`); ensure the completion handler doesn't do heavy work back on the main thread.
- On Android/Compose, keep ML inference off the composition thread entirely and pipe results through a `StateFlow`/observable that the UI reads via `collectAsState` — but be mindful this still recomposes on every emission, so throttle emission rate if inference produces results faster than needed, or better, drive the actual bone-position updates through `graphicsLayer` per Section 5.2 rather than raw recomposition.

### 5.5 Summary performance checklist for this project
- [ ] Keep pose inference on a background thread/isolate; never block the render/UI thread on model inference.
- [ ] Render loop always uses latest-available keypoints, decoupled from inference cadence.
- [ ] Apply confidence-weighted temporal smoothing to reduce jitter (borrow Pose Animator's approach).
- [ ] Animate only `transform`/`opacity`-equivalent properties in the sprite rig; avoid mutating raw path/geometry data per frame.
- [ ] Use `RepaintBoundary` (Flutter) / isolated composables with `graphicsLayer` (Compose) / rasterized or additive `CALayer` techniques (iOS) to contain repaint scope to just the animating skeleton/sprite subtree.
- [ ] Profile only in release/profile builds on real devices, never simulators/debug builds.
- [ ] Keep Lottie reference assets under ~300KB (prefer dotLottie), and limit concurrently-playing Lottie instances.

---

## 6. Recommendations Summary

| Decision area | Recommendation | Rationale |
|---|---|---|
| SVG rig authoring | Follow Pose Animator's `skeleton` + `illustration` group convention | Proven pattern for pose-driven vector characters, directly adaptable to Art Nouveau linework |
| Skeletal engine (if using a dedicated rig tool, not raw SVG) | Spine 2D | Only option with official Flutter + iOS runtimes and mature mesh/IK tooling for flowing Mucha-style drapery |
| Cross-platform bone format | Spine `.json`/`.skel` + `.atlas` | Broadest native mobile runtime support |
| Reference-pose animations | Lottie (dotLottie format) | Smallest footprint, native dynamic color support on both platforms |
| Skeleton overlay rendering | Canvas 2D (or Compose Canvas / Core Graphics) | Sufficient for keypoint+line overlays; reserve Metal/OpenGL for heavier mesh-deformation needs |
| Pose→sprite mapping | Linear blend skinning with bone-local anchor transforms + confidence-weighted smoothing (Pose Animator model) | Handles variable-length, ML-derived "bones" robustly, unlike fixed-length game skeletons |
| Threading model | Background inference thread/isolate + main-thread render loop reading latest buffered result | Decouples inference cadence from render cadence, protecting 60fps animation |

---

## Source List

- [Animating Optimized SVGs: CSS vs. SMIL vs. JavaScript](https://dominatetools.com/blog/animating-optimized-svgs/)
- [Pose Animator open-source tool overview (note.com)](https://note.com/npaka/n/ne0112a4b2396?hl=en)
- [SVG Genie — How to Check SVG Animations](https://www.svggenie.com/blog/how-to-check-svg-animation)
- [CSS-Tricks — Weighing SVG Animation Techniques (with Benchmarks)](https://css-tricks.com/weighing-svg-animation-techniques-benchmarks/)
- [Zigpoll — Optimizing SVG Animations for Mobile](https://www.zigpoll.com/content/how-can-i-optimize-svg-animations-to-run-smoothly-on-both-desktop-and-mobile-browsers-without-significant-performance-loss)
- [OpenReplay — Modern SVG Animation Techniques](https://blog.openreplay.com/modern-svg-animation-techniques/)
- [Practical SVG — Chapter 7: Animating SVG](https://practical-svg.chriscoyier.net/chapter/practical-svg-ebook-11/)
- [Armanimation — Best 2D Skeletal Animation Software 2026](https://www.armanimation.com/post/best-2d-skeletal-animation-software-in-2026-free-paid-options-compared)
- [EsotericSoftware/spine-runtimes (GitHub)](https://github.com/esotericsoftware/spine-runtimes)
- [Hau-Hau/react-native-spine-player (GitHub)](https://github.com/Hau-Hau/react-native-spine-player)
- [Castle Game Engine — Dragon Bones support](https://castle-engine.io/wp/2017/07/17/dragon-bones/)
- [Solar2D Forum — Dragon Bones Spine format support](https://forums.solar2d.com/t/dragon-bones-now-support-spine-format/342328)
- [Charios — The Defold 2D Character Animation Pipeline](https://charios.com/blog/defold-2d-character-animation-pipeline)
- [Pose Animator GitHub repository](https://github.com/yemount/pose-animator)
- [Google Developers Korea Blog — Pose Animator](https://developers-kr.googleblog.com/2020/06/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html)
- [Bomberbot — Lottie Loading Experiences in React Native](https://www.bomberbot.com/react-native/crafting-delightful-loading-experiences-with-lottie-animations-in-react-native/)
- [DEV Community — Beginner's Guide to RN Animations with Lottie](https://dev.to/brilworks/a-beginners-guide-to-react-native-animations-with-lottie-4hm0)
- [DEV Community — Enhancing RN Apps with Lottie](https://dev.to/im_ashish30/enhancing-your-react-native-app-with-stunning-lottie-animations-4945)
- [LottieFiles — Optimize Lottie Files for Faster Page Load Speeds](https://lottiefiles.com/blog/working-with-lottie-animations/optimize-lottie-files-for-faster-page-load-speeds)
- [LottieFiles — How to Optimize Lottie for Production](https://lottiefiles.com/blog/working-with-lottie-animations/how-to-optimize-lottie-for-production/)
- [GitHub — lottie-react-native performance issue #867](https://github.com/lottie-react-native/lottie-react-native/issues/867)
- [GitHub — lottie-react-native discussion #1006 (dotLottie)](https://github.com/lottie-react-native/lottie-react-native/issues/1006)
- [GitHub — hannojg/react-native-rlottie](https://github.com/hannojg/react-native-rlottie)
- [Stack Overflow — Change color dynamically in lottie json](https://stackoverflow.com/questions/57303700/change-color-dynamically-in-lottie-json)
- [Medium — Dynamic Lottie Animations on Android](https://medium.com/healint-engineering-data/dynamic-lottie-animations-on-android-e59b19334561)
- [Lottie Android — Dynamic Properties (GitBook)](https://airbnb.gitbook.io/lottie/android/dynamic-properties)
- [Swift Senpai — Modifying Lottie Animation with Value Providers](https://swiftsenpai.com/development/lottie-value-providers/)
- [Reddit r/react — Lottie performance in grid game](https://www.reddit.com/r/react/comments/1n7uw3o/need_help_performance_issues_with_multiple_lottie/)
- [Medium — Animating with Lottie in React Native](https://medium.com/@shiva999421/animating-with-lottie-simple-like-never-before-with-react-native-f32f165db0a5)
- [Scribd — Building a React Pose Estimation Demo with MediaPipe](https://www.scribd.com/document/921139419/Building-a-React-Pose-Estimation-Demo-With-MediaPipe)
- [YouTube — MediaPipe Pose landmark detection tutorial](https://www.youtube.com/watch?v=oaK74yozU9g)
- [dev.to — Pose Landmark Detection walkthrough](https://dev.to/iceice333/kaartrwcchcchabcchudsamkhaybnraangkaaykhngmnusy-pose-landmark-detection-14kj)
- [Apple Developer — Detecting Human Body Poses in Images](https://developer.apple.com/documentation/vision/detecting-human-body-poses-in-images)
- [Apple Developer — VNHumanBodyPoseObservation](https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation)
- [Apple Developer WWDC23 — Explore 3D body pose and person segmentation in Vision](https://developer.apple.com/videos/play/wwdc2023/111241/)
- [10x-programming.com — Jetpack Compose Animation Performance Optimization](https://10x-programming.com/jetpack-compose-animation-performance)
- [Android Developers — Practical performance problem solving in Jetpack Compose](https://developer.android.com/codelabs/jetpack-compose-performance)
- [Android Developers — Follow best practices (Jetpack Compose)](https://developer.android.com/develop/ui/compose/performance/bestpractices)
- [WWDCNotes — Advanced Graphics and Animations for iOS Apps (WWDC14-419)](https://wwdcnotes.com/documentation/wwdc14-419-advanced-graphics-and-animations-for-ios-apps/)
- [saurabhs.org — WWDC 2012: iOS App Performance: Graphics and Animations](https://saurabhs.org/wwdc-notes/wwdc-12-ios-performance-graphics-animations)
- [Toptal — iOS Animation and Tuning for Efficiency](https://www.toptal.com/ios/ios-animation-and-tuning-for-efficiency)
- [MetaDesign Solutions — Performance Optimization Techniques in Flutter](https://metadesignsolutions.com/blog/performance-optimization-techniques-in-flutter)
- [Flutter Documentation — Improving rendering performance](https://docs.flutter.dev/perf/rendering-performance)
- [LinkedIn — Jetpack Compose Performance Optimization with graphicsLayer](https://www.linkedin.com/posts/vsurendharm_hi-devs-recently-i-came-across-a-post-activity-7419966711195672577-F4sk)

---

*Research compiled via web search, GitHub source inspection (Pose Animator repository cloned and analyzed directly), and official platform documentation (Apple Developer, Flutter, Android Developers).*
