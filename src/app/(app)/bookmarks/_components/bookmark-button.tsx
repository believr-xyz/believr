"use client";

import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";

interface BookmarkButtonProps {
  postId: string;
  isBookmarked?: boolean;
  onRemove?: () => void;
}

export function BookmarkButton({
  postId,
  isBookmarked: initialState,
  onRemove,
}: BookmarkButtonProps) {
  const { addBookmark, removeBookmark, isBookmarked: checkIsBookmarked } = useBookmarks();
  const [isLoading, setIsLoading] = useState(false);

  // Use provided state if available, otherwise check with the hook
  const isBookmarked = initialState !== undefined ? initialState : checkIsBookmarked(postId);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking button

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(postId);
        if (onRemove) onRemove();
      } else {
        await addBookmark(postId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 rounded-full text-muted-foreground hover:text-primary"
      onClick={handleToggleBookmark}
      disabled={isLoading}
    >
      {isBookmarked ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
    </Button>
  );
}
