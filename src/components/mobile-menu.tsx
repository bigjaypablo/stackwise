import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowIcon } from "@/components/icons";
import { Socials } from "@/components/socials";
import { NAV } from "@/lib/nav";

const ROW = "flex h-12 items-center justify-between px-5 text-[15px] font-semibold text-ink";
const ROW_ACTIVE = "flex h-12 items-center justify-between px-5 text-[15px] font-bold text-accent";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        className="fixed inset-0 z-40 cursor-default bg-ink/30 md:hidden"
        onClick={onClose}
      />
      <div
        id="mobile-sections"
        className="absolute inset-x-0 top-full z-50 overflow-hidden rounded-b-2xl border-t border-ink/10 bg-white shadow-2xl md:hidden"
      >
        <ul className="divide-y divide-ink/10">
          {NAV.map((item) =>
            item.to === "/" ? (
              <li key={item.label}>
                <Link to="/" activeOptions={{ exact: true }} className={ROW} activeProps={{ className: ROW_ACTIVE }}>
                  {item.label}
                  <ArrowIcon className="size-4 text-ink/30" />
                </Link>
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  to="/category/$slug"
                  params={{ slug: item.slug }}
                  className={ROW}
                  activeProps={{ className: ROW_ACTIVE }}
                >
                  {item.label}
                  <ArrowIcon className="size-4 text-ink/30" />
                </Link>
              </li>
            ),
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-ink/10 bg-mist px-5 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">Follow Stackwise</span>
          <Socials />
        </div>
      </div>
    </>
  );
}
