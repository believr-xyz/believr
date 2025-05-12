"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CreatorCardProps {
  creator: {
    id: string;
    handle: string;
    name: string;
    avatar?: string;
    bio?: string;
    followers: number;
    believers: number;
    verified?: boolean;
    isFollowing?: boolean;
  };
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(creator.isFollowing || false);
  const [isLoading, setIsLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(creator.followers);

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking button

    setIsLoading(true);
    try {
      // This would be replaced with actual Lens Protocol follow logic in production
      await new Promise((resolve) => setTimeout(resolve, 800));

      const wasFollowing = isFollowing;
      setIsFollowing(!wasFollowing);
      setFollowerCount((prev) => (wasFollowing ? prev - 1 : prev + 1));

      toast.success(wasFollowing ? "Unfollowed creator" : "Now following creator");
    } catch (error) {
      console.error("Error following creator:", error);
      toast.error("Failed to update follow status");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToProfile = () => {
    router.push(`/u/${creator.handle}`);
  };

  return (
    <Card
      className="overflow-hidden transition-shadow hover:cursor-pointer hover:shadow-md"
      onClick={navigateToProfile}
    >
      <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500" />

      <CardContent className="pt-0">
        <div className="-mt-10 mb-4 flex justify-between">
          <Avatar className="size-20 border-4 border-background">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name[0]}</AvatarFallback>
          </Avatar>

          <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            className={isFollowing ? "" : "bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"}
            onClick={handleFollow}
            isLoading={isLoading}
            spinnerSize="xs"
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>

        <div className="mb-2 flex items-center gap-1">
          <h3 className="font-semibold">{creator.name}</h3>
          {creator.verified && <BadgeCheck className="size-4 text-[#00A8FF]" />}
        </div>

        <p className="mb-2 text-muted-foreground text-sm">@{creator.handle}</p>

        {creator.bio && <p className="mb-4 line-clamp-2 text-sm">{creator.bio}</p>}

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="size-4 text-muted-foreground" />
            <span className="font-medium">{followerCount}</span>
            <span className="text-muted-foreground">followers</span>
          </div>
          <div>
            <span className="font-medium">{creator.believers}</span>
            <span className="ml-1 text-muted-foreground">believers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
