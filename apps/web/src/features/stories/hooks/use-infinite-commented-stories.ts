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

      // コメント済みストーリー取得
      const { data, error } = await supabase
        .from("distinct_user_story_comments")
        .select(`*, stories(${STORY_SELECT_QUERY})`)
        .eq("user_id", userId)
        .lte("created_at", boundaryTimeRef.current)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to);

      if (error) {
        throw new Error("Failed to fetch commented stories");
      }

      const storyList =
        (data?.map((comment: { stories: StoryTileDto }) => comment.stories) as StoryTileDto[]) ??
        [];

      // いいね状態を取得
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let storiesWithLikes = storyList;
      if (user && storyList.length > 0) {
        const storyIds = storyList.map((s) => s.id);
        const { data: likeData } = await supabase.rpc("get_has_liked_by_story_ids", {
          p_story_ids: storyIds,
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
        hasMore: (data?.length ?? 0) === PAGE_SIZE,
      };
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    initialPageParam: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
