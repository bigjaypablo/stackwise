import { categorySlug } from "@/lib/category-slug";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cover } from "@/components/cover";
import { ArrowIcon } from "@/components/icons";
import { TestedBadge } from "@/components/tested-seal";
import type { Post } from "@/lib/types";


export function HeroGlass({
  posts,
  categoryName,
}: {
  posts: Post[];
  categoryName: (post: Post) => string;
}) {
  const [index, setIndex] = useState(0);
  const post = posts[index] ?? posts[0];

  useEffect(() => {
    if (posts.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % posts.length), 7000);
    return () => window.clearInterval(timer);
  }, [posts.length]);

  if (!post) {
    return (
      <div className="glass flex min-h-80 items-end rounded-[1.75rem] p-6">
        <p>Stories will show up here after an editor publishes one.</p>
      </div>
    );
  }

  const name = categoryName(post);

  return (
    <article className="group relative isolate min-h-[26rem] overflow-hidden rounded-[1.75rem] border border-white/70 bg-ink text-white shadow-glass">
      <div key={post.id} className="fade-in absolute inset-0">
        <Cover
          title={post.title}
          priority
          url={post.coverUrl}
          category={{ id: "", slug: categorySlug(name), name, description: "" }}
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/45 to-transparent" />

      <div className="relative flex h-full min-h-[26rem] flex-col justify-end p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="glass-dark rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">{name}</span>
          {post.isTest ? <TestedBadge /> : null}
        </div>
        <h1 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          <Link to="/post/$slug" params={{ slug: post.slug }} className="hover:underline">
            {post.title}
          </Link>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">{post.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link to="/post/$slug" params={{ slug: post.slug }} className="pill-light h-11 px-5">
            Read Full Story
            <ArrowIcon className="size-4" />
          </Link>
          <div className="glass-dark flex items-center gap-2 rounded-full px-3 py-2.5" role="tablist" aria-label="Featured stories">
            {posts.map((item, dot) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={dot === index}
                aria-label={`Show featured story ${dot + 1}: ${item.title}`}
                className={`h-2 rounded-full transition-all ${dot === index ? "w-6 bg-white" : "w-2 bg-white/45"}`}
                onClick={() => setIndex(dot)}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
