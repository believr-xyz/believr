"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: (newComment: Comment) => void;
}

export function CommentSection({ postId, comments, onCommentAdded }: CommentSectionProps) {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      // This would be replaced with actual comment creation in production
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Create a new comment object
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content: commentText,
        createdAt: new Date(),
        author: {
          // This would be the current user in production
          id: "current-user",
          username: "current.lens",
          name: "Current User",
          avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&auto=format",
        },
      };

      // Call the callback to update parent component
      onCommentAdded(newComment);

      // Reset the form
      setCommentText("");
      toast.success("Comment posted!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  return (
    <div>
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&auto=format"
              alt="Your avatar"
            />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              className="w-full rounded-lg border bg-transparent p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Write a comment..."
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={!commentText.trim()}
                className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Avatar
                  className="size-8 cursor-pointer"
                  onClick={() => router.push(`/u/${comment.author.username}`)}
                >
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span
                      className="cursor-pointer font-semibold hover:underline"
                      onClick={() => router.push(`/u/${comment.author.username}`)}
                    >
                      {comment.author.name}
                    </span>
                    {comment.author.verified && <BadgeCheck className="size-3 text-[#00A8FF]" />}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <span>@{comment.author.username}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(comment.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
