"use client";

import { getLensClient } from "@/lib/lens/client";
import { type AnyPost, SessionClient } from "@lens-protocol/client";
import { fetchPostBookmarks } from "@lens-protocol/client/actions";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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
export function useBookmarks(limit: number = 20): UseBookmarksResult {
  const { data: user } = useAuthenticatedUser();
  const [posts, setPosts] = useState<AnyPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const fetchBookmarks = useCallback(
    async (reset: boolean = false) => {
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

        // Base request parameters
        const request: any = {
          cursor: reset ? undefined : cursor,
          limit,
        };

        const result = await fetchPostBookmarks(sessionClient, request);

        if (result.isErr()) {
          setError(new Error(result.error.message));
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
        setError(
          error instanceof Error
            ? error
            : new Error("Failed to fetch bookmarks")
        );
      } finally {
        setIsLoading(false);
      }
    },
    [user, cursor, isLoading, limit]
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
