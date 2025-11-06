# ChillBase LP

ChillBaseのランディングページ関連ファイル。

## ディレクトリ構造

```
chillbase/
├── components/          # セクションコンポーネント
├── messages/           # 翻訳ファイル（参考用）
└── README.md          # このファイル
```

## 削除方法

ChillBaseのLPを削除する場合：

1. `apps/lp/src/app/[locale]/chillbase/` ディレクトリを削除
2. `apps/lp/src/chillbase/` ディレクトリを削除
3. `apps/lp/public/chillbase/` ディレクトリを削除
4. `apps/lp/messages/ja.json` と `en.json` から `chillbase` セクションを削除

## 画像

スクリーンショット画像は `apps/lp/public/chillbase/images/` に配置してください。

