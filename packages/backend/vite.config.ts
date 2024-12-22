/// <reference types='vitest' />
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/backend',
  plugins: [],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  test: {
    coverage: {
      enabled: true,
      exclude: ['bin/**/*.ts', 'cdk.out', 'test'],
      provider: 'v8',
      reporter: [['clover'], ['json'], ['lcov', { projectRoot: __dirname }], ['text']],
      reportsDirectory: '../../coverage/packages/backend',
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: -10,
      },
    },
    environment: 'node',
    globals: true,
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    pool: 'forks',
    reporters: ['default'],
    setupFiles: ['test/setup.ts'],
  },
});
