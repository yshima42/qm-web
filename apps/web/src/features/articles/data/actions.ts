'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

import { MAX_CHARACTERS } from '@/features/common/constants';

export async function toggleArticleLike(articleId: string, shouldLike: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  if (shouldLike) {
    // いいねを追加
    const { error } = await supabase
      .from('article_likes')
      .insert({ article_id: articleId, user_id: user.id });

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    // いいねを削除
    const { error } = await supabase
      .from('article_likes')
      .delete()
      .match({ article_id: articleId, user_id: user.id });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  revalidatePath('/');
  return { success: true };
}

export async function createArticleComment(articleId: string, content: string) {
  // バリデーション
  if (!content || content.trim() === '') {
    return { success: false, error: 'Content is required' };
  }

  const trimmedContent = content.trim();

  // 文字数制限
  if (trimmedContent.length > MAX_CHARACTERS) {
    return { success: false, error: 'Content is too long' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // コメントをDBに挿入
  const { error } = await supabase.from('article_comments').insert({
    article_id: articleId,
    user_id: user.id,
    content: trimmedContent,
  });

  if (error) {
    console.error('Error creating article comment:', error);
    return { success: false, error: 'Failed to create comment' };
  }

  // ページを再検証
  revalidatePath('/');
  return { success: true };
}
