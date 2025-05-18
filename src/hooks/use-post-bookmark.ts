"use client";

import { getLensClient } from "@/lib/lens/client";
import { SessionClient, postId } from "@lens-protocol/client";
import { bookmarkPost, undoBookmarkPost } from "@lens-protocol/client/actions";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * A hook for handling post bookmarks with Lens Protocol
 *
 * @param postIdValue The ID of the post to bookmark
 * @param initialBookmarked Initial bookmark state
 * @param onRemove Optional callback for when bookmark is removed
 * @returns An object with the bookmark state and toggle function
 */
export function usePostBookmark(
  postIdValue: string,
  initialBookmarked = false,
  onRemove?: () => void,
) {
  const { data: user } = useAuthenticatedUser();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const toggleBookmark = async () => {
    if (!user) {
      toast.error("You need to be logged in to bookmark posts");
      return;
    }

    setIsLoading(true);

    try {
      // Get the Lens client (async function)
      const client = await getLensClient();

      // If we don't have a session client, we can't perform authenticated operations
      if (!("storage" in client)) {
        toast.error("Authentication required");
        setIsLoading(false);
        return;
      }

      // Now we know this is a SessionClient
      const sessionClient = client as SessionClient;
      const targetPostId = postId(postIdValue);

      // Add or remove bookmark based on current state
      if (!isBookmarked) {
        const result = await bookmarkPost(sessionClient, {
          post: targetPostId,
        });

        if (result.isErr()) {
          toast.error("Failed to bookmark post");
          console.error(result.error);
          setIsLoading(false);
          return;
        }

        setIsBookmarked(true);
        toast.success("Post bookmarked");
      } else {
        const result = await undoBookmarkPost(sessionClient, {
          post: targetPostId,
        });

        if (result.isErr()) {
          toast.error("Failed to remove bookmark");
          console.error(result.error);
          setIsLoading(false);
          return;
        }

        setIsBookmarked(false);
        toast.success("Bookmark removed");

        if (onRemove) {
          onRemove();
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
  };
}
