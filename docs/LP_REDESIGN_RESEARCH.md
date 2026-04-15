# LP デザインリニューアル調査 & 実装計画

## 調査日: 2026-03-20

---

## 1. 競合・参考事例の詳細分析

### 直接競合: I Am Sober（月収$200K、15万DL/月）

- **Hero**: 「#1 sobriety tracking app」+ 大きなスマホモックアップ + ストアバッジ
- **ソーシャルプルーフ**: 20万件以上の★5レビュー、127M+ pledges、30M+ addictions tracked、11M+ stories shared
- **メディアロゴ**: NYT, BuzzFeed, Healthline, TikTok
- **オンボーディング**: 14ステップの個人化（開始日、理由を入力→感情的投資→ペイウォール）
- **強み**: 「connect with others who understand」のコミュニティ訴求

### Pelago Health（旧 Quit Genius）— 複数依存症プラットフォーム

- **Hero**: 「Specialty substance use care, built for real life」+ ライフスタイル写真カルーセル
- **信頼バッジ**: USV, Philips, GE, Live Nation
- **依存症別カード**: 各依存症タイプに個別の成果統計を表示（★QuitMateと同構造）
- **動画レビュー** + テキストレビュー回転表示
- **色**: 黒/白/黄。依存症カードごとにパステルアクセント

### Headspace — ウェルネスアプリのゴールドスタンダード

- **Hero**: 分割レイアウト。左にテキストカルーセル（価値提案が切り替わる）、右にイラスト
- **色**: クリーム系ベース(#F9F4F2) + ブルーCTA(#0061EF) + イエローアクセント
- **特徴**: カテゴリ選択型（「What kind of headspace?」）→ ユーザーが自分のニーズを選ぶ
- **CTA**: 「Try for $0」— 招待的、押し付けない

### BetterHelp — コンバージョン最適化の極致

- **Hero**: 「You deserve to be happy」+ 3つのセグメントボタン（個人/カップル/ティーン）
- **巨大な数字**: 466M+ messages, 32K+ therapists, 6.3M+ people helped
- **比較表**: BetterHelp vs 従来のセラピーを12項目で比較（★非常に効果的）
- **FAQ**: 8問のアコーディオン

### The Fabulous — クイズ型ファネル

- **Hero**: 「Find Your Ultimate Daily Routine」+ インタラクティブクイズ
- **受賞バッジ**: App Store Best Self-Care, Google Play Awards, Google Material Design
- **学術的信頼**: Duke University 由来を強調
- **色**: ディープパープル(#251c93) + 白テキスト + ライトパープルアクセント

### Noom — LP=プロダクト体験

- **LP全体がクイズ**: 訪問直後にパーソナライズ質問が始まる
- **インタラクティブオンボーディングがそのままマーケティング**
- **A/Bテスト**: Optimizely で継続的に最適化

---

## 2. 新LPのセクション構成

### コンバージョン最適化された物語構造

```
┌─────────────────────────────────────────┐
│  1. HERO                                │
│  ・共感型の太字ヘッドライン              │
│  ・サブ見出し（価値提案）                │
│  ・3Dデバイスモックアップ               │
│  ・CTA + ミニ社会的証明                 │
├─────────────────────────────────────────┤
│  2. PROBLEM（課題提起）                  │
│  ・ユーザーの痛みを言語化               │
│  ・「こんな経験ありませんか？」          │
├─────────────────────────────────────────┤
│  3. SOLUTION（解決策）                   │
│  ・QuitMateがどう解決するか             │
│  ・Before / After の対比                │
├─────────────────────────────────────────┤
│  4. FEATURES（Bentoグリッド）            │
│  ・ベネフィット訴求のカード群            │
│  ・スクリーンショットと連動              │
├─────────────────────────────────────────┤
│  5. HOW IT WORKS（3ステップ）            │
│  ・ダウンロード → 設定 → 記録開始       │
│  ・利用ハードルを下げる                 │
├─────────────────────────────────────────┤
│  6. SOCIAL PROOF                         │
│  ・レビュー、★評価、ユーザー数         │
│  ・メディアロゴ（掲載実績があれば）     │
│  ・CTA再表示                            │
├─────────────────────────────────────────┤
│  7. FAQ                                  │
│  ・料金、プライバシー、効果             │
│  ・アコーディオン形式                   │
├─────────────────────────────────────────┤
│  8. FINAL CTA                            │
│  ・最後のダウンロード訴求               │
│  ・QRコード（デスクトップ）             │
├─────────────────────────────────────────┤
│  9. FOOTER                               │
└─────────────────────────────────────────┘
```

---

## 3. デザイン方針

### 3-1. カラー

| 色 | 効果 | 用途 |
|---|---|---|
| **ブルーグリーン** | 信頼・安心・成長 | プライマリ |
| **コーラル/アンバー** | 温かみ・行動喚起 | CTAアクセント |
| **ソフトパステル** | 安心感 | セクション背景 |

- ネームスペース別テーマカラーは維持
- ダークモード: `prefers-color-scheme` 自動追従 + トグル

### 3-2. タイポグラフィ

- Noto Sans JP + Inter（維持）
- 見出し: ウェイト700-900の太字、`clamp()` によるフルード対応
- バリアブルフォント化でパフォーマンス向上

### 3-3. アニメーション

**パフォーマンスティアリスト（調査結果）:**

| Tier | 手法 | サイズ | FPS |
|---|---|---|---|
| **S** | CSS scroll-timeline / @starting-style | 0 KB | 60 |
| **S** | TailwindCSS Motion | ~5 KB | 60 |
| **A** | Motion (旧Framer Motion) | ~85 KB | 60 |
| **B** | GSAP | ~70 KB | 58-60 |
| **C** | Lottie | 大 | **17** ← 使わない |

**方針**: CSS scroll-timeline + @starting-style を基本。JSアニメーションは最小限。

### 3-4. デバイスモックアップ

- **Devices.css**: CSSのみでiPhoneフレーム（画像不要、レスポンシブ）
- またはカスタムCSS: border-radius + box-shadow + グラデーションで構築
- スクリーンショットを「画面」として埋め込み

---

## 4. 技術スタック

| レイヤー | 選定 |
|---|---|
| フレームワーク | Astro 5（維持）+ View Transitions |
| スタイル | Tailwind v4（維持）+ TailwindCSS Motion (~5KB) |
| スクロールアニメ | CSS `scroll-timeline` + `@starting-style`（JS不要） |
| インタラクション | React Islands（`client:visible`）最小限 |
| デバイスモックアップ | CSS-only（Devices.css or カスタム） |
| iOS Smart Banner | `<meta name="apple-itunes-app">` |
| QRコード | ビルド時静的生成（`qrcode` npm） |
| 構造化データ | SoftwareApplication スキーマ |

---

## 5. 依存症回復アプリ特有の設計原則

### メッセージング

- **共感ファースト**: 問題提起で「あなたの気持ちを理解している」と伝える
- **恥を与えない言葉選び**: 「依存症」より「習慣を変えたい人」
- **コミュニティ訴求**: 「一人じゃない」がI Am Soberの成功の鍵
- **プライバシー**: 匿名利用可能を早期に伝える
- **低ハードル**: How It Worksで簡単さを示す

### 見出しパターン

| パターン | 例 |
|---|---|
| 共感型 | 「一人で悩まなくていい」「共になら、やめられる」 |
| 数値型 | 「X万人が回復の一歩を踏み出しました」 |
| 質問型 | 「やめたいのに、やめられない？」 |
| 結果型 | 「90日で習慣が変わる」 |

---

## 6. 実装順序（作成ステップ）

### 全体方針

- メインLP（QuitMate全体）をまず完成させ、その後ネームスペース（alcohol等）に展開
- 各ステップは1つのコミットで完結できる粒度
- ステップ順に上から作っていく

---

### Step 1: 基盤整備（Layout / Header / Footer / グローバルスタイル）

**やること:**
- BaseLayout のダークモード対応（`prefers-color-scheme` + トグル用CSS変数）
- グローバルCSS にスクロールアニメーション用のユーティリティクラス追加
- フルードタイポグラフィ（`clamp()`）導入
- Header リデザイン（スティッキー化、ダークモード切替ボタン追加）
- Footer リデザイン
- `<meta name="apple-itunes-app">` をBaseLayoutに追加
- SoftwareApplication 構造化データ追加

**変更ファイル:**
- `src/layouts/BaseLayout.astro`
- `src/styles/globals.css`
- `src/components/layout/Header.astro`
- `src/components/layout/Footer.astro`
- `src/config/themes.ts`（ダークモード用カラー追加）

---

### Step 2: Hero セクション（最重要 — ファーストビューで勝負が決まる）

**やること:**
- 共感型の大きな見出し + サブ見出し
- CSSデバイスモックアップ（Devices.css or カスタム）にスクリーンショット埋め込み
- CTAボタン（ストアバッジ + ミニ社会的証明「X人が利用中」）
- エントリーアニメーション（`@starting-style` でフェードイン + スライドアップ）
- デスクトップ: QRコード表示（ビルド時生成）

**変更ファイル:**
- `src/components/sections/Hero.astro`（全面書き換え）
- `src/components/sections/StoreBadges.astro`（スマートリンク対応）
- `src/components/sections/ScreenshotViewer.tsx`（CSSモックアップに置換 or 大幅改修）
- `messages/ja.json`, `messages/en.json`（コピー更新）

---

### Step 3: Problem セクション（課題提起）★新規

**やること:**
- ユーザーの痛みを言語化する共感セクション
- 「こんな経験ありませんか？」形式のカード or リスト
- スクロール連動フェードインアニメーション（CSS scroll-timeline）

**新規ファイル:**
- `src/components/sections/Problem.astro`

**変更ファイル:**
- `messages/ja.json`, `messages/en.json`（コピー追加）

---

### Step 4: Solution セクション（解決策）★新規

**やること:**
- QuitMateがどう解決するかを明確に伝える
- Before / After の対比レイアウト or 3つの柱（匿名・仲間・記録）
- アプリのコアバリューを視覚的に表現

**新規ファイル:**
- `src/components/sections/Solution.astro`

**変更ファイル:**
- `messages/ja.json`, `messages/en.json`

---

### Step 5: Features セクション（Bentoグリッドで刷新）

**やること:**
- 現在の3カラム均等グリッド → Bentoグリッドレイアウトに変更
- 各カードにスクリーンショットを含める
- ベネフィット訴求（「機能」ではなく「何が得られるか」）
- ホバーアニメーション + スクロール表示アニメーション

**変更ファイル:**
- `src/components/sections/Features.astro`（全面書き換え）
- `messages/ja.json`, `messages/en.json`

---

### Step 6: How It Works セクション ★新規

**やること:**
- 3ステップ: ダウンロード → 設定 → 仲間と回復
- 番号付きステップ + 各ステップにアイコン or ミニスクリーンショット
- シンプルで不安を感じさせないデザイン

**新規ファイル:**
- `src/components/sections/HowItWorks.astro`

**変更ファイル:**
- `messages/ja.json`, `messages/en.json`

---

### Step 7: Social Proof セクション（大幅強化）

**やること:**
- 現在のTestimonialsを拡張
- ★評価 + レビュー数（App Store/Google Play から）
- ユーザー数カウントアップアニメーション（React Island）
- 実ユーザーレビューカード（現在のテスティモニアルを改善）
- メディアロゴ（掲載実績があれば）
- CTA再表示

**変更ファイル:**
- `src/components/sections/Testimonials.astro`（全面書き換え → SocialProof.astro にリネーム推奨）
- `messages/ja.json`, `messages/en.json`

**新規ファイル（必要なら）:**
- `src/components/sections/CountUp.tsx`（React Island、カウントアップ用）

---

### Step 8: FAQ セクション ★新規

**やること:**
- アコーディオン形式（CSS `<details>/<summary>` or Reactコンポーネント）
- 想定質問: 無料？/匿名？/どの依存症に対応？/データは安全？/効果ある？
- CSS transition でスムーズな開閉

**新規ファイル:**
- `src/components/sections/FAQ.astro`

**変更ファイル:**
- `messages/ja.json`, `messages/en.json`

---

### Step 9: Final CTA + ページ組み立て

**やること:**
- FinalCTA セクションのリデザイン（グラデーション背景 + 大きなCTA + QRコード）
- メインLP ページ（`pages/en/index.astro`, `pages/ja/index.astro`）で新セクションを組み立て
- 全体のスクロールフロー確認・調整
- Astro View Transitions の有効化

**変更ファイル:**
- `src/components/sections/FinalCTA.astro`
- `src/pages/en/index.astro`
- `src/pages/ja/index.astro`
- `src/components/pages/MateLPPage.astro`

---

### Step 10: ネームスペース展開（alcohol / kinshu / porn / tobacco）

**やること:**
- メインLPの新デザインをネームスペースページに展開
- 各ネームスペースのテーマカラー・コピーを調整
- pornネームスペースのダークテーマ最適化
- ネームスペース固有の問題提起・解決策コピー

**変更ファイル:**
- `src/components/pages/MateLPPage.astro`
- `src/config/themes.ts`
- `messages/ja.json`, `messages/en.json`（各ネームスペースのコピー）

---

### Step 11: パフォーマンス最適化 & 仕上げ

**やること:**
- 画像の WebP/AVIF 変換
- フォントのプリロード最適化
- Lighthouse 監査（目標: Performance 95+, SEO 100）
- `prefers-reduced-motion` 対応の確認
- OGP画像の更新
- サイトマップ更新確認

---

## 7. コピーソース

### LP内の既存素材

| 素材 | 場所 | 用途 |
|---|---|---|
| 既存メッセージ | `apps/lp/messages/ja.json`, `en.json` | Hero/Features/Testimonials のベース |
| ブログ記事12本 | `apps/lp/src/content/blog/` | Problem セクション、統計データ、科学的根拠 |

### ブログから使える統計・コピー素材

- 「依存症は問題ではなく解決策」→ Problem セクションの共感メッセージに
- 「ラットパーク実験」→ 「つながりが回復の鍵」というコア訴求の根拠
- 「仲間の力で乗り越える」→ ピアサポートの効果1.4倍、自己効力感2.3倍
- ギャンブル関連記事 → 各ネームスペースの問題提起に

### 外部マーケティング素材

`qm-marketing` リポジトリ（シンボリンク先: `/Users/yuki/Developer/qm-marketing`）はこの環境に存在しない。
→ **必要であればクローンするか、内容をコピペで提供してもらう**

---

## 8. 出典

### 競合分析
- [Headspace](https://www.headspace.com) — カテゴリ選択型Hero、クリーム+ブルー配色
- [BetterHelp](https://www.betterhelp.com) — 共感見出し、巨大数値、比較表
- [The Fabulous](https://www.thefabulous.co) — クイズ型Hero、学術的信頼、パープル配色
- [I Am Sober](https://iamsober.com) — 直接競合、月$200K、コミュニティ訴求
- [Pelago Health](https://www.pelagohealth.com) — 複数依存症、依存症別カード
- [Noom](https://www.noom.com) — LP=クイズファネル、パーソナライゼーション

### デザイン・コンバージョン
- [Bitly - App Landing Page Tips 2026](https://bitly.com/blog/best-app-landing-page-design/)
- [Lovable - Landing Page Best Practices 2026](https://lovable.dev/guides/landing-page-best-practices-convert)
- [DesignRush - 15 Best App Landing Pages 2026](https://www.designrush.com/best-designs/apps/trends/app-landing-pages)
- [Moburst - Landing Page Design Trends 2026](https://www.moburst.com/blog/landing-page-design-trends-2026/)
- [SaaSFrame - 10 SaaS LP Trends 2026](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- [LanderLab - Social Proof: +340% Conversions](https://landerlab.io/blog/social-proof-examples)
- [Hostinger - Landing Page Statistics 2026](https://www.hostinger.com/tutorials/landing-page-statistics)

### 技術
- [Motion.dev - Animation Performance Tier List](https://motion.dev/magazine/web-animation-performance-tier-list)
- [MDN - CSS Scroll-Driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [WebKit - Scroll-Driven Animations Guide](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)
- [Chrome Developers - Scroll-Driven Animation Case Studies](https://developer.chrome.com/blog/css-ui-ecommerce-sda)
- [Devices.css - Pure CSS Mockups](https://devicescss.xyz/)
- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)

### 色彩・心理
- [Naskay - Color Psychology in Healthcare UI](https://naskay.com/blog/color-psychology-in-healthcare-ui-2025/)
- [UXmatters - Color Psychology for Health Apps](https://www.uxmatters.com/mt/archives/2024/07/leveraging-the-psychology-of-color-in-ux-design-for-health-and-wellness-apps.php)
- [Beacon Media - Mental Health Websites That Convert](https://www.beaconmm.com/2021/11/30/3-examples-of-mental-health-website-designs-that-convert/)
- [Ads Up Marketing - Rehab Landing Page Optimization](https://adsupmarketing.com/optimizing-drug-rehab-landing-pages/)
