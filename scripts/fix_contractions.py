#!/usr/bin/env python3
"""Fix remaining contraction-based broken strings: .'re, .'ll, .'ve, .'d, .'t"""
import re, subprocess

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', encoding='utf-8') as f:
    content = f.read()

orig_size = len(content)

# Generic pattern for any contraction break: .'XX where XX = re|ll|ve|d|t|m|ve
def fix_contraction_break(m):
    prefix = m.group(1)
    before_break = m.group(2).rstrip()
    contraction_type = m.group(3)  # re/ll/ve/d/t etc.
    after_break = m.group(4).rstrip()
    
    # The after_break already starts with the contraction word remainder
    # e.g. for .'re: after = "re tilting away from..."
    # For .'t: after = "t hike up..."
    # We want to keep the more complete / longer sentence
    full_after = after_break
    
    if len(full_after) > len(before_break) * 0.8:
        # After is substantial — likely the intended replacement
        chosen = full_after
    else:
        chosen = before_break
    
    return f"{prefix}{chosen}',"

# Match .'XX pattern where XX is a common contraction suffix
pattern = re.compile(
    r"((?:tip|instructions):\s*')"   # group 1
    r"((?:[^'\\]|\\.)*?)"             # group 2: before break
    r"\.'(re|ll|ve|d|t|m) "           # break + group 3: contraction type
    r"((?:[^'\\]|\\.)*?)"             # group 4: after break
    r"',",
    re.DOTALL
)

fixed, n = pattern.subn(fix_contraction_break, content)
print(f"Fixed {n} contraction breaks")

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', 'w', encoding='utf-8') as f:
    f.write(fixed)

# Check syntax
result = subprocess.run(['node', '--check', '/home/user/workspace/poseart-app-v2/js/poses-data.js'],
    capture_output=True, text=True)
if result.returncode == 0:
    print("SYNTAX OK ✓")
    print(f"Size: {orig_size:,} → {len(fixed):,}")
else:
    print("STILL HAS ERROR:")
    print(result.stderr[:300])
