import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { demoMode, signIn, signUp } from "@/lib/api";

const DEMO_EMAILS = ["admin@demo.com", "editor@demo.com", "writer@demo.com"];

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(demoMode ? "admin@demo.com" : "");
  const [password, setPassword] = useState(demoMode ? "demo1234" : "");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [pending, setPending] = useState(false);

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 py-10 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-accent/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 size-[28rem] rounded-full bg-indigo-500/25 blur-3xl"
      />

      <div className="glass-night relative w-full max-w-md rounded-[1.75rem] p-6 sm:p-8">
        <Link to="/" aria-label="Stackwise home">
          <Logo tone="paper" />
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold">Desk sign in</h1>
        <p className="mt-2 text-sm text-white/65">Writers draft. Editors publish. Admins keep the affiliate list.</p>
        {demoMode ? (
          <p className="glass-dark mt-3 rounded-xl px-3 py-2 text-sm text-white/80">
            Demo mode. Password for every sample account is demo1234.
          </p>
        ) : null}
        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            setNotice("");
            setPending(true);
            const action =
              mode === "up"
                ? signUp(email, password).then((session) => {
                    if (!session) {
                      setNotice("Account created. Confirm the email if Supabase asked you to, then sign in.");
                      setMode("in");
                      return;
                    }
                    navigate({ to: "/admin" });
                  })
                : signIn(email, password).then(() => navigate({ to: "/admin" }));
            action
              .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not sign in."))
              .finally(() => setPending(false));
          }}
        >
          <div>
            <label htmlFor="desk-email" className="text-sm font-semibold text-white/85">
              Email
            </label>
            <input
              id="desk-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field-dark mt-1 h-12"
            />
          </div>
          <div>
            <label htmlFor="desk-password" className="text-sm font-semibold text-white/85">
              Password
            </label>
            <input
              id="desk-password"
              type="password"
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field-dark mt-1 h-12"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="text-sm text-emerald-300" role="status">
              {notice}
            </p>
          ) : null}
          <button type="submit" disabled={pending} className="pill-accent h-12 w-full disabled:opacity-60">
            {pending ? "Working…" : mode === "up" ? "Create writer account" : "Sign in"}
          </button>
        </form>
        {demoMode ? (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {DEMO_EMAILS.map((item) => (
              <button
                key={item}
                type="button"
                className="glass-dark rounded-full px-3 py-2 font-semibold text-white/85 hover:bg-white/15"
                onClick={() => setEmail(item)}
              >
                {item}
              </button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-blue-300"
            onClick={() => {
              setMode((value) => (value === "in" ? "up" : "in"));
              setError("");
            }}
          >
            {mode === "in" ? "New writer? Create an account" : "Have an account? Sign in"}
          </button>
        )}
      </div>
    </div>
  );
}
