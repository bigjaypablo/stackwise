import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { demoMode, getSession, signIn, signUp } from "@/lib/api";

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(demoMode ? "admin@demo.com" : "");
  const [password, setPassword] = useState(demoMode ? "demo1234" : "");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [pending, setPending] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-mist px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-line bg-paper p-6 shadow-sm">
        <Link to="/" aria-label="Stackwise home">
          <Logo />
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold">Desk sign in</h1>
        <p className="mt-2 text-sm text-ink/70">Writers draft. Editors publish. Admins keep the affiliate list.</p>
        {demoMode ? (
          <p className="mt-3 rounded-xl bg-mist px-3 py-2 text-sm">
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
            <label htmlFor="desk-email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="desk-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-line px-3"
            />
          </div>
          <div>
            <label htmlFor="desk-password" className="text-sm font-semibold">
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
              className="mt-1 h-12 w-full rounded-xl border border-line px-3"
            />
          </div>
          {error ? (
            <p className="text-sm text-accent" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="text-sm text-ink" role="status">
              {notice}
            </p>
          ) : null}
          <button type="submit" disabled={pending} className="h-12 w-full rounded-full bg-accent font-semibold text-paper disabled:opacity-60">
            {pending ? "Working…" : mode === "up" ? "Create writer account" : "Sign in"}
          </button>
        </form>
        {demoMode ? (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {["admin@demo.com", "editor@demo.com", "writer@demo.com"].map((item) => (
              <button key={item} type="button" className="rounded-full bg-mist px-3 py-2 font-semibold" onClick={() => setEmail(item)}>
                {item}
              </button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-accent"
            onClick={() => {
              setMode((value) => (value === "in" ? "up" : "in"));
              setError("");
            }}
          >
            {mode === "in" ? "New writer? Create an account" : "Have an account? Sign in"}
          </button>
        )}
        <button
          type="button"
          className="mt-3 hidden"
          onClick={() => {
            getSession().catch(() => undefined);
          }}
        >
          refresh
        </button>
      </div>
    </div>
  );
}
