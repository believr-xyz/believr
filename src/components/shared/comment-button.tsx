"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { usePostComment } from "@/hooks/use-post-comment";
import { MessageCircleIcon } from "lucide-react";
import { useState } from "react";

interface CommentButtonProps {
  postId: string;
  commentCount?: number;
  showCount?: boolean;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "ghost" | "outline" | "secondary";
  className?: string;
  onCommentSubmit?: () => void;
}

export function CommentButton({
  postId,
  commentCount = 0,
  showCount = true,
  size = "sm",
  variant = "ghost",
  className = "",
  onCommentSubmit,
}: CommentButtonProps) {
  const { isLoading, createComment } = usePostComment(postId, onCommentSubmit);
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    await createComment(comment);
    setComment("");
    setIsOpen(false);
  };

  // Handle click and prevent event propagation
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking button
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={`gap-1 px-2 text-muted-foreground ${className}`}
          onClick={handleClick}
        >
          <MessageCircleIcon className="size-4" />
          {showCount && <span>{commentCount}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a comment</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="mt-2"
        />
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading || !comment.trim()} className="mt-4">
            {isLoading ? "Submitting..." : "Comment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
