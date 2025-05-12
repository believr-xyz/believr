"use client";

import { Header } from "@/components/layout/header";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: user, loading } = useAuthenticatedUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // If on client and not authenticated, redirect to landing page
  if (isClient && !loading && !user) {
    redirect("/");
  }

  if (loading || !isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-background p-8 shadow-lg">
          <h2 className="mb-4 font-semibold text-xl">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we authenticate you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto mt-8 flex-1 px-4 pt-0 pb-12 md:px-6">
        {children}
      </main>
    </div>
  );
}
