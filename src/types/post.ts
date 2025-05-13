export interface Creator {
  id: string;
  handle: string;
  name: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  stats: {
    followers: number;
    believers: number;
  };
}

export interface Collector {
  id: string;
  handle: string;
  name: string;
  avatar?: string;
  verified?: boolean;
  collectedAt: Date;
}

export interface CollectibleInfo {
  price: string;
  currency: string;
  collected: number;
  total: number;
  collectors?: Collector[];
}

export interface Benefit {
  type: "access" | "revenue" | "recognition" | "exclusive";
  title: string;
  description: string;
  percentage?: number; // For revenue sharing
}

export interface InvestmentTerms {
  goal: number;
  minThreshold?: number;
  deadline?: Date;
  description?: string;
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  createdAt: Date;
  image?: string;
  collectible?: CollectibleInfo;
  creator: Creator;
  benefits?: Benefit[];
  investmentTerms?: InvestmentTerms;
}

// Extended version for post detail pages
export interface PostDetail extends Post {
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  creator: Creator;
  reactions?: {
    likes: number;
    hasLiked?: boolean;
  };
}
