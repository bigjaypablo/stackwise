import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { safeHttpUrl } from "@/lib/format";
import type { Affiliate } from "@/lib/types";

export function MarkdownBody({ source, affiliates }: { source: string; affiliates: Affiliate[] }) {
  const sponsored = new Set(affiliates.map((item) => safeHttpUrl(item.url)).filter(Boolean));

  return (
    <div className="max-w-none text-base leading-relaxed text-ink/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 className="mt-8 text-2xl font-bold tracking-tight text-ink">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-6 text-xl font-bold tracking-tight text-ink">{children}</h3>,
          p: ({ children }) => <p className="mt-4 text-pretty">{children}</p>,
          ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-5">{children}</ol>,
          hr: () => <hr className="my-8 border-ink/10" />,
          blockquote: ({ children }) => (
            <blockquote className="mt-4 rounded-xl border border-line bg-mist px-4 py-3 text-sm text-ink/75">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="mt-4 overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-mist">{children}</thead>,
          th: ({ children }) => <th className="px-3 py-2 font-bold text-ink">{children}</th>,
          td: ({ children }) => <td className="border-t border-line px-3 py-2 align-top">{children}</td>,
          img: ({ src, alt }) => {
            const safe = typeof src === "string" ? safeHttpUrl(src) : null;
            if (!safe) return null;
            return <img src={safe} alt={alt ?? ""} loading="lazy" decoding="async" className="mt-5 w-full rounded-2xl" />;
          },
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
