import { Link } from "@tanstack/react-router";
import { Cover } from "@/components/cover";
import { PlayIcon } from "@/components/icons";
import { TestedBadge } from "@/components/tested-seal";
import { TimeAgo } from "@/components/time-ago";
import { coverCategory } from "@/lib/category-slug";
import { safeHttpUrl } from "@/lib/format";
import type { Post } from "@/lib/types";

export function TestCard({
  post,
  large = false,
  categoryName,
}: {
  post: Post;
  large?: boolean;
  categoryName?: string;
}) {
  const href = safeHttpUrl(post.youtubeUrl);

  return (
    <article
      className={`group relative isolate overflow-hidden rounded-[1.75rem] border border-white/70 bg-ink text-white shadow-glass ${
        large ? "aspect-video lg:aspect-auto lg:h-full lg:min-h-[26rem]" : "aspect-[16/9] lg:aspect-auto"
      }`}
    >
      <div className="absolute inset-0 transition duration-700 ease-out group-hover:scale-[1.05]">
        <Cover
          title={post.title}
          url={post.coverUrl}
          category={coverCategory(categoryName)}
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

      <Link to="/post/$slug" params={{ slug: post.slug }} aria-label={post.title} className="absolute inset-0 z-10" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 sm:p-4">
        {large ? <TestedBadge /> : <span />}
        {post.duration ? (
          <span className="glass-dark rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums">
            {post.duration}
          </span>
        ) : null}
      </div>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${post.title} on YouTube`}
          className={`glass-dark absolute z-30 grid place-items-center rounded-full text-white transition hover:scale-105 ${
            large ? "left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2" : "left-3 top-3 size-9"
          }`}
        >
          <PlayIcon className={large ? "size-7" : "size-4"} />
        </a>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4">
        <h3 className={`font-bold leading-snug ${large ? "text-xl sm:text-2xl" : "line-clamp-2 text-sm"}`}>
          {post.title}
        </h3>
        <p className="mt-1 text-xs text-white/65">
          <TimeAgo iso={post.publishedAt} />
          {href ? " · Video" : ""}
        </p>
      </div>
    </article>
  );
}
