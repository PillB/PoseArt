// audit_harness/propose-patch.js
// Emits a typed pose-level patch proposal for the integrator. Workers call this
// instead of editing poses-data.js directly (isolation rule, protocol §7).
// Usage: node audit_harness/propose-patch.js <poseId> '<json patch spec>'
//   patch spec: { defects:[...], failing_tests:[...], field_changes:{leftHip:50,...},
//                 renderer_changes:"", before_hash:"", confidence:0.8, files_touched:[] }
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const REPO = path.resolve(__dirname, '..');
const RUN_ID = fs.readFileSync(path.join(REPO, 'artifacts', 'pose-audit', 'memory', 'latest-run-id.txt'), 'utf8').trim();
const OUT = path.join(REPO, 'artifacts', 'pose-audit', RUN_ID, 'patch-proposals');
fs.mkdirSync(OUT, { recursive: true });

const poseId = process.argv[2];
const spec = JSON.parse(process.argv[3] || '{}');
if (!poseId) { console.error('usage: propose-patch.js <poseId> <json spec>'); process.exit(2); }

// Load current pose to compute existing config hash
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const pose = sb.POSES_LIBRARY[poseId];
const existingHash = crypto.createHash('sha1').update(JSON.stringify(pose.joints)).digest('hex').slice(0, 12);

const proposal = {
  proposal_id: 'patch-' + poseId + '-' + Date.now(),
  pose_id: poseId,
  category: pose.category,
  worker: spec.worker || 'unknown',
  existing_config_hash: existingHash,
  defects: spec.defects || [],
  failing_tests: spec.failing_tests || [],
  field_changes: spec.field_changes || {},
  renderer_changes: spec.renderer_changes || '',
  before_evidence: spec.before_evidence || `categories/${pose.category}/${poseId}/baseline/`,
  after_evidence: spec.after_evidence || '',
  regression_risk: spec.regression_risk || '',
  confidence: spec.confidence || 0.5,
  files_touched: spec.files_touched || ['js/poses-data.js'],
  rationale: spec.rationale || '',
  created_at: new Date().toISOString()
};

const outFile = path.join(OUT, poseId + '.json');
fs.writeFileSync(outFile, JSON.stringify(proposal, null, 2));
console.log('[propose-patch] wrote ' + outFile);
console.log('[propose-patch] existing_hash=' + existingHash + ' field_changes=' + Object.keys(proposal.field_changes).length);
