// ============================================================
// PoseArt Solarize — auth gate unit tests (defect D16 / D22 / D23)
// ------------------------------------------------------------
// Verifies the credential-purging fix:
//   1. No committed credentials exist in the auth.js source text
//      (no base64 password token, no base64 user tokens).
//   2. login() fails closed when no credential bundle is
//      provisioned (window.__POSEART_TEST_CREDENTIALS__ absent).
//   3. login() succeeds when a bundle is provisioned, and the
//      session is session-only (sessionStorage, not localStorage).
//   4. isLoggedIn / getCurrentUser / logout behave correctly.
//   5. Direct re-validation drops a session whose user is no
//      longer in the provisioned bundle (credential rotation).
//
// Uses the jsdom environment so window/sessionStorage are real.
// ============================================================
// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTH_PATH = resolve(__dirname, '..', '..', 'js', 'auth.js');
const AUTH_SRC = readFileSync(AUTH_PATH, 'utf8');

// Load auth.js into the jsdom global scope by indirect eval.
// The IIFE binds to `window` (which jsdom provides as a global).
function loadAuth() {
  // eslint-disable-next-line no-new-func
  (0, eval)(AUTH_SRC);
}

describe('auth.js source — no committed credentials (D16/D22/D23)', () => {
  it('does not contain the legacy base64 password token', () => {
    // Legacy value: 'UG9zZUFydDIwMjYh' (base64 of the old preview password).
    expect(AUTH_SRC).not.toContain('UG9zZUFydDIwMjYh');
  });

  it('does not contain any of the legacy base64 tester usernames', () => {
    // Legacy values: 'dGVzdGVyMQ=='..'dGVzdGVyMTA=' (base64 of tester1..tester10).
    const legacyTokens = [
      'dGVzdGVyMQ==', 'dGVzdGVyMg==', 'dGVzdGVyMw==', 'dGVzdGVyNA==',
      'dGVzdGVyNQ==', 'dGVzdGVyNg==', 'dGVzdGVyNw==', 'dGVzdGVyOA==',
      'dGVzdGVyOQ==', 'dGVzdGVyMTA=',
    ];
    for (const token of legacyTokens) {
      expect(AUTH_SRC).not.toContain(token);
    }
  });

  it('does not call atob (no base64 decoding of credentials)', () => {
    // The new auth.js must not decode any base64 credential material.
    expect(AUTH_SRC).not.toMatch(/\batob\s*\(/);
  });

  it('does not contain hardcoded plaintext passwords', () => {
    expect(AUTH_SRC).not.toContain('PoseArt2026');
    expect(AUTH_SRC).not.toMatch(/password\s*[:=]\s*['"][^'"]+['"]/i);
  });

  it('exposes a disclosure string stating this is not production auth', () => {
    expect(AUTH_SRC).toContain('Not production authentication');
    expect(AUTH_SRC).toContain('disclosure');
  });
});

describe('PoseArtAuth — login gate behavior', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    delete window.__POSEART_TEST_CREDENTIALS__;
    delete window.PoseArtAuth;
    loadAuth();
  });

  afterEach(() => {
    window.sessionStorage.clear();
    delete window.__POSEART_TEST_CREDENTIALS__;
    delete window.PoseArtAuth;
  });

  it('fails closed when no credentials are provisioned', () => {
    const result = window.PoseArtAuth.login('anyone', 'anything');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not provisioned/i);
    expect(window.PoseArtAuth.isLoggedIn()).toBe(false);
  });

  it('rejects empty username or password before checking provisioning', () => {
    window.__POSEART_TEST_CREDENTIALS__ = {
      users: [{ u: 'tester', p: 'secret' }],
      sessionOnly: true,
    };
    expect(window.PoseArtAuth.login('', 'secret').ok).toBe(false);
    expect(window.PoseArtAuth.login('tester', '').ok).toBe(false);
    expect(window.PoseArtAuth.login('   ', 'secret').ok).toBe(false);
  });

  it('succeeds when the bundle is provisioned and credentials match', () => {
    window.__POSEART_TEST_CREDENTIALS__ = {
      users: [{ u: 'tester', p: 'secret' }],
      sessionOnly: true,
    };
    const result = window.PoseArtAuth.login('tester', 'secret');
    expect(result.ok).toBe(true);
    expect(result.user).toBe('tester');
    expect(window.PoseArtAuth.isLoggedIn()).toBe(true);
    expect(window.PoseArtAuth.getCurrentUser()).toBe('tester');
  });

  it('rejects wrong password even when the bundle is provisioned', () => {
    window.__POSEART_TEST_CREDENTIALS__ = {
      users: [{ u: 'tester', p: 'secret' }],
      sessionOnly: true,
    };
    const result = window.PoseArtAuth.login('tester', 'wrong');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/incorrect/i);
    expect(window.PoseArtAuth.isLoggedIn()).toBe(false);
  });

  it('stores the session in sessionStorage (not localStorage)', () => {
    window.__POSEART_TEST_CREDENTIALS__ = {
      users: [{ u: 'tester', p: 'secret' }],
      sessionOnly: true,
    };
    window.PoseArtAuth.login('tester', 'secret');
    expect(window.sessionStorage.getItem('poseart_auth_session')).not.toBeNull();
    // localStorage must NOT carry auth state.
    expect(window.localStorage.getItem('poseart_auth_session')).toBeNull();
  });

  it('logout clears the session', () => {
    window.__POSEART_TEST_CREDENTIALS__ = {
      users: [{ u: 'tester', p: 'secret' }],
      sessionOnly: true,
    };
    window.PoseArtAuth.login('tester', 'secret');
    expect(window.PoseArtAuth.isLoggedIn()).toBe(true);
    window.PoseArtAuth.logout();
    expect(window.PoseArtAuth.isLoggedIn()).toBe(false);
    expect(window.PoseArtAuth.getCurrentUser()).toBeNull();
  });

  it('drops a session whose user is no longer in the provisioned bundle (rotation)', () => {
    // Provision creds, log in as 'tester'.
    window.__POSEART_TEST_CREDENTIALS__ = {
      users: [{ u: 'tester', p: 'secret' }],
      sessionOnly: true,
    };
    window.PoseArtAuth.login('tester', 'secret');
    expect(window.PoseArtAuth.isLoggedIn()).toBe(true);

    // Rotate the bundle: remove 'tester', add 'newperson'.
    window.__POSEART_TEST_CREDENTIALS__ = {
      users: [{ u: 'newperson', p: 'newsecret' }],
      sessionOnly: true,
    };
    // isLoggedIn re-validates against the current bundle → must drop.
    expect(window.PoseArtAuth.isLoggedIn()).toBe(false);
    expect(window.PoseArtAuth.getCurrentUser()).toBeNull();
  });

  it('isProvisioned reports the correct state', () => {
    expect(window.PoseArtAuth.isProvisioned()).toBe(false);
    window.__POSEART_TEST_CREDENTIALS__ = {
      users: [{ u: 'tester', p: 'secret' }],
      sessionOnly: true,
    };
    expect(window.PoseArtAuth.isProvisioned()).toBe(true);
  });

  it('exposes the disclosure string', () => {
    expect(typeof window.PoseArtAuth.disclosure).toBe('string');
    expect(window.PoseArtAuth.disclosure).toContain('Not production authentication');
    expect(window.PoseArtAuth.disclosure).toContain('Invite-only preview gate');
  });

  it('rejects a malformed credential bundle (fails closed)', () => {
    window.__POSEART_TEST_CREDENTIALS__ = { users: [] };
    expect(window.PoseArtAuth.login('tester', 'secret').ok).toBe(false);
    window.__POSEART_TEST_CREDENTIALS__ = { users: [{ u: '', p: 'x' }] };
    expect(window.PoseArtAuth.login('tester', 'secret').ok).toBe(false);
    window.__POSEART_TEST_CREDENTIALS__ = null;
    expect(window.PoseArtAuth.login('tester', 'secret').ok).toBe(false);
  });
});
