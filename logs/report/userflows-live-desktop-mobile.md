# PoseArt Live Desktop + Mobile User-Flow Report

**Generated:** 2026-07-13T15:33:06.430Z

**Application:** http://localhost:8095/index.html

## Executive summary

Playwright completed 112 live screenshots across 2 viewport configurations: 56 mobile microsteps and 56 desktop microsteps. All captures maintained exactly one active SPA screen, produced zero console/page errors, and showed no document or app horizontal overflow.

The desktop audit confirms that PoseArt is a mobile-first fixed-width application: at 1440×1000 the app remains a centered 430px shell rather than adapting into a desktop-specific layout. This is functional and overflow-safe, but it leaves substantial unused desktop space.

## Findings

| Severity | ID | Finding | Evidence |
|---|---|---|---|
| HIGH | `UF-001` | The pose-detail Favorite control is visible but cannot be clicked because the Close button intercepts pointer events. It reproduced at both 430×932 and 1440×1000. The audit invoked the same handler programmatically only to continue later steps. | `MOB-F02-S015`, `DESK-F02-S015` |
| HIGH | `UF-002` | Visual inspection of the desktop tour session shows a stale pose-detail bottom sheet partially visible beneath the tour player, indicating overlay state can leak across distant navigation flows. | `DESK-F07-S050` |
| MEDIUM | `UF-003` | Desktop uses the same centered 430px application shell as mobile. It is safe and readable but does not provide a desktop-optimized layout or use available width. | All `DESK-*` screenshots |
| INFO | `UF-004` | Rapid automated microsteps can capture a previous action toast on the following screen. Toasts are transient and did not block controls. | Examples: `DESK-F05-S036`, `MOB-F06-S041` |

## Coverage and runtime checks

| Viewport | Screenshots | Browser errors | One active screen | Body overflow | App overflow |
|---|---:|---:|---|---|---|
| Mobile 430×932 | 56 | 0 | PASS | PASS | PASS |
| Desktop 1440×1000 | 56 | 0 | PASS | PASS | PASS |

## User-flow map

1. Onboarding guides a new user through product explanation, demo/camera choice, goal selection, and personalized Home.
2. Discovery moves through Home → Library → search/category → pose detail → skeleton view/favorite.
3. Session flows from pose detail → setup overlay choices → camera → flow/overlay controls → review presets → save.
4. Gallery covers detail actions, duplication, sorting, grouping, and bulk selection.
5. Progress/Profile lead into the 20-joint custom editor, undo, save, and contextual bug reporting.
6. Marketplace covers browse, search, preview, creator profile, purchase, owned products, and creator dashboard.
7. Tours cover two-section creation, adding a section, playback navigation, capture, search, overview, and summary.

## Mobile 430×932

Viewport: 430×932. App width observed: 430px.

### Flow 1: Onboarding and personalization

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `MOB-F01-S001` | Welcome screen | Open the application with clean storage. | OB1 presents Begin and Skip intro. | screen-ob1; active screens=1; horizontal overflow=no | [Open MOB-F01-S001](../../audit/screenshots/userflows-live/mob/MOB-F01-S001-welcome-screen.png) |
| `MOB-F01-S002` | How it works | Select Begin. | OB2 explains ghost overlay, pose library, and auto-capture. | screen-ob2; active screens=1; horizontal overflow=no | [Open MOB-F01-S002](../../audit/screenshots/userflows-live/mob/MOB-F01-S002-how-it-works.png) |
| `MOB-F01-S003` | Interactive onboarding demo | Select Try it. | Demo stage animates and provides coaching feedback. | screen-ob2; active screens=1; horizontal overflow=no | [Open MOB-F01-S003](../../audit/screenshots/userflows-live/mob/MOB-F01-S003-interactive-onboarding-demo.png) |
| `MOB-F01-S004` | Camera permission choice | Wait for demo completion. | OB3 offers camera permission and Demo Mode. | screen-ob3; active screens=1; horizontal overflow=no | [Open MOB-F01-S004](../../audit/screenshots/userflows-live/mob/MOB-F01-S004-camera-permission-choice.png) |
| `MOB-F01-S005` | Goal selection | Continue in Demo Mode. | OB4 presents four persona goals and disabled completion. | screen-ob4; active screens=1; horizontal overflow=no | [Open MOB-F01-S005](../../audit/screenshots/userflows-live/mob/MOB-F01-S005-goal-selection.png) |
| `MOB-F01-S006` | Goal selected | Choose Photographer. | Photographer is highlighted and Start Exploring becomes enabled. | screen-ob4; active screens=1; horizontal overflow=no | [Open MOB-F01-S006](../../audit/screenshots/userflows-live/mob/MOB-F01-S006-goal-selected.png) |
| `MOB-F01-S007` | Onboarding completed | Select Start Exploring. | Home appears with personalized greeting. | screen-home; active screens=1; horizontal overflow=no | [Open MOB-F01-S007](../../audit/screenshots/userflows-live/mob/MOB-F01-S007-onboarding-completed.png) |

### Flow 2: Pose discovery and detail

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `MOB-F02-S008` | Home discovery | Review featured pose and category cards. | Home shows featured CTA, categories, and tab navigation. | screen-home; active screens=1; horizontal overflow=no | [Open MOB-F02-S008](../../audit/screenshots/userflows-live/mob/MOB-F02-S008-home-discovery.png) |
| `MOB-F02-S009` | Library categories | Open the Poses tab. | Search, filters, and 16 category cards are available. | screen-library; active screens=1; horizontal overflow=no | [Open MOB-F02-S009](../../audit/screenshots/userflows-live/mob/MOB-F02-S009-library-categories.png) |
| `MOB-F02-S010` | Boudoir search results | Search for boudoir. | Matching pose cards replace category browsing. | screen-library; active screens=1; horizontal overflow=no | [Open MOB-F02-S010](../../audit/screenshots/userflows-live/mob/MOB-F02-S010-boudoir-search-results.png) |
| `MOB-F02-S011` | Safe empty search | Search using script-like text. | The query is treated as text and an empty state is shown. | screen-library; active screens=1; horizontal overflow=no | [Open MOB-F02-S011](../../audit/screenshots/userflows-live/mob/MOB-F02-S011-safe-empty-search.png) |
| `MOB-F02-S012` | Standing category list | Open the Standing category. | Standing list shows pose thumbnails and count. | screen-category-list; active screens=1; horizontal overflow=no | [Open MOB-F02-S012](../../audit/screenshots/userflows-live/mob/MOB-F02-S012-standing-category-list.png) |
| `MOB-F02-S013` | Pose detail opened | Open S-Curve Stand. | Detail sheet shows title, instructions, actions, avatar, and skeleton. | screen-category-list; active screens=1; horizontal overflow=no | [Open MOB-F02-S013](../../audit/screenshots/userflows-live/mob/MOB-F02-S013-pose-detail-opened.png) |
| `MOB-F02-S014` | Pose side view | Switch the skeleton to Side. | The procedural skeleton changes viewpoint. | screen-category-list; active screens=1; horizontal overflow=no | [Open MOB-F02-S014](../../audit/screenshots/userflows-live/mob/MOB-F02-S014-pose-side-view.png) |
| `MOB-F02-S015` | Pose favorited | Toggle Favorite. | Favorite control remains visibly selected. | screen-category-list; active screens=1; horizontal overflow=no | [Open MOB-F02-S015](../../audit/screenshots/userflows-live/mob/MOB-F02-S015-pose-favorited.png) |

### Flow 3: Session setup, camera, and review

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `MOB-F03-S016` | Session setup default | Start a session from pose detail. | Timer defaults Off and four overlay choices are present. | screen-session-setup; active screens=1; horizontal overflow=no | [Open MOB-F03-S016](../../audit/screenshots/userflows-live/mob/MOB-F03-S016-session-setup-default.png) |
| `MOB-F03-S017` | Overlay preview skeleton | Select skeleton overlay. | Setup preview accurately represents skeleton. | screen-session-setup; active screens=1; horizontal overflow=no | [Open MOB-F03-S017](../../audit/screenshots/userflows-live/mob/MOB-F03-S017-overlay-preview-skeleton.png) |
| `MOB-F03-S018` | Overlay preview ghost | Select ghost overlay. | Setup preview accurately represents ghost. | screen-session-setup; active screens=1; horizontal overflow=no | [Open MOB-F03-S018](../../audit/screenshots/userflows-live/mob/MOB-F03-S018-overlay-preview-ghost.png) |
| `MOB-F03-S019` | Overlay preview off | Select off overlay. | Setup preview accurately represents off. | screen-session-setup; active screens=1; horizontal overflow=no | [Open MOB-F03-S019](../../audit/screenshots/userflows-live/mob/MOB-F03-S019-overlay-preview-off.png) |
| `MOB-F03-S020` | Overlay preview avatar | Select avatar overlay. | Setup preview accurately represents avatar. | screen-session-setup; active screens=1; horizontal overflow=no | [Open MOB-F03-S020](../../audit/screenshots/userflows-live/mob/MOB-F03-S020-overlay-preview-avatar.png) |
| `MOB-F03-S021` | Camera initial state | Begin Capture in demo camera mode. | Score, simulated-scoring disclosure, shutter, and next preview are visible. | screen-camera; active screens=1; horizontal overflow=no | [Open MOB-F03-S021](../../audit/screenshots/userflows-live/mob/MOB-F03-S021-camera-initial-state.png) |
| `MOB-F03-S022` | Flow mode enabled | Toggle Flow Mode. | Flow control visibly changes to ON. | screen-camera; active screens=1; horizontal overflow=no | [Open MOB-F03-S022](../../audit/screenshots/userflows-live/mob/MOB-F03-S022-flow-mode-enabled.png) |
| `MOB-F03-S023` | Camera overlay cycled | Cycle the live overlay. | Camera overlay state changes without leaving the session. | screen-camera; active screens=1; horizontal overflow=no | [Open MOB-F03-S023](../../audit/screenshots/userflows-live/mob/MOB-F03-S023-camera-overlay-cycled.png) |
| `MOB-F03-S024` | Capture review | Press the shutter. | Review shows captured image, score, filters, retake/share/save actions. | screen-review; active screens=1; horizontal overflow=no | [Open MOB-F03-S024](../../audit/screenshots/userflows-live/mob/MOB-F03-S024-capture-review.png) |
| `MOB-F03-S025` | Warm review preset | Select the Warm filter. | Captured review visibly applies the selected preset. | screen-review; active screens=1; horizontal overflow=no | [Open MOB-F03-S025](../../audit/screenshots/userflows-live/mob/MOB-F03-S025-warm-review-preset.png) |
| `MOB-F03-S026` | Capture saved | Save the review to Gallery. | Gallery opens with the newly captured item. | screen-gallery; active screens=1; horizontal overflow=no | [Open MOB-F03-S026](../../audit/screenshots/userflows-live/mob/MOB-F03-S026-capture-saved.png) |

### Flow 4: Gallery management

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `MOB-F04-S027` | Gallery populated | Review captured gallery. | Capture count and card are visible with management controls. | screen-gallery; active screens=1; horizontal overflow=no | [Open MOB-F04-S027](../../audit/screenshots/userflows-live/mob/MOB-F04-S027-gallery-populated.png) |
| `MOB-F04-S028` | Gallery detail actions | Open the first capture. | Save, Copy, Download, Share, Favorite, and Delete are visible. | screen-gallery-detail; active screens=1; horizontal overflow=no | [Open MOB-F04-S028](../../audit/screenshots/userflows-live/mob/MOB-F04-S028-gallery-detail-actions.png) |
| `MOB-F04-S029` | Gallery item copied | Select Copy. | A duplicated capture becomes the selected detail item. | screen-gallery-detail; active screens=1; horizontal overflow=no | [Open MOB-F04-S029](../../audit/screenshots/userflows-live/mob/MOB-F04-S029-gallery-item-copied.png) |
| `MOB-F04-S030` | Gallery sorted by score | Sort by Top score. | Gallery ordering reflects score sort. | screen-gallery; active screens=1; horizontal overflow=no | [Open MOB-F04-S030](../../audit/screenshots/userflows-live/mob/MOB-F04-S030-gallery-sorted-by-score.png) |
| `MOB-F04-S031` | Gallery grouped by pose | Enable Group by pose. | Cards show per-pose group counts. | screen-gallery; active screens=1; horizontal overflow=no | [Open MOB-F04-S031](../../audit/screenshots/userflows-live/mob/MOB-F04-S031-gallery-grouped-by-pose.png) |
| `MOB-F04-S032` | Bulk selection mode | Select the gallery Select control. | Checkboxes and bulk action bar appear. | screen-gallery; active screens=1; horizontal overflow=no | [Open MOB-F04-S032](../../audit/screenshots/userflows-live/mob/MOB-F04-S032-bulk-selection-mode.png) |
| `MOB-F04-S033` | Gallery item selected | Select one capture. | Selection count becomes one and selected card is outlined. | screen-gallery; active screens=1; horizontal overflow=no | [Open MOB-F04-S033](../../audit/screenshots/userflows-live/mob/MOB-F04-S033-gallery-item-selected.png) |

### Flow 5: Progress, profile, and custom editor

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `MOB-F05-S034` | Progress dashboard | Open Progress. | Session, pose, score, and history areas are visible. | screen-progress; active screens=1; horizontal overflow=no | [Open MOB-F05-S034](../../audit/screenshots/userflows-live/mob/MOB-F05-S034-progress-dashboard.png) |
| `MOB-F05-S035` | Profile and tools | Open Profile. | Preferences, editor, marketplace, and tour entry points are visible. | screen-profile; active screens=1; horizontal overflow=no | [Open MOB-F05-S035](../../audit/screenshots/userflows-live/mob/MOB-F05-S035-profile-and-tools.png) |
| `MOB-F05-S036` | Custom pose editor | Open editor with S-Curve Stand. | Twenty sliders and avatar/skeleton/ghost previews render. | screen-custom-pose-editor; active screens=1; horizontal overflow=no | [Open MOB-F05-S036](../../audit/screenshots/userflows-live/mob/MOB-F05-S036-custom-pose-editor.png) |
| `MOB-F05-S037` | Editor joint changed | Set Spine to 35 degrees. | Live previews and numeric value update. | screen-custom-pose-editor; active screens=1; horizontal overflow=no | [Open MOB-F05-S037](../../audit/screenshots/userflows-live/mob/MOB-F05-S037-editor-joint-changed.png) |
| `MOB-F05-S038` | Editor undo | Undo the joint change. | Prior joint state is restored. | screen-custom-pose-editor; active screens=1; horizontal overflow=no | [Open MOB-F05-S038](../../audit/screenshots/userflows-live/mob/MOB-F05-S038-editor-undo.png) |
| `MOB-F05-S039` | Custom pose saved | Save the custom pose. | Saved pose appears in the editor list. | screen-custom-pose-editor; active screens=1; horizontal overflow=no | [Open MOB-F05-S039](../../audit/screenshots/userflows-live/mob/MOB-F05-S039-custom-pose-saved.png) |
| `MOB-F05-S040` | Editor bug report submitted | Submit report with pose data. | Success feedback confirms report storage. | screen-custom-pose-editor; active screens=1; horizontal overflow=no | [Open MOB-F05-S040](../../audit/screenshots/userflows-live/mob/MOB-F05-S040-editor-bug-report-submitted.png) |

### Flow 6: Marketplace

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `MOB-F06-S041` | Marketplace browse | Open Marketplace. | Product grid, search, prices, ratings, and filters appear. | screen-marketplace; active screens=1; horizontal overflow=no | [Open MOB-F06-S041](../../audit/screenshots/userflows-live/mob/MOB-F06-S041-marketplace-browse.png) |
| `MOB-F06-S042` | Marketplace search | Search standing. | Matching product cards remain visible. | screen-marketplace; active screens=1; horizontal overflow=no | [Open MOB-F06-S042](../../audit/screenshots/userflows-live/mob/MOB-F06-S042-marketplace-search.png) |
| `MOB-F06-S043` | Product preview drawer | Preview the first product. | Preview drawer names the first two poses when available. | screen-marketplace; active screens=1; horizontal overflow=no | [Open MOB-F06-S043](../../audit/screenshots/userflows-live/mob/MOB-F06-S043-product-preview-drawer.png) |
| `MOB-F06-S044` | Creator profile drawer | Open the product creator. | Creator identity and catalog are shown. | screen-marketplace; active screens=1; horizontal overflow=no | [Open MOB-F06-S044](../../audit/screenshots/userflows-live/mob/MOB-F06-S044-creator-profile-drawer.png) |
| `MOB-F06-S045` | Free pack purchased | Acquire Essential Standing Poses. | Product becomes owned and its action changes to Open. | screen-marketplace; active screens=1; horizontal overflow=no | [Open MOB-F06-S045](../../audit/screenshots/userflows-live/mob/MOB-F06-S045-free-pack-purchased.png) |
| `MOB-F06-S046` | Owned products | Open My Packs. | Purchased pack appears with Open and Rate controls. | screen-marketplace; active screens=1; horizontal overflow=no | [Open MOB-F06-S046](../../audit/screenshots/userflows-live/mob/MOB-F06-S046-owned-products.png) |
| `MOB-F06-S047` | Creator dashboard | Open Creator. | Earnings summary and publish form are visible. | screen-marketplace; active screens=1; horizontal overflow=no | [Open MOB-F06-S047](../../audit/screenshots/userflows-live/mob/MOB-F06-S047-creator-dashboard.png) |

### Flow 7: Tour creation and playback

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `MOB-F07-S048` | Tour creator populated | Create two sections with six poses. | Builder shows sections, pose cards, sources, and actions. | screen-tour-creator; active screens=1; horizontal overflow=no | [Open MOB-F07-S048](../../audit/screenshots/userflows-live/mob/MOB-F07-S048-tour-creator-populated.png) |
| `MOB-F07-S049` | Tour section added | Select Add Section. | A third section appears. | screen-tour-creator; active screens=1; horizontal overflow=no | [Open MOB-F07-S049](../../audit/screenshots/userflows-live/mob/MOB-F07-S049-tour-section-added.png) |
| `MOB-F07-S050` | Tour session started | Start Tour Session. | Current pose, section/pose progress, navigation, camera, and photo strip appear. | screen-tour-session; active screens=1; horizontal overflow=no | [Open MOB-F07-S050](../../audit/screenshots/userflows-live/mob/MOB-F07-S050-tour-session-started.png) |
| `MOB-F07-S051` | Tour next pose | Select Next pose. | Pose progress and procedural preview advance. | screen-tour-session; active screens=1; horizontal overflow=no | [Open MOB-F07-S051](../../audit/screenshots/userflows-live/mob/MOB-F07-S051-tour-next-pose.png) |
| `MOB-F07-S052` | Tour next section | Select Next Section. | Section progress moves to Dynamic and pose resets. | screen-tour-session; active screens=1; horizontal overflow=no | [Open MOB-F07-S052](../../audit/screenshots/userflows-live/mob/MOB-F07-S052-tour-next-section.png) |
| `MOB-F07-S053` | Tour capture added | Capture the current tour pose. | Current-section photo strip gains a tagged thumbnail. | screen-tour-session; active screens=1; horizontal overflow=no | [Open MOB-F07-S053](../../audit/screenshots/userflows-live/mob/MOB-F07-S053-tour-capture-added.png) |
| `MOB-F07-S054` | Tour pose search | Search for wind within the tour. | Matching tour pose is offered as a jump target. | screen-tour-session; active screens=1; horizontal overflow=no | [Open MOB-F07-S054](../../audit/screenshots/userflows-live/mob/MOB-F07-S054-tour-pose-search.png) |
| `MOB-F07-S055` | Tour section overview | Open Section overview. | Drawer lists every section and pose count. | screen-tour-session; active screens=1; horizontal overflow=no | [Open MOB-F07-S055](../../audit/screenshots/userflows-live/mob/MOB-F07-S055-tour-section-overview.png) |
| `MOB-F07-S056` | Tour summary | End the tour. | Summary groups captured photos by section and shows total. | screen-tour-summary; active screens=1; horizontal overflow=no | [Open MOB-F07-S056](../../audit/screenshots/userflows-live/mob/MOB-F07-S056-tour-summary.png) |

## Desktop 1440×1000

Viewport: 1440×1000. App width observed: 430px.

### Flow 1: Onboarding and personalization

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `DESK-F01-S001` | Welcome screen | Open the application with clean storage. | OB1 presents Begin and Skip intro. | screen-ob1; active screens=1; horizontal overflow=no | [Open DESK-F01-S001](../../audit/screenshots/userflows-live/desk/DESK-F01-S001-welcome-screen.png) |
| `DESK-F01-S002` | How it works | Select Begin. | OB2 explains ghost overlay, pose library, and auto-capture. | screen-ob2; active screens=1; horizontal overflow=no | [Open DESK-F01-S002](../../audit/screenshots/userflows-live/desk/DESK-F01-S002-how-it-works.png) |
| `DESK-F01-S003` | Interactive onboarding demo | Select Try it. | Demo stage animates and provides coaching feedback. | screen-ob2; active screens=1; horizontal overflow=no | [Open DESK-F01-S003](../../audit/screenshots/userflows-live/desk/DESK-F01-S003-interactive-onboarding-demo.png) |
| `DESK-F01-S004` | Camera permission choice | Wait for demo completion. | OB3 offers camera permission and Demo Mode. | screen-ob3; active screens=1; horizontal overflow=no | [Open DESK-F01-S004](../../audit/screenshots/userflows-live/desk/DESK-F01-S004-camera-permission-choice.png) |
| `DESK-F01-S005` | Goal selection | Continue in Demo Mode. | OB4 presents four persona goals and disabled completion. | screen-ob4; active screens=1; horizontal overflow=no | [Open DESK-F01-S005](../../audit/screenshots/userflows-live/desk/DESK-F01-S005-goal-selection.png) |
| `DESK-F01-S006` | Goal selected | Choose Photographer. | Photographer is highlighted and Start Exploring becomes enabled. | screen-ob4; active screens=1; horizontal overflow=no | [Open DESK-F01-S006](../../audit/screenshots/userflows-live/desk/DESK-F01-S006-goal-selected.png) |
| `DESK-F01-S007` | Onboarding completed | Select Start Exploring. | Home appears with personalized greeting. | screen-home; active screens=1; horizontal overflow=no | [Open DESK-F01-S007](../../audit/screenshots/userflows-live/desk/DESK-F01-S007-onboarding-completed.png) |

### Flow 2: Pose discovery and detail

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `DESK-F02-S008` | Home discovery | Review featured pose and category cards. | Home shows featured CTA, categories, and tab navigation. | screen-home; active screens=1; horizontal overflow=no | [Open DESK-F02-S008](../../audit/screenshots/userflows-live/desk/DESK-F02-S008-home-discovery.png) |
| `DESK-F02-S009` | Library categories | Open the Poses tab. | Search, filters, and 16 category cards are available. | screen-library; active screens=1; horizontal overflow=no | [Open DESK-F02-S009](../../audit/screenshots/userflows-live/desk/DESK-F02-S009-library-categories.png) |
| `DESK-F02-S010` | Boudoir search results | Search for boudoir. | Matching pose cards replace category browsing. | screen-library; active screens=1; horizontal overflow=no | [Open DESK-F02-S010](../../audit/screenshots/userflows-live/desk/DESK-F02-S010-boudoir-search-results.png) |
| `DESK-F02-S011` | Safe empty search | Search using script-like text. | The query is treated as text and an empty state is shown. | screen-library; active screens=1; horizontal overflow=no | [Open DESK-F02-S011](../../audit/screenshots/userflows-live/desk/DESK-F02-S011-safe-empty-search.png) |
| `DESK-F02-S012` | Standing category list | Open the Standing category. | Standing list shows pose thumbnails and count. | screen-category-list; active screens=1; horizontal overflow=no | [Open DESK-F02-S012](../../audit/screenshots/userflows-live/desk/DESK-F02-S012-standing-category-list.png) |
| `DESK-F02-S013` | Pose detail opened | Open S-Curve Stand. | Detail sheet shows title, instructions, actions, avatar, and skeleton. | screen-category-list; active screens=1; horizontal overflow=no | [Open DESK-F02-S013](../../audit/screenshots/userflows-live/desk/DESK-F02-S013-pose-detail-opened.png) |
| `DESK-F02-S014` | Pose side view | Switch the skeleton to Side. | The procedural skeleton changes viewpoint. | screen-category-list; active screens=1; horizontal overflow=no | [Open DESK-F02-S014](../../audit/screenshots/userflows-live/desk/DESK-F02-S014-pose-side-view.png) |
| `DESK-F02-S015` | Pose favorited | Toggle Favorite. | Favorite control remains visibly selected. | screen-category-list; active screens=1; horizontal overflow=no | [Open DESK-F02-S015](../../audit/screenshots/userflows-live/desk/DESK-F02-S015-pose-favorited.png) |

### Flow 3: Session setup, camera, and review

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `DESK-F03-S016` | Session setup default | Start a session from pose detail. | Timer defaults Off and four overlay choices are present. | screen-session-setup; active screens=1; horizontal overflow=no | [Open DESK-F03-S016](../../audit/screenshots/userflows-live/desk/DESK-F03-S016-session-setup-default.png) |
| `DESK-F03-S017` | Overlay preview skeleton | Select skeleton overlay. | Setup preview accurately represents skeleton. | screen-session-setup; active screens=1; horizontal overflow=no | [Open DESK-F03-S017](../../audit/screenshots/userflows-live/desk/DESK-F03-S017-overlay-preview-skeleton.png) |
| `DESK-F03-S018` | Overlay preview ghost | Select ghost overlay. | Setup preview accurately represents ghost. | screen-session-setup; active screens=1; horizontal overflow=no | [Open DESK-F03-S018](../../audit/screenshots/userflows-live/desk/DESK-F03-S018-overlay-preview-ghost.png) |
| `DESK-F03-S019` | Overlay preview off | Select off overlay. | Setup preview accurately represents off. | screen-session-setup; active screens=1; horizontal overflow=no | [Open DESK-F03-S019](../../audit/screenshots/userflows-live/desk/DESK-F03-S019-overlay-preview-off.png) |
| `DESK-F03-S020` | Overlay preview avatar | Select avatar overlay. | Setup preview accurately represents avatar. | screen-session-setup; active screens=1; horizontal overflow=no | [Open DESK-F03-S020](../../audit/screenshots/userflows-live/desk/DESK-F03-S020-overlay-preview-avatar.png) |
| `DESK-F03-S021` | Camera initial state | Begin Capture in demo camera mode. | Score, simulated-scoring disclosure, shutter, and next preview are visible. | screen-camera; active screens=1; horizontal overflow=no | [Open DESK-F03-S021](../../audit/screenshots/userflows-live/desk/DESK-F03-S021-camera-initial-state.png) |
| `DESK-F03-S022` | Flow mode enabled | Toggle Flow Mode. | Flow control visibly changes to ON. | screen-camera; active screens=1; horizontal overflow=no | [Open DESK-F03-S022](../../audit/screenshots/userflows-live/desk/DESK-F03-S022-flow-mode-enabled.png) |
| `DESK-F03-S023` | Camera overlay cycled | Cycle the live overlay. | Camera overlay state changes without leaving the session. | screen-camera; active screens=1; horizontal overflow=no | [Open DESK-F03-S023](../../audit/screenshots/userflows-live/desk/DESK-F03-S023-camera-overlay-cycled.png) |
| `DESK-F03-S024` | Capture review | Press the shutter. | Review shows captured image, score, filters, retake/share/save actions. | screen-review; active screens=1; horizontal overflow=no | [Open DESK-F03-S024](../../audit/screenshots/userflows-live/desk/DESK-F03-S024-capture-review.png) |
| `DESK-F03-S025` | Warm review preset | Select the Warm filter. | Captured review visibly applies the selected preset. | screen-review; active screens=1; horizontal overflow=no | [Open DESK-F03-S025](../../audit/screenshots/userflows-live/desk/DESK-F03-S025-warm-review-preset.png) |
| `DESK-F03-S026` | Capture saved | Save the review to Gallery. | Gallery opens with the newly captured item. | screen-gallery; active screens=1; horizontal overflow=no | [Open DESK-F03-S026](../../audit/screenshots/userflows-live/desk/DESK-F03-S026-capture-saved.png) |

### Flow 4: Gallery management

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `DESK-F04-S027` | Gallery populated | Review captured gallery. | Capture count and card are visible with management controls. | screen-gallery; active screens=1; horizontal overflow=no | [Open DESK-F04-S027](../../audit/screenshots/userflows-live/desk/DESK-F04-S027-gallery-populated.png) |
| `DESK-F04-S028` | Gallery detail actions | Open the first capture. | Save, Copy, Download, Share, Favorite, and Delete are visible. | screen-gallery-detail; active screens=1; horizontal overflow=no | [Open DESK-F04-S028](../../audit/screenshots/userflows-live/desk/DESK-F04-S028-gallery-detail-actions.png) |
| `DESK-F04-S029` | Gallery item copied | Select Copy. | A duplicated capture becomes the selected detail item. | screen-gallery-detail; active screens=1; horizontal overflow=no | [Open DESK-F04-S029](../../audit/screenshots/userflows-live/desk/DESK-F04-S029-gallery-item-copied.png) |
| `DESK-F04-S030` | Gallery sorted by score | Sort by Top score. | Gallery ordering reflects score sort. | screen-gallery; active screens=1; horizontal overflow=no | [Open DESK-F04-S030](../../audit/screenshots/userflows-live/desk/DESK-F04-S030-gallery-sorted-by-score.png) |
| `DESK-F04-S031` | Gallery grouped by pose | Enable Group by pose. | Cards show per-pose group counts. | screen-gallery; active screens=1; horizontal overflow=no | [Open DESK-F04-S031](../../audit/screenshots/userflows-live/desk/DESK-F04-S031-gallery-grouped-by-pose.png) |
| `DESK-F04-S032` | Bulk selection mode | Select the gallery Select control. | Checkboxes and bulk action bar appear. | screen-gallery; active screens=1; horizontal overflow=no | [Open DESK-F04-S032](../../audit/screenshots/userflows-live/desk/DESK-F04-S032-bulk-selection-mode.png) |
| `DESK-F04-S033` | Gallery item selected | Select one capture. | Selection count becomes one and selected card is outlined. | screen-gallery; active screens=1; horizontal overflow=no | [Open DESK-F04-S033](../../audit/screenshots/userflows-live/desk/DESK-F04-S033-gallery-item-selected.png) |

### Flow 5: Progress, profile, and custom editor

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `DESK-F05-S034` | Progress dashboard | Open Progress. | Session, pose, score, and history areas are visible. | screen-progress; active screens=1; horizontal overflow=no | [Open DESK-F05-S034](../../audit/screenshots/userflows-live/desk/DESK-F05-S034-progress-dashboard.png) |
| `DESK-F05-S035` | Profile and tools | Open Profile. | Preferences, editor, marketplace, and tour entry points are visible. | screen-profile; active screens=1; horizontal overflow=no | [Open DESK-F05-S035](../../audit/screenshots/userflows-live/desk/DESK-F05-S035-profile-and-tools.png) |
| `DESK-F05-S036` | Custom pose editor | Open editor with S-Curve Stand. | Twenty sliders and avatar/skeleton/ghost previews render. | screen-custom-pose-editor; active screens=1; horizontal overflow=no | [Open DESK-F05-S036](../../audit/screenshots/userflows-live/desk/DESK-F05-S036-custom-pose-editor.png) |
| `DESK-F05-S037` | Editor joint changed | Set Spine to 35 degrees. | Live previews and numeric value update. | screen-custom-pose-editor; active screens=1; horizontal overflow=no | [Open DESK-F05-S037](../../audit/screenshots/userflows-live/desk/DESK-F05-S037-editor-joint-changed.png) |
| `DESK-F05-S038` | Editor undo | Undo the joint change. | Prior joint state is restored. | screen-custom-pose-editor; active screens=1; horizontal overflow=no | [Open DESK-F05-S038](../../audit/screenshots/userflows-live/desk/DESK-F05-S038-editor-undo.png) |
| `DESK-F05-S039` | Custom pose saved | Save the custom pose. | Saved pose appears in the editor list. | screen-custom-pose-editor; active screens=1; horizontal overflow=no | [Open DESK-F05-S039](../../audit/screenshots/userflows-live/desk/DESK-F05-S039-custom-pose-saved.png) |
| `DESK-F05-S040` | Editor bug report submitted | Submit report with pose data. | Success feedback confirms report storage. | screen-custom-pose-editor; active screens=1; horizontal overflow=no | [Open DESK-F05-S040](../../audit/screenshots/userflows-live/desk/DESK-F05-S040-editor-bug-report-submitted.png) |

### Flow 6: Marketplace

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `DESK-F06-S041` | Marketplace browse | Open Marketplace. | Product grid, search, prices, ratings, and filters appear. | screen-marketplace; active screens=1; horizontal overflow=no | [Open DESK-F06-S041](../../audit/screenshots/userflows-live/desk/DESK-F06-S041-marketplace-browse.png) |
| `DESK-F06-S042` | Marketplace search | Search standing. | Matching product cards remain visible. | screen-marketplace; active screens=1; horizontal overflow=no | [Open DESK-F06-S042](../../audit/screenshots/userflows-live/desk/DESK-F06-S042-marketplace-search.png) |
| `DESK-F06-S043` | Product preview drawer | Preview the first product. | Preview drawer names the first two poses when available. | screen-marketplace; active screens=1; horizontal overflow=no | [Open DESK-F06-S043](../../audit/screenshots/userflows-live/desk/DESK-F06-S043-product-preview-drawer.png) |
| `DESK-F06-S044` | Creator profile drawer | Open the product creator. | Creator identity and catalog are shown. | screen-marketplace; active screens=1; horizontal overflow=no | [Open DESK-F06-S044](../../audit/screenshots/userflows-live/desk/DESK-F06-S044-creator-profile-drawer.png) |
| `DESK-F06-S045` | Free pack purchased | Acquire Essential Standing Poses. | Product becomes owned and its action changes to Open. | screen-marketplace; active screens=1; horizontal overflow=no | [Open DESK-F06-S045](../../audit/screenshots/userflows-live/desk/DESK-F06-S045-free-pack-purchased.png) |
| `DESK-F06-S046` | Owned products | Open My Packs. | Purchased pack appears with Open and Rate controls. | screen-marketplace; active screens=1; horizontal overflow=no | [Open DESK-F06-S046](../../audit/screenshots/userflows-live/desk/DESK-F06-S046-owned-products.png) |
| `DESK-F06-S047` | Creator dashboard | Open Creator. | Earnings summary and publish form are visible. | screen-marketplace; active screens=1; horizontal overflow=no | [Open DESK-F06-S047](../../audit/screenshots/userflows-live/desk/DESK-F06-S047-creator-dashboard.png) |

### Flow 7: Tour creation and playback

| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |
|---|---|---|---|---|---|
| `DESK-F07-S048` | Tour creator populated | Create two sections with six poses. | Builder shows sections, pose cards, sources, and actions. | screen-tour-creator; active screens=1; horizontal overflow=no | [Open DESK-F07-S048](../../audit/screenshots/userflows-live/desk/DESK-F07-S048-tour-creator-populated.png) |
| `DESK-F07-S049` | Tour section added | Select Add Section. | A third section appears. | screen-tour-creator; active screens=1; horizontal overflow=no | [Open DESK-F07-S049](../../audit/screenshots/userflows-live/desk/DESK-F07-S049-tour-section-added.png) |
| `DESK-F07-S050` | Tour session started | Start Tour Session. | Current pose, section/pose progress, navigation, camera, and photo strip appear. | screen-tour-session; active screens=1; horizontal overflow=no | [Open DESK-F07-S050](../../audit/screenshots/userflows-live/desk/DESK-F07-S050-tour-session-started.png) |
| `DESK-F07-S051` | Tour next pose | Select Next pose. | Pose progress and procedural preview advance. | screen-tour-session; active screens=1; horizontal overflow=no | [Open DESK-F07-S051](../../audit/screenshots/userflows-live/desk/DESK-F07-S051-tour-next-pose.png) |
| `DESK-F07-S052` | Tour next section | Select Next Section. | Section progress moves to Dynamic and pose resets. | screen-tour-session; active screens=1; horizontal overflow=no | [Open DESK-F07-S052](../../audit/screenshots/userflows-live/desk/DESK-F07-S052-tour-next-section.png) |
| `DESK-F07-S053` | Tour capture added | Capture the current tour pose. | Current-section photo strip gains a tagged thumbnail. | screen-tour-session; active screens=1; horizontal overflow=no | [Open DESK-F07-S053](../../audit/screenshots/userflows-live/desk/DESK-F07-S053-tour-capture-added.png) |
| `DESK-F07-S054` | Tour pose search | Search for wind within the tour. | Matching tour pose is offered as a jump target. | screen-tour-session; active screens=1; horizontal overflow=no | [Open DESK-F07-S054](../../audit/screenshots/userflows-live/desk/DESK-F07-S054-tour-pose-search.png) |
| `DESK-F07-S055` | Tour section overview | Open Section overview. | Drawer lists every section and pose count. | screen-tour-session; active screens=1; horizontal overflow=no | [Open DESK-F07-S055](../../audit/screenshots/userflows-live/desk/DESK-F07-S055-tour-section-overview.png) |
| `DESK-F07-S056` | Tour summary | End the tour. | Summary groups captured photos by section and shows total. | screen-tour-summary; active screens=1; horizontal overflow=no | [Open DESK-F07-S056](../../audit/screenshots/userflows-live/desk/DESK-F07-S056-tour-summary.png) |

## Recommendations

1. Separate the pose-detail Close and Favorite hit regions and add a Playwright click regression at both viewports.
2. Ensure `closePoseSheet()` runs for all navigation paths into marketplace and tour screens; assert that overlays/sheets have no open class after screen changes.
3. Decide whether desktop should intentionally remain a mobile preview shell. If not, introduce desktop breakpoints for wider grids, persistent side navigation, and multi-column editor/tour layouts.
4. Keep this 112-screenshot audit as a release regression suite, but allow toasts to settle before visual baselines when the toast is not the target state.
