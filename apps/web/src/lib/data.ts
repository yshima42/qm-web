import { createAnonServerClient, createClient } from '@/utils/supabase/server';

import {
  ArticleCommentTileDto,
  ArticleTileDto,
  ArticleXmlDto,
  CommentTileDto,
  HabitCategoryName,
  ProfileTileDto,
  ProfileXmlDto,
  StoryTileDto,
  StoryXmlDto,
} from './types';

const STORY_SELECT_QUERY = `*, 
  habit_categories!inner(habit_category_name), 
  profiles!stories_user_id_fkey(user_name, display_name, avatar_url), 
  likes(count), 
  comments(count)`;

const STORY_XML_SELECT_QUERY = `id, 
  profiles!stories_user_id_fkey(user_name), 
  created_at`;

const ARTICLE_SELECT_QUERY = `*, 
  habit_categories!inner(habit_category_name), 
  profiles!articles_user_id_fkey(user_name, display_name, avatar_url), 
  article_likes(count), 
  article_comments(count)`;

const ARTICLE_XML_SELECT_QUERY = `id, 
  profiles!articles_user_id_fkey(user_name), 
  created_at`;

const FETCH_LIMIT = 100;

export async function fetchArticles() {
  const supabase = createAnonServerClient();
  const { data } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT_QUERY)
    .order('created_at', { ascending: false })
    .limit(FETCH_LIMIT);
  return data as ArticleTileDto[];
}

export async function fetchArticleById(id: string) {
  const supabase = createAnonServerClient();
  const result = await supabase
    .from('articles')
    .select(ARTICLE_SELECT_QUERY)
    .eq('id', id)
    .maybeSingle();
  return result.data as ArticleTileDto | null;
}

export async function fetchCommentsByArticleId(articleId: string) {
  const supabase = createAnonServerClient();
  const { data } = await supabase
    .from('article_comments')
    .select(
      '*, profiles!article_comments_user_id_fkey(user_name, display_name, avatar_url), article_comment_likes(count)',
    )
    .eq('article_id', articleId);
  return data as ArticleCommentTileDto[] | null;
}

export async function fetchStories() {
  const supabase = createAnonServerClient();
  const { data } = await supabase
    .from('stories')
    .select(STORY_SELECT_QUERY)
    .order('created_at', { ascending: false })
    .limit(FETCH_LIMIT);

  return data as StoryTileDto[];
}

type FetchXmlParams = {
  limit?: number;
};

export async function fetchStoriesXml({ limit }: FetchXmlParams = {}) {
  const supabase = createAnonServerClient();

  let allStories: StoryXmlDto[] = [];
  let page = 0;
  const pageSize = 1000;
  // const result = await supabase
  //   .rpc('get_stories_by_engagement_adjusted_ranged')
  //   .select(STORY_XML_SELECT_QUERY);
  // console.log('count@', result);

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .rpc('get_stories_by_engagement_adjusted_ranged', {
        p_limit: limit ?? 5000,
      })
      .select(STORY_XML_SELECT_QUERY)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: false });

    if (!result.data || result.data.length === 0) break;

    allStories = [...allStories, ...(result.data as unknown as StoryXmlDto[])];

    // 指定された制限に達した場合、ループを終了
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
      .from('profiles')
      .select('user_name, created_at')
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: false });

    if (!result.data || result.data.length === 0) break;

    allProfiles = [...allProfiles, ...(result.data as unknown as ProfileXmlDto[])];

    // 指定された制限に達した場合、ループを終了
    if (limit && allProfiles.length >= limit) {
      allProfiles = allProfiles.slice(0, limit);
      break;
    }

    if (result.data.length < pageSize) break;

    page++;
  }

  return allProfiles;
}

// data層の関数の命名がpresentational層に依存していて微妙な気がするが、とりあえず
export async function fetchStoryDetailPageStaticParams(limit?: number) {
  const supabase = createAnonServerClient();
  const now = new Date().toISOString();
  let allStories: { id: string; profiles: { user_name: string } }[] = [];
  let page = 0;
  const pageSize = 1000;

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .from('stories')
      .select(STORY_SELECT_QUERY)
      .lte('created_at', now)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: false });

    if (!result.data || result.data.length === 0) break;

    allStories = [
      ...allStories,
      ...(result.data as unknown as { id: string; profiles: { user_name: string } }[]),
    ];

    // 指定された制限に達した場合、ループを終了
    if (limit && allStories.length >= limit) {
      allStories = allStories.slice(0, limit);
      break;
    }

    if (result.data.length < pageSize) break;

    page++;
  }

  return allStories;
}

export async function fetchArticlePageStaticParams(limit?: number) {
  const supabase = createAnonServerClient();
  const now = new Date().toISOString();
  let allStories: { id: string; profiles: { user_name: string } }[] = [];
  let page = 0;
  const pageSize = 1000;

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .from('stories')
      .select(STORY_SELECT_QUERY)
      .lte('created_at', now)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: false });

    if (!result.data || result.data.length === 0) break;

    allStories = [
      ...allStories,
      ...(result.data as unknown as { id: string; profiles: { user_name: string } }[]),
    ];

    // 指定された制限に達した場合、ループを終了
    if (limit && allStories.length >= limit) {
      allStories = allStories.slice(0, limit);
      break;
    }

    if (result.data.length < pageSize) break;

    page++;
  }

  return allStories;
}

export async function fetchStoriesByHabitCategoryName(name: HabitCategoryName) {
  // サーバーエラー確認用
  // throw new Error("Not implemented");
  const supabase = await createClient();
  const { data } = await supabase
    .from('stories')
    .select(STORY_SELECT_QUERY)
    .eq('habit_categories.habit_category_name', name)
    .order('created_at', { ascending: false })
    .limit(FETCH_LIMIT);

  return data as StoryTileDto[];
}

export async function fetchStoryById(id: string) {
  const supabase = createAnonServerClient();
  const result = await supabase
    .from('stories')
    .select(STORY_SELECT_QUERY)
    .eq('id', id)
    .maybeSingle();
  return result.data as StoryTileDto | null;
}

export async function fetchStoriesByUserId(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('stories')
    .select(STORY_SELECT_QUERY)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(FETCH_LIMIT);
  return data as StoryTileDto[];
}

export async function fetchCommentedStoriesByUserId(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('distinct_user_story_comments')
    .select(`*, stories(${STORY_SELECT_QUERY})`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(FETCH_LIMIT);
  const stories = data?.map((comment: { stories: StoryTileDto }) => comment.stories) ?? [];
  return stories;
}

export async function fetchCommentsByStoryId(storyId: string) {
  const supabase = createAnonServerClient();
  const { data } = await supabase
    .from('comments')
    .select(
      '*, profiles!comments_user_id_fkey(user_name, display_name, avatar_url), comment_likes(count)',
    )
    .eq('story_id', storyId);
  return data as CommentTileDto[] | null;
}

export async function fetchProfilePageStaticParams(limit?: number) {
  const supabase = createAnonServerClient();
  let allUsernames: { user_name: string }[] = [];
  let page = 0;
  const pageSize = 1000; // Supabaseのデフォルト最大値

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .from('profiles')
      .select('user_name')
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('user_name', { ascending: true });

    if (!result.data || result.data.length === 0) break;

    allUsernames = [...allUsernames, ...result.data];
    if (limit && allUsernames.length >= limit) {
      allUsernames = allUsernames.slice(0, limit);
      break;
    }

    if (result.data.length < pageSize) break;

    page++;
  }

  return allUsernames;
}

export async function fetchProfileByUsername(username: string) {
  const supabase = createAnonServerClient();

  const profileResult = await supabase
    .from('profiles')
    .select('*, followers!followers_followed_id_fkey(count)')
    .eq('user_name', username)
    .maybeSingle();

  if (!profileResult.data) {
    return null;
  }

  // プロファイルデータ全体に型を指定
  type ProfileData = { id: string; [key: string]: unknown };
  const profileData = profileResult.data as ProfileData;
  const userId = profileData.id;

  // 別々のクエリとして実行
  const [followersResult, followingResult] = await Promise.all([
    supabase.from('followers').select('count').eq('followed_id', userId),
    supabase.from('followers').select('count').eq('follower_id', userId),
  ]);

  return {
    ...profileResult.data,
    followers: followersResult.data?.[0]?.count ?? 0,
    following: followingResult.data?.[0]?.count ?? 0,
  } as ProfileTileDto;
}

export async function fetchArticlesXml({ limit }: FetchXmlParams = {}) {
  const supabase = createAnonServerClient();
  const now = new Date().toISOString();

  let allArticles: ArticleXmlDto[] = [];
  let page = 0;
  const pageSize = 1000;

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .from('articles')
      .select(ARTICLE_XML_SELECT_QUERY)
      .lte('created_at', now)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: false });

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
