"use client";

import { getLensClient } from "@/lib/lens/client";
import { storageClient } from "@/lib/lens/storage-client";
import { type Post, SessionClient, uri } from "@lens-protocol/client";
import { post } from "@lens-protocol/client/actions";
import {
  article,
  image,
  textOnly,
  MediaImageMimeType,
  TextOnlyMetadata,
  ImageMetadata,
  ArticleMetadata,
} from "@lens-protocol/metadata";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useState } from "react";
import { toast } from "sonner";

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

      // If we don't have a session client, we can't perform authenticated operations
      if (!("storage" in client)) {
        toast.error("Authentication required");
        setIsLoading(false);
        return null;
      }

      const sessionClient = client as SessionClient;

      // Create metadata based on content type
      let metadata: TextOnlyMetadata | ImageMetadata | ArticleMetadata;

      if (input.imageFile) {
        // For image posts, create image metadata
        const dataUrl = await fileToDataUrl(input.imageFile);

        // Get MIME type from file
        const mimeType = input.imageFile.type;
        let imageType = MediaImageMimeType.PNG; // Default

        if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
          imageType = MediaImageMimeType.JPEG;
        } else if (mimeType.includes("png")) {
          imageType = MediaImageMimeType.PNG;
        } else if (mimeType.includes("webp")) {
          imageType = MediaImageMimeType.WEBP;
        } else if (mimeType.includes("gif")) {
          imageType = MediaImageMimeType.GIF;
        }

        // Create image metadata
        metadata = image({
          title: input.title,
          content: input.content,
          image: {
            item: dataUrl, // Using Data URL directly for simplicity
            type: imageType,
          },
        });
      } else if (input.title) {
        // For posts with titles, create article metadata
        metadata = article({
          title: input.title,
          content: input.content,
        });
      } else {
        // For simple text posts, create text-only metadata
        metadata = textOnly({
          content: input.content,
        });
      }

      // For simplicity, we'll use the direct string representation
      // This works fine for basic posts but isn't ideal for production
      const metadataURI = uri(await metadata.toString());

      // Create the post request
      const createPostRequest = {
        contentUri: metadataURI,
        actions: input.collectible
          ? [
              {
                simpleCollect: {
                  // Add collect settings if enabled
                  ...(input.collectSettings?.supply
                    ? {
                        collectLimit: Number.parseInt(
                          input.collectSettings.supply
                        ),
                      }
                    : {}),
                },
              },
            ]
          : undefined,
      };

      // Post to Lens
      const result = await post(sessionClient, createPostRequest);

      if (result.isErr()) {
        console.error("Error creating post:", result.error);
        toast.error(`Failed to create post: ${result.error.message}`);
        return null;
      }

      toast.success("Post created successfully!");
      return result.value;
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPost,
    isLoading,
  };
}

// Helper function to convert a file to a data URL
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
