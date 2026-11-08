# Phase 6 — ontology-driven Commons photo discovery (2026-11-08)

This is **research only**. Pin catalog to master commit `5068f7ad23c0dd0c5afa01a812234a88214d9852`. The existing 745 IDs, 16 categories, title/instruction fields, 2,980 rig-derived views, and production geometry remain untouched. The user-provided book/PDF photos remain private and absent from this Git history.

## Counterfactual validation of coverage claims

| Measure | After Phase 5 | After Phase 6 |
|:--|--:|--:|
| Existing live poses | 745 | 745 |
| Unique IDs with at least one **raw lead** | 196 | **202** |
| IDs with no raw photographic lead | 549 | **543** |
| Expert/rights-approved independent photographs | 0 | **0** |
| Additional partial-visual pose/image associations screened | — | **14** |
| Negative examples rejected | — | **10** |
| Metadata-only candidates requiring actual image inspection | — | **2** |
| New research-only pose concepts | 20 | 20 |
| Minimum approved images needed (3 x 745) | 2,235 | **2,235** |

No new geometry is justified by 14 partial image associations. There are 26 unique source entries in the Phase 6 research ledger; every image has a named pose ID, creator/rights claim, original Commons File page and explicit adjudication notes.

## Search root cause and improved approach

Prior naive exact-title text search suffered from (1) product/name collisions, (2) shifted pose titles versus instructions (issues #28, #31), (3) non-photographic search results including drawings and sculptures, (4) photographic wrong geometry, and (5) copyright restrictions on popular photo libraries. Phase 6 maps written anatomy to formal pose vocabulary and filters by explicit photo-relevant categories:

- `cobra-lite` → **Bhujangasana**, https://commons.wikimedia.org/wiki/Category:Bhujangasana : four independent creator-attributed images support prone/palm/chest-raised features, but elbows and arches are stronger than the "gentle bent elbow" cue.
- `sphinx-pose` → **Salamba Bhujangasana**, https://commons.wikimedia.org/wiki/Category:Salamba_Bhujangasana : two partial forearm-supported source images; palm-supported *Ardha Bhujangasana* is explicitly rejected.
- `seated-v-stretch` → **Upavistha Konasana**, https://commons.wikimedia.org/wiki/Category:Upavistha_Konasana : two photographed wide-V seated bends, though torso depth/contact vary. Top-down legs-together stretching photo rejected.
- `floor-stretch-legs` → **Paschimottanasana**, https://commons.wikimedia.org/wiki/Category:Paschimottanasana : three partial legs-extended folds, often rounded spine instead of requested long spine; near-soles crop rejected.
- `warrior-lunge` → **Virabhadrasana I**, https://commons.wikimedia.org/wiki/Category:Virabhadrasana_I : one silhouette with arm/lunge evidence, lower limb geometry partly occluded; crowded group photo rejected.
- `kneeling-lean-hands-floor` → **Balasana**, https://commons.wikimedia.org/wiki/Category:Bālāsana : two photos with extended arms; child pose variants with arms down/back explicitly rejected.

A further *chair-wave* result was holding a medal/bouquet rather than making an open-palm wave, and a diagram SVG was rejected as non-photographic. `meditation-palms` palms-down photography was rejected as contradicting the palms-up instruction.

These examples demonstrate that a correct category name still fails to imply a correct pose. Any candidate marked `partial_visual` is an **unapproved** comparison. The few accepted categories are not proof that a 3-to-4-image matching requirement has been satisfied.

## Source and legal acceptance gates

Per-file source links and license hints in `phase6-commons-adjudication.json`. Attribution is not automatic authorization for reuse inside a public app or CV evaluation dataset. Explicit fields for human/person/model release, redistribution permission, independent shoot confirmation, and expert geometry sign-off are all **false**. See also issues #30, #32, #33.

The search is a copyright-conscious, attribution-forward research sweep. Published source photos remain at Commons. No commercial posing-book photo and no Commons photographic bytes are published in Git. Photos of statues, drawings, prior renderings or duplicate copies are excluded from the "independent live person" threshold. Verify CC BY-SA derivative/attribution obligations and the absence of an underlying personality/publicity limitation before any use.

## New pose / artwork inventory

The previous **20 research-only new pose proposals** remain documented; this phase does not add duplicates merely to inflate the count. All 745 live poses still have names and descriptions. Rodin, Degas, Botticelli and other artwork figures remain *separate creative inspiration records*, not evidence of live-human body geometry.

## Generated private deliverables

Produced outside Git (not part of this public PR) from the baseline 745 pose manifest and Phase 5 source inventory:
- `PoseArt_Phase6_745_Poses_Research_Atlas.pdf`: **746 pages**, including one overview and **one dedicated page for each pose**, with title, description, four annotated **existing-rig projections**, and new source/copyright/rejection links.
- `PoseArt_Phase6_All745_Interactive_Photo_Atlas.html`: 745 searchable cards, complete descriptions, four current-rig projections per pose, and source-attributed external Commons thumbnail previews for 26 reviewed source associations, loaded via the official image CDN at viewing time.
- `PoseArt_Phase6_Photo_Source_Adjudication_Summary.pdf`: focused six-pose source/rejection study.
- `phase6-745-pose-evidence-inventory.csv`: all existing IDs, existing/new raw leads, source statuses.
- `phase6-reviewed-source-ledger.csv` and `.json`: 26 source decisions, 14 partials, 10 explicit rejections, 2 metadata-only.
- `phase6-745-ontology-search-plan.json`: four search *templates* per pose; **the presence of 2,980 generated query strings does not mean 2,980 search engine results were actually fetched**.
- `build_phase6.py`: private reproducibility script. Requires the prior source manifest and Phase5 inventory as inputs.

## CI and deployment verdict

`scripts/test-phase6-photo-evidence.cjs` enforces catalog reconciliation, source counts, negative controls, independent file creators in selected partial photo sets, and zero rights/geometry approvals. The existing Phase3–5 tests and full 745-pose atlas rebuild continue to run. GitHub Pages serves only production files from `master`, and the PR is research-only. **Do not merge/deploy new pose geometry** until each modified pose has three to four independent, rights-verified, expert-adjudicated live-person photographs with held-out verification, plus human reviewer approval and full device/browser acceptance.

**NO-GO** for production pose geometry; research evidence acquisition continues from the 543 unrepresented pose IDs.
