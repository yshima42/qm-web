import { HABIT_CATEGORIES, getCategoryUrl } from "@/lib/categories";
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

  // 登録済み以外のカテゴリーを取得（Officialは含める）
  const otherCats = HABIT_CATEGORIES.filter((cat) => !myCategoryNames.has(cat));

  return { myCategories: myCatsOrdered, otherCategories: otherCats };
}

/**
 * 最初の習慣のコミュニティURLを取得する
 * @param habits ユーザーの習慣データ
 * @returns 最初の習慣のカテゴリーURL、習慣がない場合は"All"カテゴリーのURL
 */
export function getFirstHabitCommunityUrl(habits: HabitTileDto[]): string {
  if (habits.length === 0) {
    return getCategoryUrl("All");
  }
  const firstHabitCategory = habits[0].habit_categories.habit_category_name as HabitCategoryName;
  return getCategoryUrl(firstHabitCategory);
}

/**
 * マイコミュニティリンクがアクティブかどうかを判定する
 * @param pathname 現在のパス名
 * @param habits ユーザーの習慣データ
 * @returns アクティブかどうか
 */
export function isMyCommunityLinkActive(pathname: string, habits: HabitTileDto[]): boolean {
  const allCategoryUrl = getCategoryUrl("All");
  if (pathname === allCategoryUrl) {
    return true;
  }
  if (habits.length === 0) {
    return false;
  }
  const firstHabitCategory = habits[0].habit_categories.habit_category_name as HabitCategoryName;
  return pathname === getCategoryUrl(firstHabitCategory);
}
