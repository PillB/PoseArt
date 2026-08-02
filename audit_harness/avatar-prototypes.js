// audit_harness/avatar-prototypes.js
// Phase D — three ISOLATED avatar-renderer prototypes for comparative review.
// None of these touch the production renderer (js/pose-skeleton-3d.js). They are
// injected into the page at runtime, rendered onto a controlled canvas, and
// captured for A/B/C comparison. The chosen candidate is then ported into
// renderAvatarFrameInternal during the Green phase.
//
// Candidates:
//   1 — jointBlendOnce : current avatar minus per-bone endpoint circles; each
//                        shared joint drawn ONCE as a bisector-aligned ellipse.
//                        (isolates the H1 fix; keeps the current torso)
//   2 — bezierChains   : upper-arm/forearm + thigh/calf as continuous Bézier
//                        contour chains with tangent continuity at elbow/knee.
//                        (isolates the H1 fix via a different technique)
//   3 — neutralRibbons : ribcage + pelvis volumes + structural waist ribbon
//                        (no hourglass), limbs as joint-blend-once capsules,
//                        androgynous oval head without gold eyes.
//                        (full H1+H3+H4 redesign — expected winner)
const fs = require('fs');
const path = require('path');
const flow = require('./lib/pose-flow');

const REPO = path.resolve(__dirname, '..');
const OUT = path.join(REPO, 'audit', 'avatar-ghost', 'prototypes');
fs.mkdirSync(OUT, { recursive: true });

// Injectable renderer module (runs in page). Exposes window.AvatarProto.render(canvas,w,h,joints,opts,candidate).
const PROTO_MODULE = `
(function(){
  function applyCamera(p,yawDeg,pitchDeg){var yaw=yawDeg*Math.PI/180,pitch=pitchDeg*Math.PI/180;var cy=Math.cos(yaw),sy=Math.sin(yaw);var x1=p.x*cy+p.z*sy,z1=-p.x*sy+p.z*cy,y1=p.y;var cp=Math.cos(pitch),sp=Math.sin(pitch);return {x:x1,y:y1*cp-z1*sp,z:y1*sp+z1*cp};}
  function project(p,yaw,pitch,scale,w,h){var r=applyCamera(p,yaw,pitch);var fs=Math.min(w,h)*0.40*scale;return {x:w/2+r.x*fs,y:h/2-r.y*fs,z:r.z};}
  function rgba(hex,a){var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return 'rgba('+r+','+g+','+','+b+','+a+')';}
  function rgbaOk(hex,a){var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return 'rgba('+r+','+g+','+b+','+a+')';}
  var BONES=[['head','neck'],['neck','spine'],['neck','leftShoulder'],['neck','rightShoulder'],['spine','hips'],['leftShoulder','leftElbow'],['leftElbow','leftWrist'],['rightShoulder','rightElbow'],['rightElbow','rightWrist'],['hips','leftHip'],['hips','rightHip'],['leftHip','leftKnee'],['leftKnee','leftAnkle'],['leftAnkle','leftFoot'],['rightHip','rightKnee'],['rightKnee','rightAnkle'],['rightAnkle','rightFoot'],['leftHip','rightHip'],['leftShoulder','rightShoulder']];
  var BW={'head-neck':[7,5],'neck-spine':[9,7],'neck-leftShoulder':[8,5],'neck-rightShoulder':[8,5],'spine-hips':[11,8],'leftShoulder-leftElbow':[6,4],'leftElbow-leftWrist':[4,2.5],'rightShoulder-rightElbow':[6,4],'rightElbow-rightWrist':[4,2.5],'hips-leftHip':[9,7],'hips-rightHip':[9,7],'leftHip-leftKnee':[7,5],'leftKnee-leftAnkle':[5,3],'leftAnkle-leftFoot':[3,2],'rightHip-rightKnee':[7,5],'rightKnee-rightAnkle':[5,3],'rightAnkle-rightFoot':[3,2],'leftHip-rightHip':[10,8],'leftShoulder-rightShoulder':[5.5,4.4]};
  function depthA(z){var t=Math.max(0,Math.min(1,(z+0.8)/1.6));return 0.35+t*0.65;}
  function depthW(z,b){var t=Math.max(0,Math.min(1,(z+0.8)/1.6));return b*(0.45+t*0.85);}
  var COLOR='#0F3B3A', GOLD='#C9A24C';
  function cloneSk(s){var o={};for(var k in s)if(Object.prototype.hasOwnProperty.call(s,k))o[k]={x:s[k].x,y:s[k].y,z:s[k].z};return o;}

  // shared joint -> the two limb bones that meet there (for bisector blend)
  var JOINT_LIMBS={
    leftShoulder:[['neck','leftShoulder'],['leftShoulder','leftElbow']],
    rightShoulder:[['neck','rightShoulder'],['rightShoulder','rightElbow']],
    leftElbow:[['leftShoulder','leftElbow'],['leftElbow','leftWrist']],
    rightElbow:[['rightShoulder','rightElbow'],['rightElbow','rightWrist']],
    leftHip:[['hips','leftHip'],['leftHip','leftKnee']],
    rightHip:[['hips','rightHip'],['rightHip','rightKnee']],
    leftKnee:[['leftHip','leftKnee'],['leftKnee','leftAnkle']],
    rightKnee:[['rightHip','rightKnee'],['rightKnee','rightAnkle']]
  };

  function drawCapsule(ctx,pa,pb,wA,wB,color,alpha){
    var dx=pb.x-pa.x,dy=pb.y-pa.y,len=Math.sqrt(dx*dx+dy*dy);
    if(len<1)return;
    var nx=-dy/len,ny=dx/len;
    ctx.beginPath();
    ctx.moveTo(pa.x+nx*wA,pa.y+ny*wA);
    ctx.lineTo(pb.x+nx*wB,pb.y+ny*wB);
    ctx.lineTo(pb.x-nx*wB,pb.y-ny*wB);
    ctx.lineTo(pa.x-nx*wA,pa.y-ny*wA);
    ctx.closePath();
    var g=ctx.createLinearGradient(pa.x,pa.y,pb.x,pb.y);
    g.addColorStop(0,rgbaOk(color,alpha*0.95));g.addColorStop(1,rgbaOk(color,alpha*0.80));
    ctx.fillStyle=g;ctx.fill();
  }

  // ---- Candidate 1: jointBlendOnce ----
  function cand1(ctx,skel,yaw,pitch,scale,w,h){
    var proj={};for(var k in skel)proj[k]=project(skel[k],yaw,pitch,scale,w,h);
    // torso (current hourglass, kept to isolate the joint fix)
    drawHourglassTorso(ctx,skel,proj);
    // limbs WITHOUT endpoint circles
    var bonesDepth=BONES.map(function(b){var za=applyCamera(skel[b[0]],yaw,pitch).z,zb=applyCamera(skel[b[1]],yaw,pitch).z;return {b:b,d:(za+zb)/2};});
    bonesDepth.sort(function(a,b){return a.d-b.d;});
    for(var i=0;i<bonesDepth.length;i++){
      var a=bonesDepth[i].b[0],b=bonesDepth[i].b[1];
      if(a==='leftShoulder'&&b==='rightShoulder')continue;
      if(a==='neck'&&b==='spine')continue;
      if(a==='spine'&&b==='hips')continue;
      if(a==='leftHip'&&b==='rightHip')continue;
      var pa=proj[a],pb=proj[b];var bw=BW[a+'-'+b]||[5.5,3.5];
      var wA=depthW(pa.z,bw[0])*1.25,wB=depthW(pb.z,bw[1])*0.85;
      drawCapsule(ctx,pa,pb,wA,wB,COLOR,depthA((pa.z+pb.z)/2)*0.88);
    }
    // shared joints drawn ONCE: bisector-aligned ellipse, radius = max(adjacent proximal)*0.9
    for(var j in JOINT_LIMBS){
      var jp=proj[j];if(!jp)continue;var limbs=JOINT_LIMBS[j];
      var dirs=limbs.map(function(l){var a=proj[l[0]],b=proj[l[1]];var dx=b.x-a.x,dy=b.y-a.y,len=Math.sqrt(dx*dx+dy*dy)||1;return {x:dx/len,y:dy/len};});
      // bisector = normalized sum of unit limb directions
      var bx=0,by=0;dirs.forEach(function(d){bx+=d.x;by+=d.y;});
      var blen=Math.sqrt(bx*bx+by*by)||1;bx/=blen;by/=blen;
      var ang=Math.atan2(by,bx);
      var maxW=limbs.reduce(function(m,l){var bw=BW[l[0]+'-'+l[1]]||[5.5,3.5];var w=depthW(jp.z,(l[1]===j)?bw[1]:bw[0]);return Math.max(m,w);},3);
      var r=maxW*0.95;
      ctx.save();ctx.translate(jp.x,jp.y);ctx.rotate(ang);
      ctx.beginPath();ctx.ellipse(0,0,Math.max(r,2),Math.max(r*0.7,1.6),0,0,Math.PI*2);
      ctx.fillStyle=rgbaOk(COLOR,depthA(jp.z)*0.9);ctx.fill();
      ctx.restore();
    }
    drawHead(ctx,skel,proj,true);
    drawNeck(ctx,skel,proj);
  }

  // ---- Candidate 2: bezierChains ----
  function cand2(ctx,skel,yaw,pitch,scale,w,h){
    var proj={};for(var k in skel)proj[k]=project(skel[k],yaw,pitch,scale,w,h);
    drawHourglassTorso(ctx,skel,proj);
    // continuous Bézier contour chains for arms + legs
    var chains=[['leftShoulder','leftElbow','leftWrist'],['rightShoulder','rightElbow','rightWrist'],['leftHip','leftKnee','leftAnkle'],['rightHip','rightKnee','rightAnkle']];
    chains.forEach(function(ch){
      var p0=proj[ch[0]],p1=proj[ch[1]],p2=proj[ch[2]];if(!p0||!p1||!p2)return;
      var bw1=BW[ch[0]+'-'+ch[1]]||[6,4],bw2=BW[ch[1]+'-'+ch[2]]||[4,2.5];
      var wA=depthW(p0.z,bw1[0])*1.2,wM=depthW(p1.z,bw1[1])*0.95,wB=depthW(p2.z,bw2[1])*0.8;
      // tangent at p1 = average of (p1-p0) and (p2-p1)
      var t1x=p1.x-p0.x,t1y=p1.y-p0.y,t2x=p2.x-p1.x,t2y=p2.y-p1.y;
      var tl1=Math.sqrt(t1x*t1x+t1y*t1y)||1,tl2=Math.sqrt(t2x*t2x+t2y*t2y)||1;
      t1x/=tl1;t1y/=tl1;t2x/=tl2;t2y/=tl2;
      var mtx=(t1x+t2x)/2,mty=(t1y+t2y)/2;var mtl=Math.sqrt(mtx*mtx+mty*mty)||1;mtx/=mtl;mty/=mtl;
      // perpendicular
      var nx=-mty,ny=mtx;
      var alpha=depthA((p0.z+p1.z+p2.z)/3)*0.88;
      ctx.beginPath();
      ctx.moveTo(p0.x+nx*wA,p0.y+ny*wA);
      ctx.quadraticCurveTo(p1.x+nx*wM,p1.y+ny*wM,p2.x+nx*wB,p2.y+ny*wB);
      ctx.lineTo(p2.x-nx*wB,p2.y-ny*wB);
      ctx.quadraticCurveTo(p1.x-nx*wM,p1.y-ny*wM,p0.x-nx*wA,p0.y-ny*wA);
      ctx.closePath();
      ctx.fillStyle=rgbaOk(COLOR,alpha);ctx.fill();
    });
    // foot/ankle stubs
    [['leftAnkle','leftFoot'],['rightAnkle','rightFoot']].forEach(function(b){
      var pa=proj[b[0]],pb=proj[b[1]];if(!pa||!pb)return;var bw=BW[b[0]+'-'+b[1]]||[3,2];
      drawCapsule(ctx,pa,pb,depthW(pa.z,bw[0])*0.9,depthW(pb.z,bw[1])*0.7,COLOR,depthA((pa.z+pb.z)/2)*0.85);
    });
    drawHead(ctx,skel,proj,true);drawNeck(ctx,skel,proj);
  }

  // ---- Candidate 3: neutralRibbons (full redesign) ----
  function cand3(ctx,skel,yaw,pitch,scale,w,h){
    var proj={};for(var k in skel)proj[k]=project(skel[k],yaw,pitch,scale,w,h);
    var lSh=skel.leftShoulder,rSh=skel.rightShoulder,spine=skel.spine,hips=skel.hips,lHip=skel.leftHip,rHip=skel.rightHip;
    if(lSh&&rSh&&spine&&hips&&lHip&&rHip){
      var pLSh=proj.leftShoulder,pRSh=proj.rightShoulder,pSp=proj.spine,pHi=proj.hips,pLH=proj.leftHip,pRH=proj.rightHip;
      // ribcage + pelvis as restrained volumes; structural (non-hourglass) waist
      var ribSpan=Math.abs(pRSh.x-pLSh.x);
      var pelSpan=Math.abs(pRH.x-pLH.x);
      var ribW=Math.max(ribSpan*0.62, 6);   // ribcage half-width from rig (no floor 10)
      var pelW=Math.max(pelSpan*0.62, 6.5); // pelvis half-width from rig (no floor 12)
      var waistW=Math.max(0.5*(ribW+pelW)*0.78, 4); // structural waist = avg(rib,pel)*0.78, NOT hip*0.65
      var ribCy=(pLSh.y+pRSh.y)/2*0.6+pSp.y*0.4;
      var ribH=Math.max(Math.abs(pSp.y-ribCy)*0.9, 8);
      var pelCy=pHi.y;
      var pelH=Math.max(pelW*0.5, 5);
      var alpha=depthA((pSp.z+pHi.z)/2)*0.88;
      // ribcage ellipse
      ctx.save();ctx.beginPath();ctx.ellipse((pLSh.x+pRSh.x)/2,ribCy,ribW,ribH,0,0,Math.PI*2);
      ctx.fillStyle=rgbaOk(COLOR,alpha*0.92);ctx.fill();ctx.restore();
      // pelvis ellipse
      ctx.save();ctx.beginPath();ctx.ellipse((pLH.x+pRH.x)/2,pelCy,pelW,pelH,0,0,Math.PI*2);
      ctx.fillStyle=rgbaOk(COLOR,alpha*0.92);ctx.fill();ctx.restore();
      // waist ribbon: tapered quad from ribcage bottom to pelvis top
      var ribBotY=ribCy+ribH*0.7, pelTopY=pelCy-pelH*0.7;
      ctx.save();ctx.beginPath();
      ctx.moveTo((pLSh.x+pRSh.x)/2-waistW,ribBotY);
      ctx.quadraticCurveTo((pLH.x+pRH.x)/2-waistW*0.9,(ribBotY+pelTopY)/2,(pLH.x+pRH.x)/2-waistW*0.95,pelTopY);
      ctx.lineTo((pLH.x+pRH.x)/2+waistW*0.95,pelTopY);
      ctx.quadraticCurveTo((pLH.x+pRH.x)/2+waistW*0.9,(ribBotY+pelTopY)/2,(pLSh.x+pRSh.x)/2+waistW,ribBotY);
      ctx.closePath();ctx.fillStyle=rgbaOk(COLOR,alpha*0.9);ctx.fill();ctx.restore();
      // shoulder slope transitions (subtle, not a yoke bar)
      ctx.save();ctx.beginPath();
      ctx.moveTo(pLSh.x,pLSh.y);ctx.quadraticCurveTo((pLSh.x+pRSh.x)/2,pLSh.y-2,pRSh.x,pRSh.y);
      ctx.lineWidth=Math.max(ribW*0.5,3);ctx.lineCap='round';ctx.strokeStyle=rgbaOk(COLOR,alpha*0.85);ctx.stroke();ctx.restore();
    }
    // limbs: tapered capsules WITHOUT endpoint circles + joint-blend-once
    var bonesDepth=BONES.map(function(b){var za=applyCamera(skel[b[0]],yaw,pitch).z,zb=applyCamera(skel[b[1]],yaw,pitch).z;return {b:b,d:(za+zb)/2};});
    bonesDepth.sort(function(a,b){return a.d-b.d;});
    for(var i=0;i<bonesDepth.length;i++){
      var a=bonesDepth[i].b[0],b=bonesDepth[i].b[1];
      if(a==='leftShoulder'&&b==='rightShoulder')continue;
      if(a==='neck'&&b==='spine')continue;if(a==='spine'&&b==='hips')continue;if(a==='leftHip'&&b==='rightHip')continue;
      var pa=proj[a],pb=proj[b];var bw=BW[a+'-'+b]||[5.5,3.5];
      var wA=depthW(pa.z,bw[0])*1.15,wB=depthW(pb.z,bw[1])*0.8;
      drawCapsule(ctx,pa,pb,wA,wB,COLOR,depthA((pa.z+pb.z)/2)*0.85);
    }
    // joint-blend-once (shared joints)
    for(var j in JOINT_LIMBS){
      var jp=proj[j];if(!jp)continue;var limbs=JOINT_LIMBS[j];
      var dirs=limbs.map(function(l){var aa=proj[l[0]],bb=proj[l[1]];var dx=bb.x-aa.x,dy=bb.y-aa.y,len=Math.sqrt(dx*dx+dy*dy)||1;return {x:dx/len,y:dy/len};});
      var bx=0,by=0;dirs.forEach(function(d){bx+=d.x;by+=d.y;});var blen=Math.sqrt(bx*bx+by*by)||1;bx/=blen;by/=blen;
      var ang=Math.atan2(by,bx);
      var maxW=limbs.reduce(function(m,l){var bw=BW[l[0]+'-'+l[1]]||[5.5,3.5];var w=depthW(jp.z,(l[1]===j)?bw[1]:bw[0]);return Math.max(m,w);},3);
      var r=maxW*0.9;
      ctx.save();ctx.translate(jp.x,jp.y);ctx.rotate(ang);ctx.beginPath();ctx.ellipse(0,0,Math.max(r,2),Math.max(r*0.68,1.5),0,0,Math.PI*2);ctx.fillStyle=rgbaOk(COLOR,depthA(jp.z)*0.88);ctx.fill();ctx.restore();
    }
    drawHead(ctx,skel,proj,false); // androgynous: no gold eyes
    drawNeck(ctx,skel,proj);
  }

  // shared helpers
  function drawHourglassTorso(ctx,skel,proj){
    var lSh=skel.leftShoulder,rSh=skel.rightShoulder,spine=skel.spine,hips=skel.hips,lHip=skel.leftHip,rHip=skel.rightHip;
    if(!lSh||!rSh||!spine||!hips||!lHip||!rHip)return;
    var pLSh=proj.leftShoulder,pRSh=proj.rightShoulder,pSp=proj.spine,pHi=proj.hips,pLH=proj.leftHip,pRH=proj.rightHip;
    var shoulderW=Math.max(Math.abs(pRSh.x-pLSh.x)/2,10);
    var hipW=Math.max(Math.abs(pRH.x-pLH.x)/2,12);
    var waistW=Math.max(hipW*0.65,7);
    ctx.save();ctx.beginPath();
    ctx.moveTo(pRSh.x+shoulderW*0.5,pRSh.y);
    ctx.quadraticCurveTo(pRSh.x+shoulderW*0.3,pSp.y,pHi.x+waistW*0.5,pSp.y);
    ctx.quadraticCurveTo(pRH.x+hipW*0.6,(pSp.y+pHi.y)/2,pRH.x+hipW*0.7,pHi.y);
    ctx.lineTo(pLH.x-hipW*0.7,pHi.y);
    ctx.quadraticCurveTo(pLH.x-hipW*0.6,(pSp.y+pHi.y)/2,pHi.x-waistW*0.5,pSp.y);
    ctx.quadraticCurveTo(pLSh.x-shoulderW*0.3,pSp.y,pLSh.x-shoulderW*0.5,pLSh.y);
    ctx.lineTo(pRSh.x+shoulderW*0.5,pRSh.y);ctx.closePath();
    ctx.fillStyle=rgbaOk(COLOR,depthA((pSp.z+pHi.z)/2)*0.85);ctx.fill();ctx.restore();
  }
  function drawHead(ctx,skel,proj,withEyes){
    if(!skel.head)return;var p=proj.head;var r=10*(0.75+0.5*Math.max(0,Math.min(1,(p.z+0.8)/1.6)));
    ctx.save();ctx.beginPath();ctx.ellipse(p.x,p.y,Math.max(r*0.85,3),Math.max(r*1.1,3.5),0,0,Math.PI*2);
    ctx.fillStyle=rgbaOk(COLOR,depthA(p.z)*0.85);ctx.fill();
    // gold halo (subtle, Art Nouveau)
    ctx.beginPath();ctx.arc(p.x,p.y,r*1.8,0,Math.PI*2);ctx.strokeStyle='rgba(201,162,76,0.18)';ctx.lineWidth=1;ctx.setLineDash([2,4]);ctx.stroke();ctx.setLineDash([]);
    if(withEyes){
      var ex=0.06,ey=0.02,ez=0.07;var hm=skel.head;
      var eL=project({x:hm.x-ex,y:hm.y+ey,z:hm.z+ez},0,0,1,0,0); // placeholder
    }
    ctx.restore();
  }
  function drawNeck(ctx,skel,proj){
    if(!skel.neck||!skel.head)return;var pN=proj.neck,pH=proj.head;var w=4;
    ctx.save();ctx.beginPath();ctx.moveTo(pN.x-w,pN.y);ctx.lineTo(pH.x-w*0.7,pH.y);ctx.lineTo(pH.x+w*0.7,pH.y);ctx.lineTo(pN.x+w,pN.y);ctx.closePath();
    ctx.fillStyle=rgbaOk(COLOR,depthA(pN.z)*0.85);ctx.fill();ctx.restore();
  }

  window.AvatarProto={render:function(canvas,w,h,joints,candidate,yaw,pitch){
    var I=PoseSkeleton3D._internals;var skel=I.buildPose(joints||{});
    var ctx=canvas.getContext('2d');canvas.width=w;canvas.height=h;canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#F4F1E8';ctx.fillRect(0,0,w,h);
    // gold halo behind head (Art Nouveau)
    if(skel.head){var hp={x:w/2+applyCamera(skel.head,yaw||0,pitch||0).x*Math.min(w,h)*0.40,y:h/2-applyCamera(skel.head,yaw||0,pitch||0).y*Math.min(w,h)*0.40};var gr=ctx.createRadialGradient(hp.x,hp.y,2,hp.x,hp.y,24);gr.addColorStop(0,'rgba(201,162,76,0.16)');gr.addColorStop(1,'rgba(201,162,76,0)');ctx.fillStyle=gr;ctx.fillRect(hp.x-24,hp.y-24,48,48);}
    if(candidate===1)cand1(ctx,skel,yaw||0,pitch||0,1,w,h);
    else if(candidate===2)cand2(ctx,skel,yaw||0,pitch||0,1,w,h);
    else cand3(ctx,skel,yaw||0,pitch||0,1,w,h);
  }};
})();
`;

const POSES = ['power-stance','scurve-stand','soft-sit','both-knees','starfish','leap-forward','arms-overhead','face-touch'];

(async () => {
  const { browser, ctx } = await flow.newContext({ width: 520, height: 640, deviceScaleFactor: 1 });
  const { page } = await flow.login(ctx);
  await page.waitForFunction(() => typeof PoseSkeleton3D !== 'undefined' && typeof POSES_LIBRARY !== 'undefined' && PoseSkeleton3D._internals, null, { timeout: 20000 });
  await page.evaluate(PROTO_MODULE);
  const ok = await page.evaluate(() => typeof window.AvatarProto === 'object' && typeof window.AvatarProto.render === 'function');
  if (!ok) throw new Error('AvatarProto module did not load');

  // Capture: current avatar (baseline) + 3 candidates, front view, for each pose
  const sharp = require('sharp');
  const labels = ['current-avatar', 'cand1-jointBlend', 'cand2-bezier', 'cand3-ribbons'];
  const files = {};
  for (const p of POSES) {
    for (let ci = 0; ci < 4; ci++) {
      const isCurrent = ci === 0;
      const file = path.join(OUT, `${p}__${labels[ci]}.png`);
      // render
      await page.evaluate(({ poseId, isCurrent, ci }) => {
        const pose = POSES_LIBRARY[poseId]; const joints = pose.joints || {};
        let c = document.getElementById('_ag_vis');
        if (!c) { c = document.createElement('canvas'); c.id = '_ag_vis'; c.style.position = 'fixed'; c.style.left = '0px'; c.style.top = '0px'; c.style.zIndex = '99999'; document.body.appendChild(c); }
        if (isCurrent) PoseSkeleton3D.renderAvatarFrame(c, 200, 280, joints, { yaw: 0, pitch: 0, scale: 1, category: pose.category, description: pose.instructions });
        else window.AvatarProto.render(c, 200, 280, joints, ci, 0, 0);
      }, { poseId: p, isCurrent, ci });
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 200, height: 280 } });
      files[p + '__' + labels[ci]] = file;
    }
    console.log('  [ok]', p);
  }

  // Build comparison contact sheet: rows = poses, cols = {current, cand1, cand2, cand3}
  const TILE = 210, PAD = 12;
  const cols = 4, rows = POSES.length;
  const W = cols * TILE + PAD * (cols + 1);
  const H = rows * TILE + PAD * (rows + 1) + 22 * rows;
  const comps = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const f = files[POSES[r] + '__' + labels[c]];
      if (!fs.existsSync(f)) continue;
      const buf = await sharp(f).resize(TILE, TILE, { fit: 'contain', background: { r: 244, g: 241, b: 232, alpha: 1 } }).toBuffer();
      const x = PAD + c * (TILE + PAD), y = PAD + r * (TILE + PAD) + 22;
      comps.push({ input: buf, left: x, top: y });
      const lbl = await sharp({ create: { width: TILE, height: 22, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite([{ input: Buffer.from('<svg width="' + TILE + '" height="22"><text x="4" y="14" font-family="monospace" font-size="11" font-weight="bold" fill="#0F3B3A">' + ((r === 0) ? labels[c] : '') + '</text></svg>'), top: 0, left: 0 }]).png().toBuffer();
      comps.push({ input: lbl, left: x, top: PAD + r * (TILE + PAD) });
    }
    // row label (pose name)
    const rl = await sharp({ create: { width: 60, height: 22, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite([{ input: Buffer.from('<svg width="60" height="22"><text x="2" y="14" font-family="monospace" font-size="9" fill="#0F3B3A">' + POSES[r].slice(0, 12) + '</text></svg>'), top: 0, left: 0 }]).png().toBuffer();
    comps.push({ input: rl, left: 0, top: PAD + r * (TILE + PAD) });
  }
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 244, g: 241, b: 232, alpha: 1 } } }).composite(comps).png().toFile(path.join(OUT, 'prototype-comparison.png'));
  console.log('[prototypes] wrote comparison sheet: ' + path.join(OUT, 'prototype-comparison.png'));

  await browser.close();
})();
