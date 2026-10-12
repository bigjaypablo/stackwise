export function Logo({ tone = "ink", compact = false }: { tone?: "ink" | "paper"; compact?: boolean }) {
  const word = tone === "paper" ? "text-paper" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-2 ${word}`}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <rect x="3" y="5" width="18" height="6" rx="1.6" fill="currentColor" />
        <rect x="11" y="13" width="18" height="6" rx="1.6" className="text-accent" fill="currentColor" />
        <rect x="3" y="21" width="18" height="6" rx="1.6" fill="currentColor" opacity="0.72" />
      </svg>
      <span className="leading-none">
        <span className={`block font-extrabold tracking-[-0.04em] ${compact ? "text-base" : "text-xl"}`}>
          STACKWISE
        </span>
        {tone === "paper" && !compact ? (
          <span className="mt-1 block text-xs font-medium text-paper/70">Tools tested before you pay.</span>
        ) : null}
      </span>
    </span>
  );
}
