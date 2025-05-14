"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useCallback } from "react";
import { CreatorCard } from "./_components/creator-card";
import { CreatorCardSkeleton } from "./_components/creator-card-skeleton";

// Mock data
const MOCK_FEATURED_CREATORS = [
  {
    id: "creator-1",
    name: "Sarah Web3",
    username: "web3sarah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
    bio: "Web3 educator and podcast host. Helping people understand blockchain and crypto.",
    followers: 1245,
    believers: 78,
    verified: true,
    isFollowing: false,
  },
  {
    id: "creator-2",
    name: "Indie Game Studio",
    username: "gamerbuild",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    bio: "Creating the next generation of story-driven games. Building in public.",
    followers: 876,
    believers: 52,
    verified: true,
    isFollowing: false,
  },
  {
    id: "creator-3",
    name: "Digital Artist",
    username: "artcreator",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format",
    bio: "Digital NFT artist specializing in surreal landscapes and futuristic themes.",
    followers: 954,
    believers: 45,
    verified: false,
    isFollowing: true,
  },
  {
    id: "creator-4",
    name: "Tech Builder",
    username: "techbuild",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format",
    bio: "Building tools for the decentralized future. Open source advocate.",
    followers: 1154,
    believers: 62,
    verified: true,
    isFollowing: false,
  },
  {
    id: "creator-5",
    name: "Crypto Artist",
    username: "cryptoart",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format",
    bio: "Creating digital art on the blockchain. Exploring new frontiers of ownership.",
    followers: 876,
    believers: 45,
    verified: false,
    isFollowing: false,
  },
  {
    id: "creator-6",
    name: "Decentralized Finance",
    username: "defi.lens",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format",
    bio: "Exploring the world of DeFi. Teaching others how to navigate the financial revolution.",
    followers: 1587,
    believers: 92,
    verified: true,
    isFollowing: false,
  },
];

const MOCK_TRENDING_CREATORS = [...MOCK_FEATURED_CREATORS]
  .sort(() => Math.random() - 0.5)
  .slice(0, 6);

const MOCK_MUSIC_CREATORS = MOCK_FEATURED_CREATORS.filter((_, i) => i % 2 === 0);
const MOCK_TECH_CREATORS = MOCK_FEATURED_CREATORS.filter((_, i) => i % 2 === 1);

function ExploreContent({ category }: { category: string }) {
  let creators = MOCK_FEATURED_CREATORS;

  if (category === "trending") {
    creators = MOCK_TRENDING_CREATORS;
  } else if (category === "music") {
    creators = MOCK_MUSIC_CREATORS;
  } else if (category === "tech") {
    creators = MOCK_TECH_CREATORS;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {creators.map((creator) => (
        <CreatorCard key={creator.id} creator={creator} />
      ))}
    </div>
  );
}

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "featured";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Explore Creators</h1>
        <div className="flex items-center text-muted-foreground text-sm">
          <TrendingUp className="mr-1 size-4" />
          <span>Trending categories</span>
        </div>
      </div>

      <Tabs
        defaultValue={category}
        onValueChange={(value) => {
          router.push(`/explore?${createQueryString("category", value)}`);
        }}
        className="mb-8"
      >
        <TabsList className="mb-8 flex flex-wrap">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="tech">Tech</TabsTrigger>
        </TabsList>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CreatorCardSkeleton
                  key={`creator-skeleton-${i}-${Math.random().toString(36).substring(2, 9)}`}
                />
              ))}
            </div>
          }
        >
          <ExploreContent category={category} />
        </Suspense>
      </Tabs>
    </div>
  );
}
