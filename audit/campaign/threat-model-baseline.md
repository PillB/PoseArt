# Phase 2 — Threat Model (Baseline)

> **State:** Captured before any fixes. No implementation has begun.

---

## Trust Boundary Map

```
┌─────────────────────────────────────────────────────────────────┐
│ BROWSER (untrusted client)                                      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│  │ js/auth  │  │js/app.js │  │js/camera │  │js/poses-data  │   │
│  │ Base64   │  │ State +  │  │ getUser  │  │ localStorage  │   │
│  │ creds    │  │ checkout │  │ Media    │  │ persist/      │   │
│  │          │  │ simulate │  │ canvas   │  │ restore       │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬───────┘   │
│       │              │              │               │           │
│       └──────────────┴──────────────┴───────────────┘           │
│                      sessionStorage                              │
│                      localStorage                               │
│                                                                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    No backend (static site)
                    No server-side validation
                    No API (all client-side)
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│ GITHUB PAGES (static hosting)                                   │
│                                                                 │
│  Serves: index.html, js/, css/, gifs/, docs/                    │
│  No server-side processing                                      │
│  HTTPS enforced by GitHub                                       │
│  No CORS headers (same-origin)                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Attack Surface Inventory

| # | Surface | Exposure | Current Control | Risk |
|---|---|---|---|---|
| AS-01 | Base64 credentials in js/auth.js | Public (anyone can read) | None | P1 — anyone can login |
| AS-02 | localStorage ownedPacks | Client-writable | None | P1 — free purchase bypass |
| AS-03 | localStorage marketplacePacks | Client-writable | None | P2 — price manipulation |
| AS-04 | Simulated checkout (setTimeout) | Client-side only | None | P1 — no real payment verification |
| AS-05 | Camera getUserMedia | Browser permission prompt | Browser gate | P3 — photos stay local (good) |
| AS-06 | Gallery Base64 photos in localStorage | Same-origin | None | P3 — no sync, no exfil |
| AS-07 | Custom poses (editorCustomPoses) | Client-writable | None | P3 — no cross-user impact (local only) |
| AS-08 | Tour data (tours) | Client-writable | None | P3 — no cross-user impact |
| AS-09 | No CSP header | GitHub Pages default | None | P2 — DOM XSS possible |
| AS-10 | No rate limiting | No backend | N/A | P4 — no backend to rate-limit |
| AS-11 | sessionStorage auth session | Client-writable | None | P1 — session forgery |
| AS-12 | External font loading | fonts.googleapis.com | HTTPS | P4 — privacy (font fingerprinting) |

---

## Security Findings (Baseline)

### SEC-01: Hardcoded credentials in public JavaScript

```json
{
  "issue_id": "SEC-01",
  "target": "js/auth.js",
  "severity": "P1",
  "confidence": "high",
  "precondition": "Access to deployed site (public)",
  "safe_reproduction_summary": "View source of https://pillb.github.io/PoseArt/js/auth.js, decode Base64 string 'UG9zZUFydDIwMjYh' to get password 'PoseArt2026!'",
  "impact": "Anyone can login with tester1-10 / PoseArt2026!",
  "root_cause": "Client-side auth with obfuscated (not encrypted) credentials",
  "evidence": ["js/auth.js line 8: encodedPassword = 'UG9zZUFydDIwMjYh'"],
  "recommended_fix": "Migrate to Supabase Auth (see docs/backend/04-AUTH-AND-RLS.md)",
  "regression_test": "grep for Base64 patterns in js/*.js — must return 0 results after migration",
  "status": "open"
}
```

### SEC-02: Client-side purchase bypass

```json
{
  "issue_id": "SEC-02",
  "target": "localStorage poseart_ownedPacks",
  "severity": "P1",
  "confidence": "high",
  "precondition": "Browser DevTools access",
  "safe_reproduction_summary": "Open DevTools console: localStorage.setItem('poseart_ownedPacks', '[\"mp-boudoir-classic\"]') — pack appears as owned without payment",
  "impact": "Any user can acquire paid packs for free",
  "root_cause": "Ownership tracked client-side with no server verification",
  "evidence": ["js/app.js:2389 purchasePack() adds to _ownedPacks without payment verification"],
  "recommended_fix": "Migrate to server-side entitlements (see docs/backend/08-MARKETPLACE-AND-PURCHASES.md)",
  "regression_test": "Modify localStorage ownedPacks — app should reject and re-fetch from server",
  "status": "open"
}
```

### SEC-03: Session forgery

```json
{
  "issue_id": "SEC-03",
  "target": "sessionStorage poseart_auth_session",
  "severity": "P1",
  "confidence": "high",
  "precondition": "Browser DevTools access",
  "safe_reproduction_summary": "Open DevTools console: sessionStorage.setItem('poseart_auth_session', JSON.stringify({version:1,user:'tester1',authenticatedAt:Date.now()})) — instant login without credentials",
  "impact": "Authentication bypass without knowing any password",
  "root_cause": "Client-side session with no server validation",
  "evidence": ["js/auth.js:31 readSession() trusts sessionStorage without verification"],
  "recommended_fix": "Migrate to Supabase Auth (JWT-based, server-validated)",
  "regression_test": "Forge sessionStorage — app should reject invalid JWT",
  "status": "open"
}
```

### SEC-04: No Content Security Policy

```json
{
  "issue_id": "SEC-04",
  "target": "GitHub Pages deployment",
  "severity": "P2",
  "confidence": "high",
  "precondition": "XSS payload injection (if any injection point exists)",
  "safe_reproduction_summary": "Check response headers: no CSP header present",
  "impact": "If DOM XSS is found, no CSP prevents execution",
  "root_cause": "GitHub Pages does not set CSP by default; no <meta> CSP in index.html",
  "evidence": ["curl -sI https://pillb.github.io/PoseArt/ — no content-security-policy header"],
  "recommended_fix": "Add <meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; ...\"> to index.html",
  "regression_test": "Check response headers include CSP",
  "status": "open"
}
```

### SEC-05: Simulated checkout (no real payment)

```json
{
  "issue_id": "SEC-05",
  "target": "js/app.js purchasePack()",
  "severity": "P1",
  "confidence": "high",
  "precondition": "Click 'Purchase' on any paid pack",
  "safe_reproduction_summary": "Click purchase on mp-boudoir-classic ($4.99) — setTimeout 800ms then adds to ownedPacks. No Stripe, no payment.",
  "impact": "All purchases are free; no revenue possible",
  "root_cause": "Mock checkout with setTimeout, no Stripe integration",
  "evidence": ["js/app.js:2401 setTimeout(() => { _ownedPacks.push(packId); ... }, 800)"],
  "recommended_fix": "Implement Stripe Checkout via Supabase Edge Function (see docs/backend/07-BILLING-AND-SUBSCRIPTIONS.md)",
  "regression_test": "Purchase attempt must create Stripe Checkout Session, not setTimeout",
  "status": "open"
}
```

---

## Known Limitations of Existing Smoke Tests

| Test | What it proves | What it doesn't prove |
|---|---|---|
| `scripts/joint_validator.js` | Config-level sign/magnitude checks | Doesn't render; doesn't verify visual correctness |
| `scripts/smoke_test_skeleton.js` | Canvas doesn't throw on render | Doesn't verify pose anatomy or visual quality |
| `scripts/smoke_test_avatar.js` | Avatar canvas renders without error | Doesn't verify avatar distinctiveness or polish |
| `audit_harness/geometry-sweep.js` | Derived anatomy from FK coordinates | Doesn't capture screenshots or verify visual rendering |
| `audit_harness/forensic-pose.js` | 4-view screenshot capture + geometry | Doesn't score anatomy or compare to description |

---

## Phase 0 Gate Check

| Criterion | Status |
|---|---|
| Current source and deployment identified | ✅ PASS |
| Prior evidence classified | ✅ PASS (6 REVALIDATED, 3 UNVERIFIED) |
| Scope and safety boundaries recorded | ✅ PASS |
| No critical input silently missing | ✅ PASS |
| Clean working branch created | ✅ PASS (agent/solarize-campaign) |
| No production code modified | ✅ PASS |

**Phase 0 Gate: PASSED. Proceed to Phase 1.**
