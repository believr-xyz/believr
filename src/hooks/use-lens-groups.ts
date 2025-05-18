"use client";

import { getLensClient } from "@/lib/lens/client";
import { type Group, type Paginated, evmAddress, uri } from "@lens-protocol/client";
import {
  createGroup,
  fetchGroup,
  fetchGroupMembers,
  fetchGroups,
  joinGroup,
  leaveGroup,
} from "@lens-protocol/client/actions";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseLensGroupsResult {
  groups: Group[];
  isLoading: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  joinGroup: (groupAddress: string) => Promise<boolean>;
  leaveGroup: (groupAddress: string) => Promise<boolean>;
  createGroup: (name: string, description: string) => Promise<string | null>;
  fetchSingleGroup: (groupAddress: string) => Promise<Group | null>;
  isGroupMember: (group: Group) => boolean;
}

export function useLensGroups(initialFilter?: {
  searchQuery?: string;
}): UseLensGroupsResult {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data: user } = useAuthenticatedUser();

  // Load initial groups
  const loadGroups = useCallback(
    async (cursorValue?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const client = await getLensClient();
        const filter = initialFilter || {};

        const result = await fetchGroups(client, {
          filter: {
            searchQuery: filter.searchQuery,
          },
          cursor: cursorValue,
        });

        if (result.isErr()) {
          throw new Error(`Failed to fetch groups: ${result.error.message}`);
        }

        setHasMore(!!result.value.pageInfo.next);
        if (result.value.pageInfo.next) {
          setCursor(result.value.pageInfo.next);
        }

        if (cursorValue) {
          setGroups((prev) => [...prev, ...(result.value.items || [])]);
        } else {
          setGroups([...(result.value.items || [])]);
        }
      } catch (err) {
        console.error("Error loading groups:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("Failed to load groups");
      } finally {
        setIsLoading(false);
      }
    },
    [initialFilter],
  );

  // Load more groups when scrolling
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await loadGroups(cursor);
  }, [cursor, hasMore, isLoading, loadGroups]);

  // Join a group
  const joinGroupAction = useCallback(
    async (groupAddress: string) => {
      if (!user?.address) {
        toast.error("Please sign in to join groups");
        return false;
      }

      try {
        const client = await getLensClient();

        if (!("storage" in client)) {
          toast.error("Authentication required");
          return false;
        }

        const result = await joinGroup(client, {
          group: evmAddress(groupAddress),
        });

        if (result.isErr()) {
          console.error("Error joining group:", result.error);
          toast.error(`Failed to join group: ${result.error.message}`);
          return false;
        }

        toast.success("Successfully joined group!");
        return true;
      } catch (error) {
        console.error("Error joining group:", error);
        toast.error("Failed to join group");
        return false;
      }
    },
    [user],
  );

  // Leave a group
  const leaveGroupAction = useCallback(
    async (groupAddress: string) => {
      if (!user?.address) {
        toast.error("Please sign in to leave groups");
        return false;
      }

      try {
        const client = await getLensClient();

        if (!("storage" in client)) {
          toast.error("Authentication required");
          return false;
        }

        const result = await leaveGroup(client, {
          group: evmAddress(groupAddress),
        });

        if (result.isErr()) {
          console.error("Error leaving group:", result.error);
          toast.error(`Failed to leave group: ${result.error.message}`);
          return false;
        }

        toast.success("Successfully left group");
        return true;
      } catch (error) {
        console.error("Error leaving group:", error);
        toast.error("Failed to leave group");
        return false;
      }
    },
    [user],
  );

  // Create a new group
  const createGroupAction = useCallback(
    async (name: string, description: string) => {
      if (!user?.address) {
        toast.error("Please sign in to create groups");
        return null;
      }

      try {
        const client = await getLensClient();

        if (!("storage" in client)) {
          toast.error("Authentication required");
          return null;
        }

        // Create a simple metadata object for the group
        const metadata = {
          name,
          description,
          id: `group-${Date.now()}`,
        };

        // In a real implementation, you would upload this metadata to IPFS or use Lens storage
        // Here we're creating a fake URI for simplicity
        const metadataUri = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;

        const result = await createGroup(client, {
          metadataUri: uri(metadataUri),
        });

        if (result.isErr()) {
          console.error("Error creating group:", result.error);
          toast.error(`Failed to create group: ${result.error.message}`);
          return null;
        }

        toast.success("Successfully created group!");

        // Return the address of the newly created group
        if (result.value && typeof result.value === "object" && "group" in result.value) {
          return result.value.group as string;
        }

        return null;
      } catch (error) {
        console.error("Error creating group:", error);
        toast.error("Failed to create group");
        return null;
      }
    },
    [user],
  );

  // Fetch a single group by address
  const fetchSingleGroup = useCallback(async (groupAddress: string) => {
    try {
      const client = await getLensClient();

      const result = await fetchGroup(client, {
        group: evmAddress(groupAddress),
      });

      if (result.isErr()) {
        console.error("Error fetching group:", result.error);
        toast.error(`Failed to fetch group: ${result.error.message}`);
        return null;
      }

      return result.value;
    } catch (error) {
      console.error("Error fetching group:", error);
      toast.error("Failed to fetch group");
      return null;
    }
  }, []);

  // Check if the authenticated user is a member of a group
  const isGroupMember = useCallback(
    (group: Group) => {
      // If user is not authenticated, they are not a member
      if (!user?.address) return false;

      // Check operations field for membership status
      return group.operations?.isMember === true;
    },
    [user],
  );

  // Load groups on initial render
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  return {
    groups,
    isLoading,
    hasMore,
    error,
    loadMore,
    joinGroup: joinGroupAction,
    leaveGroup: leaveGroupAction,
    createGroup: createGroupAction,
    fetchSingleGroup,
    isGroupMember,
  };
}
