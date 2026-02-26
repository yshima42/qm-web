# LP用画像の配置場所とファイル名

禁酒メイト（/alcohol）、禁欲メイト（/porn）、禁煙メイト（/tobacco）の各LPで使用する画像を以下の場所に配置してください。

## 配置ディレクトリ

- **ルート**: `apps/lp/public/images/`
- **言語別スクリーンショット**: `apps/lp/public/images/ja/` および `apps/lp/public/images/en/`

※ 3つのメイトLPはいずれも **ホーム画面** と **習慣画面** の2枚のスクリーンショットを使用します。

---

## 禁酒メイト（/alcohol）

### ロゴ・アイコン

| 用途 | 配置パス | ファイル名 |
|------|----------|------------|
| サイトアイコン・ヘッダーロゴ | `public/images/` | **alcohol_icon.png** |

### アプリスクリーンショット（Heroスライダー用・2枚）

日本語・英語それぞれのフォルダに同じファイル名で配置してください。

| 用途 | ファイル名 | 配置先 |
|------|------------|--------|
| ホーム画面 | **a-screenshot-home.png** | `public/images/ja/` と `public/images/en/` |
| 習慣画面 | **a-screenshot-habits.png** | 同上 |

---

## 禁欲メイト（/porn）

### ロゴ・アイコン

| 用途 | 配置パス | ファイル名 |
|------|----------|------------|
| サイトアイコン・ヘッダーロゴ | `public/images/` | **porn_icon.png** |

### アプリスクリーンショット（Heroスライダー用・2枚）

| 用途 | ファイル名 | 配置先 |
|------|------------|--------|
| ホーム画面 | **p-screenshot-home.png** | `public/images/ja/` と `public/images/en/` |
| 習慣画面 | **p-screenshot-habits.png** | 同上 |

---

## 禁煙メイト（/tobacco）

### ロゴ・アイコン

| 用途 | 配置パス | ファイル名 |
|------|----------|------------|
| サイトアイコン・ヘッダーロゴ | `public/images/` | **tobacco_icon.png** |

### アプリスクリーンショット（Heroスライダー用・2枚）

| 用途 | ファイル名 | 配置先 |
|------|------------|--------|
| ホーム画面 | **t-screenshot-home.png** | `public/images/ja/` と `public/images/en/` |
| 習慣画面 | **t-screenshot-habits.png** | 同上 |

---

## 参考：禁酒チャレンジ（/challenge）の画像

- アイコン: `public/images/kinshu_icon.png`
- スクリーンショット: ホーム・タイムライン・プロフィール・診断・ロードマップの5枚（`k-screenshot-home.png` など、`public/images/ja/`, `public/images/en/`）

画像を配置するまで、該当ファイルが無い場合はビルド・表示でエラーや欠損になることがあります。プレースホルダー画像を置くか、同じフォルダに上記ファイル名で画像を追加してください。
