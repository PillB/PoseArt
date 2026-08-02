# Phase 0A — Market & Prompting Research

*Compiled July 5, 2026*

This document consolidates research across five areas relevant to building a camera-based pose recommendation app: (1) the existing competitive landscape of pose apps, (2) real-time camera guidance technology, (3) prompting techniques for building mobile apps with AI agents, (4) Art Nouveau aesthetics for UI/UX, and (5) human sprite/pose animation systems.

---

## 1. Existing Pose Recommendation Apps (2024–2026)

The pose-guidance app category has matured rapidly, converging on a common pattern: **curated pose libraries + camera overlay + on-device pose detection + auto-capture**. Below is a breakdown of the main players and patterns.

### 1.1 Category leaders and their features

**PoseCamera AI** ([App Store](https://apps.apple.com/in/app/posecamera-ai/id6751519249)) — Positions itself as an all-in-one pose guide for photographing friends/partners:
- **Featured pose templates** across couple shots, travel photos, portraits, street snaps, and group photos.
- **AI background removal** — model templates with clean cutouts so the user focuses on the pose, not background clutter.
- **Transparent Overlay Mode** — turns any pose into a floating, see-through guide that can be dragged, resized, and adjusted for transparency to match the live subject in real time.
- **Outline Mode** — simplifies poses into clean line silhouettes for a clearer read of body angles.
- **Smart Search powered by an AI CLIP vision model** — keyword search instantly surfaces relevant poses.
- UX pattern: "follow-the-template" shooting flow — pick template → overlay → shoot.

**Posei: AI Pose Camera & Guide** ([App Store](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241?l=mr)) — The most technically detailed example found, and closest analog to a "pose coach":
- **200+ curated pose templates** across aesthetics (Korean, Japanese, Street, Vintage, Editorial, Cute, Cool), filterable by scene (café, beach, mirror, night, indoor) and group size (solo, couple, group).
- **Real-time on-device pose detection**: tracks **19 joints at 30 fps**.
- **Live alignment score** — quantifies how close the user's current pose is to the target pose.
- **Per-joint corrective hints** in natural language ("raise left arm," "tilt head right") — a key UX innovation translating numeric pose error into actionable instructions.
- **Auto-capture**: triggers automatically when alignment score hits **85% for 1.5 seconds**, accompanied by haptic feedback; manual shutter always available as an override.
- **Silhouette overlay**: a translucent white outline of the chosen pose floats over the live camera preview, with **subtle ambient animation** to keep the framing experience relaxed rather than clinical.
- **Custom Pose Studio** — users can import their own reference photos to build custom templates.
- **Privacy-first**: all AI inference runs on-device; no photos or face data leave the phone unless the user shares; no account required.
- Post-capture: curated photo presets (Clean, Warm, Film, B&W, Faded, Moody) plus manual sliders (brightness, contrast, warmth, highlights, shadows, sharpen, vignette, skin smoothing) — "light retouch only" philosophy to preserve authenticity.
- Monetization: freemium "Posei Pro" unlocks full library, premium filters, unlimited edits, watermark-free 4K export, and priority access to new poses weekly.

**PoseMy.Art** ([posemy.art](https://posemy.art/features/)) — A 3D posing/reference tool more oriented at artists and photographers than live camera capture:
- Lets users pose a 3D mannequin/model in a scene, add props, and use it as a drawing/photography reference.
- Reviewed as a strong alternative to traditional posing manikins and Design Doll ([Reddit r/ArtistLounge](https://www.reddit.com/r/ArtistLounge/comments/1srblb7/is_posemyart_any_good/), [PoseMy.Art blog](https://posemy.art/blog/best-posing-software/)).
- Strength: deep 3D control (camera angle, lighting, props); weakness: not real-time camera-guided — it's a staging tool, not an in-the-moment shooting aid.

**Snap Pose Camera / Photo Pose Master / Posica / POSEIC / Unscripted Photography Posing** (various, [Google Play](https://play.google.com/store/apps/details?id=com.sm.snapposecamera&hl=en)) — A long tail of simpler "pose idea" apps that mostly function as **static pose reference galleries** (swipeable image libraries organized by category/occasion) without live camera overlay or pose-matching AI. These represent the "first generation" of the category — good content curation, weak real-time interaction.

**Posed: AI Pose Coach** ([App Store](https://apps.apple.com/us/app/posed-ai-pose-coach/id6762599608)) and **PoseFit Pro** (built on TensorFlow Lite examples, [Google Play](https://play.google.com/store/apps/details?id=org.tensorflow.lite.examples&hl=en_SG)) — Represent a more fitness/coaching-oriented branch of the category, applying real-time skeletal tracking to give live form feedback rather than photography composition feedback.

**PoseMe / Pose Ideas & Guide** ([App Store](https://apps.apple.com/lu/app/pose-ideas-guide-poseme/id6752570584)) and **Photography Poses゜** ([App Store](https://apps.apple.com/au/app/photography-poses/id6608982909)) — Similar static-library pattern to the above.

### 1.2 Adjacent apps referenced in the brief

- **YouCam (Perfect Corp)** — best known for AI beauty filters, makeup try-on, and portrait retouching; pose guidance is not a core differentiator, but YouCam's real-time face/body AR tracking pipeline (running at interactive frame rates on-device) is a relevant technical reference for smooth AR overlays layered on a live camera feed.
- **SnapSeed** — Google's photo editor; does not offer live pose overlay features, but its non-destructive, gesture-based edit stack (particularly the "point and swipe" adjustment UX) is a useful post-capture editing UX reference for a pose app's after-shot refinement.
- **Portrait AI** — historically an app for turning selfies into Renaissance-style painted portraits (style transfer), not a live pose coach; relevant mainly as an example of a single-purpose AI photo app with a delightful, simple, low-friction UX loop (upload → wait → reveal), rather than for pose logic specifically.
- **Figure Reference apps** (e.g., "Line of Action," "Magic Poser," "Pose Tool 3D") — used by illustrators/animators to study human figures; typically offer 3D mannequins, timed gesture-drawing modes, and a large photo-reference database, but are not built for live camera capture assistance.

### 1.3 Cross-app patterns: strengths and weaknesses

| Pattern | Strength | Weakness |
|---|---|---|
| Static pose libraries (majority of apps) | Fast to build, large content catalogs, good discovery/search | No real-time feedback; user must self-judge alignment; high abandonment when pose doesn't match |
| Transparent/silhouette overlay (PoseCamera AI, Posei) | Intuitive, immediately shows "where to stand"; works even without pose-detection AI | Can occlude the live subject; requires manual drag/resize if no auto-registration |
| Real-time skeletal tracking + alignment score (Posei) | Removes guesswork, quantifies "closeness," enables hands-free auto-capture | Requires robust on-device pose model; higher compute/battery cost; needs careful UX so numeric feedback doesn't feel punitive |
| Per-joint natural-language hints (Posei) | Most actionable UX — tells user exactly what to adjust | Requires mapping pose-error vectors to human-readable instructions per joint, non-trivial NLG/logic layer |
| On-device-only processing (Posei) | Strong privacy positioning, no network latency, works offline | Constrains model size/accuracy vs. cloud inference |
| 3D mannequin staging tools (PoseMy.Art) | Deep creative control, great for planning shoots in advance | Not usable in the live moment of capture |
| Auto-capture with dwell/haptic (Posei's 85%-for-1.5s threshold) | Removes need for a human photographer/timer; feels "magic" | Threshold tuning is delicate — too strict frustrates, too loose captures bad poses |

**Market takeaway:** The frontier of the category (2025–2026) has moved from *passive reference galleries* to *active, real-time, AI-verified pose coaching* with natural-language correction and hands-free capture — exemplified by Posei's 19-joint/30fps tracking, live alignment scoring, and per-joint hints. A differentiated app should assume this is now baseline expectation, not a novel feature.

---

## 2. Real-Time Camera Guidance Systems

### 2.1 Core frameworks

| Framework | Platform | What it does | Notes |
|---|---|---|---|
| **Apple Vision Framework — `VNDetectHumanBodyPoseRequest`** | iOS/macOS (since iOS 14) | Detects up to 19 unique body landmarks per person in still images or video frames; supports multi-person detection; returns per-point confidence scores | Works offline on static images and video; distinct from ARKit's body tracking, which is tuned for live motion capture ([dev.classmethod.jp overview](https://dev.classmethod.jp/articles/vision-body-pose/)) |
| **ARKit (`ARBodyTrackingConfiguration`)** | iOS | Live 3D skeletal body tracking designed for motion capture / AR character-driving use cases (e.g., VTuber-style apps) | Best suited when you need a 3D skeleton mapped into AR space, not just 2D screen-space keypoints |
| **ARCore** | Android | Google's AR SDK; provides plane detection, motion tracking, light estimation; pose/body tracking is more limited than ARKit natively, often paired with ML Kit or MediaPipe for body landmarks | See [ARCore performance guide](https://developers.google.com/ar/develop/performance) |
| **MediaPipe Pose Landmarker (BlazePose)** | Cross-platform (Web/JS, Android, iOS, Python) via `@mediapipe/tasks-vision` | Detects **33 keypoints** (more than the 17-point COCO standard), runs in `IMAGE`, `VIDEO`, or `LIVE_STREAM` mode; live-stream mode is specifically optimized to drop frames rather than block, keeping latency low ([Google AI Edge docs](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js)) | An academic comparison found BlazePose (via MediaPipe) outperformed Lightweight OpenPose, PifPaf, and TF-Lite MobileNet variants for real-time, on-device, browser-based pose estimation and correction ([study PDF](https://ijaem.net/issue_dcp/On%20device%20Realtime%20Pose%20Estimation%20and%20Correction.pdf)) |
| **TensorFlow Lite — MoveNet / PoseNet** | Android/iOS/embedded | MoveNet ships in two variants: **Lightning** (faster, less accurate, real-time on modern phones) and **Thunder** (slower, more accurate); benchmarked at 25–52ms GPU latency on Pixel 5 ([TensorFlow blog](https://blog.tensorflow.org/2021/08/pose-estimation-and-classification-on-edge-devices-with-MoveNet-and-TensorFlow-Lite.html)) | Recommends deploying models **over-the-air via Firebase ML** rather than bundling all variants in the app binary, so lower-end devices get Lightning INT8 and high-end devices get Thunder FP16 |

### 2.2 Best practices for low-latency camera overlays

1. **Never block the render/main thread with inference.** MediaPipe's own docs warn that `detect()`/`detectForVideo()` calls run synchronously and will block the UI thread if called directly from camera frame callbacks — the recommended fix is running inference in a Web Worker (web) or background thread (mobile) ([Google AI Edge](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js)).
2. **Drop frames rather than queue them.** Both MediaPipe's live-stream mode and Android camera pipelines use a "keep only latest frame" backpressure strategy (`STRATEGY_KEEP_ONLY_LATEST`) so the pipeline doesn't fall progressively behind under load ([ExaWizards engineering blog](https://techblog.exawizards.com/entry/2020/10/22/130200)).
3. **Use a One-Euro filter or EMA smoothing on landmarks** to reduce jitter, but tune `min_cutoff`/`beta` carefully — too much smoothing causes overlay "lag" behind fast motion, too little causes visible jitter ([MediaPipe GitHub issue #5193](https://github.com/google/mediapipe/issues/5193)).
4. **Decouple rendering from inference ("pipeline" architecture).** Academic AR systems (e.g., the MobiCom 2019 "Edge Assisted Real-time Object Detection" paper) show that decoupling the render loop from the detection loop — rendering the last known pose while inference computes the next one — lets systems sustain 60 fps even when inference itself is slower, using lightweight motion-vector-based tracking to interpolate between inference results ([Rutgers/WINLAB paper](https://www.winlab.rutgers.edu/~luyang/papers/mobicom19_augmented_reality.pdf)).
5. **Target the sub-frame budget.** For a 30 Hz camera feed, the processing budget per frame is ~33ms; for 60 fps AR, ~16.7ms. Systems exceeding this budget show visible overlay lag or "swimming" ([Reddit r/oculus discussion on motion-to-photon latency](https://www.reddit.com/r/oculus/comments/9aeryx/how_to_reduce_motion_to_photon_latency_in_mobile/)).
6. **Add a time-threshold / hysteresis gate before surfacing corrective feedback.** One on-device pose-correction study introduced a minimum duration an error must persist before informing the user, reducing false-positive corrections and improving perceived UX quality even at a slight FPS cost ([IJAEM paper](https://ijaem.net/issue_dcp/On%20device%20Realtime%20Pose%20Estimation%20and%20Correction.pdf)).
7. **Model selection is a UX decision, not just an ML decision.** MoveNet Lightning INT8 (2.9MB) vs. Thunder FP16 (12.6MB) trade real-time responsiveness against accuracy — pose-guidance apps should default to the lighter/faster model for the live overlay and can optionally run a heavier model only on the final captured frame for auto-scoring precision.
8. **On-device processing is both a latency and privacy win.** BlazePose/MediaPipe and Apple Vision Framework both run fully on-device, avoiding network round-trip latency and letting apps market "your photos never leave your phone" (as Posei does) — increasingly a competitive differentiator.

---

## 3. Agent Prompting Techniques for Mobile App Development (2025–2026)

### 3.1 Loop Engineering (2026) — the dominant emerging paradigm

**Loop Engineering**, popularized by [Addy Osmani's blog post](https://addyosmani.com/blog/loop-engineering/) (June 2026) and expanded in a [developer guide by Noqta](https://noqta.tn/en/blog/loop-engineering-ai-agents-developer-guide-2026), reframes the developer's role: instead of prompting an agent turn-by-turn, you **design the system that prompts the agent for you.**

**The five (or six) core primitives:**

| Primitive | Purpose |
|---|---|
| Automations | Scheduled or event-triggered discovery/triage (cron, hooks, GitHub Actions) |
| Worktrees | Isolated git checkouts so parallel agents never collide on the same files |
| Skills | Version-controlled `SKILL.md` files that encode project conventions, build steps, and past-incident learnings, so agents stop re-deriving context every run |
| Plugins/Connectors (MCP) | Let the agent read issue trackers, hit staging APIs, query databases, post to Slack |
| Sub-agents | Split "writer" from "verifier" — the model that wrote code should not grade its own homework |
| State/Memory | A markdown file or board that persists outside the conversation — "the agent forgets, the repo doesn't" |

**The four loop types** (per Noqta's taxonomy): **Heartbeat** (continuous, seconds–minutes; e.g. log monitoring), **Cron** (scheduled; e.g. daily code review), **Hook** (event-driven; e.g. on PR push or CI failure), and **Goal loops** (iterate — reason, plan, act, observe — until a verifiable success condition is met, then terminate).

**The five-stage agent cycle:** Perceive → Reason → Plan → Act → Observe, repeating until goal verification, an iteration cap, a budget limit, or a circuit breaker stops it.

**How this reduces bugs/hallucinations, specifically:**
- **Separate verifier sub-agents** prevent "false completion" — a second agent (sometimes a different, stronger model) checks the first agent's work against the spec, rather than trusting self-graded "done" claims.
- **Skills externalize project knowledge**, stopping the agent from hallucinating conventions or re-inventing build steps each session.
- **State tracking enables crash-safe resume** and prevents repeating irreversible side effects after a failure.
- **Model routing** — using cheap models ($0.10–0.30/1M tokens) for classification, mid-tier ($1–3/1M) for drafting, and frontier models ($10–15/1M) specifically for final correctness/security review — reportedly cuts total inference cost by **60–80%** while concentrating the most capable (least hallucination-prone) model on the highest-stakes verification step.
- **Mandatory production guardrails**: hard iteration caps, token/cost budgets, no-progress detection (stop if the last N iterations produced identical output), circuit breakers with exponential backoff on tool retries, and **human checkpoints before irreversible actions** (deploys, sending emails, database writes) — directly applicable to mobile app CI/CD and App Store submission steps.
- **Explicit caveat from the source**: verification is still the human's responsibility; "done" is a claim, not a proof — loop engineering reduces but does not eliminate the need for human review, especially as loops ship code faster than a human can read it.
- Recommended on-ramp: start with **ReAct** (handles ~80% of production cases, most debuggable), add **Reflexion-style self-correction** when accuracy matters more than speed, and graduate to full **goal loops** only for well-specified, verifiably-terminating engineering tasks.

Mapped to mobile app development specifically (not stated verbatim in sources, but a direct application of the stated primitives): a mobile-app loop would run scheduled triage over crash reports/CI failures, spin up an isolated worktree per fix, use one sub-agent to draft the UI/logic change, a second sub-agent to verify against platform-specific skills (e.g., "iOS Human Interface Guidelines," "App Store review rules," "no force-unwraps") and automated tests, then use connectors to open a PR and notify the team — with a human checkpoint gating any App Store submission or production deploy.

### 3.2 Spec-Driven Development (SDD) — GitHub Spec Kit

[GitHub's Spec Kit](https://github.github.com/spec-kit/) formalizes a **Spec → Plan → Tasks → Implement** pipeline where each phase produces a markdown artifact that feeds into the next, giving the coding agent structured context "instead of ad-hoc prompts." It integrates with 30+ agents (Copilot, Codex, Claude, Gemini, Windsurf, etc.) and includes built-in quality checklists and cross-artifact consistency analysis. This is directly complementary to Loop Engineering: Spec Kit structures *what* gets built, while Loop Engineering structures *how* the agent loop executes and verifies it. For a mobile app project, an SDD-style pipeline (write the pose-detection feature spec → generate an implementation plan → break into tasks → implement) reduces hallucinated scope and provides a natural checkpoint for human review at each stage.

### 3.3 Chain-of-Thought and Self-Consistency

- **Chain-of-Thought (CoT)** prompting improves accuracy on complex, multi-step problems (including UI/UX layout reasoning) by forcing the model to articulate intermediate reasoning steps rather than jumping to an answer.
- **Self-Consistency** extends CoT by generating **multiple independent reasoning paths** for the same prompt and taking the majority/most-consistent answer — analogous to polling a panel of experts who each reason independently and then converging on the most frequent conclusion. This is directly applicable to agent-driven UI generation: generating several candidate implementations or layout solutions and selecting (or synthesizing) the most consistent one reduces one-off hallucinated logic ([explainer video](https://www.youtube.com/watch?v=IMkSUxGKfvw)).
- In practice for mobile UI/UX: applying CoT means having the agent reason step-by-step through user flow → component breakdown → state management → edge cases *before* writing code, rather than generating code directly from a feature description.

### 3.4 Stanford STORM methodology

[Stanford's STORM](https://github.com/stanford-oval/storm) ("Synthesis of Topic Outlines through Retrieval and Multi-perspective question asking") is an LLM-powered knowledge-curation system (25.4k GitHub stars) built for long-form article generation, structured as:
1. **Pre-writing stage**: internet-based research to gather references and generate an outline, using **perspective-guided question asking** (discovering diverse viewpoints by surveying related topics) and **simulated multi-turn conversations** between a "writer" persona and a "topic expert" persona grounded in real sources.
2. **Writing stage**: uses the outline plus gathered references to produce the final full-length, cited output.

While STORM was designed for research-article writing rather than software, its core mechanism — **decomposing a complex generation task into (a) structured, multi-perspective research/planning and (b) a separate grounded writing stage** — maps naturally onto software agent workflows: an agent that first researches the problem space from multiple "perspectives" (end-user, platform reviewer, security auditor, accessibility auditor) before writing a spec, then implements against that spec, should hallucinate less than one that jumps directly from a one-line prompt to code. This is conceptually the software-engineering analog of Spec-Driven Development combined with self-consistency's "multiple independent viewpoints" idea.

### 3.5 Synthesis: a 2025–2026 "best practice stack" for building a mobile app with AI agents

1. **Research/outline phase** (STORM-style): have the agent (or a sub-agent) gather multi-perspective context — competitive apps, platform guidelines, accessibility needs — before writing any spec.
2. **Spec-Driven Development**: formalize the researched requirements into a Spec → Plan → Tasks pipeline (GitHub Spec Kit or equivalent), each stage reviewable by a human.
3. **Chain-of-Thought + Self-Consistency** during implementation planning: require step-by-step reasoning for non-trivial UI/state logic, and where stakes are high, sample multiple independent solutions and reconcile them.
4. **Loop Engineering execution**: implement via automations, isolated worktrees, codified skills (platform conventions, past incidents), MCP connectors to real project tools, and — critically — a **separate verifier sub-agent** that checks implementation against the spec and tests, never trusting the implementer's own "done" signal.
5. **Guardrails**: hard iteration caps, cost budgets, no-progress detection, circuit breakers on flaky tool calls, and mandatory **human checkpoints before any irreversible action** (App Store submission, production deploy, data migration).

---

## 4. Art Nouveau UI/UX in Mobile Apps

### 4.1 Core visual vocabulary

Art Nouveau's defining characteristics translate to digital design as follows ([Zeka Design](https://www.zekagraphic.com/contemporary-nouveau-and-the-influence-of-art-nouveau-in-graphic-design/), [Envato](https://elements.envato.com/learn/art-nouveau-aesthetic), [Mew Design Docs](https://docs.mew.design/blog/art-nouveau-design-style/)):

- **Motifs**: whiplash curves, organic/flowing lines, botanical themes (vines, leaves, florals, mushrooms/spores), stained-glass-inspired patterning, and stylized female figures reminiscent of Alphonse Mucha's posters. These work best as **decorative borders, section dividers, and isolated accent illustrations** rather than dense all-over patterns, which would clutter a mobile screen.
- **Layout**: symmetrical compositions historically, but contemporary "Nouveau" digital work increasingly favors **organic asymmetry** balanced against clean, minimalist structural grids — ornament as accent, not as the whole layout.
- **Typography**: ornate, hand-drawn-feeling serif display faces (e.g., Romantique, Kingthings Tendrylle, Art Nouveau Caps — free options via DaFont/Font Squirrel) for headlines/hero text only; **paired with a clean, minimal sans-serif for body copy** to preserve readability, since ornamental Art Nouveau letterforms "can be difficult to render clearly at small screen sizes" ([Made Good Designs](https://madegooddesigns.com/art-nouveau-fonts/)). Best practice: use flourishes/swashes sparingly on titles, keep spacing generous.
- **Decorative frames**: ornate borders around key content (headers, product/feature cards) are a common contemporary technique to inject Nouveau character without overwhelming a UI.

### 4.2 Color palettes

Multiple sources converge on the same palette logic — a **botanical/jewel-tone approach anchored by warm neutrals**:

- **Base/background**: cream, parchment, ivory, or soft off-white — "like paper" — so ornament doesn't feel visually heavy ([media.io Art Nouveau palette guide](https://www.media.io/color-palette/art-nouveau-color-palette.html)).
- **Botanical mid-tones**: sage, moss, celadon, teal greens.
- **Accent (used sparingly, 5–10% of layout)**: one jewel tone (aubergine, cobalt, peacock blue) or muted metallic (antique gold, warm ochre).
- **Text/outline**: near-black or deep charcoal/dark green for accessibility and to let curves and ornament stand out.
- Named example palettes: *Gilded Iris* (`#2F3A2D #6F8A5A #C7B07A #7A4E8A #F2E9D8`), *Peacock Fresco* (`#0F3B3A #1E7A74 #2B5FAD #C9A24C #F6F0E1`), *Lilac Nouveau* (`#4C3A59 #9C7FB4 #E7D6F2 #B7C7A7 #F5F0E7` — explicitly recommended for "UI landing page mockups" and "wellness apps, creative portfolios, boutique ecommerce" needing calm-but-not-bland tone).
- **Role-based color assignment** is the recommended methodology: one dark color for text/outline, two mid-tones for fills/sections, one accent for highlights, one light neutral for breathing room — this keeps an ornate palette usable across a full app rather than just a poster.
- Accessibility note explicitly given: pair off-white backgrounds with charcoal text, reserving teal/lilac/gold for buttons, badges, and section headers only.

### 4.3 Application patterns and modern examples

- **Envato/Dribbble concept work**: an "Art Nouveau App" redesign of a recipe app (Tasty) demonstrates the aesthetic applied to a real mobile UI ([Dribbble, Emily Olivieri](https://dribbble.com/shots/14373608-Art-Nouveau-App)).
- **Design system availability**: no dedicated major "Art Nouveau design system" (like Material Design or Carbon) exists yet; instead, the aesthetic is distributed across individual **Figma/Envato UI kit templates** (art gallery, museum, and boutique-real-estate landing pages/apps being the most common genres for the style) rather than a general-purpose component library ([Envato Art Nouveau UI kits](https://elements.envato.com/graphic-templates/ux-and-ui-kits/art+nouveau)).
- **Practical implementation guidance repeatedly emphasized across sources**: (1) simplify ornament for small screens — use isolated motifs/subtle overlays rather than dense all-over patterns; (2) pair ornate elements with minimalist layout and typography for balance; (3) use asymmetry deliberately for visual interest without sacrificing usability; (4) combine hand-drawn/illustrated elements with digital/clean UI components; (5) reserve gloss/shine for a single hero element to keep the palette feeling timeless rather than kitsch ([Zeka Design](https://www.zekagraphic.com/contemporary-nouveau-and-the-influence-of-art-nouveau-in-graphic-design/)).
- **Contemporary brand references** cited as embodying "Contemporary Nouveau": Fortnum & Mason (heritage branding, seasonal collections), Florence and the Machine (album/promo art), and smaller packaging brands like Fruitawa.

### 4.4 Recommendation for a pose app's Art Nouveau treatment

Given the research above, an Art Nouveau pose app UI should: use a parchment/cream base with charcoal or deep-green text; reserve a single jewel accent (peacock teal or antique gold) for the primary CTA/capture button and progress indicators; frame the live camera view or pose-overlay silhouette with a subtle ornamental border (vine or whiplash-curve motif) rather than patterning the whole screen; use an ornate display serif only for the app name/section headers, with a clean sans-serif for instructional text and per-joint hints (readability is critical here since these are functional, glanceable cues); and animate transitions with soft, organic easing curves rather than sharp/mechanical motion, echoing the style's flowing-line character.

---

## 5. Human Sprite & Pose Animation Systems

### 5.1 Skeleton-driven SVG animation

- **Pose Animator** (Google Creative Lab / TensorFlow, open source, Apache-2.0) — the most directly relevant open-source reference. It takes a 2D vector (SVG) illustration and animates its curves in real time using **PoseNet** (body) and **FaceMesh** (face) keypoints captured from a webcam, applying skeleton-based animation (borrowed from traditional computer graphics/game rigging) to vector characters. Supports single-pose/single-face detection; tested on desktop Chrome and iOS Safari ([TensorFlow blog announcement](https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html), [GitHub via aijs.rocks](https://aijs.rocks/inspire/pose-animator/)). Uses **linear blend skinning** to map keypoints to the SVG's bone structure, plus motion-stabilization techniques to reduce jitter from noisy keypoint predictions.
- This general technique — **rig an SVG with a skeleton, then drive the skeleton with live pose-estimation keypoints** — is the standard architecture for any app that wants to show an animated humanoid guide that visually responds to detected motion (as opposed to a static silhouette overlay).

### 5.2 Lottie for mobile pose/fitness animation

- **Lottie** (Airbnb, open source — [`lottie-android`](https://github.com/LottieFiles/lottie-android)) renders After Effects animations exported as JSON (via the Bodymovin plugin) natively on Android, iOS, Web, and React Native. This is the dominant format for **pre-authored** (not live-driven) pose/exercise animations in production fitness apps, since it's vector-based (crisp at any resolution), lightweight, and performant on mobile.
- **LottieFiles marketplace** hosts large libraries purpose-built for this use case: e.g., a **1,400+ animated exercise library** ("Vector Fitness Exercises") covering 9 equipment categories (bodyweight, dumbbells, barbell, cable, machines, bands, TRX, foam roller, stretching) with male/female variations, delivered as Lottie JSON, MP4/MOV with alpha channel, and GIF — explicitly marketed at fitness app developers for iOS & Android ([YouTube walkthrough](https://www.youtube.com/watch?v=IwsCkvSNoE8), [free sample pack](https://vectorfitexercises.com/for-content-creators)). Free/general fitness Lottie packs are also broadly available on [LottieFiles](https://lottiefiles.com/free-animations/app-fitness) and [IconScout](https://iconscout.com/lottie-animations/body-pose-estimation) (6,698+ body-pose-estimation-themed animations).
- **Practical implication for a pose app**: reference/demo poses (i.e., "here's what the target pose looks like in motion") are best delivered as pre-built Lottie animations rather than computed live, since they don't need to react to the user's actual body — only the **overlay/guide** and **live feedback layer** need real-time pose-estimation-driven rendering.

### 5.3 Skeletal animation tooling background (game-engine lineage)

Several open-source 2D skeletal animation systems, originally built for games, share the same conceptual foundation (bone hierarchy + mesh deformation + pose interpolation) applicable to mobile pose-guide sprites:
- **DragonBones** — free, cross-engine 2D skeletal animation solution ([dragonbones.github.io](https://dragonbones.github.io/en/animation.html)).
- **Unity "Sprites and Bones"** — free/open-source 2D skeletal sprite rigging with pose save/load as reusable assets ([Reddit r/Unity2D](https://www.reddit.com/r/Unity2D/comments/1wfj6k/unity_sprites_and_bones_free_open_source/)).
- **ozz-animation** — open-source C++ runtime skeletal animation library (loading, sampling, blending) — lower-level, engine-integration use case ([GitHub](https://github.com/guillaumeblanc/ozz-animation)).
- **sketchpunklabs/ossos** — web-based character animation/skinning system for browser-native 2D/3D rigs ([GitHub](https://github.com/sketchpunklabs/ossos)).

These are more relevant if the app needs a fully custom-rigged animated mascot/avatar rather than off-the-shelf Lottie content; they require more engineering investment but allow arbitrary custom poses driven by live data rather than pre-baked animation clips.

### 5.4 Applied example: dance/fitness pose apps

- **DanceDrill** ([App Store](https://apps.apple.com/ca/app/dancedrill/id6759819098)) explicitly uses **Apple's Vision framework** to detect full-body poses (15 joints) frame-by-frame across two videos (reference vs. user) — a directly comparable real-world implementation of "compare live pose to a reference clip" using Apple's native on-device framework rather than MediaPipe, confirming Vision Framework is production-viable for this exact use case on iOS.

### 5.5 Recommended animation architecture for a pose-guidance app

Based on the above, a hybrid approach is standard best practice:
1. **Pre-authored Lottie/vector animations** (or short looping video with alpha) for showing the *target* pose in motion — sourced from libraries like Vector Fitness Exercises or custom-designed in After Effects/Bodymovin, rendered natively via `lottie-android`/Lottie-iOS.
2. **Live skeleton overlay driven by real-time pose estimation** (MediaPipe BlazePose or Apple Vision Framework `VNDetectHumanBodyPoseRequest`) rendered as a simple vector/line overlay (skeleton dots+lines or silhouette) on top of the camera feed — following the Pose Animator architectural pattern (skeleton → SVG/vector rig → real-time deformation) but simplified to 2D screen-space overlay rather than full character animation.
3. **Smoothing/filtering** (One-Euro filter or EMA) applied to the live overlay to avoid jitter, as discussed in Section 2.
4. Optionally, a **custom-rigged animated mascot** (via DragonBones-style skeletal rigging) if the product wants a branded character to demonstrate poses rather than a generic skeleton/silhouette — a heavier investment but stronger brand differentiation, and compatible with the Art Nouveau aesthetic direction (an illustrated Mucha-style figure rigged for animation).

---

## Source List (key URLs)

**Pose apps:** [PoseCamera AI](https://apps.apple.com/in/app/posecamera-ai/id6751519249) · [Posei](https://apps.apple.com/in/app/posei-ai-pose-camera-guide/id6763751241?l=mr) · [PoseMy.Art](https://posemy.art/features/) · [Posed AI Pose Coach](https://apps.apple.com/us/app/posed-ai-pose-coach/id6762599608) · [PoseFit Pro](https://play.google.com/store/apps/details?id=org.tensorflow.lite.examples&hl=en_SG) · [Snap Pose Camera](https://play.google.com/store/apps/details?id=com.sm.snapposecamera&hl=en) · [PoseMe](https://apps.apple.com/lu/app/pose-ideas-guide-poseme/id6752570584)

**Camera guidance tech:** [Apple Vision body pose](https://dev.classmethod.jp/articles/vision-body-pose/) · [ARCore performance](https://developers.google.com/ar/develop/performance) · [MediaPipe Pose Landmarker Web](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js) · [MoveNet/TFLite blog](https://blog.tensorflow.org/2021/08/pose-estimation-and-classification-on-edge-devices-with-MoveNet-and-TensorFlow-Lite.html) · [MediaPipe smoothing issue](https://github.com/google/mediapipe/issues/5193) · [On-device pose correction paper](https://ijaem.net/issue_dcp/On%20device%20Realtime%20Pose%20Estimation%20and%20Correction.pdf) · [Edge-assisted AR latency paper](https://www.winlab.rutgers.edu/~luyang/papers/mobicom19_augmented_reality.pdf)

**Prompting techniques:** [Loop Engineering — Addy Osmani](https://addyosmani.com/blog/loop-engineering/) · [Loop Engineering guide — Noqta](https://noqta.tn/en/blog/loop-engineering-ai-agents-developer-guide-2026) · [GitHub Spec Kit](https://github.github.com/spec-kit/) · [Stanford STORM GitHub](https://github.com/stanford-oval/storm) · [Self-consistency CoT explainer](https://www.youtube.com/watch?v=IMkSUxGKfvw)

**Art Nouveau design:** [Zeka Design — Contemporary Nouveau](https://www.zekagraphic.com/contemporary-nouveau-and-the-influence-of-art-nouveau-in-graphic-design/) · [Envato — Art Nouveau aesthetic guide](https://elements.envato.com/learn/art-nouveau-aesthetic) · [Art Nouveau color palettes — media.io](https://www.media.io/color-palette/art-nouveau-color-palette.html) · [Art Nouveau fonts guide](https://madegooddesigns.com/art-nouveau-fonts/) · [Mew Design — Art Nouveau style guide](https://docs.mew.design/blog/art-nouveau-design-style/) · [Envato Art Nouveau UI kits](https://elements.envato.com/graphic-templates/ux-and-ui-kits/art+nouveau) · [Dribbble Art Nouveau App concept](https://dribbble.com/shots/14373608-Art-Nouveau-App)

**Sprite/pose animation:** [Pose Animator announcement](https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html) · [Pose Animator on aijs.rocks](https://aijs.rocks/inspire/pose-animator/) · [Lottie Android GitHub](https://github.com/LottieFiles/lottie-android) · [Vector Fitness Exercises library](https://vectorfitexercises.com/for-content-creators) · [DragonBones](https://dragonbones.github.io/en/animation.html) · [ozz-animation](https://github.com/guillaumeblanc/ozz-animation) · [sketchpunklabs/ossos](https://github.com/sketchpunklabs/ossos) · [DanceDrill App](https://apps.apple.com/ca/app/dancedrill/id6759819098)
