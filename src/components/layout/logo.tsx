"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg";

  return (
    <Link href="/" className={className}>
      <Image
        src={logoSrc}
        alt="Believr Logo"
        width={114}
        height={25.1}
        priority
        className="h-6.5 w-auto"
      />
    </Link>
  );
}
