import { differenceInDays } from "date-fns";
import { HabitTileDto } from "@/lib/types";

/**
 * 習慣のアクティブなtrialから経過日数を計算する
 */
export function getElapsedDays(habit: HabitTileDto | null | undefined): number | null {
  if (!habit?.trials || habit.trials.length === 0) return null;
  const activeTrial = habit.trials.find((trial) => !trial.ended_at);
  if (!activeTrial) return null;
  const now = new Date();
  const startedAt = new Date(activeTrial.started_at);
  return differenceInDays(now, startedAt);
}

/**
 * 習慣の表示名を取得する
 * @param habit - 習慣データ
 * @param tCategory - カテゴリ翻訳関数
 */
export function getHabitDisplayName(
  habit: HabitTileDto | null | undefined,
  tCategory: (key: string) => string,
): string {
  if (!habit) return "";
  return (
    habit.custom_habit_name ||
    (habit.habit_categories?.habit_category_name
      ? tCategory(habit.habit_categories.habit_category_name)
      : habit.habit_categories?.habit_category_name || "")
  );
}

/**
 * アクティブな習慣をフィルタリングする
 */
export function getActiveHabits(habits: HabitTileDto[]): HabitTileDto[] {
  return habits.filter((habit) => habit.trials?.some((trial) => !trial.ended_at));
}
