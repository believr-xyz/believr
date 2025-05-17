"use client";

import { BookmarkButton } from "@/app/(app)/bookmarks/_components/bookmark-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  AwardIcon,
  BadgeCheck,
  DollarSign,
  HeartIcon,
  MessageCircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: {
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
  };
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const timeAgo = formatDistanceToNow(post.createdAt, { addSuffix: true });

  const percentCollected = post.collectible
    ? Math.min(100, Math.round((post.collectible.collected / post.collectible.total) * 100))
    : 0;

  return (
    <Card className="mb-4 overflow-hidden hover:border-primary/20 hover:shadow-sm">
      <CardHeader className="flex flex-row gap-4 pt-4 pb-2">
        <Avatar
          className="size-10 cursor-pointer"
          onClick={() => router.push(`/u/${post.creator.username}`)}
        >
          <AvatarImage src={post.creator.avatar} alt={post.creator.name} />
          <AvatarFallback>{post.creator.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="font-semibold hover:underline"
                onClick={() => router.push(`/u/${post.creator.username}`)}
              >
                {post.creator.name}
              </h3>
              <p className="text-muted-foreground text-sm">@{post.creator.username}</p>
            </div>
            <span className="text-muted-foreground text-xs">{timeAgo}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="cursor-pointer pt-0 pb-2"
        onClick={() => router.push(`/posts/${post.creator.username}/${post.id}`)}
      >
        <p className="mb-3 whitespace-pre-line">{post.content}</p>
        {post.image && (
          <div className="mt-2 overflow-hidden rounded-xl">
            <img src={post.image} alt="Post content" className="aspect-video w-full object-cover" />
          </div>
        )}

        {post.collectible && (
          <div className="mt-4 rounded-lg bg-muted/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <Badge variant="outline" className="bg-background">
                <span className="font-medium text-primary">
                  {post.collectible.price} {post.collectible.currency}
                </span>
              </Badge>
              <span className="text-muted-foreground text-sm">
                {post.collectible.collected} / {post.collectible.total} collected
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-[#00A8FF]" style={{ width: `${percentCollected}%` }} />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t p-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MessageCircleIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <RefreshCwIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <HeartIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <DollarSign className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <BookmarkButton postId={post.id} />
          <Button
            variant="default"
            className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
            onClick={() => router.push(`/posts/${post.creator.username}/${post.id}`)}
          >
            <AwardIcon className="mr-1.5 size-4" />
            Believe
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
