// ============================================================
// PoseArt v2 — Main Application Controller
// Gallery tab, category list, search, sharing, onboarding rework
// ============================================================

// PR-v8 (v1.8) — Global Error Boundary.
// Vibe-coded apps commonly lack error boundaries, causing white-screen
// crashes when uncaught JS errors occur. This global handler catches
// uncaught errors and promise rejections, logs them, and shows a
// non-blocking toast instead of crashing the app.
// Per directive Phase 8: "Silent errors + no error boundaries" is a
// common vibe-coded failure mode to preempt.
(function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return;
  if (window._errorBoundarySetup) return;
  window._errorBoundarySetup = true;

  window.addEventListener('error', function(e) {
    console.error('[PoseArt Error Boundary]', e.error || e.message);
    // Show a non-blocking toast
    if (typeof window.showToast === 'function') {
      window.showToast('⚠ Something went wrong. Try again.');
    }
    // Prevent the default white-screen crash
    e.preventDefault();
  });

  window.addEventListener('unhandledrejection', function(e) {
    console.error('[PoseArt Error Boundary] Unhandled promise rejection:', e.reason);
    if (typeof window.showToast === 'function') {
      window.showToast('⚠ Background task failed. Try again.');
    }
    e.preventDefault();
  });

  console.log('%cPoseArt Error Boundary active.', 'color:#4CAF7D;font-size:10px;');
})();

// ── STATE ─────────────────────────────────────────────────────
const AppState = {
  currentScreen: 'ob1',
  currentTab: 'home',
  selectedPoseId: 'scurve-stand',
  overlayModes: ['avatar', 'skeleton', 'ghost', 'off'],
  overlayModeIndex: 0,
  sessionOptions: {
    // Simplified setup: Timer + Sensitivity only
    timer: ['Off', '3 sec', '5 sec', '10 sec'],
    timerIndex: 0,
    sensitivity: ['Strict', 'Balanced', 'Relaxed'],
    sensitivityIndex: 1,
  },
  timerCountdown: null,
  flashEnabled: false,
  sessionCount: 0,
  capturedCount: 0,
  galleryDirty: true,
  selectedGoal: null,
  gallerySelectedId: null,
  screenStack: [],  // Navigation history for goBack()
  isDemoMode: false,  // True when user skipped camera permission
  isTourSession: false,
  currentTourId: null,
  currentTourSession: null,
  flowMode: false,
  burstActive: false,
};
window.AppState = AppState;

// PR-v9 (v1.9) — Restore controller-owned preferences before the first render.
// poses-data.js owns the guarded localStorage wrappers and is loaded first.
if (typeof window.restore === 'function') {
  const restoredGoal = window.restore('selectedGoal');
  const restoredOptions = window.restore('sessionOptions');
  if (typeof restoredGoal === 'string') AppState.selectedGoal = restoredGoal;
  if (restoredOptions && typeof restoredOptions === 'object') {
    if (Number.isInteger(restoredOptions.timerIndex)) AppState.sessionOptions.timerIndex = restoredOptions.timerIndex;
    if (Number.isInteger(restoredOptions.sensitivityIndex)) AppState.sessionOptions.sensitivityIndex = restoredOptions.sensitivityIndex;
  }
}

// ── INITIALIZATION ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initStatusBarTime();
  // Initialize analytics (no-op if PostHog key not set — safe for F&F)
  PoseArtAnalytics?.init();
  renderCategoryGrid();
  renderCategoryThumbs();
  renderRecentCaptures();
  loadSessionStats();
  checkOnboardingStatus();
  updateAuthenticatedProfile();
});

// Onboarding completion flag.
// NOTE: localStorage is BLOCKED in the preview iframe sandbox, so this is intentionally
// in-memory and resets on every page load. A future non-iframe build can add persistence
// here without changing the rest of the codebase.
let _onboardingCompleted = typeof window.restore === 'function' && window.restore('onboardingCompleted') === true;

function checkOnboardingStatus() {
  if (!window.PoseArtAuth?.isLoggedIn()) {
    showScreen('login');
    return;
  }
  if (_onboardingCompleted) {
    showTab('home');
  } else {
    showScreen('ob1');
    PoseArtAnalytics?.track('login_completed', { user: 'tester' });
  }
}

// PR-v25 (v2.5) — Friends & Family login gate.
window.handleLoginSubmit = function(event) {
  event?.preventDefault();
  const username = document.getElementById('login-username');
  const password = document.getElementById('login-password');
  const error = document.getElementById('login-error');
  const result = window.PoseArtAuth?.login(username?.value, password?.value) || {
    ok: false,
    error: 'Authentication is unavailable. Refresh and try again.',
  };

  if (!result.ok) {
    if (error) {
      error.textContent = result.error;
      error.hidden = false;
    }
    password?.setAttribute('aria-invalid', 'true');
    password?.focus();
    return false;
  }

  if (error) {
    error.textContent = '';
    error.hidden = true;
  }
  if (password) {
    password.value = '';
    password.removeAttribute('aria-invalid');
  }
  updateAuthenticatedProfile();
  checkOnboardingStatus();
  return false;
};

window.logoutPoseArt = function() {
  window.PoseArtAuth?.logout();
  AppState.screenStack = [];
  showScreen('login');
  // DEFECT-02 fix: clear both username and password fields on logout
  const username = document.getElementById('login-username');
  const password = document.getElementById('login-password');
  if (username) username.value = '';
  if (password) { password.value = ''; password.removeAttribute('aria-invalid'); }
  const error = document.getElementById('login-error');
  if (error) { error.textContent = ''; error.hidden = true; }
  username?.focus();
};

function updateAuthenticatedProfile() {
  const user = window.PoseArtAuth?.getCurrentUser();
  const label = document.getElementById('profile-user-label');
  if (label) label.textContent = user || 'Test account';
}

// ── TIME ───────────────────────────────────────────────────────
function initStatusBarTime() {
  const updateTime = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const h12 = h % 12 || 12;
    const timeStr = `${h12}:${m}`;
    document.querySelectorAll('[id$="-time"], .time').forEach(el => {
      el.textContent = timeStr;
    });
    const st = document.getElementById('status-time');
    if (st) st.textContent = timeStr;
  };
  updateTime();
  setInterval(updateTime, 30000);
}

// ── SCREEN & TAB NAVIGATION ────────────────────────────────────
window.showScreen = function(screenId, pushToStack) {
  // A caller cannot bypass the gate by invoking a navigation function directly.
  if (screenId !== 'login' && !window.PoseArtAuth?.isLoggedIn()) screenId = 'login';
  const target = document.getElementById('screen-' + screenId);
  // Responsive shell invariant: focus-driven browser scrolling must never move
  // the absolute SPA screen stack outside the clipped app viewport.
  const focused = document.activeElement;
  if (focused && focused !== document.body && !target?.contains(focused)) focused.blur();
  const appShell = document.getElementById('app');
  if (appShell) {
    appShell.scrollTop = 0;
    appShell.scrollLeft = 0;
  }
  if (AppState.currentScreen && AppState.currentScreen !== screenId && document.getElementById('pose-detail-sheet')?.classList.contains('visible')) {
    window.closePoseSheet?.();
  }
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  if (target) {
    // Push previous screen to stack (if explicitly navigating forward, not a tab switch)
    if (pushToStack && AppState.currentScreen && AppState.currentScreen !== screenId) {
      AppState.screenStack.push(AppState.currentScreen);
      if (AppState.screenStack.length > 20) AppState.screenStack.shift(); // cap stack
    }
    target.classList.add('active');
    AppState.currentScreen = screenId;
  }

  const tabBar = document.getElementById('tab-bar');
  const isOnboarding = ['login','ob1','ob2','ob3','ob4'].includes(screenId);
  const isCamera = screenId === 'camera';
  const isReview = screenId === 'review';
  const isTourFlow = ['tour-session', 'tour-summary'].includes(screenId);
  const hideTabs = isOnboarding || isCamera || isReview || isTourFlow;

  if (tabBar) {
    tabBar.style.opacity = hideTabs ? '0' : '1';
    tabBar.style.pointerEvents = hideTabs ? 'none' : 'all';
    tabBar.style.visibility = hideTabs ? 'hidden' : 'visible';
  }
}

window.showTab = function(tabId) {
  if (!window.PoseArtAuth?.isLoggedIn()) {
    showScreen('login');
    return;
  }
  AppState.currentTab = tabId;
  // Switching to a tab root is a fresh navigation context — clear history.
  AppState.screenStack = [];

  // Map tab IDs to screen IDs — NO session tab (replaced by Gallery)
  const tabScreenMap = {
    'home':     'home',
    'library':  'library',
    'gallery':  'gallery',
    'progress': 'progress',
    'profile':  'profile',
  };

  showScreen(tabScreenMap[tabId] || tabId);

  if (tabId === 'gallery') renderGallery();
  if (tabId === 'progress') loadSessionStats();
  if (tabId === 'home') { renderRecentCaptures(); personalizeHome(); }

  document.querySelectorAll('.tab-item').forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-selected', 'false');
  });
  const activeTab = document.getElementById('tab-' + tabId);
  if (activeTab) {
    activeTab.classList.add('active');
    activeTab.setAttribute('aria-selected', 'true');
  }
}

window.goBack = function() {
  if (AppState.screenStack && AppState.screenStack.length > 0) {
    const prev = AppState.screenStack.pop();
    showScreen(prev);  // Don't push back — this is a back navigation
  } else {
    showTab(AppState.currentTab);
  }
}

// ── ONBOARDING ─────────────────────────────────────────────────
// OB-3: permission priming
window.requestCameraPermission = async function() {
  const btn = document.getElementById('camera-perm-btn');
  if (btn) {
    btn.textContent = 'Requesting…';
    btn.disabled = true;
  }

  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.getTracks().forEach(t => t.stop()); // stop immediately, just checking permission
      showToast('Camera access granted ✓');
    }
  } catch (err) {
    console.log('Camera permission:', err.name);
    showToast('Continuing in demo mode');
  }

  if (btn) { btn.textContent = 'Allow Camera'; btn.disabled = false; }
  showScreen('ob4');
}

// OB-3: continue without granting camera (demo mode)
window.continueInDemoMode = function() {
  AppState.isDemoMode = true;
  showScreen('ob4');
}

// OB-2: interactive demo — advance a small guided highlight
window.runOnboardingDemo = function() {
  const stage = document.getElementById('ob2-demo-stage');
  if (!stage) { showScreen('ob3'); return; }
  stage.classList.add('demo-active');
  showToast('Nice! That\u2019s how coaching feels.');
  setTimeout(() => showScreen('ob3'), 900);
}

// OB-4: goal selection (must select to proceed)
window.selectGoal = function(btn, goal) {
  AppState.selectedGoal = goal;
  window.persist?.('selectedGoal', AppState.selectedGoal);
  document.querySelectorAll('.persona-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  const startBtn = document.getElementById('start-exploring-btn');
  if (startBtn) {
    startBtn.disabled = false;
    startBtn.style.opacity = '1';
  }
}

window.completeOnboarding = function() {
  if (!AppState.selectedGoal) {
    showToast('Pick a goal to continue');
    return;
  }
  _onboardingCompleted = true;
  PoseArtAnalytics?.track("onboarding_completed", { goal: AppState.selectedGoal });
  window.persist?.('onboardingCompleted', true);
  window.persist?.('selectedGoal', AppState.selectedGoal);
  showTab('home');
}

// OB-1: skip onboarding entirely (default goal, straight to home)
window.completeOnboardingSkip = function() {
  AppState.selectedGoal = AppState.selectedGoal || 'exploring';
  _onboardingCompleted = true;
  PoseArtAnalytics?.track("onboarding_completed", { goal: AppState.selectedGoal, skipped: true });
  window.persist?.('onboardingCompleted', true);
  window.persist?.('selectedGoal', AppState.selectedGoal);
  showTab('home');
}

// ── SESSION FLOW ───────────────────────────────────────────────
window.goToSession = function(poseId) {
  if (typeof window.closePoseSheet === 'function') window.closePoseSheet();
  if (poseId) AppState.selectedPoseId = poseId;
  showScreen('session-setup', true);
  updateSessionSetupUI();
}

function updateSessionSetupUI() {
  const opts = AppState.sessionOptions;
  const el = id => document.getElementById(id);
  if (el('opt-timer'))       el('opt-timer').textContent       = opts.timer[opts.timerIndex];
  if (el('opt-sensitivity')) el('opt-sensitivity').textContent = opts.sensitivity[opts.sensitivityIndex];

  // Update the selected-pose label + preview figure
  const pose = POSES_LIBRARY[AppState.selectedPoseId];
  if (pose) {
    const nameEl = el('setup-pose-name');
    if (nameEl) nameEl.textContent = pose.name;
    const figEl = el('setup-pose-figure');
    if (figEl) figEl.innerHTML = renderPoseFigureSVG(pose, false);
  }
}

// ── OVERLAY MODE SELECTION (session setup chips) ──────────────────────────
window.selectOverlayMode = function(chipEl, mode) {
  // Update visual state
  document.querySelectorAll('.overlay-mode-chip').forEach(c => c.classList.remove('active'));
  chipEl.classList.add('active');
  // Map mode string to overlayModes index
  const idx = AppState.overlayModes.indexOf(mode);
  if (idx >= 0) AppState.overlayModeIndex = idx;
  // Update preview in session setup if open
  updateSessionSetupOverlayPreview(mode);
  if (navigator.vibrate) navigator.vibrate(12);
};

function updateSessionSetupOverlayPreview(mode) {
  const figEl = document.getElementById('setup-pose-figure');
  if (!figEl) return;
  const pose = POSES_LIBRARY[AppState.selectedPoseId];
  if (!pose) return;
  // PR-4 (v1.1) — directive Part H #14: "no overlay in the session selector
  // keeps the avatar which is wrong because it subverts user explicit choice".
  // Previously this function showed the avatar SVG for any mode that wasn't
  // 'skeleton' — including 'ghost' and 'off'. So if the user picked 'ghost',
  // the preview still showed the avatar, implying "you'll get the avatar".
  // Now each mode shows its own faithful preview:
  //   avatar   → SVG glyph (Art Nouveau figure)
  //   skeleton → procedural PoseSkeleton3D canvas (dark-teal rig)
  //   ghost    → procedural PoseSkeleton3D canvas in ghostMode (cyan water)
  //   off      → empty placeholder with a subtle "no overlay" hint
  // REASONING [PR-4]: the preview is a contract. If the user picks "ghost"
  // and sees a ghost preview, they trust that the camera will show a ghost.
  // The old behavior (showing avatar for ghost/off) broke that trust and
  // led to the user-reported bug where the camera overlay didn't match the
  // session-setup chip the user tapped.
  if (mode === 'skeleton') {
    figEl.innerHTML = '<canvas id="setup-skel-canvas" width="160" height="180" style="border-radius:10px;background:rgba(15,59,58,0.06);max-width:100%;"></canvas>';
    setTimeout(() => {
      const c = document.getElementById('setup-skel-canvas');
      if (c && window.PoseSkeleton3D) {
        const sk = Object.create(window.PoseSkeleton3D);
        sk.init(c, 160, 180);
        sk.setPose(pose.joints || {}, { animateEntry: true, category: pose.category || '', description: pose.instructions || '' });
      }
    }, 30);
  } else if (mode === 'ghost') {
    // PR-4 (v1.1): procedural ghost preview using the same renderGhostFrame
    // helper that the camera overlay now uses. This gives the user an
    // accurate preview of the cyan water silhouette they'll see during the
    // session. The canvas is sized to match the avatar SVG slot (160×180)
    // so the chip layout doesn't shift when switching modes.
    figEl.innerHTML = '<canvas id="setup-ghost-canvas" width="160" height="180" style="border-radius:10px;background:rgba(15,59,58,0.06);max-width:100%;"></canvas>';
    setTimeout(() => {
      const c = document.getElementById('setup-ghost-canvas');
      if (c && window.PoseSkeleton3D && typeof window.PoseSkeleton3D.renderGhostFrame === 'function') {
        try {
          window.PoseSkeleton3D.renderGhostFrame(c, 160, 180, pose.joints || {}, {
            category: pose.category || '',
            description: pose.instructions || '',
            yaw: 20,
            pitch: 5,
            scale: 0.85
          });
        } catch (e) {
          // Fallback to avatar SVG if procedural ghost fails (defensive —
          // shouldn't happen, but a blank preview is worse than a fallback).
          figEl.innerHTML = renderPoseFigureSVG(pose, false);
        }
      } else {
        // PoseSkeleton3D not loaded yet — fall back to avatar SVG.
        figEl.innerHTML = renderPoseFigureSVG(pose, false);
      }
    }, 30);
  } else if (mode === 'off') {
    // PR-4 (v1.1): honest empty state — don't show a figure that implies
    // an overlay will be present. The hint text explains what 'off' means.
    figEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:180px;border-radius:10px;background:rgba(15,59,58,0.04);color:var(--text-secondary);font:var(--type-body);text-align:center;padding:0 16px;">No overlay<br><span style="font-size:11px;opacity:0.7;">Camera only, no pose guide</span></div>';
  } else {
    // 'avatar' or any unknown mode → SVG glyph
    figEl.innerHTML = renderPoseFigureSVG(pose, false);
  }
}

window.cycleOption = function(option) {
  const opts = AppState.sessionOptions;
  switch(option) {
    case 'timer':       opts.timerIndex       = (opts.timerIndex       + 1) % opts.timer.length;       break;
    case 'sensitivity': opts.sensitivityIndex = (opts.sensitivityIndex + 1) % opts.sensitivity.length; break;
  }
  window.persist?.('sessionOptions', {
    timerIndex: opts.timerIndex,
    sensitivityIndex: opts.sensitivityIndex,
  });
  updateSessionSetupUI();
  if (navigator.vibrate) navigator.vibrate(15);
}

  PoseArtAnalytics?.track("session_started", { pose_id: AppState.selectedPoseId });
window.startCameraSession = async function() {
  const beginBtn = document.getElementById('begin-session-btn');
  if (beginBtn) {
    beginBtn.textContent = 'Starting…';
    beginBtn.disabled = true;
  }

  showScreen('camera', true);

  // Reset per-session capture tally so each session starts fresh (Z12).
  AppState.capturedCount = 0;

  // Show demo mode badge if in demo mode
  const demoBadge = document.getElementById('demo-mode-pill');
  if (demoBadge) demoBadge.style.display = AppState.isDemoMode ? 'block' : 'none';

  const pose = POSES_LIBRARY[AppState.selectedPoseId];
  const poseNameEl = document.getElementById('camera-pose-name');
  if (poseNameEl && pose) poseNameEl.textContent = pose.name;

  const videoEl = document.getElementById('camera-video');
  const skelCanvas = document.getElementById('skeleton-canvas');
  await cameraEngine.init(videoEl, skelCanvas);
  cameraEngine.setPose(AppState.selectedPoseId);

  // Apply settings — default overlay is avatar (ghost + figure)
  cameraEngine.autocaptureEnabled = true;
  cameraEngine.setOverlayMode(AppState.overlayModes[AppState.overlayModeIndex] || 'avatar');

  // Sensitivity → auto-capture threshold
  const sens = AppState.sessionOptions.sensitivity[AppState.sessionOptions.sensitivityIndex];
  cameraEngine.autocaptureThreshold = sens === 'Strict' ? 90 : sens === 'Relaxed' ? 78 : 85;

  await cameraEngine.startCamera();

  // Surface simulation state so users know captures are faked (Z8).
  const demoPill = document.getElementById('demo-mode-pill');
  if (demoPill) demoPill.style.display = cameraEngine.simulationMode ? 'block' : 'none';

  // PR-5 (v1.1) — show the SIMULATED SCORING pill whenever the scoring
  // pipeline is faked. Today the camera engine ALWAYS uses _simulateKPs
  // (camera.js:123), so the pill shows in every session, even when the
  // camera is on. When real ML pose detection is integrated, the pill
  // should be hidden when actual keypoints are being measured.
  // REASONING [PR-5]: the gold DEMO MODE pill only shows when
  // simulationMode=true (no camera). Users who granted camera permission
  // see no indicator, yet their score is still computed from a swaying
  // simulated skeleton — not their actual body. This is a trust/ethics
  // bug: the auto-capture fires based on a fake score, so users get
  // "captured" photos without ever having matched the pose. The pill
  // makes this honest until ML integration lands.
  const simPill = document.getElementById('simulated-scoring-pill');
  if (simPill) simPill.style.display = 'block'; // always shown until ML integrated

  const timerVal = AppState.sessionOptions.timer[AppState.sessionOptions.timerIndex];
  if (timerVal !== 'Off') {
    const secs = parseInt(timerVal);
    startCountdown(secs, () => {});
  }

  if (beginBtn) {
    beginBtn.textContent = 'Begin Session →';
    beginBtn.disabled = false;
  }

  AppState.sessionCount++;

  updateCameraGhostSVG(AppState.selectedPoseId);
  updateNextPosePreview();
  updateCameraTourIndicator();
}

function updateCameraGhostSVG(poseId) {
  const pose = POSES_LIBRARY[poseId];
  if (!pose) return;
  const container = document.getElementById('pose-overlay-container');
  if (!container) return;
  // Replace with the full rendered SVG at ghost opacity
  container.innerHTML = renderPoseFigureSVG(pose, true)
    .replace('style="filter:', 'style="opacity:0.35; filter:');
}

window.setSkelView = function(view) {
  if (!window._activeSkeleton3D) return;
  // Update button styles
  document.querySelectorAll('.skel-view-btn').forEach(b => {
    b.style.borderColor = '#0F3B3A';
    b.style.background = 'transparent';
  });
  const activeBtn = document.querySelector(`[onclick="setSkelView('${view}')"]`);
  if (activeBtn) {
    activeBtn.style.borderColor = '#C9A24C';
    activeBtn.style.background = 'rgba(201,162,76,0.15)';
  }

  if (view === 'auto') {
    window._activeSkeleton3D.startAutoRotate();
  } else {
    window._activeSkeleton3D.stopAutoRotate();
    const angles = {
      'front': [0, 0], 'side-left': [90, 0], 'side-right': [-90, 0],
      'quarter-front-left': [45, 0], 'quarter-front-right': [-45, 0],
      'top': [0, 80], 'low': [0, -30]
    };
    const [yaw, pitch] = angles[view] || [0, 0];
    window._activeSkeleton3D.setViewAngle(yaw, pitch);
    window._activeSkeleton3D.render();
  }
}

window.endSession = function() {
  cameraEngine.stopCamera();

  // Only record sessions that actually produced a capture (Z11).
  if (AppState.capturedCount > 0) {
    const pose = POSES_LIBRARY[AppState.selectedPoseId];
    saveSession({
      id: Date.now(),
      poseId: AppState.selectedPoseId,
      poseName: pose?.name || 'Unknown',
      score: cameraEngine.lastAlignmentScore || 0,
      timestamp: new Date().toISOString(),
      capturedCount: AppState.capturedCount
    });
    loadSessionStats();
  }

  showTab('home');
}

window.goToNextPose = function() {
  // Find next pose in same category or just next alphabetically
  const nextId = getNextPoseId();

  if (nextId && nextId !== AppState.selectedPoseId) {
    AppState.selectedPoseId = nextId;
    // Update camera pose name display
    const nameEl = document.getElementById('camera-pose-name');
    if (nameEl) nameEl.textContent = POSES_LIBRARY[nextId].name;
    // Update ghost overlay
    updateCameraGhostSVG(nextId);
    // Update camera engine pose
    if (typeof cameraEngine !== 'undefined') cameraEngine.setPose(nextId);
    document.getElementById('ghost-canvas')?.classList.add('pose-transitioning');
    setTimeout(() => document.getElementById('ghost-canvas')?.classList.remove('pose-transitioning'), 420);
    updateNextPosePreview();
    // Show brief notification
    const hint = document.getElementById('hint-text');
    if (hint) {
      hint.textContent = 'Next: ' + POSES_LIBRARY[nextId].name;
      setTimeout(() => { if (hint) hint.textContent = 'Align with the ghost guide'; }, 2500);
    }
  }
}

function getNextPoseId() {
  if (AppState.isTourSession && window.tourEngine?.getState()) {
    const state = window.tourEngine.getState();
    return state.section.poseIds[state.poseIndex + 1] || state.tour.sections.slice(state.sectionIndex + 1).find(section => section.poseIds.length)?.poseIds[0] || state.poseId;
  }
  const current = POSES_LIBRARY[AppState.selectedPoseId];
  const ids = Object.values(POSES_LIBRARY).filter(pose => !current?.category || pose.category === current.category).map(pose => pose.id);
  return ids[(ids.indexOf(AppState.selectedPoseId) + 1) % ids.length];
}

function updateNextPosePreview() {
  const id = getNextPoseId(); const pose = POSES_LIBRARY[id];
  const figure = document.getElementById('next-pose-figure'); const name = document.getElementById('next-pose-name');
  if (!figure || !pose) return;
  figure.innerHTML = renderPoseFigureSVG(pose, false); if (name) name.textContent = pose.name;
  window.renderPendingAvatars?.(figure);
}

function updateCameraTourIndicator() {
  const indicator = document.getElementById('camera-section-indicator');
  if (!indicator) return;
  const state = AppState.currentTourSession || window.tourEngine?.getState();
  indicator.style.display = AppState.isTourSession && state ? 'block' : 'none';
  if (state) indicator.textContent = `${state.section.name} · ${state.poseIndex + 1}/${state.section.poseIds.length}`;
}

// ── COUNTDOWN TIMER ────────────────────────────────────────────
function startCountdown(seconds, callback) {
  const display = document.getElementById('countdown-display');
  const numEl   = document.getElementById('countdown-number');
  if (!display || !numEl) { callback?.(); return; }

  let count = seconds;
  display.style.opacity = '1';
  numEl.textContent = count;

  if (navigator.vibrate) navigator.vibrate(40);

  const interval = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(interval);
      numEl.textContent = '📸';
      setTimeout(() => {
        display.style.opacity = '0';
        callback?.();
      }, 400);
    } else {
      numEl.textContent = count;
      if (navigator.vibrate) navigator.vibrate(20);
    }
  }, 1000);
}

// ── CAPTURE ────────────────────────────────────────────────────
window.capturePhoto = function() {
  const timerVal = AppState.sessionOptions.timer[AppState.sessionOptions.timerIndex];
  if (timerVal === 'Off') {
    cameraEngine.captureImage(false);
    AppState.capturedCount++;
    scheduleFlowAdvance();
  } else {
    const secs = parseInt(timerVal);
    startCountdown(secs, () => {
      cameraEngine.captureImage(false);
      AppState.capturedCount++;
      scheduleFlowAdvance();
    });
  }
}

function scheduleFlowAdvance() {
  if (!AppState.flowMode) return;
  setTimeout(() => { goToNextPose(); showScreen('camera'); showToast('Flow Mode · next pose'); }, 700);
}

window.toggleFlowMode = function() {
  AppState.flowMode = !AppState.flowMode; cameraEngine.flowMode = AppState.flowMode;
  const button = document.getElementById('flow-mode-toggle');
  button?.classList.toggle('active', AppState.flowMode); button?.setAttribute('aria-pressed', String(AppState.flowMode));
  if (button) button.textContent = AppState.flowMode ? 'FLOW ON' : 'FLOW OFF';
  showToast(`Flow Mode ${AppState.flowMode ? 'ON' : 'OFF'}`);
};

let _shutterHoldTimer = null;
window.startShutterPress = function() {
  AppState.burstActive = false; clearTimeout(_shutterHoldTimer);
  _shutterHoldTimer = setTimeout(() => { AppState.burstActive = true; captureBurst(); }, 550);
};
window.endShutterPress = function() {
  clearTimeout(_shutterHoldTimer); _shutterHoldTimer = null;
  if (!AppState.burstActive) capturePhoto();
  setTimeout(() => { AppState.burstActive = false; }, 50);
};
window.cancelShutterPress = function() { clearTimeout(_shutterHoldTimer); _shutterHoldTimer = null; };
window.captureBurst = function() {
  const indicator = document.getElementById('burst-indicator');
  if (indicator) { indicator.style.display = 'block'; indicator.textContent = 'BURST 3'; }
  cameraEngine.captureImage(false); AppState.capturedCount += 3;
  setTimeout(() => {
    if (window._lastCapture) { window._lastCapture.burstCount = 3; window._lastCapture.burstFrames = [window._lastCapture.dataUrl, window._lastCapture.dataUrl, window._lastCapture.dataUrl]; }
    if (indicator) indicator.style.display = 'none';
  }, 900);
};

window.flipCamera = function() {
  cameraEngine.flipCamera();
}

window.cycleOverlay = function() {
  const modes = AppState.overlayModes;
  AppState.overlayModeIndex = (AppState.overlayModeIndex + 1) % modes.length;
  const mode = modes[AppState.overlayModeIndex];
  cameraEngine.setOverlayMode(mode);
  showToast('Overlay: ' + mode.charAt(0).toUpperCase() + mode.slice(1));
}

window.toggleTimer = function() {
  cycleOption('timer');
  const timerVal = AppState.sessionOptions.timer[AppState.sessionOptions.timerIndex];
  showToast('Timer: ' + timerVal);
}

window.toggleFlash = function() {
  AppState.flashEnabled = !AppState.flashEnabled;
  const flashBtn = document.getElementById('flash-btn');
  if (flashBtn) flashBtn.style.color = AppState.flashEnabled ? 'var(--brand-gold)' : '';
  showToast('Flash: ' + (AppState.flashEnabled ? 'On' : 'Off'));
}

// ── REVIEW SCREEN ───────────────────────────────────────────────
window.retakePhoto = function() {
  showScreen('camera', true);
  // Show demo mode badge if in demo mode
  const demoBadge = document.getElementById('demo-mode-pill');
  if (demoBadge) demoBadge.style.display = AppState.isDemoMode ? 'block' : 'none';
}

// Save the reviewed capture to the gallery (it's already added on capture;
// this confirms/keeps it and applies the active filter).
let _dataLossWarned = false;
window.saveToGallery = function() {
  const last = window._lastCapture;
  if (last) {
    // Persist any preset currently applied
    const activePreset = document.querySelector('.preset-chip.active');
    if (activePreset) last.filter = activePreset.getAttribute('data-preset') || 'none';
  }
  showToast('Saved to your Gallery ✓');
  if (!_dataLossWarned) {
    _dataLossWarned = true;
    setTimeout(() => showToast('Captures are saved on this device.'), 1600);
  }
  renderRecentCaptures();
  setTimeout(() => showTab('gallery'), 900);
}

// Share via Web Share API, with a download fallback.
window.sharePhoto = async function() {
  const canvas = document.getElementById('review-img');
  const detailImg = document.getElementById('gallery-detail-img');
  const src = (AppState.currentScreen === 'gallery-detail' && detailImg) ? detailImg : canvas;

  const doDownload = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poseart-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast('Photo downloaded');
  };

  try {
    if (src && src.tagName === 'CANVAS' && src.toBlob) {
      src.toBlob(async (blob) => {
        if (!blob) { showToast('Nothing to share yet'); return; }
        const file = new File([blob], `poseart-${Date.now()}.jpg`, { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'PoseArt', text: 'Captured with PoseArt — Move like art.' });
            showToast('Shared ✓');
          } catch (e) {
            if (e.name !== 'AbortError') doDownload(blob);
          }
        } else {
          doDownload(blob);
        }
      }, 'image/jpeg', 0.9);
    } else if (navigator.share) {
      await navigator.share({ title: 'PoseArt', text: 'Captured with PoseArt — Move like art.' });
      showToast('Shared ✓');
    } else {
      showToast('Sharing not supported here');
    }
  } catch (e) {
    console.warn('Share failed:', e);
    showToast('Could not share');
  }
}

const PRESETS = {
  none:  null,
  warm:  { r: 1.1, g: 1.0, b: 0.85 },
  film:  { r: 1.05, g: 0.95, b: 0.9,  contrast: 1.1 },
  bw:    { grayscale: true },
  faded: { r: 0.95, g: 0.95, b: 0.95, opacity: 0.85, fade: true },
  moody: { r: 0.85, g: 0.9,  b: 1.05, contrast: 1.15 }
};

window.applyPreset = function(btn, preset) {
  document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');

  const canvas = document.getElementById('review-img');
  if (!canvas) return;

  const cfg = PRESETS[preset];
  if (!cfg) { canvas.style.filter = 'none'; return; }

  let filter = '';
  if (cfg.grayscale) filter += 'grayscale(1) ';
  if (preset === 'warm') filter += 'sepia(0.2) saturate(1.2) ';
  if (preset === 'film') filter += 'contrast(1.1) sepia(0.15) ';
  if (cfg.contrast) filter += `contrast(${cfg.contrast}) `;
  if (cfg.fade) filter += 'brightness(1.1) contrast(0.85) ';
  if (preset === 'moody') filter += 'contrast(1.15) brightness(0.9) hue-rotate(180deg) saturate(0.7) ';

  canvas.style.filter = filter.trim() || 'none';
}

// ── GALLERY ─────────────────────────────────────────────────────
const GALLERY_WINDOW_SIZE = 18;
const GALLERY_WINDOW_STEP = 10;
const GALLERY_ROW_ESTIMATE = 250;
let _galleryVirtualStart = 0;
let _galleryVirtualObserver = null;
let _gallerySelectionMode = false;
let _gallerySelectedIds = new Set();
let _galleryFilter = 'all';
let _gallerySort = 'date-desc';
let _galleryGroupByPose = false;
let _galleryGroupCounts = new Map();
let _galleryLongPressTimer = null;

function galleryPoseCategory(item) {
  return POSES_LIBRARY[item.poseId]?.category || 'custom';
}

function getGalleryViewItems() {
  let items = getGallery();
  if (_galleryFilter === 'favorite') items = items.filter(item => item.favorite);
  else if (_galleryFilter === 'tour') items = items.filter(item => item.tourId);
  else if (_galleryFilter !== 'all') items = items.filter(item => galleryPoseCategory(item) === _galleryFilter);
  items = items.slice().sort((a, b) => {
    if (_galleryGroupByPose && a.poseId !== b.poseId) return String(a.poseId).localeCompare(String(b.poseId));
    if (_gallerySort === 'date-asc') return new Date(a.timestamp) - new Date(b.timestamp);
    if (_gallerySort === 'score-desc') return (b.score || 0) - (a.score || 0);
    if (_gallerySort === 'favorite') return Number(!!b.favorite) - Number(!!a.favorite) || new Date(b.timestamp) - new Date(a.timestamp);
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  _galleryGroupCounts = new Map();
  for (const item of items) _galleryGroupCounts.set(item.poseId, (_galleryGroupCounts.get(item.poseId) || 0) + 1);
  return items;
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  const countEl = document.getElementById('gallery-count');
  if (!grid) return;
  // Skip the expensive full-DOM rebuild when nothing changed since last render.
  if (!AppState.galleryDirty && grid.dataset.rendered === '1') return;

  const allItems = getGallery();
  const items = getGalleryViewItems();
  if (countEl) countEl.textContent = allItems.length;

  if (items.length === 0) {
    if (_galleryVirtualObserver) _galleryVirtualObserver.disconnect();
    _galleryVirtualObserver = null;
    _galleryVirtualStart = 0;
    grid.innerHTML = '';
    grid.style.display = 'none';
    if (empty) empty.style.display = 'flex';
    // PR-v8 (v1.8): reset the rendered flag so the next render after items
    // are added doesn't get short-circuited by the stale flag.
    // This was the root cause of "gallery not updating after capture" —
    // the gallery showed empty, set rendered='1', then when a capture was
    // added and showTab('gallery') called renderGallery, the short-circuit
    // at the top skipped the rebuild because galleryDirty was true but
    // rendered was already '1'. Now we reset rendered when the gallery is
    // empty so the next non-empty render always rebuilds.
    delete grid.dataset.rendered;
    AppState.galleryDirty = false;
    return;
  }

  if (empty) empty.style.display = 'none';
  grid.style.display = 'grid';
  _galleryVirtualStart = Math.min(_galleryVirtualStart, Math.max(0, items.length - GALLERY_WINDOW_SIZE));
  renderGalleryWindow(grid, items, _galleryVirtualStart);
  grid.dataset.rendered = '1';
  AppState.galleryDirty = false;
}

function galleryItemMarkup(item) {
    const thumb = item.dataUrl && !item.isSim
      ? `<img class="gallery-thumb" src="${item.dataUrl}" alt="${item.poseName}" style="filter:${cssFilterFor(item.filter)}">`
      : `<div class="gallery-sim-thumb">${renderPoseFigureSVG(POSES_LIBRARY[item.poseId] || null, false)}</div>`;
    const fav = item.favorite ? '<div class="gallery-fav-badge" aria-label="Favorited">♥</div>' : '';
    const selected = _gallerySelectedIds.has(String(item.id));
    const groupCount = _galleryGroupByPose ? `<div class="gallery-group-count">${_galleryGroupCounts.get(item.poseId) || 1} for this pose</div>` : (item.sectionName ? `<div class="gallery-group-count">${escapeHtml(item.sectionName)}</div>` : '');
    return `
      <div class="gallery-item${_gallerySelectionMode ? ' selection-active' : ''}${selected ? ' selected' : ''}" onclick="handleGalleryItemClick('${item.id}')" role="listitem" tabindex="0"
           onpointerdown="startGalleryLongPress('${item.id}')" onpointerup="cancelGalleryLongPress()" onpointerleave="cancelGalleryLongPress()"
           onkeydown="if(event.key==='Enter')handleGalleryItemClick('${item.id}')" aria-label="${item.poseName}, ${item.score}% aligned">
        <span class="gallery-select-check" aria-hidden="true">${selected ? '✓' : ''}</span>
        ${thumb}
        ${fav}
        <div class="gallery-item-info">
          <div class="gallery-pose-name">${item.poseName}</div>
          <div class="gallery-score-pill">${item.score}%</div>
        </div>
        ${groupCount}
      </div>`;
}

window.setGalleryFilter = function(value) {
  _galleryFilter = value || 'all';
  _galleryVirtualStart = 0;
  AppState.galleryDirty = true;
  renderGallery();
};

window.setGallerySort = function(value) {
  _gallerySort = value || 'date-desc';
  _galleryVirtualStart = 0;
  AppState.galleryDirty = true;
  renderGallery();
};

window.toggleGalleryGrouping = function() {
  _galleryGroupByPose = !_galleryGroupByPose;
  document.getElementById('gallery-group-toggle')?.classList.toggle('active', _galleryGroupByPose);
  _galleryVirtualStart = 0;
  AppState.galleryDirty = true;
  renderGallery();
};

window.toggleGallerySelectionMode = function(force) {
  _gallerySelectionMode = typeof force === 'boolean' ? force : !_gallerySelectionMode;
  if (!_gallerySelectionMode) _gallerySelectedIds.clear();
  document.getElementById('gallery-bulk-actions')?.classList.toggle('visible', _gallerySelectionMode);
  const toggle = document.getElementById('gallery-select-toggle');
  toggle?.classList.toggle('active', _gallerySelectionMode);
  toggle?.setAttribute('aria-pressed', String(_gallerySelectionMode));
  AppState.galleryDirty = true;
  renderGallery();
  updateGallerySelectionCount();
};

window.startGalleryLongPress = function(id) {
  clearTimeout(_galleryLongPressTimer);
  _galleryLongPressTimer = setTimeout(() => {
    toggleGallerySelectionMode(true);
    toggleGallerySelection(id);
    navigator.vibrate?.(25);
  }, 550);
};

window.cancelGalleryLongPress = function() {
  clearTimeout(_galleryLongPressTimer);
  _galleryLongPressTimer = null;
};

window.handleGalleryItemClick = function(id) {
  cancelGalleryLongPress();
  if (_gallerySelectionMode) toggleGallerySelection(id);
  else openGalleryItem(id);
};

window.toggleGallerySelection = function(id) {
  const key = String(id);
  if (_gallerySelectedIds.has(key)) _gallerySelectedIds.delete(key); else _gallerySelectedIds.add(key);
  AppState.galleryDirty = true;
  renderGallery();
  updateGallerySelectionCount();
};

function updateGallerySelectionCount() {
  const el = document.getElementById('gallery-selection-count');
  if (el) el.textContent = `${_gallerySelectedIds.size} selected`;
}

window.bulkDeleteGallery = function() {
  for (const id of _gallerySelectedIds) removeFromGallery(id);
  showToast(`Deleted ${_gallerySelectedIds.size} capture${_gallerySelectedIds.size === 1 ? '' : 's'}`);
  toggleGallerySelectionMode(false);
  renderRecentCaptures();
};

window.bulkDownloadGallery = async function() {
  const selected = getGallery().filter(item => _gallerySelectedIds.has(String(item.id)));
  for (const item of selected) await downloadGalleryItem(item.id, true);
  showToast(`Downloaded ${selected.length} capture${selected.length === 1 ? '' : 's'}`);
};

function galleryFileName(item) {
  const safeName = String(item?.poseName || 'capture').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `poseart-${safeName || 'capture'}-${item?.id || Date.now()}.jpg`;
}

function dataURLtoBlob(dataUrl) {
  const parts = String(dataUrl).split(',');
  const mime = parts[0]?.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
  const binary = atob(parts[1] || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function selectedGalleryItem(id = AppState.gallerySelectedId) {
  return getGallery().find(item => String(item.id) === String(id));
}

// PR-v20 (v2.0) — explicit, desktop-safe download path used by both the
// detail action and bulk selection. Browser download handling remains native.
window.downloadGalleryItem = async function(id = AppState.gallerySelectedId, silent = false) {
  const item = selectedGalleryItem(id);
  if (!item?.dataUrl) {
    if (!silent) showToast('No photo to download');
    return false;
  }
  const link = document.createElement('a');
  link.href = item.dataUrl;
  link.download = galleryFileName(item);
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (!silent) showToast('Photo downloaded');
  return true;
};

// PR-v20 (v2.0) — use the native photo/share sheet when file sharing is
// supported, with the same explicit download path as a reliable fallback.
window.saveToPhotos = async function() {
  const item = selectedGalleryItem();
  if (!item?.dataUrl) {
    showToast('No photo to save');
    return;
  }
  try {
    const blob = dataURLtoBlob(item.dataUrl);
    const file = new File([blob], galleryFileName(item), { type: blob.type || 'image/jpeg' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: item.poseName || 'PoseArt capture' });
      showToast('Saved ✓');
      return;
    }
  } catch (error) {
    if (error?.name === 'AbortError') return;
    console.warn('[PoseArt] Native photo save unavailable; downloading instead.', error);
  }
  await downloadGalleryItem(item.id);
};

window.duplicateGalleryItem = function() {
  const item = selectedGalleryItem();
  if (!item) {
    showToast('Photo not found');
    return;
  }
  const duplicate = { ...item, id: Date.now(), timestamp: new Date().toISOString(), favorite: false };
  addToGallery(duplicate);
  AppState.gallerySelectedId = duplicate.id;
  AppState.galleryDirty = true;
  openGalleryItem(duplicate.id);
  showToast('Photo duplicated');
};

// PR-v9 (v1.9) — Virtual gallery window. At most 18 capture cards exist in
// the DOM, while proportional spacers preserve the full scroll range. Top and
// bottom sentinels shift the window through the collection as the user scrolls.
function renderGalleryWindow(grid, items, requestedStart) {
  const maxStart = Math.max(0, items.length - GALLERY_WINDOW_SIZE);
  const start = Math.max(0, Math.min(requestedStart, maxStart));
  const end = Math.min(items.length, start + GALLERY_WINDOW_SIZE);
  _galleryVirtualStart = start;

  const topRows = Math.floor(start / 2);
  const bottomRows = Math.ceil((items.length - end) / 2);
  grid.innerHTML =
    `<div class="gallery-virtual-spacer" aria-hidden="true" style="grid-column:1/-1;height:${topRows * GALLERY_ROW_ESTIMATE}px"></div>` +
    `<div id="gallery-virtual-top" aria-hidden="true" style="grid-column:1/-1;height:1px"></div>` +
    items.slice(start, end).map(galleryItemMarkup).join('') +
    `<div id="gallery-virtual-bottom" aria-hidden="true" style="grid-column:1/-1;height:1px"></div>` +
    `<div class="gallery-virtual-spacer" aria-hidden="true" style="grid-column:1/-1;height:${bottomRows * GALLERY_ROW_ESTIMATE}px"></div>`;

  window.renderPendingAvatars?.(grid);
  if (_galleryVirtualObserver) _galleryVirtualObserver.disconnect();
  if (typeof IntersectionObserver === 'undefined' || items.length <= GALLERY_WINDOW_SIZE) return;
  const scrollRoot = grid.closest('.screen-scroll');
  _galleryVirtualObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (entry.target.id === 'gallery-virtual-bottom' && end < items.length) {
        renderGalleryWindow(grid, items, Math.min(maxStart, start + GALLERY_WINDOW_STEP));
        break;
      }
      if (entry.target.id === 'gallery-virtual-top' && start > 0) {
        renderGalleryWindow(grid, items, Math.max(0, start - GALLERY_WINDOW_STEP));
        break;
      }
    }
  }, { root: scrollRoot, rootMargin: '300px 0px', threshold: 0.01 });
  const topSentinel = document.getElementById('gallery-virtual-top');
  const bottomSentinel = document.getElementById('gallery-virtual-bottom');
  if (topSentinel) _galleryVirtualObserver.observe(topSentinel);
  if (bottomSentinel) _galleryVirtualObserver.observe(bottomSentinel);
}

function cssFilterFor(preset) {
  switch (preset) {
    case 'warm':  return 'sepia(0.2) saturate(1.2)';
    case 'film':  return 'contrast(1.1) sepia(0.15)';
    case 'bw':    return 'grayscale(1)';
    case 'faded': return 'brightness(1.1) contrast(0.85)';
    case 'moody': return 'contrast(1.15) brightness(0.9) hue-rotate(180deg) saturate(0.7)';
    default:      return 'none';
  }
}

window.openGalleryItem = function(id) {
  const item = getGallery().find(g => g.id == id);
  if (!item) return;
  AppState.gallerySelectedId = id;

  const img = document.getElementById('gallery-detail-img');
  const sim = document.getElementById('gallery-detail-sim');
  if (img && sim) {
    if (item.dataUrl && !item.isSim) {
      img.src = item.dataUrl;
      img.style.display = 'block';
      img.style.filter = cssFilterFor(item.filter);
      sim.style.display = 'none';
    } else {
      img.style.display = 'none';
      sim.style.display = 'flex';
      sim.innerHTML = renderPoseFigureSVG(POSES_LIBRARY[item.poseId] || null, true);
    }
  }

  const title = document.getElementById('gallery-detail-title');
  const meta = document.getElementById('gallery-detail-meta');
  const favBtn = document.getElementById('gallery-detail-fav');
  if (title) title.textContent = item.poseName;
  if (meta) {
    const d = new Date(item.timestamp);
    meta.textContent = `${item.score}% aligned · ${d.toLocaleDateString([], { month:'short', day:'numeric' })} ${d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}`;
  }
  if (favBtn) favBtn.classList.toggle('active', !!item.favorite);

  showScreen('gallery-detail', true);
}

window.toggleGalleryItemFav = function() {
  const id = AppState.gallerySelectedId;
  if (!id) return;
  const nowFav = toggleGalleryFavorite(id);
  const favBtn = document.getElementById('gallery-detail-fav');
  if (favBtn) favBtn.classList.toggle('active', nowFav);
  showToast(nowFav ? 'Added to favorites' : 'Removed from favorites');
}

window.deleteGalleryItem = function() {
  const id = AppState.gallerySelectedId;
  if (!id) return;
  removeFromGallery(id);
  showToast('Removed from gallery');
  renderRecentCaptures();
  showTab('gallery');
}

// Home screen "Recent Captures" horizontal row
window.renderRecentCaptures = function() {
  const row = document.getElementById('recent-captures-row');
  const emptyHint = document.getElementById('captures-empty-hint');
  if (!row) return;

  const items = getGallery().slice(0, 8);
  if (items.length === 0) {
    row.innerHTML = '';
    row.style.display = 'none';
    if (emptyHint) emptyHint.style.display = 'block';
    return;
  }
  if (emptyHint) emptyHint.style.display = 'none';
  row.style.display = 'flex';

  row.innerHTML = items.map(item => {
    const inner = item.dataUrl && !item.isSim
      ? `<img src="${item.dataUrl}" alt="${item.poseName}" style="width:100%;height:100%;object-fit:cover;filter:${cssFilterFor(item.filter)}">`
      : renderPoseFigureSVG(POSES_LIBRARY[item.poseId] || null, false);
    return `<div class="recent-capture-thumb" onclick="openGalleryItem('${item.id}')" role="listitem" aria-label="${item.poseName}">${inner}
      <div class="recent-capture-score">${item.score}%</div></div>`;
  }).join('');
}

// ── POSE DETAIL SHEET ───────────────────────────────────────────
window.openPoseDetail = function(poseId) {
  const pose = POSES_LIBRARY[poseId];
  if (!pose) return;

  AppState.selectedPoseId = poseId;

  // Update sheet fav button state
  const _sheetFavBtn = document.getElementById('sheet-fav-btn');
  if (_sheetFavBtn) {
    const _isFav = typeof isFavorite === 'function' && isFavorite(poseId);
    _sheetFavBtn.classList.toggle('active', _isFav);
    _sheetFavBtn.setAttribute('aria-pressed', _isFav ? 'true' : 'false');
    const _path = _sheetFavBtn.querySelector('path');
    if (_path) { _path.setAttribute('fill', _isFav ? '#C96A4C' : 'none'); }
  }

  const titleEl = document.getElementById('detail-title');
  const tagsEl  = document.getElementById('detail-tags');
  const instrEl = document.getElementById('detail-instructions');
  const tipEl   = document.getElementById('detail-tip');
  const animEl  = document.getElementById('pose-detail-animation');

  if (titleEl) titleEl.textContent = pose.name;
  if (instrEl) instrEl.textContent = pose.instructions;
  if (tipEl)   tipEl.textContent   = pose.tip;

  if (tagsEl) {
    tagsEl.innerHTML = `
      <span class="chip">${pose.category.charAt(0).toUpperCase() + pose.category.slice(1)}</span>
      <span class="chip gold">${pose.difficulty}</span>
      <span class="chip">${pose.intent}</span>
    `;
  }

  if (animEl) animEl.innerHTML = renderPoseFigureSVG(pose, true);

  // Initialize/update 3D skeleton
  setTimeout(() => {
    const skelCanvas = document.getElementById('pose-skeleton-3d-canvas');
    if (skelCanvas && window.PoseSkeleton3D) {
      // Reinit whenever canvas size may have changed (first open, or layout reflow)
      const cw = skelCanvas.clientWidth || 180;
      const ch = skelCanvas.clientHeight || 190;
      if (!window._activeSkeleton3D || !window._activeSkeleton3D._state) {
        window._activeSkeleton3D = Object.create(window.PoseSkeleton3D);
        window._activeSkeleton3D.init(skelCanvas, cw, ch);
      } else if (window._activeSkeleton3D._state.width !== cw || window._activeSkeleton3D._state.height !== ch) {
        // Canvas size changed — reinit
        window._activeSkeleton3D.destroy();
        window._activeSkeleton3D = Object.create(window.PoseSkeleton3D);
        window._activeSkeleton3D.init(skelCanvas, cw, ch);
      }
      window._activeSkeleton3D.setPose(pose.joints || {}, { animateEntry: true, category: pose.category || '', description: pose.instructions || '' });
      // Smart camera: adjust pitch/yaw based on pose type for best initial view
      (function() {
        var joints = pose.joints || {};
        var cat = pose.category || '';
        // Recline/prone poses: tilt camera down slightly to see horizontal figure
        if (joints.globalTilt && Math.abs(joints.globalTilt) >= 60) {
          window._activeSkeleton3D.setViewAngle(20, 25);  // slightly down from front-right
        } else if (joints.globalTilt && Math.abs(joints.globalTilt) >= 30) {
          window._activeSkeleton3D.setViewAngle(10, 15);
        } else if (cat === 'kneeling') {
          window._activeSkeleton3D.setViewAngle(15, -10);  // slightly low angle shows kneeling better
        } else {
          window._activeSkeleton3D.setViewAngle(0, 0);
        }
      })();
      window._activeSkeleton3D.startAutoRotate();
    }
  }, 50);

  const overlay = document.getElementById('pose-sheet-overlay');
  const sheet   = document.getElementById('pose-detail-sheet');
  if (overlay) overlay.classList.add('visible');
  if (sheet) {
    sheet.classList.remove('visible');
    sheet.setAttribute('data-category', pose.category || 'standing');
    // Force reflow so animation re-triggers on every open
    void sheet.offsetWidth;
    sheet.classList.add('visible');
    // Restart SVG SMIL animations
    const svgEl = animEl?.querySelector('svg');
    if (svgEl && typeof window.animatePoseFigure === 'function') {
      window.animatePoseFigure(svgEl);
    }
  }

  sheet?.querySelector('button')?.focus();
}


// ── SHEET FAV + SHARE ACTIONS ───────────────────────────────────
window.toggleFavFromSheet = function(event) {
  const poseId = AppState.selectedPoseId;
  if (!poseId) return;
  event.stopPropagation();
  const isNowFav = toggleFavorite(poseId);
  const btn = document.getElementById('sheet-fav-btn');
  if (btn) {
    btn.classList.toggle('active', isNowFav);
    btn.setAttribute('aria-pressed', isNowFav ? 'true' : 'false');
    btn.setAttribute('aria-label', isNowFav ? 'Remove from favorites' : 'Add to favorites');
    const path = btn.querySelector('path');
    if (path) {
      path.setAttribute('fill', isNowFav ? '#C96A4C' : 'none');
      path.setAttribute('stroke', '#C96A4C');
    }
    btn.style.transform = 'scale(1.4)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }
  showToast(isNowFav ? '♥ Saved to favorites' : 'Removed from favorites');
};

window.sharePoseFromSheet = function() {
  const poseId = AppState.selectedPoseId;
  const pose = poseId ? POSES_LIBRARY[poseId] : null;
  if (!pose) return;
  const text = `${pose.name} — ${pose.instructions?.slice(0,120) || ''}… 
Discover 745 poses in PoseArt.`;
  if (navigator.share) {
    navigator.share({ title: pose.name, text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text).then(() => showToast('Pose description copied!')).catch(() => showToast('Share not available'));
  }
};

window.closePoseSheet = function() {
  const overlay = document.getElementById('pose-sheet-overlay');
  const sheet   = document.getElementById('pose-detail-sheet');
  if (overlay) overlay.classList.remove('visible');
  if (sheet)   sheet.classList.remove('visible');
  if (window._activeSkeleton3D) {
    window._activeSkeleton3D.stopAutoRotate();
    // Destroy skeleton to release window-level mouseup/touchend listeners
    if (typeof window._activeSkeleton3D.destroy === 'function') {
      window._activeSkeleton3D.destroy();
    }
    window._activeSkeleton3D = null;
  }
}

// ── CATEGORY GRID ───────────────────────────────────────────────
function renderCategoryGrid() {
  const markup = POSE_CATEGORIES.map(cat => `
    <div class="category-card" onclick="openCategory('${cat.id}')" role="listitem"
         style="cursor:pointer" tabindex="0" aria-label="${cat.name} category, ${cat.count} poses"
         onkeydown="if(event.key==='Enter')openCategory('${cat.id}')">
      <div class="category-card-bg" style="background:${cat.color};display:flex;align-items:center;justify-content:center;">
        <span style="font-size:52px;opacity:0.4;line-height:1;" aria-hidden="true">${cat.emoji}</span>
      </div>
      <div class="category-card-scrim"></div>
      <div class="category-card-content">
        <div class="category-card-name">${cat.name}</div>
        <div class="category-card-count">${cat.count} poses</div>
      </div>
    </div>
  `).join('');

  const homeGrid = document.getElementById('category-grid');
  if (homeGrid) homeGrid.innerHTML = markup;
  const libGrid = document.getElementById('library-category-grid');
  if (libGrid) libGrid.innerHTML = markup;
}

// Open a full scrollable list of poses in the category.
window.openCategory = function(catId) {
  const cat = POSE_CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  const poses = Object.values(POSES_LIBRARY).filter(p => p.category === catId);

  const titleEl = document.getElementById('cat-list-title');
  const countEl = document.getElementById('cat-list-count');
  const listEl  = document.getElementById('cat-pose-list');
  if (titleEl) titleEl.textContent = cat.name;
  if (countEl) countEl.textContent = `${poses.length} pose${poses.length === 1 ? '' : 's'}`;
  if (listEl) listEl.innerHTML = poses.map(renderPoseListItem).join('');

  showScreen('category-list', true);
}

function renderPoseListItem(pose) {
  const tags = (pose.tags || []).slice(0, 3).map(t => `<span class="chip small">${t}</span>`).join('');
  return `
    <div class="pose-list-item" onclick="openPoseDetail('${pose.id}')" role="listitem" tabindex="0"
         onkeydown="if(event.key==='Enter')openPoseDetail('${pose.id}')" aria-label="${pose.name}, ${pose.difficulty}">
      <div class="pose-list-thumb">${renderPoseFigureSVG(pose, false)}</div>
      <div class="pose-list-info">
        <div class="pose-list-name">${pose.name}</div>
        <div class="pose-list-sub">${pose.difficulty} · ${pose.intent}</div>
        <div class="pose-list-tags">${tags}</div>
      </div>
      <svg class="pose-list-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 3l5 5-5 5"/></svg>
    </div>`;
}

// ── SEARCH ──────────────────────────────────────────────────────
// ── SEARCH DEBOUNCE ──
let _searchDebounceTimer = null;
const _searchPosesImmediate = function(query) {
  const q = (query || '').trim().toLowerCase();
  const libCatGrid = document.getElementById('library-category-grid');
  const homeCatGrid = document.getElementById('category-grid');
  const catLabel = document.getElementById('library-browse-label');
  const resultsEl = document.getElementById('search-results');

  if (!resultsEl) return;

  if (!q) {
    // Empty query — restore category grid view
    if (libCatGrid) libCatGrid.style.display = 'grid';
    if (homeCatGrid) homeCatGrid.style.display = 'grid';
    if (catLabel) catLabel.style.display = 'block';
    resultsEl.style.display = 'none';
    resultsEl.innerHTML = '';
    return;
  }

  // Vibe/mood aliases
  const vibeMap = {
    'confident': ['standing','power','editorial','fashion'],
    'playful': ['dynamic','eccentric','couple'],
    'sensual': ['boudoir'],
    'vulnerable': ['reclining','boudoir'],
    'powerful': ['standing','editorial','fashion','dynamic'],
    'elegant': ['fine-art','boudoir','fashion'],
    'romantic': ['couple','boudoir'],
    'athletic': ['dynamic','eccentric'],
    'calm': ['reclining','seated','kneeling'],
    'dramatic': ['editorial','eccentric'],
  };
  const vibeCategories = vibeMap[q] || null;

  const matches = Object.values(POSES_LIBRARY).filter(p => {
    if (vibeCategories) {
      return vibeCategories.includes(p.category);
    }
    const inName = p.name.toLowerCase().includes(q);
    const inCat = p.category.toLowerCase().includes(q);
    const inTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
    const inIntent = (p.intent || '').toLowerCase().includes(q);
    const inDiff = (p.difficulty || '').toLowerCase().includes(q);
    return inName || inCat || inTags || inIntent || inDiff;
  });

  // Hide both grids, show results
  if (libCatGrid) libCatGrid.style.display = 'none';
  if (homeCatGrid) homeCatGrid.style.display = 'none';
  if (catLabel) catLabel.style.display = 'none';
  resultsEl.style.display = 'block';

  if (matches.length === 0) {
    resultsEl.innerHTML = `<div class="search-empty">
      <div style="font-size:40px;margin-bottom:8px;">🔍</div>
      <div style="font:var(--type-h3);color:var(--text-secondary);">No poses found</div>
      <div style="font:var(--type-body);color:var(--text-secondary);margin-top:4px;">Try: boudoir, standing, confident, elegant, beginner</div>
    </div>`;
    return;
  }

  const isVibe = !!vibeCategories;
  const headerText = isVibe
    ? `✨ ${q.charAt(0).toUpperCase()+q.slice(1)} vibes — ${matches.length} poses`
    : `${matches.length} result${matches.length !== 1 ? 's' : ''} for "${q}"`;

  resultsEl.innerHTML = `<div class="search-results-header">${headerText}</div><div class="pose-list">${matches.map(renderPoseListItem).join('')}</div>`;
};

window.searchPoses = function(query) {
  clearTimeout(_searchDebounceTimer);
  _searchDebounceTimer = setTimeout(() => _searchPosesImmediate(query), 180);
};

window.openCollection = function(collectionId) {
  const collections = {
    portrait: 'scurve-stand',
    selfie: 'hip-shift',
    yoga: 'soft-sit',
    couple: 'couple-embrace'
  };
  const poseId = collections[collectionId];
  // Fall back to the first pose if a specific id is missing
  if (poseId && POSES_LIBRARY[poseId]) openPoseDetail(poseId);
  else {
    const first = Object.keys(POSES_LIBRARY)[0];
    if (first) openPoseDetail(first);
  }
}

// ── FAVORITES ───────────────────────────────────────────────────
window.toggleFav = function(event, poseId) {
  event.stopPropagation();
  const isNowFav = toggleFavorite(poseId);
  const btn = event.currentTarget;
  if (btn) {
    btn.classList.toggle('active', isNowFav);
    const svg = btn.querySelector('svg');
    if (svg) {
      svg.innerHTML = isNowFav
        ? '<path d="M8 14S1 9.5 1 5.5C1 3.5 2.5 2 4.5 2c1 0 2 .5 3.5 2C9.5 2.5 10.5 2 12.5 2 14.5 2 15 3.5 15 5.5 15 9.5 8 14 8 14Z" fill="#C96A4C" stroke="#C96A4C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
        : '<path d="M8 14S1 9.5 1 5.5C1 3.5 2.5 2 4.5 2c1 0 2 .5 3.5 2C9.5 2.5 10.5 2 12.5 2 14.5 2 15 3.5 15 5.5 15 9.5 8 14 8 14Z" stroke="#C96A4C" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    btn.style.transform = 'scale(1.4)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }
  showToast(isNowFav ? 'Saved to favorites!' : 'Removed from favorites');
}

// ── SHOW FAVORITES (filter pill) ───────────────────────────────
window.showFavorites = function() {
  const favIds = getFavorites();
  const libCatGrid = document.getElementById('library-category-grid');
  const catLabel = document.getElementById('library-browse-label');
  const resultsEl = document.getElementById('search-results');
  if (!resultsEl) return;

  if (libCatGrid) libCatGrid.style.display = 'none';
  if (catLabel) catLabel.style.display = 'none';
  resultsEl.style.display = 'block';

  if (favIds.length === 0) {
    resultsEl.innerHTML = `<div class="search-empty">
      <div style="font-size:40px;margin-bottom:12px;">♥</div>
      <div style="font:var(--type-h3);color:var(--text-secondary);">No favorites yet</div>
      <div style="font:var(--type-body);color:var(--text-secondary);margin-top:4px;">Tap the ♥ on any pose to save it here.</div>
    </div>`;
    return;
  }
  const favPoses = favIds.map(id => POSES_LIBRARY[id]).filter(Boolean);
  resultsEl.innerHTML = `<div class="search-results-header">♥ ${favPoses.length} favorite${favPoses.length !== 1 ? 's' : ''}</div><div class="pose-list">${favPoses.map(renderPoseListItem).join('')}</div>`;
};


// ── SESSION STATS ──────────────────────────────────────────────
function loadSessionStats() {
  const sessions = getSessionHistory();
  const statSessions = document.getElementById('stat-sessions');
  const statPoses    = document.getElementById('stat-poses');
  const statStreak   = document.getElementById('stat-streak');
  const statScore    = document.getElementById('stat-score');
  const historyList  = document.getElementById('session-history-list');

  if (statSessions) statSessions.textContent = sessions.length;

  const uniquePoses = new Set(sessions.map(s => s.poseId)).size;
  if (statPoses) statPoses.textContent = uniquePoses;

  // Streak: consecutive days with at least 1 session (Zeigarnik effect — re-engagement hook)
  let streak = 0;
  if (sessions.length > 0) {
    const today = new Date(); today.setHours(0,0,0,0);
    const dayMs = 86400000;
    let checkDay = today;
    // If no session today, start from yesterday (grace period)
    const hasToday = sessions.some(s => { const d = new Date(s.timestamp); d.setHours(0,0,0,0); return d.getTime() === today.getTime(); });
    if (!hasToday) checkDay = new Date(today.getTime() - dayMs);
    for (let i = 0; i < 365; i++) {
      const dayHasSession = sessions.some(s => { const d = new Date(s.timestamp); d.setHours(0,0,0,0); return d.getTime() === checkDay.getTime(); });
      if (dayHasSession) { streak++; checkDay = new Date(checkDay.getTime() - dayMs); }
      else break;
    }
  }
  if (statStreak) statStreak.textContent = streak;

  const bestScore = sessions.reduce((max, s) => Math.max(max, s.score || 0), 0);
  if (statScore) statScore.textContent = bestScore > 0 ? bestScore + '%' : '--';

  const historyEmpty = document.getElementById('session-history-empty');
  if (historyEmpty) historyEmpty.style.display = sessions.length === 0 ? 'block' : 'none';
  if (historyList && sessions.length > 0) {
    historyList.innerHTML = sessions.slice(0, 10).map(s => {
      const date = new Date(s.timestamp);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return `
        <div class="session-history-item" onclick="openPoseDetail('${s.poseId}')" role="listitem">
          <div class="session-thumb"><span style="font-size:24px;" aria-hidden="true">📸</span></div>
          <div class="session-info">
            <h3>${s.poseName}</h3>
            <p>${dateStr} · ${timeStr}</p>
          </div>
          ${s.score > 0 ? `<div class="session-score-pill">${s.score}%</div>` : ''}
        </div>`;
    }).join('');
  }
}

// ── TOAST NOTIFICATION ─────────────────────────────────────────
let toastTimer = null;
window.showToast = function(message) {
  const toast = document.getElementById('toast');
  const text  = document.getElementById('toast-text');
  if (!toast || !text) return;

  text.textContent = message;
  toast.classList.add('visible');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500);
}

// ── POSE FIGURE SVG RENDERER ────────────────────────────────────
function renderPoseFigureSVG(pose, large = false) {
  const w = large ? 200 : 110;
  const h = large ? 280 : 150;
  const color = '#0F3B3A';
  const gold = '#C9A24C';

  // PR-v5 (v1.5) — PROCEDURAL AVATAR PATH (primary, data-attribute approach).
  // Per directive Part A.10 rule #4, all three renderers must derive from the
  // same procedural rig. The old path used 89 hand-crafted SVG glyphs keyed by
  // pose.figure — which couldn't rotate, didn't match joint values, and fell
  // back to a generic 'default' glyph for 205 poses with no figure key.
  //
  // The new path delegates to PoseSkeleton3D.renderAvatarFrame, which uses the
  // same buildPose(joints) FK pipeline as the skeleton and ghost.
  //
  // PR-v5 FIX: The v1.4 approach used an inline <script> tag, but browsers do
  // NOT execute <script> tags inserted via innerHTML. This meant gallery/list
  // thumbnails still showed the legacy SVG glyph. The fix: store the pose data
  // in data-* attributes on the canvas, and use a MutationObserver + explicit
  // renderPendingAvatars() function to find and render all pending avatar
  // canvases after they're inserted into the DOM.
  //
  // v1.9 removes the legacy glyph fallback after 99/99 live canvas coverage.
  if (pose && pose.joints) {
    try {
      const canvasW = large ? 200 : 140;
      const canvasH = large ? 280 : 180;
      // Store pose data in data-* attributes (escaped for HTML safety)
      const jointsJson = JSON.stringify(pose.joints).replace(/"/g, '&quot;');
      const category = (pose.category || '').replace(/"/g, '&quot;');
      const description = (pose.instructions || '').substring(0, 300).replace(/"/g, '&quot;');
      const scale = large ? 1 : 0.75;
      // data-pose-avatar marks this canvas for the MutationObserver
      // data-pose-joints contains the JSON-encoded joints
      // data-pose-category + data-pose-description for prop detection
      // data-pose-scale controls the render scale
      return `<canvas data-pose-avatar="1" width="${canvasW}" height="${canvasH}" ` +
             `data-pose-joints="${jointsJson}" data-pose-category="${category}" ` +
             `data-pose-description="${description}" data-pose-scale="${scale}" ` +
             `style="max-width:100%;border-radius:8px;"></canvas>`;
    } catch (e) {
      console.warn('[PoseArt] Procedural avatar setup failed:', e);
    }
  }

  return `<div class="pose-avatar-placeholder" role="img" aria-label="Pose preview unavailable" ` +
         `style="width:${w}px;height:${h}px;border-radius:8px;background:rgba(15,59,58,0.08);"></div>`;
}

// PR-v5 (v1.5) — Render all pending avatar canvases found in the DOM.
// Called after any innerHTML assignment that includes a procedural avatar
// canvas. Finds all <canvas[data-pose-avatar="1"]:not([data-pose-rendered])>
// elements and invokes PoseSkeleton3D.renderAvatarFrame on each.
// If renderAvatarFrame is unavailable or throws, falls back to legacy SVG.
window.renderPendingAvatars = function(container) {
  const root = container || document;
  const canvases = root.querySelectorAll('canvas[data-pose-avatar="1"]:not([data-pose-rendered="1"])');
  canvases.forEach(function(c) {
    try {
      if (!window.PoseSkeleton3D || typeof window.PoseSkeleton3D.renderAvatarFrame !== 'function') {
        c.removeAttribute('data-pose-avatar');
        c.outerHTML = '<div class="pose-avatar-placeholder" role="img" aria-label="Pose preview unavailable"></div>';
        return;
      }
      const joints = JSON.parse(c.getAttribute('data-pose-joints') || '{}');
      const category = c.getAttribute('data-pose-category') || '';
      const description = c.getAttribute('data-pose-description') || '';
      const scale = parseFloat(c.getAttribute('data-pose-scale') || '0.75');
      window.PoseSkeleton3D.renderAvatarFrame(c, c.width, c.height, joints, {
        category: category, description: description, scale: scale, yaw: 0, pitch: 0
      });
      c.setAttribute('data-pose-rendered', '1');
    } catch (e) {
      console.warn('[PoseArt] Avatar render failed for canvas:', e);
      c.removeAttribute('data-pose-avatar');
      c.outerHTML = '<div class="pose-avatar-placeholder" role="img" aria-label="Pose preview unavailable"></div>';
    }
  });
};

// PR-v5 (v1.5) — MutationObserver that auto-renders avatar canvases whenever
// they're inserted into the DOM (via innerHTML or any other method). This
// catches gallery/list thumbnail insertions without requiring callers to
// explicitly call renderPendingAvatars().
(function setupAvatarMutationObserver() {
  if (typeof MutationObserver === 'undefined') return; // Node test env
  if (window._avatarObserverSetup) return;
  window._avatarObserverSetup = true;
  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue; // elements only
        // Check if the added node is itself an avatar canvas
        if (node.tagName === 'CANVAS' && node.getAttribute('data-pose-avatar') === '1' && node.getAttribute('data-pose-rendered') !== '1') {
          window.renderPendingAvatars(node.parentElement);
        }
        // Check if the added node contains avatar canvases
        if (node.querySelectorAll) {
          const canvases = node.querySelectorAll('canvas[data-pose-avatar="1"]:not([data-pose-rendered="1"])');
          if (canvases.length > 0) {
            window.renderPendingAvatars(node);
          }
        }
      }
    }
  });
  // Observe the entire document body for subtree changes
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();

// Personalize the Home screen from the onboarding goal (Z6).
function personalizeHome() {
  const goal = AppState.selectedGoal;
  const goalCategory = { photographer: 'editorial', model: 'fashion', 'self-portrait': 'standing' };
  const goalLabel = { photographer: 'Photographer', model: 'Model', 'self-portrait': 'Self-Portrait', exploring: 'Artist' };

  // Greeting — personalized based on onboarding persona selection
  const greetEl = document.getElementById('home-greeting');
  if (greetEl) {
    const who = goalLabel[goal] || 'Artist';
    greetEl.innerHTML = 'Good day, ' + who + '<span class="accent-dot">.</span>';
  }
  // Profile label
  const profEl = document.getElementById('profile-goal-label');
  if (profEl) profEl.textContent = goalLabel[goal] || 'Just Exploring';

  // Featured pose by goal (random for 'exploring' / unknown)
  const all = Object.values(POSES_LIBRARY);
  const cat = goalCategory[goal];
  const pool = cat ? all.filter(p => p.category === cat) : all;
  const chosen = (pool.length ? pool : all)[Math.floor(Math.random() * (pool.length ? pool.length : all.length))];
  if (chosen) {
    const nameEl = document.getElementById('featured-name');
    const btnEl = document.getElementById('featured-start-btn');
    const thumbEl = document.getElementById('thumb-scurve');
    if (nameEl) nameEl.textContent = chosen.name;
    if (btnEl) btnEl.setAttribute('onclick', "goToSession('" + chosen.id + "')");
    if (thumbEl) thumbEl.innerHTML = renderPoseFigureSVG(chosen, false);
  }
}
window.personalizeHome = personalizeHome;

function renderCategoryThumbs() {
  const thumbEl = document.getElementById('thumb-scurve');
  if (thumbEl) {
    const pose = POSES_LIBRARY['scurve-stand'] || Object.values(POSES_LIBRARY)[0];
    thumbEl.innerHTML = renderPoseFigureSVG(pose, false);
    thumbEl.style.background = 'linear-gradient(160deg, #DDEFED, #F6F0E1)';
  }
}

// ── KEYBOARD ACCESSIBILITY ─────────────────────────────────────
document.addEventListener('keydown', (e) => {
  // PR-v9 (v1.9) — Keep keyboard focus inside the visible pose-detail modal.
  // Shift+Tab wraps to the last control and Tab wraps to the first.
  const poseSheet = document.getElementById('pose-detail-sheet');
  if (e.key === 'Tab' && poseSheet?.classList.contains('visible')) {
    const focusable = Array.from(poseSheet.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null);
    if (focusable.length) {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || !poseSheet.contains(document.activeElement))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  }
  if (e.key === 'Escape') {
    if (document.getElementById('pose-detail-sheet')?.classList.contains('visible')) {
      closePoseSheet();
    } else if (AppState.currentScreen === 'camera') {
      endSession();
    } else if (AppState.currentScreen === 'gallery-detail') {
      goBack();
    } else if (AppState.currentScreen === 'category-list') {
      goBack();
    }
  }
});

// ── PERSISTENT FLASH OVERLAY ────────────────────────────────────
(function() {
  const flashEl = document.createElement('div');
  flashEl.className = 'flash-overlay';
  flashEl.id = 'flash-overlay-persistent';
  document.getElementById('app').appendChild(flashEl);
})();

// ── SWIPE GESTURE (camera screen) ──────────────────────────────
let touchStartY = 0;
document.getElementById('screen-camera')?.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.getElementById('screen-camera')?.addEventListener('touchend', e => {
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (dy < -60) showToast('Swipe up — pose picker coming soon!');
}, { passive: true });

// ── PREVENT CONTEXT MENU ON LONG PRESS (mobile UX) ────────────
document.addEventListener('contextmenu', e => {
  if (e.target.tagName !== 'A' && e.target.tagName !== 'IMG') e.preventDefault();
});

console.log('%cPoseArt v2.0 — Move like art.', 'color:#C9A24C;font-family:serif;font-size:14px;font-weight:600;');
console.log('%cArt Nouveau Pose Coaching · Gallery + Ghost Overlay', 'color:#1E7A74;font-family:sans-serif;font-size:11px;');

// ── GIF PLAYER INTEGRATION ─────────────────────────────────────────────────
// When a pose is opened, show the entry-animation GIF for 3s, then switch to
// the static SVG figure for better reference quality.
// FIX v7.1: Cancel pending timers + remove ALL old GIF elements immediately on
// every openPoseDetail call so stale GIFs from previous poses never bleed through.
(function patchOpenPoseDetailWithGIF() {
  const _orig = window.openPoseDetail;

  // GIF base path
  const GIF_BASE = 'gifs/';

  // Track pending timers and active GIF element per animation container
  let _gifFadeTimer = null;
  let _gifRemoveTimer = null;
  let _currentGifPoseId = null;

  window.openPoseDetail = function(poseId) {
    // ── 1. Cancel any in-flight GIF timers from the previous pose ──
    if (_gifFadeTimer)   { clearTimeout(_gifFadeTimer);  _gifFadeTimer  = null; }
    if (_gifRemoveTimer) { clearTimeout(_gifRemoveTimer); _gifRemoveTimer = null; }

    // ── 2. Call original to rebuild the panel content ──
    _orig(poseId);

    const animEl = document.getElementById('pose-detail-animation');
    if (!animEl) return;

    // ── 3. Remove ALL leftover gif images immediately (belt + suspenders) ──
    animEl.querySelectorAll('img.pose-entry-gif').forEach(el => el.remove());

    const pose = POSES_LIBRARY[poseId];
    if (!pose) return;

    _currentGifPoseId = poseId;

    // ── 4. Build new GIF element ──
    const gifPath = GIF_BASE + poseId + '.gif';
    const gifEl   = document.createElement('img');
    gifEl.className = 'pose-entry-gif';
    gifEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;border-radius:8px;z-index:2;background:transparent;';
    gifEl.alt = pose.name + ' entry animation';

    // Ensure parent is relatively positioned for absolute overlay
    animEl.style.position = 'relative';

    gifEl.onload = function() {
      // Guard: user may have navigated to another pose while this was loading
      if (_currentGifPoseId !== poseId) { gifEl.remove(); return; }
      animEl.appendChild(gifEl);
      // After 3.5 s fade out, revealing the static SVG below
      _gifFadeTimer = setTimeout(() => {
        gifEl.style.transition = 'opacity 0.5s';
        gifEl.style.opacity = '0';
        _gifRemoveTimer = setTimeout(() => { gifEl.remove(); }, 600);
      }, 3500);
    };

    gifEl.onerror = function() {
      // GIF not found — silently fall back to static SVG (already shown)
      gifEl.remove();
    };

    // Set src AFTER attaching handlers
    gifEl.src = gifPath;
  };
})();

// ============================================================
// PR-v6 (v1.6) — CUSTOM POSE EDITOR (Phase 7 of directive)
// ============================================================
// Full custom pose editor with:
//   - Joint sliders (spine, shoulders, elbows, hips, knees, ankles, globalTilt, etc.)
//   - Live procedural preview (avatar + skeleton + ghost side by side)
//   - Save/load custom poses (in-memory, localStorage-blocked by iframe)
//   - Undo/redo with history stack
//   - View angle selector (front, 1/8, 1/4, side, back, up, down)
//   - Description input (drives description-based prop rendering)
//   - Bug report integration (submit pose data with bug report)
//   - "Use in Session" — start a camera session with the custom pose

// Joint definitions for the editor sliders
const EDITOR_JOINTS = [
  { key: 'spine',        label: 'Spine (forward+ / back-)',  min: -60, max: 60,  step: 1, default: 0 },
  { key: 'hips',         label: 'Hips (lateral tilt)',        min: -30, max: 30,  step: 1, default: 0 },
  { key: 'neck',         label: 'Neck (side tilt)',            min: -45, max: 45,  step: 1, default: 0 },
  { key: 'leftShoulder', label: 'L Shoulder (raise- / back+)',min: -180,max: 90,  step: 1, default: 0 },
  { key: 'rightShoulder',label: 'R Shoulder (raise- / back+)',min: -180,max: 90,  step: 1, default: 0 },
  { key: 'leftElbow',    label: 'L Elbow (bend)',              min: 0,   max: 160, step: 1, default: 0 },
  { key: 'rightElbow',   label: 'R Elbow (bend)',              min: 0,   max: 160, step: 1, default: 0 },
  { key: 'shoulderFwdL', label: 'L Shoulder Fwd (Y-axis)',     min: -90, max: 90,  step: 1, default: 0 },
  { key: 'shoulderFwdR', label: 'R Shoulder Fwd (Y-axis)',     min: -90, max: 90,  step: 1, default: 0 },
  { key: 'leftHip',      label: 'L Hip (flexion+)',             min: -60, max: 130, step: 1, default: 0 },
  { key: 'rightHip',     label: 'R Hip (flexion+)',             min: -60, max: 130, step: 1, default: 0 },
  { key: 'leftKnee',     label: 'L Knee (bend)',                min: 0,   max: 160, step: 1, default: 0 },
  { key: 'rightKnee',    label: 'R Knee (bend)',                min: 0,   max: 160, step: 1, default: 0 },
  { key: 'hipAbductL',   label: 'L Hip Abduct (spread+/cross-)',min: -45, max: 60, step: 1, default: 0 },
  { key: 'hipAbductR',   label: 'R Hip Abduct (spread+/cross-)',min: -45, max: 60, step: 1, default: 0 },
  { key: 'leftAnkle',    label: 'L Ankle (flex/extend)',        min: -50, max: 50, step: 1, default: 0 },
  { key: 'rightAnkle',   label: 'R Ankle (flex/extend)',        min: -50, max: 50, step: 1, default: 0 },
  { key: 'globalTilt',   label: 'Global Tilt (supine+/prone-)', min: -90, max: 90, step: 1, default: 0 },
  { key: 'globalTwist',  label: 'Global Twist (Y-axis)',         min: -180,max: 180,step: 1, default: 0 },
  { key: 'globalRoll',   label: 'Global Roll (Z-axis)',          min: -90, max: 90, step: 1, default: 0 },
];

// Editor state
let _editorJoints = {};
let _editorHistory = [];
let _editorHistoryIndex = -1;
let _editorCustomPoses = typeof window.restore === 'function' && Array.isArray(window.restore('editorCustomPoses'))
  ? window.restore('editorCustomPoses') : [];
// Re-register restored custom poses so session, search, and marketplace links
// resolve exactly as they did before refresh.
for (const customPose of _editorCustomPoses) {
  if (customPose?.id) POSES_LIBRARY[customPose.id] = customPose;
}
let _editorSkelInstance = null;

// Initialize the editor
window.initPoseEditor = function(poseId) {
  // Load starting pose if specified
  let startJoints = {};
  if (poseId && POSES_LIBRARY[poseId]) {
    startJoints = { ...(POSES_LIBRARY[poseId].joints || {}) };
    const nameEl = document.getElementById('pose-editor-name');
    if (nameEl) nameEl.value = (POSES_LIBRARY[poseId].name || '') + ' (copy)';
    const catEl = document.getElementById('pose-editor-category');
    if (catEl) catEl.value = POSES_LIBRARY[poseId].category || 'standing';
    const descEl = document.getElementById('pose-editor-description');
    if (descEl) descEl.value = POSES_LIBRARY[poseId].instructions || '';
  } else {
    // Default to T-pose
    for (const j of EDITOR_JOINTS) startJoints[j.key] = j.default;
  }
  _editorJoints = startJoints;
  _editorHistory = [JSON.parse(JSON.stringify(startJoints))];
  _editorHistoryIndex = 0;

  // Build sliders
  const slidersEl = document.getElementById('pose-editor-sliders');
  if (slidersEl) {
    slidersEl.innerHTML = EDITOR_JOINTS.map(j => `
      <div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <label style="font:500 11px/1 var(--font-body);color:var(--text-primary);">${j.label}</label>
          <span id="editor-val-${j.key}" style="font:600 11px/1 var(--font-body);color:var(--brand-gold);min-width:35px;text-align:right;">${(_editorJoints[j.key] || 0).toFixed(0)}°</span>
        </div>
        <input type="range" id="editor-slider-${j.key}" min="${j.min}" max="${j.max}" step="${j.step}" value="${_editorJoints[j.key] || 0}" oninput="onEditorSliderChange('${j.key}', this.value)" style="width:100%;accent-color:var(--brand-gold);">
      </div>
    `).join('');
  }

  updatePoseEditorPreview();
  updateUndoRedoButtons();
  loadCustomPoseList();
};

window.onEditorSliderChange = function(jointKey, value) {
  _editorJoints[jointKey] = parseFloat(value);
  const valEl = document.getElementById('editor-val-' + jointKey);
  if (valEl) valEl.textContent = parseFloat(value).toFixed(0) + '°';
  updatePoseEditorPreview();
  // Debounce history push
  clearTimeout(window._editorHistoryTimer);
  window._editorHistoryTimer = setTimeout(() => {
    pushEditorHistory();
  }, 400);
};

window.updatePoseEditorPreview = function() {
  const viewAngle = document.getElementById('pose-editor-view-angle')?.value || '0,0';
  const [yaw, pitch] = viewAngle.split(',').map(parseFloat);
  const category = document.getElementById('pose-editor-category')?.value || 'standing';
  const description = document.getElementById('pose-editor-description')?.value || '';

  // Avatar preview (procedural)
  const avatarEl = document.getElementById('pose-editor-avatar-preview');
  if (avatarEl) {
    avatarEl.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 140; canvas.height = 180;
    canvas.style.maxWidth = '100%'; canvas.style.borderRadius = '8px';
    avatarEl.appendChild(canvas);
    if (window.PoseSkeleton3D && window.PoseSkeleton3D.renderAvatarFrame) {
      try {
        window.PoseSkeleton3D.renderAvatarFrame(canvas, 140, 180, _editorJoints, {
          category, description, scale: 0.75, yaw, pitch
        });
      } catch (e) { console.warn('Avatar preview failed:', e); }
    }
  }

  // Skeleton preview (procedural)
  const skelEl = document.getElementById('pose-editor-skeleton-preview');
  if (skelEl) {
    skelEl.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 140; canvas.height = 180;
    canvas.style.maxWidth = '100%'; canvas.style.borderRadius = '8px';
    skelEl.appendChild(canvas);
    if (window.PoseSkeleton3D) {
      try {
        _editorSkelInstance = Object.create(window.PoseSkeleton3D);
        _editorSkelInstance.init(canvas, 140, 180);
        _editorSkelInstance.setPose(_editorJoints, { animateEntry: false, category, description });
        _editorSkelInstance.stopAutoRotate();
        _editorSkelInstance.setViewAngle(yaw, pitch);
        _editorSkelInstance.render();
      } catch (e) { console.warn('Skeleton preview failed:', e); }
    }
  }

  // Ghost preview (procedural)
  const ghostEl = document.getElementById('pose-editor-ghost-preview');
  if (ghostEl) {
    ghostEl.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 140; canvas.height = 180;
    canvas.style.maxWidth = '100%'; canvas.style.borderRadius = '8px';
    ghostEl.appendChild(canvas);
    if (window.PoseSkeleton3D && window.PoseSkeleton3D.renderGhostFrame) {
      try {
        window.PoseSkeleton3D.renderGhostFrame(canvas, 140, 180, _editorJoints, {
          category, description, scale: 0.75, yaw, pitch
        });
      } catch (e) { console.warn('Ghost preview failed:', e); }
    }
  }
};

function pushEditorHistory() {
  // Truncate any redo history
  _editorHistory = _editorHistory.slice(0, _editorHistoryIndex + 1);
  _editorHistory.push(JSON.parse(JSON.stringify(_editorJoints)));
  _editorHistoryIndex++;
  // Cap history at 50 entries
  if (_editorHistory.length > 50) {
    _editorHistory.shift();
    _editorHistoryIndex--;
  }
  updateUndoRedoButtons();
}

window.undoPoseEdit = function() {
  if (_editorHistoryIndex > 0) {
    _editorHistoryIndex--;
    _editorJoints = JSON.parse(JSON.stringify(_editorHistory[_editorHistoryIndex]));
    syncSlidersToJoints();
    updatePoseEditorPreview();
    updateUndoRedoButtons();
    showToast('Undone');
  } else {
    showToast('Nothing to undo');
  }
};

window.redoPoseEdit = function() {
  if (_editorHistoryIndex < _editorHistory.length - 1) {
    _editorHistoryIndex++;
    _editorJoints = JSON.parse(JSON.stringify(_editorHistory[_editorHistoryIndex]));
    syncSlidersToJoints();
    updatePoseEditorPreview();
    updateUndoRedoButtons();
    showToast('Redone');
  } else {
    showToast('Nothing to redo');
  }
};

function syncSlidersToJoints() {
  for (const j of EDITOR_JOINTS) {
    const slider = document.getElementById('editor-slider-' + j.key);
    const valEl = document.getElementById('editor-val-' + j.key);
    if (slider) slider.value = _editorJoints[j.key] || 0;
    if (valEl) valEl.textContent = (_editorJoints[j.key] || 0).toFixed(0) + '°';
  }
}

function updateUndoRedoButtons() {
  const undoBtn = document.getElementById('pose-editor-undo-btn');
  const redoBtn = document.getElementById('pose-editor-redo-btn');
  if (undoBtn) undoBtn.style.opacity = _editorHistoryIndex > 0 ? '1' : '0.4';
  if (redoBtn) redoBtn.style.opacity = _editorHistoryIndex < _editorHistory.length - 1 ? '1' : '0.4';
}

window.resetPoseEditor = function() {
  _editorJoints = {};
  for (const j of EDITOR_JOINTS) _editorJoints[j.key] = j.default;
  pushEditorHistory();
  syncSlidersToJoints();
  updatePoseEditorPreview();
  showToast('Reset to T-pose');
};

window.saveCustomPose = function() {
  const name = document.getElementById('pose-editor-name')?.value || 'Untitled Custom Pose';
  const category = document.getElementById('pose-editor-category')?.value || 'standing';
  const description = document.getElementById('pose-editor-description')?.value || '';
  const poseId = 'custom-' + Date.now();
  const customPose = {
    id: poseId,
    name: name,
    category: category,
    difficulty: 'Custom',
    angle: 'Custom',
    intent: 'Custom',
    effort: 'Static',
    instructions: description,
    tip: 'Custom pose created in the pose editor.',
    joints: JSON.parse(JSON.stringify(_editorJoints)),
    color: 'var(--color-teal-100)',
    figure: 'default',
    tags: ['custom', 'user-created'],
    isCustom: true,
    created: new Date().toISOString(),
  };
  _editorCustomPoses.unshift(customPose);
  window.persist?.('editorCustomPoses', _editorCustomPoses);
  // Also add to POSES_LIBRARY so it appears in browse/search
  if (typeof POSES_LIBRARY !== 'undefined') {
    POSES_LIBRARY[poseId] = customPose;
  }
  showToast('Custom pose saved: ' + name);
  loadCustomPoseList();
};

window.loadCustomPoseList = function() {
  const listEl = document.getElementById('pose-editor-saved-list');
  if (!listEl) return;
  if (_editorCustomPoses.length === 0) {
    listEl.innerHTML = '<div style="font:var(--type-body);color:var(--text-secondary);text-align:center;padding:12px;">No saved custom poses yet.</div>';
    return;
  }
  listEl.innerHTML = '<div style="font:600 12px/1 var(--font-body);color:var(--text-secondary);margin-bottom:8px;">SAVED CUSTOM POSES</div>' +
    _editorCustomPoses.map(p => `
      <div style="display:flex;align-items:center;gap:8px;padding:8px;border:1px solid var(--rule);border-radius:8px;margin-bottom:6px;">
        <div style="flex:1;">
          <div style="font:600 13px/1.3 var(--font-body);color:var(--text-primary);">${p.name}</div>
          <div style="font:11px/1 var(--font-body);color:var(--text-secondary);">${p.category} · ${new Date(p.created).toLocaleTimeString()}</div>
        </div>
        <button class="btn btn-outline" onclick="loadCustomPose('${p.id}')" style="padding:6px 12px;font-size:12px;">Load</button>
        <button class="btn btn-outline" onclick="deleteCustomPose('${p.id}')" style="padding:6px 12px;font-size:12px;">Delete</button>
      </div>
    `).join('');
};

window.loadCustomPose = function(poseId) {
  const pose = _editorCustomPoses.find(p => p.id === poseId);
  if (!pose) return;
  _editorJoints = JSON.parse(JSON.stringify(pose.joints));
  document.getElementById('pose-editor-name').value = pose.name;
  document.getElementById('pose-editor-category').value = pose.category;
  document.getElementById('pose-editor-description').value = pose.instructions || '';
  pushEditorHistory();
  syncSlidersToJoints();
  updatePoseEditorPreview();
  showToast('Loaded: ' + pose.name);
};

window.deleteCustomPose = function(poseId) {
  _editorCustomPoses = _editorCustomPoses.filter(p => p.id !== poseId);
  window.persist?.('editorCustomPoses', _editorCustomPoses);
  if (typeof POSES_LIBRARY !== 'undefined' && POSES_LIBRARY[poseId]) {
    delete POSES_LIBRARY[poseId];
  }
  loadCustomPoseList();
  showToast('Deleted');
};

window.useCustomPoseInSession = function() {
  // Save current editor state as a temp custom pose and start a session
  const name = document.getElementById('pose-editor-name')?.value || 'Untitled Custom Pose';
  const category = document.getElementById('pose-editor-category')?.value || 'standing';
  const description = document.getElementById('pose-editor-description')?.value || '';
  const poseId = 'custom-session-' + Date.now();
  const customPose = {
    id: poseId,
    name: name,
    category: category,
    difficulty: 'Custom',
    angle: 'Custom',
    intent: 'Custom',
    effort: 'Static',
    instructions: description,
    tip: 'Custom pose from editor.',
    joints: JSON.parse(JSON.stringify(_editorJoints)),
    color: 'var(--color-teal-100)',
    figure: 'default',
    tags: ['custom'],
    isCustom: true,
  };
  if (typeof POSES_LIBRARY !== 'undefined') {
    POSES_LIBRARY[poseId] = customPose;
  }
  AppState.selectedPoseId = poseId;
  showToast('Starting session with custom pose...');
  goToSession(poseId);
};

// Bug report integration (Iter D3)
window.submitBugReportFromEditor = function() {
  const comment = document.getElementById('pose-editor-bug-comment')?.value || '';
  const bugType = document.getElementById('pose-editor-bug-type')?.value || 'other';
  const name = document.getElementById('pose-editor-name')?.value || 'Untitled';
  if (!comment) { showToast('Please describe the issue'); return; }
  const report = {
    id: 'bug-' + Date.now(),
    timestamp: new Date().toISOString(),
    type: bugType,
    comment: comment,
    poseName: name,
    poseData: {
      joints: JSON.parse(JSON.stringify(_editorJoints)),
      category: document.getElementById('pose-editor-category')?.value || '',
      description: document.getElementById('pose-editor-description')?.value || '',
    },
    ...(AppState.currentTourSession ? { tourId: AppState.currentTourSession.tour?.id, sectionId: AppState.currentTourSession.section?.id } : {}),
    // In a real app this would POST to a server. For now, store in-memory.
  };
  // Store bug reports in a global array (would be sent to server in production)
  if (!window._bugReports) window._bugReports = [];
  window._bugReports.push(report);
  console.log('[PoseArt] Bug report submitted:', report);
  showToast('Bug report submitted with pose data ✓');
  // Clear form
  document.getElementById('pose-editor-bug-comment').value = '';
};

// Navigate to the editor
window.openPoseEditor = function(startPoseId) {
  showScreen('custom-pose-editor', true);
  setTimeout(() => initPoseEditor(startPoseId), 50);
};

console.log('%cPoseArt v1.6 — Custom Pose Editor loaded.', 'color:#C9A24C;font-family:serif;font-size:11px;');

// ============================================================
// PR-v7 (v1.7) — MARKETPLACE (Phase 7 of directive)
// ============================================================
// Full marketplace with:
//   - Browse: search + filter pose packs by category/price
//   - Purchase flow: free packs instant, paid packs mock checkout
//   - My Packs: view purchased packs + use poses
//   - Creator Dashboard: publish packs from saved custom poses, track earnings
//   - Revenue share: 70% creator / 30% platform (per directive Part C Phase 7)
//
// Storage: in-memory (localStorage blocked by iframe sandbox). In production
// this would use a server backend with Stripe/payment integration.

// Seed marketplace data — curated starter packs
const _marketplaceSeedPacks = [
  { id: 'mp-free-essentials', name: 'Essential Standing Poses', creator: 'PoseArt Team', category: 'standing', price: 0, description: '12 essential standing poses for portraits and editorial work. Free starter pack.', poseIds: ['scurve-stand','power-stance','contrapposto','model-walk','crossed-arms-stand','hand-in-pocket','shoulder-drop','arms-overhead','prayer-hands','tiptoe-reach','one-leg-balance','side-stretch'], rating: 4.8, sales: 1247 },
  { id: 'mp-boudoir-classic', name: 'Classic Boudoir Collection', creator: 'Marie Dubois', category: 'boudoir', price: 4.99, description: '30 sensual boudoir poses inspired by classical painting. Elegant curves and triangles.', poseIds: [], rating: 4.9, sales: 892 },
  { id: 'mp-editorial-edge', name: 'Editorial Edge Pack', creator: 'Zhang Wei', category: 'editorial', price: 3.99, description: '20 high-fashion editorial poses with sharp angles and dramatic lines.', poseIds: [], rating: 4.7, sales: 534 },
  { id: 'mp-fashion-runway', name: 'Runway Fashion Set', creator: 'Ana Costa', category: 'fashion', price: 2.99, description: '15 runway-ready fashion poses. Walk, stop, and turn sequences.', poseIds: [], rating: 4.6, sales: 421 },
  { id: 'mp-fineart-classical', name: 'Classical Fine Art Poses', creator: 'PoseArt Team', category: 'fine-art', price: 0, description: '10 poses inspired by Renaissance and Baroque sculpture. Free cultural pack.', poseIds: [], rating: 4.9, sales: 2103 },
  { id: 'mp-couple-intimate', name: 'Intimate Couple Poses', creator: 'James & Lily', category: 'couple', price: 5.99, description: '20 couple poses for engagement and boudoir photography.', poseIds: [], rating: 4.8, sales: 678 },
];

// Marketplace state
let _marketplacePacks = typeof window.restore === 'function' && Array.isArray(window.restore('marketplacePacks'))
  ? window.restore('marketplacePacks') : [];
let _ownedPacks = typeof window.restore === 'function' && Array.isArray(window.restore('ownedPacks'))
  ? window.restore('ownedPacks') : [];
let _publishedPacks = typeof window.restore === 'function' && Array.isArray(window.restore('publishedPacks'))
  ? window.restore('publishedPacks') : [];
let _marketplaceReviews = typeof window.restore === 'function' && window.restore('marketplaceReviews') || {};
let _marketplaceFilter = 'all';
let _marketplaceSearch = '';
let _marketplaceMaxPrice = Infinity;

// Initialize marketplace (called on first open)
window.initMarketplace = function() {
  // Load seed packs if not already loaded
  if (_marketplacePacks.length === 0) {
    _marketplacePacks = JSON.parse(JSON.stringify(_marketplaceSeedPacks));
    window.persist?.('marketplacePacks', _marketplacePacks);
  }
  renderMarketplace();
  renderOwnedPacks();
  renderCreatorDashboard();
};

window.openMarketplace = function() {
  showScreen('marketplace', true);
  setTimeout(() => initMarketplace(), 50);
};

window.switchMarketplaceTab = function(tab) {
  document.querySelectorAll('.mp-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('mp-tab-' + tab)?.classList.add('active');
  document.getElementById('mp-browse-view').style.display = tab === 'browse' ? 'block' : 'none';
  document.getElementById('mp-mine-view').style.display = tab === 'mine' ? 'block' : 'none';
  document.getElementById('mp-creator-view').style.display = tab === 'creator' ? 'block' : 'none';
};

window.setMpFilter = function(filter) {
  _marketplaceFilter = filter;
  document.querySelectorAll('.mp-filter-chip').forEach(c => c.classList.remove('active'));
  document.querySelector(`.mp-filter-chip[data-filter="${filter}"]`)?.classList.add('active');
  renderMarketplace();
};

window.filterMarketplace = function() {
  _marketplaceSearch = (document.getElementById('mp-search')?.value || '').toLowerCase();
  const price = document.getElementById('mp-price-filter')?.value || 'all';
  _marketplaceMaxPrice = price === 'all' ? Infinity : Number(price);
  renderMarketplace();
};

window.renderMarketplace = function() {
  const grid = document.getElementById('mp-pack-grid');
  if (!grid) return;

  let packs = _marketplacePacks;
  packs = packs.filter(p => p.price <= _marketplaceMaxPrice);
  // Filter
  if (_marketplaceFilter !== 'all') {
    if (_marketplaceFilter === 'free') packs = packs.filter(p => p.price === 0);
    else if (_marketplaceFilter === 'paid') packs = packs.filter(p => p.price > 0);
    else packs = packs.filter(p => p.category === _marketplaceFilter);
  }
  // Search
  if (_marketplaceSearch) {
    packs = packs.filter(p => {
      const poseText = (p.poseIds || []).map(id => POSES_LIBRARY[id]?.name || '').join(' ');
      return (
      p.name.toLowerCase().includes(_marketplaceSearch) ||
      p.creator.toLowerCase().includes(_marketplaceSearch) ||
      p.description.toLowerCase().includes(_marketplaceSearch) || poseText.toLowerCase().includes(_marketplaceSearch)
      );
    });
  }

  if (packs.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-secondary);">No packs found. Try a different search or filter.</div>';
    return;
  }

  grid.innerHTML = packs.map(p => {
    const isOwned = _ownedPacks.includes(p.id);
    const priceDisplay = p.price === 0 ? 'FREE' : '$' + p.price.toFixed(2);
    const isTour = p.type === 'tour';
    const actionBtn = isOwned
      ? `<button class="btn btn-outline" onclick="openPack('${p.id}')" style="width:100%;padding:8px;font-size:12px;">${isTour ? 'Start Tour' : 'Open Pack'}</button>`
      : `<button class="btn btn-gold" onclick="purchasePack('${p.id}')" style="width:100%;padding:8px;font-size:12px;">${priceDisplay}</button>`;
    return `
      <div class="mp-product-card" data-product-id="${p.id}" style="border:1px solid var(--rule);border-radius:12px;overflow:hidden;background:var(--bg-canvas);position:relative;">
        ${isTour ? '<span class="mp-tour-badge">TOUR</span>' : ''}
        <div style="background:linear-gradient(135deg,rgba(15,59,58,0.1),rgba(30,122,116,0.15));height:80px;display:flex;align-items:center;justify-content:center;">
          <span style="font:700 24px/1 var(--font-display);color:var(--brand-gold);">${p.name.charAt(0)}</span>
        </div>
        <div style="padding:10px;">
          <div style="font:600 13px/1.3 var(--font-body);color:var(--text-primary);margin-bottom:2px;">${p.name}</div>
          <button class="mp-creator-link" onclick="openCreatorProfile('${escapeHtml(p.creator)}')">by ${escapeHtml(p.creator)}</button>
          <div style="font:11px/1.3 var(--font-body);color:var(--text-secondary);margin-bottom:8px;">${p.description.substring(0, 60)}...</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font:600 11px/1 var(--font-body);color:var(--brand-gold);">★ ${p.rating}</span>
            <span style="font:11px/1 var(--font-body);color:var(--text-secondary);">${p.sales} sales</span>
          </div>
          <button class="mp-preview-btn" onclick="previewMarketplaceProduct('${p.id}')">Preview first 2</button>
          ${actionBtn}
        </div>
      </div>
    `;
  }).join('');
};

  PoseArtAnalytics?.track("checkout_started", { pack_id: packId });
window.purchasePack = function(packId) {
  const pack = _marketplacePacks.find(p => p.id === packId);
  if (!pack) return;
  if (_ownedPacks.includes(packId)) { showToast('Already owned — open it from My Packs'); return; }
  if (pack.price === 0) {
    // Free pack — instant "purchase"
    _ownedPacks.push(packId);
    window.persist?.('ownedPacks', _ownedPacks);
    showToast('✓ ' + pack.name + ' is now in your library');
    renderMarketplace();
    renderOwnedPacks();
  } else {
    // Paid pack — mock checkout
    showToast('Processing payment of $' + pack.price.toFixed(2) + '...');
    setTimeout(() => {
      _ownedPacks.push(packId);
      // Increment sales count
      pack.sales++;
      window.persist?.('ownedPacks', _ownedPacks);
      window.persist?.('marketplacePacks', _marketplacePacks);
      showToast('✓ ' + pack.name + ' is now in your library');
      renderMarketplace();
      renderOwnedPacks();
    }, 1200);
  }
};

window.openPack = function(packId) {
  const pack = _marketplacePacks.find(p => p.id === packId);
  if (!pack) return;
  if (pack.type === 'tour' && pack.tourId) { openTourSession(pack.tourId); return; }
  showToast('Opening ' + pack.name + '...');
  // For seed packs with poseIds, navigate to the first pose
  if (pack.poseIds && pack.poseIds.length > 0) {
    const firstPose = pack.poseIds[0];
    if (POSES_LIBRARY[firstPose]) {
      openPoseDetail(firstPose);
      return;
    }
  }
  // Otherwise show a toast (would show a pack detail screen in production)
  showToast(pack.name + ' — ' + (pack.poseIds?.length || 0) + ' poses');
};

window.renderOwnedPacks = function() {
  const list = document.getElementById('mp-owned-list');
  if (!list) return;
  const owned = _marketplacePacks.filter(p => _ownedPacks.includes(p.id));
  if (owned.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-secondary);"><div style="font-size:36px;margin-bottom:8px;">📦</div>No purchased packs yet.<br><button class="btn btn-gold" style="margin-top:12px;font-size:12px;padding:8px 16px;" onclick="switchMarketplaceTab(\'browse\')">Browse Packs</button></div>';
    return;
  }
  list.innerHTML = owned.map(p => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--rule);border-radius:12px;margin-bottom:8px;">
      <div style="width:48px;height:48px;border-radius:8px;background:linear-gradient(135deg,rgba(15,59,58,0.1),rgba(30,122,116,0.15));display:flex;align-items:center;justify-content:center;font:700 20px/1 var(--font-display);color:var(--brand-gold);">${p.name.charAt(0)}</div>
      <div style="flex:1;">
        <div style="font:600 14px/1.3 var(--font-body);color:var(--text-primary);">${p.name}</div>
        <div style="font:11px/1 var(--font-body);color:var(--text-secondary);">by ${p.creator} · ${p.poseIds?.length || 0} poses</div>
      </div>
      <button class="btn btn-outline" onclick="openPack('${p.id}')" style="padding:8px 16px;">${p.type === 'tour' ? 'Start Tour' : 'Open'}</button>
      <button class="btn btn-outline" onclick="openReviewForm('${p.id}')" style="padding:8px;">Rate</button>
    </div>
  `).join('');
};

window.previewMarketplaceProduct = function(packId) {
  const pack = _marketplacePacks.find(item => item.id === packId); if (!pack) return;
  const panel = document.getElementById('mp-preview-panel');
  const names = (pack.poseIds || []).slice(0, 2).map(id => POSES_LIBRARY[id]?.name || id);
  panel.innerHTML = `<button onclick="this.parentElement.classList.remove('open')" aria-label="Close preview">×</button><span class="mp-tour-badge inline">${pack.type === 'tour' ? 'TOUR' : 'PACK'}</span><h2>${escapeHtml(pack.name)}</h2><p>${escapeHtml(pack.description)}</p><h3>Preview</h3><ol>${names.map(name => `<li>${escapeHtml(name)}</li>`).join('') || '<li>Creator preview coming soon</li>'}</ol>`;
  panel.classList.add('open');
};

window.openCreatorProfile = function(creator) {
  const products = _marketplacePacks.filter(item => item.creator === creator);
  const panel = document.getElementById('mp-creator-profile');
  panel.innerHTML = `<button onclick="this.parentElement.classList.remove('open')" aria-label="Close creator profile">×</button><div class="mp-creator-avatar">${escapeHtml(creator.charAt(0))}</div><h2>${escapeHtml(creator)}</h2><p>Pose creator · ${products.length} products</p>${products.map(item => `<button onclick="previewMarketplaceProduct('${item.id}')"><strong>${escapeHtml(item.name)}</strong><span>${item.type === 'tour' ? 'TOUR' : 'PACK'} · ★ ${item.rating}</span></button>`).join('')}`;
  panel.classList.add('open');
};

window.openReviewForm = function(packId) {
  if (!_ownedPacks.includes(packId)) { showToast('Purchase required before rating'); return; }
  const score = Number(prompt('Rate this product from 1 to 5', '5'));
  if (!Number.isFinite(score) || score < 1 || score > 5) return;
  const text = prompt('Share a short review', '') || '';
  rateMarketplaceProduct(packId, score, text);
};

window.rateMarketplaceProduct = function(packId, stars, text = '') {
  if (!_ownedPacks.includes(packId)) return false;
  const pack = _marketplacePacks.find(item => item.id === packId); if (!pack) return false;
  const review = { stars: Math.max(1, Math.min(5, Number(stars))), text: String(text), timestamp: new Date().toISOString() };
  _marketplaceReviews[packId] = review; pack.rating = Math.round(((pack.rating || 0) + review.stars) / 2 * 10) / 10;
  window.persist?.('marketplaceReviews', _marketplaceReviews); window.persist?.('marketplacePacks', _marketplacePacks); renderMarketplace(); showToast('Review published ✓'); return true;
};

window.publishTourToMarketplace = function(tourId = _tourEditingId) {
  const tour = getTour(tourId); if (!tour) { showToast('Save a tour first'); return null; }
  const poseIds = tour.sections.flatMap(section => section.poseIds);
  if (!poseIds.length) { showToast('Add poses before publishing'); return null; }
  const comparable = _marketplacePacks.filter(item => item.type !== 'tour' && item.price > 0);
  const averagePackPrice = comparable.reduce((sum, item) => sum + item.price, 0) / (comparable.length || 1);
  const pack = { id: `mp-tour-${Date.now()}`, type: 'tour', tourId: tour.id, name: tour.name, creator: 'You', category: tour.sections[0]?.type || 'custom', price: Math.round(averagePackPrice * 1.5 * 100) / 100, description: tour.description || `${tour.sections.length}-section guided pose tour`, poseIds, rating: 5, reviews: [], sales: 0, isUserCreated: true };
  _marketplacePacks.unshift(pack); _publishedPacks.unshift(pack); window.persist?.('marketplacePacks', _marketplacePacks); window.persist?.('publishedPacks', _publishedPacks); renderMarketplace(); renderCreatorDashboard(); showToast(`Published tour: ${tour.name}`); return pack;
};

window.renderCreatorDashboard = function() {
  // Calculate earnings
  let totalEarnings = 0;
  let totalSales = 0;
  for (const pack of _publishedPacks) {
    totalEarnings += pack.sales * pack.price * 0.70; // 70% creator share
    totalSales += pack.sales;
  }
  const earningsEl = document.getElementById('mp-creator-earnings');
  if (earningsEl) earningsEl.textContent = '$' + totalEarnings.toFixed(2);
  const salesEl = document.getElementById('mp-creator-sales');
  if (salesEl) salesEl.textContent = totalSales + ' sales across ' + _publishedPacks.length + ' pack' + (totalSales !== 1 ? 's' : '');

  // Render published packs
  const list = document.getElementById('mp-creator-packs');
  if (!list) return;
  if (_publishedPacks.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text-secondary);">No published packs yet. Create custom poses in the editor, then publish them here!</div>';
    return;
  }
  list.innerHTML = _publishedPacks.map(p => {
    const earnings = p.sales * p.price * 0.70;
    return `
      <div style="border:1px solid var(--rule);border-radius:12px;padding:12px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font:600 14px/1.3 var(--font-body);color:var(--text-primary);">${p.name}</div>
            <div style="font:11px/1 var(--font-body);color:var(--text-secondary);">${p.category} · $${p.price.toFixed(2)} · ${p.poseIds.length} poses</div>
          </div>
          <div style="text-align:right;">
            <div style="font:700 16px/1 var(--font-display);color:var(--brand-gold);">$${earnings.toFixed(2)}</div>
            <div style="font:10px/1 var(--font-body);color:var(--text-secondary);">${p.sales} sales</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

window.publishPack = function() {
  const name = document.getElementById('mp-new-pack-name')?.value || '';
  const desc = document.getElementById('mp-new-pack-desc')?.value || '';
  const price = parseFloat(document.getElementById('mp-new-pack-price')?.value || '0');
  const category = document.getElementById('mp-new-pack-category')?.value || 'standing';

  if (!name) { showToast('Please enter a pack name'); return; }
  if (_editorCustomPoses.length === 0) {
    showToast('No saved custom poses to publish. Create some in the editor first!');
    return;
  }

  const pack = {
    id: 'mp-user-' + Date.now(),
    name: name,
    creator: 'You',
    category: category,
    price: price,
    description: desc || 'User-created pose pack.',
    poseIds: _editorCustomPoses.map(p => p.id),
    rating: 0,
    sales: 0,
    isUserCreated: true,
    created: new Date().toISOString(),
  };

  _publishedPacks.unshift(pack);
  _marketplacePacks.unshift(pack);
  window.persist?.('publishedPacks', _publishedPacks);
  window.persist?.('marketplacePacks', _marketplacePacks);

  // Clear form
  document.getElementById('mp-new-pack-name').value = '';
  document.getElementById('mp-new-pack-desc').value = '';
  document.getElementById('mp-new-pack-price').value = '';

  showToast('Published: ' + name + ' (' + pack.poseIds.length + ' poses)');
  renderMarketplace();
  renderCreatorDashboard();
};

// Add marketplace access from profile screen
// (called after profile screen renders)
window.addEventListener('DOMContentLoaded', function() {
  // Add a marketplace button to the profile screen if not already there
  setTimeout(function() {
    const profileScreen = document.getElementById('screen-profile');
    if (profileScreen && !document.getElementById('profile-mp-btn')) {
      const mpBtn = document.createElement('div');
      mpBtn.id = 'profile-mp-btn';
      mpBtn.className = 'settings-section';
      mpBtn.style.marginTop = '12px';
      mpBtn.innerHTML = `
        <div class="settings-section-title">Marketplace</div>
        <button class="btn btn-gold btn-block" onclick="openMarketplace()" style="padding:14px;font:600 14px/1 var(--font-body);">
          🛍 Open Marketplace
        </button>
        <div style="font:var(--type-caption);color:var(--text-secondary);margin-top:6px;text-align:center;">
          Browse, buy, and sell pose packs. 70% creator revenue share.
        </div>
      `;
      profileScreen.querySelector('.screen-scroll').appendChild(mpBtn);
    }
  }, 200);
});

// ── TOUR CREATOR + SESSION (v2.1) ────────────────────────────
let _tourEditingId = null;
function escapeHtml(value) {
  const element = document.createElement('span');
  element.textContent = String(value ?? '');
  return element.innerHTML;
}

window.openTourCreator = function(tourId) {
  let tour = tourId ? getTour(tourId) : null;
  if (!tour) tour = tourEngine.createTour('New Tour', 'A guided PoseArt sequence');
  _tourEditingId = tour.id;
  renderTourCreator();
  showScreen('tour-creator', true);
};

window.renderTourCreator = function() {
  const tour = getTour(_tourEditingId);
  if (!tour) return;
  const name = document.getElementById('tour-name');
  const desc = document.getElementById('tour-description');
  if (name && document.activeElement !== name) name.value = tour.name;
  if (desc && document.activeElement !== desc) desc.value = tour.description;
  const sections = document.getElementById('tour-sections');
  if (!sections) return;
  sections.innerHTML = tour.sections.map((section, sectionIndex) => `
    <article class="tour-section-card" data-section-id="${section.id}">
      <div class="tour-section-heading"><span>SECTION ${sectionIndex + 1}: ${escapeHtml(section.name)}</span><span class="tour-type-badge">${escapeHtml(section.type)}</span></div>
      <div class="tour-pose-row">
        ${section.poseIds.map((poseId, poseIndex) => {
          const pose = POSES_LIBRARY[poseId];
          return `<div class="tour-pose-chip"><div class="tour-pose-figure">${renderPoseFigureSVG(pose, false)}</div><span>${escapeHtml(pose?.name || poseId)}</span><button onclick="removeTourPose('${section.id}','${poseId}')" aria-label="Remove ${escapeHtml(pose?.name || poseId)}">×</button>${poseIndex ? `<button onclick="moveTourPose('${section.id}',${poseIndex},${poseIndex - 1})" aria-label="Move pose left">←</button>` : ''}</div>`;
        }).join('')}
        <button class="tour-add-pose" onclick="addSuggestedTourPose('${section.id}')" aria-label="Add pose">＋<span>Add pose</span></button>
      </div>
    </article>`).join('') || '<div class="tour-empty">Add a section to begin building your sequence.</div>';
  window.renderPendingAvatars?.(sections);
  const sources = document.getElementById('tour-sources');
  if (sources) {
    const custom = _editorCustomPoses.slice(0, 4);
    const purchased = _marketplacePacks?.filter(pack => _ownedPacks?.includes(pack.id)).slice(0, 4) || [];
    sources.innerHTML = `<strong>Sources</strong><div><span>Library: 745 poses</span>${custom.map(pose => `<span>Custom: ${escapeHtml(pose.name)}</span>`).join('')}${purchased.map(pack => `<span>Purchased: ${escapeHtml(pack.name)}</span>`).join('')}</div>`;
  }
  const start = document.getElementById('tour-start-btn');
  if (start) start.disabled = !tour.sections.some(section => section.poseIds.length);
};

window.updateTourDraft = function() {
  const tour = getTour(_tourEditingId); if (!tour) return;
  tour.name = document.getElementById('tour-name')?.value.trim() || 'Untitled Tour';
  tour.description = document.getElementById('tour-description')?.value.trim() || '';
  tour.updatedAt = new Date().toISOString(); saveTour(tour);
};

window.addTourSection = function(name, type) {
  const index = getTour(_tourEditingId)?.sections.length || 0;
  tourEngine.addSection(_tourEditingId, name || `Section ${index + 1}`, type || ['glamour', 'dynamic', 'fine-art'][index % 3]);
  renderTourCreator();
};

window.addSuggestedTourPose = function(sectionId, poseId) {
  const section = getTour(_tourEditingId)?.sections.find(item => String(item.id) === String(sectionId));
  const suggestions = Object.values(POSES_LIBRARY).filter(pose => !section?.poseIds.includes(pose.id));
  tourEngine.addPoseToSection(_tourEditingId, sectionId, poseId || suggestions[0]?.id);
  renderTourCreator();
};

window.removeTourPose = function(sectionId, poseId) { tourEngine.removePoseFromSection(_tourEditingId, sectionId, poseId); renderTourCreator(); };
window.moveTourPose = function(sectionId, from, to) {
  const section = getTour(_tourEditingId)?.sections.find(item => String(item.id) === String(sectionId));
  if (!section) return;
  const order = section.poseIds.slice(); order.splice(to, 0, order.splice(from, 1)[0]);
  tourEngine.reorderSection(_tourEditingId, sectionId, order); renderTourCreator();
};
window.saveCurrentTour = function() { updateTourDraft(); showToast('Tour saved ✓'); renderTourCreator(); };

window.openTourSession = function(tourId = _tourEditingId) {
  if (typeof window.closePoseSheet === 'function') window.closePoseSheet();
  updateTourDraft();
  try { AppState.currentTourSession = tourEngine.startTour(tourId); }
  catch (error) { showToast(error.message); return; }
  AppState.isTourSession = true; AppState.currentTourId = tourId;
  renderTourSession(); showScreen('tour-session', true);
};

window.startTourCamera = async function() {
  const state = tourEngine.getState(); if (!state) return;
  AppState.isTourSession = true; AppState.currentTourSession = state; AppState.selectedPoseId = state.poseId;
  await startCameraSession();
};

window.reportTourPoseIssue = function() {
  const state = tourEngine.getState(); if (!state) return;
  AppState.currentTourSession = state; openPoseEditor(state.poseId);
  setTimeout(() => {
    const field = document.getElementById('pose-editor-bug-comment');
    if (field) field.value = `Tour ${state.tour.name} / ${state.section.name}: `;
  }, 80);
};

window.renderTourSession = function() {
  const state = tourEngine.getState(); if (!state) return;
  AppState.currentTourSession = state; AppState.selectedPoseId = state.poseId;
  const pose = POSES_LIBRARY[state.poseId];
  document.getElementById('tour-session-title').textContent = state.tour.name;
  document.getElementById('tour-section-progress').textContent = `Section ${state.sectionIndex + 1}/${state.tour.sections.length}: ${state.section.name}`;
  document.getElementById('tour-pose-progress').textContent = `Pose ${state.poseIndex + 1}/${state.section.poseIds.length}`;
  const preview = document.getElementById('tour-current-pose');
  preview.innerHTML = renderPoseFigureSVG(pose, true);
  const stage = preview.closest('.tour-stage');
  stage?.classList.remove('tour-pose-changing');
  requestAnimationFrame(() => stage?.classList.add('tour-pose-changing'));
  setTimeout(() => stage?.classList.remove('tour-pose-changing'), 360);
  window.renderPendingAvatars?.(preview);
  document.getElementById('tour-current-name').textContent = pose?.name || state.poseId;
  renderTourPhotos(); renderTourOverview();
};

window.nextTourPose = function() { tourEngine.nextPose(); renderTourSession(); };
window.prevTourPose = function() { tourEngine.prevPose(); renderTourSession(); };
window.nextTourSection = function() { tourEngine.nextSection(); renderTourSession(); };
window.prevTourSection = function() { tourEngine.prevSection(); renderTourSession(); };
window.captureTourPhoto = function() { const item = tourEngine.captureInTour(null, { score: 100 }); showToast(`Captured ${item.poseName}`); renderTourPhotos(); };

function renderTourPhotos() {
  const state = tourEngine.getState(); if (!state) return;
  const photos = tourEngine.getTourPhotos(state.tour.id, state.section.id);
  document.getElementById('tour-photo-strip').innerHTML = photos.map(item => `<button class="tour-photo-thumb" onclick="openTourPhoto('${item.id}')">${item.dataUrl ? `<img src="${item.dataUrl}" alt="${escapeHtml(item.poseName)}">` : renderPoseFigureSVG(POSES_LIBRARY[item.poseId], false)}</button>`).join('') || '<span class="tour-no-photos">No captures in this section yet</span>';
  document.getElementById('tour-photo-count').textContent = `${photos.length} photo${photos.length === 1 ? '' : 's'}`;
  window.renderPendingAvatars?.(document.getElementById('tour-photo-strip'));
}
window.openTourPhoto = function(id) { AppState.galleryReturnScreen = 'tour-session'; openGalleryItem(id); };
window.returnFromGalleryDetail = function() {
  if (AppState.galleryReturnScreen === 'tour-session' && tourEngine.getState()) { AppState.galleryReturnScreen = null; renderTourSession(); showScreen('tour-session'); }
  else showTab('gallery');
};

window.searchTourPoses = function() {
  const query = document.getElementById('tour-search-input')?.value || '';
  const results = tourEngine.searchPosesInTour(query);
  document.getElementById('tour-search-results').innerHTML = results.map(pose => `<button onclick="jumpToTourPose('${pose.id}')">${escapeHtml(pose.name)}</button>`).join('') || '<span>No matching pose</span>';
};
window.jumpToTourPose = function(poseId) { tourEngine.jumpToPose(poseId); document.getElementById('tour-search-panel').classList.remove('open'); renderTourSession(); };
window.toggleTourSearch = function() { document.getElementById('tour-search-panel').classList.toggle('open'); };
window.toggleTourOverview = function() { document.getElementById('tour-overview').classList.toggle('open'); };
function renderTourOverview() {
  const state = tourEngine.getState(); if (!state) return;
  document.getElementById('tour-overview-list').innerHTML = state.tour.sections.map((section, index) => `<button onclick="jumpToTourPose('${section.poseIds[0] || ''}')"><strong>${index + 1}. ${escapeHtml(section.name)}</strong><span>${section.poseIds.length} poses</span></button>`).join('');
}

window.endTourSession = function() {
  const state = tourEngine.getState(); if (!state) return;
  const photos = tourEngine.getTourPhotos(state.tour.id);
  document.getElementById('tour-summary-title').textContent = state.tour.name;
  document.getElementById('tour-summary-total').textContent = `${photos.length} total capture${photos.length === 1 ? '' : 's'}`;
  document.getElementById('tour-summary-sections').innerHTML = state.tour.sections.map(section => {
    const sectionPhotos = photos.filter(item => String(item.sectionId) === String(section.id));
    return `<article class="tour-summary-section"><h3>${escapeHtml(section.name)} · ${sectionPhotos.length}</h3><div>${sectionPhotos.map(item => `<span>${escapeHtml(item.poseName)}</span>`).join('') || '<span>No captures</span>'}</div></article>`;
  }).join('');
  AppState.isTourSession = false; showScreen('tour-summary', true);
};

window.addEventListener('DOMContentLoaded', () => {
  const tools = document.querySelector('#screen-profile .screen-scroll');
  if (tools && !document.getElementById('profile-tour-btn')) {
    const section = document.createElement('div'); section.className = 'settings-section'; section.id = 'profile-tour-btn'; section.style.marginTop = '12px';
    section.innerHTML = '<div class="settings-section-title">Tours</div><button class="btn btn-teal btn-block" onclick="openTourCreator()">＋ Create a Pose Tour</button><div class="tour-saved-count">Build guided multi-section sequences.</div>';
    tools.appendChild(section);
  }
});

console.log('%cPoseArt v1.7 — Marketplace loaded.', 'color:#C9A24C;font-family:serif;font-size:11px;');
