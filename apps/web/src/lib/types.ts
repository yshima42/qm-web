import { Tables } from "@/lib/gen-types";

export type Story = Tables<"stories">;
export type Profile = Tables<"profiles">;
export type HabitCategory = Tables<"habit_categories">;
export type Comment = Tables<"comments">;
export type Article = Tables<"articles">;
export type ArticleComment = Tables<"article_comments">;
// プロフィールから必要な情報だけをピックアップ
export type ProfileForAvatar = Pick<Profile, "avatar_url" | "user_name" | "display_name">;
export type StoryHabitCategory = Pick<HabitCategory, "habit_category_name">;
export type HabitCategoryName =
  | "All"
  | "Game"
  | "Tobacco"
  | "Shopping"
  | "Drugs"
  | "Overeating"
  | "Porno"
  | "SNS"
  | "Gambling"
  | "Caffeine"
  | "Cosmetic Surgery"
  | "Custom"
  | "Alcohol"
  | "Codependency"
  | "Official";

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
  story_tags?: { tags: { name: string } }[];
  isLikedByMe?: boolean;
  language_code?: string;
};

// 返信先の親コメント情報（最小限の情報）
export type ParentCommentInfo = {
  id: string;
  profiles: ProfileForAvatar;
};

export type CommentTileDto = Comment & {
  profiles: ProfileForAvatar;
  comment_likes: { count: number }[];
  parent_comment?: ParentCommentInfo | null;
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
  isLikedByMe?: boolean;
};

export type ArticleCommentTileDto = ArticleComment & {
  profiles: ProfileForAvatar;
  article_comment_likes: { count: number }[];
};

export type Trial = Tables<"trials">;
export type Reason = Tables<"reasons">;
export type Habit = Tables<"habits">;

export type TrialDto = Trial;
export type ReasonDto = Reason;

export type HabitTileDto = Habit & {
  habit_categories: StoryHabitCategory;
  trials: TrialDto[];
  reasons: ReasonDto[];
};
