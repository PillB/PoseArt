import json, re

with open('/home/user/workspace/pose_qa/poses_full_joints_v3.json') as f:
    data = json.load(f)

joints_lookup = {item['id']: item['joints'] for item in data}
print(f"Loaded {len(joints_lookup)} poses")

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js') as f:
    content = f.read()

replaced = 0
failed = []

def format_joints(j):
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
    pose_pattern = re.compile(r"['\"]" + re.escape(pose_id) + r"['\"]:\s*\{", re.MULTILINE)
    match = pose_pattern.search(content)
    if not match:
        failed.append(pose_id); continue
    start = match.start()
    chunk = content[start:start+3000]
    jm = re.compile(r'joints:\s*\{[^}]*\}').search(chunk)
    if not jm:
        failed.append(f"{pose_id}(no-joints)"); continue
    old_str = jm.group(0)
    new_str = format_joints(joints)
    abs_pos = start + jm.start()
    content = content[:abs_pos] + new_str + content[abs_pos + len(old_str):]
    replaced += 1

print(f"Replaced: {replaced}, Failed: {len(failed)}")
if failed: print("Failed:", failed[:5])

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', 'w') as f:
    f.write(content)
print(f"Written. Size: {len(content)} bytes")
