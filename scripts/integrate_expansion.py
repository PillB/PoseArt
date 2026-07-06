#!/usr/bin/env python3
"""
PoseArt v2 — Full Library Expansion Integration Script
Merges new figures and new poses into the live app files.
"""
import re, sys

# ── STEP 1: Merge new SVG figures into app.js ─────────────────────────────
print("=== STEP 1: Merging 25 new SVG figures into app.js ===")

with open('/home/user/workspace/poseart-app-v2/js/app.js', encoding='utf-8') as f:
    app_js = f.read()

with open('/home/user/workspace/pose_qa/new_figure_types.js', encoding='utf-8') as f:
    new_figs_src = f.read()

# Extract the figure entries block from new_figure_types.js
# Look for entries like: 'key': S(`...`),
# We want everything between the first figure entry and end of the object

# Find all figure entries (key: S(`...`), blocks)
# Extract them as raw text — find from first single-quote key to end of file
# The file has a comment header then entries
lines = new_figs_src.split('\n')
entry_lines = []
in_entry = False
brace_depth = 0
backtick_open = False

for line in lines:
    # Skip comment lines and const declarations
    stripped = line.strip()
    if stripped.startswith('//') and not in_entry:
        continue
    if stripped.startswith('const NEW_FIGURE_TYPES') or stripped == '{':
        continue
    if stripped == '};' and not in_entry:
        continue
    # Keep the entry content
    entry_lines.append(line)

# Clean up: join and extract just the figure entries
entries_raw = '\n'.join(entry_lines)

# Remove the outer object braces if present
entries_raw = entries_raw.strip()
if entries_raw.startswith('{'):
    entries_raw = entries_raw[1:]
if entries_raw.endswith('};') or entries_raw.endswith('}'):
    entries_raw = entries_raw.rstrip().rstrip(';').rstrip('}')
entries_raw = entries_raw.strip()

# Remove trailing comma if any
while entries_raw.endswith(','):
    entries_raw = entries_raw[:-1].strip()

entry_count = entries_raw.count("': S(")
print(f'  Extracted figure entries: {entry_count} entries')

# Insert new figures before the 'default' entry in app.js
# Find the insertion point: just before "    'default': S(`"
insertion_marker = "    'default': S(`"
if insertion_marker not in app_js:
    print("ERROR: Could not find 'default' figure marker in app.js")
    sys.exit(1)

# Format the new entries with proper indentation
# Each entry in new_figure_types.js uses 2-space indent; app.js uses 4-space
formatted_entries = []
for line in entries_raw.split('\n'):
    if line.strip():
        # Add 2 more spaces to match app.js 4-space indent
        formatted_entries.append('  ' + line)
    else:
        formatted_entries.append(line)

insert_block = '\n'.join(formatted_entries).strip()
if not insert_block.endswith(','):
    insert_block += ','

new_app_js = app_js.replace(
    insertion_marker,
    f"\n{insert_block}\n\n{insertion_marker}"
)

# Verify the figure count increased
old_count = app_js.count("': S(`")
new_count = new_app_js.count("': S(`")
print(f"  Figure count: {old_count} → {new_count} (added {new_count - old_count})")

if new_count <= old_count:
    print("ERROR: No new figures were added!")
    sys.exit(1)

with open('/home/user/workspace/poseart-app-v2/js/app.js', 'w', encoding='utf-8') as f:
    f.write(new_app_js)
print(f"  ✓ app.js updated ({len(new_app_js):,} chars)")


# ── STEP 2: Add 6 new categories to POSE_CATEGORIES_RAW in poses-data.js ───
print("\n=== STEP 2: Adding 6 new categories to poses-data.js ===")

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', encoding='utf-8') as f:
    poses_js = f.read()

NEW_CATEGORIES = """
  { id: 'boudoir',     name: 'Boudoir',       emoji: '💋', color: 'linear-gradient(135deg,#7B3854,#C96A8C)', description: 'Sensual, elegant curves-and-triangles posing' },
  { id: 'editorial',  name: 'Editorial',      emoji: '📸', color: 'linear-gradient(135deg,#1A1A2E,#4A3F6B)', description: 'High-fashion angular story-driven poses' },
  { id: 'fine-art',   name: 'Fine Art',       emoji: '🎨', color: 'linear-gradient(135deg,#5C3D11,#A07030)', description: 'Classical ballet and sculpture inspired poses' },
  { id: 'fashion',    name: 'Fashion',        emoji: '👗', color: 'linear-gradient(135deg,#2C2C2C,#6B6B6B)', description: 'Runway, commercial, and power poses' },
  { id: 'low-to-high',name: 'Low to High',   emoji: '⬆️', color: 'linear-gradient(135deg,#0D4A2E,#1E9060)', description: 'Floor-to-standing trajectory and rise poses' },
  { id: 'high-to-low',name: 'High to Low',   emoji: '⬇️', color: 'linear-gradient(135deg,#1A3A5C,#2E6CA0)', description: 'Elevated-to-ground and descent poses' },"""

# Find the closing bracket of POSE_CATEGORIES_RAW
# It ends with "  { id: 'accessible', ... }," then "];"
cat_end_marker = "];  // end POSE_CATEGORIES_RAW"
if cat_end_marker not in poses_js:
    # Try alternate ending
    cat_end_marker = "\n];\n"
    # Find the first "];" after POSE_CATEGORIES_RAW
    cat_start = poses_js.find('const POSE_CATEGORIES_RAW = [')
    cat_end_idx = poses_js.find('];', cat_start)
    if cat_end_idx == -1:
        print("ERROR: Could not find POSE_CATEGORIES_RAW closing bracket")
        sys.exit(1)
    # Insert before the closing ];
    poses_js = poses_js[:cat_end_idx] + NEW_CATEGORIES.rstrip(',') + '\n' + poses_js[cat_end_idx:]
else:
    poses_js = poses_js.replace(cat_end_marker, NEW_CATEGORIES + '\n' + cat_end_marker)

# Verify categories added
cat_count = poses_js.count("{ id: '")
print(f"  Category entries found: {cat_count} (should be 16)")


# ── STEP 3: Append new poses to POSES_LIBRARY ────────────────────────────
print("\n=== STEP 3: Appending 180 new poses to POSES_LIBRARY ===")

with open('/home/user/workspace/pose_qa/new_poses_data.js', encoding='utf-8') as f:
    new_poses_src = f.read()

# Extract just the pose entries from NEW_POSE_ADDITIONS
match = re.search(r'const NEW_POSE_ADDITIONS = \{([\s\S]+)\};?\s*$', new_poses_src)
if not match:
    print("ERROR: Could not find NEW_POSE_ADDITIONS object")
    sys.exit(1)
pose_entries = match.group(1).strip()

# Find end of POSES_LIBRARY object in poses-data.js
# It ends with: };  or }; // end POSES_LIBRARY
# Find the last '};' that closes POSES_LIBRARY
poses_lib_start = poses_js.find('const POSES_LIBRARY = {')
if poses_lib_start == -1:
    print("ERROR: Could not find POSES_LIBRARY in poses-data.js")
    sys.exit(1)

# Find the closing }; of POSES_LIBRARY
# It's the last one in the file before auto-computed section
# Look for the comment that follows POSES_LIBRARY
lib_end_marker = '\n};\n\n// ── AUTO-COMPUTED'
if lib_end_marker not in poses_js:
    # Try alternate
    lib_end_marker = '\n};\n\n// ── CATEGORY'
if lib_end_marker not in poses_js:
    # Find the closing }; by looking at structure
    # POSES_LIBRARY ends, then there's auto-computed section
    # Let's find "// ── AUTO-COMPUTED" or "// ── CATEGORY COUNTS"
    auto_marker = poses_js.find('\n// ── AUTO-COMPUTED')
    if auto_marker == -1:
        auto_marker = poses_js.find('\n// Auto-compute')
    if auto_marker == -1:
        # Just find the last }; in the file
        last_close = poses_js.rfind('\n};')
        insert_before = last_close
    else:
        # Find the }; just before this comment
        insert_before = poses_js.rfind('\n};', 0, auto_marker)
    
    # Insert new poses just before the closing };
    section_header = """

  // ══════════════════════════════════════════════════════════════
  // NEW CATEGORIES (Phase 1A Expansion — 2026-07-05)
  // ══════════════════════════════════════════════════════════════
  // ══════════════ BOUDOIR (30) ══════════════
  """
    
    poses_js = (poses_js[:insert_before] + 
                '\n\n  // ══════════════ NEW CATEGORIES (Phase 1A Expansion) ══════════════\n  ' +
                pose_entries.replace('\n', '\n  ') +
                '\n' + poses_js[insert_before:])
else:
    poses_js = poses_js.replace(
        lib_end_marker,
        '\n\n  // ══════════════ NEW CATEGORIES (Phase 1A Expansion) ══════════════\n  ' +
        pose_entries.replace('\n', '\n  ') +
        lib_end_marker
    )

# Verify pose count
old_count_orig = 310  # known from earlier
new_pose_count = poses_js.count("id: '") - 6  # subtract 6 category id: entries
print(f"  Pose count: ~{new_pose_count} (should be ~490)")

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', 'w', encoding='utf-8') as f:
    f.write(poses_js)

file_size = len(poses_js)
print(f"  ✓ poses-data.js updated ({file_size:,} chars)")


# ── STEP 4: Final verification ────────────────────────────────────────────
print("\n=== STEP 4: Final verification ===")

with open('/home/user/workspace/poseart-app-v2/js/app.js', encoding='utf-8') as f:
    final_app = f.read()
with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', encoding='utf-8') as f:
    final_poses = f.read()

fig_count = final_app.count("': S(`")
pose_count = final_poses.count("id: '")
cat_count = final_poses.count("{ id: '")
print(f"  app.js figure types: {fig_count}")
print(f"  poses-data.js total id entries: {pose_count} (poses + categories)")
print(f"  poses-data.js category entries: {cat_count}")
print(f"  app.js file size: {len(final_app):,} chars")
print(f"  poses-data.js file size: {len(final_poses):,} chars")
print("\n✅ Integration complete!")
