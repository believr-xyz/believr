"use client";

import { BelieveButton } from "@/components/shared/believe-button";
import { BookmarkToggleButton } from "@/components/shared/bookmark-toggle-button";
import { CommentButton } from "@/components/shared/comment-button";
import { ReactionButton } from "@/components/shared/reaction-button";
import { RepostQuoteButton } from "@/components/shared/repost-quote-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useLensPostUtils } from "@/hooks/use-lens-post-utils";
import { AnyPost, Post } from "@lens-protocol/client";
import { formatDistanceToNow } from "date-fns";
import { DollarSign, MusicIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: AnyPost;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const postUtils = useLensPostUtils();

  // Handle only Post types for now (not reposts, quotes, etc.)
  if (post.__typename !== "Post") {
    return null;
  }

  const typedPost = post as Post;

  // Extract post data using utility functions
  const content = postUtils.getContent(typedPost);
  const username = postUtils.getUsername(typedPost);
  const profilePicture = postUtils.getProfilePicture(typedPost);
  const isCollectible = postUtils.isCollectible(typedPost);

  // Create formatted date
  const timestamp = new Date(typedPost.timestamp);

  // Extract media from the post based on metadata type
  let mediaElement = null;

  // Handle Image metadata
  if (typedPost.metadata.__typename === "ImageMetadata" && typedPost.metadata.image) {
    const imageUrl = postUtils.getImageUrl(typedPost);

    if (imageUrl) {
      mediaElement = (
        <div className="relative mb-3 aspect-video overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={postUtils.getTitle(typedPost)}
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
    const videoUrl = postUtils.getVideoUrl(typedPost);
    const posterUrl = postUtils.getVideoPosterUrl(typedPost);

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
    const audioUrl = postUtils.getAudioUrl(typedPost);

    if (audioUrl) {
      mediaElement = (
        <div className="mb-3 rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-3">
            <MusicIcon className="size-6 text-primary" />
            <span className="font-medium">{postUtils.getTitle(typedPost)}</span>
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

  // Check if post has a collect action and collect limit
  const collectLimit = postUtils.getCollectLimit(typedPost);

  // Handle navigation to post detail page
  const navigateToPostDetail = () => {
    router.push(`/posts/${username}/${typedPost.id}`);
  };

  return (
    <Card className="cursor-pointer overflow-hidden" onClick={navigateToPostDetail}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={profilePicture} alt={typedPost.author.metadata?.name || username} />
            <AvatarFallback>
              {(typedPost.author.metadata?.name?.[0] || username[0])?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span
                className="cursor-pointer font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/u/${username}`);
                }}
              >
                {typedPost.author.metadata?.name || username}
              </span>
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
        {isCollectible && (
          <div className="mt-3">
            <Badge variant="outline" className="flex gap-1 px-2 py-1">
              <DollarSign className="size-3" />
              <span>Collectible</span>
              <span>•</span>
              <span>{collectLimit || "∞"} available</span>
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-4">
            <CommentButton
              postId={typedPost.id}
              commentCount={typedPost.stats?.comments || 0}
              username={username}
            />
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
            {isCollectible && <BelieveButton postId={typedPost.id} username={username} />}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
