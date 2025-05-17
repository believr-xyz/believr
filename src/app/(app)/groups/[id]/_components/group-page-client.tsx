"use client";

import { PostCard } from "@/app/(app)/feed/_components/post-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "@lens-protocol/client";
import { ArrowLeftIcon, PlusIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Group } from "../page";

// Create a mapper function to convert group posts to Lens SDK compatible format
function mapMockPostToLensPost(mockPost: Group["posts"][0]): Post {
  return {
    __typename: "Post",
    id: mockPost.id,
    author: {
      address: mockPost.creator.id,
      metadata: {
        name: mockPost.creator.name,
        picture: mockPost.creator.avatar || "",
      },
      username: {
        value: mockPost.creator.handle,
      },
    },
    timestamp: mockPost.createdAt.toISOString(),
    metadata: {
      __typename: "TextOnlyMetadata",
      content: mockPost.content,
    },
    stats: {
      comments: 0,
      bookmarks: 0,
      reposts: 0,
      quotes: 0,
    },
  } as Post;
}

export function GroupPageClient({ group }: { group: Group }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("posts");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinGroup = async () => {
    setIsJoining(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In a real app, this would update the group membership status
    } catch (error) {
      console.error("Error joining group:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/groups")}
      >
        <ArrowLeftIcon className="mr-2 size-4" />
        Back to Groups
      </Button>

      {/* Hero section with group image */}
      <div className="relative mb-6 overflow-hidden rounded-xl">
        {group.image && (
          <div className="relative h-[200px] w-full overflow-hidden md:h-[300px]">
            <img
              src={group.image}
              alt={group.name}
              className="h-full w-full object-cover"
            />
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
                <Button
                  className="w-full"
                  variant="outline"
                  disabled={isJoining}
                >
                  Leave Group
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
                  onClick={handleJoinGroup}
                  disabled={isJoining}
                >
                  {isJoining ? "Joining..." : "Join Group"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Group content tabs */}
      <Tabs
        defaultValue="posts"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {group.posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border p-12 text-center">
              <h3 className="mb-1 font-semibold text-xl">No posts yet</h3>
              <p className="mb-4 text-muted-foreground">
                Be the first to post in this group
              </p>
              <Button className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90">
                <PlusIcon className="mr-2 size-4" />
                Create Post
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {group.posts.map((post) => (
                <PostCard key={post.id} post={mapMockPostToLensPost(post)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="members">
          <div className="flex flex-col items-center justify-center rounded-lg border p-12 text-center">
            <h3 className="mb-1 font-semibold text-xl">
              Members feature coming soon
            </h3>
            <p className="mb-4 text-muted-foreground">
              We're working on integrating this with Lens Protocol
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
