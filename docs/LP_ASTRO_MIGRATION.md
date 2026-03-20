# LP Astro 移行進捗

## 概要
apps/lp を Next.js 16 → Astro 6 + Cloudflare Pages に移行。

---

## Phase 1-8: 完了 ✅

- プロジェクト初期化、i18n基盤、全コンポーネント、ブログ、法的ドキュメント、mate LP、SEO、デプロイ設定

## Phase 9: テスト・デバッグ ✅

- ビルド成功: 70ページ、1.9秒、警告ゼロ
- ブログContent Collectionsをロケール別に分離（重複ID解消）
- mate LPスクリーンショットパス修正、サイト名翻訳対応
- ダークモード削除、DocumentLayoutの右スペース修正
- 法的ドキュメントをContent Collections + `<Content />`に移行
- kinshu/porn/tobaccoの利用規約・プライバシーポリシーを正式版で生成

## Phase 10: 切り替え ✅

- lp-astro → lp にリネーム、旧lp → lp-legacy にバックアップ
- package.json / turbo.json / lint-staged 更新
- postcss.config.mjs 削除（Astro不要）

---

## 残タスク

### コミット・プッシュ
- [ ] `yarn install` で依存解決
- [ ] `--no-verify` でコミット（pre-commit フックが旧LP前提のため）
- [ ] リモートにプッシュ

### Cloudflare Pages デプロイ
- [ ] Cloudflare アカウント作成（未作成の場合）
- [ ] Dashboard → Pages → Create project → Git連携
  - Build command: `cd apps/lp && npx astro build`
  - Build output directory: `apps/lp/dist`
- [ ] カスタムドメイン設定（about.quitmate.app）
- [ ] DNS CNAME を Vercel → Cloudflare Pages に変更

### Cloudflare Redirect Rules（言語リダイレクト）
- [ ] Dashboard → Rules > Redirect Rules
- [ ] ルール1: `URI Path equals /` AND `Accept-Language starts with ja` → 302 `/ja/`
- [ ] ルール2: `URI Path equals /` → 302 `/en/`
- 詳細: `docs/ARCHITECTURE_DECISION.md` の「多言語ルーティング」セクション参照

### デザイン調整
- [ ] 既存LPと見た目を合わせる or リニューアル
- [ ] モバイル表示の確認・調整

### クリーンアップ
- [ ] `apps/lp-legacy` 削除（本番で問題なければ）
- [ ] pre-commit フック（.husky/pre-commit）を Astro 対応に更新
- [ ] `UPGRADE_PROGRESS.md` 削除（役割終了）
