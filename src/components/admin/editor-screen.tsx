import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { PublishBar } from "@/components/admin/publish-bar";
import { RichEditor, type RichEditorHandle } from "@/components/admin/rich-editor";
import { deletePost, getAffiliates, getCategories, getPostById, savePost } from "@/lib/api";
import { slugify } from "@/lib/format";
import type { Affiliate, Category, Post, PostStatus, Role } from "@/lib/types";
import { publishBlockers } from "@/lib/publish-checks";

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

function readMinutesFor(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function problemBeforePublish(post: Post): string | null {
  const blocked = publishBlockers(post);
  if (blocked) return blocked;
  if (!post.title.trim() || post.title.trim() === "Untitled") return "Give the story a real title before publishing.";
  if (!post.summary.trim()) return "Add a summary before publishing. It shows on cards and in search results.";
  if (post.body.trim().length < 40) return "The story body is too short to publish.";
  if (!post.categoryId) return "Pick a category before publishing.";
  return null;
}

export function EditorScreen({ id, role }: { id: string; role: Role }) {
  const navigate = useNavigate();
  const editorRef = useRef<RichEditorHandle>(null);
  const version = useRef(0);
  const failedAt = useRef<number | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [initialBody, setInitialBody] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [slugLocked, setSlugLocked] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [savedStatus, setSavedStatus] = useState<PostStatus>("draft");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState("Loading…");
  const [error, setError] = useState("");
  const [tried, setTried] = useState(false);
  const canPublish = role === "admin" || role === "editor";

  const persist = useCallback(async (next: Post): Promise<boolean> => {
    const started = version.current;
    setBusy(true);
    setState("Saving…");
    try {
      const saved = await savePost(next);
      setPost((current) =>
        current
          ? {
              ...current,
              id: saved.id,
              authorId: saved.authorId,
              authorName: saved.authorName,
              createdAt: saved.createdAt,
              updatedAt: saved.updatedAt,
              publishedAt: saved.publishedAt,
              slug: current.slug === next.slug ? saved.slug : current.slug,
              status: next.status,
            }
          : current,
      );
      setSavedStatus(saved.status);
      failedAt.current = null;
      if (version.current === started) {
        setDirty(false);
        setState("Saved");
      }
      setError("");
      return true;
    } catch (reason) {
      failedAt.current = started;
      setState("Not saved");
      setError(reason instanceof Error ? reason.message : "Save failed.");
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    let cancel = false;
    Promise.all([getPostById(id), getCategories(), getAffiliates()])
      .then(([found, nextCategories, nextAffiliates]) => {
        if (cancel) return;
        const loaded = found ?? empty(id, nextCategories[0]?.id ?? "", "");
        setCategories(nextCategories);
        setAffiliates(nextAffiliates);
        setPost(loaded);
        setInitialBody(loaded.body);
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
    if (!post || !dirty || busy || savedStatus === "published" || failedAt.current === version.current) return;
    const timer = window.setTimeout(() => {
      void persist(post);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [post, dirty, busy, savedStatus, persist]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!post || initialBody === null) {
    return <p>{error || state}</p>;
  }

  const live = savedStatus === "published";
  const locked = role === "writer" && live;
  const liveDirty = live && dirty;
  const blocker = tried ? problemBeforePublish(post) : null;

  const update = (patch: Partial<Post>) => {
    version.current += 1;
    setPost((current) => (current ? { ...current, ...patch } : current));
    setDirty(true);
  };

  const withLatestBody = (): Post => {
    const body = editorRef.current?.flush();
    return body == null ? post : { ...post, body, readMinutes: readMinutesFor(body) };
  };

  async function changeStatus(next: PostStatus) {
    const current = withLatestBody();
    if (next === "published") {
      const problem = problemBeforePublish(current);
      if (problem) {
        setTried(true);
        return;
      }
    }
    setError("");
    const slug = next === "published" && current.slug.startsWith("untitled") ? slugify(current.title) : current.slug;
    const ok = await persist({ ...current, status: next, slug });
    if (ok) setPost((latest) => (latest ? { ...latest, status: next, slug } : latest));
  }

  async function updateLive() {
    const current = withLatestBody();
    const problem = problemBeforePublish(current);
    if (problem) {
      setTried(true);
      return;
    }
    await persist(current);
  }

  return (
    <div className="pb-24">
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
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0 space-y-3">
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
            <p className="pt-1 text-sm font-semibold">Story</p>
            <RichEditor
              key={id}
              ref={editorRef}
              value={initialBody}
              disabled={locked}
              onChange={(markdown) => update({ body: markdown, readMinutes: readMinutesFor(markdown) })}
            />
          </div>

          <aside className="glass min-w-0 space-y-3 rounded-[1.75rem] p-4 lg:sticky lg:top-3 lg:self-start">
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

      {blocker ? (
        <p
          role="alert"
          className="sticky bottom-[4.75rem] z-20 mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700"
        >
          Not ready to publish: {blocker}
        </p>
      ) : null}
      <PublishBar
        role={role}
        status={savedStatus}
        onStatus={(next) => {
          void changeStatus(next);
        }}
        busy={busy}
        unsaved={liveDirty}
        onUpdate={() => {
          void updateLive();
        }}
      />
    </div>
  );
}
