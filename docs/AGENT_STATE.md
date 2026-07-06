# AGENT_STATE.md — PoseArt Deep Audit + Skeleton Perfection
**Updated:** 2026-07-05 21:45
**Phase:** POSING_PRINCIPLES + renderer v2 + full-library principle sweep (branch `feat/posing-principles-and-rig`)
**Mission:** Stanford STORM methodology + Zuckerberg/Musk/STORM model council + skeleton anatomy improvement + red-team until zero issues.

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
- [ ] Navigation stack: goBack() has no history stack — jumps to tab root instead of true back
- [ ] Data loss: no persistence warning shown to users (gallery/favs lost on refresh)
- [ ] OB4 persona selection: AppState.selectedGoal set but NEVER read anywhere — dead personalization
- [ ] Onboarding replays every load (no persistence for onboarding-done flag)
- [ ] Pose count inconsistency: poses-data.js header says "300+ / 10 categories" — actual is 761 / 16 categories
- [ ] Demo mode badge: users who granted camera see same fake scoring as demo mode — no indicator shown

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
- [ ] Session history persists in-memory only — lost on refresh
- [ ] OB2 demo: static SVG toggle, not an actual preview of camera mechanic
- [ ] 240 orphaned GIFs in /gifs/ with no matching pose entry
- [ ] Back button on category-list calls showTab('library') directly, not goBack()

### SKELETON / ANATOMY (Phase C targets)
- [ ] Poses look like crude stick figures: straight limbs, no S-curves, no weight shift
- [ ] Knee/elbow/hand positioning needs anatomical accuracy review
- [ ] Boudoir poses especially need proper lean, curve, and joint angle review
- [ ] Joint limits may be clamping valid poses (hipAbductL/R was clamped to ±25)
- [ ] 3D skeleton has no body volume rendering — pure lines/dots, no elegance

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
1. **Couple** — renderer needs partner-overlay support to draw two figures.
2. **Accessible** — needs a wheelchair prop under the figure.
3. **Leaning** — needs a wall prop.
4. **Reclining** — needs a floor/bed surface prop.
5. **Seated (armchair sub-poses 41–60)** — several still read as sprawled;
   likely need explicit armchair prop + torso re-orient.
6. **Kneeling** — could still lower ankles to the ground plane in the renderer
   when knees ≥ 90° (currently corrected via joint data, not renderer).
7. **240 orphaned GIFs** in `/gifs/` — unrelated cleanup task.

These are logged as tracking items; they require renderer changes (props,
two-figure support) rather than another data-layer sweep.

