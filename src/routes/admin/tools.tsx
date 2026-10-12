import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/admin/admin-shell";
import { ToolsScreen } from "@/components/admin/desk-screens";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/tools")({
  head: () =>
    pageHead({
      title: "Top Picks — Stackwise desk",
      description: "Manage Stackwise Top Picks.",
      path: "/admin/tools",
      noindex: true,
    }),
  component: function ToolsRoute() {
    return <RoleGate allow={["admin"]}>{() => <ToolsScreen />}</RoleGate>;
  },
});
