"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface BookmarkedPostsListProps {
  category: string;
}

export function BookmarkedPostsList({ category }: BookmarkedPostsListProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-8 text-center">
      <h3 className="mb-2 font-semibold text-xl">Bookmarks Feature Coming Soon</h3>
      <p className="text-muted-foreground">The bookmarks feature is currently under development.</p>
      <Button className="mt-4" onClick={() => router.push("/explore")}>
        Explore Content
      </Button>
    </div>
  );
}

export function BookmarkedPostsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
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
