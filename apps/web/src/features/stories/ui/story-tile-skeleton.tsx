import { Skeleton } from "@/components/ui/skeleton";

export function StoryTileSkeleton() {
  return (
    <div className="border-border flex border-b py-4">
      <div className="mr-3">
        <Skeleton className="size-12 rounded-full" />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="mb-2">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="mb-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
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
