import { useContext, useEffect, useMemo, useState } from "react";
import { demoMode, getPublicSnapshot, subscribeChanges } from "@/lib/api";
import { PublicSnapshotContext } from "@/lib/public-context";
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

function emptySnapshot(): PublicSnapshot {
  return { posts: [], categories: [], tools: [], affiliates: [], demo: false };
}

export function usePublicData(): PublicSnapshot & { ready: boolean } {
  const initial = useContext(PublicSnapshotContext);
  const [local, setLocal] = useState<PublicSnapshot>(() => (demoMode ? seedSnapshot() : emptySnapshot()));
  const [localReady, setLocalReady] = useState(demoMode);

  useEffect(() => {
    if (initial) return;
    let cancel = false;
    const load = () => {
      getPublicSnapshot()
        .then((next) => {
          if (cancel) return;
          setLocal(next);
          setLocalReady(true);
        })
        .catch(() => {
          if (!cancel) setLocalReady(true);
        });
    };
    load();
    const unsubscribe = subscribeChanges(load);
    return () => {
      cancel = true;
      unsubscribe();
    };
  }, [initial]);

  return useMemo(
    () => (initial ? { ...initial, ready: true } : { ...local, ready: localReady }),
    [initial, local, localReady],
  );
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
