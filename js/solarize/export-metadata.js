// ============================================================
// PoseArt Solarize — Capture Export Metadata (Solarize §7)
// ------------------------------------------------------------
// Provenance for exported captures. Every download/share carries:
//   • a filename encoding SIM/REAL + poseName + id
//   • a sidecar .poseart.json metadata file with isSim, profile,
//     modelId, score, timestamp, poseId, poseName
//
// Users (and downstream tools) can always tell whether an exported
// capture was synthetic or real-inference — the provenance never
// detaches from the file.
// ============================================================

// Build a filename that encodes SIM/REAL provenance.
//   poseart-<sim|real>-<safePoseName>-<id>.jpg
export function exportFileName(item) {
  const safeName = String(item?.poseName || 'capture')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'capture';
  const mode = item?.isSim ? 'sim' : 'real';
  return `poseart-${mode}-${safeName}-${item?.id || Date.now()}.jpg`;
}

// Build a sidecar metadata object (JSON-serializable).
// Contains the full Solarize §7 provenance for the capture.
export function exportMetadata(item) {
  if (!item) return null;
  return {
    schema: 'poseart-capture/v1',
    id: item.id,
    poseId: item.poseId,
    poseName: item.poseName,
    score: item.score ?? 0,
    timestamp: item.timestamp,
    isSim: !!item.isSim,
    profile: item.profile || (item.isSim ? 'SIMULATION' : 'UNKNOWN'),
    modelId: item.modelId || null,
    favorite: !!item.favorite,
    exportedAt: new Date().toISOString(),
  };
}

// Build the sidecar JSON filename matching the image filename.
//   poseart-<sim|real>-<safePoseName>-<id>.poseart.json
export function exportSidecarName(item) {
  const base = exportFileName(item).replace(/\.jpg$/, '');
  return base + '.poseart.json';
}

// Trigger a download of the sidecar JSON metadata alongside the image.
export function downloadSidecarMetadata(item) {
  const meta = exportMetadata(item);
  if (!meta) return false;
  const blob = new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = exportSidecarName(item);
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke after a short delay so the download has time to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

// Build a share payload title that discloses SIM/REAL.
export function shareTitle(item) {
  const mode = item?.isSim ? 'SIMULATION' : 'REAL';
  return `${item?.poseName || 'PoseArt capture'} (${mode})`;
}
