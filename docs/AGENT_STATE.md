# AGENT_STATE.md — PoseArt Deep Audit + Skeleton Perfection
**Updated:** 2026-07-11 (v1.1 audit pass)
**Phase:** Phase A — Model Council Parallel Audit (starting) + v1.1 forensic PR pass
**Mission:** Stanford STORM methodology + Zuckerberg/Musk/STORM model council + skeleton anatomy improvement + red-team until zero issues.

---

## v1.1 AUDIT PASS — FORENSIC PR ROUND (2026-07-11)

Six PRs applied this pass. See `audit_reports/v1.1_forensic_report.md` for full
diffs, root-cause analyses, and side-effect considerations.

- [x] **PR-1** Skeleton visual refinements — slim key joints 45%, slim
      shoulder-to-shoulder bone 45%, cap torso volume to not clip head
      (directive #32), add directional eye divots that rotate with the
      figure (directive #33/#34), defensive `ctx.roundRect` polyfill.
- [x] **PR-2** Ghost overlay derives from the procedural rig — new
      `PoseSkeleton3D.renderGhostFrame()` helper; `camera.js` `_drawGhostOverlay`
      delegates to it with the legacy stick-figure as try/catch fallback.
      Water aesthetic (cyan #3EA9B8, soft glow, halo) per Phase 1 spec.
      Overlay-mode matrix cleaned up: 'avatar' no longer double-paints ghost.
- [x] **PR-3** Animation parity — avatar SVG now has continuous idle
      breathing (4s loop) via `.pose-figure-large` parent transform;
      ghost canvas gets the breathing class too. All 3 renderers animate.
- [x] **PR-4** Power-stance feet overlap fixed (was an SVG glyph bug, not
      a rig bug — directive #35 "is that correct in power stance? Or is
      it a rig issue?" → root cause: glyph). Session-setup overlay preview
      now respects user's explicit choice (no avatar fallback for ghost/off).
- [x] **PR-5** Demo mode transparency — new `SIMULATED SCORING` pill on
      camera screen. Always shown today because scoring still uses
      `_simulateKPs` (camera.js:123 TODO). Will be removed when MediaPipe /
      Vision pose detection lands.
- [x] **PR-6** Dead-file cleanup — removed `css/app.css` (1371 lines,
      orphan; index.html uses inline `<style>` and explicitly says
      "Ported from removed app.css"). Removed `js/pose-sprites.js` (45KB,
      never loaded by index.html). Fixed doc pose-count inconsistency
      (README said 12 poses / 10 categories; actual is 745 / 16).

---

## KNOWN ISSUES (from prior audit rounds, still open)

### CRITICAL (ship-blockers)
- [x] camera.js line 123: dead ternary (FIXED Phase 9)
- [x] CSS architecture: inline <style> in index.html overrides ~112 rules in css/app.css — cascade conflict, dead CSS (RESOLVED v1.1 PR-6: css/app.css removed entirely; was never loaded, inline <style> is the live stylesheet)
- [ ] Navigation stack: goBack() has no history stack — jumps to tab root instead of true back (NOTE: goBack() now uses screenStack, but tab switches still clear the stack — partial fix, needs deeper navigation rework)
- [ ] Data loss: no persistence warning shown to users (gallery/favs lost on refresh) (NOTE: saveToGallery shows a one-time toast, but no persistent banner)
- [x] OB4 persona selection: AppState.selectedGoal set but NEVER read anywhere — dead personalization (RESOLVED: personalizeHome() at app.js:2086 reads selectedGoal and personalizes featured pose + greeting)
- [ ] Onboarding replays every load (no persistence for onboarding-done flag) (NOTE: by design — iframe sandbox blocks localStorage; non-iframe build would persist)
- [x] Pose count inconsistency: poses-data.js header says "300+ / 10 categories" — actual is 761 / 16 categories (RESOLVED v1.1 PR-6: actual is 745 poses / 16 categories, verified via scripts/count_poses.js; docs updated)
- [x] Demo mode badge: users who granted camera see same fake scoring as demo mode — no indicator shown (RESOLVED v1.1 PR-5: new SIMULATED SCORING pill always shown until ML pose detection is integrated)

### PERFORMANCE
- [x] Search debounce 0ms → 180ms (FIXED Phase 9)
- [ ] renderGallery() rebuilds entire DOM on every tab switch (no dirty flag) (NOTE: galleryDirty flag exists but only short-circuits if rendered==='1' — first render still rebuilds)
- [x] Flash: was creating new <style> per capture (FIXED Phase 9)
- [x] Particle bloom creates 18 DOM nodes per capture (no pooling) (RESOLVED: _particlePool now pooled in camera.js:572)

### UX / PRODUCT
- [x] Favorites pill: was calling searchPoses('favorite') (FIXED Phase 9)
- [x] Category grid not hidden during search (FIXED Phase 9)
- [x] Search result count header missing (FIXED Phase 9)
- [x] Fav + share buttons missing from pose detail sheet (FIXED Phase 9)
- [ ] Session history persists in-memory only — lost on refresh (by design — iframe sandbox)
- [ ] OB2 demo: static SVG toggle, not an actual preview of camera mechanic
- [ ] 240 orphaned GIFs in /gifs/ with no matching pose entry (NOTE: 780 GIFs in /gifs/, 745 poses in library — 35 extras; not 240, count needs re-verification)
- [x] Back button on category-list calls showTab('library') directly, not goBack() (RESOLVED: index.html:1799 now uses goBack())

### SKELETON / ANATOMY (Phase C targets — partially addressed by v1.1 PR-1)
- [x] Joint halos too big (directive #15) — RESOLVED v1.1 PR-1: key joints 4.5→2.5, non-key 3→2.2
- [x] Shoulder-to-shoulder shape too chunky (directive #36) — RESOLVED v1.1 PR-1: 45% thinner
- [x] Torso vertical clips head (directive #32) — RESOLVED v1.1 PR-1: torso ellipse clamped to chin
- [x] Head too round / eyes always face screen (directive #33/#34) — RESOLVED v1.1 PR-1: head elongated 1.18×, eye divots computed in model space and rotated with figure yaw/pitch
- [x] Ghost = avatar glyph (directive #13/#37) — RESOLVED v1.1 PR-2: ghost derives from PoseSkeleton3D.renderGhostFrame with cyan water aesthetic
- [x] Only skeleton animates (directive #17) — RESOLVED v1.1 PR-3: avatar SVG + ghost canvas now have continuous breathing
- [ ] Poses look like crude stick figures: straight limbs, no S-curves, no weight shift (NOTE: PoseSkeleton3D v3.0 already has S-curve via tapered bones + soft-joint minimums; avatar SVG glyphs are still hand-crafted — full procedural avatar is Phase 2+ work)
- [ ] Knee/elbow/hand positioning needs anatomical accuracy review (per-pose audit — Phase 2/3 work, 745 poses)
- [ ] Boudoir poses especially need proper lean, curve, and joint angle review (Phase 2/3 work)
- [ ] Joint limits may be clamping valid poses (hipAbductL/R was clamped to ±25) (NOTE: scan_joints.js shows hipAbductL/R range is now -25..25 with no clamping in buildPose; the clamp was removed)
- [ ] 3D skeleton has no body volume rendering — pure lines/dots, no elegance (NOTE: drawTorsoVolume + drawPelvisVolume add translucent ellipses for volume; could be enhanced further)

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
