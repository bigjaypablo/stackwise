import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/")({
  head: () =>
    pageHead({
      title: "Stackwise — Tools tested before you pay",
      description: "Reviews, comparisons, and guides for crypto, AI, and SaaS tools. Tested before you pay.",
      path: "/",
    }),
  component: HomePage,
});
