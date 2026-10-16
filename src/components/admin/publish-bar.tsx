import type { Role } from "@/lib/types";

type Status = "draft" | "in_review" | "published";

const LABEL: Record<Status, string> = { draft: "Draft", in_review: "In review", published: "Published" };
const DOT: Record<Status, string> = { draft: "bg-slate-400", in_review: "bg-amber-400", published: "bg-emerald-500" };

export function PublishBar({
  role,
  status,
  onStatus,
  busy = false,
}: {
  role: Role;
  status: Status;
  onStatus: (next: Status) => void;
  busy?: boolean;
}) {
  const canPublish = role === "admin" || role === "editor";
  const canStepBack = status !== "draft" && (canPublish || status !== "published");

  return (
    <div className="glass sticky bottom-3 z-20 flex flex-wrap items-center gap-2 rounded-full px-4 py-2.5">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <span aria-hidden="true" className={`size-2.5 rounded-full ${DOT[status]}`} />
        {LABEL[status]}
      </span>
      <div className="ml-auto flex items-center gap-2">
        {canStepBack ? (
          <button type="button" disabled={busy} onClick={() => onStatus("draft")} className="pill-light disabled:opacity-60">
            {status === "published" ? "Unpublish" : "Back to draft"}
          </button>
        ) : null}
        {canPublish && status !== "published" ? (
          <button type="button" disabled={busy} onClick={() => onStatus("published")} className="pill-accent h-10 disabled:opacity-60">
            Publish
          </button>
        ) : null}
        {!canPublish && status === "draft" ? (
          <button type="button" disabled={busy} onClick={() => onStatus("in_review")} className="pill-accent h-10 disabled:opacity-60">
            Submit for review
          </button>
        ) : null}
      </div>
    </div>
  );
}
