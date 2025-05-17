"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCheck, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface BelieveButtonProps {
  postId: string;
  username?: string;
  creatorUsername?: string; // Added to support both naming conventions
  isBelieved?: boolean;
  price?: string;
  currency?: string;
  className?: string;
  onBelieveChange?: (isBelieved: boolean) => void;
}

export function BelieveButton({
  postId,
  username,
  creatorUsername,
  isBelieved: externalBelieved,
  price,
  currency,
  className = "",
  onBelieveChange,
}: BelieveButtonProps) {
  // Use either username or creatorUsername, preferring creatorUsername if provided
  const displayUsername = creatorUsername || username || "";

  const [showModal, setShowModal] = useState(false);
  // Use external state if provided, otherwise manage internally
  const [internalBelieved, setInternalBelieved] = useState(false);

  // Use the external state if provided, otherwise use internal state
  const believed = externalBelieved !== undefined ? externalBelieved : internalBelieved;

  const handleBelieve = () => {
    // This would be connected to the Lens client in a real implementation
    // For now, just simulate success
    setTimeout(() => {
      setShowModal(false);

      // Update internal state if not controlled externally
      if (externalBelieved === undefined) {
        setInternalBelieved(true);
      }

      // Notify parent component if callback provided
      if (onBelieveChange) {
        onBelieveChange(true);
      }

      toast.success("You are now an early believer!");
    }, 1000);
  };

  if (believed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className={`gap-1 text-green-500 hover:text-green-600 ${className}`}
            >
              <CheckCheck className="size-4" />
              <span>Believed</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>You're an early believer!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="default"
        className={`gap-1 ${className}`}
        onClick={() => setShowModal(true)}
      >
        <Star className="size-4" />
        <span>Believe{price ? ` · ${price} ${currency}` : ""}</span>
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Become an Early Believer</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="mb-4">
              You're about to believe in @{displayUsername}'s journey! Early believers get special
              perks and recognition.
            </p>
            {price && (
              <p className="mb-4 font-medium">
                Cost: {price} {currency}
              </p>
            )}
            <ul className="mb-4 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <CheckCheck className="size-4 text-green-500" />
                <span>Early believer badge</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCheck className="size-4 text-green-500" />
                <span>Priority access to future updates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCheck className="size-4 text-green-500" />
                <span>Shared on-chain proof of belief</span>
              </li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleBelieve}>Believe Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
