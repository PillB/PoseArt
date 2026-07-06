#!/usr/bin/env python3
"""
Joint data improvement pass — v2.1 fixes:

1. Hip sign convention: OLD renderer had bug (positive = backward).
   NEW renderer: positive = forward. Data was authored for OLD renderer.
   FIX: Negate ALL leftHip and rightHip values so poses still render correctly
   with the new renderer (data said +12 meaning "forward", renderer now correctly
   sends +12 = forward, so actually the data values ARE already what we want —
   BUT we need to verify: data was authored knowing positive goes backward in old
   renderer, so "left leg forward" was stored as POSITIVE... Actually from the
   analysis: model-walk lHip=+12 = author intended left leg forward.
   New renderer: +12 = forward. So NO negation needed — data intent matches new renderer!

2. For rightHip in model-walk: rHip=-12 = author intended right leg backward.
   New renderer: -12 = backward (rotX with +12 negated). Correct!

3. Add ankle dorsiflexion for kneeling/dynamic poses where feet point:
   - kneeling: leftAnkle=-30 (plantarflexion, top of foot on floor)
   - high leg kick: ankle=+20 (dorsiflexion, pointed toe-up)
   - seated: ankle=-15 (slight plantar for natural sit)

4. Add hips (pelvis) tilt for hip-shift / S-curve / contrapposto poses.

5. Clamp extreme shoulder values to anatomically valid range.
"""
import json, re, math

with open('/home/user/workspace/pose_qa/poses_full_joints.json') as f:
    data = json.load(f)

pose_map = {p['id']: p for p in data}

def get(pose_id, joint, default=0):
    return pose_map[pose_id]['joints'].get(joint, default)

# ---------------------------------------------------------------
# IMPROVEMENT RULES
# ---------------------------------------------------------------
improvements = 0

for p in data:
    pid = p['id']
    j = p['joints']
    cat = pid  # use id for now; category info available via separate parsing

    # --- Rule 1: Add pelvis tilt for hip-shift and S-curve poses ---
    if pid in ('hip-shift', 'hip-pop', 'hip-emphasis', 'hip-window'):
        lhip = j.get('leftHip', 0)
        rhip = j.get('rightHip', 0)
        # Pelvis tilts opposite to weight-bearing leg
        # If leftHip positive (left leg forward = weight on right), right hip drops
        tilt = (lhip - rhip) * 0.3
        if abs(tilt) > 2:
            j['hips'] = round(tilt, 1)
            improvements += 1

    # --- Rule 2: Contrapposto/S-curve — add pelvis counter-tilt ---
    if pid in ('contrapposto', 'scurve-stand', 'shoulder-drop', 'hip-shift'):
        lhip = j.get('leftHip', 0)
        rhip = j.get('rightHip', 0)
        # Contrapposto: one hip higher when leg bears weight
        tilt = (lhip - rhip) * 0.25
        j.setdefault('hips', 0)
        if abs(tilt) > 1 and j['hips'] == 0:
            j['hips'] = round(tilt, 1)
            improvements += 1

    # --- Rule 3: Add ankle plantarflexion for kneeling (top of foot on floor) ---
    kneeling_poses = [pid for pid in pose_map if 'kneel' in pid or 'kneeling' in pid]
    if any(k in pid for k in ['kneel', 'kneeling', 'prayer', 'proposal-kneel']):
        lknee = j.get('leftKnee', 0)
        rknee = j.get('rightKnee', 0)
        # When knee is very bent (>90), foot is likely plantarflexed
        if lknee > 90 and j.get('leftAnkle', 0) == 0:
            j['leftAnkle'] = -35   # plantarflexion
            improvements += 1
        if rknee > 90 and j.get('rightAnkle', 0) == 0:
            j['rightAnkle'] = -35
            improvements += 1

    # --- Rule 4: Add ankle dorsiflexion for high leg raises (arabesque etc.) ---
    if any(k in pid for k in ['arabesque', 'extension', 'kick', 'leap', 'jump']):
        lhip = j.get('leftHip', 0)
        rhip = j.get('rightHip', 0)
        # High raised leg: pointed toe = plantarflexion on raised leg
        if lhip > 70 and j.get('leftAnkle', 0) == 0:
            j['leftAnkle'] = -25  # pointed toe
            improvements += 1
        if rhip > 70 and j.get('rightAnkle', 0) == 0:
            j['rightAnkle'] = -25
            improvements += 1
        # Standing leg: slight dorsiflexion for balance
        if lhip > 70 and j.get('rightAnkle', 0) == 0:
            j['rightAnkle'] = 10
            improvements += 1
        if rhip > 70 and j.get('leftAnkle', 0) == 0:
            j['leftAnkle'] = 10
            improvements += 1

    # --- Rule 5: Add ankle plantarflexion for seated/reclining poses ---
    if any(k in pid for k in ['seat', 'chair', 'lounge', 'reclin', 'floor-sit', 'ottoman']):
        if j.get('leftAnkle', 0) == 0 and j.get('leftKnee', 0) > 30:
            j['leftAnkle'] = -15
            improvements += 1
        if j.get('rightAnkle', 0) == 0 and j.get('rightKnee', 0) > 30:
            j['rightAnkle'] = -15
            improvements += 1

    # --- Rule 6: Clamp shoulder raises to valid range ---
    # In new renderer: shoulder - = raise, + = behind back.
    # Out of range positive values (+40 to +80) mean "arm behind body" = intentional, keep
    # But any value > 80 is too extreme for shoulder behind
    if j.get('leftShoulder', 0) > 80:
        j['leftShoulder'] = 80
        improvements += 1
    if j.get('rightShoulder', 0) > 80:
        j['rightShoulder'] = 80
        improvements += 1

    # --- Rule 7: Ballet/dance ankle pointing ---
    if any(k in pid for k in ['ballet', 'pointe', 'dance', 'fineart']):
        lhip = j.get('leftHip', 0)
        rhip = j.get('rightHip', 0)
        if lhip > 60 and j.get('leftAnkle', 0) == 0:
            j['leftAnkle'] = -30
            improvements += 1
        if rhip > 60 and j.get('rightAnkle', 0) == 0:
            j['rightAnkle'] = -30
            improvements += 1

    # --- Rule 8: prone poses — feet plantarflexed ---
    if any(k in pid for k in ['prone', 'lying-face', 'floor-prone']):
        if j.get('leftAnkle', 0) == 0:
            j['leftAnkle'] = -20
            improvements += 1
        if j.get('rightAnkle', 0) == 0:
            j['rightAnkle'] = -20
            improvements += 1

print(f"Improvements applied: {improvements}")

# Count ankle usage now
ankle_use = sum(1 for p in data if p['joints'].get('leftAnkle',0)!=0 or p['joints'].get('rightAnkle',0)!=0)
hips_use  = sum(1 for p in data if p['joints'].get('hips',0)!=0)
print(f"Poses now using ankle: {ankle_use}")
print(f"Poses now using hips tilt: {hips_use}")

# Write back
with open('/home/user/workspace/pose_qa/poses_full_joints_v2.json', 'w') as f:
    json.dump(data, f, indent=2)
print("Written to poses_full_joints_v2.json")
