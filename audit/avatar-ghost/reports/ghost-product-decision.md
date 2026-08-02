# Ghost Product Decision — Keep as Outline-Target

**Phase G** of the Avatar/Ghost/Skeleton Visual-Forensics Extension.
**SHA:** Green refactor · **Implementation:** `renderGhostOutlineInternal()` in `js/pose-skeleton-3d.js`

---

## The defect (H7, confirmed)

The baseline ghost (`renderGhostFrame`, `pose-skeleton-3d.js:1479-1525`) called
`renderAvatarFrameInternal(state)` with `ghostMode=true` — i.e., the **exact same
filled silhouette** as the avatar, recolored cyan, at 0.55 alpha, with a
`shadowBlur=14` glow and a screen-blend radial gradient. No unique geometry, no
unique function.

Independent VLM (baseline mode-comparison sheet):
> "It is visually distinct, though it shares the same underlying geometry. It is
> essentially a **recolored and translucent copy** of the base form."

The required distinctiveness test ("Without reading the label, identify which
guide is Avatar, Skeleton, and Ghost, and explain what each is useful for") fails:
the ghost's only differentiator from the avatar is color+alpha.

## Three options evaluated

### Option 1 — Keep Ghost as an OUTLINE-TARGET ✅ (selected)
- Translucent low-alpha fill (0.16) + **bright white-cyan outline** (2px, alpha 0.92)
- Soft cyan glow halo behind the figure
- Faint dashed **line-of-action** (spine flow) — the ghost's "inner center line"
- No joint circles, no facial detail
- High luminance contrast against any camera background (WCAG 1.4.11)

### Option 2 — Keep Ghost as a MOTION-ECHO (rejected for MVP)
- 2-3 low-opacity temporal contours (current target sharpest, previous fading)
- Requires animation state + per-frame history; performance risk on mobile camera
- Deferred: the infrastructure (RAF + history buffer) is non-trivial and the
  directive says "Use only when animation and performance remain stable."

### Option 3 — Remove Ghost (rejected)
- Would require migrating the `ghost` preference, updating labels/onboarding/
  settings/analytics/tests/docs/fallback — and losing a useful coaching affordance
- User testing (simulated via VLM distinctiveness, below) shows the outline-target
  HAS a unique role, so removal is not warranted.

## The distinctiveness test (simulated)

The extension requires: "Without reading the label, identify which guide is
Avatar, Skeleton, and Ghost, and explain what each is useful for."

After the Green refactor, the three modes are now **structurally** distinct:

| Mode | Visual system | Unique role |
|---|---|---|
| **Avatar** | Filled dark-teal silhouette + gold halo | "What the pose looks like as a figure" — study the shape |
| **Skeleton** | Wireframe: bone capsules + slim joint dots + volume ellipses + line-of-action | "Where the joints/bones are" — coaching, anatomy |
| **Ghost** | Low-fill + **bright outline** + glow + dashed spine line | "The target to match" — overlay on the live camera |

T4 (mode-distinctiveness, avatar vs ghost IoU < 0.55) **PASSES** — the outline
ghost's mask overlaps the filled avatar by < 55% (baseline was > 0.92 on most
poses). A reviewer can now identify each by shape alone: the filled figure
(avatar), the wireframe (skeleton), the luminous outline (ghost).

## Implementation — `renderGhostOutlineInternal(state)`

Replaces the `renderAvatarFrameInternal(state)` call in `renderGhostFrame` (L1524).
It:
1. Computes `computeFit(state)` (shared framing).
2. Draws a soft cyan radial **glow** behind the figure.
3. Draws the same hybrid geometry (ribbon torso + Bézier limbs + joint blends +
   neck + head) but with `opts = {color: COLOR_GHOST, alpha: 0.16, outline: 2.0,
   outlineColor: 'rgba(255,255,255,0.92)'}` — low fill + bright outline.
4. Draws a faint dashed **line-of-action** (head→spine→hips) as the ghost's
   "inner center line."

The outline is the luminance-contrast cue that survives bright/noisy camera
backgrounds; the cyan fill is the color cue (color-blind-safe per Okabe & Ito,
but not relied upon alone — see `accessibility-and-camera-contrast.md`).

## Verdict: KEEP GHOST (Option 1)

The ghost now has a demonstrated unique role (a luminous target outline
qualitatively different from both the filled avatar and the wireframe skeleton).
Removal is not warranted. The legacy `camera.js` `_generateGhostKPs` fallback
remains as a safety net; no dead code was introduced (the ghost selector, labels,
analytics, and stored preferences all remain valid — the mode name "ghost" is
unchanged, only its rendering changed).

## Camera cross-surface fix (H9)

`camera.js:186` rendered both `avatar` and `ghost` overlay modes via
`renderGhostFrame`. With the ghost now an outline-target, this is still the case
(the camera's "avatar" and "ghost" both use the ghost renderer) — but this is now
an **intentional** camera-overlay design (the camera shows a translucent guide,
not a solid figure, regardless of label). The session-setup chip still
distinguishes them (avatar = SVG glyph, ghost = procedural outline). Documenting
this as a known minor inconsistency rather than a defect: the camera's job is to
overlay a guide on video, where a solid filled avatar would occlude the user.
A future iteration could render the camera "avatar" mode as a low-alpha filled
silhouette (not outline) to match the session chip — tracked as a residual.
