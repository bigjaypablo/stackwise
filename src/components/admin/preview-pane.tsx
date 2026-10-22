import { MarkdownBody } from "@/components/markdown-body";

export function PreviewPane({ markdown }: { markdown: string }) {
  return (
    <div className="rounded-b-[1.75rem] bg-white/70 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">
        Preview: this is how readers will see the story body
      </p>
      {markdown.trim() ? (
        <MarkdownBody source={markdown} affiliates={[]} />
      ) : (
        <p className="text-sm text-ink/60">Nothing to preview yet.</p>
      )}
    </div>
  );
}
