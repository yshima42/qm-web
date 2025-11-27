"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

import { createClient } from "@/lib/supabase/client";
import { HabitCategoryName, StoryTileDto } from "@/lib/types";
import { STORY_SELECT_QUERY, PAGE_SIZE } from "../data/constants";

export function useInfiniteStories(category: HabitCategoryName) {
  const boundaryTimeRef = useRef(new Date().toISOString());

  return useInfiniteQuery({
    queryKey: ["stories", "category", category],
    queryFn: async ({ pageParam }) => {
      const supabase = createClient();
      const from = pageParam * PAGE_SIZE;
      const to = (pageParam + 1) * PAGE_SIZE - 1;

      // クエリビルダーを構築
      let query = supabase
        .from("stories")
        .select(STORY_SELECT_QUERY)
        .lte("created_at", boundaryTimeRef.current)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to);

      // 「All」以外の場合のみカテゴリフィルタを適用
      if (category !== "All") {
        query = query.eq("habit_categories.habit_category_name", category);
      }

      // ストーリー取得
      const { data: stories, error } = await query;

      if (error) {
        throw new Error("Failed to fetch stories");
      }

      const storyList = (stories ?? []) as StoryTileDto[];

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
        hasMore: storyList.length === PAGE_SIZE,
      };
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    initialPageParam: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
