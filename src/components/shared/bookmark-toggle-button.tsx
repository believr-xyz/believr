"use client";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BookmarkToggleButtonProps {
  postId: string;
  isBookmarked?: boolean;
  onRemove?: () => void;
}

export function BookmarkToggleButton({
  postId,
  isBookmarked: initialState = false,
  onRemove,
}: BookmarkToggleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialState);

  // Toggle bookmark
  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking button

    setIsLoading(true);
    try {
      // This would be replaced with actual bookmark toggle in production
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call

      const newState = !isBookmarked;
      setIsBookmarked(newState);

      if (newState) {
        toast.success("Post bookmarked");
      } else {
        toast.success("Bookmark removed");
        if (onRemove) onRemove();
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`size-8 rounded-full ${
        isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
      }`}
      onClick={handleToggleBookmark}
      isLoading={isLoading}
    >
      {!isLoading && <Bookmark className="size-5" fill={isBookmarked ? "currentColor" : "none"} />}
    </Button>
  );
}
