export type Role = "admin" | "editor" | "writer";
export type PostStatus = "draft" | "in_review" | "published";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  categoryId: string;
  coverUrl: string;
  featured: boolean;
  status: PostStatus;
  authorId: string;
  authorName: string;
  youtubeUrl: string;
  duration: string;
  isTest: boolean;
  readMinutes: number;
  affiliateId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  rating: number;
  affiliateId: string;
  rank: number;
  blurb: string;
}

export interface Affiliate {
  id: string;
  name: string;
  url: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

export interface TeamUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
}

export interface PostQuery {
  status?: PostStatus | "all";
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  test?: boolean;
  includeUnpublished?: boolean;
}

export interface PublicSnapshot {
  posts: Post[];
  categories: Category[];
  tools: Tool[];
  affiliates: Affiliate[];
  demo: boolean;
}
