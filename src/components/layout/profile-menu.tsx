"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLensClient } from "@/lib/lens/client";
import { cn } from "@/lib/utils";
import { fetchAccount } from "@lens-protocol/client/actions";
import { useAuthenticatedUser, useLogout } from "@lens-protocol/react";
import { LogOut, UserRound } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileMenuProps {
  className?: string;
}

export function ProfileMenu({ className }: ProfileMenuProps) {
  const { execute: executeLogout } = useLogout();
  const { data: user } = useAuthenticatedUser();
  const router = useRouter();
  const [accountData, setAccountData] = useState<any>(null);
  const { setTheme, resolvedTheme: theme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function fetchUserAccount() {
      if (!user) return;

      try {
        const client = await getLensClient();
        const account = await fetchAccount(client, {
          address: user.address,
        }).unwrapOr(null);
        setAccountData(account);
      } catch (error) {
        console.error("Failed to fetch account:", error);
      }
    }

    fetchUserAccount();
  }, [user]);

  const handleLogout = async () => {
    if (!user || isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await executeLogout();

      // Trigger a storage event to notify other tabs
      window.localStorage.setItem("lens.auth.logout", Date.now().toString());

      // Clear any local storage or session data
      localStorage.removeItem("lens.auth.storage");
      sessionStorage.clear();

      // Refresh the page to reset the app state
      router.push("/");

      // We need to force a full page refresh
      window.location.reload();
    } catch (error) {
      console.error("Failed to logout:", error);
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    if (accountData?.ownedBy?.defaultProfile?.username) {
      router.push(`/u/${accountData.ownedBy.defaultProfile.username}`);
    } else if (accountData?.ownedBy?.username) {
      router.push(`/u/${accountData.ownedBy.username}`);
    } else {
      // Fallback if we don't have a username
      router.push(`/u/default`); // This would be replaced with proper handling in production
    }
  };

  if (!user) return null;

  // Get the first few characters of the address for display
  const displayAddress = user.address.substring(0, 2).toUpperCase();

  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              {accountData?.metadata?.picture ? (
                <AvatarImage src={accountData.metadata.picture} alt="Profile" />
              ) : (
                <AvatarFallback>{displayAddress}</AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={handleProfileClick}>
            <UserRound className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
