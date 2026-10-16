import { FollowBar } from "@/components/follow-bar";
import { AuthorCard } from "@/components/author-card";
import { ShareVerdict } from "@/components/share-verdict";
import { CommentSection } from "@/components/comment-section";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cover } from "@/components/cover";
import { MarkdownBody } from "@/components/markdown-body";
import { OurPick } from "@/components/our-pick";
import { SectionHeading } from "@/components/section-heading";
import { StoryCard } from "@/components/story-card";
import { ResearchBadge } from "@/components/research-mark";
import { TimeAgo } from "@/components/time-ago";
import { getPostBySlug } from "@/lib/api";
import { articleJsonLd, jsonLdScript } from "@/lib/seo";
import { affiliateById, categoryById, usePublicData } from "@/lib/use-public";
import { findSeedPost } from "@/lib/seed";
import type { Post } from "@/lib/types";

export function PostPage({ slug }: { slug: string }) {
  const data = usePublicData();
  const seeded = findSeedPost(slug) ?? null;
  const [post, setPost] = useState<Post | null>(seeded);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancel = false;
    getPostBySlug(slug)
      .then((next) => {
        if (cancel) return;
        setPost(next);
        setMissing(!next);
      })
      .catch(() => {
        if (!cancel) setMissing(true);
      });
    return () => {
      cancel = true;
    };
  }, [slug]);

  if (!post) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-extrabold">{missing ? "That story is not published" : "Loading story"}</h1>
        <p className="mt-3 text-ink/70">{missing ? "It may be a draft, or the link is old." : "One moment."}</p>
        <Link to="/" className="mt-6 inline-flex h-11 items-center font-semibold text-accent">
          Back home
        </Link>
      </div>
    );
  }

  const category = categoryById(data.categories, post.categoryId);
  const affiliate = affiliateById(data.affiliates, post.affiliateId);
  const related = data.posts.filter((item) => item.categoryId === post.categoryId && item.id !== post.id).slice(0, 3);
  const ld = articleJsonLd({
    title: post.title,
    description: post.summary,
    path: `/post/${post.slug}`,
    publishedAt: post.publishedAt || post.createdAt,
    updatedAt: post.updatedAt,
    authorName: post.authorName,
  });

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ld) }} />
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          {category?.name}
        </span>
        {post.isTest ? <ResearchBadge tone="light" /> : null}
      </div>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">{post.title}</h1>
      <p className="mt-4 text-sm text-ink/65">
        {post.authorName} · <TimeAgo iso={post.publishedAt || post.updatedAt} /> · {post.readMinutes} min read
      </p>
      <Cover
        title={post.title}
        url={post.coverUrl}
        category={category}
        className="mt-6 aspect-[16/8] w-full rounded-[1.75rem] border border-white/70 shadow-glass"
      />
      <div className="mt-6 max-w-3xl rounded-[1.75rem] border border-white bg-white/80 p-5 shadow-glass sm:p-8">
        <p className="text-lg text-ink/80">{post.summary}</p>
        <div className="mt-2">
          <MarkdownBody source={post.body} affiliates={data.affiliates} />
        </div>
      </div>
      <ShareVerdict title={post.title} summary={post.summary} slug={post.slug} isTest={Boolean(post.isTest)} />
      {affiliate ? <OurPick affiliate={affiliate} /> : null}
      <AuthorCard />
      <FollowBar />
      <CommentSection slug={post.slug} />
      {related.length ? (
        <section className="mt-10" aria-labelledby="related-heading">
          <SectionHeading id="related-heading" title="Related" />
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <StoryCard key={item.id} post={item} category={categoryById(data.categories, item.categoryId)} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
