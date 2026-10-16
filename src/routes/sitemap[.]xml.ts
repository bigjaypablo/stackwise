import { createFileRoute } from "@tanstack/react-router";
import { getPublicSnapshot } from "@/lib/api";
import type { Category, Post } from "@/lib/types";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function day(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const time = Date.parse(iso);
  return Number.isNaN(time) ? undefined : new Date(time).toISOString().slice(0, 10);
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const configured = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "");
        const origin = configured || new URL(request.url).origin;

        let posts: Post[] = [];
        let categories: Category[] = [];
        try {
          const snapshot = await getPublicSnapshot();
          posts = snapshot.posts;
          categories = snapshot.categories;
        } catch {
          /* an empty sitemap is better than an error */
        }

        const used = new Set(posts.map((post) => post.categoryId));
        const entries: Array<{ path: string; lastmod?: string }> = [
          { path: "/" },
          { path: "/about" },
          { path: "/affiliate-disclosure" },
          ...categories.filter((category) => used.has(category.id)).map((category) => ({ path: `/category/${category.slug}` })),
          ...posts.map((post) => ({ path: `/post/${post.slug}`, lastmod: day(post.updatedAt || post.publishedAt) })),
        ];

        const body = entries
          .map(
            (entry) =>
              `  <url><loc>${esc(origin + entry.path)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}</url>`,
          )
          .join("\n");

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=0, s-maxage=3600",
            },
          },
        );
      },
    },
  },
});
