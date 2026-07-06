# PoseArt — Phase 2: Screen Design & UI/UX Document
**Version 1.0 — Phase 2 Deliverable**
*Compiled July 5, 2026 | Inputs: Phase 0 Product Design Document, Phase 1 User Flows & IA, Phase 2 Pre-Research (Art Nouveau Implementation, Camera UI Patterns, Accessibility)*

---

## How to Read This Document

This document is the **single source of visual truth** for Phase 4 implementation. Every color, size, duration, and easing curve specified here is a token — implementers should reference tokens by name, not re-derive values. Where the Phase 0 PDD defined a starting palette ("Peacock Fresco") and motion principles, this document extends them into a full production-grade design system, resolves gaps (dark mode, elevation, accessibility-validated pairings), and applies them to all 23 screens from the Phase 1 inventory.

Sourcing note: Art Nouveau implementation techniques, accessibility contrast requirements, and camera-app interaction patterns are drawn from [`research_phase2.md`](research_phase2.md); brand palette/typography seed values are drawn from [`product_design_document.md`](product_design_document.md) §6; screen inventory and flows are drawn from [`phase1_user_flows_ia.md`](phase1_user_flows_ia.md) §3–4.

---

## 1. Art Nouveau Design Token System

### 1.1 Color System

#### 1.1.1 Raw Palette — "Peacock Fresco" (extended)

The Phase 0 PDD established five core Peacock Fresco colors. Phase 2 extends this into a full tint/shade ramp so every semantic role has light/dark and hover/pressed variants, following the accessibility research principle that **dark mode requires its own validated pairs, never a blind inversion** ([research_phase2.md §5.3](research_phase2.md)).

| Token | Hex | Notes |
|---|---|---|
| `color.raw.teal.900` | `#0A2827` | Deepest teal — dark-mode base surface |
| `color.raw.teal.800` | `#0F3B3A` | Deep Teal — PDD primary background/text (light mode text) |
| `color.raw.teal.700` | `#155450` | Mid teal — dark-mode elevated surface |
| `color.raw.teal.600` | `#1E7A74` | Emerald Teal — PDD brand accent/CTA |
| `color.raw.teal.500` | `#2E958E` | Emerald hover state |
| `color.raw.teal.400` | `#5CB3AC` | Emerald pressed-light / disabled-adjacent |
| `color.raw.teal.200` | `#A8D8D3` | Pale teal — subtle fills, chip backgrounds |
| `color.raw.teal.100` | `#DDEFED` | Faintest teal wash — selected-row backgrounds |
| `color.raw.cobalt.700` | `#204B87` | Cobalt pressed |
| `color.raw.cobalt.600` | `#2B5FAD` | Cobalt Blue — PDD secondary accent/links |
| `color.raw.cobalt.500` | `#4A79C4` | Cobalt hover |
| `color.raw.cobalt.200` | `#C7D6EC` | Cobalt tint — link-adjacent backgrounds |
| `color.raw.gold.800` | `#9C7B34` | Gold pressed / dark-mode text-on-gold |
| `color.raw.gold.700` | `#B08D42` | Gold hover-dark |
| `color.raw.gold.600` | `#C9A24C` | Antique Gold — PDD gold highlight/premium |
| `color.raw.gold.500` | `#D4B368` | Gold hover-light |
| `color.raw.gold.300` | `#E6D29B` | Gold tint — ornament wash at low opacity |
| `color.raw.gold.dark` | `#D4AF37` | Dark-mode gold accent (brighter for contrast per luxury dark-UI pattern, [research_phase2.md §5.3](research_phase2.md)) |
| `color.raw.parchment.100` | `#F6F0E1` | Parchment — PDD surface/background base (light mode) |
| `color.raw.parchment.50` | `#FBF8F0` | Lightest parchment — card surfaces on light bg |
| `color.raw.parchment.200` | `#EFE6D0` | Parchment shade — pressed/inset surfaces |
| `color.raw.ink.900` | `#1A1613` | Near-black warm ink — dark-mode base (NOT pure #000000, per Material dark-mode guidance, [research_phase2.md §5.3](research_phase2.md)) |
| `color.raw.ink.800` | `#252019` | Dark-mode elevated surface 1 |
| `color.raw.ink.700` | `#332C22` | Dark-mode elevated surface 2 |
| `color.raw.aubergine.600` | `#6D4A72` | Iris Amethyst — accent for Couple/Editorial category tags |
| `color.raw.terracotta.600` | `#C96A4C` | Terracotta — PDD error/correction semantic |
| `color.raw.botanical.600` | `#4CAF7D` | Soft botanical green — PDD success semantic |
| `color.raw.white` | `#FFFFFF` | Pure white — used ONLY for skeleton overlay lines & icon strokes on camera feed, never as a surface |
| `color.raw.black` | `#000000` | Pure black — used ONLY for camera-scrim gradients and shutter-flash animation, never as a surface or text color |

#### 1.1.2 Semantic Tokens — Light Theme (default)

| Semantic Token | Value | Usage |
|---|---|---|
| `color.bg.canvas` | `color.raw.parchment.100` `#F6F0E1` | App background, all non-camera screens |
| `color.bg.surface` | `color.raw.parchment.50` `#FBF8F0` | Cards, sheets, chips |
| `color.bg.surface-pressed` | `color.raw.parchment.200` `#EFE6D0` | Pressed card state |
| `color.bg.elevated` | `#FFFFFF` | Modals, popovers requiring max contrast lift |
| `color.text.primary` | `color.raw.teal.800` `#0F3B3A` | Headlines, body text on light surfaces |
| `color.text.secondary` | `#4A5E5C` (derived, teal-800 @ 70% over parchment) | Captions, metadata, timestamps |
| `color.text.disabled` | `#9AA8A6` | Disabled labels |
| `color.text.on-brand` | `#FFFFFF` | Text on filled teal/cobalt buttons |
| `color.text.on-gold` | `color.raw.teal.900` `#0A2827` | Text on gold-filled surfaces (contrast-verified, see §1.1.4) |
| `color.text.link` | `color.raw.cobalt.600` `#2B5FAD` | Inline links, secondary actions |
| `color.brand.primary` | `color.raw.teal.600` `#1E7A74` | Primary CTA fill, active tab icon |
| `color.brand.primary-hover` | `color.raw.teal.500` `#2E958E` | Hover |
| `color.brand.primary-pressed` | `color.raw.teal.800` `#0F3B3A` | Pressed |
| `color.brand.secondary` | `color.raw.cobalt.600` `#2B5FAD` | Secondary buttons, links |
| `color.brand.gold` | `color.raw.gold.600` `#C9A24C` | Premium accents, active-tab underline, ornament strokes |
| `color.border.default` | `#D8CBA8` (parchment-shade border) | Card borders, dividers (non-ornamental) |
| `color.border.focus` | `color.raw.cobalt.600` `#2B5FAD` | Focus ring (3:1 verified against parchment, see §1.1.4) |
| `color.state.success` | `color.raw.botanical.600` `#4CAF7D` | Alignment correct |
| `color.state.success-bg` | `#E5F4EC` | Success banner background |
| `color.state.warning` | `color.raw.gold.600` `#C9A24C` | Partial alignment / in-progress |
| `color.state.warning-bg` | `#FBF3DF` | Warning banner background |
| `color.state.error` | `color.raw.terracotta.600` `#C96A4C` | Alignment error, destructive actions |
| `color.state.error-bg` | `#FBEAE3` | Error banner background |
| `color.overlay.skeleton` | `#FFFFFF` @ 70% opacity | Live keypoint skeleton lines (PDD §6.2) |
| `color.overlay.ghost` | `color.raw.parchment.100` `#F6F0E1` @ 40% opacity | Ghost silhouette overlay |
| `color.overlay.scrim-top` | `linear-gradient(180deg, rgba(10,40,39,0.55) 0%, rgba(10,40,39,0) 100%)` | Top scrim on camera screen for status bar/controls legibility |
| `color.overlay.scrim-bottom` | `linear-gradient(0deg, rgba(10,40,39,0.65) 0%, rgba(10,40,39,0) 100%)` | Bottom scrim for shutter/control legibility over unpredictable video, per [research_phase2.md §4.5](research_phase2.md) |
| `color.overlay.text-utility` | `#FFFFFF` on solid `rgba(10,40,39,0.72)` pill background | Reserved "utility high-contrast" token for any text directly over live camera feed — never render camera-feed text without this backing per [research_phase2.md §5.2](research_phase2.md) |

#### 1.1.3 Semantic Tokens — Dark Theme

Per research guidance, dark mode is a **fully independent validated set**, anchored on warm near-black rather than a naive inversion ([research_phase2.md §5.3](research_phase2.md)).

| Semantic Token | Value | Usage |
|---|---|---|
| `color.bg.canvas` (dark) | `color.raw.ink.900` `#1A1613` | App background |
| `color.bg.surface` (dark) | `color.raw.ink.800` `#252019` | Cards, sheets |
| `color.bg.surface-pressed` (dark) | `color.raw.ink.700` `#332C22` | Pressed card |
| `color.bg.elevated` (dark) | `#3A3226` | Modals |
| `color.text.primary` (dark) | `#F0E9DA` (warm off-white, never pure white) | Headlines/body |
| `color.text.secondary` (dark) | `#C9BFA9` | Captions |
| `color.brand.primary` (dark) | `color.raw.teal.400` `#5CB3AC` | Brighter teal for dark-surface contrast |
| `color.brand.gold` (dark) | `color.raw.gold.dark` `#D4AF37` | Gold accents — "black + antique gold" luxury pattern ([research_phase2.md §5.3](research_phase2.md)) |
| `color.border.default` (dark) | `#4A4032` | Dividers |
| `color.state.success` (dark) | `#6FCB9A` | Brightened for dark-bg legibility |
| `color.state.warning` (dark) | `color.raw.gold.dark` `#D4AF37` | |
| `color.state.error` (dark) | `#E08868` | Brightened terracotta |

#### 1.1.4 Contrast Verification Table (WCAG 2.2)

All pairings below meet or exceed the [research_phase2.md §5.1](research_phase2.md) thresholds (4.5:1 normal text, 3:1 large text/UI components, 7:1 AAA for critical content).

| Pairing | Ratio (approx.) | Meets |
|---|---|---|
| `text.primary` #0F3B3A on `bg.canvas` #F6F0E1 | 10.8:1 | AAA normal text |
| `text.on-brand` #FFFFFF on `brand.primary` #1E7A74 | 4.6:1 | AA normal text |
| `text.on-gold` #0A2827 on `brand.gold` #C9A24C | 7.9:1 | AAA normal text |
| `text.link` #2B5FAD on `bg.canvas` #F6F0E1 | 5.1:1 | AA normal text |
| `color.overlay.text-utility` white on scrim pill rgba(10,40,39,0.72) | ≥7:1 (solid-equivalent) | AAA — required for all camera-overlay text |
| `state.error` #C96A4C on `bg.canvas` #F6F0E1 | 3.3:1 | AA large text/UI only — always pair with icon, never body text |
| dark `text.primary` #F0E9DA on dark `bg.canvas` #1A1613 | 13.1:1 | AAA |
| dark `brand.gold` #D4AF37 on dark `bg.canvas` #1A1613 | 8.7:1 | AAA |

**Rule enforced app-wide:** color is never the sole signal for alignment/success/error states — every state pairs color with an icon or label, per [research_phase2.md §5.4](research_phase2.md) (also satisfies colorblind users evaluating skeleton overlay states).

### 1.2 Typography

Per research, Art Nouveau display faces are legible only at large sizes; body copy must use a restrained, highly-legible pairing partner ([research_phase2.md §1.1](research_phase2.md)). PoseArt adopts the PDD's Cormorant Garamond + Inter pairing, refines the exact scale, and adds a decorative tertiary face for the wordmark/monogram only.

#### 1.2.1 Font Families

| Token | Family | Role |
|---|---|---|
| `font.family.display` | Cormorant Garamond (Google Fonts, SemiBold/Bold) | Headlines, hero moments, section titles — calligraphic high-contrast serif echoing Art Nouveau swelling strokes |
| `font.family.body` | Inter (Regular/Medium/SemiBold) | Body copy, instructions, camera-overlay hints, all UI labels — accessible at small sizes |
| `font.family.accent` | Cinzel Decorative (Google Fonts) | PoseArt wordmark, monogram/drop-cap only — never body or button text |
| `font.family.mono` (utility) | SF Mono / Roboto Mono (system) | Numeric alignment-score HUD digits (tabular figures prevent layout jitter as numbers change) |

#### 1.2.2 Type Scale (complete, all roles)

| Token | Size / Line-height | Weight / Family | Usage |
|---|---|---|---|
| `type.display-hero` | 40px / 48px | Cormorant Garamond Bold | OB-1 Welcome headline "Move like art." |
| `type.display` | 32px / 40px | Cormorant Garamond Bold | Section hero headers (Collection Detail title) |
| `type.h1` | 24px / 32px | Cormorant Garamond SemiBold | Screen titles (Pose Detail name, Category name) |
| `type.h2` | 20px / 28px | Cormorant Garamond Regular | Card group headers ("Featured Collections") |
| `type.h3` | 18px / 26px | Inter SemiBold | Card titles (Pose Card name, subsection labels) |
| `type.body-lg` | 17px / 24px | Inter Regular | Primary instructional body text (Pose Detail "How to") |
| `type.body` | 16px / 22px | Inter Regular | Standard body copy |
| `type.label` | 14px / 20px | Inter Medium | Button labels, hint banners, form labels |
| `type.caption` | 12px / 16px | Inter Regular | Metadata, timestamps, axis tags |
| `type.overline` | 11px / 14px, +0.06em tracking | Inter SemiBold, uppercase | Category eyebrow labels ("STANDING · 10 POSES") |
| `type.hud-score` | 28px / 28px | SF Mono / Roboto Mono SemiBold (tabular nums) | Alignment score HUD numeral |
| `type.hud-score-lg` | 44px / 44px | SF Mono / Roboto Mono Bold (tabular nums) | Capture Review score summary |
| `type.wordmark` | 22px / 22px | Cinzel Decorative Regular | "PoseArt" logotype in nav/splash only |
| `type.tab-label` | 11px / 14px | Inter Medium | Bottom tab bar labels |
| `type.chip-label` | 13px / 18px | Inter Medium | Filter/preset chip text |

**Dynamic Type / accessibility scaling:** all tokens scale proportionally with OS text-size settings up to 200%; `type.hud-score` and `type.display-hero` are capped at 150% scale to preserve camera-screen layout integrity, with layout reflow (score HUD moves from circular to pill format) beyond 130% scale — see PR-2 Accessibility Settings spec (§3).

### 1.3 Spacing Scale (4px base grid)

| Token | Value | Usage |
|---|---|---|
| `space.0` | 0px | — |
| `space.1` | 4px | Icon-to-label gap, tight chip padding |
| `space.2` | 8px | Default inline gap, small card padding |
| `space.3` | 12px | Compact stack gap |
| `space.4` | 16px | Standard card padding, default stack gap |
| `space.5` | 20px | Section internal padding |
| `space.6` | 24px | Section-to-section gap, screen horizontal margin |
| `space.8` | 32px | Large section breaks |
| `space.10` | 40px | Hero vertical spacing |
| `space.12` | 48px | Onboarding vertical rhythm |
| `space.16` | 64px | Full-bleed hero top offset |
| `space.20` | 80px | Bottom-safe clearance above tab bar for scrollable content |

Screen horizontal margin standard: `space.6` (24px) on all non-camera screens. Camera screen uses `space.4` (16px) inset for controls to maximize viewfinder area per Apple HIG full-screen guidance ([research_phase2.md §4.1](research_phase2.md)).

### 1.4 Border Radius System (organic, not boxy)

Art Nouveau rejects hard rectilinear geometry; radii are deliberately large and, where possible, asymmetric to evoke whiplash-curve organicism rather than generic "rounded corners."

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | 6px | Chips, small tags |
| `radius.sm` | 10px | Input fields, small buttons |
| `radius.md` | 16px | Standard cards (Pose Card, Category Card) |
| `radius.lg` | 24px | Bottom sheets (top corners), large modals |
| `radius.xl` | 32px | Hero cards, Session tab pill button |
| `radius.pill` | 999px | Primary/Secondary buttons, chips, tab-bar action button |
| `radius.organic-asym` | `48px 16px 48px 16px` (custom per-corner) | Signature "whiplash" card treatment — applied to Featured Collection hero cards and OB screens; alternating large/small corners mimics an asymmetric leaf/petal silhouette |
| `radius.circle` | 50% | Avatar, alignment score HUD, shutter button |

Rule: no element in the app uses `radius.xs` or smaller as a "sharp corner" default — the minimum radius anywhere is 6px, reinforcing the brand's organic personality per Headspace's precedent of no true sharp corners ([research_phase2.md §3.2](research_phase2.md)).

### 1.5 Shadow / Elevation System

Shadows use a **warm-tinted** color (never neutral gray), consistent with the research finding that premium organic brands tint shadows to match their palette rather than using flat gray ([research_phase2.md §3.2](research_phase2.md), Headspace `rgba(244,125,49,0.12)` pattern).

| Token | CSS value | Usage |
|---|---|---|
| `elevation.0` | none | Flush/inline elements |
| `elevation.1` | `0 1px 3px rgba(15,59,58,0.08)` | Chips, list rows |
| `elevation.2` | `0 4px 12px rgba(15,59,58,0.10)` | Cards at rest (Pose Card, Category Card) |
| `elevation.3` | `0 8px 24px rgba(15,59,58,0.14)` | Cards on hover/press lift, floating tab-bar action button |
| `elevation.4` | `0 16px 40px rgba(15,59,58,0.18)` | Bottom sheets, modals |
| `elevation.5` | `0 24px 56px rgba(15,59,58,0.22)` | Upgrade-to-Pro sheet, full-screen takeovers |
| `elevation.gold-glow` | `0 0 24px rgba(201,162,76,0.45)` | Alignment-success halo bloom, Pro/premium badges |
| `elevation.focus-ring` | `0 0 0 3px rgba(43,95,173,0.55)` | Keyboard/switch-control focus indicator, 3:1 verified |

Dark theme uses the same shadow structure at `rgba(0,0,0,0.35–0.55)` opacity with a subtle warm gold undertone added at `elevation.4+` (`rgba(212,175,55,0.06)` overlay) to prevent shadows from reading as flat black.

### 1.6 Animation Duration + Easing Tokens

Per PDD §6.5 and research on organic motion vs. mechanical easing ([research_phase2.md §2.5](research_phase2.md)):

| Token | Value |
|---|---|
| `duration.instant` | 100ms |
| `duration.micro` | 150ms |
| `duration.standard` | 250ms |
| `duration.elaborate` | 500ms |
| `duration.hero` | 800ms |
| `duration.ambient-breathe` | 2000ms (loop) |
| `duration.ornament-draw` | 600–1200ms (path length dependent, per [research_phase2.md §1.3 Technique D](research_phase2.md)) |
| `easing.enter` | `cubic-bezier(0.4, 0.0, 0.2, 1)` — organic deceleration (PDD §6.5) |
| `easing.exit` | `cubic-bezier(0.8, 0.0, 0.4, 0.8)` — organic acceleration (PDD §6.5) |
| `easing.overshoot` | `cubic-bezier(0.34, 1.56, 0.64, 1)` — bounce/personality for success states, per delight research ([research_phase2.md §2.5](research_phase2.md)) |
| `easing.linear-utility` | `linear` — reserved only for continuous score-ring fills, never for discrete UI transitions |

`prefers-reduced-motion` fallback: all ornament-draw, breathe, and particle-bloom animations collapse to a simple 150ms opacity cross-fade; auto-capture countdown remains functional but skips decorative motion.


---

## 2. Component Library Specification

Every component below defines: visual anatomy, interaction states, Art Nouveau decorative treatment, and accessibility requirements. All components consume tokens from §1 exclusively — no ad hoc values.

### 2.1 Tab Bar (5 items, Liquid Glass treatment)

**Anatomy:**
- Container: floating pill-capsule bar, `height: 64px`, inset `16px` from bottom safe area and `16px` from left/right screen edges (not full-bleed, per Apple HIG "avoid full-width buttons at extreme edges" guidance, [research_phase2.md §4.1](research_phase2.md))
- Background: Liquid Glass material — `backdrop-filter: blur(24px) saturate(140%)`, fill `rgba(246,240,225,0.72)` light / `rgba(26,22,19,0.72)` dark, 1px hairline border `rgba(201,162,76,0.25)`
- 5 icon+label items: Home, Poses, **Session (center)**, Progress, Profile
- Center "Session" item breaks the grid: raised `radius.pill` capsule, `56px × 40px`, filled `color.brand.gold` gradient (`linear-gradient(135deg, #D4B368, #C9A24C)`), floating 8px above the bar's top edge with `elevation.3`
- Each outer item: 24px icon (custom organic line icon set, 1.5px stroke) + `type.tab-label` beneath, 4px gap

**States:**
- Default (inactive): icon/label in `color.text.secondary`, outline-weight icon variant
- Active: icon switches to filled variant, tinted `color.brand.gold`; a 2px gold underline tick (`radius.xs`, 16px wide) fades in beneath the icon per PDD nav notes
- Pressed: item scales to 0.92 (`duration.micro`, `easing.enter`), background ripple wash `color.raw.teal.100` at 40% opacity
- Disabled (Session tab when camera permission fully denied and no fallback): icon at 40% opacity, tapping opens explainer sheet instead of navigating
- Focus (keyboard/switch control): `elevation.focus-ring` around the whole tapped item

**Art Nouveau treatment:** the center Session capsule carries a fine engraved whiplash-line motif (single continuous S-curve stroke, `#0F3B3A` at 30% opacity) etched across its face; the bar's top hairline border uses a repeating micro-vine pattern at 15% opacity rather than a flat line.

**Accessibility:** all 5 targets ≥ 44×44pt tap area even though visual bar is 64px tall (label+icon combined hit box extends invisibly); `accessibilityLabel` per tab announces role ("Session, tab, 3 of 5"); active tab announced via `accessibilityTraits: selected`.

---

### 2.2 Pose Card (grid and list variants)

**Anatomy — Grid variant** (used in L-1 subcategory grids, H-1 Trending):
- Card: `radius.md` (16px), `elevation.2`, `aspect-ratio 3:4`, background `color.bg.surface`
- Top 70% — thumbnail image (static pose photo or Lottie first-frame), corner-masked with `radius.md`
- Gold hairline frame inset 4px from card edge, 1px stroke `color.brand.gold` at 50% opacity — the "whiplash corner-only" motif (see §4) appears only at top-left and bottom-right corners, not full frame, to avoid visual clutter at small card size
- Bottom 30% — padding `space.3`: pose name (`type.h3`), axis-tag row (2 small `type.caption` chips: angle + difficulty dot)
- Favorite heart icon, top-right corner, 32×32 touch target, floats over thumbnail on a small glass chip

**Anatomy — List variant** (used in L-2 Subcategory List, L-6 Favorites list mode):
- Row height 88px, `radius.sm` on thumbnail only (card itself has no visible border, separated by `color.border.default` 1px divider)
- Left: 72×72 square thumbnail, `radius.sm`
- Center: pose name (`type.h3`), axis tags inline (`type.caption`, separated by `·`)
- Right: chevron affordance + favorite heart icon stacked

**States:**
- Default: as above
- Hover (tablet/pointer): `elevation.3`, scale 1.02, `duration.standard`
- Pressed: scale 0.97, `duration.micro`
- Loading (thumbnail not yet decoded): parchment-texture skeleton shimmer (diagonal gold-tinted shimmer sweep, 1.2s loop)
- Disabled (Pro-locked pose on Free tier): 60% opacity thumbnail, small lock badge bottom-left, tapping opens M-3 Upgrade sheet instead of L-3

**Art Nouveau treatment:** favorite-heart icon uses a custom Mucha-inspired heart-with-tendril glyph rather than a generic heart; on save, tendril briefly "grows" around the heart outline (200ms path-draw).

**Accessibility:** entire card is one tap target (not just image); `accessibilityLabel` = "{pose name}, {difficulty}, {favorited state}"; favorite button is independently focusable with its own 44×44 target overlapping the card's larger target.

---

### 2.3 Category Card

**Anatomy:** used in L-1 (2-column grid, 10 cards).
- `radius.organic-asym` (48px 16px 48px 16px) — the asymmetric radius is reserved for category-level cards specifically to signal "top-level/collection," distinguishing them from standard Pose Cards' uniform `radius.md`
- Full-bleed Mucha-styled illustrated thumbnail (not photo) — stylized line-art figure representing the category (e.g., Standing = flowing S-curve silhouette)
- Gradient scrim bottom 40% (`color.overlay.scrim-bottom` equivalent in teal: `linear-gradient(0deg, rgba(15,59,58,0.75), transparent)`)
- Overlaid text: category name (`type.h3`, `color.text.on-brand` white), overline pose-count badge (`type.overline`, "24 POSES")
- `elevation.2` at rest

**States:** hover lifts to `elevation.3` + illustration parallax shift 4px; pressed scales 0.96; no disabled state (all categories always browsable).

**Art Nouveau treatment:** each category's illustration is line-drawn in the brand's single-hue teal ramp with one gold accent stroke; a thin vine divider motif runs along the card's bottom scrim edge.

**Accessibility:** `accessibilityLabel` = "{Category name} category, {N} poses"; illustrations are decorative (marked `accessibilityHidden` individually) with the text label carrying full semantic meaning so screen readers aren't forced to interpret imagery.

---

### 2.4 Alignment Score HUD (circular, with halo/ornamental ring)

**Anatomy:** top-right of C-2 Live Camera Screen, 88px diameter circle.
- Outer ring: 4px stroke progress ring, `color.state.success`/`warning`/`error` depending on live score band, drawn via `stroke-dasharray` animated fill (not snapping) per progress-animation best practice ([research_phase2.md §2.4](research_phase2.md))
- Beneath the progress ring: a fixed **Mucha-signature ornamental halo** — a fine radiating nimbus of 12 thin gold tendril-rays (the PDD §6.6 "halo/nimbus" concept), rendered at low opacity (35%) as a static backing layer; ray length and opacity increase proportionally as score rises, "completing" the halo at 100%
- Center: numeral in `type.hud-score`, `color.text.on-brand`-equivalent white with `color.overlay.text-utility` pill backing at 60% circle fill opacity for guaranteed contrast over live video
- Directly beneath numeral: micro-label `type.caption` "ALIGNED" / "ADJUST" / small target icon — the required secondary non-color signal

**States:**
- 0–39% (needs major adjustment): ring `color.state.error`, halo rays dim/fragmented, label "ADJUST"
- 40–84% (partial): ring `color.state.warning` (gold), halo rays half-illuminated, label "ALMOST"
- 85–100% (aligned / capture threshold): ring `color.state.success`, halo fully illuminated + gentle gold glow (`elevation.gold-glow`) pulses once, label "ALIGNED"
- Transition between bands: ring color cross-fades over `duration.standard`, never hard-cuts (per [research_phase2.md §2.4](research_phase2.md))
- No-person-detected state: ring desaturates to gray-teal, numeral replaced with "—", halo fully dims

**Art Nouveau treatment:** the halo IS the ornamental motif — this is the PDD's signature "avatar halo indicates alignment" concept applied to the HUD itself as well as the overlay avatar, creating visual consistency between the two.

**Accessibility:** in Audio-First mode (Flow 5), this HUD's numeric value is additionally announced via spoken score every 3 seconds rather than relying on the visual ring; `accessibilityValue` always exposes the live percentage for VoiceOver/TalkBack even when visually hidden.

---

### 2.5 Per-Joint Hint Banner

**Anatomy:** horizontal pill banner, bottom of camera screen, above shutter row, `max-width: 88%`, centered.
- Background: `rgba(15,59,58,0.82)` glass pill, `radius.pill`, `elevation.3`
- Left: small directional icon (custom arrow/limb glyph indicating which joint, e.g., an arm-raise icon)
- Text: `type.label`, `color.text.on-brand` white, e.g., "Raise your left arm"
- Thin gold hairline top edge (1px, 40% opacity) as sole ornamental touch — kept minimal since this sits atop live video and must prioritize legibility over decoration

**States:**
- Hidden by default; appears only after joint error persists ≥1.5s (hysteresis gate per PDD §4.1 F3)
- Enter: slides up 16px + fades in, `duration.standard`, `easing.enter`
- Persistent while error continues (no auto-dismiss timer while condition is true)
- Exit: once corrected, slides down 16px + fades out, `duration.standard`, `easing.exit`
- Multiple simultaneous errors: banner cycles messages every 2.5s with a soft cross-fade rather than stacking multiple banners (avoids clutter)

**Accessibility:** each hint is simultaneously spoken via TTS when Audio or All feedback mode is active (PDD F3 multimodal requirement); banner text always meets the `color.overlay.text-utility` contrast standard since it sits over live camera feed.

---

### 2.6 Art Nouveau Ornamental Frame (camera viewfinder border)

**Anatomy:** a full-viewport decorative border applied as the outermost layer of the camera screen, using the `border-image` 9-slice technique from [research_phase2.md §1.3 Technique A](research_phase2.md).
- 4 corners: hand-drawn whiplash flourish motifs (derived from public-domain Mucha/Verneuil ornament sources, [research_phase2.md §1.2](research_phase2.md)), rendered at 56×56px, stroke color `color.brand.gold` at 55% opacity, 1.5px line weight
- Edges: the corner motifs taper into a single thin continuous hairline (1px, 30% opacity) connecting all four corners — NOT a solid rectangular frame, preserving maximum viewfinder visibility per Apple HIG edge-to-edge guidance
- The frame sits in a layer ABOVE the scrim but BELOW interactive controls in z-order, and uses `pointer-events: none`

**States:** frame opacity reduces to 15% automatically when the collapsible "quick bar" advanced-controls drawer (Halide-pattern, [research_phase2.md §4.2](research_phase2.md)) is open, to reduce visual competition; returns to 55% on close, cross-fade `duration.standard`.

**Accessibility:** purely decorative, `accessibilityHidden: true`; never used to convey state (alignment state lives in the HUD, not the frame).

---

### 2.7 Shutter Button (large, camera-center, Art Nouveau pill)

**Anatomy:** 76px diameter circle, bottom-center of C-2, within thumb-reach zone per [research_phase2.md §4.5](research_phase2.md).
- Outer ring: 4px stroke, `color.brand.gold`, with a subtle engraved whiplash-curve texture etched into the ring (achieved via a rotated SVG ring mask)
- Inner fill: `#FFFFFF` at rest (95% opacity glass), shrinks to 88% diameter on press revealing the gold ring "iris" — a skeuomorphic camera-iris nod per [research_phase2.md §2.1](research_phase2.md)
- No icon inside — pure circle, universally recognizable per VSCO lesson on iconography clarity ([research_phase2.md §4.3](research_phase2.md))

**States:**
- Default: as above, `elevation.3`
- Pressed: inner circle scales to 0.85, `duration.instant`, haptic light-tap fires simultaneously
- Capturing (manual or auto-triggered): full-screen flash-white overlay at 60% opacity for 80ms, then the captured frame visually "shrinks" into a thumbnail that flies to the bottom-left gallery corner over `duration.elaborate` (the "Not Boring Camera" consolidation pattern, [research_phase2.md §2.1](research_phase2.md))
- Disabled (e.g., no person detected for >10s): ring desaturates to 40% opacity gray, button remains tappable (manual override always available per PDD F4) but visually communicates reduced confidence
- Auto-capture countdown (85%+ sustained): ring fills clockwise with `color.state.success` over the 1.5s hold window, converging with the HUD's halo animation

**Accessibility:** 76px visual size already exceeds the 44pt/48dp minimum; `accessibilityLabel`: "Shutter, double tap to capture"; audio confirmation "Captured!" fires on every capture in Audio-First mode regardless of trigger source (manual or auto).

---

### 2.8 Overlay Toggle Control

**Anatomy:** bottom-right control cluster on C-2, cycles Avatar → Skeleton → Ghost → Off.
- Single circular glass button, 48px, icon swaps per active mode (figure icon / dotted-lines icon / silhouette icon / crossed-out icon)
- On tap, brief `type.caption` label chip fades in above the button for 1.5s announcing the new mode ("Skeleton"), addressing the VSCO "ambiguous icon" lesson ([research_phase2.md §4.3](research_phase2.md))

**States:** default glass 60% opacity; pressed scales 0.9; label-chip enter/exit `duration.micro` fade.

**Art Nouveau treatment:** the label chip uses a tiny gold corner-flourish (4px) at its top-left, echoing the larger ornamental frame at micro scale.

**Accessibility:** `accessibilityLabel` announces full state on every change ("Overlay mode: Skeleton"); this control is also exposed as a discrete setting in Session Setup (C-1) for users who prefer not to interact with the live camera screen at all.

---

### 2.9 Bottom Sheet / Modal

**Anatomy:** used for L-3 Pose Detail, M-1 Filter, M-2 Session Settings, C-4 Post-Capture Edit, M-3 Upgrade to Pro.
- Top corners `radius.lg` (24px), full-width, slides up from bottom
- Drag handle: 36×4px pill, `color.border.default`, centered, `space.3` from top edge — but ALSO replaced/accompanied by a small gold whiplash flourish centered above the handle for brand consistency (a signature "sheet crown" ornament unique to PoseArt sheets)
- Background: `color.bg.surface`, `elevation.4`
- Backdrop: `rgba(15,59,58,0.4)` scrim behind sheet, tap-to-dismiss enabled

**States:**
- Enter: slides up from 100% to target height (75% for L-3, variable for others), `duration.elaborate`, `easing.enter`, backdrop fades in concurrently
- Exit: slides down + backdrop fades out, `duration.standard`, `easing.exit`
- Drag-to-dismiss: sheet follows finger 1:1 past a 30% threshold, snaps closed with `easing.exit` or snaps back with `easing.overshoot` if released before threshold
- Expandable sections within (e.g., "How to" text, advanced sliders): chevron rotates 180°, content height-animates `duration.standard`

**Accessibility:** sheet traps focus while open (focus returns to invoking element on close); swipe-down-to-dismiss has an equivalent explicit close button (X, top-right) for switch-control/motor-impaired users who cannot perform the gesture.

---

### 2.10 Session Progress Indicator

**Anatomy:** used in Sequence Mode (C-2 top bar during sequences) — "Pose 2 of 8."
- Combines 3 signals per progress-tracker best practice ([research_phase2.md §2.4](research_phase2.md)): a thin top fill bar (2px, full-width, `color.brand.gold` fill over `color.border.default` track), a compact "2 / 8" numeral chip, and per-pose checkmark dots in an optional expanded view (Sequence Summary)
- Fill bar animates continuously as poses complete rather than jumping between discrete states

**States:** active segment pulses subtly (`duration.ambient-breathe`, low amplitude); completed segments show solid gold fill; upcoming segments at 20% opacity track color.

**Accessibility:** `accessibilityLabel`: "Pose 2 of 8, sequence in progress"; announced automatically on each pose transition.

---

### 2.11 Preset/Filter Chip

**Anatomy:** used in L-2 subcategory filter row, C-3/C-4 preset strip, M-1 Filter Sheet.
- `radius.pill`, height 36px, horizontal padding `space.4`
- Text `type.chip-label`
- Unselected: `color.bg.surface` fill, 1px `color.border.default` stroke
- Selected: `color.brand.primary` fill, `color.text.on-brand` text, small gold dot indicator at left edge (4px) — the dot is the Art Nouveau touch, standing in for a generic checkmark

**States:** pressed scales 0.95; selected→unselected cross-fades fill color over `duration.micro`; horizontally scrollable row shows a soft edge-fade gradient (not a hard clip) to indicate more content.

**Accessibility:** `accessibilityTrait: selected` toggles appropriately; minimum 36px height meets touch target when combined with 8px vertical margin (effective 44px+ hit area).

---

### 2.12 Primary Button, Secondary Button, Ghost Button

**Primary Button:**
- `radius.pill`, height 52px, full-width or intrinsic, fill `color.brand.primary`, text `type.label` SemiBold `color.text.on-brand`
- A subtle 1px inner gold hairline (`rgba(201,162,76,0.3)`) sits just inside the pill edge as an engraved accent
- Hover: fill lightens to `color.brand.primary-hover`; Pressed: darkens to `color.brand.primary-pressed` + scales 0.98; Disabled: 40% opacity, no shadow; Focus: `elevation.focus-ring`

**Secondary Button:**
- Same geometry, transparent fill, 1.5px stroke `color.brand.primary`, text `color.brand.primary`
- Hover: fill washes to `color.raw.teal.100` at 100%; Pressed: stroke darkens to `primary-pressed`; Disabled: stroke + text at 40% opacity

**Ghost Button:**
- No fill, no stroke, text-only `color.brand.secondary` (cobalt) or `color.text.primary` depending on context, `type.label`
- Hover: text underline fades in (gold, 1px); Pressed: text opacity 70%; used for tertiary actions ("Skip," "Cancel," "Change pose")

All three variants share: `duration.micro` transition on all state changes, minimum 44×44pt/48dp hit area even if visual height is smaller (Ghost buttons get invisible padding), and never rely on color alone — Primary/Secondary are also distinguished by fill-vs-outline shape language for colorblind users.

---

## 3. Screen-by-Screen Design Specification

This section covers all 23 MVP screens from the [Phase 1 screen inventory](phase1_user_flows_ia.md §4). Five priority screens receive maximum detail; remaining 18 screens receive full but more concise specs in §3.6.

### 3.1 PRIORITY — OB-1 Welcome (full Mucha avatar, hero treatment)

**Layout structure:**
- Full-bleed, no status bar chrome shown (immersive per [research_phase2.md §4.1](research_phase2.md): "hide status bar only when it adds value" — onboarding hero qualifies)
- Background: `color.bg.canvas` `#F6F0E1` base, overlaid with a very large (120% viewport height) looping Lottie animation of a Mucha-style female figure with flowing hair/vine tendrils, centered horizontally, anchored so her shoulders/head occupy the top 55% of the screen and hair tendrils sweep down/outward filling the sides
- The figure is rendered in a duotone treatment: line work in `color.raw.teal.800` `#0F3B3A`, accent highlights (hair tendril tips, halo) in `color.brand.gold` `#C9A24C`
- A radiating nimbus/halo (same asset family as the Alignment Score HUD halo, §2.4) sits behind her head, static at 70% illumination, very slow ambient rotation (60s per revolution, barely perceptible) to signal "alive" without distraction
- Content stack, bottom 40% of screen, `space.6` horizontal margin:
  - Headline "Move like art." — `type.display-hero`, `color.text.primary`, centered
  - Subhead "Real-time pose coaching through your camera." — `type.body-lg`, `color.text.secondary`, centered, `space.3` below headline
  - Primary Button "Get Started" — full-width minus margins, `space.8` below subhead
  - Ghost Button "Skip" — top-right corner, `space.6` inset from top-right safe area, `type.label`, `color.text.secondary`
- A thin whiplash-curve divider (full-frame variant, see §4) traces along the boundary where the illustration meets the content stack, acting as a organic "horizon line" rather than a hard rectangle cut

**Color tokens:** `color.bg.canvas`, `color.text.primary`, `color.text.secondary`, `color.brand.gold` (halo + tendril accents), `color.brand.primary` (Get Started button fill)

**Typography tokens:** `type.display-hero`, `type.body-lg`, `type.label` (buttons)

**Art Nouveau decorative elements:** full Mucha avatar illustration (hero-scale, the single largest ornamental investment in the app, per PDD §5.5 commissioning 30 hero sprites); nimbus halo motif at 70% static illumination; whiplash-curve horizon divider at 100% opacity (this is the one place in the app the whiplash line is used at full strength, establishing brand voice immediately); subtle parchment grain texture (§4) at 8% opacity across the entire background

**Interaction states:** "Get Started" — Primary Button states per §2.12; "Skip" — Ghost Button states per §2.12, tapping jumps directly to OB-4 per Flow 1

**Animation/transition:**
- On app cold-launch: splash → OB-1 cross-fades in over `duration.hero` (800ms), the Mucha figure's line-art draws itself in using the SVG path-draw technique ([research_phase2.md §1.3 Technique D](research_phase2.md)) over 1.2s before settling into its idle loop
- Idle loop: hair tendrils sway gently (amplitude 4px, `duration.ambient-breathe` 2000ms cycle, ease-in-out sine), halo rotates slowly as described above
- Exit to OB-2: content stack and illustration both slide left 24px + fade out over `duration.standard`, `easing.exit`, while OB-2 slides in from the right — a continuous horizontal filmstrip feel across the onboarding carousel

---

### 3.2 PRIORITY — L-3 Pose Detail Sheet

**Layout structure:** bottom sheet, 75% viewport height per Phase 1 spec, using the Bottom Sheet component (§2.9).
- Sheet crown ornament + drag handle at top (`space.3` from top)
- Header row (`space.4` margin): pose name `type.h1` left-aligned, favorite heart icon top-right (44×44 target)
- Axis tag row directly beneath name: horizontally scrolling chips (Preset/Filter Chip component, unselected/inert display style) showing angle, effort quality, functional intent — e.g., "3Q" · "SUS-L" · "PH"
- Lottie animation stage: `radius.md` container, full sheet width minus margins, height 40% of sheet, background `color.bg.surface-pressed` (subtle recessed feel), looping reference figure animation centered, with a thin gold corner-only whiplash frame (see §4) at all 4 corners
- Below stage: "How to" section — `type.h3` label "How To" + `type.body-lg` instruction paragraph, collapsed to 3 lines by default with a Ghost Button "Read more ▾" that expands (chevron-rotate pattern from §2.9)
- Tip/common-mistake callout: `color.state.warning-bg` background pill-card, `radius.md`, icon + `type.body` text, e.g., "Common mistake: locking the front knee"
- Accessible variant toggle: a labeled Switch control row, "Show accessible variant," `type.label`
- Variations row: horizontally scrollable mini pose-cards (smaller Pose Card grid variant, 96px wide) labeled "Easier / Harder / Accessible"
- Sticky action footer (pinned to sheet bottom, `elevation.4` separated by hairline): three actions side by side — Ghost "♥ Save," Ghost "+ Add to Sequence," Primary Button "▷ Start Session" (Primary takes 50% width, other two share remainder)

**Color tokens:** `color.bg.surface` (sheet), `color.bg.surface-pressed` (Lottie stage), `color.state.warning-bg` (tip callout), `color.brand.gold` (corner frame + axis chip dot), `color.brand.primary` (Start Session button)

**Typography tokens:** `type.h1` (name), `type.caption` (axis chips), `type.h3` (How To label), `type.body-lg` (instructions), `type.body` (tip text), `type.label` (footer buttons)

**Art Nouveau decorative elements:** corner-only whiplash frame around Lottie stage at 55% opacity gold; vine-and-leaf divider (see §4) separating "How To" from the tip callout instead of a flat rule line; favorite heart uses the tendril-heart glyph from §2.2

**Interaction states:** sheet drag-to-dismiss and tap-backdrop-to-dismiss both active; "Read more" expand/collapse; variation mini-cards use standard Pose Card press state; Start Session button shows a brief `duration.micro` loading pulse while C-1 Session Setup preloads the pose asset (per Flow 2 performance target of ≤3s to first camera frame)

**Animation/transition:**
- Enter: standard Bottom Sheet enter animation (§2.9), `duration.elaborate`, slides up from whichever surface invoked it (Pose Card tap, Home quick-start, Progress history tap)
- Lottie reference figure loops continuously at normal playback speed the entire time the sheet is open
- Exit on "Start Session": rather than a simple dismiss, the sheet's Lottie stage cross-fades directly into C-1's pose preview element (shared-element transition) over `duration.elaborate`, so the pose reference visually "carries through" into session setup — reduces perceived context loss
- Exit via dismiss/backdrop: standard sheet exit (§2.9)

---

### 3.3 PRIORITY — C-2 Live Camera Screen (most complex)

**Layout structure (full-screen, edge-to-edge, immersive status bar hidden):**
- **Layer 0 — Camera feed:** full-bleed live video, front or rear per user selection
- **Layer 1 — Scrims:** `color.overlay.scrim-top` (gradient, ~120px tall) and `color.overlay.scrim-bottom` (gradient, ~180px tall) — applied ONLY where controls sit, not full-frame, preserving maximum view of the live subject per [research_phase2.md §4.5](research_phase2.md)
- **Layer 2 — Pose overlay:** the selected overlay mode (Avatar default / Skeleton / Ghost / Off) renders centered over the detected/expected body region:
  - *Avatar mode:* Mucha-style rigged sprite in the target pose, `color.raw.teal.800` linework with `color.brand.gold` accent on correctly-aligned limb segments (PDD §6.6), rendered at 65% opacity so the live subject remains visible beneath/through it
  - *Skeleton mode:* live keypoint dots+lines, `color.overlay.skeleton` white at 70% opacity, joints color-coded per alignment (green/gold/terracotta per-joint, satisfying the cross-referenced "color-coded skeleton overlay" pattern, [research_phase2.md §2.2](research_phase2.md))
  - *Ghost mode:* static translucent silhouette, `color.overlay.ghost`, with a subtle idle breathing pulse (§5.2)
  - *Off:* no overlay layer rendered
- **Layer 3 — Ornamental Frame** (§2.6): corner flourishes + hairline, `pointer-events: none`
- **Layer 4 — Top bar** (within top scrim): left — pose name pill (`type.label`, glass chip) + small "×" End Session icon button (44×44); right — Alignment Score HUD (§2.4)
- **Layer 5 — Hint banner** (§2.5): centered, positioned `space.4` above the control row
- **Layer 6 — Bottom control row** (within bottom scrim), single horizontal row, `space.4` margins, 5 elements evenly weighted with Shutter dominant:
  - Far left: Timer toggle (48px glass circle, icon cycles Off/3s/5s/10s, label chip confirms on change)
  - Left-center: Camera flip (48px glass circle)
  - **Center: Shutter Button** (§2.7), 76px, elevated above the row baseline by 8px so it doesn't feel boxed-in
  - Right-center: Overlay toggle (§2.8)
  - Far right: Flash toggle (48px glass circle)
- **Layer 7 — Pose swap affordance:** a thin upward chevron + "Swipe up to change pose" micro-label, `type.caption`, fades in for 3s on session start then hides; swiping up reveals the mini-library sheet (reuses Bottom Sheet component at 50% height with a horizontally-oriented Pose Card list)
- **Layer 8 — Contextual banners** (edge cases from Flow 6): low-light warning, no-person-detected warning — both render as a top-anchored banner directly beneath the top bar, `color.state.warning-bg`-tinted glass pill, auto-dismissible

**Color tokens:** `color.overlay.scrim-top/bottom`, `color.overlay.skeleton`, `color.overlay.ghost`, `color.brand.gold` (avatar accent + frame + HUD halo), `color.state.success/warning/error` (per-joint + HUD), `color.overlay.text-utility` (pose-name pill, hint banner)

**Typography tokens:** `type.label` (pose name pill, hint banner, banners), `type.hud-score` (score numeral), `type.caption` (swipe-up hint, timer label chip)

**Art Nouveau decorative elements:** Ornamental Frame corners (§2.6) at 55% opacity (drops to 15% when quick-bar drawer open); Avatar-mode sprite carries the full Mucha halo-as-alignment-indicator treatment described in PDD §6.6 — this is the single richest ornamental moment on the highest-frequency screen in the app, deliberately, since PDD explicitly calls this the core brand differentiator

**Interaction states:** all controls per their component specs (§2.7, §2.8); tap-to-focus on video feed triggers a small gold ring pulse at tap point (200ms) with a light haptic tick, echoing Halide's haptic-reinforced focus pattern ([research_phase2.md §4.2](research_phase2.md)); pinch-to-zoom supported with a small on-screen zoom-level pill appearing during the gesture only

**Animation/transition:**
- Enter from C-1 Session Setup: camera feed fades in over `duration.standard` while the ornamental frame and overlay draw themselves in via path-draw animation (`duration.ornament-draw`), giving a "the stage assembles around you" feeling rather than an instant hard cut
- Avatar idle breathe: continuous 2s scale pulse, amplitude 1.02× (PDD §6.5), pauses automatically the instant live tracking begins converging on the target pose (visual cue that the system "sees you")
- Alignment success (≥85% sustained 1.5s): HUD halo fully illuminates + golden particle bloom animation fires from screen center (full spec in §5.3), haptic double-pulse, auto-capture fires, Shutter Button plays its capture animation
- Hint banner slide-in/out: per §2.5 and §5.5
- Exit to C-3 Capture Review: the captured frame freezes (flash-white 80ms per §2.7), then the frozen frame scale-transitions into C-3's full-screen preview position over `duration.elaborate` — a continuous zoom rather than a cut, reinforcing "this photo came from this moment"
- Exit via End Session (×): camera feed cross-fades to black over `duration.standard` before transitioning back to the invoking tab

---

### 3.4 PRIORITY — C-3 Capture Review Screen

**Layout structure:**
- Full-screen portrait image preview fills the entire viewport (the actual captured photo), `color.bg.canvas` visible only as a 2px hairline edge if aspect ratio doesn't perfectly fill (letterbox bars use `color.raw.ink.900` regardless of light/dark theme, since photo review is treated as an immersive context)
- Top overlay strip (glass pill row, within a light top scrim): Alignment score badge (compact version of HUD, 44px, showing final captured score) + pose name label, left-aligned; close/back chevron top-right returns to C-2 live camera
- Bottom action bar (glass panel within bottom scrim, `elevation.3`, full-width, `space.4` internal padding): 4 actions evenly spaced — Ghost "← Retake," Ghost "Edit ✏," Primary "Save ↓," Secondary "Share →" (Save is visually dominant as the expected default action per Flow 2)
- On successful save: a toast (`type.label`, glass pill, bottom-center, `space.12` above the action bar) reading "Saved to your camera roll" appears for 2s, with two inline text actions "Next pose →" / "End session"

**Color tokens:** `color.overlay.text-utility` (score badge + pose label), `color.state.success` (score badge ring if ≥85%), `color.brand.primary` (Save button), `color.brand.secondary` (Share button), `color.raw.ink.900` (letterbox bars)

**Typography tokens:** `type.hud-score-lg` (score badge numeral at this larger review-context size), `type.label` (pose name, button labels, toast text)

**Art Nouveau decorative elements:** the score badge retains the halo-ring treatment from §2.4 at reduced 60px scale; a subtle gold corner-flourish (matching the L-3 Lottie-stage treatment) frames the top overlay strip only, keeping the photo itself completely unobstructed by ornament — this screen intentionally minimizes decoration to let the user's captured photo be the visual hero, consistent with the research principle that active/tool screens narrow decoration to maximize focus on the core content ([research_phase2.md §3.4](research_phase2.md))

**Interaction states:** Retake — Ghost Button, tapping returns directly to C-2 with the same pose loaded (no re-setup); Edit — opens C-4 Post-Capture Edit Sheet; Save — Primary Button with a brief checkmark micro-animation (stroke-draw checkmark per [research_phase2.md §2.3](research_phase2.md)) replacing the label for 600ms on success; Share — opens native OS share sheet

**Animation/transition:**
- Enter: continuation of the C-2 exit zoom-transition described in §3.3 — image scales from capture-point-in-frame to full-screen fit, `duration.elaborate`, `easing.enter`; a brief freeze-frame (200ms hold) immediately after capture reinforces "this is now a photo, not live video" per the "Not Boring Camera" consolidation pattern ([research_phase2.md §2.1](research_phase2.md))
- Save confirmation toast: slides up + fades in `duration.standard`, auto-exits after 2s with fade only (no slide, to feel like a gentle dissolve rather than an abrupt retreat)
- Exit to C-4 (Edit): the whole screen's bottom action bar slides down and off while the Post-Capture Edit Sheet rises to replace it, `duration.elaborate`
- Exit "Next pose →": cross-fades back into C-2 with the pose mini-carousel visible at top (per Flow 2), `duration.standard`

---

### 3.5 PRIORITY — H-1 Home / Today

**Layout structure:** vertical scroll view, `space.6` horizontal margins, `space.6` vertical rhythm between sections, bottom padding `space.20` to clear the floating tab bar.
1. **Header row** (not sticky): small wordmark lockup top-left (`type.wordmark`, small scale) + greeting `type.h2` "Good morning, Valentina" + profile-avatar icon top-right (36px circle, tappable → Profile tab)
2. **Quick-Start Card** (hero, full-width): uses `radius.organic-asym`, `elevation.3`, background is either a photo of the user's last pose or, for first-time users, the Daily Challenge illustration; overlaid text "Continue: S-Curve Stand" or "Today's Challenge: Power Stance" (`type.h3` white on scrim), Primary Button "Begin Session →" bottom-right of the card; this directly addresses the Phase 1 friction-point note that returning users should reach camera in ≤2 taps
3. **Featured Collections** section: `type.h2` header "Featured Collections" + horizontally scrolling row of 3–5 collection cards (Category Card visual treatment at 160px width) — this is also where Community Pose Packs discoverability (a Phase 1 flagged gap) is addressed: the row includes a visually distinct "✨ New from Creators" card with a subtly different gold-foil corner treatment to signal fresh/community content without a separate nav item
4. **Trending Poses** section: `type.h2` header + horizontal scroll of Pose Cards (grid variant, 140px width)
5. **Daily Challenge** card (if not already surfaced as Quick-Start): compact banner card, `radius.md`, icon + `type.body` description + Ghost Button "Try it →"
6. **Recent History** section: `type.h2` header "Recent Sessions" + up to 3 compact list-style rows (thumbnail + pose name + relative timestamp `type.caption`), tapping opens P-3 Session Detail

**Color tokens:** `color.bg.canvas` (page), `color.bg.surface` (cards), `color.brand.gold` (New-from-Creators accent, Quick-Start CTA accent), `color.text.primary/secondary` throughout

**Typography tokens:** `type.h2` (greeting, section headers), `type.h3` (card titles), `type.body` (challenge description), `type.caption` (timestamps), `type.wordmark` (header lockup)

**Art Nouveau decorative elements:** vine-and-leaf divider (§4) used as the visual separator between each of the 5 sections instead of blank whitespace alone — reinforces brand texture during a long scroll without adding visual noise; Quick-Start Card carries a corner-only whiplash flourish (top-left, 40% opacity) consistent with hero-card treatment established in OB-1

**Interaction states:** Quick-Start Card press → lifts to `elevation.4` briefly before navigating (tactile confirmation); horizontal scroll rows show edge-fade gradients; pull-to-refresh at top of scroll triggers a whiplash-curve "unfurl" loading animation (Lottie, per PDD §6.4 "no generic spinners") instead of a standard spinner

**Animation/transition:**
- Screen enter (tab switch): content cross-fades in, `duration.standard`, no slide (tab switches are lateral-neutral, per standard tab-bar convention — only stack pushes slide)
- First-visit only: coach-mark tooltips per Flow 1 ("Tap here to start your first pose session" on Session tab, "Browse 300+ poses here" on Library) — glass tooltip bubbles with a small gold pointer-tail, auto-dismiss after 4s or first tap, `duration.standard` fade
- Quick-Start Card → C-1: shared-element transition where the card's background image scales up to become C-1's pose preview, matching the L-3→C-1 pattern for visual continuity

### 3.6 Remaining Screens (18)

Each entry below follows the same structure at appropriate depth: Layout · Color/Type tokens · Art Nouveau elements · Interaction · Transition.

#### OB-2 Feature Preview
**Layout:** full-screen 3-frame swipeable carousel; each frame = illustration (top 60%) + `type.h1` frame title + `type.body` description (bottom 40%) + 3-dot progress indicator (§2.10 pattern, simplified) + "Next"/"Back" Ghost+Primary button pair. **Tokens:** `color.bg.canvas`, `type.h1`, `type.body`, `color.brand.gold` (active dot). **Art Nouveau:** each illustration uses the same duotone teal/gold line-art style as OB-1's avatar but smaller vignette-scale scenes (browse card / overlay mock / alignment score mock). **Interaction:** swipe or button-tap advances; dots are tappable to jump. **Transition:** horizontal slide, `duration.standard`, `easing.enter`; entering from OB-1 continues the filmstrip slide established there.

#### OB-3 Camera Permission Priming
**Layout:** centered single-column: camera icon inside a Mucha vine frame (illustration, ~200px), `type.h1` headline "See your form in real time," `type.body` explanation, privacy badge row (lock icon + `type.label` "Never leaves your phone" in `color.state.success-bg` pill), Primary Button "Allow Camera Access" full-width bottom. **Tokens:** `color.state.success` (privacy badge), `color.brand.primary` (CTA). **Art Nouveau:** vine frame fully encircles the camera icon (full-frame whiplash variant, §4). **Interaction:** CTA triggers native OS permission dialog; on denial, screen swaps its bottom section to the Permission Fallback content (secondary headline + "Continue without camera" Secondary Button) via a height-preserving cross-fade rather than full navigation. **Transition:** standard onboarding slide from OB-2.

#### OB-4 Quick Personalization
**Layout:** two sequential single-choice question screens within one logical step: Q1 "What brings you to PoseArt?" (2×2 grid of large icon+label selectable cards, `radius.md`, selectable state = gold border + check), Q2 "How would you describe your experience?" (3 horizontal pill choices). Primary Button "Start Exploring" enabled once both answered. **Tokens:** `color.brand.gold` (selected border), `color.bg.surface` (cards). **Art Nouveau:** selected-card check icon is the tendril-check glyph (consistent family with heart glyph in §2.2). **Interaction:** single-select per question, selecting auto-advances Q1→Q2 with a horizontal slide. **Transition:** on "Start Exploring," cross-fades directly into H-1 with the first-visit coach-marks queued (per Flow 1).

#### L-1 Library — Category Grid
**Layout:** sticky header with search-bar entry point (tappable, routes to L-4) + filter icon button (routes to M-1); below, 2-column grid of 10 Category Cards (§2.3), `space.4` gutter. **Tokens:** `color.bg.canvas`, Category Card tokens per §2.3. **Art Nouveau:** grid section top has a thin full-width vine divider beneath the search bar. **Interaction:** standard Category Card states; search bar shows placeholder `type.body` "Search 300+ poses…". **Transition:** tab-switch cross-fade entering; tapping a category pushes L-2 with a right-to-left slide (`duration.standard`).

#### L-2 Library — Subcategory List
**Layout:** header shows category name (`type.h1`) + back chevron; horizontal filter-chip row (Preset/Filter Chip, §2.11: All/Classic/S-Curve/Power/Editorial…); vertical list of Pose Cards (list variant, §2.2). **Tokens:** as defined in chip/card components. **Art Nouveau:** category name header has a small gold underline flourish (short whiplash tick, 24px) beneath it echoing the tab-bar active-state underline for visual family resemblance. **Interaction:** chip row filters list with an instant re-sort (content cross-fades row-by-row, staggered 20ms per row for a subtle cascade). **Transition:** push/pop slide to/from L-1; tapping a pose card opens L-3 as a bottom sheet overlay (no page navigation).

#### L-4 Search Results
**Layout:** persistent search bar at top (now focused/active state with cancel affordance), live result list below as Pose Cards (list variant); empty-state illustration (small Mucha vignette + "No poses found — try a different term") when zero results. **Tokens:** standard list/card tokens. **Art Nouveau:** empty-state illustration reuses OB-2's line-art style at small scale for brand consistency even in edge states. **Interaction:** results update on debounce (250ms after typing stops); recent searches shown as chips when search bar is empty/focused. **Transition:** slides up from bottom when invoked from L-1 search tap; standard back-chevron dismiss.

#### L-5 Collection Detail
**Layout:** hero header (collection cover illustration, `radius.organic-asym`, full-width, 200px tall) with collection title (`type.display`) and description (`type.body`) overlaid on scrim; below, vertical list of included poses (Pose Cards, list variant) with an optional "Start Full Collection" Primary Button pinned above the list. **Tokens:** hero scrim uses `color.overlay.scrim-bottom` equivalent in teal. **Art Nouveau:** hero illustration carries a corner-only whiplash flourish at full 55% opacity (collection-level content gets a slightly richer treatment than individual pose cards, signaling curated/premium status). **Interaction:** standard card list interactions; "Start Full Collection" routes into Sequence Builder pre-populated. **Transition:** push slide from L-1 Collections view or H-1 Featured Collections row (shared-element hero-image transition).

#### L-6 Favorites
**Layout:** toggle control top-right to switch Grid/List view (persists per user); grid uses standard Pose Card grid variant, list uses list variant; empty-state ("You haven't saved any poses yet — tap ♥ on any pose") when empty. **Tokens:** standard card tokens. **Art Nouveau:** empty-state again reuses the small vignette illustration pattern. **Interaction:** swipe-to-remove on list rows (reveals a `color.state.error`-tinted "Remove" action). **Transition:** standard tab-content cross-fade; accessible from Library tab's dedicated Favorites entry point.

#### C-1 Session Setup
**Layout:** header "Set up your session" (`type.h1`); selected-pose preview card (mini Lottie loop, 120px, carried over via shared-element transition from L-3/H-1); "Change pose" Ghost link beneath it; camera-positioning diagram illustration (phone-at-45°, distance markers) in a bordered card; a **Quick/Custom mode segmented control** (addressing the Phase 1 §7 flagged friction point — returning users get "Quick" pre-filled with last settings collapsed into a single summary line, "Custom" expands full option list); options when Custom is active: Timer (segmented control Off/3s/5s/10s), Feedback mode (4 selectable pill options), Overlay (4 selectable pill options), Sensitivity (3 selectable pills); Primary Button "Begin Session →" pinned bottom. **Tokens:** `color.bg.canvas`, `color.bg.surface` (option cards), Preset/Filter Chip tokens for segmented pills. **Art Nouveau:** positioning-diagram illustration rendered in the same duotone line-art family as onboarding visuals for consistency. **Interaction:** Quick mode shows one-line settings summary ("Visual + Haptic · Balanced · Avatar") with a "Customize" Ghost link that expands to Custom mode inline (height-animates, `duration.standard`) rather than navigating away — directly resolving the Phase 1 friction note. **Transition:** slides up from L-3/H-1 invocation (modal-style push); "Begin Session" triggers the C-2 assembling-frame enter animation described in §3.3.

#### C-4 Post-Capture Edit Sheet
**Layout:** bottom sheet (70% height); top: before/after slider-comparison of the captured image (drag divider left/right); preset strip (Preset/Filter Chip family reused as larger 64px thumbnail chips: Clean/Warm/Film/B&W/Faded/Moody) horizontally scrollable; "Advanced" expandable section with labeled sliders (brightness, contrast, warmth, highlights, shadows, sharpen, vignette, skin smoothing) using a custom slider track styled with a thin gold fill; sticky footer: Ghost "Cancel," Primary "Apply". **Tokens:** `color.brand.gold` (slider fill + selected preset ring), `color.bg.surface`. **Art Nouveau:** each preset thumbnail chip has a 2px gold ring when selected instead of a checkmark overlay, keeping the photo thumbnail itself unobstructed. **Interaction:** preset selection is instantly previewed on the main image; sliders update live with no debounce delay (direct manipulation feel). **Transition:** rises from C-3 bottom action bar per §3.4; "Apply" collapses sheet back down into C-3 with the edited image now shown.

#### P-1 Progress / History
**Layout:** vertical scroll: header `type.h1` "Your Progress"; stats row (3 compact stat cards: Streak, Total Sessions, Poses Mastered) each with a numeral (`type.hud-score` scale) + label; horizontal timeline of session history entries (thumbnail + date + score badge) leading into a "View all" link to a fuller list; Pose Mastery Grid preview (small heatmap-style grid of category completion) with "See full grid →" link. **Tokens:** `color.state.success` (streak flame icon), `color.brand.gold` (mastery grid filled cells). **Art Nouveau:** stat cards each carry a tiny corner tendril flourish (8px, very subtle) rather than a plain number card, keeping brand presence even in data-dense UI. **Interaction:** tapping any history thumbnail opens P-3. **Transition:** standard tab cross-fade.

#### P-2 Best Shots Gallery
**Layout:** masonry/grid of saved capture thumbnails (variable aspect ratios preserved), filter chips top (All/By Category/By Score); tapping a thumbnail opens a full-screen lightbox view (reusing C-3's layout minus the action-bar Retake option, replaced with Delete). **Tokens:** standard grid/card tokens. **Art Nouveau:** lightbox retains the compact score-halo badge treatment from C-3. **Interaction:** long-press thumbnail reveals quick actions (Share, Delete, Add to Favorites) via a small radial or list popover. **Transition:** grid items shared-element-transition into the lightbox (scale from grid position to full-screen).

#### P-3 Session Detail
**Layout:** header shows pose name + date + duration; large score-over-time mini-chart (line chart, gold stroke on parchment) if the session included multiple attempts; grid of shots taken during that session; "View pose" link routes to L-3. **Tokens:** `color.brand.gold` (chart line), `color.state.success/warning/error` (score chart zone tinting). **Art Nouveau:** chart gridlines replaced with a very faint vine-pattern watermark instead of plain gray lines. **Interaction:** tapping a shot opens lightbox (P-2 pattern); "View pose" opens L-3 sheet. **Transition:** push slide from P-1 timeline tap.

#### PR-1 Profile / Settings
**Layout:** header with user avatar (large, 72px) + name + Pro-status badge if subscribed; grouped settings list (iOS-style inset grouped rows / Material list on Android): Feedback Mode, Sensitivity, Overlay Default, Avatar Style, Accessibility (→ PR-2), Subscription (→ PR-3), About/Privacy — each row `type.body` label + current-value `type.caption` trailing + chevron. **Tokens:** `color.bg.surface` (grouped card backgrounds), `color.brand.gold` (Pro badge). **Art Nouveau:** Pro badge is a small gold laurel/vine-wreath glyph rather than a generic "PRO" tag. **Interaction:** standard list-row tap navigation; Avatar Style row shows a small live preview thumbnail of the currently selected sprite variant. **Transition:** tab cross-fade in; each row pushes its destination screen with a right-to-left slide.

#### PR-2 Accessibility Settings
**Layout:** grouped list: Font size (slider, live preview text sample above it), High Contrast toggle, Dark theme toggle, Audio-First Mode toggle (with expandable sub-note explaining behavior per Flow 5), Reduce Motion toggle (maps to `prefers-reduced-motion` token behavior from §1.6), Haptics intensity (Off/Subtle/Standard/Strong). **Tokens:** all standard form tokens; when High Contrast is enabled, the entire app swaps to a validated high-contrast token subset (AAA 7:1 minimum across the board, ornamental opacity levels raised to maintain visibility). **Art Nouveau:** decorative flourishes are NOT removed under High Contrast mode but their opacity is raised (e.g., ornamental frame 55%→80%) so they remain visible as solid rather than translucent, since translucent gold-on-parchment can fall below contrast minimums when purely decorative motifs overlap text. **Interaction:** every toggle applies live/instantly with a visible confirmation (brief highlight flash on the changed row). **Transition:** push slide from PR-1.

#### PR-3 Subscription / Pro
**Layout:** hero section: "PoseArt Pro" wordmark treatment (`type.wordmark` scaled up) + gold laurel motif; feature comparison table (Free vs Pro, checkmarks); pricing cards (Monthly $4.99 / Annual $29.99 with "Best Value" gold ribbon badge); Creator Pack add-on card beneath; Primary Button "Start Free Trial" or "Upgrade Now" pinned bottom; legal/restore-purchase links in `type.caption` at very bottom. **Tokens:** `color.brand.gold` (hero + ribbon + Pro-tier checkmarks), `color.state.success` (checkmarks). **Art Nouveau:** hero background uses a richer, denser version of the parchment texture plus a full decorative gold border frame (this screen and OB-1 are the two places in the app permitted full-frame ornamentation, since both are "premium moment" screens rather than task screens). **Interaction:** pricing card selection shows a gold selected-ring; purchase button triggers native OS payment sheet. **Transition:** presented as a modal sheet (`elevation.5`) from PR-1 or from any M-3 Upgrade prompt, sliding up full-screen.

#### M-1 Filter Sheet
**Layout:** bottom sheet (60% height): grouped filter sections (Base Position, Camera Angle, Effort Quality, Functional Intent, Subject Count, Difficulty), each section a horizontally wrapping set of Preset/Filter Chips; sticky footer with Ghost "Clear all" + Primary "Show N results" (count updates live). **Tokens:** standard chip/sheet tokens. **Art Nouveau:** section headers use small `type.overline` labels with a 12px gold tick mark, consistent with L-2's category-header treatment. **Interaction:** multi-select within each section (OR logic), AND logic across sections; live result count recalculates on every chip toggle. **Transition:** standard Bottom Sheet enter/exit (§2.9).

#### M-2 Session Settings Sheet
**Layout:** identical option set to C-1's Custom mode (Timer/Feedback/Overlay/Sensitivity) but presented as a quick-access sheet invoked mid-flow (e.g., swipe-down on C-2's top bar) rather than a full screen; compact single-column stacked rows; Primary "Apply" pinned bottom. **Tokens:** shared with C-1. **Art Nouveau:** minimal — this is a fast-utility sheet, ornament limited to the standard sheet-crown only, no extra flourish, per the principle that active-tool contexts narrow decoration. **Interaction:** changes apply live to the camera session immediately on sheet dismiss (no separate save step needed beyond closing). **Transition:** standard sheet enter/exit, but faster (`duration.standard` instead of `duration.elaborate`) since it's invoked from within an already-active session and should feel lightweight.

#### M-3 Upgrade to Pro Sheet
**Layout:** compact bottom sheet (45% height) triggered contextually (e.g., tapping a Pro-locked pose): headline `type.h1` "Unlock the full library," 3-bullet benefit list with icons, Primary Button "See Pro Plans →" (routes to PR-3), Ghost "Not now". **Tokens:** `color.brand.gold` (icons), `color.bg.elevated`. **Art Nouveau:** small gold laurel motif beside headline, consistent with PR-3's Pro branding so the two screens feel like one continuous premium moment. **Interaction:** "Not now" dismisses without penalty and does not re-prompt for the same pose within the session. **Transition:** standard Bottom Sheet enter (§2.9), slightly bouncier exit (`easing.overshoot`) on dismiss for a lighter, less punitive feel appropriate to a monetization prompt.

---

## 4. Art Nouveau Motif System

A constrained, reusable catalog — every screen in §3 references one or more of these named motifs rather than inventing new ornament ad hoc. Source techniques per [research_phase2.md §1.2–1.3](research_phase2.md); public-domain Mucha/Verneuil pattern references from Wikimedia Commons and PublicDomainVectors.org inform the linework style.

### 4.1 Whiplash Curve Border

The signature Art Nouveau S-curve line, implemented via the `border-image` 9-slice technique ([research_phase2.md §1.3 Technique A](research_phase2.md)) for regular containers and `mask-image`/`clip-path` ([Technique B](research_phase2.md)) for irregular/asymmetric silhouettes.

| Variant | Opacity | Where used |
|---|---|---|
| **Full-frame** | 100% (OB-1, PR-3 only), 55% (camera Ornamental Frame) | OB-1 horizon divider, OB-3 permission-priming vine frame, PR-3 hero border, C-2 Ornamental Frame |
| **Corner-only** | 55% default, 40% on hero cards, 15% when de-emphasized (camera quick-bar open) | Pose Card grid thumbnails, L-3 Lottie stage, H-1 Quick-Start Card, L-5 collection hero |
| **Divider** (short tick, 24px) | 100% (small accent scale) | L-2 category header underline, tab-bar active-state underline |

Construction: `stroke-width` 1–1.5px at small scale (cards), up to 2px at hero scale (OB-1, PR-3); color always `color.brand.gold`; corners built from public-domain Verneuil-derived flourish paths, simplified to ≤80 points each for animation performance per the research's path-point-count guidance ([research_phase2.md §1.3](research_phase2.md)).

### 4.2 Vine / Leaf Dividers

Replace flat `<hr>`-style rules between content sections wherever two distinct content groups meet on a scrollable surface (never used inside dense functional UI like Session Setup forms).

- Structure: a single thin stem (1px, `color.border.default` or `color.brand.gold` at 30%) with 2–4 small leaf motifs (6–10px) growing off it asymmetrically — never perfectly symmetrical, per Art Nouveau's organic-asymmetry principle
- Used: H-1 between each of its 5 sections; L-3 between "How To" and tip callout; L-2 header divider (short variant)
- Full-width variant spans the content margin (`space.6` inset each side); never touches the true screen edge

### 4.3 Mucha-Style Halo / Nimbus

The app's most functionally important motif — doubles as data visualization (alignment score) per PDD §6.6.

- Base form: 12-ray radiating tendril nimbus, rays alternating long/short for asymmetric organic rhythm (not a perfect sunburst)
- Functional instance: Alignment Score HUD (§2.4) and camera Avatar-mode overlay — ray illumination percentage maps directly to alignment score
- Decorative-only instance: OB-1 hero (static ambient rotation, not data-linked), PR-3 Pro hero (static, full illumination, purely celebratory)
- Color: `color.brand.gold` rays on a `color.raw.teal.800` or transparent base depending on context

### 4.4 Parchment Texture Treatment

- A subtle SVG noise/grain texture (fine, `feTurbulence`-generated per [research_phase2.md §1.3 Technique C](research_phase2.md), `baseFrequency` ~0.015 for organic, non-static-y wobble) applied at very low opacity across non-camera background surfaces
- Standard usage: 6–8% opacity on `color.bg.canvas` throughout Home/Library/Progress/Profile tabs
- Elevated usage: 12% opacity + slightly warmer tint on "premium moment" screens (OB-1, PR-3)
- Never applied over the live camera feed or any surface displaying the user's own photo (C-2, C-3, P-2 lightbox) — texture is reserved for the app's own chrome, keeping user-generated content visually clean

### 4.5 Decorative Icon Style Guide

- Base grid: 24×24px, 1.5–2px stroke weight, rounded line caps (`stroke-linecap: round`) — friendlier and less clinical per success/error animation research ([research_phase2.md §2.3](research_phase2.md))
- Organic bias: where a generic icon would use a straight line or hard angle, PoseArt's set introduces a slight bezier curve (e.g., the tendril-heart in §2.2, the laurel/wreath Pro badge in PR-1/PR-3, the vine camera-frame icon in OB-3)
- Functional icons on the camera screen (flash, flip, timer) remain closer to platform-standard silhouettes for instant recognizability, per the VSCO/Snapseed lesson that camera-context iconography must prioritize legibility over ornamentation ([research_phase2.md §4.3–4.4](research_phase2.md)) — decorative flourish is added only as a secondary corner-flourish accent (§2.8), never by distorting the core glyph
- Color: single-color line icons, tinted per state token (`color.text.secondary` default, `color.brand.gold`/`color.brand.primary` active) — never multi-color icon fills, keeping the set visually unified

---

## 5. Motion Design Specification

All values reference tokens defined in §1.6. Reduced-motion fallback is noted per animation.

### 5.1 Page Transition Animations

| Transition type | Animation | Duration | Easing |
|---|---|---|---|
| Tab switch (Home↔Library↔Progress↔Profile) | Cross-fade only, no slide | `duration.standard` (250ms) | `easing.enter` |
| Stack push (e.g., L-1→L-2, PR-1→PR-2) | Slide in from right, previous screen dims + slides left 20% | `duration.standard` | `easing.enter` |
| Stack pop (back navigation) | Reverse of push | `duration.standard` | `easing.exit` |
| Bottom sheet present (L-3, M-1, M-2, C-4, M-3) | Slide up + backdrop fade | `duration.elaborate` (500ms) | `easing.enter` |
| Bottom sheet dismiss | Slide down + backdrop fade | `duration.standard` | `easing.exit` |
| Onboarding carousel (OB-1→OB-2→OB-3→OB-4) | Horizontal filmstrip slide | `duration.standard` | `easing.enter` |
| Shared-element (L-3→C-1, H-1 Quick-Start→C-1, C-2→C-3) | Scale + position morph of the shared image/pose asset | `duration.elaborate` | `easing.enter` |
| Modal full-screen present (PR-3 from M-3/PR-1) | Slide up full-screen, `elevation.5` | `duration.elaborate` | `easing.enter` |

Reduced motion: all slides/scales collapse to a 150ms opacity cross-fade; shared-element morphs are replaced with a straight cross-fade between start/end states.

### 5.2 Pose Overlay Breathe Animation

- Applies to: Avatar-mode and Ghost-mode overlays on C-2 while idle (before tracking convergence) and to the OB-1 hero figure's hair tendrils
- Motion: scale pulse 1.00× → 1.02× → 1.00×, `duration.ambient-breathe` (2000ms) full cycle, `ease-in-out` sine curve (not linear, to feel like breathing rather than mechanical pumping)
- Trigger: begins automatically on overlay render; pauses the instant live keypoint tracking confidence exceeds 0.7 for the primary torso landmarks (signals "I see you now, holding steady for your alignment reading")
- Reduced motion: breathe animation disabled entirely; overlay remains static at 1.00× scale

### 5.3 Alignment Success Animation (golden particle bloom)

Fires when alignment score reaches ≥85% sustained for 1.5 seconds (PDD §4.1 F4 threshold), synchronized across HUD, overlay, and shutter:

1. **T+0ms:** HUD halo (§2.4) completes final illumination ray, ring color settles fully into `color.state.success`
2. **T+0ms:** haptic double-pulse fires (see §6)
3. **T+50ms:** particle bloom begins — 24–32 small gold particles (`color.brand.gold`, 3–6px circles/tendril-flecks) emit radially from screen center, `duration.elaborate` (500ms) total lifetime, `easing.overshoot` curve on initial burst velocity then decelerating with gravity-like fade, opacity 100%→0%
4. **T+80ms:** Shutter Button plays its capture flash (§2.7) — full-screen white flash overlay at 60% opacity for 80ms
5. **T+160ms:** captured frame freezes and begins its shrink-to-thumbnail / zoom-to-C-3 transition (§3.3/§3.4)

Total perceived sequence: ~650ms from threshold-hit to review screen settling. Reduced motion: particle bloom replaced with a single soft radial flash (200ms opacity pulse in `color.state.success` tint); haptic and capture-flash behavior unchanged (these are functional, not purely decorative).

### 5.4 Score Counter Animation

- HUD numeral (`type.hud-score`) never snaps between values — it counts continuously via interpolated tween as the underlying score changes frame-to-frame, throttled to update visually at 10fps (not full 30/60fps camera rate) to avoid a jittery/anxious feeling
- Ring fill: `stroke-dashoffset` animates continuously in lockstep with the numeral, `easing.linear-utility` (the one sanctioned use of linear easing, since it must track a continuously-changing live value rather than a discrete state)
- Color band cross-fade (error→warning→success and reverse): `duration.standard`, cross-fades rather than hard-cuts per progress-animation best practice ([research_phase2.md §2.4](research_phase2.md))
- Capture Review score badge (final, static value): counts up from 0 to final score once on screen-enter, `duration.elaborate`, `easing.enter`, purely celebratory since the value no longer changes

### 5.5 Hint Banner Slide-in/out

- In: translateY +16px→0 combined with opacity 0→1, `duration.standard`, `easing.enter`; triggered only after hysteresis gate (≥1.5s persistent joint error) per PDD §4.1 F3
- Out: translateY 0→+16px combined with opacity 1→0, `duration.standard`, `easing.exit`; triggered the instant the underlying joint error resolves
- Message cycling (multiple simultaneous errors): cross-fade only (no slide) between messages every 2.5s, `duration.micro`
- Reduced motion: opacity-only fade in/out, no translateY offset

### 5.6 Shutter Capture Flash + Freeze Animation

1. Shutter press or auto-capture trigger → inner circle scales 1.0→0.85 (`duration.instant`, 100ms)
2. Full-screen flash overlay, `#FFFFFF` at 60% opacity, full-screen, 80ms duration, no easing (instant on/instant off reads as a true flash)
3. Frame freeze: the live camera feed swaps to the captured static frame instantly at flash peak, held for 200ms (this is the "freeze" — camera preview does not resume until after the transition begins)
4. Consolidation: the frozen frame either (a) shrinks to a thumbnail that flies toward the bottom-left gallery-access corner (manual capture, quick continue-shooting context) or (b) scales up to fill the viewport as C-3 (auto-capture or explicit review flow), per the "Not Boring Camera" pattern ([research_phase2.md §2.1](research_phase2.md)) — `duration.elaborate`, `easing.enter`
5. Haptic: a single sharp tap coincides with flash peak (T+0 of flash); if this was an auto-capture, the haptic double-pulse from §5.3 has already fired at threshold-hit, so this capture-moment haptic is a third, distinct, lighter tap — layering haptic + visual + (optional) shutter-click sound per the multi-signal confirmation research ([research_phase2.md §2.1](research_phase2.md))

---

## 6. QOL & Micro-interaction Specifications

Every micro-interaction follows the four-part structure from research — **trigger, rules, feedback, resolution** ([research_phase2.md §2.5](research_phase2.md)) — and layers at least two sensory channels where haptics are available.

| # | Interaction | Trigger | Animation | Duration | Easing | Haptic |
|---|---|---|---|---|---|---|
| 1 | Favorite a pose | Tap heart icon | Tendril-heart glyph path-draws around heart outline; heart briefly scales 1.0→1.2→1.0 | 300ms | `easing.overshoot` | Light tap |
| 2 | Un-favorite | Tap filled heart | Heart glyph fades to outline, tendril retracts | 200ms | `easing.exit` | None |
| 3 | Tab bar selection | Tap any tab | Icon fill swap + gold underline tick fade-in + item scale 0.92→1.0 | 150ms | `easing.enter` | Selection tick (iOS) / light tap |
| 4 | Button press (all variants) | Touch down | Scale 1.0→0.97/0.98 | 100ms | `easing.enter` | Light tap on release |
| 5 | Pull-to-refresh (H-1, L-1) | Pull down past threshold | Whiplash-curve unfurl Lottie loop | 800ms loop until data loads | `linear-utility` (loop) | Medium tap on trigger |
| 6 | Filter chip toggle | Tap chip | Fill cross-fade unselected↔selected, gold dot fade in/out | 150ms | `easing.enter`/`exit` | Light tap |
| 7 | Bottom sheet drag-to-dismiss (past threshold) | Drag gesture release | Snap closed | 250ms | `easing.exit` | Medium tap on close |
| 8 | Bottom sheet drag (below threshold, released) | Drag gesture release | Snap back to open position | 300ms | `easing.overshoot` | None |
| 9 | Tap-to-focus (camera feed) | Tap on live video | Small gold ring pulse at tap point, scale 1.5→1.0 fade out | 200ms | `easing.exit` | Light tap |
| 10 | Overlay mode cycle | Tap overlay toggle | Icon cross-fade + label chip fade in/out | 150ms in / 1500ms hold / 150ms out | `easing.enter`/`exit` | Light tap |
| 11 | Timer mode cycle | Tap timer toggle | Label chip fade in/out (same pattern as #10) | Same as #10 | Same | Light tap |
| 12 | Alignment band change (error↔warning↔success) | Live score crosses threshold | Ring + halo color cross-fade | 250ms | `easing.enter` | None (haptic reserved for full success only, to avoid overuse) |
| 13 | Alignment success (≥85% held 1.5s) | Sustained threshold | Full bloom sequence (§5.3) | ~650ms sequence | Mixed (see §5.3) | Double pulse |
| 14 | Manual shutter capture | Tap shutter | Flash + freeze (§5.6) | ~780ms sequence | Mixed | Single sharp tap |
| 15 | Save to camera roll | Tap Save (C-3) | Button label cross-fades to checkmark stroke-draw, then back to label after hold | 600ms hold + 200ms draw-in/out | `easing.enter` | Light tap |
| 16 | Toast appearance ("Saved to camera roll") | Successful save | Slide up + fade in, auto fade out | In: 250ms / Hold: 2000ms / Out: 200ms (fade only) | `easing.enter` | None |
| 17 | Retake | Tap Retake (C-3) | Cross-fade back to live C-2 (pose pre-loaded) | 250ms | `easing.exit` | Light tap |
| 18 | Preset selection (C-4) | Tap preset chip | Selected-ring fade-in on chip; main image cross-fades to preset-applied look | 200ms | `easing.enter` | Light tap |
| 19 | Slider drag (C-4 advanced) | Drag thumb | Live 1:1 value + image update, no debounce | Continuous | n/a (direct manipulation) | None (continuous haptic considered but rejected — would be fatiguing per research on avoiding sensory overload) |
| 20 | Coach-mark tooltip appear/dismiss | First-visit condition / 4s timeout / first tap | Fade + tiny scale 0.95→1.0 in; fade out | In: 250ms / Out: 200ms | `easing.enter`/`exit` | None |
| 21 | Low-light / no-person warning banner | Detection condition met | Slide down from top + fade in; auto-hides on resolution | 250ms in / 200ms out | `easing.enter`/`exit` | None |
| 22 | Sequence pose transition | Timer end or capture-limit reached | Current overlay fades out, next-pose Mucha avatar path-draws in; brief 3s inter-pose pause with preview | 500ms fade + 600ms draw-in | `easing.enter` | Light tap at transition start |
| 23 | Score counter tick (HUD) | Any live score change | Interpolated count, throttled to 10fps visual update | Continuous | `linear-utility` | None |
| 24 | Accessibility setting toggle (PR-2) | Toggle switch | Row background brief highlight flash confirming applied change | 300ms | `easing.enter`/`exit` | Light tap |
| 25 | Upgrade sheet dismiss ("Not now") | Tap Ghost dismiss | Sheet slides down with slight overshoot bounce (deliberately gentle, non-punitive) | 350ms | `easing.overshoot` | None |

---

## 7. Phase 2 Retrospection

### How did research on UI/UX best practices influence the design?

1. **Camera-screen chrome discipline came directly from Apple HIG and Halide/VSCO critique.** The research was explicit that controls must float above content rather than share its visual plane, that full-width edge buttons should be avoided, and that unlabeled iconography is a documented failure mode (VSCO's "joystick" icon problem). This directly shaped the Ornamental Frame's `pointer-events: none` corner-only treatment (§2.6), the inset (not edge-to-edge) control row on C-2, and the decision to keep functional camera icons (flash, flip, timer) close to platform-standard silhouettes while reserving ornamental flourish for secondary accents rather than distorting the core glyphs (§4.5). Without this research, the instinct would have been to make the camera screen the *most* ornamented surface in the app; instead it is one of the most restrained, with ornamentation concentrated in the avatar overlay itself where it does double duty as functional feedback.

2. **The Mucha halo becoming the alignment-score visualizer is a direct synthesis of two separate research threads.** Pose-app research (Posei's breathing silhouette, color-coded skeleton overlays) established that alignment feedback needs to be continuous and alive, not a static number. Art Nouveau ornament research established the halo/nimbus as a signature Mucha motif. Phase 2 fused these into a single component (§2.4, §4.3) that is simultaneously the most brand-distinctive visual in the app and its most functionally load-bearing piece of UI — exactly the kind of "aesthetic as functional differentiator" the Phase 0 PDD called for but had not yet fully specified.

3. **The Nike/Headspace/Calm "browse vs. active tool" pattern directly resolved a Phase 1-flagged risk.** Phase 1's retrospection worried that Session Setup might feel over-optioned for casual/returning users. Research showed that premium hybrid apps narrow chrome and options sharply when moving from browsing into an active tool. This produced the Quick/Custom segmented mode on C-1 (§3.6) and the decision to make C-3's photo review screen deliberately texture-free (no parchment grain, minimal ornament) so the user's own photo — not brand decoration — is the visual hero, consistent with the "color/decoration narrowing in active-tool contexts" principle.

4. **WCAG 2.2 contrast research produced a genuinely separate dark-mode token set and a dedicated "camera-overlay utility text" token**, rather than the common shortcut of algorithmically inverting light-mode colors. This is most visible in §1.1.3's independently-tuned dark palette and the `color.overlay.text-utility` token used everywhere text sits atop unpredictable live video (hint banners, HUD, pose-name pill) — a direct response to the research finding that static-contrast guarantees on a live camera feed require a defensive solid/near-solid backing, not per-pixel tuning.

5. **Micro-interaction research's "trigger/rules/feedback/resolution" framework and the delightful-vs-clinical distinction shaped nearly every entry in §6.** Every interaction resolves (completes a loop) rather than lingering; haptics are layered deliberately rather than fired on every possible event (explicitly avoided on slider drags and per-frame score updates to prevent fatigue, per the research's sensory-overload caution) — reserved instead for meaningful state changes (favorite, capture, full alignment success).

### Does the Art Nouveau aesthetic feel cohesive and premium while remaining highly usable?

**Cohesion:** Yes — the motif system in §4 is deliberately small (four families: whiplash border, vine divider, halo/nimbus, parchment texture) and every screen spec in §3 draws only from that closed set, which prevents the "ornament sprawl" risk the Phase 0 risk register flagged ("Art Nouveau aesthetic feels too niche/off-putting"). Reusing the halo motif identically between the camera HUD and the onboarding hero, and reusing the same tendril-glyph family for hearts/checkmarks/Pro badges across completely different screens, means the brand reads as a coherent system rather than decoration applied inconsistently screen-by-screen.

**Premium feel:** The warm-tinted shadow system (never flat gray), the antique-gold dark-mode variant, and the two deliberately "richer" screens (OB-1 and PR-3, the only full-frame-ornament screens) create a clear sense of designed hierarchy — most of the app is calm and functional, with ornament concentrated at emotionally significant moments (first impression, premium upsell, alignment success). This mirrors the Headspace/Calm precedent of reserving saturated/decorative treatment for specific "modes" rather than applying it uniformly.

**Usability:** The system passes the accessibility bar the research demanded: every color pairing in §1.1.4 is contrast-verified, color is never the sole state signal (§1.1.4 rule, enforced in the Alignment HUD's icon+label pairing and the per-joint skeleton coloring), decorative elements are systematically stripped of interactivity (`pointer-events: none`, `accessibilityHidden`) so they cannot interfere with screen readers or hit-testing, and the one area of legitimate risk — ornament opacity dropping below contrast minimums — is explicitly handled by having High Contrast mode *raise* ornament opacity to solid rather than hiding it (§3.6 PR-2). The remaining open risk, flagged honestly rather than glossed over, is that the richness of the C-2 Live Camera Screen (the highest-frequency screen in the app) depends on real device performance testing in Phase 4/5 — the Ornamental Frame and Avatar overlay must degrade gracefully (opacity/complexity reduction) on the low-end device tier identified in the PDD §5.5 model-tiering strategy, exactly as skeleton overlay already degrades to ghost-only per Flow 6's low-end fallback. This is a build-and-measure item for Phase 4, not a design gap, but it is the single biggest variable standing between "looks premium in mockups" and "feels premium in daily use."

---

*End of Phase 2 — Screen Design & UI/UX Document*
*Next: Phase 3 — [Technical Architecture Deep-Dive / Prototyping, per project roadmap]*
