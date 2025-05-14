import { UsernameFragment, graphql } from "@lens-protocol/client";

export const AccountMetadataFragment = graphql(
  `
    fragment AccountMetadata on AccountMetadata {
      name
      bio
      picture {
        optimized {
          uri
          mimeType
        }
        raw {
          uri
          mimeType
        }
      }
      attributes {
        key
        value
      }
    }
  `
);

export const AccountFragment = graphql(
  `
    fragment Account on Account {
      __typename
      username {
        ...Username
      }
      address
      metadata {
        ...AccountMetadata
      }
    }
  `,
  [UsernameFragment, AccountMetadataFragment]
);
