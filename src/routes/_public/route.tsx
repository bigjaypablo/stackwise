import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { getPublicSnapshot } from "@/lib/api";
import { PublicSnapshotContext } from "@/lib/public-context";

export const Route = createFileRoute("/_public")({
  staleTime: 60_000,
  loader: async () => {
    try {
      return { snapshot: await getPublicSnapshot() };
    } catch {
      return { snapshot: null };
    }
  },
  component: function PublicLayout() {
    const { snapshot } = Route.useLoaderData();
    return (
      <PublicSnapshotContext.Provider value={snapshot}>
        <SiteLayout>
          <Outlet />
        </SiteLayout>
      </PublicSnapshotContext.Provider>
    );
  },
});
