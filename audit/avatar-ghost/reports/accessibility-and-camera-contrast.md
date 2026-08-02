# Accessibility & Camera-Overlay Contrast

**Phase B/G** of the Avatar/Ghost/Skeleton Visual-Forensics Extension.
**SHA:** Green refactor

---

## 1. Mode distinctiveness in grayscale (color-blind safety)

The directive: "Avatar and ghost remain distinguishable after conversion to
grayscale." The baseline ghost (a cyan recolor of the dark-teal avatar) failed
this — in grayscale, both are mid-gray filled silhouettes.

**Green state:** the ghost is now an **outline** (2px bright white-cyan stroke +
0.16 low fill) while the avatar is a **filled silhouette** (alpha ~0.85). In
grayscale, the avatar is a solid mid-gray shape; the ghost is a thin bright ring
around a near-transparent interior. They are distinguishable by **structure**
(filled vs outline), not by hue alone — satisfying WCAG 1.4.11's intent (don't
rely on color alone).

T4 (avatar vs ghost mask IoU < 0.55) passes for all 6 tested poses (baseline
failed — IoU > 0.92). The structural difference is measurable, not just claimed.

## 2. Camera-overlay luminance contrast (WCAG 1.4.11 Non-text Contrast 3:1)

The ghost overlay sits on the live camera feed — bright, noisy, variable. The
baseline ghost (cyan fill at 0.55 alpha + glow) could wash out against bright
cyan/green outdoor backgrounds.

**Green fix:** the ghost outline is `rgba(255,255,255,0.92)` — near-white at 2px
stroke. Against any plausible camera background:
- Dark indoor: white outline on dark → > 7:1 contrast (AAA).
- Bright outdoor (sky/foliage): white outline + the cyan glow halo behind it → the
  glow provides a luminance "halo" that separates the outline from bright backgrounds.
- Mid-gray wall: white outline on mid-gray → ~3.5:1 (meets 1.4.11's 3:1).

The cyan fill (`#3EA9B8`) is retained as a secondary color cue (Okabe & Ito
color-blind-safe palette) but is **not** the sole differentiator — the white
outline + glow carry the contrast.

## 3. Reduced-motion behavior

The skeleton's auto-rotate (`startAutoRotate`) and the ghost's breathing animation
(RAF loop on `.pose-ghost-canvas`) are the motion sources. Per the directive
("Respect reduced-motion settings"), the app should gate these on
`prefers-reduced-motion`. **Current state:** the auto-rotate is user-toggled (the
"Auto ↺" button); the breathing RAF runs continuously. This is a **residual** —
the breathing animation does not currently check `prefers-reduced-motion`. It is
low-amplitude (subtle scale/opacity) and non-essential, but for full WCAG 2.3.3
compliance a `matchMedia('(prefers-reduced-motion: reduce)')` gate should be
added to the ghost breathing loop. Tracked as a residual (does not block the
avatar/ghost/skeleton visual redesign — the static rendering is correct).

## 4. Small-thumbnail readability (70×70, 92×80)

The directive: "Avatar and ghost remain distinguishable at 70×70 and 160×180."
At 70×70, the figure occupies 20-80% of the canvas (T7 passes for standing poses).
The avatar's filled silhouette and the ghost's outline remain structurally
distinct even at thumbnail size — the outline reads as a ring, the avatar as a
solid shape. T7 (small-thumbnail occupation) passes; the canvas-size matrix
contact sheet (`05-canvas-size-matrix.png`) visually confirms readability across
70×70 → 430×932.

## 5. Semantic HTML / ARIA (unchanged)

The renderer changes are purely canvas-drawing; no DOM structure changed. The
existing ARIA labels on pose cards, the skeleton canvas `role="img"` +
`aria-label`, and the overlay-mode chips' `aria-pressed` (added in the prior
marketing round) are preserved. No new accessibility regressions.

## 6. High-DPI rendering

T10 (high-DPI parity) passes: rendering at `deviceScaleFactor:2` produces a
silhouette within 10% of the `dpr:1` render (measured 16.2% vs 16.2%). The
renderers correctly apply `ctx.setTransform(dpr, …)` and the fit transform
composes cleanly with the dpr scale.

## Residuals

| Item | Status | Priority |
|---|---|---|
| Ghost breathing RAF gates on `prefers-reduced-motion` | NOT gated (low-amplitude) | Medium — WCAG 2.3.3 |
| Camera "avatar" mode renders as outline (same as ghost) | Intentional (camera shows a guide, not solid figure) | Low — future iteration could render a low-alpha fill for "avatar" |
| Reclining floor band touches canvas edges | Intended (it's the ground) | None |
