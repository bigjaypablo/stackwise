import { HeroGlass } from "@/components/hero-glass";
import { TopPicksGlass } from "@/components/top-picks";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AffiliateLink } from "@/components/affiliate-link";
import { Cover } from "@/components/cover";
import { ArrowIcon, MailIcon, PlayIcon } from "@/components/icons";
import { StoryCard } from "@/components/story-card";
import { TimeAgo } from "@/components/time-ago";
import { addSubscriber } from "@/lib/api";
import { isEmail, safeHttpUrl } from "@/lib/format";
import { affiliateById, categoryById, usePublicData } from "@/lib/use-public";
import type { Post } from "@/lib/types";

function bySlug(posts: Post[], slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function HomePage() {
  const data = usePublicData();
  const cat = (post?: Post) => (post ? categoryById(data.categories, post.categoryId) : undefined);
  const featured = data.posts.filter((post) => post.featured);
  const quick = data.posts.filter((post) => !post.featured).slice(0, 4);
  const lead = bySlug(data.posts, "how-we-test-wallets") ?? data.posts[0];
  const small = ["notion-ai-alternatives", "annual-plans-worth-it", "self-custody-first-week", "issue-trackers-six-person-team"]
    .map((slug) => bySlug(data.posts, slug))
    .filter((post): post is Post => Boolean(post));
  const stories = data.posts.slice(0, 5);
  const tests = data.posts.filter((post) => post.isTest);
  const mainTest = tests[0];
  const sideTests = tests.slice(1, 4);

  return (
    <div className="space-y-8">
      <section aria-label="Latest stories">
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {quick.map((post) => (
            <StoryCard key={post.id} post={post} category={cat(post)} size="mini" />
          ))}
        </div>
      </section>

      <section className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.85fr)]">
        <HeroGlass posts={featured.length ? featured : data.posts.slice(0, 3)} categoryName={(post) => cat(post)?.name ?? "Story"} />
        <TopPicksGlass />
      </section>

      <section aria-labelledby="dont-miss">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-accent" aria-hidden="true" />
          <h2 id="dont-miss" className="text-xl font-extrabold tracking-tight">
            Don't Miss
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_18rem]">
          <div>{lead ? <StoryCard post={lead} category={cat(lead)} size="large" /> : null}</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {small.map((post) => (
              <StoryCard key={post.id} post={post} category={cat(post)} />
            ))}
          </div>
          <aside className="glass rounded-[1.75rem] p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-extrabold">Top Stories</h3>
              <Link to="/search" search={{ q: "" }} className="text-sm font-semibold text-accent">
                View all
              </Link>
            </div>
            <ol>
              {stories.map((post, index) => (
                <li key={post.id} className="flex items-center gap-3 border-b border-line py-3 last:border-b-0">
                  <span className="w-6 text-2xl font-black tabular-nums text-ink/25">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <Link to="/post/$slug" params={{ slug: post.slug }} className="line-clamp-2 text-sm font-semibold hover:text-accent">
                      {post.title}
                    </Link>
                    <p className="mt-1 text-xs text-ink/55">
                      <TimeAgo iso={post.publishedAt} />
                    </p>
                  </div>
                  <Cover category={cat(post)} title={post.title} url={post.coverUrl} className="size-14 shrink-0 rounded-lg" />
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section aria-labelledby="latest-tests">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-accent" aria-hidden="true" />
            <h2 id="latest-tests" className="text-xl font-extrabold tracking-tight">
              Latest Tests
            </h2>
          </div>
          <Link to="/category/$slug" params={{ slug: "reviews" }} className="text-sm font-semibold text-accent">
            View all
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {mainTest ? <TestCard post={mainTest} large categoryName={cat(mainTest)?.name} /> : null}
          <div className="grid gap-3">
            {sideTests.map((post) => (
              <TestCard key={post.id} post={post} categoryName={cat(post)?.name} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

function Hero({ posts, categoryName }: { posts: Post[]; categoryName: (post: Post) => string }) {
  const [index, setIndex] = useState(0);
  const post = posts[index] ?? posts[0];

  useEffect(() => {
    if (posts.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % posts.length), 7000);
    return () => window.clearInterval(timer);
  }, [posts.length]);

  if (!post) {
    return (
      <div className="flex min-h-80 items-end rounded-3xl bg-ink p-6 text-paper">
        <p>Stories will show up here after an editor publishes one.</p>
      </div>
    );
  }

  return (
    <article className="relative min-h-[26rem] overflow-hidden rounded-3xl bg-ink text-paper shadow-sm">
      <div className="absolute inset-0">
        <Cover
          title={post.title}
          url={post.coverUrl}
          category={{ id: "", slug: categorySlug(categoryName(post)), name: categoryName(post), description: "" }}
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
      <div className="relative flex h-full min-h-[26rem] flex-col justify-end p-5 sm:p-8">
        <p className="w-fit rounded-md bg-accent px-2 py-1 text-xs font-bold uppercase tracking-wide">{categoryName(post)}</p>
        <h1 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          <Link to="/post/$slug" params={{ slug: post.slug }} className="hover:underline">
            {post.title}
          </Link>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-paper/80 sm:text-base">{post.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link
            to="/post/$slug"
            params={{ slug: post.slug }}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-4 text-sm font-semibold text-ink"
          >
            Read Full Story
            <ArrowIcon className="size-4" />
          </Link>
          <div className="flex items-center gap-2" role="tablist" aria-label="Featured stories">
            {posts.map((item, dot) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={dot === index}
                aria-label={`Show featured story ${dot + 1}: ${item.title}`}
                className={`h-2.5 rounded-full ${dot === index ? "w-6 bg-paper" : "w-2.5 bg-paper/45"}`}
                onClick={() => setIndex(dot)}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function categorySlug(name: string): string {
  const map: Record<string, string> = {
    Crypto: "crypto",
    "AI Tools": "ai-tools",
    SaaS: "saas",
    Reviews: "reviews",
    Comparisons: "comparisons",
    Guides: "guides",
    Deals: "deals",
  };
  return map[name] ?? "guides";
}

function TopPicks() {
  const data = usePublicData();
  const tools = data.tools.slice(0, 5);

  return (
    <aside className="flex flex-col rounded-3xl bg-ink p-4 text-paper shadow-sm sm:p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Top Picks</h2>
        <Link to="/category/$slug" params={{ slug: "reviews" }} className="text-sm font-semibold text-paper/70 hover:text-paper">
          View all
        </Link>
      </div>
      <ol className="flex-1">
        {tools.map((tool) => {
          const affiliate = affiliateById(data.affiliates, tool.affiliateId);
          return (
            <li key={tool.id} className="flex items-center gap-3 border-b border-paper/10 py-3 last:border-b-0">
              <span className="w-5 text-sm font-bold tabular-nums text-paper/45">{tool.rank}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{tool.name}</p>
                <p className="truncate text-xs text-paper/60">
                  {tool.category} · <span className="tabular-nums">{tool.rating.toFixed(1)}</span>
                </p>
              </div>
              {affiliate ? (
                <AffiliateLink
                  affiliate={affiliate}
                  className="inline-flex h-9 items-center rounded-full bg-paper/10 px-3 text-xs font-semibold hover:bg-paper/20"
                >
                  Visit
                </AffiliateLink>
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="pt-3 text-xs text-paper/50">Contains affiliate links</p>
    </aside>
  );
}

function TestCard({ post, large = false, categoryName }: { post: Post; large?: boolean; categoryName?: string }) {
  const href = safeHttpUrl(post.youtubeUrl);
  return (
    <article className={`overflow-hidden rounded-2xl border border-line bg-paper shadow-sm ${large ? "" : "sm:grid sm:grid-cols-[9rem_minmax(0,1fr)]"}`}>
      <div className={`relative ${large ? "aspect-video" : "aspect-video sm:aspect-auto sm:min-h-24"}`}>
        <Cover
          title={post.title}
          url={post.coverUrl}
          category={{ id: "", slug: categorySlug(categoryName ?? "Reviews"), name: categoryName ?? "", description: "" }}
          className="h-full w-full"
        />
        <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-0.5 text-xs font-bold uppercase text-paper">
          Test
        </span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Play placeholder video for ${post.title}`}
            className="absolute inset-0 flex items-center justify-center text-paper"
          >
            <PlayIcon className="size-12 drop-shadow" />
          </a>
        ) : null}
        {post.duration ? (
          <span className="absolute bottom-2 right-2 rounded bg-ink/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-paper">
            {post.duration}
          </span>
        ) : null}
      </div>
      <div className="p-3">
        <h3 className={`font-bold leading-snug ${large ? "text-lg" : "text-sm"}`}>
          <Link to="/post/$slug" params={{ slug: post.slug }} className="hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-ink/55">
          <TimeAgo iso={post.publishedAt} />
          {href ? " · YouTube placeholder" : ""}
        </p>
      </div>
    </article>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <section id="newsletter" className="rounded-3xl bg-mist px-4 py-5 sm:px-6" aria-labelledby="newsletter-title">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3 lg:max-w-sm">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-paper text-accent shadow-sm">
            <MailIcon className="size-6" />
          </span>
          <div>
            <h2 id="newsletter-title" className="text-lg font-extrabold">
              Stay updated
            </h2>
            <p className="mt-1 text-sm text-ink/70">Tests, comparisons, and the occasional deal. No coin launches.</p>
          </div>
        </div>
        <form
          className="flex flex-1 flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            setMessage("");
            if (!isEmail(email)) {
              setError("Enter a valid email.");
              return;
            }
            addSubscriber(email)
              .then(() => {
                setMessage("You're on the list. This demo stores the address in this browser.");
                setEmail("");
              })
              .catch((reason: unknown) => {
                setError(reason instanceof Error ? reason.message : "Could not save that email.");
              });
          }}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="h-12 flex-1 rounded-full border border-line bg-paper px-4 text-sm outline-none"
          />
          <button type="submit" className="h-12 rounded-full bg-accent px-5 text-sm font-semibold text-paper hover:bg-accent/90">
            Subscribe
          </button>
        </form>
      </div>
      {message ? (
        <p className="mt-3 text-sm text-ink" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
