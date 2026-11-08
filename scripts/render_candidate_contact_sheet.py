"""Create an internal forensic contact sheet for manually screening photo candidates."""
import asyncio
import argparse
import hashlib
import io
import json
from pathlib import Path

import aiohttp
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT=Path(__file__).resolve().parents[1]
EVID=ROOT/'deliverables/phase2-photo-evidence'
SCRATCH=ROOT/'tmp/pose-photo-review'
SCRATCH.mkdir(parents=True,exist_ok=True)
MANIFEST=json.loads((ROOT/'deliverables/poseart-manifest.json').read_text())
P={p['id']:p for p in MANIFEST['poses']}
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONTB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=ImageFont.truetype(FONT,13);fb=ImageFont.truetype(FONTB,14)


def schematic(p,yaw):
    import math
    out=Image.new('RGB',(210,280),'#f1f5ee');d=ImageDraw.Draw(out)
    theta=math.radians(yaw); co=math.cos(theta);si=math.sin(theta)
    rot={k:(v[0]*co+v[2]*si,v[1]) for k,v in p['skeleton'].items()}
    xx=[a for a,b in rot.values()];yy=[b for a,b in rot.values()]
    scale=min(175/max(.18,max(xx)-min(xx)),225/max(.18,max(yy)-min(yy)))
    cx=(max(xx)+min(xx))/2;cy=(max(yy)+min(yy))/2
    def xy(k):
        a,b=rot[k];return (round(105+(a-cx)*scale),round(129-(b-cy)*scale))
    bones=[('head','neck'),('neck','leftShoulder'),('neck','rightShoulder'),('neck','spine'),('spine','hips'),('leftShoulder','leftElbow'),('leftElbow','leftWrist'),('rightShoulder','rightElbow'),('rightElbow','rightWrist'),('hips','leftHip'),('hips','rightHip'),('leftHip','leftKnee'),('leftKnee','leftAnkle'),('leftAnkle','leftFoot'),('rightHip','rightKnee'),('rightKnee','rightAnkle'),('rightAnkle','rightFoot')]
    for a,b in bones:d.line((xy(a),xy(b)),fill='#26877b' if a.startswith('left') else '#aa853e' if a.startswith('right') else '#115a54',width=5)
    for k in rot:
        x,y=xy(k);d.ellipse((x-3,y-3,x+3,y+3),fill='#f4ecd8',outline='#124e49')
    x,y=xy('head');d.ellipse((x-7,y-7,x+7,y+7),fill='#e5c996',outline='#124e49',width=2)
    d.text((8,256),f'RENDER yaw {yaw} deg',font=f,fill='#34574d')
    return out


async def fetch(session,item):
    try:
        async with session.get(item['thumbnail_url'],timeout=aiohttp.ClientTimeout(total=40)) as res:
            if res.status!=200:return None,'HTTP '+str(res.status)
            raw=await res.read()
            if len(raw)>4_000_000:return None,'file too large'
            image=Image.open(io.BytesIO(raw));image=ImageOps.exif_transpose(image).convert('RGB')
            if image.width<60 or image.height<60:return None,'too small'
            image.thumbnail((210,280))
            return (image,hashlib.sha256(raw).hexdigest()),None
    except Exception as exc:return None,type(exc).__name__


async def main(args):
    rows=json.loads((EVID/'poseart-photo-candidates.json').read_text())['rows']
    included=[r for r in rows if r['candidates']]
    if args.ids:
        selected=set(args.ids.split(','))
        included=[r for r in included if r['pose_id'] in selected]
    else:included=included[:8]
    w=210*8;h=348*len(included)
    sheet=Image.new('RGB',(w,h),'#ffffff');d=ImageDraw.Draw(sheet)
    hashes=[]
    async with aiohttp.ClientSession(trust_env=True,headers={'User-Agent':'PoseArtResearch/0.2 (educational)'}) as s:
        sem=asyncio.Semaphore(5)
        async def limited_fetch(item):
            async with sem:return await fetch(s,item)
        fetch_jobs={r['pose_id']:asyncio.gather(*(limited_fetch(c) for c in r['candidates'][:4])) for r in included}
        for row,rowdata in enumerate(included):
            p=P[rowdata['pose_id']]; y=row*348
            d.rectangle((0,y,w,y+33),fill='#103d3b')
            d.text((10,y+8),p['title']+'  /  '+p['category'],font=fb,fill='#ffffff')
            for j,yaw in enumerate((0,45,90,180)):
                sheet.paste(schematic(p,yaw),(j*210,y+36))
            results=await fetch_jobs[rowdata['pose_id']]
            for j,(c,result) in enumerate(zip(rowdata['candidates'],results)):
                x=(j+4)*210
                data,err=result
                if data:
                    image,digest=data
                    sheet.paste(image,(x+(210-image.width)//2,y+36))
                    hashes.append({'pose_id':p['id'],'file_title':c['file_title'],'sha256':digest,'source':c['landing_page']})
                else:
                    d.rectangle((x,y+36,x+205,y+315),fill='#eee')
                    d.text((x+8,y+150),'FAILED '+str(err),font=f,fill='#aa0000')
                label=c['file_title'][:27]
                d.text((x+4,y+319),label,font=f,fill='#315b53')
                d.text((x+4,y+334),str(c['license'])+' '+str(c['text_score']),font=f,fill='#777')
    label=args.label or 'latest'
    out=SCRATCH/('candidate-contact-sheet-'+label+'.jpg');sheet.save(out,quality=88)
    # Reproducible PDF examples: each row retains four rig views and four photo slots.
    for index in range(len(included)):
        crop=sheet.crop((0,index*348,w,(index+1)*348))
        crop.resize((1200,round(348*1200/w))).save(SCRATCH/f'{label}-row-{index}.jpg',quality=84)
    (SCRATCH/f'download-provenance-{label}.json').write_text(json.dumps(hashes,indent=2))
    print(json.dumps({'sheet':str(out),'reference_rows':len(included),'downloaded_images':len(hashes)},indent=2))

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--ids',default='');ap.add_argument('--label',default='latest')
    asyncio.run(main(ap.parse_args()))
