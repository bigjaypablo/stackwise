export function siteOrigin(): string {
  const raw = import.meta.env.VITE_SITE_URL?.trim() ?? "";
  return raw.replace(/\/$/, "");
}

export function canonical(path: string): string {
  const origin = siteOrigin();
  if (!origin) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function absolute(url: string): string {
  return /^https?:\/\//i.test(url) ? url : canonical(url);
}

export function pageHead(input: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
  image?: string;
}) {
  const url = canonical(input.path);
  const image = input.image ? absolute(input.image) : undefined;
  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:url", content: url },
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  if (input.noindex) meta.push({ name: "robots", content: "noindex, nofollow" });
  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    author: { "@type": "Person", name: input.authorName },
    publisher: {
      "@type": "Organization",
      name: "Stackwise",
    },
    mainEntityOfPage: canonical(input.path),
  };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
