"use client";

import { BookmarkButton } from "@/app/(app)/bookmarks/_components/bookmark-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  BadgeCheck,
  HeartIcon,
  Loader2,
  MessageCircleIcon,
  RefreshCwIcon,
  DollarSign,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CollectCard } from "./_components/collect-card";
import { CollectorsList } from "./_components/collectors-list";
import { CommentSection } from "./_components/comment-section";

// Types
interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
}

interface Collector {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  collectedAt: Date;
  verified?: boolean;
}

interface PostDetail {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  image?: string;
  collectible: {
    price: string;
    currency: string;
    collected: number;
    total: number;
    collectors: Collector[];
  };
  creator: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    bio?: string;
    verified?: boolean;
    stats: {
      followers: number;
      believers: number;
    };
  };
  comments: Comment[];
}

// Mock data for the post - this would be fetched from an API in a real app
const MOCK_POST: PostDetail = {
  id: "post-2",
  title: "New Story-Driven RPG Game",
  content:
    "My indie game studio is creating a new story-driven RPG. Early believers get alpha access and in-game recognition!\n\nWe're building a world where your choices truly matter, with branching storylines and dynamic character development. Our team has been working on this concept for over a year, and we're excited to finally share it with the community.\n\nBy believing in this project early, you'll receive:\n- Exclusive alpha access before public release\n- Your name in the game credits as an 'Early Believer'\n- A special in-game item named after you\n- Access to our private Discord for early feedback\n\nJoin us on this journey to create something special!",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  image:
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format",
  collectible: {
    price: "10",
    currency: "GHO",
    collected: 72,
    total: 100,
    collectors: [
      {
        id: "user-1",
        username: "cryptofan",
        name: "Crypto Fan",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format",
        collectedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        verified: true,
      },
      {
        id: "user-2",
        username: "gamerlover",
        name: "Gamer Enthusiast",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format",
        collectedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      },
      {
        id: "user-3",
        username: "techbuilder",
        name: "Tech Builder",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format",
        collectedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        verified: true,
      },
    ],
  },
  creator: {
    id: "creator-2",
    username: "gamerbuild",
    name: "Indie Game Studio",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    bio: "Creating the next generation of story-driven games. Building in public.",
    verified: true,
    stats: {
      followers: 876,
      believers: 52,
    },
  },
  comments: [
    {
      id: "comment-1",
      content: "This looks amazing! Can't wait to play the alpha version.",
      createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      author: {
        id: "user-1",
        username: "cryptofan",
        name: "Crypto Fan",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format",
        verified: true,
      },
    },
    {
      id: "comment-2",
      content: "Will there be multiplayer features in the future?",
      createdAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      author: {
        id: "user-2",
        username: "gamerlover",
        name: "Gamer Enthusiast",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format",
      },
    },
  ],
};

export default function PostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const creatorUsername = params.username as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCollected, setHasCollected] = useState(false);

  // In a real app, you would fetch the post data based on the ID and creator username
  useEffect(() => {
    // Simulate API fetch
    const loadPost = async () => {
      setIsLoading(true);
      try {
        // This would be an API call in a real app
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        // For the MVP, we'll use the mock data
        setPost(MOCK_POST);

        // Check if current user has collected this post
        // This would be a real check in production
        setHasCollected(false);
      } catch (error) {
        console.error("Error loading post:", error);
        toast.error("Failed to load post details");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId, creatorUsername]);

  const handleCollect = () => {
    if (post) {
      // Update the post data to reflect the new collection
      setPost({
        ...post,
        collectible: {
          ...post.collectible,
          collected: post.collectible.collected + 1,
        },
      });
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    if (post) {
      setPost({
        ...post,
        comments: [newComment, ...post.comments],
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex h-80 flex-col items-center justify-center text-center">
        <h2 className="mb-2 font-semibold text-xl">Post not found</h2>
        <p className="mb-4 text-muted-foreground">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/feed")}>Back to Feed</Button>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(post.createdAt, { addSuffix: true });

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-1 px-0"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {post.image && (
              <div className="w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar
                    className="size-10 cursor-pointer"
                    onClick={() => router.push(`/u/${post.creator.username}`)}
                  >
                    <AvatarImage
                      src={post.creator.avatar}
                      alt={post.creator.name}
                    />
                    <AvatarFallback>
                      {post.creator.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3
                        className="font-semibold hover:underline"
                        onClick={() =>
                          router.push(`/u/${post.creator.username}`)
                        }
                      >
                        {post.creator.name}
                      </h3>
                      {post.creator.verified && (
                        <BadgeCheck className="size-4 text-[#00A8FF]" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-muted-foreground text-sm">
                        @{post.creator.username}
                      </p>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs">
                        {timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <MessageCircleIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <RefreshCwIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <HeartIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <DollarSign className="size-4" />
                  </Button>
                  <BookmarkButton postId={post.id} />
                </div>
              </div>

              <h1 className="mb-4 font-bold text-2xl">{post.title}</h1>
              <div className="whitespace-pre-line text-base">
                {post.content}
              </div>

              <div className="mt-8">
                <Tabs defaultValue="comments">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comments">
                      <MessageCircleIcon className="mr-2 size-4" />
                      Comments ({post.comments.length})
                    </TabsTrigger>
                    <TabsTrigger value="collectors">
                      <Badge className="mr-2 bg-[#00A8FF]">
                        {post.collectible.collectors.length}
                      </Badge>
                      Believers
                    </TabsTrigger>
                  </TabsList>
                  <Separator className="my-4" />
                  <TabsContent value="comments" className="mt-0 pt-4">
                    <CommentSection
                      postId={post.id}
                      comments={post.comments}
                      onCommentAdded={handleCommentAdded}
                    />
                  </TabsContent>
                  <TabsContent value="collectors" className="mt-0 pt-4">
                    <CollectorsList collectors={post.collectible.collectors} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <CollectCard
            postId={post.id}
            price={post.collectible.price}
            currency={post.collectible.currency}
            collected={post.collectible.collected}
            total={post.collectible.total}
            creator={post.creator}
            onCollect={handleCollect}
          />
        </div>
      </div>
    </div>
  );
}
