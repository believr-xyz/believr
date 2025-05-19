"use client";

import { Login } from "@/components/auth/login";
import { ProfileMenu } from "@/components/auth/user-menu";
import { Logo } from "@/components/layout/logo";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthenticatedUser } from "@lens-protocol/react";
import {
  Bell,
  House,
  Sparkle,
  Users as UsersIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const { data: user } = useAuthenticatedUser();

  // Handle cross-tab authentication changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes("lens.auth")) {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Simple conditional rendering based on auth state
  return user ? (
    <header className="fixed top-0 left-0 z-10 w-full bg-background/95 py-3 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6">
        <Logo className="size-8 flex-shrink-0" variant="icon" />

        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/feed"
            className={cn(
              "flex flex-col items-center justify-center px-4 text-primary/80 transition-colors hover:text-[#00A8FF]",
              pathname.startsWith("/feed") && "text-[#00A8FF]"
            )}
          >
            <House className="mb-0.5 size-6" weight="bold" />
            <span className="font-semibold text-xs">Home</span>
          </Link>

          <Link
            href="/groups"
            className={cn(
              "flex flex-col items-center justify-center px-4 text-primary/80 transition-colors hover:text-[#00A8FF]",
              pathname.startsWith("/groups") && "text-[#00A8FF]"
            )}
          >
            <UsersIcon className="mb-0.5 size-6" weight="bold" />
            <span className="font-semibold text-xs">Believers</span>
          </Link>

          <Link
            href="/notifications"
            className={cn(
              "flex flex-col items-center justify-center px-4 text-primary/80 transition-colors hover:text-[#00A8FF]",
              pathname.startsWith("/notifications") && "text-[#00A8FF]"
            )}
          >
            <Bell className="mb-0.5 size-6" weight="bold" />
            <span className="font-semibold text-xs">Notifications</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile search - centered */}
          <div className="flex justify-center md:hidden w-full max-w-[200px] mx-auto">
            <SearchBar />
          </div>

          {/* Desktop search */}
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>

          {/* Create Campaign button */}
          <Button
            asChild
            className="hidden md:inline-flex bg-gradient-to-r from-[#00A8FF] to-[#2D8CFF] font-medium text-sm text-white hover:from-[#00A8FF]/90 hover:to-[#2D8CFF]/90"
            size="sm"
          >
            <Link href="/posts/create">
              <Sparkle className="mr-1.5 size-5" weight="bold" />
              Create Campaign
            </Link>
          </Button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  ) : (
    <header className="fixed top-0 left-0 z-10 w-full bg-background/95 py-3 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6">
        <Logo className="mr-6" variant="full" />
        <Login variant="header" label="Sign in" />
      </div>
    </header>
  );
}
