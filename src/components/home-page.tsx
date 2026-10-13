import { HeroGlass } from "@/components/hero-glass";
import { Newsletter } from "@/components/newsletter";
import { SectionHeading } from "@/components/section-heading";
import { StoryCard } from "@/components/story-card";
import { TestCard } from "@/components/test-card";
import { TopPicksGlass } from "@/components/top-picks";
import { TopStories } from "@/components/top-stories";
import { categoryById, usePublicData } from "@/lib/use-public";
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
  const small = [
    "notion-ai-alternatives",
    "annual-plans-worth-it",
    "self-custody-first-week",
    "issue-trackers-six-person-team",
  ]
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
        <HeroGlass
          posts={featured.length ? featured : data.posts.slice(0, 3)}
          categoryName={(post) => cat(post)?.name ?? "Story"}
        />
        <TopPicksGlass />
      </section>

      <section aria-labelledby="dont-miss">
        <SectionHeading id="dont-miss" title="Don't Miss" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_18rem]">
          <div className="[&>article]:h-full">
            {lead ? (
              <StoryCard
                post={lead}
                category={cat(lead)}
                size="large"
                className="lg:aspect-auto lg:min-h-[26rem]"
              />
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-rows-2">
            {small.map((post) => (
              <StoryCard key={post.id} post={post} category={cat(post)} className="lg:aspect-auto" />
            ))}
          </div>
          <TopStories posts={stories} />
        </div>
      </section>

      <section aria-labelledby="latest-tests">
        <SectionHeading id="latest-tests" title="Latest Tests" viewAllSlug="reviews" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {mainTest ? <TestCard post={mainTest} large categoryName={cat(mainTest)?.name} /> : null}
          <div className="grid gap-3 lg:grid-rows-3">
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
