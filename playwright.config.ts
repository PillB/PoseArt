// ============================================================
// PoseArt Solarize — Playwright config (Solarize §24 / §26 / D24)
// ------------------------------------------------------------
// Full browser matrix:
//   • smoke (Chromium)            — gate + disclosure + build-id meta
//   • publication (Chromium)      — build-id populated + creds provisioned
//   • camera-journey (Chromium)   — visible-control pipeline @camera
//   • permission-states (Chromium)— camera-denied / no-camera / sim
//   • responsive (Chromium)       — viewport matrix @visual
//   • firefox-camera (Firefox)    — no-camera deterministic path
//   • webkit-camera (WebKit)      — no-camera deterministic path
//   • mobile-iphone (Chromium)    — iPhone 14 viewport @visual
//
// All journeys use visible controls (real login form, real button
// clicks). No internal-function bypasses in primary journeys (§24).
// webServer auto-starts a static server on :8080.
// ============================================================
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/playwright-junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'python3 -m http.server 8080',
    port: 8080,
    reuseExistingServer: true,
    timeout: 30_000,
    cwd: '.',
  },
  projects: [
    // Source smoke — gate + disclosure + build-id meta exists.
    {
      name: 'smoke',
      testMatch: /smoke\.spec\.js$/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Publication — build-id populated + creds provisioned.
    {
      name: 'publication',
      testMatch: /publication\.spec\.js$/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Camera journey via visible controls (Chromium — has camera-permission emulation).
    {
      name: 'camera-chromium',
      testMatch: /camera-journey\.spec\.js$/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Permission & failure states (Chromium-only permission emulation).
    {
      name: 'permission-chromium',
      testMatch: /permission-states\.spec\.js$/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Responsive viewport matrix.
    {
      name: 'responsive-chromium',
      testMatch: /responsive\.spec\.js$/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox — no-camera deterministic path (camera-journey, firefox tests only).
    {
      name: 'firefox',
      testMatch: /camera-journey\.spec\.js|permission-states\.spec\.js/,
      use: { ...devices['Desktop Firefox'] },
    },
    // WebKit — documented limitation: requires system libs (libgtk-4, libgraphene,
    // libgstgl, libmanette) unavailable in this sandbox. The webkit project is
    // configured for CI environments with `npx playwright install-deps` available.
    // On this sandbox it will fail to launch; that is recorded honestly in the worklog.
    {
      name: 'webkit',
      testMatch: /camera-journey\.spec\.js|permission-states\.spec\.js/,
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile — iPhone-sized viewport on Chromium (WebKit engine unavailable
    // in this sandbox; documented in worklog). Uses Pixel 5 device descriptor
    // which is Chromium-based, with iPhone-equivalent dimensions.
    {
      name: 'mobile-iphone',
      testMatch: /responsive\.spec\.js|camera-journey\.spec\.js/,
      use: { ...devices['Pixel 5'] },
    },
    // Live production retest (Solarize §28). Targets the REAL deployment at
    // https://pillb.github.io/PoseArt/. Trace/screenshot/video are OFF so
    // credentials are never captured in artifacts. Credentials come from
    // POSEART_TEST_USERNAME / POSEART_TEST_PASSWORD env vars (never hard-coded).
    {
      name: 'live-production',
      testMatch: /live-production\.spec\.js$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://pillb.github.io',
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
  ],
});
