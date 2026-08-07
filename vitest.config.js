import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig({
  root: __dirname,
  css: { postcss: {} },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    reporters: ['default'],
    coverage: { enabled: false },
    css: false,
  },
});
