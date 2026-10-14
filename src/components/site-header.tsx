import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { MenuIcon, SearchIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { Socials } from "@/components/socials";
import { longDate } from "@/lib/format";
import { NAV } from "@/lib/nav";
import type { Post } from "@/lib/types";

const DESKTOP_LINK = "inline-flex h-12 items-center px-3 text-sm font-semibold text-ink/80";
const DESKTOP_ACTIVE = "inline-flex h-12 items-center border-b-2 border-accent px-3 text-sm font-bold text-accent";

export function SiteHeader({ trending }: { trending: Post[] }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const titles = trending.map((post) => post.title);
  const loop = [...titles, ...titles];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="relative isolate z-40 border-b border-white/60">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white/60 backdrop-blur-xl" />

      <div className="border-b border-ink/10">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-xs text-ink/70">
          <p className="hidden shrink-0 sm:block">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {longDate()}
          </p>
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden" aria-label="Trending stories">
            <span className="shrink-0 font-bold tracking-wide text-accent">TRENDING:</span>
            <p className="sr-only">{titles.join(". ")}</p>
            <div className="ticker-mask min-w-0 flex-1" aria-hidden="true">
              <div className="ticker-track flex w-max gap-8">
                {loop.map((title, index) => (
                  <span key={`${title}-${index}`} className="whitespace-nowrap">
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Socials className="hidden md:flex" />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-sections"
          onClick={() => setOpen(true)}
          className="-ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-ink/5 md:hidden"
        >
          <MenuIcon className="size-6" />
        </button>
        <Link to="/" aria-label="Stackwise home" className="mr-auto">
          <Logo />
        </Link>
        <form
          role="search"
          className="order-3 flex w-full items-center rounded-full border border-ink/10 bg-white/80 sm:order-none sm:w-auto sm:min-w-72 sm:flex-1 lg:max-w-xl"
          onSubmit={(event) => {
            event.preventDefault();
            navigate({ to: "/search", search: { q: query } });
          }}
        >
          <label htmlFor="site-search" className="sr-only">
            Search Stackwise
          </label>
          <input
            id="site-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tests, guides, and tools"
            className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
          />
          <button type="submit" aria-label="Search" className="mr-1 inline-flex size-10 items-center justify-center rounded-full text-ink/70 hover:text-accent">
            <SearchIcon className="size-5" />
          </button>
        </form>
        <Link to="/" hash="newsletter" className="pill-accent">
          Subscribe
        </Link>
      </div>

      <nav aria-label="Sections" className="mx-auto hidden max-w-7xl px-4 md:block">
        <ul className="no-scrollbar flex min-w-0 items-center gap-1 overflow-x-auto border-t border-ink/10">
          {NAV.map((item) =>
            item.to === "/" ? (
              <li key={item.label}>
                <Link to="/" activeOptions={{ exact: true }} className={DESKTOP_LINK} activeProps={{ className: DESKTOP_ACTIVE }}>
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  to="/category/$slug"
                  params={{ slug: item.slug }}
                  className={DESKTOP_LINK}
                  activeProps={{ className: DESKTOP_ACTIVE }}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>

      <MobileMenu open={open} onClose={close} />
    </header>
  );
}
