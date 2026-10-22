import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { EditorToolbar } from "@/components/admin/editor-toolbar";
import { TableTools } from "@/components/admin/table-tools";
import { cleanMarkdown } from "@/lib/markdown-clean";
import { MarkdownPaste } from "@/lib/markdown-paste";

export interface RichEditorHandle {
  /** Returns the latest markdown right now and sends it to the parent. Null if the editor is not ready. */
  flush: () => string | null;
}

export function RichEditor({
  value,
  onChange,
  disabled = false,
  ref,
}: {
  value: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
  ref?: Ref<RichEditorHandle>;
}) {
  const box = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const latest = useRef(onChange);
  const [source, setSource] = useState(false);
  const [sourceText, setSourceText] = useState("");

  useEffect(() => {
    latest.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false, link: { openOnClick: false, autolink: true } }),
      Markdown,
      Table,
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Placeholder.configure({ placeholder: "Start writing, or paste your draft here" }),
      MarkdownPaste,
    ],
    content: cleanMarkdown(value),
    contentType: "markdown",
    editable: !disabled,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { spellcheck: "true", autocapitalize: "sentences" } },
    onUpdate: ({ editor: current }) => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        timer.current = null;
        latest.current(current.getMarkdown());
      }, 250);
    },
    onBlur: ({ editor: current }) => {
      if (!timer.current) return;
      window.clearTimeout(timer.current);
      timer.current = null;
      latest.current(current.getMarkdown());
    },
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      flush: () => {
        if (!editor) return null;
        if (timer.current) {
          window.clearTimeout(timer.current);
          timer.current = null;
        }
        const markdown = editor.getMarkdown();
        latest.current(markdown);
        return markdown;
      },
    }),
    [editor],
  );

  return (
    <div ref={box} className="rich glass relative min-w-0 max-w-full rounded-[1.75rem]">
      {editor ? (
        <EditorToolbar
          editor={editor}
          disabled={disabled}
          source={source}
          onToggleSource={() => {
            if (!source) setSourceText(editor.getMarkdown());
            setSource((value) => !value);
          }}
        />
      ) : null}
      {editor && !source ? <TableTools editor={editor} containerRef={box} disabled={disabled} /> : null}
      {source ? (
        <textarea
          readOnly
          value={sourceText}
          aria-label="Markdown source"
          className="block min-h-[22rem] w-full resize-y rounded-b-[1.75rem] bg-transparent p-4 font-mono text-xs leading-relaxed outline-none"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
