"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

  // Determine button variant based on follow state
  const variant = isFollowing ? "outline" : initialVariant;

  const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
      // This would be replaced with actual follow/unfollow logic in production
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call

      const newIsFollowing = !isFollowing;
      setIsFollowing(newIsFollowing);

      toast.success(isFollowing ? "Unfollowed successfully" : "Followed successfully");

      // Notify parent component if callback provided
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
      isLoading={isLoading}
      className={cn(
        {
          "bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90": !isFollowing && variant === "default",
          "rounded-full": rounded,
        },
        className,
      )}
      {...props}
    >
      {showText && !isLoading && (isFollowing ? "Following" : "Follow")}
    </Button>
  );
}
