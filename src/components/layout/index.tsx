"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { Header } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const pathname = usePathname();

  // Only show footer on the landing page (root path)
  const showFooter = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main content */}
      <main className="flex-1 pt-14">
        <div className="mx-auto max-w-5xl p-4">{children}</div>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
