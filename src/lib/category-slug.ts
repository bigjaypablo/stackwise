import type { Category } from "@/lib/types";

const slugs: Record<string, string> = {
  Crypto: "crypto",
  "AI Tools": "ai-tools",
  SaaS: "saas",
  Reviews: "reviews",
  Comparisons: "comparisons",
  Guides: "guides",
  Deals: "deals",
};

export function categorySlug(name: string): string {
  return slugs[name] ?? "guides";
}

export function coverCategory(name?: string): Category {
  const label = name ?? "Reviews";
  return { id: "", slug: categorySlug(label), name: name ?? "", description: "" };
}
