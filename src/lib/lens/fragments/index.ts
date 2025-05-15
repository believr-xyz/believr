import type { FragmentOf } from "@lens-protocol/client";
import { CustomAccountFragment, AccountMetadataFragment } from "./accounts";
import { MediaImageFragment } from "./media";
import { PostFragment } from "./posts";

// Extend the Lens SDK types with our fragments
declare module "@lens-protocol/client" {
  export interface Account extends FragmentOf<typeof CustomAccountFragment> {}
  export interface AccountMetadata
    extends FragmentOf<typeof AccountMetadataFragment> {}
}

// Export all fragments for use in the client
export const fragments = [
  CustomAccountFragment,
  PostFragment,
  MediaImageFragment,
];
