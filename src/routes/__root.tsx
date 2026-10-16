import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { OWNER, SITE } from "@/lib/site";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE.name },
      { name: "description", content: "Plain-English research on crypto, AI and SaaS tools. Information only, not financial advice." },
      { name: "theme-color", content: "#0B1220" },
      { name: "twitter:site", content: `@${OWNER.handle}` },
      { name: "twitter:creator", content: `@${OWNER.handle}` },
      { property: "og:site_name", content: SITE.name },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans text-ink">
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
});
