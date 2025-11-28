"use server";

import { differenceInDays } from "date-fns";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { MAX_CHARACTERS } from "@/features/common/constants";
import type { DeleteResult } from "@/features/common/types";
import { fetchHabits } from "@/features/habits/data/data";

export async function createStory(formData: FormData) {
  const content = formData.get("content") as string;
  const commentSetting = (formData.get("comment_setting") as string) || "enabled";
  const languageCode = (formData.get("language_code") as string) || "ja";

  if (!content || content.trim() === "") {
    throw new Error("Content is required");
  }

  // comment_settingのバリデーション
  if (commentSetting !== "enabled" && commentSetting !== "disabled") {
    throw new Error("Invalid comment setting");
  }

  // language_codeのバリデーション
  if (languageCode !== "ja" && languageCode !== "en") {
    throw new Error("Invalid language code");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const habitId = formData.get("habit_id") as string;

  // Fetch user's habits to find the active one
  const habits = await fetchHabits(user.id);

  let activeHabit = null;
  let activeTrial = null;

  for (const habit of habits) {
    // If a specific habit was requested, skip others
    if (habitId && habit.id !== habitId) continue;

    // Check trials
    if (habit.trials && habit.trials.length > 0) {
      // Find active trial (ended_at is null)
      const currentActiveTrial = habit.trials.find((t) => !t.ended_at);

      if (currentActiveTrial) {
        activeHabit = habit;
        activeTrial = currentActiveTrial;
        break; // Found the target active habit
      }
    }
  }

  if (!activeHabit || !activeTrial) {
    // Fallback or error?
    // If no active habit, we can't link the story to a trial.
    // The DB requires habit_category_id and trial_started_at.
    // We could try to find ANY habit and use its latest trial (even if ended), or throw error.
    // Let's throw an error for now as this is a "QuitMate" app.
    throw new Error("No active habit found. Please start a habit first.");
  }

  const trialStartedAt = new Date(activeTrial.started_at);
  const now = new Date();
  const trialElapsedDays = differenceInDays(now, trialStartedAt);

  const { error } = await supabase.from("stories").insert({
    content: content.trim(),
    user_id: user.id,
    habit_category_id: activeHabit.habit_category_id,
    custom_habit_name: activeHabit.custom_habit_name,
    trial_started_at: activeTrial.started_at,
    trial_elapsed_days: trialElapsedDays,
    comment_setting: commentSetting,
    is_reason: false,
    language_code: languageCode,
  });

  if (error) {
    console.error("Error creating story:", error);
    throw new Error("Failed to create story");
  }

  // Get the habit category name for revalidation
  const categoryName = activeHabit.habit_categories?.habit_category_name;
  const categoryPath = categoryName
    ? `/stories/habits/${categoryName.toLowerCase().replace(/\s+/g, "-")}`
    : "/stories";

  revalidatePath(categoryPath);
  return { success: true };
}

export async function toggleStoryLike(storyId: string, shouldLike: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  if (shouldLike) {
    // いいねを追加
    const { error } = await supabase.from("likes").insert({ story_id: storyId, user_id: user.id });

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    // いいねを削除
    const { error } = await supabase
      .from("likes")
      .delete()
      .match({ story_id: storyId, user_id: user.id });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/");
  return { success: true };
}

export async function createComment(storyId: string, content: string, parentCommentId?: string) {
  // バリデーション
  if (!content || content.trim() === "") {
    return { success: false, error: "Content is required" };
  }

  const trimmedContent = content.trim();

  // 文字数制限
  if (trimmedContent.length > MAX_CHARACTERS) {
    return { success: false, error: "Content is too long" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // コメントをDBに挿入
  const { error } = await supabase.from("comments").insert({
    story_id: storyId,
    user_id: user.id,
    content: trimmedContent,
    parent_comment_id: parentCommentId || null,
  });

  if (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: "Failed to create comment" };
  }

  // ストーリー詳細ページを再検証
  revalidatePath("/");
  return { success: true };
}

/**
 * コメントを削除する
 * RLSで制御されているため、user_idのフィルタリングは不要
 */
export async function deleteComment(commentId: string): Promise<DeleteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("comments").delete().match({ id: commentId });

  if (error) {
    console.error("[deleteComment] Error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

/**
 * ストーリーを削除する
 * user_idでフィルタリングして自分のストーリーのみ削除可能
 */
export async function deleteStory(storyId: string): Promise<DeleteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("stories")
    .delete()
    .eq("id", storyId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[deleteStory] Error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
