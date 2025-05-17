"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PageSize } from "@lens-protocol/client";
import { useAccounts } from "@lens-protocol/react";
import { Loader2, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Use the Lens useAccounts hook to search for profiles
  const { data, loading, error } = useAccounts({
    filter:
      query.length > 1
        ? {
            searchBy: {
              localNameQuery: query,
            },
          }
        : undefined,
    orderBy: "BEST_MATCH",
    pageSize: PageSize.Ten,
  });

  // Extract error message if we have one
  useEffect(() => {
    if (error) {
      console.error("Lens search error:", error);
      setErrorMessage(
        typeof error === "object" && error !== null
          ? // @ts-ignore - runtime type checking
            error.message || error.error || error.toString()
          : String(error),
      );
    } else {
      setErrorMessage(null);
    }
  }, [error]);

  const results = data?.items || [];

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);

        if (window.innerWidth < 768) {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle search on mobile
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    // Arrow down - move selection down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex));
    }

    // Arrow up - move selection up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }

    // Enter - navigate to selected profile
    else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        const profile = results[selectedIndex];
        navigateToProfile(profile.username?.value);
      }
    }

    // Escape - close results
    else if (e.key === "Escape") {
      e.preventDefault();
      setShowResults(false);
      if (window.innerWidth < 768) {
        setIsSearchOpen(false);
      }
    }
  };

  const navigateToProfile = (handle?: string) => {
    if (!handle) return;
    setShowResults(false);
    setQuery("");
    if (window.innerWidth < 768) {
      setIsSearchOpen(false);
    }
    router.push(`/u/${handle}`);
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Mobile search icon button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSearch}
        aria-label="Search"
      >
        <SearchIcon className="size-5" />
      </Button>

      {/* Search bar - hidden on mobile unless toggled */}
      <div className={`relative ${isSearchOpen ? "block" : "hidden"} w-full md:block`}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="size-4 text-muted-foreground" />
        </div>
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search Creators & Campaigns..."
          className="h-10 w-full rounded-md border-border/60 bg-background pl-10 text-sm shadow-sm focus-visible:border-[#00A8FF]/30 focus-visible:ring-[#00A8FF]/20"
        />
      </div>

      {/* Mobile full-screen search container */}
      {isSearchOpen && showResults && (
        <div className="fixed inset-0 z-50 bg-background p-4 md:hidden">
          <div className="mb-4 flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </Button>
            <Input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1"
            />
          </div>
        </div>
      )}

      {/* Search results dropdown */}
      {showResults && (query.length > 1 || results.length > 0) && !isSearchOpen && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 z-10 mt-1 w-full overflow-hidden rounded-md border bg-background shadow-md"
        >
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto py-1">
              {results.map((account, index) => {
                const username = account.username?.value;
                const displayName =
                  account.metadata?.name || account.username?.localName || "Unknown";
                const avatarUrl = account.metadata?.picture || "";

                return (
                  <div
                    key={account.address}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-accent",
                      selectedIndex === index && "bg-accent",
                    )}
                    onClick={() => navigateToProfile(username)}
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{displayName}</p>
                      {username && <p className="text-muted-foreground text-sm">@{username}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : query.length > 1 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No results found for &quot;{query}&quot;
              {errorMessage && <p className="mt-1 text-red-500 text-xs">Error: {errorMessage}</p>}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
