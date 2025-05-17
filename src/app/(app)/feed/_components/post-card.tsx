"use client";

import { BelieveButton } from "@/components/shared/believe-button";
import { BookmarkToggleButton } from "@/components/shared/bookmark-toggle-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AnyPost, Post } from "@lens-protocol/client";
import { formatDistanceToNow } from "date-fns";
import {
  BadgeCheck,
  DollarSign,
  HeartIcon,
  MessageCircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: AnyPost;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  // Handle only Post types for now (not reposts, quotes, etc.)
  if (post.__typename !== "Post") {
    return null;
  }

  const typedPost = post as Post;

  // Extract post content based on metadata type
  let content = "";
  if (typedPost.metadata) {
    // Handle different metadata types individually
    if (typedPost.metadata.__typename === "TextOnlyMetadata") {
      content = typedPost.metadata.content;
    } else if (typedPost.metadata.__typename === "ArticleMetadata") {
      content = typedPost.metadata.content;
    } else if (typedPost.metadata.__typename === "ImageMetadata") {
      content = typedPost.metadata.content;
    } else if (typedPost.metadata.__typename === "AudioMetadata") {
      content = typedPost.metadata.content;
    } else if (typedPost.metadata.__typename === "VideoMetadata") {
      // VideoMetadata should have content
      // @ts-ignore - TypeScript doesn't know about this property
      content = typedPost.metadata.content || "";
    } else if (typedPost.metadata.__typename === "LinkMetadata") {
      // LinkMetadata should have content
      // @ts-ignore - TypeScript doesn't know about this property
      content = typedPost.metadata.content || "";
    }
    // Other metadata types may not have content
  }

  // Extract image if post has one
  let image: string | undefined;
  if (
    typedPost.metadata.__typename === "ImageMetadata" &&
    typedPost.metadata.image
  ) {
    image =
      typeof typedPost.metadata.image === "string"
        ? typedPost.metadata.image
        : typedPost.metadata.image.item;
  }

  // Check if post has a collect action
  const collectAction = typedPost.actions?.find(
    (action) => action.__typename === "SimpleCollectAction"
  );
  const hasCollectAction = !!collectAction;

  // Create formatted date
  const timestamp = new Date(typedPost.timestamp);

  // Get username without namespace
  const username =
    typedPost.author.username?.value?.split("/").pop() ||
    typedPost.author.address.substring(0, 8);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src={
                typeof typedPost.author.metadata?.picture === "string"
                  ? typedPost.author.metadata.picture
                  : typedPost.author.metadata?.picture?.item
              }
            />
            <AvatarFallback>
              {typedPost.author.metadata?.name?.[0] || username[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span
                className="cursor-pointer font-medium"
                onClick={() => router.push(`/u/${username}`)}
              >
                {typedPost.author.metadata?.name || username}
              </span>
              <BadgeCheck className="size-4 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <span>@{username}</span>
              <span>•</span>
              <span>{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="mb-3 whitespace-pre-wrap">{content}</div>

        {/* Image if exists */}
        {image && (
          <div className="relative mb-3 aspect-video overflow-hidden rounded-lg">
            <Image
              src={image}
              alt="Post image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Collectible badge if exists */}
        {hasCollectAction &&
          collectAction.__typename === "SimpleCollectAction" && (
            <div className="mt-3">
              <Badge variant="outline" className="flex gap-1 px-2 py-1">
                <DollarSign className="size-3" />
                <span>Collectible</span>
                <span>•</span>
                <span>{collectAction.collectLimit || "∞"} available</span>
              </Badge>
            </div>
          )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-4">
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 px-2 text-muted-foreground"
            >
              <MessageCircleIcon className="size-4" />
              <span>{typedPost.stats?.comments || 0}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 px-2 text-muted-foreground"
            >
              <RefreshCwIcon className="size-4" />
              <span>
                {(typedPost.stats?.reposts || 0) +
                  (typedPost.stats?.quotes || 0)}
              </span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 px-2 text-muted-foreground"
            >
              <HeartIcon className="size-4" />
              <span>{typedPost.stats?.bookmarks || 0}</span>
            </Button>
          </div>

          <div className="flex gap-2">
            <BookmarkToggleButton postId={typedPost.id} />
            {hasCollectAction && (
              <BelieveButton postId={typedPost.id} username={username} />
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
