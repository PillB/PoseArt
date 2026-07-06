import json, os

base = '/home/user/workspace/poseart-app-v2'
data = json.load(open('/home/user/workspace/zuckerberg_review_p9.json'))

# map file labels in edits to real paths
def resolve(fname):
    fname = fname.strip()
    if fname == 'index.html': return os.path.join(base, 'index.html')
    if fname.startswith('js/'): return os.path.join(base, fname)
    if fname.startswith('css/'): return os.path.join(base, fname)
    return os.path.join(base, fname)

caches = {}
def load(p):
    if p not in caches:
        caches[p] = open(p).read()
    return caches[p]

allok = True
for fix in data:
    for e in fix['exact_fix']['edits']:
        f = e['file']
        p = resolve(f)
        if not os.path.exists(p):
            print(f"[MISS FILE] {fix['id']}: {f}")
            allok = False
            continue
        content = load(p)
        cnt = content.count(e['old_string'])
        status = 'OK' if cnt == 1 else ('NONE' if cnt == 0 else f'DUP({cnt})')
        if cnt != 1:
            allok = False
            print(f"[{status}] {fix['id']} -> {f}")
            print('   old_string[:80]=', repr(e['old_string'][:80]))
print('ALL OLD_STRINGS UNIQUE & PRESENT' if allok else 'SOME PATCHES FAILED')
