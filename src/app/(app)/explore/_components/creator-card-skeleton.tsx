"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CreatorCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-24 w-full" />

      <CardContent className="pt-0">
        <div className="-mt-10 mb-4 flex justify-between">
          <Skeleton className="size-20 rounded-full border-4 border-background" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>

        <div className="mb-2 flex items-center gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="size-4 rounded-full" />
        </div>

        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-4/5" />

        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div>
            <Skeleton className="h-4 w-12" />
            <Skeleton className="ml-1 h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
