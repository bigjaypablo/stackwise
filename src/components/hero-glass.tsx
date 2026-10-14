import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthorChip } from "@/components/author-chip";
import { Cover } from "@/components/cover";
import { HeroRail } from "@/components/hero-rail";
import { ArrowIcon } from "@/components/icons";
import { PostChips } from "@/components/post-chips";
import { coverCategory } from "@/lib/category-slug";
import type { Post } from "@/lib/types";

const SLIDE_MS = 7000;

export function HeroGlass({
  posts,
  categoryName,
}: {
  posts: Post[];
  categoryName: (post: Post) => string;
}) {
  const items = posts.slice(0, 4);
  const [index, setIndex] = useState(0);
  const post = items[index] ?? items[0];

  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % items.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, items.length]);

  if (!post) {
    return (
      <div className="glass flex min-h-80 items-end rounded-[1.75rem] p-6">
        <p>Stories will show up here after an editor publishes one.</p>
      </div>
    );
  }

  const name = categoryName(post);
  const category = coverCategory(name);

  return (
    <article className="group relative isolate min-h-[40rem] sm:min-h-[34rem] overflow-hidden rounded-[1.75rem] border border-white/70 bg-ink text-white shadow-glass">
      <div key={post.id} className="fade-in absolute inset-0">
        <Cover title={post.title} url={post.coverUrl} category={category} className="h-full w-full" priority />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.78)_50%,transparent_80%)]" />

      <div className="relative flex h-full min-h-[40rem] sm:min-h-[34rem] flex-col justify-end p-5 [text-shadow:0_1px_14px_rgb(0_0_0/0.6)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="glass-dark rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">{name}</span>
          <PostChips post={post} category={category} />
        </div>
        <h1 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          <Link to="/post/$slug" params={{ slug: post.slug }} className="hover:underline">
            {post.title}
          </Link>
        </h1>
        <p className="mt-3 line-clamp-2 max-w-xl text-sm text-white/80 sm:text-base">{post.summary}</p>
        <AuthorChip
          name={post.authorName}
          date={post.publishedAt || post.updatedAt}
          minutes={post.readMinutes}
          className="mt-4"
        />
        <div className="mt-4">
          <Link to="/post/$slug" params={{ slug: post.slug }} className="pill-light h-11 bg-white px-5">
            Read Full Story
            <ArrowIcon className="size-4" />
          </Link>
        </div>
        <HeroRail posts={items} active={index} onSelect={setIndex} categoryName={categoryName} />
      </div>
    </article>
  );
}
