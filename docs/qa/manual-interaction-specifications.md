# Manual Interaction Specifications — Black-Box QA

> **Purpose:** Define the expected behavior of every feature before testing. Each specification describes the smallest meaningful interaction sequence. Tests use only mouse and keyboard — no `page.evaluate`, no injected JavaScript, no direct state manipulation.

---

## Feature 1: Login

```
Feature: Login authentication
Route: screen-login
User goal: Access the application as an authenticated user
Starting state: App loaded, login screen visible
Required data: Username (tester1), Password (PoseArt2026!)
Visible controls: Username input (#login-username), Password input (#login-password), Submit button ([data-testid="login-submit"]), Error message (#login-error)
Expected initial state: Login form visible, error message hidden, inputs empty
Known dependencies: js/auth.js (client-side Base64 auth)

Step 1:
User action: Click username input field
Input method: Mouse click
Pre-interaction assertions: Login screen active, username input visible and empty
Expected immediate visual response: Focus ring on username input, cursor blinking
Expected resulting state: Username input focused, ready to type
Post-interaction assertions: document.activeElement === #login-username
Possible failure states: Input not focusable, input not visible
Recovery action: Tab to focus the input instead

Step 2:
User action: Type "tester1" into username field
Input method: Keyboard typing
Pre-interaction assertions: Username input focused
Expected immediate visual response: Characters appear in input
Expected resulting state: Username field contains "tester1"
Post-interaction assertions: #login-username.value === "tester1"
Possible failure states: Input doesn't accept text
Recovery action: Clear and retype

Step 3:
User action: Press Tab key
Input method: Keyboard (Tab)
Pre-interaction assertions: Username field has "tester1"
Expected immediate visual response: Focus moves to password input
Expected resulting state: Password input focused
Post-interaction assertions: document.activeElement === #login-password
Possible failure states: Focus jumps to wrong element
Recovery action: Click password input directly

Step 4:
User action: Type password (redacted — PoseArt2026!)
Input method: Keyboard typing
Pre-interaction assertions: Password input focused
Expected immediate visual response: Dots/bullets appear (password masked)
Expected resulting state: Password field contains the password (masked)
Post-interaction assertions: #login-password.value.length > 0
Possible failure states: Input doesn't accept text
Recovery action: Clear and retype

Step 5:
User action: Press Enter OR click "Enter PoseArt" button
Input method: Keyboard (Enter) or Mouse click
Pre-interaction assertions: Both fields filled, submit button visible and enabled
Expected immediate visual response: Screen transitions away from login
Expected resulting state: Onboarding screen (ob1) or home screen visible
Post-interaction assertions: .screen.active.id === "screen-ob1" or "screen-home"
Possible failure states: Error message appears ("Username or password is incorrect"), screen doesn't change
Recovery action: Check credentials, clear and retry

Completion state: User is on ob1 or home screen
Expected persisted data: sessionStorage has poseart_auth_session
Expected non-persisted data: Login form fields should be cleared
Exit or reset procedure: Click logout button in profile
Keyboard-only result: Full login possible via Tab + type + Enter
Mobile result: Same behavior, touch targets adequate (min 44px)
Spanish result: Labels in Spanish if i18n configured
Reduced-motion result: No animation on screen transition
```

---

## Feature 2: Onboarding Flow

```
Feature: Onboarding sequence (4 screens)
Route: screen-ob1 → ob2 → ob3 → ob4 → home
User goal: Complete initial setup (persona selection, camera permission)
Starting state: Logged in, on screen-ob1
Required data: None (selections are optional)
Visible controls: Begin button, Skip link (ob1); persona buttons (ob3); camera/dem o buttons (ob4)

Step 1:
User action: Click "Begin" button
Input method: Mouse click
Expected: Transition to screen-ob2

Step 2:
User action: Click "Skip" link
Input method: Mouse click
Expected: Transition to screen-ob3

Step 3:
User action: Click a persona (e.g., "Photographer")
Input method: Mouse click
Expected: Persona highlighted, transition to screen-ob4

Step 4:
User action: Click "Browse Only" (demo mode)
Input method: Mouse click
Expected: Transition to screen-home

Completion state: Home screen visible
Keyboard-only result: Tab through buttons, Enter to activate
Mobile result: Touch targets adequate
```

---

## Feature 3: Bottom Navigation

```
Feature: Tab navigation between main sections
Route: All main screens
User goal: Switch between Home, Library, Gallery, Progress, Profile
Starting state: Home screen active
Visible controls: 5 tab buttons in bottom nav (#tab-home, #tab-library, #tab-gallery, #tab-progress, #tab-profile)

Step 1-5: Click each tab in sequence
For each:
  User action: Click tab button
  Expected: Corresponding screen becomes active, tab gets aria-selected="true"
  Post-assertion: .screen.active.id matches expected screen

Step 6: Keyboard test
  User action: Press Tab to reach a tab, press Enter
  Expected: Tab activates, screen changes

Step 7: Back button test
  User action: Click browser back button
  Expected: Returns to previous screen (if history exists)

Completion state: All 5 tabs tested, all produce correct screen
```

---

## Feature 4: Pose Library Browse

```
Feature: Browse pose library by category
Route: screen-library → screen-category-list → pose-detail-sheet
User goal: Find and view a specific pose
Starting state: Library screen active
Visible controls: Category cards (rendered dynamically), search input, filter pills

Step 1:
User action: Click a category card (e.g., "Standing")
Expected: Transition to screen-category-list with poses from that category

Step 2:
User action: Scroll through pose list
Expected: More poses become visible (if list is long)

Step 3:
User action: Click a pose card
Expected: Pose detail sheet slides up, showing pose name, instructions, skeleton canvas

Step 4:
User action: Click "Front" view button
Expected: Skeleton renders from front view (yaw=0)

Step 5:
User action: Click "Side" view button
Expected: Skeleton rotates to side view (yaw=90)

Step 6:
User action: Click "3/4" view button
Expected: Skeleton rotates to quarter view (yaw=45)

Step 7:
User action: Click "Auto" view button
Expected: Skeleton begins auto-rotating

Step 8:
User action: Click close button
Expected: Pose detail sheet closes, returns to category list

Completion state: Pose viewed in 4 angles, sheet closed properly
Keyboard-only result: Tab to category card, Enter to open, Tab to view buttons
Mobile result: Cards touch-friendly, sheet slides up
```

---

## Feature 5: Pose Search

```
Feature: Search poses by name, mood, or category
Route: screen-library
User goal: Find poses matching a keyword
Starting state: Library screen active
Visible controls: #pose-search-input ([data-testid="input-pose-search"])

Step 1:
User action: Click search input
Expected: Input focused, cursor visible

Step 2:
User action: Type "boudoir"
Expected: Search results appear below, showing matching poses

Step 3:
User action: Clear search input (select all + Delete)
Expected: Results clear, all poses visible again

Step 4:
User action: Type "xyznonexistent"
Expected: "No results" message appears

Step 5:
User action: Click a search result
Expected: Pose detail sheet opens for that pose

Completion state: Search filters poses correctly, empty results handled
```

---

## Feature 6: Favorites

```
Feature: Favorite and unfavorite a pose
Route: pose-detail-sheet
User goal: Mark a pose as favorite for quick access
Starting state: Pose detail sheet open for any pose
Visible controls: Favorite button ([data-testid="btn-sheet-fav"])

Step 1:
User action: Click favorite button
Expected: Button toggles to "active" state (filled heart/icon), toast "Added to favorites"

Step 2:
User action: Click favorite button again
Expected: Button toggles to inactive state, toast "Removed from favorites"

Step 3:
User action: Close pose sheet, go to library, click "Favorites" filter
Expected: Only favorited poses appear

Completion state: Favorite state persists in localStorage, filter works
```

---

## Feature 7: Session Setup

```
Feature: Configure and start a camera session
Route: screen-session-setup
User goal: Set timer, sensitivity, overlay mode, and begin session
Starting state: Session setup screen active
Visible controls: Timer cycle button, Sensitivity cycle button, 4 overlay mode buttons, Begin button

Step 1:
User action: Click timer option button
Expected: Timer cycles through Off/3s/5s/10s

Step 2:
User action: Click sensitivity option button
Expected: Sensitivity cycles through Strict/Balanced/Relaxed

Step 3:
User action: Click "Skeleton" overlay button
Expected: Skeleton overlay selected (highlighted)

Step 4:
User action: Click "Ghost" overlay button
Expected: Ghost overlay selected instead

Step 5:
User action: Click "Begin" button
Expected: Transition to camera screen

Completion state: Session options configured, camera screen active
```

---

## Feature 8: Camera Capture

```
Feature: Capture a photo during a session
Route: screen-camera
User goal: Take a photo using the camera with overlay guidance
Starting state: Camera screen active, camera stream running or demo mode
Visible controls: Shutter button, flip camera, flash, timer, overlay cycle, end session

Step 1:
User action: Click shutter button
Expected: Flash effect, photo captured, review screen appears (or photo saved to gallery)

Step 2 (if review appears):
User action: Click "Save to Gallery"
Expected: Photo saved, returns to camera

Step 3:
User action: Click "End Session"
Expected: Session ends, returns to home or gallery

Completion state: Photo captured and saved to gallery
Note: Camera may not work in headless test — test screen reachability and control presence
```

---

## Feature 9: Gallery

```
Feature: View and manage captured photos
Route: screen-gallery → screen-gallery-detail
User goal: Browse, filter, favorite, delete, download photos
Starting state: Gallery screen active with at least one photo (or empty state)
Visible controls: Filter pills, sort options, photo thumbnails, selection mode toggle

Step 1:
User action: Click a photo thumbnail
Expected: Gallery detail screen opens showing the photo larger

Step 2:
User action: Click "Download"
Expected: Browser download triggered (or share sheet)

Step 3:
User action: Click "Favorite" (heart)
Expected: Photo marked as favorite

Step 4:
User action: Click back button
Expected: Returns to gallery list

Step 5:
User action: Click "Favorites" filter
Expected: Only favorited photos shown

Step 6 (empty state):
User action: Navigate to gallery with no photos
Expected: Empty state message displayed

Completion state: Gallery browse, detail, filter, favorite all work
```

---

## Feature 10: Marketplace

```
Feature: Browse and purchase pose packs
Route: screen-marketplace
User goal: Browse marketplace, acquire free pack, simulate paid purchase
Starting controls: Browse/Creator/Mine tabs, search, filter pills, purchase buttons

Step 1:
User action: Click "Browse" tab
Expected: Marketplace products visible

Step 2:
User action: Type in marketplace search
Expected: Products filtered by search term

Step 3:
User action: Click "Free" filter
Expected: Only free products shown

Step 4:
User action: Click "Get" on a free pack
Expected: Toast "Added to your library"

Step 5:
User action: Click "Mine" tab
Expected: Owned packs shown including the newly acquired one

Step 6:
User action: Go back to Browse, click "Buy" on a paid pack
Expected: Toast "Processing payment..." then "Purchase complete!" (simulated)

Completion state: Free pack acquired, paid pack "purchased" (simulated)
```

---

## Feature 11: Custom Pose Editor

```
Feature: Create and save a custom pose
Route: screen-custom-pose-editor
User goal: Adjust joint sliders, preview, save custom pose
Visible controls: Name input, joint sliders, undo button, save button, preview canvases

Step 1:
User action: Click name input, type "My Test Pose"
Expected: Name field populated

Step 2:
User action: Drag a joint slider (e.g., spine)
Expected: Avatar/skeleton preview updates in real-time

Step 3:
User action: Click "Undo"
Expected: Last slider change reverted

Step 4:
User action: Click "Save"
Expected: Toast "Pose saved", pose added to library

Step 5:
User action: Navigate to library
Expected: Custom pose appears in library

Completion state: Custom pose created, saved, and visible in library
```

---

## Feature 12: Tour Creator

```
Feature: Create a tour with sections and poses
Route: screen-tour-creator
User goal: Create a tour, add sections, add poses to sections
Visible controls: Tour name input, add section button, section list, save button

Step 1:
User action: Enter tour name
Expected: Name field populated

Step 2:
User action: Click "Add Section"
Expected: New section appears in list

Step 3:
User action: Click on a section to expand
Expected: Section expands showing pose slots

Step 4:
User action: Click "Save Tour"
Expected: Toast confirms save, tour persists

Completion state: Tour with at least one section created and saved
```

---

## Feature 13: Progress Dashboard

```
Feature: View session progress and stats
Route: screen-progress
User goal: See session count, captured photos, achievements
Visible controls: Stat cards, achievement badges (if any)

Step 1:
User action: Navigate to progress tab
Expected: Progress screen visible with stats

Step 2:
User action: Verify session count matches actual sessions
Expected: Numbers are accurate (or show 0 if no sessions)

Completion state: Progress screen displays correct stats
```

---

## Feature 14: Profile and Logout

```
Feature: View profile and logout
Route: screen-profile
User goal: See user info and log out
Visible controls: Username display, logout button

Step 1:
User action: Navigate to profile tab
Expected: Profile screen visible, username displayed

Step 2:
User action: Click "Logout" button
Expected: Session cleared, login screen appears

Step 3:
User action: Attempt to navigate back (browser back)
Expected: Login screen remains (auth gate enforced)

Completion state: User logged out, auth gate enforced
```

---

## Failure-State Test Cases

| # | Feature | Failure State | Expected Behavior |
|---|---|---|---|
| F-01 | Login | Empty username | Error: "Enter both username and password." |
| F-02 | Login | Empty password | Error: "Enter both username and password." |
| F-03 | Login | Wrong password | Error: "Username or password is incorrect." |
| F-04 | Login | Nonexistent username | Error: "Username or password is incorrect." |
| F-05 | Search | Empty search | All poses shown (no filter) |
| F-06 | Search | Gibberish search | "No results" message |
| F-07 | Gallery | Empty gallery | Empty state message |
| F-08 | Marketplace | Purchase already owned pack | Toast: "Already owned" |
| F-09 | Pose editor | Save without name | Should use default name or show error |
| F-10 | Camera | Camera permission denied | Demo mode activated |
| F-11 | Navigation | Rapid tab switching | No errors, last tab wins |
| F-12 | Session | End session with 0 captures | No session saved, returns home |
| F-13 | Tour | Save tour with no sections | Should save empty tour or show warning |
| F-14 | Login | Rapid double-submit | No duplicate sessions |
| F-15 | Any | Refresh during workflow | State restored from localStorage |
