import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Socials } from "@/components/socials";
import { ResearchMark } from "@/components/research-mark";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Crypto", to: "/category/$slug" as const, slug: "crypto" },
      { label: "AI Tools", to: "/category/$slug" as const, slug: "ai-tools" },
      { label: "SaaS", to: "/category/$slug" as const, slug: "saas" },
      { label: "Reviews", to: "/category/$slug" as const, slug: "reviews" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Comparisons", to: "/category/$slug" as const, slug: "comparisons" },
      { label: "Guides", to: "/category/$slug" as const, slug: "guides" },
      { label: "Deals", to: "/category/$slug" as const, slug: "deals" },
      { label: "About", to: "/about" as const },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", to: "/contact" as const },
      { label: "Affiliate disclosure", to: "/affiliate-disclosure" as const },
      { label: "Privacy", to: "/privacy" as const },
      { label: "Search", to: "/search" as const },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="relative mt-4 overflow-hidden rounded-t-[2rem] bg-ink text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-accent/30 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="paper" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">
            Independent research on crypto, AI, and SaaS tools.
          </p>
          <p className="glass-dark mt-4 inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-xs font-semibold">
            <ResearchMark className="size-4" />
            Research only. Not financial advice.
          </p>
          <Socials tone="dark" className="mt-4" />
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-bold">{column.title}</h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  {"slug" in link && link.slug ? (
                    <Link to="/category/$slug" params={{ slug: link.slug }} className="text-sm text-paper/75 hover:text-paper">
                      {link.label}
                    </Link>
                  ) : link.to === "/search" ? (
                    <Link to="/search" search={{ q: "" }} className="text-sm text-paper/75 hover:text-paper">
                      {link.label}
                    </Link>
                  ) : (
                    <Link to={link.to} className="text-sm text-paper/75 hover:text-paper">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Stackwise. All rights reserved.</p>
          <p>Some outbound links are affiliate links and we may earn a commission. Information only. Do your own research.</p>
        </div>
      </div>
    </footer>
  );
}
