"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

import { HabitCategoryName, StoryTileDto } from "@/lib/types";

const PAGE_SIZE = 20;

type StoriesResponse = {
  stories: StoryTileDto[];
  hasMore: boolean;
  page: number;
};

async function fetchStoriesPage(
  category: HabitCategoryName,
  page: number,
  boundaryTime: string,
): Promise<StoriesResponse> {
  const params = new URLSearchParams({
    category,
    page: String(page),
    limit: String(PAGE_SIZE),
    boundaryTime,
  });

  const res = await fetch(`/api/stories/category?${params}`);

  if (!res.ok) {
    throw new Error("Failed to fetch stories");
  }

  return res.json();
}

export function useInfiniteStories(category: HabitCategoryName) {
  // Flutterと同様に境界時間を保持（スクロール中に新規投稿があってもずれないように）
  const boundaryTimeRef = useRef(new Date().toISOString());

  return useInfiniteQuery({
    queryKey: ["stories", category],
    queryFn: ({ pageParam }) => fetchStoriesPage(category, pageParam, boundaryTimeRef.current),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    initialPageParam: 0,
    // ページリロード時に最初の状態に戻すためキャッシュを保持しない
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
