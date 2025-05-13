"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Community {
  id: string;
  name: string;
  description: string;
  image?: string;
  members: number;
  isPrivate?: boolean;
}

// Mock communities for the MVP demo
const MOCK_COMMUNITIES: Community[] = [
  {
    id: "community-1",
    name: "SaaS Believers",
    description: "A community for believers in SaaS startups and projects",
    members: 156,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format",
  },
  {
    id: "community-2",
    name: "Game Developers",
    description: "Support indie game developers and studios",
    members: 237,
    image: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?w=300&auto=format",
  },
  {
    id: "community-3",
    name: "Web3 Founders",
    description: "Early-stage Web3 startups looking for support",
    members: 94,
    image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=300&auto=format",
    isPrivate: true,
  },
];

export default function CommunitiesPage() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  // Filter communities based on active tab
  const filteredCommunities = MOCK_COMMUNITIES.filter((community) => {
    if (activeTab === "all") return true;
    if (activeTab === "private") return community.isPrivate;
    if (activeTab === "public") return !community.isPrivate;
    return true;
  });

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 font-bold text-3xl">Communities</h1>
          <p className="text-muted-foreground">Join groups of believers with shared interests</p>
        </div>
        <Button className="mt-4 bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90 md:mt-0">
          <PlusIcon className="mr-2 size-4" />
          Create Community
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="private">Private</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="overflow-hidden">
                {community.image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={community.image}
                      alt={community.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{community.name}</CardTitle>
                    {community.isPrivate && (
                      <div className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-800 text-xs">
                        Private
                      </div>
                    )}
                  </div>
                  <CardDescription>{community.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <UsersIcon className="mr-2 size-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">
                      {community.members} members
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/communities/${community.id}`)}
                  >
                    Join Community
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
