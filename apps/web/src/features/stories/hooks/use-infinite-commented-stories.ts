"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

import { StoryTileDto } from "@/lib/types";

const PAGE_SIZE = 20;

type StoriesResponse = {
  stories: StoryTileDto[];
  hasMore: boolean;
  page: number;
};

async function fetchCommentedStoriesPage(
  userId: string,
  page: number,
  boundaryTime: string,
): Promise<StoriesResponse> {
  const params = new URLSearchParams({
    userId,
    page: String(page),
    limit: String(PAGE_SIZE),
    boundaryTime,
  });

  const res = await fetch(`/api/stories/commented?${params}`);

  if (!res.ok) {
    throw new Error("Failed to fetch commented stories");
  }

  return res.json();
}

export function useInfiniteCommentedStories(userId: string) {
  const boundaryTimeRef = useRef(new Date().toISOString());

  return useInfiniteQuery({
    queryKey: ["stories", "commented", userId],
    queryFn: ({ pageParam }) =>
      fetchCommentedStoriesPage(userId, pageParam, boundaryTimeRef.current),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    initialPageParam: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
