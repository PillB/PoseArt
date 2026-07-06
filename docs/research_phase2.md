# Phase 2 Pre-Research: UI/UX & Art Nouveau Design System

*Compiled July 5, 2026*

This document consolidates research on Art Nouveau digital implementation, camera-app micro-interactions, hybrid content/tool design systems, mobile camera UI patterns, and accessibility — with concrete hex codes, font names, CSS properties, and SVG techniques for use in Phase 2 design work.

---

## 1. Art Nouveau in Digital/Mobile UI — Implementation Techniques

### 1.1 Typefaces (free + premium, with characteristics)

Art Nouveau type is best used for **display/headline text only** — ornamental complexity hurts legibility at small sizes. Pair with a restrained serif or humanist sans for body copy ([Made Good Designs](https://madegooddesigns.com/art-nouveau-fonts/)).

**Free / open options:**
| Font | Notes |
|---|---|
| Romantique | Flowing curves, decorative terminals; best for headlines/short blocks |
| Kingthings Tendrylle | Tendril-like curves, hand-drawn feel; display sizes only |
| Earwig Factory | Art Nouveau curves with more contemporary legibility |
| Morris Roman | Arts & Crafts cousin (William Morris); textured, medieval-organic |
| Quentin | Calligraphic script, Art Nouveau-adjacent flowing lines |
| Art Nouveau Caps | Decorative capitals-only; ideal for drop caps/monograms |
| Roquen | Simpler/subtler Art Nouveau display face |

Free repositories: DaFont, Font Squirrel ([Made Good Designs](https://madegooddesigns.com/art-nouveau-fonts/)).

**Premium references** (for inspiration/licensing budget): Arnold Böcklin (1904, swelling liquid strokes), Auriol (1901, brush-lettering, most readable historical option), Eckmann (German Jugendstil), Grasset (restrained, great for drop caps), Mucha-branded faces (bold/poster-style) ([Made Good Designs](https://madegooddesigns.com/art-nouveau-fonts/)).

**Google Fonts note:** No mainstream Google Fonts are purpose-built "Art Nouveau" faces; the closest widely-available web-safe options for pairing are:
- **Display/headline (organic flavor):** Playfair Display, Cormorant Garamond, Yeseva One, Abril Fatface — high-contrast serifs that echo Art Nouveau's calligraphic swelling strokes ([Figma Google Fonts](https://www.figma.com/google-fonts/)).
- **Body pairing:** Lora (calligraphic roots, well-balanced) or Josefin Sans (elegant geometric vintage feel) — both explicitly recommended as pairing partners for Cardo/Abril Fatface/Yeseva One-style display faces ([Figma Google Fonts](https://www.figma.com/google-fonts/)).
- For a lighter, more organic sans counterpart, Alice (serif, "whimsical meets structured") paired with Montserrat is cited as a strong combination for storytelling/branding contexts ([Shannon Payne](https://shannonpayne.com.au/20-free-google-font-pairings/)).
- TT Modernoir (TypeType) is explicitly described as blending "fluid lines and delicate Art Nouveau forms" — a commercial option if budget allows ([TypeType](https://typetype.org/fonts/google/)).

**Recommended pairing formula:** one ornamental/display serif (headlines, hero moments, section titles) + one humanist sans-serif or simple serif body font (Lora, Josefin Sans, or system font) to keep body text accessible while display text carries the Art Nouveau mood.

### 1.2 Free/Open Ornamental SVG Motif Libraries (Mucha/Art Nouveau style)

- **Wikimedia Commons — [Category: Art Nouveau typographic ornaments](https://commons.wikimedia.org/wiki/Category:Art_Nouveau_typographic_ornaments)** and **[Category: Typographic ornaments in SVG](https://commons.wikimedia.org/wiki/Category:Typographic_ornaments_in_SVG)** — public-domain SVGs, several directly sourced from Mucha/Auriol/Verneuil's 1901 pattern book *Combinaisons Ornementales* ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Art_Nouveau_ornament_inspired_by_a_work_from_Maurice_Verneuil.svg)).
- **[Category: SVG ornaments from Annuaire graphique](https://commons.wikimedia.org/wiki/Category:SVG_ornaments_from_Annuaire_graphique)** — period-accurate vector ornament set.
- **[FreeSVG.org – Art Nouveau tag](https://freesvg.org/tag/art-nouveau)** and specific assets like [Art Nouveau border](https://freesvg.org/art-nouveau-border) and [Art Nouveau ornament label](https://freesvg.org/art-nouveau-ornament-label) — public domain, ready-to-use frame/border SVGs.
- **[PublicDomainVectors.org – 174 free Art Nouveau vector ornaments](https://publicdomainvectors.org/en/free-art-nouveau-vector-ornaments)** — largest free single collection, includes SVG/AI/EPS.
- **[Vecteezy – Art Nouveau Border SVGs](https://www.vecteezy.com/free-svg/art-nouveau-border)** and [Art Nouveau Pattern SVGs](https://www.vecteezy.com/free-svg/art-nouveau-pattern) (454 matching assets) — free tier with attribution.
- **Huggingface [KappaNeuro/alphonse-mucha-style](https://huggingface.co/KappaNeuro/alphonse-mucha-style)** — open LoRA model if generating novel Mucha-style vector/illustration assets via AI is in scope.

### 1.3 CSS/SVG Techniques for Ornamental Borders

**Technique A — `border-image` + SVG (best for simple repeating ornament frames)**
```css
.ornate-frame {
  border: 24px solid;
  border-image-source: url(art-nouveau-border.svg);
  border-image-slice: 170;      /* symmetrical corner/edge slicing */
  border-image-repeat: round;   /* or 'stretch' for continuous vines */
}
```
`border-image-slice` cuts the source image into a 3×3 grid (4 corners, 4 edges, center); corners stay crisp while edges stretch/repeat/tile to fit any element size — ideal for scalable Mucha-style corner flourishes ([DEV Community](https://dev.to/jackharner/using-svg-as-a-border-with-css-57ib), [W3docs](https://www.w3docs.com/learn-css/border-image-slice)). Use the `fill` keyword to also show the ornament as a background wash behind content.

**Technique B — `clip-path` / `mask-image` with SVG (best for irregular organic silhouettes, e.g., whiplash-curve card edges or camera viewfinder cutouts)**
```css
.mucha-panel {
  -webkit-mask-image: url(nouveau-frame-mask.svg);
  mask-image: url(nouveau-frame-mask.svg);
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}
```
Masking lets organic whiplash curves cut into a rectangular container without the 9-slice constraint of `border-image`, which is important for true Art Nouveau asymmetry.

**Technique C — Inline SVG `<feTurbulence>` filters for organic/hand-drawn line quality**
`feTurbulence` + `feDisplacementMap` can add subtle waviness/hand-inked texture to otherwise clean vector strokes, mimicking Mucha's flowing linework and the "squigglevision" hand-drawn aesthetic ([MDN feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence), [Codrops SVG Filter Effects](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/), [CSS-Tricks Squigglevision](https://css-tricks.com/books/greatest-css-tricks/squigglevision/)). Keep `baseFrequency` low (~0.01–0.03) for subtle organic wobble rather than noise/static.

**Technique D — Path-draw animation for ornamental reveals**
Ornamental borders/dividers can "draw themselves in" using the classic dash trick: set `stroke-dasharray` to the path's total length (via `getTotalLength()`), set `stroke-dashoffset` to the same value, then animate to `0` ([CSSVG](https://cssvg.com/blog/animate-svg-icons), [SVG AI](https://www.svgai.org/blog/svg-path-animation-tutorial)). This works well for a Mucha-style vine or frame animating into place on screen transitions. Best practice: animation duration 0.6–3s, always provide a `prefers-reduced-motion` static fallback, and keep path point counts under ~200 for performance.

---

## 2. Micro-interactions & Animation for Camera Apps (2026)

### 2.1 Camera Shutter Animations
Modern shutter feedback layers multiple simultaneous signals rather than a single flash: haptic tap + brief full-screen flash/iris-close effect that **shrinks down into a thumbnail preview** ("Not Boring Camera" pattern) — this gives a satisfying sense of "capture consolidated into an object" ([60fps.design](https://60fps.design/shots/not-boring-camera-dial-swipe-interaction)). Skeuomorphic tactile motion (tick-mark dials with inertia, 3D perspective flips for zoom toggle) makes manual controls feel mechanical/premium rather than flat. The classic "camera click" sound is itself a manufactured micro-interaction on phones with no physical shutter — a reminder that **audio + haptic + visual** together confirm capture ([Envato Elements](https://elements.envato.com/learn/microinteractions-ux)).

### 2.2 Alignment / Pose Feedback (Success vs. Fail States)
Fitness/pose-guide apps converge on a **color-coded skeleton overlay** that changes hue based on real-time form/alignment score:
- Cyan / green / red mapped to good/borderline/poor form ("Neon Pose" app pattern) ([Google Play – Neon Pose](https://play.google.com/store/apps/details?id=com.justwitworks.neonpose)).
- **Auto-capture on alignment threshold**: e.g., Posei triggers capture automatically when alignment hits 85% held for 1.5 seconds, paired with haptic feedback and a **translucent white silhouette overlay** with subtle ambient (breathing/pulsing) animation to keep the guide feeling alive rather than static ([App Store – Posei](https://apps.apple.com/us/app/posei-ai-pose-camera-guide/id6763751241)).
- Technical implementation pattern: canvas/SVG overlay positioned via CSS z-index above a `<video>` feed; visibility/confidence scores per landmark (threshold commonly 0.5–0.8) drive whether a "please adjust" warning overlay is shown ([Create with Swift](https://www.createwithswift.com/detecting-body-poses-in-a-live-video-feed/), MediaPipe-based tutorial).
- Success confirmation should be a **brief, resolvable animation**, not a persistent state: e.g., a semi-transparent full-screen warning fades to a small "✔ All points detected – continue" confirmation once alignment is achieved.

### 2.3 Success/Fail State Animation (SVG techniques)
The dominant pattern for success/error micro-feedback is **stroke-draw animation**:
```css
.checkmark path {
  stroke-dasharray: 100;   /* = path length via getTotalLength() */
  stroke-dashoffset: 100;
  transition: stroke-dashoffset 0.3s;
}
.success .checkmark path { stroke-dashoffset: 0; }
```
A companion progress-ring often draws concurrently, then resolves into the checkmark/cross ([Codrops – Circular Progress Button](https://tympanus.net/codrops/2014/04/09/how-to-create-a-circular-progress-button/), [Animation Patterns](https://animationpatterns.art/animations/success-check-path-draw/)). Reference hex values from that Codrops pattern: success ring/fill `#1ECD97`, error `#FB797E` — useful as a starting palette for status states. Keep strokes `fill: none`, `stroke-linecap: round` for a friendlier, less clinical look, and transition opacity (0.1s) so icons "appear" crisply rather than fading in slowly.

### 2.4 Progress / Score Animations
Best practice checklist ([UXPin](https://www.uxpin.com/studio/blog/design-progress-trackers/)):
- Combine **3 signals simultaneously**: color (completed/current/upcoming), icon (checkmark vs. number), and a connecting fill bar/ring.
- Animate the fill continuously rather than snapping in discrete jumps; transition step-number → checkmark on completion.
- Use subtle color shifts (not hard cuts) to reinforce forward motion.
- For mobile, prefer compact "Step X of Y" indicators or a thin top-bar progress fill over horizontal steppers.

### 2.5 What Makes Feedback Feel Delightful vs. Clinical
Cross-referencing microinteraction theory ([Envato Elements](https://elements.envato.com/learn/microinteractions-ux)) and animation studios ([60fps.design](https://60fps.design/shots/alma-nutrition-score-progress-animation), [60fps.design – Duolingo](https://60fps.design/shots/duolingo-super-score-animation)):
- **Delightful** = subtle, immediate, purposeful; layered feedback (haptic + visual + optional sound); rounded/organic shapes and linecaps; personality-driven motion (bounce, ease-out overshoot) rather than linear easing; feedback that *resolves* (a loop that completes) rather than lingers.
- **Clinical** = single-channel feedback (visual only), linear/robotic easing, hard color cuts, no motion personality, feedback that persists without resolution or acknowledgment.
- Rule of thumb: microinteractions should have four parts — **trigger, rules, feedback, loop/mode** — and feedback should always be *immediate*.

---

## 3. Design Systems for Hybrid Content + Tool Apps

### 3.1 Nike Training Club (NTC)
- **Design principles** (per NTC's own design system): Simplicity ("less is more"), Clarity (clean bold layout, intentional whitespace for hierarchy), Functional (design emphasizes user actions so core functionality is immediately apparent) ([oscar-w.com NTC design system](http://www.oscar-w.com/projects/design-system)).
- **Color:** Black-and-white forms the foundation; color use is minimal and *functional* — a secondary accent palette is introduced specifically to make core actions/waypoints "immediately apparent," not for decoration ([oscar-w.com](http://www.oscar-w.com/projects/design-system)). Independent reviewers note the app is "mostly grayscale with occasional lime/volt green accent" ([Julia Atkins, Medium](https://juliaatkins.medium.com/nike-training-club-concept-reaching-your-fitness-goals-even-on-the-bad-days-5d890aab746d)).
- **Typography:** Trade Gothic LT Std — Bold Condensed No. 20 for headlines/emphasis, Trade Gothic LT Std Regular for body — simple, bold, intentional typesetting to create focus ([oscar-w.com](http://www.oscar-w.com/projects/design-system)).
- **Mode-shift pattern (browse → active workout):** The browsing/discovery screens (Workouts, Browse, Programs tabs) rely on full-bleed imagery and card-based filtering; the **active workout player** shifts to a large looping instructional video filling most of the screen, with voiceover, and a single bright accent-colored (green) checkmark CTA to advance moves — deliberately reducing UI chrome to keep focus on the physical action ([Adobe Blog UXperts](https://blog.adobe.com/en/publish/2017/04/18/uxperts-weigh-in-designs-we-love-april-edition)). Completion screens then reintroduce content-style layout (summary, stats, gamified trophies) ([ixd.prattsi.org critique](https://ixd.prattsi.org/2023/09/design-critique-nike-training-club-iphone-app/)).
- Nike's brand-level palette is intentionally minimal at the core: pure black `#000000` and white `#FFFFFF` are the canonical marks, with accent colors introduced contextually per product line rather than fixed ([ColorArchive – Nike](https://colorarchive.org/brands/nike/)).

### 3.2 Headspace
- **Illustration-as-brand:** Characters/illustration style carry brand identity more than the logotype itself. All shapes use rounded forms — no sharp corners, generous border-radius even on "square" elements ([Blake Crosley](https://blakecrosley.com/guides/design/headspace)).
- **Color rule set:** No pure black or pure white anywhere — warmest neutral is `#FFF8F0`; shadows use a colored overlay tint, never gray:
  ```css
  --hs-orange: #F47D31;
  --hs-coral: #FF8C69;
  --hs-peach: #FFDAB9;
  --hs-warm-white: #FFF8F0;
  --hs-sky-blue: #91C8E4;
  --hs-sage: #A8C686;
  --hs-soft-teal: #7EC8C8;
  --hs-deep-navy: #1B2838;
  --hs-night-blue: #2C3E6B;
  --hs-star-yellow: #FFE082;
  .hs-shadow { box-shadow: 0 8px 24px rgba(244, 125, 49, 0.12); }
  ```
  ([Blake Crosley](https://blakecrosley.com/guides/design/headspace))
- **Emotion-mapped mode shifts:** Distinct palette + composition per app "mode": Calm = soft blues + sage greens + slow clouds; Focus = warm oranges + single concentrated character; Sleep = deep navy + stars + horizontal composition; Stress = tangled lines slowly untangling; Joy = bright coral + upward motion ([Blake Crosley](https://blakecrosley.com/guides/design/headspace)). This is the clearest documented example of **color + motion signaling functional mode** in a wellness app.
- **Current brand system (2024 refresh):** Primary orange `#FF7E1D`, dark plum `#413D45`, white `#FFFFFF`; secondary accents yellow `#FFCE00`, green `#01A652`, blue `#0C93F4`, pink `#FEACD5`, purple `#956EB7` ([Headspace Partner Brand Guidelines PDF](https://assets.ctfassets.net/re0je2ce7cxi/2WuFBSwRg7uqfANXdbegnh/e7fbde2c1853e0c36d8d0ceedc619c3a/Headspace_Partner_Brand_Guidelines__2_.pdf)). A separate design audit records warm off-white background `#F9F4F2`, charcoal ink `#2D2C2B`, single CTA "voltage" blue `#0061EF` on 32px-radius pill buttons, and mascot-orb accent colors (saffron `#FFCE00`, pink `#FFA1CC`, aqua `#00A4FF`, grass `#02873E`, ultraviolet `#3B197F`) ([shadcn.io Headspace design spec](https://www.shadcn.io/design/headspace)). Note: this system deliberately uses only **one** saturated "voltage" color for interactive CTAs against a warm neutral canvas — everything else is muted/pastel or reserved for illustration.
- **Content vs. active-session hierarchy:** Home surfaces a single recommended session (not a complex nav hierarchy) based on time of day/behavior/streak — i.e., the browsing layer is deliberately simplified to reduce decision fatigue before entering a "tool" (meditation session) screen ([Blake Crosley](https://blakecrosley.com/guides/design/headspace)).

### 3.3 Calm
- Brand palette centers on **Indigo `#535AE4`** (primary) and **Midnight Blue `#1B2250`** (accent), with White Smoke `#F7F7F8` background and Charcoal `#1B3F6F`-ish text tones, Silver `#C7C8CA` neutral ([colorfetch.com – calm.com](https://www.colorfetch.com/palette/calm.com)).
- General "calm" wellness-app palette conventions (cross-validated across multiple palette sources): desaturated blues/teals/sage greens for background and passive/browsing states, with warmer coral/amber accents reserved for CTAs and active-session states — mirroring Headspace's mode-based emotion mapping.

### 3.4 Cross-App Pattern: Content Browsing vs. Active Tool
Synthesizing all three apps, the recurring visual-hierarchy signals for **mode change** are:
1. **Chrome reduction** — browsing screens keep navigation bars/tabs/filters visible; active-tool screens (workout player, meditation timer, camera capture) hide tab bars and non-essential chrome to maximize focus, consistent with Apple's own full-screen guidance (see §4).
2. **Color narrowing** — browsing screens use a broader/neutral palette with imagery; active screens narrow to 1–2 functional accent colors (Nike's green checkmark CTA; Headspace's single blue CTA "voltage").
3. **Typography scale shift** — headlines/hierarchy typography dominates browsing (card titles, category labels); active screens shift to large single-focus text (single instruction, single number/timer, single CTA).
4. **Full-bleed media** — both browsing (thumbnails, hero images) and active (looping instructional video, breathing animation) rely on full-bleed media, but active screens make media the *entire* background rather than a card element.

---

## 4. Mobile Camera UI Screen Patterns

### 4.1 Apple Human Interface Guidelines — Full-Screen & Layout
- **Extend content to the edges**; controls/navigation render *on top of* content as an overlay layer, not on the same visual plane — this is the core principle behind why camera viewfinders go edge-to-edge with floating controls rather than a letterboxed frame ([Apple HIG – Layout](https://developer.apple.com/design/human-interface-guidelines/layout)).
- **Differentiate controls from content** using translucent/blurred material (Apple's "Liquid Glass") so controls remain legible over any subject without a hard background box ([Apple HIG – Layout](https://developer.apple.com/design/human-interface-guidelines/layout)).
- **Safe areas** must account for system features (Dynamic Island, camera housing) — content should never be obscured by these; this is directly relevant to placing capture buttons and pose overlays away from hardware cutouts ([Apple HIG – Layout](https://developer.apple.com/design/human-interface-guidelines/layout)).
- **Avoid full-width buttons** at extreme screen edges; buttons should be inset and harmonize with device curvature ([Apple HIG – Layout](https://developer.apple.com/design/human-interface-guidelines/layout)).
- **Hide status bar only when it adds value** (e.g., immersive camera/media capture) ([Apple HIG – Layout](https://developer.apple.com/design/human-interface-guidelines/layout)).
- **Prioritize content by temporarily hiding toolbars**, but let users reveal them via a familiar gesture (tap/swipe) — never permanently remove access to essential controls ([Apple HIG – Going Full Screen](https://developer.apple.com/design/human-interface-guidelines/going-full-screen)).

### 4.2 Halide
Reviewers consistently describe Halide's defining trait as **"everything stays out of the way until you need it"** — a stripped-back UI that looks simpler than it is ([YouTube review](https://www.youtube.com/watch?v=qIZMmVoah1I)). Key patterns:
- A collapsible **"quick bar"** drawer surfaces advanced controls (manual exposure, RAW toggle, histogram, focus peaking) on demand rather than cluttering the default viewfinder.
- **Tap-to-focus and alignment guides use haptic feedback**, not just visual indicators — reinforcing feedback through a second sensory channel.
- Exposure adjustment uses **fluid gesture-based swipes** rather than persistent on-screen sliders, keeping the viewfinder clean.

### 4.3 VSCO
- Camera screen devotes the **overwhelming majority of screen space to the viewfinder**; a thin settings strip sits along the bottom/top edge (grid overlay, flash, exposure compensation, white balance, manual focus, ISO, shutter speed, tap-shutter toggle) ([Mobiography VSCO tutorial](https://www.mobiography.net/tutorials/vsco-cam-app/)).
- Shutter button is a **large circular control below the viewfinder** (not overlapping the image) with gallery access and a settings-toggle as smaller secondary controls flanking it.
- A recurring **UX criticism** across multiple design critiques: VSCO's iconography is often too abstract/unlabeled (a "joystick" icon widely misunderstood, ambiguous "face" and "O" icons), which increased first-time-user confusion ([Anthony Nguyen UX case study](https://www.experiencist.com/VSCO), [ixd.prattsi.org VSCO critique](https://ixd.prattsi.org/2023/02/design-critique-vsco-ios-app/)). **Lesson for camera-app design: prioritize recognizable iconography (or add micro-labels) over pure minimalism**, especially for camera/shutter/gallery affordances.
- VSCO's filter/edit UI groups related controls by category (Light, Color, Effects) — a good precedent for organizing post-capture tool complexity ([ixd.prattsi.org](https://ixd.prattsi.org/2023/02/design-critique-vsco-ios-app/)).

### 4.4 Snapseed
- Bottom-bar tab structure: **Looks / Tools / Export** — filters shown as a live-preview carousel (Instagram-style) rather than unlabeled thumbnails, directly addressing the "unlabeled icon" problem seen in VSCO ([9to5Google](https://9to5google.com/2017/09/19/snapseed-2-18-update-redesign-bottom-bar/)).
- Editing tools are presented in a **compact grid** to minimize scrolling; slider-heavy interaction model kept unchanged across redesigns because it tested as familiar/easy.

### 4.5 General Overlay-Layering & Control-Placement Best Practices (synthesized)
- **Z-index layering:** video/camera feed → semi-transparent gradient scrim (only where controls sit, not full-frame) → translucent/blurred control surfaces → high-contrast iconography/text.
- **Control placement:** primary capture action bottom-center (thumb reach zone); secondary controls (flash, grid, camera-flip) top corners or edges, out of the primary subject framing area; tertiary/manual controls tucked into a collapsible drawer (Halide pattern) rather than always-visible.
- **Grid/rule-of-thirds overlays** should render at low opacity (thin white/gray lines, ~30–50% opacity) so they assist composition without competing with the live subject.
- **Bottom scrim gradient** (e.g., `background: linear-gradient(to top, rgba(0,0,0,0.4), transparent)`) is a common technique to guarantee legibility of bottom-bar controls over any background without a hard opaque bar.

---

## 5. Accessibility in Visual Design

### 5.1 WCAG 2.2 Contrast Requirements (relevant success criteria)
| Criterion | Requirement | Applies to |
|---|---|---|
| **1.4.3 Contrast (Minimum)** | **4.5:1** | Normal text (including text-in-icons, images of text) |
| **1.4.3 Contrast (Minimum)** | **3:1** | Large text (≥18pt regular or ≥14pt bold) |
| **1.4.3 Contrast (Minimum)** | **3:1** | Non-text UI components (icons that communicate meaning) — visual boundaries and states |
| **1.4.6 Contrast (Enhanced, AAA)** | **7:1** | Normal text (recommended for critical content: errors, navigation) |
| **1.4.6 Contrast (Enhanced, AAA)** | **4.5:1** | Large text |
| **2.4.11 Focus indicators** | **3:1** | Focus ring against adjacent colors |

Scale runs 1:1 (identical colors) to 21:1 (pure black/white) ([Accessibility Test — WCAG 2.2 Color Contrast](https://accessibility-test.org/blog/support/advanced-guides/color-contrast-in-wcag-2-2-testing-and-fixes-that-actually-work/)).

### 5.2 Techniques for Camera Overlay Text (dynamic/unpredictable backgrounds)
Since a live camera feed changes pixel-by-pixel, static-contrast guarantees require defensive design, not per-pixel tuning:
- **Semi-opaque overlay/scrim behind text** — e.g., a gradient or solid panel placed behind on-screen instructions/score text so contrast is guaranteed regardless of what the camera sees.
- **Solid container guaranteeing 4.5:1 across its full area** rather than relying on text sitting directly atop unpredictable video.
- **Do not rely on drop-shadow alone** to reach contrast targets — use it only as a secondary enhancement.
- **On-screen sampler testing** in the exact spots users will read (not just the design mockup).
- **Provide a "utility high-contrast" text token** specifically for text over live/brand imagery — a pre-approved high-contrast variant kept separate from the general text-color tokens ([Accessibility Test](https://accessibility-test.org/blog/support/advanced-guides/color-contrast-in-wcag-2-2-testing-and-fixes-that-actually-work/)).

### 5.3 Dark Mode / High-Contrast Interaction with Art Nouveau Palettes
- **Dark mode needs its own passing color pairs — never invert light-mode colors blindly.** Watch specifically for: (a) low-contrast grays that vanish on near-black surfaces, and (b) neon/saturated accents that "vibrate" uncomfortably against dark backgrounds ([Accessibility Test](https://accessibility-test.org/blog/support/advanced-guides/color-contrast-in-wcag-2-2-testing-and-fixes-that-actually-work/)).
- Art Nouveau's natural palette (muted sage greens, aged gold, deep burgundy/aubergine, ivory/parchment) is inherently **low-to-mid saturation**, which is an advantage for dark-mode legibility — but muted tones sitting near WCAG's minimum ratios must be individually re-tested against a dark canvas, not assumed to inherit light-mode compliance.
- Reference **Art Nouveau hex palettes** for design-system anchoring (from multiple curated sources):
  - *Gilded Iris:* `#2F3A2D` `#6F8A5A` `#C7B07A` `#7A4E8A` `#F2E9D8` — sage/olive base, muted gold accent, aubergine highlight, ivory paper tone ([Media.io Art Nouveau palettes](https://www.media.io/color-palette/art-nouveau-color-palette.html)).
  - *Sage Stained Glass:* `#2D3E2F` `#7D9B76` `#B9C7A4` `#D9CBB6` `#4C2F2A` — calmer/botanical, good for a "content browsing" surface tone.
  - *Art Nouveau Revival (interior-design-sourced):* Verdant Sage `#7A8D73`, Walnut Umber `#5A3E36`, Iris Amethyst `#6D4A72`, Brass Gold `#B08D57`, Opal Cream `#F5F1E6` ([color-hex.com](https://www.color-hex.com/color-palette/1065119)).
  - *Mucha "Amethyst" (1897) extracted palette:* `#CBAF8A` (21%), `#E1ECE9` (20%), `#CEC7B7` (11%), `#504544` (11%), `#A49686` (10%), `#292222` (10%), `#7D6B5E` (9%), `#4B7173` (3% low-prevalence accent), `#87A9BF` (3%), `#A05D50` (2%) — a genuine period-accurate reference for a muted, warm-neutral base with one cool teal accent ([Palette Inspiration – Mucha Amethyst](https://paletteinspiration.com/artworks/alphonse-mucha-amethyst-1897-0006705/)).
  - *Art Nouveau Green (single-hue ramp):* `#9C932F` → `#F5F4EA`, a full tonal ramp from deep olive-gold to near-white, useful for building an accessible tint/shade scale from one signature Art Nouveau hue ([color-name.com](https://www.color-name.com/art-nouveau-green.color)).
  - For a **dark-mode Art Nouveau variant**, pair a near-black warm base (not pure `#000000`) with muted gold: e.g., `#0D0D0D`–`#1A1A1A` background, `#D4AF37` or the softer `#C9A227` for gold accents, `#F5E6C8`/`#EEE6D7` for warm off-white text — this "black + antique gold" combination is a well-established luxury dark-mode pattern with strong contrast headroom (black `#000000`/`#0B0B0F` against gold `#D4AF37`/`#FFD700` typically exceeds 7:1 depending on exact shade, but must be verified per exact pair) ([colorindicator.com Black & Gold](https://colorindicator.com/color-combinations/black-and-gold), [Dark Luxury UI Design](https://www.skillsui.app/blog/dark-luxury-ui-design)).
- **General dark-mode engineering guidance:** Google Material's standard dark background is `#121212` (not pure black) to reduce OLED glare and allow surface elevation via lighter overlay layers (`#1E1E1E`, `#1A1A1A`); text should avoid pure white in favor of off-white (`#F5F5F5`–`#E4E4E7`) ([Theme & Color – Dark Mode Palette](https://themeandcolor.com/blog/dark-mode-color-palette)). This principle transfers directly to an Art Nouveau dark theme: use a warm near-black (not `#000000`) as the base so gold/sage accents don't feel harshly clinical against pure black.

### 5.4 Practical Design-System Accessibility Recommendations
- Tokenize all colors semantically (`text-primary`, `text-on-primary`, `surface`, `surface-contrast`) with pass/fail notes documented per pairing, and maintain **separate validated token sets for light and dark themes** rather than a single inverted set ([Accessibility Test](https://accessibility-test.org/blog/support/advanced-guides/color-contrast-in-wcag-2-2-testing-and-fixes-that-actually-work/)).
- Bundle accessible color pairings directly into component defaults (buttons, badges, alerts) so designers/engineers can't accidentally ship a non-compliant combination.
- Add automated contrast linting (axe-core, Pa11y, Lighthouse) to CI so decorative/ornamental additions (like Art Nouveau gold-on-cream flourishes) don't silently regress text contrast elsewhere on the same screen.
- For charts/score indicators (relevant to progress/score animations in §2.4), pair color coding with a secondary signal (icon, pattern, or label) — never rely on hue alone, which also benefits colorblind users interpreting alignment/success states.

---

## Source List
- [Made Good Designs – Art Nouveau Fonts](https://madegooddesigns.com/art-nouveau-fonts/)
- [Figma – Google Font Pairings](https://www.figma.com/google-fonts/)
- [Shannon Payne – 20 Free Google Font Pairings](https://shannonpayne.com.au/20-free-google-font-pairings/)
- [TypeType – Google Fonts / TT Modernoir](https://typetype.org/fonts/google/)
- [Wikimedia Commons – Art Nouveau typographic ornaments](https://commons.wikimedia.org/wiki/Category:Art_Nouveau_typographic_ornaments)
- [Wikimedia Commons – SVG ornaments from Annuaire graphique](https://commons.wikimedia.org/wiki/Category:SVG_ornaments_from_Annuaire_graphique)
- [FreeSVG.org – Art Nouveau tag](https://freesvg.org/tag/art-nouveau)
- [PublicDomainVectors.org – free Art Nouveau vector ornaments](https://publicdomainvectors.org/en/free-art-nouveau-vector-ornaments)
- [Vecteezy – Art Nouveau Border SVGs](https://www.vecteezy.com/free-svg/art-nouveau-border)
- [Huggingface – KappaNeuro/alphonse-mucha-style](https://huggingface.co/KappaNeuro/alphonse-mucha-style)
- [DEV Community – Using SVG as a Border with CSS](https://dev.to/jackharner/using-svg-as-a-border-with-css-57ib)
- [W3docs – border-image-slice](https://www.w3docs.com/learn-css/border-image-slice)
- [MDN – feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence)
- [Codrops – SVG Filter Effects: Creating Texture with feTurbulence](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/)
- [CSS-Tricks – Squigglevision](https://css-tricks.com/books/greatest-css-tricks/squigglevision/)
- [CSSVG – How to Animate SVG Icons](https://cssvg.com/blog/animate-svg-icons)
- [SVG AI – SVG Path Animation Tutorial](https://www.svgai.org/blog/svg-path-animation-tutorial)
- [60fps.design – Not Boring Camera Dial Swipe Interaction](https://60fps.design/shots/not-boring-camera-dial-swipe-interaction)
- [Envato Elements – Microinteractions that matter](https://elements.envato.com/learn/microinteractions-ux)
- [Google Play – Neon Pose AI Workout Counter](https://play.google.com/store/apps/details?id=com.justwitworks.neonpose)
- [App Store – Posei AI Pose Camera & Guide](https://apps.apple.com/us/app/posei-ai-pose-camera-guide/id6763751241)
- [Create with Swift – Detecting body poses in a live video feed](https://www.createwithswift.com/detecting-body-poses-in-a-live-video-feed/)
- [Animation Patterns – SVG Success Checkmark Draw](https://animationpatterns.art/animations/success-check-path-draw/)
- [Codrops – Circular Progress Button](https://tympanus.net/codrops/2014/04/09/how-to-create-a-circular-progress-button/)
- [UXPin – Progress Tracker Design 2026](https://www.uxpin.com/studio/blog/design-progress-trackers/)
- [60fps.design – Alma Nutrition Score Progress Animation](https://60fps.design/shots/alma-nutrition-score-progress-animation)
- [60fps.design – Duolingo Super Score Animation](https://60fps.design/shots/duolingo-super-score-animation)
- [oscar-w.com – Nike/NTC Design System](http://www.oscar-w.com/projects/design-system)
- [Julia Atkins, Medium – Nike Training Club Concept](https://juliaatkins.medium.com/nike-training-club-concept-reaching-your-fitness-goals-even-on-the-bad-days-5d890aab746d)
- [ixd.prattsi.org – Design Critique: Nike Training Club](https://ixd.prattsi.org/2023/09/design-critique-nike-training-club-iphone-app/)
- [Adobe Blog – UXperts Weigh In](https://blog.adobe.com/en/publish/2017/04/18/uxperts-weigh-in-designs-we-love-april-edition)
- [ColorArchive – Nike Color Palette](https://colorarchive.org/brands/nike/)
- [Blake Crosley – Headspace: Designing for Calm](https://blakecrosley.com/guides/design/headspace)
- [Headspace Partner Brand Guidelines (PDF)](https://assets.ctfassets.net/re0je2ce7cxi/2WuFBSwRg7uqfANXdbegnh/e7fbde2c1853e0c36d8d0ceedc619c3a/Headspace_Partner_Brand_Guidelines__2_.pdf)
- [shadcn.io – Headspace Design System](https://www.shadcn.io/design/headspace)
- [colorfetch.com – calm.com color palette](https://www.colorfetch.com/palette/calm.com)
- [Apple HIG – Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Apple HIG – Going Full Screen](https://developer.apple.com/design/human-interface-guidelines/going-full-screen)
- [YouTube – Original Halide iPhone camera app review](https://www.youtube.com/watch?v=qIZMmVoah1I)
- [Mobiography – VSCO Tutorial](https://www.mobiography.net/tutorials/vsco-cam-app/)
- [Experiencist – VSCO UX Case Study](https://www.experiencist.com/VSCO)
- [ixd.prattsi.org – Design Critique: VSCO](https://ixd.prattsi.org/2023/02/design-critique-vsco-ios-app/)
- [9to5Google – Snapseed redesign](https://9to5google.com/2017/09/19/snapseed-2-18-update-redesign-bottom-bar/)
- [Accessibility Test – Color Contrast in WCAG 2.2](https://accessibility-test.org/blog/support/advanced-guides/color-contrast-in-wcag-2-2-testing-and-fixes-that-actually-work/)
- [Theme & Color – Dark Mode Color Palette](https://themeandcolor.com/blog/dark-mode-color-palette)
- [Media.io – Art Nouveau Color Palette Ideas](https://www.media.io/color-palette/art-nouveau-color-palette.html)
- [color-hex.com – Art Nouveau Revival Color Palette](https://www.color-hex.com/color-palette/1065119)
- [Palette Inspiration – Mucha "Amethyst" (1897)](https://paletteinspiration.com/artworks/alphonse-mucha-amethyst-1897-0006705/)
- [color-name.com – Art Nouveau Green](https://www.color-name.com/art-nouveau-green.color)
- [colorindicator.com – Black and Gold Color Palette](https://colorindicator.com/color-combinations/black-and-gold)
- [Skills UI – Dark Luxury UI Design](https://www.skillsui.app/blog/dark-luxury-ui-design)
