"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBalance } from "@/hooks/use-balance";
import { cn } from "@/lib/utils";
import { ChevronDown, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface BalanceDisplayProps {
  className?: string;
}

export function BalanceDisplay({ className }: BalanceDisplayProps) {
  const { balances, isLoading } = useBalance();
  const [open, setOpen] = useState(false);

  // Get GHO token for primary display
  const ghoToken = balances.find((item) => item.token.symbol === "GHO");
  // Fallback to WGHO or first available token
  const primaryToken =
    ghoToken ||
    balances.find((item) => item.token.symbol === "WGHO") ||
    (balances.length > 0 ? balances[0] : null);

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-1 rounded-full bg-accent px-3 py-1.5", className)}>
        <Loader2 className="size-3 animate-spin" />
        <span className="font-medium text-xs">Loading...</span>
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className={cn("flex items-center gap-1 rounded-full bg-accent px-3 py-1.5", className)}>
        <span className="font-medium text-xs">0 GHO</span>
      </div>
    );
  }

  // Format number to compact form like 1.2K, 3.5M, etc.
  const formatCompactNumber = (num: string) => {
    const value = Number.parseFloat(num);
    if (Number.isNaN(value)) return "0";

    if (value < 0.01 && value > 0) {
      return "<0.01";
    }

    // No compact form for smaller numbers
    if (value < 1000) {
      return value.toFixed(2).replace(/\.?0+$/, "");
    }

    // Compact notation for larger numbers
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className={cn(className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 transition-colors hover:bg-accent/80"
          >
            {primaryToken && (
              <>
                {primaryToken.token.logoURI && (
                  <div className="h-4 w-4 overflow-hidden rounded-full">
                    <Image
                      src={primaryToken.token.logoURI}
                      alt={primaryToken.token.name}
                      width={16}
                      height={16}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <span className="font-medium text-xs">
                  {formatCompactNumber(primaryToken.balance)} {primaryToken.token.symbol}
                </span>
              </>
            )}
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="end">
          <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-semibold">Your Balances</h3>
            <a
              href="https://explorer.lens.xyz/address/0x000000000000000000000000000000000000800A"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 text-xs hover:underline"
            >
              <span>View on Lens Explorer</span>
              <ExternalLink className="size-3" />
            </a>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {balances.map((item) => (
                <div
                  key={item.token.address}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-accent/30"
                >
                  <div className="flex items-center gap-3">
                    {item.token.logoURI ? (
                      <div className="h-8 w-8 overflow-hidden rounded-full">
                        <Image
                          src={item.token.logoURI}
                          alt={item.token.name}
                          width={32}
                          height={32}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                        <span className="font-semibold">{item.token.symbol[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{item.token.symbol}</p>
                      <p className="text-muted-foreground text-xs">{item.token.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">{item.balance}</span>
                    <a
                      href={`https://explorer.lens.xyz/address/${item.token.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-xs hover:underline"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
