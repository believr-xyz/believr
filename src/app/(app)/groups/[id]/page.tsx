"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GroupPageClient } from "./_components/group-page-client";

// Types
export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  image?: string;
  creator: {
    handle: string;
    avatar?: string;
  };
  posts: Array<{
    id: string;
    content: string;
    createdAt: Date;
    image?: string;
    creator: {
      id: string;
      handle: string;
      name: string;
      avatar?: string;
    };
  }>;
  isMember: boolean;
}

// Single mock group for UI display
const MOCK_GROUP: Group = {
  id: "group-1",
  name: "SaaS Believers",
  description:
    "A community for believers in SaaS startups and projects. We focus on supporting early-stage SaaS founders.",
  members: 156,
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format",
  creator: {
    handle: "web3sarah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format",
  },
  posts: [
    {
      id: "post-1",
      content: "New SaaS Productivity Tool - early believers get lifetime access!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      creator: {
        id: "creator-1",
        handle: "web3sarah",
        name: "Sarah Web3",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
      },
    },
  ],
  isMember: false,
};

export default function GroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGroup = async () => {
      setIsLoading(true);
      try {
        // Simulate API fetch
        await new Promise((resolve) => setTimeout(resolve, 500));
        setGroup(MOCK_GROUP);
      } catch (error) {
        console.error("Error loading group:", error);
        toast.error("Failed to load group details");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroup();
  }, [groupId]);

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
