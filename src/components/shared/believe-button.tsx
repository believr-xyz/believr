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

interface BelieveButtonProps {
  postId: string;
  username: string;
}

export function BelieveButton({ postId, username }: BelieveButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [believed, setBelieved] = useState(false);

  const handleBelieve = () => {
    // This would be connected to the Lens client in a real implementation
    // For now, just simulate success
    setTimeout(() => {
      setShowModal(false);
      setBelieved(true);
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
              className="gap-1 text-green-500 hover:text-green-600"
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
      <Button size="sm" variant="default" className="gap-1" onClick={() => setShowModal(true)}>
        <Star className="size-4" />
        <span>Believe</span>
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Become an Early Believer</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="mb-4">
              You're about to believe in @{username}'s journey! Early believers get special perks
              and recognition.
            </p>
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
