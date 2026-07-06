import json, re

with open('/home/user/workspace/pose_qa/poses_full_joints_v2.json') as f:
    full_joints_list = json.load(f)

joints_lookup = {item['id']: item['joints'] for item in full_joints_list}
print(f"Loaded {len(joints_lookup)} poses")

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js') as f:
    content = f.read()

replaced = 0
failed = []

def format_joints(j):
    # Only include non-zero values for brevity; always include core joints
    core = ['spine','neck','leftShoulder','rightShoulder','leftElbow','rightElbow',
            'hips','leftHip','rightHip','leftKnee','rightKnee']
    optional = ['leftWrist','rightWrist','leftAnkle','rightAnkle','leftFoot','rightFoot']
    parts = []
    for k in core:
        v = j.get(k, 0)
        if v != 0:
            parts.append(f"{k}: {v}")
    for k in optional:
        v = j.get(k, 0)
        if v != 0:
            parts.append(f"{k}: {v}")
    if not parts:
        parts.append("spine: 0")
    return "joints: { " + ", ".join(parts) + " }"

for pose_id, joints in joints_lookup.items():
    pose_pattern = re.compile(
        r"['\"]" + re.escape(pose_id) + r"['\"]:\s*\{", re.MULTILINE)
    match = pose_pattern.search(content)
    if not match:
        failed.append(pose_id); continue

    start = match.start()
    chunk = content[start:start+3000]
    joints_pattern = re.compile(r'joints:\s*\{[^}]*\}')
    jm = joints_pattern.search(chunk)
    if not jm:
        failed.append(f"{pose_id}(joints-missing)"); continue

    old_str = jm.group(0)
    new_str = format_joints(joints)
    abs_pos = start + jm.start()
    content = content[:abs_pos] + new_str + content[abs_pos + len(old_str):]
    replaced += 1

print(f"Replaced: {replaced}, Failed: {len(failed)}")
if failed: print("Failed:", failed[:10])

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', 'w') as f:
    f.write(content)
print(f"Written. Size: {len(content)} bytes")
