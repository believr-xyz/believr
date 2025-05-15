import { graphql } from "@lens-protocol/client";

export const MediaImageFragment = graphql(
  `
    fragment MediaImage on MediaImage {
      __typename
      item
      altTag
      license
      type
    }
  `,
);
