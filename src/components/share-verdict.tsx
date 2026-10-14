import { XIcon } from "@/components/icons";
import { OWNER, siteOrigin, tweetIntent, verdictText } from "@/lib/site";

export function ShareVerdict({
  title,
  summary,
  slug,
  isTest,
}: {
  title: string;
  summary: string;
  slug: string;
  isTest: boolean;
}) {
  const text = verdictText(title, summary);

  function share() {
    const url = `${siteOrigin()}/post/${slug}`;
    window.open(tweetIntent(text, url), "_blank", "noopener,noreferrer");
  }

  return (
    <aside className="glass mt-8 max-w-3xl rounded-[1.75rem] p-5 sm:p-6" aria-labelledby="share-title">
      <h2 id="share-title" className="text-sm font-bold uppercase tracking-wider text-ink/60">
        {isTest ? "Post the verdict" : "Share this"}
      </h2>
      <div className="mt-3 rounded-2xl border border-white/80 bg-white/80 p-4">
        <p className="whitespace-pre-line text-sm text-ink/85">{text}</p>
        <p className="mt-2 text-xs text-ink/50">via @{OWNER.handle}</p>
      </div>
      <button
        type="button"
        onClick={share}
        className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/90"
      >
        <XIcon className="size-4" />
        Post on X
      </button>
    </aside>
  );
}
