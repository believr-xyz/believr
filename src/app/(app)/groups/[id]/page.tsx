import { PostCard } from "@/app/(app)/feed/_components/post-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

// Simplified group interface
interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  image?: string;
  creator: {
    handle: string;
    avatar?: string;
  };
  posts: Array<{
    id: string;
    content: string;
    createdAt: Date;
    image?: string;
    creator: {
      id: string;
      handle: string;
      name: string;
      avatar?: string;
    };
  }>;
  isMember: boolean;
}

// Single mock group for UI display
const MOCK_GROUP: Group = {
  id: "group-1",
  name: "SaaS Believers",
  description:
    "A community for believers in SaaS startups and projects. We focus on supporting early-stage SaaS founders.",
  members: 156,
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format",
  creator: {
    handle: "web3sarah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format",
  },
  posts: [
    {
      id: "post-1",
      content: "New SaaS Productivity Tool - early believers get lifetime access!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      creator: {
        id: "creator-1",
        handle: "web3sarah",
        name: "Sarah Web3",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
      },
    },
  ],
  isMember: false,
};

// Client component for interactive parts
("use client");
import { useRouter } from "next/navigation";
import { useState } from "react";

function GroupPageClient({ group }: { group: Group }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("posts");

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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="font-bold text-3xl">{group.name}</h1>
          <div className="mt-2 flex items-center">
            <UsersIcon className="mr-2 size-4" />
            <span>{group.members} members</span>
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
                      id: post.creator.id,
                      username: post.creator.handle,
                      name: post.creator.name,
                      avatar: post.creator.avatar,
                    },
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="members">
          <div className="flex flex-col items-center justify-center rounded-lg border p-12 text-center">
            <h3 className="mb-1 font-semibold text-xl">Members feature coming soon</h3>
            <p className="mb-4 text-muted-foreground">
              We're working on integrating this with Lens Protocol
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Server component which matches Next.js 15 type expectations
export default function GroupPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the group data from Lens API
  return <GroupPageClient group={MOCK_GROUP} />;
}
