// This is a Server Component

import { GroupsPageClient } from "./_components/groups-page-client";

// Export Group interface to share with client component
export interface Group {
  id: string;
  name: string;
  description: string;
  image?: string;
  members: number;
  isPrivate?: boolean;
}

// Minimal mock data - just two examples for UI display
const MOCK_GROUPS: Group[] = [
  {
    id: "group-1",
    name: "SaaS Believers",
    description: "Support early-stage SaaS founders and projects.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format",
    members: 156,
  },
  {
    id: "group-2",
    name: "Web3 Founders",
    description: "Early-stage Web3 startups looking for support.",
    image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=1200&auto=format",
    members: 94,
    isPrivate: true,
  },
];

export default function GroupsPage() {
  return <GroupsPageClient groups={MOCK_GROUPS} />;
}
