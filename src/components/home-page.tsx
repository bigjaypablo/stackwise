import { HeroGlass } from "@/components/hero-glass";
import { Newsletter } from "@/components/newsletter";
import { SectionHeading } from "@/components/section-heading";
import { StoryCard } from "@/components/story-card";
import { TestCard } from "@/components/test-card";
import { TopPicksGlass } from "@/components/top-picks";
import { TopStories } from "@/components/top-stories";
import { categoryById, usePublicData } from "@/lib/use-public";
import type { Post } from "@/lib/types";

export function HomePage() {
  const data = usePublicData();
  const cat = (post?: Post) => (post ? categoryById(data.categories, post.categoryId) : undefined);

  const posts = [...data.posts].sort((a, b) =>
    (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt),
  );

  if (posts.length === 0) {
    return (
      <div className="space-y-8">
        <section className="glass rounded-[1.75rem] px-6 py-12 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Coming soon</p>
          <h1 className="mx-auto mt-2 max-w-xl text-3xl font-extrabold tracking-tight">
            The first Stackwise research is on the way
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-ink/70">
            Plain-English research on crypto, AI and SaaS tools. Subscribe below and the first posts will land in your inbox.
          </p>
        </section>
        <Newsletter />
      </div>
    );
  }

  const featured = posts.filter((post) => post.featured);
  const heroPosts = (featured.length ? featured : posts).slice(0, 4);
  const heroIds = new Set(heroPosts.map((post) => post.id));
  const rest = posts.filter((post) => !heroIds.has(post.id));
  const quick = posts.filter((post) => post.id !== heroPosts[0]?.id).slice(0, 4);
  const [lead, ...others] = rest;
  const small = others.slice(0, 4);
  const richLayout = rest.length >= 5;
  const tests = posts.filter((post) => post.isTest);
  const [mainTest, ...moreTests] = tests;
  const sideTests = moreTests.slice(0, 3);
  const hasTools = data.tools.length > 0;

  return (
    <div className="space-y-8">
      {quick.length >= 3 ? (
        <section aria-label="Latest stories">
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {quick.map((post) => (
              <StoryCard key={post.id} post={post} category={cat(post)} size="mini" />
            ))}
          </div>
        </section>
      ) : null}

      <section
        className={`grid items-stretch gap-4 ${hasTools ? "lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.85fr)]" : ""}`}
      >
        <HeroGlass posts={heroPosts} categoryName={(post) => cat(post)?.name ?? "Story"} />
        {hasTools ? <TopPicksGlass /> : null}
      </section>

      {richLayout && lead ? (
        <section aria-labelledby="dont-miss">
          <SectionHeading id="dont-miss" title="Don't Miss" />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_18rem]">
            <div className="[&>article]:h-full">
              <StoryCard post={lead} category={cat(lead)} size="large" className="lg:aspect-auto lg:min-h-[26rem]" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-rows-2">
              {small.map((post) => (
                <StoryCard key={post.id} post={post} category={cat(post)} className="lg:aspect-auto" />
              ))}
            </div>
            <TopStories posts={posts.slice(0, 5)} />
          </div>
        </section>
      ) : rest.length > 0 ? (
        <section aria-labelledby="latest">
          <SectionHeading id="latest" title="Latest" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <StoryCard key={post.id} post={post} category={cat(post)} />
            ))}
          </div>
        </section>
      ) : null}

      {mainTest ? (
        <section aria-labelledby="latest-research">
          <SectionHeading id="latest-research" title="Latest Research" viewAllSlug="reviews" />
          <div className={`grid gap-4 ${sideTests.length ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" : ""}`}>
            <TestCard post={mainTest} large categoryName={cat(mainTest)?.name} />
            {sideTests.length ? (
              <div className="grid gap-3 lg:grid-rows-3">
                {sideTests.map((post) => (
                  <TestCard key={post.id} post={post} categoryName={cat(post)?.name} />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <Newsletter />
    </div>
  );
}
