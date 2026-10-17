import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useSession } from "@/components/admin/use-session";
import { PageHeading } from "@/components/page-heading";
import { getUsers, setUserRole } from "@/lib/api";
import { createTeamMember, resetTeamPassword } from "@/lib/team";
import type { Role, TeamUser } from "@/lib/types";

const ROLES: Role[] = ["admin", "editor", "writer"];
const HELP: Record<Role, string> = {
  admin: "Everything: affiliate links, team, subscribers, deleting posts.",
  editor: "Writes, publishes and moderates comments.",
  writer: "Drafts and submits for review. Cannot publish.",
};

interface Credentials {
  email: string;
  password: string;
  kind: "new" | "reset";
}

export function TeamScreen() {
  const { session } = useSession();
  const [members, setMembers] = useState<TeamUser[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [card, setCard] = useState<Credentials | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(() => {
    getUsers()
      .then(setMembers)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load the team."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function run(task: () => Promise<void>) {
    setError("");
    setBusy(true);
    task()
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "That did not work."))
      .finally(() => setBusy(false));
  }

  function add(event: FormEvent) {
    event.preventDefault();
    if (role === "admin" && !window.confirm("Admins can change affiliate links, see subscribers and change roles. Continue?")) return;
    run(async () => {
      const made = await createTeamMember({ email, role });
      setCard({ email: made.email, password: made.password, kind: "new" });
      setCopied(false);
      setEmail("");
      load();
    });
  }

  function copy(credentials: Credentials) {
    const text = [
      "Stackwise desk login",
      `${window.location.origin}/admin/login`,
      `Email: ${credentials.email}`,
      `Temporary password: ${credentials.password}`,
      "Change it under Account after you sign in.",
    ].join("\n");
    navigator.clipboard
      .writeText(text)
      .then(() => setCopied(true))
      .catch(() => setError("Could not copy. Select the password and copy it by hand."));
  }

  return (
    <div className="max-w-3xl">
      <PageHeading title="Team" description="Add people, change roles, and reset passwords." />

      {card ? (
        <section className="glass mt-5 rounded-[1.75rem] border-amber-300/70 p-5" aria-label="New login details">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
            {card.kind === "new" ? "Account created" : "Password reset"} · shown once
          </p>
          <p className="mt-2 text-sm">{card.email}</p>
          <p className="mt-1 break-all rounded-xl bg-white/80 px-3 py-2 font-mono text-sm">{card.password}</p>
          <p className="mt-2 text-xs text-ink/65">
            Send this privately, not in a group chat. It cannot be shown again, but you can reset it any time.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="pill-accent h-10" onClick={() => copy(card)}>
              {copied ? "Copied" : "Copy login message"}
            </button>
            <button type="button" className="pill-light" onClick={() => setCard(null)}>
              Done
            </button>
          </div>
        </section>
      ) : null}

      <section className="glass mt-5 rounded-[1.75rem] p-5">
        <h2 className="text-lg font-extrabold tracking-tight">Add a team member</h2>
        <form className="mt-3 space-y-3" onSubmit={add}>
          <div>
            <label htmlFor="member-email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="member-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field mt-1 h-12"
            />
          </div>
          <div>
            <label htmlFor="member-role" className="text-sm font-semibold">
              Role
            </label>
            <select
              id="member-role"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className="field mt-1 h-12"
            >
              {ROLES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-ink/60">{HELP[role]}</p>
          </div>
          <button type="submit" disabled={busy} className="pill-accent disabled:opacity-60">
            {busy ? "Working…" : "Create account"}
          </button>
        </form>
      </section>

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="mt-5 space-y-3">
        {members.map((member) => {
          const self = member.id === session?.userId;
          return (
            <li key={member.id} className="glass rounded-3xl p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="min-w-0 flex-1 truncate font-semibold">
                  {member.email}
                  {self ? <span className="ml-2 text-xs font-normal text-ink/50">you</span> : null}
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    member.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {member.active ? "Active" : "Deactivated"}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`role-${member.id}`}>
                  Role for {member.email}
                </label>
                <select
                  id={`role-${member.id}`}
                  value={member.role}
                  disabled={busy || self}
                  onChange={(event) => {
                    const next = event.target.value as Role;
                    if (next === "admin" && !window.confirm("Make this person an admin?")) return;
                    run(async () => {
                      await setUserRole(member.id, next, member.active);
                      load();
                    });
                  }}
                  className="field h-10 w-auto text-sm"
                >
                  {ROLES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={busy}
                  className="pill-light"
                  onClick={() => {
                    if (!window.confirm(`Reset the password for ${member.email}?`)) return;
                    run(async () => {
                      const { password } = await resetTeamPassword(member.id);
                      setCard({ email: member.email, password, kind: "reset" });
                      setCopied(false);
                    });
                  }}
                >
                  Reset password
                </button>
                <button
                  type="button"
                  disabled={busy || self}
                  className="pill-light disabled:opacity-40"
                  onClick={() =>
                    run(async () => {
                      await setUserRole(member.id, member.role, !member.active);
                      load();
                    })
                  }
                >
                  {member.active ? "Deactivate" : "Reactivate"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
