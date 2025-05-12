"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface Collector {
  id: string;
  handle: string;
  name: string;
  avatar?: string;
  collectedAt: Date;
  verified?: boolean;
}

interface CollectorsListProps {
  collectors: Collector[];
}

export function CollectorsList({ collectors }: CollectorsListProps) {
  const router = useRouter();

  if (collectors.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No collectors yet. Be the first to collect!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {collectors.map((collector) => (
        <div key={collector.id} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <Avatar
              className="size-10 cursor-pointer"
              onClick={() => router.push(`/u/${collector.handle}`)}
            >
              <AvatarImage src={collector.avatar} alt={collector.name} />
              <AvatarFallback>{collector.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span
                  className="cursor-pointer font-semibold hover:underline"
                  onClick={() => router.push(`/u/${collector.handle}`)}
                >
                  {collector.name}
                </span>
                {collector.verified && <BadgeCheck className="size-4 text-[#00A8FF]" />}
              </div>
              <p className="text-muted-foreground text-sm">@{collector.handle}</p>
            </div>
          </div>
          <span className="text-muted-foreground text-xs">
            {formatDistanceToNow(collector.collectedAt, {
              addSuffix: true,
            })}
          </span>
        </div>
      ))}
    </div>
  );
}
