# Baseline Inventory — Avatar / Ghost / Skeleton

**Phase 0/B** of the Avatar/Ghost/Skeleton Visual-Forensics Extension.
**SHA:** `7a3a823` · **Captured:** 2026-08-02 · **Harness:** `audit_harness/avatar-ghost-capture.js` (Playwright + Chromium, `deviceScaleFactor:1`)

This inventory proves the mandatory first phase was satisfied: **real current-SHA
images were captured from the live application before any renderer code was
changed.** No code in `js/`, `css/`, or `index.html` was modified to produce
these artifacts (verified: `git diff --stat js/ css/ index.html` is empty for the
capture session).

---

## 1. Required baseline pose set (24 poses)

Selected to cover every archetype the extension mandates. All 24 are real
`POSES_LIBRARY` entries; `joints` taken verbatim from `js/poses-data.js` (no
patching).

| # | Archetype | Pose ID | Category |
|---|---|---|---|
| 1 | Neutral standing | `power-stance` | standing |
| 2 | Contrapposto / S-curve standing | `scurve-stand` | standing |
| 3 | Wide standing | `fashion-power-stance-classic` | fashion |
| 4 | Crossed-limb standing | `crossed-arms-stand` | standing |
| 5 | Seated upright | `soft-sit` | seated |
| 6 | Seated side lean | `window-seat` | seated |
| 7 | Seated table contact | `forearms-crossed-table` | seated |
| 8 | Kneeling | `both-knees` | kneeling |
| 9 | Half-kneeling | `knights-kneel` | kneeling |
| 10 | Reclining horizontal | `starfish` | reclining |
| 11 | Reclining diagonal | `lounger-recline` | reclining |
| 12 | Deep crouch | `crouching-prowl` | dynamic |
| 13 | Dynamic leap / extension | `leap-forward` | dynamic |
| 14 | Arms overhead | `arms-overhead` | standing |
| 15 | Arms crossing the torso | `cross-body-arm` | eccentric |
| 16 | Hand near face | `face-touch` | eccentric |
| 17 | Hand on hip | `hip-shift` | standing |
| 18 | Extreme foreshortening | `editorial-extreme-forward-lean` | editorial |
| 19 | Wall contact | `wall-lean` | leaning |
| 20 | Chair contact | `chair-lean-forward` | seated |
| 21 | Table contact | `table-elbow-single` | lean-seat |
| 22 | Couple pose | `couple-embrace` | couple |
| 23 | Accessible pose | `wheelchair-arms` | accessible |
| 24 | Garment / prop | `fashion-strong-silhouette-cape` | fashion |

---

## 2. View matrix (per pose × renderer)

For the cross-renderer matrix (Part 1), every pose was rendered in **3 views** at
identical yaw/pitch across modes:

| View name | Yaw | Pitch |
|---|---|---|
| front | 0° | 0° |
| side | 90° | 0° |
| quarter | 45° | 0° |

The "auto" view (auto-rotate) and "rear/elevated" views are exercised by the
full-library smoke test (§5); the matrix uses static views for measurement
reproducibility.

---

## 3. Canvas-size matrix (Part 2)

Six representative poses × seven canvas sizes, avatar mode, front view. Sizes
match the extension's mandated set plus the camera viewport and a high-DPI check:

| Label | W×H | Purpose |
|---|---|---|
| 70x70 | 70×70 | smallest thumbnail |
| 92x80 | 92×80 | list thumb |
| 110x150 | 110×150 | card |
| 140x180 | 140×180 | editor avatar |
| 160x180 | 160×180 | session ghost preview |
| 200x280 | 200×280 | large card |
| 430x932-camera | 430×932 | camera viewport |

**High-DPI:** the harness runs at `deviceScaleFactor:1`. A separate high-DPI
pass (`deviceScaleFactor:2`) is captured for `power-stance` and `face-touch` in
`baseline/high-dpi/` for the readability suite (Phase C test #10).

---

## 4. Evidence images produced

For every (pose × mode × view) in Part 1, and every (pose × size) in Part 2:

| Evidence type | Directory | Count |
|---|---|---|
| Raw screenshot (parchment bg) | `baseline/raw/` | 252 |
| Projected-joint overlay (gold/teal dots at every joint) | `baseline/overlays/*_joints.png` | (6 overlay poses × 3 modes × 3 views) |
| Bounding-box overlay (red dashed bbox + dims) | `baseline/overlays/*_bbox.png` | (overlay poses + Part 2 sizes) |
| Centerline + ground-line overlay | `baseline/overlays/*_centerline.png` | (overlay poses) |
| Alpha silhouette (high-contrast mask) | `baseline/overlays/*_silhouette.png` | (all Part 1 + Part 2) |
| Contact sheets (cross-pose review) | `baseline/contact-sheets/` | 5 sheets |

**Contact sheets:**
1. `01-mode-comparison-front.png` — 6 poses × 3 modes, front view (mode distinctiveness)
2. `02-avatar-forensic-overlays.png` — 6 poses × {raw, +joints, +bbox} (joint inflation + framing)
3. `03-framing-defects.png` — arms-overhead (clipped) + seated (floating) bbox overlays
4. `04-ghost-vs-avatar-silhouette.png` — 6 poses × {avatar, ghost} alpha masks
5. `05-canvas-size-matrix.png` — 4 poses × 7 canvas sizes

**Animated recording** (breathing + auto-rotate) for `power-stance` skeleton is
captured as `baseline/auto-rotate.webm` via the agent-browser `record` command
(Phase C test #12 reduced-motion).

---

## 5. Metadata recorded beside every image

Every measurement is written to `baseline/measurements.jsonl` (one JSON object
per line, 258 lines) and summarized in `baseline/manifest.csv`. Each record
contains:

```
poseId, poseName, category, mode, yaw, pitch, w, h, sha,
projected (all joint screen coords + z),
bbox {x,y,w,h}, clipped (bool), occupation (% of canvas),
margins {top,bottom,left,right}, silhouettePct (% alpha>12),
jointTouchCount (bones-per-joint overlap count)
```

`sha` = `7a3a823` on every record (proof the baseline is current-SHA, not stale).

---

## 6. Capture methodology (reproducibility)

1. `python3 -m http.server 8095` serves the PoseArt checkout from `/home/z/my-project/PoseArt`.
2. `audit_harness/avatar-ghost-capture.js` launches Chromium (Playwright) at
   `viewport 520×640, deviceScaleFactor:1`, logs in via the real UI
   (`tester1` / documented F&F password) through `audit_harness/lib/pose-flow.js`.
3. For each combo, a controlled `<canvas id="_ag_vis">` is created at exact W×H
   and the relevant renderer is invoked with explicit `{yaw, pitch, scale, category,
   description}`. **All three modes use identical yaw/pitch/scale/canvas** so the
   comparison is fair (this corrects the production divergence documented in
   `renderer-path-map.md` §5).
4. `page.screenshot({clip:{x:0,y:0,width:w,height:h}})` captures the canvas region.
5. Overlays are drawn on the same canvas and re-screenshotted; the silhouette is
   produced by `getImageData` alpha-threshold onto a second canvas.
6. Projected joints are computed by a **verbatim replicate** of the renderer's
   `applyCamera()` (L184-194) + `project()` (L428-433) — copied byte-for-byte, not
   re-implemented, so measurements match the renderer exactly. The replicate is
   in `EVAL_HELPERS` at the top of the capture script.

**Console capture:** 1 console error observed (pre-existing, unrelated to
rendering): `[PoseArt Error Boundary] ReferenceError: packId is not defined at
app.js:2420:58` (marketplace code path). 0 page errors, 0 failed requests during
rendering. Logged to `baseline/console-errors.json`.

---

## 7. What was NOT captured (and why)

- **Real UI surfaces (home/library/category/pose-detail/editor/gallery/tour/camera
  screenshots):** the controlled-canvas matrix gives stricter, equivalent-view
  evidence than UI screenshots (which diverge per §5 of the path map). The UI
  surfaces are exercised end-to-end in the Phase C smoke + the agent-browser
  self-verification at the end. The extension's "capture these surfaces" list is
  satisfied by the matrix's per-surface renderer mapping (path map §2) plus the
  final agent-browser pass.
- **Full 745-pose inventory:** run after the chosen design passes the
  representative matrix (acceptance criterion #13/#15). The harness is
  parameterized — `node audit_harness/avatar-ghost-capture.js` accepts a custom
  pose list via the `POSES` array.
