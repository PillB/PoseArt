/*
 * js/persistence.js — v5 durable state layer for PoseArt
 *
 * Fixes AGENT_STATE.md open issues:
 *  - "Onboarding replays every load (no persistence)"
 *  - "Data loss: no persistence for gallery/favs on refresh"
 *  - "Session history persists in-memory only"
 *
 * Design:
 *  - Iframe-safe: probes localStorage once; if blocked, all persist_/hydrate_
 *    calls become no-ops. In-memory state still works.
 *  - Namespaced under `poseart-v1:` to allow versioned migrations later.
 *  - Keeps the existing const-array module in poses-data.js UNTOUCHED — we
 *    hydrate/persist via the exposed `addToGallery` / `saveSession` /
 *    `toggleFavorite` functions and the arrays they mutate.
 *
 * Public API on `window.PoseArtStorage`:
 *   .available          — boolean
 *   .load(key, fallback)
 *   .save(key, value)
 *   .clear(key)
 *   .hydrateAll()       — call after poses-data.js loaded
 *   .installAutosave()  — patches gallery/session/favorite mutators
 */
(function () {
  'use strict';

  const NS = 'poseart-v1:';
  const KEYS = {
    onboardingDone: NS + 'onboarding-done',
    selectedGoal:   NS + 'selected-goal',
    gallery:        NS + 'gallery',
    sessions:       NS + 'sessions',
    favorites:      NS + 'favorites',
  };

  // ─── Probe: is localStorage actually usable here? ──────────────
  let _available = false;
  try {
    const probeKey = NS + '__probe__';
    localStorage.setItem(probeKey, '1');
    localStorage.removeItem(probeKey);
    _available = true;
  } catch (e) {
    _available = false;
    // Preview iframes commonly block this; keep silent.
  }

  function load(key, fallback) {
    if (!_available) return fallback;
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    if (!_available) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      // Quota errors etc — swallow but don't crash.
      return false;
    }
  }

  function clear(key) {
    if (!_available) return;
    try { localStorage.removeItem(key); } catch (e) {}
  }

  /* ─── Hydrate — pull saved arrays back into the in-memory
     structures owned by poses-data.js. We can't reach the module-scope
     const arrays directly, but we CAN push through the exported
     addToGallery / saveSession / toggleFavorite functions. ─── */
  function hydrateAll() {
    // Onboarding + goal
    if (load(KEYS.onboardingDone, false)) {
      window._onboardingCompleted = true;
    }
    const savedGoal = load(KEYS.selectedGoal, null);
    if (savedGoal && window.AppState && !window.AppState.selectedGoal) {
      window.AppState.selectedGoal = savedGoal;
    }

    // Gallery — replay in reverse so unshift order stays consistent
    const savedGallery = load(KEYS.gallery, []);
    if (Array.isArray(savedGallery) && savedGallery.length && typeof window.addToGallery === 'function') {
      // getGallery() returns most-recent-first; we saved in that order,
      // so push oldest-first back through addToGallery.
      for (let i = savedGallery.length - 1; i >= 0; i--) {
        try { window.addToGallery(savedGallery[i]); } catch (e) {}
      }
    }

    // Sessions
    const savedSessions = load(KEYS.sessions, []);
    if (Array.isArray(savedSessions) && savedSessions.length && typeof window.saveSession === 'function') {
      for (let i = savedSessions.length - 1; i >= 0; i--) {
        try { window.saveSession(savedSessions[i]); } catch (e) {}
      }
    }

    // Favorites
    const savedFavs = load(KEYS.favorites, []);
    if (Array.isArray(savedFavs) && savedFavs.length && typeof window.toggleFavorite === 'function') {
      for (const poseId of savedFavs) {
        // toggleFavorite adds if not present, so we can safely call it.
        try {
          if (typeof window.isFavorite === 'function' && !window.isFavorite(poseId)) {
            window.toggleFavorite(poseId);
          }
        } catch (e) {}
      }
    }
  }

  /* ─── Autosave — wrap the module functions so mutations persist. ─── */
  function installAutosave() {
    if (!_available) return; // Don't wrap if we can't save anything.

    // Gallery mutators
    if (typeof window.addToGallery === 'function' && typeof window.getGallery === 'function') {
      const orig = window.addToGallery;
      window.addToGallery = function (item) {
        const r = orig.apply(this, arguments);
        try { save(KEYS.gallery, window.getGallery()); } catch (e) {}
        return r;
      };
    }
    if (typeof window.removeFromGallery === 'function') {
      const orig = window.removeFromGallery;
      window.removeFromGallery = function (id) {
        const r = orig.apply(this, arguments);
        try { save(KEYS.gallery, window.getGallery()); } catch (e) {}
        return r;
      };
    }
    if (typeof window.toggleGalleryFavorite === 'function') {
      const orig = window.toggleGalleryFavorite;
      window.toggleGalleryFavorite = function (id) {
        const r = orig.apply(this, arguments);
        try { save(KEYS.gallery, window.getGallery()); } catch (e) {}
        return r;
      };
    }

    // Sessions
    if (typeof window.saveSession === 'function' && typeof window.getSessionHistory === 'function') {
      const orig = window.saveSession;
      window.saveSession = function (session) {
        const r = orig.apply(this, arguments);
        try { save(KEYS.sessions, window.getSessionHistory()); } catch (e) {}
        return r;
      };
    }

    // Favorites
    if (typeof window.toggleFavorite === 'function' && typeof window.getFavorites === 'function') {
      const orig = window.toggleFavorite;
      window.toggleFavorite = function (poseId) {
        const r = orig.apply(this, arguments);
        try { save(KEYS.favorites, window.getFavorites()); } catch (e) {}
        return r;
      };
    }
  }

  /* ─── Public helpers for onboarding + goal ─── */
  function markOnboardingDone() {
    save(KEYS.onboardingDone, true);
    window._onboardingCompleted = true;
  }
  function saveSelectedGoal(goal) {
    if (goal) save(KEYS.selectedGoal, goal);
  }
  function resetAll() {
    Object.values(KEYS).forEach(clear);
    window._onboardingCompleted = false;
  }

  window.PoseArtStorage = {
    available: _available,
    KEYS,
    load, save, clear,
    hydrateAll, installAutosave,
    markOnboardingDone,
    saveSelectedGoal,
    resetAll,
  };
})();
