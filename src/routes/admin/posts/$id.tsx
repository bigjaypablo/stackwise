import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/admin/admin-shell";
import { EditorScreen } from "@/components/admin/editor-screen";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/posts/$id")({
  head: () =>
    pageHead({
      title: "Edit story — Stackwise desk",
      description: "Edit a Stackwise story.",
      path: "/admin/posts",
      noindex: true,
    }),
  component: function EditorRoute() {
    const { id } = Route.useParams();
    return (
      <RoleGate allow={["admin", "editor", "writer"]}>
        {(session) => <EditorScreen id={id} role={session.role} />}
      </RoleGate>
    );
  },
});
