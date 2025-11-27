import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  fetchPaginatedCommentedStoriesByUserId,
  enrichStoriesWithLikeStatus,
} from "@/features/stories/data/data";

const DEFAULT_PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const page = parseInt(searchParams.get("page") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || String(DEFAULT_PAGE_SIZE), 10);
  const boundaryTime = searchParams.get("boundaryTime") || new Date().toISOString();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const stories = await fetchPaginatedCommentedStoriesByUserId({
      userId,
      page,
      limit,
      boundaryTime,
    });

    // ログイン時はいいね状態を付与
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const enrichedStories = user ? await enrichStoriesWithLikeStatus(stories) : stories;

    return NextResponse.json({
      stories: enrichedStories,
      hasMore: stories.length === limit,
      page,
    });
  } catch (error) {
    console.error("Failed to fetch commented stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}
