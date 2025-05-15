import { UsernameFragment, graphql } from "@lens-protocol/client";

export const AccountMetadataFragment = graphql(
  `
    fragment AccountMetadata on AccountMetadata {
      name
      bio
      thumbnail: picture(
        request: { preferTransform: { fixedSize: { height: 128, width: 128 } } }
      )
      picture
      coverPicture
      attributes {
        key
        value
      }
    }
  `,
);

export const AccountStatsFragment = graphql(
  `
    fragment AccountStats on AccountStats {
      followers
      following
      posts
      comments
      mirrors
      quotes
      publications
    }
  `,
);

export const AccountFragment = graphql(
  `
    fragment Account on Account {
      __typename
      address
      username {
        ...Username
      }
      metadata {
        ...AccountMetadata
      }
      stats {
        ...AccountStats
      }
      operations {
        isFollowedByMe
        isFollowingMe
        canFollow
      }
    }
  `,
  [UsernameFragment, AccountMetadataFragment, AccountStatsFragment],
);
