import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { fetchHabits } from "@/features/habits/data/data";
import { HabitTileDto } from "@/lib/types";

/**
 * 現在のユーザーの習慣データを取得する
 * ログインしていない場合は空配列を返す
 * 同じリクエスト内で複数回呼ばれても1回だけDBクエリが実行される
 */
export const getCurrentUserHabits = cache(async (): Promise<HabitTileDto[]> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? await fetchHabits(user.id) : [];
});

/**
 * 現在のユーザーのuser_nameを取得する
 * ログインしていない場合はnullを返す
 * 同じリクエスト内で複数回呼ばれても1回だけDBクエリが実行される
 */
export const getCurrentUserUsername = cache(async (): Promise<string | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_name, display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      return null;
    }

    return {
      user_name: profile.user_name,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
    };
  },
);
