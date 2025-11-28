"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { HabitTileDto } from "@/lib/types";

import { useCharacterCount } from "@/features/common/hooks/use-character-count";
import { CharacterCountIndicator } from "@/features/common/components/character-count-indicator";
import { createStory } from "@/features/stories/data/actions";
import { CommentSettingDropdown, type CommentSetting } from "./comment-setting-dropdown";
import { HabitSelectDropdown } from "./habit-select-dropdown";
import { getActiveHabits } from "../utils/habit-utils";
import { useLocale } from "next-intl";

type StoryInlineFormProps = {
  habits: HabitTileDto[];
  onStoryCreated?: () => void;
};

export function StoryInlineForm({ habits, onStoryCreated }: StoryInlineFormProps) {
  const t = useTranslations("story-post");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [commentSetting, setCommentSetting] = useState<CommentSetting>("enabled");
  const [isMounted, setIsMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeHabits = getActiveHabits(habits);
  const hasActiveHabit = activeHabits.length > 0;
  const showHabitSelect = activeHabits.length > 1;
  const [selectedHabitId, setSelectedHabitId] = useState<string>(
    activeHabits.length > 0 ? activeHabits[0].id : "",
  );

  // ハイドレーションミスマッチを防ぐため、マウント後にのみ表示
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // テキストエリアの高さを自動調整
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

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
          // タイムラインを更新（boundaryTimeをリセットして再取得）
          if (onStoryCreated) {
            onStoryCreated();
          } else {
            // フォールバック: onStoryCreatedが提供されていない場合
            queryClient.invalidateQueries({
              queryKey: ["stories"],
            });
            queryClient.resetQueries({
              queryKey: ["stories"],
            });
          }
        }
      } catch (err) {
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
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* 習慣選択とコメント設定 */}
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
            ref={textareaRef}
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={1}
            className="placeholder:text-muted-foreground w-full resize-none overflow-hidden border-0 bg-transparent text-lg focus:outline-none"
            placeholder={t("sharePlaceholder")}
            style={{ minHeight: "1.5rem", maxHeight: "20rem" }}
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
              disabled={isPending || !content.trim() || isOverLimit}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-semibold disabled:opacity-50"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("postButton")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
