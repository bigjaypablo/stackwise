import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowIcon, CloseIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { Socials } from "@/components/socials";
import { NAV } from "@/lib/nav";
import { OWNER } from "@/lib/site";

const PRIMARY =
  "menu-item group flex items-center justify-between border-b border-white/10 py-3.5 text-[1.7rem] font-extrabold leading-none tracking-tight text-white/90 transition hover:text-white data-[status=active]:text-blue-400";
const SECONDARY = "text-[0.95rem] text-white/70 transition hover:text-white";
const LABEL = "font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/45";

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
    <div
      id="mobile-sections"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-ink text-white md:hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-28 size-80 rounded-full bg-accent/30 blur-3xl"
      />

      <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
        <Link to="/" aria-label="Stackwise home" onClick={onClose}>
          <Logo tone="paper" />
        </Link>
        <button
          type="button"
          autoFocus
          aria-label="Close menu"
          onClick={onClose}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 transition hover:bg-white/10"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="relative flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-2">
        <nav aria-label="Sections">
          <ul>
            {NAV.map((item, index) => (
              <li key={item.label} className="menu-item" style={{ animationDelay: `${index * 40}ms` }}>
                {item.to === "/" ? (
                  <Link to="/" activeOptions={{ exact: true }} onClick={onClose} className={PRIMARY}>
                    {item.label}
                    <ArrowIcon className="size-5 text-white/30 transition group-hover:text-white" />
                  </Link>
                ) : (
                  <Link
                    to="/category/$slug"
                    params={{ slug: item.slug }}
                    onClick={onClose}
                    className={PRIMARY}
                  >
                    {item.label}
                    <ArrowIcon className="size-5 text-white/30 transition group-hover:text-white" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <section className="mt-9" aria-labelledby="menu-company">
          <h2 id="menu-company" className={LABEL}>
            Company
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3.5">
            <li>
              <Link to="/about" onClick={onClose} className={SECONDARY}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={onClose} className={SECONDARY}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/affiliate-disclosure" onClick={onClose} className={SECONDARY}>
                Affiliate disclosure
              </Link>
            </li>
            <li>
              <Link to="/privacy" onClick={onClose} className={SECONDARY}>
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/search" search={{ q: "" }} onClick={onClose} className={SECONDARY}>
                Search
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-9" aria-labelledby="menu-follow">
          <h2 id="menu-follow" className={LABEL}>
            Follow
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <Socials tone="outline" size="lg" />
            <p className="text-sm text-white/60">@{OWNER.handle}</p>
          </div>
        </section>
      </div>

      <div className="relative flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-ink px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <p className="min-w-0 text-sm font-semibold leading-snug text-white/85">Tools tested before you pay.</p>
        <Link to="/" hash="newsletter" onClick={onClose} className="pill-accent shrink-0">
          Subscribe
        </Link>
      </div>
    </div>
  );
}
