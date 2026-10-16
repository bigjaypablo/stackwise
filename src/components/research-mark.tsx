export function ResearchMark({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#2563eb" />
      <circle cx="11" cy="11" r="4.2" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="m14.4 14.4 3.6 3.6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ResearchBadge({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const look =
    tone === "dark" ? "glass-dark text-white" : "border border-white/80 bg-white/80 text-ink shadow-sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-1.5 pr-2.5 text-[0.65rem] font-bold uppercase tracking-wider ${look}`}
    >
      <ResearchMark className="size-4" />
      Deep dive
    </span>
  );
}
