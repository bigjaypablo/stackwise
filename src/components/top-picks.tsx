import { Link } from "@tanstack/react-router";
import { AffiliateLink } from "@/components/affiliate-link";
import { TestedSeal } from "@/components/tested-seal";
import { affiliateById, usePublicData } from "@/lib/use-public";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TopPicksGlass() {
  const data = usePublicData();
  const tools = data.tools.slice(0, 5);

  return (
    <aside className="glass flex flex-col rounded-[1.75rem] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight">Top Picks</h2>
        <Link to="/category/$slug" params={{ slug: "reviews" }} className="text-sm font-semibold text-accent">
          View all
        </Link>
      </div>
      <ol className="flex flex-1 flex-col gap-2.5">
        {tools.map((tool) => {
          const affiliate = affiliateById(data.affiliates, tool.affiliateId);
          return (
            <li
              key={tool.id}
              className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 p-2.5 shadow-[0_8px_20px_-14px_rgb(15_23_42/0.35)]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-ink to-accent text-base font-extrabold text-white">
                {tool.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate font-semibold">
                  <span className="truncate">{tool.name}</span>
                  <TestedSeal className="size-4 shrink-0" />
                </p>
                <p className="mt-0.5 flex items-center gap-2 truncate text-xs text-ink/60">
                  <span className="rounded-full bg-ink px-2 py-0.5 font-bold tabular-nums text-white">
                    {tool.rating.toFixed(1)}
                  </span>
                  {tool.category}
                </p>
              </div>
              {affiliate ? (
                <AffiliateLink affiliate={affiliate} className="pill-light shrink-0">
                  Visit <PlusIcon />
                </AffiliateLink>
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="pt-3 text-xs text-ink/50">Contains affiliate links</p>
    </aside>
  );
}
