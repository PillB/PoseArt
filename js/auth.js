// ============================================================
// PoseArt v2.6-solarize — Invite-only preview gate
// ------------------------------------------------------------
// SECURITY MODEL (defect D16 / D22 / D23 fix):
//   • NO credentials are stored in this source file. The previous
//     implementation committed reversible base64 of the preview
//     password and tester usernames — that pattern is gone.
//   • Test credentials are provisioned at runtime ONLY from
//     `window.__POSEART_TEST_CREDENTIALS__`, which is installed by
//     a NON-COMMITTED `js/test-creds.local.js` produced from CI
//     secrets (POSEART_TEST_USERNAME / POSEART_TEST_PASSWORD) by
//     `scripts/inject-test-creds.js`.
//   • If no credentials are provisioned, login() fails closed with
//     a clear message — the app cannot be unlocked from the
//     client source alone.
//   • The session is session-only: it lives in `sessionStorage`
//     and is destroyed when the browser tab closes. No persistent
//     credential material is written to disk.
//
// This is a session gate for an invite-only preview. It is NOT
// production authentication. Do not store secrets in client code.
// ============================================================
(function setupPoseArtAuth(global) {
  'use strict';

  const SESSION_KEY = 'poseart_auth_session';
  // Bumped to 2 on credential-source change. Any session created
  // under the legacy v1 (embedded base64) credential set is
  // invalidated and must re-authenticate against the new
  // externally-provisioned credential bundle.
  const SESSION_VERSION = 2;

  const disclosure =
    'Invite-only preview gate. Not production authentication. ' +
    'Do not store secrets in client code.';

  function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  // Read + validate the externally-provisioned credential bundle.
  // Returns a normalized array of {u, p} entries, or null if no
  // usable bundle is present. Never throws.
  function readProvisionedCredentials() {
    const creds = global && global.__POSEART_TEST_CREDENTIALS__;
    if (!isPlainObject(creds)) return null;
    if (!Array.isArray(creds.users) || creds.users.length === 0) return null;
    const normalized = [];
    for (const entry of creds.users) {
      if (!isPlainObject(entry)) continue;
      const u = typeof entry.u === 'string' ? entry.u.trim() : '';
      const p = typeof entry.p === 'string' ? entry.p : '';
      if (!u || !p) continue;
      normalized.push({ u, p });
    }
    if (normalized.length === 0) return null;
    return normalized;
  }

  function readSession() {
    try {
      const raw = global.sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session || session.version !== SESSION_VERSION || typeof session.user !== 'string') {
        global.sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      // Re-validate the stored user against the CURRENTLY provisioned
      // credential bundle. If the bundle was rotated, removed, or the
      // session user is no longer authorized, the session is dropped.
      const creds = readProvisionedCredentials();
      const stillAuthorized = creds ? creds.some(entry => entry.u === session.user) : false;
      if (!stillAuthorized) {
        global.sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session;
    } catch (_) {
      return null;
    }
  }

  function login(username, password) {
    const normalizedUser = typeof username === 'string' ? username.trim() : '';
    const normalizedPassword = typeof password === 'string' ? password : '';
    if (!normalizedUser || !normalizedPassword) {
      return { ok: false, error: 'Enter both username and password.' };
    }

    const creds = readProvisionedCredentials();
    if (!creds) {
      return {
        ok: false,
        error: 'Preview credentials are not provisioned in this build.',
      };
    }

    const match = creds.find(entry => (
      entry.u === normalizedUser && entry.p === normalizedPassword
    ));
    if (!match) return { ok: false, error: 'Username or password is incorrect.' };

    try {
      global.sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        version: SESSION_VERSION,
        user: normalizedUser,
        authenticatedAt: Date.now(),
        sessionOnly: true,
      }));
    } catch (_) {
      return { ok: false, error: 'This browser cannot start a private test session.' };
    }
    return { ok: true, user: normalizedUser };
  }

  function logout() {
    try { global.sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
  }

  function isLoggedIn() {
    return readSession() !== null;
  }

  function getCurrentUser() {
    return readSession()?.user || null;
  }

  function isProvisioned() {
    return readProvisionedCredentials() !== null;
  }

  global.PoseArtAuth = Object.freeze({
    login,
    logout,
    isLoggedIn,
    getCurrentUser,
    isProvisioned,
    disclosure,
    SESSION_VERSION,
  });
})(typeof window !== 'undefined' ? window : globalThis);
