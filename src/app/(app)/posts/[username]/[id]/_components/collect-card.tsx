"use client";

import { BelieveButton } from "@/components/shared/believe-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Collector {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  collectedAt: Date;
  verified?: boolean;
}

interface CreatorInfo {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  stats: {
    followers: number;
    believers: number;
  };
}

interface CollectCardProps {
  postId: string;
  price: string;
  currency: string;
  collected: number;
  total: number;
  creator: CreatorInfo;
  onCollect?: () => void;
  benefits?: string;
}

export function CollectCard({
  postId,
  price,
  currency,
  collected,
  total,
  creator,
  onCollect,
  benefits,
}: CollectCardProps) {
  const router = useRouter();
  const [hasCollected, setHasCollected] = useState(false);

  // Calculate collection progress
  const percentCollected = Math.min(100, Math.round((collected / total) * 100));

  const handleCollectStateChange = (isBelieved: boolean) => {
    setHasCollected(isBelieved);

    // Notify parent component
    if (onCollect && isBelieved) {
      onCollect();
    }
  };

  // Parse benefits string into array of benefits
  const benefitsList = benefits
    ? benefits.split(/[\n\r]+/).filter((benefit) => benefit.trim().length > 0)
    : ["Early access to content", "Exclusive community access", "Support the creator directly"];

  return (
    <Card className="sticky top-24">
      <CardContent className="p-4">
        <h3 className="mb-4 font-semibold text-lg">Collect This Post</h3>

        {/* Collection progress */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="outline" className="bg-background">
              <span className="font-medium text-primary">
                {price} {currency}
              </span>
            </Badge>
            <span className="text-muted-foreground text-sm">
              {collected} / {total} collected
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-[#00A8FF]" style={{ width: `${percentCollected}%` }} />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Creator info */}
        <div className="mb-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => router.push(`/u/${creator.username}`)}
          >
            <Avatar className="size-8">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <p className="font-semibold">{creator.name}</p>
                {creator.verified && <BadgeCheck className="size-3 text-[#00A8FF]" />}
              </div>
              <p className="text-muted-foreground text-xs">@{creator.username}</p>
            </div>
          </div>

          {creator.bio && <p className="mt-2 text-sm">{creator.bio}</p>}

          <div className="mt-2 flex gap-4 text-xs">
            <div>
              <span className="font-semibold">{creator.stats.believers}</span>
              <span className="ml-1 text-muted-foreground">believers</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Collect button */}
        <BelieveButton
          postId={postId}
          creatorUsername={creator.username}
          isBelieved={hasCollected}
          price={price}
          currency={currency}
          className="w-full"
          onBelieveChange={handleCollectStateChange}
        />

        {/* Benefits */}
        <div className="mt-4">
          <h4 className="mb-2 font-medium">Benefits for believers:</h4>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            {benefitsList.map((benefit, index) => (
              <li key={`benefit-${benefit.substring(0, 10)}-${index}`}>{benefit.trim()}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
