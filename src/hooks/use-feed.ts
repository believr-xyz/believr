"use client";

import { Creator, Post } from "@/types/post";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useEffect, useState } from "react";

interface UseFeedOptions {
  limit?: number;
}

type FeedType = "global" | "following" | "trending" | "community";

export function useFeed(feedType: FeedType = "global", options: UseFeedOptions = {}) {
  const { data: user } = useAuthenticatedUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // For MVP, we're using mock data
  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This would actually call the Lens API in production
        // For MVP, we're simulating the API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock creators
        const creators: Record<string, Creator> = {
          creator1: {
            id: "creator-1",
            handle: "web3sarah",
            name: "Sarah Web3",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
            stats: {
              followers: 1254,
              believers: 89,
            },
          },
          creator2: {
            id: "creator-2",
            handle: "gamerbuild",
            name: "Indie Game Studio",
            avatar:
              "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
            verified: true,
            stats: {
              followers: 876,
              believers: 52,
            },
          },
        };

        // Mock feed data based on feedType
        let mockPosts: Post[] = [];

        if (feedType === "global") {
          mockPosts = [
            {
              id: "post-1",
              title: "New SaaS Productivity Tool",
              content: "New SaaS Productivity Tool - early believers get lifetime access!",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
              collectible: {
                price: "5",
                currency: "GHO",
                collected: 28,
                total: 50,
              },
              creator: creators.creator1,
              benefits: [
                {
                  type: "access",
                  title: "Lifetime Access",
                  description: "Get lifetime access to the premium tier",
                },
                {
                  type: "revenue",
                  title: "Revenue Share",
                  description: "5% of future revenue shared among believers",
                  percentage: 5,
                },
              ],
            },
            {
              id: "post-2",
              title: "New Story-Driven RPG Game",
              content:
                "New Story-Driven RPG Game - early believers get alpha access and in-game recognition!",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
              image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format",
              collectible: {
                price: "10",
                currency: "GHO",
                collected: 72,
                total: 100,
              },
              creator: creators.creator2,
              benefits: [
                {
                  type: "access",
                  title: "Alpha Access",
                  description: "Exclusive early access to alpha builds",
                },
                {
                  type: "recognition",
                  title: "In-game Credit",
                  description: "Your name in the game credits as an 'Early Believer'",
                },
              ],
            },
          ];
        } else if (feedType === "trending") {
          mockPosts = [
            {
              id: "post-3",
              title: "AI-Powered Design Tool",
              content:
                "Launching a revolutionary AI design tool that transforms sketches into production-ready assets!",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
              image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&auto=format",
              collectible: {
                price: "15",
                currency: "GHO",
                collected: 93,
                total: 100,
              },
              creator: creators.creator1,
              benefits: [
                {
                  type: "exclusive",
                  title: "Exclusive Features",
                  description: "Access to exclusive AI features not available in public release",
                },
              ],
            },
          ];
        } else if (feedType === "following" && user) {
          mockPosts = [
            {
              id: "post-4",
              title: "New Podcast Series",
              content:
                "Launching a new podcast series about Web3 entrepreneurship. Early believers get exclusive episodes!",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
              collectible: {
                price: "3",
                currency: "GHO",
                collected: 45,
                total: 200,
              },
              creator: creators.creator1,
              benefits: [
                {
                  type: "exclusive",
                  title: "Exclusive Episodes",
                  description: "Access to exclusive podcast episodes and behind-the-scenes content",
                },
              ],
            },
          ];
        }

        // Apply limit if specified
        if (options.limit && mockPosts.length > options.limit) {
          mockPosts = mockPosts.slice(0, options.limit);
        }

        setPosts(mockPosts);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch feed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [feedType, options.limit, user]);

  return {
    posts,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      // This would actually refetch the feed in production
      // For MVP, we're just resetting the loading state after a delay
      setTimeout(() => setIsLoading(false), 1000);
    },
  };
}
