"use client";

import { createClient } from "@/lib/supabase/client";
import { differenceInDays } from "date-fns";
import { getMaxHabits } from "./constants";
import type { SupabaseClient } from "@supabase/supabase-js";

export type HabitRegisterDTO = {
  habitCategoryName: string;
  customHabitName?: string;
  reason?: string;
  startedAt: string; // ISO 8601 string
  durationMonths?: number;
  frequencyPerWeek?: number;
};

/**
 * 理由をストーリーとして投稿する
 * エラーが発生しても習慣登録を失敗させない
 */
async function postReasonAsStory(
  supabase: SupabaseClient,
  userId: string,
  habitCategoryName: string,
  reason: string,
): Promise<void> {
  try {
    // 作成された習慣を取得（最新の習慣を取得）
    const { data: habitsData, error: fetchError } = await supabase
      .from("habits")
      .select(
        `
        id,
        habit_category_id,
        custom_habit_name,
        habit_categories!inner(habit_category_name),
        trials(id, started_at, ended_at)
      `,
      )
      .eq("user_id", userId)
      .eq("habit_categories.habit_category_name", habitCategoryName)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError || !habitsData) {
      console.error("[postReasonAsStory] Error fetching created habit:", fetchError);
      return;
    }

    // アクティブなtrialを取得
    const activeTrial = habitsData.trials?.find((t) => !t.ended_at);
    if (!activeTrial) {
      console.error("[postReasonAsStory] No active trial found");
      return;
    }

    // 経過日数を計算
    const trialStartedAt = new Date(activeTrial.started_at);
    const now = new Date();
    const trialElapsedDays = differenceInDays(now, trialStartedAt);

    // ストーリーを作成
    const { error: storyError } = await supabase.from("stories").insert({
      content: reason,
      user_id: userId,
      habit_category_id: habitsData.habit_category_id,
      custom_habit_name: habitsData.custom_habit_name,
      trial_started_at: activeTrial.started_at,
      trial_elapsed_days: trialElapsedDays,
      comment_setting: "enabled",
      is_reason: true,
    });

    if (storyError) {
      console.error("[postReasonAsStory] Error creating story:", storyError);
    }
  } catch (err) {
    console.error("[postReasonAsStory] Error posting reason to story:", err);
  }
}

export async function createHabit(dto: HabitRegisterDTO): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error("User not authenticated") };
  }

  // 最大登録数チェック（サーバー側でもバリデーション）
  const { count, error: countError } = await supabase
    .from("habits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    console.error("[createHabit] Error counting habits:", countError);
    return { error: new Error("習慣数の確認に失敗しました") };
  }

  const maxHabits = getMaxHabits(user.id);
  const currentHabitCount = count ?? 0;
  if (currentHabitCount >= maxHabits) {
    return {
      error: new Error(`最大${maxHabits}つまでしか習慣を登録できません`),
    };
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

  // 理由がある場合は自動でストーリーに投稿
  if (dto.reason?.trim()) {
    await postReasonAsStory(supabase, user.id, dto.habitCategoryName, dto.reason.trim());
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
