import { env } from "@/env";
import { PublicClient, mainnet } from "@lens-protocol/client";
import { fragments } from "./fragments";
import { clientCookieStorage, cookieStorage } from "./storage";

const isServer = typeof window === "undefined";

const publicClient = PublicClient.create({
  environment: mainnet,
  origin: env.NEXT_PUBLIC_APP_URL,
  storage: isServer ? cookieStorage : clientCookieStorage,
  fragments,
});

export const getPublicClient = () => {
  return publicClient;
};

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

export const getLensClient = async () => {
  const resumed = await publicClient.resumeSession();
  if (resumed.isErr()) {
    return publicClient;
  }

  return resumed.value;
};
