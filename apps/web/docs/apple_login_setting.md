## Web版のApple Login設定方法要点

> **注釈**: 本文中の「SupabaseのApple認証設定画面」は、Supabaseの「Authentication > Sign in / Providers > Auth Providers > Apple」の設定画面を指します。

### 1. Supabaseの秘密鍵を更新する

- 6ヶ月ごとに更新が必要
- 更新手順:
  1. Apple Developer ConsoleでサービスIDを作成
     - 今回は「Quitmate Web Sign In」を作成
     - Primary App IDは「quitmate quitmate dev」になっている
     - 2のキーと設定が違うが動作しているため、このまま使用
  2. Apple Developer Consoleでベースとなるキーを作成
     - キーのPrimary App IDは何でも良い（Grouped App IDsの設定により動作する）
     - 今回は「quitmate quitmate app」に設定
  3. Supabaseサイトで秘密鍵を作成
     - サービスIDは1で作成したものを使用
     - キーIDは空欄で良い（2でダウンロードしたファイル名を変えずに入れること）
     - キーIDを変に設定するとエラーになった気がする
     - 参考: [What's the trick for Apple Sign In Auth on WebApp? Results in error : r/Supabase](https://www.reddit.com/r/Supabase/comments/1ihobnj/whats_the_trick_for_apple_sign_in_auth_on_webapp/)
  4. SupabaseのApple認証設定画面で秘密鍵を登録
     - 1で作成したサービスIDを使用
  5. **Notificationをつけるのを忘れずに**

### 2. SupabaseのclientIdにはWebのサービスIDを先頭に記載する

- SupabaseのApple認証設定画面で、Web版のclient ID（Service ID）を**先頭に**記載する
- 参考: [Sign in with Apple multiple client ids · supabase · Discussion #32709](https://github.com/orgs/supabase/discussions/32709#discussioncomment-11865623)

### 3. AppleのサービスIDにcallbackURLを登録する

- サービスIDのページ > Sign in with AppleのConfigure > Website URLsに、SupabaseのApple認証設定画面のcallbackURLを登録する

## 参考サイト

- **Apple Login公式Doc**: [Login with Apple | Supabase Docs](https://supabase.com/docs/guides/auth/social-login/auth-apple?queryGroups=environment&environment=client)
- **Reddit**（今回はここのサイトの修正をしていない）: [What's the trick for Apple Sign In Auth on WebApp? Results in error : r/Supabase](https://www.reddit.com/r/Supabase/comments/1ihobnj/whats_the_trick_for_apple_sign_in_auth_on_webapp/)
- **Supabaseの登録順番について**: [Sign in with Apple multiple client ids · supabase · Discussion #32709](https://github.com/orgs/supabase/discussions/32709#discussioncomment-11865623)
