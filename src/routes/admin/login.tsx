import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/admin/login-screen";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/login")({
  head: () =>
    pageHead({
      title: "Sign in — Stackwise desk",
      description: "Sign in to the Stackwise editorial desk.",
      path: "/admin/login",
      noindex: true,
    }),
  component: LoginScreen,
});
