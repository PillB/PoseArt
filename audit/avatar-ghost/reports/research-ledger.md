# PoseArt Avatar / Ghost / Skeleton Visual-Forensics Extension
## Research Ledger — Task ID 7 (`research-ledger`)

| Field | Value |
|---|---|
| Task ID | 7 |
| Agent | `research-ledger-subagent` (design-research lead) |
| Date | 2026-08-02 (UTC) |
| Scope | Avatar / Ghost / Skeleton canvas-renderer redesign — **RESEARCH ONLY** |
| Code modified | **None.** No edits to `js/`, `index.html`, `css/`, or any application source. Only this file (under `PoseArt/audit/avatar-ghost/reports/`) was created. |
| Grounding verified against | `/home/z/my-project/PoseArt/js/pose-skeleton-3d.js` lines 1630–1739 (current avatar: `waistW = hipW * 0.65` hourglass; per-bone dual-endpoint `arc()` joints at lines 1733–1739; capsule limbs via 4-point `lineTo` polygon; ghost hue-only `#3EA9B8`). Read-only — not modified. |

This ledger is the evidentiary basis the implementation lead will use to select the new silhouette language. Each of the six research areas below follows the (a) principle → (b) why it matters for PoseArt → (c) concrete technique / parameter range → (d) source with strength rating and URL structure requested in the task brief. A "Synthesis — design directives" section translates the findings into 10 testable directives (D1–D10). A consolidated sources table closes the document.

Strength scale: **Strong** = authoritative standard or canonical primary text (MDN, W3C Recommendation, established art-instruction text in continuous print > 30 yrs). **Moderate** = widely-cited practitioner reference, museum scholarship, or peer-reviewed secondary work. **Weak** = single-author blog or commercial vendor doc used only when no stronger source could be located. **Practitioner heuristic — unsourced** is used explicitly where the principle is industry-common but no citable primary reference exists.

---

## 1. Canvas 2D Contour Construction — smooth procedural silhouettes

**(a) Principle.** A readable silhouette is a single closed contour whose tangents vary continuously along its length. The Canvas 2D API provides three primitives for this: `lineTo` (C⁰ only — tangent discontinuous), `quadraticCurveTo(cpx, cpy, x, y)` (one control point; yields a quadratic Bézier — G¹ at endpoints if the control point lies on the tangent through the joint), and `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` (cubic Bézier — two control points; C¹ continuity achievable when control points are mirror-symmetric across the joint). For a *chain* of joints sampled from a rig (shoulder → elbow → wrist, etc.), the canonical smoothing technique is **Catmull–Rom-to-cubic-Bézier conversion**: for each interior point P_i, the cubic's two control points are placed along the chord (P_{i-1}→P_{i+1}) at 1/6 of its length on either side of P_i. This produces a single C¹-continuous curve passing through every rig point, with no manual tangent authoring per joint. An alternative for *mass*-filled regions (torso, pelvis) is the **lofted-ribbon** or **rounded-capsule** construction: for each bone, compute the perpendicular (normal) to the bone direction, offset both endpoints by ±(local half-width), then join adjacent bones with arcs or tangents rather than straight segments.

**Why drawing a circle at BOTH endpoints of every bone produces visible "knots."** When each bone is drawn as a 4-point polygon plus a circle at both endpoints (the current PoseArt pattern, `pose-skeleton-3d.js` lines 1725–1739), a shared joint — say the elbow, where the upper-arm bone ends and the forearm bone begins — receives **two overlapping circles of different radii** (wA from the upper-arm bone's distal end, wA′ from the forearm bone's proximal end, typically unequal because of taper). The union of two unequal circles centred at the same point is visually a "blob" or "knot" because (i) the outline has a tangent discontinuity wherever the larger circle exits the smaller, and (ii) the alpha-blended double fill doubles the local opacity. The canonical fix is to draw **each shared joint exactly once**, as a single ellipse whose major-axis is aligned to the **bisector of the two adjacent limb directions** (the average tangent), and whose radius is `≈ max(adjacent proximal widths) × 0.9`. The 0.9 factor ensures the joint's outline is tangent to (not exceeding) the narrower of the two adjacent bone edges, so the silhouette reads as one continuous tube. For end joints (hand, foot) a single terminal cap — a half-ellipse or semicircle aligned to the last bone — replaces the endpoint circle.

**(b) Why it matters for PoseArt.** PoseArt's avatar currently calls `quadraticCurveTo` for the torso silhouette (good) but then layers `arc()` circles at both ends of every limb bone (the knot problem), and draws each limb capsule as a 4-point `lineTo` polygon with **no curvature along its length** — so the limb reads as a trapezoid, not a tapering tube. The visible artefacts the brief calls out ("overlapping endpoint circles that make joints look like blobs") are exactly what the dual-`arc()` pattern produces. Moving to a single-chain Catmull–Rom-smoothed outline (or, more cheaply, a per-bone rounded-capsule with one shared joint ellipse) eliminates the knots without authoring per-joint tangents.

**(c) Concrete technique / parameter range.**
- **Joint ellipse:** one ellipse per shared joint, aligned to the bisector of `(dir_bone_in, dir_bone_out)`; radii `(r_major, r_minor) = (max(wA_prox, wA_dist) × 0.9, max(wA_prox, wA_dist) × 0.55)`. Drawn once per joint, not once per bone-end.
- **Bone capsule outline:** replace 4-point `lineTo` polygon with two cubic Béziers (one per long edge). Control points placed at 1/3 and 2/3 of bone length along the bone axis, offset by the local half-width. This gives a true tapering tube, not a trapezoid.
- **C¹ continuity across joints:** for the silhouette outline as a whole, treat shoulder→elbow→wrist as a single chain and use Catmull–Rom→Bézier conversion (tension parameter τ ≈ 0.5). Single closed `Path2D` per limb, filled once.
- **Taper curve:** half-width along bone `w(t) = w_prox·(1−t)^p + w_dist·t^p` with `p ∈ [0.7, 1.3]`. `p=1` is linear taper (current behaviour); `p≈0.8` gives a Mucha-like swelling near the proximal joint.
- **Avoid `lineTo` for visible contour edges** except for the hip-line / shoulder-line closures.

**(d) Sources.**
- MDN, `CanvasRenderingContext2D.bezierCurveTo()` — **Strong** — https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo
- MDN, `CanvasRenderingContext2D.quadraticCurveTo()` — **Strong** — https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo
- MDN, Canvas API Tutorial — Applying styles and colors / Drawing shapes — **Strong** — https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- Pomax, *A Primer on Bézier Curves* (open-access reference; section on Catmull–Rom-to-Bézier conversion and C¹/G¹ continuity) — **Moderate** — https://pomax.github.io/bezierinfo/
- Catmull, E. & Rom, R. (1974), "A Class of Local Interpolating Splines," in *Computer Aided Geometric Design* — canonical primary citation for the conversion; **Strong** but no canonical free URL — Practitioner heuristic — unsourced for the specific conversion constants (1/6 chord length).
- The "draw the joint once, aligned to the limb bisector, sized to max(adjacent widths) × 0.9" rule — **Practitioner heuristic — unsourced** (standard in 2D rigging tutorials across Spine, DragonBones, and game-asset pipelines; no single authoritative citation located).

---

## 2. Procedural Character Silhouette — building readable silhouettes from a joint rig

**(a) Principle.** A procedural silhouette is built by (i) sampling the rig's joints, (ii) for each bone, computing a *local half-width* derived from a lookup table keyed by bone identity (upper-arm vs forearm vs thigh vs shin) and modulated by *foreshortening* (the projected length of the bone on screen), and (iii) skinning the result into a single closed contour. Widths are **not** gender-derived; they are *function-derived*: load-bearing bones (thigh, pelvis, ribcage) are wider than terminal bones (forearm, shin, neck) because they carry mass. The torso is best treated as three control frames — **ribcage** (at the spine joint), **waist** (mid-torso, narrower by a *structural* ratio derived from ribcage-vs-pelvis width, not a gendered hourglass), and **pelvis** (at the hips joint). Camera orientation enters via foreshortening: a bone pointing toward the camera projects short and should be drawn wider (mass conserved); a bone in profile projects long and should be drawn narrower. The standard formula is `projected_half_width = base_half_width × (bone_length_screen / bone_length_model)^−0.5`, clamped to `[0.55, 1.4]` to avoid degenerate cases.

**(b) Why it matters for PoseArt.** The current avatar hard-codes `waistW = hipW * 0.65` ("Feminine waist taper", line 1654) regardless of camera orientation or pose. For a reclining pose seen from above (the brief's "fixed centering mis-frames reclining poses" complaint), the hip/shoulder projection collapses to near-zero width, the waist ratio is applied to a degenerate base, and the silhouette collapses to a sliver. A rig-driven approach deriving waist from `0.5 × (ribcageW + pelvisW)` — i.e. an interpolated midpoint rather than a fixed 65% of hip — preserves the silhouette across all camera angles and removes the gendered assumption.

**(c) Concrete technique / parameter range.**
- **Half-width lookup (in model units, head = 1.0):** neck 0.10, ribcage 0.22, waist 0.18, pelvis 0.23, upper-arm 0.075, forearm 0.055, thigh 0.11, shin 0.075, hand 0.045, foot 0.06. These are *function-derived* (load-bearing bones wider) and lie in the androgynous 1:1–1.05:1 ribcage-to-pelvis band (see §5).
- **Waist derivation:** `waistW = 0.5 × (ribcageW + pelvisW) - 0.02` (slight inset, structural not gendered). Compare with current `hipW * 0.65` which produces a 35% inward pinch.
- **Foreshortening modulation:** `screenW = baseW × clamp((modelLen / screenLen)^0.5, 0.55, 1.4)`. When a bone points at the camera (screenLen ≪ modelLen), screenW grows up to 1.4×, preserving apparent mass.
- **Camera-aware centering:** compute the figure's screen-space bounding box (min/max over all projected joints plus their radii), then translate the canvas so the box centroid — not a fixed joint — sits at frame centre. This fixes the reclining-pose mis-framing without special-casing recline.
- **Limb taper curve:** `w(t) = w_prox·(1−t)^0.8 + w_dist·t^0.8` (see §1). 0.8 exponent gives a Mucha-like swelling near the proximal joint.

**(d) Sources.**
- Wikipedia, "Skeletal animation" (overview of bone + half-width rig skinning) — **Moderate** — https://en.wikipedia.org/wiki/Skeletal_animation
- NVIDIA, *GPU Gems 3*, Ch. 2 "Animated Characters with Skinning and Morph Targets" (linear-blend skinning and per-bone half-widths) — **Strong** — https://developer.nvidia.com/gpugems/gpugems3/part-i-geometry/chapter-02/animated-characters-skinning-and-morph-targets
- Wikipedia, "Metaballs" (implicit-surface alternative for blob-free joint blending — mentioned for completeness; not recommended for PoseArt's performance budget) — **Moderate** — https://en.wikipedia.org/wiki/Metaball
- Foreshortening-derived half-width formula `screenW = baseW × (modelLen/screenLen)^0.5` — **Practitioner heuristic — unsourced** (standard in 2.5D game character pipelines).
- Camera-aware bounding-box centering — **Practitioner heuristic — unsourced** (standard viewport-fit technique).

---

## 3. Pose Readability & Line-of-Action — classical figure-drawing principles

**(a) Principle.** In classical figure drawing, the **line of action** (Stanchfield) is the single sweeping curve — usually an S-curve or C-curve — that flows through the head, torso, and weight-bearing leg, expressing the *intent* of the pose in one stroke. Gesture drawing (Vilppu) teaches that this line is not a literal feature of the body but the **rhythmic axis** the silhouette should be built around; if the silhouette's outer contour echoes the line of action (one side convex, the other concave), the figure reads as "alive" even when static. Strong readable silhouettes pair this with **clear negative spaces** — the enclosed holes between arm and torso, between legs, between hand and head — which should each be a single readable shape, not a noisy gap. The principle for procedural rendering: do **not** draw a literal line over the figure; instead, *asymmetrise* the silhouette so that one flank of the torso/limb echoes the line of action with a convex bulge and the opposite flank is straighter or concave.

**(b) Why it matters for PoseArt.** PoseArt's current avatar is *bilaterally symmetric* along the spine axis — both flanks use the same quadratic control-point offsets (lines 1663 and 1669 are mirror images). This produces a silhouette with no dominant line of action: every pose reads with equal weight on both sides. For a contrapposto or reclining pose this kills the gesture. The fix is procedural, not a drawn overlay: offset the contour's control points along the line of action by a small amount (≈ ±2–4 px in screen space, or ±0.02 in model units) derived from the rig's hip-spine-shoulder S-curve.

**(c) Concrete technique / parameter range.**
- **Line-of-action extraction:** fit a cubic Bézier through the projected positions of `head → neck → spine → hips → (weight-bearing) hip`. The control points of this Bézier ARE the line of action.
- **Asymmetric silhouette bulge:** for the torso contour, offset the *convex-side* flank outward by `+0.015 × modelLen` and the *concave-side* flank inward by `−0.010 × modelLen`, where convex/concave are determined by the sign of the line-of-action's curvature at that y-level.
- **Negative-space preservation:** ensure the gap between arm and torso, and between thighs, never falls below `0.06 × modelLen` (≈ 6 px at default zoom). Below this the silhouette self-occludes and the negative space collapses.
- **Subtle gesture emphasis:** the bulge offset is small (±2–4 px) — visible as rhythm, not as a literal drawn S-curve. **Do not** draw a separate stroke for the line of action over the figure (the brief explicitly forbids this).
- **Anti-pattern:** avoid the current bilateral symmetry (mirror-image `quadraticCurveTo` control points on both flanks).

**(d) Sources.**
- Stanchfield, W. (2009), *Drawn to Life: 20 Golden Years of Disney Master Classes*, Focal Press. The canonical "line of action" source. — **Strong** (book in continuous print, no canonical free URL). Transcription archive: https://web.archive.org/web/2020/https://sevencamels.blogspot.com/search/label/walt%20stanchfield — **Moderate** (transcription, not primary).
- Vilppu, G., *Vilppu Drawing Manual* and gesture-drawing video lectures, Vilppu Studio. — **Strong** (instructional text in continuous use since 1985). Publisher: http://www.vilppustudio.com/ — **Moderate** (commercial site, not the text itself).
- Loomis, A. (1943), *Figure Drawing for All It's Worth*. Internet Archive open copy. — **Strong** (canonical art-instruction text). https://archive.org/details/loomis_FIGURE-drawing
- Hale, R. B. (1964), *Drawing Lessons from the Great Masters* — proportional/rhythmic figure analysis. — **Strong** (book). No canonical free URL.
- "Line of action" negative-space technique (the asymmetric-bulge offset) — **Practitioner heuristic — unsourced** (standard gesture-drawing pedagogy; the specific px-range guidance is heuristic).

---

## 4. Art Nouveau Figure Language (Mucha, Grasset, Beardsley) — public-domain reference only

**(a) Principle.** The Art Nouveau figure vocabulary (c. 1890–1914) is defined by **rhythmic, not anatomical**, femininity. Its signature qualities are: (i) **elongated proportions** — 7.5 to 8 heads tall, with a noticeably long neck and high waist; (ii) **flowing contour** — the S-curve dominates; drapery, hair, and the body's outline all share the same rhythmic sweep; (iii) **restrained ornament** — Mucha in particular uses dense halo/background ornament but keeps the *figure itself* drawn with a single clean contour of uniform line weight; (iv) **oval head, slender neck** — the head is an upright ellipse, never a circle, and the neck is drawn as long as the head height; (v) **taper** — limbs swell gently near the proximal joint and taper to a slender wrist/ankle. Crucially, "feminine" in Mucha is a quality of *line + proportion + rhythm*, NOT of sexual anatomy: the Mucha figure's breasts and hips are minimally indicated; the femininity lives in the S-curve of the spine, the length of the neck, and the taper of the limbs. Aubrey Beardsley's figures are even more androgynous — his women are often indistinguishable from boys except by dress, and his line is uniformly thin and calligraphic. Eugène Grasset's *La Morale dans l'Histoire* (1893) figures share the elongated neck, oval head, and S-curve.

**Public-domain scope.** Mucha's pre-1929 works are public domain in the United States (pre-1929 = PD per Cornell's Hirtle chart). Mucha died 1939; his post-1929 works remain under copyright in some jurisdictions but his 1890s–1910s poster cycles (Gismonda 1894, *Les Maîtres de l'Affiche*, *The Seasons* 1896, *F. Champenois* 1897, *La Trappistine* 1897, *Sarah Bernhardt* 1896, *Job* 1896, *Mucha exhibition poster* 1903, *Documents Décoratifs* 1902 plates) are PD and are the canonical reference set. Beardsley died 1898 — all his work is PD. Grasset died 1917 — all his work is PD. Wikimedia Commons hosts high-resolution scans of all three.

**(b) Why it matters for PoseArt.** PoseArt's brief explicitly targets "Art Nouveau, Mucha-inspired" and asks for "feminine rhythm = flowing line + elongation + taper," NOT "feminine = breasts/hips/waist." The current avatar inverts this: it has the gendered anatomy (hourglass waist) but lacks the rhythmic line (bilateral symmetry, no S-curve, no elongated neck, circular head). The redesign should *remove* the anatomical gendering and *add* the rhythmic qualities: oval head, elongated neck, S-curve flank, tapered limbs, uniform clean contour. This is also the inclusion argument (§5) made visually concrete.

**(c) Concrete technique / parameter range (Art-Nouveau-derived).**
- **Head proportion:** upright ellipse, `rx : ry = 1 : 1.35` (oval, not circle). Head length = 1/7.5 of total figure height (elegant — between Loomis heroic 8 and realistic 7).
- **Neck length:** 0.40 × head length (vs current ~0.20). Mucha signature.
- **Total figure height:** 7.5 heads (androgynous-elegant; see §5). Not 8+ (heroic/masculine), not 5 (chibi).
- **Torso S-curve:** the spine's projected contour should flow head→neck→ribcage→waist→pelvis in a single cubic Bézier with at most one inflection. The flank asymmetry from §3 should produce a visible (subtle) S.
- **Contour line weight:** uniform — single stroke weight along the entire silhouette (Mucha/Beardsley signature). Avoid thick-then-thin calligraphic variation (that's Art Deco / later).
- **Taper:** limbs use `w(t) = w_prox·(1−t)^0.8 + w_dist·t^0.8` (§1, §2) — Mucha-like proximal swelling.
- **Restraint:** no ornament on the figure itself. Halo/background ornament (Mucha's signature medallions) is a separate concern and out of scope for this renderer; the figure's contour should be clean.
- **Reference plates to study (PD, pre-1929):** Mucha *Gismonda* (1894), *Job* (1896), *The Seasons* (1896), *Documents Décoratifs* (1902) plates 1–40, *La Trappistine* (1897); Beardsley illustrations for *Salomé* (1894); Grasset *La Belle Jardinière* (1896). All on Wikimedia Commons.

**(d) Sources.**
- Wikimedia Commons, "Alphonse Mucha" category — **Strong** (PD high-res scans) — https://commons.wikimedia.org/wiki/Alphonse_Mucha
- Wikimedia Commons, "Aubrey Beardsley" category — **Strong** — https://commons.wikimedia.org/wiki/Aubrey_Beardsley
- Wikimedia Commons, "Eugène Grasset" category — **Strong** — https://commons.wikimedia.org/wiki/Eug%C3%A8ne_Grasset
- The Metropolitan Museum of Art, Heilbrunn Timeline of Art History, "Art Nouveau" essay — **Strong** (museum scholarship) — https://www.metmuseum.org/toah/hd/artn/hd_artn.htm
- Cornell University Copyright Information Center, "Copyright Term and the Public Domain in the United States" (Hirtle chart) — confirms pre-1929 = PD in US — **Strong** — https://copyright.cornell.edu/publicdomain/
- Mucha, A. (1902), *Documents Décoratifs* (plate atlas, original 1902 publication; PD). Internet Archive scan — **Strong** — https://archive.org/details/documentsdecorat00much
- The proportional/rhythmic reading "feminine = flowing line + elongation + taper, NOT anatomy" — synthesis drawn from the above museum scholarship; specific phrasing is **Practitioner heuristic — unsourced** but consistent with all five sources.

---

## 5. Inclusive and Androgynous Character Design

**(a) Principle.** Current best practice for non-gendered figure representation follows four rules: (i) **avoid gendered silhouette defaults** — no fixed hourglass (waist = 0.65× hips) and no fixed "V-taper" (shoulders = 1.4× hips); (ii) **use a neutral ribcage-to-pelvis ratio of ~1:1 to 1.05:1** (average adult human ribcage and pelvis are within 5% of each other in bi-iliac / bi-acromial breadth, regardless of sex — the sex dimorphism in these measures is real but small, on the order of 0.5–1.5 cm, and exaggerated defaults are stylistic, not anatomical); (iii) **derive mass from function and weight-bearing**, not from gender — the thigh is wider than the forearm because it carries body weight, not because the figure is "feminine" or "masculine"; (iv) **head-to-body ratio of ~7 to 7.5 heads** reads as elegant adult; 8+ reads as heroic/stylised-masculine (Loomis heroic canon); 5–6 reads as chibi/child. The Microsoft Inclusive Design Toolkit and the W3C WAI guidance both emphasise: provide a *neutral default* and let the user opt into specificity, never the reverse.

**(b) Why it matters for PoseArt.** The current `waistW = hipW * 0.65` is a textbook example of the gendered default the inclusion guidance warns against — it forces every figure into an hourglass regardless of the pose's intent, and it sexualises figures that should be neutral reference poses for figure-drawing study. Replacing it with a structural waist (`0.5 × (ribcageW + pelvisW) - 0.02`, see §2) and a 1:1 ribcage-to-pelvis ratio makes the avatar a usable reference for artists drawing any body, and aligns PoseArt with the inclusion-by-default principle. The 7.5-head proportion from §4 doubles as the androgynous-elegant choice.

**(c) Concrete technique / parameter range.**
- **Ribcage : pelvis width ratio:** 1.00–1.05 (androgynous neutral). Current code effectively sets `waist : pelvis = 0.65 : 1` which implies a strong hourglass. Replaced.
- **Shoulder : hip width ratio:** 1.00–1.10 (neutral; current code's `shoulderW = max(|rSh−lSh|/2, 10)` vs `hipW = max(..., 12)` is *already* close to neutral — the gendering is *only* in the waist pinch).
- **Head : total height ratio:** 1 : 7.5 (elegant androgynous; *not* 1 : 8 Loomis heroic, *not* 1 : 5 chibi).
- **Neck length:** 0.40 × head length (elongated, Mucha-derived; not gendered).
- **Breast/chest indication:** none. The Mucha reference plates (§4) indicate breasts minimally or not at all; the contour carries the femininity. PoseArt's avatar should follow this — no breast circles, no chest shading.
- **Hip indication:** structural pelvis width only (from the rig's `leftHip`/`rightHip` joints). No hip-pad bulge.
- **Mass derivation:** widths from the §2 lookup table (function/weight-bearing, not gender).
- **Default = neutral; opt-in specificity is a future feature, not a current requirement.**

**(d) Sources.**
- Microsoft Inclusive Design Toolkit — **Strong** — https://inclusive.microsoft.design/ (and the underlying manual: https://inclusive.microsoft.design/tools-and-activities/)
- W3C WAI, "Designing for Inclusion" overview — **Strong** — https://www.w3.org/WAI/users/inclusive-design/
- W3C WAI, "Diverse Abilities and Barriers" (barriers relevant to representation defaults) — **Strong** — https://www.w3.org/WAI/people-use-web/user-stories/
- Loomis, A. (1943), *Figure Drawing for All It's Worth* — canonical proportional canons (7.5 realistic, 8 heroic, 9 fashion-illustration). Internet Archive. — **Strong** — https://archive.org/details/loomis_FIGURE-drawing
- Bi-iliac / bi-acromial breadth dimorphism figures — **Practitioner heuristic — unsourced** for the specific "1:1 to 1.05:1 neutral ratio" range. The underlying anthropometric data (e.g., NHANES, ICIDO) is peer-reviewed but no single citable URL consolidates it for design use; the "0.5–1.5 cm dimorphism, exaggerated defaults are stylistic" claim is a synthesis consistent with standard biological-anthropology teaching.
- "Provide a neutral default; let the user opt into specificity" — **Practitioner heuristic — unsourced** (consistent with both Microsoft Inclusive Design and WAI but not a direct quotation from either).

---

## 6. Camera-Overlay Readability — translucent guide over live video

**(a) Principle.** A translucent overlay guide shown over a live camera feed must remain readable across arbitrary background luminance, hue, and motion. The governing principle is **luminance contrast + outline + low-fill**, never hue alone. WCAG 2.1 SC 1.4.11 *Non-text Contrast* requires a minimum 3:1 contrast ratio for "user interface components and graphical objects" against adjacent colours. For a translucent overlay this is impossible to guarantee against every background, so the robust pattern is: (i) **draw a high-contrast outline** (≥ 2 px stroke, luminance contrast ≥ 3:1 against the *expected* background — for general camera use, white outline + dark core, or vice versa), (ii) **low-alpha fill** (15–35% — enough to read as a body, low enough that background shows through and the user can match their own body to it), (iii) **subtle glow / halo** (a `shadowBlur` of 6–12 px in the same hue family) to separate the guide from background detail, (iv) **never rely on hue alone** — colour-blind users (~8% of men, ~0.5% of women) cannot distinguish red/green overlays; the cyan-aqua `#3EA9B8` currently used by PoseArt's ghost is *good* for protanopia/deuteranopia (cyan remains distinct from red/green skin tones) but should still be paired with a luminance-contrasting outline so it survives a bright cyan-background (e.g., blue sky) scene, (v) **minimum stroke width ≥ 2 px** at the smallest supported render scale (W3C 2.5.5 Target Size is about touch, but the same perceptual principle — "small is hard to perceive" — applies to strokes), (vi) **motion echo** (a faint trail of the last 2–3 frames at decreasing alpha) helps the user track alignment during fast movement but should be optional (perf cost).

**(b) Why it matters for PoseArt.** PoseArt's ghost overlay currently uses `COLOR_GHOST = '#3EA9B8'` (a single hue, lines 84–85) with a `shadowColor` halo (line 535) and a `haloGrad` radial gradient (lines 1142–1144) — so the glow/halo infrastructure is already in place. However, the fill is `avatarAlphaBase = 0.55` (line 1638) which is solid enough to occlude the user's own body, and there is no luminance-contrasting *outline* — the figure is hue-only on a hue-variable background. On a bright outdoor scene (cyan sky, green foliage) the ghost can vanish. Adding a 2 px white outline (luminance 1.0) around the cyan fill (luminance ≈ 0.45) gives ≥ 4:1 luminance contrast regardless of background.

**(c) Concrete technique / parameter range.**
- **Outline:** 2 px (minimum) to 3 px (recommended) stroke, white (`#FFFFFF`) or near-white (`#F4F1E8` Art-Nouveau ivory). Drawn as a `stroke()` pass after the fill pass.
- **Fill alpha:** 0.20–0.30 (down from current 0.55). Enough to read as a body, low enough to see the user through it.
- **Halo / glow:** `shadowBlur = 8 px`, `shadowColor = rgba(62,169,184,0.6)` (cyan-aqua, same hue as fill). Already partially implemented; tune from current 0.70 (line 535) down to 0.6.
- **Hue safety:** retain cyan-aqua `#3EA9B8` as the primary (good for protanopia/deuteranopia — Okabe & Ito palette includes cyan as a colour-blind-safe choice). Add the white outline so the figure survives cyan-dominant backgrounds.
- **Minimum stroke width:** enforce 2 px at the smallest render scale (mobile portrait, ≈ 360 px wide canvas). If the scale transform would shrink it below 2 px, clamp.
- **Motion echo (optional):** retain last 2 frames at alpha 0.15 and 0.07, drawn before the current frame. Off by default; toggle for low-light use.
- **Contrast verification:** measure the rendered overlay's luminance contrast against a calibrated mid-grey (`#808080`) and a worst-case cyan (`#3EA9B8`-dominant) background; both should pass WCAG 1.4.11's 3:1 minimum for the *outline*, not the fill.
- **Anti-pattern:** hue-only translucent fill with no outline (current state). Fails on hue-matching backgrounds.

**(d) Sources.**
- W3C, *Web Content Accessibility Guidelines (WCAG) 2.1*, Success Criterion 1.4.11 Non-text Contrast — **Strong** — https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html
- W3C, WCAG 2.1 SC 1.4.3 Contrast (Minimum) — **Strong** — https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
- WebAIM, "Color Contrast and Accessibility" — **Moderate** — https://webaim.org/articles/contrast/
- Okabe, M. & Ito, K. (2002), *Color Universal Design* — colour-blind-safe palette (cyan is one of the recommended hues) — **Strong** — https://jfly.uni-koeln.de/color/
- MDN, `CanvasRenderingContext2D.shadowBlur` and `shadowColor` — **Strong** — https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowBlur
- MDN, `CanvasRenderingContext2D.lineWidth` — **Strong** — https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth
- W3C, WCAG 2.1 SC 2.5.5 Target Size (perceptual-size principle extended to strokes) — **Moderate** (the SC is about touch targets, not strokes; the extension to stroke width is heuristic) — https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- Motion-echo / trail technique — **Practitioner heuristic — unsourced** (standard compositing technique; the specific 2-frame / 0.15–0.07 alpha values are heuristic).

---

## Synthesis — Design Directives

The following 10 directives translate the research into concrete, testable implementation requirements for the implementation lead. Each directive is phrased as a single change with an acceptance test. Directives are numbered D1–D10 and ordered by implementation dependency (D1–D4 are the silhouette language; D5–D7 are proportion/rhythm; D8–D10 are overlay/skeleton-specific).

**D1 — Single joint ellipse, drawn once, aligned to the limb bisector.**
Replace the current per-bone dual-`arc()` endpoint-circle pattern (`pose-skeleton-3d.js` lines 1733–1739) with **one ellipse per shared joint**, aligned to the bisector of `(dir_bone_in, dir_bone_out)`, with radii `(max(wA_prox, wA_dist) × 0.9, max(wA_prox, wA_dist) × 0.55)`. End joints (hand, foot) get a single terminal half-ellipse cap aligned to the last bone. *Acceptance:* no joint shows a visible double-outline or alpha-doubled "knot" at any zoom level; the silhouette outline is a single C⁰-continuous curve at every joint. *(Sources: §1; Practitioner heuristic — unsourced for the exact 0.9 / 0.55 constants.)*

**D2 — Bone capsules as cubic-Bézier tapered tubes, not 4-point polygons.**
Replace the current `lineTo`-polygon limb capsule (lines 1725–1732) with two cubic Béziers (one per long edge), control points at 1/3 and 2/3 of bone length, offset by local half-width `w(t) = w_prox·(1−t)^0.8 + w_dist·t^0.8`. *Acceptance:* each limb reads as a tapering tube with smooth curvature along its length, not a trapezoid; taper exponent 0.8 produces Mucha-like proximal swelling. *(Sources: §1, §2, §4.)*

**D3 — Camera-aware bounding-box centering (fix reclining mis-framing).**
Compute the screen-space bounding box over all projected joints plus their radii; translate the canvas so the box centroid — not a fixed joint — sits at frame centre. *Acceptance:* reclining poses (`p10-bench-s10-recline-legs-up-vertical`, `p16-bed-b2-recline-headboard-arm-up`, `p18-lounge-r10-full-length-recline-legs-crossed`) are fully framed without manual pan; standing poses remain centred. *(Sources: §2; Practitioner heuristic — unsourced.)*

**D4 — Foreshortening modulation of bone half-widths.**
Apply `screenW = baseW × clamp((modelLen / screenLen)^0.5, 0.55, 1.4)` to every bone's half-width. *Acceptance:* a limb pointing directly at the camera (foreshortened to near-zero screen length) is drawn up to 1.4× wider, preserving apparent mass; a limb in profile is drawn at 0.55–1.0× base width. *(Sources: §2; Practitioner heuristic — unsourced for the 0.55/1.4 clamp and 0.5 exponent.)*

**D5 — Replace gendered hourglass waist with structural waist.**
Replace `waistW = Math.max(hipW * 0.65, 7)` (line 1654) with `waistW = 0.5 × (ribcageW + pelvisW) - 0.02`, where `ribcageW` is derived from the spine joint and `pelvisW` from the hips joint. Ribcage : pelvis ratio = 1.00–1.05 (androgynous neutral). *Acceptance:* the avatar silhouette has no hourglass pinch; the waist reads as a structural narrowing, not a gendered one; the figure works for all 745 poses without gendered assumptions. *(Sources: §2, §5.)*

**D6 — Art-Nouveau proportions: 7.5 heads, oval head, elongated neck.**
Set total figure height to 7.5 × head length; head rendered as upright ellipse `rx : ry = 1 : 1.35`; neck length 0.40 × head length. *Acceptance:* the avatar reads as elegant-androgynous (not heroic 8-head, not chibi 5-head); the head is an oval (not a circle); the neck is visibly elongated (Mucha signature). *(Sources: §4, §5.)*

**D7 — Line-of-action flank asymmetry (subtle, not a drawn overlay).**
Extract the line-of-action Bézier through `head → neck → spine → hips → weight-bearing hip`; offset the torso contour's convex-side flank outward by `+0.015 × modelLen` and the concave-side flank inward by `−0.010 × modelLen` based on the line-of-action's local curvature sign. Preserve negative-space gaps ≥ `0.06 × modelLen`. **Do not** draw a literal line-of-action stroke over the figure. *Acceptance:* contrapposto and reclining poses show a visible (subtle) S-curve in the silhouette; standing poses read with a clear gesture; no overlay stroke is rendered. *(Sources: §3; Practitioner heuristic — unsourced for the exact offsets.)*

**D8 — Ghost overlay: outline + low-fill + halo (WCAG 1.4.11 compliant).**
Add a 2–3 px white (`#FFFFFF` or `#F4F1E8`) outline stroke after the cyan fill; reduce fill alpha from 0.55 to 0.20–0.30; tune `shadowColor` from 0.70 to 0.60 alpha and `shadowBlur` to 8 px. Retain `#3EA9B8` as the primary hue (colour-blind-safe per Okabe & Ito). *Acceptance:* the ghost outline passes WCAG 1.4.11's 3:1 luminance contrast against both mid-grey (`#808080`) and cyan-dominant (`#3EA9B8`-match) backgrounds; the user's own body is visible through the fill; the figure does not vanish on cyan/green outdoor backgrounds. *(Sources: §6.)*

**D9 — Minimum stroke width clamp at smallest render scale.**
At the smallest supported render scale (mobile portrait, ≈ 360 px canvas width), enforce minimum stroke ≥ 2 px via `Math.max(scaleFactor × baseStroke, 2)`. *Acceptance:* at 360 px width, no stroke in the skeleton/ghost renderer is thinner than 2 px; joints and bones remain perceivable. *(Sources: §6; extension of WCAG 2.5.5 principle.)*

**D10 — Skeleton renderer shares the D1 joint-ellipse fix.**
Apply D1 (single joint ellipse, bisector-aligned) to the skeleton renderer's joint circles as well — the current skeleton draws `arc()` per joint which is correct (one circle per joint) but the circle should be replaced with the same bisector-aligned ellipse used by the avatar, sized to `max(adjacent proximal widths) × 0.9`, so skeleton and avatar share a single joint-shape convention. *Acceptance:* skeleton joints visually match avatar joints in size and orientation; no renderer-specific joint divergence. *(Sources: §1, §2.)*

---

## Sources

| Source | Area | Strength | URL |
|---|---|---|---|
| MDN, `CanvasRenderingContext2D.bezierCurveTo()` | §1 | Strong | https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo |
| MDN, `CanvasRenderingContext2D.quadraticCurveTo()` | §1 | Strong | https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo |
| MDN, Canvas API Tutorial | §1 | Strong | https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial |
| Pomax, *A Primer on Bézier Curves* | §1 | Moderate | https://pomax.github.io/bezierinfo/ |
| Catmull & Rom (1974), "A Class of Local Interpolating Splines" | §1 | Strong | (book chapter; no canonical free URL — Practitioner heuristic for the conversion constants) |
| Wikipedia, "Skeletal animation" | §2 | Moderate | https://en.wikipedia.org/wiki/Skeletal_animation |
| NVIDIA, *GPU Gems 3* Ch. 2 | §2 | Strong | https://developer.nvidia.com/gpugems/gpugems3/part-i-geometry/chapter-02/animated-characters-skinning-and-morph-targets |
| Wikipedia, "Metaballs" | §2 | Moderate | https://en.wikipedia.org/wiki/Metaball |
| Stanchfield, *Drawn to Life* (Focal Press 2009) | §3 | Strong | (book; transcription: https://web.archive.org/web/2020/https://sevencamels.blogspot.com/search/label/walt%20stanchfield) |
| Vilppu, *Vilppu Drawing Manual* | §3 | Strong | http://www.vilppustudio.com/ |
| Loomis, *Figure Drawing for All It's Worth* (1943) | §3, §4, §5 | Strong | https://archive.org/details/loomis_FIGURE-drawing |
| Hale, *Drawing Lessons from the Great Masters* (1964) | §3 | Strong | (book; no canonical free URL) |
| Wikimedia Commons, "Alphonse Mucha" (PD scans) | §4 | Strong | https://commons.wikimedia.org/wiki/Alphonse_Mucha |
| Wikimedia Commons, "Aubrey Beardsley" (PD scans) | §4 | Strong | https://commons.wikimedia.org/wiki/Aubrey_Beardsley |
| Wikimedia Commons, "Eugène Grasset" (PD scans) | §4 | Strong | https://commons.wikimedia.org/wiki/Eug%C3%A8ne_Grasset |
| The Metropolitan Museum of Art, Heilbrunn Timeline — "Art Nouveau" | §4 | Strong | https://www.metmuseum.org/toah/hd/artn/hd_artn.htm |
| Cornell University, Hirtle "Copyright Term and the Public Domain in the US" | §4 | Strong | https://copyright.cornell.edu/publicdomain/ |
| Mucha, *Documents Décoratifs* (1902, PD) | §4 | Strong | https://archive.org/details/documentsdecorat00much |
| Microsoft Inclusive Design Toolkit | §5 | Strong | https://inclusive.microsoft.design/ |
| W3C WAI, "Designing for Inclusion" | §5 | Strong | https://www.w3.org/WAI/users/inclusive-design/ |
| W3C WAI, "Diverse Abilities and Barriers" | §5 | Strong | https://www.w3.org/WAI/people-use-web/user-stories/ |
| W3C, WCAG 2.1 SC 1.4.11 Non-text Contrast | §6 | Strong | https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html |
| W3C, WCAG 2.1 SC 1.4.3 Contrast (Minimum) | §6 | Strong | https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum |
| WebAIM, "Color Contrast and Accessibility" | §6 | Moderate | https://webaim.org/articles/contrast/ |
| Okabe & Ito (2002), *Color Universal Design* | §6 | Strong | https://jfly.uni-koeln.de/color/ |
| MDN, `CanvasRenderingContext2D.shadowBlur` | §6 | Strong | https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowBlur |
| MDN, `CanvasRenderingContext2D.lineWidth` | §6 | Strong | https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth |
| W3C, WCAG 2.1 SC 2.5.5 Target Size | §6 | Moderate | https://www.w3.org/WAI/WCAG21/Understanding/target-size.html |
| Practitioner heuristic — joint-bisector ellipse sizing (0.9× rule) | §1, D1 | Practitioner heuristic — unsourced | (standard 2D-rigging convention; no single canonical source) |
| Practitioner heuristic — foreshortening width formula | §2, D4 | Practitioner heuristic — unsourced | (standard 2.5D game-asset pipeline) |
| Practitioner heuristic — bounding-box centering | §2, D3 | Practitioner heuristic — unsourced | (standard viewport-fit technique) |
| Practitioner heuristic — line-of-action flank offsets | §3, D7 | Practitioner heuristic — unsourced | (gesture-drawing pedagogy; specific px range is heuristic) |
| Practitioner heuristic — androgynous 1:1–1.05:1 ribcage:pelvis ratio | §5, D5 | Practitioner heuristic — unsourced | (synthesis consistent with anthropometric literature; no single design-citation) |
| Practitioner heuristic — motion-echo trail (2-frame, 0.15/0.07 alpha) | §6 | Practitioner heuristic — unsourced | (standard compositing technique) |

---

*End of research ledger. This document is research-only; no application code was modified. The implementation lead should treat D1–D10 as the testable directive set and the Sources table as the citation backbone for any subsequent design review.*
