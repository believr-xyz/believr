"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Back button skeleton */}
      <Skeleton className="mb-4 h-10 w-24" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main post content skeleton */}
        <div className="md:col-span-2">
          {/* Post header skeleton */}
          <div className="mb-4 flex items-start gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="size-5 rounded-full" />
              </div>
              <Skeleton className="mt-1 h-4 w-32" />
              <Skeleton className="mt-1 h-3 w-24" />
            </div>
          </div>

          {/* Post content skeleton */}
          <Card className="mb-6 overflow-hidden">
            {/* Image skeleton */}
            <Skeleton className="aspect-video w-full" />

            <div className="p-6">
              <Skeleton className="mb-4 h-8 w-4/5" />
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-4/6" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          </Card>

          {/* Tabs for comments and collectors skeleton */}
          <div className="mb-6">
            <Skeleton className="mb-4 h-10 w-full" />

            {/* Comments skeleton */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-20 w-full rounded-lg" />
                  <div className="mt-2 flex justify-end">
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>

              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={`comment-skeleton-${i}-${Math.random().toString(36).substring(2, 9)}`}
                  className="rounded-lg border p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Skeleton className="size-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="mt-1 h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-4/5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar skeleton */}
        <div>
          <Card className="sticky top-24">
            <Skeleton className="h-[400px] w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}
