"""Generate a compact, vector-illustrated PoseArt research report from the manifest.

The full 745-pose inventory and four views per pose live in the HTML/CSV.
This PDF communicates findings, evidence limitations, and category examples.
"""
import json
import math
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'deliverables'
M = json.loads((OUT / 'poseart-manifest.json').read_text())
P = {p['id']: p for p in M['poses']}
CATS = M['categories']
W, H = letter
LEFT, RIGHT, TOP, BOTTOM = 48, 48, 51, 50
CW = W - LEFT - RIGHT
INK = colors.HexColor('#123A39')
TEAL = colors.HexColor('#176C67')
GOLD = colors.HexColor('#AA853E')
MUTED = colors.HexColor('#526D69')
PALE = colors.HexColor('#F4F6F2')
SAND = colors.HexColor('#F9F5EA')
LINE = colors.HexColor('#D6DDD5')

FONT_BASE = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONT_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FONT_SERIF = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
pdfmetrics.registerFont(TTFont('DV', FONT_BASE))
pdfmetrics.registerFont(TTFont('DV-Bold', FONT_BOLD))
pdfmetrics.registerFont(TTFont('DV-Serif', FONT_SERIF))

STYLES = {
    'body': ParagraphStyle('body', fontName='DV',fontSize=9.2, leading=14, textColor=INK, spaceAfter=0, allowWidows=0, allowOrphans=0),
    'small': ParagraphStyle('small',fontName='DV',fontSize=8.2,leading=12,textColor=INK),
    'tiny': ParagraphStyle('tiny',fontName='DV',fontSize=7.4,leading=10.6,textColor=INK),
}

dest = OUT / 'poseart-research-report.pdf'
c = canvas.Canvas(str(dest), pagesize=letter, pageCompression=1)
c.setTitle('PoseArt Complete Inventory and Four-View Research Audit')
c.setAuthor('PoseArt Research Audit')
page_number = 0


def para(s, x, y, width=CW, kind='body', spacing=9):
    p = Paragraph(s, STYLES[kind])
    _, h = p.wrap(width, 1000)
    p.drawOn(c, x, y - h)
    return y - h - spacing


def header(section='RESEARCH REPORT'):
    global page_number
    page_number += 1
    c.setFillColor(INK)
    c.rect(0,H-20,W,20,fill=1,stroke=0)
    c.setFont('DV-Bold',7.7)
    c.setFillColor(TEAL)
    c.drawString(LEFT,H-42,'POSEART  /  POSE REFERENCE RESEARCH')
    c.setFont('DV',7.5)
    c.drawRightString(W-RIGHT,H-42,section)
    c.setStrokeColor(LINE)
    c.line(LEFT,39,W-RIGHT,39)
    c.setFont('DV',7.4)
    c.setFillColor(MUTED)
    c.drawString(LEFT,27,'Source commit '+M['sourceCommit'][:12]+'  |  5 November 2026')
    c.drawRightString(W-RIGHT,27,f'{page_number:02d}')


def title(t, y=H-76, size=24):
    c.setFillColor(INK)
    c.setFont('DV-Serif',size)
    c.drawString(LEFT,y,t)
    return y-size-13


def section(t,y):
    c.setFont('DV-Bold',11)
    c.setFillColor(TEAL)
    c.drawString(LEFT,y,t)
    return y-20


def bullet(text,y,level=0):
    x=LEFT+8+level*12
    c.setFillColor(GOLD);c.circle(x,y-6,2.4,fill=1,stroke=0)
    return para(text,x+11,y,CW-(x-LEFT)-11,kind='small',spacing=8)


def box(x,y,w,h,fill=PALE):
    c.setFillColor(fill);c.setStrokeColor(LINE)
    c.roundRect(x,y,w,h,7,stroke=1,fill=1)


def stat(x,y,w,number,label):
    box(x,y,w,68)
    c.setFillColor(TEAL);c.setFont('DV-Serif',25)
    c.drawString(x+12,y+34,str(number))
    c.setFont('DV',7.7);c.setFillColor(MUTED)
    c.drawString(x+12,y+13,label)


def diagram(p, yaw, x, y, width, height, caption):
    c.setFillColor(PALE);c.setStrokeColor(LINE)
    c.roundRect(x,y,width,height,6,stroke=1,fill=1)
    skel = p['skeleton']
    theta = math.radians(yaw)
    co,si=math.cos(theta),math.sin(theta)
    rot={k:(v[0]*co+v[2]*si,v[1]) for k,v in skel.items()}
    xmin=min(v[0] for v in rot.values());xmax=max(v[0] for v in rot.values())
    ymin=min(v[1] for v in rot.values());ymax=max(v[1] for v in rot.values())
    scale=min((width-18)/max(.18,xmax-xmin),(height-32)/max(.18,ymax-ymin))
    cx=(xmin+xmax)/2;cy=(ymin+ymax)/2
    def xy(k):
        a,b=rot[k]
        return (x+width/2+(a-cx)*scale,y+height/2+5+(b-cy)*scale)
    bones=[('head','neck'),('neck','leftShoulder'),('neck','rightShoulder'),('neck','spine'),('spine','hips'),
           ('leftShoulder','leftElbow'),('leftElbow','leftWrist'),('rightShoulder','rightElbow'),('rightElbow','rightWrist'),
           ('hips','leftHip'),('hips','rightHip'),('leftHip','leftKnee'),('leftKnee','leftAnkle'),('leftAnkle','leftFoot'),
           ('rightHip','rightKnee'),('rightKnee','rightAnkle'),('rightAnkle','rightFoot')]
    for a,b in bones:
        c.setStrokeColor(colors.HexColor('#329085') if a.startswith('left') else GOLD if a.startswith('right') else TEAL)
        c.setLineWidth(3.1);c.setLineCap(1)
        x1,y1=xy(a);x2,y2=xy(b);c.line(x1,y1,x2,y2)
    c.setFillColor(colors.HexColor('#FFF8E8'));c.setStrokeColor(INK)
    for k in rot:
        px,py=xy(k);c.circle(px,py,1.6,stroke=1,fill=1)
    px,py=xy('head');c.setFillColor(colors.HexColor('#EAD5AD'));c.circle(px,py,4.7,stroke=1,fill=1)
    c.setFillColor(MUTED);c.setFont('DV',7.2)
    c.drawCentredString(x+width/2,y+6,f'{caption}  ({yaw} deg)')


# COVER
header('COVER')
c.setFillColor(SAND);c.rect(0,H-425,W,355,fill=1,stroke=0)
c.setFont('DV-Bold',10);c.setFillColor(GOLD);c.drawString(LEFT,650,'SOURCE-CONTROLLED RESEARCH EDITION')
c.setFont('DV-Serif',34);c.setFillColor(INK);c.drawString(LEFT,594,'PoseArt')
c.setFont('DV-Serif',25);c.drawString(LEFT,557,'Pose Inventory and Visual Atlas')
para('Complete current-catalog count, documentation inventory, four-view geometry diagrams, and a sourced plan for independent photo validation.',LEFT,525,CW,kind='body')
stat(LEFT,410,120,745,'existing poses');stat(LEFT+132,410,120,16,'categories');stat(LEFT+264,410,120,'2,980','generated diagrams');stat(LEFT+396,410,120,M['counts']['matchingGifs'],'matched GIFs')
y=374
y=para('<b>Scope:</b> GitHub repository <b>PillB/PoseArt</b>, master commit <b>'+M['sourceCommit'][:12]+'</b>. The accompanying interactive HTML contains all 745 titles, descriptions, and four projections each. The CSV and JSON provide audit-ready records.',LEFT,y)
y=para('<b>Important:</b> the four diagrams per pose are generated from one authored rig. They are not four independently sourced photographs. No third-party reference photographs have been downloaded, copied, or represented as approved. Eight new pose candidates remain review-gated.',LEFT,y)
y=para('<b>Decision:</b> retain the existing runtime count while resolving duplicated two-person geometry, reference provenance, and anatomy/sign-off gates. Do not promote new poses from prose to live 3D targets without those checks.',LEFT,y)
c.showPage()

# EXECUTIVE / RESULTS
header('EXECUTIVE FINDINGS')
y=title('What the audit establishes')
y=para('This is a reproducible catalog audit, not a claim that every one of the 745 poses is anatomically perfect. The existing JS registry determines the current category and pose count; historical documents and orphaned image assets are tracked separately.',LEFT,y)
y=section('Validated counts',y)
for label,note in [
 ('745 current entries / 745 unique IDs','All entries have a title, instruction string, and joint-angle dictionary.'),
 ('16 categories','Counts are obtained by grouping live pose.category IDs.'),
 (str(M['counts']['matchingGifs']+M['counts']['unmatchedGifAssets'])+' GIF files / '+str(M['counts']['matchingGifs'])+' exact pose ID matches','All current poses have an exact GIF filename match; '+str(M['counts']['unmatchedGifAssets'])+' extra GIFs are unmatched historical or alternate assets.'),
 ('2,980 generated views','Front, three-quarter, side, and rear vector projections for every existing pose.'),
 ('267 Markdown / 3 DOCX / 0 PDF','Repository-tree inventory of tracked documentation formats; includes historical forensic notes.')]:
    y=bullet('<b>'+label+'</b> - '+note,y)
y=section('Cross-validation with earlier audit',y-2)
y=para('The repository baseline of 1 August 2026 reported <b>513 of 745</b> poses with one or more geometry warnings, including 115 major semantic warnings. Re-running the current audit against commit '+M['sourceCommit'][:12]+' yields <b>440 poses</b> with warnings: 665 plausibility flags, 497 geometric anomalies, and three minor keyword-matching false positives. There are no major semantic warnings in that current heuristic run. These numbers are not directly evidence of photographic correctness.',LEFT,y)
y=section('Principal release risk',y)
y=para('Six exact joint-signature groups involve 28 pose records. One group alone includes 17 couple records with the same legacy single-body joint dictionary. A single figure cannot independently demonstrate two people, support contacts, or the timing of interaction. The newer couple-scene schema requires per-person geometry and human sign-off; its separate validation status must be respected.',LEFT,y)
c.showPage()

# CATEGORY TABLE
header('TAXONOMY')
y=title('All 16 current categories')
y=para('The original data definitions and runtime-derived counts agree exactly. The chart below is the exhaustive top-level taxonomy; detailed names and instructions are in the companion atlas and CSV.',LEFT,y)
rowH=30; top=y-3
for i,cat in enumerate(CATS):
    yy=top-i*rowH
    if i%2==0: c.setFillColor(PALE);c.rect(LEFT,yy-rowH+1,CW,rowH,fill=1,stroke=0)
    c.setFont('DV',9);c.setFillColor(INK)
    c.drawString(LEFT+12,yy-19,cat['name'].replace('—','-'))
    c.setFont('DV-Bold',9);c.setFillColor(TEAL);c.drawRightString(W-RIGHT-15,yy-19,str(cat['count']))
y=top-len(CATS)*rowH-24
y=para('<b>Total:</b> 745. Boudoir contributes 161 entries (21.6%); Seated 86 (11.5%); Reclining 56 (7.5%). These are volume measures, not coverage or quality scores.',LEFT,y)
c.showPage()

# ISSUES
header('ISSUE LEDGER')
y=title('Findings and root causes')
items=[
 ('P0 / evidence','Independent photos absent for per-pose approval','Generated schematic views and PoseArt GIFs share the same source geometry; they cannot independently prove that a body could perform the specified pose.','Collect 3-4 independent candidate photographs per pose, rights/provenance, human review, and held-out validation.'),
 ('P0 / two people','Couple records reuse single-person joint signatures','A legacy single-body rig has no second root transform or inter-person contacts; identical data can encode different prose only.','Use the newer two-person scene model, role assignment, contacts, and per-person render validations.'),
 ('P1 / duplicate semantics','Six joint-signature groups affect 28 entries','Names and descriptions proliferated without guaranteed geometric differentiation.','Check duplicates for genuine variants, then separate geometry or consolidate alias IDs after migration review.'),
 ('P1 / asset mapping',str(M['counts']['unmatchedGifAssets'])+' extra historical GIFs','All live pose IDs match GIF files, including the accented danaid name after Unicode-safe Git path parsing; '+str(M['counts']['unmatchedGifAssets'])+' extra GIFs are unreferenced.','Keep a reviewed archive inventory of extras and preserve Unicode-safe filename handling.'),
 ('P1 / documentation drift','Older handoff says 761 poses','Historical summary and current live data were edited on different schedules.','Make the live registry the source of count truth, then regenerate summaries automatically.'),
 ('P1 / test oracle','Heuristic warnings are not ground truth','Regex claim extraction produced three false kneeling warnings for standing pose descriptions.','Combine geometry, visualization, real references, human review, and separate false-positive adjudication.'),
]
for pr,hyp,why,fix in items:
    if y<140: c.showPage();header('ISSUE LEDGER CONTINUED');y=H-78
    y=section(pr+'  '+hyp,y)
    y=para('<b>Cause:</b> '+why,LEFT,y,kind='small',spacing=5)
    y=para('<b>Correction:</b> '+fix,LEFT,y,kind='small',spacing=13)
c.showPage()

# VALIDATION MODEL
header('REFERENCE RESEARCH PROTOCOL')
y=title('What four real references require')
y=para('The present atlas satisfies the four-view <b>technical diagram</b> requirement for all 745 poses, but it does not fulfill four independent <b>photographic examples</b> per pose. An honest evidence gate must treat these as separate deliverables.',LEFT,y)
for h,t in [
 ('1  Source discovery','Find 3-4 genuinely different photographs, frames, sculptures or instructional images per pose. Prefer original photographers, educational resources, museums, or appropriately licensed archives. Record exact source URL, creator, title, license, access date, and pose relevance.'),
 ('2  Deduplication and matching','Reject mirrored/reposted duplicates, AI-generated examples masquerading as photographs, and images showing merely a broadly similar category. Score joint/limb configuration, contacts, gaze, supports, camera angle and context.'),
 ('3  Rights and consent','Link third-party images unless permissions allow redistribution. Do not package photos in an app or this report without rights. Boudoir examples require special consideration of consent, adult subjects and privacy; disability imagery should be respectful and subject-directed.'),
 ('4  Geometry validation','Annotate keypoints and contacts for accepted images, compare them against the rig and all four rendered views, and use held-out examples not involved in fitting. Check neutral body-proportion assumptions and negative-space cues.'),
 ('5  Human sign-off and rollout','Reviewers accept pose descriptions, anatomy, comfort, supported transitions, camera framing, and two-person roles. Version the evidence and only then activate a candidate in the live catalog, with regression tests and an asset fallback.')]:
    y=section(h,y)
    y=para(t,LEFT,y,kind='small',spacing=14)
c.showPage()

# 16 representative category pages
examples={
 'standing':'contrapposto','seated':'soft-sit','leaning':'wall-lean',
 'lean-seat':'elbow-prop','kneeling':'both-knees','reclining':'back-angel',
 'dynamic':'arabesque-balance','eccentric':'abstract-contortion','couple':'forehead-touch',
 'accessible':'wheelchair-arms','boudoir':'boudoir-aphrodite-knidos',
 'editorial':'editorial-sharp-angles-stand','fine-art':'fineart-contrapposto-classic',
 'fashion':'fashion-power-stance-classic','low-to-high':'lowhigh-one-knee-rising',
 'high-to-low':'highlow-landing-crouch-absorb',
}
for index,cat in enumerate(CATS,1):
    header('CATEGORY '+str(index)+' / 16')
    y=title(cat['name'].replace('—','-'),size=24)
    y=para('<b>'+str(cat['count'])+' existing poses.</b> '+cat['description']+'. The source of truth is the current runtime registry; this page shows one representative rig, not an endorsement of every pose in the category.',LEFT,y,kind='small',spacing=17)
    cp=P.get(examples.get(cat['id'])) or next(p for p in M['poses'] if p['category']==cat['id'])
    y=section('Representative: '+cp['title'],y)
    panelY=y-184
    for j,(angle,label) in enumerate([(0,'Front'),(45,'Three-quarter'),(90,'Side'),(180,'Rear')]):
        diagram(cp,angle,LEFT+j*(CW/4),panelY,CW/4-7,180,label)
    y=panelY-19
    y=para('<b>Pose instructions:</b> '+cp['description'].replace('&','&amp;'),LEFT,y,kind='small',spacing=8)
    y=para('<b>Coaching cue:</b> '+cp['tip'].replace('&','&amp;'),LEFT,y,kind='small',spacing=12)
    y=section('Additional existing examples',y)
    samples=[p for p in M['poses'] if p['category']==cat['id'] and p['id']!=cp['id']][:3]
    for p in samples:
        y=para('<b>'+p['title'].replace('&','&amp;')+'</b> - '+p['description'].replace('&','&amp;'),LEFT,y,kind='tiny',spacing=9)
    if cat['id']=='couple':
        y=para('<b>Limit:</b> The diagram renders a single legacy figure. Partner geometry and contacts are not verified by this view.',LEFT,y,kind='tiny',spacing=8)
    if cat['id']=='accessible':
        y=para('<b>Limit:</b> The skeleton does not depict wheelchair hardware; a wheelchair support/prop scene and subject-led adaptation are required.',LEFT,y,kind='tiny',spacing=8)
    rs=[r['id'] for r in M['research'] if cat['id'] in r['for'] and r['id']!='R12']
    y=para('<b>Category-level research:</b> '+', '.join(rs)+'. Each record still needs per-pose photo validation.',LEFT,max(y,80),kind='tiny')
    c.showPage()

# New candidate pages
for chunk in [M['proposed'][:4],M['proposed'][4:]]:
    header('RESEARCH CANDIDATES')
    y=title('New poses for validation',size=23)
    y=para('The eight ideas below are provisional additions in the research queue, <b>not</b> live pose entries. Each has its own title, description, category, evidence path, and implementation dependencies.',LEFT,y,kind='small',spacing=16)
    for item in chunk:
        y=section(item['name']+'  /  '+item['category'],y)
        y=para(item['description'],LEFT,y,kind='small',spacing=5)
        y=para('<b>Novelty:</b> '+item['why'],LEFT,y,kind='small',spacing=4)
        y=para('<b>Implementation gates:</b> '+', '.join(item['requirements'])+'. <b>Research:</b> '+', '.join(item['sources'])+'.',LEFT,y,kind='tiny',spacing=17)
    c.showPage()

# SOURCES
header('SOURCES AND DOCUMENT COVERAGE')
y=title('Research and provenance',size=23)
y=para('External references were verified as category-level educational or artistic research. Image rights are source-specific, and no external photos were incorporated into this PDF.',LEFT,y,kind='small',spacing=10)
for item in M['research']:
    if y<98: c.showPage();header('SOURCES CONTINUED');y=H-78
    c.setFillColor(TEAL);c.setFont('DV-Bold',8.4)
    c.drawString(LEFT,y-6,item['id'])
    label=item['title']
    if len(label)>75: label=label[:72]+'...'
    c.setFillColor(INK);c.setFont('DV',8.4)
    c.drawString(LEFT+34,y-6,label)
    c.linkURL(item['url'],(LEFT+34,y-9,W-RIGHT,y+6),relative=0)
    y-=26
y-=10
if y<175: c.showPage();header('DOCUMENT COVERAGE');y=H-75
y=section('Repository document inventory',y)
doc=M['docs']['countByType']
y=para(str(doc['md'])+' Markdown files, '+str(doc['docx'])+' Word documents, and '+str(doc['pdf'])+' tracked PDFs. The machine-readable manifest preserves every path. Source-rich documents include docs/research_phase0a.md through research_phase3.md, docs/sota-pose-detection-research.md, the older pose handoff, and three Solarize/overlay recovery DOCX specifications. The last of these requires independent references, provenance, held-out examples, and a human approval gate.',LEFT,y,kind='small',spacing=12)
y=para('The full 745-pose inventory, original instructions, 2,980 generated vector views, heuristic flag counts, GIF paths and eight provisional candidates are supplied in the accompanying HTML, CSV and JSON files.',LEFT,y,kind='small',spacing=10)
c.showPage()
c.save()
print(f'PDF written: {dest}; pages={page_number}; bytes={dest.stat().st_size}')
