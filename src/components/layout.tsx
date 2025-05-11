"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main content */}
      <main className="flex-1 pt-14">
        <div className="mx-auto max-w-7xl p-4">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
