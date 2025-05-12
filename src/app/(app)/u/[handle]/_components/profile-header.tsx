"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ExternalLink, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileHeaderProps {
  profile: {
    id: string;
    handle: string;
    name: string;
    bio?: string;
    avatar?: string;
    coverImage?: string;
    location?: string;
    website?: string;
    verified?: boolean;
    stats: {
      posts: number;
      followers: number;
      following: number;
      believers: number;
    };
    isFollowing?: boolean;
  };
  onFollowChange: (isFollowing: boolean, newFollowerCount: number) => void;
}

export function ProfileHeader({ profile, onFollowChange }: ProfileHeaderProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing || false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(profile.stats.followers);

  const handleFollow = async () => {
    setIsFollowLoading(true);
    try {
      // This would be replaced with actual follow/unfollow logic in production
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate transaction

      const newIsFollowing = !isFollowing;
      const newFollowerCount = isFollowing ? followerCount - 1 : followerCount + 1;

      setIsFollowing(newIsFollowing);
      setFollowerCount(newFollowerCount);

      toast.success(isFollowing ? "Unfollowed successfully" : "Followed successfully");

      // Notify parent component
      onFollowChange(newIsFollowing, newFollowerCount);
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      toast.error("Failed to update follow status. Please try again.");
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <div>
      {/* Cover image */}
      <div className="relative mb-16 h-48 w-full overflow-hidden rounded-xl md:h-64">
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="Cover" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-blue-500 to-purple-500" />
        )}

        {/* Profile avatar - positioned to overlap cover and content */}
        <div className="-bottom-16 absolute left-4 rounded-full border-4 border-background md:left-8">
          <Avatar className="size-32">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-2xl">{profile.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        {/* Follow button */}
        <div className="absolute right-4 bottom-4 md:right-8">
          <Button
            onClick={handleFollow}
            disabled={isFollowLoading}
            className={
              isFollowing
                ? "bg-background text-foreground hover:bg-muted"
                : "bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
            }
          >
            {isFollowLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </div>

      {/* Profile info */}
      <div className="mb-6">
        <div className="flex flex-col justify-between md:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-2xl">{profile.name}</h1>
              {profile.verified && <BadgeCheck className="size-5 text-[#00A8FF]" />}
            </div>
            <p className="text-muted-foreground">@{profile.handle}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-8 text-sm md:mt-0">
            <div>
              <span className="font-semibold">{profile.stats.posts}</span>
              <span className="ml-1 text-muted-foreground">Posts</span>
            </div>
            <div>
              <span className="font-semibold">{followerCount}</span>
              <span className="ml-1 text-muted-foreground">Followers</span>
            </div>
            <div>
              <span className="font-semibold">{profile.stats.following}</span>
              <span className="ml-1 text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-semibold">{profile.stats.believers}</span>
              <span className="ml-1 text-muted-foreground">Believers</span>
            </div>
          </div>
        </div>

        {/* Bio and links */}
        {profile.bio && <p className="mt-4">{profile.bio}</p>}

        <div className="mt-4 flex flex-wrap gap-4">
          {profile.location && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin className="size-4" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.website && (
            <a
              href={
                profile.website.startsWith("http") ? profile.website : `https://${profile.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary text-sm hover:underline"
            >
              <ExternalLink className="size-4" />
              <span>{profile.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
