import { useEffect, useState } from "react";
import { getPublicSnapshot, subscribeChanges } from "@/lib/api";
import { freshSeed } from "@/lib/seed";
import type { Affiliate, Category, Post, PublicSnapshot, Tool } from "@/lib/types";

function seedSnapshot(): PublicSnapshot {
  const data = freshSeed();
  return {
    posts: data.posts.filter((post) => post.status === "published"),
    categories: data.categories,
    tools: data.tools.slice().sort((a, b) => a.rank - b.rank),
    affiliates: data.affiliates,
    demo: true,
  };
}

export function usePublicData(): PublicSnapshot {
  const [snapshot, setSnapshot] = useState<PublicSnapshot>(seedSnapshot);

  useEffect(() => {
    let cancel = false;
    const load = () => {
      getPublicSnapshot()
        .then((next) => {
          if (!cancel) setSnapshot(next);
        })
        .catch(() => undefined);
    };
    load();
    const unsubscribe = subscribeChanges(load);
    return () => {
      cancel = true;
      unsubscribe();
    };
  }, []);

  return snapshot;
}

export function categoryById(categories: Category[], id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function affiliateById(affiliates: Affiliate[], id: string): Affiliate | undefined {
  return affiliates.find((affiliate) => affiliate.id === id);
}

export function postsByCategory(posts: Post[], categories: Category[], slug: string): Post[] {
  const category = categories.find((item) => item.slug === slug);
  if (!category) return [];
  return posts.filter((post) => post.categoryId === category.id);
}

export function toolAffiliate(tools: Tool[], affiliates: Affiliate[], tool: Tool): Affiliate | undefined {
  return affiliateById(affiliates, tool.affiliateId);
}
