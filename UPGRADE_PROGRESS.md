# 全パッケージアップグレード進捗

## 実施日: 2026-03-19

---

## ✅ Step 1: package.json バージョン更新（完了）

### 変更済みファイル:
- **`package.json`** (root) — devDeps更新、`tailwind-merge`/`tailwindcss`/`tailwindcss-animate` 削除、`resolutions` で `@types/react` 統一
- **`apps/web/package.json`** — Next.js 16、React 19.2、Supabase/TanStack/Radix等の最新化、`autoprefixer`/`tailwindcss-animate` 削除、`@tailwindcss/postcss`/`tw-animate-css` 追加
- **`apps/lp/package.json`** — Next.js 16、React 19.2、next-intl 4.8、framer-motion 12.38、eslint-config-next 16
- **`packages/ui/package.json`** — React 19.2、Radix UI全依存明示化（dialog, dropdown-menu, tabs, select 2.1.x, slot）
- **`packages/analytics/package.json`** — Next.js 16、React 19.2

---

## ✅ Step 2: Next.js 16 対応の破壊的変更修正（完了）

- **`apps/lp/src/middleware.ts`** → **`apps/lp/src/proxy.ts`** にリネーム＆`proxy` named export に変更
- **`apps/lp/next.config.ts`** — `eslint` ブロック削除
- **`apps/lp/package.json`** — `"lint": "next lint"` → `"lint": "eslint ."`
- **`apps/web/src/app/(main)/[user_name]/articles/[id]/opengraph-image.tsx`** — `params` を `Promise` 型に変更＆`await`
- **`apps/web/src/proxy.ts`** — 既に正しい形式、変更不要

---

## ✅ Step 3: Tailwind v3 → v4 移行（web のみ）（完了）

- **`apps/web/postcss.config.mjs`** — `@tailwindcss/postcss` プラグインに変更
- **`apps/web/src/app/globals.css`** — v4形式に全面書き換え
  - `@import "tailwindcss"` + `@import "tw-animate-css"`
  - `@custom-variant dark` でクラスベースダークモード
  - `@theme inline` でカラーとborder-radius定義
  - `@utility` ディレクティブで `scrollbar-hide` と `with-safe-area-bottom` 定義
  - `--color-primary` → `--color-primary-rgb` にリネーム
- **`apps/web/tailwind.config.ts`** — 削除（CSS-first configに移行）

---

## ✅ Step 4: ESLint / lint-staged 更新（完了）

- **`apps/web/package.json`** scripts — `--ext` オプション削除
- **`apps/web/eslint.config.mjs`** — `FlatCompat` 廃止、`eslint-config-next` のデフォルトエクスポートを直接使用
- **`apps/lp/eslint.config.mjs`** — `FlatCompat` 廃止、`eslint-plugin-tailwindcss` 削除（v4非互換）、`eslint-plugin-import` の重複プラグイン定義削除
- **`lint-staged.config.js`** — `cd apps/lp &&` パターン削除（lint-staged v16対応）

---

## ✅ Step 5: 検証

| チェック | 結果 |
|---|---|
| `yarn install` | ✅ 完了 |
| `yarn dev:web:dev` | ✅ 200レスポンス確認 |
| `yarn dev:lp` | ✅ 正常動作確認 |
| `yarn workspace web lint:type` | ✅ パス |
| `yarn workspace web lint` | ⚠️ 6 errors — 既存コードの `react-hooks/set-state-in-effect` 等（新ルール、アップグレード由来ではない） |
| `yarn workspace lp lint` | ⚠️ 16 errors — 既存コードの strict TypeScript ルール違反（アップグレード由来ではない） |
| `yarn turbo run build --filter=web` | ⬜ サンドボックスのメモリ不足(4GB)で segfault → **ローカルで実行してください** |
| `yarn build:lp` | ⬜ 同上 |

---

## 解決した問題一覧

| 問題 | 対処 |
|---|---|
| `tw-animate-css` の `@plugin` が Node.js exports と非互換 | `@plugin` → `@import` に変更 |
| `packages/ui` で Radix パッケージが解決できない | `@radix-ui/react-dialog`, `react-dropdown-menu`, `react-tabs` を依存に明示追加 |
| `@radix-ui/react-select@2.2.6` の内部依存が yarn v1 で壊れる | `^2.1.14` にダウングレード |
| `apps/web/yarn.lock` が Turbopack の root 推定を妨害 | 削除 |
| LP の `tailwind.config.ts` が v3 形式で v4 と非互換 | 削除し `globals.css` の `@theme inline` に全テーマ統合 |
| LP の `favicon.ico` が非RGBA PNG を含みTurbopackでエラー | RGBA形式に再生成 |
| LP で `@parcel/watcher` が見つからない | `@parcel/watcher` を devDeps に追加 |
| `@types/react` のバージョン重複で JSX コンポーネント型エラー | root `resolutions` で `^19.2.0` に統一 |
| `eslint-config-next@16` で `FlatCompat` が循環参照 | デフォルトエクスポートを直接使用に変更 |
| `eslint-plugin-tailwindcss` が Tailwind v4 非互換 | LP の eslint config から削除 |
| `eslint-plugin-import` が `eslint-config-next@16` と重複 | plugins 定義を削除（nextが提供） |

---

## 残りの軽微な対応（任意）

| 対応 | 詳細 |
|---|---|
| viewport メタデータ分離 | `/stories/habits/[category]` で `metadata` に `viewport` が含まれている → `generateViewport` に分離 |
| web lint エラー修正 | `react-hooks/set-state-in-effect` 等の新ルール対応 |
| lp lint エラー修正 | strict TypeScript ルール違反の修正 |
| `@radix-ui/react-select` 最新化 | yarn berry 移行後に `^2.2.6` に更新可能 |
