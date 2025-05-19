"use client";

import { Account } from "@lens-protocol/client";
import { useAccountsAvailable, useLogin } from "@lens-protocol/react";
import { useRouter } from "next/navigation";
import { useAccount, useWalletClient } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

import { CircleNotch } from "@phosphor-icons/react";
import { ConnectKitButton } from "connectkit";
import { toast } from "sonner";

interface AccountSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAccount?: Account | null;
  onSuccess?: (account?: Account) => void;
  trigger?: React.ReactNode;
}

// Helper function to add handle property to accounts
const mapToClientAccount = (account: any): Account => {
  // Extract username from various possible locations
  const username =
    account.username?.value?.split("/").pop() || account.username?.localName;

  return {
    ...account,
    handle: username || "", // For backward compatibility
  };
};

export function AccountSelector({
  open,
  onOpenChange,
  currentAccount = null,
  onSuccess,
  trigger,
}: AccountSelectorProps) {
  const { data: walletClient } = useWalletClient();
  const { data: availableAccounts, loading: accountsLoading } =
    useAccountsAvailable({
      managedBy: walletClient?.account.address,
    });
  const { execute: authenticate, loading: authenticateLoading } = useLogin();
  const router = useRouter();
  const wallet = useAccount();

  const handleSelectAccount = async (account: any) => {
    if (!walletClient) return;
    try {
      const isOwner = wallet.address === account.owner;
      const authRequest = isOwner
        ? {
            accountOwner: {
              account: account.address,
              app: process.env.NEXT_PUBLIC_APP_ADDRESS,
              owner: walletClient.account.address,
            },
          }
        : {
            accountManager: {
              account: account.address,
              app: process.env.NEXT_PUBLIC_APP_ADDRESS,
              manager: walletClient.account.address,
            },
          };

      await authenticate({
        ...authRequest,
        signMessage: async (message: string) => {
          return await walletClient.signMessage({ message });
        },
      });

      onOpenChange(false);

      const foundAccount = availableAccounts?.items.find(
        (acc) => acc.account.address === account.address
      )?.account;

      const clientAccount = foundAccount
        ? mapToClientAccount(foundAccount)
        : undefined;

      if (onSuccess) {
        onSuccess(clientAccount);
      }

      router.push("/feed");
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
          <div className="space-y-2">
            {accountsLoading && (
              <div className="flex justify-center py-4">
                <CircleNotch
                  className="size-6 animate-spin text-primary"
                  weight="bold"
                />
              </div>
            )}
            {availableAccounts && availableAccounts.items.length === 0 && (
              <div className="text-muted-foreground">
                <p className="text-sm">
                  No Lens profiles found for this wallet.
                </p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      window.open("https://onboarding.lens.xyz/", "_blank")
                    }
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
                const displayName =
                  acc.account.metadata?.name ||
                  acc.account.username?.localName ||
                  acc.account.address;
                const username = acc.account.username?.localName
                  ? `@${acc.account.username.localName}`
                  : "";

                return (
                  <div
                    key={acc.account.address}
                    className="flex items-center justify-between rounded-md border p-3 hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={acc.account.metadata?.picture} />
                        <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{displayName}</span>
                        <span className="text-xs text-muted-foreground">
                          {username}
                        </span>
                      </div>
                    </div>
                    <Button
                      disabled={authenticateLoading || isCurrentAccount}
                      onClick={() =>
                        handleSelectAccount(mapToClientAccount(acc.account))
                      }
                      size="sm"
                      className="min-w-[80px] transition-all"
                    >
                      {authenticateLoading ? (
                        <div className="flex items-center gap-1.5">
                          <CircleNotch
                            className="size-3.5 animate-spin"
                            weight="bold"
                          />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
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
