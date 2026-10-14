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
  outline: "border border-white/25 text-white hover:bg-white/10",
};

export function Socials({
  className = "",
  tone = "light",
  size = "md",
}: {
  className?: string;
  tone?: "light" | "dark" | "outline";
  size?: "md" | "lg";
}) {
  const items = SOCIALS.filter((item) => item.href);
  if (items.length === 0) return null;

  const box = size === "lg" ? "size-11" : "size-9";
  const icon = size === "lg" ? "size-5" : "size-4";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map((item) => {
        const Icon = ICONS[item.id];
        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={`inline-flex ${box} items-center justify-center rounded-full transition ${TONES[tone]}`}
          >
            <Icon className={icon} />
          </a>
        );
      })}
    </div>
  );
}
