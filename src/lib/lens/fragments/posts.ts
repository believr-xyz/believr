// NOTE: Temporarily not using custom fragments - using Lens default fragments
// Will uncomment and optimize when we know exactly which fields we need

/*
import { graphql } from "@lens-protocol/client";
import { AccountFragment } from "./accounts";
import { MediaImageFragment } from "./media";

// Metadata fragments for different post types
export const TextOnlyMetadataFragment = graphql(
  `
    fragment TextOnlyMetadata on TextOnlyMetadata {
      __typename
      content
      tags
    }
  `,
);

export const ImageMetadataFragment = graphql(
  `
    fragment ImageMetadata on ImageMetadata {
      __typename
      content
      tags
      image {
        ...MediaImage
      }
    }
  `,
  [MediaImageFragment],
);

// Combined post metadata fragment
export const PostMetadataFragment = graphql(
  `
    fragment PostMetadata on PostMetadata {
      __typename
      content
      tags
      ... on TextOnlyMetadata {
        ...TextOnlyMetadata
      }
      ... on ImageMetadata {
        ...ImageMetadata
      }
    }
  `,
  [TextOnlyMetadataFragment, ImageMetadataFragment],
);

// Stats for posts
export const PostStatsFragment = graphql(
  `
    fragment PostStats on PostStats {
      __typename
      reactions
      comments
      mirrors
      quotes
      collects
      bookmarks
    }
  `,
);

// Simple collect action for investment features
export const SimpleCollectActionFragment = graphql(
  `
    fragment SimpleCollectAction on SimpleCollectAction {
      __typename
      collectLimit
      followerOnGraph
      endsAt
      collectNftAddress
    }
  `,
);

// Main post fragment
export const PostFragment = graphql(
  `
    fragment Post on Post {
      __typename
      id
      slug
      timestamp
      by {
        ...Account
      }
      metadata {
        ...PostMetadata
      }
      stats {
        ...PostStats
      }
      operations {
        hasBookmarked
        hasReacted
        hasCollected: hasSimpleCollected
        canComment
        canMirror: canRepost
        canCollect: canSimpleCollect
      }
      actions {
        ... on SimpleCollectAction {
          ...SimpleCollectAction
        }
      }
    }
  `,
  [AccountFragment, PostMetadataFragment, PostStatsFragment, SimpleCollectActionFragment],
);
*/
