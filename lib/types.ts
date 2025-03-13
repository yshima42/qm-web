import { Tables } from "@/lib/gen-types";

export type Story = Tables<"stories">;
export type Profile = Tables<"profiles">;
export type HabitCategory = Tables<"habit_categories">;
export type Comment = Tables<"comments">;
// プロフィールから必要な情報だけをピックアップ
export type ProfileForAvatar = Pick<
  Profile,
  "avatar_url" | "user_name" | "display_name"
>;
export type StoryHabitCategory = Pick<HabitCategory, "habit_category_name">;

export type StoryTileDto = Story & {
  profiles: ProfileForAvatar;
  habit_categories: StoryHabitCategory;
  likes: Array<{ count: number }>;
  comments: Array<{ count: number }>;
};

export type CommentTileDto = Comment & {
  profiles: ProfileForAvatar;
  comment_likes: Array<{ count: number }>;
};
