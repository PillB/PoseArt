# PoseArt — Pose Reference Research (Archetype → Expected Joint Ranges)

**Task ID:** pose-research-1
**Agent:** pose-research-subagent
**Date:** 2025
**Source basis:** 18 web searches (z-ai web_search skill) on figure-drawing reference + anatomy sources (Wikipedia, Khan Academy, study.com, ArtEdCastro, LoveLifeDrawing, Line of Action, Bodies in Motion, NIH/PMC biomechanics, hip-flexor/kinesiology references, Pinterest pose-reference aggregators, yoga/supine pose guides).
**Raw search results:** `./research-raw/*.json` (18 files).

---

## 0. Sign Convention (authoritative for this report — per task brief)

| Joint | PoseArt sign |
|---|---|
| `spine` | `+` = forward lean, `-` = backward lean |
| `leftShoulder` / `rightShoulder` (coronal abduction) | `-` = raise up/overhead, `+` = swing back |
| `leftElbow` / `rightElbow` | `+` = bend inward/forward |
| `leftHip` / `rightHip` (sagittal flexion) | `+` = leg swings forward |
| `leftKnee` / `rightKnee` | `+` = shin bends backward (knee flexion) |
| `hipAbductL` / `hipAbductR` | `+` = adduction (inward/cross), `-` = abduction (outward) |
| `shoulderFwdL` / `shoulderFwdR` (sagittal flexion) | `+` = behind, `-` = forward |
| `globalTilt` | `+90` = prone (face down), `-90` = supine (on back) |

> ⚠️ **Convention discrepancy flagged.** PoseArt worklog (Task 0, line ~24) records `hipAbductL/R: + = leg spreads outward` and `globalTilt: +90 = supine, -90 = prone` — the **opposite** signs to this task brief. The ranges below follow the **task brief's** convention. Before applying these ranges to `poses-data.js`, the renderer sign for `hipAbduct` and `globalTilt` must be reconciled (likely a documentation flip, not a code flip — see §"Cross-check" at end). Until reconciled, ranges for abduction/globalTilt should be tested against an actual pose in the renderer before bulk-correcting `poses-data.js`.

All ranges are in degrees, signed per the table above. "L" / "R" columns apply symmetrically per side; ranges are for the **expected** archetype (one canonical example per archetype). Poses outside these ranges are candidates for forensic review.

---

## 1. Contrapposto Stance

**Visual (figure-drawing reference):** Standing relaxed; weight on one leg (the *engaged* leg, straight), the other (*free*) leg relaxed with knee slightly soft. Hips tilt toward the engaged leg; shoulders counter-tilt opposite; spine traces a subtle S-curve (Wikipedia: "S-shape curved stance"). Often the free leg is shifted slightly forward or to the side. Head often balanced over the engaged hip.

Sources: Wikipedia "Contrapposto"; Khan Academy "Contrapposto explained"; study.com; SLAM "Noticing Contrapposto"; LoveLifeDrawing "7 tools to give WEIGHT to your figures".

| Joint | Range | Notes |
|---|---|---|
| `spine` | `-3` … `+5` | Near-upright; subtle S-curve, net lean slightly forward |
| `hips` (rotZ pelvis tilt) | `±5 … ±12` | Pelvis tilts toward engaged-leg side (sign depends on which leg engaged) |
| `neck` | `±3 … ±8` | Counter-tilt to shoulders |
| `leftShoulder` / `rightShoulder` | `0 … -5` | Arms hang relaxed; nearly vertical |
| `shoulderFwdL` / `shoulderFwdR` | `-3 … +3` | Arms hang at sides (slightly forward of coronal plane anatomically, but visually near 0) |
| `leftElbow` / `rightElbow` (engaged side) | `0 … +5` | Straight |
| `leftElbow` / `rightElbow` (free side) | `+10 … +25` | Soft bend — the giveaway of relaxation |
| `leftHip` / `rightHip` (engaged) | `0` | Standing straight |
| `leftHip` / `rightHip` (free) | `+10 … +25` | Free leg swung slightly forward/relaxed |
| `leftKnee` / `rightKnee` (engaged) | `0` | Fully extended (load-bearing) |
| `leftKnee` / `rightKnee` (free) | `+10 … +30` | Slight flexion |
| `hipAbductL/R` (free side) | `-8 … -20` | Free leg drifts slightly outward |
| `globalTilt` | `0` | Upright |

---

## 2. Arms Crossed (Standing)

**Visual:** Standing upright, arms folded across the chest. Each forearm crosses the torso diagonally; each hand rests on the opposite upper arm (just above the elbow) or on the opposite elbow. Elbows pointed outward and slightly down. Often connotes confidence, defensiveness, or casual authority.

Sources: Pinterest "Crossed Arms Reference"; KittenChomp "Arms Crossed 3/4 View"; Circle Line Art School "How to Draw A Person Standing with Arms Crossed".

| Joint | Range | Notes |
|---|---|---|
| `spine` | `-5 … +5` | Upright or slight backward lean (relaxed authority) |
| `hips` | `0` | Level pelvis |
| `neck` | `0 … ±5` | Neutral |
| `leftShoulder` / `rightShoulder` | `-10 … -25` | Slight abduction so forearms clear torso |
| `shoulderFwdL` / `shoulderFwdR` | `-30 … -55` | Both arms swing forward to cross in front |
| `leftElbow` / `rightElbow` | `+85 … +120` | Deep bend so forearm reaches across |
| `leftHip` / `rightHip` | `0 … +10` | Standing; possibly slight contrapposto |
| `leftKnee` / `rightKnee` | `0 … +10` | Knees straight or very soft |
| `hipAbductL/R` | `0 … -10` | Arms cross via elbow adduction; leg stance neutral |
| `globalTilt` | `0` | Upright |

---

## 3. Hand on Hip (Akimbo)

**Visual:** Standing; one hand placed on the hip with elbow pointed outward and slightly back, thumb typically behind the hip, fingers forward. Other arm hangs relaxed. Often connotes attitude, confidence, or fashion-model posture. May be paired with contrapposto.

Sources: "Hands On Hips Poses" reference collections; EtheringtonBrothers "How to THINK When You Draw ARMS AKIMBO!"; Pinterest hand-on-hip reference.

| Joint | Range (akimbo side) | Range (free side) | Notes |
|---|---|---|---|
| `spine` | `-5 … +8` | — | Slight asymmetry, often leaning slightly toward free side |
| `hips` | `0 … ±8` | — | Slight pelvic tilt if combined with contrapposto |
| `shoulder` | `-25 … -50` | `0 … -5` | Akimbo arm abducted outward |
| `shoulderFwd` | `-10 … +10` | `0` | Mostly neutral in sagittal plane (hand rests at hip) |
| `elbow` | `+80 … +115` | `0 … +10` | Bent so hand reaches hip |
| `hip` | `0 … +15` | `0 … +15` | Standing; weight distribution can vary |
| `knee` | `0 … +15` | `0 … +15` | Slight bend possible (contrapposto) |
| `hipAbduct` | `-10 … -25` | `0` | Elbow flares outward (shoulder-abduction footprint) |
| `globalTilt` | `0` | `0` | Upright |

---

## 4. Sitting Cross-Legged (Tailor / "Indian-style")

**Visual:** Seated on floor, both knees flexed out to the sides, each foot tucked under the opposite thigh. Spine usually slightly forward of vertical (hands rest on knees/lap) or upright for meditation. Hips are flexed ~90°, abducted and externally rotated.

Sources: Biomechanical study (Kaplan et al. 2008, cited 35×): hip abduction mean **39°** (range 19–57°), knee flexion mean **134°** (range 126–142°), external rotation mean **49°** (range 42–58°). Cross-legged biomechanics review (2023, cited 11×).

| Joint | Range | Notes |
|---|---|---|
| `spine` | `0 … +15` | Slight forward lean for balance or hands-on-knees |
| `hips` | `0` | Level pelvis (seated) |
| `neck` | `0 … ±5` | Neutral |
| `leftShoulder` / `rightShoulder` | `0 … -10` | Arms relaxed |
| `shoulderFwdL` / `shoulderFwdR` | `-10 … +5` | Hands may rest on knees (slight forward reach) |
| `leftElbow` / `rightElbow` | `0 … +40` | Slight bend if hands rest on knees/lap |
| `leftHip` / `rightHip` | `+80 … +100` | Hip flexion ~90° |
| `leftKnee` / `rightKnee` | `+120 … +145` | Deep knee flexion (~134° mean) |
| `hipAbductL/R` | `-20 … -60` | Abduction outward (~39° mean) — sign **negative** per task convention |
| `globalTilt` | `0` | Vertical body axis (seated upright) |

> External rotation of the hip (~49°) is not directly modeled in PoseArt's named joints; it would manifest as a combination of hipAbduct + knee direction (the shin points outward). When validating, check that the figure's feet end up *under the opposite thighs*, not flat in front.

---

## 5. Half-Kneeling

**Visual:** One knee on the ground (the *down* knee, shin flat on floor pointing back), opposite foot planted in front (the *up* knee bent to ~90°). Torso upright. A lunge-like stable base often used for proposed-ring, ground-level work, archery, gardening.

Sources: Exercise-physiology references — Provencal "Half-Kneeling" (split stance, both knees flexed at ~90°); half-kneeling hip-flexor stretch guides confirm front knee over ankle, back knee under hip.

| Joint | Range (front / up leg) | Range (back / down leg) | Notes |
|---|---|---|---|
| `spine` | `0 … +8` | — | Mostly upright |
| `hips` | `0 … ±5` | — | Slight pelvic leveling |
| `neck` | `0 … ±5` | — | Neutral |
| `leftShoulder` / `rightShoulder` | `0 … -20` | — | Arms neutral or one raised |
| `shoulderFwdL/R` | `0 … -30` | — | Often one arm reaches forward |
| `leftElbow` / `rightElbow` | `0 … +60` | — | Variable |
| `hip` (front) | `+80 … +95` | — | Thigh horizontal, hip flexed 90° |
| `hip` (back) | — | `-5 … -20` | Slight hip **extension** (thigh points back/down); sign **negative** |
| `knee` (front) | `+85 … +100` | — | Knee flexed 90° |
| `knee` (back/down) | — | `+85 … +115` | Down knee flexed 90°+ (shin lies on floor pointing back) |
| `hipAbduct` (front) | `0 … -10` | `0 … -10` | Stance shoulder-width |
| `globalTilt` | `0` | `0` | Vertical body axis |

---

## 6. Reclining on Back (Supine)

**Visual:** Lying flat on the back, body horizontal. Variants: (a) legs straight and flat; (b) knees bent up, feet flat (constructive rest / 90-90); (c) one knee raised; (d) arms relaxed at sides, behind head, or outstretched. Common in figure-drawing "reclining nude" tradition.

Sources: Pinterest "Reclining Pose Reference"; FORCE Friday 213 "How to Draw Laying Down Poses"; Line of Action reclining sets; yoga "Supine Yoga Poses" (18 asanas with photos).

| Joint | Range (legs straight) | Range (knees bent up) | Notes |
|---|---|---|---|
| `spine` | `0 … +5` | `0 … +10` | Slight forward curvature (lumbar neutral on floor) |
| `globalTilt` | **`-90`** | **`-90`** | Supine per task convention |
| `leftHip` / `rightHip` | `0 … +15` | `+80 … +95` | Straight-leg variant near 0; knees-up ~90° flexion |
| `leftKnee` / `rightKnee` | `0 … +10` | `+80 … +105` | Straight or bent |
| `hipAbductL/R` | `0 … -15` | `0 … -20` | Feet may splay slightly outward in relaxation |
| `leftShoulder` / `rightShoulder` | `0 … -150` | `0 … -150` | Arms at sides (0) or behind head (-90 to -150) |
| `shoulderFwdL/R` | `0 … -15` | `0 … -15` | Arms lie naturally slightly forward of coronal plane when supine |
| `leftElbow` / `rightElbow` | `0 … +40` | `0 … +60` | Slight bend from relaxation or hands behind head |

---

## 7. Reclining Prone (Face Down)

**Visual:** Lying face-down on the ground, body horizontal. Head usually turned to one side (resting on cheek). Arms often bent at elbows with hands near shoulders/face (forearms under torso or beside head). Legs usually straight, sometimes one knee slightly bent.

Sources: Pinterest "Lying Face Down Pose Reference"; FORCE Friday 213; Bodies in Motion; Line of Action prone sets.

| Joint | Range | Notes |
|---|---|---|
| `spine` | `0 … +10` | Slight forward curvature (lumbar) |
| `globalTilt` | **`+90`** | Prone per task convention |
| `leftHip` / `rightHip` | `-10 … +5` | Legs straight or slightly extended |
| `leftKnee` / `rightKnee` | `0 … +40` | Usually straight; sometimes one bent (e.g., kicking up) |
| `hipAbductL/R` | `0 … -15` | Slight outward splay common |
| `leftShoulder` / `rightShoulder` | `0 … -60` | Arms relaxed beside torso, or raised (hands by shoulders) |
| `shoulderFwdL/R` | `0 … +45` | Arms often tucked slightly under body or forward by head |
| `leftElbow` / `rightElbow` | `+30 … +110` | Variable; bent for hand-near-face variants |

---

## 8. Arms Overhead

**Visual:** Standing (or kneeling) with both arms raised vertically overhead — full shoulder flexion/abduction. Body upright. Common in dance, celebration, stretching, basketball/reaching poses. Often paired with slight spine counter-lean.

Sources: "Arms Raised Pose Reference"; "Drawing arms raised over head pose"; DerSketchie "Arms Above the Shoulder/Head Tutorial"; anatomical glenohumeral range (Flexion 110°, Abduction 120° native — overhead combines with scapular elevation to reach 180°).

| Joint | Range | Notes |
|---|---|---|
| `spine` | `-5 … +5` | Mostly upright; tiny backward counter-lean possible |
| `hips` | `0` | Level |
| `neck` | `-5 … +5` | Head neutral or slight upward tilt |
| `leftShoulder` / `rightShoulder` | **`-150 … -180`** | Full coronal abduction to vertical — sign strongly **negative** |
| `shoulderFwdL/R` | `-10 … -30` | Arms reach slightly forward of vertical (anatomical overhead is ~10–20° forward of pure coronal) |
| `leftElbow` / `rightElbow` | `0 … +30` | Usually straight; soft bend acceptable |
| `leftHip` / `rightHip` | `0` | Standing |
| `leftKnee` / `rightKnee` | `0 … +10` | Standing straight or soft |
| `hipAbductL/R` | `0 … -10` | Arms together overhead (narrow) or slight outward |
| `globalTilt` | `0` | Upright |

---

## 9. Hand to Face / Chin Rest (Thinking Pose)

**Visual:** Seated or standing; one hand resting on chin or cheek, elbow pointed outward and often propped on knee or other hand (two-stage support). Other arm relaxed or supporting. Connotes contemplation, judgment, weariness.

Sources: Pinterest "Hand on Chin Reference"; "Holding Chin Poses" (3D pose collections); "Thinking Poses Drawing"; "Hands on Face Drawing Base".

| Joint | Range (active side) | Range (support side) | Notes |
|---|---|---|---|
| `spine` | `+5 … +20` | — | Slight forward lean toward the resting hand |
| `hips` | `0 … ±5` | — | Slight tilt |
| `neck` | `-5 … +5` | — | Head tilts slightly toward active hand |
| `shoulder` (active) | `-30 … -70` | `0 … -20` | Active arm abducted outward |
| `shoulderFwd` (active) | `-40 … -80` | `0 … -20` | Active arm swung forward to face |
| `elbow` (active) | `+100 … +145` | `0 … +60` | Sharp bend — hand reaches chin |
| `hip` | `0` (standing) / `+80 … +95` (seated) | — | Depends on stance |
| `knee` | `0` (standing) / `+85 … +100` (seated) | — | Depends on stance |
| `hipAbduct` (active) | `-15 … -30` | `0 … -10` | Elbow flares outward |
| `globalTilt` | `0` | `0` | Upright |

> Common sub-variant: elbow rests on knee (seated chin-rest). Then active shoulder is more abducted (-60 to -90), elbow bend is sharper (~120°), and spine leans forward more (+15 to +30).

---

## 10. Wall Lean

**Visual:** Standing with back (or shoulder) against a wall, body weight partially supported by the wall. Hips often pushed forward, feet placed some distance from the wall. Often one foot crossed over the other ankle, or one foot propped flat on the wall behind. Connotes casual, cool, or relaxed attitudes.

Sources: Pinterest "Lean on Wall Pose Reference"; "Female figure leaning back anatomy pose drawing reference gesture"; Proko/Line of Action leaning sets.

| Joint | Range (back-against-wall) | Range (shoulder-against-wall) | Notes |
|---|---|---|---|
| `spine` | `-10 … -25` | `-15 … -35` | Backward lean |
| `hips` | `0 … ±5` | `0 … ±5` | Slight |
| `neck` | `-5 … +10` | `-5 … +10` | Often tilted down/away |
| `leftShoulder` / `rightShoulder` | `0 … -20` | `0 … -30` | Arms relaxed or crossed |
| `shoulderFwdL/R` | `0 … +10` | `+10 … +30` (lean-side arm) | Arm on wall side is behind plane |
| `leftElbow` / `rightElbow` | `0 … +90` | `0 … +90` | Variable (arms crossed, hands in pockets, etc.) |
| `leftHip` / `rightHip` | `0 … +20` | `0 … +25` | Hips push forward of feet; one leg may be propped |
| `leftKnee` / `rightKnee` | `0 … +90` | `0 … +90` | One knee may be bent with foot on wall |
| `hipAbductL/R` | `0 … -15` | `0 … -15` | Stance variable |
| `globalTilt` | `0` | `0` | Body axis still vertical (just leaning) |

---

## 11. Chair Lean Forward

**Visual:** Seated on a chair, leaning forward — elbows typically resting on thighs or knees, hands clasped or supporting the chin. Hips flexed more than 90°. Common for "listening intently", "deep in thought", "ready to stand".

Sources: Pinterest "Sitting Forward Pose Reference"; Circle Line Art "How to draw a person leaning back in a chair with legs up"; "How to Draw 12 Seated & Reclining Poses"; Gesture Drawing seated references.

| Joint | Range | Notes |
|---|---|---|
| `spine` | `+20 … +45` | Forward lean |
| `hips` | `0 … ±5` | Slight |
| `neck` | `0 … +15` | Often tilted down toward lap |
| `leftShoulder` / `rightShoulder` | `0 … -20` | Slight raise if elbows on thighs |
| `shoulderFwdL/R` | `-20 … -55` | Arms reach forward to thighs/lap |
| `leftElbow` / `rightElbow` | `+30 … +90` | Bent; forearms rest on thighs |
| `leftHip` / `rightHip` | `+95 … +115` | Hip flexion > 90° (deeper than neutral seated) |
| `leftKnee` / `rightKnee` | `+80 … +110` | Knees bent ~90°+ |
| `hipAbductL/R` | `0 … -10` | Feet flat, shoulder-width |
| `globalTilt` | `0` | Vertical body axis (seated) |

---

## 12. Crouching

**Visual:** Low squat — knees bent deeply, hips dropped near heels, torso leaned forward, often arms extended forward for balance or hands resting on knees. Feet flat on floor (deep squat) or on balls of feet (toe-crouch). Two sub-types: half-squat (knee flexion ~70–100°) and full/deep squat (knee flexion ~100–140°).

Sources: NIH/PMC "Biomechanical Review of the Squat Exercise" (cited 98×): partial squat 45°, half-squat 70–100°, full squat ~100–140°; Pinterest crouch reference; squat-form anatomy articles.

| Joint | Range (full crouch) | Range (half-crouch / mini-squat) | Notes |
|---|---|---|---|
| `spine` | `+30 … +60` | `+15 … +30` | Forward lean for balance |
| `hips` | `0 … ±5` | `0` | Slight |
| `neck` | `0 … +15` | `0 … +10` | Often slightly down |
| `leftShoulder` / `rightShoulder` | `0 … -30` | `0 … -15` | Arms forward for balance or hanging |
| `shoulderFwdL/R` | `-30 … -70` | `0 … -30` | Arms reach forward (counterweight) |
| `leftElbow` / `rightElbow` | `+20 … +70` | `+10 … +40` | Slight bend |
| `leftHip` / `rightHip` | `+100 … +130` | `+45 … +80` | Deep hip flexion |
| `leftKnee` / `rightKnee` | `+100 … +140` | `+45 … +100` | Deep knee flexion |
| `hipAbductL/R` | `-10 … -30` | `0 … -15` | Legs splay outward for stability |
| `globalTilt` | `0` | `0` | Vertical body axis |

---

## 13. Leap / Dynamic Extension

**Visual:** Body airborne, typically mid-jump. One leg extended behind (hip extension, knee straight or softly bent — the *trailing* leg), other leg flexed forward (knee up — the *leading* leg). Arms windmill upward and forward for momentum. Spine leans forward in the direction of travel. Highly variable by leap type (vertical jump, long jump, grand jeté split-leap).

Sources: Pinterest "Leaping Pose Reference"; FORCE Friday 215 "How to Draw Jumping Poses with FORCE"; HAELE 3D "Anatomy drawing reference for jumping figure pose"; "How to Draw ANY Dynamic Pose".

| Joint | Range (leading leg / forward) | Range (trailing leg / back) | Notes |
|---|---|---|---|
| `spine` | `+10 … +30` | — | Forward lean in direction of travel |
| `hips` | `0 … ±8` | — | Slight |
| `neck` | `0 … +15` | — | Often tilted up/forward |
| `leftShoulder` / `rightShoulder` | `-60 … -150` | — | Arms wind up overhead |
| `shoulderFwdL/R` | `-30 … -90` | — | Arms reach forward/up |
| `leftElbow` / `rightElbow` | `+10 … +60` | — | Slight bend for dynamic line |
| `hip` (leading) | `+30 … +90` | — | Leading knee lifted |
| `hip` (trailing) | — | `-20 … -50` | Trailing leg extended back (hip extension; sign **negative**) |
| `knee` (leading) | `+30 … +90` | — | Leading knee bent |
| `knee` (trailing) | — | `0 … +30` | Trailing leg nearly straight (grand jeté) or softly bent |
| `hipAbduct` | `0 … -45` | `0 … -45` | Split-leap abducts both legs outward |
| `globalTilt` | `0 … +15` | — | May tilt slightly forward in direction of travel |

---

## 14. Couple Embrace

**Visual:** Two figures facing each other, bodies close, arms wrapped around each other's back or waist. Heads often tilted toward each other; one figure may have head on the other's shoulder. Slight forward lean from both. Highly variable (romantic embrace, friendly hug, side-hug, lift-hug).

Sources: Pinterest "Embrace pose reference"; "Hugging Poses" collections (AdorkaStock, etc.); "How to Draw People Hugging"; "Two People Embrace illustrations".

> Note: PoseArt is a single-figure app, so this archetype applies when one figure of an intended couple-pose has been authored in isolation. The expected joint ranges below describe one figure in a face-to-face embrace.

| Joint | Range | Notes |
|---|---|---|
| `spine` | `+5 … +25` | Forward lean toward partner |
| `hips` | `0 … ±5` | Slight |
| `neck` | `±5 … ±20` | Tilted toward partner |
| `leftShoulder` / `rightShoulder` | `-10 … -35` | Both arms raised to wrap around partner |
| `shoulderFwdL/R` (left arm, reaches around far side) | `-50 … -100` | Arm reaches forward across partner's back |
| `shoulderFwdL/R` (right arm, low wrap) | `-30 … -70` | Lower wrap around waist |
| `leftElbow` / `rightElbow` | `+30 … +90` | Bent to conform to partner's back |
| `leftHip` / `rightHip` | `0 … +15` | Weight shifted toward partner |
| `leftKnee` / `rightKnee` | `0 … +20` | Slight softening for closeness |
| `hipAbductL/R` | `0 … -10` | Legs neutral |
| `globalTilt` | `0` | Upright |

---

## 15. Legs Up the Wall (Viparita Karani)

**Visual:** Lying flat on the back (supine) with sit-bones against a wall, legs extended vertically up the wall. Hips flexed ~90°, knees straight. Arms relaxed at sides, outstretched, or on belly. Restorative yoga pose.

Sources: Yoga Journal / Healthline "Legs Up the Wall Pose"; "Sitting with Legs up Pose" Pinterest; medical "What to Know About Legs-Up-the-Wall Yoga Pose"; "Gently wiggle your body closer to the wall until your sit bones are against the wall and your legs are vertically above you with both legs above your hips."

| Joint | Range | Notes |
|---|---|---|
| `spine` | `0 … +5` | Flat on floor |
| `globalTilt` | **`-90`** | Supine per task convention |
| `leftHip` / `rightHip` | `+80 … +95` | Hips flexed ~90° to bring legs vertical |
| `leftKnee` / `rightKnee` | `0 … +10` | Knees fully extended (legs straight up) |
| `hipAbductL/R` | `0 … -10` | Legs together or slightly apart |
| `leftShoulder` / `rightShoulder` | `0 … -90` | Arms at sides (0) or outstretched T (-90) |
| `shoulderFwdL/R` | `0 … -10` | Arms relaxed on floor |
| `leftElbow` / `rightElbow` | `0 … +30` | Slight bend from relaxation |

> Critical: this pose is a *combination* of `globalTilt = -90` (body horizontal supine) **AND** `leftHip/rightHip ≈ +90` (legs swung forward 90° from torso — which, after the body is rotated to supine, places the legs vertically upward against the wall). A pose with `globalTilt = -90` alone would have legs lying flat on the floor (pure supine). Both must be set together.

---

## Cross-check vs. PoseArt worklog sign convention

The worklog (Task 0) records these signs differently for two joints:

| Joint | Task brief (used above) | Worklog (Task 0) | Reconciliation needed |
|---|---|---|---|
| `hipAbductL/R` | `+` = adduction (inward/cross), `-` = abduction (outward) | `+` = leg spreads outward | Opposite signs — likely a documentation flip. The renderer source `pose-skeleton-3d.js` is the ground truth — needs verification by setting `hipAbductL=+30` and observing whether the leg goes IN or OUT in the rendered figure. |
| `globalTilt` | `+90` = prone, `-90` = supine | `+90` = supine, `-90` = prone | Opposite signs — same situation. Verify in renderer before bulk-correcting `poses-data.js`. |

All other signs (spine, shoulders coronal, elbows, hips sagittal, knees, shoulderFwd) **agree** between the task brief and the worklog.

**Recommendation:** Before applying the ranges above to correct mismatches in `poses-data.js`, run a 60-second renderer probe:
1. Set a test pose with `hipAbductL: +30`, all else 0 → record whether left leg crosses inward or splays outward.
2. Set a test pose with `globalTilt: +90`, all else 0 → record whether figure is face-up or face-down.
3. Reconcile the table above to whichever sign the renderer actually exhibits, then proceed with bulk corrections.

---

## Summary of Forensic Hot-Spots

Based on the research, the most error-prone sign patterns to audit in `poses-data.js`:

1. **Reclining poses** (supine/prone) — `globalTilt` sign must match the actual body orientation. A pose with description "lying on back" and `globalTilt: +90` (if task convention is correct) is wrong; flip to `-90`.
2. **Cross-legged / tailor** — needs `hipAbductL/R` in the **negative** range (abduction outward). A pose with description "cross-legged" and `hipAbductL/R: +30` is wrong (that would adduct/cross inward at the hip — possible for true knee-on-knee cross, but the typical tailor pose abducts outward ~39°).
3. **Half-kneeling** — the *back/down* leg should have a **negative** `hip` value (slight hip extension), not a positive one. A common error would be setting both hips to +90 (treating both as flexed), which would put the down knee in front of the body rather than behind.
4. **Arms overhead** — `leftShoulder` / `rightShoulder` should be **strongly negative** (-150 to -180). A positive or near-zero value with description "arms overhead" is wrong.
5. **Leap/trailing leg** — the trailing leg should have a **negative** `hip` (extension back) and a near-zero `knee` (straight). A common error is setting trailing hip positive (forward flexion), making the figure appear to be running rather than leaping.
6. **Legs-up-the-wall** — must combine `globalTilt ≈ -90` (supine) AND `leftHip/rightHip ≈ +90`. Either alone produces the wrong visual.
7. **Crouching** — `leftKnee` / `rightKnee` should be in the **+100 to +140** range (deep flexion). A crouching pose with knee values < +60 is more accurately a "half-squat" or "standing soft".
8. **Hand on hip / hand to face** — the active-side `shoulder` (coronal abduction) should be **negative** (raised outward). A positive value with description "hand on hip" or "hand on chin" is wrong.
9. **Wall lean / reclining back lean** — `spine` should be **negative** (backward). A wall-lean pose with `spine: +20` (forward) is wrong.

---

## Sources consulted (selected, full JSON in `./research-raw/`)

- Wikipedia — "Contrapposto" (engaged vs free leg, S-curve)
- Khan Academy — "Contrapposto explained" (video)
- study.com — "Contrapposto Definition, Art & Pose"
- Saint Louis Art Museum (SLAM) — "Noticing contrapposto in Classical art"
- LoveLifeDrawing — "7 tools to give WEIGHT to your figures"
- Pinterest aggregators — Arms Crossed, Hand on Hip, Kneeling, Supine, Prone, Crouching, Leap, Couple Embrace, Legs-Up-Wall reference boards
- AdorkaStock / EtheringtonBrothers — "How to THINK When You Draw ARMS AKIMBO"
- Kaplan et al. 2008 (cited 35×) — Range of movements of lower limb joints in cross-legged sitting (hip abduction mean 39°, knee flexion mean 134°, hip external rotation mean 49°)
- NIH/PMC Biomechanical Review of the Squat Exercise (cited 98×) — partial squat 45°, half-squat 70–100°, full-squat 100–140° knee flexion
- Provencal / exercise physiology — Half-Kneeling (both knees ~90°, front foot planted, back knee under hip)
- Yoga Journal / Healthline — Legs-Up-the-Wall (Viparita Karani): "sit bones against the wall and your legs are vertically above you with both legs above your hips"
- Glenohumeral joint reference — Flexion 110°, Extension 60°, Abduction 120°, IR 90°, ER 90° (native glenohumeral; full overhead combines with scapular elevation to 180°)
- FORCE Friday 213 / 215 (Vanjul Nagpal) — How to Draw Laying Down Poses / Jumping Poses
- Line of Action, Bodies in Motion — figure-drawing reference libraries
