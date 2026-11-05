"""Collect real, licensed-source photograph candidates for all current poses.

Only candidate discovery is automatic. Never promote search hits to accepted
pose references without image inspection, explicit rights review, and human
sign-off. This script makes no changes to the production pose library.
"""
import argparse
import asyncio
import csv
import html
import json
import re
import sys
import time
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlencode

import aiohttp

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'deliverables/poseart-manifest.json'
OUT_DIR = ROOT / 'deliverables/phase2-photo-evidence'
API = 'https://commons.wikimedia.org/w/api.php'
AGENT = 'PoseArtResearch/0.2 (pose-reference educational research; see GitHub PillB/PoseArt)'
ALLOWED_MIME = {'image/jpeg', 'image/png', 'image/webp'}
EXCLUDE_EXT = {'.pdf','.ogg','.svg','.tif','.tiff','.gif','.webm','.djvu'}
LICENSE_PATTERN = re.compile(r'\b(?:CC[ -]?(?:BY(?:[ -]SA)?|0)|public domain|PD[- ]|CC[- ]zero)\b',re.I)
STOP = {'a','an','the','of','on','in','to','with','and','for','from','one','two','both',
        'pose','posing','portrait','art','photo','photography','classic','fine','editorial',
        'woman','women','man','male','female','stand','standing','seated','sitting','boudoir',
        'fashion','low','high','look','side','front','back','arms','arm','hands','hand'}
CATEGORY_HINT = {
    'standing':'standing portrait', 'seated':'seated portrait chair',
    'leaning':'leaning wall portrait', 'lean-seat':'seated leaning elbow',
    'kneeling':'kneeling portrait', 'reclining':'reclining portrait',
    'dynamic':'dance movement photo','eccentric':'creative portrait pose',
    'couple':'couple portrait', 'accessible':'wheelchair portrait',
    'boudoir':'fine art portrait', 'editorial':'editorial fashion portrait',
    'fine-art':'sculpture figure', 'fashion':'fashion model',
    'low-to-high':'standing up movement', 'high-to-low':'sitting down movement'
}


def norm(s):
    s = unicodedata.normalize('NFKD', str(s))
    return ''.join(c for c in s if not unicodedata.combining(c)).lower()


def tokens(s):
    return [t for t in re.findall(r'[a-z]{3,}',norm(s)) if t not in STOP]


def clean(s):
    return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]*>',' ',s or ''))).strip()[:300]


def query_for(p):
    # Prefer meaningful posture terms. Numbers in imported archival titles often
    # describe a project batch, rather than an independently searchable pose.
    name = re.sub(r'\b(?:P\d+|S\d+|B\d+)\b','',p['title'],flags=re.I)
    title_words = tokens(name)
    prefix = ' '.join(title_words[:4]) if title_words else p['title']
    return (prefix+' '+CATEGORY_HINT[p['category']]).strip()


def quality_score(p, file_title, metadata_description):
    wanted = set(tokens(p['title']))
    found = set(tokens(file_title+' '+metadata_description))
    intersection = wanted & found
    score = 2.2*len(intersection)
    if len(wanted)>0 and len(intersection)==len(wanted): score += 1.8
    if 'portrait' in norm(file_title): score += .6
    if p['category']=='fine-art' and any(t in norm(file_title) for t in ('statue','sculpture','bronze')):score+=.9
    if any(t in norm(file_title) for t in ('diagram','map','logo','poster','icon','logo','chart','scheme','cover','book')):score-=3.2
    return round(score,2),sorted(intersection)


def source_candidate(page,p,query):
    info=(page.get('imageinfo') or [{}])[0]
    mime=info.get('mime','')
    name=page.get('title','')
    if mime not in ALLOWED_MIME or any(name.lower().endswith(ext) for ext in EXCLUDE_EXT):return None
    ext=info.get('extmetadata') or {}
    license_name=clean(ext.get('LicenseShortName',{}).get('value',''))
    license_url=clean(ext.get('LicenseUrl',{}).get('value',''))
    if not LICENSE_PATTERN.search(license_name):return None
    if not info.get('thumburl') or not info.get('descriptionurl'):return None
    artist=clean(ext.get('Artist',{}).get('value',''))
    description=clean(ext.get('ImageDescription',{}).get('value',''))
    title=name.removeprefix('File:')
    score,common=quality_score(p,title,description)
    # Conservative: unrelated stock images are not assigned as pose refs.
    if score < 1.8:return None
    return {'commons_page_id':page.get('pageid'),
            'file_title':title,'landing_page':info['descriptionurl'],
            'image_url':info.get('url',''), 'thumbnail_url':info['thumburl'],
            'artist':artist,'license':license_name,'license_url':license_url,
            'description':description,'mime':mime,'search_query':query,
            'title_overlap':common,'text_score':score,
            'license_recorded':True,'rights_independently_checked':False,
            'visual_pose_match':'unreviewed','independent_reference_status':'candidate_only'}


async def search(session,sem,p,delay):
    q=query_for(p)
    params={'action':'query','generator':'search','gsrsearch':q,'gsrnamespace':'6',
            'gsrlimit':'20','prop':'imageinfo','iiprop':'url|extmetadata|mime|size',
            'iiurlwidth':'360','format':'json','maxlag':'5'}
    err=None
    async with sem:
        for attempt in range(3):
            if delay: await asyncio.sleep(delay)
            try:
                async with session.get(API,params=params,timeout=aiohttp.ClientTimeout(total=32)) as response:
                    if response.status in (429,500,502,503,504):
                        err='retryable_http_'+str(response.status)
                        await asyncio.sleep(2.0*(attempt+1))
                        continue
                    if response.status!=200:
                        err='http_'+str(response.status);break
                    payload=await response.json(content_type=None)
                    if payload.get('error'):
                        err=str(payload['error'].get('code','api_error'))
                        if err=='maxlag':await asyncio.sleep(3*(attempt+1));continue
                        break
                    pages=list((payload.get('query') or {}).get('pages',{}).values())
                    # Wikimedia API returns pages in page-ID order, not relevance order.
                    pages.sort(key=lambda item:item.get('index',9999))
                    choices=[source_candidate(v,p,q) for v in pages]
                    choices=[v for v in choices if v]
                    unique={}
                    for x in choices:
                        unique.setdefault(x['commons_page_id'],x)
                    found=sorted(unique.values(),key=lambda x:(-x['text_score'],x['file_title']))[:4]
                    return {'pose_id':p['id'],'category':p['category'],'title':p['title'],
                            'description':p['description'],'query':q,
                            'api_total_returned':len(pages),'candidates':found,
                            'candidate_count':len(found),'accepted_reference_count':0,
                            'adjudication_status':'needs_visual_and_rights_review',
                            'query_status':'succeeded'}
            except (asyncio.TimeoutError,aiohttp.ClientError,ValueError) as exc:
                err=type(exc).__name__
                await asyncio.sleep(1.5*(attempt+1))
    return {'pose_id':p['id'],'category':p['category'],'title':p['title'],
            'description':p['description'],'query':q,'api_total_returned':0,
            'candidates':[],'candidate_count':0,'accepted_reference_count':0,
            'adjudication_status':'needs_search_retry','query_status':'failed',
            'error':err}


def export(poses,rows,source_commit):
    idx={r['pose_id']:r for r in rows}
    ordered=[idx.get(p['id'],{'pose_id':p['id'],'category':p['category'],
             'title':p['title'],'description':p['description'],'query':'',
             'candidates':[],'candidate_count':0,'accepted_reference_count':0,
             'adjudication_status':'search_not_attempted','query_status':'not_attempted'})
             for p in poses]
    counts=Counter(r['query_status'] for r in ordered)
    per_cat=defaultdict(lambda:{'total':0,'queried':0,'with_candidates':0,'candidate_images':0,'accepted_images':0})
    for r in ordered:
        d=per_cat[r['category']];d['total']+=1
        d['queried']+=r['query_status']=='succeeded'
        d['with_candidates']+=r['candidate_count']>0
        d['candidate_images']+=r['candidate_count']
        d['accepted_images']+=r['accepted_reference_count']
    summary={'source_commit':source_commit,'target_poses':len(poses),'target_images_min':len(poses)*3,
             'target_images_max':len(poses)*4,'query_status':dict(counts),
             'poses_with_1plus_candidates':sum(r['candidate_count']>0 for r in ordered),
             'poses_with_3plus_candidates':sum(r['candidate_count']>=3 for r in ordered),
             'total_candidate_associations':sum(r['candidate_count'] for r in ordered),
             'total_independently_accepted_images':0,
             'category_coverage':dict(per_cat),
             'search_limitations':'Text and license metadata only; no computer-vision or qualified human visual matching, no assertion that a candidate portrays the named pose.'}
    result={'summary':summary,'rows':ordered}
    (OUT_DIR/'poseart-photo-candidates.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    with (OUT_DIR/'poseart-photo-candidates.csv').open('w',newline='',encoding='utf-8') as f:
        wr=csv.writer(f)
        wr.writerow(['pose_id','category','pose_title','description','query_status','query','candidate_rank','source_file_title','image_source_page','image_url','thumb_url','creator','license','license_url','text_score','visual_match','rights_checked'])
        for row in ordered:
            if not row['candidates']:
                wr.writerow([row['pose_id'],row['category'],row['title'],row['description'],row['query_status'],row['query'],*(['']*11)])
            for i,c in enumerate(row['candidates'],1):
                wr.writerow([row['pose_id'],row['category'],row['title'],row['description'],row['query_status'],row['query'],i,c['file_title'],c['landing_page'],c['image_url'],c['thumbnail_url'],c['artist'],c['license'],c['license_url'],c['text_score'],c['visual_pose_match'],c['rights_independently_checked']])
    (OUT_DIR/'summary.json').write_text(json.dumps(summary,indent=2))
    return summary


async def main(args):
    OUT_DIR.mkdir(parents=True,exist_ok=True)
    manifest=json.loads(MANIFEST.read_text())
    poses=manifest['poses']
    if args.pilot_per_category:
        seen=Counter();selection=[]
        for p in poses:
            if seen[p['category']]<args.pilot_per_category:
                selection.append(p);seen[p['category']]+=1
    else:selection=poses[:args.limit or len(poses)]
    done={}
    checkpoint=OUT_DIR/'candidate-checkpoint.jsonl'
    if checkpoint.exists() and args.resume:
        for ln in checkpoint.read_text().splitlines():
            try:
                row=json.loads(ln);done[row['pose_id']]=row
            except (ValueError,KeyError):continue
    todo=[p for p in selection if p['id'] not in done or (args.retry_failures and done[p['id']]['query_status']=='failed')]
    sem=asyncio.Semaphore(max(1,args.concurrency))
    start=time.monotonic()
    async with aiohttp.ClientSession(trust_env=True,headers={'User-Agent':AGENT}) as session:
        tasks=[asyncio.create_task(search(session,sem,p,args.delay)) for p in todo]
        with checkpoint.open('a',encoding='utf-8') as f:
            for k,future in enumerate(asyncio.as_completed(tasks),1):
                row=await future
                done[row['pose_id']]=row
                f.write(json.dumps(row,ensure_ascii=False)+'\n');f.flush()
                if k%25==0 or k==len(todo):
                    elapsed=round(time.monotonic()-start,1)
                    print(f'processed_new={k}/{len(todo)} total_checkpoint={len(done)} elapsed_s={elapsed}',flush=True)
    summary=export(poses,list(done.values()),manifest['sourceCommit'])
    print(json.dumps(summary,indent=2))


if __name__=='__main__':
    ap=argparse.ArgumentParser()
    ap.add_argument('--limit',type=int,default=745)
    ap.add_argument('--pilot-per-category',type=int,default=0)
    ap.add_argument('--concurrency',type=int,default=4)
    ap.add_argument('--delay',type=float,default=0.05)
    ap.add_argument('--resume',action='store_true')
    ap.add_argument('--retry-failures',action='store_true')
    asyncio.run(main(ap.parse_args()))
