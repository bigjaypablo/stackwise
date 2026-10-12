import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { usePublicData } from "@/lib/use-public";

export function SiteLayout({ children }: { children: ReactNode }) {
  const data = usePublicData();
  const trending = data.posts.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <SiteHeader trending={trending} />
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-5">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
