"use client";

import { PostCard } from "@/app/(app)/feed/_components/post-card";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function BookmarkedPostsList() {
  const router = useRouter();
  const { data: currentUser } = useAuthenticatedUser();
  const { posts, isLoading, error, hasMore, loadMore } = useBookmarks();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-8 text-center">
        <h3 className="mb-2 font-semibold text-xl">Error Loading Bookmarks</h3>
        <p className="text-muted-foreground">{error.message}</p>
        <Button className="mt-4" onClick={() => router.push("/feed")}>
          Back to Feed
        </Button>
      </div>
    );
  }

  // If user is not authenticated, show prompt to log in
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-8 text-center">
        <h3 className="mb-2 font-semibold text-xl">Log in to View Bookmarks</h3>
        <p className="text-muted-foreground">You need to be logged in to see your bookmarks.</p>
        <Button className="mt-4" onClick={() => router.push("/feed")}>
          Explore Content
        </Button>
      </div>
    );
  }

  // Show loading state
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show empty state if no bookmarks found
  if (!isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-8 text-center">
        <h3 className="mb-2 font-semibold text-xl">No Bookmarks Found</h3>
        <p className="text-muted-foreground">
          You haven't bookmarked any posts yet. Browse the feed and bookmark posts you'd like to
          revisit later.
        </p>
        <Button className="mt-4" onClick={() => router.push("/feed")}>
          Explore Feed
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadMore()}
            disabled={isLoading}
            className="min-w-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Loading
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
