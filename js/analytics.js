// ============================================================
// PoseArt — Analytics Instrumentation Stub (ready to connect)
// ============================================================
// This module provides a unified analytics interface that works
// WITHOUT a backend (no-op) and is ready to connect to PostHog
// or any other analytics provider.
//
// When PostHog is configured (docs/backend/09-ANALYTICS-AND-OBSERVABILITY.md):
// 1. Set window.POSTHOG_KEY and window.POSTHOG_HOST in a <script>
//    tag BEFORE analytics.js loads (or in a config file).
// 2. The init() function will detect the key and load PostHog.
// 3. All track() calls will automatically send to PostHog.
// 4. If no key is set, all calls are no-ops (safe for F&F preview).
//
// Event taxonomy: see docs/backend/examples/event-taxonomy.json
// Privacy: never send passwords, tokens, photos, payment data,
// or personal form content. See FORBIDDEN_KEYS below.
// ============================================================

(function setupAnalytics(global) {
  'use strict';

  // ── Configuration ──
  var POSTHOG_KEY = global.POSTHOG_KEY || null;
  var POSTHOG_HOST = global.POSTHOG_HOST || 'https://app.posthog.com';
  var CONSENT_KEY = 'poseart_analytics_consent';
  var DEBUG = global.location && global.location.hostname === 'localhost';

  // ── Privacy: properties that must NEVER be sent to analytics ──
  var FORBIDDEN_KEYS = [
    'password', 'token', 'secret', 'apiKey', 'stripeToken',
    'dataUrl', 'imageBase64', 'photo', 'capture', 'frameData',
    'creditCard', 'cvv', 'ssn', 'email', 'phone', 'address'
  ];

  function sanitizeProperties(props) {
    if (!props || typeof props !== 'object') return {};
    var clean = {};
    for (var key in props) {
      if (!props.hasOwnProperty(key)) continue;
      var lowerKey = key.toLowerCase();
      var isForbidden = FORBIDDEN_KEYS.some(function(fk) {
        return lowerKey.indexOf(fk) !== -1;
      });
      if (isForbidden) {
        if (DEBUG) console.warn('[analytics] blocked forbidden property:', key);
        continue;
      }
      clean[key] = props[key];
    }
    return clean;
  }

  // ── Consent management ──
  function hasConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY) === 'true';
    } catch (_) {
      return false;
    }
  }

  function setConsent(granted) {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? 'true' : 'false');
    } catch (_) {}
  }

  // ── PostHog loader (only if key + consent) ──
  var posthogReady = false;
  function initPostHog() {
    if (!POSTHOG_KEY || !hasConsent()) return;
    if (posthogReady) return;
    // Dynamic script load — PostHog JS SDK
    var script = document.createElement('script');
    script.src = POSTHOG_HOST + '/array.js';
    script.async = true;
    script.onload = function() {
      if (global.posthog) {
        global.posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          opt_out_capturing_by_default: true,
          // Respect Do Not Track
          respect_dnt: true,
          // Disable session recording until explicitly enabled
          disable_session_recording: true
        });
        posthogReady = true;
        if (DEBUG) console.log('[analytics] PostHog initialized');
      }
    };
    document.head.appendChild(script);
  }

  // ── Core API ──
  var Analytics = {
    // Initialize — call on app load
    init: function() {
      initPostHog();
      if (DEBUG) console.log('[analytics] init (PostHog:', !!POSTHOG_KEY, 'consent:', hasConsent(), ')');
    },

    // Track an event with optional properties
    track: function(eventName, properties) {
      var cleanProps = sanitizeProperties(properties);
      if (DEBUG) console.log('[analytics] track:', eventName, cleanProps);
      if (posthogReady && global.posthog) {
        global.posthog.capture(eventName, cleanProps);
      }
      // Store locally for debugging (no PII)
      try {
        var log = JSON.parse(localStorage.getItem('poseart_analytics_log') || '[]');
        log.push({ event: eventName, props: cleanProps, ts: Date.now() });
        if (log.length > 100) log = log.slice(-100);
        localStorage.setItem('poseart_analytics_log', JSON.stringify(log));
      } catch (_) {}
    },

    // Identify a user (after login)
    identify: function(userId, traits) {
      if (DEBUG) console.log('[analytics] identify:', userId);
      if (posthogReady && global.posthog) {
        global.posthog.identify(userId, sanitizeProperties(traits));
      }
    },

    // Reset (on logout)
    reset: function() {
      if (DEBUG) console.log('[analytics] reset');
      if (posthogReady && global.posthog) {
        global.posthog.reset();
      }
    },

    // Consent management
    hasConsent: hasConsent,
    setConsent: setConsent,

    // Check if analytics is active
    isActive: function() {
      return posthogReady && hasConsent();
    }
  };

  global.PoseArtAnalytics = Object.freeze(Analytics);
})(window);
