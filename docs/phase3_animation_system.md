# PoseArt — Phase 3: Sprite & Animation System Document
**Version 1.0 — Phase 3 Deliverable**
*Compiled July 5, 2026 | Inputs: [Phase 3 Pre-Research](/home/user/workspace/research_phase3.md), [Product Design Document v1.0](/home/user/workspace/product_design_document.md)*

---

## 0. Scope & Inputs

This document specifies the complete animation system for PoseArt's three visual layers — the live skeleton overlay, the pre-authored Lottie reference animations, and the Mucha-style avatar sprite — and how they composite over the live camera feed, per the camera pipeline mandated in the Product Design Document ([Section 5.2](#), `product_design_document.md`). Technical choices below implement the recommendations from the Phase 3 pre-research, in particular the Pose Animator linear-blend-skinning architecture, Lottie mobile optimization guidance, and the background-inference/foreground-render threading model.

---

## 1. Animation Architecture Overview

### 1.1 Full Pipeline (Capture → Compositing)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              BACKGROUND / INFERENCE THREAD                            │
│                                                                                        │
│   ┌──────────────┐     ┌──────────────────┐     ┌─────────────────────────────┐      │
│   │ Camera Feed  │────▶│  Frame Buffer     │────▶│  Inference Thread            │      │
│   │  (30 fps)    │     │  (ring, keep-     │     │  - Pose Landmarker           │      │
│   │              │     │   latest, never   │     │    (BlazePose 33-pt /        │      │
│   │              │     │   queue)          │     │     Apple Vision 19-pt)      │      │
│   └──────────────┘     └──────────────────┘     │  - runs 15–30 fps, async     │      │
│                                                   └──────────────┬───────────────┘      │
│                                                                  ▼                      │
│                                                   ┌─────────────────────────────┐      │
│                                                   │  Raw Keypoint Data           │      │
│                                                   │  {joint, x, y, (z), conf}[]  │      │
│                                                   └──────────────┬───────────────┘      │
│                                                                  ▼                      │
│                                                   ┌─────────────────────────────┐      │
│                                                   │  Smoothing Stage             │      │
│                                                   │  - One-Euro Filter per joint │      │
│                                                   │    (min_cutoff=1.0,          │      │
│                                                   │     beta=0.007)              │      │
│                                                   │  - Confidence-weighted blend │      │
│                                                   │    (drop/hold on low conf.)  │      │
│                                                   └──────────────┬───────────────┘      │
│                                                                  ▼                      │
│                                                   ┌─────────────────────────────┐      │
│                                                   │  Alignment Scoring           │      │
│                                                   │  - Joint angle deltas vs.    │      │
│                                                   │    reference pose vector     │      │
│                                                   │  - Aggregate score 0–100     │      │
│                                                   │  - Per-joint error → NLG     │      │
│                                                   │    hint mapper (hysteresis)  │      │
│                                                   └──────────────┬───────────────┘      │
│                                                                  │                      │
└──────────────────────────────────────────────────────────────── │ ─────────────────────┘
                                    Thread-safe "latest result" slot
                          (atomic/lock-free buffer, no blocking reads)
                                                                    │
┌──────────────────────────────────────────────────────────────── ▼ ─────────────────────┐
│                                 MAIN / RENDER THREAD (60 fps)                            │
│                                                                                          │
│   ┌───────────────────────────────────────────────────────────────────────────────┐    │
│   │  Render Loop (requestAnimationFrame / CADisplayLink / Compose frame clock)     │    │
│   │  1. Read latest smoothed keypoints + alignment score (non-blocking)            │    │
│   │  2. Draw live camera preview (base layer)                                      │    │
│   │  3. Draw Lottie reference animation (target pose, tinted by score state)       │    │
│   │  4. Draw live skeleton overlay (lines + joint dots, color-coded by error)      │    │
│   │  5. Draw/update Mucha avatar sprite (bone-driven, halo reflects score)         │    │
│   │  6. Draw Overlay Compositor chrome (HUD, decorative frame, hint text)          │    │
│   └───────────────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Layer Stack (Z-Order, back to front)

```
 z=0  ┌────────────────────────────────────────┐
      │  Live Camera Feed (opaque base)         │
 z=1  ├────────────────────────────────────────┤
      │  Ghost Silhouette (optional, 40% alpha) │  ← toggle: Off / Ghost / Skeleton / Avatar
 z=2  ├────────────────────────────────────────┤
      │  Lottie Reference Animation              │  ← "target pose" ghost, pre-authored,
      │  (semi-transparent, positioned/scaled    │     tinted per alignment state
      │   to subject bounding box)                │
 z=3  ├────────────────────────────────────────┤
      │  Live Skeleton Overlay                    │  ← real-time lines + dots, colored
      │  (lines + joint dots, drawn every frame)  │     green/gold/terracotta per joint
 z=4  ├────────────────────────────────────────┤
      │  Mucha Avatar Sprite (self-view mode only)│  ← replaces raw skeleton with
      │  bone-driven SVG figure + halo/nimbus     │     illustrated figure; halo encodes
      │                                            │     overall alignment score
 z=5  ├────────────────────────────────────────┤
      │  Overlay Compositor / HUD                 │  ← alignment % readout, hint text,
      │  (score readout, hint banner, Art Nouveau │     Art Nouveau decorative frame,
      │   frame, capture countdown)                │     capture button, mode toggles
      └────────────────────────────────────────┘
```

**Compositing rules:**
- Only one of {Ghost Silhouette, Skeleton Lines, Avatar} renders at z=1–4 at a time, per the F2 overlay-density toggle in the PDD; the Lottie reference (z=2) and HUD (z=5) are independent of this toggle and always available.
- The Lottie layer and the live overlay layer never fight for the same visual space: the Lottie shows the **target** pose (static reference, gently looping), while the skeleton/avatar shows the **live detected** pose — they are spatially aligned (same bounding-box anchor) but visually distinguished by opacity (Lottie at ~50% opacity, live layer at full opacity) so users can see both "where you are" and "where to go" simultaneously.
- All layers share one coordinate space (screen space, Section 4.6) so bone positions, Lottie anchor points, and HUD score markers never drift relative to one another.

---

## 2. Mucha Avatar Sprite System

### 2.1 Visual Design Vocabulary

Per the PDD's [Mucha Avatar System](product_design_document.md#66-the-mucha-avatar-system) and Art Nouveau rigging research ([Charios Defold pipeline](https://charios.com/blog/defold-2d-character-animation-pipeline)):

| Attribute | Specification |
|---|---|
| **Line weight** | Outline strokes: 2.5–3.5px at 1x (viewBox 400×400); tapered stroke (`stroke-linecap: round`, variable width via `<path>` with pressure-simulated width, not uniform stroke) to mimic lithographic pen line |
| **Stroke style** | Continuous, unbroken contour lines — no dashed/sketchy strokes; whiplash curves (S-curves) preferred over straight segments for limb outlines, per Mucha's signature line quality |
| **Hair treatment** | Separate flowing-hair layer using **mesh deformation** (not rigid bone segments) — hair rendered as 3–5 overlapping bezier ribbons with independent secondary-motion physics (lag behind head rotation, gentle sway) |
| **Drapery treatment** | Garment/robe folds rendered as long, flowing bezier paths bound with soft mesh weights spanning 2–3 adjacent bones (torso + upper arm) so fabric doesn't tear at joints |
| **Color fills** | Flat fills only (no gradients in SVG — gradients don't `transform`-animate cheaply); base fill `#0F3B3A` (Deep Teal) for line art, `#C9A24C` (Antique Gold) accent fills for halo/accessories, `#F6F0E1` (Parchment) as negative-space/skin fill |
| **Decorative motifs** | Optional background flourish (vine/whiplash border) rendered as a separate static `<symbol>` reused via `<use>`, never per-frame animated |

### 2.2 SVG Structure — Required Layers

Following the Pose Animator two-part convention (skeleton + illustration) confirmed in research ([Pose Animator GitHub](https://github.com/yemount/pose-animator)):

```xml
<svg viewBox="0 0 400 400" id="mucha-avatar-base">
  <defs>
    <!-- reusable flourish/border motifs -->
    <symbol id="flourish-vine">...</symbol>
  </defs>

  <g id="skeleton" display="none">
    <!-- joint marker layer: named circles aligned to illustration in bind pose -->
    <circle id="joint_head" cx="200" cy="60" r="4"/>
    <circle id="joint_neck" cx="200" cy="90" r="4"/>
    <circle id="joint_leftShoulder" cx="170" cy="100" r="4"/>
    <!-- ... one marker per bone endpoint, see Section 2.3 -->
  </g>

  <g id="illustration">
    <g id="layer_outline">      <!-- primary contour linework, all limbs/torso --> </g>
    <g id="layer_fill">         <!-- flat color fills beneath outline --> </g>
    <g id="layer_hair">         <!-- flowing hair ribbons, mesh-deformed --> </g>
    <g id="layer_drapery">      <!-- robe/garment folds, mesh-deformed --> </g>
    <g id="layer_accessories">  <!-- optional: headpiece, jewelry, props --> </g>
    <g id="layer_halo">         <!-- nimbus/halo ring, see Section 2.4 --> </g>
  </g>
</svg>
```

**Layer notes:**
- `skeleton` group is hidden at runtime (`display:none`) — it exists only to bind joint markers to illustration geometry at authoring/bind time, per Pose Animator's binding step.
- `layer_outline` and `layer_fill` are kept as separate groups (not merged) so the outline can remain constant-width while fills deform underneath — avoids the "fill stretches, line looks thin" artifact common in naive skeletal SVG rigs.
- `layer_hair` and `layer_drapery` are isolated because they use **mesh/weight-painted deformation** (soft multi-bone influence) rather than the rigid single-bone-per-segment binding used for limbs — consistent with the pre-research finding that Art Nouveau's flowing forms need continuous bending, not jointed segments.
- `layer_halo` is rendered as an independently-controlled group so its stroke-dasharray/opacity can be driven purely by the alignment score, decoupled from body pose.

### 2.3 Bone / Joint Hierarchy

Root-to-extremity hierarchy (matches natural anatomy per pre-research §1.3, step 3):

```
root_pelvis
 ├── spine_lower
 │    └── spine_upper
 │         ├── neck
 │         │    └── head
 │         ├── shoulder_L ── elbow_L ── wrist_L ── (hand_L)
 │         └── shoulder_R ── elbow_R ── wrist_R ── (hand_R)
 ├── hip_L ── knee_L ── ankle_L ── (foot_L)
 └── hip_R ── knee_R ── ankle_R ── (foot_R)
```

This 15-bone skeleton is the sprite's **internal rig**; it is populated from either the 19-point Apple Vision or 33-point MediaPipe output via the mapping tables in Section 6. Both source keypoint sets collapse onto the same internal bone hierarchy so a single SVG rig serves both platforms — only the *mapping layer* differs, not the sprite itself.

### 2.4 Halo / Nimbus Alignment Encoding

The halo is a segmented ring (12 arc segments, matching a clock-face division) drawn behind the head bone, radius scaled to head size:

```
Alignment 90–100%:  ●●●●●●●●●●●●   (12/12 segments solid, full gold ring, subtle glow)
Alignment 70–89%:   ●●●●●●●●●●○○   (10/12 segments, 2 begin to fade/dash)
Alignment 50–69%:   ●●●●●●○○○○○○   (6/12 segments, ring visibly fragmenting)
Alignment 30–49%:   ●●●○○○○○○○○○   (3/12 segments, mostly gaps)
Alignment 0–29%:    ○○○○○○○○○○○○   (segments fully faded to 10% opacity outline only)
```

- Segment count visible = `ceil(alignment_score / 100 * 12)`.
- Each segment is a separate `<path>` arc in `layer_halo`; visibility is driven by `opacity` and `stroke-dashoffset` only (per the pre-research's "animate only transform/opacity" rule) — never by rewriting path `d` attributes per frame.
- Color: solid segments render in `#C9A24C` (Antique Gold) with a soft outer glow (`feGaussianBlur`, pre-baked as a static filter, not recomputed per frame); faded segments render at `#0F3B3A` 10% opacity outline only.
- Full mapping table in Section 6.4.

### 2.5 File Naming Convention & Asset Organization

```
/assets/avatar/
  mucha_base_female_v1.svg          # default figure variant
  mucha_base_male_v1.svg            # alternate variant
  mucha_base_neutral_v1.svg         # abstract/neutral variant
  /variants/
    mucha_pose_standing_v1.svg      # pose-category parameter preset (see 2.6)
    mucha_pose_seated_v1.svg
    mucha_pose_kneeling_v1.svg
    mucha_pose_reclining_v1.svg
    mucha_pose_dynamic_v1.svg
  /accessories/
    accessory_headpiece_laurel.svg
    accessory_veil.svg
  /textures/
    parchment_grain.svg             # shared background noise pattern
```

**Naming convention:** `mucha_{asset-type}_{variant}_{version}.svg`, all lowercase, underscore-delimited, semantic versioning suffix (`v1`, `v2`) so a rig update doesn't silently break cached references. Bone/joint IDs inside every SVG use `camelCase` matching the internal bone names in Section 2.3 (`shoulder_L`, not `shoulderLeft` or `Shoulder-L`) to keep a single, consistent lookup table across all sprite variants.

### 2.6 Parameterizing the Avatar for Pose Categories

Rather than authoring a unique SVG per pose, the base rig is parameterized:

1. **Bind-pose neutral rig** (`mucha_base_*_v1.svg`) is the only hand-authored asset per figure variant.
2. **Pose category presets** apply a **default joint-angle configuration** (a JSON preset of bone rotation offsets) layered on top of live keypoint data — e.g., the `Seated` preset pre-biases hip/knee bend ranges so the IK solver favors seated-plausible angles when live tracking is ambiguous (occluded legs, etc.).
3. **Accessory swapping** is a simple layer-visibility toggle (`layer_accessories/headpiece_laurel` visible/hidden) — no new geometry.
4. **Variant swapping** (female/male/neutral/abstract) swaps the entire `illustration` group while reusing the same `skeleton` joint-marker names, so the same live pose data drives any variant without remapping.

This matches the PDD's content-cost mitigation strategy (commission ~30 hero sprites, template-rig the remainder — [Section 11, Risks & Mitigations](product_design_document.md#11-risks--mitigations)).

---

## 3. Lottie Reference Animation System

### 3.1 Required Animation States (per pose category)

Each of the 10 primary Base Position categories (`S`, `SE`, `LS`, `LSe`, `K`, `R`, `D`, `E`, `C`, `A` — [PDD Section 7.1](product_design_document.md#71-primary-categories-axis-1--base-position)) requires four Lottie states:

| State | Purpose | Loop behavior |
|---|---|---|
| **Idle loop** | Shown while browsing the pose library / before user enters camera view; gentle "breathing" motion | Infinite loop, seamless (last frame == first frame) |
| **Enter pose** | Plays once when a pose is selected and camera view opens; figure animates from neutral into the target pose | Play-once, then transitions to Hold |
| **Hold pose** | The steady-state reference shown during active coaching; subtle idle pulse only | Infinite loop, seamless |
| **Exit pose** | Plays once when user selects a different pose or exits; figure relaxes out of the pose | Play-once, then unmounts/swaps asset |

### 3.2 Timing Specifications

| State | Duration | Frame count (at 24fps) | Notes |
|---|---|---|---|
| Idle loop | 2.0s | 48 frames | Matches PDD's specified "2s scale pulse, amplitude 1.02x" ([Section 6.5](product_design_document.md#65-motion-design-principles)) |
| Enter pose | 0.5–0.8s | 12–19 frames | "elaborate" duration band per PDD motion scale (500ms) |
| Hold pose | 2.0s (looped) | 48 frames | Same loop as idle but with limbs in target pose, not neutral |
| Exit pose | 0.4–0.5s | 10–12 frames | Slightly faster than enter (exit should feel less deliberate) |

All durations stay within the pre-research's recommended **150–400 total frame** ceiling per asset ([Bomberbot guidance](https://www.bomberbot.com/react-native/crafting-delightful-loading-experiences-with-lottie-animations-in-react-native/)) — a full 4-state pose package totals ~118–127 frames, well under budget, leaving headroom for higher frame rates or added detail on hero poses.

### 3.3 File Size Targets & Optimization Approach

| Guidance | Target |
|---|---|
| Per-state file size | Under 300 KB uncompressed JSON; target **tens of KB** using dotLottie ([LottieFiles optimization guide](https://lottiefiles.com/blog/working-with-lottie-animations/optimize-lottie-files-for-faster-page-load-speeds)) |
| Composition canvas | Standardized **300×300** across the entire pose library (per pre-research §2.5) to avoid inconsistent scaling costs |
| Format | Author in After Effects with **vector shape layers only** (no embedded raster); export as **dotLottie** (zip+Deflate, up to ~80% size reduction) |
| Pipeline | Run LottieFiles' **Keyframe Optimizer** before shipping to strip redundant per-frame keyframes; manually delete any sublayer that produces no visible change when toggled off |
| Avoided features | Gradients, AE masks, and expressions — these frequently fail to translate and bloat output |
| Bundle strategy | Ship all 10 categories × 4 states = 40 dotLottie files (~50 KB avg → ~2 MB total library), lazy-loaded per category on pose-library scroll, not bundled in the app binary |

### 3.4 Color Parameterization for Alignment Score State

Each Lottie source file names its tintable layer with a hash-prefixed key (`#activeLimb`, `#referenceStroke`) at authoring time, per the pre-research's named-layer convention (§2.4, §2.5). At runtime the app uses **native Dynamic/Value Providers** (not JS colorify, for production robustness):

```
// iOS — Lottie Value Providers
let colorProvider = ColorValueProvider(scoreStateColor)
animationView.setValueProvider(colorProvider, keypath: AnimationKeypath(keys: ["**", "referenceStroke", "Fill 1", "Color"]))

// Android — KeyPath + dynamic property callback
animationView.addValueCallback(
    KeyPath("**", "referenceStroke", "Fill 1"),
    LottieProperty.COLOR_FILTER
) { PorterDuffColorFilter(scoreStateColor, PorterDuff.Mode.SRC_ATOP) }
```

**Score → color mapping** (reuses the PDD semantic palette, [Section 6.2](product_design_document.md#62-color-system)):

| Alignment score | Lottie tint |
|---|---|
| ≥ 85% (auto-capture threshold) | `#4CAF7D` soft botanical green |
| 50–84% | `#C9A24C` antique gold |
| < 50% | `#C96A4C` terracotta |
| No live tracking yet | `#0F3B3A` deep teal (neutral/default) |

Because the color binding is a per-frame callback rather than a baked-in JSON value, the same 4 dotLottie files per pose serve all four score states — no need to author separate colored variants.

### 3.5 Fallback Strategy (Lottie Load Failure)

```
On pose-card mount or camera-view open:
  try: load {category}_{state}.lottie
  on success: render Lottie, start at "idle" or "hold" state per context
  on failure (timeout 800ms / parse error / unsupported feature):
    → fall back to static PNG: {category}_{state}_fallback.png
    → PNG rendered at same anchor/scale as the Lottie would have used
    → log failure event (non-blocking, telemetry only, on-device aggregation
       per PDD's on-device processing mandate)
    → retry Lottie load in background; hot-swap to Lottie if it succeeds
      before the user navigates away
```

Every one of the 40 Lottie assets ships with a matching pre-rendered static PNG (first frame of "Hold pose" state) at the same 300×300 canvas, satisfying both the failure fallback and `prefers-reduced-motion`/accessibility requirements noted in the pre-research (§2.2).

---

## 4. Live Skeleton Overlay System

### 4.1 Keypoint Model

Per PDD [Section 5.1](product_design_document.md#51-platform-strategy) and [5.5](product_design_document.md#55-model-selection-strategy):

| Platform | Framework | Keypoint count | Notes |
|---|---|---|---|
| iOS | Apple Vision (`VNDetectHumanBodyPoseRequest`) | 19 points, 2D normalized (bottom-left origin) | Confidence per point; ignore `confidence == 0` |
| Android | MediaPipe Pose Landmarker (BlazePose) | 33 points | Full/Lite variants by device tier |
| Low-end (either OS) | MoveNet Lightning INT8 | 17 points (COCO schema), mapped to nearest internal bone | 2.9MB model, OTA-delivered via Firebase ML |

The app's internal bone rig (Section 2.3, 15 bones) is the **canonical schema**; all three source models map onto it via the tables in Section 6.1/6.2, so overlay-drawing and scoring logic is written once against the internal schema, not per-model.

### 4.2 Joint-to-Joint Connection Map

Connections drawn as line segments between internal bone endpoints (superset covering both source schemas):

```
head           ── neck
neck           ── spine_upper
spine_upper    ── spine_lower
spine_lower    ── root_pelvis
spine_upper    ── shoulder_L
spine_upper    ── shoulder_R
shoulder_L     ── elbow_L
elbow_L        ── wrist_L
shoulder_R     ── elbow_R
elbow_R        ── wrist_R
root_pelvis    ── hip_L
root_pelvis    ── hip_R
hip_L          ── knee_L
knee_L         ── ankle_L
hip_R          ── knee_R
knee_R         ── ankle_R
```

16 connections total. Optional extremity connections (`wrist_L`–`hand_L` fingertip average, `ankle_L`–`foot_L` toe point) are drawn only when the source model provides those points (MediaPipe does; Apple Vision 19-pt and MoveNet 17-pt do not) — connection list is generated dynamically from whichever joints are present in a given frame's confidence-filtered set.

### 4.3 Color Coding

Directly from PDD [Section 6.2 semantic colors](product_design_document.md#62-color-system):

| State | Hex | Applies to |
|---|---|---|
| Correct joint | `#4CAF7D` | Joint angle error within tolerance (per Section 5 scoring) |
| Partial / in-progress | `#C9A24C` | Error present but within "adjusting" band |
| Incorrect | `#C96A4C` | Error exceeds correction threshold |
| Neutral skeleton (no active scoring, e.g. free-camera mode) | `#FFFFFF` at 70% opacity | Default overlay color per PDD |

Each **line segment's** color is the worse (more red) of its two endpoint joints' states, so a single mis-aligned joint visibly "infects" its connecting bones — this gives users an immediate visual read of which limb needs adjustment, not just which single point.

### 4.4 Line Style

| Property | Value |
|---|---|
| Weight | 3px at 1x device scale (matches Mucha avatar outline weight for visual consistency between overlay modes) |
| Cap | `round` |
| Join | `round` |
| Opacity | 90% for active/tracked bones; 30% for bones with low-confidence endpoints (still drawn, but visibly "ghosted" rather than disappearing, to avoid flicker) |

### 4.5 Keypoint Dot Style

| Property | Value |
|---|---|
| Radius | 5px at 1x (slightly larger than line weight for visual anchor points) |
| Fill | Joint state color (Section 4.3), full opacity |
| Stroke | 1.5px `#F6F0E1` (Parchment) outline for contrast against both light and dark camera backgrounds |
| Confidence gating | Dot not drawn if confidence < 0.3 (below this, drawing a wildly-jittering dot is worse than omitting it) |

### 4.6 One-Euro Filter Parameters

Per PDD [Section 5.2](product_design_document.md#52-camera-pipeline-architecture-non-negotiable) mandate and pre-research jitter-reduction findings (§3.4, §4.5):

```
min_cutoff = 1.0     # Hz — lower = more smoothing at low speed, more lag
beta       = 0.007   # speed coefficient — higher = less lag during fast motion
d_cutoff   = 1.0      # Hz — derivative cutoff (standard default)
```

Applied independently to each joint's `x`, `y` (and `z` where available) stream, per-frame, before any bone/skinning update or scoring computation. These are **starting values** for tuning during device testing — pre-research confirms One-Euro filtering (or the closely related confidence-weighted exponential blend used by Pose Animator) is the standard jitter-mitigation technique for live ML keypoints; `beta` should be tuned upward if fast dynamic poses (category `D`) show excessive lag, and `min_cutoff` tuned upward if static holds (category `S`, `SE`) still show visible micro-jitter.

### 4.7 Coordinate System Transformation

Three coordinate spaces must reconcile every frame (per pre-research §4.3):

```
1. Camera/model space:
   Apple Vision  → normalized (0–1), bottom-left origin
   MediaPipe     → normalized (0–1), top-left origin
   ↓ normalize origin convention (flip Y for Apple Vision to match top-left standard)

2. Screen/view space:
   screen_x = model_x * view_width
   screen_y = model_y * view_height
   (+ apply front-camera horizontal mirror flip: screen_x = view_width - screen_x)

3. Bone-local anchor space (sprite rig only):
   Used only inside the Mucha avatar's skinning system (Section 2) —
   surface points expressed as %-along-bone + perpendicular offset,
   recomputed from current-frame bone endpoints (screen space) each frame,
   per Pose Animator's Bone.getPointTransform() model (pre-research §4.3–4.5).
```

The skeleton overlay (Section 4) only needs spaces 1–2; the Mucha avatar (Section 2) additionally needs space 3 for its linear-blend-skinning deformation.

---

## 5. Alignment Scoring Algorithm

### 5.1 Joint-by-Joint Angle Difference

```pseudocode
function computeJointError(liveKeypoints, referencePose):
    errors = {}
    for bone in INTERNAL_BONE_LIST:            # 15 bones, Section 2.3
        parentJoint, childJoint = bone.endpoints
        if confidence(liveKeypoints, parentJoint) < MIN_CONF
           or confidence(liveKeypoints, childJoint) < MIN_CONF:
            errors[bone] = null                # insufficient data, skip scoring this bone
            continue

        liveVector = vector(liveKeypoints[parentJoint], liveKeypoints[childJoint])
        refVector  = vector(referencePose[parentJoint], referencePose[childJoint])

        liveAngle = atan2(liveVector.y, liveVector.x)
        refAngle  = atan2(refVector.y,  refVector.x)

        angleDelta = normalizeAngle(liveAngle - refAngle)   # range [-180, 180]
        errors[bone] = angleDelta
    return errors
```

Reference pose angles are pre-computed once per pose asset (stored alongside the Lottie/avatar preset as a JSON angle table), not derived live from the Lottie animation itself.

### 5.2 Aggregate Alignment Score (0–100)

```pseudocode
function computeAlignmentScore(errors, jointWeights):
    # jointWeights: per-bone importance weight (core torso/hip bones weighted
    # higher than distal extremities, since torso orientation defines a pose
    # more than fine hand/foot position)
    weightedErrorSum = 0
    weightTotal = 0
    for bone, angleDelta in errors:
        if angleDelta is null:
            continue                             # exclude untracked bones from scoring
        w = jointWeights[bone]
        normalizedError = min(abs(angleDelta) / MAX_TOLERABLE_ANGLE, 1.0)  # clamp 0-1
        weightedErrorSum += w * normalizedError
        weightTotal += w

    if weightTotal == 0:
        return null                              # no trackable joints — show "searching" state

    meanError = weightedErrorSum / weightTotal    # 0 (perfect) to 1 (max error)
    score = round(100 * (1 - meanError))
    return clamp(score, 0, 100)
```

`MAX_TOLERABLE_ANGLE` is configurable per the PDD's **Strict / Balanced / Relaxed** sensitivity setting ([F3, Pose Guidance Feedback System](product_design_document.md#41-mvp-features)) — e.g. Strict = 20°, Balanced = 35°, Relaxed = 50° before a joint is considered maximally "wrong."

### 5.3 Per-Joint Error → Natural Language Hint Mapping (All 19 Apple Vision Joints)

Direction of hint is derived from the **sign** of the angle delta and which axis dominates (flexion/extension vs. abduction/adduction), resolved per joint:

| Joint (Apple Vision name) | Positive Δ hint | Negative Δ hint |
|---|---|---|
| `root` (pelvis) | "Shift your hips back" | "Shift your hips forward" |
| `neck` | "Lift your chin slightly" | "Tuck your chin slightly" |
| `leftShoulder` | "Lower your left shoulder" | "Raise your left shoulder" |
| `rightShoulder` | "Lower your right shoulder" | "Raise your right shoulder" |
| `leftElbow` | "Straighten your left arm" | "Bend your left elbow more" |
| `rightElbow` | "Straighten your right arm" | "Bend your right elbow more" |
| `leftWrist` | "Rotate your left wrist up" | "Rotate your left wrist down" |
| `rightWrist` | "Rotate your right wrist up" | "Rotate your right wrist down" |
| `leftHip` | "Shift weight off your left leg" | "Shift weight onto your left leg" |
| `rightHip` | "Shift weight off your right leg" | "Shift weight onto your right leg" |
| `leftKnee` | "Straighten your left knee" | "Bend your left knee more" |
| `rightKnee` | "Straighten your right knee" | "Bend your right knee more" |
| `leftAnkle` | "Point your left foot outward" | "Point your left foot inward" |
| `rightAnkle` | "Point your right foot outward" | "Point your right foot inward" |
| `leftEye` | (face orientation, not directly hinted — folded into `neck`/head hint) | — |
| `rightEye` | (face orientation, folded into `neck`/head hint) | — |
| `leftEar` | "Turn your head slightly left" | "Turn your head slightly right" |
| `rightEar` | "Turn your head slightly right" | "Turn your head slightly left" |
| `nose` | "Face slightly toward camera" | "Face slightly away from camera" |

For MediaPipe's 33-point schema, the additional finger/foot-detail points (index/pinky/thumb, heel/foot-index) inherit their parent joint's hint (e.g., `left_index` errors surface as the `leftWrist` hint) rather than generating 14 additional hint strings — this avoids overwhelming users with hyper-granular corrections not supported by the pre-research's accessibility-first design principle (PDD §2.1, "clinical sterility" problem).

### 5.4 Hysteresis Gating

Per PDD [F3](product_design_document.md#41-mvp-features): *"hints only surface after an error persists ≥1.5 seconds."*

```pseudocode
state: errorTimers = {}   # per-joint running timer

function updateHintGating(errors, dt):
    activeHints = []
    for bone, angleDelta in errors:
        if angleDelta is null:
            errorTimers[bone] = 0
            continue
        if abs(angleDelta) > HINT_THRESHOLD:
            errorTimers[bone] = errorTimers.get(bone, 0) + dt
        else:
            errorTimers[bone] = max(0, errorTimers.get(bone, 0) - dt * DECAY_RATE)
            # decay rather than instant reset avoids hint "flicker" on momentary
            # correction blips

        if errorTimers[bone] >= HYSTERESIS_DURATION:   # 1.5s
            activeHints.append(hintFor(bone, angleDelta))

    return activeHints[:MAX_CONCURRENT_HINTS]   # cap concurrent hints (e.g. 2)
       # so users aren't shown 6 corrections simultaneously
```

`DECAY_RATE` is tuned so a brief 200–300ms dip below threshold (natural micro-movement) doesn't fully reset the timer, but a genuine correction does clear it within roughly 1 second.

### 5.5 Auto-Capture Threshold Logic

Per PDD [F4](product_design_document.md#41-mvp-features): *"Auto-captures when alignment ≥ 85% sustained for 1.5 seconds."*

```pseudocode
state: captureHoldTimer = 0
state: shotsFiredThisEvent = 0

function updateAutoCapture(alignmentScore, dt):
    if alignmentScore >= AUTO_CAPTURE_THRESHOLD:      # 85
        captureHoldTimer += dt
    else:
        captureHoldTimer = 0
        shotsFiredThisEvent = 0

    if captureHoldTimer >= AUTO_CAPTURE_HOLD_DURATION:  # 1.5s
        if shotsFiredThisEvent < MAX_BURST_SHOTS:        # 5, per PDD F4
            fireCaptureAndHaptic()
            shotsFiredThisEvent += 1
            captureHoldTimer = AUTO_CAPTURE_HOLD_DURATION - BURST_INTERVAL
            # re-arms after a short interval rather than fully resetting,
            # enabling rapid burst without re-waiting the full 1.5s
```

This shares the same hysteresis primitive as Section 5.4 (a persistence timer gated on a threshold) — implemented as one reusable timer utility across both hint-surfacing and auto-capture, reducing duplicated state-machine logic.

---

## 6. Pose-to-Avatar Mapping Tables

### 6.1 Apple Vision 19 Keypoints → Sprite Bone Names

| Apple Vision `JointName` | Internal sprite bone |
|---|---|
| `root` | `root_pelvis` |
| `neck` | `neck` |
| `nose` | `head` |
| `leftEye`, `rightEye` | *(informational only, no dedicated bone; head orientation)* |
| `leftEar` | `head` (rotation bias) |
| `rightEar` | `head` (rotation bias) |
| `leftShoulder` | `shoulder_L` |
| `rightShoulder` | `shoulder_R` |
| `leftElbow` | `elbow_L` |
| `rightElbow` | `elbow_R` |
| `leftWrist` | `wrist_L` |
| `rightWrist` | `wrist_R` |
| `leftHip` | `hip_L` |
| `rightHip` | `hip_R` |
| `leftKnee` | `knee_L` |
| `rightKnee` | `knee_R` |
| `leftAnkle` | `ankle_L` |
| `rightAnkle` | `ankle_R` |

(19 points total: `root`, `neck`, `nose`, `leftEye`, `rightEye`, `leftEar`, `rightEar`, `leftShoulder`, `rightShoulder`, `leftElbow`, `rightElbow`, `leftWrist`, `rightWrist`, `leftHip`, `rightHip`, `leftKnee`, `rightKnee`, `leftAnkle`, `rightAnkle`.)

### 6.2 MediaPipe 33 Keypoints → Sprite Bone Names

| MediaPipe landmark index/name | Internal sprite bone |
|---|---|
| `0 nose` | `head` |
| `1–6 leftEye/rightEye (inner/center/outer)` | *(head orientation only)* |
| `7 leftEar`, `8 rightEar` | `head` (rotation bias) |
| `9 mouthLeft`, `10 mouthRight` | *(unused — no facial-expression bone)* |
| `11 leftShoulder` | `shoulder_L` |
| `12 rightShoulder` | `shoulder_R` |
| `13 leftElbow` | `elbow_L` |
| `14 rightElbow` | `elbow_R` |
| `15 leftWrist` | `wrist_L` |
| `16 rightWrist` | `wrist_R` |
| `17 leftPinky`, `19 leftIndex`, `21 leftThumb` | `wrist_L` (averaged, hand orientation bias) |
| `18 rightPinky`, `20 rightIndex`, `22 rightThumb` | `wrist_R` (averaged, hand orientation bias) |
| `23 leftHip` | `hip_L` |
| `24 rightHip` | `hip_R` |
| `25 leftKnee` | `knee_L` |
| `26 rightKnee` | `knee_R` |
| `27 leftAnkle` | `ankle_L` |
| `28 rightAnkle` | `ankle_R` |
| `29 leftHeel`, `31 leftFootIndex` | `ankle_L` (foot orientation bias) |
| `30 rightHeel`, `32 rightFootIndex` | `ankle_R` (foot orientation bias) |

`root_pelvis` and `neck`/`spine_upper`/`spine_lower` are **derived bones** (not direct MediaPipe/Vision outputs) computed as midpoints: `root_pelvis = midpoint(leftHip, rightHip)`, `neck = midpoint(leftShoulder, rightShoulder)`, `spine_upper/lower` interpolated between `neck` and `root_pelvis`.

### 6.3 Pose Category → Lottie Animation File

| Pose category (PDD §7.1) | Lottie file prefix |
|---|---|
| `S` Standing | `standing_{state}.lottie` |
| `SE` Seated | `seated_{state}.lottie` |
| `LS` Leaning — Standing | `leaning_standing_{state}.lottie` |
| `LSe` Leaning — Seated | `leaning_seated_{state}.lottie` |
| `K` Kneeling | `kneeling_{state}.lottie` |
| `R` Reclining / Lying | `reclining_{state}.lottie` |
| `D` Dynamic | `dynamic_{state}.lottie` |
| `E` Eccentric / Editorial | `eccentric_{state}.lottie` |
| `C` Couple / Multi-Person | `couple_{state}.lottie` |
| `A` Accessible Variants | `{base-category}_accessible_{state}.lottie` (inherits base category's animation, adapted joint-range preset applied) |

`{state}` ∈ `{idle, enter, hold, exit}` per Section 3.1. Subcategory-level poses (e.g., `S2` S-Curve Stand) reuse their parent category's Lottie file with a pose-specific hold-frame offset, rather than requiring 300+ unique Lottie assets — consistent with the PDD's content-cost mitigation ([Section 11](product_design_document.md#11-risks--mitigations)).

### 6.4 Alignment Score Range → Halo Fragmentation Level

| Score range | Halo segments visible (of 12) | Visual description |
|---|---|---|
| 90–100 | 12 | Full solid ring, soft glow |
| 70–89 | 10 | Near-complete, 2 segments faded |
| 50–69 | 6 | Half ring, visibly fragmenting |
| 30–49 | 3 | Sparse, mostly gaps |
| 0–29 | 0 (outline only, 10% opacity) | Halo essentially dissolved |

---

## 7. Performance Budget & Optimization Plan

### 7.1 Per-Frame Budget Breakdown

Target: 60fps render loop (16.6ms budget) with inference decoupled per the PDD's non-negotiable pipeline architecture.

```
┌─────────────────────────────────────────────────────────┐
│  RENDER THREAD (must fit in 16.6ms @ 60fps / 11ms @ 90Hz)│
│                                                            │
│   Camera preview draw ............... ~2.0 ms             │
│   Lottie reference render ........... ~2.5 ms             │
│   Skeleton overlay draw (16 lines +   │
│     ~19–33 dots) ..................... ~1.5 ms             │
│   Mucha avatar skinning update +      │
│     draw (self-view mode only) ....... ~4.0 ms             │
│   HUD / decorative frame compositing . ~1.5 ms             │
│   ────────────────────────────────────────────            │
│   TOTAL (skeleton mode) .............. ~7.5 ms  (fits)    │
│   TOTAL (avatar mode) ................ ~11.5 ms (fits)    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  BACKGROUND / INFERENCE THREAD (no hard per-frame deadline,│
│  runs 15–30fps independent of render cadence)              │
│                                                            │
│   Pose model inference (BlazePose Full/Lite,               │
│     Apple Vision, or MoveNet Lightning) ... 15–45 ms       │
│   One-Euro smoothing (all joints) .......... ~0.3 ms       │
│   Alignment scoring + hint mapping ......... ~0.5 ms       │
└─────────────────────────────────────────────────────────┘
```

Avatar mode carries a real but bounded extra cost (~4ms for linear-blend-skinning across ~15 bones and their bound surface points); this is intentionally reserved headroom within the 16.6ms budget, leaving margin for HUD/compositor work and OS scheduling jitter.

### 7.2 Threading Model

| Operation | Thread |
|---|---|
| Camera frame capture | Platform camera session thread (OS-managed) |
| Pose model inference | Dedicated background thread/isolate (Flutter `Isolate`, Android coroutine/background thread, iOS `DispatchQueue` — Vision requests are already async) |
| One-Euro smoothing, alignment scoring, hint mapping | Same background thread as inference (cheap, sub-millisecond, no need to add thread-hop overhead) |
| Render loop (camera preview, Lottie, skeleton, avatar, HUD) | Main/UI thread, driven by `CADisplayLink` (iOS) / Compose frame clock (Android) / `requestAnimationFrame`-equivalent |
| Publishing inference results to render thread | Thread-safe atomic "latest result" slot — render thread never blocks waiting for a new inference result; always reads whatever is currently available |

This is a direct implementation of the PDD's mandated architecture ([Section 5.2](product_design_document.md#52-camera-pipeline-architecture-non-negotiable)) and the pre-research's central finding (§5.4): decoupling inference cadence from render cadence is what allows smooth 60fps animation even when the pose model only produces 15–30 results per second.

### 7.3 Frame Dropping Strategy

- **Frame buffer**: ring buffer, **keep-latest** — a new camera frame always overwrites the previous unprocessed one rather than queuing; inference never falls behind by processing a backlog of stale frames.
- **Render thread**: never waits on inference; if no new inference result has arrived since the last render, the render loop redraws using the last-known smoothed keypoints (the One-Euro filter's own state naturally continues to decay toward the last real observation, avoiding a visible freeze).
- **Lottie**: if a frame budget overrun is detected (measured render time exceeds ~14ms for 2 consecutive frames), temporarily downgrade Lottie `renderMode` from GPU to a cached/paused state (freeze on current loop frame) rather than dropping the skeleton/avatar layer, since the live overlay is functionally more important than the reference animation's continued looping.
- **Avatar mode**: if self-view avatar skinning consistently exceeds its 4ms budget on a given device, automatically fall back to Skeleton Lines mode for the remainder of the session (soft degradation, not a hard crash/error).

### 7.4 Low-End Device Fallback Degradation Ladder

```
Tier 0 (High-end: iPhone 15+, Pixel 8+)
  → MediaPipe BlazePose Full / Apple Vision full body pose
  → Mucha avatar mode available, full skinning + hair/drapery mesh deformation
  → All Lottie states at full frame count, GPU render mode

Tier 1 (Mid-range)
  → MediaPipe BlazePose Lite
  → Mucha avatar available but hair/drapery secondary-motion physics disabled
    (static hair/drapery pose, bones still fully driven)
  → Lottie GPU render mode, standard frame counts

Tier 2 (Low-end)
  → MoveNet Lightning INT8 (2.9MB, 17-point COCO schema mapped to internal rig)
  → Avatar mode disabled by default; Skeleton Lines mode only
  → Lottie CPU render mode; idle-loop animations only for non-active-coaching
    contexts (library browsing) — "Hold pose" during live coaching substituted
    with the static PNG fallback (Section 3.5) to save render budget for the
    live skeleton overlay, which is the functionally critical layer
  → Reduced overlay: dots only, no connecting lines, if frame budget still
    exceeded after above reductions (last-resort degradation)

Tier 3 (Below minimum spec)
  → Feature-gate camera coaching entirely; app falls back to static pose
    library browsing (F1) with instructional text only, no live overlay
```

This ladder directly operationalizes the PDD's risk mitigation for "camera performance issues on low-end Android devices" ([Section 11](product_design_document.md#11-risks--mitigations)) and its model-tiering strategy ([Section 5.5](product_design_document.md#55-model-selection-strategy)).

---

## 8. Phase 3 Retrospection

### 8.1 What lessons from expert animation system design were most useful?

1. **Pose Animator's bone-local anchor representation** (Section 4.3–4.5 of the pre-research) was the single most load-bearing technical precedent in this document. The insight that a live, ML-derived skeleton has *variable-length* bones (unlike a fixed-length game-animation rig) — and that this is solved by storing surface-point influence as a percentage-along-bone-length plus perpendicular offset, recomputed from current bone endpoints each frame — directly resolved what would otherwise have been an open design question for the Mucha avatar's deformation system (Section 2, Section 4.7).
2. **The "animate only transform/opacity" mobile performance rule** shaped nearly every rendering decision in this document, from the halo/nimbus encoding (Section 2.4, driven by opacity/dash-offset, never path rewriting) to the recommendation against per-frame path mutation in the avatar rig. This single rule is arguably the most consequential constraint carried over from the research phase into the architecture.
3. **The background-inference/foreground-render threading split**, validated independently across both the pre-research (§5.4) and the PDD's own non-negotiable pipeline mandate, gave strong convergent confidence that this is the correct architecture rather than a debatable choice — it appeared identically in general mobile-performance research and in project-specific requirements, which is a good sign the requirement is well-founded rather than arbitrary.
4. **Lottie's named-layer/KeyPath parameterization pattern** (Section 3.4) elegantly solved the "40 files vs. 160 files" problem — without it, supporting 4 alignment-score tint states per pose category would have required either baking 4x the Lottie assets or accepting visually static reference animations that don't reflect live coaching state.

### 8.2 Is the animation approach technically feasible and educationally effective?

**Feasibility:** Yes, with clear risk concentration in one area. The Lottie and skeleton-overlay systems (Sections 3–4) rest on well-proven, widely-shipped mobile patterns (Canvas/SurfaceView overlays, native Lottie runtimes) with abundant production precedent cited directly in the research. The Mucha avatar's linear-blend-skinning system (Section 2) is the highest-risk component: it requires either a full custom implementation of the Pose Animator pattern (non-trivial engineering, several weeks) or adopting Spine 2D's runtime (licensing cost, steeper mobile integration, per pre-research §1.2) — this should be flagged to engineering leadership as the one component warranting a dedicated technical spike before full production commitment, and is why the degradation ladder (Section 7.4) treats avatar mode as an enhancement layer that can be disabled per-device rather than a load-bearing requirement.

**Educational effectiveness:** The design is well-aligned with the product's core differentiation thesis. The halo-fragmentation encoding (Sections 2.4, 6.4) gives users a single, glanceable, non-numeric signal for "how close am I," which — combined with the hysteresis-gated natural-language hints (Section 5.4) — directly targets the PDD's identified "clinical sterility" problem (cold skeleton overlays + raw percentage scores) without sacrificing the accuracy of a genuine joint-by-joint scoring system underneath. The layering strategy (Section 1.2, Lottie target pose at reduced opacity beneath the live overlay) also directly answers the self-photographer persona's core frustration ("I set up my phone and then I just... stand there") by keeping the target pose visually present at all times rather than requiring the user to remember a reference shown earlier. The main open question for user testing (flagged as Low/Medium risk in the PDD) is whether the avatar mode's illustrated abstraction reduces self-consciousness as intended, or whether users in practice prefer the more literal skeleton overlay — the toggle between modes (already specified in F2) is the correct hedge against this uncertainty rather than forcing a single answer now.

---

*End of Phase 3 — Sprite & Animation System Document*
*Inputs: [research_phase3.md](research_phase3.md), [product_design_document.md](product_design_document.md)*
