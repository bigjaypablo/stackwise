import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/admin/admin-shell";
import { AffiliatesScreen } from "@/components/admin/desk-screens";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/affiliates")({
  head: () =>
    pageHead({
      title: "Affiliates — Stackwise desk",
      description: "Manage Stackwise affiliate links.",
      path: "/admin/affiliates",
      noindex: true,
    }),
  component: function AffiliatesRoute() {
    return <RoleGate allow={["admin"]}>{() => <AffiliatesScreen />}</RoleGate>;
  },
});
