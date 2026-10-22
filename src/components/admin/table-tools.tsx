import type { Editor } from "@tiptap/react";
import type { RefObject } from "react";

const BTN =
  "inline-flex h-9 shrink-0 items-center rounded-lg px-2.5 text-xs font-semibold text-white/90 transition hover:bg-white/15 active:bg-white/25";

const ACTIONS: Array<{ label: string; text: string; run: (editor: Editor) => void }> = [
  { label: "Add row below", text: "+ Row", run: (e) => void e.chain().focus().addRowAfter().run() },
  { label: "Add column after", text: "+ Column", run: (e) => void e.chain().focus().addColumnAfter().run() },
  { label: "Delete row", text: "− Row", run: (e) => void e.chain().focus().deleteRow().run() },
  { label: "Delete column", text: "− Column", run: (e) => void e.chain().focus().deleteColumn().run() },
  { label: "Delete table", text: "Delete table", run: (e) => void e.chain().focus().deleteTable().run() },
];

export function TableTools({
  editor,
  containerRef,
  disabled,
}: {
  editor: Editor;
  containerRef: RefObject<HTMLDivElement | null>;
  disabled: boolean;
}) {
  const box = containerRef.current;
  if (!box || disabled || !editor.isActive("table")) return null;

  const { node } = editor.view.domAtPos(editor.state.selection.from);
  const element = node instanceof Element ? node : node.parentElement;
  const table = element?.closest("table");
  if (!table) return null;

  const outer = box.getBoundingClientRect();
  const rect = table.getBoundingClientRect();
  const above = rect.top - outer.top;
  const top = above < 64 ? rect.bottom - outer.top + 6 : above - 44;

  return (
    <div
      role="toolbar"
      aria-label="Table tools"
      style={{ top }}
      className="no-scrollbar absolute left-3 right-3 z-30 flex items-center gap-0.5 overflow-x-auto rounded-xl bg-ink p-1 shadow-lg"
    >
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          aria-label={action.label}
          title={action.label}
          className={BTN}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => action.run(editor)}
        >
          {action.text}
        </button>
      ))}
    </div>
  );
}
