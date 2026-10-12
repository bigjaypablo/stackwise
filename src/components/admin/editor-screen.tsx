import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MarkdownBody } from "@/components/markdown-body";
import { deletePost, getAffiliates, getCategories, getPostById, savePost } from "@/lib/api";
import { slugify } from "@/lib/format";
import type { Affiliate, Category, Post, PostStatus, Role } from "@/lib/types";

const empty = (id: string, categoryId: string, authorId: string): Post => ({
  id,
  slug: "untitled",
  title: "Untitled",
  summary: "",
  body: "",
  categoryId,
  coverUrl: "",
  featured: false,
  status: "draft",
  authorId,
  authorName: "",
  youtubeUrl: "",
  duration: "",
  isTest: false,
  readMinutes: 3,
  affiliateId: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishedAt: "",
});

export function EditorScreen({ id, role }: { id: string; role: Role }) {
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [slugLocked, setSlugLocked] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [state, setState] = useState("Loading…");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const canPublish = role === "admin" || role === "editor";
  const statuses: PostStatus[] = canPublish ? ["draft", "in_review", "published"] : ["draft", "in_review"];

  useEffect(() => {
    let cancel = false;
    Promise.all([getPostById(id), getCategories(), getAffiliates()])
      .then(([found, nextCategories, nextAffiliates]) => {
        if (cancel) return;
        setCategories(nextCategories);
        setAffiliates(nextAffiliates);
        setPost(found ?? empty(id, nextCategories[0]?.id ?? "", ""));
        setSlugLocked(Boolean(found));
        setState(found ? "Saved" : "New draft");
      })
      .catch((reason: unknown) => {
        if (!cancel) setError(reason instanceof Error ? reason.message : "Could not open this story.");
      });
    return () => {
      cancel = true;
    };
  }, [id]);

  useEffect(() => {
    if (!post || !dirty) return;
    const timer = window.setTimeout(() => {
      setState("Saving…");
      savePost(post)
        .then((saved) => {
          setPost(saved);
          setDirty(false);
          setState("Saved");
          setError("");
        })
        .catch((reason: unknown) => {
          setState("Not saved");
          setError(reason instanceof Error ? reason.message : "Save failed.");
        });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [post, dirty]);

  if (!post) {
    return <p>{error || state}</p>;
  }

  const locked = role === "writer" && post.status === "published" && !dirty;
  const update = (patch: Partial<Post>) => {
    setPost((current) => (current ? { ...current, ...patch } : current));
    setDirty(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/posts" className="text-sm font-semibold text-accent">
            All posts
          </Link>
          <h1 className="text-2xl font-extrabold">Edit story</h1>
        </div>
        <p className="text-sm text-ink/60" role="status">
          {state}
        </p>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="space-y-3">
          <label className="block text-sm font-semibold" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            value={post.title}
            onChange={(event) => {
              const title = event.target.value;
              update({ title, slug: slugLocked ? post.slug : slugify(title) });
            }}
            className="h-12 w-full rounded-xl border border-line bg-paper px-3"
          />
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                value={post.slug}
                onChange={(event) => {
                  setSlugLocked(true);
                  update({ slug: slugify(event.target.value) });
                }}
                className="mt-1 h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm"
              />
            </div>
            <label className="flex h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!slugLocked}
                onChange={(event) => setSlugLocked(!event.target.checked)}
              />
              Sync slug
            </label>
          </div>
          <label className="block text-sm font-semibold" htmlFor="summary">
            Summary
          </label>
          <textarea
            id="summary"
            rows={3}
            value={post.summary}
            onChange={(event) => update({ summary: event.target.value })}
            className="w-full rounded-xl border border-line bg-paper px-3 py-2"
          />
          <div className="flex gap-2 lg:hidden">
            <button type="button" className={`h-10 rounded-full px-4 text-sm font-semibold ${tab === "write" ? "bg-ink text-paper" : "bg-paper"}`} onClick={() => setTab("write")}>
              Write
            </button>
            <button type="button" className={`h-10 rounded-full px-4 text-sm font-semibold ${tab === "preview" ? "bg-ink text-paper" : "bg-paper"}`} onClick={() => setTab("preview")}>
              Preview
            </button>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <div className={tab === "preview" ? "hidden lg:block" : ""}>
              <label className="block text-sm font-semibold" htmlFor="body">
                Markdown
              </label>
              <textarea
                id="body"
                rows={16}
                value={post.body}
                onChange={(event) => update({ body: event.target.value })}
                className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 font-mono text-sm"
              />
            </div>
            <div className={`rounded-xl border border-line bg-paper p-4 ${tab === "write" ? "hidden lg:block" : ""}`}>
              <p className="text-sm font-semibold">Preview</p>
              <MarkdownBody source={post.body || "_Nothing yet._"} affiliates={affiliates} />
            </div>
          </div>
        </div>
        <aside className="space-y-3 rounded-2xl border border-line bg-paper p-4">
          <label className="block text-sm font-semibold" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={statuses.includes(post.status) ? post.status : "draft"}
            onChange={(event) => update({ status: event.target.value as PostStatus })}
            className="h-11 w-full rounded-xl border border-line px-3 text-sm"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item === "in_review" ? "In review" : item}
              </option>
            ))}
          </select>
          {!canPublish ? <p className="text-xs text-ink/60">Writers cannot publish or delete.</p> : null}
          <label className="block text-sm font-semibold" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={post.categoryId}
            onChange={(event) => update({ categoryId: event.target.value })}
            className="h-11 w-full rounded-xl border border-line px-3 text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label className="block text-sm font-semibold" htmlFor="cover">
            Cover URL (optional)
          </label>
          <input
            id="cover"
            value={post.coverUrl}
            onChange={(event) => update({ coverUrl: event.target.value })}
            placeholder="https://"
            className="h-11 w-full rounded-xl border border-line px-3 text-sm"
          />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={post.featured} onChange={(event) => update({ featured: event.target.checked })} />
            Featured on the homepage
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={post.isTest} onChange={(event) => update({ isTest: event.target.checked })} />
            Latest test (video card)
          </label>
          <label className="block text-sm font-semibold" htmlFor="youtube">
            YouTube placeholder URL
          </label>
          <input
            id="youtube"
            value={post.youtubeUrl}
            onChange={(event) => update({ youtubeUrl: event.target.value })}
            className="h-11 w-full rounded-xl border border-line px-3 text-sm"
          />
          <label className="block text-sm font-semibold" htmlFor="duration">
            Duration label
          </label>
          <input
            id="duration"
            value={post.duration}
            onChange={(event) => update({ duration: event.target.value })}
            placeholder="12:04"
            className="h-11 w-full rounded-xl border border-line px-3 text-sm"
          />
          <label className="block text-sm font-semibold" htmlFor="affiliate">
            Our pick
          </label>
          <select
            id="affiliate"
            value={post.affiliateId}
            onChange={(event) => update({ affiliateId: event.target.value })}
            className="h-11 w-full rounded-xl border border-line px-3 text-sm"
          >
            <option value="">None</option>
            {affiliates.map((affiliate) => (
              <option key={affiliate.id} value={affiliate.id}>
                {affiliate.name}
              </option>
            ))}
          </select>
          {canPublish ? (
            <button
              type="button"
              className="h-11 w-full rounded-full border border-line text-sm font-semibold"
              onClick={() => {
                if (!window.confirm("Delete this story?")) return;
                deletePost(post.id)
                  .then(() => navigate({ to: "/admin/posts" }))
                  .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Delete failed."));
              }}
            >
              Delete
            </button>
          ) : null}
          {locked ? <p className="text-xs text-ink/60">This published story is locked for writers.</p> : null}
        </aside>
      </div>
    </div>
  );
}
