import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/admin-shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  head: () =>
    pageHead({
      title: "Desk — Stackwise",
      description: "Stackwise editorial desk.",
      path: "/admin",
      noindex: true,
    }),
  component: AdminLayout,
});
