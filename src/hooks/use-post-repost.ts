"use client";

import { getLensClient } from "@/lib/lens/client";
import { SessionClient, postId } from "@lens-protocol/client";
import { repost } from "@lens-protocol/client/actions";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * A hook for handling post reposts with Lens Protocol
 *
 * @param postIdValue The ID of the post to repost
 * @param onSuccess Optional callback for when repost succeeds
 * @returns An object with the reposting state and function
 */
export function usePostRepost(postIdValue: string, onSuccess?: () => void) {
  const { data: user } = useAuthenticatedUser();
  const [isLoading, setIsLoading] = useState(false);

  const createRepost = async () => {
    if (!user) {
      toast.error("You need to be logged in to repost");
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

      // First we should check if the current user can repost this post
      // by checking post.operations.canRepost, but for simplicity we'll
      // proceed directly to the repost action

      const result = await repost(sessionClient, {
        post: targetPostId,
      });

      if (result.isErr()) {
        toast.error("Failed to repost");
        console.error(result.error);
        setIsLoading(false);
        return;
      }

      toast.success("Post reposted successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Error reposting:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createRepost,
  };
}
