"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

import { createClient } from "@/lib/supabase/client";
import { StoryTileDto } from "@/lib/types";
import { STORY_SELECT_QUERY, PAGE_SIZE } from "../data/constants";

export function useInfiniteCommentedStories(userId: string) {
  const boundaryTimeRef = useRef(new Date().toISOString());

  return useInfiniteQuery({
    queryKey: ["stories", "commented", userId],
    queryFn: async ({ pageParam }) => {
      const supabase = createClient();
      const from = pageParam * PAGE_SIZE;
      const to = (pageParam + 1) * PAGE_SIZE - 1;

      // ユーザー認証確認
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { stories: [], hasMore: false };
      }

      // RPC関数でコメント済みストーリーIDを取得（muteユーザーを除外）
      const { data: storyIdsData, error: rpcError } = await supabase.rpc("get_commented_stories", {
        commenter_id: userId,
        user_id: user.id,
        from_pos: from,
        to_pos: to,
        before_timestamp: boundaryTimeRef.current,
      });

      if (rpcError || !storyIdsData || storyIdsData.length === 0) {
        if (rpcError) console.error("[useInfiniteCommentedStories] RPC error", rpcError);
        return { stories: [], hasMore: false };
      }

      const storyIds = (storyIdsData as { id: string }[]).map((item) => item.id);

      // ストーリーの詳細を取得
      const { data: stories, error: storiesError } = await supabase
        .from("stories")
        .select(STORY_SELECT_QUERY)
        .in("id", storyIds);

      if (storiesError || !stories) {
        console.error("[useInfiniteCommentedStories] stories fetch error", storiesError);
        return { stories: [], hasMore: false };
      }

      // 元の順序を保持するためにIDでマッピング（コメント順を維持）
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
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
