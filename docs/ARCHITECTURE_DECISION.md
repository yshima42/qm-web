# アーキテクチャ決定記録

## 調査日: 2026-03-19

---

## 1. フレームワーク選定

### 決定

| アプリ | 現在 | 決定 | 理由 |
|---|---|---|---|
| **LP** | Next.js 16 | **Astro に移行** | 静的サイト + ブログに最適。Cloudflare買収でサポート最高 |
| **SNS (web)** | Next.js 16 | **Next.js 維持** | Supabase SSR, next-intl, shadcn/ui, TanStack Query の移行コストが高すぎる |

### 将来の再評価ポイント
- TanStack Start v1 正式リリース後 → SNS アプリの移行先として検討
- Cloudflare Vinext 安定後 → SNS の Vercel → Cloudflare 移行を検討

---

## 2. ホスティング選定

### 決定

| アプリ | 現在 | 決定 | 理由 |
|---|---|---|---|
| **LP (Astro)** | Vercel | **Cloudflare Pages** | 無料（帯域幅無制限）、Astro買収元、日本300+PoP |
| **SNS (Next.js)** | Vercel | **当面Vercel維持** | ゼロコンフィグ、移行リスク回避 → Vinext/OpenNext成熟後にCF移行検討 |

### コスト見通し

| 構成 | 月額 |
|---|---|
| 現在（Vercel × 2） | $20〜 |
| LP: Cloudflare + SNS: Vercel | $20 + $0 |
| 将来: 全部 Cloudflare | $5〜 |

---

## 3. 多言語ルーティング（i18n）

### 調査日: 2026-03-19

### 決定: Cloudflare Redirect Rules（コード不要）

ルートURL (`/`) へのアクセス時に `Accept-Language` ヘッダーを見て `/ja/` or `/en/` に 302 リダイレクト。

### 検出優先順位
1. **URLパス** (`/ja/about` なら日本語) — 最も確実
2. **Cookie** (ユーザーが明示的に選択した言語) — 将来実装
3. **Accept-Language ヘッダー** — ブラウザ言語設定、Cloudflare Redirect Rules で判定
4. **CF-IPCountry** (IPジオロケーション) — 使わない（国≠言語のため不適切）
5. **デフォルト言語** (en) — 最終フォールバック

### 方法比較

| 方法 | 複雑さ | 柔軟性 | 採用 |
|---|---|---|---|
| **Cloudflare Redirect Rules** | コード不要、ダッシュボード設定 | ルートURLのみ | ✅ 採用 |
| Pages Functions/Worker | コード必要 | 高い（Cookie永続化等） | 将来拡張時 |
| クライアントJS | 簡単 | ちらつく | ❌ |
| Astro middleware | SSRモード必要 | 高い | ❌ 静的サイトには不適 |

### Accept-Language vs IP ジオロケーション

| 観点 | Accept-Language | CF-IPCountry |
|---|---|---|
| 精度（言語判定） | 高い | 低い（国≠言語） |
| VPN耐性 | 影響されない | VPN使用時に誤判定 |
| 用途 | **言語選択に最適** | 通貨や地域フォーマットの初期値のみ |

### SEO ベストプラクティス
- **302（一時リダイレクト）** を使う — 301 だと検索エンジンが片方の言語しかインデックスしない
- **hreflang タグ** — 全ページの `<head>` に設定済み（BaseLayout）
- **canonical URL** — 各ページに設定済み
- **言語スイッチャー** — Header に設置済み

### Cloudflare Redirect Rules 設定手順

Cloudflare Dashboard → **Rules > Redirect Rules** で:

**ルール1（日本語ユーザー）**:
- 条件: `URI Path equals /` AND `Accept-Language starts with ja`
- アクション: 302 リダイレクト → `/ja/`

**ルール2（デフォルト）**:
- 条件: `URI Path equals /`
- アクション: 302 リダイレクト → `/en/`

**注意**: `src/pages/index.astro` の `/en/` リダイレクトはフォールバックとして残す（Redirect Rules が適用されない場合の保険）

### 将来の拡張
Cookie 永続化が必要になったら Cloudflare Functions に移行:
- ユーザーが言語スイッチャーで選択 → Cookie に保存
- 次回訪問時は Cookie 優先 → Accept-Language → デフォルト

### 参考情報
- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [Cloudflare Accept-Language リダイレクト](https://hegedus.me/en/blog/language-specific-redirects-based-on-accept-language-header-with-cloudflare/)
- [Cloudflare Redirect Rules](https://developers.cloudflare.com/rules/url-forwarding/)
- [Edge-Native i18n with Astro & Cloudflare](https://dev.to/garyedgekits/stop-shipping-translations-to-the-client-edge-native-i18n-with-astro-cloudflare-part-1-5b38)
