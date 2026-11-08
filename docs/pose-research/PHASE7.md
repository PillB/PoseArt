# Phase 7 — contact-by-contact photographic discovery and rejection ledger

Date: **2026-11-08**. Research only, master source `5068f7ad23c0dd0c5afa01a812234a88214d9852`. **NO production pose geometry, new live IDs, or third-party photo files in this PR.**

## Exact state

| Metric | Phase 6 | Phase 7 |
|---|---:|---:|
| Existing PoseArt IDs / categories | 745 / 16 | **745 / 16** |
| IDs with at least one raw discovery lead, unapproved | 202 | **207** |
| IDs with no photographic leads | 543 | **538** |
| Independently approved photographic matches | 0 | **0** |
| Minimum deficit, 3 photos × 745 poses | 2235 | **2235** |
| This phase's pose–source adjudication decisions | — | **27** |
| Distinct Wikimedia file titles among the 27 decisions | — | **25** |
| Screened photographic partial matches | — | **12** |
| Explicitly rejected matches | — | **15** |
| Historical same-rig diagrams (4 × 745) | 2980 | **2980** |
| New proposed poses held outside runtime | 20 | 20 |

## New source photographs found via anatomical and support-object queries

**Tree Lean** (`tree-lean`): Wikimedia Commons category [Women leaning against trees](https://commons.wikimedia.org/wiki/Category:Women_leaning_against_trees) includes [Jakob Montrasio, palm-tree photograph](https://commons.wikimedia.org/wiki/File:Asian_model_leaning_against_a_palm_tree_(6775969659).jpg) (CC BY 2.0) with shoulder/trunk and one knee bent near bark, and [Trần Sơn Hải, AO DAI source](https://commons.wikimedia.org/wiki/File:AO_DAI_2015-02-23_-_15.jpg) (CC BY 2.0), which Commons classifies as *column* but actually shows a tree. Both partial, sole/bark and hip load not completely proven. The image of a pink-coated model leaning on a **column** is a negative control for tree posing.

**Chin on Fist** (`chin-on-fist`): The [Commons Chin on fist category](https://commons.wikimedia.org/wiki/Category:Chin_on_fist) revealed four creator/session candidates (a vintage studio portrait, unknown-author historical portrait crop, Tamás Urbán/Fortepan source, Anna Rouker portrait). These show the chin-on-fist gesture but **do not establish the required elbow-on-table contact**. A flat-palm support image and a minor-subject government workplace photo were rejected. A cropped derivative and its full frame are one source, not two independent photos.

**Floor Hug Knees** (`floor-hug-knees`): [Commons Sitting with hands around knees](https://commons.wikimedia.org/wiki/Category:Sitting_with_hands_around_knees) provided two live-person partials including [Vpwakuni, Homeless and Lonely](https://commons.wikimedia.org/wiki/File:Homeless_and_Lonely.jpg) (CC BY-SA 4.0) and a Nicholas A. Tonelli floor portrait (CC BY 2.0). Neither demonstrates every face/leg contact; four nearby images were **rejected** because subjects are on a cube, platform, bench or ledge rather than the floor.

**Hands Clasped in Front** (`p14-standing-s9-hands-clasped-front`): [Commons Standing with hands clasped](https://commons.wikimedia.org/wiki/Category:Women_standing_with_hands_clasped) provides three photographer-attributed partial candidates, [Jens Tenhaeff, Julia Laub](https://commons.wikimedia.org/wiki/File:Julia_Laub,_2010.jpg) (CC BY-SA 2.0), [Mavi Pot, Demet Mutlu](https://commons.wikimedia.org/wiki/File:Demet_Mutlu_1080_x_1616.jpg) (CC BY-SA 4.0), [BVBoze, Betsy Boze portrait](https://commons.wikimedia.org/wiki/File:Betsy_Boze_@_Brookside.JPG) (uploader public-domain release). Several crop ankles and/or depict wall support; no photo is full proof of identical joint structure. A microphone gesture and a 15th-century drawing were rejected as mismatched or nonphotographic.

**Column Lean** (`column-lean`): [Pawewa5, Girl in pink coat leaning against a column](https://commons.wikimedia.org/wiki/File:Girl_in_pink_coat_leaning_against_a_column.jpg), photographed 8 July 2026, CC0, is a confirmed live-person photographic **partial**: back and shoulder at the stone column, hands inside pockets rather than required near-arm drape. Images showing folded arms next to a column or a tree misfiled under column are rejected. John William Godward's painting *Leaning against a Column* is inspiration only, not a live-human photograph.

## Higher-value search ontology and false-match safeguards

Candidate searches now prioritize explicit **contact triples**: `(body part, support object, posture)`, secondary `(feet, hands, direction)`, and alternate photography terminology. A string like “leaning” is not enough; a balcony rail *gripped by hands* is not a full *forearm* rest, and a car elbow-rest is not lower-back contact. The Phase 7 ledger includes negative controls for railing/car poses, source licensing, underage subjects, publication/derivative duplicates and photographed artwork.

The 745-record private inventory and six anatomy-aware search templates per pose are generated locally for manual Google/Bing/Commons research. **4,470 generated search templates are not 4,470 executed searches.** The 5 newly reached IDs are an increment to the previous baseline; no source has been falsely counted as independently approved.

## Source separation and safety

The local user-facing package includes a complete **757-page** report (Phase 7 eleven-page illustrated/annotated supplement + prior 746-page full-catalog rig atlas) and a dynamic 745-pose HTML explorer hotlinking external Wikimedia thumbnails at view time (no photo pixels included in Git). Each pose has its current original title/description, four **existing-rig** views, photo source assessment where available and unapproved status. The 20 previous proposed poses remain documented as unpromoted, not live. Historical sculpture/painting inspiration retained separately: Godward, Lippi, Rodin, Degas, Botticelli.

Prior issues [#28](https://github.com/PillB/PoseArt/issues/28), [#31](https://github.com/PillB/PoseArt/issues/31), [#32](https://github.com/PillB/PoseArt/issues/32), [#33](https://github.com/PillB/PoseArt/issues/33) remain valid: title/instruction mismatch, foot-on-knee safety, and copyright/model-release/AI-use constraints. Commons file metadata and CC0 copyright status **do not waive human subject publicity or automatically approve photo-geometry similarity**.

## Test and release contract

Reproduce Git-only Phase 7 checks with `node scripts/test-phase7-photo-evidence.cjs`. Hosted `.github/workflows/pose-research-ci.yml` runs Phase 3–7 source gates, the 745-pose legacy atlas/geometry audit and runtime geometry-diff blocker.

**NO-GO** for any new geometry or reference-image redistribution, despite green research CI. The evidence gate requires 3–4 independently sourced and pose-accurate live photographs per pose, source-family deduplication, verified rights/model consent, qualified reviewer sign-off, partner/accessibility contact models where relevant, and real iPhone/Android/desktop browser UI QA.

The current report covers every live pose as inventory/rig projections, but **does not claim 3–4 independently accepted photos for all 745**.
