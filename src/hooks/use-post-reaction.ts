"use client";

import { getLensClient } from "@/lib/lens/client";
import { PostId, PostReactionType, SessionClient, postId } from "@lens-protocol/client";
import { addReaction, undoReaction } from "@lens-protocol/client/actions";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * A hook for handling post reactions (upvotes/likes) with Lens Protocol
 *
 * @param postIdValue The ID of the post to react to
 * @param initialReacted Initial reaction state (has user already reacted)
 * @param onSuccess Optional callback for when reaction succeeds
 * @returns An object with the reaction state and toggle function
 */
export function usePostReaction(
  postIdValue: string,
  initialReacted = false,
  onSuccess?: (newState: boolean) => void,
) {
  const { data: user } = useAuthenticatedUser();
  const [isReacted, setIsReacted] = useState(initialReacted);
  const [isLoading, setIsLoading] = useState(false);

  const toggleReaction = async () => {
    if (!user) {
      toast.error("You need to be logged in to react to posts");
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

      // Add or remove reaction based on current state
      if (!isReacted) {
        const result = await addReaction(sessionClient, {
          post: targetPostId,
          reaction: PostReactionType.Upvote,
        });

        if (result.isErr()) {
          toast.error("Failed to add reaction");
          console.error(result.error);
          setIsLoading(false);
          return;
        }

        setIsReacted(true);
        onSuccess?.(true);
      } else {
        const result = await undoReaction(sessionClient, {
          post: targetPostId,
          reaction: PostReactionType.Upvote,
        });

        if (result.isErr()) {
          toast.error("Failed to remove reaction");
          console.error(result.error);
          setIsLoading(false);
          return;
        }

        setIsReacted(false);
        onSuccess?.(false);
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isReacted,
    isLoading,
    toggleReaction,
  };
}
