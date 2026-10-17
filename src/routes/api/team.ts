import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";

const ROLES = ["admin", "editor", "writer"] as const;
type MemberRole = (typeof ROLES)[number];

function reply(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function tempPassword(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function requireAdmin(request: Request) {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return {
      error: reply({ error: "The server key is not set up yet. Add SUPABASE_SERVICE_ROLE_KEY in Vercel and redeploy." }, 503),
    } as const;
  }
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return { error: reply({ error: "Sign in again." }, 401) } as const;

  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) return { error: reply({ error: "Sign in again." }, 401) } as const;

  const { data: profile } = await db.from("profiles").select("role, active").eq("id", data.user.id).maybeSingle();
  if (!profile || profile.role !== "admin" || !profile.active) {
    return { error: reply({ error: "Only admins can do this." }, 403) } as const;
  }
  return { db, userId: data.user.id } as const;
}

export const Route = createFileRoute("/api/team")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await requireAdmin(request);
        if ("error" in auth) return auth.error;

        const body = await readJson(request);
        const email = String(body.email ?? "").trim().toLowerCase();
        const role = String(body.role ?? "") as MemberRole;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply({ error: "Enter a valid email address." }, 400);
        if (!ROLES.includes(role)) return reply({ error: "Pick a role." }, 400);

        const password = tempPassword();
        const { data, error } = await auth.db.auth.admin.createUser({ email, password, email_confirm: true });
        if (error || !data.user) return reply({ error: error?.message ?? "Could not create that account." }, 400);

        const { error: roleError } = await auth.db
          .from("profiles")
          .update({ role, active: true })
          .eq("id", data.user.id);
        if (roleError) {
          await auth.db.auth.admin.deleteUser(data.user.id);
          return reply({ error: "Could not set the role, so nothing was created." }, 500);
        }
        return reply({ id: data.user.id, email, role, password }, 201);
      },

      PATCH: async ({ request }) => {
        const auth = await requireAdmin(request);
        if ("error" in auth) return auth.error;

        const body = await readJson(request);
        const userId = String(body.userId ?? "");
        if (!/^[0-9a-f-]{36}$/i.test(userId)) return reply({ error: "Unknown member." }, 400);

        const password = tempPassword();
        const { error } = await auth.db.auth.admin.updateUserById(userId, { password });
        if (error) return reply({ error: "Could not reset that password." }, 400);
        return reply({ password });
      },
    },
  },
});
