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

async function fetchStoriesPage(
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

  const res = await fetch(`/api/stories/user?${params}`);

  if (!res.ok) {
    throw new Error("Failed to fetch stories");
  }

  return res.json();
}

export function useInfiniteStoriesByUserId(userId: string) {
  const boundaryTimeRef = useRef(new Date().toISOString());

  return useInfiniteQuery({
    queryKey: ["stories", "user", userId],
    queryFn: ({ pageParam }) => fetchStoriesPage(userId, pageParam, boundaryTimeRef.current),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    initialPageParam: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
