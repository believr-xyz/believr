"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BookmarksButtonProps {
  className?: string;
}

export function BookmarksButton({ className }: BookmarksButtonProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/bookmarks");

  return (
    <div className={cn(className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("relative", isActive && "bg-accent text-accent-foreground")}
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark className="size-5" />
        </Link>
      </Button>
    </div>
  );
}
