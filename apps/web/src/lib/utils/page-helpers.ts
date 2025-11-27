import { createClient } from "@/lib/supabase/server";
import { fetchHabits } from "@/features/habits/data/data";
import { HabitTileDto } from "@/lib/types";

/**
 * 現在のユーザーの習慣データを取得する
 * ログインしていない場合は空配列を返す
 */
export async function getCurrentUserHabits(): Promise<HabitTileDto[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? await fetchHabits(user.id) : [];
}

