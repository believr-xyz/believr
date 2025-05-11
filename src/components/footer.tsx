"use client";

import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-background py-4">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-center gap-5">
          <span className="text-muted-foreground text-xs md:text-sm">Believr @{currentYear}</span>

          <span className="text-muted-foreground text-xs md:text-sm">
            Built by{" "}
            <Link
              href="https://twitter.com/samueldans0"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#00A8FF]"
            >
              @samueldans0
            </Link>
          </span>

          <Link
            href="https://twitter.com/believrdotfun"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="text-muted-foreground transition-colors hover:text-[#00A8FF]"
          >
            <Twitter className="size-4" />
          </Link>

          <Link
            href="https://github.com/believr-fun"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-[#00A8FF]"
          >
            <Github className="size-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
