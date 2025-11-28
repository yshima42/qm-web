"use client";

import { useInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { useLocale } from "next-intl";

import { createClient } from "@/lib/supabase/client";
import { HabitCategoryName, StoryTileDto } from "@/lib/types";
import { STORY_SELECT_QUERY, PAGE_SIZE } from "../data/constants";

export function useInfiniteStories(category: HabitCategoryName) {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const boundaryTimeRef = useRef(new Date().toISOString());
  const prevLocaleRef = useRef(locale);

  // 言語が切り替わったときにboundaryTimeをリセットし、キャッシュを無効化
  useEffect(() => {
    if (prevLocaleRef.current !== locale) {
      boundaryTimeRef.current = new Date().toISOString();
      prevLocaleRef.current = locale;
      // 言語が変わったときに、該当するクエリのキャッシュを無効化して再取得
      queryClient.invalidateQueries({
        queryKey: ["stories", "category", category],
      });
      queryClient.resetQueries({
        queryKey: ["stories", "category", category, locale],
      });
    }
  }, [locale, category, queryClient]);

  // 投稿後にタイムラインを更新するための関数をエクスポート
  // この関数は外部から呼び出して、boundaryTimeをリセットし、クエリをリセットできる
  const resetAndRefetch = () => {
    boundaryTimeRef.current = new Date().toISOString();
    queryClient.resetQueries({
      queryKey: ["stories", "category", category, locale],
    });
  };

  // 新しいストーリーをタイムラインの先頭に追加する関数（オプティミスティックアップデート）
  const addStoryToTimeline = async (storyId: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const languageCode = locale === "ja" || locale === "en" ? locale : "ja";

    // ストーリーの詳細を取得
    const { data: story, error: storyError } = await supabase
      .from("stories")
      .select(STORY_SELECT_QUERY)
      .eq("id", storyId)
      .single();

    if (storyError || !story) {
      console.error("[addStoryToTimeline] Error fetching story:", storyError);
      // エラーが発生した場合は、通常のリフレッシュにフォールバック
      resetAndRefetch();
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

    // boundaryTimeを更新（新しいストーリーが追加されたので、現在時刻に更新）
    boundaryTimeRef.current = new Date().toISOString();
  };

  const query = useInfiniteQuery({
    queryKey: ["stories", "category", category, locale],
    queryFn: async ({ pageParam }) => {
      const supabase = createClient();
      const from = pageParam * PAGE_SIZE;
      const to = (pageParam + 1) * PAGE_SIZE - 1;

      // ユーザー認証確認
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const languageCode = locale === "ja" || locale === "en" ? locale : "ja";

      // RPC関数でストーリーIDを取得（muteユーザーを除外、言語コードでフィルタリング）
      const { data: storyIdsData, error: rpcError } = await supabase.rpc(
        "get_ranged_stories_by_habit_including_official_with_language",
        {
          input_habit_category_name: category === "All" ? null : category,
          from_pos: from,
          to_pos: to,
          before_timestamp: boundaryTimeRef.current,
          input_language_code: languageCode,
        },
      );

      if (rpcError || !storyIdsData || storyIdsData.length === 0) {
        if (rpcError) {
          console.error("[useInfiniteStories] RPC error", rpcError);
        }
        return { stories: [], hasMore: false };
      }

      const storyIds = (storyIdsData as { id: string }[]).map((item) => item.id);

      // ストーリーの詳細を取得
      const { data: stories, error: storiesError } = await supabase
        .from("stories")
        .select(STORY_SELECT_QUERY)
        .in("id", storyIds);

      if (storiesError || !stories) {
        console.error("[useInfiniteStories] stories fetch error", storiesError);
        return { stories: [], hasMore: false };
      }

      // 元の順序を保持するためにIDでマッピング
      const storyMap = new Map(stories.map((s) => [s.id, s]));
      const orderedStories = storyIds
        .map((id) => storyMap.get(id))
        .filter((s): s is NonNullable<typeof s> => s !== undefined);

      const storyList = orderedStories as StoryTileDto[];

      // いいね状態を取得
      let storiesWithLikes = storyList;
      if (user && storyList.length > 0) {
        const fetchedStoryIds = storyList.map((s) => s.id);
        const { data: likeData } = await supabase.rpc("get_has_liked_by_story_ids", {
          p_story_ids: fetchedStoryIds,
          p_user_id: user.id,
        });

        const likeMap = new Map(
          (likeData as { story_id: string; has_liked: boolean }[])?.map((l) => [
            l.story_id,
            l.has_liked,
          ]) ?? [],
        );

        storiesWithLikes = storyList.map((story) => ({
          ...story,
          isLikedByMe: likeMap.get(story.id) ?? false,
        }));
      }

      return {
        stories: storiesWithLikes,
        hasMore: storyIdsData.length === PAGE_SIZE,
      };
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    initialPageParam: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  // resetAndRefetchとaddStoryToTimelineをqueryオブジェクトに追加
  return {
    ...query,
    resetAndRefetch,
    addStoryToTimeline,
  };
}
