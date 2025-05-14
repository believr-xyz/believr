"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InvestmentTerms as InvestmentTermsType } from "@/types/post";
import { format } from "date-fns";
import { CalendarIcon, TargetIcon, TrendingUpIcon } from "lucide-react";

interface InvestmentTermsProps {
  terms: InvestmentTermsType;
  collectedAmount: number;
  currency: string;
}

export function InvestmentTerms({ terms, collectedAmount, currency }: InvestmentTermsProps) {
  // Calculate collection progress
  const percentCollected = Math.min(100, Math.round((collectedAmount / terms.goal) * 100));
  const remainingGoal = Math.max(0, terms.goal - collectedAmount);

  // Has reached min threshold
  const hasReachedThreshold = terms.minThreshold ? collectedAmount >= terms.minThreshold : true;

  // Is deadline passed
  const isDeadlinePassed = terms.deadline ? new Date() > terms.deadline : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Investment Terms</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-6">
          {/* Goal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-sm">
                <TargetIcon className="size-4" />
                <span>Goal</span>
              </div>
              <span className="font-semibold text-sm">
                {collectedAmount} / {terms.goal} {currency}
              </span>
            </div>

            <Progress value={percentCollected} className="h-2" />

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {remainingGoal > 0 ? `${remainingGoal} ${currency} to go` : "Goal reached!"}
              </span>
              <span className="font-medium">{percentCollected}%</span>
            </div>

            {terms.minThreshold && (
              <div className="mt-1 flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">Minimum threshold:</span>
                <span className={`font-medium ${hasReachedThreshold ? "text-green-500" : ""}`}>
                  {terms.minThreshold} {currency}
                </span>
              </div>
            )}
          </div>

          {/* Deadline */}
          {terms.deadline && (
            <div className="flex items-start gap-2">
              <CalendarIcon className="mt-0.5 size-4 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{isDeadlinePassed ? "Ended on" : "Ends on"}</p>
                <p className="text-muted-foreground text-sm">
                  {format(terms.deadline, "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {terms.description && (
            <div className="flex items-start gap-2">
              <TrendingUpIcon className="mt-0.5 size-4 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Investment information</p>
                <p className="text-muted-foreground text-sm">{terms.description}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
