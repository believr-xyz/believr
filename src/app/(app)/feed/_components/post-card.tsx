"use client";

import { BelieveButton } from "@/components/shared/believe-button";
import { BookmarkToggleButton } from "@/components/shared/bookmark-toggle-button";
import { CommentButton } from "@/components/shared/comment-button";
import { ReactionButton } from "@/components/shared/reaction-button";
import { RepostQuoteButton } from "@/components/shared/repost-quote-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AnyPost, Post } from "@lens-protocol/client";
import { formatDistanceToNow } from "date-fns";
import {
  BadgeCheck,
  DollarSign,
  HeartIcon,
  MessageCircleIcon,
  MusicIcon,
  RefreshCwIcon,
  VideoIcon,
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
  try {
    if (typedPost.metadata) {
      // Handle different metadata types individually based on their __typename
      if (typedPost.metadata.__typename === "TextOnlyMetadata") {
        content = typedPost.metadata.content;
      } else if (typedPost.metadata.__typename === "ArticleMetadata") {
        content = typedPost.metadata.content;
      } else if (typedPost.metadata.__typename === "ImageMetadata") {
        content = typedPost.metadata.content;
      } else if (typedPost.metadata.__typename === "AudioMetadata") {
        content = typedPost.metadata.content;
      } else if (typedPost.metadata.__typename === "VideoMetadata") {
        content = typedPost.metadata.content;
      } else {
        // For other metadata types, try to access content property safely
        content = (typedPost.metadata as any)?.content || "";
      }
    }
  } catch (error) {
    console.error("Error extracting content from post metadata:", error);
    content = "";
  }

  // Extract media from the post based on metadata type
  let mediaElement = null;

  // Handle Image metadata
  if (typedPost.metadata.__typename === "ImageMetadata" && typedPost.metadata.image) {
    let imageUrl = "";
    try {
      imageUrl =
        typeof typedPost.metadata.image === "string"
          ? typedPost.metadata.image
          : typedPost.metadata.image?.item || (typedPost.metadata.image as any)?.raw?.uri || "";
    } catch (error) {
      console.error("Error extracting image URL:", error);
    }

    if (imageUrl) {
      mediaElement = (
        <div className="relative mb-3 aspect-video overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={(typedPost.metadata as any).title || "Post image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      );
    }
  }

  // Handle Video metadata
  else if (typedPost.metadata.__typename === "VideoMetadata" && typedPost.metadata.video) {
    let videoUrl = "";
    let posterUrl: string | undefined = undefined;

    try {
      videoUrl =
        typeof typedPost.metadata.video === "string"
          ? typedPost.metadata.video
          : typedPost.metadata.video?.item || (typedPost.metadata.video as any)?.raw?.uri || "";

      // Get poster if available
      posterUrl = (typedPost.metadata as any)?.cover
        ? typeof (typedPost.metadata as any).cover === "string"
          ? (typedPost.metadata as any).cover
          : (typedPost.metadata as any).cover?.item || ""
        : undefined;
    } catch (error) {
      console.error("Error extracting video URL:", error);
    }

    if (videoUrl) {
      mediaElement = (
        <div className="mb-3 overflow-hidden rounded-lg">
          <div className="relative aspect-video">
            <video
              src={videoUrl}
              controls
              poster={posterUrl}
              className="h-full w-full object-cover"
            >
              <track kind="captions" src="" label="English" srcLang="en" default />
              Your browser does not support the video element.
            </video>
          </div>
        </div>
      );
    } else {
      // Fallback for when video URL can't be determined
      mediaElement = (
        <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-muted">
          <VideoIcon className="size-12 text-muted-foreground" />
        </div>
      );
    }
  }

  // Handle Audio metadata
  else if (typedPost.metadata.__typename === "AudioMetadata" && typedPost.metadata.audio) {
    let audioUrl = "";
    try {
      audioUrl =
        typeof typedPost.metadata.audio === "string"
          ? typedPost.metadata.audio
          : typedPost.metadata.audio?.item || (typedPost.metadata.audio as any)?.raw?.uri || "";
    } catch (error) {
      console.error("Error extracting audio URL:", error);
    }

    if (audioUrl) {
      mediaElement = (
        <div className="mb-3 rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-3">
            <MusicIcon className="size-6 text-primary" />
            <span className="font-medium">{(typedPost.metadata as any).title || "Audio"}</span>
          </div>
          <audio controls className="w-full">
            <source src={audioUrl} />
            <track kind="captions" src="" label="English" srcLang="en" default />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
  }

  // Check if post has a collect action
  const collectAction = typedPost.actions?.find(
    (action) => action.__typename === "SimpleCollectAction",
  );
  const hasCollectAction = !!collectAction;

  // Create formatted date
  const timestamp = new Date(typedPost.timestamp);

  // Get username without namespace
  const username =
    typedPost.author.username?.value?.split("/").pop() || typedPost.author.address.substring(0, 8);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src={
                typeof typedPost.author.metadata?.picture === "string"
                  ? typedPost.author.metadata.picture
                  : typedPost.author.metadata?.picture?.item || ""
              }
              alt={typedPost.author.metadata?.name || username}
            />
            <AvatarFallback>{typedPost.author.metadata?.name?.[0] || username[0]}</AvatarFallback>
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
        {content && <div className="mb-3 whitespace-pre-wrap">{content}</div>}

        {/* Media element (image, video, audio) */}
        {mediaElement}

        {/* Collectible badge if exists */}
        {hasCollectAction && collectAction.__typename === "SimpleCollectAction" && (
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
            <CommentButton postId={typedPost.id} commentCount={typedPost.stats?.comments || 0} />
            <RepostQuoteButton
              postId={typedPost.id}
              count={(typedPost.stats?.reposts || 0) + (typedPost.stats?.quotes || 0)}
            />
            <ReactionButton
              postId={typedPost.id}
              reactionCount={typedPost.stats?.upvotes || 0}
              isReacted={typedPost.operations?.hasUpvoted}
            />
          </div>

          <div className="flex gap-2">
            <BookmarkToggleButton
              postId={typedPost.id}
              isBookmarked={typedPost.operations?.hasBookmarked}
            />
            {hasCollectAction && <BelieveButton postId={typedPost.id} username={username} />}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
