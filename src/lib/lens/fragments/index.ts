import type { FragmentOf } from "@lens-protocol/client";
import { AccountFragment, AccountMetadataFragment } from "./accounts";

// Extend the Lens SDK types for better TypeScript support
declare module "@lens-protocol/client" {
  export interface Account extends FragmentOf<typeof AccountFragment> {}
  export interface AccountMetadata extends FragmentOf<typeof AccountMetadataFragment> {}
}

// Export all fragments to be used with the client
export const fragments = [AccountFragment];

export * from "./accounts";
