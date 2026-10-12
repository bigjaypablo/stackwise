import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "@/components/listing-pages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/$")({
  head: () =>
    pageHead({
      title: "Page not found — Stackwise",
      description: "That Stackwise page does not exist.",
      path: "/",
    }),
  component: NotFoundPage,
});
