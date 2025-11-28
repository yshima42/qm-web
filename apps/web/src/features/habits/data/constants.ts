/**
 * 無料プランでの最大習慣登録数
 * 将来的に課金機能を追加する際は、ユーザーの課金状態に応じてこの値を変更する
 */
export const MAX_HABITS_FREE = 2;

/**
 * ユーザーの最大習慣登録数を取得する
 * 将来的に課金機能を追加する際は、ユーザーの課金状態を確認して返す値を変更する
 * @param _userId ユーザーID（現在は使用していないが、将来的に課金状態を確認する際に使用）
 * @returns 最大習慣登録数
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMaxHabits(_userId?: string): number {
  // TODO: 課金機能追加時に、ユーザーの課金状態を確認して返す値を変更する
  // 例: if (isPremiumUser(_userId)) return MAX_HABITS_PREMIUM;
  return MAX_HABITS_FREE;
}
