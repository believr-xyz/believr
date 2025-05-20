"use client";

import { SupportersList } from "@/components/shared/supporters-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface CollectorsListProps {
  postId: string;
  collectors?: {
    id: string;
    handle: string;
    name?: string;
    imageUrl?: string;
  }[];
}

export function CollectorsList({ postId, collectors = [] }: CollectorsListProps) {
  const { data: user } = useAuthenticatedUser();
  const router = useRouter();

  // If we have collectors, convert them to the format expected by SupportersList
  const supporters = collectors.map((collector, index) => ({
    id: collector.id,
    handle: collector.handle,
    name: collector.name || collector.handle,
    imageUrl: collector.imageUrl,
    amount: 0, // Placeholder - we don't have real data yet
    currency: "WGHO",
    rank: index + 1,
  }));

  return <SupportersList postId={postId} supporters={supporters} showComingSoon={true} />;
}
