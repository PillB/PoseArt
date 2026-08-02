const fs=require('fs'),path=require('path'),sharp=require('sharp');
const BEFORE='audit/avatar-ghost/baseline-before/raw';
const AFTER='audit/avatar-ghost/baseline/raw';
const OUT='audit/avatar-ghost/baseline/contact-sheets';
const POSES=['power-stance','scurve-stand','soft-sit','both-knees','starfish','leap-forward','arms-overhead','face-touch'];
const TILE=200,PAD=10,cols=2,rows=POSES.length;
const W=cols*TILE+PAD*(cols+1), H=rows*TILE+PAD*(rows+1)+20*rows;
(async()=>{
  const comps=[];
  for(let r=0;r<rows;r++){
    for(const [c,fpath,label] of [[0,`${POSES[r]}__avatar__front__160x180.png`,'BEFORE'],[1,`${POSES[r]}__avatar__front__160x180.png`,'AFTER']]){
      const f=path.join(c===0?BEFORE:AFTER,fpath);
      if(!fs.existsSync(f))continue;
      const buf=await sharp(f).resize(TILE,TILE,{fit:'contain',background:{r:244,g:241,b:232,alpha:1}}).toBuffer();
      const x=PAD+c*(TILE+PAD), y=PAD+r*(TILE+PAD)+20;
      comps.push({input:buf,left:x,top:y});
      const lbl='<svg width="'+TILE+'" height="20"><text x="4" y="14" font-family="monospace" font-size="11" font-weight="bold" fill="'+(c===0?'#C9A24C':'#1A6B6A')+'">'+(r===0?label:'')+' '+POSES[r].slice(0,14)+'</text></svg>';
      const lb=await sharp({create:{width:TILE,height:20,channels:4,background:{r:244,g:241,b:232,alpha:1}}}).composite([{input:Buffer.from(lbl),top:0,left:0}]).png().toBuffer();
      comps.push({input:lb,left:x,top:PAD+r*(TILE+PAD)});
    }
  }
  await sharp({create:{width:W,height:H,channels:4,background:{r:244,g:241,b:232,alpha:1}}}).composite(comps).png().toFile(path.join(OUT,'06-before-after-avatar.png'));
  console.log('wrote 06-before-after-avatar.png');
})();
