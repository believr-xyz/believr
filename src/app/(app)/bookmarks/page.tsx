"use client";

import { BookmarkedPostsList } from "@/app/(app)/bookmarks/_components/bookmarked-posts-list";
import { BookmarkedPostsSkeleton } from "@/app/(app)/bookmarks/_components/bookmarked-posts-skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";

export default function BookmarksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-2xl">Bookmarks</h1>
        <p className="text-muted-foreground">Posts and campaigns you've saved</p>
      </div>

      <Tabs
        defaultValue={category}
        onValueChange={(value) => {
          router.push(`/bookmarks?${createQueryString("category", value)}`);
        }}
        className="mb-8"
      >
        <TabsList className="mb-8 flex flex-wrap">
          <TabsTrigger value="all">All Saved</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>

        <Suspense fallback={<BookmarkedPostsSkeleton />}>
          <BookmarkedPostsList category={category} />
        </Suspense>
      </Tabs>
    </div>
  );
}
