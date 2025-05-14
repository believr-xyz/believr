"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { PostCard } from "../../../feed/_components/post-card";

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
    handle: string;
    name: string;
    avatar?: string;
  };
}

interface ProfileTabsProps {
  posts: Post[];
  activeTab?: "posts" | "collectibles";
  onTabChange?: (tab: string) => void;
}

export function ProfileTabs({ posts, activeTab = "posts", onTabChange }: ProfileTabsProps) {
  const router = useRouter();
  const collectiblePosts = posts.filter((post) => post.collectible);

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-4 grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4">
        {posts.length === 0 ? (
          <Card className="flex h-40 flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">No posts yet</p>
          </Card>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </TabsContent>

      <TabsContent value="collectibles" className="space-y-4">
        {collectiblePosts.length === 0 ? (
          <Card className="flex h-40 flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">No collectible posts yet</p>
          </Card>
        ) : (
          collectiblePosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </TabsContent>
    </Tabs>
  );
}
