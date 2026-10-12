import { Link } from "@tanstack/react-router";
import { FacebookIcon, InstagramIcon, XIcon, YouTubeIcon } from "@/components/icons";
import { Logo } from "@/components/logo";

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
  const socials = [
    { label: "Facebook", icon: FacebookIcon },
    { label: "X", icon: XIcon },
    { label: "Instagram", icon: InstagramIcon },
    { label: "YouTube", icon: YouTubeIcon },
  ];

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="paper" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">
            Independent notes on crypto, AI, and SaaS tools. We test before we link.
          </p>
          <div className="mt-4 flex gap-1">
            {socials.map((item) => (
              <a
                key={item.label}
                href="/contact"
                aria-label={`${item.label}, placeholder`}
                className="inline-flex size-10 items-center justify-center rounded-full text-paper/80 hover:bg-paper/10"
              >
                <item.icon className="size-4" />
              </a>
            ))}
          </div>
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
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Stackwise. All rights reserved.</p>
          <p>Some outbound tool links are affiliate links. We may earn a commission. Scores are written before the link is added.</p>
        </div>
      </div>
    </footer>
  );
}
