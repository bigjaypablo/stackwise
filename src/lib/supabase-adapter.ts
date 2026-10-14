import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readMinutes, slugify } from "@/lib/format";
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

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");
  client = createClient(url, key);
  return client;
}

interface PostRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  category_id: string;
  cover_url: string | null;
  featured: boolean;
  status: Post["status"];
  author_id: string;
  author_name: string | null;
  youtube_url: string | null;
  duration: string | null;
  is_test: boolean;
  read_minutes: number | null;
  affiliate_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    body: row.body ?? "",
    categoryId: row.category_id,
    coverUrl: row.cover_url ?? "",
    featured: row.featured,
    status: row.status,
    authorId: row.author_id,
    authorName: row.author_name ?? "",
    youtubeUrl: row.youtube_url ?? "",
    duration: row.duration ?? "",
    isTest: row.is_test,
    readMinutes: row.read_minutes ?? readMinutes(row.body ?? ""),
    affiliateId: row.affiliate_id ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? "",
  };
}

function toRow(post: Post) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    body: post.body,
    category_id: post.categoryId,
    cover_url: post.coverUrl || null,
    featured: post.featured,
    status: post.status,
    author_id: post.authorId,
    author_name: post.authorName,
    youtube_url: post.youtubeUrl || null,
    duration: post.duration || null,
    is_test: post.isTest,
    read_minutes: post.readMinutes,
    affiliate_id: post.affiliateId || null,
    created_at: post.createdAt,
    updated_at: post.updatedAt,
    published_at: post.publishedAt || null,
  };
}

async function profileFor(userId: string) {
  const { data, error } = await supabase().from("profiles").select("id, email, role, active").eq("id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data as { id: string; email: string; role: Role; active: boolean } | null;
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase().auth.getSession();
  const user = data.session?.user;
  if (!user) return null;
  const profile = await profileFor(user.id);
  if (!profile || !profile.active) return null;
  return {
    userId: profile.id,
    email: profile.email || user.email || "",
    name: profile.email || user.email || "Writer",
    role: profile.role,
  };
}

async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("Sign in required.");
  return session;
}

async function requireRole(roles: Role[]): Promise<Session> {
  const session = await requireSession();
  if (!roles.includes(session.role)) throw new Error("Your role cannot do that.");
  return session;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase().from("categories").select("id, slug, name, description").order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getPosts(query?: PostQuery): Promise<Post[]> {
  const session = await getSession();
  let request = supabase().from("posts").select("*").order("published_at", { ascending: false });
  if (!query?.includeUnpublished && query?.status !== "all") {
    request = request.eq("status", query?.status ?? "published");
  } else if (!session) {
    request = request.eq("status", "published");
  } else if (session.role === "writer") {
    request = request.or(`status.eq.published,author_id.eq.${session.userId}`);
  }
  if (query?.status && query.status !== "all") request = request.eq("status", query.status);
  if (query?.featured) request = request.eq("featured", true);
  if (query?.test) request = request.eq("is_test", true);
  const { data, error } = await request;
  if (error) throw new Error(error.message);
  let posts = ((data ?? []) as PostRow[]).map(toPost);
  if (query?.categorySlug) {
    const categories = await getCategories();
    const category = categories.find((item) => item.slug === query.categorySlug);
    posts = posts.filter((post) => post.categoryId === category?.id);
  }
  if (query?.search) {
    const needle = query.search.trim().toLowerCase();
    posts = posts.filter((post) => `${post.title} ${post.summary} ${post.body}`.toLowerCase().includes(needle));
  }
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase().from("posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const post = toPost(data as PostRow);
  if (post.status === "published") return post;
  const session = await getSession();
  if (!session) return null;
  if (session.role === "writer" && post.authorId !== session.userId) return null;
  return post;
}

export async function getPostById(id: string): Promise<Post | null> {
  const posts = await getPosts({ status: "all", includeUnpublished: true });
  return posts.find((post) => post.id === id) ?? null;
}

export async function savePost(input: Post): Promise<Post> {
  const session = await requireSession();
  const existing = input.id ? await getPostById(input.id) : null;
  if (session.role === "writer") {
    if (existing && existing.authorId !== session.userId) throw new Error("Writers can only edit their own stories.");
    if (existing?.status === "published") throw new Error("Published stories are locked for writers.");
    if (input.status === "published") {
      throw new Error("Writers can save a draft or send it for review. An editor publishes.");
    }
  }
  const now = new Date().toISOString();
  const next: Post = {
    ...input,
    id: input.id || crypto.randomUUID(),
    slug: slugify(input.slug || input.title),
    title: input.title.trim() || "Untitled",
    authorId: existing?.authorId ?? session.userId,
    authorName: existing?.authorName || session.name,
    readMinutes: readMinutes(input.body),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    publishedAt: input.status === "published" ? existing?.publishedAt || now : "",
  };
  const { data, error } = await supabase().from("posts").upsert(toRow(next)).select("*").single();
  if (error) throw new Error(error.message);
  return toPost(data as PostRow);
}

export async function deletePost(id: string): Promise<void> {
  await requireRole(["admin", "editor"]);
  const { error } = await supabase().from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function saveCategory(input: Category): Promise<Category> {
  await requireRole(["admin", "editor"]);
  const next = {
    id: input.id || crypto.randomUUID(),
    slug: slugify(input.slug || input.name),
    name: input.name.trim(),
    description: input.description.trim(),
  };
  const { data, error } = await supabase().from("categories").upsert(next).select("*").single();
  if (error) throw new Error(error.message);
  return data as Category;
}

export async function getTools(): Promise<Tool[]> {
  const { data, error } = await supabase().from("tools").select("*").order("rank");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    category: row.category as string,
    rating: Number(row.rating),
    affiliateId: (row.affiliate_id as string) ?? "",
    rank: Number(row.rank),
    blurb: (row.blurb as string) ?? "",
  }));
}

export async function saveTool(input: Tool): Promise<Tool> {
  await requireRole(["admin"]);
  const next = {
    id: input.id || slugify(input.name),
    name: input.name.trim(),
    category: input.category.trim(),
    rating: Math.min(10, Math.max(0, Number(input.rating) || 0)),
    affiliate_id: input.affiliateId || null,
    rank: Number(input.rank) || 1,
    blurb: input.blurb.trim(),
  };
  const { data, error } = await supabase().from("tools").upsert(next).select("*").single();
  if (error) throw new Error(error.message);
  return {
    id: data.id as string,
    name: data.name as string,
    category: data.category as string,
    rating: Number(data.rating),
    affiliateId: (data.affiliate_id as string) ?? "",
    rank: Number(data.rank),
    blurb: (data.blurb as string) ?? "",
  };
}

export async function deleteTool(id: string): Promise<void> {
  await requireRole(["admin"]);
  const { error } = await supabase().from("tools").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getAffiliates(): Promise<Affiliate[]> {
  const { data, error } = await supabase().from("affiliates").select("id, name, url").order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as Affiliate[];
}

export async function saveAffiliate(input: Affiliate): Promise<Affiliate> {
  await requireRole(["admin"]);
  const next = { id: slugify(input.id || input.name), name: input.name.trim(), url: input.url.trim() };
  const { data, error } = await supabase().from("affiliates").upsert(next).select("*").single();
  if (error) throw new Error(error.message);
  return data as Affiliate;
}

export async function deleteAffiliate(id: string): Promise<void> {
  await requireRole(["admin"]);
  const { error } = await supabase().from("affiliates").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getSubscribers(): Promise<Subscriber[]> {
  await requireRole(["admin", "editor"]);
  const { data, error } = await supabase()
    .from("subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id as string,
    email: row.email as string,
    createdAt: row.created_at as string,
  }));
}

export async function addSubscriber(email: string): Promise<Subscriber> {
  const normalized = email.trim().toLowerCase();
  const { error } = await supabase().from("subscribers").insert({ email: normalized });
  if (error && error.code !== "23505") throw new Error(error.message);
  return { id: crypto.randomUUID(), email: normalized, createdAt: new Date().toISOString() };
}

export async function getUsers(): Promise<TeamUser[]> {
  await requireRole(["admin"]);
  const { data, error } = await supabase().from("profiles").select("id, email, role, active").order("email");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id as string,
    email: (row.email as string) ?? "",
    name: (row.email as string) ?? "Teammate",
    role: row.role as Role,
    active: Boolean(row.active),
  }));
}

export async function setUserRole(userId: string, role: Role, active = true): Promise<TeamUser> {
  const session = await requireRole(["admin"]);
  if (session.userId === userId && (role !== "admin" || !active)) {
    throw new Error("You can't remove your own admin access.");
  }
  const { data, error } = await supabase()
    .from("profiles")
    .update({ role, active })
    .eq("id", userId)
    .select("id, email, role, active")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id as string,
    email: (data.email as string) ?? "",
    name: (data.email as string) ?? "Teammate",
    role: data.role as Role,
    active: Boolean(data.active),
  };
}

export async function inviteUser(_input?: {
  email: string;
  name: string;
  role: Role;
  password?: string;
}): Promise<TeamUser> {
  throw new Error(
    "Supabase invites need the person to create an account. They will land as a writer. Promote them here after they sign up.",
  );
}

export async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase().auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.user) throw new Error(error?.message || "Email or password is wrong.");
  const profile = await profileFor(data.user.id);
  if (!profile) throw new Error("No profile yet. The signup trigger may still be running. Try again.");
  if (!profile.active) {
    await supabase().auth.signOut();
    throw new Error("This account is deactivated. Ask an admin.");
  }
  return {
    userId: profile.id,
    email: profile.email || data.user.email || email,
    name: profile.email || data.user.email || "Writer",
    role: profile.role,
  };
}

export async function signUp(email: string, password: string): Promise<Session | null> {
  const { data, error } = await supabase().auth.signUp({ email: email.trim(), password });
  if (error) throw new Error(error.message);
  if (!data.session || !data.user) return null;
  const profile = await profileFor(data.user.id);
  return {
    userId: data.user.id,
    email: data.user.email || email,
    name: data.user.email || email,
    role: profile?.role ?? "writer",
  };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase().auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getPublicSnapshot(): Promise<PublicSnapshot> {
  const [posts, categories, tools, affiliates] = await Promise.all([
    getPosts(),
    getCategories(),
    getTools(),
    getAffiliates(),
  ]);
  return { posts, categories, tools, affiliates, demo: false };
}
