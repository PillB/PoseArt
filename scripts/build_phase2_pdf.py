#!/usr/bin/env python3
"""Create the Phase 2 illustrated photographic adjudication dossier; no pose promotion."""
import html, json, re, textwrap
from collections import Counter
from pathlib import Path
from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'deliverables/phase2-photo-evidence'
PILOT=ROOT/'tmp/pose-photo-review'
M=json.loads((ROOT/'deliverables/poseart-manifest.json').read_text())
CAND=json.loads((OUT/'poseart-photo-candidates.json').read_text())
DEC=json.loads((ROOT/'docs/pose-research/photo-review-decisions.json').read_text())
P={p['pose_id']:p for p in CAND['rows']}
W,H=A4;L=39;IW=W-2*L
K=HexColor('#123d3b');T=HexColor('#176e69');D=HexColor('#263e3a');MUT=HexColor('#637a74');BG=HexColor('#edf4ef');ERR=HexColor('#a14a32')
pdfmetrics.registerFont(TTFont('DejaVu','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuBold','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
dest=OUT/'poseart-phase2-photographic-adjudication.pdf'
c=canvas.Canvas(str(dest),pagesize=A4)
c.setTitle('PoseArt Phase 2 — photographic candidate adjudication')
page=0
def txt(x,y,v,s=9,b=False,color=D):
    c.setFont('DejaVuBold' if b else 'DejaVu',s)
    c.setFillColor(color);c.drawString(x,y,str(v))
def para(x,y,s,width=IW,size=8,lead=12,maxlines=99,color=D):
    for block in str(s).splitlines():
        lines=textwrap.wrap(block,max(20,int(width/(size*.56))),break_long_words=False) or ['']
        for line in lines[:maxlines]:
            txt(x,y,line,size,color=color);y-=lead
    return y
def start(title,subtitle=''):
    global page
    page+=1;c.setFillColor(K);c.rect(0,H-73,W,73,fill=1,stroke=0)
    txt(L,H-31,title,16,True,HexColor('#fffdf7'))
    txt(L,H-53,subtitle,7.6,color=HexColor('#c9e1da'))
    c.setStrokeColor(HexColor('#dae5de'));c.line(L,37,W-L,37)
    txt(L,22,'PoseArt · Phase 2 · 05 Nov 2026 · commit '+M['sourceCommit'][:12],7,color=MUT)
    txt(W-L-21,22,f'{page:02d}',8,True,MUT)
    return H-100
def section(y,s):
    c.setFillColor(BG);c.roundRect(L,y-10,IW,24,5,fill=1,stroke=0)
    txt(L+8,y-3,s,9.5,True,K)
    return y-30
def done():c.showPage()
def strip(y,path):
    im=Image.open(path);dh=im.height*IW/im.width
    c.drawImage(str(path),L,y-dh,width=IW,height=dh)
    return y-dh
def metric(x,y,value,name):
    c.setFillColor(BG);c.roundRect(x,y-67,116,67,6,fill=1,stroke=0)
    txt(x+9,y-33,value,23,True,T)
    para(x+9,y-49,name,99,7.3,10)

# Cover
y=start('POSEART / INDEPENDENT REFERENCES','Research report · all production geometry unchanged')
txt(L,y-15,'Evidence before geometry',23,True,K)
y=para(L,y-43,'The complete 745-pose catalog has been searched. Visual screening exposes metadata false positives, source reuse, and mismatches between several pose names, written instructions, and current skeletal previews.',size=10,lead=17)
y-=30
for i,(v,n) in enumerate([('745','pose IDs searched'),('274','candidate image links'),('231','unique Commons files'),('0','verified photographic refs')]):
    metric(L+128*i,y,v,n)
y-=105
y=section(y,'No promotion to production')
y=para(L,y,'The requirement is 3–4 independent real-person photographs for every one of 745 poses (2,235–2,980 photographs). The current sweep retrieved candidate image links for 116 poses, and only 48 poses have at least three text candidates. Nothing has been accepted as a rights-checked, expert-validated photo reference.',size=9.2,lead=15)
y-=19
y=section(y,'What is in this evidence pack')
for line in [
'• 745 title/description and category records, 2,980 geometry-derived diagrams, 745-row coverage ledger.',
'• 274 item-level source, creator, license and review records with each Wikimedia source URL.',
'• Ten visual case studies: four original yaw views compared with available thumbnail photographs.',
'• Source duplication analysis, rejection reasons and eight new-pose proposals kept out of production.',
]:
    y=para(L,y,line,size=8.7,lead=14)-9
y-=8
y=section(y,'Important distinction')
para(L,y,'An illustrated stick-figure projection, an archive photograph with a keyword match, and a pose-matched, legally reusable reference image are three different evidence types. The first two cannot substitute for the third.',size=8.8,lead=14)
done()

# Category coverage
y=start('CATEGORY-BY-CATEGORY COVERAGE','All queries completed · bars show source candidates, NOT approvals')
txt(L,y,'Category',9,True);txt(L+172,y,'Pose matches',9,True);txt(L+395,y,'Links',9,True);txt(L+466,y,'Approved',9,True)
y-=21
for cat in M['categories']:
    d=CAND['summary']['category_coverage'][cat['id']]
    txt(L,y,cat['name'][:27],8)
    txt(L+172,y,f"{d['with_candidates']}/{d['total']}",8)
    c.setFillColor(BG);c.rect(L+246,y-2,136,8,fill=1,stroke=0)
    c.setFillColor(T);c.rect(L+246,y-2,136*d['with_candidates']/d['total'],8,fill=1,stroke=0)
    txt(L+399,y,d['candidate_images'],8)
    txt(L+489,y,'0',8,True,ERR)
    y-=28
y-=24
y=section(y,'Sparsest evidence zones')
para(L,y,'Editorial, low-to-high and high-to-low produced no metadata-qualified image leads. Accessible yielded one candidate for thirty entries. Boudoir contains 161 catalog poses, but only thirteen have any metadata candidate. No category is photo-verified.',size=8.7,lead=14)
done()

# Funnel / root causes
y=start('RETRIEVAL VS. ACTUAL EVIDENCE','False-positive defenses before any new joint angles enter the app')
y=section(y,'Candidate funnel')
for a,b in [('745','pose IDs and successful searches'),('116','poses with at least one image candidate'),('48','poses with three or four text candidates'),('10','poses manually screened via side-by-side thumbnails'),('2','strong photographic analogues — not exact or approved'),('0','independent rights-and-geometry signoffs')]:
    txt(L+6,y-4,a,15,True,T);txt(L+82,y-2,b,8.8);y-=40
y-=10
y=section(y,'Five repeatable root-cause families')
for h,body in [
('Keyword collision','S-curve → BlackBerry Curve product event; hand-in-hand walk → city riverwalk scenery.'),
('Wrong subject or medium','Contrapposto → building; Degas arabesque → bronze sculpture photographs, not live photographic posing.'),
('Coarse motif vs exact joints','A hand near the chin, prayer kneeling, or a wall lean does not prove the specified ankle, knee, elbow, or support configuration.'),
('Title/instruction inconsistency','Prayer Kneeling requests one-knee forward arm reach; Classic Arabesque requests a sharp twisting crossed-foot turn.'),
('Reused files','274 candidate associations contain only 231 unique Commons file IDs; 35 files were returned for more than one pose.')]:
    txt(L,y,h,8.9,True,K);y-=13
    y=para(L,y,body,size=8.1,lead=12)-10
done()

cases=[
('scurve-stand','pilot1-row-0.jpg'),('wall-lean','pilot1-row-1.jpg'),
('hand-in-pocket','pilot2-row-0.jpg'),('profile-stand','pilot2-row-1.jpg'),
('prayer-kneeling','pilot2-row-2.jpg'),('fineart-classic-arabesque','pilot2-row-3.jpg'),
('contrapposto','pilot3-row-0.jpg'),('chin-rest','pilot3-row-1.jpg'),
('dance-arms-up','pilot3-row-2.jpg'),('hand-in-hand-walk','pilot3-row-3.jpg')]
for i in range(0,len(cases),2):
    y=start(f'PHOTOGRAPHIC TRIAGE / EXAMPLES {i+1}–{i+2}','Each strip: generated 0°, 45°, 90°, 180° rig projections + up to four Commons photographs')
    for pid,fn in cases[i:i+2]:
        p=P[pid];review=DEC['pose_reviews'][pid]
        txt(L,y,p['title']+'  ·  '+p['category'],11.2,True,K)
        txt(L+380,y,f"{len(p['candidates'])} candidates / 0 approved",7.1,color=ERR)
        y-=19
        y=strip(y,PILOT/fn)-13
        txt(L,y,'SCREENING ISSUE',7.7,True,T);y-=13
        y=para(L,y,review['issue'],size=7.7,lead=11)-7
        tall=Counter(review['files'].values())
        y=para(L,y,'Results: '+', '.join(f'{n} {k.replace("_"," ")}' for k,n in sorted(tall.items())),size=7,lead=11,color=MUT)-19
    done()

# Rights & method
y=start('ADJUDICATION METHOD','The acceptance gates are deliberately stricter than the initial Wikimedia text filter')
for h,body in [
('Photographic independence','Use distinct actual photos of relevant people, not synthetic renders, screenshots, artworks, or repeated crops/rotations of one source. Track subject and series so four angles are not mislabeled as four independent references.'),
('Anatomical match','Compare hip and shoulder orientation, spine, support plane, knee bends, hand placement, gaze, weight bearing, balance, two-person role assignment, props, and motion phase. Mark unknown when occluded.'),
('Rights','For each candidate, verify the file page, creator, actual current license and attribution requirements. Wikimedia Commons explicitly warns that source files differ in licensing and may also raise personality/privacy issues.'),
('Accessible posing','Treat aids, contacts, comfort, and participant preference as essential constraints rather than generic joint-angle modifications. Never force an inaccessible body configuration.'),
('Editorial / boudoir','Separate editorial style from pose geometry. Vet source age, consent, context and licensing for sensitive intimate portrait references. No candidate from these categories has been silently promoted.'),
('Release control','Require independent photos, expert review, and separate tested geometry PR. Merely opening a Commons link, generating four schematics, or passing heuristic joint checks cannot approve a pose.')]:
    y=section(y,h);y=para(L,y,body,size=8.7,lead=14)-16
done()

# Proposed additions
for offset in (0,4):
    y=start(f'RESEARCH-ONLY POSE PROPOSALS / {offset+1}–{offset+4}','These titles and instructions are distinct inventory records, NOT members of the 745 live catalog')
    for p in M['proposed'][offset:offset+4]:
        y=section(y,p['name']+'  /  '+p['category'])
        y=para(L+5,y,p['description'],IW-10,8.7,14)-10
        y=para(L+5,y,'Gate: '+', '.join(p['requirements']),IW-10,7.6,12,color=MUT)-26
    done()

# Implementation next steps
y=start('RELEASE BLOCKERS & NEXT REVIEW TRANCHE','No production pose geometry has been edited by this research work')
for h,b in [
('BLOCKED / photo evidence','Find and check a minimum of three distinct exact-match photographs per existing pose, with no duplicate crops counted twice.'),
('BLOCKED / semantic correctness','Resolve name–instructions–render contradictions and contact/props/multi-person modeling limits.'),
('BLOCKED / license, consent, privacy','Every third-party file’s use rights and creator credit must be separately verified; intimate/accessibility photography requires appropriate contextual care.'),
('BLOCKED / qualified reviewer','Human photographic and accessibility/domain signoff required before numeric joint retuning or live catalog changes.')]:
    y=section(y,h);y=para(L,y,b,size=9,lead=15)-20
y-=8
y=section(y,'Reproducible outputs')
for line in [
'1. phase2-evidence-atlas.html: all 745 titled and described poses, four SVG-generated views each, plus candidate image/source cards.',
'2. 745-pose-coverage-ledger.csv: source inventory, candidate count, shortage to target, review and release status.',
'3. candidate-photo-adjudication-ledger.csv: individual image creator/license/source, text score, visual outcome, pending approval.',
'4. source-reuse-and-gates.json: cross-pose source reuse, statuses and acceptance criteria.',
'5. scripts/collect_pose_photo_candidates.py and scripts/build_phase2_evidence.py: deterministic metadata harvesting and report composition.',
]:y=para(L,y,line,size=8.1,lead=13)-12
done()

# Exact thumbnail source credit pages, clickable.
all_credits=[(pid,p) for pid,_ in cases for p in P[pid]['candidates']]
for off in range(0,len(all_credits),12):
    y=start(f'PHOTOGRAPH CREDIT AND PROVENANCE / {off//12+1}','Click the credit line to inspect the original Commons file, author and license')
    for pid,p in all_credits[off:off+12]:
        title=p['file_title'];author=html.unescape(re.sub('<[^>]+>','',str(p['artist']))).strip()
        author=re.sub(r'\s+',' ',author)[:96] or 'Creator unspecified'
        txt(L,y,f"{pid} · {p['license']}",7.6,True,T);y-=12
        y=para(L+6,y,title,IW-8,7.3,10,maxlines=2)
        y=para(L+6,y,'Creator: '+author,IW-8,7,10,maxlines=2,color=MUT)
        c.linkURL(p['landing_page'],(L,y-2,W-L,y+32),relative=0,thickness=0)
        y-=17
    done()

y=start('RESEARCH SOURCE REGISTER','Category-level posing guides help interpretation, but are not interchangeable with per-pose photo approval')
sources=[
('Wikimedia Commons reuse policy','https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia'),
('Library of Congress free-to-use sets','https://www.loc.gov/free-to-use/'),
('Adobe sitting and hand poses','https://www.adobe.com/creativecloud/photography/discover/sitting-poses-and-hand-poses.html'),
('Adobe couple pose techniques','https://www.adobe.com/creativecloud/photography/discover/engagement-photo-poses.html'),
('PPA thoughtful disability portrait sessions','https://www.ppa.com/ppmag/articles/thoughtful-portrait-sessions'),
('PPA posing tricks','https://www.ppa.com/ppmag/articles/posing-tricks')]
for name,url in sources:
    txt(L,y,name,9,True,K);y-=15
    y=para(L,y,url,IW,7.2,11,color=T)-18
    c.linkURL(url,(L,y+12,W-L,y+41),relative=0,thickness=0)
y-=12
y=section(y,'Source repository and associated reference assets')
y=para(L,y,'https://github.com/PillB/PoseArt · pinned source SHA '+M['sourceCommit']+'. The repository includes Markdown and DOCX research material, canonical GIFs and an existing 3D skeleton renderer. The 4-view evidence atlas is the exhaustive per-pose report; this PDF is a bounded visual adjudication dossier.',size=8.7,lead=14)
done()
c.save()
print(json.dumps({'pdf':str(dest),'pages':page,'reviewed_pose_examples':len(cases),'thumbnail_credit_records':len(all_credits)},indent=2))
