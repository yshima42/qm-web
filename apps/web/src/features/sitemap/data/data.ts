import { createAnonServerClient } from "@/lib/supabase/server";

import { ArticleXmlDto, ProfileXmlDto, StoryXmlDto } from "@/lib/types";

const STORY_XML_SELECT_QUERY = `id, 
  profiles!stories_user_id_fkey(user_name), 
  created_at`;

const ARTICLE_XML_SELECT_QUERY = `id, 
  profiles!articles_user_id_fkey(user_name), 
  created_at`;

type FetchXmlParams = {
  limit?: number;
};

export async function fetchArticlesXml({ limit }: FetchXmlParams = {}) {
  const supabase = createAnonServerClient();
  const now = new Date().toISOString();

  let allArticles: ArticleXmlDto[] = [];
  let page = 0;
  const pageSize = 1000;

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .from("articles")
      .select(ARTICLE_XML_SELECT_QUERY)
      .lte("created_at", now)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order("created_at", { ascending: false });

    if (!result.data || result.data.length === 0) break;

    allArticles = [...allArticles, ...(result.data as unknown as ArticleXmlDto[])];

    if (limit && allArticles.length >= limit) {
      allArticles = allArticles.slice(0, limit);
      break;
    }

    if (result.data.length < pageSize) break;

    page++;
  }

  return allArticles;
}

export async function fetchStoriesXml({ limit }: FetchXmlParams = {}) {
  const supabase = createAnonServerClient();

  let allStories: StoryXmlDto[] = [];
  let page = 0;
  const pageSize = 1000;

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .rpc("get_stories_by_engagement_adjusted_ranged", {
        p_limit: limit ?? 5000,
      })
      .select(STORY_XML_SELECT_QUERY)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order("created_at", { ascending: false });

    if (!result.data || !Array.isArray(result.data) || result.data.length === 0) break;

    allStories = [...allStories, ...(result.data as unknown as StoryXmlDto[])];

    // Exit loop if specified limit is reached
    if (limit && allStories.length >= limit) {
      allStories = allStories.slice(0, limit);
      break;
    }

    if (result.data.length < pageSize) break;

    page++;
  }

  return allStories;
}

export async function fetchProfilesXml({ limit }: FetchXmlParams = {}) {
  const supabase = createAnonServerClient();

  let allProfiles: ProfileXmlDto[] = [];
  let page = 0;
  const pageSize = 1000;

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .from("profiles")
      .select("user_name, created_at")
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order("created_at", { ascending: false });

    if (!result.data || result.data.length === 0) break;

    allProfiles = [...allProfiles, ...(result.data as unknown as ProfileXmlDto[])];

    // Exit loop if specified limit is reached
    if (limit && allProfiles.length >= limit) {
      allProfiles = allProfiles.slice(0, limit);
      break;
    }

    if (result.data.length < pageSize) break;

    page++;
  }

  return allProfiles;
}
