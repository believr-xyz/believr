"use client";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { ConnectKitButton } from "connectkit";
import { useState } from "react";
import { AccountSelector } from "./accounts";

export function Login() {
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const { data: authenticatedUser, loading: authUserLoading } =
    useAuthenticatedUser();

  return (
    <div className="mb-2 space-y-2 p-2">
      <ConnectKitButton.Custom>
        {({
          isConnected: isWalletConnected,
          show,
          truncatedAddress,
          ensName,
          chain,
        }) => {
          const connectKitDisplayName = ensName ?? truncatedAddress;

          if (!isWalletConnected) {
            return (
              <>
                <Button onClick={show} className="w-full">
                  Login
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
                    <Button className="w-full">Login with Lens</Button>
                  </DialogTrigger>
                }
              />
            );
          }

          if (isWalletConnected && authenticatedUser) {
            const displayIdentity = connectKitDisplayName ?? "...";
            return (
              <div className="flex w-full items-center justify-between gap-2 text-sm">
                <span
                  className="truncate text-muted-foreground"
                  title={authenticatedUser.address}
                >
                  Signed in as:{" "}
                  <span className="font-semibold text-primary">
                    {displayIdentity}
                  </span>
                </span>
              </div>
            );
          }

          return (
            <p className="text-muted-foreground text-xs">Checking status...</p>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}
