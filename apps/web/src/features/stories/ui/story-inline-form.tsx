"use client";

import { Globe, Lock, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DefaultAvatar } from "@quitmate/ui";

import { HabitTileDto, HabitCategoryName } from "@/lib/types";

import { useCharacterCount } from "@/features/common/hooks/use-character-count";
import { CharacterCountIndicator } from "@/features/common/components/character-count-indicator";
import { createStory } from "@/features/stories/data/actions";
import { cn } from "@/lib/utils";

type CommentSetting = "enabled" | "disabled";

type StoryInlineFormProps = {
  habits: HabitTileDto[];
  currentUserProfile?: {
    user_name: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
  defaultCategory?: HabitCategoryName;
};

export function StoryInlineForm({
  habits,
  currentUserProfile,
  defaultCategory,
}: StoryInlineFormProps) {
  const t = useTranslations("story-post");
  const tCategory = useTranslations("categories");
  const tCommentSetting = useTranslations("comment-setting");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [commentSetting, setCommentSetting] = useState<CommentSetting>("enabled");
  const [isMounted, setIsMounted] = useState(false);

  // ハイドレーションミスマッチを防ぐため、マウント後にのみ表示
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter for active habits (has at least one trial with no ended_at)
  const activeHabits = habits.filter((habit) => habit.trials?.some((trial) => !trial.ended_at));

  const hasActiveHabit = activeHabits.length > 0;
  const isSingleHabit = activeHabits.length === 1;

  // デフォルトカテゴリに一致する習慣を見つける
  const defaultHabitId =
    defaultCategory && defaultCategory !== "All"
      ? activeHabits.find(
          (habit) => habit.habit_categories?.habit_category_name === defaultCategory,
        )?.id
      : undefined;

  // Calculate character count and remaining
  const { remaining, isOverLimit, showCount, progress } = useCharacterCount(content);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (isOverLimit) {
      setError(t("contentTooLong"));
      return;
    }

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createStory(formData);
        setContent(""); // Clear the form on success
      } catch (err) {
        // Ignore NEXT_REDIRECT errors as they are not actual errors
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
          return;
        }
        setError(err instanceof Error ? err.message : t("createFailed"));
      }
    });
  };

  if (!hasActiveHabit) {
    return null; // Don't show the form if no active habits
  }

  // ハイドレーション完了まで何も表示しない
  if (!isMounted) {
    return null;
  }

  return (
    <div className="border-border bg-card border-b">
      <form onSubmit={handleSubmit} className="space-y-3 p-4">
        <div className="flex gap-3">
          {currentUserProfile ? (
            <Link
              href={`/${currentUserProfile.user_name}`}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
            >
              {currentUserProfile.avatar_url ? (
                <Image
                  src={currentUserProfile.avatar_url}
                  alt={currentUserProfile.display_name}
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              ) : (
                <DefaultAvatar size="sm" className="bg-muted size-full" />
              )}
            </Link>
          ) : (
            <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
              U
            </div>
          )}
          <div className="flex-1 space-y-3">
            {/* 常に習慣選択欄を表示（1つの時はdisabled） */}
            <select
              name="habit_id"
              required
              disabled={isSingleHabit}
              defaultValue={defaultHabitId || activeHabits[0]?.id}
              className={cn(
                "border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1",
                isSingleHabit && "cursor-not-allowed opacity-60",
              )}
            >
              {activeHabits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.custom_habit_name ||
                    (habit.habit_categories?.habit_category_name
                      ? tCategory(habit.habit_categories.habit_category_name)
                      : habit.habit_categories?.habit_category_name)}
                </option>
              ))}
            </select>

            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="placeholder:text-muted-foreground w-full resize-none rounded-md border-0 bg-transparent px-0 py-2 text-base focus-visible:outline-none"
              placeholder={t("placeholder")}
            />

            {/* コメント設定（Xライク） */}
            <input type="hidden" name="comment_setting" value={commentSetting} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="text-primary hover:bg-primary/10 flex items-center gap-1 rounded-full px-2 py-1 text-sm transition-colors"
                >
                  {commentSetting === "enabled" ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  <span>{tCommentSetting(commentSetting)}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => setCommentSetting("enabled")}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  <span>{tCommentSetting("enabled")}</span>
                  {commentSetting === "enabled" && <span className="text-primary ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCommentSetting("disabled")}
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>{tCommentSetting("disabled")}</span>
                  {commentSetting === "disabled" && <span className="text-primary ml-auto">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {error && <div className="ml-13 text-sm text-red-500">{error}</div>}

        <div className="ml-13 flex items-center justify-end gap-3">
          <CharacterCountIndicator
            remaining={remaining}
            isOverLimit={isOverLimit}
            showCount={showCount}
            progress={progress}
          />

          <Button
            type="submit"
            disabled={isPending || !content.trim() || isOverLimit}
            size="sm"
            className="rounded-full"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("postButton")}
          </Button>
        </div>
      </form>
    </div>
  );
}
