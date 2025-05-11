"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const showWelcome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main content */}
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-7xl p-4">
          {showWelcome && (
            <div className="mb-8 border-b pb-8">
              <h2 className="mb-4 font-bold text-2xl">Welcome to Believr!</h2>
              <p className="mb-4">
                A decentralized social co-investing platform where early believers back creators
                they believe in — built on the Lens Protocol
              </p>
            </div>
          )}
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
