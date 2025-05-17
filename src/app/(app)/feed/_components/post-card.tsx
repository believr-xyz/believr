"use client";

import { BelieveButton } from "@/components/shared/believe-button";
import { BookmarkToggleButton } from "@/components/shared/bookmark-toggle-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { BadgeCheck, DollarSign, HeartIcon, MessageCircleIcon, RefreshCwIcon } from "lucide-react";
import Image from "next/image";
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

  const handleCardClick = () => {
    router.push(`/posts/${post.creator.username}/${post.id}`);
  };

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

      <CardContent className="cursor-pointer pt-0 pb-2" onClick={handleCardClick}>
        <p className="mb-3 whitespace-pre-line">{post.content}</p>
        {post.image && (
          <div className="relative mt-2 aspect-video overflow-hidden rounded-xl">
            <Image
              src={post.image}
              alt="Post content"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
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
          <BookmarkToggleButton postId={post.id} />
          <BelieveButton
            postId={post.id}
            creatorUsername={post.creator.username}
            price={post.collectible?.price}
            currency={post.collectible?.currency}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
