"use client";

import { BookmarkedPostsList } from "@/app/(app)/bookmarks/_components/bookmarked-posts-list";
import { BookmarkedPostsSkeleton } from "@/app/(app)/bookmarks/_components/bookmarked-posts-skeleton";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { Suspense } from "react";

export default function BookmarksPage() {
  const { data: currentUser } = useAuthenticatedUser();

  return (
    <div className="w-full pb-12">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-2xl">Bookmarks</h1>
        <p className="text-muted-foreground">Posts you've saved for later</p>
      </div>

      <Suspense fallback={<BookmarkedPostsSkeleton />}>
        <BookmarkedPostsList />
      </Suspense>
    </div>
  );
}
