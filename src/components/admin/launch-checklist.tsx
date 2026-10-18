import { Link } from "@tanstack/react-router";

export type ChecklistTarget = "/admin/posts" | "/admin/affiliates" | "/admin/tools";

export interface ChecklistItem {
  label: string;
  done: boolean;
  to?: ChecklistTarget;
}

export function LaunchChecklist({ items }: { items: ChecklistItem[] }) {
  return (
    <section className="glass mt-6 rounded-[1.75rem] p-5" aria-labelledby="launch-checklist">
      <h2 id="launch-checklist" className="text-lg font-extrabold tracking-tight">
        Launch checklist
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-3 py-2.5 text-sm"
          >
            <span
              aria-hidden="true"
              className={`grid size-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold ${
                item.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {item.done ? "✓" : ""}
            </span>
            <span className={`min-w-0 flex-1 ${item.done ? "text-ink/50 line-through" : ""}`}>{item.label}</span>
            {!item.done && item.to ? (
              <Link to={item.to} className="shrink-0 font-semibold text-accent">
                Open
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
