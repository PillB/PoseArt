#!/usr/bin/env python3
"""Build zuckerberg_review_p9.json — forensic code review of PoseArt v2.
Every old_string below was verified verbatim against the current files."""
import json

fixes = []

def add(**kw):
    fixes.append(kw)

# ─────────────────────────────────────────────────────────────
# CRITICAL
# ─────────────────────────────────────────────────────────────

# Z1 — CSS: dead legacy stylesheet loaded before inline block
add(
    id="Z1",
    priority="critical",
    file="index.html + css/app.css",
    title="Remove dead legacy app.css <link>; port the 3 genuinely-live app.css-only rules inline",
    description=(
        "css/app.css (260 selectors) is loaded at index.html line 16 BEFORE the inline <style> "
        "block (lines 18-1316), which overrides almost all of it (cascade: later same-specificity "
        "rules win). 107 selectors are duplicated between the two sources and the inline copy wins. "
        "The vast majority of app.css is DEAD legacy naming with 0 references in the HTML "
        "(.featured-pose-card, .camera-top-bar, .btn-primary, .cat-tab, .back-btn, etc.). "
        "Loading it wastes a network request and ~30KB parse cost, and creates a maintenance trap "
        "where editing app.css silently does nothing. Only THREE app.css-only rules currently style "
        "a live element AND are absent from the inline block: #halo-rays, #gallery-detail-fav "
        "(+.active), and #cat-pose-list. Two more app.css :active polish rules (.tab-item:active, "
        "#shutter-btn:active) have live targets and no inline equivalent. #review-score-text and "
        "#countdown-display already exist inline (inline wins), and app.css's "
        "'#countdown-display.visible{display:flex}' is provably DEAD because app.js toggles "
        ".style.opacity, never classList. FIX: delete the <link> and port only the 5 live "
        "app.css-only rules into the inline block. Verified: #halo-rays(1), #gallery-detail-fav(1), "
        "#cat-pose-list(1) each appear once in HTML and 0 times in the inline <style>."
    ),
    exact_fix={
        "edits": [
            {
                "file": "index.html",
                "old_string": '<link rel="stylesheet" href="css/tokens.css">\n<link rel="stylesheet" href="css/app.css">',
                "new_string": '<link rel="stylesheet" href="css/tokens.css">'
            },
            {
                "file": "index.html",
                "old_string": "#countdown-number {\n  font: 700 120px/1 var(--font-mono);\n  color: var(--brand-gold);\n  text-shadow: 0 0 40px rgba(201,162,76,0.6);\n}",
                "new_string": "#countdown-number {\n  font: 700 120px/1 var(--font-mono);\n  color: var(--brand-gold);\n  text-shadow: 0 0 40px rgba(201,162,76,0.6);\n}\n\n/* ── Ported from removed app.css (only live, non-duplicated rules) ── */\n#halo-rays { position: absolute; inset: -20px; transition: opacity 0.3s; }\n#gallery-detail-fav { color: rgba(246,240,225,0.8); }\n#gallery-detail-fav.active { color: var(--color-terracotta-600); }\n#cat-pose-list { flex: 1; overflow-y: auto; }\n.tab-item:active { transform: scale(0.92); }\n#shutter-btn:active { transform: scale(0.92); background: rgba(246,240,225,0.3); }"
            }
        ]
    },
    testable_conditions=[
        "index.html no longer contains a <link ... href=\"css/app.css\">",
        "The #halo-rays circle still has inset:-20px and an opacity transition when inspected in DevTools",
        "#gallery-detail-fav turns terracotta when it has class 'active'",
        "#cat-pose-list still scrolls (overflow-y:auto, flex:1)",
        ".tab-item and #shutter-btn still scale to 0.92 on :active press",
        "No network request is made for css/app.css (check Network panel — 404/absent)"
    ]
)

# Z10 — category-list back button uses showTab instead of goBack (navigation)
add(
    id="Z10",
    priority="critical",
    file="index.html",
    title="Category-list back button hardcodes showTab('library') — breaks return path from Home",
    description=(
        "The category-list screen is reachable from BOTH the Home screen category grid and the "
        "Library screen category grid (renderCategoryGrid wires both #category-grid and "
        "#library-category-grid). Its back button at index.html line 1790 always calls "
        "showTab('library'), so a user who drilled in from Home is silently teleported to Library "
        "instead of back to Home. This is a navigation/state correctness bug. Fix by routing "
        "through goBack() (see Z2 which adds a real screen stack)."
    ),
    exact_fix={
        "edits": [
            {
                "file": "index.html",
                "old_string": '<button class="icon-btn" data-testid="btn-back-category-list" onclick="showTab(\'library\')" aria-label="Back">',
                "new_string": '<button class="icon-btn" data-testid="btn-back-category-list" onclick="goBack()" aria-label="Back">'
            }
        ]
    },
    testable_conditions=[
        "Navigate Home → tap a category → tap back: lands back on Home (not Library)",
        "Navigate Library → tap a category → tap back: lands back on Library",
        "The back button onclick is goBack(), not showTab('library')"
    ]
)

# Z2 — Navigation stack
add(
    id="Z2",
    priority="critical",
    file="js/app.js",
    title="No navigation history stack — goBack() always returns to currentTab, losing drill-down context",
    description=(
        "goBack() (app.js lines 118-120) just calls showTab(AppState.currentTab), so ALL back "
        "actions collapse to the active tab root regardless of how deep the user drilled. There is "
        "no real history. FIX: add AppState.screenStack, push the previous screen inside showScreen(), "
        "and pop it in goBack(). showTab() (a tab root) resets the stack so tab switches don't "
        "accumulate. This makes Z10's goBack() correct and fixes every other back path "
        "(gallery-detail, session-setup, category-list)."
    ),
    exact_fix={
        "edits": [
            {
                "file": "js/app.js",
                "old_string": "  selectedGoal: null,\n  gallerySelectedId: null,\n};",
                "new_string": "  selectedGoal: null,\n  gallerySelectedId: null,\n  screenStack: [],\n};"
            },
            {
                "file": "js/app.js",
                "old_string": "window.showScreen = function(screenId) {\n  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));\n\n  const target = document.getElementById('screen-' + screenId);\n  if (target) {\n    target.classList.add('active');\n    AppState.currentScreen = screenId;\n  }",
                "new_string": "window.showScreen = function(screenId) {\n  // Push the screen we're leaving so goBack() can restore it.\n  if (AppState.currentScreen && AppState.currentScreen !== screenId) {\n    AppState.screenStack.push(AppState.currentScreen);\n    if (AppState.screenStack.length > 20) AppState.screenStack.shift();\n  }\n\n  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));\n\n  const target = document.getElementById('screen-' + screenId);\n  if (target) {\n    target.classList.add('active');\n    AppState.currentScreen = screenId;\n  }"
            },
            {
                "file": "js/app.js",
                "old_string": "window.showTab = function(tabId) {\n  AppState.currentTab = tabId;",
                "new_string": "window.showTab = function(tabId) {\n  AppState.currentTab = tabId;\n  // Switching to a tab root is a fresh navigation context — clear history.\n  AppState.screenStack = [];"
            },
            {
                "file": "js/app.js",
                "old_string": "window.goBack = function() {\n  showTab(AppState.currentTab);\n}",
                "new_string": "window.goBack = function() {\n  const prev = AppState.screenStack.pop();\n  if (prev) {\n    // Restore without re-pushing the current screen onto the stack.\n    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));\n    const target = document.getElementById('screen-' + prev);\n    if (target) { target.classList.add('active'); AppState.currentScreen = prev; }\n    const tabBar = document.getElementById('tab-bar');\n    const hideTabs = ['ob1','ob2','ob3','ob4','camera','review'].includes(prev);\n    if (tabBar) {\n      tabBar.style.opacity = hideTabs ? '0' : '1';\n      tabBar.style.pointerEvents = hideTabs ? 'none' : 'all';\n    }\n  } else {\n    showTab(AppState.currentTab);\n  }\n}"
            }
        ]
    },
    testable_conditions=[
        "AppState.screenStack exists and is an array",
        "Home → category-list → goBack() returns to home; Library → category-list → goBack() returns to library",
        "goBack() with an empty stack falls back to showTab(AppState.currentTab) without throwing",
        "Switching tabs (showTab) resets screenStack to []",
        "screenStack never grows beyond 20 entries"
    ]
)

# ─────────────────────────────────────────────────────────────
# HIGH
# ─────────────────────────────────────────────────────────────

# Z7 — pose count comment wrong AND task's target figure is also wrong
add(
    id="Z7",
    priority="high",
    file="js/poses-data.js",
    title="Stale/incorrect pose-count comments (says '300+ / 10 categories'); verified actual is 745 / 16",
    description=(
        "poses-data.js line 3 says '300+ poses across 10 categories' and line 30 says "
        "'POSE LIBRARY (300+ poses)'. Both are stale. IMPORTANT CORRECTNESS FINDING: the review "
        "brief asked to set this to '761 poses across 16 categories', but that 761 figure is ALSO "
        "wrong — it comes from `grep -c \"id:\"` which over-counts id-like substrings. Executing "
        "poses-data.js in a Node vm and counting Object.keys(POSES_LIBRARY) yields exactly 745 "
        "poses across 16 categories (standing 47, seated 86, leaning 49, lean-seat 30, kneeling 32, "
        "reclining 56, dynamic 30, eccentric 44, couple 30, accessible 30, boudoir 161, editorial 30, "
        "fine-art 30, fashion 30, low-to-high 30, high-to-low 30). Every pose's .id equals its key "
        "(0 mismatches), 0 empty categories, 0 duplicate keys. All live UI already displays 745 "
        "(index.html lines 1349/1384, app.js line 797). FIX: set the comments to the verified 745/16 "
        "so the source of truth matches the UI — do NOT propagate the incorrect 761."
    ),
    exact_fix={
        "edits": [
            {
                "file": "js/poses-data.js",
                "old_string": "// 300+ poses across 10 categories. Auto-computed category counts.",
                "new_string": "// 745 poses across 16 categories. Auto-computed category counts. (Verified via Object.keys(POSES_LIBRARY).length)"
            },
            {
                "file": "js/poses-data.js",
                "old_string": "// \u2500\u2500 POSE LIBRARY (300+ poses) \u2500\u2500",
                "new_string": "// \u2500\u2500 POSE LIBRARY (745 poses) \u2500\u2500"
            }
        ]
    },
    testable_conditions=[
        "Comment reads '745 poses across 16 categories'",
        "Object.keys(POSES_LIBRARY).length === 745 (matches the comment)",
        "Number of distinct .category values === 16",
        "The incorrect figure 761 does NOT appear anywhere in the source or UI"
    ]
)

# Z3 — Gallery dirty flag
add(
    id="Z3",
    priority="high",
    file="js/app.js + js/poses-data.js",
    title="renderGallery() rebuilds the entire grid innerHTML on every gallery tab switch (perf regression)",
    description=(
        "showTab('gallery') calls renderGallery() (app.js lines 553-588) every time, which "
        "regenerates the full grid via items.map().join('') and blows away the DOM — even when "
        "nothing changed since the last render. With up to 100 items each containing an <img> or a "
        "full SVG figure, this thrashes layout and decodes images repeatedly. FIX: add "
        "AppState.galleryDirty (default true), set it true from the three mutators in poses-data.js "
        "(addToGallery / removeFromGallery / toggleGalleryFavorite), and early-return from "
        "renderGallery() when it's clean, clearing the flag after a real render."
    ),
    exact_fix={
        "edits": [
            {
                "file": "js/app.js",
                "old_string": "  sessionCount: 0,\n  capturedCount: 0,",
                "new_string": "  sessionCount: 0,\n  capturedCount: 0,\n  galleryDirty: true,"
            },
            {
                "file": "js/app.js",
                "old_string": "function renderGallery() {\n  const grid = document.getElementById('gallery-grid');\n  const empty = document.getElementById('gallery-empty');\n  const countEl = document.getElementById('gallery-count');\n  if (!grid) return;",
                "new_string": "function renderGallery() {\n  const grid = document.getElementById('gallery-grid');\n  const empty = document.getElementById('gallery-empty');\n  const countEl = document.getElementById('gallery-count');\n  if (!grid) return;\n  // Skip the expensive full-DOM rebuild when nothing changed since last render.\n  if (!AppState.galleryDirty && grid.dataset.rendered === '1') return;"
            },
            {
                "file": "js/app.js",
                "old_string": "        </div>\n      </div>`;\n  }).join('');\n}\n\nfunction cssFilterFor(preset) {",
                "new_string": "        </div>\n      </div>`;\n  }).join('');\n  grid.dataset.rendered = '1';\n  AppState.galleryDirty = false;\n}\n\nfunction cssFilterFor(preset) {"
            },
            {
                "file": "js/poses-data.js",
                "old_string": "function addToGallery(item) {\n  _gallery.unshift(item);\n  if (_gallery.length > 100) _gallery.length = 100;\n}",
                "new_string": "function addToGallery(item) {\n  _gallery.unshift(item);\n  if (_gallery.length > 100) _gallery.length = 100;\n  if (window.AppState) window.AppState.galleryDirty = true;\n}"
            },
            {
                "file": "js/poses-data.js",
                "old_string": "function removeFromGallery(id) {\n  const i = _gallery.findIndex(g => g.id == id);\n  if (i > -1) _gallery.splice(i, 1);\n}",
                "new_string": "function removeFromGallery(id) {\n  const i = _gallery.findIndex(g => g.id == id);\n  if (i > -1) _gallery.splice(i, 1);\n  if (window.AppState) window.AppState.galleryDirty = true;\n}"
            },
            {
                "file": "js/poses-data.js",
                "old_string": "function toggleGalleryFavorite(id) {\n  const g = _gallery.find(g => g.id == id);\n  if (g) g.favorite = !g.favorite;\n  return g ? g.favorite : false;\n}",
                "new_string": "function toggleGalleryFavorite(id) {\n  const g = _gallery.find(g => g.id == id);\n  if (g) g.favorite = !g.favorite;\n  if (window.AppState) window.AppState.galleryDirty = true;\n  return g ? g.favorite : false;\n}"
            }
        ]
    },
    testable_conditions=[
        "Opening the Gallery tab twice with no changes triggers only ONE innerHTML assignment (verify via a spy or DOM node identity)",
        "After addToGallery/removeFromGallery/toggleGalleryFavorite, AppState.galleryDirty === true and the next renderGallery repaints",
        "grid.dataset.rendered === '1' after first render",
        "Favoriting an item then reopening Gallery reflects the new heart badge"
    ]
)

# Z6 — selectedGoal never read; home is fully static
add(
    id="Z6",
    priority="high",
    file="js/app.js + index.html",
    title="AppState.selectedGoal is written but never read — home greeting & featured pose are hardcoded",
    description=(
        "selectGoal() (app.js line 162) stores AppState.selectedGoal from onboarding (values: "
        "'photographer', 'model', 'self-portrait', 'exploring'), but nothing ever reads it. The Home "
        "greeting is a static 'Good day, Artist' (index.html line 1460) and the featured card is "
        "hardcoded to S-Curve Stand / 'scurve-stand' (lines 1467-1468). The profile goal label is "
        "also hardcoded 'Just Exploring' (line 1871). FIX: add a personalizeHome() function that "
        "picks a featured pose whose category matches the goal (photographer→editorial, "
        "model→fashion, self-portrait→standing, exploring→random) and rewrites the greeting and "
        "profile label, then call it whenever we land on Home. Give the featured card elements ids "
        "so JS can target them. Uses only categories that exist (verified list includes editorial, "
        "fashion, standing)."
    ),
    exact_fix={
        "edits": [
            {
                "file": "index.html",
                "old_string": '        <div class="home-greeting">Good day, Artist<span class="accent-dot">.</span></div>\n        <div class="home-sub">Ready to strike a new pose?</div>',
                "new_string": '        <div class="home-greeting" id="home-greeting">Good day, Artist<span class="accent-dot">.</span></div>\n        <div class="home-sub">Ready to strike a new pose?</div>'
            },
            {
                "file": "index.html",
                "old_string": '          <div class="featured-overline">FEATURED POSE</div>\n          <div class="featured-name">S-Curve Stand</div>\n          <button class="btn btn-gold" data-testid="btn-start-session-home" onclick="goToSession(\'scurve-stand\')">Start Session</button>',
                "new_string": '          <div class="featured-overline">FEATURED POSE</div>\n          <div class="featured-name" id="featured-name">S-Curve Stand</div>\n          <button class="btn btn-gold" id="featured-start-btn" data-testid="btn-start-session-home" onclick="goToSession(\'scurve-stand\')">Start Session</button>'
            },
            {
                "file": "js/app.js",
                "old_string": "  if (tabId === 'gallery') renderGallery();\n  if (tabId === 'progress') loadSessionStats();\n  if (tabId === 'home') renderRecentCaptures();",
                "new_string": "  if (tabId === 'gallery') renderGallery();\n  if (tabId === 'progress') loadSessionStats();\n  if (tabId === 'home') { renderRecentCaptures(); personalizeHome(); }"
            },
            {
                "file": "js/app.js",
                "old_string": "function renderCategoryThumbs() {",
                "new_string": "// Personalize the Home screen from the onboarding goal (Z6).\nfunction personalizeHome() {\n  const goal = AppState.selectedGoal;\n  const goalCategory = { photographer: 'editorial', model: 'fashion', 'self-portrait': 'standing' };\n  const goalLabel = { photographer: 'Photographer', model: 'Model', 'self-portrait': 'Self-Portrait', exploring: 'Just Exploring' };\n\n  // Greeting\n  const greetEl = document.getElementById('home-greeting');\n  if (greetEl) {\n    const who = goalLabel[goal] || 'Artist';\n    greetEl.innerHTML = 'Good day, ' + who + '<span class=\"accent-dot\">.</span>';\n  }\n  // Profile label\n  const profEl = document.getElementById('profile-goal-label');\n  if (profEl) profEl.textContent = goalLabel[goal] || 'Just Exploring';\n\n  // Featured pose by goal (random for 'exploring' / unknown)\n  const all = Object.values(POSES_LIBRARY);\n  const cat = goalCategory[goal];\n  const pool = cat ? all.filter(p => p.category === cat) : all;\n  const chosen = (pool.length ? pool : all)[Math.floor(Math.random() * (pool.length ? pool.length : all.length))];\n  if (chosen) {\n    const nameEl = document.getElementById('featured-name');\n    const btnEl = document.getElementById('featured-start-btn');\n    const thumbEl = document.getElementById('thumb-scurve');\n    if (nameEl) nameEl.textContent = chosen.name;\n    if (btnEl) btnEl.setAttribute('onclick', \"goToSession('\" + chosen.id + \"')\");\n    if (thumbEl) thumbEl.innerHTML = renderPoseFigureSVG(chosen, false);\n  }\n}\nwindow.personalizeHome = personalizeHome;\n\nfunction renderCategoryThumbs() {"
            }
        ]
    },
    testable_conditions=[
        "After selecting the 'photographer' goal and reaching Home, the featured pose belongs to the 'editorial' category",
        "'model' goal → featured pose category === 'fashion'; 'self-portrait' → 'standing'",
        "Home greeting text reflects the selected goal label",
        "#profile-goal-label matches the selected goal (not always 'Just Exploring')",
        "Featured Start Session button's onclick targets the chosen pose id",
        "'exploring' or no goal → a valid random pose is featured without error"
    ]
)

# Z8 — Demo Mode HUD badge
add(
    id="Z8",
    priority="high",
    file="index.html + js/app.js",
    title="No live 'Demo Mode' indicator on the camera screen when running in simulation",
    description=(
        "cameraEngine.simulationMode is true whenever real camera access is unavailable/denied "
        "(camera.js lines 58/66/76). The sim canvas draws a 'Demo Mode' caption on the CAPTURE "
        "output (camera.js line 528), but the live camera HUD shows no indication, so users don't "
        "know autocapture is faked. FIX: add a hidden pill to the camera topbar and reveal it in "
        "startCameraSession() after startCamera() resolves, based on cameraEngine.simulationMode."
    ),
    exact_fix={
        "edits": [
            {
                "file": "index.html",
                "old_string": '        <div id="camera-pose-name">Pose Name</div>',
                "new_string": '        <div id="camera-pose-name">Pose Name</div>\n        <div id="demo-mode-pill" data-testid="pill-demo-mode" style="display:none;position:absolute;left:50%;top:52px;transform:translateX(-50%);background:rgba(201,162,76,0.92);color:#0F3B3A;font:600 11px/1 var(--font-body);letter-spacing:0.5px;padding:5px 10px;border-radius:999px;z-index:30;">DEMO MODE</div>'
            },
            {
                "file": "js/app.js",
                "old_string": "  await cameraEngine.startCamera();\n\n  const timerVal = AppState.sessionOptions.timer[AppState.sessionOptions.timerIndex];",
                "new_string": "  await cameraEngine.startCamera();\n\n  // Surface simulation state so users know captures are faked (Z8).\n  const demoPill = document.getElementById('demo-mode-pill');\n  if (demoPill) demoPill.style.display = cameraEngine.simulationMode ? 'block' : 'none';\n\n  const timerVal = AppState.sessionOptions.timer[AppState.sessionOptions.timerIndex];"
            }
        ]
    },
    testable_conditions=[
        "When cameraEngine.simulationMode === true, #demo-mode-pill has display:block on the camera screen",
        "When a real camera stream starts (simulationMode === false), #demo-mode-pill is display:none",
        "The pill reads 'DEMO MODE' and is positioned in the camera topbar"
    ]
)

# ─────────────────────────────────────────────────────────────
# MEDIUM
# ─────────────────────────────────────────────────────────────

# Z4 — Particle pooling
add(
    id="Z4",
    priority="medium",
    file="js/camera.js",
    title="_triggerParticleBloom() creates 18 DOM nodes per capture and nukes them via innerHTML (GC churn)",
    description=(
        "Every autocapture calls _triggerParticleBloom() (camera.js lines 566-577), which clears "
        "the container with innerHTML='' then createElement's 18 fresh .particle divs, and 900ms "
        "later clears again with innerHTML=''. Over a session this is hundreds of allocations and "
        "parser-driven innerHTML clears on the camera hot path. FIX: build the 18 divs once, reuse "
        "them by restarting their animation (toggle display + reflow), and stop wiping innerHTML."
    ),
    exact_fix={
        "edits": [
            {
                "file": "js/camera.js",
                "old_string": "  _triggerParticleBloom() {\n    const c = document.getElementById('particle-bloom');\n    if (!c) return; c.innerHTML = '';\n    for (let i = 0; i < 18; i++) {\n      const a = (i/18)*2*Math.PI, d = 80 + Math.random()*60;\n      const p = document.createElement('div');\n      p.className = 'particle';\n      p.style.cssText = `--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;background:${Math.random()>0.5?'var(--brand-gold)':'var(--state-success)'};animation-delay:${Math.random()*100}ms;animation-duration:${450+Math.random()*200}ms;`;\n      c.appendChild(p);\n    }\n    setTimeout(() => { c.innerHTML = ''; }, 900);\n  }",
                "new_string": "  _triggerParticleBloom() {\n    const c = document.getElementById('particle-bloom');\n    if (!c) return;\n    // Pool the 18 particle nodes once; reuse them across captures (Z4).\n    if (!this._particlePool) {\n      this._particlePool = [];\n      for (let i = 0; i < 18; i++) {\n        const p = document.createElement('div');\n        p.className = 'particle';\n        c.appendChild(p);\n        this._particlePool.push(p);\n      }\n    }\n    for (let i = 0; i < 18; i++) {\n      const a = (i/18)*2*Math.PI, d = 80 + Math.random()*60;\n      const p = this._particlePool[i];\n      p.style.animation = 'none';\n      p.style.cssText = `--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;background:${Math.random()>0.5?'var(--brand-gold)':'var(--state-success)'};opacity:1;`;\n      void p.offsetWidth; // force reflow so the animation restarts\n      p.style.animationDelay = `${Math.random()*100}ms`;\n      p.style.animationDuration = `${450+Math.random()*200}ms`;\n      p.style.animationName = '';\n    }\n    clearTimeout(this._particleTimer);\n    this._particleTimer = setTimeout(() => {\n      this._particlePool.forEach(p => { p.style.opacity = '0'; });\n    }, 900);\n  }"
            }
        ]
    },
    testable_conditions=[
        "particle-bloom contains exactly 18 .particle children after the first bloom and still 18 after subsequent blooms (no growth)",
        "cameraEngine._particlePool has length 18 and is reused (same node references) across calls",
        "No document.createElement is invoked on the second and later _triggerParticleBloom calls",
        "Particles visually re-animate outward on each capture"
    ]
)

# Z9 — Session data-loss toast (one-time)
add(
    id="Z9",
    priority="medium",
    file="js/app.js",
    title="No warning that captures are not persisted (localStorage is iframe-blocked, storage is in-memory)",
    description=(
        "All storage (_gallery, _sessionHistory, _favorites in poses-data.js lines 7494-7527) is "
        "in-memory and lost on tab close, but the user is never told. saveToGallery() (app.js lines "
        "464-474) shows only a cheerful 'Saved to your Gallery' toast. FIX: show a one-time "
        "informational toast on the first save via a module flag, so we don't nag on every capture."
    ),
    exact_fix={
        "edits": [
            {
                "file": "js/app.js",
                "old_string": "window.saveToGallery = function() {\n  const last = window._lastCapture;\n  if (last) {\n    // Persist any preset currently applied\n    const activePreset = document.querySelector('.preset-chip.active');\n    if (activePreset) last.filter = activePreset.getAttribute('data-preset') || 'none';\n  }\n  showToast('Saved to your Gallery \u2713');\n  renderRecentCaptures();\n  setTimeout(() => showTab('gallery'), 900);\n}",
                "new_string": "let _dataLossWarned = false;\nwindow.saveToGallery = function() {\n  const last = window._lastCapture;\n  if (last) {\n    // Persist any preset currently applied\n    const activePreset = document.querySelector('.preset-chip.active');\n    if (activePreset) last.filter = activePreset.getAttribute('data-preset') || 'none';\n  }\n  showToast('Saved to your Gallery \u2713');\n  if (!_dataLossWarned) {\n    _dataLossWarned = true;\n    setTimeout(() => showToast('Note: captures aren\\u2019t saved after you close this tab.'), 1600);\n  }\n  renderRecentCaptures();\n  setTimeout(() => showTab('gallery'), 900);\n}"
            }
        ]
    },
    testable_conditions=[
        "First saveToGallery() call shows both the 'Saved' toast and the data-loss note",
        "Second and later saveToGallery() calls show only the 'Saved' toast (no repeated warning)",
        "_dataLossWarned flips to true after the first save"
    ]
)

# Z-EndSession — sessionCount used as activity flag (correctness)
add(
    id="Z11",
    priority="medium",
    file="js/app.js",
    title="endSession() saves a session even with zero captures — uses cumulative sessionCount as an activity check",
    description=(
        "startCameraSession() increments AppState.sessionCount (app.js line 296) as a *lifetime* "
        "counter. endSession() (lines 339-355) then guards saveSession() with "
        "'if (AppState.sessionCount > 0)', which is true for every session after the first — so "
        "ending a session in which the user captured nothing still writes a history row with "
        "score 0 and capturedCount 0, polluting progress stats. FIX: gate the save on whether the "
        "current session actually captured anything (AppState.capturedCount > 0)."
    ),
    exact_fix={
        "edits": [
            {
                "file": "js/app.js",
                "old_string": "window.endSession = function() {\n  cameraEngine.stopCamera();\n\n  if (AppState.sessionCount > 0) {",
                "new_string": "window.endSession = function() {\n  cameraEngine.stopCamera();\n\n  // Only record sessions that actually produced a capture (Z11).\n  if (AppState.capturedCount > 0) {"
            }
        ]
    },
    testable_conditions=[
        "Starting then immediately ending a session with 0 captures does NOT add a row to session history",
        "Ending a session after >=1 capture DOES save a session row",
        "Progress stats no longer accumulate zero-score sessions"
    ]
)

# Z-capturedCount reset (correctness — related to Z11)
add(
    id="Z12",
    priority="medium",
    file="js/app.js",
    title="AppState.capturedCount is never reset per session — carries over between sessions",
    description=(
        "capturedCount accumulates across the app lifetime; it is initialized to 0 (app.js line 23) "
        "but never reset when a new camera session begins in startCameraSession() (lines 257-299). "
        "Combined with the Z11 fix, a fresh no-capture session would still look active because the "
        "previous session's count lingers, and saved session rows over-report captures. FIX: reset "
        "capturedCount to 0 at the start of each session."
    ),
    exact_fix={
        "edits": [
            {
                "file": "js/app.js",
                "old_string": "  showScreen('camera');\n\n  const pose = POSES_LIBRARY[AppState.selectedPoseId];\n  const poseNameEl = document.getElementById('camera-pose-name');",
                "new_string": "  showScreen('camera');\n\n  // Reset per-session capture tally (Z12).\n  AppState.capturedCount = 0;\n\n  const pose = POSES_LIBRARY[AppState.selectedPoseId];\n  const poseNameEl = document.getElementById('camera-pose-name');"
            }
        ]
    },
    testable_conditions=[
        "AppState.capturedCount === 0 immediately after startCameraSession() runs",
        "A capture in the new session increments from 0, not from a stale prior value",
        "Saved session capturedCount reflects only the current session"
    ]
)

# Z-goal-string inconsistency
add(
    id="Z13",
    priority="medium",
    file="js/app.js",
    title="completeOnboardingSkip() sets goal 'photography' but selectGoal uses 'photographer' — inconsistent enum",
    description=(
        "The onboarding goal buttons pass 'photographer', 'model', 'self-portrait', 'exploring' "
        "(index.html lines 1423-1438) into selectGoal(). But completeOnboardingSkip() (app.js line "
        "184) defaults to 'photography', a value that matches none of them. With Z6 reading "
        "selectedGoal to personalize Home, 'photography' would silently fall through to the random/"
        "default branch. FIX: default the skip path to 'exploring' (the intended 'no strong "
        "preference' persona), keeping the enum consistent."
    ),
    exact_fix={
        "edits": [
            {
                "file": "js/app.js",
                "old_string": "  AppState.selectedGoal = AppState.selectedGoal || 'photography';",
                "new_string": "  AppState.selectedGoal = AppState.selectedGoal || 'exploring';"
            }
        ]
    },
    testable_conditions=[
        "After skipping onboarding, AppState.selectedGoal is one of ['photographer','model','self-portrait','exploring']",
        "The skip default 'exploring' produces the random-featured Home behavior in Z6 without falling through unexpectedly",
        "No code path sets selectedGoal to 'photography'"
    ]
)

# Z-Escape handler consistency
add(
    id="Z14",
    priority="low",
    file="js/app.js",
    title="Escape-key handler for category-list & gallery-detail uses showTab instead of goBack (inconsistent with buttons)",
    description=(
        "The keydown Escape handler (app.js lines 2037-2046) hard-routes category-list → "
        "showTab('library') and gallery-detail → showTab('gallery'). After Z2/Z10 the on-screen "
        "back buttons use goBack() with a real stack, so pressing Escape can send the user somewhere "
        "different than the visible back button would. FIX: make Escape use goBack() for these "
        "drill-down screens for consistent navigation. (camera Escape still calls endSession() by "
        "design.)"
    ),
    exact_fix={
        "edits": [
            {
                "file": "js/app.js",
                "old_string": "    } else if (AppState.currentScreen === 'gallery-detail') {\n      showTab('gallery');\n    } else if (AppState.currentScreen === 'category-list') {\n      showTab('library');\n    }",
                "new_string": "    } else if (AppState.currentScreen === 'gallery-detail') {\n      goBack();\n    } else if (AppState.currentScreen === 'category-list') {\n      goBack();\n    }"
            }
        ]
    },
    testable_conditions=[
        "Pressing Escape on category-list navigates the same place the on-screen back button does",
        "Pressing Escape on gallery-detail uses goBack()",
        "Escape on the camera screen still calls endSession()"
    ]
)

# Z-onboarding persistence comment
add(
    id="Z15",
    priority="low",
    file="js/app.js",
    title="Onboarding completion is in-memory only — document the iframe-blocked localStorage constraint",
    description=(
        "_onboardingCompleted (app.js line 40) resets on every page load, so returning users re-see "
        "onboarding. In this preview-iframe deployment localStorage is blocked, so persisting it "
        "isn't currently possible; the code should make that constraint explicit (and provide the "
        "guarded hook) so a future non-iframe build can persist it without re-discovering the "
        "limitation. FIX: expand the comment and add a defensive try/catch localStorage read that "
        "no-ops under the iframe sandbox."
    ),
    exact_fix={
        "edits": [
            {
                "file": "js/app.js",
                "old_string": "// In-memory onboarding flag (resets each page load — expected in preview iframe)\nlet _onboardingCompleted = false;",
                "new_string": "// Onboarding completion flag.\n// NOTE: localStorage is BLOCKED in the preview iframe sandbox, so this is intentionally\n// in-memory and resets on every page load. The try/catch below is a no-op under the\n// sandbox but lets a future non-iframe deployment persist completion without code changes.\nlet _onboardingCompleted = false;\ntry {\n  if (window.localStorage && localStorage.getItem('poseart_onboarded') === '1') {\n    _onboardingCompleted = true;\n  }\n} catch (e) { /* localStorage unavailable (iframe sandbox) — stay in-memory */ }"
            }
        ]
    },
    testable_conditions=[
        "The comment explicitly states localStorage is iframe-blocked",
        "A blocked/throwing localStorage access does not throw an uncaught error at load",
        "In a non-iframe context where localStorage.poseart_onboarded === '1', _onboardingCompleted becomes true"
    ]
)

# Z-dead CSS rule callout (documentation of dead code)
add(
    id="Z16",
    priority="low",
    file="css/app.css",
    title="Dead rule: '#countdown-display.visible{display:flex}' never fires (app.js toggles opacity, not classList)",
    description=(
        "app.css line 998 defines '#countdown-display.visible { display: flex; }', but the countdown "
        "is shown/hidden purely via element.style.opacity in startCountdown() (app.js ~lines "
        "392-401) — the .visible class is never added to #countdown-display. The inline "
        "#countdown-display rule (index.html line 707) already uses display:flex + opacity/transition "
        "and wins the cascade. This rule is dead. It is removed automatically when Z1 deletes the "
        "app.css <link>; if app.css is kept for any reason, delete this specific rule."
    ),
    exact_fix={
        "edits": [
            {
                "file": "css/app.css",
                "old_string": "#countdown-display.visible { display: flex; }\n",
                "new_string": ""
            }
        ]
    },
    testable_conditions=[
        "No code adds the 'visible' class to #countdown-display (grep confirms 0 occurrences)",
        "Countdown still appears/disappears via opacity transition",
        "Removing the rule causes no visual change"
    ]
)

with open('/home/user/workspace/zuckerberg_review_p9.json', 'w') as f:
    json.dump(fixes, f, indent=2, ensure_ascii=False)

print("Wrote", len(fixes), "fixes")
by_pri = {}
for x in fixes:
    by_pri[x['priority']] = by_pri.get(x['priority'], 0) + 1
print("By priority:", by_pri)
print("IDs:", [x['id'] for x in fixes])
