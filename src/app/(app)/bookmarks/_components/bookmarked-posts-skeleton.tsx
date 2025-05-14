import { Skeleton } from "@/components/ui/skeleton";

export function BookmarkedPostsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`bookmark-skeleton-${i}-${Math.random().toString(36).substring(2, 9)}`}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
