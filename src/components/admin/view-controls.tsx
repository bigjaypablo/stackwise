const BTN =
  "inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl px-3 text-sm font-semibold transition hover:bg-ink/5 disabled:opacity-35";

export function ViewControls({
  preview,
  onTogglePreview,
  zoom,
  onZoom,
}: {
  preview: boolean;
  onTogglePreview: () => void;
  zoom: number;
  onZoom: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-ink/10 bg-white/60 px-2 py-1">
      <button
        type="button"
        aria-pressed={preview}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onTogglePreview}
        className={`${BTN} ${preview ? "bg-ink text-white hover:bg-ink" : "text-ink"}`}
      >
        {preview ? "Back to editing" : "Preview"}
      </button>
      <span className="ml-auto flex items-center gap-1">
        <button type="button" aria-label="Smaller text" disabled={zoom <= 60} onClick={() => onZoom(zoom - 10)} className={BTN}>
          A−
        </button>
        <span className="w-11 text-center text-xs font-semibold text-ink/60">{zoom}%</span>
        <button type="button" aria-label="Larger text" disabled={zoom >= 140} onClick={() => onZoom(zoom + 10)} className={BTN}>
          A+
        </button>
      </span>
    </div>
  );
}
