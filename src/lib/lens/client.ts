import { env } from "@/env";
import { PublicClient, SessionClient, mainnet, testnet } from "@lens-protocol/client";
import { fragments } from "./fragments";
import { clientCookieStorage, cookieStorage } from "./storage";

const isServer = typeof window === "undefined";

/**
 * Create a public client for unauthenticated requests
 */
const publicClient = PublicClient.create({
  environment: mainnet,
  origin: env.NEXT_PUBLIC_APP_URL,
  storage: isServer ? cookieStorage : clientCookieStorage,
  fragments, // Add custom fragments for efficient data fetching
});

/**
 * Get the public client
 */
export const getPublicClient = () => {
  return publicClient;
};

/**
 * Create a builder client for authenticated requests
 */
export const getBuilderClient = async (
  address: string,
  signMessage: (message: string) => Promise<string>,
) => {
  if (!address) return null;

  const authenticated = await publicClient.login({
    builder: {
      address: address,
    },
    signMessage,
  });

  if (authenticated.isErr()) {
    throw authenticated.error;
  }

  return authenticated.value;
};

/**
 * Get or resume a session client
 */
export const getLensClient = async (): Promise<PublicClient | SessionClient> => {
  const resumed = await publicClient.resumeSession();
  if (resumed.isErr()) {
    return publicClient;
  }

  return resumed.value;
};

/**
 * Get an active session client or throw if not authenticated
 */
export const getSessionClient = async (): Promise<SessionClient> => {
  const resumed = await publicClient.resumeSession();
  if (resumed.isErr()) {
    throw new Error("No active session. Please authenticate first.");
  }

  return resumed.value;
};
