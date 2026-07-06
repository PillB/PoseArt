/**
 * CameraPoseGuide — upgrades the camera overlay to use our forensic
 * procedural skeleton as a live pose guide, tinted by alignment score,
 * with per-joint alignment feedback chips.
 *
 * Design:
 *   - Renders the target pose via PoseFigureProcedural.render into an SVG
 *     overlay pinned to the camera stage. This is the anatomically accurate
 *     skeleton we've been iterating on (not the flat canvas silhouette).
 *   - Every frame, the cameraEngine calls updateAlignment(score, errors) so
 *     the guide can:
 *       • fade from ghost-white → gold when score climbs
 *       • pulse the whole figure gently at low score, steady at high
 *       • highlight the specific joints the user is misaligning
 *       • surface a rank-ordered fix list in a chip strip at the bottom
 *
 * Public API:
 *   CameraPoseGuide.mount(container, pose, opts)   — install into #pose-overlay-container
 *   CameraPoseGuide.update(score, errors)          — call every frame
 *   CameraPoseGuide.unmount()                      — tear down
 *
 * `errors` matches the cameraEngine.currentErrors shape:
 *   { jointName: { severity: 'low'|'high', delta: number, message: string } }
 */
(function (global) {
  'use strict';

  const state = {
    container: null,
    pose: null,
    svgHost: null,
    chipHost: null,
    lastRenderPose: null,
    // Alignment state
    score: 0,
    errors: {},
    // Pulse phase for low-score wobble
    pulseStart: performance.now()
  };

  const JOINT_LABEL = {
    // Symmetric limbs
    leftShoulder:  'Left shoulder',
    rightShoulder: 'Right shoulder',
    leftElbow:     'Left elbow',
    rightElbow:    'Right elbow',
    leftWrist:     'Left wrist',
    rightWrist:    'Right wrist',
    leftHip:       'Left hip',
    rightHip:      'Right hip',
    leftKnee:      'Left knee',
    rightKnee:     'Right knee',
    leftAnkle:     'Left ankle',
    rightAnkle:    'Right ankle',
    // Axial
    spine:         'Spine',
    neck:          'Neck',
    head:          'Head',
    hips:          'Hips',
    torso:         'Torso',
    // Hip abduction (splay) — emitted by _computeAlignment for wide-stance poses.
    hipAbductL:    'Left hip out',
    hipAbductR:    'Right hip out',
    // Shoulder rotation / abduction — emitted in some pose checks.
    shoulderAbductL: 'Left shoulder out',
    shoulderAbductR: 'Right shoulder out'
  };

  // Format any joint key we don't have an explicit label for. Turns
  // camelCase into title-cased words as a graceful fallback so users
  // never see raw "leftAnkle" or "hipAbductR" in a chip.
  function humanizeJointKey(k) {
    if (!k) return '';
    return String(k)
      .replace(/([A-Z])/g, ' $1')       // camelCase → spaces
      .replace(/^./, c => c.toUpperCase())
      .replace(/\s+([LR])$/, (_, s) => s === 'L' ? ' left' : ' right')
      .trim();
  }

  function mount(container, pose, opts) {
    if (!container || !pose) return null;
    opts = opts || {};
    unmount();
    state.container = container;
    state.pose = pose;

    // Wipe existing static SVG so we own the overlay.
    container.innerHTML = '';
    container.style.pointerEvents = 'none';

    // Build the guide SVG host — sized to the container.
    const svgHost = document.createElement('div');
    svgHost.className = 'cpg-svg-host';
    svgHost.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;';
    container.appendChild(svgHost);
    state.svgHost = svgHost;

    // Chip strip lives just below the figure. Fixed position so it doesn't
    // move with breathing.
    const chipHost = document.createElement('div');
    chipHost.className = 'cpg-chips';
    chipHost.setAttribute('data-testid', 'pose-guide-chips');
    chipHost.style.cssText = [
      'position:absolute','left:50%','bottom:14%','transform:translateX(-50%)',
      'display:flex','flex-wrap:wrap','gap:6px','justify-content:center',
      'max-width:82%','pointer-events:none','z-index:5'
    ].join(';');
    container.appendChild(chipHost);
    state.chipHost = chipHost;

    render(1.0); // initial paint
    return {
      update,
      unmount,
      el: container
    };
  }

  function unmount() {
    if (state.svgHost && state.svgHost.parentNode) state.svgHost.parentNode.removeChild(state.svgHost);
    if (state.chipHost && state.chipHost.parentNode) state.chipHost.parentNode.removeChild(state.chipHost);
    state.svgHost = state.chipHost = state.container = state.pose = null;
    state.score = 0;
    state.errors = {};
  }

  function update(score, errors) {
    if (!state.container) return;
    const scoreN = Math.max(0, Math.min(100, Number(score) || 0));
    const errObj = (errors && typeof errors === 'object') ? errors : {};
    // Skip re-render if state hasn't materially changed.
    const changed = Math.abs(scoreN - state.score) > 1 ||
                    Object.keys(errObj).length !== Object.keys(state.errors).length;
    state.score = scoreN;
    state.errors = errObj;
    render(scoreN / 100);
    updateChips();
    if (changed) pulseTick();
  }

  // ─── Render the target-pose SVG with score-tinted styling ───────────────
  function render(scoreT) {
    if (!state.svgHost || !state.pose) return;
    if (!global.PoseFigureProcedural || !global.PoseFigureProcedural.render) {
      state.svgHost.innerHTML = '<div style="color:#F6F0E1;opacity:.5">guide unavailable</div>';
      return;
    }
    // Compute the tint based on score. Below 50% = ghost-white, above = gold.
    const golden  = 'rgba(201,162,76,'; // Prosperity gold
    const cream   = 'rgba(246,240,225,';
    const isWarm  = scoreT >= 0.5;
    const alpha   = 0.35 + 0.30 * scoreT; // 0.35 at 0%, 0.65 at 100%
    const color   = (isWarm ? golden : cream) + alpha.toFixed(2) + ')';
    const glowCol = (isWarm ? golden : cream) + '0.28)';

    // Wobble amplitude — bigger when misaligned (soft "still finding you" hint)
    const now = performance.now();
    const t   = (now - state.pulseStart) / 1000;
    const wobbleY = (1 - scoreT) * 3 * Math.sin(t * 1.6);   // px
    const wobbleR = (1 - scoreT) * 0.8 * Math.sin(t * 1.2); // deg

    // Render via procedural renderer — output is a self-contained <svg>.
    const svgStr = global.PoseFigureProcedural.render(state.pose, {
      width: 220,
      height: 300,
      animate: false,
      view: 'auto'
    });
    state.svgHost.innerHTML = svgStr;
    const svg = state.svgHost.querySelector('svg');
    if (!svg) return;

    // Recolor every stroke / fill to the tint color for a translucent ghost.
    // The procedural renderer uses hardcoded palette colors; we override.
    svg.style.opacity = String(0.55 + 0.30 * scoreT); // 0.55..0.85
    svg.style.filter  = `drop-shadow(0 0 12px ${glowCol})`;
    svg.style.transform = `translateY(${wobbleY.toFixed(2)}px) rotate(${wobbleR.toFixed(2)}deg)`;
    svg.style.transformOrigin = '50% 60%';

    // Repaint bones & fills in the tint.
    svg.querySelectorAll('[stroke]').forEach(el => {
      el.setAttribute('stroke', color);
    });
    svg.querySelectorAll('[fill]:not([fill="none"])').forEach(el => {
      // Preserve halo elements (identify by opacity < 0.5 already set) — but
      // simplest is to just re-tint everything for a unified ghost look.
      el.setAttribute('fill', color);
    });
  }

  // ─── Alignment chips: 3 highest-severity errors ─────────────────────────
  function updateChips() {
    if (!state.chipHost) return;
    const errs = Object.entries(state.errors || {});
    // Rank: high severity first, then by |delta|
    errs.sort((a, b) => {
      const sa = a[1] && a[1].severity === 'high' ? 2 : 1;
      const sb = b[1] && b[1].severity === 'high' ? 2 : 1;
      if (sb !== sa) return sb - sa;
      return Math.abs((b[1].delta || 0)) - Math.abs((a[1].delta || 0));
    });
    const top = errs.slice(0, 3);
    const html = top.map(([joint, err]) => {
      const label = JOINT_LABEL[joint] || humanizeJointKey(joint);
      const highSev = err && err.severity === 'high';
      const bg = highSev ? 'rgba(201,106,76,0.92)' : 'rgba(201,162,76,0.92)';
      const fg = '#0F3B3A';
      const arrow = err && err.hint ? ` <span style="opacity:.85">· ${escapeHtml(err.hint)}</span>` : '';
      return `<div class="cpg-chip" data-joint="${joint}" style="background:${bg};color:${fg};padding:5px 10px;border-radius:999px;font:600 11px/1 var(--font-body, sans-serif);letter-spacing:.3px;box-shadow:0 2px 6px rgba(0,0,0,0.22);white-space:nowrap;">${escapeHtml(label)}${arrow}</div>`;
    }).join('');
    // If perfectly aligned, show a "held" chip
    const perfect = errs.length === 0 && state.score >= 85;
    state.chipHost.innerHTML = perfect
      ? `<div class="cpg-chip cpg-chip--held" data-joint="held" style="background:rgba(76,175,125,0.95);color:#0F3B3A;padding:6px 12px;border-radius:999px;font:600 12px/1 var(--font-body, sans-serif);letter-spacing:.4px;">HELD · ${Math.round(state.score)}%</div>`
      : html;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  let _pulseRaf = 0;
  function pulseTick() {
    if (_pulseRaf) cancelAnimationFrame(_pulseRaf);
    _pulseRaf = requestAnimationFrame(() => {
      _pulseRaf = 0;
      render(state.score / 100);
    });
  }

  global.CameraPoseGuide = { mount, unmount, update };
})(typeof window !== 'undefined' ? window : this);
