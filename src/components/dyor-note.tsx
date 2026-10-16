export function DyorNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`max-w-3xl rounded-2xl border border-ink/10 bg-white/60 px-4 py-3 text-xs leading-relaxed text-ink/65 ${className}`}
    >
      <strong className="font-semibold text-ink/80">Do your own research.</strong> This post is information only, not
      financial, investment or legal advice, and nothing here is a promise or a guarantee. Prices, features and risks
      change, so check the official source before you spend money or connect a wallet.
    </p>
  );
}
