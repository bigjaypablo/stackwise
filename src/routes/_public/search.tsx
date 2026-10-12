import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "@/components/listing-pages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () =>
    pageHead({
      title: "Search — Stackwise",
      description: "Search published Stackwise reviews, comparisons, guides, and deals.",
      path: "/search",
    }),
  component: function SearchRoute() {
    const { q } = Route.useSearch();
    return <SearchPage query={q} />;
  },
});
