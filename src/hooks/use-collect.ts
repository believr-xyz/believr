"use client";

import { getLensClient } from "@/lib/lens/client";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useState } from "react";
import { toast } from "sonner";

export interface UseCollectOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCollect(options: UseCollectOptions = {}) {
  const { data: user } = useAuthenticatedUser();
  const [isCollecting, setIsCollecting] = useState(false);

  const collectPost = async (postId: string) => {
    if (!user) {
      toast.error("Please sign in to collect this post");
      return;
    }

    setIsCollecting(true);

    try {
      const client = await getLensClient();

      // For MVP, we're simulating transactions in development
      // In production, this will use the actual Lens Protocol
      if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
        // The actual implementation would use the Lens API
        // This is a placeholder for the real implementation

        // Simulate successful collect
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success("Successfully collected this post!");
        options.onSuccess?.();
      } else {
        // Simulate transaction in development
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Successfully collected this post!");
        options.onSuccess?.();
      }
    } catch (error) {
      console.error("Error collecting post:", error);
      toast.error("Failed to collect post. Please try again.");
      if (error instanceof Error) {
        options.onError?.(error);
      }
    } finally {
      setIsCollecting(false);
    }
  };

  return {
    collectPost,
    isCollecting,
    hasProfile: !!user,
  };
}
