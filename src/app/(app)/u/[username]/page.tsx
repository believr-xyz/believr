"use client";

import { Button } from "@/components/ui/button";
import { useAccount } from "@lens-protocol/react";
import { fetchAccountStats } from "@lens-protocol/client/actions";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileSkeleton } from "./_components/profile-skeleton";
import { ProfileTabs } from "./_components/profile-tabs";
import { getLensClient } from "@/lib/lens/client";
import { Account, AccountStats } from "@lens-protocol/client";

// Mock data for the MVP - will be removed once the posts feature is implemented
const MOCK_POSTS = [
  {
    id: "post-2",
    content:
      "My indie game studio is creating a new story-driven RPG. Early believers get alpha access and in-game recognition!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format",
    collectible: {
      price: "10",
      currency: "GHO",
      collected: 72,
      total: 100,
    },
    creator: {
      id: "creator-2",
      username: "gamerbuild",
      name: "Indie Game Studio",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    },
  },
  {
    id: "post-4",
    content:
      "Just released a new demo of our character customization system. Check it out and let us know what you think!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    image:
      "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&auto=format",
    creator: {
      id: "creator-2",
      username: "gamerbuild",
      name: "Indie Game Studio",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
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
      username: "gamerbuild",
      name: "Indie Game Studio",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    },
  },
];

function ProfileContent({ username }: { username: string }) {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [accountStats, setAccountStats] = useState<AccountStats | null>(null);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState<"posts" | "collectibles">("posts");

  // Use the Lens useAccount hook directly
  const {
    data: lensAccount,
    loading: accountLoading,
    error: accountError,
  } = useAccount({
    username: {
      localName: username,
    },
  });

  // Fetch account stats separately
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<Error | null>(null);

  // Set the account when it's loaded
  useEffect(() => {
    if (lensAccount) {
      setAccount(lensAccount);
    }
  }, [lensAccount]);

  // Fetch account stats
  useEffect(() => {
    async function fetchStats() {
      if (!lensAccount) return;

      setStatsLoading(true);
      try {
        const client = await getLensClient();
        const result = await fetchAccountStats(client, {
          account: lensAccount.address,
        });

        if (result.isOk()) {
          setAccountStats(result.value);
        } else {
          setStatsError(result.error);
        }
      } catch (error) {
        setStatsError(
          error instanceof Error ? error : new Error(String(error))
        );
      } finally {
        setStatsLoading(false);
      }
    }

    if (lensAccount) {
      fetchStats();
    }
  }, [lensAccount]);

  // Show error toast if there was a problem fetching the profile
  useEffect(() => {
    if (accountError || statsError) {
      console.error("Error loading profile:", accountError || statsError);
      toast.error("Failed to load profile data");
    }
  }, [accountError, statsError]);

  const handleFollowChange = (
    isFollowing: boolean,
    newFollowerCount: number
  ) => {
    // This will be implemented properly with the follow feature
    // For now, just update the UI state
    if (accountStats) {
      setAccountStats({
        ...accountStats,
        graphFollowStats: {
          ...accountStats.graphFollowStats,
          followers: newFollowerCount,
        },
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "posts" | "collectibles");
  };

  const loading = accountLoading || statsLoading;

  if (loading) {
    return null; // This won't be seen as the Suspense fallback will be shown instead
  }

  if (accountError || statsError) {
    return (
      <div className="flex h-80 flex-col items-center justify-center text-center">
        <h2 className="mb-2 font-semibold text-xl">Error Loading Profile</h2>
        <p className="mb-4 text-muted-foreground">
          We encountered a problem while trying to load this profile.
        </p>
        <Button onClick={() => router.push("/feed")}>Return to Feed</Button>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex h-80 flex-col items-center justify-center text-center">
        <h2 className="mb-2 font-semibold text-xl">Profile not found</h2>
        <p className="mb-4 text-muted-foreground">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/feed")}>Return to Feed</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ProfileHeader
        account={account}
        stats={accountStats}
        onFollowChange={handleFollowChange}
      />

      <div className="px-5">
        <ProfileTabs
          posts={posts}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent username={username} />
      </Suspense>
    </div>
  );
}
