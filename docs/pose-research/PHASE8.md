# Phase 8 — 745-pose independent photographic discovery and evidence backlog
Research date: **2026-11-08**. Source master: `5068f7ad23c0dd0c5afa01a812234a88214d9852`. This is **non-destructive research**; no existing pose geometry or names/instructions are changed, no source photos are copied into public Git.

## Reconciled evidence funnel

| Metric | Phase 7 | Phase 8 |
|--|--:|--:|
| Production pose IDs / categories | 745 / 16 | **745 / 16** |
| Poses with at least one **unapproved raw** image lead | 207 | **212** |
| Poses with no raw image lead | 538 | **533** |
| NEW per-file photo reviews | — | **20** |
| Human visual partials | — | **10** |
| Rejected mismatches | — | **10** |
| Expert-approved, rights-cleared reference photographs | 0 | **0** |
| Minimum approved-photo deficit (3 × 745) | 2,235 | **2,235** |
| Existing-rig diagrams (4 angles × 745, NOT new photos) | 2,980 | 2,980 |
| Proposed new poses, held research-only | 20 | 20 |

Every 745-pose original title and description is present in the private inventory. Existing known semantic drift (#28, #31) persists and is **not** corrected without approved independent photographic evidence. The seven guide categories / 24 PDFs / 353 pages were already inventoried in earlier research, including 66 numbered-page leads, two exact bench-page mismatches. No photographed guide pages are in this PR.

## Phase 8: new uncovered pose IDs with independent-source photographic comparisons
1. **`floor-side-extend` (4 partials):** Search `Jānuśīrṣāsana` and `Mahāmudrā`, not only literal English title. Individual Commons photographs: [Kennguru, Janusirsasana Yoga-Asana Nina-Mel](https://commons.wikimedia.org/wiki/File:Janusirsasana_Yoga-Asana_Nina-Mel.jpg) CC BY 3.0/VRT; [Andrey, Woman doing Yoga in Russia](https://commons.wikimedia.org/wiki/File:Woman_doing_Yoga_in_Russia.jpg) CC BY 2.0; [Thamizhpparithi Maari, A style of Maha mudra](https://commons.wikimedia.org/wiki/File:A_style_of_Maha_mudra.JPG) CC BY-SA 3.0; [Nicholas A. Tonelli, Stretched](https://commons.wikimedia.org/wiki/File:Flickr_-_Nicholas_T_-_Stretched.jpg) CC BY 2.0. **Four different credited photographers, four partial body geometry views, ZERO approved**: all bend deeper forward/hold a foot, whereas original instruction demands a long torso side reach. Creator uniqueness is not independently validated shoot/session, subject release or exact geometry.
2. **`knights-kneel` (2 partials):** [Low Lunge](https://commons.wikimedia.org/wiki/File:Low_Lunge.jpg) by BameSanah88 and [Jóga Anjaneyasana](https://commons.wikimedia.org/wiki/File:J%C3%B3ga_Anjaneyasana.jpg) by Hanako.R share grounded back knee/front foot, but the **arms are overhead or on the floor, NOT one forearm resting on front thigh**. The severe backbend [Anjaneyasana, Heinz Grill](https://commons.wikimedia.org/wiki/File:Anjaneyasana,_Heinz_Grill_1992.jpg), the historic [Jean-Georges Wille engraving](https://commons.wikimedia.org/wiki/File:Wille_Nude_man_kneeling_on_one_knee.jpg), and the [Jóga.jpg](https://commons.wikimedia.org/wiki/File:J%C3%B3ga.jpg) original from the same Hanako.R photo shoot are explicit rejects.
3. **`side-straddle` (2 partials):** [Herbert Rose Barraud's side-seated Arthur Conan Doyle photograph](https://commons.wikimedia.org/wiki/File:Sir_Arthur_Conan_Doyle_1890.jpg) and [Helen Fielding on a chair](https://commons.wikimedia.org/wiki/File:HF-purple-with-chair.jpg) show sideways seating/backrest interactions. Two forearms draped and legs/hips straddling are not proven; desk/typewriter seating and the [Blonskaya painting](https://commons.wikimedia.org/wiki/File:Portrait_Blonskaya.jpg) are rejected.
4. **`soft-sit` (1 partial):** [Ed Kavishe, Anna Wintour](https://commons.wikimedia.org/wiki/File:Anna_Wintour_2.jpg), CC BY 3.0/VRT, seated posture, but precise front-third chair perch is not visible. [Allison Parris photo shoot](https://commons.wikimedia.org/wiki/File:AllisonParrisPhotoShoot.jpg) was rejected because subject sits on a **bed**, not chair.
5. **`meditation-palms` (1 partial):** [Cohen Van der Velde, meditation sitting pose Gloria](https://commons.wikimedia.org/wiki/File:Meditation_sitting_pose_siddhasana_yoga_Gloria.jpg), CC BY 2.0, crosslegs and upward palms. Full eye/hip symmetry uncertain. Meditator with occluded hands rejected. [Buddha Dihana Mudra](https://commons.wikimedia.org/wiki/File:Buddha_Dihana_Mudra.JPG) is **a photograph of a stone statue** and therefore rejected; its file-page CC BY-SA and embedded EXIF BY-NC-SA metadata also merit rights review.
6. **Two additional negative-only pose categories:** `throne-sit` armchair photo has crossed legs, not flat feet and forearms; `tiptoe-reach` vintage ballet photo depicts **en pointe shoes**, not standing on balls of both feet. Both still have **no** matching photographic lead.

The 20-row source record `phase8-commons-adjudication.json` separates visible contacts, conflicting contacts, original file URL, creator, claimed copyright terms, source family, independent session, human publicity/subject release, and expert approval. **All approval fields are false**. The published image/photo media class and original creator must be checked for every file. Paintings, sculpture photos, drawings, duplicates, AI/skeleton projections and private uploaded guide photos do **not** satisfy the target's three independent live-person reference-photo gate.

## Deeper retrieval strategy / root-cause fixes
- Query **body part + contact surface + posture** before fuzzy title matching; map alternate anatomical terms (e.g. Jānuśīrṣāsana), camera angle, support force, feet, hip, hand/palm direction and prop.
- Run a separate source title-vs-description-vs-original-rig check: at least 27 IDs in #31 have misaligned labels/instructions, and the Fine Art subset #28 is prominent. Search descriptions and anatomy separately so import drift does not bias photos.
- Search source taxonomy (Wikimedia Commons human-photo categories, credited historical photo archives) and **reject nonphoto source types** and wrong furniture. Do not reuse different crops of one shoot.
- Preserve per-source photographer/session ID, rights/attribution and person/model consent; published CC labels alone are not machine-learning evaluation or commercial production rights (#33).
- Generate eight clearly labeled **SEARCH TEMPLATES** per existing pose (5,960 total), including Google/Bing image links and negative media terms. These are not automatically executed 5,960 searches and do not constitute 5,960 reference candidates.
- Prioritize 533 missing pose IDs via lexical prop/contact facets, category coverage shortage, semantics drift and high-contact complexity. Local full-745 facet matrix and ranked 533-row queue are generated outside public Git. A Phase8 QA iteration corrected a false partner classifier: **"knees together" is not evidence of two people posing**. This is a heuristic worklist, NOT validated source evidence.
- Fold in previously screened 24 Phase5, 26 Phase6 and 27 Phase7 adjudications: private HTML atlas now exposes **97 source–pose assessments across Phases 5–8**, without increasing the count of independently approved photographs.

## Private reproducible deliverables
- **766-page** PDF (9-page new photo/contact supplement plus previous Phase7 757-page full catalog atlas), with every pose title and original instruction, **four projections of existing rig** per pose, and linked source evidence/negative decisions. No copyrighted user-guide photos or Commons photo bytes added to Git.
- **745-card searchable HTML atlas**, linking original Wikimedia Commons thumbnails via official Commons servers at viewing time. Search/category/coverage/review/rejection/pagination and 4-SVG-per-pose behavior tested with Node simulated DOM; NOT full real-device browser acceptance.
- **5-page gap closure brief** with category coverage and highest priority uncovered poses; **533-row ranked discovery backlog**, **745-row support/hand/foot contact-facet matrix**, **745-row full evidence inventory**, **5,960 query templates**. Eight templates per pose and counts verified.
- Art/schoolbook inspirations (Rodin, Degas, Botticelli, Godward, Lippi, etc.) remain distinct from live-person photographic evidence. Previously documented **20** conceptual proposals are research-only; none promoted to the catalog.

## GitHub gates
New `scripts/test-phase8-photo-evidence.cjs` enforces 745 live IDs, titles, instructions, 16 categories, 20 reviews (10 partial/10 rejected), independent creator family count for four Janusirsasana candidates, exact duplicate-session/artwork/bed/palms/en-pointe negative controls, cumulative 212/533, and zero approvals. Research CI also runs Phase3–7 tests, legacy full 745-pose atlas rebuild and **fail-closed production geometry diff**.

**NO GO** for new pose geometry, external photo redistribution, private guide publication, or production pose release without three to four genuinely independent, matching, rights-verified live-human photographs PER POSE, expert reviewer and physical browser/device/partner safety review. The research tooling alone can be reviewed/merged separately without promoting any geometry; do not equate CI success with photographic certification.