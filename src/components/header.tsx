"use client";

import { Login } from "@/components/login";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";

export function Header() {
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
  }, []);

  return (
    <header className="fixed top-0 left-0 z-10 w-full bg-background/95 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
        <Logo className="mr-6" />
        <Login variant="header" key={`login-${authKey}`} />
      </div>
    </header>
  );
}
