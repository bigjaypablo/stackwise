import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/admin/admin-shell";
import { PostsScreen } from "@/components/admin/posts-screen";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/posts/")({
  head: () =>
    pageHead({
      title: "Posts — Stackwise desk",
      description: "Draft, review, and publish Stackwise stories.",
      path: "/admin/posts",
      noindex: true,
    }),
  component: function PostsRoute() {
    return (
      <RoleGate allow={["admin", "editor", "writer"]}>
        {(session) => <PostsScreen role={session.role} userId={session.userId} />}
      </RoleGate>
    );
  },
});
