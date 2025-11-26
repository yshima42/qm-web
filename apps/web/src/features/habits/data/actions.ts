"use client";

import { createClient } from "@/lib/supabase/client";

export type HabitRegisterDTO = {
  habitCategoryName: string;
  customHabitName?: string;
  reason?: string;
  startedAt: string; // ISO 8601 string
  durationMonths?: number;
  frequencyPerWeek?: number;
};

export async function createHabit(dto: HabitRegisterDTO): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error("User not authenticated") };
  }

  const { error } = await supabase.rpc("habit_create_transaction", {
    p_user_id: user.id,
    p_habit_category_name: dto.habitCategoryName,
    p_custom_habit_name: dto.customHabitName || null,
    p_reason: dto.reason || null,
    p_started_at: dto.startedAt,
    p_duration_months: dto.durationMonths || null,
    p_frequency_per_week: dto.frequencyPerWeek || null,
  });

  if (error) {
    console.error("Error creating habit:", error);
    return { error: new Error(error.message) };
  }

  return { error: null };
}

export async function deleteHabit(habitId: string): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("habits").delete().eq("id", habitId);

  if (error) {
    console.error("Error deleting habit:", error);
    return { error: new Error(error.message) };
  }

  return { error: null };
}

export async function resetTrial(
  habitId: string,
  trialId: string,
): Promise<{ error: Error | null }> {
  console.log("resetTrial called", { habitId, trialId });
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("User:", user?.id);

  const { error, data } = await supabase.rpc("habit_restart_trial", {
    p_habit_id: habitId,
    p_trial_id: trialId,
  });

  console.log("RPC result:", { error, data });

  if (error) {
    console.error("Error resetting trial:", error);
    return { error: new Error(error.message) };
  }

  console.log("Trial reset successfully");
  return { error: null };
}
