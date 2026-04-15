import { StoryListSkeleton } from "@/features/stories/ui/story-tile-skeleton";

/**
 * サイドバー付きページ用のローディング
 * サイドバーとヘッダーはlayout.tsxで維持されるため、
 * このローディングはコンテンツ部分のみに適用される
 */
export default function Loading() {
  return <StoryListSkeleton />;
}
