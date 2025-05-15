"use client";

import { env } from "@/env";
import { useLensAuth } from "@/hooks/use-lens-auth";
import { Account } from "@lens-protocol/client";
import { useAccountsAvailable } from "@lens-protocol/react";
import { ConnectKitButton } from "connectkit";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount, useWalletClient } from "wagmi";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface AccountSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAccount?: Account | null;
  onSuccess?: (account?: Account) => void;
  trigger?: React.ReactNode;
}

export function AccountSelector({
  open,
  onOpenChange,
  currentAccount = null,
  onSuccess,
  trigger,
}: AccountSelectorProps) {
  const { data: walletClient } = useWalletClient();
  const { data: availableAccounts, loading: accountsLoading } = useAccountsAvailable({
    managedBy: walletClient?.account.address,
  });
  const { authenticate, isAuthenticating } = useLensAuth();
  const router = useRouter();
  const wallet = useAccount();

  const handleSelectAccount = async (account: any) => {
    if (!walletClient) return;
    try {
      const isOwner = wallet.address === account.owner;
      const result = await authenticate(account.address, isOwner);

      if (result) {
        onOpenChange(false);

        if (onSuccess) {
          onSuccess(account);
        }

        router.push("/feed");
      }
    } catch (error) {
      console.error("Lens authentication failed:", error);
      toast.error("Authentication failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Select Lens Account</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[600px] py-4 pr-4">
          <div className="grid grid-cols-3 gap-2">
            {accountsLoading && (
              <div className="col-span-3 flex justify-center py-4">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            )}
            {availableAccounts && availableAccounts.items.length === 0 && (
              <div className="col-span-3 text-muted-foreground">
                <p className="text-sm">No Lens profiles found for this wallet.</p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open("https://onboarding.lens.xyz/", "_blank")}
                  >
                    Create a Lens profile
                  </Button>
                </div>
              </div>
            )}
            {availableAccounts &&
              availableAccounts.items.length > 0 &&
              availableAccounts.items.map((acc) => {
                const isCurrentAccount = currentAccount
                  ? acc.account.address === currentAccount.address
                  : false;

                return (
                  <Button
                    key={acc.account.address}
                    variant="outline"
                    disabled={isAuthenticating || isCurrentAccount}
                    onClick={() => handleSelectAccount(acc.account)}
                    className="flex h-auto flex-col items-center px-2 py-3"
                  >
                    <Avatar className="mb-2 h-10 w-10">
                      <AvatarImage src={acc.account.metadata?.picture} />
                      <AvatarFallback>
                        {acc.account.username?.localName?.charAt(0) ||
                          acc.account.address.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="w-full truncate text-center text-xs">
                      {acc.account.username?.localName || acc.account.address}
                      {isCurrentAccount && (
                        <span className="block text-muted-foreground text-xs">(current)</span>
                      )}
                    </span>
                    {isAuthenticating && (
                      <Loader2 className="mt-1 size-3 animate-spin text-muted-foreground" />
                    )}
                  </Button>
                );
              })}
          </div>
        </ScrollArea>

        <div className="mt-6 text-center">
          <ConnectKitButton.Custom>
            {({ show }) => (
              <Button variant="ghost" size="sm" onClick={show}>
                Switch Wallet
              </Button>
            )}
          </ConnectKitButton.Custom>
        </div>
      </DialogContent>
    </Dialog>
  );
}
