import json, os, shutil, subprocess

src = '/home/user/workspace/poseart-app-v2'
dst = '/tmp/poseart-test'
if os.path.exists(dst): shutil.rmtree(dst)
shutil.copytree(src, dst)

data = json.load(open('/home/user/workspace/zuckerberg_review_p9.json'))

def resolve(f):
    return os.path.join(dst, f.strip())

# Order edits so multi-edit-per-file dependencies apply. Each fix's edits are independent
# against the ORIGINAL; but Z2 and Z3 both insert into AppState at different anchors, and
# Z3/Z6 insertions must not collide. Apply fix-by-fix, edit-by-edit.
failed = []
for fix in data:
    for e in fix['exact_fix']['edits']:
        p = resolve(e['file'])
        c = open(p).read()
        if c.count(e['old_string']) != 1:
            failed.append((fix['id'], e['file'], c.count(e['old_string'])))
            continue
        c = c.replace(e['old_string'], e['new_string'], 1)
        open(p, 'w').write(c)

if failed:
    print('APPLY FAILURES:', failed)
else:
    print('ALL PATCHES APPLIED CLEANLY IN SEQUENCE')

# JS syntax check each JS file
for jsf in ['js/app.js', 'js/camera.js', 'js/poses-data.js']:
    r = subprocess.run(['node', '--check', os.path.join(dst, jsf)], capture_output=True, text=True)
    print(jsf, '->', 'OK' if r.returncode == 0 else 'SYNTAX ERROR\n'+r.stderr)
