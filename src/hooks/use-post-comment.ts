"use client";

import { getLensClient } from "@/lib/lens/client";
import { type Post, type Result, SessionClient, postId } from "@lens-protocol/client";
import { post } from "@lens-protocol/client/actions";
import { textOnly } from "@lens-protocol/metadata";
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
      toast.error("You need to be logged in to comment");
      return;
    }

    if (!content.trim()) {
      toast.error("Comment content cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      // Get the Lens client
      const client = await getLensClient();

      // If we don't have a session client, we can't perform authenticated operations
      if (!("storage" in client)) {
        toast.error("Authentication required");
        setIsLoading(false);
        return;
      }

      const sessionClient = client as SessionClient;
      const targetPostId = postId(postIdValue);

      // Create proper metadata for the comment
      const metadata = textOnly({
        content: content,
      });

      // Create the comment
      const result = await post(sessionClient, {
        contentUri: await metadata.toString(),
        commentOn: {
          post: targetPostId,
        },
      });

      if (result.isErr()) {
        toast.error("Failed to post comment");
        console.error(result.error);
        setIsLoading(false);
        return result;
      }

      toast.success("Comment posted successfully");
      onSuccess?.();

      // If the post action was successful but we can't extract the comment data,
      // create a mock comment to display immediately in the UI
      if (!result.value) {
        // Create a mock Post object that the UI can display
        const mockComment = {
          id: `mock-${Date.now()}`,
          __typename: "Post",
          metadata: {
            __typename: "TextOnlyMetadata",
            content: content,
          },
          author: user,
          timestamp: new Date().toISOString(),
          stats: { upvotes: 0, comments: 0, reposts: 0, quotes: 0 },
          operations: { hasUpvoted: false, hasBookmarked: false },
        } as unknown as Post;

        return { value: mockComment } as Result<any, any>;
      }

      return result;
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Something went wrong");

      // Even on error, create a mock comment to give feedback to the user
      if (user) {
        const mockComment = {
          id: `mock-${Date.now()}`,
          __typename: "Post",
          metadata: {
            __typename: "TextOnlyMetadata",
            content: content,
          },
          author: user,
          timestamp: new Date().toISOString(),
          stats: { upvotes: 0, comments: 0, reposts: 0, quotes: 0 },
          operations: { hasUpvoted: false, hasBookmarked: false },
        } as unknown as Post;

        return { value: mockComment } as Result<any, any>;
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createComment,
  };
}
