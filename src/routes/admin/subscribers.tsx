import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/admin/admin-shell";
import { SubscribersScreen } from "@/components/admin/desk-screens";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/subscribers")({
  head: () =>
    pageHead({
      title: "Subscribers — Stackwise desk",
      description: "Stackwise newsletter subscribers.",
      path: "/admin/subscribers",
      noindex: true,
    }),
  component: function SubscribersRoute() {
    return <RoleGate allow={["admin", "editor"]}>{() => <SubscribersScreen />}</RoleGate>;
  },
});
