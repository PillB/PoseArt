# Forensic Findings — Avatar / Ghost / Skeleton

**Phase B** of the Avatar/Ghost/Skeleton Visual-Forensics Extension.
**SHA:** `7a3a823` · **Evidence:** `audit/avatar-ghost/baseline/` (252 raw + 450 overlay images, 258 measurements, 5 contact sheets) + independent VLM review.

Each of the 9 hypotheses is **verified or rejected** using current-SHA images and
measurements. No hypothesis was accepted on intuition.

---

## Summary verdict table

| # | Hypothesis | Verdict | Primary evidence |
|---|---|---|---|
| H1 | Repeated endpoint circles at shared joints make the avatar look swollen | **VERIFIED** | `pose-skeleton-3d.js:1733-1739` + joint-touch table (neck=4, shoulders/hips=3) + VLM "visible swollen knots or balls" |
| H2 | Proximal limb-width multipliers are too large | **VERIFIED** | `pose-skeleton-3d.js:1715` (`*1.5`/`*1.3`) + `BONE_WIDTHS` spine-hips=[11,8] + VLM "massive and heavy" |
| H3 | Torso minimum widths create excessive mass at small preview sizes | **VERIFIED** | `pose-skeleton-3d.js:1652-1654` `Math.max(hipW,12)` + occupation 18-67% range |
| H4 | The hourglass torso construction is too overtly gendered | **VERIFIED** | `pose-skeleton-3d.js:1654` `waistW=hipW*0.65` + comment "Feminine waist taper" |
| H5 | Fixed center projection causes the avatar to appear too low or inconsistently framed | **VERIFIED** | `project()` L428-433 fixed `cx=w/2,cy=h/2` + 9 clipped arms-overhead + seated floats (soft-sit top=18/bottom=73) |
| H6 | Avatar, skeleton, ghost compared with different yaw/pitch/scale/canvas | **VERIFIED** | path map §2: avatar yaw=0, ghost yaw=20, skeleton category-specific; controlled matrix proves bbox is identical when normalized |
| H7 | Ghost lacks a unique role because it reuses the avatar silhouette | **VERIFIED** | `renderGhostFrame` L1523 calls `renderAvatarFrameInternal` with `ghostMode=true` + VLM "recolored and translucent copy" |
| H8 | Current smoke tests verify execution but not visual correctness | **VERIFIED** | `tests/` contains no image/geometry assertions; only `geometry-sweep.js` claim checks (no silhouette/framing/joint checks) |
| H9 | Different surfaces render the same mode differently | **VERIFIED** | `camera.js:186` renders `avatar` via `renderGhostFrame` (same as ghost); `app.js:448` renders session "avatar" as legacy SVG glyph |

**All 9 hypotheses VERIFIED.** None rejected.

---

## H1 — Repeated endpoint circles at shared joints (VERIFIED)

### Code
`renderAvatarFrameInternal` (`pose-skeleton-3d.js:1733-1739`), inside the per-bone
loop, draws a filled capsule then **two endpoint circles** — one at each end of
every bone — regardless of whether that joint is shared:

```js
ctx.beginPath(); ctx.arc(pa.x, pa.y, wA, 0, Math.PI*2); ctx.fill();  // bone start
ctx.beginPath(); ctx.arc(pb.x, pb.y, wB, 0, Math.PI*2); ctx.fill();  // bone end
```

### Measurement (joint-touch count from `BONES`)
| Joint | Bones touching | Overlapping circles drawn |
|---|---|---|
| neck | head-neck, neck-spine, neck-leftShoulder, neck-rightShoulder | **4** |
| leftShoulder | neck-leftShoulder, leftShoulder-rightShoulder, leftShoulder-leftElbow | **3** |
| rightShoulder | (mirrored) | **3** |
| hips | spine-hips, hips-leftHip, hips-rightHip | **3** |
| leftHip / rightHip | (3 each) | **3** |
| spine, elbows, knees, ankles | (2 each) | **2** |

The neck is the worst: 4 overlapping circles of unequal radius (head-neck
`wA=7`, neck-spine `wA=9`, neck-shoulder `wA=8`) stack into a thick cylindrical
mass. Shoulders and hips get 3 circles each of the **inflated proximal width**
(see H2), producing the "ball" read.

### Independent VLM confirmation
> "The joints show **visible swollen knots or balls**. The shoulders, elbows,
> hips, and knees are rendered as prominent, rounded protrusions rather than
> smooth transitions, giving the figure a disjointed, almost robotic or
> 'doll-like' appearance." — VLM on `01-mode-comparison-front.png`

### Images
`baseline/overlays/{pose}__avatar__front__160x180_joints.png` (6 overlay poses) —
the projected-joint dots cluster visibly at neck/shoulders/hips.

---

## H2 — Proximal limb-width multipliers too large (VERIFIED)

### Code
`BONE_WIDTHS` (`pose-skeleton-3d.js:96-120`) sets wide proximal widths:
`spine-hips=[11,8]`, `hips-leftHip=[9,7]`, `leftHip-rightHip=[10,8]`,
`neck-spine=[9,7]`. Then `renderAvatarFrameInternal:1715` applies an additional
**inflation multiplier**:

```js
var wA = depthToWidth(pa.z, widths[0]) * (isLimb ? 1.3 : 1.5);  // proximal end
var wB = depthToWidth(pb.z, widths[1]) * (isLimb ? 0.7 : 1.2);  // distal end
```

So a non-limb proximal end (torso/hip/clavicle) gets `widths[0] × depth × 1.5`.
For `hips-leftHip` that is `9 × ~1.0 × 1.5 ≈ 13.5px` radius — and the endpoint
circle (H1) is drawn at that radius, then **overlapped by 2 more circles** at the
same joint.

### Measurement
Avatar silhouette % (front, 160×180): median **15.4%**, but the figure reads
"massive" because the mass is **localized** at joints rather than distributed.
Skeleton, despite a higher silhouette % (37.3% — bones + circles + ellipses
spread over more area), reads as "graceful and slender" because its joints are
single small circles, not stacked.

### VLM
> "The silhouette is **massive and heavy**. Due to the lack of tapering in the
> limbs and the bulky nature of the torso and limbs, the overall form feels dense
> and grounded rather than light or graceful."

---

## H3 — Torso minimum widths create excessive mass at small sizes (VERIFIED)

### Code
`renderAvatarFrameInternal:1651-1654`:
```js
shoulderW = Math.max(shoulderW, 10);   // floor 10px
hipW = Math.max(hipW, 12);             // floor 12px
var waistW = Math.max(hipW * 0.65, 7); // floor 7px
```

At small canvases (70×70, 92×80) the projected shoulder/hip widths collapse
toward zero (the rig's shoulders are ~0.44 model units apart → at 70px canvas,
`fitScale = 70×0.40 = 28`, shoulder span ≈ 0.44×28 ≈ 12px, halved to 6px — below
the 10px floor). The floors then **dominate**, forcing the torso to a fixed
minimum mass that doesn't scale with the canvas. Result: at 70×70 the torso
occupies a disproportionate fraction of the canvas.

### Measurement
Occupation range across the size matrix (avatar, front): **18.3% – 66.6%**. A
4× range means the figure is sometimes tiny (18%, lost in canvas) and sometimes
overstuffed (67%, clipped). A pose-aware scale would hold occupation in a tighter
band (target 35-55%, see framing-analysis.md).

---

## H4 — Hourglass torso too overtly gendered (VERIFIED)

### Code
`renderAvatarFrameInternal:1630-1684`, with the comment block at L1630-1636:
```js
// --- Feminine silhouette rendering (Art Nouveau inspired) ---
// Key proportions from research:
// - Waist: ~70% of hip width (hourglass)
// - Hips broader than shoulders
```
and L1654:
```js
var waistW = Math.max(hipW * 0.65, 7); // Feminine waist taper
```

The torso path (L1660-1674) explicitly curves **in** to `waistW` at the spine
y, then **out** to `hipW` at the hip y — a literal hourglass. The hip floor
(12) exceeds the shoulder floor (10), so "hips broader than shoulders" is
enforced even when the rig's actual shoulder span exceeds its hip span (e.g.
broad-shoulder standing poses).

This is the exact "feminine = waist+hip exaggeration" the extension forbids:
"Do not interpret 'more feminine' as permission to add … exaggerated hips …
extreme waist … sexualized proportions." The current avatar violates this.

### Fix direction
Replace `waistW = hipW*0.65` with a **structural** waist derived from the rig:
`waistW = 0.5×(ribcageW + pelvisW) − small_taper`, ribcage:pelvis held at
1.00-1.05:1 (androgynous neutral). See `prototype-comparison.md` Candidate 3 and
research-ledger.md directive D5.

---

## H5 — Fixed center projection causes poor framing (VERIFIED)

### Code
`project()` (`pose-skeleton-3d.js:428-433`):
```js
function project(state, point) {
  var rotated = applyCamera(point, state.yaw, state.pitch);
  var cx = state.width / 2, cy = state.height / 2;            // FIXED center
  var fitScale = Math.min(state.width, state.height) * 0.40 * state.scale;  // FIXED scale
  return { x: cx + rotated.x * fitScale, y: cy - rotated.y * fitScale, z: rotated.z };
}
```

The figure is centered on the **world origin** (0,0,0) — the pelvis — not on its
own visual bounding box. `fitScale` is a single global constant; it does not
adapt to the pose's extent.

### Measurement — clipping
**9 / 222** matrix combos clipped, **all** `arms-overhead` (3 modes × 3 views):
`bbox.y = -11` (figure extends 11px above canvas top). The upstretched arms push
the head/hands above the canvas because the pelvis-centered projection doesn't
account for the raised extremities.

### Measurement — vertical placement (avatar, front)
| Pose | top margin | bottom margin | Issue |
|---|---|---|---|
| power-stance (standing) | 16 | 24 | ~balanced |
| scurve-stand (standing) | 20 | 23 | ~balanced |
| arms-overhead (standing) | **0** | 20 | **clipped top** |
| soft-sit (seated) | 18 | **73** | floats high — 73px empty below |
| window-seat (seated) | 16 | **73** | floats high |
| forearms-crossed-table (seated) | 17 | **67** | floats high |

Seated poses leave a **73px empty band** below the figure because their joints
cluster in the upper canvas (the seat/legs don't extend down in the same way
standing feet do), and the fixed centering places the pelvis at canvas-center
regardless. The figure appears to float above an invisible ground.

### Fix direction
Pose-aware framing pipeline (Phase E): build skeleton → project all points →
compute visual bbox (incl. head halo + foot/prop radii) → derive scale from
bbox × padding → derive translation from fitted bounds. Respect semantic anchors
(ground for standing, seat for seated, full bounds for reclining). Do **not** use
a universal Y offset.

---

## H6 — Modes compared at different yaw/pitch/scale/canvas (VERIFIED)

### Production divergence (path map §2)
| Surface | Renderer | Yaw | Pitch | Canvas |
|---|---|---|---|---|
| Library/category/home/marketplace/next-pose thumbnail | renderAvatarFrame | 0 | 0 | CSS-sized |
| Session ghost preview | renderGhostFrame | **20** | **5** | 160×180 |
| Pose-detail skeleton | renderFrame | category-specific | category-specific | responsive + auto-rotate |
| Pose editor avatar | renderAvatarFrame | 0 | 0 | 140×180 |
| Camera avatar/ghost | renderGhostFrame | 20 (mirrored) | 5 | 430×932 |

The same pose is rendered at **3+ different yaws** depending on which surface the
user sees. A reviewer comparing the library thumbnail (yaw 0) to the session
ghost (yaw 20) is comparing different silhouettes, not different modes.

### Controlled matrix proof (this baseline)
When all three modes are rendered at **identical** yaw/pitch/scale/canvas (this
harness), the projected bounding box is **identical across modes**:

| power-stance, quarter view | occupation | silhouette % | bbox |
|---|---|---|---|
| avatar | 38.5% | 13.8% | 79×140 |
| skeleton | 38.5% | 36.8% | 79×140 |
| ghost | 38.5% | 22.2% | 79×140 |

Same bbox (79×140) ⇒ the framing math is shared; the production divergence is
purely an **options-passing** problem, fixable without touching `project()`.

---

## H7 — Ghost lacks a unique role (VERIFIED)

### Code
`renderGhostFrame` (`pose-skeleton-3d.js:1479-1525`) builds a transient state
with `state.ghostMode = true; state.avatarMode = true;` (L1511-1512) and calls
`renderAvatarFrameInternal(state)` (L1523). The comment at L1520-1522:
"Use the avatar silhouette renderer with ghost colors (translucent silhouette,
not a wireframe skeleton in cyan)."

So the ghost is **literally** the avatar silhouette, recolored cyan, at 0.55
alpha, with a `shadowBlur=14` glow and a screen-blend radial gradient. No unique
geometry, no unique function beyond "avatar but translucent".

### Distinctiveness measurement
At equivalent framing, avatar and ghost have **identical bbox** (H6 table). The
silhouette % differs (13.8% vs 22.2%) only because the ghost's glow halo adds
semi-transparent pixels — the **shape** is the same. Converting both to grayscale
(Phase C test #8) leaves them distinguishable only by density, not by role.

### VLM
> "It is visually distinct, though it shares the same underlying geometry. It is
> essentially a **recolored and translucent copy** of the base form, lacking the
> high-contrast solidity of the avatar column."

### Required test (Phase G)
"Without reading the label, identify which guide is Avatar, Skeleton, and Ghost,
and explain what each is useful for." The ghost fails this: its only differentiator
from the avatar is color+alpha, which is exactly what a "recolored copy" is.
Phase G evaluates 3 options (outline-target / motion-echo / remove).

---

## H8 — Smoke tests verify execution, not visual correctness (VERIFIED)

### Current test inventory
`tests/` contains no image, geometry, or framing assertions. The only automated
checks are:
- `audit_harness/geometry-sweep.js` — 23 claim-type detectors (anatomical
  plausibility from joint angles), no rendering checks.
- `audit_harness/forensic-pose.js` — captures front/side/quarter + geometry.json
  per pose, but **asserts nothing** about the images (it only writes files).
- `audit_harness/smoke-soft-sit.js` — runs the UI procedure, checks no errors.

No test would fail if the avatar became a solid black rectangle, or if joints
doubled in size, or if the ghost rendered as the skeleton. The renderer is
**untested for visual correctness**.

### Fix direction
Phase C Red tests: joint-inflation detector, clipping detector, placement
detector, mode-distinctiveness check, bounds calculator, full-library smoke with
image-diff + geometric properties. None may be a pure pixel snapshot.

---

## H9 — Different surfaces render the same mode differently (VERIFIED)

### Code
Two material inconsistencies:

1. **"avatar" in the camera = ghost.** `camera.js:186`:
   ```js
   if (this.overlayMode !== 'ghost' && this.overlayMode !== 'avatar') return;
   ```
   Both `ghost` and `avatar` proceed to `renderGhostFrame` (L206). The user
   selecting "avatar" in the camera gets a cyan translucent ghost — not the
   dark-teal filled avatar they see in thumbnails.

2. **"avatar" on the session chip = legacy SVG glyph.** `app.js:448-449`:
   ```js
   // 'avatar' or any unknown mode → SVG glyph
   figEl.innerHTML = renderPoseFigureSVG(pose, false);
   ```
   The session-setup "avatar" preview is the **legacy SVG glyph** path, not the
   procedural `renderAvatarFrame`. Meanwhile the session "ghost" preview is the
   procedural `renderGhostFrame`. So even within one screen, the two modes use
   two different rendering systems.

### Result
The label "avatar" means three different things on three surfaces. This is the
strongest possible form of H9 and directly violates acceptance criterion #3.

---

## Cross-cutting: the "blob" is localized joint mass, not total area

A nuance the measurements reveal: the avatar's **total** silhouette area
(15.4%) is *lower* than the skeleton's (37.3%), yet the avatar reads as "massive"
while the skeleton reads as "graceful". The blob perception is therefore **not**
a global-area problem — it is a **local joint-density** problem: the avatar
concentrates mass at joints (4 overlapping neck circles, 3 at each shoulder/hip),
while the skeleton distributes area along thin bones. This is why H1 (not H2
alone) is the dominant defect, and why the fix must **eliminate overlapping
endpoint circles** rather than merely shrink widths.

---

## Evidence index

| Claim | Image / file |
|---|---|
| Blob at avatar joints | `baseline/contact-sheets/01-mode-comparison-front.png` col 1 |
| Skeleton is graceful | same sheet col 2 |
| Ghost = recolored avatar | same sheet col 3; `04-ghost-vs-avatar-silhouette.png` |
| Joint dot clusters | `baseline/overlays/*_avatar_front_160x180_joints.png` |
| Clipping (arms-overhead) | `baseline/overlays/arms-overhead__avatar__front__160x180_bbox.png` (`bbox.y=-11`) |
| Floating seated figure | `baseline/overlays/soft-sit__avatar__front__160x180_bbox.png` (top=18, bottom=73) |
| Canvas-size mass | `baseline/contact-sheets/05-canvas-size-matrix.png` |
| All measurements | `baseline/measurements.jsonl` (258 rows), `baseline/manifest.csv` |
| VLM transcript | `audit/avatar-ghost/reports/vlm-review.md` (appended) |
