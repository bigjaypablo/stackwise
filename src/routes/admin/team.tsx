import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/admin/admin-shell";
import { TeamScreen } from "@/components/admin/team-screen";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/team")({
  head: () =>
    pageHead({
      title: "Team — Stackwise desk",
      description: "Manage Stackwise desk roles.",
      path: "/admin/team",
      noindex: true,
    }),
  component: function TeamRoute() {
    return <RoleGate allow={["admin"]}>{() => <TeamScreen />}</RoleGate>;
  },
});
