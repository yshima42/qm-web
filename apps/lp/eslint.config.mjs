// https://astris.design/atcl/next15-eslint9-prettier/
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  {
    files: ['*.ts', '*.tsx'], // 読み込むファイル
  },
  {
    ignores: ['**/.next/**/*', '*.config.mjs'], // 無視するファイル
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  ...compat.extends('next/core-web-vitals'),
  ...tailwind.configs['flat/recommended'],
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
    // tailwindcssに関する設定
    settings: {
      tailwindcss: {
        whitelist: ['hidden-scrollbar', '-webkit-scrollbar'],
      },
    },
    rules: {
      'tailwindcss/classnames-order': 'off', // Tailwindのクラス順序の警告を無効化
    },
  },
  {
    // eslint-plugin-importに関する設定
    plugins: {
      import: importPlugin,
    },
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
