export const NAV = [
  { label: "Home", to: "/" as const },
  { label: "Crypto", to: "/category/$slug" as const, slug: "crypto" },
  { label: "AI Tools", to: "/category/$slug" as const, slug: "ai-tools" },
  { label: "SaaS", to: "/category/$slug" as const, slug: "saas" },
  { label: "Reviews", to: "/category/$slug" as const, slug: "reviews" },
  { label: "Comparisons", to: "/category/$slug" as const, slug: "comparisons" },
  { label: "Guides", to: "/category/$slug" as const, slug: "guides" },
  { label: "Deals", to: "/category/$slug" as const, slug: "deals" },
];
