import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { deletePost, getCategories, getPosts, saveCategory, savePost } from "@/lib/api";
import { slugify } from "@/lib/format";
import type { Category, Post, PostStatus, Role } from "@/lib/types";

const FILTERS: Array<PostStatus | "all"> = ["all", "draft", "in_review", "published"];

export function PostsScreen({ role, userId }: { role: Role; userId: string }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<PostStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [catName, setCatName] = useState("");

  const load = () => {
    Promise.all([getPosts({ status, search, includeUnpublished: true }), getCategories()])
      .then(([nextPosts, nextCategories]) => {
        setPosts(nextPosts);
        setCategories(nextCategories);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load posts."));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Posts</h1>
        <button
          type="button"
          className="h-11 rounded-full bg-accent px-4 text-sm font-semibold text-paper"
          onClick={() => {
            const id = crypto.randomUUID();
            const categoryId = categories[0]?.id ?? "";
            savePost({
              id,
              slug: `untitled-${id.slice(0, 6)}`,
              title: "Untitled",
              summary: "",
              body: "",
              categoryId,
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
          }}
        >
          New post
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="post-filter">
          Status
        </label>
        <select
          id="post-filter"
          value={status}
          onChange={(event) => setStatus(event.target.value as PostStatus | "all")}
          className="h-11 rounded-xl border border-line bg-paper px-3 text-sm"
        >
          {FILTERS.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All statuses" : item === "in_review" ? "In review" : item}
            </option>
          ))}
        </select>
        <form
          className="flex flex-1 gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            load();
          }}
        >
          <label htmlFor="post-search" className="sr-only">
            Search posts
          </label>
          <input
            id="post-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search titles"
            className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm"
          />
          <button type="submit" className="h-11 rounded-full border border-line bg-paper px-4 text-sm font-semibold">
            Search
          </button>
        </form>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
        {posts.map((post) => (
          <li key={post.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <Link to="/admin/posts/$id" params={{ id: post.id }} className="font-semibold hover:text-accent">
                {post.title}
              </Link>
              <p className="text-xs text-ink/60">
                {post.authorName} · {labelStatus(post.status)}
                {role === "writer" && post.authorId !== userId ? " · locked" : ""}
              </p>
            </div>
            {role !== "writer" ? (
              <button
                type="button"
                className="h-10 rounded-full px-3 text-sm font-semibold text-ink/70 hover:bg-mist"
                onClick={() => {
                  if (!window.confirm("Delete this story?")) return;
                  deletePost(post.id).then(load).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Delete failed."));
                }}
              >
                Delete
              </button>
            ) : null}
          </li>
        ))}
        {posts.length === 0 ? <li className="px-4 py-8 text-sm text-ink/60">No stories in this filter.</li> : null}
      </ul>

      {role !== "writer" ? (
        <section className="mt-8 rounded-2xl border border-line bg-paper p-4">
          <h2 className="font-extrabold">Categories</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.id} className="flex justify-between gap-3 border-b border-line py-2">
                <span>{category.name}</span>
                <span className="text-ink/50">{category.slug}</span>
              </li>
            ))}
          </ul>
          <form
            className="mt-3 flex gap-2"
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
              className="h-11 flex-1 rounded-xl border border-line px-3 text-sm"
              required
            />
            <button type="submit" className="h-11 rounded-full bg-ink px-4 text-sm font-semibold text-paper">
              Add
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}

function labelStatus(status: PostStatus) {
  if (status === "in_review") return "In review";
  return status;
}
