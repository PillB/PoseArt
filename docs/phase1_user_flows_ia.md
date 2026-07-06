# PoseArt — Phase 1: User Flows, Navigation & Information Architecture
**Version 1.0 — Phase 1 Deliverable**
*Compiled July 5, 2026*

---

## 1. Information Architecture Overview

### 1.1 App Sitemap

```
PoseArt
├── ONBOARDING (first-launch only)
│   ├── OB-1: Welcome / Hook
│   ├── OB-2: Feature Preview (camera overlay demo)
│   ├── OB-3: Camera Permission Priming
│   └── OB-4: Quick Personalization (3 taps)
│
├── HOME TAB (Today)
│   ├── Quick-Start Card (last pose / recommended session)
│   ├── Featured Collections (curated 3–5 packs)
│   ├── Trending Poses
│   ├── Daily Challenge
│   └── Recent History (last 3 sessions)
│
├── LIBRARY TAB (Poses)
│   ├── Search Bar (top)
│   ├── Filter Sheet (Base Position, Angle, Effort, Intent, Count, Difficulty)
│   ├── Category Grid (10 primary categories)
│   │   ├── [Category] → Subcategory List
│   │   │   └── [Subcategory] → Pose Detail Page
│   │   │       ├── Lottie Animation (reference)
│   │   │       ├── Instructions Text
│   │   │       ├── Tips & Common Mistakes
│   │   │       ├── Variations (easier / harder / accessible)
│   │   │       ├── Axis Tags (angle, effort, intent)
│   │   │       ├── Save to Favorites ♥
│   │   │       ├── Add to Sequence +
│   │   │       └── [ Start Pose Session → Camera ]
│   ├── Collections View
│   │   ├── Beginner Starter Pack
│   │   ├── Portrait Session
│   │   ├── Self-Timer Solo
│   │   ├── Couple Photoshoot
│   │   ├── Yoga Flow
│   │   └── [Community Packs - V2]
│   └── Favorites / Saved Poses
│
├── CAMERA TAB (Session) ← CENTER, PRIMARY
│   ├── Session Setup Screen
│   │   ├── Quick Start (last pose)
│   │   ├── Choose Pose (→ Library)
│   │   ├── Choose Sequence (→ Sequences)
│   │   ├── Camera Positioning Guide
│   │   └── Settings (timer, feedback mode, overlay type)
│   ├── Live Camera Screen
│   │   ├── Camera Feed (full screen)
│   │   ├── Pose Sprite Overlay (Mucha avatar)
│   │   ├── Skeleton Overlay (live keypoints)
│   │   ├── Alignment Score HUD
│   │   ├── Per-Joint Hint Banner
│   │   ├── Shutter Button (bottom center)
│   │   ├── Timer Toggle (bottom left)
│   │   ├── Overlay Controls (bottom right: Avatar/Skeleton/Ghost/Off)
│   │   ├── Pose Swap (swipe up → mini-library sheet)
│   │   └── End Session (top-left × or swipe down)
│   └── Capture Review Screen
│       ├── Captured Image Preview
│       ├── Alignment Score Summary
│       ├── Edit / Presets Strip
│       ├── Retake Button
│       ├── Save to Camera Roll
│       └── Share
│
├── SEQUENCES TAB (V2 → MVP: accessible from Library)
│   ├── My Sequences
│   │   └── Sequence Builder
│   │       ├── Add Poses (→ Library)
│   │       ├── Set Duration per Pose
│   │       ├── Reorder
│   │       └── Preview & Start
│   └── Template Sequences
│       ├── 5-Pose Portrait Session
│       ├── 8-Pose Photoshoot Director
│       └── Yoga Flow Sequence
│
├── PROGRESS TAB (Me)
│   ├── Session History (timeline)
│   ├── Best Shots Gallery
│   ├── Pose Streak / Stats
│   ├── Pose Mastery Grid (how many poses tried)
│   └── Settings
│       ├── Feedback Mode (Visual / Audio / Haptic / All)
│       ├── Sensitivity (Strict / Balanced / Relaxed)
│       ├── Overlay Default (Avatar / Skeleton / Ghost / Off)
│       ├── Avatar Style (Female / Male / Neutral / Abstract)
│       ├── Accessibility (font size, high contrast, audio-first)
│       ├── Subscription / PoseArt Pro
│       └── About / Privacy
│
└── MODALS / SHEETS (non-tab)
    ├── Pose Detail Sheet (from any surface)
    ├── Filter Sheet
    ├── Session Settings Sheet
    ├── Post-Capture Edit Sheet
    ├── Onboarding Tooltip Overlays (in-context)
    └── Upgrade to Pro Sheet
```

---

## 2. Navigation Structure

### 2.1 Bottom Tab Bar (4 primary + 1 centered action)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              APP CONTENT AREA                   │
│                                                 │
├─────┬──────┬────────────┬────────┬──────────────┤
│ 🏠  │  📚  │    [●]     │  📈   │    👤        │
│Home │Poses │  Session   │Progress│   Profile    │
│     │      │  (Camera)  │        │              │
└─────┴──────┴────────────┴────────┴──────────────┘
```

- **Home**: Today feed, quick-start, featured collections
- **Poses (Library)**: Full pose catalog, search, filter, collections, favorites
- **Session (Camera)** — CENTER, prominent, pill/FAB style: launches the camera workflow
- **Progress**: History, stats, mastery, streaks
- **Profile**: Settings, accessibility, subscription, about

Design notes:
- Session tab uses a distinct pill/capsule shape (Art Nouveau ornamental button) to differentiate it visually as an action vs. navigation
- Floating "Liquid Glass" style per iOS 2025 HIG
- Active state: filled icon + label, antique gold `#C9A24C` underline
- On Android: Material 3 Navigation Bar; same 5 items

---

## 3. User Flows (Detailed)

### Flow 1: First Launch & Onboarding

```
APP INSTALL
    ↓
OB-1: Welcome Screen
    • Headline: "Move like art."
    • Subhead: "Real-time pose coaching through your camera."
    • Full-screen Mucha avatar animation (Lottie, looping)
    • CTA: "Get Started" → OB-2
    • Skip link (top right): → OB-4 (jump to personalization)
    ↓
OB-2: Feature Preview
    • 3-frame illustration carousel (swipeable):
      Frame A: "Choose a pose" — browse card
      Frame B: "See it overlaid on your camera" — overlay mock
      Frame C: "Get real-time coaching" — alignment score mock
    • Progress dots (3)
    • CTA: "Next" → OB-3
    ↓
OB-3: Camera Permission Priming
    • Illustration: camera icon with Mucha vine frame
    • Headline: "See your form in real time"
    • Body: "PoseArt uses your camera to overlay pose guides and
              coach your alignment — all on-device, never uploaded."
    • Privacy badge: "🔒 Never leaves your phone"
    • CTA: "Allow Camera Access" → [Native iOS/Android Permission Dialog]
        IF Granted → OB-4
        IF Denied → Permission Fallback Screen
            • "You can still browse poses without camera access."
            • "Enable camera later in Settings → PoseArt → Camera"
            • CTA: "Continue without camera" → OB-4
    ↓
OB-4: Quick Personalization (3 taps)
    • "What brings you to PoseArt?" (select one):
        📸 Photography / Content Creation
        🧘 Yoga / Wellness
        💪 Fitness & Movement
        🎨 Art & Figure Reference
    • "How would you describe your experience?"
        New to posing / Intermediate / Experienced
    • CTA: "Start Exploring" → HOME TAB
    ↓
HOME TAB (first visit)
    • In-context tooltip on Session tab: "Tap here to start your first pose session"
    • Coach mark on Library: "Browse 300+ poses here"
    • Tooltips auto-dismiss after 4 seconds or first tap
```

**Testable Conditions:**
1. Onboarding completes in ≤4 screens and ≤60 seconds on a standard device
2. Camera permission denial does not block app progress — user reaches Home tab
3. Personalization selections are stored and influence Home feed recommendations

---

### Flow 2: Browse & Start a Pose Session (Core Happy Path)

```
HOME TAB
    ↓
User taps pose card / "Explore Poses" / LIBRARY TAB
    ↓
LIBRARY — Category Grid
    • 10 category cards in 2-column grid
    • Each card: Mucha-styled thumbnail, category name, pose count badge
    User taps "Standing" category
    ↓
SUBCATEGORY LIST
    • Horizontal filter chips: All / Classic / S-Curve / Power / Editorial...
    • Vertical list of pose cards
    User taps "S-Curve Stand" pose card
    ↓
POSE DETAIL SHEET (bottom sheet, 75% height)
    • Lottie animation playing (looping reference figure)
    • Pose name + axis tags
    • "How to" instruction text (expandable)
    • Tip / common mistake callout
    • Accessible variant toggle
    • ♥ Save   + Add to Sequence   ▷ Start Session
    User taps "▷ Start Session"
    ↓
SESSION SETUP SCREEN
    • Selected pose displayed (mini animation)
    • "Position your camera" guide:
        [ Diagram: phone ~45° angle, 180–200cm distance, portrait mode ]
    • Session options:
        Timer: Off / 3s / 5s / 10s
        Feedback mode: Visual + Haptic (default) / Audio / All / Visual only
        Overlay: Avatar (default) / Skeleton / Ghost / Off
        Sensitivity: Balanced (default) / Strict / Relaxed
    • CTA: "Begin Session →"
    ↓
LIVE CAMERA SCREEN
    • Camera feed (full screen)
    • Top bar: Pose name (left) | Alignment score % (right) | End session ×
    • Overlay layer: Mucha avatar in target pose
    • Real-time skeleton dots/lines on user
    • Hint banner (bottom of screen, above shutter): "Raise your left arm"
        (appears only after joint error persists ≥1.5s; auto-dismisses)
    • Bottom controls row:
        [Timer 🕐] [Camera flip 🔄] [SHUTTER ●] [Overlay toggle ☰] [Flash ⚡]
    • On alignment ≥85% sustained 1.5s:
        → Haptic pulse × 2
        → Golden particle bloom animation
        → Auto-capture fires
    User taps SHUTTER manually (any time)
    ↓
CAPTURE REVIEW SCREEN
    • Captured image full-screen (portrait)
    • Overlay strip: Alignment score badge | Pose name
    • Bottom actions:
        [← Retake] [Edit ✏] [Save ↓] [Share →]
    • Edit tap → Post-Capture Edit Sheet
        - Preset strip: Clean / Warm / Film / B&W / Faded / Moody
        - Advanced sliders (expandable): brightness, contrast, warmth,
          highlights, shadows, sharpen, vignette, skin smoothing
        - [Apply] [Cancel]
    User taps "Save ↓"
    ↓
SAVE CONFIRMATION
    • "Saved to your camera roll" toast (2s)
    • Option: "Next pose →" | "End session"
    User taps "Next pose →"
    ↓
Returns to LIVE CAMERA SCREEN with pose mini-carousel at top
    (swipe to select next pose without leaving camera)
```

**Testable Conditions:**
1. Full flow from Library tap to first live camera frame renders in ≤3 seconds on mid-range device
2. Auto-capture fires correctly when alignment score ≥85% for ≥1.5 seconds (verified in ≥10 test scenarios)
3. Captured image is saved to device camera roll and appears in Progress tab session history

---

### Flow 3: Quick Start from Home Tab (Returning User)

```
HOME TAB
    ↓
"Continue where you left off" card (last pose / session)
    OR
"Daily Challenge" card (one recommended pose)
    User taps Quick-Start card
    ↓
SESSION SETUP SCREEN (abbreviated — remembers last settings)
    • Selected pose + "Change pose" link
    • Settings summary (one-line): "Visual + Haptic · Balanced · Avatar"
    • CTA: "Begin Session →"
    ↓
LIVE CAMERA SCREEN (same as Flow 2)
```

**Testable Conditions:**
1. Returning user reaches Live Camera in ≤2 taps from Home tab
2. Last-used session settings are correctly persisted across app restarts
3. Daily Challenge pose rotates every 24 hours

---

### Flow 4: Sequence Mode (V2, documented for planning)

```
SEQUENCES TAB (or Library → "+" → Add to Sequence)
    ↓
SEQUENCE BUILDER
    • Pose list (drag-to-reorder)
    • Per-pose: duration (10s–120s), shots per pose (1–5)
    • Add Poses → mini Library picker sheet
    • Preview: total time estimate, pose count
    • Name sequence: "Sunday Portrait Session"
    • CTA: "Start Sequence"
    ↓
SEQUENCE SESSION FLOW
    Loop per pose:
        SESSION SETUP (skip settings if same as previous)
        → LIVE CAMERA SCREEN
            • Progress indicator: "Pose 2 of 8"
            • Countdown timer for this pose
        → On completion (timer end OR auto-capture limit reached):
            • Transition animation: next pose slides in (Mucha avatar animates transition)
            • Brief inter-pose pause (3s with next pose preview)
        → NEXT POSE
    End of sequence:
        SEQUENCE SUMMARY SCREEN
            • Grid of best shots (1 per pose)
            • Total shots, avg alignment score
            • Save all / Select favorites
```

**Testable Conditions:**
1. Sequence transitions complete within 3 seconds including next pose overlay loading
2. User can exit a sequence at any pose and save partial results
3. Sequence summary shows correct per-pose best-shot selection

---

### Flow 5: Accessibility / Audio-First Mode

```
SETTINGS → Accessibility → Audio-First Mode ON
    ↓
LIVE CAMERA SCREEN (Audio-First)
    • Overlay still renders (but screen can be faced away/down)
    • Visual alignment score replaced by spoken score: "Alignment: 72%"
    • Per-joint hints spoken aloud: "Raise your left arm"
    • Score updates announced every 3 seconds (not every frame — prevents sensory overload)
    • Auto-capture: confirmed by double haptic buzz + spoken "Captured!"
    • Controls: large touch targets (72dp minimum), labeled with accessibility descriptions
    • Voice commands (V2): "capture," "next pose," "end session"
```

**Testable Conditions:**
1. Audio-First mode provides complete session guidance without requiring visual attention
2. VoiceOver (iOS) / TalkBack (Android) can navigate all interactive elements
3. All touch targets ≥ 48dp (Android) / ≥ 44pt (iOS) in accessible mode

---

### Flow 6: Onboarding Edge Cases

```
Permission Denied — Camera
    → "You can still browse our full pose library and save favorites."
    → Settings deep-link button: "Open Settings to Enable Camera"
    → App functions as a pose reference app without camera features

Permission Denied — Microphone (when Audio mode toggled)
    → Inline warning: "Microphone access needed for spoken coaching."
    → Settings deep-link; Visual + Haptic mode offered as fallback
    → Does not block other app functions

Low-light / Poor Visibility Warning
    → Inline banner on Live Camera Screen: "Low light detected — alignment accuracy may be reduced"
    → Suggested action: "Increase room lighting or switch to rear camera"
    → User can dismiss and continue

No Person Detected
    → Inline banner: "Can't see you yet — ensure your full body is visible"
    → After 10 seconds of no detection: overlay dims, hint text: "Position phone further away"

Low-end Device — Model Auto-Downgrade
    → Silent: app uses MoveNet Lightning INT8 instead of BlazePose Full
    → If performance still <15fps: skeleton overlay disabled, ghost silhouette only
    → Settings: "Performance mode: Efficient" (visible but not alarming)
```

---

## 4. Screen Inventory (MVP)

| Screen ID | Screen Name | Tab | Type |
|---|---|---|---|
| OB-1 | Welcome | Onboarding | Full screen |
| OB-2 | Feature Preview | Onboarding | Full screen carousel |
| OB-3 | Camera Permission Priming | Onboarding | Full screen |
| OB-4 | Quick Personalization | Onboarding | Full screen |
| H-1 | Home / Today | Home | Scroll view |
| L-1 | Library — Category Grid | Library | Grid |
| L-2 | Library — Subcategory List | Library | List |
| L-3 | Pose Detail Sheet | Library | Bottom sheet |
| L-4 | Search Results | Library | List |
| L-5 | Collection Detail | Library | Scroll view |
| L-6 | Favorites | Library | Grid |
| C-1 | Session Setup | Camera | Screen |
| C-2 | Live Camera | Camera | Full screen |
| C-3 | Capture Review | Camera | Full screen |
| C-4 | Post-Capture Edit Sheet | Camera | Bottom sheet |
| P-1 | Progress / History | Progress | Scroll view |
| P-2 | Best Shots Gallery | Progress | Grid |
| P-3 | Session Detail | Progress | Scroll view |
| PR-1 | Profile / Settings | Profile | Scroll view |
| PR-2 | Accessibility Settings | Profile | Scroll view |
| PR-3 | Subscription / Pro | Profile | Screen |
| M-1 | Filter Sheet | Modal | Bottom sheet |
| M-2 | Session Settings Sheet | Modal | Bottom sheet |
| M-3 | Upgrade to Pro Sheet | Modal | Bottom sheet |

**Total MVP screens: 23**

---

## 5. Navigation Diagram (Key Transitions)

```
┌──────────────────────────────────────────────────────────────────┐
│  BOTTOM TAB BAR                                                  │
│  [Home] ──────── [Library] ──── [SESSION] ──── [Progress] ──── [Profile] │
└────┬──────────────────┬──────────────┬──────────────┬──────────────┘
     │                  │              │              │
    H-1              L-1/L-2         C-2            P-1
     │                  │              ↑              │
     │              L-3 (Sheet)    C-1 (Setup)      P-2
     │                  │              ↑              │
     │              "Start →"      L-3 "Start →"   P-3
     │                  └──────────────┘
     │
 "Quick Start" card
     └──────────────→ C-1 (abbreviated) → C-2
```

**Key cross-tab transitions:**
- **L-3 → C-1**: "Start Session" button on any Pose Detail sheet initiates camera flow with that pose preloaded
- **H-1 → C-1**: Quick-start card on Home tab launches camera with last/recommended pose
- **C-2 → L-3**: Swipe-up on camera screen opens mini pose-picker sheet without leaving camera
- **C-3 → P-1**: After saving, session is added to Progress history
- **P-3 → L-3**: Tap any past shot in session history to view its pose detail

---

## 6. Friction Point Analysis & Mitigations

| Friction Point | Risk | Mitigation |
|---|---|---|
| Camera permission denial on iOS (one-shot native dialog) | High — permanently blocks core feature if user denies | Custom priming screen with strong benefit copy before native dialog; graceful degradation to browse-only mode; clear Settings deep-link |
| Decision paralysis in large pose library | Medium — 300+ poses is overwhelming | Category-first browsing (not flat list); Home tab curated selections; 3-tap personalization feeds smart recommendations |
| Camera positioning learning curve | Medium — wrong angle/distance = poor detection accuracy | Session Setup shows explicit phone-positioning diagram; first-session coach mark on C-2 |
| Alignment score frustration (too strict) | High — documented pain point in AI fitness apps | "Balanced" as default sensitivity; hysteresis gate (errors only after 1.5s persist); hints feel encouraging not punitive |
| Overlay density confusion (which mode to use) | Low-Medium | Overlay type defaults to "Avatar" (most visually intuitive); one-tap toggle cycle on camera screen; brief label appears on first toggle |
| Low-end device performance | Medium | Automatic model downgrade; graceful fallback to ghost-overlay-only mode; no crash or blank screen |
| Post-capture flow friction | Low | Capture → Review is always explicit; no auto-upload; retake is always one tap away |

---

## 7. Phase 1 Retrospection

### What prompting techniques from research helped create better flows?
1. **STORM multi-perspective approach** surfaced the friction analysis table: considering user flows from the UX researcher's perspective (Headspace case study), the engineer's perspective (camera state machine), and the accessibility specialist's perspective led to flows that were not just happy-path complete but edge-case robust.
2. **Chain-of-Thought decomposition** applied to the browse/do duality: stepping through how Headspace, Nike Training Club, and Strava each solved this problem — then synthesizing the best principles — produced a more principled tab structure than instinct alone would have.
3. **Spec-Driven structure**: documenting flows with testable conditions at the end of each ensures Phase 4 (implementation) and Phase 5 (testing) have concrete acceptance criteria to code and test against.

### Are there any friction points that need improvement?
1. **Sequence mode UX (V2)** — the inter-pose transition (Mucha avatar animating between poses) needs visual design work in Phase 2 to feel seamless rather than abrupt; this is a known risk.
2. **Session Setup screen** — risk of feeling too many-optioned for casual users; Phase 2 should explore a "Quick" vs "Custom" setup mode to reduce decision fatigue for returning users.
3. **Discovery of the Community Pose Packs** — placed in Library Collections but not prominently surfaced in Home tab; Phase 2 home tab design should address discoverability.

---

*End of Phase 1 — User Flows & Information Architecture*
*Next: Phase 2 — Screen Design, UI/UX & Art Nouveau Aesthetic*
