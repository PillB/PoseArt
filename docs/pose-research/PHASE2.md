# Phase 2 · Independent photographic reference evidence (research only)

Date: 2026-11-05. Source: `PillB/PoseArt` master at `5068f7ad23c0dd0c5afa01a812234a88214d9852`.

This phase augments the [745-pose four-view atlas](README.md). It does **not** change `js/poses-data.js`, promote new geometry, declare a source image license cleared, or close expert review. Every pose retains a title and instructions, and the eight proposed additions remain separate from the live 745.

## Measured checkpoint

| Denominator | Count |
| --- | ---: |
| Current pose IDs searched | **745/745** |
| Categories | **16** |
| Original rig-based views | **2,980** |
| Wikimedia Commons metadata-qualified image associations | **274** |
| Unique Commons file IDs | **231** |
| Pose IDs with ≥1 image candidate | **116** |
| Pose IDs with ≥3 metadata candidates | **48** |
| Poses visually screened side by side | **10** |
| Candidate photos visually screened | **35** |
| Strong but unapproved photographic analogues | **2** |
| Photos approved for geometry | **0** |
| Pose IDs with no image candidates | **629** |
| Per-ID shortage to 3 candidate links, pre-validation | **2,002** |
| Deficit to 3 *approved* photos per ID | **2,235** |

Do not treat “274 candidates” as 274 verified references. There are 43 cross-pose reuse associations; imagery often portrays the wrong subject, non-photographic art, or only a coarse gesture.

## Visual diagnostic cases

- **S-Curve Stand**: two BlackBerry Curve launch-event results; keyword collision, rejected.
- **Wall Lean**: one partly aligned wall-leaning person; wall contact/ankle crossing and shoulder alignment not verified.
- **Hand in Pocket**: four public-domain archive portraits; one strong photographic analogue, remaining partial.
- **Profile Stand**: three photographic images plus one painting; one strong analogue, some partial.
- **Prayer Kneeling**: the text directs a forward-reach, not the prayer gestures retrieved from the archive; all reject for exact joints.
- **Classic Arabesque Line**: three CC0 bronze-sculpture images show arabesque balances, while PoseArt instructions call for a crossed-foot turn; related art, not live reference photos.
- **Contrapposto**: four results depict a building; rejected.
- **Chin Rest**: Oscar Wilde's chin-on-hand portrait is a partial hand gesture; the rig itself appears far more reclined than the written seated posture.
- **Dance Arms Up**: group dance photography does not establish the subject's specified symmetric arm stance; rejected.
- **Walk Together**: four results are a riverwalk landscape. The existing coupled pose card renders a single body; rejected.

The explicit item-level decisions and root-cause text are in `photo-review-decisions.json`. A `strong_photo_analogue` status is **not** an exact geometry validation, license clearance, or a production approval. All sources remain in `pending` rights state.

## Run from repository root

Dependencies: Python 3, aiohttp, Pillow, ReportLab, DejaVu fonts, Node; the earlier Phase 1 atlas/manifest scripts, git and geometry audit must work first.

```sh
node scripts/run-atlas-geometry.js
node scripts/build-pose-atlas.js

python3 scripts/collect_pose_photo_candidates.py --limit 745 --concurrency 4
python3 scripts/build_phase2_evidence.py

python3 scripts/render_candidate_contact_sheet.py --ids scurve-stand,wall-lean,fineart-classic-arabesque --label pilot1
python3 scripts/render_candidate_contact_sheet.py --ids hand-in-pocket,profile-stand,prayer-kneeling,fineart-classic-arabesque --label pilot2
python3 scripts/render_candidate_contact_sheet.py --ids chin-rest,hand-in-hand-walk,contrapposto,dance-arms-up --label pilot3

python3 scripts/build_phase2_pdf.py
node scripts/test_phase2_evidence.js
```

Run the Phase 1 geometry script only with a **fresh**, unique `POSEART_AUDIT_RUN_ID`; it refuses existing runs. Use that same run ID for the atlas generator. The Commons API metadata and source URLs can change between retrieval dates; counts here describe the checkpoint of 2026-11-05 and are not promised for future live reruns. `--resume` continues a checkpoint; `--retry-failures` retries failed lookups.

Generated (not committed) deliverables:

- `deliverables/phase2-photo-evidence/poseart-photo-candidates.json`: full 745-row unadjudicated source candidate list.
- `poseart-phase2-evidence-atlas.html`: complete 745 pose cards, each title, instructions, four SVG views and 0–4 source-linked candidate thumbnails.
- `745-pose-coverage-ledger.csv`: 745 rows with counts and per-pose shortfall.
- `candidate-photo-adjudication-ledger.csv`: 274 associations, exact Commons pages, credits, recorded license, individual thumbnail-screen outcome.
- `source-reuse-and-gates.json`: unique file audit and release gates.
- `eight-unpromoted-pose-proposals.csv`: distinct additions with titles and descriptions, status “not live”.
- `poseart-phase2-photographic-adjudication.pdf`: annotated side-by-side photographic QA, sample diagrams and credits.

The atlas is usable without external images for local geometry inspection; the embedded Commons thumbnails and source links need internet. Rendering every candidate thumbnail at once is unnecessary; the UI paginates to 16 pose cards.

## Adjudication gate per candidate

1. Confirm image depicts a real adult human with the *specific* intended joint and support arrangement.
2. Check photographer/session independence, original Commons or source page and duplication (perceptual hash plus subject/session grouping when acquired).
3. Inspect rights, attribution, privacy and personality concerns independently; follow the exact license.
4. Compare photo, title, written description, multi-angle rig render and accessories/partners. Record deviations/occluded landmarks.
5. Require signed human domain review. Only a separate tested non-draft production change may update the pose geometry.

**Important:** The screen pilot demonstrates retrieval flaws; a model cannot confer independent professional or legal certification. Photo rights and functional/anatomical validity remain open blockers.

## Research

- [Commons: Reusing content outside Wikimedia](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- [Library of Congress free to use and reuse](https://www.loc.gov/free-to-use/)
- [Adobe sitting and hand posing](https://www.adobe.com/creativecloud/photography/discover/sitting-poses-and-hand-poses.html)
- [Adobe couples posing](https://www.adobe.com/creativecloud/photography/discover/engagement-photo-poses.html)
- [PPA thoughtful disability portrait sessions](https://www.ppa.com/ppmag/articles/thoughtful-portrait-sessions)
- [PPA posing tricks](https://www.ppa.com/ppmag/articles/posing-tricks)

Photos in the Commons results are third-party works; link-based research use is not a blanket republication license. The PDF's selected thumbnail credit appendix records original source pages and authors, subject to final legal confirmation.
