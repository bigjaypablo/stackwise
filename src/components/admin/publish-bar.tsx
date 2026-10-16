import type { Role } from "@/lib/types";

type Status = "draft" | "in_review" | "published";

const LABEL: Record<Status, string> = { draft: "Draft", in_review: "In review", published: "Published" };
const DOT: Record<Status, string> = { draft: "bg-slate-400", in_review: "bg-amber-400", published: "bg-emerald-500" };

export function PublishBar({
  role,
  status,
  onStatus,
  busy = false,
  unsaved = false,
  onUpdate,
}: {
  role: Role;
  status: Status;
  onStatus: (next: Status) => void;
  busy?: boolean;
  unsaved?: boolean;
  onUpdate?: () => void;
}) {
  const canPublish = role === "admin" || role === "editor";
  const canStepBack = status !== "draft" && (canPublish || status !== "published");
  const liveUnsaved = status === "published" && unsaved;

  return (
    <div className="glass sticky bottom-3 z-20 mt-4 flex flex-wrap items-center gap-2 rounded-full px-4 py-2.5">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <span aria-hidden="true" className={`size-2.5 rounded-full ${liveUnsaved ? "bg-amber-400" : DOT[status]}`} />
        {liveUnsaved ? "Live, unsaved changes" : LABEL[status]}
      </span>
      <div className="ml-auto flex items-center gap-2">
        {canStepBack ? (
          <button type="button" disabled={busy} onClick={() => onStatus("draft")} className="pill-light h-10 disabled:opacity-60">
            {status === "published" ? "Unpublish" : "Back to draft"}
          </button>
        ) : null}
        {canPublish && liveUnsaved && onUpdate ? (
          <button type="button" disabled={busy} onClick={onUpdate} className="pill-accent h-10 disabled:opacity-60">
            Update live
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
