import { FacebookIcon, InstagramIcon, XIcon, YouTubeIcon } from "@/components/icons";

const ITEMS = [
  { label: "Facebook", icon: FacebookIcon },
  { label: "X", icon: XIcon },
  { label: "Instagram", icon: InstagramIcon },
  { label: "YouTube", icon: YouTubeIcon },
];

export function Socials({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {ITEMS.map((item) => (
        <a
          key={item.label}
          href="/contact"
          aria-label={`${item.label}, placeholder`}
          className="inline-flex size-9 items-center justify-center rounded-full text-ink/70 hover:bg-ink/5 hover:text-ink"
        >
          <item.icon className="size-4" />
        </a>
      ))}
    </div>
  );
}
