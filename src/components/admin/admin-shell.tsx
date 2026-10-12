import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { demoMode, signOut } from "@/lib/api";
import type { Role, Session } from "@/lib/types";
import { useSession } from "@/components/admin/use-session";

const LINKS: Array<{ to: "/admin" | "/admin/posts" | "/admin/affiliates" | "/admin/tools" | "/admin/subscribers" | "/admin/team"; label: string; roles: Role[] }> = [
  { to: "/admin", label: "Desk", roles: ["admin", "editor", "writer"] },
  { to: "/admin/posts", label: "Posts", roles: ["admin", "editor", "writer"] },
  { to: "/admin/affiliates", label: "Affiliates", roles: ["admin"] },
  { to: "/admin/tools", label: "Top Picks", roles: ["admin"] },
  { to: "/admin/subscribers", label: "Subscribers", roles: ["admin", "editor"] },
  { to: "/admin/team", label: "Team", roles: ["admin"] },
];

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
      <div className="grid min-h-screen place-items-center bg-mist text-ink">
        <p>Checking the desk…</p>
      </div>
    );
  }

  if (!session) {
    return <RedirectLogin />;
  }

  const links = LINKS.filter((link) => link.roles.includes(session.role));

  return (
    <div className="min-h-screen bg-mist text-ink lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="border-b border-line bg-ink text-paper lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" aria-label="View the public site">
            <Logo tone="paper" compact />
          </Link>
        </div>
        <nav aria-label="Desk" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6">
          {links.map((link) => {
            const active = link.to === "/admin" ? pathname === "/admin" : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`inline-flex h-11 shrink-0 items-center rounded-full px-3 text-sm font-semibold lg:rounded-xl ${
                  active ? "bg-paper text-ink" : "text-paper/80 hover:bg-paper/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-4 py-3">
          <p className="text-sm">
            <span className="font-semibold">{session.name}</span>
            <span className="text-ink/60"> · {session.role}</span>
          </p>
          <button
            type="button"
            className="h-10 rounded-full border border-line px-4 text-sm font-semibold"
            onClick={() => {
              signOut().then(() => navigate({ to: "/admin/login" }));
            }}
          >
            Sign out
          </button>
        </div>
        {demoMode ? (
          <p className="bg-accent/10 px-4 py-2 text-sm text-ink">
            Demo mode. Data stays in this browser. Logins: admin@demo.com, editor@demo.com, writer@demo.com — password demo1234.
          </p>
        ) : null}
        <div className="px-4 py-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function Denied({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
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
    <div className="grid min-h-screen place-items-center bg-mist">
      <p>Redirecting to sign in…</p>
    </div>
  );
}
