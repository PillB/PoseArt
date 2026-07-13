// ── POSE ENTRY ANIMATIONS ────────────────────────────────────────
// Injects SVG SMIL animations into rendered pose figure SVGs.
// Called after renderPoseFigureSVG() whenever a pose detail sheet opens.

window.animatePoseFigure = function(svgEl) {
  if (!svgEl) return;

  // Restart any existing SMIL animations
  try {
    svgEl.pauseAnimations();
    svgEl.setCurrentTime(0);
    svgEl.unpauseAnimations();
  } catch(e) {
    // SMIL not supported — fall back to CSS
  }
};

// CSS animation classes injected into the app styles dynamically
(function injectPoseAnimationCSS() {
  if (document.getElementById('pose-anim-styles')) return;
  const style = document.createElement('style');
  style.id = 'pose-anim-styles';
  style.textContent = `
    /* ── Pose figure entry animation ── */
    .pose-figure-large svg {
      animation: none;
    }
    .pose-detail-sheet.visible .pose-figure-large svg {
      animation: poseEntry 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
      transform-origin: center bottom;
    }
    /* PR-3 (v1.1) — directive #17 "only the skeleton sprites are animated
       why not all?" The avatar SVG previously had only a one-shot entry
       animation and then froze. We add a continuous idle breathing loop
       to the PARENT .pose-figure-large container (not the SVG child) so
       it composes multiplicatively with whatever entry animation the
       category-specific rule applies to the SVG. This way every category
       (standing, dynamic, reclining, boudoir, etc.) gets the breathing
       without having to redeclare it in each @keyframes override.
       The breathing amplitude (1.015) is intentionally smaller than the
       skeleton canvas's 1.018 so the two renderers breathe in visual
       harmony without beating against each other. The 1.2s delay lets
       the entry animation finish before breathing starts, so we don't
       compose two transforms on the same element at the same time. */
    .pose-detail-sheet.visible .pose-figure-large {
      animation: poseBreathe 4s ease-in-out 1.2s infinite;
      transform-origin: center bottom;
      will-change: transform;
    }
    @keyframes poseBreathe {
      0%, 100% { transform: scale(1) translateY(0); }
      50%      { transform: scale(1.015) translateY(-1px); }
    }

    @keyframes poseEntry {
      0%   { opacity: 0; transform: scale(0.82) translateY(18px); }
      60%  { opacity: 1; }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Dynamic poses — faster pop-in */
    .pose-detail-sheet.visible[data-category="dynamic"] .pose-figure-large svg,
    .pose-detail-sheet.visible[data-category="eccentric"] .pose-figure-large svg {
      animation: poseDynamicEntry 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    @keyframes poseDynamicEntry {
      0%   { opacity: 0; transform: scale(0.7) translateY(24px) rotate(-4deg); }
      70%  { opacity: 1; transform: scale(1.05) translateY(-4px) rotate(1deg); }
      100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
    }

    /* Reclining poses — slide in from left */
    .pose-detail-sheet.visible[data-category="reclining"] .pose-figure-large svg {
      animation: poseSlideIn 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
      transform-origin: left center;
    }
    @keyframes poseSlideIn {
      0%   { opacity: 0; transform: translateX(-32px) scaleX(0.88); }
      100% { opacity: 1; transform: translateX(0) scaleX(1); }
    }

    /* Couple poses — gentle float up */
    .pose-detail-sheet.visible[data-category="couple"] .pose-figure-large svg {
      animation: poseFloatUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes poseFloatUp {
      0%   { opacity: 0; transform: scale(0.88) translateY(20px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Kneeling poses — drop down */
    .pose-detail-sheet.visible[data-category="kneeling"] .pose-figure-large svg {
      animation: poseDropDown 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
      transform-origin: center top;
    }
    @keyframes poseDropDown {
      0%   { opacity: 0; transform: scaleY(0.78) translateY(-12px); }
      100% { opacity: 1; transform: scaleY(1) translateY(0); }
    }

    /* Leaning poses — tilt in */
    .pose-detail-sheet.visible[data-category="leaning"] .pose-figure-large svg {
      animation: poseTiltIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
      transform-origin: bottom right;
    }
    @keyframes poseTiltIn {
      0%   { opacity: 0; transform: rotate(8deg) scale(0.9); }
      100% { opacity: 1; transform: rotate(0deg) scale(1); }
    }

    /* Standing poses — rise up */
    .pose-detail-sheet.visible[data-category="standing"] .pose-figure-large svg {
      animation: poseRiseUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
      transform-origin: bottom center;
    }
    @keyframes poseRiseUp {
      0%   { opacity: 0; transform: scaleY(0.72) translateY(28px); }
      70%  { opacity: 1; }
      100% { opacity: 1; transform: scaleY(1) translateY(0); }
    }

    /* Seated poses — settle down */
    .pose-detail-sheet.visible[data-category="seated"] .pose-figure-large svg,
    .pose-detail-sheet.visible[data-category="lean-seat"] .pose-figure-large svg {
      animation: poseSettle 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes poseSettle {
      0%   { opacity: 0; transform: scale(0.86) translateY(-10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Accessible poses — confident expand */
    .pose-detail-sheet.visible[data-category="accessible"] .pose-figure-large svg {
      animation: poseExpand 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
      transform-origin: center center;
    }
    @keyframes poseExpand {
      0%   { opacity: 0; transform: scale(0.8); }
      65%  { opacity: 1; transform: scale(1.04); }
      100% { opacity: 1; transform: scale(1); }
    }

    /* ── BOUDOIR — slow, sensual float with gentle rotation ── */
    .pose-detail-sheet.visible[data-category="boudoir"] .pose-figure-large svg {
      animation: poseBoudoirEntry 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
      transform-origin: center center;
    }
    @keyframes poseBoudoirEntry {
      0%   { opacity: 0; transform: scale(0.85) translateY(22px) rotate(-3deg); }
      40%  { opacity: 0.7; }
      80%  { transform: scale(1.02) translateY(-3px) rotate(0.5deg); }
      100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
    }

    /* ── EDITORIAL — sharp angular snap-in ── */
    .pose-detail-sheet.visible[data-category="editorial"] .pose-figure-large svg {
      animation: poseEditorialEntry 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
      transform-origin: center bottom;
    }
    @keyframes poseEditorialEntry {
      0%   { opacity: 0; transform: scale(0.78) translateY(14px) skewX(-4deg); }
      60%  { opacity: 1; transform: scale(1.03) translateY(-2px) skewX(1deg); }
      100% { opacity: 1; transform: scale(1) translateY(0) skewX(0deg); }
    }

    /* ── FINE ART — graceful unfurl from center ── */
    .pose-detail-sheet.visible[data-category="fine-art"] .pose-figure-large svg {
      animation: poseFineArtEntry 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
      transform-origin: center center;
    }
    @keyframes poseFineArtEntry {
      0%   { opacity: 0; transform: scale(0.7) rotate(-6deg); }
      50%  { opacity: 0.8; transform: scale(1.04) rotate(1deg); }
      100% { opacity: 1; transform: scale(1) rotate(0deg); }
    }

    /* ── FASHION — confident stride in from side ── */
    .pose-detail-sheet.visible[data-category="fashion"] .pose-figure-large svg {
      animation: poseFashionEntry 0.7s cubic-bezier(0.34, 1.3, 0.64, 1) both;
      transform-origin: center bottom;
    }
    @keyframes poseFashionEntry {
      0%   { opacity: 0; transform: translateX(28px) scale(0.9); }
      70%  { opacity: 1; transform: translateX(-4px) scale(1.02); }
      100% { opacity: 1; transform: translateX(0) scale(1); }
    }

    /* ── LOW TO HIGH — rise from compressed ── */
    .pose-detail-sheet.visible[data-category="low-to-high"] .pose-figure-large svg {
      animation: poseLowHighEntry 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
      transform-origin: bottom center;
    }
    @keyframes poseLowHighEntry {
      0%   { opacity: 0; transform: scaleY(0.6) translateY(40px); }
      60%  { opacity: 1; transform: scaleY(1.04) translateY(-4px); }
      100% { opacity: 1; transform: scaleY(1) translateY(0); }
    }

    /* ── HIGH TO LOW — descend from above ── */
    .pose-detail-sheet.visible[data-category="high-to-low"] .pose-figure-large svg {
      animation: poseHighLowEntry 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
      transform-origin: top center;
    }
    @keyframes poseHighLowEntry {
      0%   { opacity: 0; transform: scaleY(0.6) translateY(-40px); }
      60%  { opacity: 1; transform: scaleY(1.04) translateY(4px); }
      100% { opacity: 1; transform: scaleY(1) translateY(0); }
    }

    /* Replay button hover re-triggers animation */
    .pose-detail-sheet.visible .pose-figure-large:hover svg {
      animation-play-state: running;
    }
  `;
  document.head.appendChild(style);
})();
