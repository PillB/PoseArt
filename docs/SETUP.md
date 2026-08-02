# PoseArt — Setup Guide for Developers

> **Last updated:** 2026-08-02
> **Commit:** 029088a (master)
> **Production:** https://pillb.github.io/PoseArt/

---

## Quick Start (5 minutes)

### Prerequisites

- Python 3.x (for local static server)
- A modern browser (Chrome/Firefox/Safari)
- Git

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/PillB/PoseArt.git
cd PoseArt

# 2. Start local server
python3 -m http.server 8095

# 3. Open in browser
# Go to http://localhost:8095/
```

### Login

Use the Friends & Family test credentials:
- Username: `tester1` through `tester10`
- Password: `PoseArt2026!`

> ⚠️ These are client-side Base64 credentials for F&F testing only. The backend migration plan (docs/backend/) documents how to replace them with Supabase Auth.

---

## Project Structure

```
PoseArt/
├── index.html              # Main SPA (all screens inline)
├── css/
│   └── tokens.css          # Design tokens (colors, fonts, spacing)
├── js/
│   ├── app.js              # Main controller (state, screens, flows)
│   ├── auth.js             # F&F authentication (Base64 — to be replaced)
│   ├── analytics.js        # Analytics stub (PostHog-ready, no-op safe)  ← NEW
│   ├── poses-data.js       # 745 poses + localStorage persistence
│   ├── pose-skeleton-3d.js # 3D skeleton renderer (canvas)
│   ├── camera.js           # Camera + overlay + capture
│   ├── tour-engine.js      # Tour/sequence engine
│   └── pose-animations.js  # Entry animations
├── docs/
│   ├── backend/            # Backend migration docs (22 files)
│   ├── marketing/          # Behavioural science review
│   └── qa/                 # Black-box test specs + reports
├── audit_harness/          # Pose validation harness (geometry sweep, sign fixes)
├── audit/                  # Campaign artifacts (inventory, threat model, reports)
├── scripts/                # Existing validators and audit scripts
└── .github/workflows/      # GitHub Pages deployment
```

---

## Key Architecture Decisions

| Decision | Rationale |
|---|---|
| Vanilla HTML/CSS/JS (no framework) | Simple, fast, no build step. Works on GitHub Pages. |
| SPA with screen toggling | All screens in one HTML file; `showScreen()` toggles visibility |
| localStorage for user data | No backend yet; `persist()`/`restore()` wrappers handle errors |
| Canvas-based 3D skeleton | Procedural rendering from joint angles (no static images) |
| Client-side F&F auth | Temporary; will be replaced by Supabase Auth (docs/backend/) |
| Analytics stub (no-op) | Safe for F&F; ready to connect to PostHog (set POSTHOG_KEY) |

---

## Renderer Sign Conventions (Verified Empirically)

These were discovered to be INVERTED in the original code comments. The source comments have been corrected:

| DOF | Correct convention | Original comment (wrong) |
|---|---|---|
| `spine` | + = forward lean, - = backward arch | Was correct |
| `shoulderFwdL/R` | + = BEHIND, - = FORWARD | Said "+ = forward" |
| `hipAbductL/R` | + = adduction (inward), - = abduction (outward) | Said "+ = outward" |
| `globalTilt` | +90 = PRONE (face-down), -90 = SUPINE (on-back) | Said "+90 = supine" |
| `neck` | + = head tilts RIGHT, - = LEFT | Said "+ = left" |

---

## Content Security Policy

A CSP meta tag is in `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; base-uri 'self'; form-action 'self'">
```

When backend is added, update `connect-src` to include Supabase and Stripe domains.

---

## Analytics

`js/analytics.js` is a PostHog-ready stub. To activate:

1. Create PostHog account (free: 1M events/month)
2. Add before analytics.js script tag:
   ```html
   <script>window.POSTHOG_KEY = 'phc_your_key';</script>
   ```
3. Add consent banner
4. 6 events already instrumented: login, onboarding, session, checkout

Without the key, all calls are no-op (safe for F&F preview).

---

## Deployment

GitHub Pages auto-deploys on push to `master`:

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [master]
```

Production URL: https://pillb.github.io/PoseArt/

---

## Testing

### Pose validation

```bash
# Run geometry sweep (checks all 745 poses for defects)
node audit_harness/geometry-sweep.js

# Run joint validator (config-level checks)
node scripts/joint_validator.js

# Capture per-pose forensic baseline (4 views + geometry)
node audit_harness/forensic-pose.js <poseId>
```

### Black-box QA

See `docs/qa/manual-interaction-specifications.md` for 14 feature test specs.
See `docs/qa/black-box-test-report.md` for test results.

### Current status

- **MAJOR pose defects:** 0 (was 100, all cleared)
- **Console errors:** 0
- **Page errors:** 0
- **Features tested:** 13/15 (camera + tour-session pending headless support)

---

## Backend Migration

Complete documentation in `docs/backend/`:

| Document | Purpose |
|---|---|
| `00-READ-ME-FIRST.md` | Beginner summary + architecture |
| `01-CURRENT-STATE-AUDIT.md` | What PoseArt has today |
| `02-ARCHITECTURE-DECISION.md` | Supabase + Stripe + PostHog + Sentry |
| `03-DATA-MODEL.md` | 33 tables, ERD, retention |
| `04-AUTH-AND-RLS.md` | Auth, roles, RLS policies |
| `05-LOCAL-SETUP.md` | Docker + Supabase CLI + Stripe CLI |
| `06-DOMAIN-HOSTING-DEPLOYMENT.md` | DNS, HTTPS, CORS |
| `07-BILLING-AND-SUBSCRIPTIONS.md` | Stripe Checkout, webhooks |
| `08-MARKETPLACE-AND-PURCHASES.md` | Products, orders, entitlements |
| `09-ANALYTICS-AND-OBSERVABILITY.md` | PostHog + Sentry |
| `10-LOCALSTORAGE-MIGRATION.md` | 12-step gradual migration |
| `11-TESTING-AND-SECURITY-CHECKLIST.md` | 44 tests |
| `12-OPERATIONS-PRIVACY-AND-BACKUPS.md` | Backups, GDPR, incidents |
| `13-TROUBLESHOOTING-AND-FAQ.md` | Common errors + solutions |
| `14-QUICK-START-CHECKLIST.md` | 7-phase checklist |

SQL files: `docs/backend/sql/001-schema.sql`, `002-rls.sql`, `003-seed-development.sql`
