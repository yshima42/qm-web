import { cache } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { fetchHabits } from "@/features/habits/data/data";
import { HabitTileDto, HabitCategoryName } from "@/lib/types";
import { getCategoryUrl } from "@/lib/categories";

/**
 * 現在の認証ユーザーを取得する（共通キャッシュ関数）
 * 同じリクエスト内で複数のpage-helper関数から呼ばれても、
 * auth.getUser() は1回だけ実行される
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * 現在のユーザーの習慣データを取得する
 * ログインしていない場合は空配列を返す
 * 同じリクエスト内で複数回呼ばれても1回だけDBクエリが実行される
 */
export const getCurrentUserHabits = cache(async (): Promise<HabitTileDto[]> => {
  const user = await getCurrentUser();
  return user ? await fetchHabits(user.id) : [];
});

/**
 * 現在のユーザーのuser_nameを取得する
 * ログインしていない場合はnullを返す
 * 同じリクエスト内で複数回呼ばれても1回だけDBクエリが実行される
 */
export const getCurrentUserUsername = cache(async (): Promise<string | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_name")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.user_name ?? null;
});

/**
 * 現在のユーザーのプロフィール情報を取得する
 * ログインしていない場合はnullを返す
 * 同じリクエスト内で複数回呼ばれても1回だけDBクエリが実行される
 */
export const getCurrentUserProfile = cache(
  async (): Promise<{
    user_name: string;
    display_name: string;
    avatar_url: string | null;
  } | null> => {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_name, display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) return null;

    return {
      user_name: profile.user_name,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
    };
  },
);

/**
 * ユーザーの最初の習慣のコミュニティURLを取得する
 * @returns ログインしていない場合は「all」、習慣がない場合は「alcohol」、それ以外は最初の習慣のカテゴリー
 */
export const getDefaultCommunityPath = cache(async (): Promise<string> => {
  const user = await getCurrentUser();
  if (!user) return getCategoryUrl("All");

  const habits = await getCurrentUserHabits();
  if (habits.length === 0) return getCategoryUrl("Alcohol");

  const firstHabitCategory = habits[0].habit_categories.habit_category_name as HabitCategoryName;
  return getCategoryUrl(firstHabitCategory);
});
