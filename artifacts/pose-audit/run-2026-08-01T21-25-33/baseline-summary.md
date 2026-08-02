# Phase 0 Baseline Summary — PoseArt Forensic Pose Validation

**Run ID:** `run-2026-08-01T21-25-33`
**Date:** 2026-08-01
**Repo:** github.com/PillB/PoseArt @ master (commit 30d1aed)
**Local server:** http://127.0.0.1:8095 (python3 http.server, background)

## Baseline gate (protocol §9): PASS

| Criterion | Result |
|---|---|
| Inventory deterministic | YES — 745 poses, 16 categories, 0 structural issues |
| Every pose has one category | YES |
| Every category has enumerated ordered pose list | YES |
| Existing failures preserved as evidence | YES — joint_validator 0-issue report retained |
| No implementation code changed | YES — no edits to js/* or index.html |

## Runtime inventory (authoritative, derived from POSES_LIBRARY)

| Category | Poses |
|---|---|
| standing | 47 |
| seated | 86 |
| leaning | 49 |
| lean-seat | 30 |
| kneeling | 32 |
| reclining | 56 |
| dynamic | 30 |
| eccentric | 44 |
| couple | 30 |
| accessible | 30 |
| boudoir | 161 |
| editorial | 30 |
| fine-art | 30 |
| fashion | 30 |
| low-to-high | 30 |
| high-to-low | 30 |
| **TOTAL** | **745** |

## Existing validator baseline (preserved)
`scripts/joint_validator.js` (config-only heuristic): **0 issues across 745 poses**.
This is a known false-clean signal — it never derives coordinates, only checks
raw config values against regex on descriptions. Protocol §19 explicitly warns
such a suite is too weak.

## Geometry sweep baseline (new, derived coordinates)
`audit_harness/geometry-sweep.js` runs the REAL renderer `buildPose` in a Node
VM for all 745 poses (64ms total) and derives anatomy from the resulting joint
coordinates. Results:

- **513 poses with at least one defect** (vs 0 from joint_validator)
- **1336 total defects**
- **115 MAJOR semantic defects** (pose meaning materially differs from description)
- 711 plausibility flags (anomaly detectors — many false positives on extreme poses)
- 502 anomalies (segment asymmetry, joint inversions, proximity)

### Defect tally (MAJOR semantic, by type)
| Defect type | Count | Example |
|---|---|---|
| torso_forward (sign error) | 35 | elbow-prop: torso flexion -15° but desc says forward lean |
| reclining (globalTilt missing) | 29 | floor-cross-leg: desc says "on floor" but no globalTilt (some false positives) |
| knees_to_one_side (symmetry) | 24 | soft-sit: L/R hip flexion 85°/85° identical |
| legs_crossed | 6 | meditation-palms: hipAbduct both positive (spread) but desc says crossed |
| arms_overhead | 4 | description says arms overhead but shoulder abduction < 120° |
| elbow_on_knee (contact) | 5 | chair-lean-forward: elbow 0.56 units from knee |
| arms_crossed | 4 | neither wrist crosses body midline |
| torso_back | 4 | tabletop-sit: torso flexion 10° forward but desc says arch back |
| knees_together | 4 | perch-edge: hipAbduct positive but desc says together |
| kneeling | 3 | max knee flexion < 60° |

### Defects by category (total / withDefects / major)
```
seated        86 /  67 / 19   boudoir      161 / 134 / 13
lean-seat     30 /  14 / 11   kneeling      32 /  23 / 10
reclining     56 /  52 /  8   accessible    30 /  17 /  7
fine-art      30 /  27 /  6   eccentric     44 /  30 /  5
editorial     30 /  30 /  5   fashion       30 /   9 /  5
leaning       49 /  21 /  4   high-to-low   30 /  22 /  4
standing      47 /  23 /  3   couple        30 /   5 /  3
dynamic       30 /  22 /  1   low-to-high   30 /  17 /  1
```

## Confirmed defect: Soft Sit (worked example, full forensic baseline)
- **Pose:** soft-sit (seated), joints: spine:18, leftHip:85, rightHip:85, leftKnee:90, rightKnee:95, hipAbductL:20, hipAbductR:20, shoulderFwdL:7, shoulderFwdR:-5
- **Instructions:** "Perch on the front third of the seat... Lean the torso a few degrees forward from the hips and angle both knees to one side rather than square to camera."
- **Derived geometry (front view):** torso flexion 18° (✓ slight forward), lateral 0° (✓ spine tall), L/R hip flexion 85°/85° (✗ SYMMETRIC — not "to one side"), L/R knee 82°/87° (✓ right angle).
- **VLM cross-check:** perceived "knees to right side" — but geometry proves symmetry. Front-view perspective creates directional illusion. Defect CONFIRMED by geometry (protocol §4: screenshot-only insufficient).
- **Severity:** MAJOR (reads as symmetrical knees-forward seat, which instructions explicitly forbid).
- **Artifacts:** categories/seated/soft-sit/baseline/{auto,front,side,quarter}.png + geometry.json + forensic.md + console.json (0 errors) + views.json (all 4 view buttons state_changed=true).

## Renderer-level finding
`shoulderFwdL`/`shoulderFwdR` (rotY sagittal flexion): code comment says "+ = arm
swings forward" but coordinate derivation shows positive value moves elbow to
-z (BEHIND the torso). Sign is inverted vs intent. Affects every pose relying
on shoulderFwdL/R for "arms forward" semantics. To be addressed as a reusable
renderer correction (protocol §17 Green tier 3) pending per-pose Red tests.

## Harness verification
- Playwright login via real UI (data-testid=login-*) — PASS
- Onboarding dismiss via real Skip links — PASS
- #tab-library nav → category card → openPoseDetail — PASS
- Render-ready: canvas + _activeSkeleton3D._state.currentPose + 2 stable frames + 1500ms settle — PASS
- 4 view buttons (auto/front/side/quarter) with state-change assertions — PASS (all 4 transitioned yaw correctly)
- Geometry extraction from window._activeSkeleton3D._state.currentPose — PASS
- 0 console/page errors during soft-sit flow

## Commands executed (exit codes)
- `node scripts/joint_validator.js` → exit 0, 0 issues (preserved baseline)
- `node audit_harness/inventory.js` → exit 0, 745/16 deterministic
- `node audit_harness/smoke-soft-sit.js` → exit 0, soft-sit forensic baseline
- `node audit_harness/geometry-sweep.js` → exit 0, 513 defect poses
- `z-ai vision -p ... -i front.png` → VLM cross-check

## Console/page errors baseline
0 console errors, 0 page errors, 0 failed requests during the soft-sit flow.
Other flows not yet swept for errors (deferred to per-pose worker runs).

## Next phase
Phase 2: dispatch worker-A/B/C/D on first 40-pose Seated shard (10 each).
Workers produce typed patch proposals (no concurrent edits to poses-data.js).
Main integrator applies sequentially + independent red-team verification.
