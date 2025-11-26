import { createAnonServerClient, createClient } from '@/lib/supabase/server';

import {
  ArticleCommentTileDto,
  ArticleTileDto,
} from '@/lib/types';

const ARTICLE_SELECT_QUERY = `*, 
  habit_categories!inner(habit_category_name), 
  profiles!articles_user_id_fkey(user_name, display_name, avatar_url), 
  article_likes(count), 
  article_comments(count)`;

const FETCH_LIMIT = 100;

export async function fetchArticles() {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT_QUERY)
    .order('created_at', { ascending: false })
    .limit(FETCH_LIMIT);

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

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

export async function fetchArticlePageStaticParams(limit?: number) {
  const supabase = createAnonServerClient();
  const now = new Date().toISOString();
  let allArticles: { id: string; profiles: { user_name: string } }[] = [];
  let page = 0;
  const pageSize = 1000;

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .from('articles')
      .select(ARTICLE_SELECT_QUERY)
      .lte('created_at', now)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: false });

    if (!result.data || result.data.length === 0) break;

    allArticles = [
      ...allArticles,
      ...(result.data as unknown as { id: string; profiles: { user_name: string } }[]),
    ];

    // Exit loop if specified limit is reached
    if (limit && allArticles.length >= limit) {
      allArticles = allArticles.slice(0, limit);
      break;
    }

    if (result.data.length < pageSize) break;

    page++;
  }

  return allArticles;
}

// RPC関数を使って複数記事のいいね状態を一括取得（Flutterと同じ方式）
export async function fetchHasLikedByArticleIds(
  articleIds: string[]
): Promise<Map<string, boolean>> {
  if (articleIds.length === 0) return new Map();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Map();

  const { data, error } = await supabase.rpc('article_get_published_tile_data', {
    article_ids: articleIds,
    current_user_id: user.id,
  });

  if (error || !data) return new Map();

  const result = new Map<string, boolean>();
  for (const row of data as { article_json: { id: string }; is_liked_by_user: boolean }[]) {
    result.set(row.article_json.id, row.is_liked_by_user);
  }
  return result;
}

// 記事リストにいいね状態を付与
export async function enrichArticlesWithLikeStatus(
  articles: ArticleTileDto[]
): Promise<ArticleTileDto[]> {
  const articleIds = articles.map((a) => a.id);
  const hasLikedMap = await fetchHasLikedByArticleIds(articleIds);

  return articles.map((article) => ({
    ...article,
    isLikedByMe: hasLikedMap.get(article.id) ?? false,
  }));
}

// 単一記事のいいね状態チェック（詳細ページ用）
export async function checkArticleIsLikedByMe(articleId: string): Promise<boolean> {
  const hasLikedMap = await fetchHasLikedByArticleIds([articleId]);
  return hasLikedMap.get(articleId) ?? false;
}

