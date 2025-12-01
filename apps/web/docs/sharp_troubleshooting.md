## sharpモジュールのVercel本番環境でのエラー対処

### 問題

本番環境（Vercel）で以下のエラーが発生：
```
Error: Could not load the "sharp" module using the linux-x64 runtime
ERR_DLOPEN_FAILED: libvips-cpp.so.8.17.3: cannot open shared object file
```

エラーログに `[turbopack]_runtime.js` が含まれる場合は、Next.jsのTurbopackが原因の可能性があります。

### 解決策

`package.json` で `sharp` のバージョンを **0.32.6** にダウングレード：

```json
{
  "dependencies": {
    "sharp": "0.32.6"
  }
}
```

その後、`yarn install` を実行して再デプロイ。

### 補足

- `sharp` 0.33.0以降は事前ビルドバイナリのインストール方式が変更され、Vercel環境で問題が発生しやすい
- Turbopackを使用している場合、`next.config.ts` に `serverExternalPackages: ["sharp"]` を追加することも検討

### 関連GitHubイシュー

- [Vercel Discussions #11923](https://github.com/vercel/vercel/discussions/11923) - sharpモジュールの読み込みエラー
- [Vercel Issue #11220](https://github.com/vercel/vercel/issues/11220) - Sharp.js v0.33とpnpmの組み合わせ問題
- [Vercel Issue #14001](https://github.com/vercel/vercel/issues/14001) - sharpがVercelで使用できなくなった問題（Turbopack関連）

