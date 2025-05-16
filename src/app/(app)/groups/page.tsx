"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GroupsPageClient } from "./_components/groups-page-client";

// Types
export interface Group {
  id: string;
  name: string;
  description: string;
  image?: string;
  members: number;
  isPrivate?: boolean;
}

// Minimal mock data - just two examples for UI display
const MOCK_GROUPS: Group[] = [
  {
    id: "group-1",
    name: "SaaS Believers",
    description: "Support early-stage SaaS founders and projects.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format",
    members: 156,
  },
  {
    id: "group-2",
    name: "Web3 Founders",
    description: "Early-stage Web3 startups looking for support.",
    image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=1200&auto=format",
    members: 94,
    isPrivate: true,
  },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      setIsLoading(true);
      try {
        // Simulate API fetch
        await new Promise((resolve) => setTimeout(resolve, 500));
        setGroups(MOCK_GROUPS);
      } catch (error) {
        console.error("Error loading groups:", error);
        toast.error("Failed to load groups");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroups();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <GroupsPageClient groups={groups} />;
}
