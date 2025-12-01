"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createStory } from "../data/actions";
import { Loader2 } from "lucide-react";
import { HabitTileDto, HabitCategoryName, StoryTileDto } from "@/lib/types";
import { useCharacterCount } from "@/features/common/hooks/use-character-count";
import { CharacterCountIndicator } from "@/features/common/components/character-count-indicator";
import { CommentSettingDropdown, type CommentSetting } from "./comment-setting-dropdown";
import { HabitSelectDropdown } from "./habit-select-dropdown";
import { getActiveHabits } from "../utils/habit-utils";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { getCategoryUrl, HABIT_CATEGORIES } from "@/lib/categories";
import { STORY_SELECT_QUERY } from "../data/constants";

type StoryCreateFormProps = {
  habits: HabitTileDto[];
  onSuccess?: () => void;
};

export function StoryCreateForm({ habits, onSuccess }: StoryCreateFormProps) {
  const t = useTranslations("story-post");
  const locale = useLocale();
  const pathname = usePathname();
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

  // 現在のカテゴリーを取得
  const getCurrentCategory = (): HabitCategoryName => {
    // ルートパスまたはタイムラインページの場合は"All"
    if (pathname === "/" || pathname.startsWith("/stories/habits")) {
      // パスからカテゴリーを判定
      for (const category of ["All", ...HABIT_CATEGORIES] as HabitCategoryName[]) {
        if (pathname === getCategoryUrl(category)) {
          return category;
        }
      }
      // パスが`/stories/habits/[category]`の形式の場合、カテゴリーを抽出
      const match = pathname.match(/^\/stories\/habits\/([^/]+)$/);
      if (match) {
        const categorySlug = match[1];
        // カテゴリースラッグをカテゴリー名に変換
        const categoryMap: Record<string, HabitCategoryName> = {
          all: "All",
          game: "Game",
          tobacco: "Tobacco",
          shopping: "Shopping",
          drugs: "Drugs",
          overeating: "Overeating",
          porno: "Porno",
          sns: "SNS",
          gambling: "Gambling",
          caffeine: "Caffeine",
          "cosmetic-surgery": "Cosmetic Surgery",
          custom: "Custom",
          alcohol: "Alcohol",
          codependency: "Codependency",
          official: "Official",
        };
        const normalizedCategory = categoryMap[categorySlug.toLowerCase().replace(/%20/g, "-")];
        if (normalizedCategory) {
          return normalizedCategory;
        }
      }
      // デフォルトは"All"
      return "All";
    }
    // デフォルトは"All"
    return "All";
  };

  // 新しいストーリーをタイムラインの先頭に追加する関数（オプティミスティックアップデート）
  const addStoryToTimeline = async (storyId: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const languageCode = locale === "ja" || locale === "en" ? locale : "ja";
    const category = getCurrentCategory();

    // ストーリーの詳細を取得
    const { data: story, error: storyError } = await supabase
      .from("stories")
      .select(STORY_SELECT_QUERY)
      .eq("id", storyId)
      .single();

    if (storyError || !story) {
      console.error("[addStoryToTimeline] Error fetching story:", storyError);
      // エラーが発生した場合は、通常のリフレッシュにフォールバック
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.resetQueries({ queryKey: ["stories", "category", category, locale] });
      return;
    }

    // 言語コードでフィルタリング（該当する場合のみ追加）
    if (story.language_code && story.language_code !== languageCode) {
      // 言語が一致しない場合は何もしない
      return;
    }

    // カテゴリーフィルタリング（該当する場合のみ追加）
    const storyCategory = (story as StoryTileDto).habit_categories?.habit_category_name;
    if (category !== "All" && storyCategory !== category) {
      // カテゴリーが一致しない場合は何もしない
      return;
    }

    const storyList = [story] as StoryTileDto[];

    // いいね状態を取得
    let storiesWithLikes = storyList;
    if (user && storyList.length > 0) {
      const { data: likeData } = await supabase.rpc("get_has_liked_by_story_ids", {
        p_story_ids: [storyId],
        p_user_id: user.id,
      });

      const likeMap = new Map(
        (likeData as { story_id: string; has_liked: boolean }[])?.map((l) => [
          l.story_id,
          l.has_liked,
        ]) ?? [],
      );

      storiesWithLikes = storyList.map((s) => ({
        ...s,
        isLikedByMe: likeMap.get(s.id) ?? false,
      }));
    }

    const newStory = storiesWithLikes[0];

    // React Queryのキャッシュを更新
    type StoryPage = {
      stories: StoryTileDto[];
      hasMore: boolean;
    };
    queryClient.setQueryData<InfiniteData<StoryPage>>(
      ["stories", "category", category, locale],
      (oldData) => {
        if (!oldData) {
          // データがまだない場合は、新しいページとして追加
          return {
            pages: [{ stories: [newStory], hasMore: true }],
            pageParams: [0],
          };
        }

        // 既存のデータがある場合は、最初のページの先頭に追加
        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          // 既に同じストーリーが存在する場合は追加しない（重複防止）
          const existingStoryIds = new Set(
            newPages.flatMap((page) => page.stories.map((s: StoryTileDto) => s.id)),
          );
          if (!existingStoryIds.has(newStory.id)) {
            newPages[0] = {
              ...newPages[0],
              stories: [newStory, ...newPages[0].stories],
            };
          }
        }

        return {
          ...oldData,
          pages: newPages,
        };
      },
    );
  };

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
          // ストーリーIDがある場合は、タイムラインに追加（オプティミスティックアップデート）
          if (result.storyId) {
            await addStoryToTimeline(result.storyId);
          } else {
            // フォールバック: 通常のリフレッシュ
            const category = getCurrentCategory();
            queryClient.invalidateQueries({ queryKey: ["stories"] });
            queryClient.resetQueries({ queryKey: ["stories", "category", category, locale] });
          }
          // 成功時のコールバックを呼び出す（モーダルを閉じるなど）
          onSuccess?.();
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
