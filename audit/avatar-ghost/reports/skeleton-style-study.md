# Skeleton Style Study — Graceful Androgynous Technical Figure

**Phase F** of the Avatar/Ghost/Skeleton Visual-Forensics Extension.
**SHA:** Green refactor · **Implementation:** `drawJoint()` + `renderFrame()` in `js/pose-skeleton-3d.js`

---

## Directive

The skeleton must remain a **technical guide**, not become a filled avatar. The
target is "elegant human figure," not "female mannequin": smaller joints, smooth
taper, refined neck/head transition, flowing line-of-action, mild pose-driven
asymmetry, restrained curves, clear weight/balance, Art Nouveau rhythm — without
breasts, extreme waist, exaggerated hips, makeup/eyelashes, gendered clothing, or
sexualized anatomy.

## Baseline state

The skeleton was already cleaner than the avatar (subtle ribcage/pelvis ellipses
at alpha 0.06-0.07, tapered bone capsules, line-of-action). But the joints were
still prominent: key joints (shoulders/hips) radius 2.5, non-key 2.2, with a
`Math.max(radius, 2)` floor and a 1.0px gold stroke ring. Wrists/ankles/feet drew
the same-size ball as elbows/knees, reading as a "string of beads."

## Changes (Phase F)

`drawJoint()` (`pose-skeleton-3d.js:577`) — refined radii + a per-joint floor:

| Joint class | Baseline radius | Green radius | Floor |
|---|---|---|---|
| head (oval, 1.18 stretch) | 9.5 | 8.5 | 2.0 |
| neck | 3.0 | 2.2 | 1.6 |
| key (shoulders/hips/hips-center, gold) | 2.5 | 2.0 | 1.6 |
| hinge (elbows/knees — kept readable for coaching) | 2.2 | 1.7 | 1.6 |
| extremity (wrists/ankles/feet) | 2.2 | **1.1** | **0.8** |
| other (spine) | 2.2 | 1.5 | 1.6 |

- **Extremities suppressed** to a faint dot (radius 1.1, floor 0.8) so the limb
  reads as a flowing taper rather than a beaded chain.
- **Elbows/knees kept readable** (1.7) — the directive: "Preserve clearly visible
  elbows and knees for coaching."
- **Key joints** (shoulders/hips) remain gold but slimmer (2.0, ring stroke 1.0).
- **Head** slightly smaller (8.5) and still an oval — refined neck-to-head transition.

`renderFrame()` — now applies `computeFit()` (shared with avatar/ghost) so the
skeleton is framed identically to the other modes (acceptance criterion #3).

## Three proportion profiles (reviewed)

Per the directive ("Create at least three proportion profiles for review"), three
were considered:

1. **Neutral technical** — the baseline (pre-Phase-F). Joints uniform 2.2-2.5,
   beads at extremities. Rejected: reads as "string of beads," not graceful.
2. **Graceful androgynous** (selected) — the Phase-F values above. Extremities
   suppressed, hinges readable, key joints slim. Matches "elegant human figure."
3. **Art Nouveau expressive** — even smaller joints (1.0-1.5) + stronger
   line-of-action emphasis. Rejected: too sparse; loses the coaching readability
   the skeleton exists to provide.

The default changed to profile 2 only after the comparative review (VLM +
directive checklist) showed it improves elegance and pose readability without
increasing perceived gender stereotyping (the skeleton was never gendered — it
has no torso fill; this profile just makes it more graceful).

## Verification

Independent VLM on the live `scurve-stand` skeleton (`ui-scurve-stand-skeleton.png`):
> "The figure is graceful and readable with subtle, well-defined joints that are
> not swollen, and it is well-framed within the display without being clipped or
> floating. The design maintains an androgynous appearance, avoiding gendered
> mannequin characteristics while clearly illustrating the S-Curve Stand pose."

Baseline VLM (mode-comparison sheet) had called the skeleton "elegant and refined,
graceful and slender, more aesthetically resolved than the avatar." The Phase-F
changes preserve that while slimming the bead-like extremities.

## What was NOT changed (pose semantics)

`buildPose()`, `BONES`, `BONE_WIDTHS` (for the skeleton's `drawBone`), joint
angles, yaw/pitch meaning — all unchanged. The skeleton renders the exact same
pose geometry; only the joint visual sizes and the framing transform changed.
