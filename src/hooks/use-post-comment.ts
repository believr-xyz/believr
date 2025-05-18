"use client";

import { getLensClient } from "@/lib/lens/client";
import { type Post, type Result, SessionClient, postId, uri } from "@lens-protocol/client";
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
      return null;
    }

    if (!content.trim()) {
      toast.error("Comment content cannot be empty");
      return null;
    }

    setIsLoading(true);

    try {
      // Get the Lens client
      const client = await getLensClient();

      // If we don't have a session client, we can't perform authenticated operations
      if (!("storage" in client)) {
        toast.error("Authentication required");
        setIsLoading(false);
        return null;
      }

      const sessionClient = client as SessionClient;
      const targetPostId = postId(postIdValue);

      // Determine if the content is already a metadata URI or needs to be converted to metadata
      let contentUri: string;

      // If content looks like a metadata URI (starts with lens://) use it directly
      if (content.startsWith("lens://")) {
        contentUri = content;
      } else if (content.startsWith("{") && content.endsWith("}")) {
        // If content is already a serialized metadata object, use it directly
        contentUri = content;
      } else {
        // Create proper metadata for the comment as text only
        const metadata = textOnly({
          content: content,
        });
        contentUri = await metadata.toString();
      }

      // Create the comment
      const result = await post(sessionClient, {
        contentUri: contentUri,
        commentOn: {
          post: targetPostId,
        },
      });

      if (result.isErr()) {
        console.error("Error posting comment:", result.error);
        toast.error(`Failed to post comment: ${result.error.message}`);
        setIsLoading(false);
        return null;
      }

      // Success!
      toast.success("Comment posted successfully");
      onSuccess?.();

      // Create a mock comment that matches the structure the UI expects
      // We need this because the Lens API doesn't return the full comment data immediately
      const mockComment: Post = {
        id: `mock-${Date.now()}`,
        __typename: "Post",
        metadata: {
          __typename: "TextOnlyMetadata", // This is a simplification, might actually be another type
          content: content,
        } as any,
        author: user,
        timestamp: new Date().toISOString(),
        stats: {
          upvotes: 0,
          comments: 0,
          reposts: 0,
          quotes: 0,
          posts: 0,
          totalUpvotes: 0,
          totalAmountOfCollects: 0,
          totalAmountOfMirrors: 0,
        },
        operations: {
          hasUpvoted: false,
          hasBookmarked: false,
          hasActed: false,
          hasReacted: false,
          canAct: true,
          canComment: true,
          canDecrypt: false,
          canMirror: true,
          hasMirrored: false,
          hasQuoted: false,
          hasCollected: false,
          canCollect: true,
          actedOn: [],
        },
        feed: { id: "" },
        root: undefined,
        commentOn: undefined,
        quoteOn: undefined,
        momoka: null,
        hashtagsMentioned: [],
        profilesMentioned: [],
        hidden: false,
      } as unknown as Post;

      return { value: mockComment } as Result<Post, any>;
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
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
