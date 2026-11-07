# Phase 5 — source-family photographic adjudication and rights remediation
Date: 2026-11-06. Research snapshot pinned to `master` `5068f7ad23c0dd0c5afa01a812234a88214d9852`. No production pose or rig files changed.

## Evidence reconciliation
- **745** live poses in **16** categories; each existing ID has a title and full instructions. **2,980** rendered yaw projections are from the legacy rig, not independent evidence.
- **189** pose IDs had at least one raw image lead before this sweep; **556** had none.
- **21** photographic/visual source files individually investigated, **24** pose-to-source screening decisions; a source with multiple possible pose uses counts as *one* source family within any single pose. Some were explicitly **rejected** due to image type, wrong support, wrong contact, cropping, or unsafe knee placement. A subset remain metadata-only, never counted as visually accepted.
- **Seven** previously uncovered IDs now have a visual **partial** live-person photo lead: `one-leg-balance`, `sitting-on-heels`, `forehead-touch`, `p15-chair-s3-side-straddle-back`, `boudoir-chair-straddle`, `fashion-mid-turn-sweep`, `mid-jump`. Total with any raw lead **196**, **549** without.
- **0** independent photographs meet expert, joint/contact, rights, and held-out approval requirements. Minimum release deficit remains **2,235** approved independent photos. Every new/modified pose geometry remains **blocked**.

## Category search works better than keyword search
The specific Commons category https://commons.wikimedia.org/wiki/Category:Sitting_on_chair_in_reverse revealed *three distinct photographer/source families* for reversed-chair poses that simplistic title search missed:
1. **Unknown historical photographer, Rijksmuseum**, *Not So Bad* stereo card (1900–1920). Wikimedia CC0; one stereo capture even though it shows two side-by-side viewpoints: https://commons.wikimedia.org/wiki/File:Vrouw_poseert_andersom_gezeten_op_een_stoel_Not_So_Bad_(titel_op_object),_RP-F-F10493.jpg
2. **Allan Warren**, *Peter Ustinov black & white Allan Warren.jpg* (1986). Commons CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:Peter_Ustinov_black_%26_white_Allan_Warren.jpg
3. **Anna Favella**, *Annafavella-10.jpg* (2018). Commons CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Annafavella-10.jpg

Each visually shows reversed-chair arms/backrest interactions, but neither foot placement nor the exact arched-spine constraints are fully verified. Thus three **photo comparisons**, not three approved poses. A fourth reverse-chair photograph by Mark J Sebastian, *Olivia Evita seated on a chair.jpg* (CC BY-SA 2.0), was **rejected** for exact `p15-chair-s3` contacts; her asymmetrical elevated knee and hand placement represent a different variant.

Other newly investigated Commons photographs include **Sbagnuolo15's Forehead Love.jpg** (CC BY-SA 4.0; cropped below waist), **Jmaikido's Seiza.jpg** (CC BY-SA 4.0; lower legs obscured), **Satheesan.vn's Tree pose.JPG** (CC BY-SA 3.0; arms raised instead of palms at chest), **reebs*' Sunset Hopping.jpg** (CC BY 2.0; silhouetted feet/joints), **Chi Chang Wu's Cross-legged sitting woman.jpg** (CC BY-SA 4.0; floor cross-leg reference, previously covered), and **Fredericks/LOC's Helen B. Garrettson portrait** (US public domain; partial match to a *misaligned* Fashion description).

## Negative tests prevent fabricated photographic coverage
- `Tree pos.jpg`: a JPEG containing line-art, **not a real person photograph**.
- `Back-to-Back Statue at the Rogers Centre`: a JPEG of a sculpture; neither a live couple nor an acceptable 2-person photo.
- `VVO 6763`: two people **seated** back-to-back, but `back-to-back` explicitly requires **standing**. Informs a new unpromoted *seated* proposal only.
- `Piggyback photographer.jpg` and `Piggyback fursuit.jpg`: shoulder rides, not person-on-back piggyback.
- `Woman Leaning on Wall.jpg`: face-closeup, not full standing shoulder-blades/hip support.
- `2people1wheelchair6yearslove.jpg`: a couple but **no forehead-to-forehead** contact.
- `Cross-legged sitting - woman.jpg`: hands hold ankles, whereas `floor-cross-leg` requires hands on knees.

## Rights are a separate evidence gate
**Do not treat prior SketchKit links as rights-approved**. Its site terms limit uses to personal/noncommercial and prohibit automated collection. **Pose Library** explicitly excludes AI and computer-vision training/evaluation. **Pexels** disallows systematic collection for AI/ML training or evaluation absent further permission; **Unsplash** has extra AI/competing-image-library restrictions; **AdorkaStock** poses have explicit AI use caveats. Treat publishers' pose-guide book photos as bibliographic research only; do not redistribute or scrape. Commons CC0, CC BY, CC BY-SA and LOC public-domain items can provide documented *per-file* starting points, but **per-person model/publicity release, attribution, derivative/share-alike, source independence and joint-level pose validation remain open**. Keep photographic inspiration, artwork, photo-of-sculpture, line-art, generated existing-rig diagrams, and live person photography as distinct evidence classes.

## Safety defect (issue #32)
Live `one-leg-balance` text: “press opposite foot against the inner calf **or knee**”. Yoga Journal https://www.yogajournal.com/poses/tree-pose-2/ and Cleveland Clinic https://my.clevelandclinic.org/-/scassets/files/org/wellness/yoga-on-the-go.ashx advise **never press the lifted foot into the supporting knee joint**; use inner calf/thigh or supported low modification. Issue #32 tracks a semantic safety correction plus rig/contact test, not automatic production publication.

## Inspiration and research-only proposals
Retain the previous **18 unpromoted** candidate poses. Add two **research-only** ideas with title and full descriptions:
- `research-couple-seated-back-to-back-ground` (**Seated Back-to-Back Ground Counterbalance**): Two adults sit on stable ground with upper backs touching lightly and legs extended in opposite diagonals. Each independently supports weight with one hand on the floor or thigh, preserving separate pelvis, shoulder, gaze and foot axes. Neither uses the other as a load-bearing sole support. Inspired by the seated photo *VVO 6763*.
- `research-dynamic-sunset-hopping-asym-v` (**Asymmetric V-Armed Sunset Hop**): From safe footing, hop with both arms opening into an asymmetric V, one knee bending back while the other leg hangs lower; capture the midair suspension before a controlled, cushioned landing. Compare novelty with existing *mid-jump*. Inspired by *Sunset Hopping*.

Total **20** proposals; live still **745**. Previous sculpture and painting inspirations remain research-only (Rodin *The Thinker*, Degas arabesques, Botticelli *Birth of Venus*, Sargent *Madame X*, Rijksmuseum historic photography). The source/artwork is not interchangeable with independent live-person photographic evidence.

## Private all-pose deliverables
The private Phase 5 package generated from the earlier Phase4 dossier comprises: **380-page PDF** (3-page Phase 5 supplement + 377 original per-pose diagram/photo pages); independent 745-row CSV inventory with full title and instructions; 745-card interactive four-angle joint atlas with new **external** Commons photographic previews loaded from original Commons URLs, captioned creator and license; detailed 21-source JSON/24-association CSV; source/reuse terms; reproducible local Python builder. The new Commons original photo bytes have not been embedded in the public repo or PDF; previously uploaded guide photographs remain private in the user-provided dossier.

**Release verdict: NO-GO** for merging or deploying geometry, new poses or private photographs. PR #27 remains draft. CI validates the new ledger contract but **cannot certify** 3–4 independent rights-approved references per pose, human expert visual signoff, two-person mechanics, physical device rendering or production smoke.
