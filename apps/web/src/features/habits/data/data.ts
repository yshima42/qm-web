import { createClient as createServerClient } from "@/lib/supabase/server";

import { HabitTileDto } from "@/lib/types";

const HABIT_SELECT_QUERY = `*, 
  habit_categories!inner(habit_category_name), 
  trials(id, started_at, ended_at, created_at),
  reasons(id, content, created_at)`;

export async function fetchHabits(userId: string): Promise<HabitTileDto[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("habits")
    .select(HABIT_SELECT_QUERY)
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching habits:", error);
    return [];
  }

  return (data as HabitTileDto[]) ?? [];
}

export async function fetchHabitById(habitId: string): Promise<HabitTileDto | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("habits")
    .select(HABIT_SELECT_QUERY)
    .eq("id", habitId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching habit by id:", error);
    return null;
  }

  return (data as HabitTileDto) ?? null;
}
