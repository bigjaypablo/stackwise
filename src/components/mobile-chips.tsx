import { Link } from "@tanstack/react-router";
import { Socials } from "@/components/socials";
import { NAV } from "@/lib/nav";

const CHIP =
  "inline-flex h-8 shrink-0 items-center rounded-full border border-ink/10 bg-white/70 px-3 text-xs font-semibold text-ink/80 transition hover:text-ink data-[status=active]:border-accent/30 data-[status=active]:bg-accent/10 data-[status=active]:text-accent";

export function MobileChips() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 md:hidden">
      <span aria-hidden="true" className="h-5 w-px shrink-0 bg-ink/10" />
      <ul className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [-webkit-mask-image:linear-gradient(90deg,#000_88%,transparent)] [mask-image:linear-gradient(90deg,#000_88%,transparent)]">
        {NAV.map((item) =>
          item.to === "/" ? null : (
            <li key={item.label} className="shrink-0">
              <Link to="/category/$slug" params={{ slug: item.slug }} className={CHIP}>
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
      <Socials className="shrink-0" />
    </div>
  );
}
