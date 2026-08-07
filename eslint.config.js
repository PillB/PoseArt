// ============================================================
// PoseArt Solarize — ESLint flat config (Solarize §26 / D24 fix)
// ------------------------------------------------------------
// Minimal, dependency-free flat config. Lints the Solarize
// runtime (js/solarize) and the test suite. Legacy app scripts
// (js/auth.js, js/app.js, etc.) are browser-globals IIFEs and
// are intentionally NOT linted here to avoid noise from the
// pre-existing codebase.
// ============================================================
export default [
  {
    ignores: [
      'node_modules/',
      'audit/',
      'audit_harness/',
      '**/*.py',
      '**/*.json',
      'docs/',
    ],
  },
  {
    files: ['js/solarize/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        sessionStorage: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        FileReader: 'readonly',
        HTMLCanvasElement: 'readonly',
        HTMLElement: 'readonly',
        HTMLImageElement: 'readonly',
        Image: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        performance: 'readonly',
        globalThis: 'readonly',
        // PoseArt app globals (set by non-module legacy scripts)
        POSES_LIBRARY: 'readonly',
        PoseArtAnalytics: 'readonly',
        PoseArtAuth: 'readonly',
        // Node
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // Vitest / Playwright
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'eqeqeq': ['warn', 'smart'],
      'no-var': 'off',
    },
  },
];
