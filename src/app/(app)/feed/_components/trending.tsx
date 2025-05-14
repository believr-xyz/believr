"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  stats: {
    followers: number;
    believers: number;
  };
}

interface Campaign {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  collectible: {
    price: string;
    currency: string;
    collected: number;
    total: number;
  };
}

interface TrendingProps {
  creators?: Creator[];
  campaigns?: Campaign[];
}

export function Trending({ creators = [], campaigns = [] }: TrendingProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Trending Creators */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Trending Creators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {creators.length === 0 ? (
            <p className="py-2 text-center text-muted-foreground text-sm">
              No trending creators yet
            </p>
          ) : (
            creators.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between">
                <div
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() => router.push(`/u/${creator.username}`)}
                >
                  <Avatar className="size-10">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>{creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{creator.name}</h4>
                    <p className="text-muted-foreground text-xs">@{creator.username}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/u/${creator.username}`)}
                >
                  Follow
                </Button>
              </div>
            ))
          )}

          {creators.length > 0 && (
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => router.push("/explore")}
            >
              View more
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Trending Campaigns */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Hot Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaigns.length === 0 ? (
            <p className="py-2 text-center text-muted-foreground text-sm">
              No active campaigns yet
            </p>
          ) : (
            campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="cursor-pointer space-y-2 rounded-lg p-2 hover:bg-muted/50"
                onClick={() => router.push(`/posts/${campaign.creator.username}/${campaign.id}`)}
              >
                <h4 className="font-semibold">{campaign.title}</h4>
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage src={campaign.creator.avatar} alt={campaign.creator.name} />
                    <AvatarFallback>{campaign.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{campaign.creator.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>
                    {campaign.collectible.price} {campaign.collectible.currency}
                  </span>
                  <span className="text-muted-foreground">
                    {campaign.collectible.collected} / {campaign.collectible.total}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-[#00A8FF]"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (campaign.collectible.collected / campaign.collectible.total) * 100,
                        ),
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}

          {campaigns.length > 0 && (
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => router.push("/explore")}
            >
              Discover more
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
