"use client";

import { Header } from "@/components/header";
import { MobileNavigation } from "@/components/mobile-nav";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: user, loading } = useAuthenticatedUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-background p-8 shadow-lg">
          <h2 className="mb-4 font-semibold text-xl">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we authenticate you.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto mt-8 flex-1 px-4 pt-0 pb-16 md:px-6 md:pb-12">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
}
