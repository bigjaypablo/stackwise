import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CloseIcon, FacebookIcon, InstagramIcon, MenuIcon, SearchIcon, XIcon, YouTubeIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { longDate } from "@/lib/format";
import type { Post } from "@/lib/types";

const NAV = [
  { label: "Home", to: "/" as const },
  { label: "Crypto", to: "/category/$slug" as const, slug: "crypto" },
  { label: "AI Tools", to: "/category/$slug" as const, slug: "ai-tools" },
  { label: "SaaS", to: "/category/$slug" as const, slug: "saas" },
  { label: "Reviews", to: "/category/$slug" as const, slug: "reviews" },
  { label: "Comparisons", to: "/category/$slug" as const, slug: "comparisons" },
  { label: "Guides", to: "/category/$slug" as const, slug: "guides" },
  { label: "Deals", to: "/category/$slug" as const, slug: "deals" },
];

function Socials({ className = "" }: { className?: string }) {
  const items = [
    { label: "Facebook", icon: FacebookIcon },
    { label: "X", icon: XIcon },
    { label: "Instagram", icon: InstagramIcon },
    { label: "YouTube", icon: YouTubeIcon },
  ];
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {items.map((item) => (
        <a
          key={item.label}
          href="/contact"
          aria-label={`${item.label}, placeholder`}
          className="inline-flex size-9 items-center justify-center rounded-full text-ink/70 hover:bg-mist hover:text-ink"
        >
          <item.icon className="size-4" />
        </a>
      ))}
    </div>
  );
}

export function SiteHeader({ trending }: { trending: Post[] }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const titles = trending.map((post) => post.title);
  const loop = [...titles, ...titles];

  return (
    <header className="border-b border-white/60 bg-white/60 backdrop-blur-xl">
      <div className="border-b border-line">
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
        <Link to="/" aria-label="Stackwise home" className="mr-auto">
          <Logo />
        </Link>
        <form
          role="search"
          className="order-3 flex w-full items-center rounded-full border border-white/80 bg-white/70 sm:order-none sm:w-auto sm:min-w-72 sm:flex-1 lg:max-w-xl"
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
        <Link
          to="/"
          hash="newsletter"
          className="inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm font-semibold text-paper hover:bg-accent/90"
        >
          Subscribe
        </Link>
      </div>

      <nav aria-label="Sections" className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-2 border-t border-line">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-sections"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close sections" : "Open sections"}</span>
            {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
          <ul className="no-scrollbar hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex">
            {NAV.map((item) =>
              item.to === "/" ? (
                <li key={item.label}>
                  <Link
                    to="/"
                    activeOptions={{ exact: true }}
                    className="inline-flex h-12 items-center px-3 text-sm font-semibold text-ink/80"
                    activeProps={{ className: "inline-flex h-12 items-center border-b-2 border-accent px-3 text-sm font-bold text-accent" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: item.slug }}
                    className="inline-flex h-12 items-center px-3 text-sm font-semibold text-ink/80"
                    activeProps={{ className: "inline-flex h-12 items-center border-b-2 border-accent px-3 text-sm font-bold text-accent" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
        {open ? (
          <ul id="mobile-sections" className="flex flex-col pb-3 md:hidden">
            {NAV.map((item) => (
              <li key={item.label}>
                {item.to === "/" ? (
                  <Link to="/" className="flex h-11 items-center text-sm font-semibold" onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    to="/category/$slug"
                    params={{ slug: item.slug }}
                    className="flex h-11 items-center text-sm font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </nav>
    </header>
  );
}
