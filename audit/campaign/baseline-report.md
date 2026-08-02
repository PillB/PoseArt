# Phase 2 — Baseline Report

> **Commit SHA:** b09f998f159adb83e5fb1d7d5c631d9cab2857e1
> **Date:** 2026-08-02
> **No implementation has begun. This is a pre-fix baseline.**

---

## 1. Existing Test Results

### Geometry Sweep (audit_harness/geometry-sweep.js)

| Metric | Value |
|---|---|
| Total poses scanned | 745 |
| Poses with defects | 482 |
| Poses clean | 263 |
| Total defects | 1,253 |
| MAJOR defects | 100 |

**MAJOR defect breakdown:**

| Defect type | Count |
|---|---|
| torso_forward | 16 |
| torso_twist | 24 |
| knees_to_one_side | 19 |
| hands_on_hips | 9 |
| legs_crossed | 9 |
| hand_to_chin | 8 |
| hand_to_floor | 6 |
| arm_on_chair | 6 |
| arms_overhead | 3 |
| reclining | 3 |
| minor | 3 |
| knees_apart | 3 |
| arms_crossed | 4 |
| knees_together | 1 |
| prone_pose | 1 |
| kneeling | 3 |

### Joint Validator (scripts/joint_validator.js)

| Metric | Value |
|---|---|
| Total poses scanned | 745 |
| Poses with issues | 6 |
| Poses clean | 739 |

**Gap analysis:** The joint validator finds only 6 issues (config-level), while the geometry sweep finds 100 MAJOR defects (derived-coordinate-level). This confirms the joint validator is too weak — it never derives coordinates, only checks raw config values against regex. **The joint validator cannot be used as proof of correctness.**

---

## 2. Browser Baseline (agent-browser)

### Test Environment
- URL: http://localhost:8095
- Browser: Chromium (agent-browser 0.32.3)
- Viewport: default

### Results

| Flow | Steps Executed | Screen Reached | Page Errors | Console Errors |
|---|---|---|---|---|
| App load | GET / | screen-login | 0 | 0 (only styled info logs) |
| Login | tester1 / [redacted] | screen-ob1 | 0 | 0 |
| Onboarding skip | showScreen('home') | screen-home | 0 | 0 |
| Library | showScreen('library') | screen-library | 0 | 0 |
| Marketplace | showScreen('marketplace') | screen-marketplace | 0 | 0 |
| Camera | showScreen('camera') | screen-camera | 0 | 0 |
| Gallery | showScreen('gallery') | screen-gallery | 0 | 0 |
| Progress | showScreen('progress') | screen-progress | 0 | 0 |
| Profile | showScreen('profile') | screen-profile | 0 | 0 |

**Baseline verdict:** App loads and navigates without errors. All 8 tested screens are reachable. No JavaScript exceptions, no failed network requests, no page errors.

---

## 3. Security Baseline

5 security findings documented in `threat-model-baseline.md`:

| ID | Severity | Target | Status |
|---|---|---|---|
| SEC-01 | P1 | Base64 credentials in js/auth.js | open |
| SEC-02 | P1 | localStorage purchase bypass | open |
| SEC-03 | P1 | Session forgery | open |
| SEC-04 | P2 | No Content Security Policy | open |
| SEC-05 | P1 | Simulated checkout (no real payment) | open |

**P1 findings: 4 (block release).** These are all known issues with the current client-side-only architecture. The backend migration docs (docs/backend/) document the remediation path (Supabase Auth + Stripe), but implementation has not started.

---

## 4. Data Flow Summary

```
User → index.html (SPA)
  → js/auth.js (sessionStorage auth)
  → js/app.js (AppState, screens, flows)
  → js/poses-data.js (POSES_LIBRARY + localStorage persist/restore)
  → js/pose-skeleton-3d.js (canvas renderer)
  → js/camera.js (getUserMedia → canvas → toDataURL → localStorage)
  → js/tour-engine.js (tour CRUD → localStorage)
  → js/pose-animations.js (entry animations)

No backend. No API calls. No server-side validation.
All data in localStorage. All auth in sessionStorage.
```

---

## 5. Known Limitations

1. **No backend:** All security findings (SEC-01 through SEC-05) require backend implementation to fully resolve. The docs/backend/ directory documents the path but implementation is out of scope for this campaign (which focuses on the current static site).

2. **Pose forensics scale:** 745 poses × 4 overlay modes × 4 views = 11,920 individual captures per iteration. The campaign uses automation (geometry-sweep.js + forensic-pose.js) to scale this, but individual human-quality review requires subagent dispatch.

3. **Camera testing:** Camera (getUserMedia) requires user permission. In headless browser, camera may not initialize. Camera flows are tested for screen reachability, not for actual capture quality.

4. **Production testing:** Restricted to passive inspection. No active security testing against the deployed site.

---

## Phase 2 Gate Check

| Criterion | Status |
|---|---|
| Baseline failures exist as Red evidence | ✅ 100 MAJOR pose defects + 5 security findings |
| Security and privacy attack surfaces mapped | ✅ 12 attack surfaces documented |
| No implementation begins before baseline | ✅ No source files modified |
| Existing test scripts run | ✅ geometry-sweep + joint_validator executed |

**Phase 2 Gate: PASSED. Proceed to Iteration 1.**
