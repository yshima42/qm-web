import { StoryListSkeleton } from "@/features/stories/ui/story-tile-skeleton";

/**
 * サイドバー付きページ用のローディング
 * サイドバーとレイアウト骨格は (main)/layout.tsx が維持するが、
 * 各 page.tsx が持つ Header と <main> の padding はこの loading.tsx が
 * 代替として出す必要がある。実ページと同じ横幅/上余白にして、
 * 遷移時のスケルトン→本体差し替えのズレを抑える。
 */
export default function Loading() {
  return (
    <>
      {/* page.tsx の Header (sticky h-14) と同じサイズのプレースホルダ */}
      <div className="border-border bg-background/80 sticky top-0 z-20 h-14 border-b backdrop-blur-sm" />
      {/* page.tsx の <main className="p-3 sm:p-5"> と同じ padding */}
      <main className="p-3 sm:p-5">
        <StoryListSkeleton />
      </main>
    </>
  );
}
