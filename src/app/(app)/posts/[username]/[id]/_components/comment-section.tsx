"use client";

import { BookmarkToggleButton } from "@/components/shared/bookmark-toggle-button";
import { ReactionButton } from "@/components/shared/reaction-button";
import { RepostQuoteButton } from "@/components/shared/repost-quote-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePostComment } from "@/hooks/use-post-comment";
import { type Post } from "@lens-protocol/client";
import { useAccount, useAuthenticatedUser } from "@lens-protocol/react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: string;
  comments: Post[];
  onCommentAdded: (comment: Post) => void;
}

export function CommentSection({ postId, comments, onCommentAdded }: CommentSectionProps) {
  const router = useRouter();
  const { data: authenticatedUser, loading: userLoading } = useAuthenticatedUser();

  // Only call useAccount when we have an authenticated user
  const { data: currentUserProfile, loading: profileLoading } = useAccount(
    authenticatedUser?.address ? { address: authenticatedUser.address } : { address: undefined }, // Use undefined as a fallback
  );

  const { isLoading, createComment } = usePostComment(postId);
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!authenticatedUser || !currentUserProfile) {
      toast.error("Please log in to comment");
      return;
    }

    try {
      const result = await createComment(commentText);

      if (result && typeof result === "object" && "value" in result) {
        // Use the returned comment data
        const newComment = result.value as Post;
        onCommentAdded(newComment);

        // Reset the form
        setCommentText("");
      } else {
        toast.error("Failed to post comment. Please try again.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Error posting comment. Please try again.");
    }
  };

  // Get current user's picture
  const currentUserPicture = (() => {
    if (!currentUserProfile || !currentUserProfile.metadata?.picture) return "";

    const picture = currentUserProfile.metadata.picture;

    if (typeof picture === "string") {
      return picture;
    }

    // Handle different types of picture objects
    return picture;
  })();

  // Get current user's display name
  const currentUserName = (() => {
    if (!currentUserProfile) return "";

    return (
      currentUserProfile.metadata?.name ||
      currentUserProfile.username?.value?.split("/").pop() ||
      authenticatedUser?.address.substring(0, 8) ||
      "User"
    );
  })();

  // Get current user's initial for avatar fallback
  const currentUserInitial = currentUserName ? currentUserName[0].toUpperCase() : "U";

  return (
    <div>
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <Avatar className="size-10">
            <AvatarImage src={currentUserPicture} alt={currentUserName} />
            <AvatarFallback>{currentUserInitial}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              className="w-full rounded-lg border bg-transparent p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={authenticatedUser ? "Write a comment..." : "Log in to comment"}
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!authenticatedUser || userLoading || profileLoading}
            />
            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={
                  !commentText.trim() ||
                  isLoading ||
                  !authenticatedUser ||
                  userLoading ||
                  profileLoading
                }
                isLoading={isLoading}
                className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            // Extract username without namespace
            const username =
              comment.author.username?.value?.split("/").pop() ||
              comment.author.address.substring(0, 8);

            // Get author picture
            const picture = (() => {
              const pic = comment.author.metadata?.picture;
              if (!pic) return "";
              if (typeof pic === "string") return pic;
              return pic;
            })();

            // Extract content based on metadata type
            const content = (() => {
              if (!comment.metadata) return "";

              if (comment.metadata.__typename === "TextOnlyMetadata") {
                return comment.metadata.content;
              } else if (comment.metadata.__typename === "ArticleMetadata") {
                return comment.metadata.content;
              } else if (comment.metadata.__typename === "ImageMetadata") {
                return comment.metadata.content;
              } else {
                return (comment.metadata as any)?.content || "";
              }
            })();

            // Get display name
            const displayName = comment.author.metadata?.name || username;

            return (
              <div key={comment.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Avatar
                    className="size-8 cursor-pointer"
                    onClick={() => router.push(`/u/${username}`)}
                  >
                    <AvatarImage src={picture} alt={displayName} />
                    <AvatarFallback>{(displayName[0] || "U").toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span
                        className="cursor-pointer font-semibold hover:underline"
                        onClick={() => router.push(`/u/${username}`)}
                      >
                        {displayName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <span>@{username}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(comment.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm">{content}</p>

                {/* Comment interaction buttons */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ReactionButton
                      postId={comment.id}
                      reactionCount={comment.stats?.upvotes || 0}
                      isReacted={comment.operations?.hasUpvoted || false}
                      size="sm"
                    />
                    <RepostQuoteButton
                      postId={comment.id}
                      count={(comment.stats?.reposts || 0) + (comment.stats?.quotes || 0)}
                      size="sm"
                    />
                  </div>
                  <BookmarkToggleButton
                    postId={comment.id}
                    isBookmarked={comment.operations?.hasBookmarked}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
