"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, Loader2 } from "lucide-react";
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
}

export function CollectCard({
  postId,
  price,
  currency,
  collected,
  total,
  creator,
  onCollect,
}: CollectCardProps) {
  const router = useRouter();
  const [isCollecting, setIsCollecting] = useState(false);
  const [hasCollected, setHasCollected] = useState(false);

  // Calculate collection progress
  const percentCollected = Math.min(100, Math.round((collected / total) * 100));

  const handleCollect = async () => {
    if (hasCollected) {
      router.push(`/u/${creator.username}`);
      return;
    }

    setIsCollecting(true);
    try {
      // This would be replaced with actual Lens collect logic in production
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate transaction

      toast.success("Successfully collected this post!");
      setHasCollected(true);

      // Notify parent component
      if (onCollect) {
        onCollect();
      }
    } catch (error) {
      console.error("Error collecting post:", error);
      toast.error("Failed to collect post. Please try again.");
    } finally {
      setIsCollecting(false);
    }
  };

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
              <span className="font-semibold">{creator.stats.followers}</span>
              <span className="ml-1 text-muted-foreground">followers</span>
            </div>
            <div>
              <span className="font-semibold">{creator.stats.believers}</span>
              <span className="ml-1 text-muted-foreground">believers</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Collect button */}
        <Button
          className="w-full bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
          onClick={handleCollect}
          disabled={isCollecting}
        >
          {isCollecting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Processing...
            </>
          ) : hasCollected ? (
            "View Creator Profile"
          ) : (
            <>
              Believe ({price} {currency})
            </>
          )}
        </Button>

        {/* Benefits */}
        <div className="mt-4">
          <h4 className="mb-2 font-medium">Benefits for believers:</h4>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Early access to content</li>
            <li>Exclusive community access</li>
            <li>Support the creator directly</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
