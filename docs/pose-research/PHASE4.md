# Phase 4 — independent photo search and semantic adjudication (research only)
Date: 2026-11-06. Baseline production commit `5068f7ad23c0dd0c5afa01a812234a88214d9852`. This research branch must **not** silently change `js/poses-data.js`, source geometry or production images.

## What the new sweep actually did
- Reconciled **745 live poses, 16 categories, all titled/described**, carrying forward 2,980 projections derived only from the **existing joint rig** (not independent photo validation).
- Identified **27 sampled title/instruction semantic contradictions** across kneeling, reclining, editorial, fine-art, fashion and vertical transition categories, verified against catalog instructions. Some are adjacent-import shifts. See issue #28 for Fine Art. Treat these as an audit sample, not a guarantee the other 718 records are correct.
- Visually screened **37 SketchKit photo URLs**, including two alternate URLs of the **same** Vitaly Gariev photograph (`MBahMmQhkCs`), leaving **36 unique photo IDs** and 22 pose–photo review associations, including five explicit rejections. Records are in `phase4-curated-photo-links.json`; `scripts/test-phase4-photo-links.cjs` validates provenance fields, rejection counts, the duplicate, source IDs, and zero approvals.
- SketchKit is one image aggregator, not 36 independent photo shoots. Creators are attributed to their linked Unsplash originals. Individual photo licensing, creator/session independence, rights, exact view and hand/prop/contact geometry are **NOT** certified.
- **10 previously zero-lead PoseArt IDs now have at least one plausible or uncertain screened lead**: `power-stance`, `cross-ankle-sit`, `knees-apart-forward`, `floor-asymmetric`, `bench-sit-side`, `waltz-hold`, `slow-dance`, `lead-dance-hand`, `fashion-runway-arms-swing-stride`, and `p15-chair-s2-forward-elbows-knees`. One of these is flagged title/description conflict. Disposition is **candidate only**, not pose certification.
- Total catalog IDs with >=1 **raw photo lead** increased **179 -> 189**, with **556 IDs still having none**. Zero independently approved photo references, hence the 3-per-pose minimum approval shortfall stays at **2,235**.
- Generated **five distinct search query types for each of all 745 poses** (3,725 query strings: exact pose name, anatomy from written instruction, hand/foot supports, image-source guide search, and visual/style/prop disambiguation). Each also has manually actionable Google Images/Bing Images URLs. These are **generated search plans**, not 3,725 actual searches or photographs.

## Per-image decision contract
Every source entry has exact image URL, source gallery URL, Unsplash original URL and original photo ID, credited creator, explicit rights/session review flags, named PoseArt ID(s), and candidate/reject status. Reviewer decisions distinguish `promising_partial`, `uncertain`, `rejected_mismatch`, and `title_description_conflict`. 15 associations were promising partials, one uncertain, one title/description conflict, five rejected. All have `approved_photo_count = 0`; a photo must not be treated as a fully matching pose or approved for redistributed use until rights and geometry are independently checked.

## Additional photo pools requiring rights checks
- SketchKit gallery: https://www.sketchkit.art/pose-reference ; the three sampled sections were /sitting-pose-reference, /standing-pose-reference and /couple-pose-reference. Also available: male and female sections not visually sampled in this sweep.
- DataTorch COCO person keypoints: https://datatorch.io/resources/coco-person-keypoints-dataset ; collection reportedly contains 605 images, 1,609 labeled people and 17 keypoints. Per-image license varies; labels alone do not establish source use rights, visual fit or photoshoot independence.
- MPII Human Pose: https://www.mpi-inf.mpg.de/departments/computer-vision-and-machine-learning/software-and-datasets/mpii-human-pose-dataset ; do not incorporate training images into commercial production without explicit licensing.
- PoseMaker 3D studies: https://posemaker.org/poses ; synthetic renders are idea/angle references, **not** independent live-human photos.

## Artwork sources — inspiration only
- Rodin, *The Thinker*: https://www.nga.gov/artworks/1005-thinker-le-penseur
- Degas, *Arabesque Devant*: https://www.metmuseum.org/art/collection/search/196454
- Diego Velázquez, *The Rokeby Venus*: https://www.nationalgallery.org.uk/paintings/diego-velazquez-the-toilet-of-venus-the-rokeby-venus
- Botticelli, *Birth of Venus*: https://www.uffizi.it/en/artworks/birth-of-venus
- Sargent, *Madame X*: https://www.metmuseum.org/art/collection/search/12127
- Degas, *Grande Arabesque*: https://www.nga.gov/artworks/110301-grande-arabesque-third-time-first-arabesque-penchee
- Frishmuth, *The Vine*: https://www.metmuseum.org/art/collection/search/487583

Photographs of sculptures, different scans of the same painting, AI-generated pose projections and existing animated GIFs **do not meet** the live-person independent-photograph acceptance gate. A useful artwork may identify a needed joint/prop/contact constraint but not prove it.

## Four additional pose proposals — **not live**
The previous 14 research-only pose proposals remain unpromoted. Four more are documented in the separately delivered private phase-four additions ledger (total **18 proposals**, 745 live poses unchanged):
- `research-couple-seated-foot-bridge`: **Seated Foot-to-Foot Partner Bridge** — two seated adults face one another from stable seats, feet extending toward the center with optional safe contact, separate hand/seat support and opposite gazes.
- `research-couple-supported-dance-dip`: **Supported Dance Dip** — a consenting dance pair performs a shallow dip with load-bearing partner support and floor-stable feet; all contacts and balance must be tested.
- `research-seated-stair-offset-feet`: **Stair-Step Offset-Foot Portrait** — subject sits on a wide stable step with feet on two different levels, one knee slightly opened and hands resting naturally near the lap.
- `research-fashion-bag-center-anchor`: **Centered Bag-Anchored Wide Stance** — a standing fashion portrait with grounded wide stance, bag deliberately held at center and visible garment/hand contacts.

Each requires duplicate detection, original photo rights, qualified reviewer and independent photo evidence before adding to runtime. No new pose ID or geometry was published.

## Reproducible private deliverables
The generated Phase 4 package (outside Git to respect uploaded guide-image rights) includes:
- **377-page** illustrated dossier with full title and description for every pose, four rig views each, and the original guide photo for numbered flow poses where available.
- Searchable 745-card HTML atlas. Its external SketchKit photos need network connectivity; the original guide images stay private. Client-side interaction tests cover search, pagination, category, 556 zero leads, 10 new leads and 27 semantic conflicts.
- 745-row triage CSV; 37-source review ledger CSV/JSON; JSON of 3,725 queries; artwork source inventory; four research-only new pose descriptions.
- No remote image bytes from SketchKit or publisher book pages are committed to this public repository.

## Release and review gates
**Do not merge in new unvalidated geometry.** A production release requires three to four genuinely independent and matching live-person photographic references per pose, human expert approval, photo/author rights checks, safety/supports and scene-level partner/accessibility verification, comprehensive PR review, CI and production smoke. Until those criteria are met, keep PR #27 research-only/draft, even if research CI passes. Cross-index issues #28, #29 and #30. A source-only CI pass is not equivalent to approved visual geometry.