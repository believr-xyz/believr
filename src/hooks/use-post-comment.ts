"use client";

import { getLensClient } from "@/lib/lens/client";
import { SessionClient, postId, uri } from "@lens-protocol/client";
import { post } from "@lens-protocol/client/actions";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * A hook for handling post comments with Lens Protocol
 *
 * @param postIdValue The ID of the post to comment on
 * @param onSuccess Optional callback for when comment succeeds
 * @returns An object with the commenting state and function
 */
export function usePostComment(postIdValue: string, onSuccess?: () => void) {
  const { data: user } = useAuthenticatedUser();
  const [isLoading, setIsLoading] = useState(false);

  const createComment = async (content: string) => {
    if (!user) {
      toast.error("You need to be logged in to comment on posts");
      return;
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty");
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

      // First check if we can comment on this post
      const targetPostId = postId(postIdValue);

      // Create a simple text-only metadata for the comment
      // In a real app, you'd need to upload this metadata to IPFS or Lens storage service
      // For simplicity, we're using a placeholder URI - this would need to be replaced
      // with a real implementation that uploads content properly

      // The comment goes through the same post function but with commentOn field
      const result = await post(sessionClient, {
        contentUri: uri(`lens://placeholder-comment-${Date.now()}`), // Placeholder
        commentOn: {
          post: targetPostId,
        },
      });

      if (result.isErr()) {
        toast.error("Failed to comment on post");
        console.error(result.error);
        setIsLoading(false);
        return;
      }

      toast.success("Comment added successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Error commenting on post:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createComment,
  };
}
