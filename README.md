# セットアップ

## 依存関係のインストール

```bash
yarn install
```

## 環境変数の設定

### Webアプリ (`apps/web/`)

以下の環境変数ファイルを作成してください：

- `.env.local` - ローカル開発用
- `.env.dev` - 開発環境用
- `.env.prod` - 本番環境用

必要な環境変数：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_SUPABASE_DOMAIN` (オプション)
- `NEXT_SUPABASE_IMAGE_DOMAIN` (オプション)

# 起動方法

## ルートディレクトリから実行

### Webアプリ

```bash
# ローカル環境で起動（.env.local を使用）
yarn dev:web:local

# 開発環境で起動（.env.dev を使用）
yarn dev:web:dev

# 本番環境で起動（.env.prod を使用）
yarn dev:web:prod
```

### LPアプリ

```bash
# 開発サーバーを起動
yarn dev:lp
```

### コードフォーマット

```bash
yarn format
```

# パッケージインストール方法

`yarn workspace {web or lp or @quitmate/ui} add {パッケージ}`

## 例

### 両方で使うUI関連

`yarn workspace @quitmate/ui add @radix-ui/react-slot class-variance-authority tailwind-merge`

### Webアプリでしか使わないもの

`yarn workspace web add next-themes lucide-react`

### LPでしか使わないもの

`yarn workspace lp add framer-motion`

# vercelデプロイ先

- [qm-web](https://qm-web.vercel.app/)
- [qm-lp](https://qm-lp.vercel.app/)

# グローバル対応

こちらを参考に実装しました（LPはwith i18n routing, Webはwith i18n routing）

- https://next-intl.dev/
