"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileSkeleton } from "./_components/profile-skeleton";
import { ProfileTabs } from "./_components/profile-tabs";

// Types
interface Profile {
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
}

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  image?: string;
  collectible?: {
    price: string;
    currency: string;
    collected: number;
    total: number;
  };
  creator: {
    id: string;
    handle: string;
    name: string;
    avatar?: string;
  };
}

// Mock data for the MVP
const MOCK_PROFILE: Profile = {
  id: "creator-2",
  handle: "gamerbuild",
  name: "Indie Game Studio",
  bio: "Creating the next generation of story-driven games. Building in public. Join our journey as we develop immersive experiences that challenge the status quo of gaming.",
  avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
  coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format",
  location: "San Francisco, CA",
  website: "https://indie-games.example",
  verified: true,
  stats: {
    posts: 42,
    followers: 876,
    following: 124,
    believers: 52,
  },
  isFollowing: false,
};

const MOCK_POSTS: Post[] = [
  {
    id: "post-2",
    content:
      "My indie game studio is creating a new story-driven RPG. Early believers get alpha access and in-game recognition!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format",
    collectible: {
      price: "10",
      currency: "GHO",
      collected: 72,
      total: 100,
    },
    creator: {
      id: "creator-2",
      handle: "gamerbuild",
      name: "Indie Game Studio",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    },
  },
  {
    id: "post-4",
    content:
      "Just released a new demo of our character customization system. Check it out and let us know what you think!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&auto=format",
    creator: {
      id: "creator-2",
      handle: "gamerbuild",
      name: "Indie Game Studio",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    },
  },
  {
    id: "post-5",
    content:
      "Launching our new sound effects collection for game developers. Early believers get exclusive access to premium SFX pack!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    collectible: {
      price: "5",
      currency: "GHO",
      collected: 34,
      total: 50,
    },
    creator: {
      id: "creator-2",
      handle: "gamerbuild",
      name: "Indie Game Studio",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    },
  },
];

function ProfileContent({ handle }: { handle: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "collectibles">("posts");

  // In a real app, you would fetch the profile and posts data based on the handle
  useEffect(() => {
    // Simulate API fetch
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        // This would be API calls in a real app
        await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate network delay

        // For the MVP, we'll use the mock data
        setProfile(MOCK_PROFILE);
        setPosts(MOCK_POSTS);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [handle]);

  const handleFollowChange = (isFollowing: boolean, newFollowerCount: number) => {
    if (profile) {
      setProfile({
        ...profile,
        isFollowing,
        stats: {
          ...profile.stats,
          followers: newFollowerCount,
        },
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "posts" | "collectibles");
  };

  if (isLoading) {
    return null; // This won't be seen as the Suspense fallback will be shown instead
  }

  if (!profile) {
    return (
      <div className="flex h-80 flex-col items-center justify-center text-center">
        <h2 className="mb-2 font-semibold text-xl">Profile not found</h2>
        <p className="mb-4 text-muted-foreground">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/discover")}>Discover Creators</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ProfileHeader profile={profile} onFollowChange={handleFollowChange} />

      <div className="px-5">
        <ProfileTabs posts={posts} activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const handle = params.handle as string;

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent handle={handle} />
      </Suspense>
    </div>
  );
}
