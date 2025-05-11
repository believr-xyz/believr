"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 z-10 w-full border-b bg-background/80 p-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Believr
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/docs"
            className={cn(
              "text-primary transition-colors hover:underline",
              pathname.startsWith("/docs") && "font-semibold"
            )}
          >
            Docs
          </Link>
          <Link
            href="/get-started"
            className={cn(
              "text-primary transition-colors hover:underline",
              pathname === "/get-started" && "font-semibold"
            )}
          >
            Get Started
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
