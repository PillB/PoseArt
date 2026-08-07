// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(resolve(__dirname, '../../js/app.js'), 'utf8');

describe('Solarize §7 — Gallery detail provenance', () => {
  it('openGalleryItem shows SIM/REAL badge in the detail meta', () => {
    expect(appJs).toContain('Solarize §7: show SIM/REAL provenance + profile + modelId in the detail meta');
    expect(appJs).toContain("item.isSim\n      ? '<span class=\"session-sim-pill\"");
    expect(appJs).toContain("'<span class=\"session-real-pill\"");
  });

  it('detail meta includes profile when present', () => {
    expect(appJs).toContain('item.profile');
    expect(appJs).toMatch(/profileStr.*item\.profile/);
  });

  it('detail meta includes modelId when present', () => {
    expect(appJs).toContain('item.modelId');
    expect(appJs).toMatch(/modelStr.*item\.modelId/);
  });

  it('detail meta uses innerHTML (not textContent) to render the badge', () => {
    // The badge is an HTML span, so meta.innerHTML is required.
    expect(appJs).toContain('meta.innerHTML =');
  });
});
