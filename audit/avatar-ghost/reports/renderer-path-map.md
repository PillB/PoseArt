# Renderer-Path Map — Avatar / Ghost / Skeleton

**Phase A** of the Avatar/Ghost/Skeleton Visual-Forensics Extension.
**SHA:** `7a3a823` (master, PR #20 merged) · **Captured:** 2026-08-02 · **Author:** visual-forensics lead

This document traces every code path that can display an Avatar, Skeleton, Ghost,
legacy SVG, or fallback placeholder, per the extension's Phase A requirement. It
is the basis for the cross-surface consistency test (acceptance criterion #3) and
the mode-distinctiveness test (criterion #12).

---

## 1. The three procedural renderers

All three live in `js/pose-skeleton-3d.js` and derive from the **same** forward-
kinematics pipeline (`buildPose(joints)` → `applyCamera()` → `project()`), per the
Part A.10 rule #4 "all three renderers must derive from the same procedural rig".

| Renderer | Entry point | Internal draw fn | Mode flag | Visual system |
|---|---|---|---|---|
| **Skeleton** | `PoseSkeleton3D#init` + `setPose` + `render` (instance) | `renderFrame(state)` @ L1126 | `ghostMode=false, avatarMode=false` | Wireframe: tapered bone capsules (`drawBone` L493) + joint circles (`drawJoint` L577) + subtle ribcage/pelvis ellipses (`drawTorsoVolume` L1042, `drawPelvisVolume` L1104) + line-of-action (L1013) |
| **Avatar** | `PoseSkeleton3D.renderAvatarFrame(canvas,w,h,joints,opts)` @ L1551 | `renderAvatarFrameInternal(state)` @ L1596 | `ghostMode=false, avatarMode=true` | Filled silhouette: shaped hourglass torso (L1640-1684) + tapered limb capsules with **endpoint circles at both ends of every bone** (L1733-1739) + oval head + gold halo + gold eyes |
| **Ghost** | `PoseSkeleton3D.renderGhostFrame(canvas,w,h,joints,opts)` @ L1479 | `renderAvatarFrameInternal(state)` @ L1596 | `ghostMode=true, avatarMode=true` | **Same as Avatar** with `avatarColor=COLOR_GHOST` (#3EA9B8 cyan), `avatarAlphaBase=0.55`, + per-bone `shadowBlur=14` glow (L534-537) + water-highlight stroke (L566-573) + screen-blend radial glow (L1798-1812) |

**Critical finding (H7):** `renderGhostFrame` (L1523) literally calls
`renderAvatarFrameInternal(state)` with `state.ghostMode=true`. The ghost is the
**avatar silhouette** with a color/alpha/glow swap — no unique geometry, no unique
role. See `ghost-product-decision.md`.

**Critical finding (H1):** `renderAvatarFrameInternal` L1733-1739 draws
`ctx.arc(pa.x,pa.y,wA)` and `ctx.arc(pb.x,pb.y,wB)` for **every** bone. Shared
joints therefore accumulate overlapping endpoint circles:

| Joint | Bones touching it | Overlapping endpoint circles drawn |
|---|---|---|
| neck | head-neck, neck-spine, neck-leftShoulder, neck-rightShoulder | **4** |
| leftShoulder / rightShoulder / hips / leftHip / rightHip | 3 each | **3** |
| spine, elbows, knees, ankles | 2 each | **2** |

Source: `BONES` table (L47-68) cross-referenced with the per-bone `arc()` calls.
This is the root cause of the "swollen knot" appearance confirmed by independent
VLM review (§4 of `forensic-findings.md`).

---

## 2. Surface → renderer map

Every application surface that can display a figure, traced through `js/app.js`
and `js/camera.js`. "Calling function" is the exact site; "Fallback" is what
renders if the procedural path throws.

### 2.1 Pose-library thumbnail
- **Calling function:** `renderPoseCard` → `renderPoseFigureSVG(pose, false)` (`app.js:1422`)
- **Renderer:** `renderPoseFigureSVG` (`app.js:1637`) delegates to `PoseSkeleton3D.renderAvatarFrame` (`app.js:1705`)
- **Canvas dims:** CSS-sized `<canvas class="pose-list-thumb">` (≈ thumbnail cell)
- **Yaw/Pitch/Scale:** `yaw=0, pitch=0, scale=1` (default opts, `pose-skeleton-3d.js:1579-1580`)
- **Props:** yes (category-driven `drawAccessory`)
- **Fallback:** legacy SVG glyph (`app.js:1696` try/catch → `renderPoseFigureSVG` legacy branch)

### 2.2 Category-list thumbnail
- **Calling function:** `renderCategoryPoseItem` → `renderPoseFigureSVG(pose, false)` (`app.js:637`)
- **Renderer:** `renderAvatarFrame` (via delegate)
- **Yaw/Pitch/Scale:** `0, 0, 1`
- **Fallback:** legacy SVG glyph

### 2.3 Home featured pose
- **Calling function:** `renderHomeFeatured` → `renderPoseFigureSVG(pose, true)` (`app.js:546`) (`large=true`)
- **Renderer:** `renderAvatarFrame`
- **Yaw/Pitch/Scale:** `0, 0, 1`
- **Fallback:** legacy SVG glyph

### 2.4 Pose detail / session skeleton (interactive)
- **Calling function:** `openPoseDetail` → `_activeSkeleton3D.init(canvas, cw, ch)` + `setPose(joints, {category, description})` (`app.js:1278-1287`)
- **Renderer:** `renderFrame` (skeleton wireframe) via the instance RAF loop
- **Canvas dims:** `#pose-skeleton-3d-canvas` responsive (cw/ch from container)
- **Yaw/Pitch:** **category-specific** (`app.js:1293-1300`):
  - kneeling → `setViewAngle(15, -10)`
  - reclining → `setViewAngle(20, 25)`
  - leaning/lean-seat → `setViewAngle(10, 15)`
  - default → `setViewAngle(0, 0)`
- **Auto-rotate:** **ON** (`startAutoRotate()` L1303) — figure spins continuously
- **Props:** yes
- **Fallback:** none (canvas stays blank if init throws — no try/catch)

### 2.5 Session-setup overlay-mode preview
- **Calling function:** `setOverlayMode(mode)` (`app.js:374-449`)
- **Per mode:**
  - `avatar` → `renderPoseFigureSVG(pose, false)` legacy SVG glyph (`app.js:448-449`) — **NOT** the procedural avatar
  - `skeleton` → no preview rendered (the chip only sets `cameraEngine.setOverlayMode`) (`app.js:405`)
  - `ghost` → `PoseSkeleton3D.renderGhostFrame(c, 160, 180, joints, {yaw:20, pitch:5, scale:1})` (`app.js:424-426`)
  - `off` → hint text only (`app.js:443-446`)
- **Inconsistency (H6/H9):** the session-setup "avatar" preview is a **legacy SVG glyph**, the "ghost" preview is a **procedural canvas at yaw=20**, and "skeleton" has no preview at all. The three modes are rendered by three different visual systems at three different views.

### 2.6 Pose editor
- **Calling function:** `renderEditorPreview` (`app.js:2035-2059`)
- **Avatar canvas:** `PoseSkeleton3D.renderAvatarFrame(canvas, 140, 180, joints, {yaw:0, pitch:0})` (`app.js:2037`)
- **Skeleton canvas:** `_editorSkelInstance.render()` (`app.js:2059`) — a separate `init`'d instance showing the wireframe
- **Both render simultaneously** side-by-side. Yaw/Pitch not synced to a common control — each tracks its own `_editorSkelInstance` state.

### 2.7 Ghost preview (session-setup, separate from §2.5)
- Already covered in §2.5 (`renderGhostFrame` at 160×180, yaw=20, pitch=5).

### 2.8 Gallery simulation item
- **Calling function:** `renderGallerySim` → `renderPoseFigureSVG(POSES_LIBRARY[item.poseId], false)` (`app.js:934`, `app.js:1228`)
- **Large variant:** `renderPoseFigureSVG(..., true)` (`app.js:1174`)
- **Renderer:** `renderAvatarFrame`
- **Yaw/Pitch/Scale:** `0, 0, 1`

### 2.9 Next-pose preview (during session)
- **Calling function:** `renderNextPose` → `renderPoseFigureSVG(chosen, false)` / `renderPoseFigureSVG(pose, false)` (`app.js:1780`, `app.js:1789`)
- **Renderer:** `renderAvatarFrame`
- **Yaw/Pitch/Scale:** `0, 0, 1`

### 2.10 Camera overlay (live session)
- **Calling function:** `CameraEngine.drawOverlay` → `setOverlayMode(mode)` (`camera.js:27`, `camera.js:495`)
- **Per mode (`camera.js:186`):**
  - `ghost` → `PoseSkeleton3D.renderGhostFrame(canvas, w, h, joints, {yaw:20 (mirrored), pitch:5, scale: ~0.7 viewport})` (`camera.js:206`)
  - `avatar` → **also** `renderGhostFrame` (`camera.js:186` gate: `if (overlayMode !== 'ghost' && overlayMode !== 'avatar') return;`) — **avatar and ghost render identically in the camera**
  - `skeleton` → user's live skeleton keypoints (MediaPipe) — NOT a PoseSkeleton3D render
  - `off` → nothing
- **Critical finding (H9):** in the camera, `avatar` and `ghost` are the **same** `renderGhostFrame` call. The user selecting "avatar" in the camera gets a cyan translucent ghost, not the dark-teal filled avatar. This is a material cross-surface inconsistency: the same label ("avatar") means different things on the session-setup chip (legacy SVG) vs. the camera (procedural ghost).

### 2.11 Marketplace pose preview
- **Calling function:** marketplace card → `renderPoseFigureSVG(pose, false)` (via shared card renderer)
- **Renderer:** `renderAvatarFrame`
- **Yaw/Pitch/Scale:** `0, 0, 1`

### 2.12 Tour editor / tour session
- **Tour editor pose pick:** `renderPoseFigureSVG` → `renderAvatarFrame`
- **Tour session live pose:** uses the same `_activeSkeleton3D` interactive path as §2.4 (skeleton wireframe, category yaw, auto-rotate)

---

## 3. Legacy SVG / fallback paths

`renderPoseFigureSVG(pose, large)` (`app.js:1637`) is the central delegate. Its
contract (per `app.js:1649` comment): "delegates to `PoseSkeleton3D.renderAvatarFrame`".
The legacy SVG glyph branch is kept as a try/catch fallback (`app.js:1696`).

A **separate** legacy ghost exists in `camera.js`: `_generateGhostKPs` +
`drawLegacyGhost` (`camera.js:234-288`), a fixed canonical standing stick-figure
with sin(θ) limb offsets. It is the fallback when `renderGhostFrame` throws
(`camera.js:229`). It does **not** match the posed figure (it always draws a
standing person) — documented as the pre-PR-2 architectural drift.

---

## 4. MutationObserver / dynamic-render paths

No `MutationObserver`-driven figure rendering was found. All figure canvases are
rendered imperatively on: (a) card render, (b) screen show, (c) RAF loop
(skeleton instance + ghost breathing animation via `pose-ghost-canvas` class),
(d) editor slider input. The breathing animation re-invokes `renderGhostFrame`
per frame for ghost-classed canvases.

---

## 5. Cross-surface consistency verdict

**FAIL** (acceptance criterion #3 — "Avatar, skeleton, and ghost use comparable
framing when compared" / "A renderer may stylize contour but may not change pose
semantics"):

1. **"avatar" means 3 different things:** legacy SVG glyph (session-setup chip),
   procedural dark-teal silhouette (thumbnails/editor), procedural cyan ghost
   (camera). Same label, three visual systems.
2. **View is not normalized across modes:** avatar thumbnails yaw=0, ghost
   preview yaw=20, skeleton detail category-specific yaw + auto-rotate. The
   three modes are never compared at the same yaw/pitch in production.
3. **Canvas sizes are not normalized:** thumbnails are CSS-sized, ghost preview
   is 160×180, editor avatar is 140×180, camera is 430×932.
4. **Ghost has no unique geometry:** it is `renderAvatarFrameInternal` with
   `ghostMode=true` — a recolor, not a distinct visual system.

The controlled matrix in `baseline-inventory.md` §3 re-renders all three modes
at **identical** yaw/pitch/scale/canvas to enable fair comparison; it confirms
that the framing math (`project()`) is shared, but the production surfaces do
not exploit this — they pass divergent options.

---

## 6. Files & line references (current SHA 7a3a823)

| File | Function | Line | Role |
|---|---|---|---|
| `js/pose-skeleton-3d.js` | `project` | 428-433 | fixed center projection (H5) |
| `js/pose-skeleton-3d.js` | `drawBone` | 493-575 | tapered capsule + ghost glow |
| `js/pose-skeleton-3d.js` | `drawJoint` | 577-762 | per-joint circle (skeleton) |
| `js/pose-skeleton-3d.js` | `drawTorsoVolume` | 1042-1102 | ribcage ellipse (skeleton) |
| `js/pose-skeleton-3d.js` | `drawPelvisVolume` | 1104-1124 | pelvis ellipse (skeleton) |
| `js/pose-skeleton-3d.js` | `renderFrame` | 1126-1190 | skeleton render |
| `js/pose-skeleton-3d.js` | `renderGhostFrame` | 1479-1525 | ghost one-shot → renderAvatarFrameInternal |
| `js/pose-skeleton-3d.js` | `renderAvatarFrame` | 1551-1587 | avatar one-shot |
| `js/pose-skeleton-3d.js` | `renderAvatarFrameInternal` | 1596-1819 | avatar/ghost body: hourglass torso (1640-1684), endpoint circles (1733-1739), head+eyes (1762-1796) |
| `js/pose-skeleton-3d.js` | `BONE_WIDTHS` | 96-120 | proximal limb widths (H2) |
| `js/app.js` | `renderPoseFigureSVG` | 1637-1687 | delegate → renderAvatarFrame |
| `js/app.js` | `setOverlayMode` | 374-449 | session chip: avatar=SVG, ghost=procedural, skeleton=none |
| `js/app.js` | `openPoseDetail` | 1278-1303 | skeleton instance, category yaw, auto-rotate |
| `js/app.js` | `renderEditorPreview` | 2035-2059 | editor avatar+skeleton |
| `js/camera.js` | `drawOverlay` | 183-230 | camera avatar=ghost (H9) |
| `js/camera.js` | `_generateGhostKPs` | 234-288 | legacy standing ghost fallback |
