import { HABIT_CATEGORIES } from "@/lib/categories";
import { HabitCategoryName, HabitTileDto } from "@/lib/types";

/**
 * 習慣データからマイコミュニティとその他コミュニティのカテゴリーを分類する
 * @param habits ユーザーの習慣データ
 * @returns マイコミュニティのカテゴリーとその他コミュニティのカテゴリー
 */
export function categorizeHabitCategories(habits: HabitTileDto[]): {
  myCategories: HabitCategoryName[];
  otherCategories: HabitCategoryName[];
} {
  // 習慣の順番（display_order）でカテゴリーを取得（重複を除去）
  const myCategoryNames = new Set<HabitCategoryName>();
  const myCatsOrdered: HabitCategoryName[] = [];

  // 習慣の順番でカテゴリーを追加（重複は無視）
  habits.forEach((habit) => {
    const categoryName = habit.habit_categories.habit_category_name as HabitCategoryName;
    if (!myCategoryNames.has(categoryName)) {
      myCategoryNames.add(categoryName);
      myCatsOrdered.push(categoryName);
    }
  });

  // "Official"は除外して、登録済み以外のカテゴリーを取得
  const filteredCategories = HABIT_CATEGORIES.filter((cat) => cat !== "Official");
  const otherCats = filteredCategories.filter((cat) => !myCategoryNames.has(cat));

  return { myCategories: myCatsOrdered, otherCategories: otherCats };
}
