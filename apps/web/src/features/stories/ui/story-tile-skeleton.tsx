import { Skeleton } from "@/components/ui/skeleton";

/**
 * StoryTile と同じレイアウト構造でプレースホルダを出すためのSkeleton。
 * padding/margin/gap は StoryTile (story-tile.tsx) に完全に合わせている。
 */
export function StoryTileSkeleton() {
  return (
    <div className="border-border border-b">
      <div className="flex px-0 py-4">
        {/* アバター部分 (StoryTile の UserAvatar size="md" = size-10) */}
        <div className="mr-3">
          <Skeleton className="size-10 rounded-full" />
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          {/* ヘッダー行: 名前 + @user + 日付 （右端にメニューボタン領域） */}
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24 md:h-5 md:w-28" />
              <Skeleton className="h-3 w-16 md:h-4 md:w-20" />
              <Skeleton className="h-3 w-10 md:h-4 md:w-12" />
            </div>
          </div>

          {/* カテゴリタグ行（Tag: px-2 py-0.5 text-xs md:px-3 md:py-1 md:text-sm） */}
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-[22px] w-28 rounded-full md:h-7 md:w-32" />
          </div>

          {/* 本文（StoryTile の text-sm md:text-base / whitespace-pre-wrap を模倣、3行想定） */}
          <div className="mb-3 space-y-2">
            <Skeleton className="h-4 w-full md:h-5" />
            <Skeleton className="h-4 w-full md:h-5" />
            <Skeleton className="h-4 w-4/5 md:h-5" />
          </div>

          {/* アクション行: コメント数 / いいね数 */}
          <div className="text-muted-foreground flex gap-4 md:gap-6">
            <div className="flex items-center gap-1">
              <Skeleton className="size-4 rounded md:size-5" />
              <Skeleton className="h-3 w-4 md:h-4 md:w-6" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="size-4 rounded md:size-5" />
              <Skeleton className="h-3 w-4 md:h-4 md:w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StoryListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-[600px]">
      {Array.from({ length: count }).map((_, i) => (
        <StoryTileSkeleton key={i} />
      ))}
    </div>
  );
}
