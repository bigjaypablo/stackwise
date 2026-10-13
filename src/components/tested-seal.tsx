export function TestedSeal({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="Stackwise Tested">
      <title>Stackwise Tested</title>
      <circle cx="12" cy="12" r="11" fill="#16a34a" />
      <path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TestedBadge() {
  return (
    <span className="glass-dark inline-flex items-center gap-1.5 rounded-full py-1 pl-1.5 pr-2.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
      <TestedSeal className="size-4" />
      Stackwise Tested
    </span>
  );
}
