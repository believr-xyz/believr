"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TrendingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Trending Creators skeleton */}
      <div>
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`trending-creator-${i}-${Math.random().toString(36).substring(2, 9)}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div>
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          ))}
          <Skeleton className="mt-2 h-9 w-full rounded-md" />
        </div>
      </div>

      {/* Hot Campaigns skeleton */}
      <div>
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`trending-tag-${i}-${Math.random().toString(36).substring(2, 9)}`}
              className="space-y-2 rounded-lg p-3"
            >
              <Skeleton className="h-4 w-4/5" />
              <div className="mb-2 flex items-center gap-2">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
          <Skeleton className="mt-2 h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
