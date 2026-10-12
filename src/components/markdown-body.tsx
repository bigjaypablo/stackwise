import ReactMarkdown from "react-markdown";
import { safeHttpUrl } from "@/lib/format";
import type { Affiliate } from "@/lib/types";

export function MarkdownBody({ source, affiliates }: { source: string; affiliates: Affiliate[] }) {
  const sponsored = new Set(affiliates.map((item) => safeHttpUrl(item.url)).filter(Boolean));

  return (
    <div className="max-w-none text-base leading-relaxed text-ink/90">
      <ReactMarkdown
        components={{
          h2: ({ children }) => <h2 className="mt-8 text-2xl font-bold tracking-tight text-ink">{children}</h2>,
          p: ({ children }) => <p className="mt-4 text-pretty">{children}</p>,
          ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-5">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="mt-4 rounded-xl border border-line bg-mist px-4 py-3 text-sm text-ink/75">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => {
            const safe = href ? safeHttpUrl(href) : null;
            if (!safe) return <span>{children}</span>;
            const isSponsored = sponsored.has(safe);
            return (
              <a
                href={safe}
                className="font-medium text-accent underline decoration-accent/40 underline-offset-2"
                target="_blank"
                rel={isSponsored ? "sponsored nofollow noopener" : "noopener noreferrer"}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
