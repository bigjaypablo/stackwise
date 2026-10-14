import { createFileRoute } from "@tanstack/react-router";
import { CommentsScreen } from "@/components/admin/comments-screen";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/comments")({
  head: () =>
    pageHead({
      title: "Comments — Stackwise desk",
      description: "Moderate reader comments.",
      path: "/admin/comments",
      noindex: true,
    }),
  component: CommentsScreen,
});
