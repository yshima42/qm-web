"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";
import { StoryTileDto } from "@/lib/types";
import { STORY_SELECT_QUERY, PAGE_SIZE } from "../data/constants";

// boundaryTimeのキャッシュキー
const BOUNDARY_TIME_KEY = ["stories", "boundaryTime", "following"] as const;

export function useInfiniteFollowingStories() {
  const queryClient = useQueryClient();

  // boundaryTimeをキャッシュから取得、なければ新規作成
  const getBoundaryTime = (): string => {
    const cached = queryClient.getQueryData<string>(BOUNDARY_TIME_KEY);
    if (cached) {
      return cached;
    }
    const newTime = new Date().toISOString();
    queryClient.setQueryData(BOUNDARY_TIME_KEY, newTime);
    return newTime;
  };

  return useInfiniteQuery({
    queryKey: ["stories", "following"],
    queryFn: async ({ pageParam }) => {
      const supabase = createClient();

      // ユーザー認証確認
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { stories: [], hasMore: false };
      }

      const from = pageParam * PAGE_SIZE;
      const to = (pageParam + 1) * PAGE_SIZE - 1;

      // boundaryTimeをキャッシュから取得
      const boundaryTime = getBoundaryTime();

      // RPC関数でフォロー中ユーザーのストーリーIDを取得
      const { data: storyIdsData, error: rpcError } = await supabase.rpc(
        "get_followed_user_stories_excluding_blocked",
        {
          input_user_id: user.id,
          from_pos: from,
          to_pos: to,
          before_timestamp: boundaryTime,
        },
      );

      if (rpcError || !storyIdsData || storyIdsData.length === 0) {
        if (rpcError) console.error("[useInfiniteFollowingStories] RPC error", rpcError);
        return { stories: [], hasMore: false };
      }

      const storyIds = (storyIdsData as { id: string }[]).map((item) => item.id);

      // ストーリーの詳細を取得
      const { data: stories, error: storiesError } = await supabase
        .from("stories")
        .select(STORY_SELECT_QUERY)
        .in("id", storyIds)
        .order("created_at", { ascending: false });

      if (storiesError || !stories) {
        console.error("[useInfiniteFollowingStories] stories fetch error", storiesError);
        return { stories: [], hasMore: false };
      }

      // 元の順序を保持するためにIDでソート
      const storyMap = new Map(stories.map((s) => [s.id, s]));
      const orderedStories = storyIds
        .map((id) => storyMap.get(id))
        .filter((s): s is NonNullable<typeof s> => s !== undefined);

      const storyList = orderedStories as StoryTileDto[];

      // いいね状態を取得
      let storiesWithLikes = storyList;
      if (storyList.length > 0) {
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
    staleTime: Infinity, // ユーザーがリフレッシュするまで再フェッチしない
    gcTime: 60 * 60 * 1000, // 1時間キャッシュを保持
    refetchOnWindowFocus: false,
  });
}
