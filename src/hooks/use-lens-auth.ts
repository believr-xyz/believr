"use client";

import { env } from "@/env";
import { getPublicClient } from "@/lib/lens/client";
import { useLogin, useLogout } from "@lens-protocol/react";
import { toast } from "sonner";
import { useAccount, useWalletClient } from "wagmi";

export function useLensAuth() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const {
    execute: login,
    loading: isLoggingIn,
    error: loginError,
  } = useLogin();
  const {
    execute: logout,
    loading: isLoggingOut,
    error: logoutError,
  } = useLogout();

  // Handle Lens authentication with proper error handling
  const authenticate = async (
    accountAddress: string,
    isAccountOwner = true
  ) => {
    if (!walletClient || !address) {
      toast.error("Please connect your wallet first");
      return null;
    }

    try {
      const authRequest = isAccountOwner
        ? {
            accountOwner: {
              account: accountAddress,
              app: env.NEXT_PUBLIC_APP_ADDRESS,
              owner: walletClient.account.address,
            },
          }
        : {
            accountManager: {
              account: accountAddress,
              app: env.NEXT_PUBLIC_APP_ADDRESS,
              manager: walletClient.account.address,
            },
          };

      const result = await login({
        ...authRequest,
        signMessage: async (message: string) => {
          return await walletClient.signMessage({ message });
        },
      });

      toast.success("Successfully authenticated with Lens");
      return result;
    } catch (error) {
      console.error("Lens authentication error:", error);
      toast.error("Failed to authenticate with Lens");
      return null;
    }
  };

  // Handle Lens logout with proper feedback
  const signOut = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      return true;
    } catch (error) {
      console.error("Lens logout error:", error);
      toast.error("Failed to log out");
      return false;
    }
  };

  // Get challenge for the client
  const getChallenge = async (
    accountAddress: string,
    isAccountOwner = true
  ) => {
    if (!address) {
      return null;
    }

    try {
      const publicClient = getPublicClient();

      const challengeRequest = isAccountOwner
        ? {
            accountOwner: {
              account: accountAddress,
              app: env.NEXT_PUBLIC_APP_ADDRESS,
              owner: address,
            },
          }
        : {
            accountManager: {
              account: accountAddress,
              app: env.NEXT_PUBLIC_APP_ADDRESS,
              manager: address,
            },
          };

      // Using challenge method instead of generateChallenge to match Lens API
      const challenge = await publicClient.challenge(challengeRequest);
      return challenge.isOk() ? challenge.value : null;
    } catch (error) {
      console.error("Error generating challenge:", error);
      return null;
    }
  };

  return {
    authenticate,
    signOut,
    getChallenge,
    isAuthenticating: isLoggingIn,
    isLoggingOut,
    error: loginError || logoutError,
  };
}
