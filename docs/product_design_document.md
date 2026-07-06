# PoseArt — Product Design Document
**Version 1.0 — Phase 0 Deliverable**
*Compiled July 5, 2026 | Methodology: Stanford STORM + Loop Engineering + Spec-Driven Development*

---

## 1. Executive Summary

**PoseArt** is a mobile app (iOS + Android) that transforms any phone camera session into a personal pose-coaching and creative-direction experience. Users point their camera at themselves (or someone they are photographing), select from a rich library of categorized poses and actions, and receive real-time guidance from animated Art Nouveau–styled human sprite figures overlaid on the live camera feed. The app combines the best of active AI pose coaching (à la Posei), rich reference libraries (à la PoseMy.Art), and a visually distinctive, premium aesthetic that no current competitor offers.

**Core value proposition:** *The world's most beautiful, rigorously accurate, and genuinely accessible pose-coaching camera app.*

---

## 2. Problem Statement

### 2.1 What users struggle with today
- **Photographers and their subjects** don't know how to pose naturally; standard pose-library apps require the user to mentally translate a static reference image into real-time body positions — a high-friction, guesswork-heavy process.
- **Fitness, yoga, and dance learners** using AI coaching apps experience frustration from false-positive corrections, detection failures for non-majority body types, and rigid correctness thresholds.
- **Visual artists and content creators** lack a real-time animated figure reference they can position against live subjects.
- **Everyone** using camera-based pose apps experiences the "clinical sterility" problem: skeleton overlays and percentage scores are effective but feel cold, impersonal, and aesthetically jarring.

### 2.2 The market gap
Current pose apps fall into two camps:
1. **Passive libraries** — beautiful content, no real-time guidance (PoseMe, Photography Poses゜)
2. **Active AI coaches** — accurate feedback, cold/clinical UI (Posei, Posed AI)

No app exists that delivers **active real-time AI guidance** within a **premium, emotionally resonant aesthetic** while being **genuinely accessible** across body types, abilities, and use cases.

---

## 3. Improved Product Vision (Research-Enhanced)

Beyond the original brief, research identified these high-value enhancements:

| Enhancement | Origin | Value |
|---|---|---|
| **Adaptive Body Type System** | Sony AI bias research; accessible design best practices | Addresses documented CV fairness gap; no competitor offers this |
| **Mucha-style branded Art Nouveau sprite avatar** | Art Nouveau UI research + Pose Animator reference | Turns brand differentiation into a core product experience |
| **Session Choreography / Sequence Mode** | Photography "transitional pose sequence" research | Enables full photoshoot direction, not just one-off poses |
| **Effort Quality Tags** (Laban Movement Analysis) | Laban BESS framework research | Makes pose transitions a first-class feature (sustained/sudden, light/strong) |
| **Multi-modal feedback** (visual + audio + haptic) | Apple/Android/Meta haptics guidelines + accessibility research | Required for accessibility; also reduces cognitive load for all users |
| **Self-view avatar mode** | 3D avatar yoga instruction research | Reduces self-consciousness; especially valuable for body-image-sensitive contexts |
| **Custom Pose Studio** | Posei feature + artist community research | Enables power users and professional photographers to build custom libraries |
| **Community Pose Packs** | Market analysis of content-driven apps | Network effects; ongoing content without internal production overhead |

---

## 4. Core Features (MVP + V2)

### 4.1 MVP Features

**F1 — Pose Library**
- Curated library of 300+ poses organized via the Unified 5-Axis taxonomy (see Section 7)
- Each pose has: animated Lottie reference figure, static thumbnail, title, instruction text, difficulty level, body type notes
- Filterable by: Base Position, Camera Angle, Effort Quality, Functional Intent, Subject Count, Difficulty, Context/Genre

**F2 — Live Camera Overlay**
- Full-screen live camera preview (front or rear)
- Animated Mucha-style Art Nouveau sprite avatar rendered over camera feed showing target pose
- Toggleable overlay density: Ghost Silhouette / Skeleton Lines / Avatar / Off
- Real-time keypoint detection (Apple Vision / MediaPipe)
- Live alignment score (0–100%) with color-coded joint indicators

**F3 — Pose Guidance Feedback System**
- Per-joint natural-language corrective hints ("Raise your left arm," "Shift weight to your back leg")
- Multimodal feedback: visual (skeleton color coding) + audio (spoken cue) + haptic (vibration pattern)
- Hysteresis gating: hints only surface after an error persists ≥1.5 seconds (prevents false positives)
- Adjustable sensitivity: Strict / Balanced / Relaxed correctness thresholds

**F4 — Auto-Capture & Shot Timer**
- Auto-captures when alignment ≥ 85% sustained for 1.5 seconds + haptic confirmation
- Countdown timer mode: 3/5/10 second delay
- Burst-friendly: fires up to 5 shots per alignment-success event
- Manual shutter always available as override

**F5 — Post-Capture Editing**
- Non-destructive preset stack: Clean, Warm, Film, B&W, Faded, Moody (Art Nouveau inspired toning)
- Manual sliders: brightness, contrast, warmth, highlights, shadows, sharpen, vignette, skin smoothing
- "Light retouch only" philosophy — preserves authenticity

**F6 — Pose Categories (Initial Set)**
Full taxonomy documented in Section 7. MVP launches with:
- Standing (10 subcategories)
- Seated (8 subcategories)
- Leaning — Standing (6 subcategories)
- Leaning — Seated (5 subcategories)
- Dynamic / In-Motion (8 subcategories)
- Eccentric / Editorial (6 subcategories)
- Couple (8 subcategories)

**F7 — Accessibility Foundation**
- Audio-first mode: full voice guidance without visual dependency
- Seated/mobility-adapted variants for every pose
- Adjustable contrast (standard, high-contrast, dark)
- Font size scaling
- Screen reader compatible

### 4.2 V2 Features (Post-Launch)

**F8 — Session Choreography (Sequence Mode)**
- Build and execute multi-pose sequences (e.g., "Portrait Session: 8 poses × 3 shots each")
- Step-by-step guided flow: countdown → hold → capture → next pose
- Session summary with best shots per pose

**F9 — Self-View Avatar Mode**
- Replaces the user's live camera self-view with an animated Art Nouveau avatar that mirrors their detected skeleton in real time
- Reduces self-consciousness; especially valuable for body-image-sensitive users

**F10 — Custom Pose Studio**
- Import reference photos → auto-detect skeletal template → tag and save as custom pose
- Full manual skeleton editing with drag-to-adjust joints

**F11 — Community Pose Packs**
- Creator marketplace: photographers, yoga teachers, and artists publish pose packs
- User ratings, themed collections, seasonal/trend packs

**F12 — Adaptive Body Type Calibration**
- One-time calibration flow that adjusts keypoint detection thresholds and pose-suggestion weighting to the user's proportions and typical range of motion
- Explicitly designed to reduce AI fairness gaps (skin tone, body size, age, mobility)

**F13 — Video Pose Reference Mode**
- Short looping video demonstrations of dynamic/eccentric poses alongside camera view
- Side-by-side comparison: reference video left | live camera right

---

## 5. Technical Architecture

### 5.1 Platform Strategy
- **iOS**: Swift + SwiftUI, Apple Vision Framework (`VNDetectHumanBodyPoseRequest`, 19 joints), ARKit for optional 3D reference
- **Android**: Kotlin + Jetpack Compose, MediaPipe Pose Landmarker (BlazePose, 33 keypoints)
- **Shared Logic**: React Native or Flutter as cross-platform bridge for UI, or native per-platform with shared pose logic in a C++ module (NDK/JNI for Android, Swift Package for iOS)

### 5.2 Camera Pipeline Architecture (Non-negotiable)
```
Camera Feed (30fps)
    ↓
Frame Buffer (ring, keep-latest strategy — never queue)
    ↓
Background Inference Thread
    → Pose Landmarker (BlazePose / Apple Vision)
    → One-Euro Filter smoothing on 33/19 keypoints
    → Alignment Score computation
    → Per-joint error vector → NLG hint mapper
    ↓
Render Thread (decoupled, 60fps)
    → Live camera preview
    → Lottie sprite overlay (pre-authored, target pose)
    → Skeleton overlay (live, last-known keypoints)
    → Alignment score HUD
    → Art Nouveau decorative frame
```

### 5.3 Animation Architecture
- **Target pose reference**: Pre-authored Lottie JSON animations (sourced/commissioned from Vector Fitness Exercises library + custom Art Nouveau sprites)
- **Live skeleton overlay**: Real-time SVG/Canvas lines drawn from detected keypoints, smoothed via One-Euro filter
- **Mucha-style sprite avatar**: Custom-rigged SVG character (DragonBones-style skeleton) driven by detected keypoints for the self-view avatar mode; pre-baked Lottie for reference demonstrations
- **Easing**: All UI transitions use organic easing curves (cubic-bezier approximating nature's flows, not mechanical ease-in-out)

### 5.4 On-Device Processing Mandate
All inference runs on-device. No pose data, face data, or photos leave the phone unless the user explicitly shares them. This is both a technical (latency) and ethical (privacy) requirement.

### 5.5 Model Selection Strategy
| Device tier | Model | Rationale |
|---|---|---|
| High-end (iPhone 15+, Pixel 8+) | MediaPipe BlazePose Full / Apple Vision body pose | Maximum accuracy |
| Mid-range | MediaPipe BlazePose Lite | Fast enough for real-time, still 33 keypoints |
| Low-end | MoveNet Lightning INT8 | 2.9MB, handles 30fps on older devices |

Models delivered OTA via Firebase ML (not bundled in app binary) so users get the best model for their hardware.

---

## 6. Art Nouveau Design System

### 6.1 Brand Identity
**App name:** PoseArt
**Tagline:** *Move like art.*
**Personality:** Elegant, knowledgeable, warm, inclusive — like a brilliant Parisian art director who is also your most patient coach.

### 6.2 Color System

**Primary palette — "Peacock Fresco"**
| Role | Color | Hex |
|---|---|---|
| Deep background / primary text | Deep Teal | `#0F3B3A` |
| Brand accent / CTAs / active state | Emerald Teal | `#1E7A74` |
| Secondary accent / links | Cobalt Blue | `#2B5FAD` |
| Gold highlight / premium elements | Antique Gold | `#C9A24C` |
| Surface / background base | Parchment | `#F6F0E1` |

**Semantic colors**
| Purpose | Color |
|---|---|
| Alignment correct / success | `#4CAF7D` (soft botanical green) |
| Partial alignment / in-progress | `#C9A24C` (antique gold) |
| Alignment error / needs correction | `#C96A4C` (terracotta) |
| Camera overlay skeleton | `#FFFFFF` at 70% opacity |
| Ghost silhouette | `#F6F0E1` at 40% opacity |

### 6.3 Typography
**Display / Headers:** Cormorant Garant (Google Fonts, free) — high-contrast serif with calligraphic qualities; Art Nouveau feel at large sizes
**Body / Instructions / Labels:** Inter — clean, accessible, works at small sizes on camera UI
**Accent / App name:** Custom lettermark or Cinzel Decorative (Google Fonts) for the PoseArt wordmark only

**Type scale:**
- Display: 32px / Cormorant Garant Bold
- H1: 24px / Cormorant Garant SemiBold
- H2: 20px / Cormorant Garant Regular
- Body: 16px / Inter Regular
- Label / Hint: 14px / Inter Medium
- Caption: 12px / Inter Regular

### 6.4 Decorative System
- **Borders & frames**: Whiplash curve SVG motifs drawn as thin strokes (`#C9A24C` at 60% opacity) framing key UI containers — camera viewfinder, pose cards, section headers
- **Background texture**: Subtle parchment grain texture (SVG noise pattern) on non-camera surfaces
- **Dividers**: Vine-and-leaf SVG dividers between content sections (not solid lines)
- **Iconography**: Custom icon set with organic, slightly hand-drawn character; line weight 1.5–2px, rounded caps
- **Loading / transition states**: Animated whiplash curve unfurling (Lottie) — no generic spinners

### 6.5 Motion Design Principles
- **Easing**: `cubic-bezier(0.4, 0.0, 0.2, 1)` for enter; `cubic-bezier(0.8, 0.0, 0.4, 0.8)` for exit — organic, never snappy or mechanical
- **Duration scale**: micro (100ms), standard (250ms), elaborate (500ms)
- **Overlay animations**: Pose sprite breathes subtly when idle (gentle 2s scale pulse, amplitude 1.02x)
- **Success animation**: Golden particle bloom from camera center on auto-capture
- **No jarring cuts**: every transition cross-fades or slides with Art Nouveau curve easing

### 6.6 The Mucha Avatar System
Inspired by Alphonse Mucha's poster figures — the app's pose sprites are designed as:
- **Silhouette style**: flowing-hair female figure for default; alternate male/neutral/abstract figure variants selectable
- **Line quality**: organic, tapered strokes mimicking lithograph character
- **Decorative halo/frame**: each avatar carries a subtle ornamental halo motif (Mucha-signature) that indicates alignment score (full halo = aligned, fragmenting halo = adjust)
- **Palette integration**: avatar strokes in `#0F3B3A` with `#C9A24C` gold accent on the active/correct state

---

## 7. Pose Category System (Unified 5-Axis Taxonomy)

### 7.1 Primary Categories (Axis 1 — Base Position)

| Category ID | Name | Description | Subcategories |
|---|---|---|---|
| `S` | Standing | Upright, weight primarily on feet | S1 Classic Stand, S2 S-Curve Stand, S3 Power Stance, S4 Casual Lean (vertical), S5 One-Leg Balance, S6 Hip Shift, S7 Arms Crossed, S8 Hands on Hips, S9 Walking Step, S10 Heroic/Editorial |
| `SE` | Seated | Weight on seat surface | SE1 Soft Sit (edge-forward), SE2 Cross-Legged, SE3 Side Sit, SE4 Straddle, SE5 Chair Back Lean, SE6 Floor Sit, SE7 Knees-to-Chest, SE8 Seated S-Curve |
| `LS` | Leaning — Standing | Standing with body weight transferred to surface | LS1 Wall Lean (side), LS2 Wall Lean (back), LS3 Counter/Surface Lean, LS4 Doorframe Lean, LS5 Railing Lean, LS6 Cross-Arm Wall |
| `LSe` | Leaning — Seated | Seated with forward/lateral lean | LSe1 Elbow Prop, LSe2 Chin Rest, LSe3 Table Lean, LSe4 Knees Lean, LSe5 Floor Elbow Lean |
| `K` | Kneeling | One or both knees on surface | K1 Knight's Kneel, K2 Two-Knee Sit, K3 Kneeling Reach, K4 Child's Pose |
| `R` | Reclining / Lying | Primary weight on horizontal surface | R1 Side Lie, R2 Back Lie, R3 Prone Lie, R4 Elbow Prop Recline, R5 Over-Shoulder Look |
| `D` | Dynamic | Body in motion or transitioning | D1 Walk Step, D2 Turn/Spin, D3 Jump, D4 Reach-and-Stretch, D5 Dance Step, D6 Martial Stance, D7 Yoga Flow, D8 Sport Action |
| `E` | Eccentric / Editorial | Unconventional, creative, or high-concept | E1 Contortion, E2 Abstract Shape, E3 Environmental Interaction, E4 Humor/Character, E5 High Fashion, E6 Fine Art Reference |
| `C` | Couple / Multi-Person | Two or more subjects | C1 Side by Side, C2 Embrace, C3 Lead/Follow, C4 The Dip, C5 Back-to-Back, C6 Forehead Touch, C7 Walk Together, C8 Playful/Action |
| `A` | Accessible Variants | Adapted versions of any category | A1 Wheelchair Standing-Height, A2 Chair Substitute, A3 Limited Range-of-Motion, A4 Seated Only, A5 Upper Body Only |

### 7.2 Axis 2 — Camera/Viewer Angle
`F` Front | `3Q` Three-Quarter | `P` Profile | `B` Back | `OS` Over-Shoulder | `HA` High Angle | `LA` Low Angle

### 7.3 Axis 3 — Effort Quality (Laban)
`ST` Static Hold | `SU-F` Sudden-Free | `SU-B` Sudden-Bound | `SUS-L` Sustained-Light | `SUS-S` Sustained-Strong

### 7.4 Axis 4 — Functional Intent
`PH` Photography/Aesthetic | `YO` Yoga/Wellness | `FI` Fitness | `DA` Dance | `MA` Martial Arts | `AR` Art Reference | `PT` Physical Therapy

### 7.5 Axis 5 — Subject Count
`S1` Solo | `S2` Couple | `S3+` Group

**Example pose tag:** `S2 · 3Q · SUS-L · PH · S1` = "Standing S-Curve, Three-Quarter view, Sustained-Light movement quality, Photography intent, Solo"

---

## 8. User Personas

### Persona 1: The Self-Photographer (Primary)
**Name:** Valentina, 28, Lima
**Goal:** Take better solo photos for Instagram and portfolio without needing a human photographer present
**Frustration:** "I always forget what to do with my hands. I set up my phone and then I just... stand there."
**Key features needed:** Quick pose browsing, camera overlay, auto-capture, natural language hints

### Persona 2: The Portrait Photographer (Secondary)
**Name:** Diego, 35, Lima
**Goal:** Direct subjects during portrait sessions without awkward verbal instructions
**Frustration:** "I know what pose I want but I can't always explain it. I need to show them."
**Key features needed:** Pose library, show-to-subject mode (reference overlay), sequence mode, custom poses

### Persona 3: The Wellness Practitioner (Secondary)
**Name:** Ana, 42, Lima
**Goal:** Practice yoga and movement with correct form when she can't attend a class
**Frustration:** "I can't tell if I'm actually doing it right."
**Key features needed:** Alignment scoring, per-joint feedback, accessible variants, audio mode

### Persona 4: The Visual Artist (Tertiary)
**Name:** Marco, 24, Lima
**Goal:** Use the app as a live figure reference for drawing and illustration
**Frustration:** "Pose apps are either too simple or require me to learn 3D software."
**Key features needed:** Rich pose library, fine-grained body-part browsing, static hold/timer mode, export reference frame

---

## 9. Business Model

### 9.1 Freemium Structure
| Tier | Price | What's included |
|---|---|---|
| **Free** | $0 | 30 curated poses, camera overlay, basic skeleton feedback, 5 post-capture presets |
| **PoseArt Pro** | $4.99/month or $29.99/year | Full 300+ pose library, all categories, alignment scoring, per-joint hints, auto-capture, audio mode, custom pose studio, 4K export, no watermark |
| **Creator Pack** | Add-on $2.99 | Community pose packs (new monthly), commercial-use export license |

### 9.2 Monetization Principles
- Free tier must be genuinely useful, not crippled
- No ads ever — incompatible with premium aesthetic
- Annual subscription priced at 5×monthly = encourages annual commitment

---

## 10. Success Metrics (Phase 0 → Launch)

| Metric | Target (30-day post-launch) |
|---|---|
| Day-7 retention | ≥ 40% |
| Pro conversion rate | ≥ 8% |
| Avg session length | ≥ 3.5 minutes |
| Auto-capture success rate | ≥ 70% of sessions |
| Accessibility mode adoption | ≥ 10% of users |
| App Store rating | ≥ 4.6 |
| Crash-free rate | ≥ 99.5% |
| Pose detection accuracy (all skin tones/body types tested) | ≥ 85% on FACET benchmark |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Pose detection inaccuracy for non-majority body types | High | High | Mandatory FACET/FHIBE benchmark testing pre-launch; Adaptive calibration (F12); forgiving thresholds default |
| Camera performance issues on low-end Android devices | Medium | High | Model tiering (MoveNet Lightning INT8 for low-end); aggressive frame-dropping; benchmark gate before ship |
| Art Nouveau aesthetic feels too niche / off-putting | Low | Medium | User testing with 3 aesthetic variants; ornate = optional intensity via settings |
| App Store rejection (camera + body detection) | Low | High | Privacy manifest, on-device-only pledge, no biometric data storage; clear App Privacy Nutrition Label |
| Content volume (300+ poses) production cost | High | Medium | License Lottie library content (Vector Fitness Exercises); commission custom Mucha sprites for key "hero" poses only (30); fill rest with rigged template |

---

## 12. Phase 0 Retrospection

### What insights from expert prompting techniques helped improve this phase?
1. **STORM multi-perspective decomposition**: Splitting research into "market/tech" and "pose science/accessibility" sub-agents surfaced the accessibility fairness gap (Sony AI research) that would never have appeared in a single-lens research pass.
2. **Loop Engineering's verifier sub-agent principle**: Each research direction was verified independently before synthesis, catching conflicting signals (e.g., "more visual complexity is not always better" — the Virginia Tech yoga instructor study contradicts the instinct to pile on overlays).
3. **Spec-Driven Development**: Structuring the PDD as Spec → Key Decisions → Testable Conditions means Phase 1 has concrete, citable inputs rather than vague direction.

### Which additional features significantly enhance the product?
In priority order:
1. **Adaptive Body Type Calibration** — solves a documented real-world problem no competitor addresses
2. **Mucha Avatar System** — turns aesthetic into a core functional differentiator (the halo-as-alignment-score concept)
3. **Effort Quality Tags (Laban)** — the only pose app with this level of movement-quality vocabulary
4. **Session Choreography** — transforms the app from a "one pose at a time" tool into a full shoot-direction platform
5. **Audio-First Mode** — accessibility requirement that also benefits all users in eyes-free contexts

---

*End of Phase 0 — Product Design Document*
*Next: Phase 1 — User Flows, Navigation & Information Architecture*
