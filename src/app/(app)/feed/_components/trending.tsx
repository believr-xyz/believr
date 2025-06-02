"use client";

import { FollowButton } from "@/components/shared/follow-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Post } from "@lens-protocol/client";
import { ArrowUpRight, TrendUp } from "@phosphor-icons/react";
import Link from "next/link";
import { PostCard } from "./post-card";

export interface Creator {
  id: string;
  name: string;
  username: string;
  picture: string;
  stats: {
    followers: number;
    collects: number;
  };
}

export interface Campaign {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
    username: string;
    picture: string;
  };
  collectible: {
    price: string;
    currency: string;
    collected: number;
    total: number;
  };
}

interface TrendingProps {
  creators: Creator[];
  campaigns: (Campaign & { post?: Post })[];
}

export function Trending({ creators, campaigns }: TrendingProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <TrendUp className="mr-2 size-4" weight="bold" />
            Featured Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-4">
          <div className="space-y-2">
            {campaigns.length === 0 ? (
              <div className="py-2 text-center text-muted-foreground text-sm">
                No trending campaigns to display
              </div>
            ) : (
              campaigns.map((campaign) => {
                if (!campaign.post) return null;
                const username = campaign.creator.username;
                const profilePic = campaign.creator.picture;
                const displayName = campaign.creator.name;
                const date = campaign.post.timestamp
                  ? new Date(campaign.post.timestamp).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : "";
                // Use content or title for summary
                let summary = "";
                if (campaign.post.metadata?.__typename === "TextOnlyMetadata") {
                  summary = campaign.post.metadata.content || "";
                } else if (campaign.post.metadata?.__typename === "ArticleMetadata") {
                  summary = campaign.post.metadata.title || "";
                } else if (campaign.post.metadata?.__typename === "ImageMetadata") {
                  summary = campaign.post.metadata.content || "";
                } else if (campaign.post.metadata?.__typename === "VideoMetadata") {
                  summary = campaign.post.metadata.content || "";
                } else if (campaign.post.metadata?.__typename === "AudioMetadata") {
                  summary = campaign.post.metadata.content || "";
                }
                return (
                  <div
                    key={campaign.id}
                    className="flex cursor-pointer flex-col gap-1 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
                    onClick={() => {
                      window.location.href = `/posts/${username}/${campaign.id}`;
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7 border">
                        <AvatarImage src={profilePic} alt={displayName} />
                        <AvatarFallback>{displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-semibold text-[14px]">@{username}</span>
                        <span className="text-muted-foreground text-xs">{date}</span>
                      </div>
                    </div>
                    <div className="truncate text-foreground/90 text-sm">
                      {summary.length > 40 ? summary.slice(0, 40) + "…" : summary}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-muted-foreground text-xs">
                      <span>
                        {campaign.collectible.collected} of {campaign.collectible.total} collected
                      </span>
                      <span>
                        {campaign.collectible.price} {campaign.collectible.currency}
                      </span>
                    </div>
                    <div className="mt-1 h-1 w-full rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-1 rounded-full",
                          campaign.collectible.collected >= campaign.collectible.total
                            ? "bg-green-500"
                            : "bg-primary",
                        )}
                        style={{
                          width: `${Math.min(
                            100,
                            (campaign.collectible.collected / campaign.collectible.total) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <TrendUp className="mr-2 size-4" weight="bold" />
            Discover Creators
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-4">
          <div className="space-y-4">
            {creators.length === 0 ? (
              <div className="py-2 text-center text-muted-foreground text-sm">
                No trending creators to display
              </div>
            ) : (
              creators.map((creator) => (
                <div key={creator.id} className="flex items-center gap-3">
                  <Link href={`/u/${creator.username}`} className="flex flex-1 items-center gap-3">
                    <Avatar className="size-9 border">
                      <AvatarImage src={creator.picture} alt={creator.name} />
                      <AvatarFallback>{creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 truncate">
                      <div className="flex items-center gap-1 truncate">
                        <span className="truncate font-medium">{creator.name}</span>
                      </div>
                      <div className="flex text-muted-foreground">
                        <span className="font-semibold text-[14px]">@{creator.username}</span>
                      </div>
                    </div>
                  </Link>
                  <FollowButton
                    userId={creator.id}
                    username={creator.username}
                    variant="outline"
                    size="sm"
                    showText={true}
                    rounded={true}
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
