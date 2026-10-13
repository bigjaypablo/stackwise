import { Link } from "@tanstack/react-router";
import { Cover } from "@/components/cover";
import { TimeAgo } from "@/components/time-ago";
import { categoryById, usePublicData } from "@/lib/use-public";
import type { Post } from "@/lib/types";

export function TopStories({ posts }: { posts: Post[] }) {
  const data = usePublicData();

  return (
    <aside className="glass rounded-[1.75rem] p-4" aria-labelledby="top-stories">
      <div className="mb-2 flex items-center justify-between">
        <h3 id="top-stories" className="font-extrabold">
          Top Stories
        </h3>
        <Link to="/search" search={{ q: "" }} className="text-sm font-semibold text-accent">
          View all
        </Link>
      </div>
      <ol>
        {posts.map((post, index) => (
          <li key={post.id} className="flex items-center gap-3 border-b border-ink/10 py-3 last:border-b-0">
            <span className="w-6 text-2xl font-black tabular-nums text-ink/25">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <Link
                to="/post/$slug"
                params={{ slug: post.slug }}
                className="line-clamp-2 text-sm font-semibold hover:text-accent"
              >
                {post.title}
              </Link>
              <p className="mt-1 text-xs text-ink/55">
                <TimeAgo iso={post.publishedAt} />
              </p>
            </div>
            <Cover
              category={categoryById(data.categories, post.categoryId)}
              title={post.title}
              url={post.coverUrl}
              className="size-14 shrink-0 rounded-2xl"
            />
          </li>
        ))}
      </ol>
    </aside>
  );
}
