import { createFileRoute } from "@tanstack/react-router";
import { DisclosurePage } from "@/components/listing-pages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/affiliate-disclosure")({
  head: () =>
    pageHead({
      title: "Affiliate disclosure — Stackwise",
      description: "How Stackwise handles affiliate links and commissions.",
      path: "/affiliate-disclosure",
    }),
  component: DisclosurePage,
});
