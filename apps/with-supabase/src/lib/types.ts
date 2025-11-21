import { Tables } from '@/lib/gen-types';

export type Story = Tables<'stories'>;
export type Profile = Tables<'profiles'>;
export type HabitCategory = Tables<'habit_categories'>;
export type Comment = Tables<'comments'>;
export type Article = Tables<'articles'>;
export type ArticleComment = Tables<'article_comments'>;
// プロフィールから必要な情報だけをピックアップ
export type ProfileForAvatar = Pick<Profile, 'avatar_url' | 'user_name' | 'display_name'>;
export type StoryHabitCategory = Pick<HabitCategory, 'habit_category_name'>;
export type HabitCategoryName =
  | 'Game'
  | 'Tobacco'
  | 'Shopping'
  | 'Drugs'
  | 'Overeating'
  | 'Porno'
  | 'SNS'
  | 'Gambling'
  | 'Caffeine'
  | 'Cosmetic Surgery'
  | 'Custom'
  | 'Alcohol'
  | 'Codependency'
  | 'Official';

export type StoryXmlDto = {
  id: string;
  profiles: { user_name: string };
  created_at: string;
};

export type ProfileXmlDto = {
  user_name: string;
  created_at: string;
};

export type ArticleXmlDto = {
  id: string;
  profiles: { user_name: string };
  created_at: string;
};

export type StoryTileDto = Story & {
  profiles: ProfileForAvatar;
  habit_categories: StoryHabitCategory;
  likes: { count: number }[];
  comments: { count: number }[];
};

export type CommentTileDto = Comment & {
  profiles: ProfileForAvatar;
  comment_likes: { count: number }[];
};

export type ProfileTileDto = Profile & {
  followers: number;
  following: number;
};

export type ArticleTileDto = Article & {
  profiles: ProfileForAvatar;
  habit_categories: StoryHabitCategory | null;
  article_likes: { count: number }[];
  article_comments: { count: number }[];
};

export type ArticleCommentTileDto = ArticleComment & {
  profiles: ProfileForAvatar;
  article_comment_likes: { count: number }[];
};

