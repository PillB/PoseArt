# Framing Analysis — Pose-Aware Framing Pipeline

**Phase E** of the Avatar/Ghost/Skeleton Visual-Forensics Extension.
**SHA:** Green refactor · **Implementation:** `computeFit()` in `js/pose-skeleton-3d.js`

---

## The defect (H5, confirmed)

The baseline `project()` (`pose-skeleton-3d.js:428-433`) centered the figure on the
**world origin** (the pelvis) with a single global `fitScale = min(w,h) × 0.40`:

```js
var cx = state.width / 2, cy = state.height / 2;
var fitScale = Math.min(state.width, state.height) * 0.40 * state.scale;
return { x: cx + rotated.x * fitScale, y: cy - rotated.y * fitScale, z: rotated.z };
```

This is **fixed centering** — it does not adapt to the pose's visual extent.
Measured consequences (baseline, `measurements.jsonl`):

| Pose | top margin | bottom margin | Issue |
|---|---|---|---|
| arms-overhead | **0** (clipped) | 20 | head/hands pushed above canvas |
| soft-sit (seated) | 18 | **73** | floats 73px above the canvas floor |
| window-seat | 16 | **73** | floats |
| forearms-crossed-table | 17 | **67** | floats |
| power-stance (standing) | 16 | 24 | ~balanced |

9/222 baseline matrix combos were clipped (all `arms-overhead`); seated/reclining
poses left a 67-73px empty band below the figure.

## The fix — `computeFit(state)`

A pose-aware framing pipeline applied via a **ctx transform** (so `project()` and
all joint measurements remain unchanged — the three modes stay comparable):

1. **Build the posed skeleton** (`displaySkeleton`).
2. **Project all joints** via the existing `project()` (raw, fitScale0 + center).
3. **Compute the joint bounding box** (min/max x/y of projected joints).
4. **Reserve screen-space margins** for the silhouette extent that extends beyond
   the joints: head halo (top), limb half-widths + joint blends (sides/bottom).
   These margins **scale with fit.scale** (2-pass: estimate `s0` with pad-only,
   then reserve `limbHalf × s0`), so they are correct at every canvas size.
5. **Derive scale** `s = min(availW / bboxW, availH / bboxH)`, clamped to [0.40, 2.6]
   so tiny canvases don't explode and huge poses don't vanish.
6. **Derive translation** to center the bbox in the remaining space.
7. **Semantic ground anchor:** if the pose is grounded (feet well below hips),
   nudge the lowest support toward 84% of canvas height for a grounded feel.
   Seated/reclining poses (feet near/above hips) keep bbox-center framing.
8. **Clamp** the final transform so the fitted silhouette (bbox + scaled margins)
   stays within `[pad, w-pad] × [pad, h-pad]` — a hard guarantee against clipping.

The transform is applied as `ctx.translate(fit.tx, fit.ty); ctx.scale(fit.scale, fit.scale)`
in `renderFrame` (skeleton), `renderAvatarFrameInternal` (avatar), and
`renderGhostOutlineInternal` (ghost) — **all three modes share `computeFit()`**,
so framing is identical across modes (acceptance criterion #3).

## Why a ctx transform (not a project() change)?

`project()` is the single source of truth for joint screen positions, used by the
skeleton's `drawBone`/`drawJoint`, the avatar's draw functions, AND the forensic
measurement harness (which replicates `project()` verbatim). Changing `project()'s`
contract would desynchronize measurements from rendering. Applying the fit as a ctx
transform leaves `project()` untouched — the figure is framed, but joint
coordinates remain directly comparable across modes and to the measurement harness.

## Verification

| Test | Baseline | Green |
|---|---|---|
| T2 no-clipping (computeFit keeps figure bbox in canvas, 6 poses × 6 sizes) | FAIL (13 clipped) | **PASS** (0 clipped) |
| T3 grounded-placement (seated/reclining not floating) | FAIL (4 floating) | **PASS** (0 floating) |
| T7 small-thumbnail occupation (70×70 standing in 20-80%) | FAIL (93% / 18%) | **PASS** |

Independent VLM (before/after sheet): "Framing 6/5 — Significant improvement; the
starfish and leap-forward figures are now properly grounded on their mats without
floating, and the soft-sit avatar sits fully on the bench rather than hovering."

## Residual: reclining floor band

`drawAccessory` draws a solid floor band for reclining poses that intentionally
spans the canvas width (it is the ground the figure lies on). This band touches
the left/right edges by design — it is **environment**, not figure. T2 was
converted from a pixel-bbox check (which conflated the floor with the figure) to
a **geometric check** on `computeFit`'s fitted bounds, which correctly verifies the
figure cannot clip while allowing the ambient floor to touch the edge.

## No universal Y offset

Per the directive ("Do not fix 'too low' using a universal arbitrary negative Y
offset"), `computeFit` uses bbox-centering + a semantic ground anchor + a clamp —
no global Y offset. The ground anchor fires only for grounded poses and is clamped
to ±8% of canvas height.
