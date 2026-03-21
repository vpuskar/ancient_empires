// eslint.config.mjs — ESLint v9 flat config (v1.4 spec equivalent)
// Extends: next/core-web-vitals + @typescript-eslint/strict + prettier

import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  ...nextVitals,
  ...tseslint.configs.strict,
  prettierConfig,
]);
