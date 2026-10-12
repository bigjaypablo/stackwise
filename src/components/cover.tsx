import { useState } from "react";
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

export function Cover({
  category,
  title,
  url,
  className = "",
}: {
  category?: Category;
  title: string;
  url?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const slug = category?.slug ?? "guides";
  const showImage = Boolean(url) && !failed;

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden={showImage ? undefined : true}>
      {showImage ? (
        <img
          src={url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={`absolute inset-0 flex items-center justify-center cover-${slug}`}>
          <svg viewBox="0 0 24 24" className="size-8 text-paper/90" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d={marks[slug] ?? marks.guides} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">{title}</span>
        </div>
      )}
    </div>
  );
}
