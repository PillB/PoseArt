#!/usr/bin/env node
// ============================================================
// PoseArt Solarize — publication manifest + build ID (Solarize §26)
// ------------------------------------------------------------
// Emits `/publication-manifest.json` and injects a build-id
// `<meta name="poseart-build-id" content="...">` into `index.html`.
//
// No external dependencies. Reads schema + model revisions by
// parsing the canonical source files as text (no module execution,
// so no browser globals are touched).
//
// Usage:
//   node scripts/build-manifest.js
//
// Env:
//   GITHUB_SHA    — fallback commit SHA when `git` is unavailable
//   DEPLOY_URL    — production deployment URL (else placeholder)
// ============================================================
'use strict';

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const MANIFEST_PATH = resolve(REPO_ROOT, 'publication-manifest.json');
const INDEX_PATH = resolve(REPO_ROOT, 'index.html');
const SCHEMA_PATH = resolve(REPO_ROOT, 'js', 'solarize', 'canonical-schema.js');
const RUNTIME_PATH = resolve(REPO_ROOT, 'js', 'solarize', 'pose-model-runtime.js');

// ── Commit SHA ──────────────────────────────────────────────
function getCommitSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execSync('git rev-parse HEAD', { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  } catch (_) {
    return 'unknown';
  }
}

function shortSha(sha) {
  return typeof sha === 'string' && sha.length >= 7 ? sha.slice(0, 7) : sha;
}

// ── Schema revisions (read file as text, regex-extract) ─────
function readSchemaRevision() {
  try {
    const src = readFileSync(SCHEMA_PATH, 'utf8');
    const m = src.match(/export\s+const\s+SCHEMA_REVISION\s*=\s*(\d+)/);
    return m ? Number(m[1]) : null;
  } catch (e) {
    return { error: String(e && e.message || e) };
  }
}

// ── Model registry keys (read file as text, regex-extract) ──
function readModelRegistryKeys() {
  try {
    const src = readFileSync(RUNTIME_PATH, 'utf8');
    // Locate the MODEL_REGISTRY = Object.freeze({ ... }) block.
    const startIdx = src.indexOf('MODEL_REGISTRY');
    if (startIdx === -1) return [];
    const braceStart = src.indexOf('{', startIdx);
    if (braceStart === -1) return [];
    // Walk to the matching closing brace.
    let depth = 0;
    let endIdx = -1;
    for (let i = braceStart; i < src.length; i++) {
      const ch = src[i];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { endIdx = i; break; } }
    }
    if (endIdx === -1) return [];
    const block = src.slice(braceStart, endIdx);
    // Keys are quoted strings followed by ':' at the start of an entry.
    const keys = [];
    const re = /^\s*'([^']+)'\s*:\s*\{/gm;
    let m;
    while ((m = re.exec(block)) !== null) keys.push(m[1]);
    return keys;
  } catch (e) {
    return { error: String(e && e.message || e) };
  }
}

// ── Runtime versions ────────────────────────────────────────
function getBunVersion() {
  try {
    return execSync('bun --version', { encoding: 'utf8' }).trim();
  } catch (_) {
    return null;
  }
}

// ── Test suites ─────────────────────────────────────────────
function readTestSuites() {
  // If a vitest/json summary exists (e.g. written by CI), read it.
  // Otherwise list the suite names that the test:all pipeline runs.
  const summaryPath = resolve(REPO_ROOT, 'test-results', 'vitest-summary.json');
  if (existsSync(summaryPath)) {
    try {
      const s = JSON.parse(readFileSync(summaryPath, 'utf8'));
      if (s && Array.isArray(s.testResults)) {
        return s.testResults.map(t => t.name || t.testPath).filter(Boolean);
      }
    } catch (_) { /* fall through */ }
  }
  return [
    'vitest:tests/schemas/canonical-schema.test.js',
    'vitest:tests/pose-model/engine.test.js',
    'vitest:tests/pose-model/detector-adapters.test.js',
    'vitest:tests/tracking/person-tracker.test.js',
    'vitest:tests/scoring/pose-scorer.test.js',
    'vitest:tests/couples/role-assignment.test.js',
    'vitest:tests/unit/auth.test.js',
    'playwright:tests/e2e/smoke.spec.js',
    'playwright:tests/e2e/publication.spec.js',
  ];
}

// ── Build ID (short SHA + timestamp) ────────────────────────
function makeBuildId(sha, generatedAt) {
  const ts = generatedAt.replace(/[:.]/g, '-').slice(0, 19);
  return `${shortSha(sha)}-${ts}`;
}

// ── Inject build-id meta into index.html ────────────────────
function injectBuildIdIntoIndex(buildId) {
  if (!existsSync(INDEX_PATH)) {
    console.warn('[build-manifest] index.html not found — skipping meta injection.');
    return false;
  }
  let html = readFileSync(INDEX_PATH, 'utf8');
  const metaRe = /<meta\s+name="poseart-build-id"\s+content="([^"]*)"\s*>/;
  if (metaRe.test(html)) {
    html = html.replace(metaRe, `<meta name="poseart-build-id" content="${buildId}">`);
  } else {
    // Insert near the other <meta> tags, after the description meta.
    const descRe = /(<meta\s+name="description"\s+content="[^"]*"\s*>)/;
    if (descRe.test(html)) {
      html = html.replace(descRe, `$1\n<meta name="poseart-build-id" content="${buildId}">`);
    } else {
      // Fallback: insert after <head>
      html = html.replace(/<head>/, `<head>\n<meta name="poseart-build-id" content="${buildId}">`);
    }
  }
  writeFileSync(INDEX_PATH, html);
  return true;
}

// ── Main ────────────────────────────────────────────────────
function main() {
  const sha = getCommitSha();
  const generatedAt = new Date().toISOString();
  const buildId = makeBuildId(sha, generatedAt);
  const deployUrl = process.env.DEPLOY_URL || 'https://pillb.github.io/PoseArt/ (placeholder — set DEPLOY_URL)';

  const manifest = {
    schemaVersion: 1,
    name: 'PoseArt',
    version: '2.6.0-solarize',
    buildId,
    commitSha: sha,
    commitShaShort: shortSha(sha),
    generatedAt,
    deployUrl,
    schema: {
      canonicalSchemaRevision: readSchemaRevision(),
      source: 'js/solarize/canonical-schema.js',
    },
    models: {
      registryKeys: readModelRegistryKeys(),
      source: 'js/solarize/pose-model-runtime.js',
    },
    runtime: {
      node: process.versions.node,
      bun: getBunVersion(),
    },
    testSuites: {
      completed: readTestSuites(),
      note: 'Suite names listed here are run by `bun run test:all` (vitest + playwright). Replace with a results-summary read once CI writes one.',
    },
    gate: {
      disclosure: 'Invite-only preview gate. Not production authentication. Do not store secrets in client code.',
      credentialSource: 'window.__POSEART_TEST_CREDENTIALS__ (set by js/test-creds.local.js, gitignored, generated from CI secrets POSEART_TEST_USERNAME/POSEART_TEST_PASSWORD)',
      sessionOnly: true,
    },
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`[build-manifest] Wrote ${MANIFEST_PATH}`);
  console.log(`[build-manifest] buildId = ${buildId}`);

  const injected = injectBuildIdIntoIndex(buildId);
  if (injected) {
    console.log(`[build-manifest] Injected <meta name="poseart-build-id" content="${buildId}"> into index.html`);
  }
}

main();
