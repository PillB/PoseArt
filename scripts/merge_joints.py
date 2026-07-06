#!/usr/bin/env python3
"""
Merge full 17-joint data from poses_full_joints.json into poses-data.js.
Replaces the sparse joints: {...} block for each pose with the full 17-joint version.
"""
import json
import re

# Load full joints data
with open('/home/user/workspace/pose_qa/poses_full_joints.json') as f:
    full_joints_list = json.load(f)

# Build lookup dict: pose_id -> joints dict
joints_lookup = {item['id']: item['joints'] for item in full_joints_list}
print(f"Loaded {len(joints_lookup)} poses from full joints JSON")

# Load poses-data.js
with open('/home/user/workspace/poseart-app-v2/js/poses-data.js') as f:
    content = f.read()

print(f"poses-data.js size: {len(content)} bytes")

# We need to replace each `joints: { ... },` block with the full 17-joint version.
# The pattern is: joints: { <contents> },
# where <contents> doesn't span multiple lines (current sparse format is single-line)

# Strategy: use regex to find joints: {...}, and replace with full version
# But we need to know which pose we're in. 
# Better approach: process pose by pose using split on pose IDs

replaced_count = 0
not_found_in_content = []

def format_joints(joints_dict):
    """Format joints dict as JS object literal."""
    parts = []
    for key, val in joints_dict.items():
        parts.append(f"{key}: {val}")
    return "joints: { " + ", ".join(parts) + " }"

# Replace each joints block by finding it within the context of each pose ID
for pose_id, joints in joints_lookup.items():
    # Find the pose block: look for the pose ID string in content
    # Pattern: find `'<pose_id>': {` or `"<pose_id>": {`
    # Then within the next ~2000 chars, find and replace the joints: line
    
    # Find position of pose definition
    pose_pattern = re.compile(
        r"['\"]" + re.escape(pose_id) + r"['\"]:\s*\{",
        re.MULTILINE
    )
    match = pose_pattern.search(content)
    if not match:
        not_found_in_content.append(pose_id)
        continue
    
    start = match.start()
    # Look for the joints: {...}, pattern within the next 3000 chars
    chunk = content[start:start+3000]
    
    joints_pattern = re.compile(r'joints:\s*\{[^}]*\}')
    joints_match = joints_pattern.search(chunk)
    
    if not joints_match:
        not_found_in_content.append(f"{pose_id} (joints not found)")
        continue
    
    old_joints_str = joints_match.group(0)
    new_joints_str = format_joints(joints)
    
    # Replace only this occurrence (at the specific position)
    abs_pos = start + joints_match.start()
    content = content[:abs_pos] + new_joints_str + content[abs_pos + len(old_joints_str):]
    replaced_count += 1

print(f"Replaced: {replaced_count}")
print(f"Not found/failed: {len(not_found_in_content)}")
if not_found_in_content:
    print("Failed IDs:", not_found_in_content[:20])

# Write output
with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', 'w') as f:
    f.write(content)

print(f"Written. New size: {len(content)} bytes")

# Quick validation: count joints blocks with all 17 keys
all_17 = content.count('leftFoot')
print(f"Poses with leftFoot joint: {all_17} (should be 480)")
