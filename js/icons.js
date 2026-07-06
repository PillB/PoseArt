/* ============================================================
   PoseArt Icons — Art Nouveau line-art system (v12)
   ============================================================

   Design language:
   - Flowing organic curves, geometric silhouettes
   - 48×48 viewBox, centered composition
   - Stroke: 1.6px, currentColor, round line-caps/joins
   - Fill: mostly none; occasional soft-gold fills for signature accents
   - Double-line, whiplash curve, and stylized bud/leaf motifs
   - Icons must read at both 40px (tile) and 20px (chip) sizes

   Usage:
     PoseArtIcons.render('standing', { size: 56, tone: 'cream' })
     PoseArtIcons.render('reclining')             // defaults: 40, cream

   Every icon inherits `currentColor` so callers control color via CSS.
   Tone helpers set opacity/secondary stroke via the `tone` option.
*/

(function (global) {
  'use strict';

  // ─── Shared attributes ────────────────────────────────────────
  var SVG_ATTRS = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

  // ─── ICONS ────────────────────────────────────────────────────
  // Each icon renders the inner <g> content inside the <svg> wrapper.
  var ICONS = {

    // Standing — figure with contrapposto weight shift, one hip out
    'standing': (
      '<circle cx="24" cy="10" r="3.5"/>' +
      '<path d="M24 13.5 L24 26"/>' +
      '<path d="M20 17 C 17 20, 15 22, 15 25"/>' +
      '<path d="M28 17 C 30 19, 30 22, 29 24"/>' +
      '<path d="M24 26 L21 40 L19 42" opacity="0.9"/>' +
      '<path d="M24 26 L27 40 L29 42" opacity="0.9"/>' +
      // decorative Art Nouveau curve
      '<path d="M6 44 Q 24 41, 42 44" opacity="0.35" stroke-dasharray="0.5 2.2"/>'
    ),

    // Seated — figure on stool with curved back
    'seated': (
      '<circle cx="24" cy="9" r="3"/>' +
      '<path d="M24 12 L24 21"/>' +
      '<path d="M20 15 C 18 17, 17 19, 17 21"/>' +
      '<path d="M28 15 C 30 17, 31 19, 31 21"/>' +
      '<path d="M18 21 L30 21 L30 24 L18 24 Z"/>' + // seat
      '<path d="M18 24 L16 40"/>' +                  // chair leg L
      '<path d="M30 24 L32 40"/>' +                  // chair leg R
      '<path d="M22 24 L20 34"/>' +                  // body leg L (bent)
      '<path d="M26 24 L28 34"/>' +                  // body leg R (bent)
      '<path d="M11 42 Q 24 39, 37 42" opacity="0.35" stroke-dasharray="0.5 2.2"/>'
    ),

    // Leaning — Standing — figure with wall behind
    'leaning': (
      '<path d="M8 6 L8 42" opacity="0.55"/>' +      // wall
      '<path d="M8 18 L11 18" opacity="0.35"/>' +
      '<path d="M8 30 L11 30" opacity="0.35"/>' +
      '<circle cx="20" cy="12" r="3"/>' +
      '<path d="M20 15 L23 28"/>' +
      '<path d="M17 19 L14 24"/>' +
      '<path d="M22 19 L26 22"/>' +
      '<path d="M23 28 L21 42"/>' +
      '<path d="M23 28 L28 42"/>' +
      '<path d="M6 44 Q 24 41, 42 44" opacity="0.35" stroke-dasharray="0.5 2.2"/>'
    ),

    // Leaning — Seated — figure with elbow on knee, chin on hand
    'lean-seat': (
      '<circle cx="22" cy="10" r="3"/>' +
      '<path d="M22 13 L23 22"/>' +
      '<path d="M20 15 C 17 18, 17 22, 20 22"/>' +   // arm to chin
      '<path d="M22 15 L26 18 L25 22"/>' +           // elbow on knee
      '<path d="M23 22 L20 32 L28 32"/>' +           // thigh + knee
      '<path d="M20 32 L20 42"/>' +
      '<path d="M28 32 L30 42"/>' +
      '<path d="M8 44 Q 24 41, 40 44" opacity="0.35" stroke-dasharray="0.5 2.2"/>'
    ),

    // Kneeling — figure with knee down, back curved forward
    'kneeling': (
      '<circle cx="24" cy="11" r="3"/>' +
      '<path d="M24 14 C 25 20, 26 24, 24 28"/>' +
      '<path d="M20 18 C 17 21, 15 25, 16 28"/>' +
      '<path d="M28 18 C 30 21, 31 24, 30 27"/>' +
      '<path d="M24 28 L18 36 L14 40"/>' +           // back leg
      '<path d="M24 28 L30 34 L32 40"/>' +           // front leg
      '<path d="M8 42 Q 24 39, 40 42" opacity="0.35" stroke-dasharray="0.5 2.2"/>'
    ),

    // Reclining — figure lying horizontally on a chaise line
    'reclining': (
      '<path d="M8 32 L40 32" opacity="0.55"/>' +
      '<path d="M8 36 L40 36" opacity="0.28"/>' +
      '<circle cx="12" cy="24" r="3"/>' +
      '<path d="M15 26 L26 30"/>' +
      '<path d="M14 22 C 16 20, 20 20, 22 22"/>' +   // arm overhead
      '<path d="M26 30 C 30 30, 34 30, 38 30"/>' +   // leg extended
      '<path d="M32 30 L36 26" opacity="0.9"/>' +    // other leg bent
      '<path d="M6 40 Q 24 37, 42 40" opacity="0.35" stroke-dasharray="0.5 2.2"/>'
    ),

    // Dynamic — figure mid-leap with sweep lines
    'dynamic': (
      '<circle cx="26" cy="10" r="3"/>' +
      '<path d="M26 13 L23 24"/>' +
      '<path d="M23 16 C 18 15, 14 12, 12 10"/>' +    // arm up-back
      '<path d="M27 17 C 32 20, 35 24, 35 28"/>' +    // arm forward
      '<path d="M23 24 L28 34 L26 42"/>' +
      '<path d="M23 24 L18 32 L14 30"/>' +            // leg back
      '<path d="M8 12 L14 14" opacity="0.5"/>' +      // motion swoosh
      '<path d="M6 18 L12 18" opacity="0.32"/>' +
      '<path d="M8 24 L11 22" opacity="0.22"/>'
    ),

    // Eccentric — 5-petal rosette (Art Nouveau fleuron)
    'eccentric': (
      '<circle cx="24" cy="24" r="3"/>' +
      // 5 petals radiating
      '<path d="M24 21 C 21 14, 20 10, 24 8 C 28 10, 27 14, 24 21 Z"/>' +
      '<path d="M26.5 22.5 C 33 20, 37 20, 39 24 C 37 28, 33 28, 26.5 25.5 Z"/>' +
      '<path d="M25.5 26.5 C 30 32, 32 36, 28 39 C 24 37, 24 33, 25.5 26.5 Z"/>' +
      '<path d="M22.5 26.5 C 16 32, 12 32, 12 28 C 12 24, 16 24, 22.5 25.5 Z" transform="translate(0,-2)"/>' +
      '<path d="M21.5 22.5 C 15 20, 11 20, 9 24 C 11 28, 15 28, 21.5 25.5 Z"/>' +
      '<circle cx="24" cy="24" r="1.2" fill="currentColor" opacity="0.9"/>'
    ),

    // Couple — two intertwined figures forming a heart-shape silhouette
    'couple': (
      '<circle cx="19" cy="11" r="2.6"/>' +
      '<circle cx="29" cy="11" r="2.6"/>' +
      '<path d="M19 14 C 17 20, 17 24, 20 28"/>' +
      '<path d="M29 14 C 31 20, 31 24, 28 28"/>' +
      '<path d="M20 28 L20 40"/>' +
      '<path d="M28 28 L28 40"/>' +
      // hands crossing between them (heart)
      '<path d="M17 18 C 21 20, 27 20, 31 18"/>' +
      // small heart glyph above
      '<path d="M24 5 C 22.5 3, 20.5 4, 21 6 C 21.4 7.5, 24 9, 24 9 C 24 9, 26.6 7.5, 27 6 C 27.5 4, 25.5 3, 24 5 Z" opacity="0.85"/>'
    ),

    // Accessible — figure in wheelchair, one arm forward
    'accessible': (
      '<circle cx="22" cy="11" r="2.8"/>' +
      '<path d="M22 14 L22 24"/>' +
      '<path d="M22 18 C 26 19, 30 19, 32 16"/>' +   // arm forward
      '<path d="M22 24 L30 24"/>' +                   // legs on footrest
      '<path d="M30 24 L34 30"/>' +                   // footrest
      // wheel
      '<circle cx="24" cy="34" r="7"/>' +
      '<circle cx="24" cy="34" r="1.6" fill="currentColor"/>' +
      '<path d="M24 27 L24 41" opacity="0.5"/>' +
      '<path d="M17 34 L31 34" opacity="0.5"/>' +
      '<path d="M19 29 L29 39" opacity="0.35"/>' +
      '<path d="M29 29 L19 39" opacity="0.35"/>' +
      '<circle cx="24" cy="34" r="9" opacity="0.35"/>' // outer push rim
    ),

    // Boudoir — reclining figure with draped silk curve
    'boudoir': (
      '<path d="M6 38 C 18 34, 30 34, 42 38" opacity="0.55"/>' +  // chaise curve
      '<circle cx="14" cy="26" r="2.8"/>' +
      '<path d="M17 28 C 22 30, 28 30, 33 28"/>' +
      '<path d="M15 24 C 12 20, 10 18, 8 18"/>' +    // arm overhead
      '<path d="M33 28 C 36 27, 38 26, 40 24"/>' +   // leg trailing
      // drapery swirl
      '<path d="M28 32 Q 32 38, 40 40" opacity="0.4"/>' +
      '<path d="M22 32 Q 20 38, 14 40" opacity="0.4"/>' +
      // rose bud accent
      '<circle cx="42" cy="10" r="2.4" opacity="0.75"/>' +
      '<path d="M42 8 C 40 10, 42 12, 44 10" opacity="0.75"/>'
    ),

    // Editorial — angular figure with camera-frame corners
    'editorial': (
      // frame corners
      '<path d="M6 8 L6 14 M6 8 L12 8" opacity="0.6"/>' +
      '<path d="M42 8 L42 14 M42 8 L36 8" opacity="0.6"/>' +
      '<path d="M6 40 L6 34 M6 40 L12 40" opacity="0.6"/>' +
      '<path d="M42 40 L42 34 M42 40 L36 40" opacity="0.6"/>' +
      // angular figure
      '<circle cx="24" cy="14" r="3"/>' +
      '<path d="M24 17 L20 22 L28 22 L24 32"/>' +   // torso z-fold
      '<path d="M20 22 L14 20"/>' +                   // arm out
      '<path d="M28 22 L32 26"/>' +
      '<path d="M24 32 L18 40" opacity="0.9"/>' +
      '<path d="M24 32 L30 40" opacity="0.9"/>'
    ),

    // Fine Art — ballet figure en pointe, arms in fifth position
    'fine-art': (
      '<circle cx="24" cy="9" r="2.6"/>' +
      '<path d="M24 12 L24 26"/>' +
      // arms forming rounded fifth position overhead
      '<path d="M24 14 C 18 12, 15 8, 16 5"/>' +
      '<path d="M24 14 C 30 12, 33 8, 32 5"/>' +
      '<path d="M16 5 Q 24 3, 32 5" opacity="0.7"/>' +
      // en pointe legs
      '<path d="M24 26 C 22 32, 20 38, 22 42"/>' +
      '<path d="M24 26 C 26 32, 28 38, 26 42"/>' +
      // pointe toe accent
      '<circle cx="24" cy="42.5" r="1" fill="currentColor" opacity="0.85"/>'
    ),

    // Fashion — runway silhouette with long dress swoosh
    'fashion': (
      '<circle cx="24" cy="9" r="2.8"/>' +
      '<path d="M24 12 L22 22"/>' +
      '<path d="M20 15 L15 19"/>' +                   // arm on hip
      '<path d="M23 17 L27 15" opacity="0.9"/>' +
      // dress silhouette — long organic curve
      '<path d="M22 22 L15 44"/>' +
      '<path d="M22 22 L32 44"/>' +
      '<path d="M15 44 Q 24 40, 32 44" opacity="0.75"/>' +
      // trailing ribbon accent
      '<path d="M30 26 Q 38 30, 40 42" opacity="0.5"/>'
    ),

    // Low-to-High — figure rising, ascending arrow-curve
    'low-to-high': (
      '<circle cx="12" cy="36" r="2.5" opacity="0.5"/>' +   // ghost low
      '<circle cx="34" cy="12" r="3"/>' +
      '<path d="M34 15 L34 26"/>' +
      '<path d="M31 18 L28 22"/>' +
      '<path d="M37 18 L40 15"/>' +                          // arm reaching up
      '<path d="M34 26 L30 38"/>' +
      '<path d="M34 26 L38 38"/>' +
      // rising curve
      '<path d="M8 40 C 20 32, 28 22, 40 10" opacity="0.55" stroke-dasharray="0.5 2.5"/>' +
      // arrowhead
      '<path d="M36 12 L40 10 L38 14" opacity="0.75"/>'
    ),

    // High-to-Low — figure descending
    'high-to-low': (
      '<circle cx="12" cy="12" r="3"/>' +
      '<circle cx="34" cy="38" r="2.5" opacity="0.5"/>' +   // ghost low
      '<path d="M12 15 L12 24"/>' +
      '<path d="M9 18 L6 15"/>' +                            // arm reaching up
      '<path d="M15 18 L18 22"/>' +
      '<path d="M12 24 L14 34"/>' +
      '<path d="M12 24 L10 34"/>' +
      // descending curve
      '<path d="M8 8 C 20 16, 28 26, 40 40" opacity="0.55" stroke-dasharray="0.5 2.5"/>' +
      // arrowhead down
      '<path d="M38 36 L40 40 L36 40" opacity="0.75"/>'
    ),

    // ─── UI ICONS ──────────────────────────────────────────────

    // Sparkle — 4-point star with center dot (Art Nouveau flourish)
    'sparkle': (
      '<path d="M24 8 L26 22 L38 24 L26 26 L24 40 L22 26 L10 24 L22 22 Z"/>' +
      '<circle cx="24" cy="24" r="1.2" fill="currentColor" opacity="0.85"/>'
    ),

    // Book — journal/practice
    'book': (
      '<path d="M8 12 C 14 10, 22 10, 24 14 C 26 10, 34 10, 40 12 L40 38 C 34 36, 26 36, 24 40 C 22 36, 14 36, 8 38 Z"/>' +
      '<path d="M24 14 L24 40" opacity="0.55"/>' +
      '<path d="M12 18 L20 17" opacity="0.5"/>' +
      '<path d="M12 22 L20 21" opacity="0.5"/>' +
      '<path d="M28 17 L36 18" opacity="0.5"/>' +
      '<path d="M28 21 L36 22" opacity="0.5"/>'
    ),

    // Camera — vintage with ornate lens
    'camera': (
      '<rect x="7" y="14" width="34" height="24" rx="3"/>' +
      '<path d="M17 14 L20 10 L28 10 L31 14"/>' +
      '<circle cx="24" cy="26" r="7"/>' +
      '<circle cx="24" cy="26" r="4" opacity="0.55"/>' +
      '<circle cx="24" cy="26" r="1.4" fill="currentColor"/>' +
      '<circle cx="36" cy="18" r="1" fill="currentColor" opacity="0.8"/>'
    ),

    // Portrait — head silhouette in oval frame
    'portrait': (
      '<ellipse cx="24" cy="24" rx="14" ry="18"/>' +
      '<circle cx="24" cy="19" r="4"/>' +
      '<path d="M17 34 C 19 28, 29 28, 31 34"/>' +
      // ornate frame ticks
      '<path d="M24 6 L24 8" opacity="0.55"/>' +
      '<path d="M24 42 L24 40" opacity="0.55"/>' +
      '<path d="M10 24 L12 24" opacity="0.55"/>' +
      '<path d="M38 24 L36 24" opacity="0.55"/>'
    ),

    // Selfie — hand holding a phone/mirror
    'selfie': (
      '<rect x="18" y="6" width="14" height="24" rx="2.5"/>' +
      '<circle cx="25" cy="14" r="3"/>' +
      '<path d="M23 20 C 25 22, 27 22, 27 20" opacity="0.7"/>' +
      // hand
      '<path d="M18 30 C 14 32, 12 36, 14 40"/>' +
      '<path d="M32 30 C 30 34, 26 36, 22 36"/>' +
      '<path d="M16 40 L22 40" opacity="0.6"/>'
    ),

    // Favorite / heart
    'heart': (
      '<path d="M24 40 C 12 32, 6 24, 8 16 C 10 8, 20 8, 24 16 C 28 8, 38 8, 40 16 C 42 24, 36 32, 24 40 Z"/>' +
      '<path d="M14 16 C 16 20, 19 22, 22 22" opacity="0.4"/>'
    ),

    // Search — magnifying glass with ornate handle
    'search': (
      '<circle cx="20" cy="20" r="10"/>' +
      '<path d="M28 28 L38 38"/>' +
      '<circle cx="20" cy="20" r="6" opacity="0.4"/>' +
      // ornate handle detail
      '<path d="M32 32 L34 34" opacity="0.6"/>' +
      '<path d="M35 35 L37 37" opacity="0.4"/>'
    ),

    // Idea/lightbulb — hint marker
    'idea': (
      '<path d="M18 16 C 18 10, 22 6, 24 6 C 26 6, 30 10, 30 16 C 30 20, 27 22, 27 26 L21 26 C 21 22, 18 20, 18 16 Z"/>' +
      '<path d="M22 30 L26 30" opacity="0.6"/>' +
      '<path d="M22 34 L26 34" opacity="0.6"/>' +
      // rays
      '<path d="M24 2 L24 4" opacity="0.6"/>' +
      '<path d="M8 12 L11 13" opacity="0.5"/>' +
      '<path d="M40 12 L37 13" opacity="0.5"/>' +
      '<path d="M10 20 L12 21" opacity="0.4"/>' +
      '<path d="M38 20 L36 21" opacity="0.4"/>'
    ),

    // Empty gallery — ornate picture frame
    'frame': (
      '<rect x="8" y="10" width="32" height="28" rx="1"/>' +
      '<rect x="11" y="13" width="26" height="22" rx="0.5" opacity="0.4"/>' +
      // Art Nouveau corner flourishes
      '<path d="M8 10 C 6 10, 6 12, 8 12" opacity="0.7"/>' +
      '<path d="M40 10 C 42 10, 42 12, 40 12" opacity="0.7"/>' +
      '<path d="M8 38 C 6 38, 6 36, 8 36" opacity="0.7"/>' +
      '<path d="M40 38 C 42 38, 42 36, 40 36" opacity="0.7"/>' +
      // inner ornament (mountain + sun placeholder)
      '<path d="M14 30 L20 22 L26 28 L34 20" opacity="0.55"/>' +
      '<circle cx="32" cy="18" r="2" opacity="0.65"/>'
    ),

    // Achievement badges ──────────────────────────

    // Bud — first pose (starter achievement)
    'bud': (
      '<path d="M24 34 L24 22"/>' +
      '<path d="M24 22 C 20 20, 18 15, 20 12 C 22 10, 24 12, 24 15 C 24 12, 26 10, 28 12 C 30 15, 28 20, 24 22 Z"/>' +
      '<path d="M24 30 C 18 30, 16 34, 18 38 C 22 36, 24 33, 24 30 Z" opacity="0.75"/>' +
      '<path d="M18 38 L14 42" opacity="0.5"/>'
    ),

    // Target — practice consistency
    'target': (
      '<circle cx="24" cy="24" r="16"/>' +
      '<circle cx="24" cy="24" r="10" opacity="0.7"/>' +
      '<circle cx="24" cy="24" r="4" opacity="0.85"/>' +
      '<circle cx="24" cy="24" r="1.5" fill="currentColor"/>' +
      // arrow feather
      '<path d="M34 14 L38 10" opacity="0.65"/>' +
      '<path d="M36 12 L40 12 L40 8" opacity="0.55"/>'
    ),

    // Flame — streak achievement
    'flame': (
      '<path d="M24 40 C 14 36, 12 26, 18 20 C 18 24, 20 26, 22 26 C 20 20, 22 12, 26 8 C 26 14, 30 16, 32 22 C 34 28, 32 36, 24 40 Z"/>' +
      '<path d="M22 34 C 20 30, 22 26, 24 26 C 26 28, 28 32, 26 36 C 24 37, 23 36, 22 34 Z" opacity="0.55"/>'
    ),

    // Laurel — mastery/trophy
    'laurel': (
      '<path d="M24 8 L24 40" opacity="0.55"/>' +
      // left branch
      '<path d="M22 10 C 14 12, 10 16, 12 22"/>' +
      '<path d="M20 16 C 14 18, 12 22, 14 28"/>' +
      '<path d="M20 24 C 14 26, 12 30, 14 36"/>' +
      // right branch
      '<path d="M26 10 C 34 12, 38 16, 36 22"/>' +
      '<path d="M28 16 C 34 18, 36 22, 34 28"/>' +
      '<path d="M28 24 C 34 26, 36 30, 34 36"/>' +
      // center star
      '<path d="M24 20 L25.5 24 L29 24 L26.2 26.5 L27.5 30 L24 27.8 L20.5 30 L21.8 26.5 L19 24 L22.5 24 Z" opacity="0.85"/>'
    ),

    // Check — confirmation glyph (used in toasts)
    'check': (
      '<path d="M10 24 L20 34 L38 14"/>' +
      '<circle cx="24" cy="24" r="18" opacity="0.35"/>'
    )

  };

  // ─── Public API ───────────────────────────────────────────────

  function render(name, opts) {
    opts = opts || {};
    var size = opts.size || 40;
    var body = ICONS[name];
    if (!body) {
      // Fallback — small dot
      return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 48 48" ' +
             'aria-hidden="true"><circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.5"/></svg>';
    }
    var extra = '';
    if (opts.class) extra += ' class="' + opts.class + '"';
    if (opts.ariaLabel) extra += ' role="img" aria-label="' + opts.ariaLabel + '"';
    else extra += ' aria-hidden="true"';
    return '<svg width="' + size + '" height="' + size + '" ' + SVG_ATTRS + extra + '>' + body + '</svg>';
  }

  function has(name) { return Object.prototype.hasOwnProperty.call(ICONS, name); }

  global.PoseArtIcons = {
    render: render,
    has: has,
    // Expose raw body strings for callers that build their own SVG
    _bodies: ICONS
  };

})(typeof window !== 'undefined' ? window : globalThis);
