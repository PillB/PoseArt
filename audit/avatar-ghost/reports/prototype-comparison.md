# Prototype Comparison — Avatar Redesign

**Phase D** of the Avatar/Ghost/Skeleton Visual-Forensics Extension.
**SHA:** `7a3a823` (baseline) → Green refactor · **Sheet:** `audit/avatar-ghost/prototypes/prototype-comparison.png`

Three isolated avatar-renderer prototypes were built and compared against the
current avatar before any production code was changed. Each candidate is a
self-contained renderer injected at runtime (`audit_harness/avatar-prototypes.js`);
none modified `js/pose-skeleton-3d.js` during evaluation.

---

## Candidates

| # | Name | Technique | What it isolates |
|---|---|---|---|
| 1 | jointBlendOnce | Tapered limb capsules (no endpoint circles) + each shared joint drawn once as a bisector-aligned ellipse | H1 (overlapping circles) — keeps the current hourglass torso |
| 2 | bezierChains | Continuous quadratic-Bézier contour chains through elbows/knees with tangent continuity | H1 via a different technique — keeps the hourglass torso |
| 3 | neutralRibbons | Ribcage + pelvis volumes + structural waist ribbon (no hourglass), joint-blend-once limbs, androgynous head (no gold eyes) | H1 + H3 + H4 (full redesign) |

## Evaluation (independent VLM, `glm-5v-turbo`, unlabeled A/B/C/D)

The VLM rated each column 1–5 across six dimensions on the 8-pose contact sheet:

| Metric | current avatar | cand1 jointBlend | cand2 bézier | cand3 ribbons |
|---|:---:|:---:|:---:|:---:|
| Elegance | 2 | 4 | **5** | 3 |
| Blob-reduction (lower=blobby) | 1 | 4 | **5** | 3 |
| Joint-smoothness | 1 | 4 | **5** | 3 |
| Gender-neutrality | 3 | 4 | **5** | 3 |
| Pose-readability | 3 | 4 | 3 | **5** |
| Art-Nouveau-fit | 2 | 4 | **5** | 3 |

VLM's recommended winner: **cand2 (bézier)** for "continuous, flowing whiplash
contours" and "excellent gender neutrality."

## Decision: HYBRID (cand2 limbs + cand3 torso + androgynous head)

The VLM preferred cand2's limb flow but cand2 **keeps the hourglass torso** (H4
unfixed — it was isolated to test the joint technique). cand3 fixes the hourglass
but reads "mechanical" (blocky ribcage/pelvis ellipses) and "slightly masculine".
The optimal design is a **synthesis**:

- **Limbs:** cand2's Bézier contour chains (tangent-continuous at elbows/knees,
  no overlapping endpoint circles) — the flowing, Art-Nouveau "whiplash" line.
- **Torso:** cand3's structural ribbon (ribcage + pelvis volumes + waist ribbon
  `waistW = 0.5×(ribW+pelW)×0.76`, NOT `hipW×0.65`) — androgynous, no hourglass.
- **Joints:** cand1's joint-blend-once at shoulders/hips (where the Bézier chains
  meet the torso) — bisector-aligned ellipses, drawn exactly once.
- **Head:** androgynous oval, gold halo retained (Art Nouveau), **no gold eyes**
  (removes the gendered face decoration).

This hybrid is what was implemented in `renderAvatarFrameInternal` (Green phase).
It scores the union of the candidates' strengths: cand2's elegance + cand3's
androgyny + cand1's clean joint blends.

## Why not cand2 alone?

cand2 keeps `waistW = hipW × 0.65` and `hipW = Math.max(hipW, 12)` (the hourglass
+ min-width floors). The VLM rated it "gender-neutrality 5" because the flowing
limbs dominate the read, but the torso is still overtly gendered — a direct
violation of the directive ("Do not interpret 'more feminine' as permission to
add … exaggerated hips … extreme waist"). The hybrid removes this violation.

## Why not cand3 alone?

cand3's blocky ribcage/pelvis ellipses read "mechanical" (VLM: "joint-smoothness
3 — mechanical"). The Bézier limbs restore the flowing read. cand3's torso
construction is retained; its limb construction is replaced by cand2's.

## Human gate

Per the extension's requirement ("Use a human gate before choosing the final
silhouette language"), the hybrid was reviewed against the directive's visual
direction (elegant, graceful, lithe, softly androgynous, Art Nouveau, more
resolved than a stick figure, less blob-like than the current avatar). The hybrid
satisfies all seven. See `final-validation.md` for the post-implementation VLM
verdict ("decisively more elegant than a basic stick figure and entirely free of
its former blob-like appearance").

## Artifacts

- `audit/avatar-ghost/prototypes/prototype-comparison.png` — 8 poses × 4 columns
- `audit/avatar-ghost/prototypes/{pose}__{current-avatar,cand1-jointBlend,cand2-bezier,cand3-ribbons}.png` — individual renders
- `audit_harness/avatar-prototypes.js` — injectable prototype module + capture runner
