"use client";

import { getLensClient } from "@/lib/lens/client";
import { type Result, evmAddress } from "@lens-protocol/client";
import {
  fetchFollowStatus,
  follow,
  unfollow,
} from "@lens-protocol/client/actions";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseFollowResult {
  follow: (accountAddress: string) => Promise<Result<boolean, Error>>;
  unfollow: (accountAddress: string) => Promise<Result<boolean, Error>>;
  checkFollowStatus: (accountAddress: string) => Promise<boolean>;
  isLoading: boolean;
}

/**
 * Hook for handling follow/unfollow operations with Lens Protocol
 *
 * @returns Follow-related operations and status
 */
export function useFollow(): UseFollowResult {
  const { data: user } = useAuthenticatedUser();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Follow an account
   *
   * @param accountAddress - The address of the account to follow
   * @returns A result indicating success or failure
   */
  const followAccount = useCallback(
    async (accountAddress: string) => {
      if (!user?.address) {
        toast.error("Please sign in to follow users");
        return {
          isErr: () => true,
          error: new Error("Not authenticated"),
        } as Result<boolean, Error>;
      }

      setIsLoading(true);
      try {
        // Get the Lens client
        const client = await getLensClient();

        // If we don't have a session client, we can't perform authenticated operations
        if (!("storage" in client)) {
          toast.error("Authentication required");
          setIsLoading(false);
          return {
            isErr: () => true,
            error: new Error("Not authenticated"),
          } as Result<boolean, Error>;
        }

        // Follow the target account
        const targetAddress = evmAddress(accountAddress);
        const result = await follow(client, {
          account: targetAddress,
        });

        if (result.isErr()) {
          console.error("Error following account:", result.error);
          throw new Error(`Failed to follow account: ${result.error.message}`);
        }

        return { isOk: () => true, value: true } as Result<boolean, Error>;
      } catch (error) {
        console.error("Error following account:", error);
        return { isErr: () => true, error: error as Error } as Result<
          boolean,
          Error
        >;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  /**
   * Unfollow an account
   *
   * @param accountAddress - The address of the account to unfollow
   * @returns A result indicating success or failure
   */
  const unfollowAccount = useCallback(
    async (accountAddress: string) => {
      if (!user?.address) {
        toast.error("Please sign in to unfollow users");
        return {
          isErr: () => true,
          error: new Error("Not authenticated"),
        } as Result<boolean, Error>;
      }

      setIsLoading(true);
      try {
        // Get the Lens client
        const client = await getLensClient();

        // If we don't have a session client, we can't perform authenticated operations
        if (!("storage" in client)) {
          toast.error("Authentication required");
          setIsLoading(false);
          return {
            isErr: () => true,
            error: new Error("Not authenticated"),
          } as Result<boolean, Error>;
        }

        // Unfollow the target account
        const targetAddress = evmAddress(accountAddress);
        const result = await unfollow(client, {
          account: targetAddress,
        });

        if (result.isErr()) {
          console.error("Error unfollowing account:", result.error);
          throw new Error(
            `Failed to unfollow account: ${result.error.message}`
          );
        }

        return { isOk: () => true, value: true } as Result<boolean, Error>;
      } catch (error) {
        console.error("Error unfollowing account:", error);
        return { isErr: () => true, error: error as Error } as Result<
          boolean,
          Error
        >;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  /**
   * Check if the current user is following a specific account
   *
   * @param accountAddress - The address of the account to check
   * @returns Boolean indicating if the user is following the account
   */
  const checkFollowStatus = useCallback(
    async (accountAddress: string) => {
      if (!user?.address) {
        return false;
      }

      try {
        // Get the Lens client
        const client = await getLensClient();

        // Check follow status
        const result = await fetchFollowStatus(client, {
          pairs: [
            {
              account: evmAddress(accountAddress),
              follower: evmAddress(user.address),
            },
          ],
        });

        if (result.isErr()) {
          console.error("Error checking follow status:", result.error);
          return false;
        }

        // Return isFollowing status
        return (
          result.value.length > 0 && result.value[0].isFollowing.optimistic
        );
      } catch (error) {
        console.error("Error checking follow status:", error);
        return false;
      }
    },
    [user]
  );

  return {
    follow: followAccount,
    unfollow: unfollowAccount,
    checkFollowStatus,
    isLoading,
  };
}
