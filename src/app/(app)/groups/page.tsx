"use client";

import { useLensGroups } from "@/hooks/use-lens-groups";
import { GroupsPageClient } from "./_components/groups-page-client";

export default function GroupsPage() {
  const { groups, isLoading, error } = useLensGroups();

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <GroupsPageClient groups={groups} />;
}
