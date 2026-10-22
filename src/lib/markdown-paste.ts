import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { cleanMarkdown, looksLikeMarkdown } from "@/lib/markdown-clean";

/** True when the clipboard HTML carries real structure, so the editor should handle it itself. */
function hasRichHtml(html: string): boolean {
  return /<(h[1-6]|table|ul|ol|li|blockquote)\b|<a\s[^>]*href/i.test(html);
}

/** Plain-text pastes that are really markdown (like AI drafts) get converted and tidied. */
export const MarkdownPaste = Extension.create({
  name: "markdownPaste",
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        props: {
          handlePaste: (_view, event) => {
            const data = event.clipboardData;
            if (!data || editor.isActive("codeBlock")) return false;
            const html = data.getData("text/html");
            const text = data.getData("text/plain");
            if (!text.trim() || !looksLikeMarkdown(text)) return false;
            if (hasRichHtml(html)) return false;
            event.preventDefault();
            editor.commands.insertContent(cleanMarkdown(text), { contentType: "markdown" });
            return true;
          },
        },
      }),
    ];
  },
});
