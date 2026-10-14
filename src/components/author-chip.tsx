import { AuthorAvatar } from "@/components/author-avatar";
import { TimeAgo } from "@/components/time-ago";

export function AuthorChip({
  name,
  date,
  minutes,
  tone = "dark",
  className = "",
}: {
  name: string;
  date?: string;
  minutes?: number;
  tone?: "dark" | "light";
  className?: string;
}) {
  const muted = tone === "dark" ? "text-white/75" : "text-ink/60";
  const strong = tone === "dark" ? "text-white" : "text-ink";

  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      <AuthorAvatar name={name} />
      <p className={`min-w-0 truncate text-xs ${muted}`}>
        <span className={`font-semibold ${strong}`}>{name}</span>
        {date ? (
          <>
            {" · "}
            <TimeAgo iso={date} />
          </>
        ) : null}
        {minutes ? ` · ${minutes} min read` : null}
      </p>
    </div>
  );
}
