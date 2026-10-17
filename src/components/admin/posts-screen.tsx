import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TimeAgo } from "@/components/time-ago";
import { deletePost, getCategories, getPosts, saveCategory, savePost } from "@/lib/api";
import { slugify } from "@/lib/format";
import type { Category, Post, PostStatus, Role } from "@/lib/types";

const FILTERS: Array<{ key: PostStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "in_review", label: "In review" },
  { key: "published", label: "Published" },
];
const DOT: Record<PostStatus, string> = { draft: "bg-slate-400", in_review: "bg-amber-400", published: "bg-emerald-500" };
const LABEL: Record<PostStatus, string> = { draft: "Draft", in_review: "In review", published: "Published" };

export function PostsScreen({ role, userId }: { role: Role; userId: string }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PostStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [catName, setCatName] = useState("");
  const canManage = role !== "writer";

  const load = () => {
    Promise.all([getPosts({ status: "all", includeUnpublished: true }), getCategories()])
      .then(([nextPosts, nextCategories]) => {
        setPosts(nextPosts);
        setCategories(nextCategories);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load posts."));
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: posts.length, draft: 0, in_review: 0, published: 0 };
    for (const post of posts) result[post.status] += 1;
    return result;
  }, [posts]);

  const shown = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return posts
      .filter((post) => filter === "all" || post.status === filter)
      .filter((post) => !needle || post.title.toLowerCase().includes(needle))
      .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  }, [posts, filter, search]);

  function createDraft() {
    const id = crypto.randomUUID();
    savePost({
      id,
      slug: `untitled-${id.slice(0, 6)}`,
      title: "Untitled",
      summary: "",
      body: "",
      categoryId: categories[0]?.id ?? "",
      coverUrl: "",
      featured: false,
      status: "draft",
      authorId: userId,
      authorName: "",
      youtubeUrl: "",
      duration: "",
      isTest: false,
      readMinutes: 3,
      affiliateId: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: "",
    })
      .then(() => navigate({ to: "/admin/posts/$id", params: { id } }))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not create a draft."));
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Posts</h1>
        <button type="button" className="pill-accent" onClick={createDraft}>
          New post
        </button>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto" role="tablist" aria-label="Filter by status">
        {FILTERS.map((item) => {
          const active = filter === item.key;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(item.key)}
              className={`h-10 shrink-0 rounded-full border px-4 text-sm font-semibold ${
                active ? "border-ink bg-ink text-white" : "border-white/80 bg-white/70 text-ink"
              }`}
            >
              {item.label} ({counts[item.key] ?? 0})
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <label htmlFor="post-search" className="sr-only">
          Search posts
        </label>
        <input
          id="post-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search titles"
          className="field h-11"
        />
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {shown.map((post) => {
          const locked = role === "writer" && post.authorId !== userId;
          return (
            <li key={post.id} className="glass flex flex-wrap items-center gap-3 rounded-3xl p-4">
              <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${DOT[post.status]}`} />
              <div className="min-w-0 flex-1">
                <Link
                  to="/admin/posts/$id"
                  params={{ id: post.id }}
                  className="line-clamp-2 font-semibold hover:text-accent"
                >
                  {post.title}
                </Link>
                <p className="mt-0.5 text-xs text-ink/60">
                  {LABEL[post.status]} · {post.authorName || "Unknown author"} · <TimeAgo iso={post.updatedAt} />
                  {locked ? " · locked" : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {post.status === "published" ? (
                  <a href={`/post/${post.slug}`} target="_blank" rel="noopener" className="pill-light">
                    View
                  </a>
                ) : null}
                <Link to="/admin/posts/$id" params={{ id: post.id }} className="pill-light">
                  Edit
                </Link>
                {canManage ? (
                  <button
                    type="button"
                    className="pill-light text-red-600"
                    onClick={() => {
                      if (!window.confirm("Delete this story?")) return;
                      deletePost(post.id)
                        .then(load)
                        .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Delete failed."));
                    }}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      {shown.length === 0 ? (
        <p className="glass mt-4 rounded-3xl px-5 py-8 text-center text-sm text-ink/65">
          {posts.length === 0 ? "No posts yet. Tap New post to write your first." : "Nothing matches that filter."}
        </p>
      ) : null}

      {canManage ? (
        <section className="glass mt-8 rounded-[1.75rem] p-5">
          <h2 className="text-lg font-extrabold tracking-tight">Categories</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.id} className="rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-sm">
                {category.name}
                <span className="ml-1.5 text-ink/45">
                  {posts.filter((post) => post.categoryId === category.id).length}
                </span>
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              saveCategory({ id: crypto.randomUUID(), slug: slugify(catName), name: catName, description: "" })
                .then(() => {
                  setCatName("");
                  load();
                })
                .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not add category."));
            }}
          >
            <label htmlFor="new-category" className="sr-only">
              New category
            </label>
            <input
              id="new-category"
              value={catName}
              onChange={(event) => setCatName(event.target.value)}
              placeholder="New category name"
              className="field h-11 flex-1"
              required
            />
            <button type="submit" className="pill-accent h-11">
              Add
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
