// ストーリー取得時のSELECTクエリ（Server/Client両方で使用）
export const STORY_SELECT_QUERY = `*, 
  habit_categories!inner(habit_category_name), 
  profiles!stories_user_id_fkey(user_name, display_name, avatar_url), 
  likes(count), 
  comments(count),
  story_tags(tags(name))`;

// 無限スクロールの1ページあたりの件数
export const PAGE_SIZE = 20;
