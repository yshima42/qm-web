"use client";

import { Globe, Lock, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HabitTileDto } from "@/lib/types";

import { MAX_CHARACTERS, SHOW_COUNT_THRESHOLD } from "@/features/common/constants";
import { createStory } from "@/features/stories/data/actions";

type CommentSetting = "enabled" | "disabled";

type StoryInlineFormProps = {
  habits: HabitTileDto[];
};

// Count characters, treating multibyte characters as 2
function countCharacters(text: string): number {
  let count = 0;
  for (const char of text) {
    // Check if character is multibyte (e.g., Japanese, emoji, etc.)
    const code = char.charCodeAt(0);
    if (code > 0x7f) {
      count += 2; // Multibyte character counts as 2
    } else {
      count += 1; // ASCII character counts as 1
    }
  }
  return count;
}

export function StoryInlineForm({ habits }: StoryInlineFormProps) {
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
  const showHabitSelect = activeHabits.length > 1;

  // Calculate character count and remaining
  const charCount = useMemo(() => countCharacters(content), [content]);
  const remaining = MAX_CHARACTERS - charCount;
  const isOverLimit = remaining < 0;
  const showCount = remaining <= SHOW_COUNT_THRESHOLD;

  // Calculate progress for circular indicator (0-1)
  const progress = Math.min(charCount / MAX_CHARACTERS, 1);

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
          <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
            {/* User avatar placeholder */}U
          </div>
          <div className="flex-1 space-y-3">
            {showHabitSelect && (
              <select
                name="habit_id"
                required
                className="border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1"
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
            )}
            {!showHabitSelect && <input type="hidden" name="habit_id" value={activeHabits[0].id} />}

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
          {/* Character count indicator */}
          <div className="relative flex items-center justify-center">
            {/* Background circle */}
            <svg className="h-8 w-8 -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted"
                opacity="0.2"
              />
              {/* Progress circle */}
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 14}`}
                strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress)}`}
                className={
                  isOverLimit
                    ? "text-red-500"
                    : remaining <= 20
                      ? "text-yellow-500"
                      : "text-primary"
                }
                strokeLinecap="round"
              />
            </svg>
            {/* Character count text */}
            {showCount && (
              <span
                className={`absolute text-xs font-medium ${
                  isOverLimit ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                {remaining}
              </span>
            )}
          </div>

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
