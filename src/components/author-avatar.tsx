import { OWNER } from "@/lib/site";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AuthorAvatar({ name, className = "size-6 text-[0.6rem]" }: { name: string; className?: string }) {
  if (name === OWNER.name && OWNER.avatarUrl) {
    return <img src={OWNER.avatarUrl} alt="" className={`shrink-0 rounded-full object-cover ${className}`} />;
  }
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-linear-to-br from-ink to-accent font-extrabold text-white ring-1 ring-white/40 ${className}`}
    >
      {initials(name)}
    </span>
  );
}
