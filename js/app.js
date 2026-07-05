// ============================================================
// PoseArt v2 — Main Application Controller
// Gallery tab, category list, search, sharing, onboarding rework
// ============================================================

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
    timerIndex: 2,
    sensitivity: ['Strict', 'Balanced', 'Relaxed'],
    sensitivityIndex: 1,
  },
  timerCountdown: null,
  flashEnabled: false,
  sessionCount: 0,
  capturedCount: 0,
  selectedGoal: null,
  gallerySelectedId: null,
};
window.AppState = AppState;

// ── INITIALIZATION ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initStatusBarTime();
  renderCategoryGrid();
  renderCategoryThumbs();
  renderRecentCaptures();
  loadSessionStats();
  checkOnboardingStatus();
});

// In-memory onboarding flag (resets each page load — expected in preview iframe)
let _onboardingCompleted = false;

function checkOnboardingStatus() {
  if (_onboardingCompleted) {
    showTab('home');
  }
  // else: stays on OB-1 (default)
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
window.showScreen = function(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  const target = document.getElementById('screen-' + screenId);
  if (target) {
    target.classList.add('active');
    AppState.currentScreen = screenId;
  }

  const tabBar = document.getElementById('tab-bar');
  const isOnboarding = ['ob1','ob2','ob3','ob4'].includes(screenId);
  const isCamera = screenId === 'camera';
  const isReview = screenId === 'review';
  const hideTabs = isOnboarding || isCamera || isReview;

  if (tabBar) {
    tabBar.style.opacity = hideTabs ? '0' : '1';
    tabBar.style.pointerEvents = hideTabs ? 'none' : 'all';
  }
}

window.showTab = function(tabId) {
  AppState.currentTab = tabId;

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
  if (tabId === 'home') renderRecentCaptures();

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
  showTab(AppState.currentTab);
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
  showTab('home');
}

// OB-1: skip onboarding entirely (default goal, straight to home)
window.completeOnboardingSkip = function() {
  AppState.selectedGoal = AppState.selectedGoal || 'photography';
  _onboardingCompleted = true;
  showTab('home');
}

// ── SESSION FLOW ───────────────────────────────────────────────
window.goToSession = function(poseId) {
  if (typeof window.closePoseSheet === 'function') window.closePoseSheet();
  if (poseId) AppState.selectedPoseId = poseId;
  showScreen('session-setup');
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

window.cycleOption = function(option) {
  const opts = AppState.sessionOptions;
  switch(option) {
    case 'timer':       opts.timerIndex       = (opts.timerIndex       + 1) % opts.timer.length;       break;
    case 'sensitivity': opts.sensitivityIndex = (opts.sensitivityIndex + 1) % opts.sensitivity.length; break;
  }
  updateSessionSetupUI();
  if (navigator.vibrate) navigator.vibrate(15);
}

window.startCameraSession = async function() {
  const beginBtn = document.getElementById('begin-session-btn');
  if (beginBtn) {
    beginBtn.textContent = 'Starting…';
    beginBtn.disabled = true;
  }

  showScreen('camera');

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
}

window.endSession = function() {
  cameraEngine.stopCamera();

  if (AppState.sessionCount > 0) {
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
  } else {
    const secs = parseInt(timerVal);
    startCountdown(secs, () => {
      cameraEngine.captureImage(false);
      AppState.capturedCount++;
    });
  }
}

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
  showScreen('camera');
}

// Save the reviewed capture to the gallery (it's already added on capture;
// this confirms/keeps it and applies the active filter).
window.saveToGallery = function() {
  const last = window._lastCapture;
  if (last) {
    // Persist any preset currently applied
    const activePreset = document.querySelector('.preset-chip.active');
    if (activePreset) last.filter = activePreset.getAttribute('data-preset') || 'none';
  }
  showToast('Saved to your Gallery ✓');
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
function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  const countEl = document.getElementById('gallery-count');
  if (!grid) return;

  const items = getGallery();
  if (countEl) countEl.textContent = items.length;

  if (items.length === 0) {
    grid.innerHTML = '';
    grid.style.display = 'none';
    if (empty) empty.style.display = 'flex';
    return;
  }

  if (empty) empty.style.display = 'none';
  grid.style.display = 'grid';

  grid.innerHTML = items.map(item => {
    const thumb = item.dataUrl && !item.isSim
      ? `<img class="gallery-thumb" src="${item.dataUrl}" alt="${item.poseName}" style="filter:${cssFilterFor(item.filter)}">`
      : `<div class="gallery-sim-thumb">${renderPoseFigureSVG(POSES_LIBRARY[item.poseId] || null, false)}</div>`;
    const fav = item.favorite ? '<div class="gallery-fav-badge" aria-label="Favorited">♥</div>' : '';
    return `
      <div class="gallery-item" onclick="openGalleryItem('${item.id}')" role="listitem" tabindex="0"
           onkeydown="if(event.key==='Enter')openGalleryItem('${item.id}')" aria-label="${item.poseName}, ${item.score}% aligned">
        ${thumb}
        ${fav}
        <div class="gallery-item-info">
          <div class="gallery-pose-name">${item.poseName}</div>
          <div class="gallery-score-pill">${item.score}%</div>
        </div>
      </div>`;
  }).join('');
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

  showScreen('gallery-detail');
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

  const overlay = document.getElementById('pose-sheet-overlay');
  const sheet   = document.getElementById('pose-detail-sheet');
  if (overlay) overlay.classList.add('visible');
  if (sheet)   sheet.classList.add('visible');

  sheet?.querySelector('button')?.focus();
}

window.closePoseSheet = function() {
  const overlay = document.getElementById('pose-sheet-overlay');
  const sheet   = document.getElementById('pose-detail-sheet');
  if (overlay) overlay.classList.remove('visible');
  if (sheet)   sheet.classList.remove('visible');
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

  showScreen('category-list');
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
window.searchPoses = function(query) {
  const q = (query || '').trim().toLowerCase();
  const grid = document.getElementById('category-grid');
  const catLabel = document.getElementById('library-browse-label');
  const resultsEl = document.getElementById('search-results');

  if (!resultsEl) return;

  if (!q) {
    // Empty query — restore category grid view
    if (grid) grid.style.display = 'grid';
    if (catLabel) catLabel.style.display = 'block';
    resultsEl.style.display = 'none';
    resultsEl.innerHTML = '';
    return;
  }

  const matches = Object.values(POSES_LIBRARY).filter(p => {
    const inName = p.name.toLowerCase().includes(q);
    const inCat = p.category.toLowerCase().includes(q);
    const inTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
    const inIntent = (p.intent || '').toLowerCase().includes(q);
    return inName || inCat || inTags || inIntent;
  });

  if (grid) grid.style.display = 'none';
  if (catLabel) catLabel.style.display = 'none';
  resultsEl.style.display = 'block';

  if (matches.length === 0) {
    resultsEl.innerHTML = `<div class="search-empty"><div style="font-size:40px;margin-bottom:8px;">🔍</div>
      <div style="font:var(--type-h3);color:var(--text-secondary);">No poses found</div>
      <div class="caption" style="margin-top:4px;">Try a different name, mood, or category.</div></div>`;
    return;
  }
  resultsEl.innerHTML = `<div class="pose-list">${matches.map(renderPoseListItem).join('')}</div>`;
}

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

// ── SESSION STATS ──────────────────────────────────────────────
function loadSessionStats() {
  const sessions = getSessionHistory();
  const statSessions = document.getElementById('stat-sessions');
  const statPoses    = document.getElementById('stat-poses');
  const statScore    = document.getElementById('stat-score');
  const historyList  = document.getElementById('session-history-list');

  if (statSessions) statSessions.textContent = sessions.length;

  const uniquePoses = new Set(sessions.map(s => s.poseId)).size;
  if (statPoses) statPoses.textContent = uniquePoses;

  const bestScore = sessions.reduce((max, s) => Math.max(max, s.score || 0), 0);
  if (statScore) statScore.textContent = bestScore > 0 ? bestScore + '%' : '--';

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

  const S = (inner) => `<svg width="${w}" height="${h}" viewBox="0 0 200 280" fill="none" preserveAspectRatio="xMidYMid meet" style="filter:drop-shadow(0 4px 16px rgba(30,122,116,0.25))">${inner}</svg>`;

  // Shared decorative elements
  const halo = `<circle cx="100" cy="38" r="24" stroke="${gold}" stroke-width="0.8" stroke-dasharray="4 6" opacity="0.35"/>`;
  const head = `<circle cx="100" cy="38" r="16" fill="${color}" opacity="0.85"/><path d="M85 30 Q82 20 89 15 Q93 26 100 20 Q107 26 111 15 Q118 20 115 30" fill="${color}" opacity="0.6"/>`;
  const neck = `<path d="M94 54 L94 68 L106 68 L106 54" fill="${color}" opacity="0.65"/>`;
  const neckOrn = `<circle cx="100" cy="73" r="3.5" fill="${gold}" opacity="0.65"/>`;

  const figures = {
    'scurve': S(`${halo}${head}${neck}
      <path d="M78 68 Q70 95 79 124 Q86 142 84 160 Q90 164 100 164 Q110 164 116 160 Q114 142 121 124 Q130 95 122 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M79 78 Q58 70 46 82 Q40 94 50 104" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M121 82 Q142 86 148 102 Q152 114 144 122" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M84 160 Q76 186 70 226 Q80 234 100 234 Q120 234 130 226 Q124 186 116 160 Z" fill="${color}" opacity="0.6"/>
      <path d="M85 118 Q100 123 115 118" stroke="${gold}" stroke-width="1.5" fill="none" opacity="0.4"/>${neckOrn}
      <ellipse cx="86" cy="236" rx="13" ry="5.5" fill="${color}" opacity="0.5"/><ellipse cx="114" cy="233" rx="11" ry="4.5" fill="${color}" opacity="0.4"/>`),

    'standing-front': S(`${halo}${head}${neck}
      <path d="M75 68 L80 160 L120 160 L125 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M75 80 Q55 85 48 100 Q45 112 52 118" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M125 80 Q145 85 152 100 Q155 112 148 118" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M80 160 Q76 196 74 232 Q84 238 100 238 Q116 238 126 232 Q124 196 120 160 Z" fill="${color}" opacity="0.6"/>${neckOrn}
      <ellipse cx="87" cy="236" rx="13" ry="5" fill="${color}" opacity="0.5"/><ellipse cx="113" cy="235" rx="11" ry="4.5" fill="${color}" opacity="0.4"/>`),

    'arm-reach': S(`${halo}${head}${neck}
      <path d="M78 68 Q72 100 82 130 Q88 148 86 165 Q92 170 100 170 Q108 170 114 165 Q112 148 118 130 Q128 100 122 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M80 78 Q55 60 35 38 Q28 28 35 22" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.85"/>
      <path d="M120 82 Q135 90 140 108" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M86 165 Q78 195 72 232 Q82 238 100 238 Q118 238 128 232 Q122 195 114 165 Z" fill="${color}" opacity="0.6"/>${neckOrn}
      <circle cx="34" cy="20" r="4" fill="${gold}" opacity="0.5"/>
      <ellipse cx="86" cy="236" rx="13" ry="5" fill="${color}" opacity="0.5"/><ellipse cx="114" cy="235" rx="11" ry="4.5" fill="${color}" opacity="0.4"/>`),

    // Seated side profile — hips low, legs folded forward
    'seated-side': S(`${halo}${head}${neck}
      <path d="M80 68 Q74 96 84 128 Q90 146 88 162 Q96 166 106 164 Q104 148 110 130 Q120 100 116 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M84 82 Q66 92 58 110 Q54 122 62 128" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M116 84 Q132 96 132 116" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M90 160 Q118 168 150 158 Q152 176 130 182 Q100 186 88 178 Z" fill="${color}" opacity="0.62"/>
      <path d="M148 160 Q160 176 150 200" stroke="${color}" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.6"/>${neckOrn}
      <ellipse cx="150" cy="204" rx="14" ry="5" fill="${color}" opacity="0.5"/>`),

    // Seated on floor — symmetric, legs crossed
    'seated-floor': S(`${halo}${head}${neck}
      <path d="M80 68 Q74 100 82 128 Q88 144 86 158 Q100 162 114 158 Q112 144 118 128 Q126 100 120 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M82 84 Q64 96 60 118" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M118 84 Q136 96 140 118" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M70 158 Q60 176 78 186 Q100 192 122 186 Q140 176 130 158 Q100 168 70 158 Z" fill="${color}" opacity="0.6"/>${neckOrn}
      <ellipse cx="100" cy="190" rx="42" ry="7" fill="${color}" opacity="0.4"/>`),

    // Hip shift — weight to one side, contrapposto
    'hip-shift': S(`${halo}${head}${neck}
      <path d="M80 68 Q68 94 78 122 Q86 142 92 160 Q98 164 108 162 Q104 142 112 124 Q124 96 120 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M80 80 Q60 88 52 106 Q48 118 56 124" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M120 82 Q138 92 140 112 Q140 124 132 128" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M90 160 Q86 196 82 232 Q94 238 110 236 Q116 200 112 162 Z" fill="${color}" opacity="0.6"/>
      <path d="M85 120 Q100 126 115 120" stroke="${gold}" stroke-width="1.5" fill="none" opacity="0.4"/>${neckOrn}
      <ellipse cx="86" cy="234" rx="13" ry="5" fill="${color}" opacity="0.5"/><ellipse cx="112" cy="236" rx="11" ry="4.5" fill="${color}" opacity="0.4"/>`),

    // Elbow prop — leaning on a surface, chin near hand
    'elbow-prop': S(`${halo}${head}${neck}
      <path d="M80 68 Q74 96 84 126 Q90 144 88 160 Q100 164 112 160 Q110 144 116 128 Q124 100 120 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M84 80 Q70 96 82 108 Q92 116 100 66" stroke="${color}" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.82"/>
      <path d="M118 84 Q136 96 138 118" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M88 160 Q82 196 80 232 Q94 238 110 236 Q116 198 112 160 Z" fill="${color}" opacity="0.6"/>${neckOrn}
      <rect x="60" y="108" width="24" height="6" rx="2" fill="${gold}" opacity="0.3"/>
      <ellipse cx="88" cy="234" rx="13" ry="5" fill="${color}" opacity="0.5"/><ellipse cx="112" cy="236" rx="11" ry="4.5" fill="${color}" opacity="0.4"/>`),

    // Kneeling — knees down, torso upright
    'kneeling': S(`${halo}${head}${neck}
      <path d="M78 68 Q72 96 82 126 Q88 144 86 160 Q100 164 114 160 Q112 144 118 126 Q128 96 122 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M80 80 Q62 88 54 106 Q50 118 58 124" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M120 82 Q138 90 146 108 Q150 120 142 126" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M86 160 Q80 188 84 208 Q78 220 96 224 L110 224 Q126 220 118 206 Q120 186 114 160 Z" fill="${color}" opacity="0.6"/>${neckOrn}
      <ellipse cx="100" cy="226" rx="40" ry="6" fill="${color}" opacity="0.4"/>`),

    // Side recline — lying on side, propped head
    'side-recline': S(`${halo}
      <circle cx="46" cy="150" r="15" fill="${color}" opacity="0.85"/>
      <path d="M34 144 Q30 134 38 130 Q42 140 46 134 Q50 140 54 130 Q62 134 58 144" fill="${color}" opacity="0.6"/>
      <path d="M60 150 Q100 138 150 150 Q158 160 150 172 Q100 184 60 168 Z" fill="${color}" opacity="0.72"/>
      <path d="M46 136 Q40 116 52 108" stroke="${color}" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M150 150 Q172 148 182 160 Q186 170 178 176" stroke="${color}" stroke-width="11" stroke-linecap="round" fill="none" opacity="0.7"/>
      <path d="M148 168 Q170 172 176 190" stroke="${color}" stroke-width="11" stroke-linecap="round" fill="none" opacity="0.6"/>
      <circle cx="60" cy="152" r="3.5" fill="${gold}" opacity="0.6"/>
      <ellipse cx="100" cy="186" rx="60" ry="6" fill="${color}" opacity="0.3"/>`),

    // Couple embrace — two overlapping figures
    'couple-embrace': S(`${halo}
      <circle cx="78" cy="46" r="15" fill="${color}" opacity="0.85"/>
      <circle cx="124" cy="42" r="14" fill="${color}" opacity="0.7"/>
      <path d="M70 60 L74 76 L86 76 L84 60" fill="${color}" opacity="0.6"/>
      <path d="M118 56 L120 72 L130 72 L130 56" fill="${color}" opacity="0.55"/>
      <path d="M60 76 Q52 108 62 140 Q68 160 66 178 Q78 182 90 178 Q88 158 92 138 Q98 104 90 76 Z" fill="${color}" opacity="0.72"/>
      <path d="M110 72 Q104 104 112 136 Q118 156 116 176 Q128 180 140 176 Q138 156 144 136 Q152 104 144 72 Z" fill="${color}" opacity="0.62"/>
      <path d="M90 88 Q108 82 120 92" stroke="${color}" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.78"/>
      <path d="M110 90 Q92 84 82 94" stroke="${color}" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.7"/>
      <path d="M66 178 Q60 210 66 240 Q78 246 90 244 Q94 212 90 178 Z" fill="${color}" opacity="0.55"/>
      <path d="M116 176 Q112 208 118 240 Q130 246 142 242 Q146 210 144 176 Z" fill="${color}" opacity="0.5"/>
      <circle cx="90" cy="86" r="3" fill="${gold}" opacity="0.55"/>
      <ellipse cx="78" cy="244" rx="14" ry="5" fill="${color}" opacity="0.45"/><ellipse cx="130" cy="242" rx="13" ry="5" fill="${color}" opacity="0.4"/>`),

    // Upper body — cropped portrait framing, shoulders + arms
    'upper-body': S(`${halo}${head}${neck}
      <path d="M70 68 Q60 100 66 150 Q90 160 100 160 Q110 160 134 150 Q140 100 130 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M72 80 Q52 88 44 108 Q40 122 50 130" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M128 80 Q148 88 156 108 Q160 122 150 130" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M80 118 Q100 124 120 118" stroke="${gold}" stroke-width="1.5" fill="none" opacity="0.4"/>${neckOrn}
      <rect x="66" y="150" width="68" height="6" rx="3" fill="${color}" opacity="0.3"/>`),

    // Dynamic reach — mid-motion, wide dynamic limbs
    'dynamic-reach': S(`${halo}${head}
      <path d="M96 54 L92 68 L104 66 L110 52" fill="${color}" opacity="0.6"/>
      <path d="M74 66 Q70 98 84 128 Q92 146 88 164 Q98 170 110 166 Q108 146 116 126 Q130 96 122 62 Z" fill="${color}" opacity="0.72"/>
      <path d="M78 74 Q52 56 34 30 Q28 20 36 14" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.85"/>
      <path d="M120 70 Q148 78 164 100 Q170 112 162 120" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.82"/>
      <path d="M86 164 Q64 190 44 214" stroke="${color}" stroke-width="13" stroke-linecap="round" fill="none" opacity="0.62"/>
      <path d="M110 166 Q130 200 152 228" stroke="${color}" stroke-width="13" stroke-linecap="round" fill="none" opacity="0.6"/>
      <circle cx="35" cy="13" r="4" fill="${gold}" opacity="0.5"/><circle cx="100" cy="80" r="3.5" fill="${gold}" opacity="0.6"/>
      <ellipse cx="42" cy="216" rx="12" ry="4.5" fill="${color}" opacity="0.45"/><ellipse cx="154" cy="230" rx="12" ry="4.5" fill="${color}" opacity="0.4"/>`),

    // Wall lean — angled body against a vertical edge
    'wall-lean': S(`${halo}${head}${neck}
      <line x1="150" y1="20" x2="150" y2="250" stroke="${gold}" stroke-width="2" opacity="0.25"/>
      <path d="M82 68 Q80 98 92 128 Q100 148 100 166 Q108 170 118 166 Q116 148 122 128 Q132 100 126 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M84 80 Q66 90 60 110 Q56 122 64 128" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M124 80 Q142 88 146 104" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M100 166 Q102 200 118 224 Q140 232 148 226 Q140 200 122 166 Z" fill="${color}" opacity="0.6"/>${neckOrn}
      <ellipse cx="146" cy="228" rx="13" ry="5" fill="${color}" opacity="0.5"/>`),

    'default': S(`${head}${neck}
      <path d="M78 68 Q70 100 82 130 Q88 150 84 168 Q90 172 100 172 Q110 172 116 168 Q112 150 118 130 Q130 100 122 68 Z" fill="${color}" opacity="0.72"/>
      <path d="M80 80 Q62 74 50 86 Q44 98 52 108" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M120 80 Q138 86 144 100 Q148 112 142 120" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M84 168 Q76 198 70 234 Q80 240 100 240 Q120 240 130 234 Q124 198 116 168 Z" fill="${color}" opacity="0.6"/>${neckOrn}
      <ellipse cx="86" cy="238" rx="13" ry="5" fill="${color}" opacity="0.5"/><ellipse cx="114" cy="236" rx="11" ry="4.5" fill="${color}" opacity="0.4"/>`)
  };

  const figType = pose?.figure || 'default';
  return figures[figType] || figures['default'];
}

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
  if (e.key === 'Escape') {
    if (document.getElementById('pose-detail-sheet')?.classList.contains('visible')) {
      closePoseSheet();
    } else if (AppState.currentScreen === 'camera') {
      endSession();
    } else if (AppState.currentScreen === 'gallery-detail') {
      showTab('gallery');
    } else if (AppState.currentScreen === 'category-list') {
      showTab('library');
    }
  }
});

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
