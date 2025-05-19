"use client";

import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLensClient, getPublicClient } from "@/lib/lens/client";
import { AnyPost, PageSize, Post, evmAddress } from "@lens-protocol/client";
import {
  fetchPostsForYou,
  fetchPostsToExplore,
} from "@lens-protocol/client/actions";
import { useAuthenticatedUser, usePosts } from "@lens-protocol/react";
import { useTimeline } from "@lens-protocol/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FeedSkeleton } from "./_components/feed-skeleton";
import { PostCard } from "./_components/post-card";
import { PostComposer } from "./_components/post-composer";
import { type Campaign, type Creator, Trending } from "./_components/trending";
import { TrendingSkeleton } from "./_components/trending-skeleton";

function ForYouFeed() {
  const { data: user } = useAuthenticatedUser();
  const [posts, setPosts] = useState<AnyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadForYouPosts() {
      try {
        setLoading(true);
        // First try to fetch personalized posts for you if user is authenticated
        if (user?.address) {
          const client = await getLensClient();
          const result = await fetchPostsForYou(client, {
            account: evmAddress(user.address),
          });

          if (result.isOk() && result.value?.items?.length) {
            // Extract the post objects from PostForYou items
            const forYouPosts = result.value.items.map((item) => item.post);
            setPosts(forYouPosts as AnyPost[]);
            return;
          }
        }

        // Fallback to explore feed if user not logged in or no personalized posts
        const publicClient = getPublicClient();
        const exploreResult = await fetchPostsToExplore(publicClient, {});

        if (exploreResult.isOk()) {
          setPosts(exploreResult.value?.items as AnyPost[]);
        } else {
          setError(new Error(exploreResult.error.message));
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        console.error("Error fetching for-you posts:", err);
      } finally {
        setLoading(false);
      }
    }

    loadForYouPosts();
  }, [user?.address]);

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

  if (!posts.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="mb-3 text-muted-foreground">No posts found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function FollowingFeed() {
  const { data: user } = useAuthenticatedUser();

  // For authenticated users, show timeline feed (posts from followed accounts)
  const { data, loading, error } = useTimeline({
    account: user?.address ? evmAddress(user.address) : undefined,
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

  if (!data?.items?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="mb-3 text-muted-foreground">
          No posts from accounts you follow
        </p>
        <p className="text-muted-foreground text-sm">
          Follow some creators to see their posts here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.items.map((timelineItem) => (
        <PostCard key={timelineItem.primary.id} post={timelineItem.primary} />
      ))}
    </div>
  );
}

function TrendingContent() {
  // Use real Lens data instead of mock data for trending posts
  const { data, loading, error } = usePosts({
    filter: {
      metadata: {
        // Focus on posts with visual content for trending section
        mainContentFocus: ["IMAGE", "VIDEO"],
      },
    },
    pageSize: PageSize.Ten,
  });

  if (loading || error || !data?.items.length) {
    return <Trending creators={[]} campaigns={[]} />;
  }

  // Transform Lens posts directly to the component props
  const trendingPosts: Campaign[] = data.items
    .filter((post): post is Post => post.__typename === "Post")
    .slice(0, 5)
    .map((post) => {
      // Extract title from post metadata or use content snippet
      let title = "";
      if (post.metadata.__typename === "ArticleMetadata") {
        title = post.metadata.title || "Untitled Post";
      } else if (post.metadata.__typename === "TextOnlyMetadata") {
        title = post.metadata.content || "Untitled Post";
      } else if (
        post.metadata.__typename === "ImageMetadata" &&
        post.metadata.content
      ) {
        title = post.metadata.content.slice(0, 50) + "..." || "Untitled Post";
      } else if (
        post.metadata.__typename === "VideoMetadata" &&
        post.metadata.content
      ) {
        title = post.metadata.content.slice(0, 50) + "..." || "Untitled Post";
      } else if (
        post.metadata.__typename === "AudioMetadata" &&
        post.metadata.content
      ) {
        title = post.metadata.content.slice(0, 50) + "..." || "Untitled Post";
      } else {
        title = "Untitled Post";
      }

      // Extract username from profile
      const username =
        post.author.username?.value?.split("/").pop() ||
        post.author.address.substring(0, 8);

      // Extract profile picture
      let picture = "";
      if (typeof post.author.metadata?.picture === "string") {
        picture = post.author.metadata.picture;
      } else if (post.author.metadata?.picture) {
        picture = post.author.metadata.picture.item || "";
      }

      return {
        id: post.id,
        title: title,
        creator: {
          id: post.author.address,
          name: post.author.metadata?.name || username,
          username: username,
          picture: picture,
        },
        collectible: {
          price: "0",
          currency: "ETH",
          collected: post.stats.collects || 0,
          total: 100,
        },
      };
    });

  // Use just the top creators
  const topCreators: Creator[] = data.items
    .filter((post): post is Post => post.__typename === "Post")
    .slice(0, 3)
    .map((post) => {
      const author = post.author;
      const username =
        author.username?.value?.split("/").pop() ||
        author.address.substring(0, 8);

      // Extract profile picture
      let picture = "";
      if (typeof author.metadata?.picture === "string") {
        picture = author.metadata.picture;
      } else if (author.metadata?.picture) {
        picture = author.metadata.picture.item || "";
      }

      return {
        id: author.address,
        name: author.metadata?.name || username,
        username: username,
        picture: picture,
        stats: {
          followers: 0, // We don't have this data
          collects: post.stats.collects || 0,
        },
      };
    });

  return <Trending creators={topCreators} campaigns={trendingPosts} />;
}

export default function FeedPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>(
    tabParam === "following" || tabParam === "for-you" ? tabParam : "following"
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
          {/* Tabs first, at the very top */}
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6 w-full md:w-auto"
          >
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="for-you">For You</TabsTrigger>
            </TabsList>

            <TabsContent value="following">
              {/* Post Composer inside tab content */}
              <PostComposer />
              <Suspense fallback={<FeedSkeleton />}>
                <FollowingFeed />
              </Suspense>
            </TabsContent>

            <TabsContent value="for-you">
              {/* Post Composer inside tab content */}
              <PostComposer />
              <Suspense fallback={<FeedSkeleton />}>
                <ForYouFeed />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Right Column (Trending, Recommendations) */}
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
