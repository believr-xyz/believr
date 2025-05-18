"use client";

import { BookmarkToggleButton } from "@/components/shared/bookmark-toggle-button";
import { ReactionButton } from "@/components/shared/reaction-button";
import { RepostQuoteButton } from "@/components/shared/repost-quote-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLensClient } from "@/lib/lens/client";
import { Post, PostReferenceType, postId } from "@lens-protocol/client";
import { fetchPost, fetchPostReferences } from "@lens-protocol/client/actions";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, DollarSign, Loader2, MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CollectCard } from "./_components/collect-card";
import { CollectorsList } from "./_components/collectors-list";
import { CommentSection } from "./_components/comment-section";

export default function PostPage() {
  const router = useRouter();
  const params = useParams();
  const lensPostId = params.id as string;
  const creatorUsername = params.username as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCollected, setHasCollected] = useState(false);

  // Fetch the post data from Lens Protocol
  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      try {
        // Get the Lens client
        const client = await getLensClient();

        // Fetch the post data using the fetchPost function from the SDK
        const result = await fetchPost(client, {
          post: postId(lensPostId),
        });

        if (result.isErr()) {
          toast.error("Failed to load post");
          console.error(result.error);
          setIsLoading(false);
          return;
        }

        const postData = result.value as Post;
        if (!postData) {
          toast.error("Post not found");
          setIsLoading(false);
          return;
        }

        // Store the post
        setPost(postData);

        // Fetch comments for the post
        const commentsResult = await fetchPostReferences(client, {
          referenceTypes: [PostReferenceType.CommentOn],
          referencedPost: postId(lensPostId),
        });

        if (commentsResult.isOk()) {
          // Filter to get only Post type comments
          const commentPosts = commentsResult.value.items.filter(
            (item) => item.__typename === "Post",
          ) as Post[];

          setComments(commentPosts);
        } else {
          console.error("Failed to fetch comments:", commentsResult.error);
        }

        // Check if user has collected this post (simplified implementation for now)
        setHasCollected(false);
      } catch (error) {
        console.error("Error loading post:", error);
        toast.error("Failed to load post details");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [lensPostId, creatorUsername]);

  // Handle collect action
  const handleCollect = () => {
    if (post) {
      // Update local state to reflect collection (simplified)
      // In a real implementation, this would trigger an actual collect transaction
      toast.success("Collected post!");
    }
  };

  // Handle adding a new comment
  const handleCommentAdded = (newComment: Post) => {
    setComments((prev) => [newComment, ...prev]);
  };

  // Handle reaction change
  const handleReactionChange = (isReacted: boolean) => {
    if (post) {
      // Update local reaction count (simplified)
      // In a real implementation, this would be handled by a query refresh
      toast.success(isReacted ? "Reaction added!" : "Reaction removed!");
    }
  };

  // Handle repost/quote count change
  const handleRepostChange = () => {
    if (post) {
      // Update local repost count (simplified)
      // In a real implementation, this would be handled by a query refresh
      toast.success("Post shared!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex h-80 flex-col items-center justify-center text-center">
        <h2 className="mb-2 font-semibold text-xl">Post not found</h2>
        <p className="mb-4 text-muted-foreground">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/feed")}>Back to Feed</Button>
      </div>
    );
  }

  // Extract post metadata
  const timestamp = new Date(post.timestamp);
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  // Get username
  const username =
    post.author.username?.value?.split("/").pop() || post.author.address.substring(0, 8);

  // Get collect action if any
  const collectAction = post.actions?.find((action) => action.__typename === "SimpleCollectAction");

  // Get image URL if available
  const imageUrl = (() => {
    if (post.metadata?.__typename === "ImageMetadata" && post.metadata.image) {
      if (typeof post.metadata.image === "string") {
        return post.metadata.image;
      }
      return post.metadata.image.item || "";
    }
    return "";
  })();

  // Get content based on metadata type
  const content = (() => {
    if (!post.metadata) return "";

    if (post.metadata.__typename === "TextOnlyMetadata") {
      return post.metadata.content;
    } else if (post.metadata.__typename === "ArticleMetadata") {
      return post.metadata.content;
    } else if (post.metadata.__typename === "ImageMetadata") {
      return post.metadata.content;
    } else if (post.metadata.__typename === "VideoMetadata") {
      return post.metadata.content;
    } else if (post.metadata.__typename === "AudioMetadata") {
      return post.metadata.content;
    } else {
      return (post.metadata as any)?.content || "";
    }
  })();

  // Get title based on metadata type
  const title = (() => {
    if (!post.metadata) return "Untitled Post";

    if (post.metadata.__typename === "ArticleMetadata") {
      return post.metadata.title || "Untitled Post";
    } else if (post.metadata.__typename === "VideoMetadata") {
      return post.metadata.title || "Untitled Post";
    } else if (post.metadata.__typename === "AudioMetadata") {
      return post.metadata.title || "Untitled Post";
    } else {
      return (post.metadata as any)?.title || "Untitled Post";
    }
  })();

  // Get author picture
  const authorPicture = (() => {
    const pic = post.author.metadata?.picture;
    if (!pic) return "";
    if (typeof pic === "string") return pic;
    return pic.item || "";
  })();

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-1 px-0"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {imageUrl && (
              <div className="w-full overflow-hidden">
                <div className="relative aspect-video w-full">
                  <Image src={imageUrl} alt={title} fill className="object-cover" />
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar
                    className="size-10 cursor-pointer"
                    onClick={() => router.push(`/u/${username}`)}
                  >
                    <AvatarImage src={authorPicture} alt={post.author.metadata?.name || username} />
                    <AvatarFallback>
                      {(post.author.metadata?.name?.[0] || username[0]).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3
                        className="font-semibold hover:underline"
                        onClick={() => router.push(`/u/${username}`)}
                      >
                        {post.author.metadata?.name || username}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-muted-foreground text-sm">@{username}</p>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs">{timeAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ReactionButton
                    postId={post.id}
                    reactionCount={post.stats?.upvotes || 0}
                    isReacted={post.operations?.hasUpvoted || false}
                    onReactionChange={handleReactionChange}
                    variant="ghost"
                    size="icon"
                  />
                  <RepostQuoteButton
                    postId={post.id}
                    count={(post.stats?.reposts || 0) + (post.stats?.quotes || 0)}
                    variant="ghost"
                    size="icon"
                    onRepostSubmit={handleRepostChange}
                    onQuoteSubmit={handleRepostChange}
                  />
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <DollarSign className="size-4" />
                  </Button>
                  <BookmarkToggleButton
                    postId={post.id}
                    isBookmarked={post.operations?.hasBookmarked}
                  />
                </div>
              </div>

              <h1 className="mb-4 font-bold text-2xl">{title}</h1>
              <div className="whitespace-pre-line text-base">{content}</div>

              <div className="mt-8">
                <Tabs defaultValue="comments">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comments">
                      <MessageCircleIcon className="mr-2 size-4" />
                      Comments ({comments.length})
                    </TabsTrigger>
                    <TabsTrigger value="collectors">
                      <Badge className="mr-2 bg-[#00A8FF]">{post.stats?.collects || 0}</Badge>
                      Believers
                    </TabsTrigger>
                  </TabsList>
                  <Separator className="my-4" />
                  <TabsContent value="comments" className="mt-0 pt-4">
                    <CommentSection
                      postId={post.id}
                      comments={comments}
                      onCommentAdded={handleCommentAdded}
                    />
                  </TabsContent>
                  <TabsContent value="collectors" className="mt-0 pt-4">
                    <CollectorsList collectors={[]} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <CollectCard
            postId={post.id}
            price={"0"}
            currency={"ETH"}
            collected={post.stats?.collects || 0}
            total={
              collectAction?.__typename === "SimpleCollectAction"
                ? collectAction.collectLimit || 100
                : 100
            }
            creator={{
              id: post.author.address,
              username,
              name: post.author.metadata?.name || username,
              avatar: authorPicture,
              stats: {
                followers: 0, // Would need an additional API call
                believers: post.stats?.collects || 0,
              },
            }}
            onCollect={handleCollect}
          />
        </div>
      </div>
    </div>
  );
}
