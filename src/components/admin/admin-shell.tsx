import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { useSession } from "@/components/admin/use-session";
import { demoMode, signOut } from "@/lib/api";
import type { Role, Session } from "@/lib/types";

export function AdminLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname.startsWith("/admin/login")) return <Outlet />;
  return <AdminShell />;
}

function AdminShell() {
  const { session, ready } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-ink">
        <p>Checking the desk…</p>
      </div>
    );
  }

  if (!session) {
    return <RedirectLogin />;
  }

  return (
    <div className="min-h-screen p-3 text-ink lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:items-start lg:gap-4">
      <AdminSidebar role={session.role} pathname={pathname} />
      <div className="mt-3 min-w-0 space-y-3 lg:mt-0">
        <AdminTopbar
          session={session}
          onSignOut={() => {
            signOut().then(() => navigate({ to: "/admin/login" }));
          }}
        />
        {demoMode ? (
          <p className="glass rounded-2xl px-4 py-2.5 text-sm text-ink/80">
            Demo mode. Data stays in this browser. Logins: admin@demo.com, editor@demo.com, writer@demo.com. Password demo1234.
          </p>
        ) : null}
        <main className="px-1 py-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function Denied({ children }: { children?: ReactNode }) {
  return (
    <div className="glass rounded-[1.75rem] p-6">
      <h1 className="text-xl font-extrabold">Not on your desk</h1>
      <p className="mt-2 text-sm text-ink/70">{children ?? "Your role cannot open this screen."}</p>
    </div>
  );
}

export function RoleGate({
  allow,
  children,
}: {
  allow: Role[];
  children: (session: Session) => ReactNode;
}) {
  const { session, ready } = useSession();
  if (!ready) return <p>Checking access…</p>;
  if (!session || !allow.includes(session.role)) return <Denied />;
  return children(session);
}

function RedirectLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/admin/login" });
  }, [navigate]);
  return (
    <div className="grid min-h-screen place-items-center">
      <p>Redirecting to sign in…</p>
    </div>
  );
}
