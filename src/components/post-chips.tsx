import { TestedSeal } from "@/components/tested-seal";
import type { Category, Post } from "@/lib/types";

const DAY = 86_400_000;
const CHIP =
  "glass-dark inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white";

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function isUpdated(post: Post): boolean {
  if (!post.publishedAt || !post.updatedAt) return false;
  return Date.parse(post.updatedAt) - Date.parse(post.publishedAt) > 2 * DAY;
}

export function PostChips({
  post,
  category,
  className = "",
}: {
  post: Post;
  category?: Category;
  className?: string;
}) {
  const chips: Array<{ key: string; node: React.ReactNode }> = [];

  if (post.isTest) {
    chips.push({
      key: "tested",
      node: (
        <span className={CHIP}>
          <TestedSeal className="size-3.5" />
          Tested
        </span>
      ),
    });
  }
  if (isUpdated(post)) {
    chips.push({ key: "updated", node: <span className={CHIP}>Updated {monthYear(post.updatedAt)}</span> });
  }
  if (category?.slug === "deals") {
    chips.push({ key: "deal", node: <span className={`${CHIP} bg-amber-400/90 text-ink`}>Deal</span> });
  }

  if (chips.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {chips.map((chip) => (
        <span key={chip.key}>{chip.node}</span>
      ))}
    </div>
  );
}
