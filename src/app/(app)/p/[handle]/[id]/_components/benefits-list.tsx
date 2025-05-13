"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Benefit } from "@/types/post";
import { BadgeCheckIcon, CoinsIcon, LockIcon, StarIcon } from "lucide-react";

interface BenefitsListProps {
  benefits: Benefit[];
}

// Map benefit types to icons
const benefitIcons = {
  access: LockIcon,
  revenue: CoinsIcon,
  recognition: BadgeCheckIcon,
  exclusive: StarIcon,
};

export function BenefitsList({ benefits }: BenefitsListProps) {
  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Benefits for Believers</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {benefits.map((benefit, index) => {
            const Icon = benefitIcons[benefit.type];

            return (
              <div key={`${benefit.title}-${index}`}>
                {index > 0 && <Separator className="my-4" />}

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                    <Icon className="size-4 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{benefit.title}</h3>
                      <Badge variant="outline" className="bg-background">
                        {benefit.type === "revenue" && benefit.percentage
                          ? `${benefit.percentage}%`
                          : benefit.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
