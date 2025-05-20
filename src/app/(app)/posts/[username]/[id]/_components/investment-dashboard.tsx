"use client";

import { CampaignProgress } from "@/components/shared/campaign-progress";
import { RevenueShare } from "@/components/shared/revenue-share";
import { SupportersList } from "@/components/shared/supporters-list";

interface InvestmentDashboardProps {
  postId: string;
  goalAmount: number;
  currentAmount: number;
  revenueShare: number;
  currency?: string;
  collectCount?: number;
  endDate?: string;
}

export function InvestmentDashboard({
  postId,
  goalAmount,
  currentAmount,
  revenueShare,
  currency = "WGHO",
  collectCount = 0,
  endDate,
}: InvestmentDashboardProps) {
  return (
    <div className="space-y-6">
      <CampaignProgress
        goalAmount={goalAmount}
        currentAmount={currentAmount}
        currency={currency}
        collectCount={collectCount}
        endDate={endDate}
      />

      <RevenueShare postId={postId} revenueShare={revenueShare} />

      <SupportersList postId={postId} showComingSoon={true} />
    </div>
  );
}
