import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/listing-pages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/about")({
  head: () =>
    pageHead({
      title: "About — Stackwise",
      description: "How Stackwise tests crypto, AI, and SaaS tools before recommending them.",
      path: "/about",
    }),
  component: AboutPage,
});
