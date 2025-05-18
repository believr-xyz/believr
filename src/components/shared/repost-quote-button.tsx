"use client";

import { Button } from "@/components/ui/button";
import { usePostQuote } from "@/hooks/use-post-quote";
import { usePostRepost } from "@/hooks/use-post-repost";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareQuoteIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";

interface RepostQuoteButtonProps {
  postId: string;
  count?: number;
  showCount?: boolean;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "ghost" | "outline" | "secondary";
  className?: string;
  onRepostSubmit?: () => void;
  onQuoteSubmit?: () => void;
}

export function RepostQuoteButton({
  postId,
  count = 0,
  showCount = true,
  size = "sm",
  variant = "ghost",
  className = "",
  onRepostSubmit,
  onQuoteSubmit,
}: RepostQuoteButtonProps) {
  const { isLoading: isRepostLoading, createRepost } = usePostRepost(
    postId,
    onRepostSubmit
  );
  const { isLoading: isQuoteLoading, createQuote } = usePostQuote(
    postId,
    onQuoteSubmit
  );
  const [quote, setQuote] = useState("");
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);

  const handleRepost = async () => {
    await createRepost();
  };

  const handleQuoteSubmit = async () => {
    await createQuote(quote);
    setQuote("");
    setIsQuoteDialogOpen(false);
  };

  // Handle click and prevent event propagation
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking button
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={size}
            variant={variant}
            className={`gap-1 px-2 text-muted-foreground ${className}`}
            onClick={handleClick}
          >
            <RefreshCwIcon className="size-4" />
            {showCount && <span>{count}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="gap-2"
            onClick={handleRepost}
            disabled={isRepostLoading}
          >
            <RefreshCwIcon className="size-4" />
            <span>Repost</span>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem className="gap-2">
              <MessageSquareQuoteIcon className="size-4" />
              <span>Quote post</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote this post</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Add your thoughts..."
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={5}
            className="mt-2"
          />
          <DialogFooter>
            <Button
              onClick={handleQuoteSubmit}
              disabled={isQuoteLoading || !quote.trim()}
              className="mt-4"
            >
              {isQuoteLoading ? "Submitting..." : "Quote Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
