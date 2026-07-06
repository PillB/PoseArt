# FABLE Analysis — PoseArt v1

*Senior mobile UX architect & camera-tech engineering review*
*Model: Facts · Analysis · Benefits · Limitations · Examples/Evidence*
*Date: July 5, 2026*

---

## Reference apps used as evidence

- **Posei — AI Pose Camera & Guide** (direct competitor, nearly identical concept): 200+ curated pose templates across aesthetics (Korean, Japanese, Street, Vintage, Editorial, Cute, Cool), filterable by scene (café, beach, mirror, night, indoor) and group size (solo, couple, group); on-device body-pose AI tracking **19 joints at 30 fps**; live alignment score; per-joint hints ("raise left arm", "tilt head right"); **auto-capture at 85% for 1.5s with haptic feedback**; translucent white silhouette overlay on live camera with subtle ambient animation; front + rear camera; pro editor with presets + manual sliders; custom pose studio (import reference photos); gallery organized by date with favorite/edit/share/export and direct share to Instagram/TikTok/Messages ([Posei on the App Store](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- **Nike Training Club**: freemium on-demand platform with **180+ guided workouts**, personalized plans, expert tips; all premium content made free with optional gear purchases; gamification via streaks/progress ([Appventurez NTC case study](https://www.appventurez.com/blog/nike-training-club-app-case-study), [Fitness Engineer NTC guide](https://ai-fitness-engineer.com/nike-training-club)).
- **UNSCRIPTED Photography Posing**: **14,000+ poses and prompts**, section for every photography style, built-in golden-hour/blue-hour Sun Tracker keyed to location and date, editable client guides, education tab with weekly-updated articles; 400,000+ registered users ([UNSCRIPTED site](https://unscriptedphotographers.com), [Google Play listing](https://play.google.com/store/apps/details?id=com.unscripted.posing.app), [walkthrough video](https://www.youtube.com/watch?v=ireu_WVlB6o)).
- **Fyter / Fitness AR**: AR-guided workouts with skeletal tracking and AR obstacles, rep monitoring, leaderboards, HealthKit integration ([Fyter on the App Store](https://apps.apple.com/us/app/fyter-ar-fitness-workouts/id1502336594)).
- **TensorFlow.js MoveNet / MediaPipe BlazePose**: MoveNet detects **17 keypoints**, runs 30+ fps entirely client-side in the browser via TensorFlow.js with no server calls after page load — proven feasible for live fitness on phones ([TensorFlow Blog: MoveNet](https://blog.tensorflow.org/2021/05/next-generation-pose-detection-with-movenet-and-tensorflowjs.html), [tfjs-models pose-detection](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/movenet)).
- **Pose Animator (Google)**: animates a 2D vector illustration's curves in real time from PoseNet + FaceMesh output, applying skeleton-based animation to vector characters — the exact bridge between static SVG figures and live rigged guides ([Pose Animator on GitHub](https://github.com/yemount/pose-animator)).
- **Easy Pose / Magic Poser**: reference-figure posing apps — Magic Poser ships **3000+ preset poses**, drag-and-pose with a physics engine, multiple body types; Easy Pose offers ~60 poses with mirroring and multi-model scenes ([Magic Poser on Google Play](https://play.google.com/store/apps/details?id=com.magicposernew), [Easy Pose on Google Play](https://play.google.com/store/apps/details?id=com.madcat.easyposer)).
- **Scoring research**: biomechanics establishes pose-conditioned joint-angle limits with dependencies between bone pairs ([MPI Pose-Conditioned Joint Angle Limits, CVPR 2015](https://files.is.tue.mpg.de/black/papers/PosePriorCVPR2015.pdf)); Procrustes alignment (translation/scale/rotation) is the standard for pose comparison but "hides many sins" and the field is moving away from it ([SMPL made simple FAQs](https://files.is.tue.mpg.de/black/talks/SMPL-made-simple-FAQs.pdf)).
- **Onboarding/permission best practice**: defer camera permission until the feature is invoked with a pre-permission priming screen; deferred prompts see ~28% higher grant rates and priming can improve grant rates up to 81%; degrade gracefully on denial ([Dogtown Media permissions guide](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/), [AdoptKit onboarding](https://www.adoptkit.com/posts/mobile-app-onboarding-best-practices), [Appy Pie onboarding](https://www.appypie.com/blog/app-onboarding-best-practices)).

---

# 1. Onboarding flow (OB-1 → OB-4)

### Facts
- Four-screen static intro flow (OB-1 through OB-4) presented on first launch.
- Sits before the user reaches any live camera or pose interaction.
- Communicates the value proposition of real-time pose coaching across the sequence.
- Uses the Art Nouveau "Peacock Fresco" palette and Cormorant Garamond/Inter typography for a branded first impression.
- No camera-permission priming is described as tied to a specific in-context trigger; the flow is a linear carousel.

### Analysis
- A four-screen carousel is within the "5 screens for complex apps" band, but static slideshows are considered outdated versus interactive, learn-by-doing onboarding ([dots-mobile best practices](https://www.dots-mobile.com/blog-posts/mobile-app-onboarding-best-practices)).
- Because the app's entire value is live camera coaching, camera permission is a "critical/expected" permission — one of the rare valid cases to request early, but still best gated behind a priming screen that names the feature, not the permission ([Dogtown Media permissions guide](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/)).
- The flow does not appear to get users to a first meaningful action in under 30–60s; four passive screens delay time-to-value ([AdoptKit onboarding](https://www.adoptkit.com/posts/mobile-app-onboarding-best-practices)).
- No preference/goal survey means the app cannot personalize the first pose recommendation, missing the 2–3 question personalization win ([LowCode onboarding](https://www.lowcode.agency/blog/mobile-onboarding-best-practices)).
- No described "skip" affordance or progress dots, both standard anxiety reducers.

### Benefits
- Four screens is a reasonable, non-overwhelming length for an app that must explain a novel camera-coaching concept.
- Strong, distinctive visual identity from the first frame builds brand memorability, which most utilitarian fitness apps lack.
- A dedicated flow gives room to explain the auto-capture and scoring mechanics that are non-obvious to new users.
- Front-loading the concept reduces confusion when the user later sees a skeleton overlay and score ring.

### Limitations (harsh)
- **Passive carousel, no interaction** — violates the modern "teach through use" principle; users forget static slides immediately ([dots-mobile](https://www.dots-mobile.com/blog-posts/mobile-app-onboarding-best-practices)).
- **No permission priming screen** described — jumping to the OS camera dialog without a benefit-framed pre-prompt leaves grant-rate uplift (up to 81%) on the table ([Dogtown Media](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/)).
- **No graceful degradation path** if camera is denied — the app should fall back to simulation *and* show a deep-link-to-Settings recovery, but this isn't specified.
- **No goal/skill personalization** — cannot tailor first pose or difficulty, hurting long-term engagement.
- **No "skip" and no progress indicator** — increases perceived friction and abandonment.
- **No offline/interrupt safety** described (onboarding should save progress if the app closes) ([AdoptKit](https://www.adoptkit.com/posts/mobile-app-onboarding-best-practices)).
- **Doesn't demonstrate the "aha"** — the strongest onboarding would drop the user into a 15-second simulated live pose with an auto-capture win, not describe it.

### Examples / Evidence
- Nielsen Norman content formula for permission priming: "[App] would like to access your [resource] so that you can [benefit/task]" — e.g. "PoseArt uses your camera so you can see a live pose guide and auto-capture the shot" ([Dogtown Media](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/)).
- Best practice is to reach first value in under 60s: splash → single value screen → one critical permission → core action → value delivered ([AdoptKit](https://www.adoptkit.com/posts/mobile-app-onboarding-best-practices)).
- Posei's onboarding is essentially "pick a pose → line up the silhouette → AI auto-captures," collapsing explanation into a single hands-on loop ([Posei App Store](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).

---

# 2. Pose browsing flow (Home → Poses tab → Category → Detail sheet)

### Facts
- Navigation: Home → Poses tab → Category grid → pose Detail bottom sheet.
- 10 categories are surfaced (standing, seated, leaning, dynamic, eccentric, couple, accessible, kneeling, reclining, lean-seated).
- Category grid shows counts (e.g. "10 poses") but the library holds only **1–2 poses per category** (12 total).
- Detail sheet renders a Mucha-inspired SVG avatar figure (previously cropped, now fixed).
- No search, no filtering by scene/difficulty/body type, no favorites described.

### Analysis
- The information architecture (browse → category → detail) is conventional and sound, but the content depth does not support it: a 10-category grid implies breadth the 12-pose library cannot deliver.
- Displayed counts appear to be placeholder/aspirational numbers, not bound to actual data — a trust-eroding mismatch between UI promise and content.
- A detail bottom sheet is the right pattern for quick preview, but a static SVG can't convey pose entry/motion the way a short loop or 3D figure can.
- With only 12 items, browsing overhead (tabs, categories, grids) exceeds the content — users will exhaust the library in one session.

### Benefits
- Clean, familiar browse hierarchy that users already understand from app-store and streaming patterns.
- Bottom sheet keeps the user in context and is thumb-reachable on a 430×932 layout.
- Category taxonomy is thoughtful and inclusive (an "accessible" category is a genuine differentiator most competitors lack).
- The Mucha-styled figures give the library a curated, editorial feel rather than clinical stick figures.

### Limitations (harsh)
- **Counts lie** — showing "10 poses" over a category with 1–2 real entries is a direct credibility break the moment a user taps in.
- **Catastrophic content shortfall** — 12 poses vs Posei's 200+ and UNSCRIPTED's 14,000+; the library is ~6% the size of the nearest direct competitor ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241), [UNSCRIPTED](https://unscriptedphotographers.com)).
- **No search or filter** — competitors filter by scene, group size, style, and difficulty; PoseArt offers none.
- **No favorites / recents / "used most"** — Posei tracks most-used poses; PoseArt has no personal curation.
- **No difficulty or duration metadata** surfaced to help users choose.
- **Static preview only** — the sheet can't show how to get into the pose, a core need for coaching.
- **10 empty-ish categories** create a "hollow shell" perception that damages retention after first open.

### Examples / Evidence
- Posei filters 200+ templates by scene (café, beach, mirror, night, indoor) and group size (solo, couple, group), and tracks which poses you use most ([Posei App Store](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- UNSCRIPTED has "a section for every single different style of photography" across 14,000+ poses, with new poses added weekly ([UNSCRIPTED walkthrough](https://www.youtube.com/watch?v=ireu_WVlB6o), [UNSCRIPTED site](https://unscriptedphotographers.com)).
- Magic Poser ships 3000+ preset poses for full-body/hands/feet as browsable inspiration ([Magic Poser](https://play.google.com/store/apps/details?id=com.magicposernew)).

---

# 3. Camera session flow (Setup → Countdown → Active → Auto-capture → Review → Save)

### Facts
- Session Setup exposes timer delay, feedback mode, overlay style, and sensitivity.
- Countdown → Active session → Auto-capture at 85% alignment held 1.5s → Review → Save.
- Auto-capture fires a particle-bloom celebration.
- In simulation mode the "Active" screen shows a plain parchment background (no live video).
- No photo gallery / capture review archive, no sequence mode, no manual shutter described.

### Analysis
- The setup → active → capture → review skeleton matches proven hands-free capture flows; the 85%-for-1.5s auto-capture threshold is identical to Posei's, indicating a well-benchmarked default ([Posei App Store](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- Surfacing sensitivity/overlay/feedback in setup is powerful but risks front-loading configuration before the user understands the terms — better as in-session quick toggles.
- The absence of a persistent gallery breaks the capture→review→save→revisit loop; a "Save" with nowhere to go afterward is a dead end.
- Plain parchment behind the active session (in sim mode) severs the mental model that this is a *camera* experience; users can't rehearse framing.
- No manual shutter means a user who is happy at, say, 80% can't capture — the flow is entirely gated on the algorithm.

### Benefits
- Hands-free auto-capture is the marquee, genuinely delightful mechanic and it's present.
- The particle bloom gives a satisfying success state (good "success state" onboarding principle).
- Session setup gives power users meaningful control (delay, sensitivity).
- The staged flow (countdown → active → review) sets clear expectations and reduces the "when does it take the photo?" anxiety.

### Limitations (harsh)
- **No gallery / capture history** — Posei organizes all captures by date with favorite/edit/share/export; PoseArt's "Save" has no destination described.
- **No manual shutter fallback** — Posei keeps a manual shutter available anytime; auto-only is fragile if scoring misfires ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- **No live video in the active state (sim mode)** — parchment background makes rehearsal and framing impossible and kills the AR illusion.
- **No haptic feedback on capture** — Posei pairs auto-capture with haptics; visual-only bloom is weaker on mobile.
- **Setup over-configuration** — four settings before the first session is friction; sensible defaults with in-session tweaks are better.
- **No post-capture editing** — no crop, presets, or light retouch, so the "Save" output is unpolished versus competitors.
- **No sequence / multi-shot mode** — every session is one pose; no guided flow of 3–5 poses.
- **No front/rear camera toggle** mentioned — Posei supports both; solo users need the front camera.

### Examples / Evidence
- Posei: "When alignment hits 85% for 1.5 seconds, Posei snaps automatically with haptic feedback… Manual shutter available anytime." plus a full editor (Clean, Warm, Film, B&W, Faded, Moody presets + brightness/contrast/warmth/sharpen/vignette/skin-smoothing) and date-organized gallery with one-tap export ([Posei App Store](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- Fyter monitors every rep and logs sessions to Apple HealthKit, closing the capture→record→review loop ([Fyter](https://apps.apple.com/us/app/fyter-ar-fitness-workouts/id1502336594)).

---

# 4. Camera overlay system (how the pose guide appears during a live session)

### Facts
- The app draws a skeleton canvas overlay: connections plus color-coded dots (green = correct, gold = partial, terracotta = error).
- A score ring HUD and status label update live via `updateHUD()`.
- `jointToHint()` generates directional hints per joint.
- **There is no pose-reference figure overlaid on the camera feed** — the guide is only the user's own detected skeleton, not a target silhouette to match.
- In simulation mode there is no live video underneath the overlay at all.

### Analysis
- The current overlay visualizes *the user's* skeleton and correctness, but not *the target* pose — so the user has no spatial "aim at this shape" reference, which is the single most important AR-coaching affordance.
- Color-coded joints are good for correction feedback but poor for acquisition: they tell you a joint is wrong, not where it should go, unless the hint text is read (cognitive load mid-pose).
- Canvas skeleton rendering is cheap and cross-device-safe, but a translucent target silhouette (the Posei approach) is what makes alignment intuitive.
- "Environmental embedding" — aligning your body to a virtual overlay in your real scene — is the affordance most strongly tied to engagement in AR-fitness research; PoseArt's overlay is missing that embedding target ([Digital Health AR study, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13014001/)).

### Benefits
- Color-coded skeleton is an immediately legible correctness signal and is technically lightweight.
- The score ring gives a single-glance "how close am I" metric that supports the auto-capture mechanic.
- Per-joint hint generation is a solid foundation once paired with a visual target.
- Canvas overlay approach is portable and avoids heavy AR frameworks.

### Limitations (harsh)
- **No target reference on the feed** — the defining feature of the category (translucent pose silhouette) is absent; users are correcting toward an invisible goal.
- **No live video in sim mode** — overlay floats on parchment, so the AR mental model never forms.
- **Correction-only, not acquisition** — color dots say "wrong" but the shape to hit isn't drawn.
- **Text hints compete with visual attention** — reading "raise left arm" mid-pose is high-load versus seeing a ghost limb to match.
- **No front/rear mirroring handling** described — selfie-mode skeletons must be mirrored or left/right hints invert.
- **No ambient motion / life** — Posei adds "subtle ambient animation" to keep the overlay relaxed; a static skeleton feels clinical.
- **Single-body assumption** — couple/group poses need multi-person overlay; not evidenced.

### Examples / Evidence
- Posei: "A translucent white outline of the chosen pose floats over your camera preview. Front + rear camera supported. Subtle ambient animation keeps it relaxed while you frame the shot." — this is the exact overlay PoseArt lacks ([Posei App Store](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- Google's Pose Animator shows a 2D vector figure can be driven live from PoseNet in the browser — a ready pattern for an animated ghost target ([Pose Animator](https://github.com/yemount/pose-animator)).
- AR-fitness research identifies "environmental embedding" (aligning posture to real-time virtual scenarios overlaid on your scene) as a key driver of engagement and well-being ([Digital Health, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13014001/)).

---

# 5. Pose library data (12 poses vs claimed 10 categories × ~5–8 poses each)

### Facts
- 12 poses total defined in the library.
- 10 categories advertised; most have 1–2 actual poses.
- Category grid shows aspirational counts (e.g. "10 poses") not matching real data.
- Each pose carries reference keypoints/angles for scoring and an SVG figure (8 figure types).
- No content pipeline (import, weekly additions, community) described.

### Analysis
- Content is the moat in this category, and PoseArt is ~6% of Posei's catalog and ~0.09% of UNSCRIPTED's — a strategic, not cosmetic, gap ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241), [UNSCRIPTED](https://unscriptedphotographers.com)).
- 8 figure types spread across 12 poses means the figure/pose mapping is thin; some poses likely reuse figures loosely.
- No authoring/import pipeline means the library can't scale without hand-coding each pose's reference angles.
- Displayed counts diverging from real data is a data-integrity bug, not just a content gap.

### Benefits
- 12 hand-crafted poses with reference angles is enough to validate the core scoring + capture loop end-to-end.
- The 10-category taxonomy is a sound skeleton to grow into (including the differentiating "accessible" category).
- Reference-angle-per-pose data model is reusable and extensible if a pipeline is added.

### Limitations (harsh)
- **Content is nowhere near viable** — 12 poses cannot sustain more than one session; churn is inevitable.
- **Fake counts** — UI shows counts the data doesn't back, which users will catch instantly.
- **No import / custom pose studio** — Posei lets users import reference photos to create templates; PoseArt has no user-generated content path ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- **No cadence of new content** — UNSCRIPTED adds poses weekly; PoseArt has no freshness engine ([UNSCRIPTED walkthrough](https://www.youtube.com/watch?v=ireu_WVlB6o)).
- **Reference angles hand-authored** — doesn't scale; deriving angles from a captured/imported photo via pose estimation would.
- **No metadata depth** (difficulty, body-type suitability, scene) to power filtering.
- **Categories unevenly populated** — some may have zero real poses behind the count.

### Examples / Evidence
- Posei: 200+ curated templates + Custom Pose Studio (import your own reference photos to create templates) ([Posei App Store](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- UNSCRIPTED: 14,000+ poses and prompts, new poses added every week, 400,000+ users ([UNSCRIPTED site](https://unscriptedphotographers.com), [walkthrough](https://www.youtube.com/watch?v=ireu_WVlB6o)).
- Magic Poser: 3000+ preset poses; content depth is the product ([Magic Poser](https://play.google.com/store/apps/details?id=com.magicposernew)).

---

# 6. Sprite / animation approach (static SVG figures vs animated guides)

### Facts
- Guides are static, Mucha-inspired SVG avatar figures (8 figure types).
- Simulation adds sway/breathe oscillation to synthetic keypoints, but the reference figure itself is static.
- No rigged/skeletal animation of the reference figure; no "how to enter the pose" motion.
- Overlay drawing is a canvas skeleton, separate from the SVG figures.

### Analysis
- Static SVG is cheap and on-brand, but pose *coaching* benefits from motion: showing the transition into a pose and an idle "breathing" target reduces ambiguity.
- Skeletal (rigged) animation — define bones once, keyframe/IK the motion — is the standard scalable approach versus frame-by-frame; it also enables driving a figure live from detected keypoints ([Adobe rigging explainer](https://www.adobe.com/uk/creativecloud/animation/discover/rigging.html), [Charios frame-by-frame vs skeletal](https://charios.com/blog/frame-by-frame-vs-skeletal-animation-2d)).
- Because the SVG figures already imply a skeleton, converting them to a rigged system (à la Pose Animator) is a natural, high-leverage upgrade rather than a rebuild.
- Sway/breathe on synthetic keypoints proves the team can animate a skeleton; that motion just isn't applied to the *guide* figure.

### Benefits
- Static SVG figures are tiny, resolution-independent, and give a premium editorial identity competitors lack.
- 8 figure types provide stylistic variety without heavy assets.
- The existing sway/breathe logic is a proven building block for animated idles.
- Canvas + SVG separation keeps rendering performant on the 430×932 mobile target.

### Limitations (harsh)
- **No motion guidance** — a static figure can't show how to *get into* a pose; users must infer the transition.
- **No live-rigged ghost** — the figure can't animate to match or lead the user's body, the highest-value overlay upgrade.
- **Idle figures feel lifeless** — Posei's "subtle ambient animation" sets a relaxed tone; static art feels like a poster, not a coach ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- **8 types won't cover couple/group/accessible variety** — different body types and multi-person poses need more rigs or morphable figures.
- **No frame-by-frame or skeletal pipeline** means every new animated behavior is bespoke.
- **Figures decoupled from scoring skeleton** — two separate representations risk drift between what's shown and what's scored.

### Examples / Evidence
- Google Pose Animator animates a 2D vector illustration's curves in real time from PoseNet + FaceMesh — precisely the technique to make the SVG figures live ([Pose Animator](https://github.com/yemount/pose-animator)).
- Skeletal animation defines a rig once and reuses it across poses via keyframing and inverse kinematics, unlike bespoke frame-by-frame art ([Adobe](https://www.adobe.com/uk/creativecloud/animation/discover/rigging.html), [Charios](https://charios.com/blog/frame-by-frame-vs-skeletal-animation-2d)).
- Fyter uses "smart skeletal tracking and interactive animations" so users "always stay in great form" — motion is central to the coaching value ([Fyter](https://apps.apple.com/us/app/fyter-ar-fitness-workouts/id1502336594)).

---

# 7. Alignment scoring & feedback (joint angles, hints, score ring)

### Facts
- `computeJointAngles()` computes 2D joint angles; deltas vs reference are weighted into a 0–100% aggregate.
- Keypoints smoothed with EMA (alpha = 0.4).
- `jointToHint()` emits directional hints per joint; color-codes green/gold/terracotta.
- Hint hysteresis: errors must persist 1500ms before surfacing; auto-capture triggers at 85% for 1.5s.
- Simulation generates 17 joints with sin-wave natural motion.

### Analysis
- 2D joint-angle comparison is a reasonable, lightweight scoring method and aligns with biomechanics use of joint-angle limits — but 2D angles are viewpoint-dependent and conflate depth/rotation ([MPI joint-angle limits](https://files.is.tue.mpg.de/black/papers/PosePriorCVPR2015.pdf)).
- The standard alternative, Procrustes alignment (normalizing translation/scale/rotation before comparing), is more robust to camera position but "hides many sins" and the research field is actively moving away from over-reliance on it — so a hybrid (Procrustes-normalize, then joint-angle deltas) is the pragmatic sweet spot ([SMPL FAQs](https://files.is.tue.mpg.de/black/talks/SMPL-made-simple-FAQs.pdf)).
- EMA alpha 0.4 and 1500ms hysteresis are sensible anti-jitter choices; they trade latency for stability, which matches a "hold the pose" interaction.
- 17 joints matches MoveNet; the sim's sin-wave motion is a good stand-in but real-body variance (occlusion, low confidence) isn't modeled.

### Benefits
- Joint-angle scoring is scale/translation-tolerant for angle terms and computationally trivial — good for 30fps mobile.
- Weighted aggregate lets important joints dominate the score sensibly.
- EMA + hysteresis produce a calm, non-flickering score ring and stable hints (no nagging).
- Directional per-joint hints are genuinely actionable when surfaced.
- 85%/1.5s threshold is benchmarked to the category leader, so defaults feel right ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).

### Limitations (harsh)
- **2D angles are viewpoint-fragile** — the same pose scores differently by camera angle; no Procrustes normalization to correct for pose/scale/rotation ([SMPL FAQs](https://files.is.tue.mpg.de/black/talks/SMPL-made-simple-FAQs.pdf)).
- **No keypoint-confidence gating** — MoveNet emits per-keypoint confidence; scoring occluded/low-confidence joints produces false errors.
- **Ignores biomechanical joint dependencies** — joint-angle validity depends on neighboring bones; independent per-joint deltas can flag anatomically-fine poses as wrong ([MPI joint-angle limits](https://files.is.tue.mpg.de/black/papers/PosePriorCVPR2015.pdf)).
- **Mirroring/left-right ambiguity** — front-camera use flips left/right; hints like "raise left arm" invert if not handled.
- **Sim doesn't model failure modes** — real users hit occlusion, partial framing, and low light the sim's clean sin-waves never reproduce, so the loop is under-tested.
- **Single 85% threshold for all poses** — dynamic/eccentric poses likely need different tolerances than a static standing pose.
- **No confidence/quality indicator to user** — user can't tell if a low score is their pose or the tracker losing them.

### Examples / Evidence
- Posei tracks 19 joints at 30fps and gives a live alignment score plus per-joint hints ("raise left arm", "tilt head right") — validating the joint + hint model at higher joint density ([Posei App Store](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- MoveNet provides 17 keypoints with confidence at 30+fps client-side, enabling confidence-gated scoring ([TensorFlow Blog](https://blog.tensorflow.org/2021/05/next-generation-pose-detection-with-movenet-and-tensorflowjs.html)).
- PA-MPJPE (Procrustes-aligned) is the standard pose-comparison metric precisely because it removes translation/scale/rotation before comparing joints ([SMPL FAQs](https://files.is.tue.mpg.de/black/talks/SMPL-made-simple-FAQs.pdf)).

---

# 8. Overall navigation & feature set (5-tab bottom bar, progress, profile)

### Facts
- Five-tab bottom navigation: Home, Poses, Session, Progress, Profile.
- Progress tracking is in-memory only (not persisted).
- Profile tab present; contents/settings scope not fully specified.
- No social/leaderboard, no sharing/export, no account/sync described.
- Palette: Deep Teal #0F3B3A, Emerald #1E7A74, Cobalt #2B5FAD, Antique Gold #C9A24C, Parchment #F6F0E1.

### Analysis
- Five tabs is at the ceiling of comfortable bottom-bar nav; "Session" as its own tab is unusual since a session is an action, not a destination — a center FAB/capture button is the more conventional pattern.
- In-memory progress means all history evaporates on reload — progress tracking that doesn't persist is effectively decorative and undermines retention/gamification.
- No sharing/export closes off the growth loop that Posei (Instagram/TikTok/Messages) and UNSCRIPTED (client guides) rely on ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- The palette and type system are a genuine strength — a coherent, premium identity that differentiates from utilitarian competitors.

### Benefits
- Bottom-tab IA is universally understood and thumb-friendly on the tall mobile layout.
- Dedicated Progress and Profile tabs signal a retention/identity strategy is intended.
- The Art Nouveau design system is distinctive, cohesive, and memorable — a real competitive asset.
- Home + Poses separation supports both editorial discovery and structured browsing.

### Limitations (harsh)
- **Progress is in-memory only** — no persistence, so streaks/history/gamification can't function; this guts the strongest retention lever ([StriveCloud on Nike gamification](https://strivecloud.io/blog/gamification-examples-nike-run-club)).
- **"Session" as a tab is an anti-pattern** — an action masquerading as a destination; a center capture FAB is clearer.
- **No sharing/export** — no Instagram/TikTok/Messages/Photos path, cutting the viral growth loop competitors depend on ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- **No social/competition affordances** — leaderboards/challenges are proven engagement drivers in AR fitness; none present ([Fyter](https://apps.apple.com/us/app/fyter-ar-fitness-workouts/id1502336594), [Digital Health PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13014001/)).
- **No account/cloud sync** — progress and captures can't survive device change; Magic Poser offers local + cloud backup ([Magic Poser](https://play.google.com/store/apps/details?id=com.magicposernew)).
- **No gallery tab** — captures have no home (see §3).
- **Profile tab underspecified** — unclear it does more than hold static settings.

### Examples / Evidence
- Nike Training Club/Run Club drive retention through streaks, progress, and gamified challenges layered on 180+ workouts ([Appventurez case study](https://www.appventurez.com/blog/nike-training-club-app-case-study), [StriveCloud](https://strivecloud.io/blog/gamification-examples-nike-run-club)).
- Posei organizes captures by date and offers one-tap share to Instagram/TikTok/Messages and export to Photos — the growth loop PoseArt lacks ([Posei App Store](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
- AR-fitness research finds "competition" (leaderboards, real-time rankings, asynchronous challenges) is a significant driver of engagement and continued use ([Digital Health, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13014001/)).

---

# TOP 10 CRITICAL IMPROVEMENTS (ranked by impact)

Impact = (retention + activation + competitive parity) weighted against implementation cost.

### 1. Add a translucent target-pose overlay on the live camera feed
**Why #1:** This is the category's defining feature and PoseArt's biggest single gap — users currently correct toward an invisible goal ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
**Implementation:** Render a semi-transparent white silhouette / ghost skeleton of the target pose over the video, scaled to the detected torso. Derive it from the pose's reference keypoints. Add subtle idle "breathing" oscillation (reuse the existing sway/breathe logic). Support front (mirrored) and rear cameras.

### 2. Show live camera video behind the overlay in all modes
**Why:** The plain-parchment "Active" screen destroys the AR mental model and prevents framing/rehearsal.
**Implementation:** Always mount the `getUserMedia` video element as the session background; in simulation/no-permission mode, use a blurred placeholder or device photo backdrop plus a clear "Simulated" badge, never blank parchment. Wire the skeleton and target overlay onto that layer.

### 3. Massively expand the pose library and bind category counts to real data
**Why:** 12 poses vs 200+ (Posei) / 14,000+ (UNSCRIPTED) makes the app a one-session experience; fake counts break trust on first tap ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241), [UNSCRIPTED](https://unscriptedphotographers.com)).
**Implementation:** Target 5–8 poses per category (~50–80 minimum) short-term. Compute grid counts from the actual dataset. Add difficulty/scene/body-type metadata to each pose record.

### 4. Persist progress and captures (storage + optional cloud sync)
**Why:** In-memory progress makes streaks/history/gamification impossible — the top retention lever is disabled ([StriveCloud](https://strivecloud.io/blog/gamification-examples-nike-run-club)).
**Implementation:** Persist to IndexedDB/localStorage first; add optional account + cloud sync (à la Magic Poser) later. Store sessions, scores, streaks, and captured images.

### 5. Build a capture gallery + review/edit flow
**Why:** "Save" currently dead-ends; competitors close the capture→review→edit→share loop ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
**Implementation:** Add a Gallery (replace or augment a tab) organized by date; support favorite, delete, and a light editor (crop + a few on-brand presets + basic sliders). Persist per #4.

### 6. Add sharing/export to close the growth loop
**Why:** No sharing means no viral acquisition; Posei shares to Instagram/TikTok/Messages and exports to Photos ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
**Implementation:** Use the Web Share API for one-tap share/download of captures (optionally with a tasteful PoseArt watermark and the pose name).

### 7. Upgrade scoring: confidence gating + Procrustes normalization + per-pose tolerance
**Why:** 2D joint angles are viewpoint-fragile and un-gated by confidence, producing false errors ([SMPL FAQs](https://files.is.tue.mpg.de/black/talks/SMPL-made-simple-FAQs.pdf), [MPI joint-angle limits](https://files.is.tue.mpg.de/black/papers/PosePriorCVPR2015.pdf)).
**Implementation:** (a) Ignore/deweight keypoints below a confidence threshold and warn the user when tracking is poor; (b) Procrustes-align detected vs reference (translation/scale/rotation) before computing joint-angle deltas; (c) allow per-pose thresholds so dynamic poses aren't judged like static ones; (d) fix left/right mirroring for front camera.

### 8. Convert static SVG figures to a live-rigged ghost guide
**Why:** Static figures can't show how to enter a pose or lead the body; a rig enables motion guidance and a lively overlay ([Pose Animator](https://github.com/yemount/pose-animator), [Adobe rigging](https://www.adobe.com/uk/creativecloud/animation/discover/rigging.html)).
**Implementation:** Rig the existing SVG figures (bones + IK) following the Pose Animator pattern; play a short "entry" animation in the detail sheet and drive an idle-breathing target on the camera. Keep the figure skeleton and scoring skeleton unified to prevent drift.

### 9. Rework onboarding: interactive first-pose + permission priming + personalization
**Why:** Passive four-screen carousels underperform; priming lifts camera grant rates up to 81% and personalization improves long-term engagement ([Dogtown Media](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/), [LowCode](https://www.lowcode.agency/blog/mobile-onboarding-best-practices)).
**Implementation:** Cut to 2–3 screens; add a benefit-framed camera pre-permission screen ("PoseArt uses your camera so you can see a live guide and auto-capture the shot") with a "Maybe later" fallback to simulation + Settings deep-link; ask 2–3 goal questions; end with a guided 15-second simulated pose that earns a first auto-capture win.

### 10. Add manual shutter, haptics, and sequence mode; fix the "Session" tab
**Why:** Auto-only capture is fragile, visual-only success is weak on mobile, single-pose sessions cap depth, and "Session" as a tab is an anti-pattern ([Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241)).
**Implementation:** Add an always-available manual shutter; fire haptic feedback on auto-capture; add a Sequence mode chaining 3–5 poses with per-pose scoring and a summary; replace the "Session" tab with a center capture FAB and reallocate the freed tab to Gallery. Later, add streak/challenge gamification and consider a UNSCRIPTED-style golden-hour tracker for outdoor photo poses ([UNSCRIPTED](https://unscriptedphotographers.com), [StriveCloud](https://strivecloud.io/blog/gamification-examples-nike-run-club)).

---

*Sources are cited inline above; all reference-app claims are drawn from the listed App Store / Google Play listings, product sites, technical repositories, and peer-reviewed / practitioner literature.*
