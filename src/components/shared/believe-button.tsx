"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AwardIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export interface BelieveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The post ID to believe in
   */
  postId: string;
  /**
   * The username of the creator (for navigation after collect)
   */
  creatorUsername: string;
  /**
   * Whether the post is already believed
   */
  isBelieved?: boolean;
  /**
   * The price to believe (collect)
   */
  price?: string;
  /**
   * The currency for believing (collecting)
   */
  currency?: string;
  /**
   * The size of the button
   */
  size?: "default" | "sm" | "lg" | "icon";
  /**
   * The variant of the button
   */
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  /**
   * Callback function when believe state changes
   */
  onBelieveChange?: (isBelieved: boolean) => void;
  /**
   * Whether to show the believe icon
   */
  showIcon?: boolean;
}

/**
 * A reusable button component for believing in (collecting) posts
 */
export function BelieveButton({
  postId,
  creatorUsername,
  isBelieved: initialIsBelieved = false,
  price,
  currency,
  size = "default",
  variant = "default",
  onBelieveChange,
  showIcon = true,
  className,
  children,
  ...props
}: BelieveButtonProps) {
  const router = useRouter();
  const [isBelieved, setIsBelieved] = useState(initialIsBelieved);
  const [isLoading, setIsLoading] = useState(false);

  const handleBelieve = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBelieved) {
      // If already believed, navigate to the creator's profile
      router.push(`/u/${creatorUsername}`);
      return;
    }

    setIsLoading(true);
    try {
      // This would be replaced with actual collect logic in production
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setIsBelieved(true);
      toast.success("Successfully believed in this post!");

      // Notify parent component if callback provided
      if (onBelieveChange) {
        onBelieveChange(true);
      }
    } catch (error) {
      console.error("Error believing in post:", error);
      toast.error("Failed to believe in post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Default button text
  const buttonText = isBelieved
    ? "View Creator"
    : price && currency
      ? `Believe (${price} ${currency})`
      : "Believe";

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBelieve}
      isLoading={isLoading}
      className={cn(
        {
          "bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90": variant === "default",
        },
        className,
      )}
      {...props}
    >
      {!isLoading && showIcon && !isBelieved && <AwardIcon className="mr-1.5 size-4" />}
      {children || buttonText}
    </Button>
  );
}
