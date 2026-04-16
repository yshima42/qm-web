import { ArticleListSkeleton } from "@/features/articles/ui/article-tile-skeleton";

/**
 * /articles のページ遷移時ローディング。
 * (main)/loading.tsx は stories 用の Skeleton を返すため、
 * articles にはこちらを優先的に用意して横幅/上余白を実ページに揃える。
 */
export default function Loading() {
  return (
    <>
      {/* page.tsx の Header (sticky h-14) と同じサイズのプレースホルダ */}
      <div className="border-border bg-background/80 sticky top-0 z-20 h-14 border-b backdrop-blur-sm" />
      {/* page.tsx の <main className="p-3 sm:p-5"> と同じ padding */}
      <main className="p-3 sm:p-5">
        <ArticleListSkeleton />
      </main>
    </>
  );
}
