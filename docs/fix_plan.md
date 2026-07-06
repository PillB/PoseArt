# PoseArt Fix Plan — Phase 9

## CRITICAL BUGS (from stress test)
1. **Favorite button missing from pose detail sheet** — `openPoseDetail()` doesn't render fav button
2. **Search: category grid not hidden during search** — both grid and results visible simultaneously
3. **OB2: Try It button not reliably clickable** — `runOnboardingDemo()` works but needs robustness

## UX IMPROVEMENTS (from STORM + stress test)
4. **Vibe/mood search** — add emotional tags (Confident, Playful, Vulnerable, Sensual, Powerful) to search
5. **Search: show count + hide category grid** — "108 results for 'boudoir'" header
6. **Pose detail: fav + share buttons** — add heart icon and share icon to sheet header area
7. **Category count badges** — show live count on each category card (already showing, verify)
8. **Session setup: overlay preview** — show live SVG preview of selected overlay mode
9. **Empty progress screen** — add motivational CTA "Start your first session" instead of just 0s
10. **OB2 demo**: The demo SVG animation needs actual visual motion (class-based)

## PRODUCT IMPROVEMENTS (from STORM)
11. **Vibe tags on poses** — add "Confident / Playful / Vulnerable / Sensual / Powerful / Elegant" chips
12. **Pose count on session setup** — show "3 of 47 standing poses" navigation indicator
13. **Quick-switch poses on session setup** — prev/next arrows to cycle through category poses
14. **Progress screen empty state** — better "your journey starts here" state
15. **No results state for search** — styled empty state with suggestions
16. **Category grid: sort by count descending** — biggest categories first (boudoir:161 should be first)
17. **Skeleton 3D: Art Nouveau styling** — curved whiplash joints instead of straight lines

## QUICK WINS
18. **Search debounce** — already fires per keystroke, add 150ms debounce
19. **Tab bar: haptic feedback** on tab switch
20. **Overlay chip: Ghost should show ghost SVG preview** in setup screen
21. **Pose detail sheet: drag to dismiss** gesture
22. **Back gesture** swipe from left edge
