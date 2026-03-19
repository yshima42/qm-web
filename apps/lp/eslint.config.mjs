import { dirname } from 'path';
import { fileURLToPath } from 'url';

import eslint from '@eslint/js';
import nextConfig from 'eslint-config-next';
import tseslint from 'typescript-eslint';

import unusedImports from 'eslint-plugin-unused-imports';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  {
    files: ['*.ts', '*.tsx'], // TypeScriptファイル
  },
  {
    ignores: ['**/.next/**/*', '*.config.mjs'], // 無視するファイル
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  ...nextConfig,
  {
    // @typescript-eslintに関する設定
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },
  {
    // MDXファイル用の設定（TypeScriptパーサーを使わない）
    files: ['*.mdx'],
    languageOptions: {
      parser: null, // TypeScriptパーサーを使わない
    },
  },
  {
    // eslint-plugin-importに関する設定（pluginはeslint-config-nextが提供）
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always', // import groups 1行空ける
          pathGroups: [
            {
              pattern: '@/components/**',
              group: 'internal',
              position: 'before',
            },
            { pattern: '@/lib/**', group: 'internal', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },
  {
    // eslint-plugin-unused-importsに関する設定
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    // その他設定
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      globals: {
        React: 'readonly',
      },
    },
    rules: {
      'react/jsx-boolean-value': 'error', // JSXの中でのbooleanの使用
      'react/jsx-curly-brace-presence': 'error', // JSXの中での余分な{}の使用
    },
  },
  eslintConfigPrettier, // Prettierとの競合防止
);
