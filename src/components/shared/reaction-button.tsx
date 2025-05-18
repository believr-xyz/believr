"use client";

import { Button } from "@/components/ui/button";
import { usePostReaction } from "@/hooks/use-post-reaction";
import { HeartIcon } from "lucide-react";

interface ReactionButtonProps {
  postId: string;
  isReacted?: boolean;
  reactionCount?: number;
  showCount?: boolean;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "ghost" | "outline" | "secondary";
  className?: string;
  onReactionChange?: (isReacted: boolean) => void;
}

export function ReactionButton({
  postId,
  isReacted: initialReacted = false,
  reactionCount = 0,
  showCount = true,
  size = "sm",
  variant = "ghost",
  className = "",
  onReactionChange,
}: ReactionButtonProps) {
  // Use our custom hook for reaction functionality
  const { isReacted, isLoading, toggleReaction } = usePostReaction(
    postId,
    initialReacted,
    onReactionChange,
  );

  // Handle click and prevent event propagation
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking button
    toggleReaction();
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={`gap-1 ${
        isReacted ? "text-red-500" : "text-muted-foreground hover:text-red-500"
      } ${className}`}
      onClick={handleClick}
      isLoading={isLoading}
    >
      {!isLoading && (
        <>
          <HeartIcon className="size-4" fill={isReacted ? "currentColor" : "none"} />
          {showCount && <span>{reactionCount}</span>}
        </>
      )}
    </Button>
  );
}
