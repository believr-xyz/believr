"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Cover image skeleton */}
      <div className="relative mb-16 h-48 w-full overflow-hidden rounded-xl md:h-64">
        <Skeleton className="h-full w-full" />

        {/* Profile avatar skeleton - positioned to overlap cover and content */}
        <div className="-bottom-16 absolute left-4 rounded-full border-4 border-background md:left-8">
          <Skeleton className="size-32 rounded-full" />
        </div>

        {/* Follow button skeleton */}
        <div className="absolute right-4 bottom-4 md:right-8">
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>

      {/* Profile info skeleton */}
      <div className="mb-6">
        <div className="flex flex-col justify-between md:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="size-5 rounded-full" />
            </div>
            <Skeleton className="mt-1 h-4 w-32" />
          </div>

          <div className="mt-4 flex flex-wrap gap-8 md:mt-0">
            <div>
              <Skeleton className="h-5 w-16" />
              <Skeleton className="mt-1 h-4 w-12" />
            </div>
            <div>
              <Skeleton className="h-5 w-16" />
              <Skeleton className="mt-1 h-4 w-16" />
            </div>
            <div>
              <Skeleton className="h-5 w-16" />
              <Skeleton className="mt-1 h-4 w-16" />
            </div>
            <div>
              <Skeleton className="h-5 w-16" />
              <Skeleton className="mt-1 h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Bio skeleton */}
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
        <Skeleton className="mt-2 h-4 w-3/5" />

        <div className="mt-4 flex flex-wrap gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="px-4">
        <Skeleton className="mb-4 h-10 w-full max-w-md" />

        {/* Post cards skeleton */}
        {Array.from({ length: 2 }).map((_, i) => (
          <Card
            key={`profile-post-skeleton-${i}-${Math.random().toString(36).substring(2, 9)}`}
            className="mb-4 overflow-hidden"
          >
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="mb-2 h-5 w-4/5" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
