// Run the repository's existing geometry audit without touching historical runs.
// This wrapper supplies a unique run id only for the audit's latest-run-id lookup.
const fs = require('fs');
const path = require('path');

const runId = process.env.POSEART_AUDIT_RUN_ID || 'run-2026-11-05-pose-atlas';
if (!/^run-[a-zA-Z0-9-]+$/.test(runId)) throw new Error('Unsafe run id');
const directory = path.resolve(__dirname, '..', 'artifacts', 'pose-audit', runId);
if (fs.existsSync(directory)) throw new Error(`Run already exists: ${runId}`);

const realRead = fs.readFileSync;
fs.readFileSync = function(file, ...args) {
  if (typeof file === 'string' && file.endsWith('/artifacts/pose-audit/memory/latest-run-id.txt')) return runId;
  return realRead.call(this, file, ...args);
};
try {
  require('../audit_harness/geometry-sweep.js');
} finally {
  fs.readFileSync = realRead;
}
