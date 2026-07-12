# PoseArt Programmatic Joint Validator Report

**Validator date:** 2026-07-12T21:34:30.455Z
**Total poses scanned:** 745
**Poses with issues:** 107 (14.4%)
**Poses clean:** 638 (85.6%)

## Issue type tally

| Issue type | Count |
|---|---|
| too_subtle | 82 |
| sign_error | 29 |
| recline_missing | 7 |
| arm_direction | 1 |
| object_mismatch | 0 |
| object_missing | 0 |

## Issues per category

| Category | Poses with issues | Total poses | % |
|---|---|---|---|
| accessible | 1 | 30 | 3.3% |
| boudoir | 23 | 161 | 14.3% |
| couple | 2 | 30 | 6.7% |
| dynamic | 1 | 30 | 3.3% |
| eccentric | 4 | 44 | 9.1% |
| editorial | 4 | 30 | 13.3% |
| fashion | 2 | 30 | 6.7% |
| fine-art | 7 | 30 | 23.3% |
| high-to-low | 5 | 30 | 16.7% |
| kneeling | 5 | 32 | 15.6% |
| lean-seat | 0 | 30 | 0.0% |
| leaning | 16 | 49 | 32.7% |
| low-to-high | 5 | 30 | 16.7% |
| reclining | 4 | 56 | 7.1% |
| seated | 14 | 86 | 16.3% |
| standing | 14 | 47 | 29.8% |

## Top 50 worst-offender poses (by issue count)

| Pose | Category | Issues |
|---|---|---|
| model-walk | standing | too_subtle:spine; too_subtle:hips |
| back-arch | standing | sign_error:spine; too_subtle:hips |
| chest-open | standing | too_subtle:spine; too_subtle:hips |
| weight-forward | standing | too_subtle:spine; too_subtle:hips |
| car-lean | leaning | sign_error:hipAbduct; too_subtle:hips |
| pillar-wrap | leaning | sign_error:hipAbduct; too_subtle:spine |
| boudoir-asymmetric-stool | boudoir | too_subtle:spine; too_subtle:hips |
| fineart-standing-still-life-drape | fine-art | too_subtle:shoulders; recline_missing:globalTilt |
| lowhigh-full-standing-peak | low-to-high | too_subtle:spine; too_subtle:shoulders |
| p12-wall-s8-one-leg-up-wall | leaning | too_subtle:spine; arm_direction:shoulders |
| p09-unconv-s1-forward-bend-heels | eccentric | sign_error:spine; too_subtle:hips |
| p09-unconv-s7-seated-box-arm-overhead | eccentric | too_subtle:spine; too_subtle:shoulders |
| hip-shift | standing | too_subtle:spine |
| crossed-arms-stand | standing | too_subtle:hips |
| hand-in-pocket | standing | too_subtle:hips |
| tiptoe-reach | standing | too_subtle:spine |
| hands-clasped-front | standing | too_subtle:hips |
| profile-stand | standing | too_subtle:spine |
| runway-stop | standing | too_subtle:spine |
| soft-sit | seated | too_subtle:spine |
| chair-back-lean | seated | too_subtle:spine |
| lounger-recline | seated | sign_error:hipAbduct |
| wall-lean | leaning | sign_error:hipAbduct |
| doorframe-lean | leaning | too_subtle:spine |
| elbow-ledge | leaning | sign_error:spine |
| column-lean | leaning | sign_error:hipAbduct |
| tree-lean | leaning | too_subtle:hips |
| railing-lean | leaning | sign_error:hipAbduct |
| cross-legged-wall | leaning | sign_error:hipAbduct |
| ledge-lean-elbow | leaning | too_subtle:hips |
| hip-pop-wall | leaning | too_subtle:spine |
| gate-lean | leaning | sign_error:hipAbduct |
| bench-lean-side | leaning | sign_error:hipAbduct |
| prayer-kneeling | kneeling | too_subtle:spine |
| one-knee-look-up | kneeling | too_subtle:shoulders |
| kneeling-look-back | kneeling | too_subtle:shoulders |
| kneeling-lean-hands-floor | kneeling | too_subtle:spine |
| prone-chin | reclining | too_subtle:shoulders |
| basketball-reach | dynamic | too_subtle:spine |
| catwalk-extreme | eccentric | too_subtle:spine |
| couple-embrace | couple | too_subtle:spine |
| cradled-from-behind | couple | too_subtle:spine |
| chair-lean-back-casual | accessible | too_subtle:spine |
| boudoir-arm-overhead-stretch | boudoir | too_subtle:spine |
| boudoir-sheet-pull | boudoir | too_subtle:spine |
| boudoir-triangle-pocket | boudoir | too_subtle:spine |
| boudoir-embrace-pose | boudoir | too_subtle:spine |
| boudoir-tippy-toe-cross | boudoir | too_subtle:hips |
| boudoir-corner-pocket | boudoir | too_subtle:hips |
| editorial-sharp-angles-stand | editorial | too_subtle:spine |

## All poses with issues (full list)

### model-walk (standing)
**Name:** Model Walk
**Issues (2):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### back-arch (standing)
**Name:** Back Arch
**Issues (2):**
- **sign_error** — description says "arch spine back" but spine is positive (forward fold)
  - Fix: spine should be negative (backward arch)
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### chest-open (standing)
**Name:** Chest Open
**Issues (2):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### weight-forward (standing)
**Name:** Weight Forward
**Issues (2):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### car-lean (leaning)
**Name:** Car Lean
**Issues (2):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### pillar-wrap (leaning)
**Name:** Pillar Wrap
**Issues (2):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### boudoir-asymmetric-stool (boudoir)
**Name:** Asymmetric Stool Sit
**Issues (2):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### fineart-standing-still-life-drape (fine-art)
**Name:** Still Life Drape Stand
**Issues (2):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### lowhigh-full-standing-peak (low-to-high)
**Name:** Full Standing Peak Reach
**Issues (2):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### p12-wall-s8-one-leg-up-wall (leaning)
**Name:** One Leg Raised Against Wall
**Issues (2):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°
- **arm_direction** — description says arms at sides but shoulders are raised (< -30°)
  - Fix: shoulders should be near 0° for arms at sides

### p09-unconv-s1-forward-bend-heels (eccentric)
**Name:** Standing Forward Bend in Heels
**Issues (2):**
- **sign_error** — description says forward lean/fold but spine is negative (backward arch)
  - Fix: spine should be positive (forward fold)
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p09-unconv-s7-seated-box-arm-overhead (eccentric)
**Name:** Seated on Box, Legs Wide, Arm Overhead
**Issues (2):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### hip-shift (standing)
**Name:** Hip Shift
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### crossed-arms-stand (standing)
**Name:** Crossed Arms
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### hand-in-pocket (standing)
**Name:** Hand in Pocket
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### tiptoe-reach (standing)
**Name:** Tiptoe Reach
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### hands-clasped-front (standing)
**Name:** Hands Clasped Front
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### profile-stand (standing)
**Name:** Profile Stand
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### runway-stop (standing)
**Name:** Runway Stop
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### soft-sit (seated)
**Name:** Soft Sit
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### chair-back-lean (seated)
**Name:** Chair Back Lean
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

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

### doorframe-lean (leaning)
**Name:** Doorframe Lean
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

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

### tree-lean (leaning)
**Name:** Tree Lean
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

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

### ledge-lean-elbow (leaning)
**Name:** Ledge Lean Elbow
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### hip-pop-wall (leaning)
**Name:** Hip Pop Wall
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

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

### prayer-kneeling (kneeling)
**Name:** Prayer Kneeling
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### one-knee-look-up (kneeling)
**Name:** One Knee Look Up
**Issues (1):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### kneeling-look-back (kneeling)
**Name:** Kneeling Look Back
**Issues (1):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### kneeling-lean-hands-floor (kneeling)
**Name:** Kneeling Lean Hands Floor
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### prone-chin (reclining)
**Name:** Prone Chin
**Issues (1):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### basketball-reach (dynamic)
**Name:** Basketball Reach
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### catwalk-extreme (eccentric)
**Name:** Catwalk Extreme
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### couple-embrace (couple)
**Name:** Close Embrace
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### cradled-from-behind (couple)
**Name:** Cradled From Behind
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### chair-lean-back-casual (accessible)
**Name:** Chair Lean Back Casual
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### boudoir-arm-overhead-stretch (boudoir)
**Name:** Overhead Arm Stretch
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### boudoir-sheet-pull (boudoir)
**Name:** The Sheet Pull
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### boudoir-triangle-pocket (boudoir)
**Name:** The Triangle Pocket
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### boudoir-embrace-pose (boudoir)
**Name:** The Embrace Pose
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### boudoir-tippy-toe-cross (boudoir)
**Name:** The Tippy-Toe Cross
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### boudoir-corner-pocket (boudoir)
**Name:** Corner Pocket Press
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### editorial-sharp-angles-stand (editorial)
**Name:** Sharp Angles Stand
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### editorial-negative-space-arm (editorial)
**Name:** Negative Space Arm Line
**Issues (1):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### editorial-floor-lie-diagonal (editorial)
**Name:** Floor Diagonal Lie
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### editorial-side-lunge-sharp (editorial)
**Name:** Sharp Side Lunge
**Issues (1):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### fineart-contrapposto-classic (fine-art)
**Name:** Classical Contrapposto
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### fineart-standing-back-bend-soft (fine-art)
**Name:** Soft Standing Back Bend
**Issues (1):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### fineart-seated-profile-still (fine-art)
**Name:** Seated Profile Stillness
**Issues (1):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### fineart-standing-hand-to-heart (fine-art)
**Name:** Hand to Heart Stillness
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### fineart-kneeling-both-arms-extend-fwd (fine-art)
**Name:** Kneeling Arms Extend Forward
**Issues (1):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### fineart-standing-devant-extension (fine-art)
**Name:** Standing Devant Extension
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

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

### lowhigh-standing-side-reach-peak (low-to-high)
**Name:** Standing Side Reach Peak
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### lowhigh-kneel-lean-forward-rise (low-to-high)
**Name:** Kneel Lean Forward Into Rise
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### highlow-standing-peak-start (high-to-low)
**Name:** Standing Peak Starting Point
**Issues (1):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### highlow-knees-bending-controlled (high-to-low)
**Name:** Knees Bending Controlled Drop
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### highlow-standing-tiptoe-start-tall (high-to-low)
**Name:** Standing Tiptoe Tall Start
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### highlow-arms-wide-falling-open (high-to-low)
**Name:** Arms Wide Falling Open
**Issues (1):**
- **recline_missing** — description says lying/reclining but globalTilt <45° (not horizontal)
  - Fix: globalTilt should be 80-90° (supine) or -80 to -90° (prone)

### highlow-kneel-settle-final (high-to-low)
**Name:** Kneel Settle Final Point
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### p14-standing-s1-hip-sway-side-glance (standing)
**Name:** Overhead Arm Contrapposto
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p14-standing-s5-back-to-camera-look (standing)
**Name:** Back-to-Camera Over-Shoulder Look
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### p14-standing-s7-one-hand-hair (standing)
**Name:** One Hand in Hair, Weight Shift
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p12-wall-s1-back-lean-arms-up (leaning)
**Name:** Wall Back-Lean Arms Overhead
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p13-floor-s10-recline-ottoman-arms-up (reclining)
**Name:** Backlit Recline Against Ottoman, Arms Overhead
**Issues (1):**
- **too_subtle** — description says arms overhead but shoulders not raised enough (< -80°)
  - Fix: shoulders should be < -100° for overhead

### p10-bench-s2-all-fours-arch-back (seated)
**Name:** All-Fours Arched Back on Bench
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p09-unconv-s2-bridge-pose-floor (eccentric)
**Name:** Floor Bridge Pose
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p15-chair-s10-twist-both-hands-rail (seated)
**Name:** Chair Twist Both Hands on Rail
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### p11-armchair-s6-kneeling-back-view-armrest-grip (seated)
**Name:** Armchair Kneeling Back View Armrest Grip
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p11-armchair-s9-standing-front-hands-armrests (seated)
**Name:** Armchair Standing Front Hands on Armrests
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p18-lounge-r8-side-lying-head-propped (reclining)
**Name:** Side-Lying with Head Propped on Hand
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

### p08-male-r6-lying-back-eyes-closed-fist-face (boudoir)
**Name:** Lying Back with Eyes Closed and Fist Near Face
**Issues (1):**
- **too_subtle** — dramatic description but spine <15°
  - Fix: increase |spine| to 20-35°

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

### p06-chair-b10-armrest-hip-hand-leg (boudoir)
**Name:** Chair Armrest Seated Hip and Leg Hands
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p06-chair-b11-armrest-hair-eyes-closed (boudoir)
**Name:** Chair Armrest Seated Hair Touch Eyes Closed
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p05-bench-b6-side-sit-lean-armrest (boudoir)
**Name:** Bench Side Sitting Lean Toward Armrest
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p05-bench-b7-kneeling-hip-knee-touch (boudoir)
**Name:** Bench Kneeling Hip and Knee Touch
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p02-couch-c5-lying-sideways-elevated-hip-hand (boudoir)
**Name:** Couch Lying Sideways Upper Body Elevated Hip Hand
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p02-couch-c7-lying-sideways-twisted-breast-touch (boudoir)
**Name:** Couch Lying Sideways Twisted Toward Camera
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p02-couch-c9-armrest-seated-hip-hand-eyes-closed (boudoir)
**Name:** Couch Armrest Seated Hip Hand Eyes Closed
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

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

### p01-master-s10-chair-armrest-sit-hip-leg (seated)
**Name:** Sitting on Armrest Hand on Hip Hand on Leg
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p01-master-s11-chair-armrest-sit-hair (seated)
**Name:** Sitting on Armrest Hand on Hip Hand in Hair Eyes Closed
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p01-master-s14-chair-floor-back-against-knees-apart (seated)
**Name:** Floor Seated Against Chair Knees Apart Facing Camera
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p01-master-s16-chair-floor-lying-head-on-chair (reclining)
**Name:** Floor Lying Head Resting on Chair Eyes Closed
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

### p01-master-s17-chair-back-seat-hair-touch (seated)
**Name:** Sitting on Chair Back Hand on Armrest Hand in Hair
**Issues (1):**
- **sign_error** — description says "cross legs" but both hipAbduct values are positive (spread)
  - Fix: one hipAbduct should be negative (crossed)

### p01-master-b7-bench-kneel-hip-knee-touch (kneeling)
**Name:** Bench Kneeling Hand on Hip Hand on Knee
**Issues (1):**
- **too_subtle** — description says hip pop/weight shift but hips <12°
  - Fix: hips should be 18-30° for visible weight shift

