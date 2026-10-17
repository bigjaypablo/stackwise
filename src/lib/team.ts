import { demoMode } from "@/lib/api";
import type { Role } from "@/lib/types";

async function authHeader(): Promise<string> {
  const { supabase } = await import("@/lib/supabase-adapter");
  const { data } = await supabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session expired. Sign in again.");
  return `Bearer ${token}`;
}

async function call<T>(method: "POST" | "PATCH", body: unknown): Promise<T> {
  if (demoMode) throw new Error("Team changes need the live database.");
  const response = await fetch("/api/team", {
    method,
    headers: { "Content-Type": "application/json", Authorization: await authHeader() },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) throw new Error(payload.error ?? "That did not work.");
  return payload;
}

export function createTeamMember(input: { email: string; role: Role }) {
  return call<{ id: string; email: string; role: Role; password: string }>("POST", input);
}

export function resetTeamPassword(userId: string) {
  return call<{ password: string }>("PATCH", { userId });
}
