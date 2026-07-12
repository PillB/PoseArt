# PoseArt Programmatic Joint Validator Report

**Validator date:** 2026-07-12T21:51:39.085Z
**Total poses scanned:** 745
**Poses with issues:** 37 (5.0%)
**Poses clean:** 708 (95.0%)

## Issue type tally

| Issue type | Count |
|---|---|
| sign_error | 29 |
| recline_missing | 7 |
| arm_direction | 1 |
| too_subtle | 0 |
| object_mismatch | 0 |
| object_missing | 0 |

## Issues per category

| Category | Poses with issues | Total poses | % |
|---|---|---|---|
| accessible | 0 | 30 | 0.0% |
| boudoir | 9 | 161 | 5.6% |
| couple | 0 | 30 | 0.0% |
| dynamic | 0 | 30 | 0.0% |
| eccentric | 1 | 44 | 2.3% |
| editorial | 0 | 30 | 0.0% |
| fashion | 2 | 30 | 6.7% |
| fine-art | 2 | 30 | 6.7% |
| high-to-low | 2 | 30 | 6.7% |
| kneeling | 0 | 32 | 0.0% |
| lean-seat | 0 | 30 | 0.0% |
| leaning | 11 | 49 | 22.4% |
| low-to-high | 3 | 30 | 10.0% |
| reclining | 0 | 56 | 0.0% |
| seated | 6 | 86 | 7.0% |
| standing | 1 | 47 | 2.1% |

## Top 50 worst-offender poses (by issue count)

| Pose | Category | Issues |
|---|---|---|
| back-arch | standing | sign_error:spine |
| lounger-recline | seated | sign_error:hipAbduct |
| wall-lean | leaning | sign_error:hipAbduct |
| elbow-ledge | leaning | sign_error:spine |
| column-lean | leaning | sign_error:hipAbduct |
| car-lean | leaning | sign_error:hipAbduct |
| railing-lean | leaning | sign_error:hipAbduct |
| cross-legged-wall | leaning | sign_error:hipAbduct |
| pillar-wrap | leaning | sign_error:hipAbduct |
| gate-lean | leaning | sign_error:hipAbduct |
| bench-lean-side | leaning | sign_error:hipAbduct |
| fineart-standing-still-life-drape | fine-art | recline_missing:globalTilt |
| fineart-standing-hand-to-heart | fine-art | recline_missing:globalTilt |
| fashion-accessory-focus-hand | fashion | sign_error:hipAbduct |
| fashion-editorial-brand-stare | fashion | sign_error:hipAbduct |
| lowhigh-roll-to-side-rise-begin | low-to-high | recline_missing:globalTilt |
| lowhigh-hands-knees-push-up | low-to-high | recline_missing:globalTilt |
| lowhigh-kneel-lean-forward-rise | low-to-high | recline_missing:globalTilt |
| highlow-knees-bending-controlled | high-to-low | recline_missing:globalTilt |
| highlow-arms-wide-falling-open | high-to-low | recline_missing:globalTilt |
| p12-wall-s8-one-leg-up-wall | leaning | arm_direction:shoulders |
| p09-unconv-s1-forward-bend-heels | eccentric | sign_error:spine |
| p06-chair-b1-seated-legs-crossed-shin | boudoir | sign_error:hipAbduct |
| p06-chair-b2-seated-hand-forehead | boudoir | sign_error:hipAbduct |
| p06-chair-b3-seated-knees-bent-hands-clasped | boudoir | sign_error:hipAbduct |
| p06-chair-b5-legs-crossed-hair-hip | boudoir | sign_error:hipAbduct |
| p05-bench-b6-side-sit-lean-armrest | boudoir | sign_error:hipAbduct |
| p03-bed-b1-prone-belly-legs-crossed-shin | boudoir | sign_error:hipAbduct |
| p03-bed-b2-prone-belly-arch-hips-up-eyes-closed | boudoir | sign_error:hipAbduct |
| p03-bed-b3-prone-belly-arch-legs-extended-crossed | boudoir | sign_error:hipAbduct |
| p03-bed-b5-prone-belly-elevated-hands-crossed-facing | boudoir | sign_error:hipAbduct |
| p04-wall-w8-arms-chest-against-wall-back-camera | leaning | sign_error:hipAbduct |
| p01-master-s1-chair-legs-side-crossed | seated | sign_error:hipAbduct |
| p01-master-s2-chair-hand-forehead | seated | sign_error:hipAbduct |
| p01-master-s5-chair-hair-touch-hip | seated | sign_error:hipAbduct |
| p01-master-s14-chair-floor-back-against-knees-apart | seated | sign_error:hipAbduct |
| p01-master-s17-chair-back-seat-hair-touch | seated | sign_error:hipAbduct |

## All poses with issues (full list)

### back-arch (standing)
**Name:** Back Arch
**Issues (1):**
- **sign_error** — description says "arch spine back" but spine is positive (forward fold)
  - Fix: spine should be negative (backward arch)

### lounger-recline (seated)
**Name:** Lounger Recline
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### wall-lean (leaning)
**Name:** Wall Lean
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### elbow-ledge (leaning)
**Name:** Elbow Ledge
**Issues (1):**
- **sign_error** — description says forward lean/fold but spine is negative (backward arch)
  - Fix: spine should be positive (forward fold)

### column-lean (leaning)
**Name:** Column Lean
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### car-lean (leaning)
**Name:** Car Lean
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### railing-lean (leaning)
**Name:** Railing Lean
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### cross-legged-wall (leaning)
**Name:** Cross-Legged Wall
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### pillar-wrap (leaning)
**Name:** Pillar Wrap
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### gate-lean (leaning)
**Name:** Gate Lean
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### bench-lean-side (leaning)
**Name:** Bench Lean Side
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

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

### fashion-accessory-focus-hand (fashion)
**Name:** Accessory Focus Hand
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### fashion-editorial-brand-stare (fashion)
**Name:** Brand Forward Stare
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

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

### p09-unconv-s1-forward-bend-heels (eccentric)
**Name:** Standing Forward Bend in Heels
**Issues (1):**
- **sign_error** — description says forward lean/fold but spine is negative (backward arch)
  - Fix: spine should be positive (forward fold)

### p06-chair-b1-seated-legs-crossed-shin (boudoir)
**Name:** Chair Seated Legs Crossed at Shin
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p06-chair-b2-seated-hand-forehead (boudoir)
**Name:** Chair Seated Hand to Forehead
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p06-chair-b3-seated-knees-bent-hands-clasped (boudoir)
**Name:** Chair Seated Both Knees Bent Hands Together
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p06-chair-b5-legs-crossed-hair-hip (boudoir)
**Name:** Chair Legs Crossed Hair Touch Hip Hand
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p05-bench-b6-side-sit-lean-armrest (boudoir)
**Name:** Bench Side Sitting Lean Toward Armrest
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p03-bed-b1-prone-belly-legs-crossed-shin (boudoir)
**Name:** Bed Prone Belly Legs Crossed at Shin
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p03-bed-b2-prone-belly-arch-hips-up-eyes-closed (boudoir)
**Name:** Bed Prone Belly Arch Hips Up
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p03-bed-b3-prone-belly-arch-legs-extended-crossed (boudoir)
**Name:** Bed Prone Belly Arch Legs Extended Crossed
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p03-bed-b5-prone-belly-elevated-hands-crossed-facing (boudoir)
**Name:** Bed Prone Belly Elevated Hands Crossed Facing Camera
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p04-wall-w8-arms-chest-against-wall-back-camera (leaning)
**Name:** Wall Chest Against Wall Back to Camera
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p01-master-s1-chair-legs-side-crossed (seated)
**Name:** Chair Sit Legs Extended Side Crossed
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p01-master-s2-chair-hand-forehead (seated)
**Name:** Chair Sit One Arm Elevated Hand to Forehead
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p01-master-s5-chair-hair-touch-hip (seated)
**Name:** Chair Sit Legs Extended Hair Touch Hip Hand
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p01-master-s14-chair-floor-back-against-knees-apart (seated)
**Name:** Floor Seated Against Chair Knees Apart Facing Camera
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p01-master-s17-chair-back-seat-hair-touch (seated)
**Name:** Sitting on Chair Back Hand on Armrest Hand in Hair
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

