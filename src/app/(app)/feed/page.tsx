"use client";

import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageSize, evmAddress } from "@lens-protocol/client";
import { useAuthenticatedUser, usePosts } from "@lens-protocol/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FeedSkeleton } from "./_components/feed-skeleton";
import { PostCard } from "./_components/post-card";
import { Trending } from "./_components/trending";
import { TrendingSkeleton } from "./_components/trending-skeleton";

// Still using mock data for trending section until we implement that
const MOCK_TRENDING_CREATORS = [
  {
    id: "creator-1",
    name: "Sarah Web3",
    username: "web3sarah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
    stats: {
      followers: 1245,
      believers: 78,
    },
  },
  {
    id: "creator-2",
    name: "Indie Game Studio",
    username: "gamerbuild",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    stats: {
      followers: 876,
      believers: 52,
    },
  },
  {
    id: "creator-3",
    name: "Tech Podcaster",
    username: "techpodcaster",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format",
    stats: {
      followers: 3422,
      believers: 156,
    },
  },
];

// Mock trending campaigns
const MOCK_TRENDING_CAMPAIGNS = [
  {
    id: "post-1",
    title: "New SaaS Productivity Tool",
    creator: {
      id: "creator-1",
      name: "Sarah Web3",
      username: "web3sarah",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
    },
    collectible: {
      price: "5",
      currency: "GHO",
      collected: 28,
      total: 50,
    },
  },
  {
    id: "post-2",
    title: "Story-Driven RPG Game",
    creator: {
      id: "creator-2",
      name: "Indie Game Studio",
      username: "gamerbuild",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    },
    collectible: {
      price: "10",
      currency: "GHO",
      collected: 72,
      total: 100,
    },
  },
  {
    id: "post-5",
    title: "Sound Effects Collection for Developers",
    creator: {
      id: "creator-2",
      name: "Indie Game Studio",
      username: "gamerbuild",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    },
    collectible: {
      price: "5",
      currency: "GHO",
      collected: 34,
      total: 50,
    },
  },
];

function ForYouFeed() {
  // This tab shows the most recent posts
  const { data, loading, error } = usePosts({
    pageSize: PageSize.Ten,
  });

  if (loading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="mb-3 text-muted-foreground">Failed to load feed</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="mb-3 text-muted-foreground">No posts found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.items.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function FollowingFeed() {
  const { data: user } = useAuthenticatedUser();

  // For authenticated users, we can show posts from followed accounts
  const { data, loading, error } = usePosts({
    filter: user?.address
      ? {
          // Show posts from accounts that the user follows
          authors: [evmAddress(user.address)],
        }
      : undefined,
    pageSize: PageSize.Ten,
  });

  if (loading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="mb-3 text-muted-foreground">Failed to load feed</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="mb-3 text-muted-foreground">No posts from accounts you follow</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.items.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PopularFeed() {
  // Show posts with the most recent activity
  const { data, loading, error } = usePosts({
    pageSize: PageSize.Ten,
  });

  if (loading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="mb-3 text-muted-foreground">Failed to load feed</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="mb-3 text-muted-foreground">No popular posts found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.items.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function TrendingContent() {
  // This function would fetch and display trending content from Lens API in a real app
  return <Trending creators={MOCK_TRENDING_CREATORS} campaigns={MOCK_TRENDING_CAMPAIGNS} />;
}

export default function FeedPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>(
    tabParam === "following" || tabParam === "popular" ? tabParam : "for-you",
  );

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      {/* Mobile Search - Only visible on mobile */}
      <div className="mb-6 block md:hidden">
        <SearchBar className="w-full" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {/* Main Content - Left Column (Scrollable) */}
        <div className="md:col-span-2">
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-1 mb-6 w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="for-you">For You</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs defaultValue={activeTab} value={activeTab} className="w-full md:w-auto">
            <TabsContent value="for-you">
              <Suspense fallback={<FeedSkeleton />}>
                <ForYouFeed />
              </Suspense>
            </TabsContent>
            <TabsContent value="following">
              <Suspense fallback={<FeedSkeleton />}>
                <FollowingFeed />
              </Suspense>
            </TabsContent>
            <TabsContent value="popular">
              <Suspense fallback={<FeedSkeleton />}>
                <PopularFeed />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Sticky */}
        <div className="hidden md:block">
          <div className="sticky top-16 space-y-6">
            {/* Search bar in the sidebar */}
            <div className="mt-1">
              <SearchBar className="w-full" />
            </div>

            <Suspense fallback={<TrendingSkeleton />}>
              <TrendingContent />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
