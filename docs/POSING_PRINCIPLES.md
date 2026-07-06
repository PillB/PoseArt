# POSING_PRINCIPLES.md

Working cheat-sheet of pose principles distilled from the 18 posing PDFs
supplied by the app owner (Believe in Boudoir / Yuliya Panchenko — 66 named
flow poses across chair/bench/couch/bed/wall + 10 male + ~14 unconventional +
category-level top-10 sets for arm-chair, standing, floor, tubes, and lounge).

This is the **reference document that the procedural rig and per-pose
joint data must satisfy**. Every code-level rule in
`js/pose-figure-procedural.js` and every per-pose adjustment in
`js/poses-data.js` should be traceable back to one of these principles.

---

## 1. The three universal principles

Nearly every single described pose in the 66-pose flow set repeats the same
three cues:

1. **Toes are pointed** (feminine poses). Mentioned in 43 / 57 descriptions
   where feet are visible. Any exposed foot in a feminine pose should render
   with an extended plantar line, never a flat heel.
2. **Back is arched** (or "posture is straight, back is arched"). Mentioned
   in 34 / 57 descriptions. The lumbar curve is exaggerated: hips tilted
   forward, ribcage lifted, chin slightly up — this is what produces the
   "S-curve" everyone talks about.
3. **Shoulders are dropped / relaxed / pushed down**. Mentioned in 15 / 57.
   Never render tense trapezius-up shoulders on a feminine subject at rest.
   The shoulder line should sit **below** the collarbone silhouette.

These three combine to produce the readable feminine silhouette. If a
rendered pose fails any of them, the pose reads as flat / stiff.

---

## 2. Feminine vs. masculine rig differences

From the top-10 male set vs. the boudoir flow sets:

| Trait                  | Feminine default              | Masculine default                     |
| ---------------------- | ----------------------------- | ------------------------------------- |
| Feet                   | Pointed toes                  | **Flat, planted** (heel down)         |
| Stance width           | Narrow, crossed, or one-foot-elevated | **Wider than shoulders** when standing |
| Spine                  | Arched (exaggerated lumbar)   | Neutral or slightly slouched          |
| Shoulders              | Dropped, neck elongated       | Squared, sometimes lifted (arm-behind-head shows lat spread) |
| Hips                   | Pushed to one side, hourglass | Squared to camera                     |
| Hands                  | Soft, relaxed, fingers relaxed | Loose fists or gripped (clothing, jaw, hair) |
| Weight                 | On one leg, other bent/crossed | Distributed or seated with legs open  |
| Arm shape              | Bent, one hand-in-hair or on-hip | Braced, hand-behind-head (bicep + shoulder) |

The renderer must treat `pose.gender` (or a `masculine` tag) as a switch
that flips the foot glyph, spine curve amount, shoulder-drop amount, hip
tilt, and default hand style.

---

## 3. The aesthetic-triangle rule (negative space)

The Believe in Boudoir descriptions are explicit about producing triangles
of negative space between the limbs and the torso. Practical rules that
appear repeatedly:

- **Bent-arm triangle:** at least one arm must be bent so the hand touches
  hip / hair / face / knee / armrest. This produces a triangle between
  upper arm ↔ forearm ↔ torso side. Straight arms hanging by the side are
  never described.
- **Bent-knee triangle:** the "one leg is bent, the other is extended"
  formula (23 poses) creates a triangle between thigh ↔ shin ↔ ground /
  supporting-surface. When both legs are bent, cross the shins ("legs
  crossed at shin level" — 12 poses) so a smaller triangle appears
  between the two shins and the ankle-cross.
- **Elbows-pushed-back:** pose 5 (wall) is explicit: "elbows pushed behind
  the back to highlight the hourglass shape of the body". Elbows pointing
  outward from the ribcage create a diamond that reads as waist.
- **Asymmetry:** almost every description says "not symmetrical", "one
  hand on X, the other on Y", or "one leg X, the other Y". Symmetrical
  poses are considered flat.

Renderer implication: prefer poses whose left/right joint angles differ.
Detect symmetric limb pairs at render time and add a small asymmetry
offset when the input data is symmetric.

---

## 4. Hand styles

The word "hands" appears in 34 descriptions. Vocabulary is narrow:

- **"Soft and relaxed"** — default feminine hand. Fingers slightly curled,
  wrist relaxed, no gripping. Render as a small oval / teardrop, never a
  circle-fist.
- **"Crossed"** — hands overlap at the wrists (bench pose 11 "planking",
  bed pose 1). Render as two overlapping small ovals.
- **"Touching hair"** / "touching hip" / "touching knee" / "touching
  chin" / "touching wall" / "touching armrest" — the hand is a contact
  point. The wrist should render **at** the target joint or surface, not
  floating near it.
- **Masculine hands** — often loose fists, or fingers hooked into a
  waistband / pocket / behind the head. Render as a slightly larger,
  more angular oval; no fingertip taper.

Renderer implication: expose a `handStyle` per side: `soft` | `crossed` |
`fist` | `contact:hair` | `contact:hip` | `contact:knee` | `contact:face`
| `contact:surface`. Default is `soft` for feminine, `fist` for masculine.

---

## 5. Foot styles

- **Pointed toes** (feminine default) — plantar flexion. Visually a long
  triangle extending 25–35% of the shin length past the ankle.
- **Balls of the feet** — heel lifted, only the ball touches ground.
  Explicit in chair pose 7 ("legs are crossed, elevated on the balls of
  the feet"). Render as ankle raised, toes as short triangle contacting
  ground plane.
- **Flat foot** — masculine default, and also feminine when the foot is
  a load-bearing contact ("one foot touching the floor"). Render as a
  horizontal shoe/foot bar.
- **Foot touching shin of other leg** — recurring bed-pose motif (bed
  poses 4, 5, 6). Renderer must place the ankle at the mid-shin of the
  opposite leg.

---

## 6. Spine S-curve rules

"Back is arched" appears 34 times. The S-curve is produced by:

1. **Anterior pelvic tilt** — pelvis rotates so pubic bone points slightly
   down and back, sacrum tilts back. Renderer: rotate the hip-line by
   +8° to +14° for `pose.spineCurve = 'arched'`.
2. **Ribcage lift** — the sternum lifts and rotates away from the pelvis,
   creating the lumbar hollow. Renderer: shorten the visible torso by 3%
   and offset the shoulder-line forward by ~5% of torso length.
3. **Chin lift** — "her chin up", "face tilted towards the camera". Head
   tilts back by 8–15° in most arched-back poses.

Explicit callouts:
- Wall pose 6/7 — "hips away from the wall", "buttocks touching the
  wall" — these define whether the arch is a *thoracic* arch (upper
  back) or a *lumbar* arch (lower back). Store `archType` per pose.
- Kneeling bench pose 8/9/10 — "back is arched and her upper body is
  slightly leaning forward" — thoracic arch + forward lean.

---

## 7. Weight-shift / contrapposto

Standing poses in the flow set are all weight-shifted, never planted
symmetrically:

- "Hip is pushed to the side" — wall poses 1–5. The hip line tilts, the
  shoulder line tilts the **opposite** way. Classic contrapposto.
- "One leg is straight, and the other is bent with the knee crossing
  over the other knee" — wall poses 1–4. The weight-bearing leg is
  straight; the crossing leg has a bent knee that visually cuts the
  standing leg's silhouette, producing a Z-shape.
- "Standing on the balls of the feet, with one foot towards the chair"
  — chair pose 12 — the standing foot points to a prop, adding directional
  energy.

Renderer implication: for standing poses, if `weightSide = left`, tilt the
hip-line -6° (right hip drops), tilt the shoulder-line +4° (right shoulder
rises), and pull the non-weight-bearing knee inward by ~10% of hip width.

---

## 8. Reclining / prone / floor rules

From bed poses 1–13 and the "on the floor" reference:

- **Prone (belly-down)**: upper body always **slightly elevated** —
  forearms bracing, chest lifted. Never render prone with the face
  pressed to the ground.
- **Supine (back-down)**: at least one knee bent and raised. "Both legs
  bent" or "one leg is bent, the other is straight" — the raised knee
  produces the vertical line that keeps the pose from looking flat.
- **Side-lying**: the arm on the ground supports the head (elbow-prop
  or full arm), the top arm rests on hip / breast / hair. Legs are
  bent so the top knee is forward of the bottom knee, creating depth.
- **"Hips pushed up"** (bed pose 2) — a modest bridge shape when prone,
  bed pose 3 explicitly says "hips are pushed up".

---

## 9. Kneeling rules

From bench poses 7–11 and bed poses 9–10:

- Kneeling almost always pairs with **arched back + forward lean**.
- The knees themselves are usually **together** for feminine poses
  ("knees together" — chair pose 10, bed pose 1) and **shoulder-width
  apart** for masculine or "power" kneeling.
- The shins are almost always **crossed at ankle** or **feet elevated**
  in feminine kneeling — never flat shins parallel on the ground.

---

## 10. Head / face / gaze

Every pose specifies the gaze direction. The four buckets in the PDFs:

1. **Facing the camera** — direct eye contact. Head roughly forward.
2. **Face tilted towards the camera** — head tilted (chin down or up)
   toward the lens; often paired with "eyes closed" for the classic
   dreamy boudoir look.
3. **Face turned away** / **looking away** — full profile or 3/4 back.
4. **Eyes closed** — appears in ~1/3 of poses regardless of head direction.

Renderer implication: `pose.gaze` should carry both a *direction*
(`camera` | `away` | `down` | `side`) and an *eyes* state (`open` |
`closed` | `soft`). Even a stick figure benefits from a small tilt of
the head circle in the correct direction.

---

## 11. Sit / lean / lay taxonomy

Boiling the 66 flow poses down to a small vocabulary of body-attitudes:

| Attitude          | Count | Key traits                                       |
| ----------------- | ----- | ------------------------------------------------ |
| Seated upright    | 12    | Back straight-arched, one knee bent, hand contact |
| Seated leaning    | 8     | Upper body leaning against armrest / back        |
| Seated on armrest | 6     | Higher perch, feet floating, knees together      |
| Kneeling upright  | 4     | Arched back, hands on hips / knees               |
| Kneeling forward  | 5     | Forearms braced, arched back, hips lifted        |
| Standing leaning  | 8     | Leaning on prop, hip-out, one leg bent           |
| Standing wall     | 9     | Contrapposto, knee crossed, arched back          |
| Lying prone       | 5     | Upper body elevated on forearms                  |
| Lying side        | 5     | Elbow prop, top leg forward                      |
| Lying supine      | 3     | Knee raised, arched back                         |
| Floor seated      | 5     | Back against prop (chair/bench), one leg bent    |

Every pose in `js/poses-data.js` should map cleanly to one of these
attitudes; the renderer then picks the default view angle, spine curve,
and shoulder-drop for that attitude.

---

## 12. Testable rules the renderer must enforce

These are the rules we can automatically check in the renderer *without*
per-pose editing:

- [ ] **feminine + foot-visible ⇒ pointed toe glyph** (unless
  `contactSurface = flat` or gender = male).
- [ ] **standing + not-symmetric ⇒ apply weight-shift tilt** to hips
  and shoulders (opposite directions).
- [ ] **spineCurve = arched ⇒ apply lumbar hollow** (pelvis tilt +
  ribcage offset).
- [ ] **at-least-one-arm-bent invariant** — if a pose renders both arms
  fully extended and hanging, add a soft 12° elbow bend to at least one
  so the aesthetic-triangle rule is satisfied.
- [ ] **hand default = soft** for feminine, `fist` for masculine, unless
  overridden by a `contact:*` tag.
- [ ] **shoulder-line drops 4–6% below neck-base y** for feminine at rest.
- [ ] **kneeling forward ⇒ hip-line lifts** above knee-line even when the
  input data says they're equal.

Each of these is baked into `js/pose-figure-procedural.js` in the rig
upgrade following this document.

---

## 13. What "aesthetic triangle" concretely means

A triangle is aesthetic when:
- Two sides are formed by limbs (arm+forearm, thigh+shin, arm+torso,
  shin+shin, etc.), and
- The third side is either **negative space** framed by the body or the
  ground plane / prop surface, and
- The triangle is **not equilateral** — one angle should be noticeably
  smaller than the other two. Boudoir posing prefers sharp, acute
  triangles (30–60° apex) over open near-equilateral ones.

Practical rendering:
- Bent elbow producing arm-torso-triangle → target ~45° elbow flex.
- Bent knee producing thigh-shin-triangle → target ~90–110° knee flex
  when the foot bears no weight, ~120–140° when weight-bearing.
- Fingers-to-hip triangle → the hand rests on the iliac crest, elbow out
  by ~30% of shoulder-hip distance.

---

## 14. Common failure modes to prevent

From reviewing the app's existing 3D skeleton renderer against the PDF
reference material:

1. **Straight limbs.** Bones drawn as unbroken straight lines with no
   elbow / knee flexion. Fix: enforce min-flex on visible joints.
2. **Symmetric mirror poses.** Both arms doing the same thing, both legs
   doing the same thing. Fix: asymmetry pass in renderer.
3. **Flat feet on feminine poses.** Fix: gendered foot glyph.
4. **No spine curve.** The torso is a straight vertical trapezoid. Fix:
   S-curve control point on the spine polyline.
5. **Hips squared to camera in every pose.** Fix: hip-tilt from
   `weightSide` when standing, `spineCurve` when arched.
6. **Hands rendered as small circles.** Fix: hand-style glyph library.
7. **Head always upright.** Fix: head tilt from `gaze.direction`.

---

## References

All principles above are traceable to these source PDFs, saved by the
app owner into workspace:

- Master PDF (Panchenko / Believe in Boudoir) — 66 fully-described
  boudoir flow poses on chair, bench, couch, bed, wall.
- Boudoir on a chair / bench / couch / bed / wall — same content
  as flow subsets.
- Posing Guide Cheat Sheet — visual index of the 66 flow poses.
- Top 10 male poses — photographic reference for masculine defaults
  (flat feet, wider stance, hand-behind-head, no arch).
- Top unconventional poses — floor/prop poses; foot-on-shin, hip-lift,
  bent-arm ground supports.
- Top 10 chair / arm-chair / bench / bed / floor / wall / tubes /
  lounge / standing sets — visual reference for each attitude bucket.

The extracted plain-text versions of the readable PDFs are in
`/home/user/workspace/pdf_text/` (not committed to the repo — used
during this session as source material).
