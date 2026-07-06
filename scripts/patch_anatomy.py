#!/usr/bin/env python3
"""
Patch poses-data.js to canonicalize joint values that violate AnatomyLimits.
Reads /home/user/workspace/PoseArt/qa_screenshots/anatomy_patch_map.json
Updates joint values in place for the 104 poses that had anatomy coupling
violations (calf-pointing-up bug).
"""
import json
import re
import sys
from pathlib import Path

REPO = Path('/home/user/workspace/PoseArt')
POSES_JS = REPO / 'js' / 'poses-data.js'
PATCH_MAP = REPO / 'qa_screenshots' / 'anatomy_patch_map.json'

def load_patch_map():
    return json.loads(PATCH_MAP.read_text())

def find_pose_block(text, pose_id):
    """
    Find the start index of the pose entry `'pose-id': { ... }` and return
    (start_of_object, end_of_object) as indices into `text`.
    The pose object begins at the '{' after `'pose-id':` and ends at its
    matching '}'.
    """
    # Match the key exactly. Support both 'id' and "id" quoting styles.
    pattern = re.compile(r"['\"]" + re.escape(pose_id) + r"['\"]\s*:\s*\{")
    m = pattern.search(text)
    if not m:
        return None
    start = m.end() - 1  # position of the '{'
    depth = 0
    i = start
    in_str = None
    escape = False
    while i < len(text):
        c = text[i]
        if in_str:
            if escape:
                escape = False
            elif c == '\\':
                escape = True
            elif c == in_str:
                in_str = None
        else:
            if c == "'" or c == '"':
                in_str = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return (start, i + 1)
        i += 1
    return None

def patch_joints_block(pose_text, joint_updates):
    """
    Within the pose object text, find `joints: { ... }` and update specific keys.
    Returns the patched pose_text.
    """
    jm = re.search(r'joints\s*:\s*\{', pose_text)
    if not jm:
        return None
    start = jm.end() - 1
    depth = 0
    i = start
    in_str = None
    escape = False
    while i < len(pose_text):
        c = pose_text[i]
        if in_str:
            if escape:
                escape = False
            elif c == '\\':
                escape = True
            elif c == in_str:
                in_str = None
        else:
            if c == "'" or c == '"':
                in_str = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    joints_block = pose_text[start:end]
                    # Patch each key inside joints_block
                    new_block = joints_block
                    for key, spec in joint_updates.items():
                        after = spec['after']
                        # Match key: <number>  where <number> can be int, float,
                        # optionally negative. Only replace the first occurrence.
                        key_pattern = re.compile(
                            r'(\b' + re.escape(key) + r'\s*:\s*)(-?\d+(?:\.\d+)?)'
                        )
                        # Replace only first occurrence
                        replaced = False
                        def _r(m, spec=spec, replaced_ref=[False]):
                            if replaced_ref[0]:
                                return m.group(0)
                            replaced_ref[0] = True
                            return f"{m.group(1)}{spec['after']}"
                        replaced_ref = [False]
                        def _do(m):
                            if replaced_ref[0]:
                                return m.group(0)
                            replaced_ref[0] = True
                            return f"{m.group(1)}{after}"
                        new_block2 = key_pattern.sub(_do, new_block, count=1)
                        if replaced_ref[0]:
                            new_block = new_block2
                    patched = pose_text[:start] + new_block + pose_text[end:]
                    return patched
        i += 1
    return None

def main():
    patch_map = load_patch_map()
    text = POSES_JS.read_text()
    original_len = len(text)
    patched_count = 0
    failed = []
    for pose_id, updates in patch_map.items():
        block = find_pose_block(text, pose_id)
        if not block:
            failed.append((pose_id, 'no-pose-block'))
            continue
        start, end = block
        pose_text = text[start:end]
        patched = patch_joints_block(pose_text, updates)
        if patched is None:
            failed.append((pose_id, 'no-joints-block'))
            continue
        text = text[:start] + patched + text[end:]
        patched_count += 1
    POSES_JS.write_text(text)
    print(f"Patched {patched_count} / {len(patch_map)} poses")
    print(f"Failed: {len(failed)}")
    for p in failed[:10]:
        print(f"  - {p[0]}: {p[1]}")
    print(f"Size before: {original_len}, after: {len(text)}, delta: {len(text)-original_len}")

if __name__ == '__main__':
    main()
