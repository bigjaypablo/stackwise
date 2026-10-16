import { AuthorAvatar } from "@/components/author-avatar";
import { XIcon } from "@/components/icons";
import { OWNER, X_FOLLOW_URL } from "@/lib/site";

export function AuthorCard() {
  return (
    <aside
      id="author-card"
      className="glass mt-8 max-w-3xl scroll-mt-24 rounded-[1.75rem] p-5 sm:p-6"
      aria-labelledby="author-title"
    >
      <div className="flex items-start gap-4">
        <AuthorAvatar name={OWNER.name} className="size-14 text-lg" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Behind Stackwise</p>
          <h2 id="author-title" className="text-lg font-extrabold">
            {OWNER.name}
          </h2>
          <p className="mt-1 text-sm text-ink/70">{OWNER.bio}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={X_FOLLOW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          <XIcon className="size-4" />
          Follow @{OWNER.handle}
        </a>
        <p className="text-xs text-ink/55">New research and updates, shared on X.</p>
      </div>
    </aside>
  );
}
