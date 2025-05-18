"use client";

import { getLensClient } from "@/lib/lens/client";
import { type AnyPost, SessionClient } from "@lens-protocol/client";
import { fetchPostBookmarks } from "@lens-protocol/client/actions";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Define the proper type for PostBookmarksRequest
interface PostBookmarksRequest {
  filter?: {
    feeds?: any[];
    metadata?: {
      mainContentFocus?: string[];
      tags?: {
        oneOf?: string[];
        all?: string[];
      };
      contentWarning?: {
        oneOf: string[];
      };
    };
  };
  pageSize?: number;
  cursor?: string;
}

interface UseBookmarksResult {
  posts: AnyPost[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch bookmarked posts from Lens Protocol API
 *
 * @param limit Number of posts to fetch per page
 * @returns Bookmarked posts and pagination controls
 */
export function useBookmarks(limit = 20): UseBookmarksResult {
  const { data: user } = useAuthenticatedUser();
  const [posts, setPosts] = useState<AnyPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const fetchBookmarks = useCallback(
    async (reset = false) => {
      if (!user) {
        setError(new Error("You need to be logged in to view bookmarks"));
        return;
      }

      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const client = await getLensClient();

        // Check if we have a session client
        if (!("storage" in client)) {
          setError(new Error("Authentication required"));
          return;
        }

        const sessionClient = client as SessionClient;

        // Properly typed request parameters
        const request: PostBookmarksRequest = {
          cursor: reset ? undefined : cursor,
          pageSize: limit,
        };

        const result = await fetchPostBookmarks(sessionClient, request);

        if (result.isErr()) {
          console.error("Bookmark fetch error:", result.error);
          setError(
            new Error(result.error.message || "Failed to fetch bookmarks. Please try again later."),
          );
          return;
        }

        const newPosts = [...result.value.items];
        if (reset) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }

        setCursor(result.value.pageInfo.next || undefined);
        setHasMore(!!result.value.pageInfo.next);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        let errorMessage = "Failed to fetch bookmarks";

        if (error instanceof Error) {
          errorMessage = error.message;
          console.error("Details:", error.stack);
        }

        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [user, cursor, isLoading, limit],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchBookmarks(false);
  }, [fetchBookmarks, hasMore, isLoading]);

  const refetch = useCallback(async () => {
    await fetchBookmarks(true);
  }, [fetchBookmarks]);

  // Initial fetch when component mounts or dependencies change
  useEffect(() => {
    if (user) {
      fetchBookmarks(true);
    }
  }, [user, fetchBookmarks]);

  return {
    posts,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
}
