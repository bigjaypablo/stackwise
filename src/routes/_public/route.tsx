import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/_public")({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});
