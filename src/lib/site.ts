export const SITE = {
  name: "Stackwise",
  tagline: "Research before you pay.",
};

export const OWNER = {
  name: "Big Jay",
  handle: "0xNormadOnChain",
  bio: "I run Stackwise. I research crypto, AI and SaaS tools and share what I find on X.",
  avatarUrl: "",
};

export const X_PROFILE_URL = `https://x.com/${OWNER.handle}`;
export const X_FOLLOW_URL = `https://x.com/intent/follow?screen_name=${OWNER.handle}`;

export interface Social {
  id: "x" | "youtube" | "instagram" | "facebook";
  label: string;
  href: string;
}

/** Icons with an empty href stay hidden until you add the real link. */
export const SOCIALS: Social[] = [
  { id: "x", label: "X", href: X_PROFILE_URL },
  { id: "youtube", label: "YouTube", href: "" },
  { id: "instagram", label: "Instagram", href: "" },
  { id: "facebook", label: "Facebook", href: "" },
];

export function siteOrigin(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return typeof window === "undefined" ? "" : window.location.origin;
}

function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function verdictText(title: string, summary: string): string {
  return `${clip(title, 100)}\n\n${clip(summary, 110)}`;
}

export function tweetIntent(text: string, url: string): string {
  const params = new URLSearchParams({ text, url, via: OWNER.handle });
  return `https://x.com/intent/tweet?${params.toString()}`;
}
