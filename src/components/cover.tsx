import { useState } from "react";
import { COVER_COUNTS } from "@/lib/cover-pool";
import type { Category } from "@/lib/types";

const marks: Record<string, string> = {
  crypto: "M4 14h16M4 10h10M4 18h7",
  "ai-tools": "M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5",
  saas: "M5 8h14v10H5zM8 8V6h8v2",
  reviews: "M12 4l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z",
  comparisons: "M7 6v12M17 6v12M7 12h10",
  guides: "M6 5h9a3 3 0 0 1 3 3v11H9a3 3 0 0 0-3 3V5z",
  deals: "M5 8h14v4a2 2 0 0 1 0 4v1H5v-1a2 2 0 0 1 0-4V8z",
};

function defaultCover(slug: string, title: string): string | undefined {
  const count = COVER_COUNTS[slug] ?? 0;
  if (!count) return undefined;
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  return `/images/covers/${slug}-${(hash % count) + 1}.jpg`;
}

export function Cover({
  category,
  title,
  url,
  className = "",
  priority = false,
}: {
  category?: Category;
  title: string;
  url?: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const slug = category?.slug ?? "guides";
  const src = url || defaultCover(slug, title);
  const showImage = Boolean(src) && !failed;

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden={showImage ? undefined : true}>
      {showImage ? (
        <img
          src={src}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={`absolute inset-0 flex items-center justify-center cover-${slug}`}>
          <svg viewBox="0 0 24 24" className="size-9 text-paper/40" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d={marks[slug] ?? marks.guides} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">{title}</span>
        </div>
      )}
    </div>
  );
}
