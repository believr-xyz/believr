"use client";

import { PostCard } from "@/app/(app)/feed/_components/post-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  image?: string;
  collectible?: {
    price: string;
    currency: string;
    collected: number;
    total: number;
  };
  creator: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
  };
}

interface CollectedPostsProps {
  username: string;
  isOwnProfile?: boolean;
}

export function CollectedPosts({ username, isOwnProfile = false }: CollectedPostsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasError, setHasError] = useState(false);

  // Simulate fetching collected posts - in a real app this would call a Lens API
  // to get the posts collected by this user
  useState(() => {
    setIsLoading(true);

    // Mock implementation - in real app we'd call Lens API here
    setTimeout(() => {
      try {
        // Test data - in real implementation this would be populated from Lens API call
        if (username === "gamerbuild") {
          // Some mock data for our demo user
          setPosts([
            {
              id: "post-1",
              content: "New SaaS Productivity Tool - early believers get lifetime access!",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
              collectible: {
                price: "5",
                currency: "GHO",
                collected: 28,
                total: 50,
              },
              creator: {
                id: "creator-1",
                username: "web3sarah",
                name: "Sarah Web3",
                avatar:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
              },
            },
          ]);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error("Error fetching collected posts:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    );
  }

  if (hasError) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-center">
        <AlertCircleIcon className="mb-2 size-12 text-muted-foreground" />
        <h3 className="mb-1 font-semibold text-xl">Something went wrong</h3>
        <p className="mb-4 text-muted-foreground">
          We couldn't load the collected posts. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-center">
        <h3 className="mb-1 font-semibold text-xl">
          {isOwnProfile
            ? "You haven't collected any posts yet"
            : `${username} hasn't collected any posts yet`}
        </h3>
        <p className="mb-4 text-muted-foreground">
          {isOwnProfile
            ? "Explore the feed to find creators to support"
            : "Check back later to see what they've collected"}
        </p>
        {isOwnProfile && (
          <Button className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90" asChild>
            <a href="/feed">Explore Feed</a>
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
