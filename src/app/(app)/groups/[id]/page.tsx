"use client";

import { PostCard } from "@/app/(app)/feed/_components/post-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define the group interface
interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  image?: string;
  createdAt: Date;
  creator: {
    id: string;
    name: string;
    handle: string;
    avatar?: string;
  };
  posts: Array<{
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
      handle: string;
      name: string;
      avatar?: string;
      stats: {
        followers: number;
        believers: number;
      };
    };
  }>;
  members_list: Array<{
    id: string;
    handle: string;
    name: string;
    avatar?: string;
  }>;
  isMember: boolean;
  isPrivate?: boolean;
}

// Mock groups data - in a real app, this would be fetched from Lens API
const MOCK_GROUPS: Record<string, Group> = {
  "group-1": {
    id: "group-1",
    name: "SaaS Believers",
    description:
      "A community for believers in SaaS startups and projects. We focus on supporting early-stage SaaS founders and projects that are building innovative solutions to real problems.",
    members: 156,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
    creator: {
      id: "creator-1",
      name: "Sarah Web3",
      handle: "web3sarah",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format",
    },
    posts: [
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
          handle: "web3sarah",
          name: "Sarah Web3",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
          stats: {
            followers: 1254,
            believers: 89,
          },
        },
      },
    ],
    members_list: [
      {
        id: "user-1",
        handle: "cryptofan",
        name: "Crypto Fan",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format",
      },
      {
        id: "user-2",
        handle: "gamerlover",
        name: "Gamer Enthusiast",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format",
      },
      {
        id: "user-3",
        handle: "techbuilder",
        name: "Tech Builder",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format",
      },
    ],
    isMember: false,
  },
  "group-2": {
    id: "group-2",
    name: "Game Developers",
    description:
      "Support indie game developers and studios building the next generation of games. Join to discover and back promising game projects early.",
    members: 237,
    image: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?w=1200&auto=format",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120), // 120 days ago
    creator: {
      id: "creator-2",
      name: "Indie Game Studio",
      handle: "gamerbuild",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format",
    },
    posts: [
      {
        id: "post-2",
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
        creator: {
          id: "creator-2",
          handle: "gamerbuild",
          name: "Indie Game Studio",
          avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
          stats: {
            followers: 876,
            believers: 52,
          },
        },
      },
    ],
    members_list: [
      {
        id: "user-2",
        handle: "gamerlover",
        name: "Gamer Enthusiast",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format",
      },
      {
        id: "user-3",
        handle: "techbuilder",
        name: "Tech Builder",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format",
      },
    ],
    isMember: true,
  },
  "group-3": {
    id: "group-3",
    name: "Web3 Founders",
    description:
      "Early-stage Web3 startups looking for support and funding. This is a private group for serious believers in Web3 technology.",
    members: 94,
    image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=1200&auto=format",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    creator: {
      id: "creator-3",
      name: "Web3 Builder",
      handle: "web3build",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format",
    },
    posts: [],
    members_list: [],
    isPrivate: true,
    isMember: false,
  },
};

export default function GroupPage({ params }: { params: { id: string } }) {
  const groupId = params.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("posts");

  // Get group data - in a real app, this would be fetched from Lens API
  const group = MOCK_GROUPS[groupId];

  if (!group) {
    return (
      <div className="container mx-auto max-w-5xl pb-12">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/groups")}>
          <ArrowLeftIcon className="mr-2 size-4" />
          Back to Groups
        </Button>

        <div className="flex flex-col items-center justify-center rounded-lg border p-12 text-center">
          <h1 className="mb-2 font-bold text-2xl">Group Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            The group you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/groups")}>Browse Groups</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/groups")}>
        <ArrowLeftIcon className="mr-2 size-4" />
        Back to Groups
      </Button>

      {/* Hero section with group image */}
      <div className="relative mb-6 overflow-hidden rounded-xl">
        {group.image && (
          <div className="relative h-[200px] w-full overflow-hidden md:h-[300px]">
            <img src={group.image} alt={group.name} className="h-full w-full object-cover" />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="font-bold text-3xl">{group.name}</h1>
          <div className="mt-2 flex items-center">
            <UsersIcon className="mr-2 size-4" />
            <span>{group.members} members</span>
            {group.isPrivate && (
              <div className="ml-3 rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-800 text-xs">
                Private
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Group details */}
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{group.description}</p>
              <div className="mt-4">
                <p className="text-muted-foreground text-sm">
                  Created by{" "}
                  <span
                    className="cursor-pointer font-medium text-[#00A8FF]"
                    onClick={() => router.push(`/u/${group.creator.handle}`)}
                  >
                    @{group.creator.handle}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Join Group</CardTitle>
            </CardHeader>
            <CardContent>
              {group.isMember ? (
                <Button className="w-full" variant="outline">
                  Leave Group
                </Button>
              ) : (
                <Button className="w-full bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90">
                  Join Group
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Group content tabs */}
      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {group.posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border p-12 text-center">
              <h3 className="mb-1 font-semibold text-xl">No posts yet</h3>
              <p className="mb-4 text-muted-foreground">Be the first to post in this group</p>
              <Button className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90">Create Post</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {group.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    ...post,
                    creator: {
                      ...post.creator,
                      username: post.creator.handle,
                    },
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="members">
          <div className="space-y-4">
            {group.members_list.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border p-12 text-center">
                <h3 className="mb-1 font-semibold text-xl">No members yet</h3>
                <p className="mb-4 text-muted-foreground">Be the first to join this group</p>
              </div>
            ) : (
              group.members_list.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-lg border p-4"
                  onClick={() => router.push(`/u/${member.handle}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Avatar className="size-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-muted-foreground text-sm">@{member.handle}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
