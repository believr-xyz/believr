"use client";

import { getLensClient } from "@/lib/lens/client";
import { evmAddress } from "@lens-protocol/client";
import { fetchFollowers, fetchFollowing } from "@lens-protocol/client/actions";
import { useCallback, useEffect, useState } from "react";

interface UseFollowersProps {
  accountAddress?: string;
  pageSize?: number;
}

interface FollowerItem {
  address: string;
  handle: string;
  picture?: string;
  name?: string;
  timestamp: string;
}

interface FollowData {
  total: number;
  items: FollowerItem[];
}

interface UseFollowersResult {
  followers: FollowData;
  following: FollowData;
  isLoadingFollowers: boolean;
  isLoadingFollowing: boolean;
  fetchMoreFollowers: () => Promise<void>;
  fetchMoreFollowing: () => Promise<void>;
  error: Error | null;
}

/**
 * Hook to fetch followers and following for a user profile
 *
 * @param accountAddress - The address of the account to fetch followers/following for
 * @param pageSize - The number of items to fetch per page (default: 10)
 * @returns Followers and following data with pagination controls
 */
export function useFollowers({
  accountAddress,
  pageSize = 10,
}: UseFollowersProps): UseFollowersResult {
  const [followers, setFollowers] = useState<FollowData>({
    total: 0,
    items: [],
  });
  const [following, setFollowing] = useState<FollowData>({
    total: 0,
    items: [],
  });
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [followersCursor, setFollowersCursor] = useState<string | undefined>(undefined);
  const [followingCursor, setFollowingCursor] = useState<string | undefined>(undefined);

  // Function to load followers
  const loadFollowers = useCallback(
    async (cursor?: string) => {
      if (!accountAddress) return;

      setIsLoadingFollowers(true);
      try {
        const client = await getLensClient();

        // Use a dynamic object for the request params to avoid type conflicts
        const requestParams: any = {
          account: evmAddress(accountAddress),
          pageSize,
        };

        if (cursor) {
          requestParams.cursor = cursor;
        }

        const result = await fetchFollowers(client, requestParams);

        if (result.isErr()) {
          throw new Error(`Failed to fetch followers: ${result.error.message}`);
        }

        // Map the results to a simpler format
        const followerItems = result.value.items.map((follower: any) => ({
          address: follower.follower.address,
          handle: follower.follower.username?.value || follower.follower.address.slice(0, 8),
          picture:
            typeof follower.follower.metadata?.picture === "string"
              ? follower.follower.metadata.picture
              : follower.follower.metadata?.picture?.optimized?.uri || "",
          name: follower.follower.metadata?.name || "",
          timestamp: follower.followedOn,
        }));

        // Update the followers state
        setFollowers((prev) => ({
          // Use any available count property, fallback to items length
          total: prev.total || followerItems.length,
          items: cursor ? [...prev.items, ...followerItems] : followerItems,
        }));

        // Safely handle the cursor
        const nextCursor = result.value.pageInfo?.next;
        if (typeof nextCursor === "string") {
          setFollowersCursor(nextCursor);
        } else {
          setFollowersCursor(undefined);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
        setError(error as Error);
      } finally {
        setIsLoadingFollowers(false);
      }
    },
    [accountAddress, pageSize],
  );

  // Function to load following
  const loadFollowing = useCallback(
    async (cursor?: string) => {
      if (!accountAddress) return;

      setIsLoadingFollowing(true);
      try {
        const client = await getLensClient();

        // Use a dynamic object for the request params to avoid type conflicts
        const requestParams: any = {
          account: evmAddress(accountAddress),
          pageSize,
        };

        if (cursor) {
          requestParams.cursor = cursor;
        }

        const result = await fetchFollowing(client, requestParams);

        if (result.isErr()) {
          throw new Error(`Failed to fetch following: ${result.error.message}`);
        }

        // Map the results to a simpler format
        const followingItems = result.value.items.map((follow: any) => ({
          address: follow.following.address,
          handle: follow.following.username?.value || follow.following.address.slice(0, 8),
          picture:
            typeof follow.following.metadata?.picture === "string"
              ? follow.following.metadata.picture
              : follow.following.metadata?.picture?.optimized?.uri || "",
          name: follow.following.metadata?.name || "",
          timestamp: follow.followedOn,
        }));

        // Update the following state
        setFollowing((prev) => ({
          // Use any available count property, fallback to items length
          total: prev.total || followingItems.length,
          items: cursor ? [...prev.items, ...followingItems] : followingItems,
        }));

        // Safely handle the cursor
        const nextCursor = result.value.pageInfo?.next;
        if (typeof nextCursor === "string") {
          setFollowingCursor(nextCursor);
        } else {
          setFollowingCursor(undefined);
        }
      } catch (error) {
        console.error("Error fetching following:", error);
        setError(error as Error);
      } finally {
        setIsLoadingFollowing(false);
      }
    },
    [accountAddress, pageSize],
  );

  // Function to fetch more followers (pagination)
  const fetchMoreFollowers = useCallback(async () => {
    if (followersCursor && !isLoadingFollowers) {
      await loadFollowers(followersCursor);
    }
  }, [followersCursor, isLoadingFollowers, loadFollowers]);

  // Function to fetch more following (pagination)
  const fetchMoreFollowing = useCallback(async () => {
    if (followingCursor && !isLoadingFollowing) {
      await loadFollowing(followingCursor);
    }
  }, [followingCursor, isLoadingFollowing, loadFollowing]);

  // Load initial data when accountAddress changes
  useEffect(() => {
    if (accountAddress) {
      loadFollowers();
      loadFollowing();
    }
  }, [accountAddress, loadFollowers, loadFollowing]);

  return {
    followers,
    following,
    isLoadingFollowers,
    isLoadingFollowing,
    fetchMoreFollowers,
    fetchMoreFollowing,
    error,
  };
}
