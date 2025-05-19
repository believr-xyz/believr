"use client";

import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile";
import { Loader } from "@/components/ui/loader";
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
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8F9] dark:bg-background">
      <Header />
      <main className="mx-auto mt-16 max-w-7xl flex-1 px-4 pb-16 md:mt-20 md:px-6 md:pb-12">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
}
