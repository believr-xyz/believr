"use client";

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
    const picture = post.author.metadata?.picture;
    if (!picture) return "";

    if (typeof picture === "string") {
      return picture;
    }

    // Handle optimized vs raw image using type assertion
    // @ts-ignore - Lens Protocol types may not include these fields
    if (picture.optimized?.uri) {
      // @ts-ignore
      return picture.optimized.uri;
    }

    // @ts-ignore - Lens Protocol types may not include these fields
    if (picture.raw?.uri) {
      // @ts-ignore
      return picture.raw.uri;
    }

    return picture.item || "";
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
      // If image is a string, return it directly
      if (typeof post.metadata.image === "string") {
        return post.metadata.image;
      }

      // Try optimized version first
      // @ts-ignore - Lens Protocol types may not include these fields
      if (post.metadata.image.optimized?.uri) {
        // @ts-ignore
        return post.metadata.image.optimized.uri;
      }

      // Try raw version next
      // @ts-ignore - Lens Protocol types may not include these fields
      if (post.metadata.image.raw?.uri) {
        // @ts-ignore
        return post.metadata.image.raw.uri;
      }

      // Fall back to item field
      return post.metadata.image.item || "";
    }
    return "";
  };

  /**
   * Extract video URL from post metadata if available
   */
  const getVideoUrl = (post: Post): string => {
    if (post.metadata?.__typename === "VideoMetadata" && post.metadata.video) {
      if (typeof post.metadata.video === "string") {
        return post.metadata.video;
      }
      // @ts-ignore - Lens Protocol types may not include these fields
      else if (post.metadata.video.optimized?.uri) {
        // @ts-ignore
        return post.metadata.video.optimized.uri;
      }
      // @ts-ignore - Lens Protocol types may not include these fields
      else if (post.metadata.video.raw?.uri) {
        // @ts-ignore
        return post.metadata.video.raw.uri;
      } else if (post.metadata.video.item) {
        return post.metadata.video.item;
      }
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
      if (cover) {
        if (typeof cover === "string") {
          return cover;
        }
        // @ts-ignore - Lens Protocol types may not include these fields
        else if (cover.optimized?.uri) {
          // @ts-ignore
          return cover.optimized.uri;
        }
        // @ts-ignore - Lens Protocol types may not include these fields
        else if (cover.raw?.uri) {
          // @ts-ignore
          return cover.raw.uri;
        }
        return cover.item || "";
      }
    }
    return undefined;
  };

  /**
   * Extract audio URL from post metadata if available
   */
  const getAudioUrl = (post: Post): string => {
    if (post.metadata?.__typename === "AudioMetadata" && post.metadata.audio) {
      if (typeof post.metadata.audio === "string") {
        return post.metadata.audio;
      }
      // @ts-ignore - Lens Protocol types may not include these fields
      else if (post.metadata.audio.optimized?.uri) {
        // @ts-ignore
        return post.metadata.audio.optimized.uri;
      }
      // @ts-ignore - Lens Protocol types may not include these fields
      else if (post.metadata.audio.raw?.uri) {
        // @ts-ignore
        return post.metadata.audio.raw.uri;
      } else if (post.metadata.audio.item) {
        return post.metadata.audio.item;
      }
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
