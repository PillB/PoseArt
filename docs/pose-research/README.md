# PoseArt pose research and visual atlas

Source commit: `5068f7ad23c0dd0c5afa01a812234a88214d9852` (`master`, 2026-08-09). Research snapshot: 2026-11-05.

## Canonical counts

`js/poses-data.js` defines **745 current poses in 16 categories**. This research bundle independently extracts every ID, title, instruction, coaching tip, joint configuration and category. The current tree has **780 GIFs**: all 745 pose IDs have exact GIF filename matches when Git paths are decoded with `core.quotepath=false`, and 35 GIFs are additional assets. The tracked repository includes 267 Markdown, three DOCX, and zero PDF source files.

The research scripts generate the following local files. The outputs are provided separately as downloadable deliverables and can be rebuilt from the scripts in this branch:

- `deliverables/poseart-research-report.pdf` - a 24-page research report and 16 representative four-view diagrams (generated output).
- `deliverables/poseart-visual-atlas.html` - searchable, responsive, self-contained atlas of **all 745 titles, descriptions, tips and four generated vector views per pose**; external research links require internet (generated output).
- `deliverables/poseart-inventory.csv` - one auditable row per current pose.
- `deliverables/poseart-manifest.json` - full data, source paths, 3D coordinates, heuristic flags, research sources, 270 document paths and eight candidate additions (generated output).

**Evidence boundary:** These 2,980 generated diagrams are deterministic projections of the existing PoseSkeleton3D rig, not independent photo references. The GIFs generally derive from the same rig. The four photo-source *discovery search links* on each atlas card are suggestions, not four vetted photos. `independentReferencePhotosVerified = 0` is deliberately explicit. Do not represent per-pose photographic research as complete.

## Current quality findings

1. Current geometry sweep: 440 / 745 poses produce at least one heuristic anomaly/plausibility warning; no current major semantic warnings. These are screening flags, not ground truth. The historical August baseline of 513 flagged entries included 115 major semantic warnings, and is not an accurate description of current master.
2. Six exact joint-angle signature groups cover 28 current pose records. The largest group is 17 couple poses that share legacy one-person joint geometry. See the richer, review-gated scene/dossier architecture in `js/solarize/` before attempting a fix.
3. Three pairs of normalized titles collide. The manifest enumerates them; naming duplication is not necessarily semantic equivalence.
4. The older `docs/POSEART_README.md` says 761 poses. Current JS data and the newer audited inventory agree on 745.
5. The geometry heuristic incorrectly detects a kneeling claim in three standing fine-art poses. These are regex false positives, not confirmed anatomical faults.

## Proposed additions

Eight researched pose concepts are documented in the manifest, interactive atlas and PDF. They are **not** inserted in `POSES_LIBRARY` and do not change the live 745 count:

| Candidate ID | Category | Title |
|---|---|---|
| `research-couple-seated-counterturn` | couple | Seated Counterturn Pair |
| `research-accessible-wheel-rim-portrait` | accessible | Wheel-Rim Three-Quarter Portrait |
| `research-dynamic-coat-catch-turn` | dynamic | Coat-Catch Mid-Turn |
| `research-lean-seat-table-arc` | lean-seat | Tabletop Elbow Arc |
| `research-editorial-open-jacket-axis` | editorial | Open-Jacket Diagonal Axis |
| `research-fineart-orans-soft` | fine-art | Open Palms Sculpture Study |
| `research-lowhigh-assisted-chair-rise` | low-to-high | Supported Chair Rise Sequence |
| `research-highlow-controlled-side-sit` | high-to-low | Controlled Side-Sit Descent |

Each includes a full instruction/description, novelty rationale, categorical references and implementation requirements. They remain at `proposed_for_validation` level. This preserves the project's own Solarize governance: independent photographs, contact/prop geometry, held-out checks, a real detector pass where appropriate, and human sign-off before activation.

## Reproduction and tests

From repository root with Node installed:

```sh
node scripts/run-legacy-research.cjs run-atlas-geometry.js
node scripts/run-legacy-research.cjs build-pose-atlas.js
node scripts/run-legacy-research.cjs test-pose-atlas.js
python3 scripts/build-pose-report.py
```

`run-atlas-geometry.js` (launched via the isolated CommonJS compatibility runner because the root package uses ES modules) defaults to a one-time research run ID and refuses to overwrite its output. To re-run it, set the **same new** `POSEART_AUDIT_RUN_ID` for the geometry and atlas commands; the atlas reads the named sweep. The PDF needs ReportLab and DejaVu font files. The atlas is fully self-contained for offline schematic viewing, but linked GIFs and external search pages need internet.

The atlas has been tested for JSON integrity, 745 records, JS syntax, search, category filters, pagination, and 64 schematic SVGs for its initial 16-card page. The 24-page PDF was rendered and visually inspected. Physical iPhone/Android/browser testing and independent photo matching are still open release gates; no live deployment is claimed.

## Independent-photo acceptance gate

For each pose, collect three or four **different** external/owner-produced photographic references. Capture canonical original URL, creator, title, rights/license, date, pose relevance, keypoints, hand/prop contacts, camera view, and explicit accept/reject rationale. Eliminate duplicates and mirror reposts. Keep fitting and held-out references separate; involve a qualified human reviewer. Never commit third-party photos without redistribution permission. For couple scenes, verify both people; for accessible poses, prioritize the subject's own comfort and functional support.

Core research sources are linked and labeled `R1`–`R14` in the manifest. The most applicable are Adobe on sitting and hands, Adobe on couples, Nikon and Canon portrait technique, PPA boudoir guidance, PPA disability-inclusive sessions, Permobil wheelchair photography guidance, the Metropolitan Museum's sculptures, and Google MediaPipe's landmark documentation. These are category-level foundations, not evidence for individual joint targets.

## Phase 3 addendum (2026-11-06)

See [PHASE3.md](PHASE3.md) for the privately supplied 24-PDF / 353-page guide corpus, 66 numbered photo-page links (two rejected), museum artwork references, 14 *unpromoted* proposals (the original eight plus six new), 179 pose IDs with at least one image lead, 566 with none, and hard zero-photo-approval release criteria. GitHub Actions research CI rebuilds this complete atlas using `run-legacy-research.cjs`; neither screenshots nor guide photographs are placed in the public Git repository. Historical source counts above describe the **master snapshot**; the research PR adds Markdown documentation and the reproducibility test compares actual Git-tree counts.
