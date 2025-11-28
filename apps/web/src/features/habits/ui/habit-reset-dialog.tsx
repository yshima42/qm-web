"use client";

import { Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { HabitTileDto } from "@/lib/types";
import { resetTrialAndPostStory } from "@/features/habits/data/actions";
import { useCharacterCount } from "@/features/common/hooks/use-character-count";
import { CharacterCountIndicator } from "@/features/common/components/character-count-indicator";
import {
  CommentSettingDropdown,
  type CommentSetting,
} from "@/features/stories/ui/comment-setting-dropdown";
import {
  LanguageSelectDropdown,
  type LanguageCode,
} from "@/features/stories/ui/language-select-dropdown";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: HabitTileDto;
  trialId: string;
};

export function HabitResetDialog({ open, onOpenChange, habit, trialId }: Props) {
  const t = useTranslations("habit-reset");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const [commentSetting, setCommentSetting] = useState<CommentSetting>("enabled");
  const [languageCode, setLanguageCode] = useState<LanguageCode>((locale as LanguageCode) || "ja");
  const [error, setError] = useState<string | null>(null);

  const { remaining, isOverLimit, showCount, progress } = useCharacterCount(content);
  const hasContent = content.trim().length > 0;

  const handleReset = () => {
    setError(null);

    if (hasContent && isOverLimit) {
      setError(t("contentTooLong"));
      return;
    }

    startTransition(async () => {
      const result = await resetTrialAndPostStory({
        habitId: habit.id,
        trialId,
        storyContent: hasContent ? content.trim() : null,
        commentSetting: hasContent ? commentSetting : undefined,
        languageCode: hasContent ? languageCode : undefined,
        habitCategoryId: habit.habit_category_id,
        customHabitName: habit.custom_habit_name,
        trialStartedAt:
          habit.trials?.find((t) => t.id === trialId)?.started_at || new Date().toISOString(),
      });

      if (result.error) {
        setError(result.error.message || t("resetErrorMessage"));
        return;
      }

      // 成功時はダイアログを閉じてリフレッシュ
      setContent("");
      onOpenChange(false);
      router.refresh();
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setContent("");
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("resetTitle")}</DialogTitle>
          <DialogDescription>{t("resetConfirmationContent")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 投稿内容入力（任意） */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("storyContentLabel")}</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("storyContentPlaceholder")}
              rows={4}
              className="resize-none"
              disabled={isPending}
            />
            {hasContent && (
              <div className="flex items-center justify-between gap-2">
                <CharacterCountIndicator
                  remaining={remaining}
                  isOverLimit={isOverLimit}
                  showCount={showCount}
                  progress={progress}
                />
                <div className="flex items-center gap-2">
                  <LanguageSelectDropdown
                    value={languageCode}
                    onChange={setLanguageCode}
                    disabled={isPending}
                    updateTimelineFilter={false}
                  />
                  <CommentSettingDropdown
                    value={commentSetting}
                    onChange={setCommentSetting}
                    disabled={isPending}
                  />
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {t("cancel")}
          </Button>
          <Button onClick={handleReset} disabled={isPending || (hasContent && isOverLimit)}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {hasContent ? t("resetAndPost") : t("reset")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
