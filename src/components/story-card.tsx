import { Link } from "@tanstack/react-router";
import { Cover } from "@/components/cover";
import { TimeAgo } from "@/components/time-ago";
import type { Category, Post } from "@/lib/types";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function StoryCard({
  post,
  category,
  size = "small",
  className = "",
}: {
  post: Post;
  category?: Category;
  size?: "mini" | "small" | "large";
  className?: string;
}) {
  if (size === "mini") {
    return (
      <article className="glass group relative flex min-w-[16.5rem] gap-3 rounded-3xl p-2.5">
        <Cover category={category} title={post.title} url={post.coverUrl} className="size-16 shrink-0 rounded-2xl" />
        <div className="min-w-0 self-center">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            <Link
              to="/post/$slug"
              params={{ slug: post.slug }}
              className="after:absolute after:inset-0 after:rounded-3xl hover:text-accent"
            >
              {post.title}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-ink/60">
            {category?.name} · <TimeAgo iso={post.publishedAt} />
          </p>
        </div>
      </article>
    );
  }

  const large = size === "large";

  return (
    <article
      className={`group relative isolate overflow-hidden rounded-[1.75rem] border border-white/70 shadow-glass ${
        large ? "aspect-[4/5]" : "aspect-[16/11]"
      } ${className}`}
    >
      <div className="absolute inset-0 transition duration-700 ease-out group-hover:scale-[1.05]">
        <Cover category={category} title={post.title} url={post.coverUrl} className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

      <Link to="/post/$slug" params={{ slug: post.slug }} aria-label={post.title} className="absolute inset-0 z-10" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5">
        {category ? (
          <span className="glass-dark inline-block rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
            {category.name}
          </span>
        ) : null}
        <h3 className={`mt-2 font-bold leading-snug text-white ${large ? "text-2xl" : "line-clamp-3 text-base"}`}>
          {post.title}
        </h3>
        {large ? <p className="mt-2 line-clamp-2 text-sm text-white/75">{post.summary}</p> : null}
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-white/65">
            <TimeAgo iso={post.publishedAt} />
          </p>
          <span className="pill-glass" aria-hidden="true">
            Read <ArrowIcon />
          </span>
        </div>
      </div>
    </article>
  );
}
