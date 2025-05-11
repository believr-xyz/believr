"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Login } from "@/components/login";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { ProfileMenu } from "@/components/profile-menu";
import { useEffect, useState } from "react";

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

  return (
    <header className="fixed top-0 left-0 z-10 w-full border-b bg-background/80 p-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Believr
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/feed"
            className={cn(
              "text-primary transition-colors hover:underline",
              pathname.startsWith("/feed") && "font-semibold",
            )}
          >
            Feed
          </Link>
          <Link
            href="/discover"
            className={cn(
              "text-primary transition-colors hover:underline",
              pathname.startsWith("/discover") && "font-semibold",
            )}
          >
            Discover
          </Link>

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
