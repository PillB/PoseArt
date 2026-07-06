# Phase 1 Pre-Research: User Flow & IA Best Practices
*Compiled July 2026 — for a camera + pose-library app design initiative*

---

## 1. Mobile App Onboarding Best Practices (2025–2026)

### Ideal Onboarding Length
Evidence converges strongly around **3–5 screens** as the sweet spot for consumer apps, with time-to-value mattering more than raw screen count:

| Screen Count | Typical Completion Rate | Recommendation |
|---|---|---|
| 1–2 screens | 55–60% | Too short — may not communicate enough value |
| 3–4 screens | 45–50% | Optimal for simple apps with a clear value prop |
| 5 screens | 35–40% | Maximum for complex apps; every screen must earn its place |
| 6–8 screens | 20–30% | Only if absolutely necessary |
| 8+ screens | <20% | Almost always too long |

([Snoopr onboarding research](https://www.snoopr.co/blog/how-long-should-mobile-app-onboarding-be-screens-time-and-completion-data))

Key data points:
- Completion rates drop **10–20% per additional screen** beyond 5 ([Snoopr](https://www.snoopr.co/blog/how-long-should-mobile-app-onboarding-be-screens-time-and-completion-data); [Glance Group](https://thisisglance.com/learning-centre/how-can-i-check-if-my-onboarding-flow-is-too-long)).
- Average checklist-style onboarding completion industry-wide is only **19.2%** (median 10.1%) per Business of Apps data ([Snoopr](https://www.snoopr.co/blog/how-long-should-mobile-app-onboarding-be-screens-time-and-completion-data)).
- **Time-to-value under 60 seconds** drives 3–5x higher retention than slower flows ([Snoopr](https://www.snoopr.co/blog/how-long-should-mobile-app-onboarding-be-screens-time-and-completion-data); [Dots Mobile](https://www.dots-mobile.com/blog-posts/mobile-app-onboarding-best-practices)).
- Headspace cut onboarding from 5 screens to 3 and saw a **15% lift in completion** ([ApsteQ](https://apsteq.com/blog/app-onboarding-optimization/)).
- Counterpoint: some high-converting subscription apps intentionally run **25–50 screen** quiz-style onboarding flows (10+ minutes) that build investment before a paywall — this works specifically for apps monetizing via trial/subscription, not for utility or tool apps where users want fast access ([Sozai transcript](https://sozai.app/transcript/studied-1460-onboarding-flows-findings/); [Adapty](https://adapty.io/blog/mobile-app-onboarding-vs-tutorials/)).
- Personalization (2–3 quick preference taps, not forms) boosts trial starts by **8.5%** and paying conversion by **17%** (up to 27%/35% ARPU in the US) ([Dots Mobile](https://www.dots-mobile.com/blog-posts/mobile-app-onboarding-best-practices)).
- Recommended structure: **Screen 1** — hook/value proposition; **Screens 2–3** — demonstrate core feature; **Screen 4** — optional personalization; **Screen 5** — sign-up/primary CTA ([Web22](https://web22.dev/onboarding-mobile-app/)).

**Recommendation for a camera/pose app:** Target **3–4 screens**, front-load the value proposition ("start your first session in under a minute"), defer account creation until after users see value, and get users into a real camera/pose interaction as fast as possible.

### Camera & Microphone Permission Requests
This is the most sensitive part of onboarding for camera-based apps. Consensus best practices:

- **Contextual, just-in-time requests outperform upfront requests by up to 28% in grant rate** ([Dogtown Media](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/)).
- **Exception:** if camera access is the core value proposition (a camera-first app), requesting it early is acceptable and expected — Apple's own guidance: *"Only request a permission at app launch if it's necessary for the core functioning of your app."* Android's guidance mirrors this ([Dogtown Media](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/)).
- **Use a custom "pre-permission priming" screen before the native OS dialog.** This lets you explain the benefit in your own voice, and — critically — the native system dialog can only be shown **once per permission type on iOS**, so priming screens let you "pre-qualify" acceptance before burning that one shot.
  - Recommended copy formula (Nielsen Norman Group): *"[App] would like to access your [resource] so that you can [benefit/task]."*
  - Headline should focus on the **feature/benefit, not the permission** — e.g., "Scan Documents Instantly" or "Capture and Share Moments" rather than "Allow Camera Access."
  - Include a visual (icon/illustration) and two clear choices: "Allow/Continue" and "Not Now/Maybe Later."
  - Clear, value-driven explanations can increase grant rates by **up to 81%** (Nielsen Norman Group party-planning app study, cited in [Dogtown Media](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/)).
- **78% of users** who understand *why* a permission is needed show roughly **2x higher opt-in rates**; **82%** of users want a clear reason before granting ([Dogtown Media](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/)).
- **Platform mechanics to design around:**
  - iOS: "Allow Once" (since iOS 13); orange dot = mic in use, green dot = camera in use; system dialog only shows once — after denial, users must go to Settings.
  - Android: "Allow Once" (Android 11+) for location/mic/camera; after two denials shows "Don't ask again"; status-bar privacy indicators when camera/mic active.
- **Graceful degradation is mandatory:** never block the whole app on a denied permission if an alternative path (upload, manual entry) exists; always provide a route back to Settings ([UX Patterns Guide](https://uxpatternsguide.com/patterns/camera-capture/); [Dogtown Media](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/)).
- Apps requesting fewer than 5 total permissions see **up to 25% higher install rates**; 87% of Android apps and 60% of iOS apps request unnecessary permissions, which correlates with uninstalls (43% uninstall due to excess permissions; 54% won't install, 30% will uninstall over privacy concerns per Pew Research) ([Dogtown Media](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/)).

**Recommendation:** For a pose/camera coaching app, camera access is core functionality — request it early but through a custom priming screen tied to a concrete benefit ("See your form corrected in real time"), not at cold launch before any context is given. Microphone should be requested separately and only when a feature needs it (e.g., voice-guided coaching cues), following the "Start Call"-style contextual pattern.

### Interactive Tutorials, Coach Marks & Walkthroughs
- Four main tutorial types: **coach marks/tooltips** (contextual overlays on specific elements), **walkthrough sequences** (step-by-step tours), **interactive demos** (hands-on practice), and **feature spotlights** (contextual, delivered later at point of relevance) ([RapidDev](https://rapidevelopers.com/mobile-app-features/interactive-user-tutorials)).
- Users who complete tutorials show **3.5x higher 30-day retention**; feature discovery increases **68%** with contextual highlighting; support tickets drop **25–30%** ([RapidDev](https://rapidevelopers.com/mobile-app-features/interactive-user-tutorials)).
- Keep walkthroughs **under 5 steps** — engagement drops sharply beyond that ([RapidDev](https://rapidevelopers.com/mobile-app-features/interactive-user-tutorials)).
- Best practice trend for 2026: **single-run, in-context gesture tutorials** shown during actual first use rather than a static wall of instructions on a welcome screen ([Webcastle](https://webcastle.com/blog/mobile-ui-design-trends-2026-micro-interactions-and-engagement/)).
- Store tutorial-completion state in user preferences so returning users aren't shown the same tips repeatedly ([RapidDev](https://rapidevelopers.com/mobile-app-features/interactive-user-tutorials)).

### Fitness/Photo/Creative App Examples
- **Fitness apps:** Welcome screen should state outcome-based value immediately (e.g., "Start your first workout in 1 minute"), use short sequential screens, and avoid long registration forms or forced social login. A comparison table of good vs. bad onboarding patterns: short value-focused welcome text vs. empty slogans; minimal fields with a "Skip" option vs. long mandatory forms; interactive live hints vs. static slides; one clear CTA vs. multiple unclear options ([Dataconomy](https://dataconomy.com/2025/11/11/best-ux-ui-practices-for-fitness-apps-retaining-and-re-engaging-users/)).
- **Meditation apps (Headspace):** reduced onboarding from 5 to 3 screens for a 15% completion lift, reflecting the broader "cut to the essentials" pattern ([ApsteQ](https://apsteq.com/blog/app-onboarding-optimization/)).
- **AI camera/fitness posture apps:** Devpost's FitBuddy case study highlights practical onboarding/runtime challenges specific to camera+pose apps: managing camera permissions smoothly across iOS/Android, syncing motion logic with animations, and designing feedback UI that stays clear during real-time pose detection ([Devpost](https://devpost.com/software/fitbuddy-ai-fitness-coach-form-tracker)).
- Camera-angle research for pose-estimation apps: optimal accuracy occurs with the phone positioned **diagonally (~45°) at 180–200cm** — worth reflecting in an onboarding "position your phone" step for a pose-camera app ([JMIR mHealth study](https://mhealth.jmir.org/2026/1/e82412)).

---

## 2. Bottom Navigation vs. Tab Bar vs. Gesture Navigation

### iOS Human Interface Guidelines (2025–2026, including Liquid Glass updates)
- Tab bars are for **navigating between top-level sections**, not for actions (use a toolbar for actions) ([Apple HIG – Tab Bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)).
- **Use as few tabs as possible** — "it's generally easier to navigate among fewer tabs." On iPadOS, if letting users customize tabs, **default to 5 or fewer**.
- Never hide/disable tab buttons even when content is temporarily empty — instead explain why the section is empty.
- Avoid causing **overflow "More" tabs** — hidden tabs behind a "More" list hurt discoverability.
- Always include short (1-word) text labels alongside icons; prefer SF Symbols; use badges sparingly for genuinely critical updates only.
- **2025 "Liquid Glass" redesign:** tab bar now floats above content at the bottom with a translucent glass background that lets content peek through; can minimize/collapse on scroll (e.g., Music app's mini-player pattern) and expand again on tap or scroll-to-top. A dedicated search tab can sit at the trailing end.
- On iPadOS, tab bars sit near the top and can convert to a sidebar for complex apps.
([Apple HIG – Tab Bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars))

### Material Design 3 (Google)
- **Navigation bar** (bottom bar): use for **3–5 main destinations**, mobile/tablet only, spans full width, one destination always active, icon + label required, filled icon = active state, outlined = inactive ([M3 Navigation Bar Guidelines](https://m3.material.io/components/navigation-bar/guidelines)).
- **More than 5 items:** don't use a navigation bar — instead use in-page tabs to organize content, or hide navigation behind a menu icon using a modal expanded navigation rail.
- **Navigation rail** (side rail, for medium/expanded/tablet windows): supports **3–7 destinations** plus an optional FAB; as of **May 2025**, M3 introduced **collapsed** and **expanded** rail variants — the expanded rail now replaces the navigation drawer pattern entirely in the "Expressive" update ([M3 Navigation Rail](https://m3.material.io/components/navigation-rail/overview)).
- Adaptive rule of thumb: **compact windows** (phone portrait, <600dp) → bottom navigation bar; **medium windows** (tablet/foldable, 600–839dp) → navigation bar or rail depending on space; **expanded/extra-large** → navigation rail.
- Don't use swipe gestures to switch between top-level destinations — reserve swipe for within-section actions like carousels or list-item actions.
- Standard: navigation bar can be temporarily covered by sheets/dialogs/keyboard but never permanently obscured.

### Bottom Nav vs. Tab Bar vs. Gesture Nav — Synthesis
| Pattern | Best for | Notes |
|---|---|---|
| **Bottom nav / tab bar** | 3–5 (up to 6 with care) top-level sections | Both iOS and Material converge on **3–5 as the ideal number**; apps see users find bottom nav **21% faster** than top-menu navigation, contributing to a measured **17.86% Day 7 retention** improvement ([Sanjay Dey](https://www.sanjaydey.com/mobile-ux-ui-design-patterns-2026-data-backed/)) |
| **Navigation rail/drawer** | Complex IA, tablets, 6+ sections, or "More" overflow needs | Recommended once item count exceeds 5, or on larger screens |
| **Gesture navigation** | Supplemental, not primary, navigation | 2026 trend data: apps with **>6 core gestures lose users**; reducing one utility app from 14 gesture combinations to **6 core gestures** raised session-to-conversion from 38% to 55% in 90 days ([Wix Studio](https://backlinksindiit.wixstudio.com/app-development-expe/post/gesture-based-ui-design-2026)). Gesture nav should complement, not replace, a visible tab bar for primary navigation, since gestures are not discoverable |

Additional 2026 layout guidance: place **primary actions in the bottom 20% of the screen** (thumb "green zone"), secondary content in the middle 40%, and tertiary/rare actions in the top 40% ("red zone") — directly relevant to where a shutter button or session-start CTA should sit ([Sanjay Dey](https://www.sanjaydey.com/mobile-ux-ui-design-patterns-2026-data-backed/)). Touch targets should be minimum 44×44pt (iOS) / 48×48dp (Android) with 8pt/dp spacing; navigation response should feel instant (<100ms) and screen transitions 250–350ms.

### What Works Best for Pose/Camera Apps
- Given 4–6 main sections (e.g., Home/Today, Library/Poses, Camera/Session, Progress, Profile), a **bottom tab bar with 4–5 primary destinations** is the clear best practice — consistent with both HIG and M3 caps.
- The **camera/session entry point** should be the most thumb-accessible bottom-center position (mirroring Strava's centered "Record" button pattern — see Section 4) rather than buried in a tab.
- Avoid relying on swipe/gesture-only navigation for switching between Library and Camera modes; gestures should be reserved for **within-session** controls (e.g., swipe to change camera lens/filter during a shoot), consistent with the "gestures should be discoverable via a visible affordance first" principle.
- If a 6th destination is genuinely needed (e.g., Settings), consider folding it into a Profile tab rather than adding a 6th bottom-nav item, per Material's explicit "don't exceed 5" guidance.

---

## 3. Camera App UX Patterns

### Core Shooting Flow (Session Setup → Preview → Overlay Controls → Capture → Review)
Based on cross-referenced UX pattern documentation and professional camera app conventions ([UX Patterns Guide – Camera Capture](https://uxpatternsguide.com/patterns/camera-capture/)):

**1. Session setup / permission & pre-capture state**
- Camera stream should start **only after a deliberate user action**, never automatically on page load, route change, or modal open.
- Before requesting access, show what will happen: target subject, required quality, whether the task can be completed without camera access.
- Explicit states to design for: not requested → requesting → active → paused → denied → unsupported → stopped.

**2. Live preview**
- Show an **active-camera indicator**, the selected camera (front/rear), a **framing guide**, and real-time **quality feedback** (low light, glare, blur, occlusion, wrong orientation, missing subject).
- Always keep the stop control and selected-camera label visible — never hide them.
- Provide a camera-switch control when multiple cameras are available.

**3. Overlay controls**
- A well-formed capture surface includes: purpose text, permission state indicator, live preview, privacy indicator, framing guide, capture (shutter) button, shutter feedback, review preview, retake, crop/rotate, submit, cancel, and an upload/file fallback.
- All controls must be reachable by touch **and** keyboard/accessibility focus, with visible + programmatic labels (capture, retake, switch camera, stop, upload fallback, crop, rotate, cancel, submit).

**4. Capture**
- **Capture is not submission.** Pressing the shutter freezes a preview and moves to review — it should not auto-upload unless the task is explicitly low-risk/reversible.
- Immediate shutter feedback (visual/haptic) plus a frozen preview; surface quality warnings (blur, glare, wrong orientation) at this stage, not only after final submit.

**5. Review**
- Dedicated review state distinct from upload/submitted state, offering: retake, crop, rotate, replace, submit, cancel.
- For consequential outputs (e.g., a pose captured for form analysis), **require explicit review before final submission** — don't auto-advance.

**6. Cleanup**
- Camera tracks must be stopped and unsaved sensitive previews discarded on cancel, close, submit, route change, timeout, or permission revocation — this is a hard requirement, not optional polish.
- Avoid persisting raw images, EXIF, location metadata, or faces unless the user understands retention purpose.

### Reference Apps
- **Halide / ProCamera-style pro camera apps:** emphasize a minimal, uncluttered viewfinder with contextual overlay controls (histogram, level/grid, manual focus peaking) that appear only when relevant, keeping the core viewfinder clean — the general professional-camera-app principle is **progressive disclosure of advanced controls**, keeping the default view simple while power features are one tap away.
- **VSCO / Snapseed-style creative apps:** separate **capture mode** from **edit mode** as distinct, sequential flows — capture is fast and minimal; editing surfaces a rich but organized tool palette (filters, adjustments, crop) in a bottom sheet or horizontal scrollable tray, keeping the main image canvas uncluttered.
- **AI camera / pose-detection apps:** additional real-time overlay requirements beyond standard camera UX — skeletal/pose overlays, live rep counters, and form-correction cues layered on the live preview. Camera positioning matters materially: diagonal ~45° angle at 180–200cm distance yields the highest pose-detection accuracy, suggesting the app should guide users to this setup during session setup ([JMIR mHealth study](https://mhealth.jmir.org/2026/1/e82412)).

**Recommendation:** Structure the camera flow as: (1) contextual permission priming → (2) session setup screen with phone-positioning guidance (tripod/angle/distance) → (3) live preview with pose overlay and framing guide → (4) minimal always-visible shutter + secondary controls (camera flip, flash, timer) → (5) capture freezes to a review screen with retake/accept → (6) guaranteed stream cleanup on exit at every step.

---

## 4. Information Architecture for Content+Camera Apps (Browse/Do Duality)

### Headspace: Today (Do) vs. Explore (Browse)
Headspace deliberately **simplified from a 4-tab category-based nav to a 3-tab model** (Today, Explore, Profile) after user research showed the category-first approach was too complex ([Apple Developer – Behind the Design: Headspace](https://developer.apple.com/news/?id=fkfnhq8u)):
- **Today tab** = the "do" surface: one-tap access to activities of varying lengths for morning/afternoon/night, intentionally *without* surfacing categories — reduces decision fatigue for the primary action.
- **Explore tab** = the "browse" surface: the full content library, organized into understandable, purpose-labeled collections (e.g., "Unlocking Creativity," "Mindful Eating") rather than dry taxonomy labels.
- A later UX audit found that when Headspace collapsed from 4 tabs to 3, the **Explore tab absorbed disproportionate discovery pressure** — 66% of users who bounce off the Today/home tab go to Explore to find new content, and users struggled to distinguish content types (Course vs. Program vs. Collection), causing decision paralysis. The recommended fix path was a phased "needs-based IA": enhance labeling → add filtering by "modes" → eventually consider tab-based sub-navigation ([Sara Shahnoosh case study](https://www.sarashahnoosh.com/copy-of-headspace-revisitation)).
- Lesson: **collapsing browse and do into too few tabs can overload the browse surface** — filtering and clear content-type labeling become essential compensating patterns.

### Nike Training Club: Workouts (Browse) vs. Active Workout (Do)
- Content library (180+ workouts) is filterable by **muscle group, activity level, intensity, equipment, duration, and instructor** — a rich faceted-filter browse experience ([Sharon Lee, Medium](https://medium.com/@by.sharonlee/the-nike-training-club-app-d4d2b028ff26)).
- A distinct **discoverability affordance** (icon + label) separates "Programs" (multi-week structured plans) from individual "Workouts," using clear signifiers so users don't confuse the two content models ([IXD@Pratt critique](https://ixd.prattsi.org/2023/09/design-critique-nike-training-club-iphone-app/)).
- Before starting a session, NTC shows a **pre-workout preview list of every movement** to be performed, each with an expandable demo video — this "preview before you commit" pattern bridges browse and do without forcing a hard mode-switch.
- A separate **Activity tab** tracks completed workouts/history, keeping "browse," "do," and "review past activity" as three distinct but linked IA zones.

### Strava: Home (Social Feed/Browse) vs. Record (Do)
- Bottom navigation cleanly separates modes: **Home** = social feed (browse others' activity, a distinct "social media" conceptual model), **Record** = the doing surface (bottom-center, most thumb-accessible position — a common and intuitive placement pattern for primary action buttons), **You** = personal stats/self-reflection ([IXD@Pratt Strava critique](https://ixd.prattsi.org/2026/02/design-critique-strava-ios-app-3/); [IXD@Pratt earlier critique](https://ixd.prattsi.org/2023/01/design-critique-strava-for-iphone/)).
- The Record tab defaults to the last-used activity type but allows quick switching via a sport-type icon next to the start button, minimizing setup friction for a repeat "do" action ([Strava Help Center](https://support.strava.com/en-us/articles/15402137-recording-an-activity)).
- A noted IA weakness: "You" is reachable both via bottom nav and a redundant profile icon elsewhere, creating minor navigational ambiguity — a cautionary example to avoid duplicate paths to the same destination.

### Synthesis: Browse/Do Duality Pattern for a Camera+Pose App
1. **Separate "browse" (pose library) and "do" (camera session) as distinct top-level tabs**, not nested modes — matches Nike Training Club and Strava's clean separation.
2. **Make the "do" action the most thumb-accessible, bottom-center element** (Strava's Record button pattern) — for a pose/camera app this likely means a prominent camera/session tab or FAB-style entry point.
3. **Bridge the two with a lightweight preview step**: before entering a live camera session, show what will happen (which poses, what the camera will track) — mirroring NTC's pre-workout movement preview.
4. **Keep a "Today" or "Home" landing surface** that offers one-tap access into a session without forcing users through the full library first (Headspace's Today-tab pattern) — this reduces decision fatigue for returning/habitual users.
5. **Guard against Headspace's Explore-tab overload**: if the pose library is large, invest early in filtering, purpose-based collection labeling, and clear content-type distinctions (single pose vs. sequence vs. program) rather than relying on a flat, undifferentiated list.

---

## 5. Pose Library Information Architecture

### Yoga Journal Pose Library
- Organizes its **A–Z Pose Finder** with poses labeled by both common English name and Sanskrit name, cross-referenced into **category groupings** (e.g., "Forward Bend Yoga Poses," "Chest-Opening Yoga Poses") ([Yoga Journal Pose Finder](https://www.yogajournal.com/pose-finder/pose-finder/)).
- The dedicated **Pose Library** (50+ asanas, growing) pairs each entry with video tutorials, variations, and anatomical illustrations — combining a browsable index with rich per-item detail pages ([Yoga Journal Pose Library](https://www.yogajournal.com/poses/library/)).
- Independent research on yoga pose databases explicitly cites Yoga Journal's **category-based browsing** (organizing poses into type groups) as the best-in-class browsing approach, compared to freeform search alone ([VUT academic paper](https://excel.fit.vutbr.cz/submissions/2022/015/15.pdf)).

### Down Dog: Parametric/Generative Browsing + Like/Dislike Curation
- Rather than a static list, Down Dog generates practices from **60,000+ configurations** based on selectable parameters: practice type (Vinyasa, Hatha, Gentle, Restorative, Yin), duration, level, primary/secondary body-area "boost" (19 body areas), voice, and music ([Down Dog Google Play listing](https://play.google.com/store/apps/details?id=com.downdogapp)).
- Includes an explicit **pose-level curation system**: users can "like" poses (increasing future appearance probability) or "dislike" them (excluding permanently), accessible via a **searchable pose list** under Practice Settings → View Poses ([Down Dog FAQ](https://www.downdogapp.com/faq)).
- Practice-type selection itself is filterable/searchable via a dedicated selector with **group filters at the top and a search icon** — a strong pattern for large taxonomies where users know roughly what they want but need quick narrowing.

### Tummee (Yoga Teacher Platform) — Large-Scale Faceted Filtering
- Manages **7,500+ poses and variations** via **175+ smart pose filters** spanning yoga style, prop, muscle group, and more, plus AI-driven "smart pose suggestions" — demonstrates that at very large catalog scale, **multi-facet filtering plus algorithmic suggestion** becomes necessary, not optional ([Tummee Google Play listing](https://play.google.com/store/apps/details?id=com.tmevbx.tummeeYogaApp)).

### Exercise Database Apps (general fitness catalog pattern)
- Common faceted filters across fitness/exercise database APIs and apps: **body part, target muscle, equipment, difficulty/category, name search** — this is the standard schema for structuring a large movement library ([ExerciseDB API docs](https://edb-docs.up.railway.app/docs/exercise-service/intro); [BodyWorks docs](https://www.mintlify.com/Akshat-Jaiswal-8/body-works-next/features/exercises)).
- UX audit findings on workout-planner apps with large catalogs ([DesignerKaran UX assessment](https://www.designerkaran.com/2022/08/ux-assessment-of-workout-planner-mobile.html)):
  - **Persist scroll position** when users return to a list after viewing an item — don't force them to re-scroll from the top.
  - **Don't reset applied filters** automatically between sessions or navigations — users resent having to reapply filters repeatedly.
  - **Visually indicate already-selected/added items** in a list (e.g., an "Added" label) to prevent duplicate selection confusion.
  - **Group/categorize large lists** rather than presenting hundreds of flat items — grouping plus filter/sort controls is essential once a catalog exceeds roughly 30 items.

### Nike Training Club's Filter Model (cross-reference from Section 4)
Filterable by **muscle group, activity level, intensity, equipment, duration, instructor** — validates the same faceted-filter schema seen in dedicated exercise/pose databases, applied at the workout level rather than single-exercise level.

### Synthesis: Recommended Pose Library IA
1. **Primary organization: category/type-based browsing** (body area, pose family, or intensity), following Yoga Journal's proven category grouping — avoid a flat alphabetical-only list as the default view.
2. **Faceted filters** as a secondary discovery layer: difficulty level, body area/target, duration, equipment/props (if any), and pose family — mirroring the exercise-database and Tummee facet models.
3. **Search-first affordance** for users who already know what they want (pose name search), positioned prominently, not buried — consistent with Down Dog's dedicated search icon pattern.
4. **Personal curation layer**: allow users to like/save/exclude specific poses, which can double as a personalization signal for recommended sessions (Down Dog's like/dislike model).
5. **Preserve state**: remember scroll position and active filters when users navigate away from and back to the library (a specific, repeatedly-cited failure mode in UX audits).
6. **Rich per-pose detail pages**: pair each catalog entry with video/visual demonstration, variations, and (for a coaching-style app) key alignment/form cues — matching Yoga Journal's and Tummee's per-pose depth.
7. **At scale (100+ poses), invest in algorithmic/smart suggestions** in addition to manual filters, as Tummee's approach demonstrates for very large catalogs.

---

## Key Cross-Cutting Recommendations for the App

1. **Onboarding:** 3–4 screens, <60 seconds to first value, contextual camera-permission priming screen with benefit-led copy, defer account creation past the "aha moment," and teach gestures/features in-context rather than upfront.
2. **Navigation:** Bottom tab bar with 4–5 destinations max (e.g., Home, Library, Camera/Session, Progress, Profile); keep the camera/session entry in the most thumb-accessible bottom-center position; don't rely on gestures for primary navigation.
3. **Camera flow:** Explicit sequential states — permission priming → session setup (with phone positioning guidance) → live preview with pose overlay → capture/freeze → review with retake → guaranteed cleanup.
4. **IA duality:** Split "browse" (pose library) and "do" (camera session) into distinct top-level destinations, bridged by a lightweight pre-session preview; keep a low-friction "Today/Home" quick-start path for returning users.
5. **Pose library IA:** Category-based primary browsing + faceted filters (difficulty, body area, duration) + prominent search + personal like/save curation + persistent filter/scroll state, scaling to smart/algorithmic suggestions as the catalog grows.

---

## Sources
- [Apple HIG – Tab Bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Material Design 3 – Navigation Bar Guidelines](https://m3.material.io/components/navigation-bar/guidelines)
- [Material Design 3 – Navigation Rail](https://m3.material.io/components/navigation-rail/overview)
- [UX Patterns Guide – Camera Capture](https://uxpatternsguide.com/patterns/camera-capture/)
- [Dogtown Media – Mobile Permission Requests: Timing, Strategy & Compliance Guide](https://www.dogtownmedia.com/the-ask-when-and-how-to-request-mobile-app-permissions-camera-location-contacts/)
- [icons8 – Mobile UX Design: The Right Ways to Ask Users for Permissions](https://icons8.com/blog/articles/mobile-ux-design-user-permissions/)
- [Snoopr – How Long Should Mobile App Onboarding Be?](https://www.snoopr.co/blog/how-long-should-mobile-app-onboarding-be-screens-time-and-completion-data)
- [LowCode Agency – Mobile App Onboarding Best Practices in 2026](https://www.lowcode.agency/blog/mobile-onboarding-best-practices)
- [ApsteQ – App Onboarding Optimization: 2026 Guide](https://apsteq.com/blog/app-onboarding-optimization/)
- [Sozai – I Studied 1460 Onboarding Flows](https://sozai.app/transcript/studied-1460-onboarding-flows-findings/)
- [Glance Group – How Can I Check If My Onboarding Flow Is Too Long?](https://thisisglance.com/learning-centre/how-can-i-check-if-my-onboarding-flow-is-too-long)
- [Dots Mobile – Best Practices for Mobile App Onboarding](https://www.dots-mobile.com/blog-posts/mobile-app-onboarding-best-practices)
- [Web22 – Onboarding mobile app patterns](https://web22.dev/onboarding-mobile-app/)
- [Adapty – Mobile App Onboarding vs Tutorials](https://adapty.io/blog/mobile-app-onboarding-vs-tutorials/)
- [Sanjay Dey – 7 Mobile UX/UI Design Patterns Dominating 2026](https://www.sanjaydey.com/mobile-ux-ui-design-patterns-2026-data-backed/)
- [Wix Studio – Gesture-Based UI: Why the Old Rules Fail by 2026](https://backlinksindiit.wixstudio.com/app-development-expe/post/gesture-based-ui-design-2026)
- [Muzli – Mobile App Design Trends 2026](https://muz.li/blog/whats-changing-in-mobile-app-design-ui-patterns-that-matter-in-2026/)
- [Webcastle – Mobile UI Design Trends 2026: Micro-Interactions](https://webcastle.com/blog/mobile-ui-design-trends-2026-micro-interactions-and-engagement/)
- [RapidDev – How to Add Interactive User Tutorials to Your Mobile App](https://rapidevelopers.com/mobile-app-features/interactive-user-tutorials)
- [Dataconomy – Best UX/UI Design Practices For Fitness Apps In 2025](https://dataconomy.com/2025/11/11/best-ux-ui-practices-for-fitness-apps-retaining-and-re-engaging-users/)
- [Devpost – FitBuddy: AI Fitness Coach & Form Tracker](https://devpost.com/software/fitbuddy-ai-fitness-coach-form-tracker)
- [JMIR mHealth and uHealth – Evaluation of Smartphone Camera Positioning](https://mhealth.jmir.org/2026/1/e82412)
- [Apple Developer – Behind the Design: Headspace](https://developer.apple.com/news/?id=fkfnhq8u)
- [Sara Shahnoosh – Headspace Explore Tab Discoverability Case Study](https://www.sarashahnoosh.com/copy-of-headspace-revisitation)
- [Medium (Sharon Lee) – The Nike Training Club App](https://medium.com/@by.sharonlee/the-nike-training-club-app-d4d2b028ff26)
- [IXD@Pratt – Design Critique: Nike Training Club](https://ixd.prattsi.org/2023/09/design-critique-nike-training-club-iphone-app/)
- [IXD@Pratt – Design Critique: Strava (iOS App), 2026](https://ixd.prattsi.org/2026/02/design-critique-strava-ios-app-3/)
- [IXD@Pratt – Design Critique: Strava for iPhone, 2023](https://ixd.prattsi.org/2023/01/design-critique-strava-for-iphone/)
- [Strava Help Center – Recording an Activity](https://support.strava.com/en-us/articles/15402137-recording-an-activity)
- [Yoga Journal – A-Z Directory of Yoga Poses](https://www.yogajournal.com/pose-finder/pose-finder/)
- [Yoga Journal – Pose Library](https://www.yogajournal.com/poses/library/)
- [VUT FIT Excel@FIT – Web Tool for Creation, Management, and Use of a Database of Yoga Poses (PDF)](https://excel.fit.vutbr.cz/submissions/2022/015/15.pdf)
- [Down Dog – Google Play Listing](https://play.google.com/store/apps/details?id=com.downdogapp)
- [Down Dog – FAQ](https://www.downdogapp.com/faq)
- [Tummee – Google Play Listing](https://play.google.com/store/apps/details?id=com.tmevbx.tummeeYogaApp)
- [ExerciseDB API Docs](https://edb-docs.up.railway.app/docs/exercise-service/intro)
- [BodyWorks Exercise Database Docs](https://www.mintlify.com/Akshat-Jaiswal-8/body-works-next/features/exercises)
- [DesignerKaran – UX Assessment of a Workout Planner Mobile App](https://www.designerkaran.com/2022/08/ux-assessment-of-workout-planner-mobile.html)
