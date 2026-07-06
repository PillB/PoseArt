#!/usr/bin/env python3
"""
PoseArt — Full Merge Script
1. Extracts refined SVG inner content from all 3 batches
2. Patches each figure in app.js  
3. Merges improved pose text from 3 QA batches into poses-data.js
4. Validates syntax
"""
import re, json, sys

print("=" * 60)
print("STEP 1: Extract refined SVG content from batch files")
print("=" * 60)

# ── BATCH A: has BATCH_A_REFINED dict with backtick string values ──
with open('/home/user/workspace/pose_qa/refined_svgs/batch_a_refined.js', encoding='utf-8') as f:
    batch_a_src = f.read()

# ── BATCH B: has named consts then BATCH_B_REFINED = { 'key': varname, ... } ──
with open('/home/user/workspace/pose_qa/refined_svgs/batch_b_refined.js', encoding='utf-8') as f:
    batch_b_src = f.read()

# ── BATCH C: has BATCH_C_REFINED dict with backtick string values ──
with open('/home/user/workspace/pose_qa/refined_svgs/batch_c_refined.js', encoding='utf-8') as f:
    batch_c_src = f.read()

def extract_backtick_value(src, key):
    """Extract the backtick template literal value for a given key."""
    # Pattern: 'key': `...`, where ... can span multiple lines
    # Use a manual scan to handle nested backticks properly
    pattern = re.escape(f"'{key}':") + r'\s*`'
    m = re.search(pattern, src)
    if not m:
        return None
    start = m.end()  # position after the opening backtick
    # Scan for the closing backtick (not preceded by \)
    depth = 0
    i = start
    while i < len(src):
        c = src[i]
        if c == '\\':
            i += 2  # skip escaped char
            continue
        if c == '`':
            # Found closing backtick
            return src[start:i].strip()
        i += 1
    return None

def extract_const_backtick(src, varname):
    """Extract value of `const varname = \`...\`` """
    pattern = rf'const {re.escape(varname)}\s*=\s*`'
    m = re.search(pattern, src)
    if not m:
        return None
    start = m.end()
    i = start
    while i < len(src):
        c = src[i]
        if c == '\\':
            i += 2
            continue
        if c == '`':
            return src[start:i].strip()
        i += 1
    return None

# Extract all refined SVGs
refined = {}

# Batch A keys
batch_a_keys = [
    'boudoir-recline','boudoir-drape','boudoir-seated-knee','boudoir-prone-elbow','boudoir-lying-arch',
    'editorial-angular','editorial-lean-far','editorial-floor-reach','editorial-twist','editorial-contort'
]
for key in batch_a_keys:
    val = extract_backtick_value(batch_a_src, key)
    if val:
        refined[key] = val
        print(f"  ✓ {key} ({len(val)} chars)")
    else:
        print(f"  ✗ MISSING: {key}")

# Batch B keys — uses named consts mapped in BATCH_B_REFINED
batch_b_mapping = {
    'fine-art-arabesque': 'arabesque',
    'fine-art-contrapposto': 'contrapposto',
    'fine-art-odalisque': 'odalisque',
    'fine-art-pietà': 'pieta',
    'fine-art-balance': 'balance',
    'fashion-power': 'fashionPower',
    'fashion-turn': 'fashionTurn',
    'fashion-stomp': 'fashionStomp',
    'fashion-overshoot': 'fashionOvershoot',
}
for key, varname in batch_b_mapping.items():
    val = extract_const_backtick(batch_b_src, varname)
    if val:
        refined[key] = val
        print(f"  ✓ {key} (via {varname}, {len(val)} chars)")
    else:
        print(f"  ✗ MISSING: {key} (varname={varname})")

# Batch C keys
batch_c_keys = [
    'low-high-crouch','low-high-kneel-rise','high-low-descent',
    'low-high-floor','high-low-over-shoulder','high-low-floor-reach'
]
for key in batch_c_keys:
    val = extract_backtick_value(batch_c_src, key)
    if val:
        refined[key] = val
        print(f"  ✓ {key} ({len(val)} chars)")
    else:
        print(f"  ✗ MISSING: {key}")

print(f"\nTotal refined figures extracted: {len(refined)}/25")
if len(refined) < 20:
    print("ERROR: Too many missing figures — aborting")
    sys.exit(1)


print("\n" + "=" * 60)
print("STEP 2: Patch app.js with refined SVG figures")
print("=" * 60)

with open('/home/user/workspace/poseart-app-v2/js/app.js', encoding='utf-8') as f:
    app_js = f.read()

orig_size = len(app_js)
patched = 0
failed = []

for key, new_inner in refined.items():
    # Find the existing figure entry: 'key': S(`...`),
    # Extract current inner content
    pattern = re.escape(f"'{key}':") + r'\s*S\(`'
    m = re.search(pattern, app_js)
    if not m:
        print(f"  ✗ NOT FOUND in app.js: '{key}'")
        failed.append(key)
        continue
    
    # Find the matching closing `),
    start_inner = m.end()
    i = start_inner
    depth = 0
    while i < len(app_js):
        c = app_js[i]
        if c == '\\':
            i += 2
            continue
        if c == '`':
            end_inner = i
            break
        i += 1
    else:
        print(f"  ✗ Could not find closing backtick for: '{key}'")
        failed.append(key)
        continue
    
    old_inner = app_js[start_inner:end_inner]
    app_js = app_js[:start_inner] + '\n    ' + new_inner + '\n    ' + app_js[end_inner:]
    patched += 1
    print(f"  ✓ Patched: {key} ({len(old_inner)} → {len(new_inner)} chars)")

print(f"\nPatched: {patched}/{len(refined)} figures")
if failed:
    print(f"Failed: {failed}")

new_size = len(app_js)
print(f"app.js size: {orig_size:,} → {new_size:,} chars ({new_size-orig_size:+,})")

with open('/home/user/workspace/poseart-app-v2/js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("app.js saved ✓")


print("\n" + "=" * 60)
print("STEP 3: Merge improved pose text into poses-data.js")
print("=" * 60)

# Load all 3 QA batches
all_improved = {}
total_loaded = 0
for i in [1, 2, 3]:
    path = f'/home/user/workspace/pose_qa/pose_text_qa_batch{i}.json'
    try:
        with open(path, encoding='utf-8') as f:
            batch = json.load(f)
        for pose in batch:
            if 'id' in pose:
                all_improved[pose['id']] = pose
        total_loaded += len(batch)
        print(f"  Batch {i}: {len(batch)} poses loaded")
    except Exception as e:
        print(f"  ✗ Batch {i} error: {e}")

print(f"Total improved poses loaded: {len(all_improved)}")

# Now patch poses-data.js — replace instructions and tip for each pose
with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', encoding='utf-8') as f:
    poses_js = f.read()

orig_poses_size = len(poses_js)
text_patched = 0
text_failed = []

for pose_id, improved in all_improved.items():
    new_instructions = improved.get('instructions', '').replace("'", "\\'").replace('\n', ' ').strip()
    new_tip = improved.get('tip', '').replace("'", "\\'").replace('\n', ' ').strip()
    
    if not new_instructions or not new_tip:
        continue
    
    # Find the pose block for this ID
    # Pattern: id: 'pose-id' ... instructions: '...' ... tip: '...'
    # We need to replace instructions and tip values for this specific pose
    
    # Find block start by locating id: 'pose-id'
    id_pattern = rf"id:\s*'{re.escape(pose_id)}'"
    id_m = re.search(id_pattern, poses_js)
    if not id_m:
        text_failed.append(pose_id)
        continue
    
    # Find instructions: '...' within next 800 chars after id
    block_start = id_m.start()
    block_end = min(block_start + 800, len(poses_js))
    block = poses_js[block_start:block_end]
    
    # Replace instructions value
    inst_m = re.search(r"instructions:\s*'([^']*(?:\\'[^']*)*)'", block)
    if inst_m:
        old_inst = inst_m.group(0)
        new_inst = f"instructions: '{new_instructions}'"
        poses_js = poses_js[:block_start] + block.replace(old_inst, new_inst, 1) + poses_js[block_end:]
        # Recalculate block_end after replacement
        delta = len(new_inst) - len(old_inst)
        block_end += delta
        block_start_new = block_start
        block = poses_js[block_start_new:block_end]
    
    # Replace tip value
    tip_m = re.search(r"tip:\s*'([^']*(?:\\'[^']*)*)'", block)
    if tip_m:
        old_tip = tip_m.group(0)
        new_tip_str = f"tip: '{new_tip}'"
        poses_js = poses_js[:block_start] + block.replace(old_tip, new_tip_str, 1) + poses_js[block_end:]
        text_patched += 1
    
text_patched_final = text_patched
print(f"  Pose text patched: {text_patched_final}")
if text_failed:
    print(f"  Failed to find: {len(text_failed)} poses")

new_poses_size = len(poses_js)
print(f"poses-data.js: {orig_poses_size:,} → {new_poses_size:,} chars ({new_poses_size-orig_poses_size:+,})")

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', 'w', encoding='utf-8') as f:
    f.write(poses_js)
print("poses-data.js saved ✓")


print("\n" + "=" * 60)
print("STEP 4: Syntax validation")
print("=" * 60)
import subprocess

for fname, fpath in [('app.js', '/home/user/workspace/poseart-app-v2/js/app.js'),
                      ('poses-data.js', '/home/user/workspace/poseart-app-v2/js/poses-data.js')]:
    result = subprocess.run(['node', '-e', 
        f"const fs=require('fs'); try{{new Function(fs.readFileSync('{fpath}','utf8')); console.log('{fname}: OK');}} catch(e){{console.log('{fname}: ERROR',e.message.slice(0,80));}}"],
        capture_output=True, text=True)
    print(' ', result.stdout.strip())
    if result.stderr.strip():
        print('  STDERR:', result.stderr.strip()[:80])

print("\n✅ MERGE COMPLETE")
