"use client";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { ConnectKitButton } from "connectkit";
import { useState } from "react";
import { AccountSelector } from "./accounts";

interface LoginProps {
  variant?: "default" | "header";
}

export function Login({ variant = "default" }: LoginProps) {
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const { data: authenticatedUser, loading: authUserLoading } = useAuthenticatedUser();

  // Apply different styles based on variant
  const containerClasses = variant === "header" ? "" : "mb-2 space-y-2 p-2";

  const buttonClasses = variant === "header" ? "" : "w-full";

  return (
    <div className={containerClasses}>
      <ConnectKitButton.Custom>
        {({ isConnected: isWalletConnected, show, truncatedAddress, ensName, chain }) => {
          const connectKitDisplayName = ensName ?? truncatedAddress;

          if (!isWalletConnected) {
            return (
              <>
                <Button onClick={show} className={buttonClasses}>
                  Connect Wallet
                </Button>
              </>
            );
          }

          if (isWalletConnected && !authenticatedUser) {
            return (
              <AccountSelector
                open={showAccountSelector}
                onOpenChange={setShowAccountSelector}
                trigger={
                  <DialogTrigger asChild>
                    <Button className={buttonClasses}>Sign in with Lens</Button>
                  </DialogTrigger>
                }
              />
            );
          }

          if (isWalletConnected && authenticatedUser) {
            const displayIdentity = connectKitDisplayName ?? "...";
            return (
              <div className={`flex items-center justify-between gap-2 text-sm ${buttonClasses}`}>
                <span className="truncate text-muted-foreground" title={authenticatedUser.address}>
                  Signed in as:{" "}
                  <span className="font-semibold text-primary">{displayIdentity}</span>
                </span>
              </div>
            );
          }

          return <p className="text-muted-foreground text-xs">Checking status...</p>;
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}
