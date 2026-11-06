# Phase 3: source-anchored photographic pose adjudication
Date: 2026-11-06. Catalog pinned to master commit \`5068f7ad23c0dd0c5afa01a812234a88214d9852\`.
Research only. The live 745-pose catalog, production renderer and GitHub Pages deployment are **unchanged**.

## Denominator and evidence state

| Item | Result |
| --- | ---: |
| Existing unique pose IDs, all with title/instructions | 745 |
| Existing categories | 16 |
| Existing-rig diagrams (four yaw projections per pose) | 2,980 |
| New privately uploaded posing guides | 24 PDFs, 353 pages |
| Source-number-to-catalog mappings in five detailed guides | 66 |
| Five flow guide counts | chair 17; bench 17; couch 9; bed 14; wall 9 |
| Earlier Commons image candidate associations | 274 for 116 pose IDs |
| Catalog IDs with any raw candidate lead after adding guide pages | 179 |
| Catalog IDs with no raw candidate leads | 566 |
| Confirmed false *guide-number* matches | 2 (bench 13, 14) |
| IDs with at least one non-rejected image lead | 177 |
| Independently adjudicated AND rights-cleared live photos | **0** |
| Photos still required for 3-per-pose release gate | **2,235** |
| Research-only new pose concepts (prior 8 + new 6) | 14 |
| Production changes | **0** |

All raw candidates are unapproved. Several of the older Commons candidates are unrelated lexical collisions, and some guide candidates are incorrect despite exact numbering. No image is considered an accepted photograph without anatomical, independent-source, rights and reviewer checks.

## User-supplied guide corpus

The uploaded \`Poses guides starter kit.zip\` contains 24 PDFs totaling 353 pages. It is not tracked in Git or redistributed. Notable source families: five pose-by-pose Yuliya Panchenko/Believe in Boudoir guides; a 77-page master compilation that repeats many sequences; ten-pose chair, lounge, sofa, floor, bed, bench, wall, standing, posing-tube and male sets; eccentric/unconventional, curvy-body, headshot and expression guides.

The five numbered flows have a direct importer-like mapping:
- \`p06-chair-b{n}-...\` maps to detailed Chair guide pose n, PDF page n+2 (1–17).
- \`p05-bench-b{n}-...\` maps to detailed Bench guide pose n, page n+2 (1–17).
- \`p02-couch-c{n}-...\` maps to Couch guide pose n, page n+2 (1–9).
- \`p03-bed-b{n}-...\` maps to Bed guide pose n, page n+2 (1–14).
- \`p04-wall-w{n}-...\` maps to Wall guide pose n, page n+2 (1–9).

**This is a number-aligned crosswalk, not a passed visual pose test.** User-supplied examples can be studied privately, but source redistribution rights are not established. All of these guides primarily share the same photographer/source family. A master-compilation duplicate, another crop or a rotated rig screenshot must never be counted as an additional independent photo.

## Confirmed diagnostic failures

1. **Critical: Fine Art title/instruction alignment.** The 30-entry Fine Art block includes near-sequential shifted semantics. \`fineart-contrapposto-classic\` (title "Classical Contrapposto") instructs a rear leg extension typical of an arabesque. \`fineart-odalisque-recline\` (title "Odalisque Recline") instructs standing contrapposto. \`fineart-pieta-kneel\` instructs a recline, while \`fineart-standing-torso-twist-sculpt\` instructs a mournful kneel. The pattern extends through most of the block. **Do not blindly rotate descriptions or joint coordinates:** review the original record import, tip and rig per ID, and correct the source-of-truth with separate photographic evidence and a qualified reviewer. Issue #28.
2. **High: Bench #13 and #14 confirmed false positives.** Source guide pose 13 depicts sitting on the bench armrest with hand-to-hair contact, but the PoseArt title/instructions direct standing. Source pose 14 depicts sitting on the floor against the bench, while PoseArt again calls for a standing bench lean. Both numbered photo matches are **rejected as exact geometry references**. Issue #29.
3. **Needs detailed check: Chair #16.** The source describes head against chair, bent knees, hair/hip contacts and downturned face/closed eyes. The app description agrees on a floor/chair family but does not specify all the same contacts. Do not auto-approve.
4. **Architecture: couple and accessible scenes.** A one-body skeleton cannot validate two-person hand and body contact or wheelchair and other accessibility supports. Earlier inventory found 17 couple entries with the same legacy single-body signature.
5. **False relevance:** prior Commons search retrieved BlackBerry Curve events for S-curve, riverwalk scenery for walking together, architecture for contrapposto, and literal prayer photos for non-prayer kneeling instructions.

## Improved search and acceptance architecture

Generate four query families **for each of the 745 original titles/descriptions** using \`node scripts/phase3-evidence-gate.js\`: (a) exact title with explicit photography context and negative terms; (b) written-instruction anatomy and pose-support features; (c) props, contacts, orientation and photography posing guide; (d) site-filtered public photo archive. The generated output also links Google Images and Bing Images searches for manual discovery, but **a search link is not an image reference**. Local source crosswalk is anchored to original catalog ID and exact numbered guide PDF page. The script and CI contain no unauthorized scraping or copyrighted guide images.

For every candidate, store pose ID, full title and instructions, photographer/creator, canonical image/page URL, source family and shoot/session, file fingerprint, license and attribution, pose subject count, front/oblique view, posture, hip and shoulder compensation, contact surfaces and props, hand/knee/foot placement, occluded landmarks, independent held-out status, human reviewer, and an explicit accepted/rejected reason. Mark photos, photographs **of artworks**, paintings, screenshots, and existing-rig schematics as different media classes. Do not infer that a third-party image can be legally republished simply because it can be viewed online.

Production gate: at least three pose-appropriate, rights-reviewed *live-person* photographs from independent source families/sessions per pose, one independently held out, validated title/instructions/joint rig (incl. accessibility and partner scenes), passing CI, and human reviewer signoff. Until then **0 approved**, even if every URL is populated.

New CI workflow: \`.github/workflows/pose-research-ci.yml\` validates 745 unique records with four query families each, guards known lexical collisions, validates the 66 page-number mappings, asserts zero approvals and refuses runtime geometry modifications on the research PR without independently adjudicated evidence.

## Artistic inspirations (separate from real-person photographic evidence)

- Rodin, *The Thinker*: https://www.nga.gov/artworks/1005-thinker-le-penseur - crossed elbow/knee/chin contacts.
- Rodin, *Pair of Standing Nude Male Figures Demonstrating the Principles of Contrapposto*: https://www.metmuseum.org/art/collection/search/207693 - standing weight shift and shoulder/pelvis compensation.
- Degas, *Grande Arabesque, Third Time*: https://www.nga.gov/artworks/110301-grande-arabesque-third-time-first-arabesque-penchee - rear leg extension and standing-foot balance.
- Botticelli, *The Birth of Venus*: https://www.uffizi.it/en/artworks/birth-of-venus - classical contracurve/modesty gesture.
- Sargent, *Madame X*: https://www.metmuseum.org/art/collection/search/12127 - profile and intentional support placement.
- Renoir, *Woman Seated in a Chair*: https://publications.artic.edu/renoir/reader/paintingsanddrawings/section/135646 - seated direction studies.
- Rights: Smithsonian https://www.si.edu/openaccess/faq ; Getty https://www.getty.edu/projects/open-content-program/ . An object image must actually carry the relevant rights designation.
- Additional guides: https://www.ppa.com/photovision/series/boudoir-photography-with-yuliya-panchenko/watch/boudoir-photography-posing-guide-yuliya-panchenko ; https://modelsphotography.co.uk/model-posing-guide/ . Treat creator, photo originality and rights as unverified until reviewed.

## Six additional unpromoted pose concepts

In addition to the eight original proposals in README/manifest, the private Phase 3 inventory records:
1. **Cross-Braced Thinker** (fine-art): On a stable low seat, lean forward, brace the right elbow on the opposite thigh, and rest the chin lightly on the right hand, preserving seat/foot contacts.
2. **Profile Table Anchor** (editorial): Stand in profile, gently shift hip weight, touch a stable table with near fingertips, and glance back toward camera without collapsing the shoulder.
3. **Arabesque Penchée Reach** (fine-art): Balance on a supporting leg, hinge torso forward and extend the free leg behind, with a reaching arm and an optionally assisted/barre-supported version.
4. **Venus Modest Countercurve** (standing): Asymmetrical leg loading, gentle pelvis/shoulder counter-rotation and two nonidentical forearm placements across the torso.
5. **Grounded Kneel, Hands on Thighs** (kneeling): Upright supported kneeling on a cushion, neutral neck and hands relaxed on thighs, adaptable to participant mobility.
6. **Cross-Legged Chair Turn** (seated): Cross one knee comfortably, rotate the ribcage to profile and return gaze to lens, retaining stable seat/hand support.

They remain **research concepts**, do not change the live 745 count, and require duplicate checks against existing poses, independent photos, contact/prop geometry, and reviewer signoff. Issues #28–30 track major blockers.

## Generated private research artifacts

A separate, non-repository deliverable contains: a 381-page report covering **every** pose title, description, 4 independent *views of the same rig* and any exact numbered-guide photo lead; an interactive 745-card visual atlas with all source links; a 745-row evidence CSV; a 66-row source-page crosswalk with two rejections; a 14-proposal inventory; a 2,980-view search-plan JSON; 24-guide provenance records and 5 creator-credit contact sheets. Source images from uploaded guides remain **out of Git**.

**Release verdict: NO-GO for new geometry or unlicensed images.** Research-only CI, audit, reviews and independent-photo acquisition precede any production promotion. See PR #27, issues #28, #29 and #30.