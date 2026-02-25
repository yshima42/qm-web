# LP用画像の配置場所とファイル名

禁欲メイト（/porn）と禁煙メイト（/tobacco）のLPで使用する画像を以下の場所に配置してください。

## 配置ディレクトリ

- **ルート**: `apps/lp/public/images/`
- **言語別スクリーンショット**: `apps/lp/public/images/ja/` および `apps/lp/public/images/en/`

---

## 禁欲メイト（/porn）

### ロゴ・アイコン

| 用途 | 配置パス | ファイル名 |
|------|----------|------------|
| サイトアイコン・ヘッダーロゴ | `public/images/` | **porn_icon.png** |

### アプリスクリーンショット（Heroスライダー用）

日本語・英語それぞれのフォルダに同じファイル名で配置してください。

| 用途 | ファイル名 | 配置先 |
|------|------------|--------|
| ホーム画面 | **p-screenshot-home.png** | `public/images/ja/` と `public/images/en/` |
| タイムライン画面 | **p-screenshot-timeline.png** | 同上 |
| プロフィール画面 | **p-screenshot-profile.png** | 同上 |
| 診断画面 | **p-screenshot-diagnosis.png** | 同上 |
| ロードマップ画面 | **p-screenshot-roadmap.png** | 同上 |

---

## 禁煙メイト（/tobacco）

### ロゴ・アイコン

| 用途 | 配置パス | ファイル名 |
|------|----------|------------|
| サイトアイコン・ヘッダーロゴ | `public/images/` | **tobacco_icon.png** |

### アプリスクリーンショット（Heroスライダー用）

| 用途 | ファイル名 | 配置先 |
|------|------------|--------|
| ホーム画面 | **t-screenshot-home.png** | `public/images/ja/` と `public/images/en/` |
| タイムライン画面 | **t-screenshot-timeline.png** | 同上 |
| プロフィール画面 | **t-screenshot-profile.png** | 同上 |
| 診断画面 | **t-screenshot-diagnosis.png** | 同上 |
| ロードマップ画面 | **t-screenshot-roadmap.png** | 同上 |

---

## 参考：禁酒チャレンジ（/challenge）の画像

- アイコン: `public/images/kinshu_icon.png`
- スクリーンショット: `k-screenshot-home.png` など（`public/images/ja/`, `public/images/en/`）

画像を配置するまで、該当ファイルが無い場合はビルド・表示でエラーや欠損になることがあります。プレースホルダー画像を置くか、同じフォルダに上記ファイル名で画像を追加してください。
