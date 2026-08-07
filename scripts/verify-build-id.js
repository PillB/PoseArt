#!/usr/bin/env node
// ============================================================
// PoseArt Solarize — verify production build ID (Solarize §26)
// ------------------------------------------------------------
// Fetches the deployed site and asserts the
// `<meta name="poseart-build-id" content="...">` tag is present
// and non-empty. Compares it against the locally-generated
// publication-manifest.json buildId if available.
//
// Usage:
//   node scripts/verify-build-id.js <DEPLOY_URL>
//
// Exit codes:
//   0 — verification passed
//   1 — verification failed (meta missing, empty, or mismatch)
//   2 — usage / network error
// ============================================================
'use strict';

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = resolve(__dirname, '..', 'publication-manifest.json');

async function fetchText(url) {
  // Node 20+ has global fetch.
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

function extractMeta(html) {
  const m = html.match(/<meta\s+name=["']poseart-build-id["']\s+content=["']([^"']*)["']\s*>/i);
  return m ? m[1] : null;
}

async function main() {
  const url = process.argv[2] || process.env.DEPLOY_URL;
  if (!url) {
    console.error('Usage: node scripts/verify-build-id.js <DEPLOY_URL>');
    process.exit(2);
  }

  let html;
  try {
    html = await fetchText(url);
  } catch (e) {
    console.error(`[verify-build-id] Failed to fetch ${url}: ${e.message}`);
    process.exit(2);
  }

  const deployedId = extractMeta(html);
  if (!deployedId) {
    console.error('[verify-build-id] FAIL: <meta name="poseart-build-id"> not found on deployed page.');
    process.exit(1);
  }
  if (!deployedId.trim()) {
    console.error('[verify-build-id] FAIL: deployed build-id meta is empty.');
    process.exit(1);
  }

  console.log(`[verify-build-id] Deployed build-id = ${deployedId}`);

  if (existsSync(MANIFEST_PATH)) {
    try {
      const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
      const expected = manifest.buildId;
      if (expected && expected === deployedId) {
        console.log(`[verify-build-id] PASS: deployed build-id matches publication-manifest.json (${expected}).`);
        process.exit(0);
      } else {
        console.error(`[verify-build-id] FAIL: deployed (${deployedId}) ≠ manifest (${expected || 'n/a'}).`);
        process.exit(1);
      }
    } catch (e) {
      console.warn(`[verify-build-id] Could not read manifest for comparison: ${e.message}`);
    }
  } else {
    console.warn('[verify-build-id] publication-manifest.json not found — skipping match check (deployed meta is present and non-empty).');
  }

  console.log('[verify-build-id] PASS: deployed build-id is present and non-empty.');
  process.exit(0);
}

main();
