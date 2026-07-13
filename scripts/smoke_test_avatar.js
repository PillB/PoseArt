// Smoke test for the new renderAvatarFrame (PR-v4)
const fs = require('fs');
const vm = require('vm');
const path = require('path');

function makeCtx() {
  const calls = [];
  const noop = () => {};
  const ctx = {
    save: () => calls.push('save'), restore: () => calls.push('restore'),
    beginPath: () => calls.push('beginPath'), moveTo: () => calls.push('moveTo'),
    lineTo: () => calls.push('lineTo'), closePath: () => calls.push('closePath'),
    arc: () => calls.push('arc'), ellipse: () => calls.push('ellipse'),
    fill: () => calls.push('fill'), stroke: () => calls.push('stroke'),
    clearRect: () => calls.push('clearRect'), fillRect: () => calls.push('fillRect'),
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop }),
    scale: () => calls.push('scale'), setTransform: () => calls.push('setTransform'),
    setLineDash: () => calls.push('setLineDash'), roundRect: () => calls.push('roundRect'),
    fillText: () => calls.push('fillText'), drawImage: () => calls.push('drawImage'),
    strokeText: () => calls.push('strokeText'), clip: noop,
    measureText: () => ({ width: 10 }), isPointInPath: () => false,
  };
  ['fillStyle','strokeStyle','lineWidth','lineCap','lineJoin','shadowColor','shadowBlur','font','textAlign','globalCompositeOperation'].forEach(p => {
    Object.defineProperty(ctx, p, { value: '', writable: true, configurable: true });
  });
  ctx._calls = calls;
  return ctx;
}

function makeCanvas(w, h) {
  const ctx = makeCtx();
  return {
    width: w||220, height: h||280, clientWidth: w||220, clientHeight: h||280,
    style: {}, classList: { add: () => {}, remove: () => {}, contains: () => false },
    getContext: () => ctx, addEventListener: () => {}, removeEventListener: () => {},
    getBoundingClientRect: () => ({ width: w||430, height: h||932, left: 0, top: 0 }),
    _ctx: ctx, // expose for test assertions
  };
}

const documentStub = { getElementById: () => null, createElement: () => ({ id:'', textContent:'' }), head: { appendChild: () => {} } };
const windowStub = { devicePixelRatio: 1, addEventListener:()=>{}, removeEventListener:()=>{}, cancelAnimationFrame:()=>{}, requestAnimationFrame:()=>0 };
const sb = { window: windowStub, document: documentStub, console, setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame:()=>0, cancelAnimationFrame:()=>{}, Math, Date, Object, Array, JSON, parseInt, parseFloat, isNaN, isFinite };
sb.globalThis = sb;
vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(process.cwd(), 'js', 'pose-skeleton-3d.js'), 'utf8'), sb, { filename: 'pose-skeleton-3d.js' });
const P = sb.PoseSkeleton3D || (sb.window && sb.window.PoseSkeleton3D);
if (!P) { console.error('PoseSkeleton3D not found on sandbox'); process.exit(1); }

console.log('PoseSkeleton3D public API keys (own):', Object.getOwnPropertyNames(P).filter(k => k !== 'prototype' && k !== 'constructor').join(', '));

// Test 1: renderAvatarFrame with a standing pose
const c1 = makeCanvas(200, 280);
P.renderAvatarFrame(c1, 200, 280, { spine: 25, hips: 22, leftShoulder: -25, rightShoulder: 18, leftElbow: 70, rightElbow: 50, leftHip: 20, rightKnee: 5, leftKnee: 35 }, { category: 'standing', description: 'S-curve stand' });
console.log('TEST 1 (avatar standing):', c1._ctx._calls.length > 50 ? 'PASS' : 'FAIL', '—', c1._ctx._calls.length, 'ctx calls');

// Test 2: renderAvatarFrame with a reclining pose
const c2 = makeCanvas(200, 280);
P.renderAvatarFrame(c2, 200, 280, { globalTilt: 82, spine: -18, neck: 8, leftShoulder: -60, leftElbow: 65, rightShoulder: -55, rightElbow: 45, leftHip: 70, leftKnee: 85, rightHip: 65, rightKnee: 80 }, { category: 'high-to-low', description: 'lying on floor' });
console.log('TEST 2 (avatar reclining):', c2._ctx._calls.length > 50 ? 'PASS' : 'FAIL', '—', c2._ctx._calls.length, 'ctx calls');

// Test 3: renderAvatarFrame with empty joints (T-pose)
const c3 = makeCanvas(200, 280);
P.renderAvatarFrame(c3, 200, 280, {}, { category: '' });
console.log('TEST 3 (avatar empty joints):', c3._ctx._calls.length > 50 ? 'PASS' : 'FAIL', '—', c3._ctx._calls.length, 'ctx calls');

// Test 4: Mass regression — render all 745 poses through renderAvatarFrame
let poseSrc = fs.readFileSync(path.join(process.cwd(), 'js', 'poses-data.js'), 'utf8');
poseSrc = poseSrc.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
poseSrc = poseSrc.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
poseSrc = poseSrc.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const poseSb = { window: {}, console }; poseSb.globalThis = poseSb;
vm.createContext(poseSb);
vm.runInContext(poseSrc, poseSb, { filename: 'poses-data.js' });
const lib = poseSb.POSES_LIBRARY;

let pass = 0, fail = 0;
const failures = [];
for (const [id, pose] of Object.entries(lib)) {
  try {
    const c = makeCanvas(200, 280);
    P.renderAvatarFrame(c, 200, 280, pose.joints || {}, { category: pose.category || '', description: pose.instructions || '' });
    if (c._ctx._calls.length > 50) pass++; else { fail++; failures.push({ id, reason: 'too few calls: ' + c._ctx._calls.length }); }
  } catch (e) {
    fail++;
    failures.push({ id, reason: e.message });
  }
}
console.log('TEST 4 (mass regression — all 745 poses through renderAvatarFrame):');
console.log('  PASS:', pass, ' FAIL:', fail);
if (fail > 0) {
  failures.slice(0, 5).forEach(f => console.log('    ' + f.id + ': ' + f.reason));
  process.exit(1);
}

console.log('\nALL AVATAR TESTS PASSED');

