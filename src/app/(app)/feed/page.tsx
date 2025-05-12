"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { useState } from "react";
import { FeedSkeleton } from "./_components/feed-skeleton";
import { PostCard } from "./_components/post-card";
import { Trending } from "./_components/trending";
import { TrendingSkeleton } from "./_components/trending-skeleton";

// Mock data for the MVP
const MOCK_POSTS = [
  {
    id: "post-1",
    content:
      "Just launched my new SaaS project! Looking for early believers to help shape the future of productivity tools. Check it out! 🚀",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format",
    collectible: {
      price: "5",
      currency: "GHO",
      collected: 28,
      total: 50,
    },
    creator: {
      id: "creator-1",
      handle: "web3sarah",
      name: "Sarah Web3",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
    },
  },
  {
    id: "post-2",
    content:
      "My indie game studio is creating a new story-driven RPG. Early believers get alpha access and in-game recognition!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format",
    collectible: {
      price: "10",
      currency: "GHO",
      collected: 72,
      total: 100,
    },
    creator: {
      id: "creator-2",
      handle: "gamerbuild",
      name: "Indie Game Studio",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    },
  },
  {
    id: "post-3",
    content:
      "New podcast episode just dropped! We're discussing the future of decentralized social media. Give it a listen and let me know your thoughts.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
    creator: {
      id: "creator-3",
      handle: "techpodcaster",
      name: "Tech Podcaster",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format",
    },
  },
];

// Mock trending creators
const MOCK_TRENDING_CREATORS = [
  {
    id: "creator-1",
    name: "Sarah Web3",
    handle: "web3sarah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
    stats: {
      followers: 1245,
      believers: 78,
    },
  },
  {
    id: "creator-2",
    name: "Indie Game Studio",
    handle: "gamerbuild",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    stats: {
      followers: 876,
      believers: 52,
    },
  },
  {
    id: "creator-3",
    name: "Tech Podcaster",
    handle: "techpodcaster",
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
      handle: "web3sarah",
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
      handle: "gamerbuild",
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
      handle: "gamerbuild",
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

function FeedContent() {
  // This function would fetch and display feed content from Lens API in a real app
  return (
    <>
      {MOCK_POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}

function TrendingContent() {
  // This function would fetch and display trending content from Lens API in a real app
  return <Trending creators={MOCK_TRENDING_CREATORS} campaigns={MOCK_TRENDING_CAMPAIGNS} />;
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("for-you");

  return (
    <div className="container mx-auto mt-6 pb-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs
            defaultValue="for-you"
            onValueChange={setActiveTab}
            className="mb-6 w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="for-you">For You</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
            <TabsContent value="for-you">
              <Suspense fallback={<FeedSkeleton />}>
                <FeedContent />
              </Suspense>
            </TabsContent>
            <TabsContent value="following">
              <Suspense fallback={<FeedSkeleton />}>
                <FeedContent />
              </Suspense>
            </TabsContent>
            <TabsContent value="popular">
              <Suspense fallback={<FeedSkeleton />}>
                <FeedContent />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden md:block">
          <Suspense fallback={<TrendingSkeleton />}>
            <TrendingContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
