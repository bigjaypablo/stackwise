import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/listing-pages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/contact")({
  head: () =>
    pageHead({
      title: "Contact — Stackwise",
      description: "Email the Stackwise desk. No contact form is stored.",
      path: "/contact",
    }),
  component: ContactPage,
});
