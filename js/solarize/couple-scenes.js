// ============================================================
// PoseArt Solarize — Couple Scenes runtime bridge (Round 3, D10/D11/D12)
// ------------------------------------------------------------
// Runtime companion to `couple-pose-migration.js`. At load time it runs
// `migrateAllCouplePoses` over the legacy global `POSES_LIBRARY` and
// exposes the resulting PoseScene map on `window.PoseArtCoupleScenes`,
// keyed by legacy poseId:
//
//     window.PoseArtCoupleScenes = {
//       'couple-embrace': PoseScene,
//       'back-to-back':    PoseScene,
//       ...
//     }
//
// This lets camera.js / role-assignment.js consume two-person scenes for
// couple poses WITHOUT modifying poses-data.js. The legacy library is
// untouched; this is purely a derived view.
//
// Load order (in index.html):
//     <script src="js/poses-data.js"></script>                 <!-- classic -->
//     <script type="module" src="js/solarize/couple-scenes.js"></script>
//
// ES module execution is deferred, so poses-data.js (a classic script) has
// already been parsed and `POSES_LIBRARY` is available in the shared
// global lexical environment by the time this module runs.
//
// Every emitted PoseScene is marked `validationStatus.state =
// 'migrated_pending_review'`. A human reviewer must promote scenes to
// `canonical` before they are used as ground-truth pose references.
// ============================================================

import { migrateAllCouplePoses } from './couple-pose-migration.js';

function buildCoupleScenes() {
  if (typeof window === 'undefined') return;

  // Resolve the legacy library. poses-data.js declares `const POSES_LIBRARY`
  // at top level of a classic script, which lands in the global lexical
  // environment shared with module scripts. We also tolerate the library
  // being attached to `window` directly (future-proof) for robustness.
  let lib = null;
  try {
    if (typeof POSES_LIBRARY !== 'undefined') lib = POSES_LIBRARY;
  } catch (_e) { /* POSES_LIBRARY not in scope */ }
  if (!lib && typeof window.POSES_LIBRARY !== 'undefined') {
    lib = window.POSES_LIBRARY;
  }

  if (!lib) {
    console.warn('[PoseArt couple-scenes] POSES_LIBRARY not found; nothing to migrate.');
    window.PoseArtCoupleScenes = {};
    return;
  }

  try {
    const result = migrateAllCouplePoses(lib);
    window.PoseArtCoupleScenes = result.scenes;
    // Non-enumerable meta block for diagnostics (does not pollute
    // poseId→scene iteration).
    Object.defineProperty(window.PoseArtCoupleScenes, '__meta', {
      value: {
        count: result.count,
        unmigrated: result.unmigrated,
        builtAt: new Date().toISOString(),
        schema: 'PoseScene/v1',
        validationState: 'migrated_pending_review',
      },
      enumerable: false,
      writable: false,
      configurable: false,
    });
    if (result.unmigrated.length) {
      console.warn(
        '[PoseArt couple-scenes] unmigrated couple poses:',
        result.unmigrated,
      );
    } else {
      // eslint-disable-next-line no-console
      console.info(
        `[PoseArt couple-scenes] migrated ${result.count} couple poses to PoseScene.`,
      );
    }
  } catch (e) {
    console.error('[PoseArt couple-scenes] build failed:', e);
    window.PoseArtCoupleScenes = {};
  }
}

// Run immediately on module evaluation. Module scripts are deferred, so
// the DOM and poses-data.js are already parsed when this executes.
buildCoupleScenes();

// Re-export for callers that want programmatic access (e.g. tests).
export { buildCoupleScenes };
