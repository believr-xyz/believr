// This is a Server Component

import { GroupsPageClient } from "./_components/groups-page-client";

// Export Group interface to share with client component
export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  image?: string;
  creator: {
    handle: string;
    avatar?: string;
  };
  posts: Array<{
    id: string;
    content: string;
    createdAt: Date;
    image?: string;
    creator: {
      id: string;
      handle: string;
      name: string;
      avatar?: string;
    };
  }>;
  isMember: boolean;
}

// Single mock group for UI display
const MOCK_GROUP: Group = {
  id: "group-1",
  name: "SaaS Believers",
  description:
    "A community for believers in SaaS startups and projects. We focus on supporting early-stage SaaS founders.",
  members: 156,
  image:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format",
  creator: {
    handle: "web3sarah",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format",
  },
  posts: [
    {
      id: "post-1",
      content:
        "New SaaS Productivity Tool - early believers get lifetime access!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      creator: {
        id: "creator-1",
        handle: "web3sarah",
        name: "Sarah Web3",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
      },
    },
  ],
  isMember: false,
};

export default function GroupPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the group data from Lens API based on params.id
  return <GroupsPageClient group={MOCK_GROUP} />;
}
