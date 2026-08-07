// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const authSrc = readFileSync(resolve(__dirname, '../../js/auth.js'), 'utf8');

describe('PoseArt auth gate — preview accounts restored', () => {
  it('auth.js contains the preview test accounts (base64 obfuscated)', () => {
    // The owner authorized keeping these for testing. They were never
    // supposed to be removed.
    expect(authSrc).toContain('UG9zZUFydDIwMjYh'); // encoded shared password
    expect(authSrc).toContain('dGVzdGVyMQ=='); // tester1
    expect(authSrc).toContain('dGVzdGVyMTA='); // tester10
  });

  it('auth.js exposes login, logout, isLoggedIn, getCurrentUser', () => {
    expect(authSrc).toContain('function login');
    expect(authSrc).toContain('function logout');
    expect(authSrc).toContain('function isLoggedIn');
    expect(authSrc).toContain('function getCurrentUser');
    expect(authSrc).toContain('PoseArtAuth');
  });

  it('auth.js uses sessionStorage (session-only, not persisted)', () => {
    expect(authSrc).toContain('sessionStorage');
    expect(authSrc).not.toContain('localStorage');
  });

  it('auth.js decodes base64 credentials via atob', () => {
    expect(authSrc).toContain('atob');
  });

  it('auth.js rejects empty username or password', () => {
    expect(authSrc).toMatch(/Enter both username and password/);
  });

  it('auth.js rejects unknown credentials', () => {
    expect(authSrc).toMatch(/Username or password is incorrect/);
  });

  it('the disclosure text is honest about the gate being a convenience', () => {
    // The original auth.js header discloses this is not production security.
    expect(authSrc).toMatch(/not production-grade security|deliberate obfuscation/i);
  });
});
