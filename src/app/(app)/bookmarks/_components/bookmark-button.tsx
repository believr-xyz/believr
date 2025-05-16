"use client";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useState } from "react";

interface BookmarkButtonProps {
  postId: string;
  isBookmarked?: boolean;
  onRemove?: () => void;
}

export function BookmarkButton({
  postId,
  isBookmarked: initialState = false,
  onRemove,
}: BookmarkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder function for bookmark toggle
  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking button
    console.log("Bookmark functionality is currently disabled");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 rounded-full text-muted-foreground hover:text-primary"
      onClick={handleToggleBookmark}
      disabled={isLoading}
    >
      <Bookmark className="size-5" />
    </Button>
  );
}
