import { useEffect, useState } from "react";
import { toast } from "sonner";

// Mock data for the MVP - in a real implementation, we would use Lens API
const MOCK_BOOKMARKS = [
  {
    id: "post-1",
    title: "Launching my NFT collection",
    content:
      "I'm excited to announce my new NFT collection focused on sustainable art. Early believers will get special access to my creative process and exclusive pieces.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    creator: {
      id: "creator-1",
      username: "artcreator",
      name: "Digital Artist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format",
    },
    collectible: {
      price: "0.1",
      currency: "ETH",
      collected: 8,
      total: 20,
    },
    media: {
      url: "https://images.unsplash.com/photo-1639322537229-e3ab60add0cd?w=800&auto=format",
      type: "image",
    },
    isCampaign: true,
  },
  {
    id: "post-2",
    title: "New SaaS Product Launch",
    content:
      "After months of development, I'm ready to launch my new productivity tool. Looking for early believers to support and help shape the future of this platform.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    creator: {
      id: "creator-2",
      username: "techbuild",
      name: "Tech Builder",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format",
    },
    collectible: {
      price: "0.05",
      currency: "ETH",
      collected: 12,
      total: 25,
    },
    media: {
      url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format",
      type: "image",
    },
    isCampaign: true,
  },
  {
    id: "post-3",
    title: "Thoughts on Web3 Development",
    content:
      "Just shared my perspective on the future of web3 development and how it will change the creator economy. Would love to hear your thoughts!",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    creator: {
      id: "creator-3",
      username: "web3sarah",
      name: "Sarah Web3",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
    },
    media: null,
    isCampaign: false,
  },
];

interface UseBookmarksProps {
  category?: string;
}

export function useBookmarks({ category = "all" }: UseBookmarksProps = {}) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(MOCK_BOOKMARKS.map((b) => b.id)));

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      fetchBookmarks();
    }, 800);

    return () => clearTimeout(timer);
  }, [category]);

  const fetchBookmarks = () => {
    setLoading(true);
    try {
      // Filter mock data based on category
      let filteredBookmarks = [...MOCK_BOOKMARKS];

      if (category !== "all") {
        filteredBookmarks = filteredBookmarks.filter((bookmark) =>
          category === "campaigns" ? bookmark.isCampaign : !bookmark.isCampaign,
        );
      }

      setBookmarks(filteredBookmarks);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch bookmarks"));
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (postId: string) => {
    try {
      // In a real implementation, this would call the Lens API
      setSavedIds((prev) => new Set([...prev, postId]));
      toast.success("Post bookmarked successfully");
    } catch (err) {
      console.error("Error adding bookmark:", err);
      toast.error("Failed to bookmark post");
    }
  };

  const removeBookmark = async (postId: string) => {
    try {
      // In a real implementation, this would call the Lens API
      setSavedIds((prev) => {
        const newSet = new Set([...prev]);
        newSet.delete(postId);
        return newSet;
      });

      // If removing from the bookmarks page, also update the bookmarks list
      if (category) {
        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== postId));
      }

      toast.success("Bookmark removed");
    } catch (err) {
      console.error("Error removing bookmark:", err);
      toast.error("Failed to remove bookmark");
    }
  };

  const isBookmarked = (postId: string) => {
    return savedIds.has(postId);
  };

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
  };
}
