"use client";

import { BookmarkToggleButton } from "@/components/shared/bookmark-toggle-button";
import { ReactionButton } from "@/components/shared/reaction-button";
import { RepostQuoteButton } from "@/components/shared/repost-quote-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePostComment } from "@/hooks/use-post-comment";
import { getLensClient } from "@/lib/lens/client";
import { storageClient } from "@/lib/lens/storage-client";
import { type Post, type Result } from "@lens-protocol/client";
import { MediaImageMimeType, image } from "@lens-protocol/metadata";
import { useAccount, useAuthenticatedUser } from "@lens-protocol/react";
import { formatDistanceToNow } from "date-fns";
import { ImageIcon, SmileIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: string;
  comments: Post[];
  onCommentAdded: (comment: Post) => void;
}

export function CommentSection({ postId, comments, onCommentAdded }: CommentSectionProps) {
  const router = useRouter();
  const { data: authenticatedUser, loading: userLoading } = useAuthenticatedUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only call useAccount when we have an authenticated user
  const { data: currentUserProfile, loading: profileLoading } = useAccount(
    authenticatedUser?.address ? { address: authenticatedUser.address } : { address: undefined }, // Use undefined as a fallback
  );

  const { isLoading, createComment } = usePostComment(postId);
  const [commentText, setCommentText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() && !imageFile) return;

    if (!authenticatedUser || !currentUserProfile) {
      toast.error("Please log in to comment");
      return;
    }

    try {
      let result: Result<Post, any> | null;

      if (imageFile) {
        // Upload the image to storage
        const imageResponse = await storageClient.uploadFile(imageFile);

        // Create image metadata
        const metadata = image({
          content: commentText.trim(),
          image: {
            item: imageResponse.uri,
            type: imageFile.type as MediaImageMimeType,
          },
        });

        // Convert metadata to string and pass to createComment
        const metadataString = await metadata.toString();
        result = await createComment(metadataString);
      } else {
        // Create text-only comment
        result = await createComment(commentText);
      }

      if (result && typeof result === "object" && "value" in result) {
        // Use the returned comment data
        const newComment = result.value as Post;
        onCommentAdded(newComment);

        // Reset the form
        setCommentText("");
        setImageFile(null);
        setImagePreview(null);
      } else {
        toast.error("Failed to post comment. Please try again.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Error posting comment. Please try again.");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };

  // Common emojis for quick selection
  const commonEmojis = ["😊", "👍", "🔥", "❤️", "😂", "🎉", "✨", "🙏", "🤔", "😎"];

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
            <div className="relative">
              <textarea
                className="w-full rounded-lg border bg-transparent p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={authenticatedUser ? "Write a comment..." : "Log in to comment"}
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!authenticatedUser || userLoading || profileLoading}
              />

              {/* Image preview */}
              {imagePreview && (
                <div className="relative mt-2">
                  {imagePreview && (
                    <div className="relative h-20">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        className="rounded-md object-contain"
                        fill
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 rounded-full bg-black/50 p-1 text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                {/* Image upload button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                  disabled={!authenticatedUser || userLoading || profileLoading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  disabled={!authenticatedUser || userLoading || profileLoading}
                >
                  <ImageIcon className="size-4" />
                </button>

                {/* Emoji selector */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      disabled={!authenticatedUser || userLoading || profileLoading}
                    >
                      <SmileIcon className="size-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="end">
                    <div className="grid grid-cols-5 gap-2">
                      {commonEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => addEmoji(emoji)}
                          className="rounded-md p-1.5 text-lg hover:bg-muted"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={
                  (!commentText.trim() && !imageFile) ||
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

            // Get image if it's an image post
            const imageUrl = (() => {
              if (comment.metadata?.__typename === "ImageMetadata" && comment.metadata.image) {
                return typeof comment.metadata.image === "string"
                  ? comment.metadata.image
                  : comment.metadata.image.item || "";
              }
              return "";
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

                {/* Display image if present */}
                {imageUrl && (
                  <div className="relative mt-2 h-64 w-full">
                    <Image
                      src={imageUrl}
                      alt="Comment"
                      className="rounded-md object-contain"
                      fill
                    />
                  </div>
                )}

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
