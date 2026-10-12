import { Link } from "@tanstack/react-router";
import { Cover } from "@/components/cover";
import { TimeAgo } from "@/components/time-ago";
import type { Category, Post } from "@/lib/types";

export function StoryCard({
  post,
  category,
  size = "small",
}: {
  post: Post;
  category?: Category;
  size?: "mini" | "small" | "large";
}) {
  if (size === "mini") {
    return (
      <article className="flex min-w-[16.5rem] gap-3 rounded-2xl border border-line bg-paper p-2.5 shadow-sm">
        <Cover category={category} title={post.title} url={post.coverUrl} className="size-16 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            <Link to="/post/$slug" params={{ slug: post.slug }} className="hover:text-accent">
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

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
      <Link to="/post/$slug" params={{ slug: post.slug }} className="block">
        <Cover
          category={category}
          title={post.title}
          url={post.coverUrl}
          className={size === "large" ? "aspect-[16/10]" : "aspect-[16/9]"}
        />
      </Link>
      <div className="p-3">
        {category ? (
          <p className="text-xs font-bold uppercase tracking-wide text-accent">{category.name}</p>
        ) : null}
        <h3 className={`mt-1 font-bold leading-snug ${size === "large" ? "text-xl" : "text-sm"}`}>
          <Link to="/post/$slug" params={{ slug: post.slug }} className="hover:text-accent">
            {post.title}
          </Link>
        </h3>
        {size === "large" ? <p className="mt-2 line-clamp-2 text-sm text-ink/70">{post.summary}</p> : null}
        <p className="mt-2 text-xs text-ink/55">
          <TimeAgo iso={post.publishedAt} />
        </p>
      </div>
    </article>
  );
}
