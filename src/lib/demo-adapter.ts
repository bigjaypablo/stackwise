import { readMinutes, slugify } from "@/lib/format";
import { freshSeed, type DemoDb, type DemoUser } from "@/lib/seed";
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

const KEY = "stackwise.db.v1";
const listeners = new Set<() => void>();

let cache: DemoDb | null = null;

function isDb(value: unknown): value is DemoDb {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemoDb>;
  return record.version === 1 && Array.isArray(record.posts) && Array.isArray(record.users);
}

function db(): DemoDb {
  if (typeof window === "undefined") return freshSeed();
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isDb(parsed)) {
        cache = parsed;
        return cache;
      }
    }
  } catch {
    /* reset below */
  }
  cache = freshSeed();
  localStorage.setItem(KEY, JSON.stringify(cache));
  return cache;
}

function persist() {
  if (typeof window === "undefined" || !cache) return;
  localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((listener) => listener());
}

export function subscribeDemo(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function requireSession(): Session {
  const session = db().session;
  if (!session) throw new Error("Sign in required.");
  const user = db().users.find((item) => item.id === session.userId);
  if (!user || !user.active) throw new Error("This account is inactive.");
  return session;
}

function requireRole(roles: Role[]): Session {
  const session = requireSession();
  if (!roles.includes(session.role)) throw new Error("Your role cannot do that.");
  return session;
}

function toTeam(user: DemoUser): TeamUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active,
  };
}

function visiblePosts(query: PostQuery | undefined, data: DemoDb): Post[] {
  const session = data.session;
  let posts = data.posts.slice();
  const wantsPrivate = Boolean(query?.includeUnpublished || (query?.status && query.status !== "published" && query.status !== "all"));
  if (!wantsPrivate && query?.status !== "all") {
    posts = posts.filter((post) => post.status === "published");
  } else if (!session) {
    posts = posts.filter((post) => post.status === "published");
  } else if (session.role === "writer") {
    posts = posts.filter((post) => post.status === "published" || post.authorId === session.userId);
  }
  if (query?.status && query.status !== "all") {
    posts = posts.filter((post) => post.status === query.status);
  }
  if (query?.categorySlug) {
    const category = data.categories.find((item) => item.slug === query.categorySlug);
    posts = posts.filter((post) => post.categoryId === category?.id);
  }
  if (query?.featured) posts = posts.filter((post) => post.featured);
  if (query?.test) posts = posts.filter((post) => post.isTest);
  if (query?.search) {
    const needle = query.search.trim().toLowerCase();
    posts = posts.filter((post) =>
      `${post.title} ${post.summary} ${post.body}`.toLowerCase().includes(needle),
    );
  }
  return posts.sort((a, b) => (b.publishedAt || b.updatedAt).localeCompare(a.publishedAt || a.updatedAt));
}

export async function getPublicSnapshot(): Promise<PublicSnapshot> {
  const data = typeof window === "undefined" ? freshSeed() : db();
  return {
    posts: data.posts.filter((post) => post.status === "published"),
    categories: data.categories,
    tools: data.tools.slice().sort((a, b) => a.rank - b.rank),
    affiliates: data.affiliates,
    demo: true,
  };
}

export async function getPosts(query?: PostQuery): Promise<Post[]> {
  return visiblePosts(query, typeof window === "undefined" ? freshSeed() : db());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = typeof window === "undefined" ? freshSeed() : db();
  const post = data.posts.find((item) => item.slug === slug) ?? null;
  if (!post) return null;
  if (post.status === "published") return post;
  const session = data.session;
  if (!session) return null;
  if (session.role === "writer" && post.authorId !== session.userId) return null;
  return post;
}

export async function getPostById(id: string): Promise<Post | null> {
  const posts = await getPosts({ status: "all", includeUnpublished: true });
  return posts.find((post) => post.id === id) ?? null;
}

export async function savePost(input: Post): Promise<Post> {
  const session = requireSession();
  const data = db();
  const existing = data.posts.find((post) => post.id === input.id) ?? null;
  if (session.role === "writer") {
    if (existing && existing.authorId !== session.userId) {
      throw new Error("Writers can only edit their own stories.");
    }
    if (existing?.status === "published") {
      throw new Error("Published stories are locked for writers.");
    }
    if (input.status === "published") {
      throw new Error("Writers can save a draft or send it for review. An editor publishes.");
    }
  }
  const slug = slugify(input.slug || input.title);
  const clash = data.posts.find((post) => post.slug === slug && post.id !== input.id);
  if (clash) throw new Error("That slug is already used. Change the title or the slug.");
  const now = new Date().toISOString();
  const next: Post = {
    ...input,
    slug,
    title: input.title.trim() || "Untitled",
    summary: input.summary.trim(),
    body: input.body,
    coverUrl: input.coverUrl.trim(),
    youtubeUrl: input.youtubeUrl.trim(),
    duration: input.duration.trim(),
    affiliateId: input.affiliateId,
    authorId: existing?.authorId ?? session.userId,
    authorName: existing?.authorName ?? session.name,
    readMinutes: readMinutes(input.body),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    publishedAt: "",
  };
  next.publishedAt = input.status === "published" ? existing?.publishedAt || now : "";
  if (existing) {
    data.posts = data.posts.map((post) => (post.id === existing.id ? next : post));
  } else {
    data.posts.unshift(next);
  }
  persist();
  return next;
}

export async function deletePost(id: string): Promise<void> {
  requireRole(["admin", "editor"]);
  const data = db();
  data.posts = data.posts.filter((post) => post.id !== id);
  persist();
}

export async function getCategories(): Promise<Category[]> {
  const data = typeof window === "undefined" ? freshSeed() : db();
  return data.categories;
}

export async function saveCategory(input: Category): Promise<Category> {
  requireRole(["admin", "editor"]);
  const data = db();
  const slug = slugify(input.slug || input.name);
  if (data.categories.some((category) => category.slug === slug && category.id !== input.id)) {
    throw new Error("That category slug already exists.");
  }
  const next = { ...input, slug, name: input.name.trim(), description: input.description.trim() };
  const index = data.categories.findIndex((category) => category.id === next.id);
  if (index >= 0) data.categories[index] = next;
  else data.categories.push(next);
  persist();
  return next;
}

export async function getTools(): Promise<Tool[]> {
  const data = typeof window === "undefined" ? freshSeed() : db();
  return data.tools.slice().sort((a, b) => a.rank - b.rank);
}

export async function saveTool(input: Tool): Promise<Tool> {
  requireRole(["admin"]);
  const data = db();
  const next: Tool = {
    ...input,
    name: input.name.trim(),
    category: input.category.trim(),
    blurb: input.blurb.trim(),
    rating: Math.min(10, Math.max(0, Number(input.rating) || 0)),
    rank: Number(input.rank) || 1,
  };
  if (!next.name) throw new Error("A tool needs a name.");
  const index = data.tools.findIndex((tool) => tool.id === next.id);
  if (index >= 0) data.tools[index] = next;
  else data.tools.push(next);
  persist();
  return next;
}

export async function deleteTool(id: string): Promise<void> {
  requireRole(["admin"]);
  const data = db();
  data.tools = data.tools.filter((tool) => tool.id !== id);
  persist();
}

export async function getAffiliates(): Promise<Affiliate[]> {
  const data = typeof window === "undefined" ? freshSeed() : db();
  return data.affiliates;
}

export async function saveAffiliate(input: Affiliate): Promise<Affiliate> {
  requireRole(["admin"]);
  const data = db();
  const next = { ...input, id: slugify(input.id || input.name), name: input.name.trim(), url: input.url.trim() };
  if (!next.name || !next.url) throw new Error("Name and URL are required.");
  try {
    const url = new URL(next.url);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("bad");
  } catch {
    throw new Error("Affiliate URL must start with http:// or https://");
  }
  const index = data.affiliates.findIndex((item) => item.id === next.id);
  if (index >= 0) data.affiliates[index] = next;
  else data.affiliates.push(next);
  persist();
  return next;
}

export async function deleteAffiliate(id: string): Promise<void> {
  requireRole(["admin"]);
  const data = db();
  data.affiliates = data.affiliates.filter((item) => item.id !== id);
  persist();
}

export async function getSubscribers(): Promise<Subscriber[]> {
  requireRole(["admin", "editor"]);
  return db().subscribers.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addSubscriber(email: string): Promise<Subscriber> {
  const data = typeof window === "undefined" ? freshSeed() : db();
  const normalized = email.trim().toLowerCase();
  const existing = data.subscribers.find((item) => item.email === normalized);
  if (existing) return existing;
  const next = { id: crypto.randomUUID(), email: normalized, createdAt: new Date().toISOString() };
  if (typeof window === "undefined") return next;
  db().subscribers.unshift(next);
  persist();
  return next;
}

export async function getUsers(): Promise<TeamUser[]> {
  requireRole(["admin"]);
  return db().users.map(toTeam);
}

export async function setUserRole(userId: string, role: Role, active = true): Promise<TeamUser> {
  const session = requireRole(["admin"]);
  const data = db();
  const user = data.users.find((item) => item.id === userId);
  if (!user) throw new Error("That teammate was not found.");
  if (user.id === session.userId && (role !== "admin" || !active)) {
    throw new Error("You can't remove your own admin access.");
  }
  const admins = data.users.filter((item) => item.role === "admin" && item.active && item.id !== user.id);
  if (user.role === "admin" && user.active && (role !== "admin" || !active) && admins.length === 0) {
    throw new Error("Keep at least one active admin.");
  }
  user.role = role;
  user.active = active;
  if (data.session?.userId === user.id) {
    data.session = { ...data.session, role };
  }
  persist();
  return toTeam(user);
}

export async function inviteUser(input: { email: string; name: string; role: Role; password?: string }): Promise<TeamUser> {
  requireRole(["admin"]);
  const data = db();
  const email = input.email.trim().toLowerCase();
  if (data.users.some((user) => user.email === email)) throw new Error("That email is already on the team.");
  const user: DemoUser = {
    id: crypto.randomUUID(),
    email,
    name: input.name.trim() || email.split("@")[0] || "Teammate",
    role: input.role,
    active: true,
    password: input.password?.trim() || "demo1234",
  };
  data.users.push(user);
  persist();
  return toTeam(user);
}

export async function signIn(email: string, password: string): Promise<Session> {
  const data = db();
  const user = data.users.find((item) => item.email === email.trim().toLowerCase());
  if (!user || user.password !== password) throw new Error("Email or password is wrong.");
  if (!user.active) throw new Error("This account is deactivated. Ask an admin.");
  const session: Session = { userId: user.id, email: user.email, name: user.name, role: user.role };
  data.session = session;
  persist();
  return session;
}

export async function signOut(): Promise<void> {
  if (typeof window === "undefined") return;
  db().session = null;
  persist();
}

export async function getSession(): Promise<Session | null> {
  if (typeof window === "undefined") return null;
  const session = db().session;
  if (!session) return null;
  const user = db().users.find((item) => item.id === session.userId);
  if (!user || !user.active) {
    db().session = null;
    persist();
    return null;
  }
  return { ...session, role: user.role, name: user.name, email: user.email };
}

export async function signUp(_email: string, _password: string): Promise<Session | null> {
  throw new Error(
    "Demo mode does not open public sign-up. Use admin@demo.com, editor@demo.com, or writer@demo.com.",
  );
}
