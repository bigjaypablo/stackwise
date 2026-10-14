import { useEffect, useState, type FormEvent } from "react";
import { TimeAgo } from "@/components/time-ago";
import { listApproved, submitComment, type Comment } from "@/lib/comments";

export function CommentSection({ slug }: { slug: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [trap, setTrap] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancel = false;
    listApproved(slug)
      .then((rows) => {
        if (!cancel) setItems(rows);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [slug]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (trap) {
      setDone(true);
      return;
    }
    setBusy(true);
    submitComment({ slug, name, body })
      .then(() => {
        setDone(true);
        setBody("");
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not post that comment."))
      .finally(() => setBusy(false));
  }

  return (
    <section id="comments" className="glass mt-8 max-w-3xl scroll-mt-24 rounded-[1.75rem] p-5 sm:p-6" aria-labelledby="comments-title">
      <h2 id="comments-title" className="text-xl font-extrabold tracking-tight">
        Join the discussion
      </h2>
      <p className="mt-1 text-sm text-ink/70">
        Used this tool, or disagree with our score? Tell us what you found. No account needed. Comments are reviewed
        before they show, and links are not allowed.
      </p>

      {done ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900" role="status">
          Thanks. Your comment is waiting for review and will show once an editor approves it.
        </p>
      ) : (
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div>
            <label htmlFor="comment-name" className="text-sm font-semibold">
              Name
            </label>
            <input
              id="comment-name"
              required
              maxLength={40}
              autoComplete="nickname"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field mt-1 h-12"
            />
          </div>
          <div>
            <label htmlFor="comment-body" className="text-sm font-semibold">
              Your comment
            </label>
            <textarea
              id="comment-body"
              required
              rows={4}
              maxLength={1500}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="field mt-1 py-3"
            />
            <p className="mt-1 text-right text-xs text-ink/50">{body.length}/1500</p>
          </div>
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="comment-website">Website</label>
            <input id="comment-website" tabIndex={-1} autoComplete="off" value={trap} onChange={(event) => setTrap(event.target.value)} />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={busy} className="pill-accent disabled:opacity-60">
            {busy ? "Posting…" : "Post comment"}
          </button>
        </form>
      )}

      <div className="mt-6 border-t border-ink/10 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink/60">
          {items.length ? `${items.length} ${items.length === 1 ? "comment" : "comments"}` : "No comments yet"}
        </h3>
        {items.length === 0 ? <p className="mt-2 text-sm text-ink/65">Be the first to share what you found.</p> : null}
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 rounded-2xl border border-white/80 bg-white/70 p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-ink to-accent text-sm font-bold text-white">
                {item.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {item.name} <span className="font-normal text-ink/50">· <TimeAgo iso={item.createdAt} /></span>
                </p>
                <p className="mt-1 whitespace-pre-line break-words text-sm text-ink/85">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
