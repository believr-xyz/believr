"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="container mx-auto max-w-4xl pb-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-3xl">Notifications</h1>
          <Button variant="outline" size="sm" className="gap-1">
            Mark all as read
          </Button>
        </div>
        <p className="mt-2 text-muted-foreground">Stay updated with your latest interactions</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="follow">Follows</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
          <TabsTrigger value="collect">Collects</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="flex h-[300px] flex-col items-center justify-center gap-4 py-10 text-center">
              <Bell className="size-12 text-muted-foreground/50" />
              <div>
                <h3 className="font-medium text-lg">Notifications Coming Soon</h3>
                <p className="text-muted-foreground">
                  The notifications feature is currently under development.
                </p>
                <Button className="mt-6" onClick={() => router.push("/feed")}>
                  Return to Feed
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
