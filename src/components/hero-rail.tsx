import { Cover } from "@/components/cover";
import { coverCategory } from "@/lib/category-slug";
import type { Post } from "@/lib/types";

export function HeroRail({
  posts,
  active,
  onSelect,
  categoryName,
}: {
  posts: Post[];
  active: number;
  onSelect: (index: number) => void;
  categoryName: (post: Post) => string;
}) {
  if (posts.length < 2) return null;

  return (
    <div
      className="no-scrollbar -mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible"
      role="tablist"
      aria-label="Featured stories"
    >
      {posts.map((item, index) => {
        const isActive = index === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(index)}
            className={`glass-dark relative flex min-w-[13rem] items-center gap-2.5 overflow-hidden rounded-2xl p-2 text-left transition sm:min-w-0 ${
              isActive ? "border-white/50 bg-white/20" : "opacity-80 hover:opacity-100"
            }`}
          >
            <Cover
              title={item.title}
              url={item.coverUrl}
              category={coverCategory(categoryName(item))}
              className="size-11 shrink-0 rounded-xl"
            />
            <span className="line-clamp-2 text-xs font-semibold leading-snug text-white">{item.title}</span>
            {isActive ? (
              <span
                key={active}
                aria-hidden="true"
                className="rail-progress absolute inset-x-0 bottom-0 h-0.5 bg-white/80"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
