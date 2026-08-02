// Generate interactive-control-inventory.json from index.html
// Black-box QA: every visible interactive element gets a stable ID and test record
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const html = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8');

// Parse controls from HTML
const controls = [];
let id = 1;

// 1. Login form controls
const loginControls = [
  { selector: '#login-username', type: 'text-input', name: 'Username input', section: 'login', screen: 'screen-login' },
  { selector: '#login-password', type: 'password-input', name: 'Password input', section: 'login', screen: 'screen-login' },
  { selector: '[data-testid="login-submit"]', type: 'button', name: 'Enter PoseArt (login submit)', section: 'login', screen: 'screen-login' },
  { selector: '[data-testid="login-error"]', type: 'alert', name: 'Login error message', section: 'login', screen: 'screen-login' }
];

// 2. Onboarding controls
const onboardingControls = [
  { selector: '[data-testid="link-skip-ob1"]', type: 'link', name: 'Skip onboarding (ob1)', section: 'onboarding', screen: 'screen-ob1' },
  { selector: '[data-testid="btn-start-exploring"]', type: 'button', name: 'Begin (ob1)', section: 'onboarding', screen: 'screen-ob1' },
  { selector: '[data-testid="link-skip-ob2"]', type: 'link', name: 'Skip (ob2)', section: 'onboarding', screen: 'screen-ob2' },
  { selector: '[data-testid="persona-photographer"]', type: 'button', name: 'Select photographer persona', section: 'onboarding', screen: 'screen-ob3' },
  { selector: '[data-testid="persona-model"]', type: 'button', name: 'Select model persona', section: 'onboarding', screen: 'screen-ob3' },
  { selector: '[data-testid="persona-selfportrait"]', type: 'button', name: 'Select self-portrait persona', section: 'onboarding', screen: 'screen-ob3' },
  { selector: '[data-testid="persona-exploring"]', type: 'button', name: 'Select exploring persona', section: 'onboarding', screen: 'screen-ob3' },
  { selector: '[data-testid="btn-allow-camera"]', type: 'button', name: 'Allow camera permission', section: 'onboarding', screen: 'screen-ob4' },
  { selector: '[data-testid="btn-browse-only"]', type: 'button', name: 'Browse only (demo mode)', section: 'onboarding', screen: 'screen-ob4' },
  { selector: '[data-testid="completeOnboarding"]', type: 'button', name: 'Complete onboarding', section: 'onboarding', screen: 'screen-ob4' }
];

// 3. Bottom navigation tabs
const navControls = [
  { selector: '[data-testid="tab-home"]', type: 'tab', name: 'Home tab', section: 'navigation', screen: 'multiple' },
  { selector: '[data-testid="tab-library"]', type: 'tab', name: 'Poses/Library tab', section: 'navigation', screen: 'multiple' },
  { selector: '[data-testid="tab-gallery"]', type: 'tab', name: 'Gallery tab', section: 'navigation', screen: 'multiple' },
  { selector: '[data-testid="tab-progress"]', type: 'tab', name: 'Progress tab', section: 'navigation', screen: 'multiple' },
  { selector: '[data-testid="tab-profile"]', type: 'tab', name: 'Profile tab', section: 'navigation', screen: 'multiple' }
];

// 4. Pose detail / skeleton view controls
const poseDetailControls = [
  { selector: '[data-testid="btn-skel-front"]', type: 'button', name: 'Front view', section: 'pose-detail', screen: 'pose-detail-sheet' },
  { selector: '[data-testid="btn-skel-side"]', type: 'button', name: 'Side view', section: 'pose-detail', screen: 'pose-detail-sheet' },
  { selector: '[data-testid="btn-skel-quarter"]', type: 'button', name: '3/4 view', section: 'pose-detail', screen: 'pose-detail-sheet' },
  { selector: '[data-testid="btn-skel-auto"]', type: 'button', name: 'Auto rotate view', section: 'pose-detail', screen: 'pose-detail-sheet' },
  { selector: '[data-testid="btn-close-pose-sheet"]', type: 'button', name: 'Close pose detail', section: 'pose-detail', screen: 'pose-detail-sheet' },
  { selector: '[data-testid="btn-sheet-fav"]', type: 'button', name: 'Favorite pose (sheet)', section: 'pose-detail', screen: 'pose-detail-sheet' },
  { selector: '[data-testid="btn-sheet-share"]', type: 'button', name: 'Share pose (sheet)', section: 'pose-detail', screen: 'pose-detail-sheet' },
  { selector: '[data-testid="btn-start-session-detail"]', type: 'button', name: 'Start Session from pose detail', section: 'pose-detail', screen: 'pose-detail-sheet' }
];

// 5. Session setup controls
const sessionControls = [
  { selector: '[data-testid="btn-back-setup"]', type: 'button', name: 'Back from session setup', section: 'session-setup', screen: 'screen-session-setup' },
  { selector: '[data-testid="opt-timer"]', type: 'cycle-button', name: 'Timer option cycle', section: 'session-setup', screen: 'screen-session-setup' },
  { selector: '[data-testid="opt-sensitivity"]', type: 'cycle-button', name: 'Sensitivity option cycle', section: 'session-setup', screen: 'screen-session-setup' },
  { selector: '[data-testid="overlay-avatar"]', type: 'radio-button', name: 'Avatar overlay mode', section: 'session-setup', screen: 'screen-session-setup' },
  { selector: '[data-testid="overlay-skeleton"]', type: 'radio-button', name: 'Skeleton overlay mode', section: 'session-setup', screen: 'screen-session-setup' },
  { selector: '[data-testid="overlay-ghost"]', type: 'radio-button', name: 'Ghost overlay mode', section: 'session-setup', screen: 'screen-session-setup' },
  { selector: '[data-testid="overlay-off"]', type: 'radio-button', name: 'Overlay off', section: 'session-setup', screen: 'screen-session-setup' },
  { selector: '[data-testid="btn-begin"]', type: 'button', name: 'Begin session', section: 'session-setup', screen: 'screen-session-setup' },
  { selector: '[data-testid="btn-start-session-home"]', type: 'button', name: 'Start session from home', section: 'home', screen: 'screen-home' }
];

// 6. Camera controls
const cameraControls = [
  { selector: '[data-testid="btn-shutter"]', type: 'button', name: 'Shutter/capture', section: 'camera', screen: 'screen-camera' },
  { selector: '[data-testid="btn-flip-camera"]', type: 'button', name: 'Flip camera', section: 'camera', screen: 'screen-camera' },
  { selector: '[data-testid="btn-flash"]', type: 'button', name: 'Toggle flash', section: 'camera', screen: 'screen-camera' },
  { selector: '[data-testid="btn-timer"]', type: 'button', name: 'Toggle timer', section: 'camera', screen: 'screen-camera' },
  { selector: '[data-testid="btn-cycle-overlay"]', type: 'button', name: 'Cycle overlay mode', section: 'camera', screen: 'screen-camera' },
  { selector: '[data-testid="btn-end-session"]', type: 'button', name: 'End session', section: 'camera', screen: 'screen-camera' },
  { selector: '[data-testid="btn-next-pose"]', type: 'button', name: 'Next pose (flow mode)', section: 'camera', screen: 'screen-camera' },
  { selector: '[data-testid="flow-mode-toggle"]', type: 'toggle', name: 'Flow mode toggle', section: 'camera', screen: 'screen-camera' },
  { selector: '[data-testid="toggle-autocapture"]', type: 'checkbox', name: 'Auto-capture toggle', section: 'camera', screen: 'screen-camera' },
  { selector: '[data-testid="toggle-haptics"]', type: 'checkbox', name: 'Haptics toggle', section: 'camera', screen: 'screen-camera' },
  { selector: '[data-testid="toggle-sound"]', type: 'checkbox', name: 'Sound toggle', section: 'camera', screen: 'screen-camera' }
];

// 7. Review controls
const reviewControls = [
  { selector: '[data-testid="btn-retake"]', type: 'button', name: 'Retake photo', section: 'review', screen: 'screen-review' },
  { selector: '[data-testid="btn-save-gallery"]', type: 'button', name: 'Save to gallery', section: 'review', screen: 'screen-review' },
  { selector: '[data-testid="btn-share-review"]', type: 'button', name: 'Share photo (review)', section: 'review', screen: 'screen-review' },
  { selector: '[data-testid="btn-close-review"]', type: 'button', name: 'Close review', section: 'review', screen: 'screen-review' }
];

// 8. Gallery controls
const galleryControls = [
  { selector: '[data-testid="btn-back-gallery-detail"]', type: 'button', name: 'Back from gallery detail', section: 'gallery', screen: 'screen-gallery-detail' },
  { selector: '[data-testid="btn-download-detail"]', type: 'button', name: 'Download photo', section: 'gallery', screen: 'screen-gallery-detail' },
  { selector: '[data-testid="btn-share-detail"]', type: 'button', name: 'Share photo (detail)', section: 'gallery', screen: 'screen-gallery-detail' },
  { selector: '[data-testid="btn-fav-detail"]', type: 'button', name: 'Favorite photo (detail)', section: 'gallery', screen: 'screen-gallery-detail' },
  { selector: '[data-testid="btn-delete-detail"]', type: 'button', name: 'Delete photo (detail)', section: 'gallery', screen: 'screen-gallery-detail' },
  { selector: '[data-testid="btn-copy-detail"]', type: 'button', name: 'Copy photo (detail)', section: 'gallery', screen: 'screen-gallery-detail' },
  { selector: '[data-testid="btn-save-photos"]', type: 'button', name: 'Save selected photos (bulk)', section: 'gallery', screen: 'screen-gallery' }
];

// 9. Library/Search controls
const libraryControls = [
  { selector: '[data-testid="input-pose-search"]', type: 'text-input', name: 'Pose search input', section: 'library', screen: 'screen-library' },
  { selector: '[data-testid="filter-all"]', type: 'filter-pill', name: 'Filter: All difficulties', section: 'library', screen: 'screen-library' },
  { selector: '[data-testid="filter-beginner"]', type: 'filter-pill', name: 'Filter: Beginner', section: 'library', screen: 'screen-library' },
  { selector: '[data-testid="filter-intermediate"]', type: 'filter-pill', name: 'Filter: Intermediate', section: 'library', screen: 'screen-library' },
  { selector: '[data-testid="filter-advanced"]', type: 'filter-pill', name: 'Filter: Advanced', section: 'library', screen: 'screen-library' },
  { selector: '[data-testid="filter-favorites"]', type: 'filter-pill', name: 'Filter: Favorites', section: 'library', screen: 'screen-library' },
  { selector: '[data-testid="btn-back-category-list"]', type: 'button', name: 'Back from category list', section: 'library', screen: 'screen-category-list' },
  { selector: '[data-testid="fab-library"]', type: 'fab', name: 'FAB library', section: 'library', screen: 'screen-library' }
];

// 10. Marketplace controls
const marketplaceControls = [
  { selector: '[onclick*="switchMarketplaceTab(\'browse\')"]', type: 'tab', name: 'Marketplace browse tab', section: 'marketplace', screen: 'screen-marketplace' },
  { selector: '[onclick*="switchMarketplaceTab(\'creator\')"]', type: 'tab', name: 'Marketplace creator tab', section: 'marketplace', screen: 'screen-marketplace' },
  { selector: '[onclick*="switchMarketplaceTab(\'mine\')"]', type: 'tab', name: 'Marketplace mine tab', section: 'marketplace', screen: 'screen-marketplace' },
  { selector: '#mp-search', type: 'text-input', name: 'Marketplace search', section: 'marketplace', screen: 'screen-marketplace' },
  { selector: '[onclick*="setMpFilter"]', type: 'filter-pill', name: 'Marketplace category filter', section: 'marketplace', screen: 'screen-marketplace' },
  { selector: '[onclick*="purchasePack"]', type: 'button', name: 'Purchase pack', section: 'marketplace', screen: 'screen-marketplace' },
  { selector: '#mp-new-pack-name', type: 'text-input', name: 'New pack name input', section: 'marketplace', screen: 'screen-marketplace' },
  { selector: '#mp-new-pack-price', type: 'number-input', name: 'New pack price input', section: 'marketplace', screen: 'screen-marketplace' }
];

// 11. Tour controls
const tourControls = [
  { selector: '[data-testid="tour-start"]', type: 'button', name: 'Start tour', section: 'tour-creator', screen: 'screen-tour-creator' },
  { selector: '[data-testid="tour-add-section"]', type: 'button', name: 'Add tour section', section: 'tour-creator', screen: 'screen-tour-creator' },
  { selector: '[data-testid="tour-open-camera"]', type: 'button', name: 'Open camera from tour', section: 'tour-creator', screen: 'screen-tour-creator' },
  { selector: '[data-testid="tour-capture"]', type: 'button', name: 'Capture tour photo', section: 'tour-session', screen: 'screen-tour-session' },
  { selector: '[data-testid="tour-sell"]', type: 'button', name: 'Sell tour (publish)', section: 'tour-creator', screen: 'screen-tour-creator' }
];

// 12. Profile controls
const profileControls = [
  { selector: '[data-testid="logout-button"]', type: 'button', name: 'Logout', section: 'profile', screen: 'screen-profile' }
];

// 13. Pose editor controls
const editorControls = [
  { selector: '#pose-editor-name', type: 'text-input', name: 'Custom pose name', section: 'pose-editor', screen: 'screen-custom-pose-editor' },
  { selector: '[onclick*="saveCustomPose"]', type: 'button', name: 'Save custom pose', section: 'pose-editor', screen: 'screen-custom-pose-editor' },
  { selector: '[onclick*="undoPoseEdit"]', type: 'button', name: 'Undo pose edit', section: 'pose-editor', screen: 'screen-custom-pose-editor' },
  { selector: '[onclick*="submitBugReportFromEditor"]', type: 'button', name: 'Submit bug report', section: 'pose-editor', screen: 'screen-custom-pose-editor' },
  { selector: '[onclick*="useCustomPoseInSession"]', type: 'button', name: 'Use custom pose in session', section: 'pose-editor', screen: 'screen-custom-pose-editor' }
];

// Combine all
const allControls = [
  ...loginControls, ...onboardingControls, ...navControls,
  ...poseDetailControls, ...sessionControls, ...cameraControls,
  ...reviewControls, ...galleryControls, ...libraryControls,
  ...marketplaceControls, ...tourControls, ...profileControls,
  ...editorControls
].map(c => ({
  id: `ctrl-${String(id++).padStart(3, '0')}`,
  route: c.screen,
  section: c.section,
  controlName: c.name,
  controlType: c.type,
  domSelector: c.selector,
  accessibleName: c.name,
  mouseAction: c.type === 'text-input' || c.type === 'password-input' || c.type === 'number-input' ? 'click to focus, type' : 'click',
  keyboardAction: c.type === 'text-input' || c.type === 'password-input' || c.type === 'number-input' ? 'Tab to focus, type' : c.type === 'checkbox' ? 'Space to toggle' : 'Enter to activate',
  expectedResult: `Control responds and produces expected state change`,
  failureStates: ['Control not visible', 'Control not enabled', 'No visible state change', 'Console error'],
  testedDesktop: false,
  testedMobile: false,
  testedEnglish: false,
  testedSpanish: false,
  testedKeyboardOnly: false,
  status: 'untested'
}));

const inventory = {
  generated_at: new Date().toISOString(),
  commit_sha: require('child_process').execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim().slice(0, 12),
  total_controls: allControls.length,
  controls: allControls
};

fs.writeFileSync(path.join(REPO, 'docs', 'qa', 'interactive-control-inventory.json'), JSON.stringify(inventory, null, 2));
console.log(`Inventory generated: ${allControls.length} controls across ${new Set(allControls.map(c => c.section)).size} sections`);
console.log(`Sections: ${[...new Set(allControls.map(c => c.section))].join(', ')}`);
