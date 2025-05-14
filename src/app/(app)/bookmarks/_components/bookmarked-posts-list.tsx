"use client";

import { BookmarkButton } from "@/app/(app)/bookmarks/_components/bookmark-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, MessageCircle, Repeat, Share2, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookmarkedPostsListProps {
  category: string;
}

export function BookmarkedPostsList({ category }: BookmarkedPostsListProps) {
  const { bookmarks, loading, error, removeBookmark } = useBookmarks({
    category,
  });
  const router = useRouter();

  if (loading) {
    return <BookmarkedPostsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-8 text-center">
        <h3 className="mb-2 font-semibold text-xl">Error Loading Bookmarks</h3>
        <p className="text-muted-foreground">{error.message || "Please try again later"}</p>
        <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-8 text-center">
        <h3 className="mb-2 font-semibold text-xl">No Bookmarks Found</h3>
        <p className="text-muted-foreground">
          {category === "all"
            ? "You haven't bookmarked any posts yet."
            : `You haven't bookmarked any ${category} yet.`}
        </p>
        <Button className="mt-4" onClick={() => router.push("/explore")}>
          Explore Content
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between">
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => router.push(`/u/${bookmark.creator.username}`)}
              >
                <Avatar className="size-10">
                  <AvatarImage src={bookmark.creator.avatar} alt={bookmark.creator.name} />
                  <AvatarFallback>{bookmark.creator.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{bookmark.creator.name}</h4>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span>@{bookmark.creator.username}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <CalendarIcon className="mr-1 size-3" />
                      {formatDistanceToNow(new Date(bookmark.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <BookmarkButton
                postId={bookmark.id}
                onRemove={() => removeBookmark(bookmark.id)}
                isBookmarked={true}
              />
            </div>
          </CardHeader>

          <CardContent
            className="cursor-pointer p-4 pt-2"
            onClick={() => router.push(`/posts/${bookmark.creator.username}/${bookmark.id}`)}
          >
            {bookmark.title && <h3 className="mb-2 font-semibold text-lg">{bookmark.title}</h3>}
            <p className="mb-4">{bookmark.content}</p>

            {bookmark.media && bookmark.media.type === "image" && (
              <div className="mb-4 overflow-hidden rounded-lg">
                <img
                  src={bookmark.media.url}
                  alt={bookmark.title || "Post image"}
                  className="aspect-video w-full object-cover"
                />
              </div>
            )}

            {bookmark.isCampaign && bookmark.collectible && (
              <div className="mt-4 rounded-lg bg-muted p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold">
                    {bookmark.collectible.price} {bookmark.collectible.currency}
                  </span>
                  <span className="text-muted-foreground">
                    {bookmark.collectible.collected} / {bookmark.collectible.total} collected
                  </span>
                </div>
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full bg-[#00A8FF]"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (bookmark.collectible.collected / bookmark.collectible.total) * 100,
                        ),
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-border border-t p-4">
            <div className="flex space-x-4 text-muted-foreground text-sm">
              <button type="button" className="flex items-center gap-1 hover:text-primary">
                <ThumbsUp className="size-4" />
                <span>Like</span>
              </button>
              <button type="button" className="flex items-center gap-1 hover:text-primary">
                <MessageCircle className="size-4" />
                <span>Comment</span>
              </button>
              <button type="button" className="flex items-center gap-1 hover:text-primary">
                <Repeat className="size-4" />
                <span>Repost</span>
              </button>
              <button type="button" className="flex items-center gap-1 hover:text-primary">
                <Share2 className="size-4" />
                <span>Share</span>
              </button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function BookmarkedPostsSkeleton() {
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
