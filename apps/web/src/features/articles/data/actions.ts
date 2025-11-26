'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

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

