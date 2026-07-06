# v3.1 pose corrections (2026-07-05)

Applied `scripts/apply_principles_v4_poses.js` — targets 36 poses flagged by 7-rule programmatic audit + visual review.

## Rules addressed
- **R1 — asymmetric arm splay** (24 poses): one shoulder < -110 while other > -35 (T-pose splay). Rebalanced to natural hand-to-head / hand-to-face envelopes.
- **R5 — knee hyper-flex** (3 poses): both knees > 135 in seated. Clamped to 128.
- **R6 — seated but tilted** (5 poses): |globalTilt| > 50 while category is seated. Clamped to ±45.
- **R7 — extreme twist** (8 poses): |globalTwist| > 45 in seated/boudoir. Clamped to ±38-40.

Some poses had multiple rule hits and received combined fixes.

## Backup
`.backups/poses-data.js.bak-v4-<stamp>.js` (gitignored).

## Verification
Re-audit shows 0 remaining rule violations across all 36 poses. Fresh 16-category renders at `qa_screenshots/review_v4/`.
