"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
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

  // resetAndRefetchをqueryオブジェクトに追加
  return {
    ...query,
    resetAndRefetch,
  };
}
