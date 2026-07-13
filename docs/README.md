# PoseArt — Move like art.

> Real-time pose coaching through your camera, guided by Mucha-inspired animated figures.

![Version](https://img.shields.io/badge/version-1.0_MVP-gold) ![Platform](https://img.shields.io/badge/platform-Mobile_Web-teal) ![Aesthetic](https://img.shields.io/badge/aesthetic-Art_Nouveau-green)

---

## Overview

PoseArt is a mobile-first web application that uses your phone camera to provide real-time pose coaching. It overlays Art Nouveau–style animated human figures (inspired by Alphonse Mucha) onto your camera feed, scores your body alignment live, and coaches you with natural-language hints.

**Tagline:** Move like art.  
**MVP Freemium:** Free (30 poses) / Pro $4.99/mo or $29.99/yr

---

## Features (MVP)

| Feature | Description |
|---------|-------------|
| **Camera feed overlay** | Live camera with pose reference overlay (Avatar / Skeleton / Ghost / Off modes) |
| **Alignment scoring** | 0–100% score using EMA-smoothed joint angle deltas vs. reference pose |
| **Auto-capture** | Fires automatically when score ≥85% for ≥1.5 seconds |
| **Mucha avatar** | Art Nouveau SVG figure with golden halo/nimbus that fills with alignment |
| **16 pose categories** | Standing, Seated, Leaning-Standing, Leaning-Seated, Kneeling, Reclining, Dynamic, Eccentric, Couple, Accessible, Boudoir, Editorial, Fine Art, Fashion, Low-to-High, High-to-Low |
| **745 poses (library)** | S-Curve Stand, Soft Sit, Wall Lean, Power Recline, Kneeling Arch, Editorial Arm Reach, etc. — see `js/poses-data.js` for the canonical count (auto-computed from `POSES_LIBRARY`) |
| **Pose library** | Browse by category, search, favorites |
| **Session setup** | Timer delay, feedback mode, overlay style, detection sensitivity |
| **Progress tracking** | Session count, poses tried, best score, history with timestamps |
| **Simulation mode** | Fully functional without camera permission |
| **Onboarding** | 4-screen flow with Art Nouveau illustrations |

---

## Design System

**Palette — "Peacock Fresco"**

| Token | Hex | Usage |
|-------|-----|-------|
| Deep Teal | `#0F3B3A` | Primary dark, avatar figures |
| Emerald | `#1E7A74` | Interactive elements, success state |
| Cobalt | `#2B5FAD` | Secondary, Daily Challenge card |
| Antique Gold | `#C9A24C` | Accents, scores, CTAs, halo |
| Parchment | `#F6F0E1` | Screen backgrounds, surfaces |

**Typography**
- Display: Cormorant Garamond (serif) — headings, pose names
- Body: Inter — instructions, labels, settings
- Wordmark: Cinzel Decorative — "POSEART" logotype only

**Navigation** — 5-tab bottom bar
- Home · Poses · Session (gold pill center) · Progress · Profile

---

## Architecture

```
Camera pipeline (production iOS/Android):
  Camera Feed (30fps) → Ring buffer (keep-latest) → Background inference thread
  → One-Euro EMA smoothing → Alignment scoring → Thread-safe atomic slot
  → Render thread (60fps): camera preview + Lottie overlay + skeleton canvas + HUD chrome

Camera pipeline (web / simulation mode):
  Simulated joint positions → EMA(alpha=0.4) → Alignment scoring → Canvas overlay
```

**Pose Detection (production targets)**
- iOS: `VNDetectHumanBodyPoseRequest` — 19 joints
- Android/Cross-platform: MediaPipe Pose Landmarker BlazePose — 33 landmarks

**Alignment Scoring**
- Per-joint angle deltas vs. reference pose vector
- Weighted aggregate → 0–100 score
- EMA smoothing: `score = 0.7 × prev + 0.3 × new`
- Confidence gating: low-confidence joints (<0.7) use alpha=0.1
- Hysteresis: errors must persist ≥1500ms before hint surfaces
- Auto-capture: score ≥85% sustained ≥1500ms → particle bloom + haptic

---

## File Structure

```
poseart-app/
├── index.html              # All 23 screens (SPA, screen visibility toggling) + inline <style> (the live stylesheet; css/app.css was retired in v1.1 — see PR-6)
├── css/
│   └── tokens.css          # Design tokens (colors, type, spacing, radius, shadow, animation)
└── js/
    ├── poses-data.js       # Pose library (16 categories, 745 poses), in-memory session/favorites storage
    ├── camera.js           # CameraEngine class — camera init, EMA, scoring, skeleton canvas, auto-capture
    ├── pose-skeleton-3d.js # Procedural 3D skeleton/ghost rig (canvas-based, FK pipeline shared by all three renderers)
    ├── pose-animations.js  # CSS keyframes for avatar SVG entry + idle breathing
    └── app.js              # App controller — navigation, onboarding, session flow, UI interactions
```

---

## Running Locally

```bash
# Requires: Node.js, serve package
npx serve poseart-app -l 3000 --no-clipboard --single

# Then open:
open http://localhost:3000
```

**Mobile testing:** Use Chrome DevTools Device Toolbar at 430×932px (iPhone 14 Pro Max).

---

## Phase Documentation

All design and research documents are in `/home/user/workspace/`:

| File | Phase | Contents |
|------|-------|----------|
| `product_design_document.md` | Phase 0 | Full PDD — features, personas, business model, tech architecture |
| `phase1_user_flows_ia.md` | Phase 1 | Sitemap (23 screens), 6 user flows, navigation diagram, friction analysis |
| `phase2_screen_design.md` | Phase 2 | Design tokens, 13 components, 23 screen specs, motion design |
| `phase3_animation_system.md` | Phase 3 | Animation pipeline, Mucha avatar SVG spec, Lottie system, scoring algorithm |
| `phase5_playwright_tests.md` | Phase 5 | Playwright QA report — 8 test cases, visual QA, issues found/fixed |
| `AGENT_STATE.md` | All | Project state tracker with phase retrospections |

---

## Native App Roadmap

| Milestone | Feature |
|-----------|---------|
| v1.1 | Real MediaPipe Pose Landmarker integration (web) |
| v1.2 | Session review with photo capture & gallery |
| v1.3 | Sequence mode (chained poses, guided flow) |
| v2.0 | iOS native (Swift/Vision framework) |
| v2.1 | Android native (Kotlin/MediaPipe) |
| v2.2 | Community pose packs, custom pose studio |
| v3.0 | Couple/partner poses, multi-body detection |

---

## Credits

- Art direction inspired by **Alphonse Mucha** (1860–1939), Art Nouveau master
- Pose taxonomy informed by professional photography posing guides and Laban Movement Analysis
- MediaPipe Pose Landmarker: [developers.google.com](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js)
- Pose Animator concept: [TensorFlow Blog](https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html)

---

*Built with Stanford STORM methodology + Loop Engineering + Three Man Team (Architect / Builder / Reviewer) mindset.*
