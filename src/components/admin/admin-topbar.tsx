import type { Session } from "@/lib/types";

export function AdminTopbar({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  return (
    <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-ink to-accent text-sm font-extrabold text-white">
          {(session.name ?? "?").charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight">{session.name}</p>
          <p className="text-xs capitalize text-ink/60">{session.role}</p>
        </div>
      </div>
      <button type="button" className="pill-light" onClick={onSignOut}>
        Sign out
      </button>
    </div>
  );
}
