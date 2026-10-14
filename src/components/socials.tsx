import { FacebookIcon, InstagramIcon, XIcon, YouTubeIcon } from "@/components/icons";
import { SOCIALS } from "@/lib/site";

const ICONS = {
  x: XIcon,
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

const TONES = {
  light: "text-ink/70 hover:bg-ink/5 hover:text-ink",
  dark: "glass-dark text-white/80 hover:text-white",
};

export function Socials({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const items = SOCIALS.filter((item) => item.href);
  if (items.length === 0) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {items.map((item) => {
        const Icon = ICONS[item.id];
        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={`inline-flex size-9 items-center justify-center rounded-full transition ${TONES[tone]}`}
          >
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}
