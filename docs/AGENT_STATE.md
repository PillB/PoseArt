# AGENT_STATE.md — PoseArt Deep Audit + Skeleton Perfection
**Updated:** 2026-07-05 21:15
**Phase:** Rig upgrade + navigation ship-blockers landed (branch `fix/rig-upgrade-nav`)
**Mission:** Stanford STORM methodology + Zuckerberg/Musk/STORM model council + skeleton anatomy improvement + red-team until zero issues.

---

## 2026-07-05 SESSION LOG — Rig upgrade + nav fixes

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
