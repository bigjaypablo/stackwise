import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { RoleGate } from "@/components/admin/admin-shell";
import { TimeAgo } from "@/components/time-ago";
import { deleteComment, listAll, setCommentStatus, type Comment, type CommentStatus } from "@/lib/comments";

const TABS: CommentStatus[] = ["pending", "approved", "rejected"];

export function CommentsScreen() {
  return <RoleGate allow={["admin", "editor"]}>{() => <Queue />}</RoleGate>;
}

function Queue() {
  const [tab, setTab] = useState<CommentStatus>("pending");
  const [items, setItems] = useState<Comment[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    listAll()
      .then(setItems)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load comments."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function act(run: () => Promise<void>) {
    setError("");
    run()
      .then(load)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "That did not work."));
  }

  const shown = items.filter((item) => item.status === tab);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Comments</h1>
      <p className="mt-1 text-sm text-ink/70">Nothing shows on the site until you approve it.</p>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Comment status">
        {TABS.map((status) => {
          const count = items.filter((item) => item.status === status).length;
          const active = tab === status;
          return (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(status)}
              className={`h-10 rounded-full border px-4 text-sm font-semibold capitalize ${
                active ? "border-ink bg-ink text-white" : "border-white/80 bg-white/70 text-ink"
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {shown.map((item) => (
          <li key={item.id} className="glass rounded-3xl p-4">
            <p className="text-sm font-semibold">
              {item.name} <span className="font-normal text-ink/50">· <TimeAgo iso={item.createdAt} /></span>
            </p>
            <p className="mt-1 text-xs text-ink/55">
              On{" "}
              <Link to="/post/$slug" params={{ slug: item.postSlug }} className="font-semibold text-accent">
                {item.postSlug}
              </Link>
            </p>
            <p className="mt-2 whitespace-pre-line break-words text-sm">{item.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.status !== "approved" ? (
                <button type="button" className="pill-accent h-10" onClick={() => act(() => setCommentStatus(item.id, "approved"))}>
                  Approve
                </button>
              ) : null}
              {item.status !== "rejected" ? (
                <button type="button" className="pill-light" onClick={() => act(() => setCommentStatus(item.id, "rejected"))}>
                  Reject
                </button>
              ) : null}
              <button
                type="button"
                className="pill-light text-red-600"
                onClick={() => {
                  if (window.confirm("Delete this comment for good?")) act(() => deleteComment(item.id));
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {shown.length === 0 ? <p className="mt-4 text-sm text-ink/65">Nothing here.</p> : null}
    </div>
  );
}
