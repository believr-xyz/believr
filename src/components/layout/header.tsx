"use client";

import { Login } from "@/components/auth/login";
import { ProfileMenu } from "@/components/auth/user-menu";
import { Logo } from "@/components/layout/logo";
import { BookmarksNavButton } from "@/components/navigation/bookmarks-nav-button";
import { NotificationsNavButton } from "@/components/navigation/notifications-nav-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { Sparkles } from "lucide-react";
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
    <header className="fixed top-0 left-0 z-10 w-full bg-background/95 py-3 backdrop-blur-sm">
      <div className="container mx-auto flex max-w-5xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Logo className="mr-10" variant="icon" />
          <nav className="hidden items-center gap-4 md:flex md:gap-8">
            <Link
              href="/feed"
              className={cn(
                "font-semibold text-base text-primary/80 transition-colors hover:text-[#00A8FF]",
                pathname.startsWith("/feed") && "text-[#00A8FF]",
              )}
            >
              Home
            </Link>
            <Link
              href="/groups"
              className={cn(
                "font-semibold text-base text-primary/80 transition-colors hover:text-[#00A8FF]",
                pathname.startsWith("/groups") && "text-[#00A8FF]",
              )}
            >
              Believers
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <Button
            asChild
            className="hidden bg-gradient-to-r from-[#00A8FF] to-[#2D8CFF] font-medium text-white hover:from-[#00A8FF]/90 hover:to-[#2D8CFF]/90 sm:flex"
            size="sm"
          >
            <Link href="/posts/create">
              <Sparkles className="mr-1.5 size-3.5" />
              Create Investment Campaign
            </Link>
          </Button>
          <div className="flex items-center gap-2 md:gap-3">
            <BookmarksNavButton className="hidden md:flex" />
            <NotificationsNavButton className="hidden md:flex" />
            <ProfileMenu className="hidden md:flex" />
          </div>
        </div>
      </div>
    </header>
  ) : (
    <header className="fixed top-0 left-0 z-10 w-full bg-background/95 py-3 backdrop-blur-sm">
      <div className="container mx-auto flex max-w-5xl items-center justify-between px-4 md:px-6">
        <Logo className="mr-6" variant="full" />
        <Login variant="header" label="Sign in" />
      </div>
    </header>
  );
}
