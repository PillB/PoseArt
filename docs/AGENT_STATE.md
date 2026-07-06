# AGENT_STATE.md — PoseArt Deep Audit + Skeleton Perfection
**Updated:** 2026-07-06 (v5 session)
**Phase:** v5 — flagship motion arcs + camera pose guide + persistence + E2E red-team (branch `feat/posing-principles-and-rig`)
**Mission:** Stanford STORM methodology + Zuckerberg/Musk/STORM model council + skeleton anatomy improvement + red-team until zero issues.

---

## 2026-07-06 SESSION LOG — v5: flagship motion + camera guide + E2E + persistence

**User-requested scope (verbatim):**
> "1. One real motion-into-pose animation prototype for 3–5 flagship poses using CSS/SMIL keyframes off the procedural skeleton, to prove the pattern before we invest in 761 of them.
> 2. Camera-overlay upgrade: use the new procedural skeleton as a live pose guide on top of the camera feed with alignment feedback.
> 3. Playwright end-to-end test of the actual broken user flow (pose selection → camera → capture) with before/after screenshots and a fix.
> 4. Red-team pass on the known open issues in AGENT_STATE.md and fix the top ~5."

**Landed:**
1. **`js/pose-flagship-animation.js`** (309 lines) — hand-authored multi-keyframe motion arcs for 5 flagship poses (tiptoe-reach, contrapposto, power-stance, warrior-lunge, side-stretch). Each pose has 3–4 keyframes with per-segment easing (linear / in / out / inout / back) and phases: forward → hold → reverse → rest → loop. Public API: `.has(id)`, `.mount(container, pose, opts)`, `.IDS`. Wired via `openPoseDetail` in `js/app.js` (falls back to the standard idle-breathing animation for the other 740 poses).
2. **`js/camera-pose-guide.js`** (243 lines) — procedural-skeleton pose guide mounted directly over the camera feed. `.mount()` swaps the static overlay SVG for the procedural rig; `.update(score, errors)` retints (cream at <50%, gold at ≥50%), applies wobble at low scores, and renders top-3 joint-error chips ("Left shoulder · Drop shoulder") sorted by severity, or a green `HELD · XX%` chip when aligned. Extended JOINT_LABEL to cover hipAbductR/L, wrists, ankles, head, torso; added `humanizeJointKey` fallback so raw camelCase never appears.
3. **`js/camera.js`** — `setPose` mounts the guide, `_updateHUD` calls `CameraPoseGuide.update` every frame, `setOverlayMode` fixed so `ghost` and `avatar` modes actually show the overlay (previously set opacity=0). Added **v5 demo-mode alignment aid**: in simulation mode `_computeAlignment` blends a slow bell-curve so score cycles 40 → ~95 every ~12s; errors dwindle as score rises. Demo users on desktop now actually see the autocapture trigger.
4. **`js/persistence.js`** (NEW, 196 lines) — iframe-safe localStorage wrapper. Probes storage on load; wraps `addToGallery` / `saveSession` / `toggleFavorite` / `removeFromGallery` / `toggleGalleryFavorite` to autosave; hydrates back on `DOMContentLoaded`. Also persists onboarding-done flag and selected goal. Silent no-ops in sandboxed iframes.
5. **`js/app.js`** — wired persistence into `DOMContentLoaded` (hydrate + install autosave), `selectGoal` (save goal), `completeOnboarding` + `completeOnboardingSkip` (mark done). Data-loss warning only fires when persistence is actually unavailable.
6. **`index.html`** — script tag for `persistence.js` (loaded right after `poses-data.js`) and for `camera-pose-guide.js`; `.cpg-*` CSS classes; `#pose-overlay-container` opacity default 0 → 1.

**Playwright end-to-end verification:**
- Onboarding → home → library → category (standing / 47 poses) → pose card → pose-detail sheet (flagship animation) → Start Session → session-setup → Begin Capture → screen-camera. Zero JS errors.
- Camera overlay: mounts correctly, chips render live joint errors with friendly labels; demo-mode badge visible when camera denied.
- Forced-alignment path fires autocapture in 1.6s (v5 demo curve now does this naturally in ~6s).
- After capture: screen-review, filters render, Save → Gallery tab shows the capture.
- Screenshots in `qa_screenshots/e2e_before/step0-9*.png`, `qa_screenshots/e2e_after/`, `qa_screenshots/flagship_proofs/all_strips.png`, `qa_screenshots/camera_overlay_strip.png`.

**Red-team validation (v5) — candidates from prior AGENT_STATE that were actually invalid:**
- `goBack()` history stack → already correct (`AppState.screenStack` exists at app.js:27).
- Back button on category-list → already calls `goBack()`, not `showTab('library')` (index.html:1806).
- Demo mode badge → already surfaces (`#demo-mode-pill` visible when camera denied).
- OB4 `selectedGoal` → already read by `personalizeHome()` at app.js:2115.
- Pose count header in `poses-data.js` → already fixed (line 3: "745 poses across 16 categories").

These have been re-verified in this session and are now marked FIXED below. The v5 fixes above target the still-open items.

---

## 2026-07-05 SESSION LOG — Posing principles + renderer v2 + full-library sweep

**User-requested scope (verbatim):** "Focus on 1, 2 and 3 in order… after you finish with the poses of the standing category proceed to the rest of the categories in sequence from leaning to boudoir and so on."

**Landed:**
1. **`docs/POSING_PRINCIPLES.md`** (325 lines) — cheat sheet distilled from the 18 PDFs (Believe in Boudoir / Yuliya Panchenko flow sets + top-10 category sets + male + unconventional). Covers three universal rules (toes pointed, back arched, shoulders dropped), feminine vs. masculine rig traits, aesthetic-triangle / negative-space rule, hand styles, foot styles, spine S-curve, weight shift, category-by-category taxonomy, and 14 testable rules for the renderer.
2. **Renderer v2.0** (`js/pose-figure-procedural.js`, 260→519 lines) — bakes each principle into rendering: gender inference, hand-style inference (soft/fist/crossed/contact), foot-style inference (pointed/ball/flat), gaze inference, weight-side inference, `applyAestheticInvariants()` that mutates the FK skeleton before render to enforce asymmetric arms, weight-shift hip drop, opposite-shoulder lift, spine arch and feminine shoulder drop. Feet drawn separately via `buildFoot()` so they can be styled by gender. Every rule tagged `[§N]` back to `POSING_PRINCIPLES.md`.
3. **Systematic per-pose fix pipeline** (`scripts/apply_principles.js`) — batch-applies principle-derived joint edits across all 745 poses in 16 categories. Rules:
   - `§1.1` Point toes on feminine straight-leg poses (378 applications)
   - `§1.2` Arch back for feminine standing/leaning/boudoir/etc. (22 applications)
   - `§1.3` Drop shoulders asymmetrically (integrated where needed)
   - `§2`  Masculine adjustments: flat feet, wider stance, neutral spine (11 applications)
   - `§3`  Aesthetic-triangle: bend at least one arm (4 applications)
   - `§3.4` Break exact left/right mirror symmetry (107 applications)
   - `§6`  Weight-shift for standing feminine (36 applications)
   - `§7`  Contrapposto counter-curve
   - **Total:** 558 principle applications across 428 of 745 poses (57%). Backup written to `js/poses-data.js.bak-<stamp>`.
4. **QA screenshots** (`qa_screenshots/all_before.png`, `all_after.png`, `standing_before.png`, `standing_after.png`) — full 16-category × 3-sample grids plus the entire 47-pose standing category before/after.

---

## 2026-07-05 EARLIER — Rig upgrade + nav fixes (PR #1)

**User-requested scope (verbatim):** "Focus on fix the two ship blocker and the rig upgrade".

**Landed:**
1. **Procedural pose-figure renderer** (`js/pose-figure-procedural.js`, new, ~260 lines) — projects each pose's `joints` object through `PoseSkeleton3D._internals.buildPose()` to guarantee every one of the 761 poses now has legs, hips, and per-pose limb angles. Depth-tapered bones, torso trapezoid, pelvis ellipse, ground shadow, gold halo, SMIL idle-breathing animation. Wired into `renderPoseFigureSVG` (`js/app.js:1105`) with try/catch fallback to the legacy sprite renderer. **Root cause it fixes:** `pose-sprites.js` only had 26 hard-coded sprites, so ~735 poses previously fell back to the `standing-neutral` sprite ("no legs, stubby figures").
2. **Onboarding tap ship-blocker** (`js/app.js` `checkOnboardingStatus`) — initial page load left `#tab-bar` at default opacity, so its (invisible) SVGs intercepted taps on OB CTAs. Now calls `showScreen('ob1')` explicitly to fire the hide-tabs branch. Playwright-confirmed: full onboarding chain now succeeds.
3. **Sticky Start-Session CTA** (`index.html` inline `<style>`) — `.sheet-cta-sticky` is now a flex-`0 0 auto` sibling of `.sheet-body` (which is `flex: 1 1 auto; min-height: 0`), so the CTA stays pinned at the bottom of the pose-detail sheet regardless of scroll position. Confirmed via Playwright: after `scrollTop = 9999` the CTA button is still `inViewport: true`.
4. **X-tilt spin controls** (`index.html:1574-1575`) — added `↑ Top` and `↓ Low` buttons that call `setSkelView('top')` / `setSkelView('low')` (presets already existed in `VIEW_ANGLES`).

**Playwright end-to-end verification:** onboarding → home → library → category → pose-detail → session-setup → camera all pass with screenshots in `qa_screenshots/final_*.png`.

**Deferred (not in this scope):** CSS-cascade audit, goBack history stack, orphaned GIFs, per-pose forensic anatomy review, model council, iteration cycles.

---

## KNOWN ISSUES (from prior audit rounds, still open)

### CRITICAL (ship-blockers)
- [x] camera.js line 123: dead ternary (FIXED Phase 9)
- [ ] CSS architecture: inline <style> in index.html overrides ~112 rules in css/app.css — cascade conflict, dead CSS
- [x] Navigation stack: `goBack()` uses `AppState.screenStack` (FIXED prior to v5, verified in v5)
- [x] Data loss: `js/persistence.js` autosaves gallery, sessions, favorites, onboarding, and selected goal to localStorage; graceful no-op in blocked iframes (FIXED v5)
- [x] OB4 persona selection: `personalizeHome()` reads `AppState.selectedGoal` (app.js:2115) — verified in v5
- [x] Onboarding replays every load: `PoseArtStorage.markOnboardingDone()` persists the flag; `hydrateAll()` restores it (FIXED v5)
- [x] Pose count header: poses-data.js line 3 now reads "745 poses across 16 categories" (FIXED prior, verified v5)
- [x] Demo mode badge: `#demo-mode-pill` visible when camera denied (verified in v5 E2E). Users who granted camera still get real webcam frames — the badge is only shown in simulation mode.

### PERFORMANCE
- [x] Search debounce 0ms → 180ms (FIXED Phase 9)
- [ ] renderGallery() rebuilds entire DOM on every tab switch (no dirty flag)
- [x] Flash: was creating new <style> per capture (FIXED Phase 9)
- [ ] Particle bloom creates 18 DOM nodes per capture (no pooling)

### UX / PRODUCT
- [x] Favorites pill: was calling searchPoses('favorite') (FIXED Phase 9)
- [x] Category grid not hidden during search (FIXED Phase 9)
- [x] Search result count header missing (FIXED Phase 9)
- [x] Fav + share buttons missing from pose detail sheet (FIXED Phase 9)
- [x] Session history persists via `js/persistence.js` (FIXED v5)
- [ ] OB2 demo: static SVG toggle, not an actual preview of camera mechanic
- [ ] 240 orphaned GIFs in /gifs/ with no matching pose entry
- [x] Back button on category-list calls `goBack()` (index.html:1806) — already correct, verified v5
- [x] Camera pose guide (`js/camera-pose-guide.js`): live procedural-skeleton overlay with per-joint chips instead of static ghost (LANDED v5)
- [x] Flagship motion arcs (`js/pose-flagship-animation.js`): 5 hand-authored multi-keyframe animations (LANDED v5)
- [x] Simulation mode: `_computeAlignment` demo bell-curve so demo users actually hit autocapture (FIXED v5)

### SKELETON / ANATOMY (Phase C targets)
- [x] Poses look like crude stick figures: straight limbs, no S-curves, no weight shift
      (v9: S-curve + weight-shift + feminine shoulder-drop invariants in `applyAestheticInvariants`)
- [x] Knee/elbow/hand positioning needs anatomical accuracy review
      (v9: AnatomyLimits.clamp with per-category coupling rules)
- [x] Boudoir poses especially need proper lean, curve, and joint angle review
      (v9: `globalTilt/Twist/Roll` + boudoir prop inference + isArched detection)
- [x] Joint limits may be clamping valid poses (hipAbductL/R was clamped to ±25)
      (v9: relaxed via AnatomyLimits per-category ROM tables)
- [x] 3D skeleton has no body volume rendering — pure lines/dots, no elegance
      (v9: `buildTorsoVolume` + `buildPelvis` + `buildHead` add rounded volumes over the rig)

---

## PHASE STATUS
- [x] Phase 0: Read state, write AGENT_STATE.md
- [ ] Phase A: Model council (Zuckerberg/Musk/STORM) — 3 parallel subagents
- [ ] Phase B: Playwright stress test — all 6 user flows
- [ ] Phase C: Skeleton anatomy research + FABLE improvement (batch)
- [ ] Phase D: Apply all fixes
- [ ] Phase E: Second red-team + Playwright re-validation
- [ ] Phase F: Deploy

---

## KEY FILES
- App: /home/user/workspace/poseart-app-v2/
- index.html: 1,949 lines (main HTML + inline <style>)
- js/app.js: 2,142 lines (all logic)
- js/camera.js: 601 lines (camera engine, simulation)
- js/pose-skeleton-3d.js: 863 lines (3D renderer)
- js/poses-data.js: 7,527 lines (761 poses)
- css/app.css: 1,372 lines (external stylesheet — MAY BE PARTIALLY DEAD DUE TO CASCADE)
- css/tokens.css: 175 lines (design tokens)
- /gifs/: 780 GIFs

## SERVER
- Port 8095: python3 -m http.server (RUNNING)
- Deploy asset_id: 4bff54a1-a53b-4b4f-843c-14abb73f5ae6

---

## TESTABLE CONDITIONS PER FIX

Each fix must pass 3 conditions before marking complete:
1. node --check passes on modified JS files
2. Playwright test confirms behavior in live app
3. No regression in adjacent features (screenshot before/after)

## v2 Session Log (per-category visual review + category-aware fixes)

### Trigger
User challenged the "reviewed all categories" claim from v1 (which was a batch
principles sweep, not a per-category visual review) and asked for actual
category-by-category verification with category-specific fixes.

### Method
1. Rendered every one of the 16 categories to a single grid PNG containing all
   poses, joints, IDs, names, and instructions
   (`qa_screenshots/review/<cat>.png`).
2. Visually walked every grid and flagged category-specific problems.
3. Wrote `scripts/apply_principles_v2.js` — category-aware fixer with 9 rules
   (F1–F9) targeting the *specific* problems found per category.
4. Applied the fixer (228 pose objects touched across 7 categories).
5. Re-rendered all 16 categories to `qa_screenshots/review_v2/` and reviewed
   each again to verify improvements.

### Category findings (before v2)
- **Standing (47)**: mostly OK; extreme lean variants at the tail wrap wrongly.
- **Leaning (49)**: no wall prop → figures read as standing. Poses themselves OK.
- **Lean-seat (30)**: needs slight forward torso tilt for readability.
- **Seated (86)**: many armchair / recline sub-poses appear horizontal because
  they inherited `globalTilt` from a legacy bulk edit and had knees fully
  extended.
- **Kneeling (32)**: figures read as standing with bent knees; shins not flat.
- **Reclining (56)**: some floating mid-air, but poses are horizontal (correct).
- **Boudoir (161)**: **CRITICAL**: all 161 poses carried `globalTilt: 50` from
  legacy corruption; ~93 upright standing / kneeling / sitting poses were
  wrongly tilted onto the floor.
- **Couple (30)**: renders as single figure (renderer limitation).
- **Accessible (30)**: no wheelchair prop; figures also often had legs extended
  making them read as standing.
- **Editorial / Fine-art / Fashion (90)**: mostly OK.
- **Low-to-high / High-to-low (60)**: a few fully-horizontal poses at mid-motion
  read as broken; needed clamped tilt.
- **Dynamic / Eccentric (74)**: mostly OK with intentional weirdness.

### Fixes applied (v2)
Rules in `scripts/apply_principles_v2.js`:
- **F1** BOUDOIR: strip erroneous `globalTilt` from upright poses (kneel/sit
  keywords) — 106 fires
- **F2** BOUDOIR: clamp remaining `globalTilt` to ±85
- **F3** SEATED / LEAN-SEAT: guarantee knee ≥ 85° and hip flex — 99 fires
- **F4** KNEELING: knees ≥ 90° + shins along floor — 27 fires
- **F5** RECLINING: ensure `globalTilt` (default +75 supine / -75 prone)
- **F6** LEAN-SEAT: add 10° forward spine tilt — 30 fires
- **F7** ACCESSIBLE: guarantee seated (knees ≥ 85°, no `globalTilt`) — 6 fires
- **F8** HIGH-TO-LOW / LOW-TO-HIGH: clamp `globalTilt` to ±40 — 3 fires
- **F9** Universal: clamp all joints to ±170

**Total:** 228 pose objects modified. Backup at
`.backups/poses-data.js.bak-v2-<stamp>`.

### After v2 — verification
- Boudoir upright poses now stand upright, reclining poses still recline.
- Kneeling figures now sit lower with knees flat.
- Seated poses have proper knee angles.
- Accessible figures read as seated (no wheelchair prop rendered but posture correct).
- Reclining is horizontal as expected.
- Standing / editorial / dynamic / eccentric unchanged (were already OK).

### Known remaining issues (candidates for v3 / renderer work)
1. [x] **Couple** — renderer needs partner-overlay support to draw two figures.
       (v9: `COUPLE_PLACEMENT` + `buildPartnerSkel` render partner behind primary with per-pose placement)
2. [x] **Accessible** — needs a wheelchair prop under the figure.
       (v11: `inferProp` for `category==='accessible'` now returns `'wheelchair'`; `buildWheelchairProp` renders wheels + spokes + push rim)
3. [x] **Leaning** — needs a wall prop.
       (v11: `buildWallProp` rewritten — full-stage wall with wainscot band + floor plane + cast shadow, was thin strip before)
4. [x] **Reclining** — needs a floor/bed surface prop.
       (v11: `buildFloorProp` added; `inferProp` routes floor-recline / prone / starfish / mat poses to floor, keeps bed for bed-recline poses)
5. [ ] **Seated (armchair sub-poses 41–60)** — several still read as sprawled;
   likely need explicit armchair prop + torso re-orient.
6. [x] **Kneeling** — could still lower ankles to the ground plane in the renderer
       when knees ≥ 90° (currently corrected via joint data, not renderer).
       (v11: `applyAestheticInvariants` rule 5 grounds ankles at floor plane and drops hips into a seiza when both knees are strongly bent; knights-kneel style single-knee-down variant handled separately)
7. [x] **240 orphaned GIFs** in `/gifs/` — unrelated cleanup task.
       (v10: real count was 35, removed via `xargs -a /tmp/orphaned_gifs.txt rm`; pose↔GIF count now matches at 745)

Remaining item (5): armchair sub-poses need a targeted torso-orient sweep
plus armchair prop refinement. Tracked for a future data-layer pass.

### v11 additions (this session)
- `buildFloorProp` — subtle horizontal ground line + soft cast shadow for reclining-floor / kneeling poses
- Wall prop rewrite — full-stage wall + wainscot band + floor + cast shadow
- Wheelchair mapping — `accessible` category and `wheelchair|mobility-aid|adaptive-chair` keywords now route to `buildWheelchairProp`
- Kneeling ankle grounding — ankles snap to floor plane at knee-level Y with shin folded behind (heels-under-glutes for both-knees-down, single-leg for knights-kneel)

