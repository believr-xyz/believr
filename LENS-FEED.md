# Lens Feed Integration for Believr

This document outlines the implementation plan for integrating Lens Protocol's feed-related features into the Believr application. The plan focuses on leveraging Lens SDK hooks and functionality to replace the current mock data with real Lens Protocol data.

## Current State Analysis

The Believr app currently has a feed implementation with the following components:

1. **Feed Page (`/feed`)** - Contains tabs for "For You", "Following", and "Popular" feeds
2. **PostCard Component** - Displays individual posts with creator info and engagement options
3. **Search Bar** - For finding creators and campaigns (currently using mock data)
4. **Trending Section** - Shows trending creators and campaigns

All of these components are currently using mock data rather than live data from Lens Protocol.

## Lens Protocol Feed Features to Implement

Based on analysis of the Lens SDK, we can implement the following feed-related features:

### 1. Search Functionality

**SDK Resources:**

- Lens GraphQL API for search query
- Client query for profile search

**Implementation Plan:**

- Replace mock profiles in `search-bar.tsx` with real data from Lens API
- Use search query with proper filtering for profiles
- Add proper error handling and loading states

### 2. Main Feed Content

**SDK Resources:**

- `useTimeline` hook from `@lens-protocol/react/timeline`
- `usePosts` hook from `@lens-protocol/react/post`
- `fetchTimeline` function from `@lens-protocol/client/actions`

**Implementation Plan:**

- Replace mock posts with real data from Lens API
- Implement different feed types:
  - "For You" tab: Use `useTimeline` to fetch authenticated user's timeline
  - "Following" tab: Use `usePosts` with filter for followed accounts
  - "Popular" tab: Use `usePosts` with sorting by popularity/engagement

### 3. Post Engagement Features

**SDK Resources:**

- `fetchPostReactions` from `@lens-protocol/client/actions`
- `fetchPostBookmarks` from `@lens-protocol/client/actions`
- React hooks for the above functionalities

**Implementation Plan:**

- Implement real "like", "comment", "repost" functionality
- Connect bookmark toggle button to Lens bookmarks
- Implement the "believe" (collect) functionality using Lens collect actions

### 4. Trending Content

**SDK Resources:**

- `usePosts` with appropriate filters for trending content
- Custom query for aggregating trending profiles

**Implementation Plan:**

- Replace mock trending creators with real data from Lens API
- Replace mock trending campaigns with real trending collectible posts
- Add proper loading states and error handling

## Implementation Details

### 1. Custom GraphQL Fragments

We'll need to define custom GraphQL fragments to efficiently fetch only the data we need:

```typescript
// src/lib/lens/fragments/feed.ts
import { graphql } from "@lens-protocol/client";
import { AccountFragment } from "./accounts";
import { MediaImageFragment } from "./media";

export const FeedPostFragment = graphql(
  `
    fragment FeedPost on Post {
      __typename
      id
      slug
      timestamp
      by {
        ...Account
      }
      metadata {
        content
        tags
        ... on ImageMetadata {
          image {
            ...MediaImage
          }
        }
      }
      stats {
        reactions
        comments
        mirrors
        quotes
        collects
      }
      operations {
        hasBookmarked
        hasReacted
        hasCollected: hasSimpleCollected
      }
      actions {
        ... on SimpleCollectAction {
          collectLimit
          followerOnGraph
          endsAt
        }
      }
    }
  `,
  [AccountFragment, MediaImageFragment]
);
```

### 2. Feed Hook Implementation

Create custom hooks for different feed types:

```typescript
// src/hooks/use-feed.ts
import { useTimeline } from "@lens-protocol/react/timeline";
import { usePosts } from "@lens-protocol/react/post";
import { useState } from "react";

export function useForYouFeed() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useTimeline({
    account: "0x...", // Current user address
    limit: 10,
    cursor: page > 1 ? String(page) : undefined,
  });

  const loadMore = () => setPage((prev) => prev + 1);

  return {
    posts: data?.items || [],
    hasMore: Boolean(data?.pageInfo.next),
    loading,
    error,
    loadMore,
  };
}

export function useFollowingFeed() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = usePosts({
    filter: {
      followedBy: "0x...", // Current user address
    },
    limit: 10,
    cursor: page > 1 ? String(page) : undefined,
  });

  const loadMore = () => setPage((prev) => prev + 1);

  return {
    posts: data?.items || [],
    hasMore: Boolean(data?.pageInfo.next),
    loading,
    error,
    loadMore,
  };
}

export function usePopularFeed() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = usePosts({
    filter: {
      popularityRange: {
        from: "high",
        to: "top",
      },
    },
    limit: 10,
    cursor: page > 1 ? String(page) : undefined,
  });

  const loadMore = () => setPage((prev) => prev + 1);

  return {
    posts: data?.items || [],
    hasMore: Boolean(data?.pageInfo.next),
    loading,
    error,
    loadMore,
  };
}
```

### 3. Search Implementation

Implement profile search functionality:

```typescript
// src/hooks/use-search.ts
import { usePosts } from "@lens-protocol/react/post";
import { useState } from "react";

export function useProfileSearch(query: string) {
  const { data, loading, error } = usePosts({
    filter: {
      searchQuery: query,
    },
    limit: 5,
  });

  return {
    profiles: data?.items.map((item) => item.by) || [],
    loading,
    error,
  };
}
```

### 4. Post Engagement Implementation

Implement post interactions:

```typescript
// src/hooks/use-post-interactions.ts
import { useReaction } from "@lens-protocol/react/post";
import { useBookmark } from "@lens-protocol/react/post";
import { useCollect } from "@lens-protocol/react/post";

export function usePostInteractions(postId: string) {
  const { execute: toggleReaction, loading: reactionLoading } = useReaction();

  const { execute: toggleBookmark, loading: bookmarkLoading } = useBookmark();

  const { execute: collect, loading: collectLoading } = useCollect();

  const handleReaction = async () => {
    const result = await toggleReaction({ post: postId });
    return result.isOk();
  };

  const handleBookmark = async () => {
    const result = await toggleBookmark({ post: postId });
    return result.isOk();
  };

  const handleCollect = async () => {
    const result = await collect({ post: postId });
    return result.isOk();
  };

  return {
    handleReaction,
    handleBookmark,
    handleCollect,
    reactionLoading,
    bookmarkLoading,
    collectLoading,
  };
}
```

## Implementation Roadmap

1. **Setup GraphQL Fragments** - Create necessary fragments for efficient data fetching
2. **Profile Search Integration** - Replace mock search with real Lens API search
3. **Feed Integration** - Implement main feed components with real data
4. **Post Engagement** - Implement post interaction functionalities
5. **Trending Content** - Replace mock trending data with real trending content
6. **Error Handling & Optimization** - Add robust error handling and optimize performance

## Technical Considerations

1. **Authentication** - Ensure proper lens authentication for all actions
2. **Error Handling** - Use the functional Result pattern from Lens SDK for error handling
3. **Performance** - Implement pagination, infinite scrolling, and request throttling
4. **Cache Management** - Use TanStack Query's cache capabilities for efficient data management
5. **Offline Support** - Add data persistence for better offline experience

## Next Steps

1. Implement search bar integration first as a standalone feature
2. Integrate main feed components with real data
3. Add post engagement functionality
4. Implement trending section with real data
5. Add optimistic UI updates for better UX
