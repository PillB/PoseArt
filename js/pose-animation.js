/**
 * PoseAnimation — mounts an SVG figure that tweens from a neutral A-pose to
 * the target pose's joints, holds, and loops.
 *
 * Depends on: window.PoseFigureProcedural.render (must be loaded first).
 *
 * Public API:
 *   PoseAnimation.mount(container, pose, opts)   → returns a handle {stop, restart, el}
 *   PoseAnimation.unmountAll(container)          → stops any running animation for container
 *
 * opts:
 *   width, height   — SVG size (default 200 x 280)
 *   duration        — tween ms  (default 900)
 *   hold            — hold ms at target (default 1500)
 *   returnDuration  — tween back ms (default 700)
 *   restHold        — hold ms in A-pose (default 500)
 *   loop            — boolean, default true
 *   view            — 'auto' | 'front' | 'side' | 'quarter'
 *
 * The A-pose is a canonical relaxed stand: arms slightly out (~15°), everything
 * else zero. If the pose already has non-joint metadata (props, couple, category)
 * we keep it — only the `joints` object is interpolated.
 */
(function (global) {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // A-pose neutral joints. Slight arm splay so arms don't overlap the torso
  // at the start of the animation.
  // ─────────────────────────────────────────────────────────────────────────
  var A_POSE = {
    spine: 0, neck: 0, hips: 0,
    globalTilt: 0, globalTwist: 0, globalRoll: 0,
    leftShoulder: -15, rightShoulder: -15,
    leftElbow: 5, rightElbow: 5,
    shoulderFwdL: 0, shoulderFwdR: 0,
    leftShoulderFwd: 0, rightShoulderFwd: 0,
    leftHip: 0, rightHip: 0,
    leftKnee: 5, rightKnee: 5,
    hipAbductL: 3, hipAbductR: 3,
    ankleL: 0, ankleR: 0,
    leftAnkle: 0, rightAnkle: 0,
    wristL: 0, wristR: 0
  };

  // Ease in-out cubic
  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  // Merge source joints on top of A_POSE so we start from a full canonical set.
  function toFullJoints(base, override) {
    var out = {};
    var k;
    for (k in base) out[k] = base[k];
    if (override) {
      for (k in override) {
        if (typeof override[k] === 'number') out[k] = override[k];
      }
    }
    return out;
  }

  function interp(from, to, t) {
    var out = {};
    for (var k in to) {
      if (typeof to[k] !== 'number') continue;
      var a = typeof from[k] === 'number' ? from[k] : 0;
      out[k] = lerp(a, to[k], t);
    }
    return out;
  }

  function renderFrame(container, pose, joints, opts) {
    if (!global.PoseFigureProcedural || typeof global.PoseFigureProcedural.render !== 'function') {
      container.innerHTML = '<div style="color:#999;font-size:12px;padding:8px">renderer not loaded</div>';
      return;
    }
    // Shallow-clone the pose but swap in interpolated joints. Preserve everything
    // else (category, id, props inference, couple layout).
    var frame = {};
    for (var k in pose) frame[k] = pose[k];
    frame.joints = joints;
    container.innerHTML = global.PoseFigureProcedural.render(frame, {
      width: opts.width,
      height: opts.height,
      animate: false, // we do our own tween, disable renderer's built-in breathing
      view: opts.view || 'auto'
    });
  }

  function mount(container, pose, opts) {
    if (!container || !pose) return null;
    opts = opts || {};
    var W = opts.width  || 220;
    var H = opts.height || 300;
    var DUR   = opts.duration       || 900;
    var HOLD  = opts.hold           || 1500;
    var RDUR  = opts.returnDuration || 700;
    var RHLD  = opts.restHold       || 500;
    var loop  = opts.loop !== false;

    var start = toFullJoints(A_POSE, null);
    var target = toFullJoints(A_POSE, pose.joints || {});

    // Kill prior handle for this container.
    unmountAll(container);

    var state = {
      phase: 'forward', // forward → hold → reverse → rest → loop
      t0: performance.now(),
      raf: 0,
      stopped: false
    };

    function tick(now) {
      if (state.stopped) return;
      var el = now - state.t0;
      var joints;
      if (state.phase === 'forward') {
        var t = Math.min(1, el / DUR);
        joints = interp(start, target, ease(t));
        if (t >= 1) { state.phase = 'hold'; state.t0 = now; }
      } else if (state.phase === 'hold') {
        joints = target;
        if (el >= HOLD) { state.phase = 'reverse'; state.t0 = now; }
      } else if (state.phase === 'reverse') {
        var t2 = Math.min(1, el / RDUR);
        joints = interp(target, start, ease(t2));
        if (t2 >= 1) { state.phase = 'rest'; state.t0 = now; }
      } else if (state.phase === 'rest') {
        joints = start;
        if (el >= RHLD) {
          if (!loop) { renderFrame(container, pose, target, { width: W, height: H, view: opts.view }); return; }
          state.phase = 'forward'; state.t0 = now;
        }
      }
      renderFrame(container, pose, joints, { width: W, height: H, view: opts.view });
      state.raf = requestAnimationFrame(tick);
    }

    // Prime with the A-pose so first paint isn't empty.
    renderFrame(container, pose, start, { width: W, height: H, view: opts.view });
    state.raf = requestAnimationFrame(tick);

    var handle = {
      stop: function () {
        state.stopped = true;
        if (state.raf) cancelAnimationFrame(state.raf);
      },
      restart: function () {
        state.phase = 'forward';
        state.t0 = performance.now();
      },
      el: container
    };
    container.__poseAnimHandle = handle;
    return handle;
  }

  function unmountAll(container) {
    if (!container) return;
    var h = container.__poseAnimHandle;
    if (h && typeof h.stop === 'function') h.stop();
    container.__poseAnimHandle = null;
  }

  global.PoseAnimation = {
    mount: mount,
    unmountAll: unmountAll,
    A_POSE: A_POSE
  };
})(typeof window !== 'undefined' ? window : this);
