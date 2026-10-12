import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StoryCard } from "@/components/story-card";
import { categoryById, postsByCategory, usePublicData } from "@/lib/use-public";

export function CategoryPage({ slug }: { slug: string }) {
  const data = usePublicData();
  const category = data.categories.find((item) => item.slug === slug);
  const posts = postsByCategory(data.posts, data.categories, slug);

  if (!category) {
    return (
      <div className="py-16">
        <h1 className="text-3xl font-extrabold">No section by that name</h1>
        <Link to="/" className="mt-4 inline-flex font-semibold text-accent">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-accent">Section</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{category.description}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <StoryCard key={post.id} post={post} category={category} size="large" />
        ))}
      </div>
      {posts.length === 0 ? <p className="mt-6 text-ink/70">Nothing published in this section yet.</p> : null}
    </div>
  );
}

export function SearchPage({ query }: { query: string }) {
  const data = usePublicData();
  const navigate = useNavigate();
  const [value, setValue] = useState(query);
  const needle = query.trim().toLowerCase();
  const results = needle
    ? data.posts.filter((post) => `${post.title} ${post.summary} ${post.body}`.toLowerCase().includes(needle))
    : data.posts;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Search</h1>
      <form
        className="mt-4 flex max-w-xl gap-2"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          navigate({ to: "/search", search: { q: value } });
        }}
      >
        <label htmlFor="search-page-q" className="sr-only">
          Search query
        </label>
        <input
          id="search-page-q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-12 flex-1 rounded-full border border-line bg-mist px-4 text-sm outline-none"
        />
        <button type="submit" className="h-12 rounded-full bg-accent px-5 text-sm font-semibold text-paper">
          Search
        </button>
      </form>
      <p className="mt-4 text-sm text-ink/65">
        {results.length} published {results.length === 1 ? "story" : "stories"}
        {needle ? ` for “${query}”` : ""}.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((post) => (
          <StoryCard key={post.id} post={post} category={categoryById(data.categories, post.categoryId)} />
        ))}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">About Stackwise</h1>
      <p className="mt-4 text-lg text-ink/80">Tools tested before you pay.</p>
      <div className="mt-6 space-y-4 text-ink/85 leading-relaxed">
        <p>
          Stackwise writes about crypto wallets, AI tools, and the SaaS a small team might actually keep. The tone is a review desk, not a launch calendar.
        </p>
        <p>
          A product earns a link after someone on the desk has used it for the job it claims to do. Placeholder stories in this demo are marked in the article itself. They are not live test results.
        </p>
        <p>
          Affiliate links, when they appear, are labeled and stored in one list. The score is written before the link is attached. If a tool is bad, the link does not rescue it.
        </p>
      </div>
    </div>
  );
}

export function ContactPage() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const address = "editors@stackwise.example";

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-extrabold tracking-tight">Contact</h1>
      <p className="mt-3 text-ink/75">
        Email only. Write <a className="font-semibold text-accent" href={`mailto:${address}`}>{address}</a>. This demo does not store messages on a server.
      </p>
      <form
        className="mt-6 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          const subject = encodeURIComponent("Stackwise note");
          const body = encodeURIComponent(`${note}\n\nFrom: ${email}`);
          window.location.href = `mailto:${address}?subject=${subject}&body=${body}`;
        }}
      >
        <div>
          <label htmlFor="contact-email" className="text-sm font-semibold">
            Your email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 h-12 w-full rounded-xl border border-line px-3"
          />
        </div>
        <div>
          <label htmlFor="contact-note" className="text-sm font-semibold">
            Note
          </label>
          <textarea
            id="contact-note"
            required
            rows={5}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-1 w-full rounded-xl border border-line px-3 py-2"
          />
        </div>
        <button type="submit" className="h-11 rounded-full bg-accent px-5 text-sm font-semibold text-paper">
          Open email
        </button>
      </form>
    </div>
  );
}

export function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">Affiliate disclosure</h1>
      <div className="mt-5 space-y-4 leading-relaxed text-ink/85">
        <p>
          Some links to tools are affiliate links. If you choose to visit or buy through one, Stackwise may earn a commission. You do not pay extra because of that.
        </p>
        <p>
          Those links are kept in a single affiliate list and rendered with <code>rel="sponsored nofollow noopener"</code>. Editorial notes are written before a link is added. A commission is not a score.
        </p>
        <p>Placeholder links in the demo point at example.com. Replace them in the admin desk before a real launch.</p>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">Privacy</h1>
      <div className="mt-5 space-y-4 leading-relaxed text-ink/85">
        <p>
          In demo mode, stories, subscriber emails, and desk logins stay in this browser's local storage. Nothing is sent to Stackwise. Clearing site data deletes it.
        </p>
        <p>
          If you connect Supabase, account email and role live in your Supabase project, and newsletter addresses live in the subscribers table. The public site only reads published stories, tools, and affiliate links.
        </p>
        <p>The contact form does not save a copy. It opens your email app. Do not send passwords or seed phrases.</p>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-accent">404</p>
      <h1 className="mt-2 text-3xl font-extrabold">That page is not on the stack</h1>
      <p className="mt-3 text-ink/70">The link may be old, or the story is still a draft.</p>
      <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-paper">
        Go home
      </Link>
    </div>
  );
}
