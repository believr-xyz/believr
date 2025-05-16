"use client";

import { cn } from "@/lib/utils";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { Bell, Bookmark, Home, PlusCircle, Search, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNavigation() {
  const pathname = usePathname();
  const { data: user } = useAuthenticatedUser();
  const isAuthenticated = !!user;

  // Don't show navigation on landing page
  if (pathname === "/") {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 z-10 w-full border-border border-t bg-background md:hidden">
      <nav className="grid h-14 grid-cols-5 items-center">
        <Link
          href="/feed"
          className={cn(
            "flex flex-col items-center justify-center text-center transition-colors",
            pathname.startsWith("/feed") ? "text-[#00A8FF]" : "text-muted-foreground",
          )}
        >
          <Home className="size-5" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          href="/explore"
          className={cn(
            "flex flex-col items-center justify-center text-center transition-colors",
            pathname.startsWith("/explore") ? "text-[#00A8FF]" : "text-muted-foreground",
          )}
        >
          <Search className="size-5" />
          <span className="text-xs">Explore</span>
        </Link>

        <Link
          href="/posts/create"
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-[#00A8FF] text-white">
            <PlusCircle className="size-6" />
          </div>
        </Link>

        <Link
          href="/bookmarks"
          className={cn(
            "flex flex-col items-center justify-center text-center transition-colors",
            pathname.startsWith("/bookmarks") ? "text-[#00A8FF]" : "text-muted-foreground",
          )}
        >
          <Bookmark className="size-5" />
          <span className="text-xs">Saved</span>
        </Link>

        <Link
          href="/notifications"
          className={cn(
            "relative flex flex-col items-center justify-center text-center transition-colors",
            pathname.startsWith("/notifications") ? "text-[#00A8FF]" : "text-muted-foreground",
          )}
        >
          <div className="relative">
            <Bell className="size-5" />
            {/* Simple static implementation without hooks */}
          </div>
          <span className="text-xs">Alerts</span>
        </Link>
      </nav>
    </div>
  );
}
