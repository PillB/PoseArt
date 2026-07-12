# PoseArt Programmatic Joint Validator Report

**Validator date:** 2026-07-12T21:54:54.279Z
**Total poses scanned:** 745
**Poses with issues:** 8 (1.1%)
**Poses clean:** 737 (98.9%)

## Issue type tally

| Issue type | Count |
|---|---|
| recline_missing | 7 |
| arm_direction | 1 |
| sign_error | 0 |
| too_subtle | 0 |
| object_mismatch | 0 |
| object_missing | 0 |

## Issues per category

| Category | Poses with issues | Total poses | % |
|---|---|---|---|
| accessible | 0 | 30 | 0.0% |
| boudoir | 0 | 161 | 0.0% |
| couple | 0 | 30 | 0.0% |
| dynamic | 0 | 30 | 0.0% |
| eccentric | 0 | 44 | 0.0% |
| editorial | 0 | 30 | 0.0% |
| fashion | 0 | 30 | 0.0% |
| fine-art | 2 | 30 | 6.7% |
| high-to-low | 2 | 30 | 6.7% |
| kneeling | 0 | 32 | 0.0% |
| lean-seat | 0 | 30 | 0.0% |
| leaning | 1 | 49 | 2.0% |
| low-to-high | 3 | 30 | 10.0% |
| reclining | 0 | 56 | 0.0% |
| seated | 0 | 86 | 0.0% |
| standing | 0 | 47 | 0.0% |

## Top 50 worst-offender poses (by issue count)

| Pose | Category | Issues |
|---|---|---|
| fineart-standing-still-life-drape | fine-art | recline_missing:globalTilt |
| fineart-standing-hand-to-heart | fine-art | recline_missing:globalTilt |
| lowhigh-roll-to-side-rise-begin | low-to-high | recline_missing:globalTilt |
| lowhigh-hands-knees-push-up | low-to-high | recline_missing:globalTilt |
| lowhigh-kneel-lean-forward-rise | low-to-high | recline_missing:globalTilt |
| highlow-knees-bending-controlled | high-to-low | recline_missing:globalTilt |
| highlow-arms-wide-falling-open | high-to-low | recline_missing:globalTilt |
| p12-wall-s8-one-leg-up-wall | leaning | arm_direction:shoulders |

## All poses with issues (full list)

### fineart-standing-still-life-drape (fine-art)
**Name:** Still Life Drape Stand
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### fineart-standing-hand-to-heart (fine-art)
**Name:** Hand to Heart Stillness
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### lowhigh-roll-to-side-rise-begin (low-to-high)
**Name:** Roll to Side Rising Begin
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### lowhigh-hands-knees-push-up (low-to-high)
**Name:** Hands and Knees Push-Up Point
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### lowhigh-kneel-lean-forward-rise (low-to-high)
**Name:** Kneel Lean Forward Into Rise
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### highlow-knees-bending-controlled (high-to-low)
**Name:** Knees Bending Controlled Drop
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### highlow-arms-wide-falling-open (high-to-low)
**Name:** Arms Wide Falling Open
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### p12-wall-s8-one-leg-up-wall (leaning)
**Name:** One Leg Raised Against Wall
**Issues (1):**
- **arm_direction** — description says arms at sides but shoulders are raised (< -30°)
  - Fix: shoulders should be near 0° for arms at sides

