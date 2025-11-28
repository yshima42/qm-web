"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { createStory } from "../data/actions";
import { Loader2 } from "lucide-react";
import { HabitTileDto } from "@/lib/types";
import { useCharacterCount } from "@/features/common/hooks/use-character-count";
import { CharacterCountIndicator } from "@/features/common/components/character-count-indicator";
import { CommentSettingDropdown, type CommentSetting } from "./comment-setting-dropdown";
import { HabitSelectDropdown } from "./habit-select-dropdown";
import { getActiveHabits } from "../utils/habit-utils";
import { useLocale } from "next-intl";

type StoryCreateFormProps = {
  habits: HabitTileDto[];
};

export function StoryCreateForm({ habits }: StoryCreateFormProps) {
  const t = useTranslations("story-post");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [commentSetting, setCommentSetting] = useState<CommentSetting>("enabled");

  const activeHabits = getActiveHabits(habits);
  const hasActiveHabit = activeHabits.length > 0;
  const showHabitSelect = activeHabits.length > 1;
  const [selectedHabitId, setSelectedHabitId] = useState<string>(
    activeHabits.length > 0 ? activeHabits[0].id : "",
  );

  // Calculate character count and remaining
  const { remaining, isOverLimit, showCount, progress } = useCharacterCount(content);

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    if (isOverLimit) {
      setError(t("contentTooLong"));
      return;
    }

    // 選択された習慣ID、コメント設定、言語コードを設定
    formData.set("habit_id", selectedHabitId);
    formData.set("comment_setting", commentSetting);
    // タイムラインの言語設定を使用（現在のロケール）
    formData.set("language_code", (locale as "ja" | "en") || "ja");

    startTransition(async () => {
      try {
        const result = await createStory(formData);
        if (result?.success) {
          // フォームをクリア
          setContent("");
          // タイムラインを更新（React Queryのキャッシュを無効化）
          queryClient.invalidateQueries({
            queryKey: ["stories"],
          });
        }
      } catch (e) {
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
    <form action={handleSubmit} className="flex flex-col">
      {/* 習慣選択とコメント可能表示 */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <HabitSelectDropdown
            habits={activeHabits}
            selectedHabitId={selectedHabitId}
            onSelect={setSelectedHabitId}
            showDropdown={showHabitSelect}
          />
          <CommentSettingDropdown value={commentSetting} onChange={setCommentSetting} />
        </div>
      </div>

      {/* テキストエリア */}
      <div className="flex-1 px-4 py-3">
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          className="placeholder:text-muted-foreground w-full resize-none border-0 bg-transparent text-lg focus:outline-none"
          placeholder={t("sharePlaceholder")}
        />
      </div>

      {error && (
        <div className="px-4 pb-2">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* フッター（文字数カウント、投稿ボタン） */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <CharacterCountIndicator
            remaining={remaining}
            isOverLimit={isOverLimit}
            showCount={showCount}
            progress={progress}
          />

          <Button
            type="submit"
            disabled={isPending || isOverLimit || !content.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-semibold disabled:opacity-50"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("postStoryButton")}
          </Button>
        </div>
      </div>
    </form>
  );
}
