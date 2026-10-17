import { useState, type FormEvent } from "react";
import { RoleGate } from "@/components/admin/admin-shell";
import { GlassPanel } from "@/components/glass-panel";
import { PageHeading } from "@/components/page-heading";
import { changePassword } from "@/lib/account";

export function AccountScreen() {
  return (
    <RoleGate allow={["admin", "editor", "writer"]}>
      {(session) => <Account name={session.name} role={session.role} />}
    </RoleGate>
  );
}

function Account({ name, role }: { name: string; role: string }) {
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setDone(false);
    if (password.length < 10) {
      setError("Use at least 10 characters.");
      return;
    }
    if (password !== again) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    changePassword(password)
      .then(() => {
        setDone(true);
        setPassword("");
        setAgain("");
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not change the password."))
      .finally(() => setBusy(false));
  }

  return (
    <div className="max-w-xl">
      <PageHeading title="Your account" description={`${name}, ${role}`} />
      <GlassPanel className="mt-5 p-5 sm:p-6">
        <h2 className="text-lg font-extrabold tracking-tight">Change password</h2>
        <p className="mt-1 text-sm text-ink/65">Use a long password you do not use anywhere else.</p>
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <div>
            <label htmlFor="new-password" className="text-sm font-semibold">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field mt-1 h-12"
            />
          </div>
          <div>
            <label htmlFor="again-password" className="text-sm font-semibold">
              Type it again
            </label>
            <input
              id="again-password"
              type="password"
              autoComplete="new-password"
              value={again}
              onChange={(event) => setAgain(event.target.value)}
              className="field mt-1 h-12"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          {done ? (
            <p className="text-sm text-emerald-700" role="status">
              Password changed.
            </p>
          ) : null}
          <button type="submit" disabled={busy} className="pill-accent disabled:opacity-60">
            {busy ? "Saving…" : "Change password"}
          </button>
        </form>
      </GlassPanel>
    </div>
  );
}
