"use client";

import { useState, useTransition, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createStory } from "../data/actions";
import { Loader2 } from "lucide-react";
import { HabitTileDto } from "@/lib/types";

type StoryCreateFormProps = {
  habits: HabitTileDto[];
};

const MAX_CHARACTERS = 300;
const SHOW_COUNT_THRESHOLD = 20;

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

export function StoryCreateForm({ habits }: StoryCreateFormProps) {
  const t = useTranslations("story-post");
  const tCategory = useTranslations("categories");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");

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

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    if (isOverLimit) {
      setError(t("contentTooLong"));
      return;
    }

    startTransition(async () => {
      try {
        await createStory(formData);
      } catch (e) {
        // Ignore NEXT_REDIRECT errors as they are not actual errors
        if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) {
          return;
        }
        setError(e instanceof Error ? e.message : t("createFailed"));
      }
    });
  };

  if (!hasActiveHabit) {
    return (
      <div className="bg-muted/50 rounded-md border p-4 text-center">
        <p className="text-muted-foreground">{t("noActiveHabit")}</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {showHabitSelect ? (
        <div className="space-y-2">
          <Label htmlFor="habit_id">{t("selectHabit")}</Label>
          <select
            id="habit_id"
            name="habit_id"
            required
            className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
        </div>
      ) : (
        <div className="space-y-2">
          <Label>{t("habit")}</Label>
          <div className="bg-muted/20 rounded-md border p-2 text-sm font-medium">
            {activeHabits[0].custom_habit_name ||
              (activeHabits[0].habit_categories?.habit_category_name
                ? tCategory(activeHabits[0].habit_categories.habit_category_name)
                : activeHabits[0].habit_categories?.habit_category_name)}
          </div>
          <input type="hidden" name="habit_id" value={activeHabits[0].id} />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="content">{t("yourStory")}</Label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          placeholder={t("sharePlaceholder")}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-end gap-3">
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
                isOverLimit ? "text-red-500" : remaining <= 20 ? "text-yellow-500" : "text-primary"
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

        <Button type="submit" disabled={isPending || isOverLimit}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("postStoryButton")}
        </Button>
      </div>
    </form>
  );
}
