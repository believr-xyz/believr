"use client";

import { Button } from "@/components/ui/button";
import { useLensGroups } from "@/hooks/use-lens-groups";
import { Group } from "@lens-protocol/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GroupPageClient } from "./_components/group-page-client";

export default function GroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;
  const { fetchSingleGroup } = useLensGroups();

  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGroup = async () => {
      setIsLoading(true);
      try {
        const lensGroup = await fetchSingleGroup(groupId);

        if (lensGroup) {
          setGroup(lensGroup);
        } else {
          throw new Error("Group not found");
        }
      } catch (error) {
        console.error("Error loading group:", error);
        toast.error("Failed to load group details");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroup();
  }, [groupId, fetchSingleGroup]);

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex h-80 flex-col items-center justify-center text-center">
        <h2 className="mb-2 font-semibold text-xl">Group not found</h2>
        <p className="mb-4 text-muted-foreground">
          The group you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/groups")}>Back to Groups</Button>
      </div>
    );
  }

  return <GroupPageClient group={group} />;
}
