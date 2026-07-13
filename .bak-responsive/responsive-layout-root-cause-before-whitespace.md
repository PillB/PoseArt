# PoseArt Responsive Layout Root-Cause & Validation Report

Date: 2026-07-13  
Scope: Mobile, tablet, MacBook, laptop, and desktop shell/layout behavior

## Outcome

PoseArt now uses a viewport-safe responsive shell. It remains edge-to-edge on phones and expands to a bounded 1180px desktop workspace while always fitting inside the available viewport height. The final Playwright matrix passed 84/84 screen-format combinations with zero browser errors.

## Root causes

1. **Forced desktop height:** `@media (min-width: 431px)` set `#app { height: 932px }`. MacBook viewports such as 1366×768 clipped 164px because `html/body` also used `overflow:hidden`.
2. **Permanent mobile width:** `max-width:430px` applied at every width, so desktop could only show a centered phone shell.
3. **Non-shrinking flex children:** scroll/stage regions lacked `min-height:0`, preventing reliable contraction inside short shells.
4. **Fixed tour stage:** the 420px stage plus header, progress, controls, and photo strip exceeded short laptop height.
5. **Viewport-owned drawers:** marketplace drawers used `position:fixed`, escaping the app container once it became wider and bounded.
6. **Focus-driven shell scroll leak:** focused editor/marketplace inputs could programmatically scroll the `overflow:hidden` app container. Later absolute screens inherited the nonzero scroll offset and appeared above the shell.
7. **Transient sheet state leak:** pose detail remained visible after navigating to unrelated screens, masking marketplace and tour content.

## Corrective design

- Mobile: 100% width/height with a 430px maximum at phone sizes.
- Desktop ≥768px: `width:min(1180px, 100vw - 32px)` and `height:min(932px, 100dvh - 32px)`.
- Desktop grids expand to four category/pose columns, adaptive gallery columns, and three marketplace columns.
- Tab bar, bottom sheet, drawers, and tour controls are bounded and centered inside the app.
- Tour stage height responds to short viewports with a 220px floor.
- `overflow:clip`, focus cleanup, and shell scroll reset prevent absolute-screen displacement.
- Central screen navigation closes transient pose detail state.

## Playwright matrix

| Format | Screens | Result file | Result |
|---|---:|---|---|
| Phone 390×844 | 12 | `audit/results/responsive-layout-phone-390x844.json` | 12/12 pass |
| Phone 430×932 | 12 | `audit/results/responsive-layout-phone-430x932.json` | 12/12 pass |
| Tablet 768×1024 | 12 | `audit/results/responsive-layout-tablet-768x1024.json` | 12/12 pass |
| Laptop 1280×720 | 12 | `audit/results/responsive-layout-laptop-1280x720.json` | 12/12 pass |
| MacBook 1366×768 | 12 | `audit/results/responsive-layout-macbook-1366x768.json` | 12/12 pass |
| Desktop 1440×900 | 12 | `audit/results/responsive-layout-desktop-1440x900.json` | 12/12 pass |
| MacBook 1728×1117 | 12 | `audit/results/responsive-layout-macbook-1728x1117.json` | 12/12 pass |

Each format covers login, home, library, category, pose detail, gallery, profile, editor, marketplace, camera, tour creator, and a populated tour session.

## Representative evidence

- [1366×768 home](../../audit/screenshots/responsive-layout/macbook-1366x768-home.png)
- [1280×720 populated tour](../../audit/screenshots/responsive-layout/laptop-1280x720-tour-session.png)
- [1440×900 marketplace](../../audit/screenshots/responsive-layout/desktop-1440x900-marketplace.png)
- [1366×768 editor](../../audit/screenshots/responsive-layout/macbook-1366x768-editor.png)
- [390×844 mobile home](../../audit/screenshots/responsive-layout/phone-390x844-home.png)

## Assertions applied to every checkpoint

- App rectangle remains entirely inside the viewport.
- Document has no horizontal or vertical overflow.
- Active screen has no horizontal overflow.
- Exact intended screen is active.
- Pose sheet is absent outside pose detail.
- Desktop shell is materially wider than the mobile shell.
- Phone shell remains edge-to-edge.
- Desktop home uses at least four category columns.
- All currently reachable tour controls remain inside the app bounds.

No hardcoded viewport height or width is used as the desktop layout owner; fixed pixel sizes remain only for intentional component geometry such as icons, touch targets, thumbnails, and minimum readable stages.
