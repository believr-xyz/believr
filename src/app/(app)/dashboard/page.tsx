"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("campaigns");

  return (
    <div className="w-full pb-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-3xl">Creator Dashboard</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Track your campaigns, revenue, and supporter stats
        </p>
      </div>

      <Tabs
        defaultValue="campaigns"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="supporters">Supporters</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="flex h-[400px] flex-col items-center justify-center gap-4 py-10 text-center">
              <LineChart className="size-12 text-muted-foreground/50" />
              <div>
                <h3 className="font-medium text-lg">Dashboard Coming Soon</h3>
                <p className="text-muted-foreground">
                  Our team is currently building the creator dashboard with advanced analytics,
                  revenue tracking, and supporter management.
                </p>
                <Button className="mt-6" onClick={() => router.push("/posts/create")}>
                  Create New Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
