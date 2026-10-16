import { AffiliateLink } from "@/components/affiliate-link";
import { ResearchMark } from "@/components/research-mark";
import type { Affiliate } from "@/lib/types";

export function OurPick({ affiliate }: { affiliate: Affiliate }) {
  return (
    <aside className="glass mt-8 max-w-3xl rounded-[1.75rem] p-5 sm:p-6" aria-labelledby="our-pick">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-ink to-accent text-lg font-extrabold text-white">
          {affiliate.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Our pick</p>
          <h2 id="our-pick" className="flex items-center gap-2 text-xl font-extrabold">
            <span className="truncate">{affiliate.name}</span>
            <ResearchMark className="size-5 shrink-0" />
          </h2>
        </div>
      </div>
      <p className="mt-3 max-w-xl text-sm text-ink/70">
        If you use this link, Stackwise may earn a commission. It does not change what we wrote, and you should still
        read the notes above.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <AffiliateLink affiliate={affiliate} className="pill-accent">
          Visit {affiliate.name}
        </AffiliateLink>
        <span className="text-xs text-ink/50">Contains affiliate links</span>
      </div>
    </aside>
  );
}
