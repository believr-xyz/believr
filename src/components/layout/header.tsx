"use client";

import { Login } from "@/components/auth/login";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { SearchBar } from "@/components/layout/search-bar";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { BalanceDisplay } from "./balance-display";
import { Notifications } from "./notifications";

export function Header() {
  const pathname = usePathname();
  const { data: user, loading } = useAuthenticatedUser();
  const isAuthenticated = !!user;
  // Use a key to force re-rendering when auth state changes
  const [authKey, setAuthKey] = useState(Date.now());

  // Re-render when auth state changes
  useEffect(() => {
    setAuthKey(Date.now());

    // Set up event listener for storage changes (for cross-tab auth sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes("lens.auth")) {
        // Force a refresh of the page to reflect the new auth state
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isAuthenticated]);

  // Show only logo and login button on landing page
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return (
      <header className="fixed top-0 left-0 z-10 w-full bg-background/95 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
          <Logo className="mr-6" />
          <Login variant="header" key={`login-${authKey}`} />
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 z-10 w-full bg-background/95 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
        <div className="flex items-center">
          <Logo className="mr-6" />
          {isAuthenticated && (
            <nav className="flex items-center gap-4 md:gap-8">
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
                href="/discover"
                className={cn(
                  "font-semibold text-base text-primary/80 transition-colors hover:text-[#00A8FF]",
                  pathname.startsWith("/discover") && "text-[#00A8FF]",
                )}
              >
                Discover
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated && <SearchBar />}

          {isAuthenticated && (
            <>
              <BalanceDisplay />
              <Notifications />
            </>
          )}

          {isAuthenticated && (
            <Button
              asChild
              className="hidden bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90 sm:flex"
              size="sm"
            >
              <Link href="/create">
                <PlusIcon className="mr-1.5 size-3.5" />
                Create
              </Link>
            </Button>
          )}

          {isAuthenticated ? (
            <ProfileMenu key={`profile-${authKey}`} />
          ) : (
            <Login variant="header" key={`login-${authKey}`} />
          )}
        </div>
      </div>
    </header>
  );
}
