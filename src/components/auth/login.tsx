"use client";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { ConnectKitButton } from "connectkit";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AccountSelector } from "./accounts";

interface LoginProps {
  variant?: "default" | "header";
}

export function Login({ variant = "default" }: LoginProps) {
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const { data: authenticatedUser, loading: authUserLoading } = useAuthenticatedUser();
  const isHeader = variant === "header";

  return (
    <div className={isHeader ? "" : "mb-2 space-y-2 p-2"}>
      <ConnectKitButton.Custom>
        {({
          isConnected: isWalletConnected,
          show,
          truncatedAddress,
          ensName,
          chain,
          isConnecting,
        }) => {
          const connectKitDisplayName = ensName ?? truncatedAddress;

          // If not connected to wallet, show login button
          if (!isWalletConnected) {
            return (
              <Button
                onClick={show}
                className={isHeader ? "px-5 font-semibold text-sm" : "w-full font-semibold text-sm"}
                size={isHeader ? "sm" : "default"}
                disabled={isConnecting}
                variant="default"
              >
                {isConnecting ? (
                  <Loader2 className="mr-1 size-4 animate-spin" />
                ) : isHeader ? (
                  "Login"
                ) : (
                  "Get Started"
                )}
              </Button>
            );
          }

          // If connected to wallet but not authenticated with Lens
          if (isWalletConnected && !authenticatedUser) {
            return (
              <AccountSelector
                open={showAccountSelector}
                onOpenChange={setShowAccountSelector}
                trigger={
                  <DialogTrigger asChild>
                    <Button
                      className={
                        isHeader ? "px-5 font-semibold text-base" : "w-full font-semibold text-base"
                      }
                      size={isHeader ? "sm" : "default"}
                      disabled={authUserLoading}
                      variant="default"
                    >
                      {authUserLoading ? (
                        <Loader2 className="mr-1 size-4 animate-spin" />
                      ) : (
                        "Sign in with Lens"
                      )}
                    </Button>
                  </DialogTrigger>
                }
              />
            );
          }

          // If connected and authenticated
          if (isWalletConnected && authenticatedUser) {
            const displayIdentity = connectKitDisplayName ?? "...";
            return (
              <div className="flex w-full items-center justify-between gap-2 text-sm">
                <span className="truncate text-muted-foreground" title={authenticatedUser.address}>
                  Signed in as:{" "}
                  <span className="font-semibold text-primary">{displayIdentity}</span>
                </span>
              </div>
            );
          }

          return (
            <div className="flex items-center text-muted-foreground text-xs">
              <Loader2 className="size-3 animate-spin" />
            </div>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}
