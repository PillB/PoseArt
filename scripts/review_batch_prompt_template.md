# Batch pose review — subagent instructions

You are reviewing a batch of PoseArt figures. For each pose in your assigned batch file, you compare the rendered SVG figure (a small stylized humanoid on a plain background) against the pose's written instructions and name, and propose joint overrides that make the rendered figure better match the intent.

## Your inputs

- `BATCH_FILE`: path to a JSONL file where each line is one pose. Fields:
  - `id`, `name`, `category`, `instructions`, `png` (path relative to /home/user/workspace/PoseArt), and current `joints`.
- The renderer's joint semantics: read `/home/user/workspace/PoseArt/docs/JOINT_SEMANTICS_v5.md` once at the start of your work.

## For each pose

1. **Read the pose row** (id, name, category, instructions, joints).
2. **Look at the PNG** using the `read` tool with the absolute path (prefix `/home/user/workspace/PoseArt/`).
3. **Describe forensically what you see** in the PNG WITHOUT peeking at the instructions text — arms position, legs position, torso lean, head tilt, weight distribution, is there a prop, does it read as sitting / standing / reclining / kneeling, etc. 2-4 sentences.
4. **Read the pose's `instructions` text**. Compare what the text asks for vs. what you saw.
5. **Decide**: does the current figure match the instructions faithfully? Rate 1-5 (1 = totally wrong pose, 5 = matches perfectly).
6. **If rating < 5, propose joint overrides** as a partial `joints` object containing ONLY the joints you'd change. Preserve everything else.
   - Use the joint semantics reference — do NOT hallucinate joint names.
   - Common improvements: more lean (adjust `spine` and/or `globalTilt`), more 3D depth by adding `shoulderFwd*` and/or `hipAbduct*`, hunch shoulders, S-curve, mid-air feet needing knee bend, arm-in-torso needing shoulderFwd, and so on.
7. **Write ONE JSON line to the results file** (path passed in `RESULTS_FILE`):

```json
{"id":"<pose_id>","seen":"<forensic 2-4 sentence description>","intent":"<one-sentence gist of the instructions>","rating":1-5,"issues":["short bullet", ...],"overrides":{"leftShoulder":-125,"leftElbow":80,...}}
```

If nothing needs to change, still emit the row with `"overrides":{}` and `"rating":5`.

## Rules

- Never change more than 8 joints per pose. Focus on the most impactful ones.
- Preserve the pose's intent — do not "improve" a pose by turning it into a different pose.
- Values must respect the semantics doc's ranges.
- One JSONL row per pose. Append to `RESULTS_FILE`. Do not overwrite.

## Efficiency

- Process poses sequentially.
- After every 6 poses, verify your appended rows are valid JSON (parse them; if any row failed to write, re-emit it).
- Do NOT re-render, do NOT execute the pose fixer, do NOT touch git. Just append rows.

Return a one-line summary when done: `batch <N> complete: <count> poses reviewed, <count> flagged (rating<5)`.
