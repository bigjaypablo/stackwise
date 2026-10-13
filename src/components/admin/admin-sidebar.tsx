import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import type { Role } from "@/lib/types";

type DeskPath =
  | "/admin"
  | "/admin/posts"
  | "/admin/affiliates"
  | "/admin/tools"
  | "/admin/subscribers"
  | "/admin/team";

const LINKS: Array<{ to: DeskPath; label: string; roles: Role[] }> = [
  { to: "/admin", label: "Desk", roles: ["admin", "editor", "writer"] },
  { to: "/admin/posts", label: "Posts", roles: ["admin", "editor", "writer"] },
  { to: "/admin/affiliates", label: "Affiliates", roles: ["admin"] },
  { to: "/admin/tools", label: "Top Picks", roles: ["admin"] },
  { to: "/admin/subscribers", label: "Subscribers", roles: ["admin", "editor"] },
  { to: "/admin/team", label: "Team", roles: ["admin"] },
];

export function AdminSidebar({ role, pathname }: { role: Role; pathname: string }) {
  const links = LINKS.filter((link) => link.roles.includes(role));

  return (
    <aside className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink text-paper shadow-glass lg:sticky lg:top-3 lg:flex lg:h-[calc(100vh-1.5rem)] lg:flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 -top-16 size-52 rounded-full bg-accent/35 blur-3xl"
      />
      <div className="relative flex items-center justify-between px-4 py-4">
        <Link to="/" aria-label="View the public site">
          <Logo tone="paper" compact />
        </Link>
        <span className="glass-dark rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white/80">
          Desk
        </span>
      </div>
      <nav
        aria-label="Desk"
        className="no-scrollbar relative flex gap-1.5 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-4"
      >
        {links.map((link) => {
          const active = link.to === "/admin" ? pathname === "/admin" : pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition lg:rounded-2xl ${
                active
                  ? "border-white/20 bg-white/15 text-white"
                  : "border-transparent text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${active ? "bg-blue-400" : "bg-white/25"}`}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="relative hidden px-3 pb-4 lg:mt-auto lg:block">
        <Link to="/" className="glass-dark flex h-11 items-center justify-center rounded-2xl text-sm font-semibold text-white/80 hover:text-white">
          View public site
        </Link>
      </div>
    </aside>
  );
}
