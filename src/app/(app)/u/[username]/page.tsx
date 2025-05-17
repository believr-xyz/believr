"use client";

import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { getLensClient } from "@/lib/lens/client";
import { Account, AccountStats, PageSize } from "@lens-protocol/client";
import { evmAddress } from "@lens-protocol/client";
import { fetchAccountStats } from "@lens-protocol/client/actions";
import { useAccount, usePosts } from "@lens-protocol/react";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trending } from "../../feed/_components/trending";
import { TrendingSkeleton } from "../../feed/_components/trending-skeleton";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileSkeleton } from "./_components/profile-skeleton";
import { ProfileTabs } from "./_components/profile-tabs";

// Mock data - this will be replaced with real data from the API
const MOCK_TRENDING_CREATORS = [
  {
    id: "creator-1",
    name: "Sarah Web3",
    username: "web3sarah",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
    stats: {
      followers: 1245,
      believers: 78,
    },
  },
  {
    id: "creator-2",
    name: "Indie Game Studio",
    username: "gamerbuild",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    stats: {
      followers: 876,
      believers: 52,
    },
  },
  {
    id: "creator-3",
    name: "Tech Podcaster",
    username: "techpodcaster",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format",
    stats: {
      followers: 3422,
      believers: 156,
    },
  },
];

// Mock trending campaigns
const MOCK_TRENDING_CAMPAIGNS = [
  {
    id: "post-1",
    title: "New SaaS Productivity Tool",
    creator: {
      id: "creator-1",
      name: "Sarah Web3",
      username: "web3sarah",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
    },
    collectible: {
      price: "5",
      currency: "GHO",
      collected: 28,
      total: 50,
    },
  },
  {
    id: "post-2",
    title: "Story-Driven RPG Game",
    creator: {
      id: "creator-2",
      name: "Indie Game Studio",
      username: "gamerbuild",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format",
    },
    collectible: {
      price: "10",
      currency: "GHO",
      collected: 72,
      total: 100,
    },
  },
];

function TrendingContent() {
  // This function would fetch and display trending content from Lens API in a real app
  return (
    <Trending
      creators={MOCK_TRENDING_CREATORS}
      campaigns={MOCK_TRENDING_CAMPAIGNS}
    />
  );
}

function ProfileContent({ username }: { username: string }) {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [accountStats, setAccountStats] = useState<AccountStats | null>(null);
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

  // Fetch posts by this user
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = usePosts({
    filter: lensAccount
      ? {
          authors: [evmAddress(lensAccount.address)],
        }
      : undefined,
    pageSize: PageSize.Ten,
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
    if (accountError || statsError || postsError) {
      console.error(
        "Error loading profile data:",
        accountError || statsError || postsError
      );
      toast.error("Failed to load profile data");
    }
  }, [accountError, statsError, postsError]);

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
      {/* Mobile Search - Only visible on mobile */}
      <div className="mb-6 block px-5 md:hidden">
        <SearchBar className="w-full" />
      </div>

      {/* Grid layout for main content and sidebar */}
      <div className="grid grid-cols-1 gap-6 px-5 md:grid-cols-3 md:gap-8">
        {/* Main Profile Content */}
        <div className="md:col-span-2">
          <ProfileHeader
            account={account}
            stats={accountStats}
            onFollowChange={handleFollowChange}
          />

          <div className="mt-6">
            <ProfileTabs
              posts={postsData?.items || []}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              loading={postsLoading}
            />
          </div>
        </div>

        {/* Right Sidebar - Sticky */}
        <div className="hidden md:block">
          <div className="sticky top-16 space-y-6">
            {/* Search bar in the sidebar */}
            <div className="mt-1">
              <SearchBar className="w-full" />
            </div>

            <Suspense fallback={<TrendingSkeleton />}>
              <TrendingContent />
            </Suspense>
          </div>
        </div>
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
