"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface FollowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The user ID to follow
   */
  userId: string;
  /**
   * The username to follow (for navigation)
   */
  username: string;
  /**
   * Whether the user is already being followed
   */
  isFollowing?: boolean;
  /**
   * The size of the button
   */
  size?: "default" | "sm" | "lg" | "icon";
  /**
   * The variant of the button
   */
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  /**
   * Callback function when follow state changes
   */
  onFollowChange?: (isFollowing: boolean) => void;
  /**
   * Whether to show text inside the button
   */
  showText?: boolean;
  /**
   * Whether to use a rounded style
   */
  rounded?: boolean;
}

/**
 * A reusable button component for following/unfollowing users
 */
export function FollowButton({
  userId,
  username,
  isFollowing: initialIsFollowing = false,
  size = "default",
  variant: initialVariant = "default",
  onFollowChange,
  showText = true,
  rounded = false,
  className,
  ...props
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useAuthenticatedUser();

  // Determine button variant based on follow state
  const variant = isFollowing ? "outline" : initialVariant;

  const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.address) {
      toast.error("Please sign in to follow users");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement real follow functionality using Lens SDK
      // This is a placeholder that simulates the behavior
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newIsFollowing = !isFollowing;
      setIsFollowing(newIsFollowing);

      if (newIsFollowing) {
        toast.success(`Followed @${username}`);
      } else {
        toast.success(`Unfollowed @${username}`);
      }

      if (onFollowChange) {
        onFollowChange(newIsFollowing);
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      toast.error("Failed to update follow status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleFollow}
      disabled={isLoading}
      className={cn(
        {
          "bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90": !isFollowing && variant === "default",
          "rounded-full": rounded,
        },
        className,
      )}
      {...props}
    >
      {isLoading ? "" : showText ? (isFollowing ? "Following" : "Follow") : null}
      {!showText &&
        !isLoading &&
        (isFollowing ? <Check className="size-4" /> : <Plus className="size-4" />)}
    </Button>
  );
}
