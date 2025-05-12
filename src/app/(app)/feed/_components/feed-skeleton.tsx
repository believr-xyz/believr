"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton for post cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={`post-skeleton-${i}-${Date.now()}`} className="mb-4 overflow-hidden">
          <CardHeader className="flex flex-row gap-4 pt-4 pb-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-12" />
          </CardHeader>

          <CardContent className="pt-0 pb-2">
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="mb-3 h-4 w-4/5" />
            <Skeleton className="mb-3 h-4 w-3/5" />
            <Skeleton className="mt-2 h-48 w-full rounded-xl" />

            <div className="mt-4 rounded-lg bg-muted/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-3">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
