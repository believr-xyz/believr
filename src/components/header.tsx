"use client";

import { Login } from "@/components/login";
import { Logo } from "@/components/logo";
import { ProfileMenu } from "@/components/user-menu";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NotificationsButton } from "./notifications-button";

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
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
        <div className="flex items-center">
          <Logo className="mr-6" />
          <nav className="hidden items-center gap-4 md:flex md:gap-8">
            <Link
              href="/feed"
              className={cn(
                "font-semibold text-base text-primary/80 transition-colors hover:text-[#00A8FF]",
                pathname.startsWith("/feed") && "text-[#00A8FF]"
              )}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={cn(
                "font-semibold text-base text-primary/80 transition-colors hover:text-[#00A8FF]",
                pathname.startsWith("/explore") && "text-[#00A8FF]"
              )}
            >
              Explore
            </Link>
            <Link
              href="/groups"
              className={cn(
                "font-semibold text-base text-primary/80 transition-colors hover:text-[#00A8FF]",
                pathname.startsWith("/groups") && "text-[#00A8FF]"
              )}
            >
              Believers
            </Link>
            <Link
              href="/bookmarks"
              className={cn(
                "font-semibold text-base text-primary/80 transition-colors hover:text-[#00A8FF]",
                pathname.startsWith("/bookmarks") && "text-[#00A8FF]"
              )}
            >
              Bookmarks
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <SearchBar className="hidden md:flex" />
          <NotificationsButton className="hidden md:flex" />
          <Button
            asChild
            className="hidden bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90 sm:flex"
            size="sm"
          >
            <Link href="/posts/create">
              <PlusIcon className="mr-1.5 size-3.5" />
              Create
            </Link>
          </Button>
          <ProfileMenu className="hidden md:flex" />
        </div>
      </div>
    </header>
  ) : (
    <header className="fixed top-0 left-0 z-10 w-full bg-background/95 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
        <Logo className="mr-6" />
        <Login variant="header" />
      </div>
    </header>
  );
}
