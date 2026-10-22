import type { Post } from "@/lib/types";

const MIN_WORDS = { standard: 800, deep: 1500 };
const MIN_SOURCES = { standard: 5, deep: 8 };
const MIN_H2 = 3;

const BANNED = [
  "we tested",
  "we tried",
  "i tested",
  "i tried",
  "we bought",
  "hands-on",
  "our score",
  "our rating",
  "guaranteed",
  "guarantee",
];

const SOURCES_HEADING = /^#{1,6}\s*sources\s*$/im;

function countWords(markdown: string): number {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function countSourceLinks(markdown: string): number {
  const withoutImages = markdown.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
  const urls = withoutImages.match(/https?:\/\/[^\s)\]>]+/g) ?? [];
  return new Set(urls.map((url) => url.replace(/[.,;]+$/, ""))).size;
}

export function publishBlockers(post: Post): string | null {
  const kind = post.isTest ? "deep" : "standard";
  const label = post.isTest ? "Deep dive" : "Standard article";
  const match = SOURCES_HEADING.exec(post.body);
  const main = match ? post.body.slice(0, match.index) : post.body;

  const words = countWords(main);
  if (words < MIN_WORDS[kind]) {
    return `${label} needs at least ${MIN_WORDS[kind]} words. This one has ${words}.`;
  }

  const h2 = (main.match(/^##\s+\S/gm) ?? []).length;
  if (h2 < MIN_H2) return `Add at least ${MIN_H2} descriptive H2 subheads. This one has ${h2}.`;

  const found = countSourceLinks(post.body);
  if (found < MIN_SOURCES[kind]) {
    return `${label} needs at least ${MIN_SOURCES[kind]} different source links in the text. Found ${found}.`;
  }

  const lower = post.body.toLowerCase();
  const hit = BANNED.find((phrase) => lower.includes(phrase));
  if (hit) return `Remove the phrase "${hit}". Stackwise does not claim testing, scores or guarantees.`;

  return null;
}
