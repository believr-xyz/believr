"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TrendingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Trending Creators skeleton */}
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`trending-creator-${i}-${Math.random().toString(36).substring(2, 9)}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <div>
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          ))}
          <Skeleton className="h-9 w-full rounded-md" />
        </CardContent>
      </Card>

      {/* Trending Campaigns skeleton */}
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`trending-tag-${i}-${Math.random().toString(36).substring(2, 9)}`}
              className="space-y-2 rounded-lg p-2"
            >
              <Skeleton className="h-4 w-4/5" />
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
          <Skeleton className="h-9 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}
