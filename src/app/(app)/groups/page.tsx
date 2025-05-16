// Split into server and client components to follow Next.js 15 patterns
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersIcon } from "lucide-react";
import Link from "next/link";

// Simplified group interface
interface Group {
  id: string;
  name: string;
  description: string;
  image?: string;
  members: number;
  isPrivate?: boolean;
}

// Minimal mock data - just two examples for UI display
const MOCK_GROUPS: Group[] = [
  {
    id: "group-1",
    name: "SaaS Believers",
    description: "Support early-stage SaaS founders and projects.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format",
    members: 156,
  },
  {
    id: "group-2",
    name: "Web3 Founders",
    description: "Early-stage Web3 startups looking for support.",
    image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=1200&auto=format",
    members: 94,
    isPrivate: true,
  },
];

// Client component for interactive parts
("use client");
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function GroupsPageClient({ groups }: { groups: Group[] }) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("all");
  const router = useRouter();

  // Filter groups based on active tab
  const filteredGroups = activeTab === "all" ? groups : groups.filter((g) => !g.isPrivate);

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-bold text-3xl">Believers Groups</h1>
          <p className="mt-1 text-muted-foreground">
            Join groups of like-minded believers supporting creators
          </p>
        </div>
        <Button className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90">
          <PlusIcon className="mr-2 size-4" />
          Create Group
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <TabsList className={isMobile ? "grid w-full grid-cols-2" : ""}>
            <TabsTrigger value="all">All Groups</TabsTrigger>
            <TabsTrigger value="public">Public Only</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                {group.image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{group.name}</CardTitle>
                    {group.isPrivate && (
                      <div className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-800 text-xs">
                        Private
                      </div>
                    )}
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <UsersIcon className="mr-2 size-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">{group.members} members</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => router.push(`/groups/${group.id}`)}>
                    View Group
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

// Server component
export default function GroupsPage() {
  return <GroupsPageClient groups={MOCK_GROUPS} />;
}
