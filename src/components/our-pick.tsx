import { AffiliateLink } from "@/components/affiliate-link";
import type { Affiliate } from "@/lib/types";

export function OurPick({ affiliate }: { affiliate: Affiliate }) {
  return (
    <aside className="glass mt-8 max-w-3xl rounded-[1.75rem] p-5 sm:p-6" aria-labelledby="featured-tool">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-ink to-accent text-lg font-extrabold text-white">
          {affiliate.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Featured tool</p>
          <h2 id="featured-tool" className="truncate text-xl font-extrabold">
            {affiliate.name}
          </h2>
        </div>
      </div>
      <p className="mt-3 max-w-xl text-sm text-ink/70">
        If you use this link, Stackwise may earn a commission at no extra cost to you. It does not mean we have used or
        endorse the product. Read the sources above and do your own research first.
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
