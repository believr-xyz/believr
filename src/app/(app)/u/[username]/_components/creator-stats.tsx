"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, DollarSignIcon, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Temporary type definition
interface Creator {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  stats?: {
    posts: number;
    followers: number;
    following: number;
    believers: number;
  };
}

interface CreatorStatsProps {
  creator: Creator;
  campaigns?: {
    total: number;
    successful: number;
    believers: number;
    raised: number;
  };
}

export function CreatorStats({
  creator,
  campaigns = { total: 0, successful: 0, believers: 0, raised: 0 },
}: CreatorStatsProps) {
  // Calculate reputation score based on success rate and number of believers
  const reputationScore =
    campaigns.total > 0 ? Math.round((campaigns.successful / campaigns.total) * 100) : 0;

  // Mock data for historical campaigns
  const campaignHistory = [
    { name: "Jan", amount: 150 },
    { name: "Feb", amount: 230 },
    { name: "Mar", amount: 180 },
    { name: "Apr", amount: 275 },
    { name: "May", amount: 340 },
    { name: "Jun", amount: 390 },
  ];

  const statItems = [
    {
      title: "Reputation",
      value: `${reputationScore}%`,
      description: "Success rate",
      icon: Award,
      color: "#00A8FF",
    },
    {
      title: "Believers",
      value: campaigns.believers.toString(),
      description: "Total supporters",
      icon: Users,
      color: "#10B981",
    },
    {
      title: "Campaigns",
      value: campaigns.total.toString(),
      description: `${campaigns.successful} successful`,
      icon: TrendingUp,
      color: "#F59E0B",
    },
    {
      title: "Raised",
      value: `${campaigns.raised} GHO`,
      description: "Total funding",
      icon: DollarSignIcon,
      color: "#8B5CF6",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Creator Stats</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${item.color}10` }}
                  >
                    <Icon className="size-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{item.title}</p>
                    <p className="font-semibold text-xl">{item.value}</p>
                    <p className="text-muted-foreground text-xs">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Only show chart if there are campaigns */}
      {campaigns.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Funding History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignHistory}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value} GHO`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} GHO`, "Amount"]}
                    labelFormatter={(label) => `${label} 2023`}
                  />
                  <Bar dataKey="amount" fill="#00A8FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
