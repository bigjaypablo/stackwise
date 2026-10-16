import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeading } from "@/components/page-heading";
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
      <PageHeading eyebrow="Section" title={category.name} description={category.description} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <StoryCard key={post.id} post={post} category={category} />
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
      <PageHeading title="Search" />
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
          className="field h-12 flex-1 rounded-full px-5"
        />
        <button type="submit" className="pill-accent h-12">
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

export function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-accent">404</p>
      <h1 className="mt-2 text-3xl font-extrabold">That page is not on the stack</h1>
      <p className="mt-3 text-ink/70">The link may be old, or the story is still a draft.</p>
      <Link to="/" className="pill-accent mt-6">
        Go home
      </Link>
    </div>
  );
}

export { AboutPage, ContactPage, DisclosurePage, PrivacyPage } from "@/components/static-pages";
