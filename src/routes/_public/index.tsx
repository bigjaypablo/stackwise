import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/")({
  head: () =>
    pageHead({
      title: "Stackwise: Research before you pay",
      description:
        "Plain-English research on crypto, AI and SaaS tools. Information only, not financial advice. Do your own research.",
      path: "/",
    }),
  component: HomePage,
});
