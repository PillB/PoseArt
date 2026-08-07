import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ModelActivationManager, ACTIVATION_STATE, chooseModel, chooseBackend, detectCapabilities } from '../../js/solarize/model-activation.js';
import { PROFILES } from '../../js/solarize/runtime-profiles.js';

// Note: PoseWorkerService uses `new Worker(blobUrl)` which doesn't exist in Node.
// ModelActivationManager falls back to direct init when worker creation throws,
// so these tests exercise the direct + deterministic paths (the worker path is
// browser-only and exercised via Playwright).

describe('ModelActivationManager — deterministic activation', () => {
  let mgr;
  beforeEach(() => { mgr = new ModelActivationManager({ useWorker: false }); });
  afterEach(() => { mgr.dispose(); });

  it('activates the deterministic model to READY', async () => {
    await mgr.activate({ modelId: 'deterministic-test' });
    expect(mgr.state).toBe(ACTIVATION_STATE.READY);
    expect(mgr.modelId).toBe('deterministic-test');
    expect(mgr.backend).toBe('cpu');
    expect(mgr.fatalError).toBeNull();
  });

  it('detect() works after activation', async () => {
    await mgr.activate({ modelId: 'deterministic-test' });
    const frame = {
      width: 640, height: 480, timestamp: 1,
      descriptor: { persons: [{ keypoints: Array.from({ length: 17 }, () => [0.5, 0.5, 0.9]) }] },
    };
    const det = await mgr.detect(frame);
    expect(det.model).toBe('movenet-multipose');
    expect(det.persons).toHaveLength(1);
  });

  it('detect() before activation throws model_not_ready', async () => {
    await expect(mgr.detect({})).rejects.toThrow('model_not_ready');
  });

  it('waitReady resolves immediately when READY', async () => {
    await mgr.activate({ modelId: 'deterministic-test' });
    await expect(mgr.waitReady(500)).resolves.toBe(true);
  });
});

describe('ModelActivationManager — readiness gate', () => {
  it('waitReady rejects when state is FAILED', async () => {
    const mgr = new ModelActivationManager({ useWorker: false });
    mgr._fail('synthetic_failure');
    await expect(mgr.waitReady(500)).rejects.toThrow('model_failed:synthetic_failure');
    mgr.dispose();
  });

  it('waitReady times out when never ready', async () => {
    const mgr = new ModelActivationManager({ useWorker: false });
    mgr.state = ACTIVATION_STATE.LOADING;
    await expect(mgr.waitReady(200)).rejects.toThrow('model_timeout');
    mgr.dispose();
  });
});

describe('ModelActivationManager — unknown model', () => {
  it('fails with unknown_model for an unregistered modelId', async () => {
    const mgr = new ModelActivationManager({ useWorker: false });
    await mgr.activate({ modelId: 'nonexistent-model' });
    expect(mgr.state).toBe(ACTIVATION_STATE.FAILED);
    expect(mgr.fatalError).toMatch(/unknown_model/);
    mgr.dispose();
  });
});

describe('ModelActivationManager — real-model fallback (MoveNet unavailable in Node)', () => {
  it('falls back to deterministic when MoveNet/TF.js cannot load (labelled, not silent)', async () => {
    const mgr = new ModelActivationManager({ useWorker: false });
    await mgr.activate({ modelId: 'movenet-singlepose-lightning' });
    // In Node (no TF.js), the direct init fails → deterministic fallback.
    expect(mgr.state).toBe(ACTIVATION_STATE.FALLBACK);
    expect(mgr.modelId).toBe('deterministic-test');
    expect(mgr.fatalError).toBeTruthy(); // records why the real model failed
    // The fallback model still works.
    const det = await mgr.detect({ width: 1, height: 1, timestamp: 0, descriptor: { persons: [] } });
    expect(det.model).toBe('movenet-multipose');
    mgr.dispose();
  });

  it('retry() disposes and re-activates', async () => {
    const mgr = new ModelActivationManager({ useWorker: false });
    await mgr.activate({ modelId: 'deterministic-test' });
    expect(mgr.state).toBe(ACTIVATION_STATE.READY);
    await mgr.retry({ modelId: 'deterministic-test' });
    expect(mgr.state).toBe(ACTIVATION_STATE.READY);
    mgr.dispose();
  });
});

describe('ModelActivationManager — status + onStatus', () => {
  it('emits status snapshots to subscribers', async () => {
    const mgr = new ModelActivationManager({ useWorker: false });
    const statuses = [];
    const unsub = mgr.onStatus((s) => statuses.push(s.state));
    await mgr.activate({ modelId: 'deterministic-test' });
    expect(statuses).toContain(ACTIVATION_STATE.LOADING);
    expect(statuses).toContain(ACTIVATION_STATE.READY);
    unsub();
    mgr.dispose();
  });

  it('status() reports model/backend/fps/latency/worker', async () => {
    const mgr = new ModelActivationManager({ useWorker: false });
    await mgr.activate({ modelId: 'deterministic-test' });
    const frame = { width: 1, height: 1, timestamp: 1, descriptor: { persons: [{ keypoints: Array.from({ length: 17 }, () => [0.5, 0.5, 0.9]) }] } };
    await mgr.detect(frame);
    const s = mgr.status();
    expect(s.modelId).toBe('deterministic-test');
    expect(s.backend).toBe('cpu');
    expect(s.ready).toBe(true);
    expect(s.usingWorker).toBe(false);
    expect(typeof s.latencyMs).toBe('number');
    mgr.dispose();
  });
});

describe('ModelActivationManager — background throttle (Solarize §9)', () => {
  it('setBackgrounded(true) makes detect() return throttled drop', async () => {
    const mgr = new ModelActivationManager({ useWorker: false });
    await mgr.activate({ modelId: 'deterministic-test' });
    mgr.setBackgrounded(true);
    const det = await mgr.detect({ width: 1, height: 1, timestamp: 0, descriptor: { persons: [] } });
    expect(det.dropped).toBe(true);
    expect(det.throttled).toBe(true);
    expect(mgr.status().backgrounded).toBe(true);
    mgr.dispose();
  });
});

describe('chooseModel / chooseBackend / detectCapabilities', () => {
  it('chooseModel returns deterministic for SIMULATION profile', () => {
    expect(chooseModel(PROFILES.SIMULATION, { webgpu: true })).toBe('deterministic-test');
  });
  it('chooseModel returns movenet-multipose for RGB_HIGH_PERFORMANCE + WebGPU', () => {
    expect(chooseModel(PROFILES.RGB_HIGH_PERFORMANCE, { webgpu: true })).toBe('movenet-multipose-lightning');
  });
  it('chooseModel returns movenet-singlepose for RGB_COMPATIBLE', () => {
    expect(chooseModel(PROFILES.RGB_COMPATIBLE, { wasm: true })).toBe('movenet-singlepose-lightning');
  });
  it('chooseBackend prefers WebGPU when available', () => {
    expect(chooseBackend({ webgpu: true, webgl: true, wasm: true })).toBe('webgpu');
  });
  it('chooseBackend falls back to wasm when no GPU', () => {
    expect(chooseBackend({ webgpu: false, webgl: false, wasm: true })).toBe('wasm');
  });
  it('chooseBackend returns cpu when nothing else available', () => {
    expect(chooseBackend({ webgpu: false, webgl: false, wasm: false })).toBe('cpu');
  });
  it('detectCapabilities returns a capability object', () => {
    const caps = detectCapabilities();
    expect(caps).toHaveProperty('webgpu');
    expect(caps).toHaveProperty('webgl');
    expect(caps).toHaveProperty('wasm');
    expect(caps).toHaveProperty('worker');
    expect(caps).toHaveProperty('offscreenCanvas');
  });
});
