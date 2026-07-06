# Joint semantics — v5 review reference

Every value is a signed degree unless noted. Neutral standing is roughly 0 for arms/legs.

## Torso
- `spine`: + = torso leans FORWARD (toward camera). Range ~ -35..+35.
- `neck`: + = head tilts to figure's LEFT (own left). Range ~ -25..+25.
- `hips`: + = pelvis drops on the LEFT side. Range ~ -25..+25.

## Arms
- `leftShoulder`, `rightShoulder`:
  - `0` = arm hanging straight down at side
  - Negative = arm raises **up** (−90 straight out to side, −140 overhead)
  - Positive = arm swings **back** behind body
  - Range typically -145..+35
- `leftElbow`, `rightElbow`: + = forearm folds inward (bicep curl direction). 0 = straight arm. Typical range 0..110.
- `shoulderFwdL`, `shoulderFwdR`: + = arm swings **forward** (across chest). Range ~ -20..+40. Use to bring hand toward face/head/opposite shoulder.

## Legs
- `leftHip`, `rightHip`: + = leg swings FORWARD (knee up). 0 = leg down neutral. 90 ≈ thigh horizontal (seated). ~120 = deep bend.
- `leftKnee`, `rightKnee`: + = shin folds back (like sitting). 0 = straight leg. ~90-130 = seated. Do not exceed 135.
- `leftAnkle`, `rightAnkle`: + = toe up (dorsiflex); − = pointed toe / tiptoe.
- `hipAbductL`, `hipAbductR`: + = knee spreads OUTWARD (Z-axis). Use for seated spread / lotus / straddle.

## Global body
- `globalTilt`: + = whole body tilts FORWARD (toward camera). Use ~85-90 for full recline, ~30-45 for lean-forward, ~-45 for lean-back.
- `globalTwist`: + = whole body rotates LEFT (Y-axis). Use for side-lying, side-view twist, look-back.
- `globalRoll`: + = whole body rolls toward RIGHT side (Z-axis lean).

## Sanity envelopes
- Standing category should have `|globalTilt| < 15`, both knees < 30.
- Seated category should have `|globalTilt| < 45` and typically both knees 80-130.
- Reclining/boudoir-recline can use `globalTilt` 55-90.
- Never give both shoulders large negative values without high elbow flex — that produces a Y-pose with rigid straight arms.
- If one shoulder is deeply negative (< -110), the elbow on that side should be > 20 so the hand comes near the head rather than sticking straight up.
- If the pose calls for hand-to-face / hand-to-hair: pair `shoulder ≈ -125..-140` with `elbow ≈ 60..110` and `shoulderFwd ≈ 5..15`.

## Common fix patterns
- "Hunched shoulders" → add `shoulderFwdL: 15-25` AND `shoulderFwdR: 15-25` and slight `spine: 8-15` (forward lean).
- "Shoulders back / proud chest" → `spine: -6` and `shoulderFwdL/R: -10..-15`.
- "More S-curve / contrapposto" → `hips: 15-20`, opposite `spine: -8..-12`, `shoulderFwdL/R` mildly asymmetric.
- "Lean into prop (wall/chair)" → `spine: 15-22` AND `globalTilt: 10-20` toward the prop.
- "Deeper twist look-back" → `globalTwist: 25-40` (never above 45 for seated).
- "Weight on one foot" → target `hipAbduct` = 0..10 on standing side, 15-25 on lifted side, and asymmetric `leftHip`/`rightHip` values differing by 20-40.
