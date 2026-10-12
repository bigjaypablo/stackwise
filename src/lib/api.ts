import * as demo from "@/lib/demo-adapter";
import type {
  Affiliate,
  Category,
  Post,
  PostQuery,
  PublicSnapshot,
  Role,
  Session,
  Subscriber,
  TeamUser,
  Tool,
} from "@/lib/types";

export const demoMode = !supabaseEnabled();

export function supabaseEnabled(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

async function remote() {
  return import("@/lib/supabase-adapter");
}

async function use<T>(run: (mod: typeof demo) => Promise<T>): Promise<T> {
  if (!supabaseEnabled()) return run(demo);
  const mod = await remote();
  return run(mod as unknown as typeof demo);
}

export function subscribeChanges(listener: () => void): () => void {
  if (supabaseEnabled()) return () => undefined;
  return demo.subscribeDemo(listener);
}

export async function getPublicSnapshot(): Promise<PublicSnapshot> {
  return use((mod) => mod.getPublicSnapshot());
}

export async function getPosts(query?: PostQuery): Promise<Post[]> {
  return use((mod) => mod.getPosts(query));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return use((mod) => mod.getPostBySlug(slug));
}

export async function getPostById(id: string): Promise<Post | null> {
  return use((mod) => mod.getPostById(id));
}

export async function savePost(input: Post): Promise<Post> {
  return use((mod) => mod.savePost(input));
}

export async function deletePost(id: string): Promise<void> {
  return use((mod) => mod.deletePost(id));
}

export async function getCategories(): Promise<Category[]> {
  return use((mod) => mod.getCategories());
}

export async function saveCategory(input: Category): Promise<Category> {
  return use((mod) => mod.saveCategory(input));
}

export async function getTools(): Promise<Tool[]> {
  return use((mod) => mod.getTools());
}

export async function saveTool(input: Tool): Promise<Tool> {
  return use((mod) => mod.saveTool(input));
}

export async function deleteTool(id: string): Promise<void> {
  return use((mod) => mod.deleteTool(id));
}

export async function getAffiliates(): Promise<Affiliate[]> {
  return use((mod) => mod.getAffiliates());
}

export async function saveAffiliate(input: Affiliate): Promise<Affiliate> {
  return use((mod) => mod.saveAffiliate(input));
}

export async function deleteAffiliate(id: string): Promise<void> {
  return use((mod) => mod.deleteAffiliate(id));
}

export async function getSubscribers(): Promise<Subscriber[]> {
  return use((mod) => mod.getSubscribers());
}

export async function addSubscriber(email: string): Promise<Subscriber> {
  return use((mod) => mod.addSubscriber(email));
}

export async function getUsers(): Promise<TeamUser[]> {
  return use((mod) => mod.getUsers());
}

export async function setUserRole(userId: string, role: Role, active = true): Promise<TeamUser> {
  return use((mod) => mod.setUserRole(userId, role, active));
}

export async function inviteUser(input: {
  email: string;
  name: string;
  role: Role;
  password?: string;
}): Promise<TeamUser> {
  return use((mod) => mod.inviteUser(input));
}

export async function signIn(email: string, password: string): Promise<Session> {
  return use((mod) => mod.signIn(email, password));
}

export async function signUp(email: string, password: string): Promise<Session | null> {
  return use((mod) => mod.signUp(email, password));
}

export async function signOut(): Promise<void> {
  return use((mod) => mod.signOut());
}

export async function getSession(): Promise<Session | null> {
  return use((mod) => mod.getSession());
}
