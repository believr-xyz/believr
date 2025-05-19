"use client";

import { getLensClient } from "@/lib/lens/client";
import { storageClient } from "@/lib/lens/storage-client";
import { SessionClient, evmAddress, uri } from "@lens-protocol/client";
import { post } from "@lens-protocol/client/actions";
import {
  ArticleMetadata,
  AudioMetadata,
  ImageMetadata,
  MediaImageMimeType,
  MetadataAttributeType,
  VideoMetadata,
  article,
  audio,
  image,
  video,
} from "@lens-protocol/metadata";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useState } from "react";
import { toast } from "sonner";

// Investment metadata interface based on CORE.md
export interface InvestmentMetadata {
  category: "content" | "art" | "music" | "tech" | "writing";
  revenueShare: string;
  benefits: string;
  endDate: string;
  mediaType?: "image" | "video" | "audio";
}

interface CreatePostInput {
  title?: string;
  content: string;
  imageFile?: File;
  collectible?: boolean;
  collectSettings?: {
    price?: string;
    currency?: string;
    supply?: string;
  };
  investmentMetadata?: InvestmentMetadata;
}

/**
 * Hook for creating posts on Lens Protocol
 * @returns Object with createPost function and loading state
 */
export function useCreatePost() {
  const { data: user } = useAuthenticatedUser();
  const [isLoading, setIsLoading] = useState(false);

  const createPost = async (input: CreatePostInput) => {
    if (!user) {
      toast.error("You need to be logged in to post");
      return null;
    }

    setIsLoading(true);

    try {
      // Get the Lens client
      const client = await getLensClient();

      // If we don't have a client, we can't perform operations
      if (!client) {
        toast.error("Failed to initialize Lens client");
        setIsLoading(false);
        return null;
      }

      // Check if client is a SessionClient (has authentication)
      if (!("getCredentials" in client)) {
        toast.error("You need to be authenticated to create a post");
        setIsLoading(false);
        return null;
      }

      const sessionClient = client as SessionClient;

      // Prepare metadata
      let metadata:
        | ImageMetadata
        | ArticleMetadata
        | VideoMetadata
        | AudioMetadata;
      let imageAttachment = null;

      // Handle image file if provided
      if (input.imageFile) {
        try {
          // Using Grove storage to upload the image
          const fileArray = input.imageFile ? [input.imageFile] : [];
          const mediaType = determineMediaType(input.imageFile);

          // Upload file to Grove storage
          const { files } = await storageClient.uploadFolder(fileArray);

          // Use the URI from the uploaded file
          if (files && files.length > 0) {
            imageAttachment = {
              item: files[0].uri,
              type: mediaType,
            };
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image");
          setIsLoading(false);
          return null;
        }
      }

      // Create metadata based on content and image
      if (imageAttachment) {
        // Image post with title and content
        metadata = image({
          title: input.title || "",
          content: input.content,
          image: imageAttachment,
          attributes: [
            {
              key: "type",
              value: "investment",
              type: MetadataAttributeType.STRING,
            },
            {
              key: "category",
              value: input.investmentMetadata?.category || "content",
              type: MetadataAttributeType.STRING,
            },
            {
              key: "revenueShare",
              value: input.investmentMetadata?.revenueShare || "0",
              type: MetadataAttributeType.STRING,
            },
            {
              key: "benefits",
              value: input.investmentMetadata?.benefits || "",
              type: MetadataAttributeType.STRING,
            },
            {
              key: "endDate",
              value: input.investmentMetadata?.endDate || "",
              type: MetadataAttributeType.STRING,
            },
            {
              key: "mediaType",
              value: input.investmentMetadata?.mediaType || "image",
              type: MetadataAttributeType.STRING,
            },
          ],
        });
      } else {
        // Article post (no image)
        metadata = article({
          title: input.title || "",
          content: input.content,
          attributes: [
            {
              key: "type",
              value: "investment",
              type: MetadataAttributeType.STRING,
            },
            {
              key: "category",
              value: input.investmentMetadata?.category || "content",
              type: MetadataAttributeType.STRING,
            },
            {
              key: "revenueShare",
              value: input.investmentMetadata?.revenueShare || "0",
              type: MetadataAttributeType.STRING,
            },
            {
              key: "benefits",
              value: input.investmentMetadata?.benefits || "",
              type: MetadataAttributeType.STRING,
            },
            {
              key: "endDate",
              value: input.investmentMetadata?.endDate || "",
              type: MetadataAttributeType.STRING,
            },
          ],
        });
      }

      // Upload metadata to Grove
      const metadataResult = await storageClient.uploadAsJson(metadata);
      if (!metadataResult || !metadataResult.uri) {
        toast.error("Failed to upload post metadata");
        setIsLoading(false);
        return null;
      }

      // Create post request
      const createPostRequest = {
        contentUri: uri(metadataResult.uri),
      };

      // Add collect module if enabled
      if (input.collectible && input.collectSettings) {
        // Create the request with the proper typing
        const requestWithCollect = {
          contentUri: createPostRequest.contentUri,
          actions: [
            {
              simpleCollect: {
                // Configure according to GraphQL schema
                payToCollect: {
                  amount: {
                    currency: input.collectSettings.currency || "GHO",
                    value: input.collectSettings.price || "0",
                  },
                  // Split revenue with original creator
                  recipients: [
                    {
                      address: evmAddress(user.address),
                      percent: 100, // 100% to creator, can be adjusted for revenue sharing
                    },
                  ],
                  referralShare: 0, // Optional referral fee
                },
                collectLimit: input.collectSettings.supply
                  ? Number.parseInt(input.collectSettings.supply)
                  : undefined,
                followerOnGraph: null, // Can restrict collect to followers
                endsAt: input.investmentMetadata?.endDate || null,
                isImmutable: true,
              },
            },
          ],
        };

        // Create post with collect action
        const result = await post(sessionClient, requestWithCollect);
        if (result.isErr()) {
          console.error("Failed to create post:", result.error);
          toast.error("Failed to create post");
          setIsLoading(false);
          return null;
        }

        // Post created successfully
        toast.success("Investment post created successfully!");
        setIsLoading(false);

        // Return the post ID if available, otherwise just return success indicator
        return result.value &&
          typeof result.value === "object" &&
          "id" in result.value
          ? { id: result.value.id }
          : { success: true };
      } else {
        // Create regular post without collect action
        const result = await post(sessionClient, createPostRequest);
        if (result.isErr()) {
          console.error("Failed to create post:", result.error);
          toast.error("Failed to create post");
          setIsLoading(false);
          return null;
        }

        // Post created successfully
        toast.success("Post created successfully!");
        setIsLoading(false);

        // Return the post ID if available, otherwise just return success indicator
        return result.value &&
          typeof result.value === "object" &&
          "id" in result.value
          ? { id: result.value.id }
          : { success: true };
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
      setIsLoading(false);
      return null;
    }
  };

  // Helper function to determine media type
  const determineMediaType = (file?: File): MediaImageMimeType => {
    if (!file) return MediaImageMimeType.PNG;

    const mimeType = file.type;

    if (mimeType.includes("png")) {
      return MediaImageMimeType.PNG;
    } else if (mimeType.includes("jpg") || mimeType.includes("jpeg")) {
      return MediaImageMimeType.JPEG;
    } else if (mimeType.includes("webp")) {
      return MediaImageMimeType.WEBP;
    } else if (mimeType.includes("gif")) {
      return MediaImageMimeType.GIF;
    }

    // Default to PNG if we can't determine the type
    return MediaImageMimeType.PNG;
  };

  return { createPost, isLoading };
}
