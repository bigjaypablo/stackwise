import { demoMode } from "@/lib/api";

export type CommentStatus = "pending" | "approved" | "rejected";

export interface Comment {
  id: string;
  postSlug: string;
  name: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
}

const STORE_KEY = "stackwise.comments.v1";
const LAST_KEY = "stackwise.comment.last";
const COOLDOWN_MS = 30_000;
const LINK_PATTERN = /(https?:\/\/|www\.)/i;

export function validateComment(name: string, body: string): string | null {
  const cleanName = name.trim();
  const cleanBody = body.trim();
  if (cleanName.length < 2 || cleanName.length > 40) return "Use a name between 2 and 40 characters.";
  if (cleanBody.length < 3) return "Write at least a few words.";
  if (cleanBody.length > 1500) return "Keep it under 1,500 characters.";
  if (LINK_PATTERN.test(cleanBody) || LINK_PATTERN.test(cleanName)) return "Links are not allowed in comments.";
  return null;
}

function readLocal(): Comment[] {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Comment[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(items: Comment[]) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(items));
  } catch {
    /* storage can be unavailable; comments just will not persist */
  }
}

async function db() {
  const mod = await import("@/lib/supabase-adapter");
  return mod.supabase();
}

interface Row {
  id: string;
  post_slug: string;
  name: string;
  body: string;
  status: CommentStatus;
  created_at: string;
}

function fromRow(row: Row): Comment {
  return {
    id: row.id,
    postSlug: row.post_slug,
    name: row.name,
    body: row.body,
    status: row.status,
    createdAt: row.created_at,
  };
}

function newest(a: Comment, b: Comment) {
  return b.createdAt.localeCompare(a.createdAt);
}

export async function listApproved(slug: string): Promise<Comment[]> {
  if (demoMode) {
    return readLocal()
      .filter((item) => item.postSlug === slug && item.status === "approved")
      .sort(newest);
  }
  const { data, error } = await (await db())
    .from("comments")
    .select("id, post_slug, name, body, status, created_at")
    .eq("post_slug", slug)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data as Row[]).map(fromRow);
}

export async function submitComment(input: { slug: string; name: string; body: string }): Promise<void> {
  const problem = validateComment(input.name, input.body);
  if (problem) throw new Error(problem);

  const last = Number(window.localStorage.getItem(LAST_KEY) ?? 0);
  if (Date.now() - last < COOLDOWN_MS) throw new Error("Give it a few seconds before posting again.");

  if (demoMode) {
    const item: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      postSlug: input.slug,
      name: input.name.trim(),
      body: input.body.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    writeLocal([item, ...readLocal()]);
  } else {
    const { error } = await (await db())
      .from("comments")
      .insert({ post_slug: input.slug, name: input.name.trim(), body: input.body.trim() });
    if (error) throw new Error("Could not post that comment. Try again in a moment.");
  }
  window.localStorage.setItem(LAST_KEY, String(Date.now()));
}

export async function listAll(): Promise<Comment[]> {
  if (demoMode) return readLocal().sort(newest);
  const { data, error } = await (await db())
    .from("comments")
    .select("id, post_slug, name, body, status, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) throw new Error(error.message);
  return (data as Row[]).map(fromRow);
}

export async function setCommentStatus(id: string, status: CommentStatus): Promise<void> {
  if (demoMode) {
    writeLocal(readLocal().map((item) => (item.id === id ? { ...item, status } : item)));
    return;
  }
  const { error } = await (await db()).from("comments").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteComment(id: string): Promise<void> {
  if (demoMode) {
    writeLocal(readLocal().filter((item) => item.id !== id));
    return;
  }
  const { error } = await (await db()).from("comments").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
