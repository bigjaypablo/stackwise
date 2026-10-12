import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/admin/admin-shell";
import { DeskHome } from "@/components/admin/desk-screens";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () =>
    pageHead({
      title: "Desk — Stackwise",
      description: "Stackwise editorial desk.",
      path: "/admin",
      noindex: true,
    }),
  component: function AdminHome() {
    return <RoleGate allow={["admin", "editor", "writer"]}>{(session) => <DeskHome role={session.role} />}</RoleGate>;
  },
});
