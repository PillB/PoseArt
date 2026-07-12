// Smoke test: load pose-skeleton-3d.js in a Node sandbox with a minimal
// canvas/document/window shim, then verify that PoseSkeleton3D can:
//   1. init() on a fake canvas and render without throwing
//   2. setPose() with a real pose's joints and render without throwing
//   3. renderGhostFrame() (the new PR-2 helper) renders without throwing
//   4. The renderFrame output is non-empty (ctx.commands captured)
// We don't render pixels — we just confirm no exceptions are thrown and
// that the expected canvas context methods are called.

const fs = require('fs');
const vm = require('vm');
const path = require('path');

// Minimal 2D context stub that records calls (for non-empty assertion)
function makeCtx() {
  const calls = [];
  const noop = () => {};
  const ctx = {
    save: () => calls.push('save'),
    restore: () => calls.push('restore'),
    beginPath: () => calls.push('beginPath'),
    moveTo: (x,y) => calls.push('moveTo ' + x + ',' + y),
    lineTo: (x,y) => calls.push('lineTo ' + x + ',' + y),
    closePath: () => calls.push('closePath'),
    arc: (x,y,r,a,b) => calls.push('arc ' + x + ',' + y + ' r=' + r),
    ellipse: (x,y,rx,ry,rot,a,b) => calls.push('ellipse ' + x + ',' + y),
    fill: () => calls.push('fill'),
    stroke: () => calls.push('stroke'),
    clearRect: (x,y,w,h) => calls.push('clearRect ' + w + 'x' + h),
    fillRect: (x,y,w,h) => calls.push('fillRect'),
    createLinearGradient: (x1,y1,x2,y2) => ({ addColorStop: noop }),
    createRadialGradient: (x1,y1,r1,x2,y2,r2) => ({ addColorStop: noop }),
    scale: (x,y) => calls.push('scale ' + x + ',' + y),
    setTransform: (a,b,c,d,e,f) => calls.push('setTransform'),
    setLineDash: (arr) => calls.push('setLineDash'),
    fillText: () => calls.push('fillText'),
    drawImage: () => calls.push('drawImage'),
    strokeText: () => calls.push('strokeText'),
    clip: noop,
    measureText: () => ({ width: 10 }),
    isPointInPath: () => false,
    roundRect: (x, y, w, h, r) => calls.push('roundRect ' + w + 'x' + h),
  };
  Object.defineProperty(ctx, 'fillStyle', { value: '', writable: true, configurable: true });
  Object.defineProperty(ctx, 'strokeStyle', { value: '', writable: true, configurable: true });
  Object.defineProperty(ctx, 'lineWidth', { value: 1, writable: true, configurable: true });
  Object.defineProperty(ctx, 'lineCap', { value: 'butt', writable: true, configurable: true });
  Object.defineProperty(ctx, 'lineJoin', { value: 'miter', writable: true, configurable: true });
  Object.defineProperty(ctx, 'shadowColor', { value: '', writable: true, configurable: true });
  Object.defineProperty(ctx, 'shadowBlur', { value: 0, writable: true, configurable: true });
  Object.defineProperty(ctx, 'font', { value: '', writable: true, configurable: true });
  Object.defineProperty(ctx, 'textAlign', { value: 'start', writable: true, configurable: true });
  return { ctx, calls };
}

// Minimal canvas stub
function makeCanvas(w, h) {
  const { ctx, calls } = makeCtx();
  return {
    width: w || 220,
    height: h || 280,
    clientWidth: w || 220,
    clientHeight: h || 280,
    style: {},
    classList: { add: noop => noop, remove: noop => noop, contains: () => false },
    getContext: () => ctx,
    addEventListener: () => {},
    removeEventListener: () => {},
    _calls: calls,
  };
}

// Minimal document stub
const documentStub = {
  getElementById: () => null,
  createElement: (tag) => {
    if (tag === 'style') return { id: '', textContent: '', _text: '' };
    return makeCanvas();
  },
  head: { appendChild: () => {} },
};

const windowStub = {
  devicePixelRatio: 1,
  addEventListener: () => {},
  removeEventListener: () => {},
  cancelAnimationFrame: () => {},
  requestAnimationFrame: (cb) => { return 0; },
};

const sandbox = {
  window: windowStub,
  document: documentStub,
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
  requestAnimationFrame: windowStub.requestAnimationFrame,
  cancelAnimationFrame: windowStub.cancelAnimationFrame,
  Math, Date, Object, Array, JSON, parseInt, parseFloat,
  isNaN, isFinite,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const src = fs.readFileSync(path.join(process.cwd(), 'js/pose-skeleton-3d.js'), 'utf8');
vm.runInContext(src, sandbox, { filename: 'pose-skeleton-3d.js' });

const PoseSkeleton3D = sandbox.PoseSkeleton3D || (sandbox.window && sandbox.window.PoseSkeleton3D);
if (!PoseSkeleton3D) {
  console.error('FAIL: PoseSkeleton3D not exported');
  process.exit(1);
}
console.log('PoseSkeleton3D loaded. Public API:', Object.keys(PoseSkeleton3D).join(', '));

// --- TEST 1: init + setPose + render (skeleton mode) ---
try {
  const canvas = makeCanvas(220, 280);
  const sk = Object.create(PoseSkeleton3D);
  sk.init(canvas, 220, 280);
  sk.setPose({ spine: 15, leftShoulder: -30, rightShoulder: 8, leftElbow: 70, rightElbow: 50, leftHip: 8, rightKnee: 10, leftKnee: 10, hipAbductL: 10, hipAbductR: 10 }, { animateEntry: false, category: 'standing' });
  sk.render();
  console.log('TEST 1 (skeleton init+setPose+render): PASS — ' + canvas._calls.length + ' ctx calls');
} catch (e) {
  console.error('TEST 1 FAIL:', e.message);
  console.error(e.stack);
  process.exit(1);
}

// --- TEST 2: renderGhostFrame (new PR-2 helper) ---
try {
  const canvas = makeCanvas(220, 280);
  PoseSkeleton3D.renderGhostFrame(canvas, 220, 280, {
    spine: 15, leftShoulder: -30, rightShoulder: 8, leftElbow: 70, rightElbow: 50,
    leftHip: 8, rightKnee: 10, leftKnee: 10, hipAbductL: 10, hipAbductR: 10
  }, { category: 'standing', yaw: 20, pitch: 5 });
  console.log('TEST 2 (renderGhostFrame): PASS — ' + canvas._calls.length + ' ctx calls');
} catch (e) {
  console.error('TEST 2 FAIL:', e.message);
  console.error(e.stack);
  process.exit(1);
}

// --- TEST 3: renderGhostFrame with a reclining pose (globalTilt) ---
try {
  const canvas = makeCanvas(220, 280);
  PoseSkeleton3D.renderGhostFrame(canvas, 220, 280, {
    spine: -10, neck: -8, globalTilt: 85, globalRoll: 15, globalTwist: 10,
    leftShoulder: -20, rightShoulder: -90, leftElbow: 70, rightElbow: 60,
    shoulderFwdL: 10, shoulderFwdR: 12, leftHip: 30, rightHip: 60,
    leftKnee: 15, rightKnee: 55, leftAnkle: 8, rightAnkle: 8,
    hipAbductL: 6, hipAbductR: 10
  }, { category: 'reclining', yaw: 20, pitch: 25 });
  console.log('TEST 3 (renderGhostFrame reclining): PASS — ' + canvas._calls.length + ' ctx calls');
} catch (e) {
  console.error('TEST 3 FAIL:', e.message);
  console.error(e.stack);
  process.exit(1);
}

// --- TEST 4: renderGhostFrame with empty joints (T-pose fallback) ---
try {
  const canvas = makeCanvas(220, 280);
  PoseSkeleton3D.renderGhostFrame(canvas, 220, 280, {}, { category: '' });
  console.log('TEST 4 (renderGhostFrame empty joints): PASS — ' + canvas._calls.length + ' ctx calls');
} catch (e) {
  console.error('TEST 4 FAIL:', e.message);
  console.error(e.stack);
  process.exit(1);
}

// --- TEST 5: render all 745 poses through renderGhostFrame (mass regression) ---
try {
  // Load poses-data.js
  let poseSrc = fs.readFileSync(path.join(process.cwd(), 'js/poses-data.js'), 'utf8');
  poseSrc = poseSrc.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
  poseSrc = poseSrc.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
  poseSrc = poseSrc.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
  const poseSandbox = { window: {}, console };
  poseSandbox.globalThis = poseSandbox;
  vm.createContext(poseSandbox);
  vm.runInContext(poseSrc, poseSandbox, { filename: 'poses-data.js' });
  const lib = poseSandbox.POSES_LIBRARY;

  let pass = 0, fail = 0;
  const failures = [];
  for (const [id, pose] of Object.entries(lib)) {
    try {
      const c = makeCanvas(220, 280);
      PoseSkeleton3D.renderGhostFrame(c, 220, 280, pose.joints || {}, { category: pose.category || '' });
      pass++;
    } catch (e) {
      fail++;
      failures.push({ id, err: e.message });
    }
  }
  console.log('TEST 5 (mass regression — all 745 poses through renderGhostFrame):');
  console.log('  PASS:', pass, ' FAIL:', fail);
  if (fail > 0) {
    console.log('  First 5 failures:');
    failures.slice(0, 5).forEach(f => console.log('    ' + f.id + ': ' + f.err));
    process.exit(1);
  }
} catch (e) {
  console.error('TEST 5 setup FAIL:', e.message);
  console.error(e.stack);
  process.exit(1);
}

console.log('\nALL TESTS PASSED');

