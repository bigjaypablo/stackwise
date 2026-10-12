import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/listing-pages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/privacy")({
  head: () =>
    pageHead({
      title: "Privacy — Stackwise",
      description: "What Stackwise stores in demo mode, and what moves to Supabase if you connect it.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});
