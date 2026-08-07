// ============================================================
// PoseArt Solarize — Temporal Person Tracker (Solarize §11)
// ------------------------------------------------------------
// Session-local technical track IDs. NEVER infers real identity.
// Track lifecycle: tentative → confirmed → partially_occluded →
// temporarily_lost → recovered → terminated.
//
// Association cost combines: predicted root motion, bbox IoU,
// body-scale agreement, and visible-joint keypoint similarity.
// Handles crossing, overlap, temporary occlusion, re-entry,
// extra third person, similar clothing, different heights.
// ============================================================

import { computeRoot, torsoScale, oksDistance } from './canonical-schema.js';

export const TRACK_STATE = Object.freeze({
  TENTATIVE: 'tentative',
  CONFIRMED: 'confirmed',
  PARTIALLY_OCCLUDED: 'partially_occluded',
  TEMPORARILY_LOST: 'temporarily_lost',
  RECOVERED: 'recovered',
  TERMINATED: 'terminated',
});

const DEFAULTS = {
  tentativeConfirmFrames: 2,      // consecutive detections to confirm
  lostTerminateFrames: 30,        // ~1s @30fps before terminating a lost track
  occludedAfterMisses: 3,         // confirmed → partially_occluded
  lostAfterMisses: 8,             // partially_occluded → temporarily_lost
  associationThreshold: 0.55,     // below this cost, no association
  maxTrackAge: 60,                // hard terminate beyond this age in frames
  motionLambda: 0.35,             // weight of motion prediction vs appearance
};

function bboxIou(a, b) {
  if (!a || !b) return 0;
  const ax2 = a.x + a.w, ay2 = a.y + a.h, bx2 = b.x + b.w, by2 = b.y + b.h;
  const ix1 = Math.max(a.x, b.x), iy1 = Math.max(a.y, b.y);
  const ix2 = Math.min(ax2, bx2), iy2 = Math.min(ay2, by2);
  const iw = Math.max(0, ix2 - ix1), ih = Math.max(0, iy2 - iy1);
  const inter = iw * ih;
  const union = a.w * a.h + b.w * b.h - inter;
  return union > 0 ? inter / union : 0;
}

function kpSimilarity(trackKp, detKp) {
  // Average OKS-like similarity over visible joints (appearance cue).
  const scale = torsoScale(detKp) || 1;
  return oksDistance(trackKp, detKp, scale);
}

function scaleAgreement(trackScale, detScale) {
  if (!trackScale || !detScale) return 0.5;
  const r = Math.min(trackScale, detScale) / Math.max(trackScale, detScale);
  return r; // 1 = identical scale
}

export class PersonTracker {
  constructor(opts = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this.tracks = [];
    this.nextId = 1;
    this.frameIndex = 0;
    this.metrics = { idSwitches: 0, falseMerges: 0, falseSplits: 0 };
  }

  reset() { this.tracks = []; this.nextId = 1; this.frameIndex = 0; this.metrics = { idSwitches: 0, falseMerges: 0, falseSplits: 0 }; }

  // predicted root for a track using constant-velocity from history
  _predictedRoot(track) {
    if (!track.rootHistory || track.rootHistory.length < 2) return track.lastRoot;
    const n = track.rootHistory.length;
    const a = track.rootHistory[n - 2], b = track.rootHistory[n - 1];
    const vx = b.x - a.x, vy = b.y - a.y;
    return { x: b.x + vx, y: b.y + vy };
  }

  // Build cost matrix [tracks × detections]; lower = better match.
  _costMatrix(detections) {
    const active = this.tracks.filter((t) => t.state !== TRACK_STATE.TERMINATED);
    const cost = [];
    for (const t of active) {
      const row = [];
      const predRoot = this._predictedRoot(t);
      for (const d of detections) {
        const dRoot = d.root || computeRoot(d.imageLandmarks);
        const iou = bboxIou(t.lastBbox, d.bbox);
        const kp = kpSimilarity(t.lastLandmarks, d.imageLandmarks);
        const scale = scaleAgreement(t.lastScale, d.bodyScale || torsoScale(d.imageLandmarks));
        const rootDist = (predRoot && dRoot)
          ? Math.hypot(predRoot.x - dRoot.x, predRoot.y - dRoot.y) : 1;
        const motion = 1 - Math.exp(-3 * rootDist); // 0 close, 1 far
        const appearance = (1 - iou) * 0.4 + (1 - kp) * 0.5 + (1 - scale) * 0.1;
        const c = this.opts.motionLambda * motion + (1 - this.opts.motionLambda) * appearance;
        // Penalize beyond threshold but keep finite for assignment.
        row.push(c <= this.opts.associationThreshold ? c : 1.0 + c);
      }
      cost.push(row);
    }
    return { active, cost };
  }

  // Greedy + Hungarian-ish assignment (cost-matrix Hungarian for ≤8 tracks;
  // falls back to greedy for larger). Returns map trackIndex→detIndex.
  _assign(cost) {
    if (!cost.length) return [];
    if (!cost[0] || !cost[0].length) return [];
    if (cost.length <= 8 && cost[0].length <= 8) return hungarian(cost);
    return greedyAssign(cost);
  }

  update(detections, timestamp = 0) {
    this.frameIndex++;
    const { active, cost } = this._costMatrix(detections);
    const assignment = this._assign(cost); // [{t, d}]
    const matchedD = new Set(assignment.map((a) => a.d));
    const matchedT = new Set(assignment.map((a) => a.t));

    // Update matched tracks.
    for (const { t, d } of assignment) {
      const track = active[t];
      const det = detections[d];
      const wasLost = track.state === TRACK_STATE.TEMPORARILY_LOST || track.state === TRACK_STATE.PARTIALLY_OCCLUDED;
      this._updateTrack(track, det, timestamp, wasLost);
      if (wasLost && track.state === TRACK_STATE.CONFIRMED) track.state = TRACK_STATE.RECOVERED;
    }

    // Unmatched active tracks → age misses.
    for (let i = 0; i < active.length; i++) {
      if (matchedT.has(i)) continue;
      this._ageMiss(active[i]);
    }

    // Unmatched detections → new tentative tracks.
    for (let d = 0; d < detections.length; d++) {
      if (matchedD.has(d)) continue;
      this.tracks.push(this._newTrack(detections[d], timestamp));
    }

    // Prune terminated.
    this.tracks = this.tracks.filter((t) => t.state !== TRACK_STATE.TERMINATED);

    return this.confirmedTracks();
  }

  _newTrack(det, timestamp) {
    return {
      trackId: this.nextId++,
      state: TRACK_STATE.TENTATIVE,
      consecutiveHits: 1,
      misses: 0,
      age: 1,
      lastLandmarks: det.imageLandmarks,
      lastBbox: det.bbox,
      lastRoot: det.root || computeRoot(det.imageLandmarks),
      lastScale: det.bodyScale || torsoScale(det.imageLandmarks),
      lastConfidence: det.confidence,
      rootHistory: [det.root || computeRoot(det.imageLandmarks)],
      lastTimestamp: timestamp,
      birthFrame: this.frameIndex,
    };
  }

  _updateTrack(track, det, timestamp) {
    track.consecutiveHits++;
    track.misses = 0;
    track.age++;
    track.lastLandmarks = det.imageLandmarks;
    track.lastBbox = det.bbox;
    const r = det.root || computeRoot(det.imageLandmarks);
    track.lastRoot = r;
    track.lastScale = det.bodyScale || torsoScale(det.imageLandmarks);
    track.lastConfidence = det.confidence;
    track.lastTimestamp = timestamp;
    track.rootHistory.push(r);
    if (track.rootHistory.length > 8) track.rootHistory.shift();
    if (track.state === TRACK_STATE.TENTATIVE && track.consecutiveHits >= this.opts.tentativeConfirmFrames) {
      track.state = TRACK_STATE.CONFIRMED;
    } else if (track.state === TRACK_STATE.RECOVERED || track.state === TRACK_STATE.PARTIALLY_OCCLUDED || track.state === TRACK_STATE.TEMPORARILY_LOST) {
      track.state = TRACK_STATE.CONFIRMED;
    }
  }

  _ageMiss(track) {
    track.misses++;
    track.age++;
    track.consecutiveHits = 0;
    if (track.state === TRACK_STATE.CONFIRMED && track.misses >= this.opts.occludedAfterMisses) {
      track.state = TRACK_STATE.PARTIALLY_OCCLUDED;
    } else if (track.state === TRACK_STATE.PARTIALLY_OCCLUDED && track.misses >= this.opts.lostAfterMisses) {
      track.state = TRACK_STATE.TEMPORARILY_LOST;
    } else if (track.state === TRACK_STATE.TEMPORARILY_LOST && track.misses >= this.opts.lostTerminateFrames) {
      track.state = TRACK_STATE.TERMINATED;
    }
    if (track.age > this.opts.maxTrackAge) track.state = TRACK_STATE.TERMINATED;
  }

  confirmedTracks() {
    return this.tracks
      .filter((t) => t.state === TRACK_STATE.CONFIRMED || t.state === TRACK_STATE.RECOVERED)
      .map((t) => ({
        trackId: t.trackId, state: t.state, bbox: t.lastBbox,
        root: t.lastRoot, scale: t.lastScale, confidence: t.lastConfidence,
        landmarks: t.lastLandmarks, misses: t.misses, age: t.age,
      }));
  }

  allTracks() {
    return this.tracks.map((t) => ({ trackId: t.trackId, state: t.state, misses: t.misses, age: t.age, bbox: t.lastBbox }));
  }
}

// ---- Hungarian algorithm (Kuhn-Munkres) for small square-ish matrices -----
function hungarian(cost) {
  const n = cost.length;
  const m = cost[0].length;
  const size = Math.max(n, m);
  // Pad to square with a large value.
  const big = 1e6;
  const M = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i < n && j < m ? cost[i][j] : big)));
  const result = hungarianSquare(M);
  const out = [];
  for (const { t, d } of result) {
    if (t < n && d < m && M[t][d] < 1.0) out.push({ t, d }); // only keep real associations (cost < threshold gate already applied as 1.0+)
    else if (t < n && d < m && M[t][d] < big) out.push({ t, d });
  }
  // filter: keep only if original cost was below associationThreshold (≤1.0 marker)
  return out.filter(({ t, d }) => cost[t][d] <= 1.0);
}

function hungarianSquare(cost) {
  // Jonker-Volgenant-ish O(n^3) Hungarian. n small (≤8).
  const n = cost.length;
  const INF = Infinity;
  const u = new Array(n + 1).fill(0);
  const v = new Array(n + 1).fill(0);
  const p = new Array(n + 1).fill(0);
  const way = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array(n + 1).fill(INF);
    const used = new Array(n + 1).fill(false);
    do {
      used[j0] = true;
      let i0 = p[j0], delta = INF, j1 = -1;
      for (let j = 1; j <= n; j++) {
        if (!used[j]) {
          const c = cost[i0 - 1][j - 1] - u[i0] - v[j];
          if (c < minv[j]) { minv[j] = c; way[j] = j0; }
          if (minv[j] < delta) { delta = minv[j]; j1 = j; }
        }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
        else minv[j] -= delta;
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
  }
  const result = [];
  for (let j = 1; j <= n; j++) if (p[j] !== 0) result.push({ t: p[j] - 1, d: j - 1 });
  return result;
}

function greedyAssign(cost) {
  const cells = [];
  for (let t = 0; t < cost.length; t++)
    for (let d = 0; d < cost[t].length; d++)
      if (cost[t][d] <= 1.0) cells.push({ t, d, c: cost[t][d] });
  cells.sort((a, b) => a.c - b.c);
  const usedT = new Set(), usedD = new Set();
  const out = [];
  for (const { t, d } of cells) {
    if (usedT.has(t) || usedD.has(d)) continue;
    usedT.add(t); usedD.add(d); out.push({ t, d });
  }
  return out;
}
