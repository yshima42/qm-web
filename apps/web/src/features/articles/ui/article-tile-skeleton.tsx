import { Skeleton } from "@/components/ui/skeleton";

/**
 * ArticleTile と同じレイアウトでプレースホルダを出す Skeleton。
 * padding / margin / 角丸 / border は ArticleTile (article-tile.tsx) に合わせている。
 */
export function ArticleTileSkeleton() {
  return (
    <div className="border-border overflow-hidden rounded-lg border shadow-sm">
      <div className="p-4 md:p-5">
        {/* タイトル（h2 text-lg md:text-xl font-bold / line-clamp-2） */}
        <div className="mb-2 space-y-2">
          <Skeleton className="h-6 w-full md:h-7" />
          <Skeleton className="h-6 w-3/4 md:h-7" />
        </div>

        {/* カテゴリタグ + 日付 */}
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-[22px] w-24 rounded-full md:h-7 md:w-28" />
          <Skeleton className="h-3 w-16 md:h-4 md:w-20" />
        </div>

        {/* 抜粋（text-sm leading-relaxed / line-clamp-3） */}
        <div className="mb-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* アクション + 著者情報 */}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex gap-4">
            <div className="flex items-center gap-1">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-3 w-4" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-3 w-4" />
            </div>
          </div>
          {/* 著者: UserAvatar size="sm" = size-8 + display_name */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-[600px] space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleTileSkeleton key={i} />
      ))}
    </div>
  );
}
