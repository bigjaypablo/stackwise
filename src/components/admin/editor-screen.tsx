import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { PublishBar } from "@/components/admin/publish-bar";
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

function problemBeforePublish(post: Post): string | null {
  if (!post.title.trim() || post.title.trim() === "Untitled") return "Give the story a real title before publishing.";
  if (!post.summary.trim()) return "Add a summary before publishing. It shows on cards and in search results.";
  if (post.body.trim().length < 40) return "The story body is too short to publish.";
  if (!post.categoryId) return "Pick a category before publishing.";
  return null;
}

export function EditorScreen({ id, role }: { id: string; role: Role }) {
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [slugLocked, setSlugLocked] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [savedStatus, setSavedStatus] = useState<PostStatus>("draft");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState("Loading…");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const canPublish = role === "admin" || role === "editor";

  const persist = useCallback((next: Post) => {
    setBusy(true);
    setState("Saving…");
    return savePost(next)
      .then((saved) => {
        setPost(saved);
        setSavedStatus(saved.status);
        setDirty(false);
        setState("Saved");
        setError("");
      })
      .catch((reason: unknown) => {
        setState("Not saved");
        setError(reason instanceof Error ? reason.message : "Save failed.");
      })
      .finally(() => setBusy(false));
  }, []);

  useEffect(() => {
    let cancel = false;
    Promise.all([getPostById(id), getCategories(), getAffiliates()])
      .then(([found, nextCategories, nextAffiliates]) => {
        if (cancel) return;
        setCategories(nextCategories);
        setAffiliates(nextAffiliates);
        setPost(found ?? empty(id, nextCategories[0]?.id ?? "", ""));
        setSavedStatus(found?.status ?? "draft");
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
    if (!post || !dirty || savedStatus === "published") return;
    const timer = window.setTimeout(() => {
      persist(post);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [post, dirty, savedStatus, persist]);

  useEffect(() => {
    if (!dirty || savedStatus !== "published") return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, savedStatus]);

  if (!post) {
    return <p>{error || state}</p>;
  }

  const live = savedStatus === "published";
  const locked = role === "writer" && live;
  const liveDirty = live && dirty;

  const update = (patch: Partial<Post>) => {
    setPost((current) => (current ? { ...current, ...patch } : current));
    setDirty(true);
  };

  function changeStatus(next: PostStatus) {
    if (!post) return;
    if (next === "published") {
      const problem = problemBeforePublish(post);
      if (problem) {
        setError(problem);
        return;
      }
    }
    setError("");
    const slug = next === "published" && post.slug.startsWith("untitled") ? slugify(post.title) : post.slug;
    persist({ ...post, status: next, slug });
  }

  function updateLive() {
    if (!post) return;
    const problem = problemBeforePublish(post);
    if (problem) {
      setError(problem);
      return;
    }
    persist(post);
  }

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
          {liveDirty ? "Unsaved changes" : state}
        </p>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {live && canPublish ? (
        <p className="glass mt-3 rounded-2xl px-4 py-2.5 text-sm text-ink/75">
          This story is live. Your edits stay private until you tap <strong>Update live</strong>.
        </p>
      ) : null}
      {locked ? <p className="mt-3 text-sm text-ink/60">This published story is locked for writers.</p> : null}

      <fieldset disabled={locked} className="mt-4 min-w-0 border-0 p-0">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
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
              className="field h-12"
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
                  className="field mt-1 h-11 text-sm"
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
            {live ? <p className="text-xs text-ink/55">Changing the slug of a live story breaks its old link.</p> : null}
            <label className="block text-sm font-semibold" htmlFor="summary">
              Summary
            </label>
            <textarea
              id="summary"
              rows={3}
              value={post.summary}
              onChange={(event) => update({ summary: event.target.value })}
              className="field py-3"
            />
            <div className="flex gap-2 lg:hidden">
              <button type="button" className={tab === "write" ? "pill-accent h-10" : "pill-light h-10"} onClick={() => setTab("write")}>
                Write
              </button>
              <button type="button" className={tab === "preview" ? "pill-accent h-10" : "pill-light h-10"} onClick={() => setTab("preview")}>
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
                  className="field mt-1 py-3 font-mono text-sm"
                />
              </div>
              <div className={`glass rounded-[1.75rem] p-4 ${tab === "write" ? "hidden lg:block" : ""}`}>
                <p className="text-sm font-semibold">Preview</p>
                <MarkdownBody source={post.body || "_Nothing yet._"} affiliates={affiliates} />
              </div>
            </div>
          </div>

          <aside className="glass space-y-3 rounded-[1.75rem] p-4 lg:sticky lg:top-3 lg:self-start">
            <ImageUpload value={post.coverUrl} onChange={(url) => update({ coverUrl: url })} />
            <label className="block text-sm font-semibold" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={post.categoryId}
              onChange={(event) => update({ categoryId: event.target.value })}
              className="field h-11"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={post.featured} onChange={(event) => update({ featured: event.target.checked })} />
              Featured on the homepage
            </label>
            <label className="flex items-start gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                className="mt-1"
                checked={post.isTest}
                onChange={(event) => update({ isTest: event.target.checked })}
              />
              <span>
                Deep dive
                <span className="block text-xs font-normal text-ink/55">
                  Adds a Deep dive tag and lists it under Latest Research. Use it for your longest, best-sourced posts.
                </span>
              </span>
            </label>
            <label className="block text-sm font-semibold" htmlFor="youtube">
              YouTube link (optional)
            </label>
            <input
              id="youtube"
              value={post.youtubeUrl}
              onChange={(event) => update({ youtubeUrl: event.target.value })}
              className="field h-11"
            />
            <label className="block text-sm font-semibold" htmlFor="duration">
              Video length (optional)
            </label>
            <input
              id="duration"
              value={post.duration}
              onChange={(event) => update({ duration: event.target.value })}
              placeholder="12:04"
              className="field h-11"
            />
            <label className="block text-sm font-semibold" htmlFor="affiliate">
              Our pick
            </label>
            <select
              id="affiliate"
              value={post.affiliateId}
              onChange={(event) => update({ affiliateId: event.target.value })}
              className="field h-11"
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
                className="pill-light w-full text-red-600"
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
          </aside>
        </div>
      </fieldset>

      <PublishBar
        role={role}
        status={savedStatus}
        onStatus={changeStatus}
        busy={busy}
        unsaved={liveDirty}
        onUpdate={updateLive}
      />
    </div>
  );
}
