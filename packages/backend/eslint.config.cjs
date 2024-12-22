const baseConfig = require('../../eslint.config.cjs');

module.exports = [
  ...baseConfig,
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/cdk.out/**', '**/vitest.d.ts'],
  },
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: ['tslib', 'vitest'],
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}', '{projectRoot}/vite.config.{js,ts,mjs,mts}'],
        },
      ],
    },
    languageOptions: {
      parser: require('jsonc-eslint-parser'),
    },
  },
];
