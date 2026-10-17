import { createFileRoute } from "@tanstack/react-router";
import { AccountScreen } from "@/components/admin/account-screen";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/account")({
  head: () =>
    pageHead({
      title: "Account — Stackwise desk",
      description: "Your Stackwise desk account.",
      path: "/admin/account",
      noindex: true,
    }),
  component: AccountScreen,
});
