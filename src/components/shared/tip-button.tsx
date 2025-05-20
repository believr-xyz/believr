"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getLensClient } from "@/lib/lens/client";
import { formatLensError, logLensError } from "@/lib/lens/error-handler";
import { SessionClient, evmAddress } from "@lens-protocol/client";
import { executeAccountAction } from "@lens-protocol/client/actions";
import { CurrencyDollar } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

export interface TipButtonProps {
  authorAddress: string;
  username?: string;
  className?: string;
}

export function TipButton({ authorAddress, username, className = "" }: TipButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState("1");

  const handleTip = async () => {
    setIsLoading(true);

    try {
      const client = await getLensClient();

      if (!client) {
        toast.error("Failed to initialize Lens client");
        setIsLoading(false);
        return;
      }

      // Check if client is a SessionClient (has authentication)
      if (!("getCredentials" in client)) {
        toast.error("You need to be authenticated to tip a creator");
        setIsLoading(false);
        return;
      }

      const sessionClient = client as SessionClient;

      try {
        // Execute the account action to tip
        // Note: Using the correct WGHO token address on Lens Chain mainnet
        const result = await executeAccountAction(sessionClient, {
          account: evmAddress(authorAddress),
          action: {
            tipping: {
              value: tipAmount,
              // Correct WGHO token address on Lens Chain mainnet
              currency: evmAddress("0x6bDc36E20D267Ff0dd6097799f82e78907105e2F"),
            },
          },
        });

        if (result.isErr()) {
          // Use our custom error handler to format the error message
          logLensError("tipping", result.error);
          toast.error(`Failed to tip: ${formatLensError(result.error)}`);
          setIsLoading(false);
          return;
        }

        // The operation completed successfully
        const txHash = "hash" in result.value ? result.value.hash : null;
        if (txHash) {
          console.log("Tip transaction hash:", txHash);
        }

        setShowModal(false);
        toast.success(`Successfully tipped ${tipAmount} WGHO!`);
      } catch (error) {
        logLensError("tip execution", error);
        toast.error(`Failed to send tip: ${formatLensError(error)}`);
      }
    } catch (error) {
      logLensError("tip initialization", error);
      toast.error(`Error tipping: ${formatLensError(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className={`gap-1 ${className}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
            >
              <CurrencyDollar className="h-4 w-4" />
              <span>Tip</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send a tip to this creator</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-center">Send a Tip</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 text-center">
              Support {username ? `@${username}` : "this creator"} with a tip!
            </p>

            <div className="flex flex-col gap-2">
              <label htmlFor="tipAmount" className="font-medium text-sm">
                Amount (WGHO):
              </label>
              <input
                id="tipAmount"
                type="number"
                min="0.1"
                step="0.1"
                className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleTip} disabled={isLoading} className="gap-1">
              <CurrencyDollar className="h-4 w-4" />
              {isLoading ? "Processing..." : "Send Tip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
