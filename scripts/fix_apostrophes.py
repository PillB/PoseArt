#!/usr/bin/env python3
"""
Fix broken apostrophe strings in poses-data.js.
Pattern: the QA merge produced strings like:
  tip: 'Original sentence.'s continuation here.',
which should be:
  tip: 'Continuation here.',
(i.e. the second sentence after the .' was the real intended replacement)

OR: tip: 'Sentence with embedded .'s possession.'
which should drop the duplicate tail.
"""
import re

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', encoding='utf-8') as f:
    content = f.read()

orig = content

# Pattern: inside a JS single-quoted string (tip or instructions),
# there's a .', followed immediately by s (indicating broken mid-string apostrophe)
# Two sub-cases:
# 1. '...end of sentence.'s continuation...',  -> keep only the continuation
# 2. '...word\'s stuff.'s more stuff.',  -> keep first part, drop the broken tail

# Strategy: find tip/instructions: '....'s ...',
# and reconstruct to: tip/instructions: 'cleaned content',

def fix_broken_string(m):
    prefix = m.group(1)   # tip: ' or instructions: '
    before_break = m.group(2)  # content before the .'
    after_break = m.group(3)   # content after 's 
    
    # Decide which part to keep
    # If before_break is very short (< 20 chars) or after_break is much longer, keep after
    # Otherwise keep before_break (it's the real sentence, the tail is a duplicate fragment)
    
    # Remove any trailing period from before_break
    before_clean = before_break.rstrip()
    after_clean = after_break.rstrip()
    
    # If after_break looks like a continuation fragment (starts lowercase or mid-sentence)
    # keep before. If it looks like a full new sentence, prefer the longer/more complete one.
    if len(after_clean) > len(before_clean) * 1.5:
        # after is substantially longer — it's the full replacement
        chosen = after_clean
    else:
        # keep before
        chosen = before_clean
    
    # Make sure no unescaped apostrophes remain
    # chosen = chosen.replace("'", "\\'")  # don't double-escape already-escaped ones
    
    return f"{prefix}{chosen}',"

# Regex: matches (tip|instructions): '(content).'s (more_content)',
# The tricky part: we need to capture up to the broken apostrophe
pattern = re.compile(
    r"((?:tip|instructions):\s*')"  # group 1: prefix
    r"((?:[^'\\]|\\.)*?)"           # group 2: content before the break
    r"\.'s "                         # the break point: period + 's 
    r"((?:[^'\\]|\\.)*?)"           # group 3: content after break
    r"',",                           # closing quote+comma
    re.DOTALL
)

fixed_content, n = pattern.subn(fix_broken_string, content)

print(f"Fixed {n} broken apostrophe patterns")
print(f"Size: {len(content):,} → {len(fixed_content):,}")

with open('/home/user/workspace/poseart-app-v2/js/poses-data.js', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("Saved ✓")

# Verify
import subprocess
result = subprocess.run(['node', '--check', '/home/user/workspace/poseart-app-v2/js/poses-data.js'],
    capture_output=True, text=True)
if result.returncode == 0:
    print("SYNTAX OK ✓")
else:
    print("STILL HAS ERROR:")
    print(result.stderr[:300])
