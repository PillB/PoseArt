// ============================================================
// PoseArt Solarize — Dossier bootstrap (browser)
// ------------------------------------------------------------
// Builds per-pose dossiers for every couple pose at load time and
// exposes them on window.PoseArtDossiers. The pose-detail screen
// consumes this to render a "Solarize validation" panel.
// ============================================================

import { buildAllCoupleDossiers } from './solarize/pose-dossiers.js';
import { migrateAllCouplePoses } from './solarize/couple-pose-migration.js';

function boot() {
  if (typeof window === 'undefined') return;
  const lib = (typeof POSES_LIBRARY !== 'undefined') ? POSES_LIBRARY : window.POSES_LIBRARY;
  if (!lib) { console.warn('[PoseArt dossiers] POSES_LIBRARY not found'); return; }
  try {
    const migrated = migrateAllCouplePoses(lib);
    const { dossiers, summary } = buildAllCoupleDossiers(lib, migrated.scenes);
    window.PoseArtDossiers = Object.freeze({
      dossiers,
      summary,
      get(poseId) { return dossiers[poseId] || null; },
    });
    console.info(`[PoseArt dossiers] built ${summary.total} dossiers (${summary.automatedPass} automated-pass, ${summary.blocked} blocked).`);
    window.dispatchEvent(new CustomEvent('poseart:dossiers-ready', { detail: summary }));
  } catch (e) {
    console.error('[PoseArt dossiers] build failed:', e);
  }
}

boot();
