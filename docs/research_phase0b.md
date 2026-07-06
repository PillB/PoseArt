# Phase 0B — Pose Library & Reference Research

**Date compiled:** July 5, 2026
**Scope:** Comprehensive research into pose category taxonomies, flattering/contextual posing, animated movement reference systems, pose-guidance UX patterns, and accessibility in pose-guidance apps — intended to inform the design of a pose library / pose-guidance product.

---

## 1. Comprehensive Pose Category Systems

Different disciplines have developed their own taxonomies for classifying poses and movement. Below is a synthesis across photography, yoga, dance/movement notation, physical therapy, and figure art — followed by a unified taxonomy that draws on all five.

### 1.1 Photography Posing Guides

Professional posing guides consistently organize poses around **body position/orientation** first, then **subject count**, then **style/mood**:

- **By base position:** standing, sitting, leaning, lying/reclining, kneeling, walking/dynamic ([Photography Posing Guide, Scribd](https://fr.scribd.com/document/556048688/Photography-Posing-Guide)).
- **By subject count:** individual (male/female-specific guides), couple, family, group. Couple posing guides further break into **transitional posing sequences** — repeatable workflows such as Hold Hands → Hip-to-Hip → The Dip → Bride's Back → The Protector → Walk Away ([Photography Posing Guide, Scribd](https://fr.scribd.com/document/556048688/Photography-Posing-Guide)).
- **By body part focus:** hands and arms posing is treated as its own subcategory (e.g., "Cigarette" pose, Shoulder Tap, Necklace/collarbone touch, Hair Pull, Dress Pull, Yin-Yang arm shapes, Face Framing) ([Photography Posing Guide, Scribd](https://fr.scribd.com/document/556048688/Photography-Posing-Guide)).
- **By gender-normed defaults:** many commercial guides still separate "posing a woman" (soft curves, S-curve, weight on back leg) from "posing a man" (three core poses: sitting, leaning, standing; tips emphasize relaxed/confident posture, strong jawline light, hard-light shadow definition) ([Photography Posing Guide, Scribd](https://fr.scribd.com/document/556048688/Photography-Posing-Guide)).
- **By genre/context:** boudoir, portrait, headshot, full-body/fashion, editorial, family, maternity, senior portraits — each with its own canonical pose sets (e.g., "The Soft Sit," "The Lying-Down Look," "The Over-the-Shoulder," "The Standing Elongate," "The Sheet Set" in boudoir photography) ([Danielle West Houston Photography](https://www.daniellewesthoustonphotography.com/post/the-top-boudoir-poses-that-flatter-every-body-type-yes-yours-too)).

### 1.2 Yoga Asana Taxonomies

Yoga has one of the most rigorously documented pose classification systems, useful as a model for a structured pose library. Two complementary classification layers are used industry-wide:

**Layer 1 — Six Foundational Starting Points** (how the body contacts the ground):
1. Standing
2. Seated
3. Kneeling
4. Arm balancing
5. Prone (front-lying)
6. Supine (back-lying)

**Layer 2 — Final Spinal Position** (grouped by what the spine does in the full expression of the pose):
- Neutral
- Flexion (forward bends)
- Extension (backbends)
- Lateral flexion (side bends)
- Rotation (twists)

This two-axis system (starting point × spinal action) allows any asana to be cross-indexed — e.g., "seated forward bend," "standing backbend," "supine twist" ([Yoga Teacher Training: Anatomy of Asanas in Hatha Yoga, PDF](https://yogaeducation.org/wp-content/uploads/2019/05/Anatomy-Asanas-Hatha-Yoga.pdf)).

Common consumer-facing yoga libraries (e.g., Yoga Journal's pose archive) simplify this into browsable categories: beginner poses, advanced poses, seated poses, standing poses, twists, poses for specific health benefits, and bandha (energy lock) techniques ([Yoga Journal Poses Archive](https://www.yogajournal.com/poses/)).

Additional widely-used category families layered on top of the above (common in yoga teacher training curricula):
- Forward bends — stretch posterior chain, calm the nervous system; technique cue: hinge from hips with flat back, not rounded spine
- Backbends — stretch anterior chain/hip flexors, build spinal extensor strength
- Twists — rotational spinal mobility, organ compression/detox framing
- Hip openers
- Arm balances
- Inversions
- Restorative/relaxation poses
- Balance poses

([Yoga Teacher Training PDF](https://yogaeducation.org/wp-content/uploads/2019/05/Anatomy-Asanas-Hatha-Yoga.pdf))

### 1.3 Laban Movement Analysis (Dance/Movement Notation)

Laban Movement Analysis (LMA) is the dominant academic/professional framework for describing *how* a movement is performed, not just its end shape. It uses the acronym **BESS**:

| Category | Description |
|---|---|
| **Body** | Which body parts are moving, how they're connected (Patterns of Total Body Connectivity — breath, core-distal, head-tail, upper-lower, body-half, cross-lateral), and how movement sequences through the body (simultaneous, successive, sequential) |
| **Effort** | The dynamic/qualitative texture of movement, split into four factors each with two polar elements: **Flow** (free ↔ bound), **Weight** (light ↔ strong), **Time** (sustained ↔ sudden), **Space** (indirect ↔ direct) |
| **Shape** | How the body's form changes and relates to itself and the environment |
| **Space** | The spatial pathways, levels, and directions a mover uses (Space Harmony/Choreutics) |

([Backstage: Laban Movement Analysis Guide](https://www.backstage.com/magazine/article/laban-movement-analysis-guide-50428/); [BESS Sheet, Scribd](https://www.scribd.com/document/335542131/Bess-Sheet))

**Relevance to a pose/movement app:** LMA's Effort category is especially valuable for classifying *transitions between poses* (not just static end-states) — e.g., a "sudden, strong, direct" transition (a punch) is instructionally different from a "sustained, light, indirect" one (a yoga flow), even if the start/end skeletal poses are similar.

### 1.4 Physical Therapy & Rehabilitation Pose/Exercise Systems

PT and rehab classification is organized primarily by **anatomical target region** and **exercise function**, rather than by body shape:

- **By body region:** cervical, thoracic, lumbar spine; pelvis, hip, knee, ankle ([HPE Posture Analysis & Rehab app](https://play.google.com/store/apps/details?id=com.axiscompany.hpe&hl=en)).
- **By functional category:** core stability, plank, bridge, lunge, squat, deadlift (compound functional movements); syndrome-specific rehab protocols (e.g., CES – cervical extension syndrome; CFS; LES; LFS) ([HPE Posture Analysis & Rehab app](https://play.google.com/store/apps/details?id=com.axiscompany.hpe&hl=en)).
- **By stretch type:** static stretching, dynamic stretching, PNF, ballistic — classified by mechanism and use-case (flexibility gain, injury prevention, warm-up vs. cool-down) ([Exercise Therapy: Stretching, Scribd](https://www.scribd.com/presentation/860015490/Jitendra-Rahul-Exercise-Therapy-Stretching-Ppt)).
- **By posture correction goal:** apps like HPE Posture Analysis explicitly bundle "30+ targeted posture correction & rehabilitation programs" combining region + syndrome + DIY custom program builders, reflecting a hierarchical taxonomy: **Region → Condition/Syndrome → Specific Exercise → Progression Level**.

**Relevance:** PT taxonomy is the best model for **problem-oriented** browsing (users looking for "what pose helps X") as opposed to yoga/photography's **form-oriented** browsing (users looking for "poses that look like Y").

### 1.5 Life Drawing & Figure Art Reference Systems

Figure drawing reference libraries classify poses along two orthogonal axes: **pose type** and **time duration**, since the drawing goal changes with each combination.

**By pose type/subject position:**
| Category | Purpose |
|---|---|
| Gesture poses | Capture the main line of action, torso tilt, and largest directional rhythm — not anatomical detail |
| Seated poses | Study compression, balance, foreshortening, how the pelvis shifts weight; good for silhouette-driven character poses |
| Kneeling poses | Study asymmetry, compressed legs, lifted arms, proximity to ground |
| Standing & action poses | Study weight shifts, balance, directional force |
| Close-up crops | Isolate hands, wrists, forearms, and directional anatomy |
| Costume/character poses | Add props, clothing, and narrative/staging cues for character design |

**By time duration (drives what the artist should focus on):**
| Duration | Focus |
|---|---|
| 30 seconds | Line of action, largest C-curve/S-curve, overall movement — no anatomy |
| 1 minute | Secondary rhythms through limbs/torso/hips |
| 2 minutes | Simple rib cage, pelvis, and limb forms |
| 5 minutes | Larger proportions, landmarks, simple anatomy |

([Reference Poses for Artists, poselibrary.com](https://poselibrary.com/reference-poses-for-artists))

### 1.6 Unified Taxonomy (Synthesis for a Pose Library Product)

Combining all five systems, a comprehensive pose library could be structured on **four cross-cutting axes**, letting any single pose be tagged across all of them:

1. **Base Position / Foundation** (borrowed from yoga): standing, seated, kneeling, lying prone, lying supine, arm-balancing/inverted, dynamic/in-transit
2. **Body Orientation Relative to Camera/Viewer** (from photography): front-facing, 3/4 view, profile/side, back view, over-the-shoulder, high-angle, low-angle
3. **Movement Quality / Effort** (from Laban): static hold vs. transition; and if transition — free/bound flow, light/strong weight, sustained/sudden time, direct/indirect space
4. **Functional Intent** (from PT + drawing + photography combined): aesthetic/expressive (photography, art), corrective/therapeutic (PT), instructional/skill-building (dance, martial arts, yoga), narrative/character (costume/figure art)

A fifth practical axis worth adding for a digital product: **Subject Count** — solo, couple, group/family — since composition and interaction cues differ substantially.

---

## 2. Best Poses for Different Body Types & Situations

### 2.1 Universally Flattering Principles

Across boudoir, portrait, and fashion photography guides, a consistent set of "universally flattering" principles recurs regardless of body type:

- **Avoid squaring the body to the camera.** Angling the torso/shoulders and turning slightly away creates visual slimming and depth ("Classic Elegance": face toward light, body away, weight on one leg, trailing leg bent) ([Photography Posing Guide, Scribd](https://fr.scribd.com/document/556048688/Photography-Posing-Guide)).
- **Create an S-curve or C-curve** through the spine/hips — a bent knee, weight shifted to the back leg, and a slight hip roll produce natural curvature that reads as relaxed and elongated ([Danielle West Houston Photography](https://www.daniellewesthoustonphotography.com/post/the-top-boudoir-poses-that-flatter-every-body-type-yes-yours-too)).
- **Elongate the neck.** Chin slightly forward and down (not tucked or tilted up), combined with an arched back when lying down, elongates the neckline and avoids double-chin compression.
- **Create negative space / triangles with limbs.** Placing a hand on a hip or bending an elbow creates a visible gap between arm and torso, which visually narrows the torso — a technique nearly universal in "arms and hands" posing guides ("Yin-Yang" pose creates two triangle shapes with the arms) ([Photography Posing Guide, Scribd](https://fr.scribd.com/document/556048688/Photography-Posing-Guide)).
- **Relaxed hands, not clenched.** Hand-posing tutorials consistently emphasize: (1) shake out tension before the shot — tension shows first in eyes, jaw, and hands; (2) "touch, don't grab" — light fingertip contact reads as relaxed, gripping reads as tense; (3) show the sides of hands, not the back or flat palm, which visually widens the hand ([The Lens Lounge: Posing Hands](https://thelenslounge.com/posing-hands-in-photography/)).
- **Weight on the back leg** in standing poses shifts hips back and creates a longer, leaner-looking front leg line — a technique used across nearly all standing full-body pose guides.

### 2.2 Context-Specific Guidance

| Context | Guidance |
|---|---|
| **Portrait / headshot** | 3/4 angle (turning ~30–45° from camera) is the most broadly flattering because it shows facial structure/depth without the width-emphasis of a straight-on shot; chin forward-and-down elongates the neck and defines the jawline |
| **Full body** | Weight shifted onto the back leg, front leg slightly bent, creates an elongated silhouette; standing poses are described as ideal for "showing strength and confidence" when combined with a slight back arch and one hand on hip ([Danielle West Houston Photography](https://www.daniellewesthoustonphotography.com/post/the-top-boudoir-poses-that-flatter-every-body-type-yes-yours-too)) |
| **Profile / side view** | Emphasizes jawline and body contour; commonly paired with "over-the-shoulder" look-back poses, which combine profile body with a rotated gaze back to camera — highlights jawline and adds arm definition |
| **Seated** | Useful for studying/showing compression and pelvis-driven weight shift; edge-of-seat sitting with shoulders back and legs angled (not squared) reads as elegant and approachable ("The Soft Sit") |
| **Lying/reclining** | Arching the back and turning the head toward camera elongates the neck and accentuates curves; commonly recommended as a beginner-friendly, comfortable pose |
| **Couples** | Built around a repeatable "workflow" of transitional poses (hold hands → hip-to-hip → dip → embrace → walk away), shot at multiple distances (wide, then close-up) and angles (low/high) to maximize variety from one interaction ([Photography Posing Guide, Scribd](https://fr.scribd.com/document/556048688/Photography-Posing-Guide)) |
| **Male subjects** | Guides emphasize a narrower pose vocabulary (sitting, leaning, standing) with emphasis on relaxed-but-confident posture and directional/hard lighting for jaw definition, reflecting different aesthetic norms than "feminine" posing guides |

### 2.3 Adapting for Different Body Types

Photography guides increasingly emphasize that "flattering" is about **emphasizing the individual's actual proportions** rather than forcing a one-size-fits-all pose — e.g., boudoir-specific guides marketed as working for "every body type" rely on the same core mechanics (angle, S-curve, weight shift, neck elongation) but adjust degree/emphasis per body: taller subjects may need to "shrink" a pose (bending more, sitting rather than standing) while petite subjects benefit from elongating poses (extended limbs, higher camera angle) ([Danielle West Houston Photography](https://www.daniellewesthoustonphotography.com/post/the-top-boudoir-poses-that-flatter-every-body-type-yes-yours-too)).

---

## 3. Animated Action/Movement Reference in Apps

### 3.1 How Different App Categories Show Movement

| App category | Representative apps | Animation/reference approach |
|---|---|---|
| **Dance tutorial/coaching apps** | HILFE AI – Dance & Sing Coach | Real-time skeleton visualization overlaid on the user's own camera feed; side-by-side video comparison and scoring; choreography broken into manageable step-by-step segments for progressive learning ([HILFE AI, Spark by MWM](https://spark.mwm.ai/us/apps/hilfe-ai-dance-sing-coach/6480042500)) |
| **Yoga/exercise apps** | Zenith Yoga, Skill Yoga, FitYoga, Zenia, Postura Yoga | AI pose estimation (e.g., MediaPipe) detects body keypoints; compares user's joint angles to a reference/"ideal" pose; overlays skeletal lines or ghost/outline guides; gives a numeric "Pose Score"; some use "Mirror Pose Match" to compare user pose to a static reference image rather than continuous video ([Asivana Yoga: Yoga and AI in 2026](https://asivanayoga.com/blogs/yoga-blog/yoga-and-artificial-intelligence)) |
| **Martial arts training apps** | Martial Arts Form Coach, SportsReflector, Fight AI, Shotokan Karate posture app | Real-time pose detection with instant visual + voice feedback; joint-angle comparison against a "golden" reference image/stance; AR overlays projecting optimal strike trajectories or stance lines directly onto the live camera view; rep counting tied to angle-transition detection ([SportsReflector](https://sportsreflector.com/sports/mma); [Shotokan Karate posture study, Nature](https://www.nature.com/articles/s41598-026-41414-5)) |
| **Photography posing apps** | Posed, Dittoed, AlignShot, GhostOverlayCamera2 | Semi-transparent "ghost overlay" of a reference pose/photo placed over the live camera viewfinder; user can pinch/scale/rotate the overlay to align themselves to the reference; distinct from AI-driven apps in that there's no automatic correctness scoring — the human aligns visually ([Posed: AI Pose Coach, App Store](https://apps.apple.com/vn/app/posed-ai-pose-coach/id6762599608); [Dittoed, Reddit](https://www.reddit.com/r/apple/comments/tvmwbc/dittoed_an_app_that_overlays_any_photo_from_your/)) |

### 3.2 What Makes Animation/Reference Instructionally Effective

Academic research on motor-skill learning provides direct evidence on which formats work best:

- **Animated demonstrations can outperform static/real video for certain learning stages.** A controlled study on basketball jump-shot learning found the **cognitive-level learning advantage of animated model demonstration was greater than real (video) model demonstration**, while both improved motor performance ([Sciendo: Effects of observing real, animated and combined models](https://sciendo.com/2/v2/download/article/10.2478/bhk-2022-0007.pdf)).
- **Instructional animation design guidelines** (van der Meij & van der Meij, adopted broadly in psychomotor-skill app design): (1) provide easy access, (2) pair animation with narration, (3) enable functional interactivity, (4) preview the task before detailed steps, (5) favor procedural over conceptual information, (6) keep tasks clear and simple, (7) keep videos short, (8) reinforce demonstration with guided practice ([Designing Instructional Animation for Psychomotor Learning, SciTePress](https://www.scitepress.org/papers/2015/54773/54773.pdf)).
- **Full self-view + skeleton overlay beats skeleton-alone or trainer-video-alone.** A study on movement learning from online video found that showing the **user's own skeleton superimposed on their own camera feed** produced the best tutorial-following performance; showing only the user's skeleton (no video) or only the trainer's skeleton/video offered limited benefit — the side-by-side juxtaposition of trainer and self was key ([Pose Estimation for Facilitating Movement Learning, arXiv](https://arxiv.org/pdf/2004.03209.pdf)).
- **3D body models outperform 2D skeleton visualizations for posture guidance usability**, and larger displays reduce guidance error versus smartphone screens ("CameraReady" study) ([ACM: CameraReady](https://dl.acm.org/doi/fullHtml/10.1145/3461778.3462026)).
- **More visual complexity is not always better.** In a study where yoga instructors assessed student poses through Raw video, Skeleton overlay, Contour outline, or Contour+Skeleton, instructors preferred **simple raw video** over composited visualizations; Skeleton overlays increased cognitive load (larger pupil diameter) without improving error-detection accuracy ([Enhancing Online Yoga Instruction, Virginia Tech](https://vtechworks.lib.vt.edu/server/api/core/bitstreams/d51ae1d1-2c73-49b3-b8f1-f61be8c9da12/content)).
- **Real-time AI feedback works well for large/gross movements (standing exercises) but struggles with occluded or small-space movements** (e.g., sit-ups, push-ups), and overly rigid/narrow correctness thresholds frustrate users ("it just kept on saying, 'You're squatting too deeply'") ([Towards Understanding People's Experiences of AI Instructor Apps](http://andygarbett.co.uk/wp-content/uploads/2022/06/Towards-Understanding-Peoples-Experiences-of-AI-Instructor-Apps.pdf)).
- **Video-based feedback (skeleton overlay + pass/fail scoring) measurably improves posture correctness** — a randomized controlled trial of a squat-coaching app found correct-posture rate improved 52.3% in the experimental (AI-feedback) group vs. 21.3% in the control group ([Home Alone Exercise RCT, HCIL SNU](http://hcil.snu.ac.kr/cms/uploads/An_Artificial_Intelligence_Exercise_Coaching_Mobile_App_Development_and_Randomized_Controlled_Trial_to_Verify_Its_Effectiveness_in_Posture_Correction_cd02ead2f8.pdf)).

**Synthesis:** The most instructionally effective pattern appears to combine (1) a clear reference demonstration (video or animation), (2) the user's own live self-view, and (3) a lightweight overlay (skeleton or ghost outline) — but overlays should be optional/toggleable, since expert observers and casual users alike sometimes prefer simplicity over data density.

---

## 4. Pose Guidance UX Patterns

### 4.1 Core Pattern Catalog

| Pattern | How it works | Example apps/sources |
|---|---|---|
| **Skeleton overlay** | Joint keypoints (e.g., 17–33 landmarks via MediaPipe/PoseNet) connected by lines, drawn over the live camera feed or a reference image | Zenia, EduBack, most AI fitness/yoga coaches ([Asivana Yoga](https://asivanayoga.com/blogs/yoga-blog/yoga-and-artificial-intelligence); [EduBack, JMIR](https://humanfactors.jmir.org/2026/1/e79282/PDF)) |
| **Ghost/silhouette overlay** | A semi-transparent reference image or outline placed over the live viewfinder; user manually aligns themselves (drag/scale/rotate) rather than relying on automatic detection | Posed (Ghost Overlay), Dittoed, AlignShot, GhostOverlayCamera2, Floating Ghost Image ([Posed](https://apps.apple.com/vn/app/posed-ai-pose-coach/id6762599608); [AlignShot](https://apps.apple.com/ca/app/alignshot-overlay-camera/id6754617984)) |
| **3D body model overlay** | A rendered 3D avatar shows the target pose rather than a flat skeleton; rated more usable than 2D skeletons in controlled studies | CameraReady study; 3D avatar yoga instruction research ([Medium: 3D Avatars for Yoga](https://medium.com/@e.clarissa.anjani/technology-based-instruction-exploring-personalized-feedback-and-learning-with-3d-avatars-yoga-5b35b9745f19)) |
| **Voice/vocal toggling of overlay type** | Users can say "Show me skeleton," "Show me silhouette," "Show me instructor" to switch visualization mid-session | Zenia (per user study) ([Towards Understanding AI Instructor Apps](http://andygarbett.co.uk/wp-content/uploads/2022/06/Towards-Understanding-Peoples-Experiences-of-AI-Instructor-Apps.pdf)) |
| **Countdown timers + pose callouts** | Timed hold durations with audio countdowns; used heavily in posing practice (e.g., bodybuilding stage-posing apps) and yoga hold-timers | Pose Timer app — adjustable pose/transition duration, pre-session countdown, audio callouts + vibration cues, routine builder ([Pose Timer, Google Play](https://play.google.com/store/apps/details?id=com.yourname.posetimer&hl=en_US)) |
| **Audio/voice cues** | Spoken correction instructions ("Raise your arm higher," "Bend your left knee more") delivered alongside/instead of visual feedback | Nearly all AI yoga/fitness coaches; critical for accessibility (see Section 5) |
| **Haptic feedback** | Vibration confirms correct form, alerts to a state change, or delivers directional guidance without requiring visual attention | Martial Arts Form Coach (toggleable haptics); YogiFi smart mat (vibration cue when weight distribution is off) ([Asivana Yoga](https://asivanayoga.com/blogs/yoga-blog/yoga-and-artificial-intelligence)) |
| **Color-coded correctness indicators** | Joints/limbs highlighted in different colors (e.g., green = correct, red = needs adjustment) | Zenia and most pose-correction apps; EduBack study found color-coded cues and dynamic prompts "enhance attentional focus, facilitate error correction" ([EduBack, JMIR](https://humanfactors.jmir.org/2026/1/e79282/PDF)) |
| **AR trajectory/path overlays** | Virtual lines project the "optimal" path of a limb or strike directly onto the live camera view for the user to trace | SportsReflector AR live training feature ([SportsReflector](https://sportsreflector.com/sports/mma)) |

### 4.2 Design Guidance from Research & Platform Documentation

- **Haptics should be used sparingly and tied to meaning.** Apple's WWDC guidance: only add audio/haptic feedback where it provides "clear value," avoid overwhelming users, and design sound/haptics/visuals together for a unified, physically-intuitive experience ([Apple: Designing Audio-Haptic Experiences](https://developer.apple.com/videos/play/wwdc2019/810/)).
- **Android's haptics guidelines**: favor "rich and clear" haptics over generic "buzzy" ones; correlate haptic strength with event importance/frequency (subtle for frequent events like scrolling, stronger for milestones); use predefined system haptic constants for consistency, which also benefits accessibility ([Android Developers: Haptics Design Guidelines](https://developer.android.com/develop/ui/views/haptics/haptics-principles)).
- **Meta's VR/AR haptics guidance** stresses: relate haptics directly to the causing action, keep haptics as part of a coordinated multisensory system, avoid overuse (whitespace/pauses make haptics more impactful), and always give users the option to disable/adjust intensity ([Meta Horizon: Designing Haptics](https://developers.meta.com/horizon/documentation/unreal/unreal-haptics-design-guidelines/)).
- **Multimodal (visual+haptic) feedback improves precision under cognitive load** — a controlled AR study found that combining visual overlays with wrist-based directional haptics improved spatial precision and usability versus either modality alone, while users reported greater confidence and reduced cognitive effort (at the cost of slightly longer task completion) ([Multimodal Feedback for Task Guidance in AR, arXiv](https://arxiv.org/pdf/2510.01690.pdf)).
- **Detection friction is a major frustration point.** User research on AI fitness instructor apps found detection failures (false negatives on correct poses, especially in floor-based exercises like sit-ups) were experienced as "infuriating and patronising," and that camera framing/distance constraints (needing to stand far back, landscape orientation) created real usability barriers ([Towards Understanding AI Instructor Apps](http://andygarbett.co.uk/wp-content/uploads/2022/06/Towards-Understanding-Peoples-Experiences-of-AI-Instructor-Apps.pdf)).
- **Simplicity sometimes beats data-rich overlays** — as noted in Section 3.2, the Virginia Tech yoga-instructor study found raw video outperformed skeleton/contour overlays for *expert* assessment tasks, suggesting overlay complexity should be tuned to user expertise and task (a beginner learning a pose benefits from an overlay; an expert assessing safety may not).
- **Self-view avatars reduce self-consciousness.** In the 3D-avatar yoga study, students reported that viewing an avatar version of themselves (rather than their real physical self on camera) was "less distracting" and especially valuable for self-conscious users — a relevant insight for body-image-sensitive contexts ([Medium: 3D Avatars for Yoga](https://medium.com/@e.clarissa.anjani/technology-based-instruction-exploring-personalized-feedback-and-learning-with-3d-avatars-yoga-5b35b9745f19)).

---

## 5. Accessibility in Pose Guidance Apps

### 5.1 Mobility & Disability Accommodation

- **Adaptive/modified pose libraries.** Adaptive yoga resources provide explicit **prop-based and seated/wheelchair variations** of standard poses — e.g., using blankets/blocks/straps to support alignment, chair or bolster substitutions for floor poses, and options to skip full range-of-motion where mobility is limited ([Adaptive Yoga Guide, Cerebral Palsy Resource](https://cpresource.org/sites/www/files/2024-04/Adaptive%20Yoga%20Guide%20(2).pdf)).
- **Wheelchair-specific adaptation guides** show that most "ground-based" poses can be adapted using the wheelchair itself as the base — e.g., pulling knees to chest with arms or a strap, cross-legged variants performed in the seat, upper-body-only variations for those with additional impairment ([Numotion: Adaptive Yoga in a Wheelchair](https://www.numotion.com/blog/october-2019/adaptive-yoga-in-a-wheelchair)).
- **Apps designed for limited-mobility users** (e.g., Kakana) are built around instructors who themselves lead from wheelchairs, and organize content by achievable modality (seated yoga, cardio boxing, arm-focused cycling) rather than assuming standing as the default ([HuffPost: Body-Positive Fitness Apps](https://www.huffpost.com/entry/body-positive-fitness-apps_l_619680f0e4b0451e54f69f13)).
- **Progressive-difficulty inclusive design.** Apps like Big Fit Girl structure content on a continuum from chair-based fitness up to high-intensity training, letting users self-select entry points rather than being funneled into a single default pose set ([Big Fit Girl, App Store](https://apps.apple.com/ca/app/big-fit-girl-by-louise-green/id1481129731)).

### 5.2 Vision Accessibility (Screen-Free / Audio-First Design)

- **Fully audio-guided, camera-optional workouts** exist specifically for blind/low-vision users — e.g., ReVision Fitness is described as "universally designed to be accessible for both sighted and visually impaired" via an audio-only fitness curriculum with no dependency on visual UI ([ReVision Fitness, AFB](https://afb.org/aw/23/8/18050); [App Store](https://apps.apple.com/tw/app/revision-fitness/id1561742182?l=en-GB)).
- **Voice-guided, hands-free pose apps for the visually impaired** combine audio instruction + voice commands + real-time body tracking (via MediaPipe/MoveNet) so users get spoken corrective feedback without needing to see a screen — e.g., MoveMate, designed with "high contrast, large fonts, and audio-first flow" as a fallback for low-vision users who do use the screen occasionally ([MoveMate, Devpost](https://devpost.com/software/movemate-3hrcj5)).
- **Voice-activated AI assistants** (e.g., "Venus" in the VizFit concept) let blind users navigate app functions (select exercise, track progress) entirely by voice command, removing the screen-navigation barrier entirely ([VizFit, Ritchie-Creative](https://www.ritchie-creative.com/projects/vizfit)).
- **Historical precedent:** accessible yoga "exergames" using Kinect-based motion sensing (not camera/vision) allowed blind users to interact verbally with a simulated instructor, using body-worn or environmental sensing rather than requiring visual confirmation ([Disabled World: Accessible Yoga for Blind with Kinect](https://www.disabled-world.com/fitness/exercise/yoga/eyes-free.php)).

### 5.3 Body Size & Representation

- **Weight-neutral / size-inclusive apps** (Big Fit Girl, Joyn, The Underbelly, Healthy with Kelsey) intentionally cast instructors "in bodies of size," avoid diet/weight-loss messaging, and provide modifications so plus-size users are not treated as an edge case ([HuffPost](https://www.huffpost.com/entry/body-positive-fitness-apps_l_619680f0e4b0451e54f69f13); [Women's Health: Size-Inclusive Fitness Leaders](https://www.womenshealthmag.com/fitness/g35927483/size-inclusive-fitness-leaders/)).
- **AI/computer-vision accuracy bias is a documented, serious accessibility gap.** Independent research shows human pose estimation datasets and models systematically underperform for:
  - Darker-skinned individuals — one benchmark found darker-skinned females present in only 2.6% of valid images vs. 60% for lighter-skinned males ([Sony AI: Exposing Limitations in Fairness Evaluations](https://ai.sony/blog/exposing-limitations-in-fairness-evaluations-human-pose-estimation)).
  - Older individuals (accuracy drops notably for ages 50+) ([The Chosun Daily: AI Struggles to Recognize Older, Darker-Skinned Individuals](https://www.chosun.com/english/industry-en/2025/12/08/R7VFDWU3GZE6NHJ3YN3YDCJPW4/)).
  - Plus-sized individuals and people using mobility aids (wheelchairs, crutches) are "particularly poorly recognized" by mainstream pose/person-detection models ([The Chosun Daily](https://www.chosun.com/english/industry-en/2025/12/08/R7VFDWU3GZE6NHJ3YN3YDCJPW4/)).
  - People wearing religious/cultural garments (hijabs, turbans) or with hairstyles common in Black communities ([The Chosun Daily](https://www.chosun.com/english/industry-en/2025/12/08/R7VFDWU3GZE6NHJ3YN3YDCJPW4/)).
  - This is attributed to training-data imbalance (datasets over-represent young, light-skinned, standard-body, camera-facing subjects) ([Nature: Fair Human-Centric Image Dataset (FHIBE)](https://www.nature.com/articles/s41586-025-09716-2)).
- **Mitigation approaches emerging in research:** synthetic, minimal-bias training datasets specifically for fitness applications (e.g., InfiniteForm) ([arXiv: InfiniteForm](https://arxiv.org/abs/2110.01330)); fairness benchmark datasets like FACET (Meta) and FHIBE (Sony) that explicitly measure performance gaps across skin tone, age, gender presentation, and body shape so developers can audit their own models before shipping ([FACET Benchmark, Voxel51](https://voxel51.com/blog/facet-benchmark); [Nature: FHIBE](https://www.nature.com/articles/s41586-025-09716-2)).
- **Practical implication for a pose-guidance product:** any camera-based pose-detection feature should be tested explicitly across skin tones, body sizes, ages, and mobility-aid use before launch, and should offer non-vision-dependent fallback modes (manual pose selection, audio-only guidance) so accuracy gaps don't lock out entire user groups.

### 5.4 General Inclusive-Design Best Practices (Synthesized)

1. **Never assume a single "default" body or ability level** — provide seated/standing/prop-assisted variants for every pose in the library, following the adaptive yoga model.
2. **Decouple instruction from any single modality.** Offer visual (overlay/skeleton), audio (spoken cues), and haptic (vibration) channels, and let users choose or combine them — critical both for blind/low-vision users and for anyone in a situation where looking at a screen isn't practical.
3. **Make correctness thresholds forgiving and adjustable.** Rigid, narrow "correct/incorrect" bands frustrate users, especially when compounded by detection inaccuracy for non-majority body types.
4. **Audit computer-vision components for demographic bias** using established fairness benchmarks (FACET, FHIBE) before relying on them for corrective feedback, since underperformance for darker skin tones, older users, larger bodies, and mobility-aid users is well documented.
5. **Cast/represent diverse bodies and ability levels in reference content itself** (demo videos, pose thumbnails) — representation in the reference material affects user trust and adoption, per body-positive fitness app research.
6. **Provide progressive entry points** (e.g., chair-based → standing → high-intensity) rather than a single fixed difficulty ladder, so users self-select an appropriate starting point instead of being excluded by a one-size assumption.

---

## Summary of Key Sources

- [Photography Posing Guide (Scribd)](https://fr.scribd.com/document/556048688/Photography-Posing-Guide)
- [Danielle West Houston Photography — Boudoir Poses for Every Body Type](https://www.daniellewesthoustonphotography.com/post/the-top-boudoir-poses-that-flatter-every-body-type-yes-yours-too)
- [The Lens Lounge — Posing Hands in Photography](https://thelenslounge.com/posing-hands-in-photography/)
- [Yoga Teacher Training: Anatomy of Asanas in Hatha Yoga (PDF)](https://yogaeducation.org/wp-content/uploads/2019/05/Anatomy-Asanas-Hatha-Yoga.pdf)
- [Yoga Journal Poses Archive](https://www.yogajournal.com/poses/)
- [Backstage — Laban Movement Analysis Guide](https://www.backstage.com/magazine/article/laban-movement-analysis-guide-50428/)
- [BESS Sheet — Laban Movement Analysis (Scribd)](https://www.scribd.com/document/335542131/Bess-Sheet)
- [HPE Posture Analysis & Rehab App (Google Play)](https://play.google.com/store/apps/details?id=com.axiscompany.hpe&hl=en)
- [Exercise Therapy: Stretching (Scribd)](https://www.scribd.com/presentation/860015490/Jitendra-Rahul-Exercise-Therapy-Stretching-Ppt)
- [Reference Poses for Artists (poselibrary.com)](https://poselibrary.com/reference-poses-for-artists)
- [Sciendo — Effects of Real vs. Animated Model Demonstration](https://sciendo.com/2/v2/download/article/10.2478/bhk-2022-0007.pdf)
- [SciTePress — Designing Instructional Animation for Psychomotor Learning](https://www.scitepress.org/papers/2015/54773/54773.pdf)
- [arXiv — Pose Estimation for Facilitating Movement Learning from Online Videos](https://arxiv.org/pdf/2004.03209.pdf)
- [ACM — CameraReady: Display Types and Visualizations on Posture Guidance](https://dl.acm.org/doi/fullHtml/10.1145/3461778.3462026)
- [Virginia Tech — Enhancing Online Yoga Instruction with Visual Augmentations](https://vtechworks.lib.vt.edu/server/api/core/bitstreams/d51ae1d1-2c73-49b3-b8f1-f61be8c9da12/content)
- [Towards Understanding People's Experiences of AI Instructor Apps (PDF)](http://andygarbett.co.uk/wp-content/uploads/2022/06/Towards-Understanding-Peoples-Experiences-of-AI-Instructor-Apps.pdf)
- [HCIL SNU — AI Exercise Coaching RCT](http://hcil.snu.ac.kr/cms/uploads/An_Artificial_Intelligence_Exercise_Coaching_Mobile_App_Development_and_Randomized_Controlled_Trial_to_Verify_Its_Effectiveness_in_Posture_Correction_cd02ead2f8.pdf)
- [Asivana Yoga — Yoga and Artificial Intelligence in 2026](https://asivanayoga.com/blogs/yoga-blog/yoga-and-artificial-intelligence)
- [Posed: AI Pose Coach App (App Store)](https://apps.apple.com/vn/app/posed-ai-pose-coach/id6762599608)
- [AlignShot — Overlay Camera (App Store)](https://apps.apple.com/ca/app/alignshot-overlay-camera/id6754617984)
- [Dittoed (Reddit)](https://www.reddit.com/r/apple/comments/tvmwbc/dittoed_an_app_that_overlays_any_photo_from_your/)
- [Apple Developer — Designing Audio-Haptic Experiences (WWDC19)](https://developer.apple.com/videos/play/wwdc2019/810/)
- [Android Developers — Haptics Design Guidelines](https://developer.android.com/develop/ui/views/haptics/haptics-principles)
- [Meta Horizon — Designing Haptics](https://developers.meta.com/horizon/documentation/unreal/unreal-haptics-design-guidelines/)
- [arXiv — Multimodal Feedback for Task Guidance in AR](https://arxiv.org/pdf/2510.01690.pdf)
- [Medium — 3D Avatars for Yoga Instruction](https://medium.com/@e.clarissa.anjani/technology-based-instruction-exploring-personalized-feedback-and-learning-with-3d-avatars-yoga-5b35b9745f19)
- [Pose Timer App (Google Play)](https://play.google.com/store/apps/details?id=com.yourname.posetimer&hl=en_US)
- [Cerebral Palsy Resource — Adaptive Yoga Guide (PDF)](https://cpresource.org/sites/www/files/2024-04/Adaptive%20Yoga%20Guide%20(2).pdf)
- [Numotion — Adaptive Yoga in a Wheelchair](https://www.numotion.com/blog/october-2019/adaptive-yoga-in-a-wheelchair)
- [HuffPost — 8 Body-Positive Fitness Apps](https://www.huffpost.com/entry/body-positive-fitness-apps_l_619680f0e4b0451e54f69f13)
- [Women's Health — Size-Inclusive Fitness Leaders](https://www.womenshealthmag.com/fitness/g35927483/size-inclusive-fitness-leaders/)
- [AFB — ReVision Fitness: Accessible Fitness Program](https://afb.org/aw/23/8/18050)
- [MoveMate (Devpost)](https://devpost.com/software/movemate-3hrcj5)
- [Ritchie-Creative — VizFit](https://www.ritchie-creative.com/projects/vizfit)
- [Disabled World — Accessible Yoga for Blind with Kinect](https://www.disabled-world.com/fitness/exercise/yoga/eyes-free.php)
- [Sony AI — Exposing Limitations in Fairness Evaluations: Human Pose Estimation](https://ai.sony/blog/exposing-limitations-in-fairness-evaluations-human-pose-estimation)
- [The Chosun Daily — AI Struggles to Recognize Older, Darker-Skinned Individuals](https://www.chosun.com/english/industry-en/2025/12/08/R7VFDWU3GZE6NHJ3YN3YDCJPW4/)
- [Nature — Fair Human-Centric Image Dataset for Ethical AI Benchmarking (FHIBE)](https://www.nature.com/articles/s41586-025-09716-2)
- [arXiv — InfiniteForm: Synthetic, Minimal-Bias Dataset for Fitness Applications](https://arxiv.org/abs/2110.01330)
- [Voxel51 — FACET: A Benchmark Dataset for Fairness in Computer Vision](https://voxel51.com/blog/facet-benchmark)

---

## Gaps & Areas for Further Research

- Limited primary-source academic literature specifically on **couple/group posing psychology** (most sources are commercial photography blogs rather than peer-reviewed research).
- Laban Movement Analysis research is rich for professional dance/theater contexts but sparse on **direct application to consumer mobile app UX** — this connection is largely inferential in this report.
- Accessibility research on **AR/haptic pose guidance for Deaf/hard-of-hearing users** specifically (as opposed to blind/low-vision) was not surfaced in this pass and may warrant a dedicated follow-up search.
- Quantitative comparisons of **ghost-overlay (manual alignment) vs. AI-scored overlay** approaches in terms of user satisfaction and learning outcomes were not found — most literature evaluates AI-scored systems, while ghost-overlay apps are documented mainly through app-store marketing copy rather than usability studies.
