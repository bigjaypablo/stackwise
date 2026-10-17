import type { Editor } from "@tiptap/react";
import { useRef, useState, type ReactNode } from "react";
import { safeHttpUrl } from "@/lib/format";
import { uploadCover } from "@/lib/uploads";

const BASE =
  "inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl px-2.5 text-sm font-semibold transition disabled:opacity-35";

function Tool({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`${BASE} ${active ? "bg-ink text-white" : "text-ink/75 hover:bg-ink/5"}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-ink/10" />;
}

export function EditorToolbar({
  editor,
  disabled,
  source,
  onToggleSource,
}: {
  editor: Editor;
  disabled: boolean;
  source: boolean;
  onToggleSource: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const off = disabled || source;
  const chain = () => editor.chain().focus();

  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt("Link address (starts with https://)", previous ?? "https://");
    if (input === null) return;
    if (input.trim() === "") {
      chain().extendMarkRange("link").unsetLink().run();
      return;
    }
    const href = safeHttpUrl(input.trim());
    if (!href) {
      window.alert("That does not look like a web address.");
      return;
    }
    chain().extendMarkRange("link").setLink({ href }).run();
  }

  async function addImage(file: File) {
    setBusy(true);
    setNote("");
    try {
      const src = await uploadCover(file);
      const alt = window.prompt("Describe the image (helps accessibility and search). You can leave this blank.") ?? "";
      chain().setImage({ src, alt }).run();
    } catch (reason) {
      setNote(reason instanceof Error ? reason.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sticky top-2 z-20 min-w-0 max-w-full rounded-t-[1.75rem] border-b border-ink/10 bg-white/90 px-2 py-1.5 backdrop-blur">
      <div className="no-scrollbar flex max-w-full items-center gap-0.5 overflow-x-auto">
        <Tool label="Undo" disabled={off || !editor.can().undo()} onClick={() => chain().undo().run()}>
          ↶
        </Tool>
        <Tool label="Redo" disabled={off || !editor.can().redo()} onClick={() => chain().redo().run()}>
          ↷
        </Tool>
        <Divider />
        <Tool
          label="Heading"
          active={editor.isActive("heading", { level: 2 })}
          disabled={off}
          onClick={() => chain().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Tool>
        <Tool
          label="Subheading"
          active={editor.isActive("heading", { level: 3 })}
          disabled={off}
          onClick={() => chain().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Tool>
        <Tool label="Bold" active={editor.isActive("bold")} disabled={off} onClick={() => chain().toggleBold().run()}>
          <span className="font-extrabold">B</span>
        </Tool>
        <Tool label="Italic" active={editor.isActive("italic")} disabled={off} onClick={() => chain().toggleItalic().run()}>
          <span className="italic">I</span>
        </Tool>
        <Divider />
        <Tool
          label="Bulleted list"
          active={editor.isActive("bulletList")}
          disabled={off}
          onClick={() => chain().toggleBulletList().run()}
        >
          • List
        </Tool>
        <Tool
          label="Numbered list"
          active={editor.isActive("orderedList")}
          disabled={off}
          onClick={() => chain().toggleOrderedList().run()}
        >
          1. List
        </Tool>
        <Tool
          label="Quote"
          active={editor.isActive("blockquote")}
          disabled={off}
          onClick={() => chain().toggleBlockquote().run()}
        >
          Quote
        </Tool>
        <Divider />
        <Tool label="Link" active={editor.isActive("link")} disabled={off} onClick={setLink}>
          Link
        </Tool>
        <Tool label="Image" disabled={off || busy} onClick={() => fileInput.current?.click()}>
          {busy ? "Uploading…" : "Image"}
        </Tool>
        <Tool
          label="Table"
          disabled={off}
          onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          Table
        </Tool>
        <Divider />
        <Tool label="Show the markdown this saves" active={source} onClick={onToggleSource}>
          Source
        </Tool>
      </div>

      {editor.isActive("table") && !off ? (
        <div className="no-scrollbar mt-1 flex items-center gap-0.5 overflow-x-auto border-t border-ink/10 pt-1">
          <Tool label="Add row below" onClick={() => chain().addRowAfter().run()}>
            + Row
          </Tool>
          <Tool label="Add column after" onClick={() => chain().addColumnAfter().run()}>
            + Column
          </Tool>
          <Tool label="Delete row" onClick={() => chain().deleteRow().run()}>
            − Row
          </Tool>
          <Tool label="Delete column" onClick={() => chain().deleteColumn().run()}>
            − Column
          </Tool>
          <Tool label="Delete table" onClick={() => chain().deleteTable().run()}>
            Delete table
          </Tool>
        </div>
      ) : null}

      {note ? (
        <p role="alert" className="px-2 pt-1 text-xs text-red-600">
          {note}
        </p>
      ) : null}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void addImage(file);
        }}
      />
    </div>
  );
}
