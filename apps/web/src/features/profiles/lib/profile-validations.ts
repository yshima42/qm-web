/**
 * プロフィール関連のバリデーション定数
 * Flutterアプリ側と同じ値を使用
 */
export const PROFILE_VALIDATIONS = {
  userNameMinLength: 3,
  userNameMaxLength: 16,
  displayNameMaxLength: 32,
  bioMaxLength: 200,
} as const;

