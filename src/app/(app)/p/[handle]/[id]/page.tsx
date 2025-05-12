"use client";

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
  ShareIcon,
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
    handle: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
}

interface Collector {
  id: string;
  handle: string;
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
    handle: string;
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
  image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format",
  collectible: {
    price: "10",
    currency: "GHO",
    collected: 72,
    total: 100,
    collectors: [
      {
        id: "user-1",
        handle: "cryptofan",
        name: "Crypto Fan",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format",
        collectedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        verified: true,
      },
      {
        id: "user-2",
        handle: "gamerlover",
        name: "Gamer Enthusiast",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format",
        collectedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      },
      {
        id: "user-3",
        handle: "techbuilder",
        name: "Tech Builder",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format",
        collectedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        verified: true,
      },
    ],
  },
  creator: {
    id: "creator-2",
    handle: "gamerbuild",
    name: "Indie Game Studio",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
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
        handle: "cryptofan",
        name: "Crypto Fan",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format",
        verified: true,
      },
    },
    {
      id: "comment-2",
      content: "Will there be multiplayer features in the future?",
      createdAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      author: {
        id: "user-2",
        handle: "gamerlover",
        name: "Gamer Enthusiast",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format",
      },
    },
  ],
};

export default function PostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const creatorHandle = params.handle as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCollected, setHasCollected] = useState(false);

  // In a real app, you would fetch the post data based on the ID and creator handle
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
  }, [postId, creatorHandle]);

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
    <div className="mx-auto max-w-4xl">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-1 px-0"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main post content */}
        <div className="md:col-span-2">
          {/* Post header */}
          <div className="mb-4 flex items-start gap-4">
            <Avatar
              className="size-12 cursor-pointer"
              onClick={() => router.push(`/u/${post.creator.handle}`)}
            >
              <AvatarImage src={post.creator.avatar} alt={post.creator.name} />
              <AvatarFallback>{post.creator.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h2
                  className="cursor-pointer font-bold text-xl hover:underline"
                  onClick={() => router.push(`/u/${post.creator.handle}`)}
                >
                  {post.creator.name}
                </h2>
                {post.creator.verified && <BadgeCheck className="size-5 text-[#00A8FF]" />}
              </div>
              <p className="text-muted-foreground">@{post.creator.handle}</p>
              <p className="mt-1 text-muted-foreground text-sm">{timeAgo}</p>
            </div>
          </div>

          {/* Post content */}
          <Card className="mb-6 overflow-hidden">
            {post.image && (
              <div className="aspect-video w-full overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full object-cover" />
              </div>
            )}
            <div className="p-6">
              <h1 className="mb-4 font-bold text-2xl">{post.title}</h1>
              <div className="whitespace-pre-line text-lg">
                {post.content.split("\n").map((paragraph, i) => (
                  <p key={`paragraph-${i}-${paragraph.substring(0, 10)}`} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <HeartIcon className="mr-1 size-4" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <RefreshCwIcon className="mr-1 size-4" />
                  Mirror
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ShareIcon className="mr-1 size-4" />
                  Share
                </Button>
              </div>
            </div>
          </Card>

          {/* Tabs for comments and collectors */}
          <Tabs defaultValue="comments" className="mb-6">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="comments" className="flex-1">
                <MessageCircleIcon className="mr-2 size-4" />
                Comments ({post.comments.length})
              </TabsTrigger>
              <TabsTrigger value="collectors" className="flex-1">
                Collectors ({post.collectible.collectors.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments">
              <CommentSection
                postId={post.id}
                comments={post.comments}
                onCommentAdded={handleCommentAdded}
              />
            </TabsContent>

            <TabsContent value="collectors">
              <CollectorsList collectors={post.collectible.collectors} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar */}
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
