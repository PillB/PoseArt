// ============================================================
// PoseArt v2.5 — Friends & Family authentication gate
// Client-side access control for limited pre-release testing.
// Base64 is deliberate obfuscation, not production-grade security.
// ============================================================
(function setupPoseArtAuth(global) {
  'use strict';

  const SESSION_KEY = 'poseart_auth_session';
  const SESSION_VERSION = 1;
  const encodedPassword = 'UG9zZUFydDIwMjYh';
  const credentials = Object.freeze([
    { u: 'dGVzdGVyMQ==', p: encodedPassword },
    { u: 'dGVzdGVyMg==', p: encodedPassword },
    { u: 'dGVzdGVyMw==', p: encodedPassword },
    { u: 'dGVzdGVyNA==', p: encodedPassword },
    { u: 'dGVzdGVyNQ==', p: encodedPassword },
    { u: 'dGVzdGVyNg==', p: encodedPassword },
    { u: 'dGVzdGVyNw==', p: encodedPassword },
    { u: 'dGVzdGVyOA==', p: encodedPassword },
    { u: 'dGVzdGVyOQ==', p: encodedPassword },
    { u: 'dGVzdGVyMTA=', p: encodedPassword },
  ]);

  function decode(value) {
    try { return global.atob(value); } catch (_) { return ''; }
  }

  function readSession() {
    try {
      const raw = global.sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session || session.version !== SESSION_VERSION || typeof session.user !== 'string') return null;
      const knownUser = credentials.some(entry => decode(entry.u) === session.user);
      if (!knownUser) {
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

    const match = credentials.find(entry => (
      decode(entry.u) === normalizedUser && decode(entry.p) === normalizedPassword
    ));
    if (!match) return { ok: false, error: 'Username or password is incorrect.' };

    try {
      global.sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        version: SESSION_VERSION,
        user: normalizedUser,
        authenticatedAt: Date.now(),
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

  global.PoseArtAuth = Object.freeze({ login, logout, isLoggedIn, getCurrentUser });
})(window);
