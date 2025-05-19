"use client";

import { extractMediaUrl } from "@/lib/url-utils";
import { Post } from "@lens-protocol/client";

/**
 * Utility hook for working with Lens Protocol post data
 * Provides consistent extraction of data from post objects
 */
export function useLensPostUtils() {
  /**
   * Extract username from a post's author
   */
  const getUsername = (post: Post): string => {
    return post.author.username?.value?.split("/").pop() || post.author.address.substring(0, 8);
  };

  /**
   * Extract profile picture URL from a post's author
   */
  const getProfilePicture = (post: Post): string => {
    return extractMediaUrl(post.author.metadata?.picture);
  };

  /**
   * Extract content from post metadata based on its type
   */
  const getContent = (post: Post): string => {
    if (!post.metadata) return "";

    if (post.metadata.__typename === "TextOnlyMetadata") {
      return post.metadata.content;
    } else if (post.metadata.__typename === "ArticleMetadata") {
      return post.metadata.content;
    } else if (post.metadata.__typename === "ImageMetadata") {
      return post.metadata.content;
    } else if (post.metadata.__typename === "VideoMetadata") {
      return post.metadata.content;
    } else if (post.metadata.__typename === "AudioMetadata") {
      return post.metadata.content;
    } else {
      return (post.metadata as any)?.content || "";
    }
  };

  /**
   * Extract title from post metadata based on its type
   */
  const getTitle = (post: Post): string => {
    if (!post.metadata) return "Untitled Post";

    if (post.metadata.__typename === "ArticleMetadata") {
      return post.metadata.title || "Untitled Post";
    } else if (post.metadata.__typename === "VideoMetadata") {
      return post.metadata.title || "Untitled Post";
    } else if (post.metadata.__typename === "AudioMetadata") {
      return post.metadata.title || "Untitled Post";
    } else {
      return (post.metadata as any)?.title || "Untitled Post";
    }
  };

  /**
   * Extract image URL from post metadata if available
   * Handles different image formats from Lens Protocol
   */
  const getImageUrl = (post: Post): string => {
    if (post.metadata?.__typename === "ImageMetadata" && post.metadata.image) {
      // Log the image structure for debugging
      console.log("Image metadata structure:", JSON.stringify(post.metadata.image));
      return extractMediaUrl(post.metadata.image);
    }
    return "";
  };

  /**
   * Extract video URL from post metadata if available
   */
  const getVideoUrl = (post: Post): string => {
    if (post.metadata?.__typename === "VideoMetadata" && post.metadata.video) {
      return extractMediaUrl(post.metadata.video);
    }
    return "";
  };

  /**
   * Extract video poster URL if available
   */
  const getVideoPosterUrl = (post: Post): string | undefined => {
    if (post.metadata?.__typename === "VideoMetadata") {
      // @ts-ignore - Lens Protocol metadata may have cover field that's not in types
      const cover = post.metadata.cover || (post.metadata as any)?.cover;
      return cover ? extractMediaUrl(cover) : undefined;
    }
    return undefined;
  };

  /**
   * Extract audio URL from post metadata if available
   */
  const getAudioUrl = (post: Post): string => {
    if (post.metadata?.__typename === "AudioMetadata" && post.metadata.audio) {
      return extractMediaUrl(post.metadata.audio);
    }
    return "";
  };

  /**
   * Check if a post is collectible (has collect action)
   */
  const isCollectible = (post: Post): boolean => {
    return post.actions?.some((action) => action.__typename === "SimpleCollectAction") || false;
  };

  /**
   * Get collect limit if available
   */
  const getCollectLimit = (post: Post): number | null => {
    const action = post.actions?.find((action) => action.__typename === "SimpleCollectAction");
    if (action && action.__typename === "SimpleCollectAction") {
      return action.collectLimit;
    }
    return null;
  };

  return {
    getUsername,
    getProfilePicture,
    getContent,
    getTitle,
    getImageUrl,
    getVideoUrl,
    getVideoPosterUrl,
    getAudioUrl,
    isCollectible,
    getCollectLimit,
  };
}
